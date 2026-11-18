/* shitpost.js — dağıtılmış komik sahneler + hata sahnesi + final videosu (video müziği SIFIRLAMAZ).
   fun.js ve scenes.js YERİNE geçer; onları index.html'e ekleme. app.js, finale.js ve extra.js'ten SONRA yüklenir.
   Tüm yazılar aşağıdaki sabitlerde: istediğin gibi düzenle. */
(() => {
'use strict';
const A = window.__app;
if (!A) { console.error('shitpost.js: app.js yüklenmeden çalıştı'); return; }
const { C, $, make, vib, reduced } = A, FX = A.FX || window.FX || {};
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);
const yeniden = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

/* ======================= AYARLAR ======================= */
const VIDEO_SRC = 'video.mp4';                    /* videonun yolu (repo kökünde ise böyle kalsın) */
const PUNCH = 'saka saka orospu cocu';            /* hata sahnesinin son cümlesi */
const MUZIK_MODU = 'dokunma';                     /* 'dokunma' = video müziğe ASLA dokunmaz (varsayılan) · 'sustur' = video çalarken müzik duraklar, kaldığı yerden devam eder */

/* ======================= METİNLER ======================= */
const MOODS = [
  ['"Görüldü" atma modu', 97], ['Pasta radarı açık', 100], ['Sabır yükleniyor… (şarj yok)', 12],
  ['Uyku kapalı, laf açık', 93], ['Sessiz ama kafasında seni yargılıyor', 81], ['"Bunu duymadım" yüzü', 84],
  ['Kahve olmadan insan değil', 88], ['Kendi kendine gülüyor (şüpheli)', 90], ['Yemek ısmarla krizi', 99], ['Yürüyen yorum satırı', 96]
];
const ILK_SUC = 'Mesajlara üç gün sonra "ya bakmamışım" diye dönmek';
const SUCLAR = [
  'Son pasta dilimini "tadına bakıyorum" diyerek bitirmek', 'Her fotoğrafta iyi çıkıp beni kötü göstermek',
  'En sessiz anda sebepsiz gülmek', 'Dürtülünce "ne var?" demek', 'Sessizce hep haklı çıkmak (sinir bozucu)',
  'Benim şakamı benden önce anlayıp gülmemek', 'Sipariş verirken benimkinden yemek', 'Kahveyi de uykuyu da ihmal etmek'
];
const DAMGA = ['YAKALANDIN!', 'HÂLÂ FİRARİ', '15 YAŞINDA', 'TEHLİKELİ', 'ÇOK DARLANMIŞ'];
const WIN = [
  ['❌', 'Hira.exe çalışmayı durdurdu.\nSebep: 15 yaşına girme işlemi (maalesef) başarılı.'],
  ['⚠️', 'Uyarı: Belleğin %99\'u pasta.\nDaha fazlası için lütfen biraz utancını sil.'],
  ['❓', 'Hata 0x23112011:\nBu kadar büyüme beklenmiyordu. Sistem şaşkın.'],
  ['⛔', 'Sistem Hira\'yı durduramadı.\nBen de denedim, olmadı.'],
  ['❌', 'Hira.exe yanıt vermiyor.\nTıpkı mesajlarıma. Tutarlılık güzel.'],
  ['⚠️', 'Kritik: Doğum günü hediyesi bulunamadı.\nYerine bu web sitesi kullanıldı. Hak ettin (belki).']
];
const WIN_SON = ['🎉', 'Hira 15.0 yüklendi.\nYeni sürüm: +1 yaş, −0 olgunluk, +∞ pasta.'];
const SOZLER = [
  'Yaş 15 ama enerji hâlâ "5 dakika daha" seviyesinde.', 'Bugün pasta senin; laf yine bende.',
  '15 olmuşsun, göz devirme becerin hâlâ üst düzey.', 'Mum üflerken dilek tut. "Daha çok pasta" deme, yedik zaten.',
  'Bugün senin günün; kimse seninle tartışmaz. İstisna: ben.', 'Seni darlıyorum çünkü sevdiğime bunu yaparım. Yasal uyarı.',
  'Yaşlanmak mı? Hayır, sadece sürüm güncellemesi.', 'Doğum günün kutlu olsun; ama kahveyi yine ben ödemiyorum.',
  'Büyüdüm diyebilirsin artık. Kimse inanmaz ama diyebilirsin.', 'Bu düğmeye basmaya devam et. Seni kimse durduramaz. Ben bile.'
];
const HEDIYE = [
  ['🧦', 'Tek bir çorap', 'Diğerini ben sakladım.'], ['🦆', 'Boy boy lastik ördek', 'Kullanım amacı: yok. Moral desteği: var.'],
  ['🥔', 'Üzerinde "HİRA" yazan patates çuvalı', 'Dayanıklı. Ağlatmaz. (Soyarken hariç.)'], ['🪴', 'Kendi kendine solan bir bitki', 'Sorumluluk dersi. Ücretsiz.'],
  ['📦', 'Boş bir kutu', 'Çocuklar bunu çok sever, deniyoruz.'], ['☕', 'Ömür boyu kahve aboneliği', 'Uyku payı dahil değildir.'],
  ['🚀', 'Mars\'ta bir arsa', 'Tapu bende. Güven bende.']
];
const SITE = ['🌐', 'Bu web sitesi', 'Kargo bedava · iade yok · hediye bu kadar.'];
const HATA_SATIRLARI = [
  ['Deneme 1: Beyin hücreleri yükleniyor…', 'HATA 404: Hücre bulunamadı. Hepsi izinli.'],
  ['Deneme 2: Olgunluk aranıyor…', 'HATA: Olgunluk modülü bu cihazda yüklü değil.'],
  ['Deneme 3: Mutlak kaos hesaplanıyor…', 'TAMAM: Hesaplandı. Sonuç: sonsuz.']
];

/* ======================= Fotoğraf yardımcıları ======================= */
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
function setFoto(img) { let n = 0; img.onerror = () => { if (n++ < 3) img.src = sonrakiFoto(); }; img.src = sonrakiFoto(); }

/* ======================= Yerleştirme ======================= */
function blok(id, baslik, alt, html) {
  const s = make('section', 'shx'); s.id = id;
  s.innerHTML = '<h3>' + baslik + '</h3>' + (alt ? '<p class="shx-sub">' + alt + '</p>' : '') + html;
  return s;
}
function yerlestir(el, ref, mod) {
  const r = $(ref);
  if (!r) { console.warn('shitpost.js: yer bulunamadı → ' + ref); return false; }
  if (mod === 'before') r.before(el); else r.after(el);
  return true;
}
const guvenli = f => { try { f(); } catch (e) { console.error('shitpost.js:', e); } };

/* ======================= 1) ANILARIMIZ'IN ALTINA: Ruh hali ölçer ======================= */
function sahneMood() {
  const s = blok('shx-mood', 'Hira Ruh Hali Ölçer™', 'Bilimsel değil. Ama yalan da değil.',
    '<div class="shx-card"><img class="shx-img" alt=""><p class="shx-label" id="moodLabel">Henüz ölçülmedi</p>' +
    '<div class="shx-bar"><i id="moodBar"></i></div><small id="moodPct"></small></div>' +
    '<button class="btn" type="button" id="moodBtn">Ölç bakalım</button>');
  const g = $('#gallery'); if (!g) { console.warn('shitpost.js: #gallery yok'); return; }
  const k = g.querySelectorAll('.pol'); if (k[3]) k[3].after(s); else g.append(s);
  s.addEventListener('pointerdown', e => e.stopPropagation()); /* "basılı tut, sayfa aksın" özelliği bloğu etkilemesin */
  const img = $('.shx-img', s), lab = $('#moodLabel'), bar = $('#moodBar'), pct = $('#moodPct'), btn = $('#moodBtn'), sonraki = deste(MOODS);
  setFoto(img);
  btn.onclick = () => {
    if (btn.disabled) return; btn.disabled = true; vib([12, 40, 12]);
    lab.textContent = 'Ölçülüyor…'; pct.textContent = ''; bar.style.width = '0%';
    let t = 0; const iv = setInterval(() => {
      setFoto(img);
      if (++t >= (reduced ? 1 : 8)) {
        clearInterval(iv); const m = sonraki();
        lab.textContent = m[0]; yeniden(lab, 'shx-flash'); bar.style.width = m[1] + '%'; pct.textContent = 'ölçüm %' + m[1];
        btn.disabled = false; btn.textContent = 'Tekrar ölç'; vib(30);
      }
    }, 110);
  };
}

/* ======================= 2) KÜÇÜK ANLAR'IN ALTINA: Aranıyor posteri ======================= */
function sahneWanted() {
  const s = blok('shx-wanted', 'Aranıyor', 'Posterin üstüne dokun, suç listesi yenilenir.',
    '<div class="shx-poster" id="wPoster"><b class="shx-ph">ARANIYOR</b><img class="shx-img" alt=""><p class="shx-ph2">HİRA</p>' +
    '<ul id="wCrimes"></ul><span class="shx-stamp" id="wStamp"></span></div>' +
    '<button class="btn" type="button" id="wBtn">Yeni suç ekle</button>');
  if (!yerlestir(s, '#to4', 'before')) return;
  s.addEventListener('pointerdown', e => e.stopPropagation()); /* Küçük Anlar'daki "basılı tut, sayfa aksın" özelliği bu bloğu etkilemesin */
  const img = $('.shx-img', s), ul = $('#wCrimes'), st = $('#wStamp'), sonrakiSuc = deste(SUCLAR), sonrakiDamga = deste(DAMGA);
  const yenile = () => {
    setFoto(img); ul.replaceChildren();
    [ILK_SUC, sonrakiSuc(), sonrakiSuc()].forEach(t => { const li = make('li', '', t); ul.append(li); });
    st.textContent = sonrakiDamga(); yeniden(st, 'shx-hit'); vib([10, 30, 20]);
  };
  yenile(); $('#wPoster').onclick = yenile; $('#wBtn').onclick = yenile;
}

/* ======================= 3) BİLMENİ İSTEDİKLERİM'İN ÜSTÜNE: Hira.exe penceresi ======================= */
function sahneWin() {
  const s = blok('shx-win', 'Sistem Mesajı', '',
    '<div class="shx-win" id="spWin"><div class="shx-wbar"><span>Hira.exe</span><button type="button" id="winX" aria-label="Kapat">✕</button></div>' +
    '<div class="shx-wbody"><span class="shx-wico" id="winIco"></span><p id="winMsg"></p></div>' +
    '<div class="shx-wprog" id="winProg" hidden><i></i></div>' +
    '<div class="shx-wbtns" id="winBtns"><button type="button">Tamam</button><button type="button">İptal</button><button type="button">Yeniden dene</button></div></div>');
  if (!yerlestir(s, '#to46', 'before')) return;
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

/* ======================= 4) AKIP GİDEN KARELER'İN ALTINA: Darlama düğmesi ======================= */
function sahneDarla() {
  const s = blok('shx-darla', 'Darlama Butonu', 'Basma. (Bas.)',
    '<div class="shx-stage" id="darlaStage"><button class="shx-big" type="button" id="darlaBtn">DARLA</button></div>' +
    '<p class="shx-quote" id="darlaQuote">Düğmeye bas, Hira\'yı darla.</p><small>darlama sayısı: <b id="darlaN">0</b></small>');
  if (!yerlestir(s, '#to5m', 'before')) return;
  const btn = $('#darlaBtn'), stage = $('#darlaStage'), q = $('#darlaQuote'), nEl = $('#darlaN'), sonrakiSoz = deste(SOZLER);
  let n = 0;
  const pop = () => {
    const eski = $$('.shx-pop', stage); if (eski.length > 10) eski[0].remove();
    const im = new Image(), a = rnd(-Math.PI * .95, -Math.PI * .05), d = rnd(110, 190);
    im.className = 'shx-pop'; im.alt = '';
    im.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px'); im.style.setProperty('--dy', (Math.sin(a) * d).toFixed(0) + 'px');
    im.style.setProperty('--rot', rnd(-26, 26).toFixed(0) + 'deg'); setFoto(im); stage.append(im);
    im.addEventListener('animationend', () => im.remove());
  };
  btn.onclick = () => {
    n++; sayac.art(3); nEl.textContent = n; q.textContent = sonrakiSoz(); yeniden(q, 'shx-flash'); yeniden(stage, 'shx-shake'); vib([10, 30, 10]);
    const adet = reduced ? 1 : 2 + (Math.random() < .5 ? 1 : 0); for (let i = 0; i < adet; i++) pop();
    if (n % 7 === 0 && FX.burst) { const r = btn.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top); }
  };
}

/* ======================= 5) KARANLIK ODA'NIN ALTINA: Hediye önerisi ======================= */
function sahneHediye() {
  const s = blok('shx-gift', 'Hira\'ya Ne Alsak?', '',
    '<div class="shx-gift" id="giftNow"><span id="giftEmoji">🎁</span><b id="giftTitle">Hira\'ya ne almalı?</b><small id="giftSub">Düğmeye bas, öneriler gelsin.</small></div>' +
    '<ul class="shx-glist" id="giftList"></ul><button class="btn" type="button" id="giftBtn">Öneri getir</button>');
  if (!yerlestir(s, '#to6', 'before')) return;
  const now = $('#giftNow'), em = $('#giftEmoji'), ti = $('#giftTitle'), sb = $('#giftSub'), list = $('#giftList'), btn = $('#giftBtn');
  let g = 0, onceki = null;
  const yaz = (arr, final) => { em.textContent = arr[0]; ti.textContent = arr[1]; sb.textContent = arr[2]; now.classList.toggle('final', !!final); yeniden(now, 'shx-popin'); };
  btn.onclick = () => {
    vib(14);
    if (g > HEDIYE.length) { g = 0; onceki = null; list.replaceChildren(); now.classList.remove('final'); em.textContent = '🎁'; ti.textContent = 'Hira\'ya ne almalı?'; sb.textContent = 'Düğmeye bas, öneriler gelsin.'; btn.textContent = 'Öneri getir'; return; }
    if (onceki) { const li = make('li'), sp = make('span', '', onceki[1]); li.append(sp, document.createTextNode(' — Hira: "hayır."')); list.append(li); }
    if (g < HEDIYE.length) { onceki = HEDIYE[g]; yaz(onceki); g++; btn.textContent = g === HEDIYE.length ? 'Peki ya…?' : 'Başka öneri'; return; }
    onceki = null; yaz(SITE, true); g++; btn.textContent = 'Baştan oynat'; vib([20, 60, 20, 60, 40]);
    if (FX.burst) { const r = now.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2); if (FX.kutlama) setTimeout(FX.kutlama, 300); }
  };
}

/* ======================= 6) MEKTUBUN ÜSTÜNE: Sahte hata — 3 deneme, sonra son söz ======================= */
function sahneHata() {
  const s = blok('shx-err', 'Hira Sistem Taraması v15.0', 'Mektuba geçmeden önce Hira\'nın sistemini kontrol ediyoruz.',
    '<div class="shx-term" id="errTerm" aria-live="polite"><p>&gt; hira_tarama.exe hazır.</p></div>' +
    '<button class="btn" type="button" id="errBtn">Taramayı başlat</button>');
  if (!yerlestir(s, '#envwrap', 'before')) return;
  const term = $('#errTerm'), btn = $('#errBtn'), gecikme = reduced ? 150 : 900;
  const satir = (t, cls) => { const p = make('p', cls || '', t); term.append(p); term.scrollTop = term.scrollHeight; return p; };
  btn.onclick = () => {
    if (btn.disabled) return; btn.disabled = true; term.replaceChildren(); vib([12, 40, 12]);
    satir('> hira_tarama.exe başlatılıyor…');
    let i = 0;
    const dene = () => {
      if (i >= HATA_SATIRLARI.length) {
        setTimeout(() => {
          satir('> Nihai rapor:'); const p = satir(PUNCH, 'shx-punch'); yeniden(p, 'shx-popin'); vib([30, 60, 30, 60, 60]);
          if (FX.burst) { const r = p.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top); }
          btn.disabled = false; btn.textContent = 'Tekrar tara (boşuna)';
        }, gecikme);
        return;
      }
      const h = HATA_SATIRLARI[i++]; satir('> ' + h[0]);
      setTimeout(() => { satir('  ' + h[1], 'shx-bad'); vib(20); setTimeout(dene, gecikme * .7); }, gecikme);
    };
    setTimeout(dene, gecikme * .6);
  };
}

/* ======================= 7) FİNAL VİDEOSU — müzikle tamamen bağımsız =======================
   Eski sürümde video durdukça/ses değiştikçe bgm.play() çağrılıyordu; telefon sesi kesince müzik baştan başlıyordu.
   Şimdi: video yalnızca kullanıcı oynatınca çalar (otomatik oynatma yok) ve 'dokunma' modunda video olayları
   #bgm öğesine HİÇ bakmaz: pause/play/currentTime/src/load çağrısı yok. Video kendi sesiyle çalar. */
function sahneVideo() {
  const wish = $('#wish'), closing = $('#closing'); if (!wish || !closing) { console.warn('shitpost.js: #wish/#closing yok'); return; }
  const s = blok('shx-video', 'Bonus Video', 'Kendi sesiyle oynar. Müzik de çalmaya devam eder, kulakların senin sorunun.',
    '<video id="finalVideo" controls playsinline preload="metadata"></video><p class="shx-note" id="vidNote" hidden></p>');
  s.hidden = true; closing.before(s);
  const vid = $('#finalVideo'), note = $('#vidNote');
  vid.addEventListener('error', () => { note.hidden = false; note.textContent = VIDEO_SRC + ' bulunamadı ya da oynatılamadı (H.264/AAC .mp4 olmalı).'; });
  vid.src = VIDEO_SRC;

  if (MUZIK_MODU === 'sustur') { /* isteğe bağlı: video sesliyken müziği duraklat, bittiğinde kaldığı saniyeden sürdür */
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

  const goster = () => { if (wish.classList.contains('on')) setTimeout(() => { s.hidden = false; }, reduced ? 200 : 1800); };
  new MutationObserver(goster).observe(wish, { attributes: true, attributeFilter: ['class'] }); goster();
}

/* ======================= 8) Darlama sayacı + mühendis stres seviyesi (gizli yumurta) =======================
   Hikâyede her dokunuş sayılır; sol üstte küçük, silik bir etiket olarak görünür. Darla düğmesi 3 puan verir. */
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

/* ======================= Başlat ======================= */
[sahneMood, sahneWanted, sahneWin, sahneDarla, sahneHediye, sahneHata, sahneVideo].forEach(guvenli);
(window.__ok = window.__ok || []).push('shitpost');
})();
