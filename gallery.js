/* gallery.js — HİRA HEDİYE GALERİSİ · Sergi & Açık Artırma (eski "Hira'ya ne alsak?" yerine)
   Sahneler: 1) Galeri girişi  2) Sergi salonu  3) Eser detayı  4) Açık artırma  5) Final açılışı
   Hikâye sayfasındaki eski hediye bloğu (#shx-gift) bir davetiye kartıyla değiştirilir; galeri __exp ile tam ekran açılır.
   Çizimlerin hepsi satır içi SVG'dir (harici dosya yok). Zamanlayıcılar oturuma bağlıdır, kapanınca temizlenir. */
(() => {
'use strict';
const S = window.__shx, E = window.__exp;
if (!S || !E) { console.error('gallery.js: shitpost.js / exp.js eksik'); return; }
const { $, make, vib, reduced, rnd, sayac, FX, guvenli } = S;

/* ======================= ÇİZİMLER (viewBox 0 0 200 200; § = benzersiz kimlik öneki) ======================= */
const yildizPts = (cx, cy, R, r) => { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r : R; p += (cx + Math.cos(a) * k).toFixed(1) + ',' + (cy + Math.sin(a) * k).toFixed(1) + ' '; } return p.trim(); };
const kivilcim = (x, y, s, d) => '<path class="tw" style="animation-delay:' + d + 's" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0-8Q1-1 8 0Q1 1 0 8Q-1 1-8 0Q-1-1 0-8z" fill="#fff6cf"/>';
const ALT = '<stop offset="0" stop-color="#fff3b0"/><stop offset=".4" stop-color="#e9b93a"/><stop offset=".75" stop-color="#a97a14"/><stop offset="1" stop-color="#f5d76e"/>';

const CIZIM = {
  mars: '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="§a" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ffa36b"/><stop offset=".55" stop-color="#c1440e"/><stop offset="1" stop-color="#561704"/></radialGradient></defs>' +
    '<g fill="#fff6cf"><circle class="tw" cx="22" cy="30" r="1.6"/><circle class="tw t2" cx="168" cy="26" r="1.2"/><circle class="tw t3" cx="180" cy="120" r="1.5"/><circle class="tw" cx="16" cy="140" r="1.1"/><circle class="tw t2" cx="150" cy="188" r="1.3"/></g>' +
    '<circle cx="100" cy="104" r="70" fill="url(#§a)"/><g fill="#7e2706" opacity=".55"><ellipse cx="72" cy="80" rx="13" ry="7"/><ellipse cx="128" cy="68" rx="8" ry="5"/><ellipse cx="136" cy="126" rx="14" ry="8"/><ellipse cx="62" cy="122" rx="7" ry="4"/></g>' +
    '<path d="M66 142l34-12 40 10-34 14z" fill="#f3d9a0" fill-opacity=".28" stroke="#f3d9a0" stroke-width="1.2" stroke-dasharray="3 3"/>' +
    '<path d="M100 134V92" stroke="#f3d9a0" stroke-width="2"/><path class="flag" d="M100 92l22 7-22 9z" fill="#ffe9ad"/><circle cx="100" cy="91" r="2" fill="#ffe9ad"/>' +
    '<ellipse class="orb" cx="100" cy="104" rx="98" ry="20" fill="none" stroke="#e8c680" stroke-opacity=".55" stroke-dasharray="2 5" transform="rotate(-18 100 104)"/></svg>',
  patates: '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="§a" x1="0" y1="0" x2="1" y2="1">' + ALT + '</linearGradient></defs>' +
    '<ellipse cx="102" cy="176" rx="64" ry="9" fill="#000" opacity=".4"/><path d="M34 114C30 70 76 42 118 50c40 8 58 42 48 78-10 32-46 44-84 36-32-7-46-26-48-50z" fill="url(#§a)" stroke="#fff3b0" stroke-opacity=".6" stroke-width="1.5"/>' +
    '<g fill="#8a5d0b" opacity=".5"><ellipse cx="78" cy="96" rx="6" ry="3.5" transform="rotate(-20 78 96)"/><ellipse cx="124" cy="118" rx="7" ry="4" transform="rotate(25 124 118)"/><ellipse cx="96" cy="140" rx="5" ry="3"/><ellipse cx="140" cy="84" rx="4" ry="2.6"/></g>' +
    '<path d="M54 78c10-16 30-22 48-22" fill="none" stroke="#fffbe0" stroke-width="5" stroke-linecap="round" opacity=".7"/>' + kivilcim(150, 52, 1.2, 0) + kivilcim(48, 70, 0.9, .7) + kivilcim(168, 112, 1, 1.3) + kivilcim(70, 150, .8, .4) + '</svg>',
  kahve: '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="§a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf1da"/><stop offset="1" stop-color="#cdb27a"/></linearGradient><linearGradient id="§b" x1="0" y1="0" x2="1" y2="1">' + ALT + '</linearGradient></defs>' +
    '<path d="M100 44c10-16 36-16 36 0s-26 16-36 0-36-16-36 0 26 16 36 0z" fill="none" stroke="url(#§b)" stroke-width="5" stroke-linecap="round"/>' +
    '<g class="steam" fill="none" stroke="#f6ead0" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M84 78c-8-8 8-12 0-22"/><path d="M100 78c-8-8 8-12 0-22"/><path d="M116 78c-8-8 8-12 0-22"/></g>' +
    '<ellipse cx="100" cy="158" rx="66" ry="12" fill="url(#§b)"/><ellipse cx="100" cy="153" rx="52" ry="8" fill="#0003"/>' +
    '<path d="M148 96c28-6 28 36-4 40" fill="none" stroke="url(#§b)" stroke-width="8" stroke-linecap="round"/><path d="M52 90h96v22c0 32-21 46-48 46S52 144 52 112z" fill="url(#§a)"/>' +
    '<ellipse cx="100" cy="90" rx="48" ry="9" fill="#4a2810"/><ellipse cx="100" cy="89" rx="40" ry="6" fill="#6b3d1b"/><path d="M60 108c0 24 14 36 40 36" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/></svg>',
  ordek: '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="§a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe34d"/><stop offset="1" stop-color="#f2a900"/></linearGradient></defs>' +
    '<g class="rip" fill="none" stroke="#8fd3ff" stroke-opacity=".55" stroke-width="2"><ellipse cx="96" cy="164" rx="80" ry="12"/><ellipse cx="96" cy="164" rx="58" ry="8"/></g>' +
    '<path d="M138 110c22-4 30-22 26-34-12 8-26 10-36 18z" fill="url(#§a)"/><ellipse cx="94" cy="126" rx="60" ry="38" fill="url(#§a)"/>' +
    '<path d="M76 122c22-16 48-8 56 8-22 16-48 14-56-8z" fill="#e69500" opacity=".75"/><circle cx="62" cy="76" r="32" fill="url(#§a)"/>' +
    '<path d="M36 76c-16 0-20 9-15 13 7 5 22 3 30 0z" fill="#ff7a1a"/><circle cx="62" cy="68" r="4.5" fill="#1b1204"/><circle cx="63.6" cy="66.4" r="1.4" fill="#fff"/><circle cx="46" cy="82" r="5" fill="#ff9a8a" opacity=".6"/>' +
    '<path d="M54 50c4-8 14-10 22-6" fill="none" stroke="#fff6a8" stroke-width="4" stroke-linecap="round" opacity=".7"/>' +
    '<g stroke="#e8c680" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"><circle cx="176" cy="134" r="3.4"/><path d="M176 138v14M176 144l-6 6M176 144l6 6M176 152l-5 10M176 152l5 10"/></g></svg>',
  yildiz: '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="§a" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#232b6e"/><stop offset="1" stop-color="#05071a"/></radialGradient><radialGradient id="§b"><stop offset="0" stop-color="#fff7cf"/><stop offset=".4" stop-color="#ffd86b" stop-opacity=".6"/><stop offset="1" stop-color="#ffd86b" stop-opacity="0"/></radialGradient></defs>' +
    '<circle cx="100" cy="96" r="90" fill="url(#§a)"/><g fill="#fff"><circle class="tw" cx="40" cy="50" r="1.4"/><circle class="tw t2" cx="152" cy="40" r="1.2"/><circle class="tw t3" cx="166" cy="112" r="1.4"/><circle class="tw" cx="30" cy="122" r="1"/><circle class="tw t2" cx="120" cy="150" r="1.2"/></g>' +
    '<circle class="halo" cx="100" cy="92" r="66" fill="url(#§b)"/><g stroke="#ffe9a8" stroke-width="1.4" opacity=".7"><path d="M100 14v22M100 148v22M22 92h22M156 92h22"/></g>' +
    '<polygon class="str" points="' + yildizPts(100, 92, 42, 17) + '" fill="#ffe08a" stroke="#fff7cf" stroke-width="2" stroke-linejoin="round"/>' +
    '<rect x="62" y="156" width="76" height="22" rx="3" fill="#1a1405" stroke="#e8c680" stroke-width="1.4"/><text x="100" y="171" text-anchor="middle" font-size="11" letter-spacing="2" fill="#f3d58c" font-family="Georgia,serif">HİRA-15</text></svg>',
  bulut: '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="§a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfe0f2"/></linearGradient></defs>' +
    '<g class="cl"><g fill="url(#§a)"><circle cx="66" cy="108" r="26"/><circle cx="98" cy="88" r="34"/><circle cx="132" cy="104" r="28"/><circle cx="152" cy="118" r="20"/><circle cx="52" cy="124" r="20"/><rect x="52" y="112" width="112" height="28" rx="14"/></g>' +
    '<g fill="#3a4a63"><circle cx="90" cy="110" r="3.4"/><circle cx="116" cy="110" r="3.4"/></g><path d="M96 120q7 6 14 0" fill="none" stroke="#3a4a63" stroke-width="2.4" stroke-linecap="round"/><circle cx="82" cy="119" r="5" fill="#ffb3c4" opacity=".7"/><circle cx="124" cy="119" r="5" fill="#ffb3c4" opacity=".7"/></g>' +
    '<path d="M104 142v14" stroke="#e8c680" stroke-width="1.6"/><rect x="88" y="156" width="32" height="16" rx="2" fill="#1a1405" stroke="#e8c680" stroke-width="1.4"/><text x="104" y="167.5" text-anchor="middle" font-size="8" letter-spacing="1.4" fill="#f3d58c" font-family="Georgia,serif">HİRA</text>' +
    '<g stroke="#8fd3ff" stroke-width="2" stroke-linecap="round" opacity=".8"><path class="dr" d="M70 150v8"/><path class="dr d2" d="M132 148v8"/><path class="dr d3" d="M150 158v8"/></g></svg>',
  pasta: '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="§a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd6e2"/><stop offset="1" stop-color="#f09ab6"/></linearGradient><linearGradient id="§b" x1="0" y1="0" x2="1" y2="1">' + ALT + '</linearGradient></defs>' +
    '<ellipse cx="100" cy="164" rx="78" ry="14" fill="url(#§b)"/><ellipse cx="100" cy="160" rx="62" ry="9" fill="#0003"/>' +
    '<rect x="48" y="112" width="104" height="44" rx="7" fill="url(#§a)"/><rect x="42" y="100" width="116" height="16" rx="8" fill="#fff6f9"/><rect x="56" y="70" width="88" height="34" rx="7" fill="url(#§a)"/>' +
    '<path d="M56 74c10 12 14-2 22 8s14-6 22 6 14-8 22 4 14-6 22 2v-10a7 7 0 0 0-7-7H63a7 7 0 0 0-7 7z" fill="#fff6f9"/>' +
    '<path d="M72 130c10-16 22-16 28 0s18 16 28 0" fill="none" stroke="#b8861b" stroke-width="5" stroke-linecap="round" transform="translate(0 4)"/>' +
    '<rect x="97" y="46" width="6" height="26" rx="2" fill="#e8c680"/><path class="fl" d="M100 24c8 8 7 16 0 20-7-4-8-12 0-20z" fill="#ffb347"/><circle cx="76" cy="66" r="7" fill="#d62a4a"/><path d="M76 59c0-5 4-8 8-9" fill="none" stroke="#3b7a2a" stroke-width="2"/></svg>',
  hicce: '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="§a" x1="0" y1="0" x2="1" y2="1">' + ALT + '</linearGradient><linearGradient id="§b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9ad" stop-opacity=".3"/><stop offset="1" stop-color="#ffe9ad" stop-opacity="0"/></linearGradient></defs>' +
    '<path d="M92 0h16l56 200H36z" fill="url(#§b)"/><rect x="30" y="26" width="140" height="148" rx="5" fill="url(#§a)"/><rect x="42" y="38" width="116" height="124" fill="#120d07"/>' +
    '<rect class="dsh" x="52" y="48" width="96" height="104" fill="none" stroke="#e8c680" stroke-opacity=".7" stroke-dasharray="4 5"/>' +
    '<g fill="#fff3b0" opacity=".9"><circle cx="30" cy="26" r="6"/><circle cx="170" cy="26" r="6"/><circle cx="30" cy="174" r="6"/><circle cx="170" cy="174" r="6"/></g>' +
    '<text x="100" y="104" text-anchor="middle" font-size="12" font-style="italic" fill="#b79f6c" font-family="Georgia,serif">hiçbir şey</text>' + kivilcim(78, 128, .7, .2) + kivilcim(124, 74, .6, 1) + '</svg>'
};

/* ======================= ESERLER ======================= */
const ESER = [
  { c: 'mars', ad: 'Mars\'ta Arsa', alt: 'Kızıl Gezegen Koleksiyonu', fiyat: 48500000, glow: '#ff7a3d',
    ac: 'Komşu yok, trafik yok, pasta teslimatı da yok. Ama tapu senin adına. (Tapu: hayal gücü.)',
    oz: [['Konum', 'Olympus Mons manzaralı'], ['Komşu', 'Yok (huzur garantili)'], ['İmar durumu', 'Kırmızı toz bulutu ruhsatlı']] },
  { c: 'patates', ad: 'Altın Kaplama Patates', alt: 'Yer Altından Gelen Servet', fiyat: 12750000, glow: '#ffcf4a',
    ac: '24 ayar altınla kaplı, yine de hiçbir işe yaramaz. Haşlanmaya şiddetle itiraz eder.',
    oz: [['Ayar', '24 (içi yine patates)'], ['Kullanım', 'Bakmak ve gurur duymak'], ['Pişirme', 'Denemeyin, ağlarız']] },
  { c: 'kahve', ad: 'Ömür Boyu Kahve Aboneliği', alt: 'Uykusuzlara Saygı Duruşu', fiyat: 8900000, glow: '#e8a860',
    ac: 'Her sabah kahven hazır. Uykun mu? O ayrı abonelik.',
    oz: [['Süre', 'Ömür boyu (senin ya da kahvenin)'], ['Çeşit', 'Sınırsız, sütlü dahil'], ['Uyku', 'Dahil değildir']] },
  { c: 'ordek', ad: 'Dev Lastik Ördek', alt: 'Banyonun Hükümdarı', fiyat: 6300000, glow: '#ffd23d',
    ac: 'Boyu 4 metre. Küvete sığmaz ama hayata sığar.',
    oz: [['Boy', '4 metre (bir ördek için fazla)'], ['Ses', 'Vak (bina titrer)'], ['Taşıma', 'Üç kişi ve bir kamyon']] },
  { c: 'yildiz', ad: 'Hira Adına Özel Yıldız', alt: 'Gökyüzünde Senin Adın', fiyat: 21000000, glow: '#ffe08a',
    ac: 'Uzaktan bakınca küçük ama kendini çok beğeniyor. Sahibine benziyor, deriz.',
    oz: [['Katalog kodu', 'HİRA-15'], ['Uzaklık', 'Işık hızıyla bile geç kalırsın'], ['Parlaklık', 'Göz kamaştırıcı (mecazen)']] },
  { c: 'bulut', ad: 'Kişiye Özel Bulut', alt: 'Yalnızca Senin Üstünde', fiyat: 3450000, glow: '#9fd0ff',
    ac: 'Seni takip eder, gölge yapar, arada bir yağmur yağdırır. Evcil ama asi.',
    oz: [['Şekil', 'Pamuk şeker (bazen kedi)'], ['Yağış', 'Sadece moralin bozulunca'], ['Takip mesafesi', '3 metre, Wi-Fi yok']] },
  { c: 'pasta', ad: 'Sonsuz Pasta Hakkı', alt: 'Tatlının Sonu Yok', fiyat: 15900000, glow: '#ff9bbd',
    ac: 'Ömür boyu her pastadan bir dilim senin. "Son dilim" kuralı bu eserde geçerli değil.',
    oz: [['Limit', 'Yok'], ['Çatal', 'Kendi çatalın (gravürlü)'], ['Son dilim', 'Her zaman sana ait']] },
  { c: 'hicce', ad: 'Çerçeveli Hiçlik', alt: 'Dünyanın En Gereksiz, En Pahalı Hediyesi', fiyat: 99999999, glow: '#e8c680',
    ac: 'Altın çerçeve içinde saf hiçlik. Taşıması kolay, kullanımı imkânsız, fiyatı akıl almaz.',
    oz: [['İçerik', 'Hiçbir şey (ışıltılı)'], ['Fayda', 'Sıfır'], ['Sergilenme', 'Duvara asılır, herkes "bu ne?" der']] }
];
const para = n => n.toLocaleString('tr-TR') + ' ₺';
const no = i => String(i + 1).padStart(2, '0');
let uid = 0;
const cizim = c => CIZIM[c].replace(/§/g, 'g' + (++uid));

const SATICI = ['Açık artırma başlıyor…', 'Salonda tek teklif var… o da seninki.', 'Bir…', 'İki…', 'Üç…'];
const FINAL = 'Onca hediyenin arasından en özelini seçtik. Çünkü bu kez sana hazır bir hediye almak yerine, senin için bir dünya hazırladık.';
const FINAL2 = 'Bu site, bu hikâye, bu küçük dünya… hepsi senin. İyi ki doğdun Hira.';

const KUTU = '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="§a" x1="0" y1="0" x2="1" y2="1">' + ALT + '</linearGradient><linearGradient id="§b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a1530"/><stop offset="1" stop-color="#4a0a1c"/></linearGradient></defs>' +
  '<rect x="40" y="94" width="120" height="84" rx="4" fill="url(#§b)"/><rect x="92" y="94" width="16" height="84" fill="url(#§a)"/>' +
  '<g class="kapak"><rect x="32" y="70" width="136" height="30" rx="4" fill="#8e1a3a"/><rect x="92" y="70" width="16" height="30" fill="url(#§a)"/><path d="M100 70c-24-30-44-10-28 2 10 6 22 2 28-2zM100 70c24-30 44-10 28 2-10 6-22 2-28-2z" fill="none" stroke="url(#§a)" stroke-width="7" stroke-linecap="round"/></g></svg>';
const DUNYA = '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="§a" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#ffe6f0"/><stop offset=".45" stop-color="#ff69ab"/><stop offset="1" stop-color="#3a0f3f"/></radialGradient></defs>' +
  '<circle cx="100" cy="100" r="64" fill="url(#§a)"/><g fill="#fff" fill-opacity=".28"><path d="M60 84c8-14 26-16 34-6s-4 20-14 18-14 10-20-12z"/><path d="M110 120c12-6 28-2 30 8s-12 16-24 12-12-14-6-20z"/></g>' +
  '<ellipse class="ring" cx="100" cy="100" rx="92" ry="22" fill="none" stroke="#e8c680" stroke-width="2" transform="rotate(-20 100 100)"/>' +
  '<path d="M100 122c-22-14-30-26-30-38a16 16 0 0 1 30-8 16 16 0 0 1 30 8c0 12-8 24-30 38z" fill="#fff3d6" opacity=".95"/></svg>';

/* ======================= DENEYİM ======================= */
function ac() {
  E.ac('gal', 'Hira Hediye Galerisi', (host, ot) => {
    const kok = make('div', 'g'); kok.dataset.s = '1';
    const duvar = ESER.map((e, i) =>
      '<div class="g-ex" data-i="' + i + '" style="--gl:' + e.glow + '"><i class="g-cone" aria-hidden="true"></i>' +
      '<button type="button" class="g-frame" aria-label="Eseri incele: ' + e.ad + '"><span class="g-mat">' + cizim(e.c) + '</span></button>' +
      '<div class="g-plak"><small>ESER No. ' + no(i) + '</small><b>' + e.ad + '</b><em>' + para(e.fiyat) + '</em></div></div>').join('');
    kok.innerHTML =
      '<div class="g-bg" aria-hidden="true"><i class="g-arch"></i><i class="g-glow"></i><i class="g-toz"></i></div><i class="g-wipe" aria-hidden="true"></i>' +
      /* 1 · giriş */
      '<section class="g-sc g-s1 on"><div class="g-cerceve" aria-hidden="true"><i></i><i></i></div>' +
      '<p class="g-kick">Hira Hediye Galerisi · Sergi &amp; Açık Artırma</p><div class="g-orn" aria-hidden="true"><i></i><b>◆</b><i></i></div>' +
      '<h2 class="g-baslik">HİRA İÇİN<br>ÖZEL OLARAK<br><span>SEÇİLDİ</span></h2>' +
      '<p class="g-intro">Sekiz eser. Her biri gereksiz, her biri pahalı, hiçbiri iade edilemez. Birini seçeceksin; gerisini biz halledeceğiz.</p>' +
      '<button type="button" class="g-btn" data-a="gir"><span>GALERİYE GİR</span></button></section>' +
      /* 2 · sergi */
      '<section class="g-sc g-s2"><header class="g-ust"><button type="button" class="g-geri" data-a="girise">← GİRİŞ</button><span class="g-say"><b>01</b> / ' + String(ESER.length).padStart(2, '0') + '</span></header>' +
      '<p class="g-kick">Sergi Salonu</p><div class="g-track" role="list" tabindex="0" aria-label="Sergi eserleri">' + duvar + '</div>' +
      '<div class="g-ctrl"><button type="button" class="g-ok" data-a="onceki" aria-label="Önceki eser">‹</button><button type="button" class="g-btn g-btn-s" data-a="incele"><span>ESERİ İNCELE</span></button><button type="button" class="g-ok" data-a="sonraki" aria-label="Sonraki eser">›</button></div>' +
      '<i class="g-zemin" aria-hidden="true"></i></section>' +
      /* 3 · detay */
      '<section class="g-sc g-s3"><header class="g-ust"><button type="button" class="g-geri" data-a="sergiye">← SERGİYE DÖN</button></header>' +
      '<div class="g-dvis" style="--gl:#e8c680"><i class="g-cone" aria-hidden="true"></i><div class="g-dfr"><span class="g-mat g-big"></span></div></div>' +
      '<p class="g-kick g-dno"></p><h2 class="g-dad"></h2><p class="g-dalt"></p><p class="g-dac"></p>' +
      '<div class="g-fiyat"><small>AÇILIŞ FİYATI</small><b></b></div><dl class="g-oz"></dl>' +
      '<button type="button" class="g-btn" data-a="sec"><span>BU HEDİYEYİ SEÇ</span></button></section>' +
      /* 4 · açık artırma */
      '<section class="g-sc g-s4"><p class="g-kick">Açık Artırma · Parti No. 15</p><div class="g-avis"><i class="g-cone g-cone2" aria-hidden="true"></i><div class="g-aeser"></div><i class="g-stamp" aria-hidden="true">SATILDI</i></div>' +
      '<p class="g-ad"></p><p class="g-afyt" aria-live="off">0 ₺</p><p class="g-asat" aria-live="polite"></p>' +
      '<svg class="g-gavel" viewBox="0 0 120 120" aria-hidden="true"><g class="gv-h"><rect x="24" y="22" width="52" height="24" rx="6" fill="#c9a96a" stroke="#fff3b0" stroke-width="1.5"/><rect x="46" y="46" width="8" height="66" rx="4" fill="#7a4a1a"/></g><ellipse cx="86" cy="108" rx="28" ry="8" fill="#3a2410"/><rect x="62" y="104" width="48" height="10" rx="3" fill="#7a4a1a"/></svg><div class="g-konfeti" aria-hidden="true"></div></section>' +
      /* 5 · final */
      '<section class="g-sc g-s5"><div class="g-isik" aria-hidden="true"></div><p class="g-on">Tebrikler. Hediyen belli oldu…</p><div class="g-kutu"><span class="g-kt">' + KUTU.replace(/§/g, 'gk') + '</span><span class="g-dn">' + DUNYA.replace(/§/g, 'gd') + '</span></div>' +
      '<h2 class="g-fh">Hira\'nın Dünyası</h2><p class="g-fm"></p><p class="g-fm2"></p><p class="g-fn"></p>' +
      '<div class="g-fb"><button type="button" class="g-btn g-btn-s" data-a="tekrar"><span>BAŞKA ESER GEZ</span></button><button type="button" class="g-btn g-btn-s g-btn2" data-a="cik"><span>GALERİDEN ÇIK</span></button></div></section>';
    host.append(kok);
    const q = (s, r = kok) => r.querySelector(s), qa = (s, r = kok) => [...r.querySelectorAll(s)];
    const sah = [null, q('.g-s1'), q('.g-s2'), q('.g-s3'), q('.g-s4'), q('.g-s5')];
    const track = q('.g-track'), exs = qa('.g-ex'), say = q('.g-say b');
    let aktif = 0, secili = 0, kapali = false, anim = null; /* anim: sahne 4/5 için ayrı oturum */
    const sol = () => { if (anim) { anim.temizle(); anim = null; } };

    /* ---- sahne geçişi: altın ışık süpürmesi + yumuşak giriş ---- */
    function git(n) {
      if (n !== 4 && n !== 5) sol();
      kok.dataset.s = String(n); S.yeniden(q('.g-wipe'), 'sw');
      sah.forEach((s, i) => { if (!s) return; const a = i === n; s.classList.toggle('on', a); s.inert = !a; s.setAttribute('aria-hidden', a ? 'false' : 'true'); if (a) s.scrollTop = 0; });
      const h = q('.g-btn,.g-frame', sah[n]); if (h && n !== 4) ot.zaman(() => { try { h.focus({ preventScroll: true }); } catch (_) { /* geç */ } }, 120);
      if (n === 2) ot.zaman(() => merkez(aktif, true), 40);
    }
    sah.forEach((s, i) => { if (s && i !== 1) s.inert = true; });

    /* ---- sergi: kaydırmalı koridor ---- */
    function merkez(i, hizli) {
      const e = exs[i]; if (!e) return;
      track.scrollTo({ left: e.offsetLeft - (track.clientWidth - e.offsetWidth) / 2, behavior: hizli || reduced ? 'auto' : 'smooth' });
    }
    function isaretle(i) {
      aktif = i; exs.forEach((e, k) => { e.classList.toggle('on', k === i); e.setAttribute('role', 'listitem'); });
      say.textContent = no(i);
    }
    let bekle = false;
    function kaydir() {
      if (bekle) return; bekle = true;
      requestAnimationFrame(() => {
        bekle = false; const mid = track.scrollLeft + track.clientWidth / 2; let en = 0, fark = 1e9;
        exs.forEach((e, k) => { const d = Math.abs(e.offsetLeft + e.offsetWidth / 2 - mid); if (d < fark) { fark = d; en = k; } });
        if (en !== aktif) { isaretle(en); vib(4); }
      });
    }
    ot.dinle(track, 'scroll', kaydir, { passive: true });
    ot.dinle(kok, 'keydown', e => {
      if (kok.dataset.s !== '2') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); merkez(Math.min(ESER.length - 1, aktif + 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); merkez(Math.max(0, aktif - 1)); }
    });
    isaretle(0);

    /* ---- sahne 3: detay ---- */
    function detay(i) {
      secili = i; const e = ESER[i], v = q('.g-dvis');
      v.style.setProperty('--gl', e.glow); q('.g-big', v).innerHTML = cizim(e.c);
      q('.g-dno').textContent = 'ESER No. ' + no(i) + ' · ' + e.alt; q('.g-dad').textContent = e.ad; q('.g-dalt').textContent = ''; q('.g-dac').textContent = e.ac;
      q('.g-fiyat b').textContent = para(e.fiyat);
      q('.g-oz').innerHTML = e.oz.map(o => '<div><dt></dt><dd></dd></div>').join('');
      qa('.g-oz div').forEach((d, k) => { q('dt', d).textContent = e.oz[k][0]; q('dd', d).textContent = e.oz[k][1]; });
      git(3);
    }

    /* ---- sahne 4: açık artırma ---- */
    function artirma() {
      sol(); const o = anim = E.oturum(), e = ESER[secili];
      q('.g-aeser').innerHTML = cizim(e.c); q('.g-ad').textContent = e.ad; q('.g-s4').style.setProperty('--gl', e.glow);
      const fy = q('.g-afyt'), st = q('.g-asat'), kf = q('.g-konfeti'); kf.textContent = ''; kok.classList.remove('g-satildi');
      fy.textContent = para(Math.round(e.fiyat * .1)); st.textContent = SATICI[0]; git(4);
      const sure = reduced ? 600 : 3600, t0 = performance.now(); let si = 0;
      const dur = o.kare(() => {
        const p = Math.min(1, (performance.now() - t0) / sure), k = 1 - Math.pow(1 - p, 2.4);
        fy.textContent = para(Math.round(e.fiyat * (.1 + .9 * k)));
        const yeni = Math.min(SATICI.length - 1, Math.floor(p * SATICI.length * .999));
        if (yeni !== si) { si = yeni; st.textContent = SATICI[si]; S.yeniden(st, 'g-in'); vib(8); }
        if (p >= 1) { dur(); vur(); }
      });
      function vur() {
        st.textContent = 'SATILDI! Alıcı: Hira.'; S.yeniden(st, 'g-in'); kok.classList.add('g-satildi'); vib([40, 50, 90]);
        guvenli(() => FX.burst(innerWidth * .5, innerHeight * .38));
        if (!reduced) for (let i = 0; i < 40; i++) {
          const c = make('i', ''); c.style.setProperty('--x', rnd(-45, 45).toFixed(0) + 'vw'); c.style.setProperty('--y', rnd(-30, 50).toFixed(0) + 'vh'); c.style.setProperty('--r', rnd(-400, 400).toFixed(0) + 'deg');
          c.style.setProperty('--d', rnd(0, .35).toFixed(2) + 's'); c.style.background = ['#ffe08a', '#e8c680', '#fff3b0', '#ff9bbd'][i % 4]; kf.append(c);
        }
        o.zaman(() => final(), reduced ? 900 : 2400);
      }
    }

    /* ---- sahne 5: final açılışı ---- */
    function final() {
      sol(); const o = anim = E.oturum(), e = ESER[secili];
      const k5 = sah[5]; k5.classList.remove('g-ac', 'g-yaz', 'g-bit');
      q('.g-fm').textContent = ''; q('.g-fm2').textContent = ''; q('.g-fn').textContent = 'Seçtiğin eser "' + e.ad + '" için üzgünüz: kutuya sığmadı. Fiyat farkını pastayla ödeyeceksin.';
      git(5); sayac.art(1);
      const t = reduced ? 0 : 1;
      o.zaman(() => k5.classList.add('g-ac'), t * 1700);
      o.zaman(() => { k5.classList.add('g-yaz'); guvenli(() => FX.kutlama()); vib([30, 40, 30, 40, 120]); yazdir(q('.g-fm'), FINAL, o, () => yazdir(q('.g-fm2'), FINAL2, o, () => k5.classList.add('g-bit'))); }, t * 3700);
    }
    /* metni kelime kelime belirt (ekran okuyucu için tam metin hemen yazılır, görsel olarak açılır) */
    function yazdir(el, metin, o, bitince) {
      el.textContent = '';
      if (reduced) { el.textContent = metin; bitince(); return; }
      const kel = metin.split(' '); let i = 0;
      const id = o.aralik(() => { el.textContent = kel.slice(0, ++i).join(' '); if (i >= kel.length) { o.iptalAralik(id); o.zaman(bitince, 500); } }, 150);
    }

    /* ---- düğmeler ---- */
    kok.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b || !kok.contains(b)) return;
      const f = b.closest('.g-frame') ? b.closest('.g-ex') : null;
      if (f) { const i = +f.dataset.i; if (i === aktif) { vib(10); detay(i); } else merkez(i); return; }
      switch (b.dataset.a) {
        case 'gir': vib(12); git(2); break;
        case 'girise': git(1); break;
        case 'onceki': merkez(Math.max(0, aktif - 1)); break;
        case 'sonraki': merkez(Math.min(ESER.length - 1, aktif + 1)); break;
        case 'incele': vib(10); detay(aktif); break;
        case 'sergiye': git(2); break;
        case 'sec': vib([20, 40, 20]); artirma(); break;
        case 'tekrar': git(2); break;
        case 'cik': E.kapat(); break;
      }
    });
    ot.dinle(document, 'visibilitychange', () => { if (document.hidden && (kok.dataset.s === '4')) { sol(); git(2); } });
    git(1);
  });
}

/* ======================= DAVETİYE KARTI (eski hediye bloğunun yerine) ======================= */
guvenli(() => {
  const to6 = $('#to6'); if (!to6) return;
  const eski = $('#shx-gift');
  const kart = make('section', 'gal-kart'); kart.id = 'gal-kart';
  kart.innerHTML = '<div class="gk-cerceve" aria-hidden="true"></div><p class="gk-k">Sergi &amp; Açık Artırma</p><h3>Hira\'ya Ne Alsak?</h3>' +
    '<p class="gk-t">Sekiz eser sergileniyor. Birini seçeceksin. Yalnızca davetliler girebilir; sen davetlisin.</p><button type="button" class="gk-btn">DAVETİYEYİ AÇ</button>';
  if (eski) eski.replaceWith(kart); else to6.before(kart);
  kart.querySelector('.gk-btn').addEventListener('click', () => { vib(12); ac(); });
  kart.addEventListener('pointerdown', e => e.stopPropagation());
});

window.__gallery = { ac };
(window.__ok = window.__ok || []).push('gallery');
})();
