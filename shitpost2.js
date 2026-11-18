/* shitpost2.js (2/2) — Zaman Tüneli (süzülen fotoğraflar) · zengin karanlık oda + yakınlaştır düğmesi · baskı arttıkça şiddetlenen Darla · pasta çerçevesi · final videosu
   shitpost.js'ten SONRA yüklenir (onun yardımcılarını window.__shx üzerinden kullanır). Tüm yazılar aşağıdaki sabitlerde. */
(() => {
'use strict';
const S = window.__shx;
if (!S) { console.error('shitpost2.js: shitpost.js yüklenmeden çalıştı'); return; }
const { A, $, $$, make, vib, reduced, FX, rnd, yeniden, guvenli, deste, sonrakiFoto, setFoto, blok, yerlestir, acilinca, sayac } = S;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), pad3 = n => String(n).padStart(3, '0');

/* ======================= AYARLAR ======================= */
const VIDEO_SRC = 'video.mp4';        /* repo kökündeki video (H.264 + AAC .mp4) */
const MUZIK_MODU = 'dokunma';         /* 'dokunma' = video müziğe ASLA dokunmaz · 'sustur' = video sesliyken müzik duraklar, sonra devam eder */

/* baskı arttıkça şiddetlenen Darla: [eşik, seviye adı, düğme yazısı, seviye atlayınca çıkan not] */
const SEVIYE = [
  [0, 'Sakin', 'DARLA', 'Düğmeye bas, Hira\'yı darla.'],
  [5, 'Rahatsız', 'DARLA!', 'Hira bir kaşını kaldırdı.'],
  [12, 'Sinirli', 'DEVAM ET', 'Hira iç çekti. Sesli.'],
  [22, 'Çok sinirli', 'BIRAKMA', 'Hira telefonu eline aldı. Tehlikeli.'],
  [35, 'Kritik', 'DURMA', 'Hira "yeter" yazdı ve sildi.'],
  [50, 'PATLADI', 'EFSANE', 'Hira.exe patladı. Rekor kırdın, tebrikler.']
];
const SOZLER = [
  'Yaş 15 ama enerji hâlâ "5 dakika daha" seviyesinde.', 'Bugün pasta senin; laf yine bende.',
  '15 olmuşsun, göz devirme becerin hâlâ üst düzey.', 'Mum üflerken dilek tut. "Daha çok pasta" deme, yedik zaten.',
  'Bugün senin günün; kimse seninle tartışmaz. İstisna: ben.', 'Seni darlıyorum çünkü sevdiğime bunu yaparım. Yasal uyarı.',
  'Yaşlanmak mı? Hayır, sadece sürüm güncellemesi.', 'Doğum günün kutlu olsun; ama kahveyi yine ben ödemiyorum.',
  'Büyüdüm diyebilirsin artık. Kimse inanmaz ama diyebilirsin.', 'Bu düğmeye basmaya devam et. Seni kimse durduramaz. Ben bile.'
];

/* ======================= 1) ZAMAN TÜNELİ: fotoğraflar üstüne süzülür, aralarında gezinirsin (makara bölümünün üstünde) ======================= */
function sahneTunel() {
  const ch45 = $('#ch45'); if (!ch45) return;
  const s = blok('shx-tunnel', 'Anılar Arasında Gez', 'Parmağınla yönlendir · basılı tut: hızlan',
    '<div class="tunnel" id="tunnel"><div class="tscene" id="tscene"></div><div class="tfog"></div><p class="tcount" id="tcount"></p></div>');
  const sub = $('.sub', ch45); if (sub) sub.after(s); else ch45.prepend(s);
  const box = $('#tunnel'), sc = $('#tscene'), cnt = $('#tcount');
  const N = innerWidth < 600 ? 12 : 18, STEP = 250, DEPTH = N * STEP, planes = [];
  let W = 360, gecen = 0, hiz = 0, hedef = reduced ? 160 : 380, px = 0, py = 0, spx = 0, spy = 0, son = 0, gorunur = false;
  const yerles = p => { /* her tur farklı açı ve yarıçap: düzenli halka değil, serbest bir sarmal */
    const a = p.k * 2.399963 + Math.sin(p.k * 0.7) * 0.6, R = W * (0.27 + 0.2 * Math.abs(Math.sin(p.k * 1.31)));
    p.x = Math.cos(a) * R; p.y = Math.sin(a) * R * 0.78;
    p.ry = -(p.x / R) * 26; p.rx = (p.y / R) * 16; p.rz = ((p.k * 37) % 13 - 6);
    p.el.style.setProperty('--w', (W * (0.27 + ((p.k * 17) % 7) / 60)).toFixed(0) + 'px');
    const im = A.photo({ src: sonrakiFoto(), caption: '' }, ''); im.loading = 'eager'; p.el.replaceChildren(im);
  };
  for (let i = 0; i < N; i++) { const el = make('div', 'tpl'); sc.append(el); const p = { el, k: i, z: -i * STEP + 160 }; planes.push(p); yerles(p); }
  const ciz = p => {
    const uzak = clamp((DEPTH + p.z) / (DEPTH * 0.42), 0, 1), yakin = p.z > 250 ? clamp((420 - p.z) / 170, 0, 1) : 1;
    p.el.style.opacity = (uzak * yakin).toFixed(3);
    p.el.style.transform = 'translate3d(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px,' + p.z.toFixed(1) + 'px) translate(-50%,-50%) rotateY(' + p.ry.toFixed(1) + 'deg) rotateX(' + p.rx.toFixed(1) + 'deg) rotateZ(' + p.rz + 'deg)';
  };
  const dongu = ts => {
    requestAnimationFrame(dongu);
    if (!gorunur || ch45.hidden || document.hidden) { son = 0; return; }
    W = box.clientWidth || W;
    const dt = son ? Math.min(ts - son, 50) / 1000 : 0; son = ts;
    hiz += (hedef - hiz) * Math.min(1, dt * 3); spx += (px - spx) * Math.min(1, dt * 5); spy += (py - spy) * Math.min(1, dt * 5);
    sc.style.transform = 'rotateY(' + (spx * 14).toFixed(2) + 'deg) rotateX(' + (-spy * 9).toFixed(2) + 'deg)';
    planes.forEach(p => { p.z += hiz * dt; if (p.z > 420) { p.z -= DEPTH; p.k += N; yerles(p); gecen++; } ciz(p); });
    cnt.textContent = pad3(gecen + N) + ' kare';
  };
  if ('IntersectionObserver' in window) new IntersectionObserver(e => { gorunur = e[0].isIntersecting; }, { threshold: 0.05 }).observe(box); else gorunur = true;
  const yon = e => { const r = box.getBoundingClientRect(); px = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1); py = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1); };
  box.addEventListener('pointermove', yon);
  box.addEventListener('pointerdown', e => { yon(e); hedef = reduced ? 400 : 1250; box.classList.add('boost'); vib(10); if (A.isik) A.isik(e.clientX, e.clientY, '#ff69ab'); });
  const birak = () => { hedef = reduced ? 160 : 380; box.classList.remove('boost'); px = py = 0; };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => box.addEventListener(n, birak));
  box.addEventListener('contextmenu', e => e.preventDefault());
  s.addEventListener('pointerdown', e => e.stopPropagation());
  requestAnimationFrame(dongu);
}

/* ======================= 2) KARANLIK ODA: zengin dekor + "Yakınlaştır" düğmesi (otomatik zoom yok) ======================= */
function sahneKaranlik() {
  const ch46 = $('#ch46'), tbl = $('#table'), to5m = $('#to5m'); if (!ch46 || !tbl || !to5m) { console.warn('shitpost2.js: karanlık oda öğeleri yok'); return; }
  tbl.classList.add('shx-dark');
  const dekor = make('div', 'shx-dk'); dekor.setAttribute('aria-hidden', 'true');
  let toz = '', ip = '';
  for (let i = 0; i < 14; i++) toz += '<i style="--x:' + Math.round(rnd(2, 98)) + '%;--y:' + Math.round(rnd(4, 92)) + '%;--d:' + rnd(6, 13).toFixed(1) + 's;--w:-' + rnd(0, 9).toFixed(1) + 's;--s:' + rnd(2, 5).toFixed(1) + 'px"></i>';
  for (let i = 0; i < 7; i++) ip += '<b style="--l:' + (6 + i * 14) + '%;--h:' + Math.round(rnd(26, 52)) + 'px;--r:' + rnd(-7, 7).toFixed(1) + 'deg"></b>';
  dekor.innerHTML = '<i class="dk-safe"></i><div class="dk-rope">' + ip + '</div>' +
    '<div class="dk-timer"><small>BANYO</small><span id="dkT">00:00</span></div>' +
    '<div class="dk-trays"><div><i></i><small>Banyo</small></div><div><i></i><small>Durdur</small></div><div><i></i><small>Sabitle</small></div></div>' +
    '<div class="dk-dust">' + toz + '</div>';
  tbl.prepend(dekor);
  /* geri sayım benzeri banyo sayacı */
  const dkT = $('#dkT'); let t0 = 0, sure = 0;
  acilinca(ch46, () => { t0 = Date.now(); clearInterval(sure); sure = setInterval(() => { if (ch46.hidden) return; const sn = Math.floor((Date.now() - t0) / 1000); dkT.textContent = pad3(Math.floor(sn / 60)).slice(1) + ':' + String(sn % 60).padStart(2, '0'); }, 1000); });

  /* yakınlaştır: kareye dokununca seçilir; zoom yalnızca düğmeyle açılır */
  const kutu = make('div', 'shx-zoombox');
  kutu.innerHTML = '<p class="shx-zhint" id="zHint">Bir kareye dokun · seç</p><button class="btn" type="button" id="zBtn" disabled>🔍 Yakınlaştır</button>';
  to5m.before(kutu);
  const zb = $('#zBtn'), zh = $('#zHint'); let sec = null;
  tbl.addEventListener('click', e => {
    const fp = e.target.closest('.fp'); if (!fp) return;
    e.stopPropagation(); e.preventDefault(); /* app.js'in otomatik zoom'u çalışmasın */
    if (sec) sec.classList.remove('shx-sel'); sec = fp; fp.classList.add('shx-sel');
    zb.disabled = false; zh.textContent = 'Kare seçildi · şimdi yakınlaştır'; vib(10); yeniden(zb, 'shx-popin');
  }, true);
  zb.onclick = () => {
    if (!sec || !sec.onclick) return;
    const r = sec.getBoundingClientRect(); vib(14);
    sec.onclick({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
  };
  kutu.addEventListener('pointerdown', e => e.stopPropagation());
}

/* ======================= 3) DARLA: bastıkça (ya da basılı tutunca) şiddetlenen baskı mekaniği ======================= */
function sahneDarla() {
  const to5m = $('#to5m'); if (!to5m) return;
  const s = blok('shx-darla', 'Darlama Butonu', 'Basma. (Bas.) Basılı tutarsan kendi kendine de darlar.',
    '<div class="shx-meter" aria-hidden="true"><i id="dMeter"></i></div><p class="shx-lvl" id="dLvl">Hira: Sakin</p>' +
    '<div class="shx-stage" id="darlaStage"><button class="shx-big" type="button" id="darlaBtn">DARLA</button></div>' +
    '<p class="shx-quote" id="darlaQuote">Düğmeye bas, Hira\'yı darla.</p><small>darlama sayısı: <b id="darlaN">0</b></small><div class="shx-toast" id="dToast" aria-live="polite"></div>');
  to5m.before(s);
  const btn = $('#darlaBtn'), stage = $('#darlaStage'), q = $('#darlaQuote'), nEl = $('#darlaN'), met = $('#dMeter'), lvl = $('#dLvl'), toast = $('#dToast'), sonrakiSoz = deste(SOZLER);
  let n = 0, sv = 0, basili = false, tmr = 0, kutlandi = false;
  const flash = () => { const f = make('div', 'shx-scrflash'); document.body.append(f); f.addEventListener('animationend', () => f.remove()); };
  const pop = () => {
    const eski = $$('.shx-pop', stage); if (eski.length > 14) eski[0].remove();
    const im = new Image(), a = rnd(-Math.PI * .95, -Math.PI * .05), d = rnd(110, 200);
    im.className = 'shx-pop'; im.alt = '';
    im.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px'); im.style.setProperty('--dy', (Math.sin(a) * d).toFixed(0) + 'px');
    im.style.setProperty('--rot', rnd(-30, 30).toFixed(0) + 'deg'); setFoto(im); stage.append(im);
    im.addEventListener('animationend', () => im.remove());
  };
  const seviyeBak = () => {
    let yeni = 0; SEVIYE.forEach((x, i) => { if (n >= x[0]) yeni = i; });
    if (yeni === sv) return; sv = yeni;
    s.dataset.lv = sv; btn.textContent = SEVIYE[sv][2]; lvl.textContent = 'Hira: ' + SEVIYE[sv][1];
    toast.textContent = SEVIYE[sv][3]; yeniden(toast, 'shx-popin'); flash();
    vib(sv >= 4 ? [60, 40, 60, 40, 90] : [30, 40, 30]);
    if (FX.burst) { const r = btn.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top); }
    if (sv === SEVIYE.length - 1 && !kutlandi) { kutlandi = true; if (FX.kutlama) setTimeout(FX.kutlama, 350); }
  };
  const bas = () => {
    n++; sayac.art(3); nEl.textContent = n; q.textContent = sonrakiSoz(); yeniden(q, 'shx-flash');
    s.style.setProperty('--amp', (3 + sv * 3) + 'px'); yeniden(stage, 'shx-shake');
    met.style.width = Math.min(100, n / SEVIYE[SEVIYE.length - 1][0] * 100) + '%';
    vib(sv >= 3 ? [14, 20, 14] : 10);
    const adet = reduced ? 1 : Math.min(4, 1 + Math.floor(sv / 1.5)) + (Math.random() < .4 ? 1 : 0); for (let i = 0; i < adet; i++) pop();
    if (n % 7 === 0 && FX.burst) { const r = btn.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top); }
    seviyeBak();
  };
  const tekrar = () => { if (!basili) return; bas(); tmr = setTimeout(tekrar, Math.max(80, 300 - n * 5)); };
  const birak = () => { basili = false; clearTimeout(tmr); };
  btn.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button !== 0) return; e.preventDefault(); basili = true; bas(); tmr = setTimeout(tekrar, 420); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(k => btn.addEventListener(k, birak));
  btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bas(); } });
  btn.addEventListener('contextmenu', e => e.preventDefault());
  s.addEventListener('pointerdown', e => e.stopPropagation());
}

/* ======================= 4) PASTA ÇERÇEVESİ: pembe çerçeve, flamalar, ışık dizisi, köşelerde fotoğraflar ======================= */
function sahneCerceve() {
  const stage = $('#stage'); if (!stage || stage.parentNode.classList.contains('shx-cframe')) return;
  const f = make('div', 'shx-cframe'); stage.before(f); f.append(stage);
  let bayrak = '', isik = '';
  for (let i = 0; i < 11; i++) bayrak += '<i style="--c:' + ['#fe4f8a', '#e096a7', '#ff69ab'][i % 3] + ';--w:-' + (i * 0.37).toFixed(2) + 's"></i>';
  for (let i = 0; i < 16; i++) isik += '<b style="--w:-' + (i * 0.23).toFixed(2) + 's"></b>';
  const dekor = make('div', 'shx-cdeco'); dekor.setAttribute('aria-hidden', 'true');
  dekor.innerHTML = '<div class="cf-line"></div><i class="cf-c cf-tl"></i><i class="cf-c cf-tr"></i><i class="cf-c cf-bl"></i><i class="cf-c cf-br"></i><div class="cf-flags">' + bayrak + '</div><div class="cf-lights">' + isik + '</div>' +
    '<figure class="cf-pol cf-p1"><img alt=""></figure><figure class="cf-pol cf-p2"><img alt=""></figure><figure class="cf-pol cf-p3"><img alt=""></figure><figure class="cf-pol cf-p4"><img alt=""></figure>';
  f.append(dekor);
  $$('.cf-pol img', dekor).forEach(im => setFoto(im));
}

/* ======================= 5) FİNAL VİDEOSU: sabit boyutlu çerçeve, yedekli hata mesajı, müzikten bağımsız ======================= */
function sahneVideo() {
  const wish = $('#wish'), closing = $('#closing'); if (!wish || !closing) { console.warn('shitpost2.js: #wish/#closing yok'); return; }
  const s = blok('shx-video', 'Bonus Video', 'Kendi sesiyle oynar. Müzik de çalmaya devam eder, kulakların senin sorunun.',
    '<div class="shx-vwrap" id="vWrap"><video id="finalVideo" controls playsinline webkit-playsinline preload="none"></video><div class="shx-vload" id="vLoad">Video yükleniyor…</div></div>' +
    '<p class="shx-note" id="vidNote" hidden></p><button class="btn" type="button" id="vRetry" hidden>Tekrar dene</button>');
  s.hidden = true; closing.before(s);
  const vid = $('#finalVideo'), wrap = $('#vWrap'), load = $('#vLoad'), note = $('#vidNote'), retry = $('#vRetry');
  let kuruldu = false, bekci = 0, deneme = 0;
  const hata = m => { load.hidden = true; note.hidden = false; note.textContent = m; retry.hidden = false; };
  const kur = () => {
    clearTimeout(bekci); note.hidden = true; retry.hidden = true; load.hidden = false;
    vid.preload = 'auto'; vid.src = VIDEO_SRC + (deneme ? '?t=' + Date.now() : ''); vid.load();
    bekci = setTimeout(() => { if (vid.readyState < 1) hata('Video geç yükleniyor. İnternetini kontrol edip tekrar dene.'); }, 15000);
  };
  vid.addEventListener('loadedmetadata', () => {
    clearTimeout(bekci); load.hidden = true;
    if (vid.videoWidth && vid.videoHeight) { wrap.style.aspectRatio = vid.videoWidth + ' / ' + vid.videoHeight; wrap.classList.toggle('dikey', vid.videoHeight > vid.videoWidth); }
  });
  vid.addEventListener('canplay', () => { load.hidden = true; note.hidden = true; });
  vid.addEventListener('error', () => {
    const k = vid.error ? vid.error.code : 0;
    hata(k === 4 ? VIDEO_SRC + ' oynatılamadı: dosya yok ya da biçim desteklenmiyor (H.264 + AAC .mp4 olmalı).' : VIDEO_SRC + ' yüklenirken hata oluştu.');
  });
  retry.onclick = () => { deneme++; kur(); };

  if (MUZIK_MODU === 'sustur') {
    const bgm = $('#bgm'); let sustuk = false, kayit = 0;
    const duraklat = () => { if (sustuk || !bgm || bgm.paused) return; sustuk = true; kayit = bgm.currentTime; bgm.pause(); };
    const surdur = () => {
      if (!sustuk || !bgm) return; sustuk = false; const t = kayit;
      bgm.addEventListener('playing', () => { if (t > 2 && bgm.currentTime < t - 1.5) { try { bgm.currentTime = t; } catch (_) { /* geç */ } } }, { once: true });
      const p = bgm.play(); if (p && p.catch) p.catch(() => {});
    };
    vid.addEventListener('play', () => { if (!vid.muted) duraklat(); });
    vid.addEventListener('volumechange', () => { if (vid.paused) return; vid.muted ? surdur() : duraklat(); });
    vid.addEventListener('pause', surdur); vid.addEventListener('ended', surdur);
  }
  const goster = () => { if (wish.classList.contains('on')) setTimeout(() => { s.hidden = false; if (!kuruldu) { kuruldu = true; kur(); } }, reduced ? 200 : 1800); };
  new MutationObserver(goster).observe(wish, { attributes: true, attributeFilter: ['class'] }); goster();
}

[sahneTunel, sahneKaranlik, sahneDarla, sahneCerceve, sahneVideo].forEach(guvenli);
(window.__ok = window.__ok || []).push('shitpost2');
})();
