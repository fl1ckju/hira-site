/* ==========================================================================
   Doğum günü pastası — ASCII karakterlerle çizilen 3 boyutlu pasta dilimi
   Orijinal fikir ve Python/pygame kodu: JIN2 (@jin_22ee), 2026
   (kişisel projelerde serbest kullanım, LICENSE.txt). Bu dosya o kodun
   tarayıcıya (JavaScript + canvas) uyarlanmış hâlidir; telefon için
   nokta sayısı ve ızgara küçültüldü, sıralama yerine z-buffer kullanıldı.

   Zaman çizelgesi (saniye, pasta ekrana girince başlar):
     0.2 – 3.4  pasta alttan yukarı kurulur
     4.3 – 5.1  mum yanar, kıvılcımlar çıkar         → onLit() çağrılır
     blow()     mum söner, konfeti yağar, HAPPY / BIRTHDAY belirir
   Kullanım: const k = CAKE.create(canvas, glowCanvas, { reduced, onLit, onError });
             k.setVisible(true|false);  k.blow();
   ========================================================================== */
(() => {
'use strict';
const root = typeof window !== 'undefined' ? window : globalThis;
const TAU = Math.PI * 2, BUILD = 3.4;

/* karakter havuzları: koyu → parlak */
const POOLS = ['1il!;:', 'rtfjcvxz=+', 'aeoun0{}[]<>', '08B$#&%Q'];
const CHARS = ' .,:~+*^01|/\\-_#()x' + POOLS.join('');
const AT = {}; [...CHARS].forEach((c, i) => { AT[c] = i; });
const FILL = POOLS.map(p => Array.from({ length: 12 }, (_, k) => AT[p[k % p.length]]));
const IS_OUTLINE = new Uint8Array(CHARS.length);
for (const c of '/|\\-_+') IS_OUTLINE[AT[c]] = 1;
const CRUMB = [...'o0ae.:o0'].map(c => AT[c]);

/* renk numaraları */
const SPONGE = 0, CRUST = 1, CREAM = 2, FROST = 3, RED = 4, RED_HI = 5, PLATE = 6, GOLD = 7, CORE = 8, FLAME = 9,
      GLOW = 10, WICK = 11, LIT_S = 12, LIT_F = 13, HAPPY = 14, BDAY = 15;
const DOTS = [16, 17, 18, 19, 20, 21], EDGE = 22, HALO = 23;
const COLORS = [
  [236, 160, 52], [150, 84, 36], [255, 250, 238], [255, 246, 232],
  [240, 50, 70], [255, 140, 150], [232, 222, 206], [228, 176, 84],
  [255, 250, 228], [255, 158, 52], [255, 184, 96], [90, 70, 60],
  [255, 184, 72], [255, 226, 168], [255, 212, 138], [255, 176, 204],
  [255, 96, 160], [70, 160, 255], [60, 200, 110], [255, 214, 50], [255, 128, 40], [245, 245, 255],
  [255, 246, 214] /* 22: EDGE — pastanın dış silüeti: daha parlak, neredeyse beyaz fildişi */,
  [255, 190, 104] /* 23: HALO — silüetin hemen dışındaki ince amber ışıma halkası */
];

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const pop = p => { const c1 = 1.70158, q = p - 1; return 1 + (c1 + 1) * q * q * q + c1 * q * q; };

/* tohumlu rastgele sayı üreteci (her açılışta aynı pasta) */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = rd => Math.sqrt(-2 * Math.log(1 - rd())) * Math.cos(TAU * rd());

/* ---------- kamera ---------- */
const EYE = [1.0, 2.1, 4.9], TARGET = [1.0, 1.0, 0], F = 3.2; /* F büyüdükçe pasta kadrajda büyür (eskiden 2.9) */
const FWD = (() => { const d = TARGET.map((v, i) => v - EYE[i]), n = Math.hypot(...d); return d.map(v => v / n); })();
const RIGHT = (() => { const r = [-FWD[2], 0, FWD[0]], n = Math.hypot(...r); return r.map(v => v / n); })();
const UP = [RIGHT[1] * FWD[2] - RIGHT[2] * FWD[1], RIGHT[2] * FWD[0] - RIGHT[0] * FWD[2], RIGHT[0] * FWD[1] - RIGHT[1] * FWD[0]];
const VIEW = FWD.map(v => -v);

/* ---------- pasta dilimi: iki sünger katman, arada krema ---------- */
const R = 1.6, FT = 0.08, TOP = 0.98;
const A0 = -28 * Math.PI / 180, A1 = 30 * Math.PI / 180;
const CX = 0.62 * R, CZ = 0;                       /* mumun yeri */

function frosting(x, z) { /* üst yüzeyin yüksekliği: kenarda sıkma krema, mumun çevresinde kıvrım */
  const r = Math.hypot(x, z), a = Math.atan2(-z, x);
  const edge = 0.15 * Math.exp(-(((r - 1.3) / 0.26) ** 2)) * (0.55 + 0.45 * Math.sin(a * 22 - r * 14));
  const d = Math.hypot(x - CX, z - CZ);
  const swirl = 0.2 * Math.exp(-((d / 0.34) ** 2)) * (0.6 + 0.4 * Math.sin(Math.atan2(z, x - CX) * 3 + d * 30));
  return TOP + 0.04 + edge + swirl;
}

function buildCake(sc) { /* sc: nokta yoğunluğu (1 = orijinal) */
  const rd = rng(7), U = (a, b) => a + (b - a) * rd();
  const P = [], N = [], T = [], K = [];
  const add = (x, y, z, nx, ny, nz, t, k) => { P.push(x, y, z); N.push(nx, ny, nz); T.push(t); K.push(k); };

  /* kesik yüzler */
  for (const [a, side] of [[A0, 1], [A1, -1]]) {
    const ca = Math.cos(a), sa = Math.sin(a), n = Math.round(9000 * sc);
    for (let i = 0; i < n; i++) {
      const r = U(0, R + FT), y = U(0, TOP);
      const crust = y < 0.05 || (y > 0.37 && y < 0.42) || (y > 0.56 && y < 0.6) || (y > 0.9 && y < 0.95);
      const cream = y > 0.42 && y < 0.56, frost = y >= 0.95 || r > R;
      add(r * ca, y, -r * sa, side * sa, 0, side * ca, frost ? FROST : cream ? CREAM : crust ? CRUST : SPONGE, frost ? 3 : cream ? 2 : 1);
    }
  }
  /* dış yüzey */
  for (let i = 0, n = Math.round(9000 * sc); i < n; i++) {
    const a = U(A0, A1), y = U(0, TOP + 0.04), rad = R + FT + 0.025 * Math.sin(a * 40 + y * 9);
    add(rad * Math.cos(a), y, -rad * Math.sin(a), Math.cos(a), 0, -Math.sin(a), FROST, 3);
  }
  /* üst */
  for (let i = 0, n = Math.round(12000 * sc); i < n; i++) {
    const r = (R + FT) * Math.sqrt(rd()), a = U(A0, A1), x = r * Math.cos(a), z = -r * Math.sin(a), e = 0.01;
    const y = frosting(x, z), fx = -(frosting(x + e, z) - y) / e, fz = -(frosting(x, z + e) - y) / e, l = Math.hypot(fx, 1, fz);
    add(x, y, z, fx / l, 1 / l, fz / l, FROST, 3);
  }
  /* mum (burgulu çizgiler) ve fitil */
  const base = frosting(CX, CZ) - 0.05;
  for (let i = 0, n = Math.round(2500 * Math.min(1, sc * 1.5)); i < n; i++) {
    const a = U(0, TAU), y = U(0, 0.62), rx = Math.cos(a), rz = Math.sin(a);
    add(CX + 0.075 * rx, base + y, CZ + 0.075 * rz, rx, 0, rz, Math.sin(a + y * 16) > 0.45 ? RED_HI : RED, 4);
  }
  for (let j = 0; j < 30; j++) add(CX, base + 0.62 + 0.07 * j / 29, CZ, 0, 0, 1, WICK, 4);
  /* altın kenarlı tabak */
  for (let i = 0, n = Math.round(9000 * sc); i < n; i++) {
    const a = U(0, TAU), u = Math.sqrt(rd()), rim = 1.3 + 0.06 * Math.sin(a * 12), r = u * rim;
    add(1 + r * Math.cos(a), -0.02 + 0.06 * u ** 4, r * Math.sin(a), 0, 1, 0, u > 0.93 ? GOLD : PLATE, 0);
  }
  for (let i = 0, n = Math.round(3000 * sc); i < n; i++) {
    const a = U(0, TAU), y = U(-0.1, 0.04), rim = 1.3 + 0.06 * Math.sin(a * 12);
    add(1 + rim * Math.cos(a), y, rim * Math.sin(a), Math.cos(a), 0, Math.sin(a), GOLD, 0);
  }
  /* renkli şekerler: üstte ve tabakta */
  for (let i = 0; i < 110; i++) {
    let cx, cy, cz;
    if (i < 90) {
      const r = U(0.25, R), a = U(A0 + 0.05, A1 - 0.05);
      cx = r * Math.cos(a); cz = -r * Math.sin(a);
      if (Math.hypot(cx - CX, cz - CZ) < 0.12) continue;
      cy = frosting(cx, cz) + 0.02;
    } else {
      const a = U(1.2, 4.6), r = U(0.95, 1.2);
      cx = 1 + r * Math.cos(a); cy = 0; cz = r * Math.sin(a);
    }
    let dx = gauss(rd), dy = gauss(rd) * 0.3, dz = gauss(rd);
    const l = Math.hypot(dx, dy, dz) || 1; dx /= l; dy /= l; dz /= l;
    const col = DOTS[Math.floor(rd() * DOTS.length)];
    for (let j = 0; j < 10; j++) { const s = -0.06 + 0.12 * j / 9; add(cx + s * dx, cy + s * dy, cz + s * dz, 0, 1, 0, col, 5); }
  }

  /* kirazlar (saplı) ve kremanın üstüne serpilmiş altın pullar */
  for (const [r0, a0] of [[1.28, -0.38], [1.3, 0.4], [0.62, -0.5]]) {
    const kx = r0 * Math.cos(a0), kz = -r0 * Math.sin(a0), ky = frosting(kx, kz) + 0.07;
    for (let j = 0, m = Math.round(160 * Math.min(1, sc * 1.6)); j < m; j++) {
      const u = U(-1, 1), a2 = U(0, TAU), s = Math.sqrt(1 - u * u), nx = s * Math.cos(a2), nz = s * Math.sin(a2);
      add(kx + 0.1 * nx, ky + 0.1 * u, kz + 0.1 * nz, nx, u, nz, u > 0.45 && nx > 0 ? RED_HI : RED, 7);
    }
    for (let j = 0; j < 14; j++) { const q = j / 13; add(kx + 0.04 * q, ky + 0.1 + 0.13 * q, kz, 0, 1, 0, WICK, 7); }
  }
  for (let i = 0; i < 40; i++) {
    const r = U(0.3, R), a3 = U(A0 + 0.05, A1 - 0.05), x = r * Math.cos(a3), z = -r * Math.sin(a3);
    if (Math.hypot(x - CX, z - CZ) < 0.14) continue;
    for (let j = 0; j < 3; j++) add(x + 0.02 * j, frosting(x, z) + 0.03, z + 0.015 * j, 0, 1, 0, GOLD, 5);
  }

  const n = P.length / 3, ORD = new Float32Array(n), FLY = new Float32Array(n * 3), GRAIN = new Float32Array(n);
  const gr = rng(5);
  for (let i = 0; i < n; i++) {
    ORD[i] = (P[3 * i + 1] + 0.12) / 2.3 + U(0, 0.1); /* alttan yukarı kurulur */
    if (rd() < 1 / 30) { FLY[3 * i] = gauss(rd) * 2.2; FLY[3 * i + 1] = gauss(rd) * 2.2; FLY[3 * i + 2] = gauss(rd) * 2.2; }
    GRAIN[i] = T[i] === SPONGE || T[i] === CRUST ? 0.6 + 0.4 * gr() : 1;
  }
  return { n, P: Float32Array.from(P), N: Float32Array.from(N), T: Uint8Array.from(T), K: Uint8Array.from(K), ORD, FLY, GRAIN, wickTop: base + 0.69 };
}

const flicker = t => 0.82 + 0.1 * Math.sin(t * 13) + 0.06 * Math.sin(t * 29 + 1) + 0.04 * Math.sin(t * 47 + 2);

function outlineLetter(gx, gy) {
  const ax = Math.abs(gx), ay = Math.abs(gy);
  if (ax + ay === 0) return AT['+'];
  if (ax > 2 * ay) return AT['|'];
  if (ay > 2 * ax) return gy > 0 ? AT['_'] : AT['-'];
  return gx * gy > 0 ? AT['/'] : AT['\\'];
}

root.__cakeA = { EDGE, HALO, TAU, BUILD, POOLS, CHARS, AT, FILL, IS_OUTLINE, CRUMB, SPONGE, CRUST, CREAM, FROST, RED, RED_HI, PLATE, GOLD,
  CORE, FLAME, GLOW, WICK, LIT_S, LIT_F, HAPPY, BDAY, DOTS, COLORS, clamp, smooth, pop, rng, gauss, EYE, TARGET, F, FWD, RIGHT,
  UP, VIEW, R, FT, TOP, A0, A1, CX, CZ, frosting, buildCake, flicker, outlineLetter };
(root.__ok = root.__ok || []).push('cakea');
})();
