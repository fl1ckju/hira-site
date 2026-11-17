/* ==========================================================================
   Pasta, 3. kısım: canvas'a karakter çizer, parmakla çevirmeyi ve parlamayı yönetir.
   Kullanım: const k = CAKE.create(canvas, glowCanvas, { reduced, onLit, onError });
             k.setVisible(true|false);  k.blow();
   Orijinal fikir ve kod: JIN2 (@jin_22ee), 2026.
   ========================================================================== */
(() => {
'use strict';
const root = typeof window !== 'undefined' ? window : globalThis;
const { CHARS, COLORS, EDGE, HALO } = root.__cakeA;
const { createCore } = root.__cakeB;

/* ---------- görünüm: canvas'a karakter çizer ---------- */
function create(canvas, glowCanvas, opt) {
  opt = opt || {};
  const COLS = (root.innerWidth || 800) < 600 ? 60 : 90, LEVELS = 10, ASP = 0.95; /* ASP: tuvalin en/boy oranı (daha dik = pasta daha büyük) */
  const SC = COLS < 80 ? 0.36 : 0.5;                  /* küçük ekranda daha az nokta */
  const STYLE = [];
  for (let tg = 0; tg < COLORS.length; tg++) {
    for (let l = 0; l < LEVELS; l++) {
      const k = Math.min(1, (l + 0.6) / LEVELS);
      STYLE.push('rgb(' + COLORS[tg].map(v => Math.round(v * k)).join(',') + ')');
    }
  }
  const lists = Array.from({ length: STYLE.length }, () => []);
  let ctx = null, gctx = null, core = null, rows = 0, cw = 0, ch = 0, W = 0, Hh = 0, wordFn = null;
  let spin = 0, vel = 0, drag = false, px = 0; /* parmakla pastayı çevirme */
  let t = opt.reduced ? 5.5 : 0, blowAt = Infinity, visible = false, raf = 0, last = 0, lastDraw = 0, lit = false, dead = false;

  function makeWordFn() {
    const bw = 4, bh = 6, cv = document.createElement('canvas');
    cv.width = cols_() * bw; cv.height = rows * bh;
    const g = cv.getContext('2d', { willReadFrequently: true }), cache = new Map(), rr = rows, cc = cols_();
    const FONT = '"Arial Black","Segoe UI Black","Roboto","Helvetica Neue",Arial,sans-serif';
    let basePx = 0;
    return (text, scale, cyRow) => {
      const key = text + '|' + scale.toFixed(2);
      if (cache.has(key)) return cache.get(key);
      if (!basePx) { g.font = '900 100px ' + FONT; basePx = 100 * (0.74 * cv.width) / g.measureText('BIRTHDAY').width; }
      g.clearRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = '900 ' + Math.round(basePx * scale) + 'px ' + FONT;
      g.fillText(text, cv.width / 2, cyRow * bh);
      const d = g.getImageData(0, 0, cv.width, cv.height).data, cov = new Float32Array(rr * cc), W4 = cv.width;
      for (let r = 0; r < rr; r++) for (let c = 0; c < cc; c++) {
        let s = 0;
        for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) s += d[((r * bh + y) * W4 + c * bw + x) * 4 + 3];
        cov[r * cc + c] = s / (255 * bw * bh);
      }
      cache.set(key, cov);
      return cov;
    };
  }
  const cols_ = () => COLS;

  function layout() { /* ekran genişliğine göre ızgara ve çözünürlük */
    const css = (canvas.parentElement && canvas.parentElement.clientWidth) || canvas.clientWidth;
    if (!css) return false;
    const dpr = Math.min(root.devicePixelRatio || 1, 2);
    cw = Math.max(5, Math.round(css * dpr / COLS)); ch = Math.round(cw * 14 / 9);
    rows = Math.round(COLS * cw / (ASP * ch));
    W = COLS * cw; Hh = rows * ch;
    canvas.width = W; canvas.height = Hh;
    if (glowCanvas) { glowCanvas.width = Math.max(8, W >> 2); glowCanvas.height = Math.max(8, Hh >> 2); gctx = glowCanvas.getContext('2d'); }
    ctx = canvas.getContext('2d');
    wordFn = makeWordFn();
    core = createCore(COLS, rows, W / Hh, cw / ch, wordFn, SC);
    return true;
  }

  function draw() {
    const g = core.frame(t, { blowAt, spin });
    ctx.globalCompositeOperation = 'destination-out'; /* önceki kare yavaşça solar (iz bırakır) */
    ctx.fillStyle = 'rgba(0,0,0,.62)'; ctx.fillRect(0, 0, W, Hh);
    ctx.globalCompositeOperation = 'source-over';
    for (const l of lists) l.length = 0;
    const cells = COLS * rows;
    for (let q = 0; q < cells; q++) {
      if (!g.char[q]) continue;
      const lm = Math.min(1, g.lum[q] * 1.35); /* ekranda biraz daha parlak dursun */
      if (lm < 0.03) continue;
      const lv = Math.min(LEVELS - 1, Math.floor(lm * LEVELS));
      lists[g.tag[q] * LEVELS + lv].push(q);
    }
    ctx.font = Math.round(ch * 1.05) + 'px ui-monospace,Menlo,Consolas,"DejaVu Sans Mono","Courier New",monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let k = 0; k < lists.length; k++) {
      const l = lists[k]; if (!l.length) continue;
      ctx.fillStyle = STYLE[k];
      const tg = (k / LEVELS) | 0, kenar = tg === EDGE, hale = tg === HALO; /* silüet: güçlü ışıma + üç vuruşla kalın; halka: yumuşak amber ışıma */
      if (kenar) { ctx.shadowColor = 'rgba(255,222,160,.95)'; ctx.shadowBlur = Math.max(6, cw * 0.9); }
      else if (hale) { ctx.shadowColor = 'rgba(255,170,80,.6)'; ctx.shadowBlur = Math.max(4, cw * 0.6); }
      for (let i = 0; i < l.length; i++) {
        const q = l[i], ox = (q % COLS) * cw + cw / 2, oy = Math.floor(q / COLS) * ch + ch / 2;
        ctx.fillText(CHARS[g.char[q]], ox, oy);
        if (kenar) { ctx.fillText(CHARS[g.char[q]], ox + cw * 0.09, oy); ctx.fillText(CHARS[g.char[q]], ox, oy + ch * 0.04); }
      }
      if (kenar || hale) { ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; }
    }
    if (gctx) { gctx.clearRect(0, 0, glowCanvas.width, glowCanvas.height); gctx.drawImage(canvas, 0, 0, glowCanvas.width, glowCanvas.height); }
  }

  function loop(ts) {
    raf = 0; if (!visible || dead) return;
    raf = requestAnimationFrame(loop);
    if (ts - lastDraw < 30) return;                    /* en çok ~33 kare/sn: telefonu yormasın */
    const dt = Math.min((ts - (last || ts)) / 1000, 0.1); last = ts; lastDraw = ts;
    t += dt;
    if (!drag) { spin += vel; vel *= 0.93; } /* bırakınca yavaşça durur */
    try {
      if (!core && !layout()) return;
      draw();
      if (!lit && t > 5.3) { lit = true; opt.onLit && opt.onLit(); }
    } catch (err) { dead = true; console.error('Pasta çizilemedi:', err); opt.onError && opt.onError(err); }
  }

  let rz = 0;
  root.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (core) { try { layout(); } catch (_) { /* eski çözünürlükle devam */ } } }, 250); });

  /* yatay sürükle: pastayı çevir (dikey kaydırma sayfayı kaydırmaya devam eder) */
  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', e => { drag = true; px = e.clientX; vel = 0; if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!drag) return; vel = (e.clientX - px) * 0.012; spin += vel; px = e.clientX; });
  ['pointerup', 'pointercancel'].forEach(n => canvas.addEventListener(n, () => { drag = false; }));

  return {
    setVisible(v) { visible = v; if (v && !raf && !dead) { last = 0; raf = requestAnimationFrame(loop); } },
    blow() { if (blowAt === Infinity && t > 5) { blowAt = t; return true; } return false; },
    get lit() { return lit; }
  };
}

root.CAKE = { create };
(root.__ok = root.__ok || []).push('cakec');
})();
