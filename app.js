/* A Story Worth Remembering — davranış dosyası (içerik: content.js) */
(() => {
'use strict';
window.__SURUM = 14; /* sürüm işareti: ?debug modunda app.js'in çalıştığını gösterir */
const C = window.CONTENT;
if (!C) { document.body.textContent = 'content.js yüklenemedi.'; throw new Error('content.js eksik'); }
const FX = window.FX || { burst() {}, kutlama() {} }; /* fx.js yoksa efektler sessizce atlanır */
const $ = (s, r = document) => r.querySelector(s);
const make = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const pad = i => String(i + 1).padStart(2, '0');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Dokunsal geri bildirim (Vibration API): destekleyen telefonlarda hafif ve zarif titreşim.
   soft=true → genel düğme titreşimi; 60 ms içinde başka titreşim varsa atlanır.
   (iPhone/Safari bu API'yi desteklemez; orada sessizce hiçbir şey yapmaz) */
let sonVib = 0;
function vib(p, soft) {
  try {
    if (reduced || !navigator.vibrate) return;
    const n = Date.now(); if (soft && n - sonVib < 60) return; sonVib = n;
    navigator.vibrate(p);
  } catch (_) { /* titreşim desteklenmiyorsa sessizce geç */ }
}
/* Sitedeki her düğmeye dokununca çok hafif bir tık */
document.addEventListener('click', e => { if (e.target.closest && e.target.closest('button')) vib(8, true); }, true);
const kalp = () => vib([14, 90, 26]); /* kalp atışı gibi çift vuruş */
/* Dokunulan yerde kısa süre sızan sıcak ışık (organik ışık sızıntısı) */
function isik(x, y, c) {
  if (reduced) return;
  const d = make('div', 'lp'); d.style.cssText = `left:${x}px;top:${y}px;--c:${c || '#ffb86a'}`;
  document.body.append(d); setTimeout(() => d.remove(), 2300);
}
/* Dokunulan yerde yayılan ince altın halka */
function halka(e) {
  if (reduced) return;
  const d = make('div', 'halka'); d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px';
  document.body.append(d); setTimeout(() => d.remove(), 1200);
}
const IT = C.intertitles || {};
/* Sinematik perde: şeritler kapanır, ortada kısa bir film yazısı belirir, sahne değişir, perde açılır */
const PERDE_MS = reduced ? 400 : 2300, ORTA_MS = reduced ? 150 : 1100; /* perde 2,8 sn → 2,3 sn */
/* "Devam et" düğmesini ms sonra gösterir ve ekranın dışında kalırsa kaydırarak görünür yapar */
const goster = (btn, ms) => setTimeout(() => { btn.hidden = false; btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, ms);
let perdede = false;
function perde(yazi, degis) {
  if (perdede) return; perdede = true;
  const bars = $('.bars'), card = $('.bcard');
  if (card) card.textContent = yazi || '';
  bars.classList.add('go'); document.body.classList.add('sahnede'); vib([20, 80, 20]);
  setTimeout(() => { if (degis) degis(); vib([34, 120, 46]); }, ORTA_MS);
  setTimeout(() => { bars.classList.remove('go'); document.body.classList.remove('sahnede'); perdede = false; }, PERDE_MS);
}

/* Müzik: Sting — Shape of My Heart. Siteye girer girmez başlamayı dener; tarayıcı engellerse ilk dokunuşta başlar.
   Duraklatma düğmesi yok; tek <audio> öğesi tüm bölümlerde kesintisiz çalar */
const bgm = $('#bgm'), mf = $('#mframe');
let started = false, pendingP = null, localBad = false;
function ytStart() { /* YouTube yedeği (yalnızca dokunuşla) */
  const id = encodeURIComponent(C.music.videoId), ifr = make('iframe');
  ifr.title = 'Sting — Shape of My Heart'; ifr.allow = 'autoplay; encrypted-media';
  ifr.referrerPolicy = 'strict-origin-when-cross-origin';
  ifr.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&loop=1&playlist=${id}&rel=0`;
  mf.append(ifr); mf.hidden = false; started = true;
}
/* Sonuç: 'ok' (çalıyor) | 'blocked' (dokunuş gerekiyor) | 'none' (çalınacak müzik yok) */
function tryMusic(gesture) {
  if (started) return Promise.resolve('ok');
  if (!C.music.localFile || localBad) {
    if (!C.music.videoId) return Promise.resolve('none');
    if (!gesture) return Promise.resolve('blocked');
    ytStart(); return Promise.resolve('ok');
  }
  if (pendingP) return pendingP;
  if (!bgm.getAttribute('src')) bgm.src = C.music.localFile;
  bgm.loop = true;
  pendingP = bgm.play().then(() => { started = true; return 'ok'; }, err => {
    if (err && err.name === 'NotAllowedError') return 'blocked';
    localBad = true; return tryMusic(gesture); /* dosya yok/desteklenmiyor: yedeğe geç */
  }).finally(() => { pendingP = null; });
  return pendingP;
}

/* Açılış katmanı: saat 23:55'ten 00:00'a sayar. Müzik engellenirse saat 23:50'de bekler,
   kullanıcı dokununca müzikle birlikte sayım başlar. Sonra katman solar ve ana ekran görünür */
const intro = $('#intro'), clock = $('#clock'), hint = $('#hint');
let t = 23 * 60 + 52, entered = false, prevH = '', begun = false, tick = null;
const two = n => String(n).padStart(2, '0');
function renderClock() {
  const h = two(Math.floor(t / 60) % 24), m = two(t % 60);
  clock.innerHTML = `<span class="${h !== prevH && prevH ? 'c' : ''}">${h}</span><i>:</i><span class="c">${m}</span>`; prevH = h;
}
function enterStory() {
  if (entered) return; entered = true; clearInterval(tick);
  intro.classList.add('out'); document.body.classList.add('ready');
  setTimeout(() => { intro.hidden = true; $('#start').focus({ preventScroll: true }); }, 1500);
}
function begin(from) {
  if (begun) return; begun = true;
  intro.classList.remove('waiting'); hint.hidden = true; t = from; prevH = ''; renderClock();
  tick = setInterval(() => {
    t++; renderClock();
    if (t >= 24 * 60) { clearInterval(tick); clock.classList.add('zero'); setTimeout(enterStory, reduced ? 500 : 1500); }
  }, reduced ? 400 : 1300);
}
function waitForTap() { /* otomatik oynatma engellendi: 23:50'de dur, dokunuşu bekle */
  intro.classList.add('waiting'); t = 23 * 60 + 52; prevH = ''; renderClock(); hint.hidden = false;
  const EV = ['click', 'keydown', 'touchend'];
  const go = () => { EV.forEach(n => document.removeEventListener(n, go, true)); tryMusic(true).then(() => begin(23 * 60 + 52)); };
  EV.forEach(n => document.addEventListener(n, go, true));
}
renderClock();
tryMusic(false).then(r => r === 'blocked' ? waitForTap() : begin(23 * 60 + 52));

/* Sinematik açılış (en başta tanımlı: sonraki kodda bir hata olsa bile buton çalışır) */
$('#start').onclick = () => {
  tryMusic(true); /* kullanıcı etkileşimi içinde başlar */
  $('#start').disabled = true;
  perde(IT.start, () => {
    $('#ch1').hidden = true; $('#story').hidden = false; document.body.classList.remove('locked');
    scrollTo({ top: 0, behavior: 'instant' }); $('#ch2 h2').focus({ preventScroll: true });
  });
};

/* Dosya bulunamazsa gösterilen şık yer tutucu */
const placeholder = n => 'data:image/svg+xml;utf8,' + encodeURIComponent(
 `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2b4a"/><stop offset="1" stop-color="#3a2a30"/></linearGradient><radialGradient id="r" cx=".3" cy=".25"><stop offset="0" stop-color="#e0a458" stop-opacity=".45"/><stop offset="1" stop-color="#e0a458" stop-opacity="0"/></radialGradient></defs><rect width="800" height="1000" fill="url(#g)"/><rect width="800" height="1000" fill="url(#r)"/><rect x="40" y="40" width="720" height="920" fill="none" stroke="#c9a96a" stroke-opacity=".5"/><text x="400" y="490" text-anchor="middle" font-family="Georgia,serif" font-size="44" fill="#f4ecdc" letter-spacing="10">FOTOĞRAF</text><text x="400" y="580" text-anchor="middle" font-family="Georgia,serif" font-size="72" fill="#c9a96a">${n}</text></svg>`);

function photo(item, label) {
  const img = new Image();
  img.loading = 'lazy'; img.decoding = 'async'; img.alt = item.caption || ('Fotoğraf ' + label);
  img.onerror = () => { img.onerror = null; img.src = placeholder(label); };
  img.src = item.src;
  return img;
}

/* Kaydırınca beliren öğeler */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 })
  : null;
const watch = e => { e.classList.add('reveal'); io ? io.observe(e) : e.classList.add('in'); };

/* Bölüm 01 */
{ /* Başlık (kicker): kelimeler ve harfler sırayla belirir */
  const k = $('#kick'); k.textContent = ''; k.setAttribute('aria-label', C.title); let n = 0;
  C.title.split(' ').forEach((w, wi, a) => {
    const wd = make('span', 'kw'); wd.setAttribute('aria-hidden', 'true');
    [...w].forEach(c => { const sp = make('span', 'kc', c); sp.style.setProperty('--i', n++); wd.append(sp); });
    k.append(wd); if (wi < a.length - 1) { k.append(' '); n += 2; }
  });
}
{ /* Açılış tipografisi: isim harf harf, alıntı kelime kelime belirir */
  const nm = $('#name'); nm.textContent = ''; nm.classList.add('split'); nm.setAttribute('aria-label', C.name);
  [...C.name].forEach((c, i) => { const sp = make('span', 'ch', c); sp.style.setProperty('--i', i); sp.setAttribute('aria-hidden', 'true'); nm.append(sp); });
  const q = $('#quote'); q.textContent = '';
  ('“' + C.quote + '”').split(' ').forEach((w, i) => { const sp = make('span', 'w', w); sp.style.setProperty('--i', i); q.append(sp, ' '); });
  $('#meta').textContent = (C.date || '').replace(/\./g, ' · ');
}
document.title = C.title + ' — ' + C.name;

/* Bölüm 02: dokunarak kare kare ilerleyen gösterim (ekranın her yerine dokun / kaydır) */
const reel = $('#reel'), flash = $('#flash'), counter = $('#counter'), strip = $('#strip'), nextBtn = $('#next');
let mi = -1;
C.memories.forEach(() => strip.append(document.createElement('i')));
function frameEl(i) {
  const m = C.memories[i], f = make('figure', 'frame');
  f.style.setProperty('--tilt', ((i % 2 ? 1 : -1) * (1.5 + i % 3)) + 'deg');
  const img = photo(m, pad(i)); img.loading = 'eager'; f.append(img);
  if (m.caption) f.append(make('figcaption', '', m.caption));
  return f;
}
function showMem(i) {
  const n = C.memories.length; if (i < 0 || i >= n || i === mi) return;
  const old = reel.querySelector('.frame:not(.leave)');
  if (old) { old.classList.add('leave'); setTimeout(() => old.remove(), 280); }
  const f = frameEl(i); f.classList.add('enter'); reel.append(f);
  flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); /* ışık sızıntısı */
  if (mi !== -1) vib(12); /* kare değişti */
  mi = i; counter.textContent = pad(i) + ' / ' + pad(n - 1);
  [...strip.children].forEach((e, k) => e.classList.toggle('on', k === i));
  nextBtn.textContent = i === n - 1 ? 'Devam et ↓' : 'Dokun · sonraki kare';
  if (C.memories[i + 1]) new Image().src = C.memories[i + 1].src;
}
let sonMem = 0; /* iki dokunuş arası en az 0,3 sn (eskiden 0,45) */
const nextMem = () => { const n = Date.now(); if (n - sonMem < 300) return; sonMem = n; if (mi < C.memories.length - 1) showMem(mi + 1); else $('#ch3').scrollIntoView({ behavior: 'smooth' }); };
$('#ch2').addEventListener('click', nextMem);
let sx = 0; const ch2 = $('#ch2');
ch2.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
ch2.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (d < -50) nextMem(); else if (d > 50) showMem(mi - 1); });
showMem(0);

/* Bölüm 03 + ışık kutusu */
let cur = 0, opener = null;
const lb = $('#lb');
function showLB(i) {
  vib(8);
  cur = (i + C.gallery.length) % C.gallery.length;
  const g = C.gallery[cur], img = $('#lbi');
  img.onerror = () => { img.onerror = null; img.src = placeholder(pad(C.memories.length + cur)); };
  img.src = g.src; img.alt = g.caption || 'Fotoğraf'; $('#lbc').textContent = g.caption;
}
function closeLB() { lb.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); }
C.gallery.forEach((g, i) => {
  const b = make('button', 'pol'); b.type = 'button'; b.style.setProperty('--r', ((i % 2 ? 1 : -1) * (1 + i % 3)) + 'deg');
  b.setAttribute('aria-label', 'Fotoğrafı büyüt: ' + (g.caption || 'Fotoğraf ' + pad(C.memories.length + i)));
  b.style.setProperty('--i', i); b.style.setProperty('--from', (i % 2 ? 110 : -110) + 'px'); /* soldan / sağdan gelir */
  b.append(photo(g, pad(C.memories.length + i)));
  if (g.caption) b.append(make('span', '', g.caption));
  b.onclick = () => { opener = b; showLB(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('#lbx').focus(); };
  $('#gallery').append(b); watch(b);
});
$('#lbx').onclick = closeLB; $('#lbp').onclick = () => showLB(cur - 1); $('#lbn').onclick = () => showLB(cur + 1);
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLB(); if (e.key === 'ArrowLeft') showLB(cur - 1); if (e.key === 'ArrowRight') showLB(cur + 1);
});
let tx = 0;
lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) showLB(cur + (d < 0 ? 1 : -1)); });

/* Bölüm 03 → 04 → 05 geçişleri: bir eleman eksikse bile Başlat ve diğer bölümler çalışmaya devam eder */
try {
/* ---------- Sahne geçişi: sinematik şeritler kapanır, bölümler değişir ---------- */
function sahne(gizle, goster, odak, sonra, yazi) {
  perde(yazi, () => {
    gizle.forEach(e => { e.hidden = true; });
    goster.forEach(e => { e.hidden = false; });
    scrollTo({ top: 0, behavior: 'instant' });
    if (sonra) sonra();
    if (odak) odak.focus({ preventScroll: true });
  });
}
window.__sahne = sahne;
const b4 = $('#ch4'), b45 = $('#ch45'), b46 = $('#ch46'), b5 = $('#ch5'), b6 = $('#ch6');
[b4, b45, b46, b5, b6].forEach(e => { e.hidden = true; }); /* sırayla "Devam et" ile açılırlar */

/* ---------- Bölüm 03: kaydırdıkça kartlar sağa-sola süzülür ---------- */
const pols = [...document.querySelectorAll('#gallery .pol')];
let rafP = 0;
function kaydir() {
  rafP = 0; if (reduced) return;
  const vh = innerHeight;
  pols.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    const p = (r.top + r.height / 2 - vh / 2) / vh; /* yaklaşık -1 … 1 */
    el.style.setProperty('--px', ((i % 2 ? -1 : 1) * p * 40).toFixed(1) + 'px');
  });
}
addEventListener('scroll', () => { if (!rafP) rafP = requestAnimationFrame(kaydir); }, { passive: true });
kaydir();

/* ---------- Bölüm 03: ekrana basılı tutunca sayfa yavaşça kendiliğinden aşağı akar ---------- */
const ch3 = $('#ch3'), holdHint = $('#holdhint'), HIZ = 215; /* px/sn (eskiden 165) */
let basili = false, bekle = 0, akRaf = 0, akSon = 0, akY = 0, bx = 0, by = 0, bitis = 0;
function akis(ts) {
  if (!basili) { akRaf = 0; return; }
  const dt = Math.min(ts - akSon, 50) / 1000; akSon = ts; akY += HIZ * dt;
  scrollTo({ top: akY, left: 0, behavior: 'instant' });
  akRaf = requestAnimationFrame(akis);
}
function tutBaslat() {
  bekle = 0; basili = true; akY = scrollY; akSon = performance.now(); vib(10);
  holdHint.classList.add('off'); akRaf = requestAnimationFrame(akis);
}
function tutBirak() {
  clearTimeout(bekle); bekle = 0;
  if (basili) { basili = false; bitis = Date.now(); }
}
ch3.addEventListener('pointerdown', e => {
  if (e.target.closest('#to4') || (e.pointerType === 'mouse' && e.button !== 0)) return;
  bx = e.clientX; by = e.clientY; clearTimeout(bekle); bekle = setTimeout(tutBaslat, 200);
});
ch3.addEventListener('pointermove', e => { /* parmak kayıyorsa kullanıcı kendisi kaydırıyordur */
  if (!basili && bekle && Math.hypot(e.clientX - bx, e.clientY - by) > 12) tutBirak();
});
['pointerup', 'pointercancel'].forEach(n => addEventListener(n, tutBirak));
addEventListener('blur', tutBirak);
ch3.addEventListener('contextmenu', e => e.preventDefault()); /* uzun basınca menü çıkmasın */
ch3.addEventListener('click', e => { /* basılı tutup bırakınca fotoğraf yanlışlıkla açılmasın */
  if (Date.now() - bitis < 450) { e.stopPropagation(); e.preventDefault(); }
}, true);

/* ---------- Bölüm 03 → 04 ---------- */
const to4 = $('#to4');
to4.onclick = () => { to4.disabled = true; tutBirak(); sahne([$('#ch2'), $('#ch3')], [b4], $('#ch4 h2'), kur4, IT.c4); };

/* ---------- Bölüm 04: Yıldızlı uzayda süzülen cam anılar ----------
   Her dokunuşta bir kare uyanır, mesajını söyler ve serbest, organik bir kümeye bırakılır.
   Bırakılan kareler dokundukça birbirine yaklaşır (kümelenir); aralarında canlı, kıvrımlı ışık iplikleri gerilir.
   Son dokunuşta hepsi ortada bir yelpazede birleşir. ---------- */
const NS = 'http://www.w3.org/2000/svg';
const glass = $('#glass'), glines = $('#glines'), note = $('#note'),
      c4c = $('#c4count'), c4n = $('#c4next'), to5 = $('#to5'), N = C.messages.length;
let nodes = [], lines = [], k4 = -1, kurulu = false, c4raf = 0;

/* Derin uzay: üç katman yıldız (yakın olan büyük ve hızlı, uzak olan küçük ve ağır paralaks yapar) */
for (let i = 0; i < 64; i++) {
  const s = make('i'), dz = i % 3; /* 0 uzak · 1 orta · 2 yakın */
  s.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;--d:${(Math.random() * 4).toFixed(1)}s;--s:${(0.8 + dz * 0.8 + Math.random() * 1.2).toFixed(1)}px;--k:${(0.3 + dz * 0.45).toFixed(2)}`;
  $('#twinkles').append(s);
}
/* Bölüm görünür olunca bir kez kurulur */
function kur4() {
  if (kurulu) return; kurulu = true;
  const kaynak = C.glassPhotos && C.glassPhotos.length ? C.glassPhotos : C.gallery, mid = (N - 1) / 2, GA = 2.399963; /* altın açı: düzenli bir halka değil, serbest bir saçılım */
  nodes = C.messages.map((m, k) => {
    const a = k * GA + 0.7, rr = 19 + 17 * ((k * 0.618 + 0.13) % 1);
    const x = Math.min(86, Math.max(14, 50 + rr * 1.18 * Math.cos(a))), y = Math.min(72, Math.max(15, 42 + rr * 0.92 * Math.sin(a))), off = k - mid;
    const it = kaynak[k % kaynak.length], el = make('div', 'gn'), gi = make('span', 'gi');
    const sz = 0.86 + ((k * 37) % 10) / 24; /* her karenin boyu biraz farklı */
    el.style.cssText = `--x:${x.toFixed(1)}%;--y:${y.toFixed(1)}%;--i:${k};--s:${sz.toFixed(2)};--rot:${((k % 2 ? 1 : -1) * (4 + k * 2.3)).toFixed(1)}deg;--d:${(0.5 + (k % 3) * 0.4).toFixed(1)};--t:${6 + k * 1.3}s;--dl:-${(k * 1.7).toFixed(1)}s;--fx:${(off * 42).toFixed(0)}px;--fr:${(off * 7).toFixed(1)}deg;--fz:${10 - Math.round(Math.abs(off) * 2)};--fy:${(off * off * 7).toFixed(0)}px`;
    const im = photo(it, pad(k)); im.loading = 'eager';
    if (/\.png(\?|$)/i.test(it.src)) el.classList.add('cut'); /* şeffaf PNG: kesim gibi süzülür */
    gi.append(im); el.append(gi); glass.append(el);
    setTimeout(() => el.classList.add('in'), reduced ? 0 : 300 + k * 160);
    return { el, x, y, fx: off * 42 };
  });
  lines = []; /* iplik k: k → k+1 (kapanan halka yok); kıvrımı her karede canlı hesaplanır */
  for (let k = 0; k < N - 1; k++) {
    const l = document.createElementNS(NS, 'path'); l.setAttribute('pathLength', '1'); glines.append(l); lines.push(l);
  }
  c4raf = requestAnimationFrame(iplik);
}
/* İplikler: karelerin o anki (süzülen) konumlarını izler, ince bir dalgayla kıvrılır */
function iplik(ts) {
  if (!kurulu) return;
  c4raf = requestAnimationFrame(iplik);
  if (b4.hidden || document.hidden || glass.classList.contains('done')) return;
  const gr = glass.getBoundingClientRect(); if (!gr.width) return;
  const pos = nodes.map(n => { const r = n.el.getBoundingClientRect(); return [(r.left + r.width / 2 - gr.left) / gr.width * 100, (r.top + r.height / 2 - gr.top) / gr.height * 100]; });
  const t = ts / 1000;
  lines.forEach((l, k) => {
    if (!l.classList.contains('on')) return;
    const [x1, y1] = pos[k], [x2, y2] = pos[k + 1], mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, w = 6 * Math.sin(t * 0.9 + k * 1.7);
    l.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${(mx - dy * 0.22 + w).toFixed(1)} ${(my + dx * 0.22 + w * 0.6).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
  });
}
/* Bırakılan kareler her dokunuşta merkeze biraz daha yaklaşır: dağınık uzay yavaşça bir kümeye dönüşür */
function topla() {
  const f = Math.max(0.5, 1 - 0.07 * Math.max(0, k4));
  nodes.forEach((n, i) => {
    if (i >= k4) return; /* yalnızca bırakılmış olanlar */
    n.el.style.setProperty('--x', (50 + (n.x - 50) * f).toFixed(1) + '%');
    n.el.style.setProperty('--y', (42 + (n.y - 42) * f).toFixed(1) + '%');
  });
}
/* Bırakılan karenin yerinde yayılan ince bir şok halkası */
function halka4(k) {
  if (reduced) return;
  const n = nodes[k], r = make('i', 'gring'); r.style.left = n.el.style.getPropertyValue('--x') || (n.x + '%'); r.style.top = n.el.style.getPropertyValue('--y') || (n.y + '%');
  glass.append(r); setTimeout(() => r.remove(), 1400);
}
const yerles = k => {
  nodes[k].el.classList.remove('awake'); nodes[k].el.classList.add('lit'); if (k > 0) lines[k - 1].classList.add('on');
  topla(); halka4(k);
  const r = nodes[k].el.getBoundingClientRect(); if (!reduced && FX.spark) FX.spark(r.left + r.width / 2, r.top + r.height / 2);
};
let son4 = 0;
function adim() {
  if (!kurulu || k4 >= N) return;
  const nw = Date.now(); if (nw - son4 < 650) return; son4 = nw; /* nefes payı 0,9 → 0,65 sn */
  k4++; vib(k4 >= N ? [18, 50, 30, 50, 40] : 14);
  note.classList.remove('on'); void note.offsetWidth;
  const gr = glass.getBoundingClientRect(), cx = gr.left + gr.width / 2, cy = gr.top + gr.height * .42;
  if (k4 > 0) yerles(k4 - 1); /* önceki kare kümedeki yerine bırakılır */
  isik(cx, cy, '#e0a458');
  if (k4 < N) {
    const m = C.messages[k4];
    nodes[k4].el.classList.add('awake');
    if (!reduced && FX.spark) FX.spark(cx, cy);
    note.replaceChildren(make('p', 'n1', m.text), make('p', 'n2', m.more)); note.classList.add('on');
    c4c.textContent = pad(k4) + ' / ' + pad(N - 1);
    c4n.textContent = k4 === N - 1 ? 'Dokun · kareler birleşsin' : 'Dokun · sonraki kare';
  } else { /* son dokunuş: kareler ortada bir yelpazede birleşir */
    note.replaceChildren(); c4c.textContent = ''; c4n.hidden = true;
    glines.classList.add('fade');
    setTimeout(() => {
      nodes.forEach(n => { n.el.style.removeProperty('--x'); n.el.style.removeProperty('--y'); n.el.classList.remove('lit'); n.el.classList.add('final'); });
      glass.classList.add('done'); vib([30, 80, 40]);
      if (!reduced) FX.burst(cx, cy);
      c4c.textContent = 'Kareler üzerinde gez'; /* ipucu */
      setTimeout(() => nodes.forEach(n => n.el.classList.add('settled')), reduced ? 0 : 1300); /* yerleşince hover hızlı çalışır */
    }, reduced ? 0 : 800);
    goster(to5, reduced ? 800 : 1900); /* eskiden 2,8 sn */
  }
}

/* Birleşen kartlar: imleç ya da parmak üzerinde gezdikçe en yakın kart yükselir, büyür ve kendi mesajını geri getirir */
let popK = -1;
function pop(k) {
  if (k === popK) return; popK = k;
  nodes.forEach((n, i) => n.el.classList.toggle('pop', i === k));
  if (k < 0) return;
  const m = C.messages[k]; vib(6);
  note.classList.remove('on'); void note.offsetWidth;
  note.replaceChildren(make('p', 'n1', m.text), make('p', 'n2', m.more)); note.classList.add('on');
  const r = nodes[k].el.getBoundingClientRect(); isik(r.left + r.width / 2, r.top, '#ffd27a');
}
function gez(e) {
  if (!glass.classList.contains('done') || !nodes.some(n => n.el.classList.contains('settled'))) return;
  const gr = glass.getBoundingClientRect(), cx = gr.left + gr.width / 2, cy = gr.top + gr.height * .42;
  if (Math.abs(e.clientY - cy) > 170) return pop(-1); /* kart bandının dışında: indir */
  let b = 0, bd = 1e9; nodes.forEach((n, i) => { const d = Math.abs(e.clientX - (cx + n.fx)); if (d < bd) { bd = d; b = i; } });
  pop(b);
}
glass.addEventListener('pointermove', gez); glass.addEventListener('pointerdown', gez);
glass.addEventListener('pointerleave', () => { if (glass.classList.contains('done')) pop(-1); });
b4.addEventListener('click', e => { if (!e.target.closest('#to5')) adim(); });

/* ---------- Bölüm 04 → 04.5 (film makarası) ---------- */
to5.onclick = () => { to5.disabled = true; sahne([b4], [b45], $('#ch45 h2'), kurMakara, IT.c45); };

/* ---------- Sahne A: iki yönlü, sonsuz 35 mm film şeridi. Basılı tutunca makara durur ---------- */
const FOTO_MAX = 40; /* şerit başına en fazla bu kadar kare çizilir: yüzlerce fotoğraf olsa da telefon yorulmasın */
const pj = $('#projector'), to46 = $('#to46');
let makaraKuruldu = false;
function kurMakara() {
  if (makaraKuruldu) return; makaraKuruldu = true;
  const havuz = (C.reel && C.reel.length ? C.reel : C.gallery);
  const sira1 = havuz.slice(0, FOTO_MAX), sira2 = havuz.slice().reverse().slice(0, FOTO_MAX);
  [['#film1', sira1], ['#film2', sira2]].forEach(([sel, liste]) => {
    const el = $(sel);
    for (let k = 0; k < 2; k++) { /* iki kopya: -%50 kaydırınca kesintisiz döngü */
      liste.forEach((it, i) => { const c = make('figure', 'cell'); c.append(photo(it, pad(i)), make('span', 'fn', pad(i))); el.append(c); });
    }
    el.style.setProperty('--dur', (liste.length * 2.2) + 's'); /* şerit daha hızlı akar (eskiden 3.2 sn/kare) */
  });
  goster(to46, reduced ? 800 : 2400);
}
const tut = on => { pj.classList.toggle('hold', on); if (on) vib(8); $('#rhint').classList.add('off'); };
pj.addEventListener('pointerdown', () => tut(true));
['pointerup', 'pointercancel', 'pointerleave'].forEach(n => pj.addEventListener(n, () => tut(false)));
pj.addEventListener('contextmenu', e => e.preventDefault());
to46.onclick = () => { to46.disabled = true; sahne([b45], [b46], $('#ch46 h2'), kurMontaj, IT.c46); };

/* ---------- Sahne B: karanlık oda masası — kareler süzülür, dokununca yakından bakılır ---------- */
const tbl = $('#table'), pins = $('#pins'), pinImg = $('#pinimg'), pinCap = $('#pincap'), to5m = $('#to5m');
const slots = []; let montajKuruldu = false;
function sec(haric) { /* havuzdan rastgele bir kare; ekrandakilerle aynı olmasın */
  const havuz = C.montage && C.montage.length ? C.montage : C.gallery, kul = new Set(haric.map(x => x.src));
  const adaylar = havuz.filter(p => !kul.has(p.src)), l = adaylar.length ? adaylar : havuz;
  return l[Math.floor(Math.random() * l.length)];
}
function incele(s, e) {
  pinImg.src = s.im.src; pinCap.textContent = s.it.caption || ''; pins.hidden = false;
  requestAnimationFrame(() => pins.classList.add('on'));
  isik(e.clientX, e.clientY, '#ffd27a'); kalp(); document.body.style.overflow = 'hidden';
}
pins.onclick = () => { pins.classList.remove('on'); setTimeout(() => { pins.hidden = true; document.body.style.overflow = ''; }, 700); };
function kurMontaj() {
  if (montajKuruldu) return; montajKuruldu = true;
  const cols = innerWidth < 600 ? 3 : 4, rows = cols === 3 ? 4 : 3, n = cols * rows;
  tbl.style.setProperty('--c', cols);
  for (let i = 0; i < n; i++) {
    const z = 0.3 + Math.random() * 0.7, L = (i % cols) / cols * 100 + 1 + Math.random() * 6, T = Math.floor(i / cols) / rows * 100 + Math.random() * 6;
    const d = make('button', 'fp'); d.type = 'button'; d.setAttribute('aria-label', 'Kareye yakından bak');
    d.style.cssText = `left:${L.toFixed(1)}%;top:${T.toFixed(1)}%;--i:${i};--z:${z.toFixed(2)};--r:${((Math.random() - .5) * 14).toFixed(1)}deg;--bx:${((Math.random() - .5) * 14).toFixed(0)}px;--by:${((Math.random() - .5) * 18).toFixed(0)}px;--t:${(4.2 + Math.random() * 3.6).toFixed(1)}s;--dl:-${(Math.random() * 8).toFixed(1)}s;z-index:${Math.round(z * 10)}`;
    const it = sec(slots.map(x => x.it)), im = photo(it, pad(i)), fi = make('span', 'fpi'); im.loading = 'eager';
    fi.append(im); d.append(fi);
    const slot = { el: d, it, im, no: i }; slots.push(slot);
    d.onclick = e => incele(slot, e);
    tbl.append(d);
  }
  setInterval(() => { /* havuz büyükse masadaki kareler arada yenilenir */
    if (b46.hidden || document.hidden || pins.classList.contains('on')) return;
    const s = slots[Math.floor(Math.random() * slots.length)], it = sec(slots.map(x => x.it));
    if (!s || it.src === s.it.src) return;
    s.el.classList.add('swap');
    setTimeout(() => { s.it = it; s.im.onerror = () => { s.im.onerror = null; s.im.src = placeholder(pad(s.no)); }; s.im.src = it.src; s.el.classList.remove('swap'); }, 560);
  }, 1800);
  goster(to5m, reduced ? 800 : 2300);
}
to5m.onclick = () => { to5m.disabled = true; sahne([b46], [b5], $('#envelope'), null, IT.c5); };

/* Dokunulan yere altın halka */
['#ch2', '#ch4', '#ch46'].forEach(id => $(id).addEventListener('pointerdown', halka));
} catch (err) { console.error('Bölüm geçişleri kurulamadı:', err); }

/* Bölüm 05–06 finale.js içinde: ortak yardımcılar oraya buradan verilir */
window.__app = { C, FX, $, make, pad, vib, kalp, isik, reduced, photo, watch };
(window.__ok = window.__ok || []).push('app');
})();
