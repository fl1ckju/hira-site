/* mood.js — "Hira Ruh Hali Ölçer™" ayrı sayfa + ara durak sayfası + gezinme
   Akış: Aranıyor (#ch3) → [Devam et] → Ara durak (#ch35) → Ölçüm odası (#ch36) → [Devam et] → Bilmeni İstediklerim (#ch4)
   app.js'e dokunulmaz: ch3'teki "Devam et" (#to4) tıklaması burada yakalanır; asıl #ch4 geçişi app.js'in kendi #to4 işleyicisiyle yapılır.
   shitpost.js'ten SONRA yüklenir. Bir şey ters giderse #to4 eskisi gibi doğrudan #ch4'e götürür (bu dosya yüklenmezse hiçbir şey değişmez). */
(() => {
'use strict';
const S = window.__shx;
if (!S) { console.error('mood.js: shitpost.js yüklenmeden çalıştı'); return; }
const { $, $$, make, vib, reduced, yeniden, guvenli, deste, setFoto, blok, sayac, rnd } = S;

/* ======================= YAZILAR (perde yazıları) ======================= */
const YAZI_ARA = 'Bir dakika…', YAZI_ODA = 'Ölçüm başlıyor…', YAZI_GERI = 'Ara durak…';

/* ======================= Ruh hali sabitleri (shitpost.js'ten taşındı) ======================= */
const MOODS = [
  ['"Görüldü" atma modu', 97], ['Pasta radarı açık', 100], ['Sabır yükleniyor… (şarj yok)', 12],
  ['Uyku kapalı, laf açık', 93], ['Sessiz ama kafasında seni yargılıyor', 81], ['"Bunu duymadım" yüzü', 84],
  ['Kahve olmadan insan değil', 88], ['Kendi kendine gülüyor (şüpheli)', 90], ['Yemek ısmarla krizi', 99], ['Yürüyen yorum satırı', 96]
];
/* tetikleyici → [pasta aşkı, sabır, sinir, göz devirme] taban değerleri */
const TETIK = [['☕', 'Kahve', [70, 40, 75, 60]], ['🍰', 'Pasta', [100, 55, 20, 35]], ['😴', 'Uyku', [40, 25, 85, 90]], ['📱', 'Mesaj', [55, 15, 70, 95]]];
const METRIK = ['Pasta aşkı', 'Sabır', 'Sinir', 'Göz devirme'];
const MOOD_YORUM = ['Rapor: Hira bugün de Hira.', 'Doktor: "Normal." Ben: "Hayır."', 'Not: Bu cihaz hatalı çalışmaz, Hira hatalı çalışır.', 'Sonuç mahkemeye sunulabilir.', 'Ölçüm bitti. Cihaz biraz yoruldu.'];


/* ======================= RUH HALİ ÖLÇER (shitpost.js'ten TAŞINDI, işleyişi aynı): artık #ch36 sayfasında ======================= */
function sahneMood(olcumSonrasi) {
  const host = $('#moodHost'); if (!host) return;
  let chips = '', bars = '';
  TETIK.forEach((t, i) => { chips += '<button type="button" class="shx-chp' + (i === 0 ? ' on' : '') + '" data-i="' + i + '"><span>' + t[0] + '</span>' + t[1] + '</button>'; });
  METRIK.forEach((m, i) => { bars += '<div class="shx-mrow"><span>' + m + '</span><div class="shx-bar"><i data-m="' + i + '"></i></div><small data-v="' + i + '">–</small></div>'; });
  const s = blok('shx-mood', 'Hira Ruh Hali Ölçer™', 'Bilimsel değil. Ama yalan da değil. Önce tetikleyiciyi seç, sonra ölç.',
    '<div class="shx-chips" id="moodChips">' + chips + '</div>' +
    '<div class="shx-card shx-mcard"><img class="shx-img" alt="">' +
    '<svg class="shx-gauge" viewBox="0 0 120 70" aria-hidden="true"><path d="M10 62A50 50 0 0 1 110 62" pathLength="100" class="g0"/><path id="moodArc" d="M10 62A50 50 0 0 1 110 62" pathLength="100" class="g1"/><text id="moodNum" x="60" y="58" text-anchor="middle">–</text></svg>' +
    '<p class="shx-label" id="moodLabel">Henüz ölçülmedi</p><div class="shx-mstats">' + bars + '</div><p class="shx-mnote" id="moodNote"></p></div>' +
    '<ul class="shx-hist" id="moodHist"></ul><button class="btn" type="button" id="moodBtn">Ölç bakalım</button>');
  host.append(s);
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
        btn.disabled = false; btn.textContent = 'Tekrar ölç'; vib(30); sayac.art(1); if (olcumSonrasi) olcumSonrasi();
      }
    }, 130);
  };
}


/* ======================= ARA DURAK (#ch35): mood sayfasına açılan sinematik kapı ======================= */
function sahneAraDurak() {
  const foto = $('#moodPhoto'); if (foto) setFoto(foto);
}

/* ======================= GEZİNME: #ch3 → #ch35 ⇄ #ch36 → #ch4 ======================= */
function sahneGezinme() {
  const sahne = window.__sahne, ch2 = $('#ch2'), ch3 = $('#ch3'), ch4 = $('#ch4'), ch35 = $('#ch35'), ch36 = $('#ch36'), to4 = $('#to4');
  const to36 = $('#to36'), devam = $('#to4m'), geri = $$('.mood-back', ch36);
  if (!sahne || !ch2 || !ch3 || !ch4 || !ch35 || !ch36 || !to4 || !to36 || !devam || typeof to4.onclick !== 'function') { console.warn('mood.js: gezinme kurulamadı, akış eskisi gibi kalıyor'); return false; }
  const orijinalTo4 = to4.onclick; /* app.js'in #ch4'e geçişi (kur4 + perde yazısı dahil) */
  const h2 = el => $('h2', el);
  /* 1) ch3'teki "Devam et": doğrudan #ch4 yerine ara durağa */
  ch3.addEventListener('click', e => {
    if (e.defaultPrevented || !e.target.closest('#to4')) return;
    e.stopPropagation(); e.preventDefault(); vib(12);
    sahne([ch2, ch3], [ch35], h2(ch35), null, YAZI_ARA);
  }, true);
  /* 2) ara durak → ölçüm odası */
  to36.onclick = () => { vib(12); sahne([ch35], [ch36], h2(ch36), null, YAZI_ODA); };
  /* 3) ölçüm odası → ara durak (geri) */
  geri.forEach(b => { b.onclick = () => { vib(10); sahne([ch36], [ch35], h2(ch35), null, YAZI_GERI); }; });
  /* 4) ölçüm odası → asıl hikâye (#ch4): app.js'in kendi geçişi çalışır */
  devam.onclick = () => { devam.disabled = true; orijinalTo4(); };
  /* #ch4 açıldığı anda yeni sayfalar kapanır (perdenin ortasında, app.js'in değiştirdiği anda) */
  new MutationObserver(() => { if (!ch4.hidden) { ch35.hidden = true; ch36.hidden = true; } }).observe(ch4, { attributes: true, attributeFilter: ['hidden'] });
  return true;
}

/* ======================= Başlat ======================= */
guvenli(() => {
  const devam = $('#to4m');
  const gezinme = sahneGezinme();
  if (!gezinme) return; /* kurulamadıysa mood sayfası hiç açılmaz; eski akış sürer */
  sahneAraDurak();
  /* Yeni HİRA LABORATUVARI yüklüyse o çalışır; yüklenmediyse eski ölçer aynen sürer */
  (window.__lab ? (cb => window.__lab.kur($('#moodHost'), cb)) : sahneMood)(() => { if (devam && devam.hidden) { devam.hidden = false; yeniden(devam, 'shx-popin'); setTimeout(() => devam.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400); } });
});
(window.__ok = window.__ok || []).push('mood');
})();
