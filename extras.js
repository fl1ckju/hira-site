/* extras.js — Behind the Scenes: Hira'nın Gayriresmî Arşivi.
   Tamamen bağımsız: ana hikâye betiklerine (app.js, finale.js…) ihtiyaç duymaz. Gerekenler: content.js, fx.js.
   Bir seferde tek etkinlik açılır; sayfa tek uzun akışa dönüşmez. Tüm yazılar aşağıdaki sabitlerde. */
(() => {
'use strict';
const C = window.CONTENT || {};
const FX = window.FX || { burst() {}, kutlama() {}, spark() {} };
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const make = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const vib = p => { try { if (!reduced && navigator.vibrate) navigator.vibrate(p); } catch (_) { /* desteklenmiyor */ } };
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pad3 = n => String(n).padStart(3, '0');
const yeniden = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

/* ======================= METİNLER ======================= */
const VIDEO_SRC = 'video.mp4';
const PUNCH = 'saka saka orospu cocu';
const MOODS = [
  ['"Görüldü" atma modu', 97], ['Pasta radarı açık', 100], ['Sabır yükleniyor… (şarj yok)', 12],
  ['Uyku kapalı, laf açık', 93], ['Sessiz ama kafasında seni yargılıyor', 81], ['"Bunu duymadım" yüzü', 84],
  ['Kahve olmadan insan değil', 88], ['Kendi kendine gülüyor (şüpheli)', 90], ['Yemek ısmarla krizi', 99], ['Yürüyen yorum satırı', 96]
];
const TETIK = [['☕', 'Kahve', [70, 40, 75, 60]], ['🍰', 'Pasta', [100, 55, 20, 35]], ['😴', 'Uyku', [40, 25, 85, 90]], ['📱', 'Mesaj', [55, 15, 70, 95]]];
const METRIK = ['Pasta aşkı', 'Sabır', 'Sinir', 'Göz devirme'];
const MOOD_YORUM = ['Rapor: Hira bugün de Hira.', 'Doktor: "Normal." Ben: "Hayır."', 'Not: Bu cihaz hatalı çalışmaz, Hira hatalı çalışır.', 'Sonuç mahkemeye sunulabilir.', 'Ölçüm bitti. Cihaz biraz yoruldu.'];
const ILK_SUC = 'Mesajlara üç gün sonra "ya bakmamışım" diye dönmek';
const SUCLAR = [
  'Son pasta dilimini "tadına bakıyorum" diyerek bitirmek', 'Her fotoğrafta iyi çıkıp beni kötü göstermek',
  'En sessiz anda sebepsiz gülmek', 'Dürtülünce "ne var?" demek', 'Sessizce hep haklı çıkmak (sinir bozucu)',
  'Benim şakamı benden önce anlayıp gülmemek', 'Sipariş verirken benimkinden yemek', 'Kahveyi de uykuyu da ihmal etmek'
];
const DAMGA = ['YAKALANDIN!', 'HÂLÂ FİRARİ', '15 YAŞINDA', 'TEHLİKELİ', 'ÇOK DARLANMIŞ'];
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
const WIN = [
  ['❌', 'Hira.exe çalışmayı durdurdu.\nSebep: 15 yaşına girme işlemi (maalesef) başarılı.'],
  ['⚠️', 'Uyarı: Belleğin %99\'u pasta.\nDaha fazlası için lütfen biraz utancını sil.'],
  ['❓', 'Hata 0x23112011:\nBu kadar büyüme beklenmiyordu. Sistem şaşkın.']
];
const WIN_SON = ['🎉', 'Hira 15.0 yüklendi.\nYeni sürüm: +1 yaş, -0 olgunluk, +∞ orospu çocukluğu süresi.'];
const HEDIYE = [
  ['🧦', 'Tek bir çorap', 'Diğerini ben sakladım.'], ['🦆', 'Boy boy lastik ördek', 'Kullanım amacı: yok. Moral desteği: var.'],
  ['🥔', 'Üzerinde "HİRA" yazan patates çuvalı', 'Dayanıklı. Ağlatmaz. (Soyarken hariç.)'], ['🪴', 'Kendi kendine solan bir bitki', 'Sorumluluk dersi. Ücretsiz.'],
  ['📦', 'Boş bir kutu', 'Çocuklar bunu çok sever, deniyoruz.'], ['☕', 'Ömür boyu kahve aboneliği', 'Uyku payı dahil değildir.'],
  ['🚀', 'Mars\'ta bir arsa', 'Tapu bende. Güven bende.']
];
const SITE = ['🌐', 'Bu web sitesi', 'Kargo bedava · iade yok · hediye bu kadar.'];
const HATA_SATIRLARI = [
  ['Hafıza taranıyor…', 'HATA: "Sabır" klasörü boş. İçinde sadece "5 dakika daha" yazan bir not var.'],
  ['Olgunluk modülü aranıyor…', 'HATA 404: Olgunluk bulunamadı. Son görülme: hiç.'],
  ['Göz devirme motoru test ediliyor…', 'UYARI: Motor %400 verimle çalışıyor. Soğutma önerilir.'],
  ['Pasta yakıt seviyesi ölçülüyor…', 'KRİTİK: Depo ağzına kadar dolu. Kimse dokunamaz.'],
  ['Genel zekâ taranıyor…', 'TAMAM: Sorun yok. Zaten en büyük sorun bu.']
];

/* ======================= Fotoğraf havuzu (content.js'ten) ======================= */
const HAVUZ = (() => {
  const m = [...new Set([].concat(C.memories || [], C.gallery || [], C.reel || [], C.montage || []).map(p => p && p.src).filter(Boolean))];
  return m.length ? m : Array.from({ length: 17 }, (_, i) => 'photos/photo' + String(i + 1).padStart(2, '0') + '.jpg');
})();
function deste(dizi) { /* karışık deste: bitmeden tekrar etmez, art arda aynısı gelmez */
  let d = [], son = null;
  return () => {
    if (!d.length) { d = dizi.slice(); for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; } }
    let x = d.pop(); if (x === son && d.length) { const t = d.pop(); d.push(x); x = t; }
    return (son = x);
  };
}
const sonrakiFoto = deste(HAVUZ);
const PH = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#1a1533"/><rect x="40" y="40" width="720" height="920" fill="none" stroke="#d8c08f" stroke-opacity=".5"/><text x="400" y="510" text-anchor="middle" font-family="Georgia,serif" font-size="44" fill="#f6ecdf" letter-spacing="10">FOTOĞRAF</text></svg>');
function setFoto(img) { /* dosya yoksa başka kare dener, olmazsa yer tutucu */
  let n = 0; img.onerror = () => { if (n++ < 2) img.src = sonrakiFoto(); else { img.onerror = null; img.src = PH; } };
  img.src = sonrakiFoto();
}
const yeniFoto = () => { const im = new Image(); im.alt = ''; im.decoding = 'async'; setFoto(im); return im; };

/* ======================= Darlama sayacı (yalnızca bu sayfada) ======================= */
const SEV = [[0, 'sakin'], [8, 'hafif gergin'], [20, 'gözü seğiriyor'], [40, 'çay yetmiyor'], [65, 'ağlamak üzere'], [100, 'PES ETTİ']];
const chip = $('#chip'); let sayi = 0, patladi = false;
const art = k => {
  sayi += k; const y = Math.min(100, Math.round(sayi * 2));
  chip.textContent = 'darlama ' + sayi + ' · mühendis: ' + [...SEV].reverse().find(x => y >= x[0])[1];
  chip.classList.toggle('hot', y >= 65);
  if (y >= 100 && !patladi) { patladi = true; vib([40, 60, 40, 60, 80]); FX.burst(innerWidth / 2, innerHeight * .2); }
};

/* ======================= ETKİNLİKLER: her biri (host) alır, isteğe bağlı temizlik işlevi döndürür ======================= */
function aranıyor(h) {
  h.innerHTML = '<div class="poster" id="wPoster"><b class="ph">ARANIYOR</b><img class="pimg" alt=""><p class="ph2">HİRA</p><ul id="wCrimes"></ul><span class="stamp" id="wStamp"></span></div><button class="act" type="button" id="wBtn">Yeni suç ekle</button>';
  const img = $('.pimg', h), ul = $('#wCrimes', h), st = $('#wStamp', h), sS = deste(SUCLAR), sD = deste(DAMGA);
  const yenile = () => { setFoto(img); ul.replaceChildren(); [ILK_SUC, sS(), sS()].forEach(t => ul.append(make('li', '', t))); st.textContent = sD(); yeniden(st, 'hit'); vib([10, 30, 20]); };
  yenile(); $('#wPoster', h).onclick = yenile; $('#wBtn', h).onclick = yenile;
}

function ruhHali(h) {
  let chips = '', bars = '';
  TETIK.forEach((t, i) => { chips += '<button type="button" class="chp' + (i === 0 ? ' on' : '') + '">' + t[0] + ' ' + t[1] + '</button>'; });
  METRIK.forEach((m, i) => { bars += '<div class="mrow"><span>' + m + '</span><div class="bar"><i data-m="' + i + '"></i></div><small data-v="' + i + '">–</small></div>'; });
  h.innerHTML = '<div class="chips">' + chips + '</div><div class="card"><img class="pimg" alt=""><svg class="gauge" viewBox="0 0 120 70" aria-hidden="true"><path class="g0" d="M10 62A50 50 0 0 1 110 62" pathLength="100"/><path class="g1" id="mArc" d="M10 62A50 50 0 0 1 110 62" pathLength="100"/><text id="mNum" x="60" y="58" text-anchor="middle">–</text></svg><p class="label" id="mLab">Henüz ölçülmedi</p>' + bars + '<p class="note" id="mNote"></p></div><ul class="hist" id="mHist"></ul><button class="act" type="button" id="mBtn">Ölç bakalım</button>';
  const img = $('.pimg', h), lab = $('#mLab', h), arc = $('#mArc', h), num = $('#mNum', h), note = $('#mNote', h), hist = $('#mHist', h), btn = $('#mBtn', h);
  const sM = deste(MOODS), sY = deste(MOOD_YORUM), cb = $$('.chp', h); let sec = 0, iv = 0; setFoto(img);
  cb.forEach((b, i) => { b.onclick = () => { sec = i; cb.forEach(x => x.classList.toggle('on', x === b)); vib(8); }; });
  const ayarla = (pct, deg) => { arc.style.strokeDasharray = pct + ' 100'; num.textContent = pct ? '%' + pct : '–'; $$('.bar i', h).forEach((el, i) => { el.style.width = (deg ? deg[i] : 0) + '%'; $('small[data-v="' + i + '"]', h).textContent = deg ? '%' + deg[i] : '–'; }); };
  ayarla(0, null);
  btn.onclick = () => {
    if (btn.disabled) return; btn.disabled = true; vib([12, 40, 12]); lab.textContent = 'Ölçülüyor…'; note.textContent = ''; ayarla(0, null);
    let t = 0; iv = setInterval(() => {
      setFoto(img); arc.style.strokeDasharray = Math.round(rnd(10, 95)) + ' 100';
      if (++t >= (reduced ? 1 : 9)) {
        clearInterval(iv); const m = sM(), deg = TETIK[sec][2].map(v => clamp(Math.round(v + rnd(-14, 14)), 3, 100));
        lab.textContent = m[0]; yeniden(lab, 'flash'); ayarla(m[1], deg); note.textContent = sY();
        hist.prepend(make('li', '', TETIK[sec][0] + ' %' + m[1])); while (hist.children.length > 4) hist.lastChild.remove();
        btn.disabled = false; btn.textContent = 'Tekrar ölç'; vib(30);
      }
    }, 130);
  };
  return () => clearInterval(iv);
}

function darla(h) {
  h.innerHTML = '<div id="dRoot" data-lv="0"><div class="meter" aria-hidden="true"><i id="dMeter"></i></div><p class="lvl" id="dLvl">Hira: Sakin</p><div class="stage" id="dStage"><button class="big" type="button" id="dBtn">DARLA</button></div><p class="quote" id="dQuote">Düğmeye bas, Hira\'yı darla.</p><small>darlama sayısı: <b id="dN">0</b></small><p class="toast" id="dToast" aria-live="polite"></p></div>';
  const root = $('#dRoot', h), btn = $('#dBtn', h), stage = $('#dStage', h), q = $('#dQuote', h), nEl = $('#dN', h), met = $('#dMeter', h), lvl = $('#dLvl', h), toast = $('#dToast', h), sS = deste(SOZLER);
  let n = 0, sv = 0, basili = false, tmr = 0, kutlandi = false;
  const pop = () => {
    const eski = $$('.pop', stage); if (eski.length > 14) eski[0].remove();
    const im = yeniFoto(), a = rnd(-Math.PI * .95, -Math.PI * .05), d = rnd(110, 200);
    im.className = 'pop'; im.style.setProperty('--dx', Math.cos(a) * d + 'px'); im.style.setProperty('--dy', Math.sin(a) * d + 'px'); im.style.setProperty('--rot', rnd(-30, 30).toFixed(0) + 'deg');
    stage.append(im); im.addEventListener('animationend', () => im.remove());
  };
  const seviye = () => {
    let yeni = 0; SEVIYE.forEach((x, i) => { if (n >= x[0]) yeni = i; }); if (yeni === sv) return; sv = yeni;
    root.dataset.lv = sv; btn.textContent = SEVIYE[sv][2]; lvl.textContent = 'Hira: ' + SEVIYE[sv][1]; toast.textContent = SEVIYE[sv][3]; yeniden(toast, 'popin');
    const f = make('div', 'scr'); document.body.append(f); f.addEventListener('animationend', () => f.remove());
    vib(sv >= 4 ? [60, 40, 60, 40, 90] : [30, 40, 30]); const r = btn.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top);
    if (sv === SEVIYE.length - 1 && !kutlandi) { kutlandi = true; setTimeout(FX.kutlama, 350); }
  };
  const bas = () => {
    n++; art(3); nEl.textContent = n; q.textContent = sS(); yeniden(q, 'flash'); yeniden(stage, 'shake');
    met.style.width = Math.min(100, n / SEVIYE[SEVIYE.length - 1][0] * 100) + '%'; vib(sv >= 3 ? [14, 20, 14] : 10);
    const adet = reduced ? 1 : Math.min(4, 1 + Math.floor(sv / 1.5)) + (Math.random() < .4 ? 1 : 0); for (let i = 0; i < adet; i++) pop();
    if (n % 7 === 0) { const r = btn.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top); }
    seviye();
  };
  const tekrar = () => { if (!basili) return; bas(); tmr = setTimeout(tekrar, Math.max(80, 300 - n * 5)); };
  const birak = () => { basili = false; clearTimeout(tmr); };
  btn.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button !== 0) return; e.preventDefault(); basili = true; bas(); tmr = setTimeout(tekrar, 420); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(k => btn.addEventListener(k, birak));
  btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bas(); } });
  btn.addEventListener('contextmenu', e => e.preventDefault());
  return birak;
}

function tunel(h) {
  h.innerHTML = '<div class="tunnel" id="tunnel"><div class="tscene" id="tscene"></div><div class="tfog"></div><p class="tcount" id="tcount"></p></div>';
  const box = $('#tunnel', h), sc = $('#tscene', h), cnt = $('#tcount', h);
  const N = innerWidth < 600 ? 12 : 18, STEP = 250, DEPTH = N * STEP, planes = [];
  let W = box.clientWidth || 360, gecen = 0, hiz = 0, hedef = reduced ? 160 : 380, px = 0, py = 0, spx = 0, spy = 0, son = 0, canli = true, raf = 0;
  const yerles = p => { /* her tur farklı açı ve yarıçap: serbest bir sarmal */
    const a = p.k * 2.399963 + Math.sin(p.k * 0.7) * 0.6, R = W * (0.27 + 0.2 * Math.abs(Math.sin(p.k * 1.31)));
    p.x = Math.cos(a) * R; p.y = Math.sin(a) * R * 0.78; p.ry = -(p.x / R) * 26; p.rx = (p.y / R) * 16; p.rz = ((p.k * 37) % 13 - 6);
    p.el.style.setProperty('--w', (W * (0.27 + ((p.k * 17) % 7) / 60)).toFixed(0) + 'px'); p.el.replaceChildren(yeniFoto());
  };
  for (let i = 0; i < N; i++) { const el = make('div', 'tpl'); sc.append(el); const p = { el, k: i, z: -i * STEP + 160 }; planes.push(p); yerles(p); }
  const ciz = p => {
    const uzak = clamp((DEPTH + p.z) / (DEPTH * 0.42), 0, 1), yakin = p.z > 250 ? clamp((420 - p.z) / 170, 0, 1) : 1;
    p.el.style.opacity = (uzak * yakin).toFixed(3);
    p.el.style.transform = 'translate3d(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px,' + p.z.toFixed(1) + 'px) translate(-50%,-50%) rotateY(' + p.ry.toFixed(1) + 'deg) rotateX(' + p.rx.toFixed(1) + 'deg) rotateZ(' + p.rz + 'deg)';
  };
  const dongu = ts => {
    if (!canli) return; raf = requestAnimationFrame(dongu);
    if (document.hidden) { son = 0; return; }
    W = box.clientWidth || W; const dt = son ? Math.min(ts - son, 50) / 1000 : 0; son = ts;
    hiz += (hedef - hiz) * Math.min(1, dt * 3); spx += (px - spx) * Math.min(1, dt * 5); spy += (py - spy) * Math.min(1, dt * 5);
    sc.style.transform = 'rotateY(' + (spx * 14).toFixed(2) + 'deg) rotateX(' + (-spy * 9).toFixed(2) + 'deg)';
    planes.forEach(p => { p.z += hiz * dt; if (p.z > 420) { p.z -= DEPTH; p.k += N; yerles(p); gecen++; } ciz(p); });
    cnt.textContent = pad3(gecen + N) + ' kare';
  };
  const yon = e => { const r = box.getBoundingClientRect(); px = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1); py = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1); };
  box.addEventListener('pointermove', yon);
  box.addEventListener('pointerdown', e => { yon(e); hedef = reduced ? 400 : 1250; vib(10); });
  const birak = () => { hedef = reduced ? 160 : 380; px = py = 0; };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => box.addEventListener(n, birak));
  box.addEventListener('contextmenu', e => e.preventDefault());
  raf = requestAnimationFrame(dongu);
  return () => { canli = false; cancelAnimationFrame(raf); };
}

function hiraExe(h) {
  h.innerHTML = '<div class="win" id="win"><div class="wbar"><span>Hira.exe</span><button type="button" id="wX" aria-label="Kapat">✕</button></div><div class="wbody"><span class="wico" id="wIco"></span><p id="wMsg"></p></div><div class="wprog" id="wProg" hidden><i></i></div><div class="wbtns" id="wBtns"><button type="button">Tamam</button><button type="button">İptal</button><button type="button">Yeniden dene</button></div></div>';
  const win = $('#win', h), ico = $('#wIco', h), msg = $('#wMsg', h), prog = $('#wProg', h), bar = prog.firstElementChild, btns = $$('#wBtns button', h);
  let k = 1, mesgul = false, zm = 0; const goster = (e, t) => { ico.textContent = e; msg.textContent = t; }; goster(...WIN[0]);
  const ilerle = () => {
    if (mesgul) return; vib(12); if (k < WIN.length) { goster(...WIN[k++]); return; }
    mesgul = true; btns.forEach(b => { b.disabled = true; }); goster('⏳', 'Hira.exe yeniden başlatılıyor…');
    prog.hidden = false; bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth; bar.style.transition = 'width ' + (reduced ? .3 : 2.4) + 's steps(14)'; bar.style.width = '100%';
    zm = setTimeout(() => { prog.hidden = true; goster(...WIN_SON); btns.forEach(b => { b.disabled = false; }); mesgul = false; k = 0; vib([20, 60, 30]); const r = win.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + 40); }, reduced ? 400 : 2600);
  };
  btns.forEach(b => { b.onclick = ilerle; });
  $('#wX', h).onclick = () => { if (mesgul) return; goster('🚫', 'Bu pencere doğum günü boyunca kapatılamaz.\n(Hata 0x1511)'); yeniden(win, 'shake'); vib([30, 40, 30]); };
  return () => clearTimeout(zm);
}

function hediye(h) {
  h.innerHTML = '<div class="card gift" id="gNow"><span id="gEm">🎁</span><b id="gTi">Hira\'ya ne almalı?</b><small id="gSb"></small></div><ul class="glist" id="gList"></ul><button class="act" type="button" id="gBtn">Öneri getir</button>';
  const now = $('#gNow', h), em = $('#gEm', h), ti = $('#gTi', h), sb = $('#gSb', h), list = $('#gList', h), btn = $('#gBtn', h); let g = 0, onceki = null;
  const yaz = (a, fin) => { em.textContent = a[0]; ti.textContent = a[1]; sb.textContent = a[2]; now.classList.toggle('final', !!fin); yeniden(now, 'popin'); };
  btn.onclick = () => {
    vib(14);
    if (g > HEDIYE.length) { g = 0; onceki = null; list.replaceChildren(); now.classList.remove('final'); em.textContent = '🎁'; ti.textContent = 'Hira\'ya ne almalı?'; sb.textContent = ''; btn.textContent = 'Öneri getir'; return; }
    if (onceki) { const li = make('li'); li.append(make('span', '', onceki[1]), document.createTextNode(' — Hira: "hayır."')); list.append(li); }
    if (g < HEDIYE.length) { onceki = HEDIYE[g]; yaz(onceki); g++; btn.textContent = g === HEDIYE.length ? 'Peki ya…?' : 'Başka öneri'; return; }
    onceki = null; yaz(SITE, true); g++; btn.textContent = 'Baştan oynat'; vib([20, 60, 20, 60, 40]);
    const r = now.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2); setTimeout(FX.kutlama, 300);
  };
}

function tarama(h) {
  h.innerHTML = '<div class="term" id="term" aria-live="polite"><p>&gt; hira_tarama.exe hazır.</p></div><button class="act" type="button" id="tBtn">Taramayı başlat</button>';
  const term = $('#term', h), btn = $('#tBtn', h), dur = reduced ? 200 : 1500, hiz = reduced ? 0 : 42; let ivs = [], tos = [], canli = true;
  const bekle = (f, ms) => { tos.push(setTimeout(() => { if (canli) f(); }, ms)); };
  const yaz = (metin, cls, bitti) => {
    const p = make('p', cls || ''); term.append(p);
    if (!hiz) { p.textContent = metin; term.scrollTop = term.scrollHeight; if (bitti) bitti(); return p; }
    p.classList.add('typing'); let i = 0;
    const iv = setInterval(() => { p.textContent = metin.slice(0, ++i); term.scrollTop = term.scrollHeight; if (i >= metin.length) { clearInterval(iv); p.classList.remove('typing'); if (bitti) bitti(); } }, hiz); ivs.push(iv);
    return p;
  };
  btn.onclick = () => {
    if (btn.disabled) return; btn.disabled = true; term.replaceChildren(); vib([12, 40, 12]); let i = 0;
    const dene = () => {
      if (i >= HATA_SATIRLARI.length) {
        bekle(() => yaz('> Nihai rapor:', '', () => bekle(() => {
          const p = yaz(PUNCH, 'punch', () => { vib([30, 60, 30, 60, 60]); const r = p.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top); btn.disabled = false; btn.textContent = 'Tekrar tara (boşuna)'; });
          yeniden(p, 'popin');
        }, dur * .6)), dur); return;
      }
      const e = HATA_SATIRLARI[i++];
      yaz('> ' + e[0], '', () => bekle(() => yaz('  ' + e[1], 'bad', () => { vib(20); bekle(dene, dur); }), dur * .7));
    };
    bekle(() => yaz('> hira_tarama.exe başlatılıyor…', '', dene), dur * .4);
  };
  return () => { canli = false; ivs.forEach(clearInterval); tos.forEach(clearTimeout); };
}

function video(h) {
  h.innerHTML = '<div class="vwrap" id="vWrap"><video id="vid" controls playsinline preload="none"></video><div class="vload" id="vLoad">Video yükleniyor…</div></div><p class="note" id="vNote" hidden></p><button class="act" type="button" id="vRetry" hidden>Tekrar dene</button>';
  const vid = $('#vid', h), wrap = $('#vWrap', h), load = $('#vLoad', h), note = $('#vNote', h), retry = $('#vRetry', h); let bekci = 0, deneme = 0;
  const hata = m => { load.hidden = true; note.hidden = false; note.textContent = m; retry.hidden = false; };
  const kur = () => { clearTimeout(bekci); note.hidden = true; retry.hidden = true; load.hidden = false; vid.preload = 'auto'; vid.src = VIDEO_SRC + (deneme ? '?t=' + Date.now() : ''); vid.load(); bekci = setTimeout(() => { if (vid.readyState < 1) hata('Video geç yükleniyor. İnternetini kontrol edip tekrar dene.'); }, 15000); };
  vid.addEventListener('loadedmetadata', () => { clearTimeout(bekci); load.hidden = true; if (vid.videoWidth && vid.videoHeight) { wrap.style.aspectRatio = vid.videoWidth + ' / ' + vid.videoHeight; wrap.classList.toggle('dikey', vid.videoHeight > vid.videoWidth); } });
  vid.addEventListener('canplay', () => { load.hidden = true; note.hidden = true; });
  vid.addEventListener('error', () => { const k = vid.error ? vid.error.code : 0; hata(k === 4 ? VIDEO_SRC + ' oynatılamadı: dosya yok ya da biçim desteklenmiyor (H.264 + AAC .mp4 olmalı).' : VIDEO_SRC + ' yüklenirken hata oluştu.'); });
  retry.onclick = () => { deneme++; kur(); };
  kur();
  return () => { clearTimeout(bekci); try { vid.pause(); } catch (_) { /* geç */ } vid.removeAttribute('src'); vid.load(); };
}

/* ======================= Arşiv menüsü ve gezinme ======================= */
const ACTS = [
  ['Aranıyor', 'Suç listesi, damga, poster.', aranıyor],
  ['Ruh Hali Ölçer™', 'Bilimsel değil. Ama yalan da değil.', ruhHali],
  ['Darlama Butonu', 'Basma. (Bas.)', darla],
  ['Anılar Arasında Gez', 'Fotoğrafların arasından uçuş.', tunel],
  ['Hira.exe', 'Sistem mesajı.', hiraExe],
  ['Hira\'ya Ne Alsak?', 'Öneriler. Hepsi reddedilecek.', hediye],
  ['Sistem Taraması v15.0', 'Terminal. Sonuç belli.', tarama],
  ['Bonus Video', 'Kendi sesiyle oynar.', video]
];
const menu = $('#menu'), panel = $('#panel'), head = $('#head'), pbody = $('#pbody'); let temizle = null;
ACTS.forEach((a, i) => {
  const li = make('li'), b = make('button'); b.type = 'button';
  b.innerHTML = '<b>' + String(i + 1).padStart(2, '0') + '</b><span><strong></strong><small></small></span>';
  $('strong', b).textContent = a[0]; $('small', b).textContent = a[1]; b.onclick = () => ac(i); li.append(b); menu.append(li);
});
function ac(i) {
  kapat(false); const a = ACTS[i];
  $('#ptitle').textContent = a[0]; $('#psub').textContent = a[1];
  head.hidden = true; menu.hidden = true; panel.hidden = false; scrollTo(0, 0);
  try { temizle = a[2](pbody) || null; } catch (e) { console.error('extras.js:', e); pbody.textContent = 'Bu etkinlik açılamadı.'; }
}
function kapat(goster) {
  if (temizle) { try { temizle(); } catch (_) { /* geç */ } temizle = null; }
  pbody.replaceChildren();
  if (goster) { panel.hidden = true; head.hidden = false; menu.hidden = false; scrollTo(0, 0); }
}
$('#back').onclick = () => kapat(true);
document.addEventListener('click', () => { if (!panel.hidden) art(1); }, true); /* her dokunuş sayılır */
(window.__ok = window.__ok || []).push('extras');
})();