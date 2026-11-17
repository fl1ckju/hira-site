/* fun.js — Bonus bölüm (5 komik sahne) + final videosu.
   finale.js ve extra.js'ten SONRA yüklenir. Tüm yazılar aşağıdaki dizilerde: istediğin gibi düzenle. */
(() => {
'use strict';
const A = window.__app, sahne = window.__sahne;
if (!A || !sahne) { console.error('fun.js: app.js yüklenmeden çalıştı'); return; }
const { C, $, vib, reduced } = A, FX = A.FX || window.FX || {};
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- Metinler ---------- */
const MOODS = [
  ['Profesyonel Dürtme Seviyesi', 97], ['Kahve Bağımlısı', 88], ['Pasta Radarı Açık', 100],
  ['Sabır Yükleniyor… (Şarj Yok)', 12], ['"Görüldü" Atma Modu', 76], ['Uyku Kapalı · Laf Açık', 93],
  ['Sessiz Ama Her Şeyi Görüyor', 81], ['Rahat Bırak Beni Enerjisi', 69], ['Kendi Kendine Gülüyor (Şüpheli)', 90],
  ['Yürüyen Yorum Bölümü', 99], ['Pastaya Doğru Hızlanıyor', 95], ['"Bunu Duymadım" Yüz İfadesi', 84]
];
const ILK_SUC = 'Kalpleri çalmak ve insanları 7/24 çileden çıkarmak';
const SUCLAR = [
  'Mesajlara üç gün sonra cevap vermek', 'Son pasta dilimini "tadına bakıyorum" diyerek bitirmek',
  'Her fotoğrafta iyi çıkmak (kasıtlı)', 'Sebepsiz yere herkesi güldürmek', 'Sessizce hep haklı çıkmak',
  'Anlam veremediğimiz kadar iyi biri olmak', 'Dürtülünce "ne var?" demek', 'Kahveyi de uykuyu da ihmal etmek'
];
const DAMGA = ['YAKALANDI!', 'HÂLÂ FİRARİ', '15 YAŞINDA', 'TEHLİKELİ'];
const WIN = [
  ['❌', 'Hira.exe çalışmayı durdurdu.\nSorun: 15 yaşına girme işlemi başarıyla tamamlandı.'],
  ['⚠️', 'Uyarı: Belleğin %99\'u pasta ile dolu.\nDaha fazla pasta için bir şeyi sil.'],
  ['❓', 'Hata 0x23112011:\nBu kadar büyüme beklenmiyordu.'],
  ['⛔', 'Sistem Hira\'yı durduramadı.\nÇünkü bugün onun günü.'],
  ['❌', 'Hira.exe yanıt vermiyor.\nBelki vermek istemiyordur. Bunu da anlıyoruz.'],
  ['⚠️', 'Kritik: Doğum günü hediyesi bulunamadı.\nYerine bu web sitesi kullanıldı.']
];
const WIN_SON = ['🎉', 'Hira 15.0 yüklendi.\nYeni sürüm: +1 yaş, −0 sabır, +∞ pasta.'];
const SOZLER = [
  'Yaş 15 ama enerji hâlâ "5 dakika daha" seviyesinde.', 'Bugün pasta senin; sınırsız laf bizim.',
  '15 olmuşsun, göz devirme becerin hâlâ üst düzey.', 'Mum üflerken dilek tut. "Daha çok pasta" deme, yedik zaten.',
  'Bugün senin günün; kimse seninle tartışmaz. İstisna: ben.', 'Seni darlıyorum çünkü sevdiklerime bunu yaparım. Yasal uyarı.',
  'Yaşlanmak mı? Hayır, sadece sürüm güncellemesi.', 'Doğum günün kutlu olsun; ama kahveyi yine ben ödemiyorum.',
  'Hira: dünyanın en sakin insanı. (Sakin: dışarıdan.)', 'Tebrikler! Artık resmen "büyüdüm" diyebilirsin. Kimse inanmaz ama diyebilirsin.',
  'Bu düğmeye basmaya devam et. Seni kimse durduramaz. Ben bile.'
];
const HEDIYE = [
  ['🧦', 'Tek bir çorap', 'Diğerini ben sakladım.'], ['🦆', 'Boy boy lastik ördek', 'Kullanım amacı: yok. Moral desteği: var.'],
  ['🥔', 'Üzerinde "HİRA" yazan patates çuvalı', 'Dayanıklı. Ağlatmaz. (Soyarken hariç.)'], ['🪴', 'Kendi kendine solan bir bitki', 'Sorumluluk dersi. Ücretsiz.'],
  ['📦', 'Boş bir kutu', 'Çocuklar bunu çok sever, deniyoruz.'], ['☕', 'Ömür boyu kahve aboneliği', 'Uyku payı dahil değildir.'],
  ['🚀', 'Mars\'ta bir arsa', 'Tapu bende. Güven bende.']
];
const SITE = ['🌐', 'Bu web sitesi', 'Kargo bedava · iade yok · üzerinde senin adın yazıyor 🤍'];

/* ---------- Fotoğraf havuzu: photolist.js (ALLPHOTOS) varsa o, yoksa content.js kareleri, yoksa photo01–17 ---------- */
const HAVUZ = (() => {
  if (window.ALLPHOTOS && window.ALLPHOTOS.length) return [...new Set(window.ALLPHOTOS)];
  const m = [...new Set([].concat(C.memories || [], C.gallery || [], C.reel || [], C.montage || []).map(p => p && p.src).filter(Boolean))];
  return m.length ? m : Array.from({ length: 17 }, (_, i) => 'photos/photo' + String(i + 1).padStart(2, '0') + '.jpg');
})();
/* Karışık deste: bitmeden aynı öğe tekrar gelmez, art arda aynısı gelmez */
function deste(dizi) {
  let d = [], son = null;
  return () => {
    if (!d.length) { d = dizi.slice(); for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; } }
    let x = d.pop(); if (x === son && d.length) { const t = d.pop(); d.push(x); x = t; }
    return (son = x);
  };
}
const sonrakiFoto = deste(HAVUZ);
function setFoto(img) { /* dosya bulunamazsa başka kare dener */
  let n = 0; img.onerror = () => { if (n++ < 3) img.src = sonrakiFoto(); };
  img.src = sonrakiFoto();
}
const yeniden = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

/* ---------- Sahne akışı: karanlık oda → BONUS → mektup ---------- */
const fun = $('#fun'), b46 = $('#ch46'), b5 = $('#ch5'), to5m = $('#to5m'), funNext = $('#funNext');
if (!fun || !to5m) { console.error('fun.js: #fun ya da #to5m bulunamadı'); return; }
to5m.onclick = () => { to5m.disabled = true; sahne([b46], [fun], $('#fun h2'), kur, 'Biraz gülelim'); };
funNext.onclick = () => { funNext.disabled = true; sahne([fun], [b5], $('#envelope'), null, (C.intertitles || {}).c5); };

/* Bölümler ekrana girince belirir */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 }) : null;
$$('#fun .fx').forEach(el => io ? io.observe(el) : el.classList.add('in'));

let kurulu = false;
function kur() {
  if (kurulu) return; kurulu = true;
  kurMood(); kurWanted(); kurWin(); kurDarla(); kurHediye();
}

/* 1) Ruh hali simülatörü */
function kurMood() {
  const btn = $('#moodBtn'), img = $('#moodImg'), lab = $('#moodLabel'), bar = $('#moodBar'), pct = $('#moodPct'), wheel = $('#moodWheel');
  const sonraki = deste(MOODS); setFoto(img);
  btn.onclick = () => {
    if (btn.disabled) return; btn.disabled = true; vib([12, 40, 12]);
    wheel.classList.add('spin'); lab.textContent = 'Ölçülüyor…'; pct.textContent = ''; bar.style.width = '0%';
    let t = 0; const iv = setInterval(() => {
      setFoto(img);
      if (++t >= (reduced ? 1 : 8)) {
        clearInterval(iv); const m = sonraki();
        lab.textContent = m[0]; yeniden(lab, 'flash'); bar.style.width = m[1] + '%'; pct.textContent = 'ölçüm %' + m[1];
        wheel.classList.remove('spin'); btn.disabled = false; btn.textContent = 'Tekrar ölç'; vib(30);
      }
    }, 110);
  };
}

/* 2) Wanted posteri */
function kurWanted() {
  const poster = $('#wanted'), img = $('#wImg'), ul = $('#wCrimes'), st = $('#wStamp'), sonrakiSuc = deste(SUCLAR), sonrakiDamga = deste(DAMGA);
  const yenile = () => {
    setFoto(img); ul.replaceChildren();
    [ILK_SUC, sonrakiSuc(), sonrakiSuc()].forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
    st.textContent = sonrakiDamga(); yeniden(st, 'hit'); vib([10, 30, 20]);
  };
  yenile(); poster.onclick = yenile; $('#wBtn').onclick = yenile;
}

/* 3) Hira.exe penceresi */
function kurWin() {
  const win = $('#win'), ico = $('#winIco'), msg = $('#winMsg'), prog = $('#winProg'), bar = prog.firstElementChild, btns = $$('#winBtns button');
  let k = 0, mesgul = false;
  const goster = (e, t) => { ico.textContent = e; msg.textContent = t; };
  goster(...WIN[0]); k = 1;
  const ilerle = () => {
    if (mesgul) return; vib(12);
    if (k < WIN.length) { goster(...WIN[k++]); return; }
    mesgul = true; btns.forEach(b => { b.disabled = true; }); goster('⏳', 'Hira.exe yeniden başlatılıyor…');
    prog.hidden = false; bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth;
    bar.style.transition = 'width ' + (reduced ? .3 : 2.4) + 's steps(14)'; bar.style.width = '100%';
    setTimeout(() => {
      prog.hidden = true; goster(...WIN_SON); btns.forEach(b => { b.disabled = false; }); mesgul = false; k = 0; vib([20, 60, 30]);
      if (FX.burst) { const r = win.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + 40); }
    }, reduced ? 400 : 2600);
  };
  btns.forEach(b => { b.onclick = ilerle; });
  $('#winX').onclick = () => {
    if (mesgul) return; goster('🚫', 'Bu pencere doğum günü boyunca kapatılamaz.\n(Hata 0x1511)'); yeniden(win, 'shake'); vib([30, 40, 30]);
  };
}

/* 4) Darlama düğmesi */
function kurDarla() {
  const btn = $('#darlaBtn'), stage = $('#darlaStage'), q = $('#darlaQuote'), nEl = $('#darlaN'), sonrakiSoz = deste(SOZLER);
  let n = 0;
  const pop = () => {
    const eski = $$('.pop', stage); if (eski.length > 10) eski[0].remove();
    const im = new Image(), a = rnd(-Math.PI * .95, -Math.PI * .05), d = rnd(110, 190);
    im.className = 'pop'; im.alt = ''; im.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px'); im.style.setProperty('--dy', (Math.sin(a) * d).toFixed(0) + 'px');
    im.style.setProperty('--rot', rnd(-26, 26).toFixed(0) + 'deg'); setFoto(im); stage.append(im);
    im.addEventListener('animationend', () => im.remove());
  };
  btn.onclick = () => {
    n++; nEl.textContent = n; q.textContent = sonrakiSoz(); yeniden(q, 'flash'); yeniden(stage, 'shake'); vib([10, 30, 10]);
    const adet = reduced ? 1 : 2 + (Math.random() < .5 ? 1 : 0); for (let i = 0; i < adet; i++) pop();
    if (n % 7 === 0 && FX.burst) { const r = btn.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top); }
  };
}

/* 5) Hira'ya ne alınmalı? */
function kurHediye() {
  const now = $('#giftNow'), em = $('#giftEmoji'), ti = $('#giftTitle'), sb = $('#giftSub'), list = $('#giftList'), btn = $('#giftBtn');
  let g = 0, onceki = null;
  const yaz = (arr, final) => {
    em.textContent = arr[0]; ti.textContent = arr[1]; sb.textContent = arr[2];
    now.classList.toggle('final', !!final); yeniden(now, 'pop-in');
  };
  btn.onclick = () => {
    vib(14);
    if (g > HEDIYE.length) { g = 0; onceki = null; list.replaceChildren(); now.classList.remove('final'); em.textContent = '🎁'; ti.textContent = 'Hira\'ya ne almalı?'; sb.textContent = 'Düğmeye bas, öneriler gelsin.'; btn.textContent = 'Öneri getir'; return; }
    if (onceki) { const li = document.createElement('li'), s = document.createElement('span'); s.textContent = onceki[1]; li.append(s, document.createTextNode(' — Hira: "hayır."')); list.append(li); }
    if (g < HEDIYE.length) { onceki = HEDIYE[g]; yaz(onceki); g++; btn.textContent = g === HEDIYE.length ? 'Peki ya…?' : 'Başka öneri'; return; }
    onceki = null; yaz(SITE, true); g++; btn.textContent = 'Baştan oynat'; vib([20, 60, 20, 60, 40]);
    if (FX.burst) { const r = now.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2); if (FX.kutlama) setTimeout(FX.kutlama, 300); }
  };
}

/* ---------- Final videosu (video.mp4) ----------
   Görününce otomatik oynar. Önce sesli dener (kullanıcı siteye dokunduğu için çoğu tarayıcı izin verir);
   engellenirse sessiz başlar ve "Sesi aç" düğmesi çıkar. Video sesliyken arka plan müziği susar, video bitince/durunca geri döner. */
const vid = $('#finalVideo'), box = $('#finalvid'), unmute = $('#vidUnmute'), bgm = $('#bgm');
if (vid && box) {
  const muzikDur = () => { try { bgm && bgm.pause(); } catch (_) { /* müzik yoksa geç */ } };
  const muzikAc = () => { try { const p = bgm && bgm.play(); if (p && p.catch) p.catch(() => {}); } catch (_) { /* geç */ } };
  vid.addEventListener('play', () => { if (!vid.muted) muzikDur(); });
  vid.addEventListener('volumechange', () => { if (!vid.muted && !vid.paused) { muzikDur(); unmute.hidden = true; } });
  vid.addEventListener('pause', muzikAc);
  vid.addEventListener('ended', muzikAc);
  unmute.onclick = () => { vid.muted = false; unmute.hidden = true; muzikDur(); vid.play().catch(() => {}); };
  let oynadi = false;
  const baslat = () => {
    if (oynadi) return; oynadi = true;
    const p = vid.play();
    if (p && p.catch) p.catch(() => { vid.muted = true; vid.play().then(() => { unmute.hidden = false; }).catch(() => { /* kullanıcı kontrollerden başlatır */ }); });
  };
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) baslat(); }), { threshold: .6 }).observe(vid);
}

(window.__ok = window.__ok || []).push('fun');
})();
