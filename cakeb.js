/* ==========================================================================
   Pasta, 2. kısım: kareyi karakter ızgarasına çevirir (kontur, doku, ışık, konfeti, yazılar).
   1. kısım cakea.js (geometri, renkler), 3. kısım cakec.js (canvas'a çizim) içinde.
   Orijinal fikir ve kod: JIN2 (@jin_22ee), 2026. Kullanım: CAKE.create(...)
   ========================================================================== */
(() => {
'use strict';
const root = typeof window !== 'undefined' ? window : globalThis;
const { EDGE, HALO, TAU, BUILD, CHARS, AT, FILL, IS_OUTLINE, CRUMB, SPONGE, CRUST, CREAM, FROST, PLATE, GOLD, CORE, FLAME, GLOW, LIT_S, LIT_F,
  HAPPY, BDAY, DOTS, COLORS, clamp, smooth, pop, rng, EYE, F, FWD, RIGHT, UP, VIEW, CX, CZ, buildCake, flicker, outlineLetter } = root.__cakeA;

/* silüet karakterleri: yatay çizgiler "=" ile daha kalın görünür */
function silLetter(gx, gy) {
  const ax = Math.abs(gx), ay = Math.abs(gy);
  if (ax + ay === 0) return AT['+'];
  if (ax > 2 * ay) return AT['|'];
  if (ay > 2 * ax) return AT['='];
  return gx * gy > 0 ? AT['/'] : AT['\\'];
}

/* ---------- çekirdek: bir kareyi karakter ızgarasına çevirir ---------- */
function createCore(cols, rows, aspect, cellAsp, wordCov, sc) {
  const G = buildCake(sc), cells = cols * rows;
  const part = new Int8Array(cells), depth = new Float32Array(cells), lumA = new Float32Array(cells);
  const tagA = new Uint8Array(cells), charA = new Uint8Array(cells), body = new Uint8Array(cells);
  const silA = new Uint8Array(cells), edgA = new Uint8Array(cells), ringA = new Uint8Array(cells); /* silüet / kontur / dış halka işaretleri */
  const H = new Int32Array(cells);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) H[r * cols + c] = (r * 7919 + c * 104729) % 9973;

  /* alev noktaları (her karede aynı) */
  const FN = 900, FU = new Float32Array(FN), FVv = new Float32Array(FN), rf = rng(3);
  for (let i = 0; i < FN; i++) { FU[i] = -1 + 2 * rf(); FVv[i] = rf(); }

  /* konfeti parçaları */
  const rc = rng(11), conf = [];
  for (let i = 0; i < 110; i++) {
    conf.push({ x0: rc() * cols, speed: 4 + 5 * rc(), delay: 5 * rc(), amp: 1 + 3 * rc(), w: 1 + 1.5 * rc(), ph: TAU * rc(), col: DOTS[Math.floor(rc() * 6)] });
  }

  const KEY = (() => { const k = [-0.5, 0.8, 0.6], n = Math.hypot(...k); return k.map(v => v / n); })();
  const unit = v => { const n = Math.hypot(...v); return v.map(x => x / n); };
  const HK = unit(KEY.map((v, i) => v + VIEW[i]));
  const HR = unit([0.8, 0.3, -0.5].map((v, i) => v + VIEW[i]));
  const lit = [];

  function plot(x, y, z, shade, tag, k) {
    const rx = x - EYE[0], ry = y - EYE[1], rz = z - EYE[2];
    const cz = rx * FWD[0] + ry * FWD[1] + rz * FWD[2];
    if (cz <= 0.2) return;
    const sx = (0.5 + (rx * RIGHT[0] + ry * RIGHT[1] + rz * RIGHT[2]) / cz * F * 0.5) * cols;
    const sy = (0.5 - (rx * UP[0] + ry * UP[1] + rz * UP[2]) / cz * F * 0.5 * aspect) * rows;
    if (sx < 0 || sy < 0) return;
    const ix = sx | 0, iy = sy | 0;
    if (ix >= cols || iy >= rows) return;
    const q = iy * cols + ix;
    if (cz < depth[q]) { depth[q] = cz; part[q] = k; lumA[q] = shade; tagA[q] = tag; }
  }

  function rays(cy, cx, reach) { /* dört köşeli yıldız parıltısı */
    for (let d = 1; d <= reach; d++) {
      const fade = 1 - d / (reach + 1);
      for (const [dy, dx, ch] of [[0, 1, '-'], [0, -1, '-'], [1, 0, '|'], [-1, 0, '|']]) {
        const yy = cy + dy * d, xx = cx + dx * d * 2;
        if (yy >= 0 && yy < rows && xx >= 0 && xx < cols && lumA[yy * cols + xx] < fade) {
          const q = yy * cols + xx; charA[q] = AT[ch]; lumA[q] = fade; tagA[q] = CORE;
        }
      }
      if (d <= (reach >> 1)) {
        for (const [dy, dx, ch] of [[1, 1, '\\'], [-1, -1, '\\'], [1, -1, '/'], [-1, 1, '/']]) {
          const yy = cy + dy * d, xx = cx + dx * d;
          if (yy >= 0 && yy < rows && xx >= 0 && xx < cols && lumA[yy * cols + xx] < fade * 0.7) {
            const q = yy * cols + xx; charA[q] = AT[ch]; lumA[q] = fade * 0.7; tagA[q] = CORE;
          }
        }
      }
    }
    const q = cy * cols + cx; charA[q] = AT['*']; lumA[q] = 1;
  }

  function frame(t, ev) {
    const blowAt = ev && ev.blowAt !== undefined ? ev.blowAt : Infinity, t2h = (t * 3) | 0; /* halka karakterleri hafifçe titrer */
    const since = t - blowAt;                         /* üflemeden beri geçen süre (öncesinde eksi) */
    const out = since > 0 ? smooth(since / 0.35) : 0; /* mum söner */
    const turn = 0.95 + 0.08 * Math.sin(t * 0.5) + ((ev && ev.spin) || 0), co = Math.cos(turn), si = Math.sin(turn);
    const head = (t - 0.2) / (BUILD - 0.2) * 1.25;
    const on = smooth((t - 4.4) / 0.8) * (1 - out), grow = smooth((t - 4.3) / 0.7) * (1 - out), f = flicker(t);

    /* fitilin ucu ve ışığın yeri */
    const tx0 = CX - 1;
    const tip = [co * tx0 + si * CZ + 1, G.wickTop, -si * tx0 + co * CZ];
    const lx = tip[0] + 0.03 * Math.sin(t * 2.3), ly = tip[1] + 0.18, lz = tip[2] + 0.05;

    depth.fill(99); part.fill(-1); lumA.fill(0); tagA.fill(0);
    const { P, N, T, K, ORD, FLY, GRAIN } = G;
    for (let i = 0; i < G.n; i++) {
      const rev = smooth((head - ORD[i]) / 0.12);
      if (rev <= 0.01) continue;
      const i3 = 3 * i, bx = P[i3] - 1, bz = P[i3 + 2], fl = 1 - rev;
      const x = co * bx + si * bz + 1 + fl * FLY[i3], y = P[i3 + 1] + fl * FLY[i3 + 1], z = -si * bx + co * bz + fl * FLY[i3 + 2];
      const nx0 = N[i3], nz0 = N[i3 + 2], nx = co * nx0 + si * nz0, ny = N[i3 + 1], nz = -si * nx0 + co * nz0;

      const diff = clamp(nx * KEY[0] + ny * KEY[1] + nz * KEY[2], 0, 1);
      const hk = clamp(nx * HK[0] + ny * HK[1] + nz * HK[2], 0, 1), hr = clamp(nx * HR[0] + ny * HR[1] + nz * HR[2], 0, 1);
      const hk2 = hk * hk, hk4 = hk2 * hk2, hk8 = hk4 * hk4, hk16 = hk8 * hk8;
      const hr2 = hr * hr, hr4 = hr2 * hr2, hr8 = hr4 * hr4, hr16 = hr8 * hr8;
      const spec = hk16 * hk8 + 0.7 * hr16 * hr2;     /* ^24 ve ^18 */
      const nv = clamp(nx * VIEW[0] + ny * VIEW[1] + nz * VIEW[2], 0, 1), rim0 = 1 - nv, rim = rim0 * rim0 * rim0; /* kenara dönük yüzeyler parlar: silüet arka plandan ayrılır */

      let glow = 0;
      if (on > 0.001) { /* mumun sıcak ışığı sadece yakındakilere ulaşır */
        const dx = lx - x, dy = ly - y, dz = lz - z, dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
        glow = on * f * (0.3 + 0.7 * clamp((nx * dx + ny * dy + nz * dz) / dist, 0, 1)) * Math.exp(-((dist / 1.6) ** 2)) * 1.3;
      }
      const shade = (0.3 + 0.45 * diff + 0.12 * spec + 0.45 * glow + 0.34 * rim) * rev * GRAIN[i] * (K[i] === 0 ? 0.6 : 1);
      let tag = T[i];
      if (glow > 0.3) tag = (tag === SPONGE || tag === CRUST) ? LIT_S : tag === FROST ? LIT_F : tag;
      plot(x, y, z, shade, tag, K[i]);
    }

    /* alev */
    if (grow > 0) {
      const lean = 0.05 * Math.sin(t * 2.3) + 0.02 * Math.sin(t * 7), hgt = 0.6 * f * grow;
      for (let i = 0; i < FN; i++) {
        const u = FU[i], v = FVv[i], width = 0.15 * Math.sin(Math.PI * Math.pow(v, 0.75)) * (1 - 0.35 * v);
        const core = Math.abs(u) < 0.5 && v < 0.62;
        plot(tip[0] + u * width * grow + lean * v * v, tip[1] + (v - 0.12) * hgt, tip[2] + 0.05,
          (core ? 1 : 0.82) * (0.6 + 0.4 * grow), core ? CORE : FLAME, 6);
      }
    }

    /* kontur: boşluğa ya da daha gerideki parçaya komşu hücreler */
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const q = r * cols + c;
        if (part[q] < 0) { body[q] = 0; charA[q] = 0; lumA[q] = 0; silA[q] = 0; edgA[q] = 0; continue; }
        body[q] = 1; silA[q] = 0; edgA[q] = 0;
        const pc = part[q], pd = depth[q];
        let gx = 0, gy = 0, edge = false, sil = false; /* sil: boşlukla komşu = dış silüet */
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const rr = r + dy, cc = c + dx;
            let nb = -1, nz = 99;
            if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) { nb = part[rr * cols + cc]; nz = depth[rr * cols + cc]; }
            if (nb < 0 || (nb !== pc && nz > pd + 0.035)) { gx += dx; gy += dy; if (!dx || !dy) edge = true; if (nb < 0) sil = true; }
          }
        }
        const h = H[q], lum = lumA[q], level = clamp((lum * 3.2) | 0, 0, 3);
        if (edge) {
          charA[q] = sil ? silLetter(gx, gy) : outlineLetter(gx, gy); lumA[q] = 1; edgA[q] = 1; /* kontur karakterleri tam parlaklıkta; silüet daha kalın karakterlerle */
          if (sil) silA[q] = 1;
          const tg0 = tagA[q]; /* dış silüet (süngerin, kremanın kenarı) sıcak fildişi parlar; mum ve tabak kendi renginde kalır */
          if (sil && (tg0 === PLATE || tg0 === GOLD)) { /* tabak silüeti de belirsin ama pastadan ayrı kalsın */ }
          if (sil && (tg0 === SPONGE || tg0 === CRUST || tg0 === CREAM || tg0 === FROST || tg0 === LIT_S || tg0 === LIT_F)) tagA[q] = EDGE;
        }
        else { charA[q] = FILL[level][(h + ((t * 4 + h % 11) | 0)) % 12]; lumA[q] = clamp(lum, 0, 1); }
      }
    }

    /* kontur kontrastı: konturun hemen yanındaki dolgu hücreleri biraz koyulur (kenar öne çıkar) */
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const q = r * cols + c; if (!body[q] || edgA[q]) continue;
        if (edgA[q - 1] || edgA[q + 1] || edgA[q - cols] || edgA[q + cols]) lumA[q] *= 0.8;
      }
    }
    /* dış halka: silüetin hemen dışındaki boş hücrelerde ince amber ışıma (iki kat: yoğun + soluk) */
    ringA.fill(0);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const q = r * cols + c; if (body[q] || charA[q] !== 0) continue;
        const nb = (c > 0 && silA[q - 1]) || (c < cols - 1 && silA[q + 1]) || (r > 0 && silA[q - cols]) || (r < rows - 1 && silA[q + cols]);
        if (nb) ringA[q] = 1;
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const q = r * cols + c; if (body[q] || charA[q] !== 0) continue;
        if (ringA[q]) { charA[q] = AT[(H[q] + t2h) % 3 ? ':' : '.']; lumA[q] = 0.62; tagA[q] = HALO; continue; }
        const nb = (c > 0 && ringA[q - 1]) || (c < cols - 1 && ringA[q + 1]) || (r > 0 && ringA[q - cols]) || (r < rows - 1 && ringA[q + cols]);
        if (nb && H[q] % 2 === 0) { charA[q] = AT['.']; lumA[q] = 0.26; tagA[q] = HALO; }
      }
    }

    /* doku: süngerde kırıntı, kremada dalga */
    const t2 = (t * 2) | 0;
    for (let q = 0; q < cells; q++) {
      if (!body[q] || IS_OUTLINE[charA[q]]) continue;
      const h = H[q], tg = tagA[q];
      if (tg === SPONGE || tg === LIT_S) { charA[q] = CRUMB[(h + (h % 3 === 0 ? t2 : 0)) % 8]; lumA[q] *= 0.88; } /* sünger biraz geride */
      else if (tg === CRUST) { charA[q] = AT['=']; lumA[q] = Math.max(lumA[q], 0.8); } /* katman çizgileri net */
      else if (tg === CREAM) { charA[q] = AT['~']; lumA[q] = Math.max(lumA[q], 0.85); }
      else if (tg === FROST || tg === LIT_F) { charA[q] = h % 5 === 0 ? AT['^'] : AT['~']; lumA[q] = Math.max(lumA[q], 0.72); } /* krema öne çıkar */
      else if (tg === PLATE) charA[q] = h % 4 === 0 ? AT[':'] : AT['.'];
      else if (tg === GOLD) charA[q] = AT['='];
    }
    for (let q = 0; q < cells; q++) if (body[q] && tagA[q] === PLATE) lumA[q] *= 0.8;

    /* alevin çevresindeki ışık halesi */
    const lrx = lx - EYE[0], lry = ly - EYE[1], lrz = lz - EYE[2], lcz = lrx * FWD[0] + lry * FWD[1] + lrz * FWD[2];
    const cy = Math.trunc((0.5 - (lrx * UP[0] + lry * UP[1] + lrz * UP[2]) / lcz * F * 0.5 * aspect) * rows);
    const cx = Math.trunc((0.5 + (lrx * RIGHT[0] + lry * RIGHT[1] + lrz * RIGHT[2]) / lcz * F * 0.5) * cols);
    if (on > 0.001) {
      const rg = (6 + 1.5 * f) * on * (cols / 84), t9 = (t * 9) | 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const q = r * cols + c;
          if (charA[q] !== 0) continue;
          const fall = 1 - Math.hypot(r - cy, (c - cx) * cellAsp) / rg;
          if (fall > 0 && (H[q] + t9) % 3 !== 0) {
            charA[q] = fall < 0.4 ? AT['.'] : fall < 0.7 ? AT[':'] : AT['+'];
            lumA[q] = 0.6 * fall * on * f; tagA[q] = GLOW;
          }
        }
      }
    }
    const put = (y, x, ch, lm, tg, emptyOnly) => {
      if (y < 0 || y >= rows || x < 0 || x >= cols) return;
      const q = y * cols + x;
      if (emptyOnly && !(charA[q] === 0 || tagA[q] === GLOW)) return;
      charA[q] = ch; lumA[q] = lm; tagA[q] = tg;
    };

    /* alevden sürekli yükselen küçük kıvılcımlar */
    if (on > 0.5) {
      for (let i = 0; i < 7; i++) {
        const k = ((t * 0.6 + i * 0.37) % 1), sy = Math.trunc(cy - 1 - k * 9), sx = Math.trunc(cx + Math.sin(t * 2 + i * 2.1) * (0.8 + k * 3));
        if (sy >= 0 && sy < rows && sx >= 0 && sx < cols && charA[sy * cols + sx] === 0) put(sy, sx, AT[i % 2 ? '*' : '.'], (1 - k) * 0.9 * on, i % 3 ? FLAME : CORE, false);
      }
    }
    /* mum yanarken kıvılcımlar */
    if (t > 4.3 && t < 5.4) {
      const k = (t - 4.3) / 1.1;
      for (let i = 0; i < 14; i++) {
        const a = i * 2.4 + k * 3;
        const sy = Math.trunc(cy + 2 - k * 7 * (0.6 + 0.4 * (i % 3)) + Math.sin(a) * 2), sx = Math.trunc(cx + Math.cos(a) * (2 + k * 9));
        if (sy >= 0 && sy < rows && sx >= 0 && sx < cols && charA[sy * cols + sx] === 0) put(sy, sx, AT[i % 2 ? '*' : '+'], 1 - k, CORE, false);
      }
    }
    /* mum sönünce yükselen duman */
    if (since > 0 && since < 1.5) {
      const k = since / 1.5;
      for (let i = 0; i < 9; i++) {
        const sy = Math.trunc(cy + 1 - k * (5 + (i % 3) * 2) - (i % 2)), sx = Math.trunc(cx + Math.sin(i * 1.7 + k * 4) * (1 + k * 3));
        if (sy >= 0 && sy < rows && sx >= 0 && sx < cols && charA[sy * cols + sx] === 0) put(sy, sx, AT[i % 3 === 0 ? '~' : i % 3 === 1 ? ':' : '.'], 0.55 * (1 - k), GLOW, false);
      }
    }

    /* konfeti (üflemeden sonra) */
    if (since > 0.3) {
      for (let ci = 0; ci < conf.length; ci++) {
        const p = conf[ci], age = since - 0.3 - p.delay;
        if (age < 0) continue;
        const y = Math.floor((age * p.speed) % (rows + 4)) - 2, x = Math.floor(p.x0 + p.amp * Math.sin(p.w * t + p.ph));
        const spin = '-/|\\'[Math.floor(t * p.w * 3 + p.ph) & 3];
        put(y, x, AT[ci % 7 ? spin : 'o'], 0.85, p.col, true);
      }
    }

    /* yazılar */
    const words = [['HAPPY', 1.0, 0.075, HAPPY], ['BIRTHDAY', 1.55, 0.185, BDAY]];
    for (const [text, ts, row, tg] of words) {
      const p = clamp((since - ts) / 0.5, 0, 1);
      if (p <= 0) continue;
      const cov = wordCov(text, 1.55 - 0.55 * pop(p), rows * row), reveal = smooth(p * 1.6), t4 = (t * 4) | 0;
      const cv = (r, c) => (r < 0 || r >= rows || c < 0 || c >= cols ? 0 : cov[r * cols + c]);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const q = r * cols + c;
          if (!(cov[q] > 0.45) || !((H[q] % 997) / 997 < reveal)) continue;
          const l = cv(r, c - 1), rt = cv(r, c + 1), u = cv(r - 1, c), d = cv(r + 1, c);
          const edge = l < 0.45 || rt < 0.45 || u < 0.45 || d < 0.45;
          charA[q] = edge ? outlineLetter(-(rt - l) * 10, -(d - u) * 10) : FILL[3][(H[q] + t4 + H[q] % 11) % 12];
          lumA[q] = clamp((0.8 + 0.2 * Math.sin(t * 3 - c * 0.12)) * (1 + 0.5 * (1 - p)), 0, 1);
          tagA[q] = tg;
        }
      }
    }
    /* HAPPY harflerinde yanıp sönen parıltılar */
    if (since > 2.6) {
      lit.length = 0;
      for (let q = 0; q < cells; q++) if (tagA[q] === HAPPY) lit.push(q);
      for (let n = 0; n < 2 && lit.length; n++) {
        const q = lit[(Math.floor(t * 1.3 + n * 0.5) * 7919 + n * 104729) % lit.length];
        rays(Math.floor(q / cols), q % cols, Math.floor(2 + 4 * Math.sin(((t * 1.3 + n * 0.5) % 1) * Math.PI)));
      }
    }
    return { char: charA, lum: lumA, tag: tagA };
  }
  return { frame };
}

root.__cakeB = { createCore };
(root.__ok = root.__ok || []).push('cakeb');
})();
