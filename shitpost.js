/* shitpost.js (1/3) — ortak yardımcılar · açılış temizliği · köşe animasyonları · Aranıyor · Ruh Hali
   shitpost2.js ve shitpost3.js bunun yardımcılarını kullanır: önce bu dosya yüklenir. app.js, finale.js ve extra.js'ten SONRA gelir.
   Tüm yazılar aşağıdaki sabitlerde: istediğin gibi düzenle. */
(() => {
'use strict';
const A = window.__app;
if (!A) { console.error('shitpost.js: app.js yüklenmeden çalıştı'); return; }
const { C, $, make, vib, reduced } = A, FX = A.FX || window.FX || {};
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);
const yeniden = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
const guvenli = f => { try { f(); } catch (e) { console.error('shitpost.js:', e); } };

/* ======================= AYARLAR ======================= */
const BASLA_YAZISI = 'Başla';            /* açılış düğmesi */
const WANTED_GEREKEN = 2;                /* "Devam et" için eklenmesi gereken yeni suç sayısı */

/* ======================= METİNLER ======================= */
const MOODS = [
  ['"Görüldü" atma modu', 97], ['Pasta radarı açık', 100], ['Sabır yükleniyor… (şarj yok)', 12],
  ['Uyku kapalı, laf açık', 93], ['Sessiz ama kafasında seni yargılıyor', 81], ['"Bunu duymadım" yüzü', 84],
  ['Kahve olmadan insan değil', 88], ['Kendi kendine gülüyor (şüpheli)', 90], ['Yemek ısmarla krizi', 99], ['Yürüyen yorum satırı', 96]
];
/* tetikleyici → [pasta aşkı, sabır, sinir, göz devirme] taban değerleri */
const TETIK = [['☕', 'Kahve', [70, 40, 75, 60]], ['🍰', 'Pasta', [100, 55, 20, 35]], ['😴', 'Uyku', [40, 25, 85, 90]], ['📱', 'Mesaj', [55, 15, 70, 95]]];
const METRIK = ['Pasta aşkı', 'Sabır', 'Sinir', 'Göz devirme'];
const MOOD_YORUM = ['Rapor: Hira bugün de Hira.', 'Doktor: "Normal." Ben: "Hayır."', 'Not: Bu cihaz hatalı çalışmaz, Hira hatalı çalışır.', 'Sonuç mahkemeye sunulabilir.', 'Ölçüm bitti. Cihaz biraz yoruldu.'];

const WCARDS = [
  ['ŞÜPHELİ No. 1', ['Pasta başında en son görüldü.', 'Elinde suç aleti: çatal.', 'İfadesi: "Ben sadece tadına baktım."']],
  ['ŞÜPHELİ No. 2', ['Çok sessiz. Şüphe uyandıracak kadar.', 'Gülüyor. Sebebi bilinmiyor. Korkutucu.', '"Görüldü" atıp kaçarken yakalandı.']],
  ['ŞÜPHELİ No. 3', ['Kahve molasında firar etti.', 'Göz devirirken kameraya yakalandı.', 'Her fotoğrafta iyi çıkmaktan sabıkalı.']]
];
const ILK_SUC = 'Mesajlara üç gün sonra "ya bakmamışım" diye dönmek';
const SUCLAR = [
  'Son pasta dilimini "tadına bakıyorum" diyerek bitirmek', 'Her fotoğrafta iyi çıkıp beni kötü göstermek',
  'En sessiz anda sebepsiz gülmek', 'Dürtülünce "ne var?" demek', 'Sessizce hep haklı çıkmak (sinir bozucu)',
  'Benim şakamı benden önce anlayıp gülmemek', 'Sipariş verirken benimkinden yemek', 'Kahveyi de uykuyu da ihmal etmek',
  'Göz devirme sanatını resmî eğitimle geliştirmek', 'Bu siteyi görünce "hmm" demek'
];
const DAMGA = ['YAKALANDIN!', 'HÂLÂ FİRARİ', '15 YAŞINDA', 'TEHLİKELİ', 'ÇOK DARLANMIŞ', 'SABIKALI'];

/* ======================= Fotoğraf yardımcıları ======================= */
const HAVUZ = (() => {
  const liste = (window.ALLPHOTOS && window.ALLPHOTOS.length) ? window.ALLPHOTOS.slice() : [].concat(C.memories || [], C.gallery || [], C.reel || [], C.montage || []).map(p => p && p.src);
  const m = [...new Set(liste.filter(Boolean))];
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
function setFoto(img) { let n = 0; img.onerror = () => { if (n++ < 3) img.src = sonrakiFoto(); }; img.src = sonrakiFoto(); }

/* ======================= Yerleştirme ======================= */
function blok(id, baslik, alt, html) {
  const s = make('section', 'shx'); s.id = id;
  s.innerHTML = '<h3>' + baslik + '</h3>' + (alt ? '<p class="shx-sub">' + alt + '</p>' : '') + html;
  return s;
}
function yerlestir(el, ref, mod) {
  const r = typeof ref === 'string' ? $(ref) : ref;
  if (!r) { console.warn('shitpost.js: yer bulunamadı → ' + ref); return false; }
  if (mod === 'before') r.before(el); else r.after(el);
  return true;
}
/* bir bölüm her görünür olduğunda fn çalışır (hidden niteliğini izler) */
function acilinca(el, fn) {
  if (!el) return;
  let onceki = !el.hidden; if (onceki) fn();
  new MutationObserver(() => { const simdi = !el.hidden; if (simdi && !onceki) fn(); onceki = simdi; }).observe(el, { attributes: true, attributeFilter: ['hidden'] });
}

/* ======================= Darlama sayacı + mühendis stres seviyesi (gizli yumurta) ======================= */
const sayac = (() => {
  const SEV = [[0, 'mühendis: sakin'], [8, 'mühendis: hafif gergin'], [20, 'mühendis: gözü seğiriyor'], [40, 'mühendis: çay yetmiyor'], [65, 'mühendis: ağlamak üzere'], [100, 'mühendis: PES ETTİ']];
  const chip = make('div', 'shx-chip'); chip.hidden = true; chip.setAttribute('aria-hidden', 'true');
  chip.innerHTML = '<span>darlama <b>0</b></span><i><u></u></i><span class="t">mühendis: sakin</span>';
  document.body.append(chip);
  const nEl = chip.querySelector('b'), bar = chip.querySelector('u'), tx = chip.querySelector('.t'), story = $('#story');
  let n = 0, patladi = false;
  const art = k => {
    n += k; nEl.textContent = n; const yuzde = Math.min(100, Math.round(n * 2)); bar.style.width = yuzde + '%';
    tx.textContent = [...SEV].reverse().find(x => yuzde >= x[0])[1];
    chip.classList.toggle('hot', yuzde >= 65); yeniden(chip, 'shx-tik');
    if (yuzde >= 100 && !patladi) { patladi = true; vib([40, 60, 40, 60, 80]); if (FX.burst) FX.burst(innerWidth * .5, innerHeight * .2); }
  };
  document.addEventListener('click', () => { if (story && !story.hidden) { chip.hidden = false; art(1); } }, true);
  return { art };
})();

window.__shx = { A, C, $, $$, make, vib, reduced, FX, rnd, yeniden, guvenli, deste, sonrakiFoto, setFoto, blok, yerlestir, acilinca, sayac, HAVUZ };

/* ======================= 0) AÇILIŞ: kulaklık yazısı kalktı, düğme "Başla" ======================= */
function sahneGiris() {
  const snd = $('.sound'); if (snd) snd.remove();
  const st = $('#start'); if (st) st.textContent = BASLA_YAZISI;
}

/* ======================= 0b) KÖŞE ANİMASYONLARI: köşeden bakan cüce + düşen yapraklar + yıldız pırıltısı ======================= */
const CUCE = '<svg viewBox="0 0 80 112" focusable="false"><defs><radialGradient id="shxg"><stop offset="0" stop-color="#ff69ab" stop-opacity=".8"/><stop offset="1" stop-color="#ff69ab" stop-opacity="0"/></radialGradient></defs>' +
  '<circle class="gl" cx="16" cy="98" r="24" fill="url(#shxg)"/>' +
  '<g class="g-body"><path d="M20 112c0-28 8-42 20-42s20 14 20 42z" fill="#fe4f8a"/><path d="M26 90c9 6 19 6 28 0" stroke="#f4ecdc" stroke-width="2" fill="none" opacity=".7"/>' +
  '<ellipse cx="31" cy="111" rx="8" ry="3.5" fill="#3a2f2a"/><ellipse cx="49" cy="111" rx="8" ry="3.5" fill="#3a2f2a"/>' +
  '<circle cx="40" cy="62" r="12" fill="#f0c4b0"/><path d="M27 63c2 24 24 24 26 0c-6 6-20 6-26 0z" fill="#f4ecdc"/><circle cx="40" cy="64" r="3.4" fill="#e096a7"/>' +
  '<circle cx="35" cy="59" r="1.4" fill="#0b1426"/><circle cx="45" cy="59" r="1.4" fill="#0b1426"/>' +
  '<path d="M23 57C26 30 36 10 50 4c1 16 5 34 8 53z" fill="#ff69ab"/><ellipse cx="40" cy="57" rx="18" ry="4.4" fill="#fe4f8a"/><circle cx="50" cy="5" r="4.6" fill="#f4ecdc"/></g>' +
  '<g class="g-lamp"><path d="M22 92q-8 2-9 8" stroke="#fe4f8a" stroke-width="6" stroke-linecap="round" fill="none"/><rect x="7" y="98" width="12" height="14" rx="2.5" fill="#ffd0e2" opacity=".9"/><rect x="9.5" y="94" width="7" height="4" fill="#e096a7"/><circle cx="13" cy="105" r="3" fill="#fe4f8a"/></g>' +
  '<g class="g-arm"><path d="M56 88q10-4 12-16" stroke="#fe4f8a" stroke-width="6.5" stroke-linecap="round" fill="none"/><circle cx="68" cy="70" r="4.4" fill="#f4ecdc"/></g></svg>';
function sahneOrtam() {
  const k = make('div', 'shx-corner'); k.setAttribute('aria-hidden', 'true');
  let yaprak = '', yildiz = '';
  for (let i = 0; i < 9; i++) yaprak += '<i style="--x:' + (8 + i * 10.5).toFixed(0) + '%;--d:' + (11 + (i * 3) % 8) + 's;--w:' + (-(i * 2.7)).toFixed(1) + 's;--s:' + (0.6 + (i % 4) * 0.22).toFixed(2) + '"></i>';
  for (let i = 0; i < 6; i++) yildiz += '<b style="--y:' + (10 + i * 13) + '%;--w:' + (-(i * 1.3)).toFixed(1) + 's"></b>';
  k.innerHTML = '<div class="shx-gnome">' + CUCE + '</div><div class="shx-petals">' + yaprak + '</div><div class="shx-twk">' + yildiz + '</div>';
  document.body.append(k);
}

/* ======================= 1) ARANIYOR: yeniden tasarlandı — 3 şüpheli, her fotoğrafın altında yeni yazı, suç dosyası; 2 yeni suç eklenmeden "Devam et" yok ======================= */
function sahneWanted() {
  const to4 = $('#to4'); if (!to4) { console.warn('shitpost.js: #to4 yok'); return; }
  let kartlar = '';
  WCARDS.forEach((k, i) => { kartlar += '<figure class="shx-wc" data-i="' + i + '"><div class="shx-wph"><img alt=""><i class="shx-wtape"></i></div><b>' + k[0] + '</b><figcaption></figcaption></figure>'; });
  const s = blok('shx-wanted', 'Aranıyor', 'Kartlara dokun: fotoğraf değişir. Asıl iş aşağıda: dosyaya yeni suç ekle.',
    '<div class="shx-poster"><div class="shx-ban"><span>ARANIYOR</span><small>ölü ya da canlı (ama gülen)</small></div>' +
    '<div class="shx-wtrio" id="wTrio">' + kartlar + '</div>' +
    '<div class="shx-file"><h4>SUÇ DOSYASI · HİRA</h4><ol id="wCrimes"></ol><span class="shx-stamp" id="wStamp"></span></div>' +
    '<p class="shx-need" id="wNeed"></p></div>' +
    '<button class="btn" type="button" id="wBtn">Yeni suç ekle</button>');
  to4.before(s);
  to4.hidden = true; /* iki yeni suç eklenene kadar görünmez */
  s.addEventListener('pointerdown', e => e.stopPropagation()); /* "basılı tut, sayfa aksın" bu bloğu etkilemesin */
  const ul = $('#wCrimes'), st = $('#wStamp'), need = $('#wNeed'), btn = $('#wBtn');
  const sonrakiSuc = deste(SUCLAR), sonrakiDamga = deste(DAMGA), kart = $$('.shx-wc', s);
  let eklenen = 0;
  const yazKart = () => kart.forEach((el, i) => { const c = WCARDS[i][1]; $('figcaption', el).textContent = c[eklenen % c.length]; yeniden($('figcaption', el), 'shx-flash'); });
  kart.forEach(el => { setFoto($('img', el)); el.onclick = () => { setFoto($('img', el)); yeniden(el, 'shx-popin'); vib(10); }; });
  const satir = (t, yeni) => { const li = make('li', yeni ? 'yeni' : '', t); ul.append(li); return li; };
  const durum = () => { need.textContent = eklenen >= WANTED_GEREKEN ? 'Dosya tamam. Hira artık resmen sabıkalı.' : 'Yeni suç: ' + eklenen + ' / ' + WANTED_GEREKEN; btn.textContent = 'Yeni suç ekle (' + Math.min(eklenen, WANTED_GEREKEN) + '/' + WANTED_GEREKEN + ')'; };
  satir(ILK_SUC); satir(sonrakiSuc()); yazKart(); durum();
  btn.onclick = () => {
    eklenen++; satir(sonrakiSuc(), true); st.textContent = sonrakiDamga(); yeniden(st, 'shx-hit'); yazKart(); durum(); vib([10, 30, 20]); sayac.art(1);
    kart.forEach(el => setFoto($('img', el)));
    if (eklenen === WANTED_GEREKEN) {
      if (FX.burst) { const r = btn.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top); }
      to4.hidden = false; yeniden(to4, 'shx-popin'); setTimeout(() => to4.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
    }
  };
  return s;
}

/* ======================= 1b) RUH HALİ ÖLÇER: zengin sürüm, bölümün EN SONUNDA (Aranıyor'un altı, "Devam et"in üstü) ======================= */
function sahneMood() {
  const wanted = $('#shx-wanted'), to4 = $('#to4'); if (!to4) return;
  let chips = '', bars = '';
  TETIK.forEach((t, i) => { chips += '<button type="button" class="shx-chp' + (i === 0 ? ' on' : '') + '" data-i="' + i + '"><span>' + t[0] + '</span>' + t[1] + '</button>'; });
  METRIK.forEach((m, i) => { bars += '<div class="shx-mrow"><span>' + m + '</span><div class="shx-bar"><i data-m="' + i + '"></i></div><small data-v="' + i + '">–</small></div>'; });
  const s = blok('shx-mood', 'Hira Ruh Hali Ölçer™', 'Bilimsel değil. Ama yalan da değil. Önce tetikleyiciyi seç, sonra ölç.',
    '<div class="shx-chips" id="moodChips">' + chips + '</div>' +
    '<div class="shx-card shx-mcard"><img class="shx-img" alt="">' +
    '<svg class="shx-gauge" viewBox="0 0 120 70" aria-hidden="true"><path d="M10 62A50 50 0 0 1 110 62" pathLength="100" class="g0"/><path id="moodArc" d="M10 62A50 50 0 0 1 110 62" pathLength="100" class="g1"/><text id="moodNum" x="60" y="58" text-anchor="middle">–</text></svg>' +
    '<p class="shx-label" id="moodLabel">Henüz ölçülmedi</p><div class="shx-mstats">' + bars + '</div><p class="shx-mnote" id="moodNote"></p></div>' +
    '<ul class="shx-hist" id="moodHist"></ul><button class="btn" type="button" id="moodBtn">Ölç bakalım</button>');
  if (wanted) wanted.after(s); else to4.before(s); /* her zaman en sonda: to4'ün hemen üstü */
  s.addEventListener('pointerdown', e => e.stopPropagation());
  const img = $('.shx-img', s), lab = $('#moodLabel'), arc = $('#moodArc'), num = $('#moodNum'), note = $('#moodNote'), hist = $('#moodHist'), btn = $('#moodBtn');
  const sonraki = deste(MOODS), yorum = deste(MOOD_YORUM), cb = $$('.shx-chp', s);
  let sec = 0; setFoto(img);
  cb.forEach((b, i) => { b.onclick = () => { sec = i; cb.forEach(x => x.classList.toggle('on', x === b)); vib(8); }; });
  const ayarla = (pct, deg) => { arc.style.strokeDasharray = pct + ' 100'; num.textContent = pct === 0 ? '–' : '%' + pct; $$('.shx-mrow i', s).forEach((el, i) => { el.style.width = (deg ? deg[i] : 0) + '%'; $('small[data-v="' + i + '"]', s).textContent = deg ? '%' + deg[i] : '–'; }); };
  ayarla(0, null);
  btn.onclick = () => {
    if (btn.disabled) return; btn.disabled = true; vib([12, 40, 12]);
    lab.textContent = 'Ölçülüyor…'; note.textContent = ''; ayarla(0, null);
    let t = 0; const iv = setInterval(() => {
      setFoto(img); arc.style.strokeDasharray = Math.round(rnd(10, 95)) + ' 100';
      if (++t >= (reduced ? 1 : 9)) {
        clearInterval(iv); const m = sonraki();
        const deg = TETIK[sec][2].map(v => Math.max(3, Math.min(100, Math.round(v + rnd(-14, 14)))));
        lab.textContent = m[0]; yeniden(lab, 'shx-flash'); ayarla(m[1], deg); note.textContent = yorum();
        const li = make('li', '', TETIK[sec][0] + ' %' + m[1]); hist.prepend(li); while (hist.children.length > 4) hist.lastChild.remove();
        btn.disabled = false; btn.textContent = 'Tekrar ölç'; vib(30); sayac.art(1);
      }
    }, 130);
  };
}

/* ======================= Başlat ======================= */
[sahneGiris, sahneOrtam, sahneWanted, sahneMood].forEach(guvenli);
(window.__ok = window.__ok || []).push('shitpost');
})();
