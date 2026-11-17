
/* ==========================================================================
   Ek süslemeler
   1) Açılış: saat 23:52 → 00:00 ilerledikçe duvara bantlı fotoğraflar alttan yükselir
      (önce sadece üstleri görünür, 00:00'da çoğu görünür). Fotoğraflar content.js → introPhotos.
   2) Final sahnesi: flama (bayrak dizisi), süzülen balonlar, pastanın çevresinde parıltılar.
   ========================================================================== */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const C = window.CONTENT || {};
const FOTO = C.introPhotos && C.introPhotos.length ? C.introPhotos : Array.from({ length: 9 }, (_, i) => 'photos/photo0' + (i + 1) + '.jpg');

/* her fotoğraf: x = soldan %, w = genişlik (vw), rot = eğim, max = 00:00'daki yükselme (1 = tamamı), d = gecikme (0-1), tape = bant eğimi */
const YER = [
  { x: 1, w: 38, rot: -6, max: .92, d: 0, tape: -4 }, { x: 62, w: 38, rot: 5, max: .95, d: .05, tape: 3 },
  { x: 32, w: 30, rot: 2, max: .8, d: .15, tape: -2 }, { x: -4, w: 34, rot: -3, max: .7, d: .3, tape: 4 },
  { x: 24, w: 33, rot: 4, max: .64, d: .4, tape: -3 }, { x: 52, w: 34, rot: -4, max: .68, d: .35, tape: 2 },
  { x: 72, w: 34, rot: 6, max: .74, d: .5, tape: -4 }, { x: 14, w: 26, rot: 8, max: .88, d: .55, tape: 3 },
  { x: 47, w: 26, rot: -8, max: .9, d: .6, tape: -3 }
];

const intro = $('#intro'), clock = $('#clock');
if (intro && clock) {
  const box = document.createElement('div'); box.className = 'tapes'; box.setAttribute('aria-hidden', 'true');
  const tp = FOTO.slice(0, YER.length).map((src, i) => {
    const y = YER[i], el = document.createElement('div'), im = new Image();
    el.className = 'tp'; el.style.cssText = `left:${y.x}%;--w:${y.w}vw;--rot:${y.rot}deg;--tape:${y.tape}deg;z-index:${i % 3}`;
    im.alt = ''; im.decoding = 'async'; im.src = src; im.onerror = () => { im.removeAttribute('src'); }; /* dosya yoksa düz zemin kalır */
    el.append(im); box.append(el); return { el, y };
  });
  intro.prepend(box);
  /* açılış yazısı: harf harf, hafif bulanıklıktan netleşerek belirir */
  const it = intro.querySelector('.introtxt');
  if (it) {
    const txt = it.textContent; it.textContent = ''; it.setAttribute('aria-label', txt);
    [...txt].forEach((c, i) => { const sp = document.createElement('span'); sp.className = 'il'; sp.textContent = c === ' ' ? '\u00a0' : c; sp.style.setProperty('--i', i); sp.setAttribute('aria-hidden', 'true'); it.append(sp); });
  }
  const ring = $('#ring');
  let sonDk = '';
  const ilerle = () => { /* saatten ilerlemeyi oku: 23:52 = 0, 00:00 = 1 */
    const sp = clock.querySelectorAll('span'); if (sp.length < 2) return;
    const h = +sp[0].textContent, m = +sp[1].textContent, p = clamp(((h === 0 ? 24 : h) * 60 + m - 1432) / 8, 0, 1);
    tp.forEach(({ el, y }) => {
      const k = clamp((p - y.d) / (1 - y.d), 0, 1), e = k * k * (3 - 2 * k);
      el.style.setProperty('--r', (0.1 + (y.max - 0.1) * e).toFixed(3));
    });
    intro.style.setProperty('--ip', p.toFixed(3)); /* ışık, halka ve flare ilerlemesi */
    if (ring) ring.style.strokeDashoffset = (100 * (1 - p)).toFixed(2);
    const dk = sp[0].textContent + sp[1].textContent;
    if (dk !== sonDk) { sonDk = dk; intro.classList.remove('tick'); void intro.offsetWidth; intro.classList.add('tick'); } /* her dakikada lens flare nabzı */
    if (p >= 1) intro.classList.add('zeroed'); /* 00:00: beyaz-altın parlama */
  };
  new MutationObserver(ilerle).observe(clock, { childList: true, subtree: true });
  ilerle();
}

/* ---- final sahnesi ---- */
const ch6 = $('#ch6');
if (ch6) {
  const RENK = ['#ff7aa8', '#ffd63a', '#46a0ff', '#3cc86e', '#ff8028', '#f5f5ff'];
  const bayrak = () => { /* sarkık ip üzerinde üçgen bayraklar */
    const n = 14, y = t => 6 + 104 * t * (1 - t); let s = '';
    for (let i = 0; i < n; i++) {
      const t0 = i / n + .015, t1 = (i + 1) / n - .015, x0 = 400 * t0, x1 = 400 * t1;
      s += `<polygon points="${x0.toFixed(1)},${y(t0).toFixed(1)} ${x1.toFixed(1)},${y(t1).toFixed(1)} ${((x0 + x1) / 2).toFixed(1)},${((y(t0) + y(t1)) / 2 + 24).toFixed(1)}" fill="${RENK[i % RENK.length]}"/>`;
    }
    return `<svg class="flags" viewBox="0 0 400 84" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6Q200 58 400 6" fill="none" stroke="#cdbfa588"/>${s}</svg>`;
  };
  const deco = document.createElement('div'); deco.className = 'deco'; deco.setAttribute('aria-hidden', 'true');
  deco.innerHTML = bayrak() + bayrak();
  for (let i = 0; i < 7; i++) { /* balonlar: yavaşça yükselir */
    const b = document.createElement('i'); b.className = 'bl';
    b.style.cssText = `--x:${6 + i * 13.5}%;--s:${34 + (i * 7) % 22}px;--c:${RENK[i % RENK.length]};--t:${22 + (i * 5) % 14}s;--d:-${(i * 4.3).toFixed(1)}s`;
    deco.append(b);
  }
  ch6.prepend(deco);
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => deco.classList.toggle('on', e.isIntersecting))).observe(ch6);
  else deco.classList.add('on');

  const stage = $('#stage'); /* pastanın çevresinde yanıp sönen parıltılar */
  if (stage) for (let i = 0; i < 9; i++) {
    const s = document.createElement('span'); s.className = 'sp'; s.textContent = i % 2 ? '✦' : '✧'; s.setAttribute('aria-hidden', 'true');
    s.style.cssText = `left:${(i * 37 + 8) % 92}%;top:${(i * 53 + 6) % 70}%;animation-delay:${(i * .7).toFixed(1)}s`;
    stage.append(s);
  }
}
/* ---- ekran çerçevesi: vizör köşeleri, film ölçü çizgileri, bokeh katmanı, paralaks ---- */
{
  const vf = document.createElement('div'); vf.className = 'vf'; vf.setAttribute('aria-hidden', 'true');
  vf.innerHTML = '<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><span class="tk l"></span><span class="tk r"></span><b class="xh t"></b><b class="xh b"></b>';
  const bk = document.createElement('div'); bk.className = 'bokeh'; bk.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('i'), s = 40 + ((i * 37) % 90);
    b.style.cssText = `left:${(i * 29 + 5) % 96}%;top:${(i * 47 + 11) % 92}%;--s:${s}px;--k:${(0.4 + (i % 5) * 0.3).toFixed(1)};--t:${14 + (i * 3) % 10}s;--d:-${(i * 2.3).toFixed(1)}s`;
    bk.append(b);
  }
  document.body.append(bk, vf);
  const root = document.documentElement; let tick = 0, px = 0, py = 0;
  const upd = () => { tick = 0; root.style.setProperty('--sy', scrollY.toFixed(0)); root.style.setProperty('--px', px.toFixed(3)); root.style.setProperty('--py', py.toFixed(3)); };
  const iste = () => { if (!tick) tick = requestAnimationFrame(upd); };
  addEventListener('scroll', iste, { passive: true });
  addEventListener('pointermove', e => { px = (e.clientX / innerWidth - 0.5) * 2; py = (e.clientY / innerHeight - 0.5) * 2; iste(); }, { passive: true });
}
/* ---- mıknatıslı "Bu hikâyeyi başlat" düğmesi: imleç/parmak yaklaştıkça düğme ona doğru çekilir, ışık izler, dokununca dalga yayılır ---- */
{
  const st = $('#start'), ch1 = $('#ch1'), yakin = 150;
  if (st && ch1) {
    const reset = () => { st.style.setProperty('--mx', '0px'); st.style.setProperty('--my', '0px'); st.classList.remove('mag'); };
    addEventListener('pointermove', e => {
      if (ch1.hidden || st.disabled) return;
      const r = st.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy);
      if (d > yakin + r.width / 2) return reset();
      const k = 1 - Math.min(1, Math.max(0, (d - r.width / 2) / yakin));
      st.style.setProperty('--mx', (dx * 0.26 * k).toFixed(1) + 'px'); st.style.setProperty('--my', (dy * 0.34 * k).toFixed(1) + 'px');
      st.style.setProperty('--gx', clamp((e.clientX - r.left) / r.width * 100, 0, 100).toFixed(0) + '%'); st.style.setProperty('--gy', clamp((e.clientY - r.top) / r.height * 100, 0, 100).toFixed(0) + '%');
      st.classList.add('mag');
    }, { passive: true });
    addEventListener('pointerleave', reset); addEventListener('blur', reset);
    st.addEventListener('pointerdown', e => { /* dokunulan noktadan yayılan ışık dalgası */
      const r = st.getBoundingClientRect(), d = document.createElement('i'); d.className = 'rp';
      d.style.left = (e.clientX - r.left) + 'px'; d.style.top = (e.clientY - r.top) + 'px'; st.append(d); setTimeout(() => d.remove(), 900);
    });
  }
}
(window.__ok = window.__ok || []).push('extra');
})();
