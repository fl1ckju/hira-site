/* shitpost3.js (3/3) — makara efektleri · sistem mesajı (Hira.exe) · hediye · sistem taraması
   shitpost.js'ten SONRA yüklenir (yardımcılar window.__shx üzerinden). Tüm yazılar aşağıdaki sabitlerde: istediğin gibi düzenle. */
(() => {
'use strict';
const S = window.__shx;
if (!S) { console.error('shitpost3.js: shitpost.js yüklenmeden çalıştı'); return; }
const { $, $$, make, vib, reduced, FX, yeniden, guvenli, blok, yerlestir, acilinca } = S;
const PUNCH = 'saka saka orospu cocu';   /* tarama sahnesinin son cümlesi */

/* sistem mesajı: 3 mesaj (eskiden 6) → 2 dokunuş + yeniden başlatma */
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

/* tarama terminali: yavaş yazılır, her hata bir öncekinden daha saçma */
const HATA_SATIRLARI = [
  ['Hafıza taranıyor…', 'HATA: "Sabır" klasörü boş. İçinde sadece "5 dakika daha" yazan bir not var.'],
  ['Olgunluk modülü aranıyor…', 'HATA 404: Olgunluk bulunamadı. Son görülme: hiç.'],
  ['Göz devirme motoru test ediliyor…', 'UYARI: Motor %400 verimle çalışıyor. Soğutma önerilir.'],
  ['Pasta yakıt seviyesi ölçülüyor…', 'KRİTİK: Depo ağzına kadar dolu. Kimse dokunamaz.'],
  ['Genel zekâ taranıyor…', 'TAMAM: Sorun yok. Zaten en büyük sorun bu.']
];

/* ======================= 2) MAKARA: kareler önce hafifçe döner, sonra sistem mesajı çıkar; kareler rastgele 360° çevrilir ======================= */
function sahneMakara() {
  const ch45 = $('#ch45'), pj = $('#projector'); if (!ch45 || !pj) return;
  let zaman = 0, ilk = true;
  const cevir = () => {
    if (ch45.hidden || document.hidden) return;
    $$('.cell', pj).forEach(c => {
      const r = c.getBoundingClientRect(); if (r.right < 0 || r.left > innerWidth || Math.random() > 0.16) return;
      c.classList.remove('shx-f360'); void c.offsetWidth; c.classList.add('shx-f360');
      c.addEventListener('animationend', () => c.classList.remove('shx-f360'), { once: true });
    });
  };
  acilinca(ch45, () => {
    pj.classList.add('shx-spin');
    setTimeout(() => {
      pj.classList.remove('shx-spin');
      const win = $('#shx-win'); if (win && win.hidden) { win.hidden = false; yeniden(win, 'shx-popin'); } /* otomatik kaydırma kaldırıldı */
    }, reduced ? 700 : (ilk ? 4800 : 1200));
    ilk = false; clearInterval(zaman); if (!reduced) zaman = setInterval(cevir, 520);
  });
}

/* ======================= 3) SİSTEM MESAJI: Hira.exe penceresi — 2 dokunuşta yeniden başlar ======================= */
function sahneWin() {
  const s = blok('shx-win', 'Sistem Mesajı', '',
    '<div class="shx-win" id="spWin"><div class="shx-wbar"><span>Hira.exe</span><button type="button" id="winX" aria-label="Kapat">✕</button></div>' +
    '<div class="shx-wbody"><span class="shx-wico" id="winIco"></span><p id="winMsg"></p></div>' +
    '<div class="shx-wprog" id="winProg" hidden><i></i></div>' +
    '<div class="shx-wbtns" id="winBtns"><button type="button">Tamam</button><button type="button">İptal</button><button type="button">Yeniden dene</button></div></div>');
  const to46 = $('#to46'); if (!to46) { console.warn('shitpost.js: #to46 yok'); return; }
  to46.before(s); s.hidden = true; /* makara dönüşünden sonra açılır (sahneMakara) */
  const win = $('#spWin'), ico = $('#winIco'), msg = $('#winMsg'), prog = $('#winProg'), bar = prog.firstElementChild, btns = $$('#winBtns button');
  let k = 1, mesgul = false;
  const goster = (e, t) => { ico.textContent = e; msg.textContent = t; };
  goster(...WIN[0]);
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
  $('#winX').onclick = () => { if (mesgul) return; goster('🚫', 'Bu pencere doğum günü boyunca kapatılamaz.\n(Hata 0x1511)'); yeniden(win, 'shx-shake'); vib([30, 40, 30]); };
}

/* ======================= 4) HEDİYE: "Hira'ya ne alsak?" — son söz site ======================= */
function sahneHediye() {
  const s = blok('shx-gift', 'Hira\'ya Ne Alsak?', '',
    '<div class="shx-gift" id="giftNow"><span id="giftEmoji">🎁</span><b id="giftTitle">Hira\'ya ne almalı?</b><small id="giftSub"></small></div>' +
    '<ul class="shx-glist" id="giftList"></ul><button class="btn" type="button" id="giftBtn">Öneri getir</button>');
  const to6 = $('#to6'); if (!to6) { console.warn('shitpost.js: #to6 yok'); return; }
  to6.before(s);
  const now = $('#giftNow'), em = $('#giftEmoji'), ti = $('#giftTitle'), sb = $('#giftSub'), list = $('#giftList'), btn = $('#giftBtn');
  let g = 0, onceki = null;
  const yaz = (arr, final) => { em.textContent = arr[0]; ti.textContent = arr[1]; sb.textContent = arr[2]; now.classList.toggle('final', !!final); yeniden(now, 'shx-popin'); };
  btn.onclick = () => {
    vib(14);
    if (g > HEDIYE.length) { g = 0; onceki = null; list.replaceChildren(); now.classList.remove('final'); em.textContent = '🎁'; ti.textContent = 'Hira\'ya ne almalı?'; sb.textContent = ''; btn.textContent = 'Öneri getir'; return; }
    if (onceki) { const li = make('li'), sp = make('span', '', onceki[1]); li.append(sp, document.createTextNode(' — Hira: "hayır."')); list.append(li); }
    if (g < HEDIYE.length) { onceki = HEDIYE[g]; yaz(onceki); g++; btn.textContent = g === HEDIYE.length ? 'Peki ya…?' : 'Başka öneri'; return; }
    onceki = null; yaz(SITE, true); g++; btn.textContent = 'Baştan oynat'; vib([20, 60, 20, 60, 40]);
    if (FX.burst) { const r = now.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2); if (FX.kutlama) setTimeout(FX.kutlama, 300); }
  };
}

/* ======================= 5) SİSTEM TARAMASI: yazı yavaş akar, satırlar daha komik ======================= */
function sahneHata() {
  const s = blok('shx-err', 'Hira Sistem Taraması v15.0', 'Mektuba geçmeden önce Hira\'nın sistemini kontrol ediyoruz.',
    '<div class="shx-term" id="errTerm" aria-live="polite"><p>&gt; hira_tarama.exe hazır.</p></div>' +
    '<button class="btn" type="button" id="errBtn">Taramayı başlat</button>');
  if (!yerlestir(s, '#envwrap', 'before')) return;
  const term = $('#errTerm'), btn = $('#errBtn'), dur = reduced ? 200 : 1500, hiz = reduced ? 0 : 42;
  const yaz = (metin, cls, bitti) => {
    const p = make('p', cls || ''); term.append(p);
    if (!hiz) { p.textContent = metin; term.scrollTop = term.scrollHeight; if (bitti) bitti(); return p; }
    p.classList.add('shx-typing'); let i = 0;
    const iv = setInterval(() => { p.textContent = metin.slice(0, ++i); term.scrollTop = term.scrollHeight; if (i >= metin.length) { clearInterval(iv); p.classList.remove('shx-typing'); if (bitti) bitti(); } }, hiz);
    return p;
  };
  btn.onclick = () => {
    if (btn.disabled) return; btn.disabled = true; term.replaceChildren(); vib([12, 40, 12]);
    let i = 0;
    const dene = () => {
      if (i >= HATA_SATIRLARI.length) {
        setTimeout(() => yaz('> Nihai rapor:', '', () => setTimeout(() => {
          const p = yaz(PUNCH, 'shx-punch', () => { vib([30, 60, 30, 60, 60]); if (FX.burst) { const r = p.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top); } btn.disabled = false; btn.textContent = 'Tekrar tara (boşuna)'; });
          yeniden(p, 'shx-popin');
        }, dur * .6)), dur);
        return;
      }
      const h = HATA_SATIRLARI[i++];
      yaz('> ' + h[0], '', () => setTimeout(() => yaz('  ' + h[1], 'shx-bad', () => { vib(20); setTimeout(dene, dur); }), dur * .7));
    };
    setTimeout(() => yaz('> hira_tarama.exe başlatılıyor…', '', dene), dur * .4);
  };
}

/* ======================= Başlat ======================= */
[sahneWin, sahneMakara, sahneHediye, sahneHata].forEach(guvenli);
(window.__ok = window.__ok || []).push('shitpost3');
})();
