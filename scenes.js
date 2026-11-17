/* Yeni sahneler: Zaman Tüneli · Hepsi Birden (hızlı kurgu) · Jenerik
   Fotoğraf havuzu: photolist.js içindeki window.ALLPHOTOS (yüzlerce kare). Yoksa content.js'teki kareler kullanılır. */
(() => {
'use strict';
const A = window.__app, sahne = window.__sahne;
if (!A || !sahne) { console.error('scenes.js: app.js yüklenmeden çalıştı'); return; }
const { C, $, make, vib, isik, reduced, photo } = A, IT = C.intertitles || {};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), pad3 = n => String(n).padStart(3, '0');
const goster = (btn, ms) => setTimeout(() => { btn.hidden = false; btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, ms);

/* ---------- Fotoğraf havuzu: karışık desteden çekilir; deste bitmeden aynı kare tekrar gelmez ---------- */
/* Gerçek havuz: photolist.js (window.ALLPHOTOS). Henüz yoksa mevcut kareler (photo01–17) tekrarlanarak 120 karelik
   geçici bir havuz oluşturulur; yüzlerce gerçek fotoğraf eklenince kendiliğinden gerçek sayıya geçer. */
const GECICI = 120;
const POOL = (() => {
  if (window.ALLPHOTOS && window.ALLPHOTOS.length) return [...new Set(window.ALLPHOTOS)];
  const mevcut = [...new Set([].concat(C.reel || [], C.montage || [], C.gallery || [], C.memories || []).map(p => p.src))];
  return mevcut.length ? Array.from({ length: GECICI }, (_, i) => mevcut[i % mevcut.length]) : [];
})();
let deste = [], sonVerilen = '';
function sonraki() {
  if (!deste.length) { deste = POOL.slice(); for (let i = deste.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deste[i], deste[j]] = [deste[j], deste[i]]; } }
  let src = deste.pop(); if (src === sonVerilen && deste.length) { const t = deste.pop(); deste.push(src); src = t; } /* art arda aynı kare gelmesin */
  return (sonVerilen = src);
}
const yeniFoto = src => { const im = photo({ src, caption: '' }, ''); im.loading = 'eager'; return im; };

const b46 = $('#ch46'), b47 = $('#ch47'), b48 = $('#ch48'), b5 = $('#ch5'), b6 = $('#ch6'), b7 = $('#ch7');
if (!b47 || !b48 || !b7 || !POOL.length) { console.error('scenes.js: sahne öğeleri ya da fotoğraf havuzu eksik'); return; }

/* Akış: karanlık oda → tünel → hepsi birden → mektup … final → jenerik */
const to5m = $('#to5m'), to48 = $('#to48'), to5x = $('#to5x');
to5m.onclick = () => { to5m.disabled = true; sahne([b46], [b47], $('#ch47 h2'), kurTunel, IT.c47); };
to48.onclick = () => { to48.disabled = true; sahne([b47], [b48], $('#ch48 h2'), kurKurgu, IT.c48); };
to5x.onclick = () => { to5x.disabled = true; sahne([b48], [b5], $('#envelope'), null, IT.c5); };

/* =====================================================================
   SAHNE 1 — ZAMAN TÜNELİ: fotoğraflar helisel bir koridorda üzerinize akar.
   Parmakla yönlendir · basılı tut: hızlan.
   ===================================================================== */
let tKurulu = false;
function kurTunel() {
  if (tKurulu) return; tKurulu = true;
  const box = $('#tunnel'), sc = $('#tscene'), cnt = $('#tcount');
  const N = innerWidth < 600 ? 14 : 20, STEP = 250, DEPTH = N * STEP, W = box.clientWidth || 360;
  const planes = [];
  let gecen = 0, hiz = 0, hedef = reduced ? 160 : 380, px = 0, py = 0, spx = 0, spy = 0, son = 0;
  const yerles = (p, kare) => { /* her tur farklı açı ve yarıçap: düzenli bir halka değil, serbest bir sarmal */
    const a = p.k * 2.399963 + Math.sin(p.k * 0.7) * 0.6, R = W * (0.27 + 0.2 * Math.abs(Math.sin(p.k * 1.31)));
    p.x = Math.cos(a) * R; p.y = Math.sin(a) * R * 0.78;
    p.ry = -(p.x / R) * 26; p.rx = (p.y / R) * 16; p.rz = ((p.k * 37) % 13 - 6);
    p.el.style.setProperty('--w', (W * (0.27 + ((p.k * 17) % 7) / 60)).toFixed(0) + 'px');
    p.el.replaceChildren(yeniFoto(sonraki()));
  };
  for (let i = 0; i < N; i++) {
    const el = make('div', 'tpl'); sc.append(el);
    const p = { el, k: i, z: -i * STEP + 160 }; planes.push(p); yerles(p);
  }
  const ciz = p => {
    const uzak = clamp((DEPTH + p.z) / (DEPTH * 0.42), 0, 1), yakin = p.z > 250 ? clamp((420 - p.z) / 170, 0, 1) : 1;
    p.el.style.opacity = (uzak * yakin).toFixed(3);
    p.el.style.transform = `translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,${p.z.toFixed(1)}px) translate(-50%,-50%) rotateY(${p.ry.toFixed(1)}deg) rotateX(${p.rx.toFixed(1)}deg) rotateZ(${p.rz}deg)`;
  };
  const dongu = ts => {
    requestAnimationFrame(dongu);
    if (b47.hidden || document.hidden) { son = 0; return; }
    const dt = son ? Math.min(ts - son, 50) / 1000 : 0; son = ts;
    hiz += (hedef - hiz) * Math.min(1, dt * 3); spx += (px - spx) * Math.min(1, dt * 5); spy += (py - spy) * Math.min(1, dt * 5);
    sc.style.transform = `rotateY(${(spx * 14).toFixed(2)}deg) rotateX(${(-spy * 9).toFixed(2)}deg)`;
    planes.forEach(p => {
      p.z += hiz * dt;
      if (p.z > 420) { p.z -= DEPTH; p.k += N; yerles(p); gecen++; }
      ciz(p);
    });
    cnt.textContent = pad3(gecen + N) + ' kare';
  };
  const yon = e => { const r = box.getBoundingClientRect(); px = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1); py = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1); };
  box.addEventListener('pointermove', yon);
  box.addEventListener('pointerdown', e => { yon(e); hedef = reduced ? 400 : 1250; box.classList.add('boost'); vib(10); isik(e.clientX, e.clientY, '#ffd27a'); });
  const birak = () => { hedef = reduced ? 160 : 380; box.classList.remove('boost'); px = py = 0; };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => box.addEventListener(n, birak));
  box.addEventListener('contextmenu', e => e.preventDefault());
  requestAnimationFrame(dongu);
  goster(to48, reduced ? 800 : 9000);
}

/* =====================================================================
   SAHNE 2 — HEPSİ BİRDEN: kareler hızlanır, patlar, sonra tek bir kareye ve rakama oturur.
   Hazır (yüklenmiş + çözülmüş) kareler kuyruğu sayesinde 60 ms'lik kesimlerde bile boşluk olmaz.
   ===================================================================== */
let kKurulu = false;
function kurKurgu() {
  if (kKurulu) return; kKurulu = true;
  const st = $('#kurgu'), la = $('#kla'), lb = $('#klb'), fl = $('#kflash'), cnt = $('#kcount'), go = $('#kgo'), big = $('#kbig'), small = $('#ksm');
  const hazir = []; let bekleyen = 0, hata = 0, ab = false, n = 0, sonSrc = '', calisiyor = false;
  const doldur = () => {
    while (hazir.length + bekleyen < 10 && hata < 40) {
      const src = sonraki(), im = new Image(); bekleyen++; im.decoding = 'async';
      im.onload = () => { bekleyen--; (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => { hazir.push(src); doldur(); }); };
      im.onerror = () => { bekleyen--; hata++; doldur(); };
      im.src = src;
    }
  };
  doldur();
  const url = s => `url("${s.replace(/"/g, '%22')}")`;
  function kes(bekle) {
    const src = hazir.shift() || sonSrc; if (!src) return;
    sonSrc = src; doldur(); ab = !ab; n++;
    const yeni = ab ? la : lb, eski = ab ? lb : la;
    yeni.style.backgroundImage = url(src); yeni.classList.remove('on'); void yeni.offsetWidth; yeni.classList.add('on');
    setTimeout(() => eski.classList.remove('on'), 60);
    st.className = 'kurgu g' + (n % 4) + (st.classList.contains('fin') ? ' fin' : '');
    fl.classList.remove('f'); void fl.offsetWidth; fl.classList.add('f');
    cnt.textContent = pad3(n); if (bekle > 220) vib(6, true);
  }
  function bitir() {
    const hedefSayi = POOL.length, t0 = performance.now(), sure = 1700;
    big.textContent = '0'; small.textContent = (C.flash && C.flash.line) || 'kare. Hepsi bir hikâye.';
    st.classList.add('fin'); vib([24, 70, 34]);
    const say = ts => { const k = clamp((ts - t0) / sure, 0, 1); big.textContent = String(Math.round(hedefSayi * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(say); };
    requestAnimationFrame(say);
    goster(to5x, reduced ? 800 : 3200);
  }
  go.onclick = () => {
    if (calisiyor) return; calisiyor = true; go.hidden = true; vib(14);
    const TOPLAM = reduced ? 2500 : 9200, ZIRVE = TOPLAM * 0.68, t0 = performance.now();
    const adim = () => {
      const t = performance.now() - t0; if (t >= TOPLAM) return bitir();
      const e = t < ZIRVE ? Math.pow(t / ZIRVE, 2.2) : 1 - ((t - ZIRVE) / (TOPLAM - ZIRVE)) * 0.8; /* hızlan → zirve → yavaşla */
      const bekle = 620 - 565 * e; kes(bekle); setTimeout(adim, bekle);
    };
    adim();
  };
}

/* =====================================================================
   SAHNE 3 — JENERİK: finaldeki "Jenerik" düğmesiyle açılır; metinler content.js → credits
   ===================================================================== */
const VARSAYILAN = [
  { big: C.title || 'A STORY WORTH REMEMBERING' },
  { role: 'Başrol', name: C.name || 'HIRA' }, { photo: true },
  { role: 'Yardımcı Oyuncu', name: 'Sıradan Günler' },
  { role: 'Görüntü Yönetmeni', name: 'Telefon Galerisi' }, { photo: true },
  { role: 'Senaryo', name: 'Hiçbir Plan Yapmadan' },
  { role: 'Müzik', name: 'Sting · Shape of My Heart' }, { photo: true },
  { role: 'Özel Teşekkür', name: 'Sana' },
  { role: 'Tarih', name: C.date || '' },
  { big: (C.finale && C.finale.line1) || 'İyi ki doğdun.' }
];
const closing = $('#closing');
if (closing && $('#again')) {
  const cb = make('button', 'btn', 'Jenerik'); cb.type = 'button'; cb.id = 'tocr';
  closing.insertBefore(cb, $('#again'));
  cb.onclick = () => { cb.disabled = true; sahne([b6], [b7], null, kurJenerik, IT.c7); };
}
let jKurulu = false;
function kurJenerik() {
  if (jKurulu) return; jKurulu = true;
  const wrap = $('#crwrap'), sc = $('#crscroll'), hint = $('#crhint'), son = $('#crend');
  let pi = 0;
  (C.credits && C.credits.length ? C.credits : VARSAYILAN).forEach(c => {
    if (c.photo) {
      const f = make('div', 'crp'); f.style.setProperty('--r', (pi % 2 ? 3.5 : -3.5) + 'deg'); f.style.setProperty('--tx', (pi % 2 ? '8%' : '-8%')); pi++;
      f.append(yeniFoto(sonraki())); sc.append(f);
    } else if (c.big) sc.append(make('p', 'crbig', c.big));
    else { const l = make('div', 'crl'); l.append(make('small', '', c.role || ''), make('b', '', c.name || '')); sc.append(l); }
  });
  let y = 0, hiz = 52, hedef = 52, ts0 = 0, bitti = false;
  const dongu = ts => {
    if (b7.hidden) return;
    const dt = ts0 ? Math.min(ts - ts0, 50) / 1000 : 0; ts0 = ts;
    hiz += (hedef - hiz) * Math.min(1, dt * 4); y += hiz * dt;
    const maxY = Math.max(0, sc.scrollHeight - innerHeight * 0.62);
    if (y >= maxY) { y = maxY; if (!bitti) { bitti = true; hint.classList.add('off'); setTimeout(() => { son.hidden = false; }, 900); } }
    sc.style.transform = `translate3d(0,${-y.toFixed(1)}px,0)`;
    if (!bitti) requestAnimationFrame(dongu);
  };
  wrap.addEventListener('pointerdown', () => { hedef = 170; hint.classList.add('off'); vib(8); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => wrap.addEventListener(n, () => { hedef = 52; }));
  wrap.addEventListener('contextmenu', e => e.preventDefault());
  son.onclick = () => location.reload();
  requestAnimationFrame(dongu);
}
(window.__ok = window.__ok || []).push('scenes');
})();
