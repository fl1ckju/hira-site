/* lab.js — HİRA LABORATUVARI · Duygusal Analiz Merkezi
   Eski "Ruh Hali Ölçer" yerine #moodHost içinde çalışır (mood.js, __lab.kur'u çağırır; bu dosya yüklenmezse eski ölçer sürer).
   Sahneler: 1) Giriş  2) Numune seçimi  3) Analiz süreci  4) Sonuçlar
   Tüm zamanlayıcılar/kare döngüleri __exp.oturum() ile izlenir; sayfa kapanınca (#ch36 gizlenince) hepsi temizlenir. */
(() => {
'use strict';
const S = window.__shx, E = window.__exp;
if (!S || !E) { console.error('lab.js: shitpost.js / exp.js eksik'); return; }
const { make, vib, reduced, rnd, setFoto, sayac } = S;

/* ======================= VERİ ======================= */
/* seçenek: [ad, kod, renk, [pasta aşkı, sabır, sinir, göz devirme] taban değerleri] */
const SECENEK = [
  { ad: 'Kahve', kod: 'NUMUNE-01', renk: '#ffb454', taban: [70, 40, 75, 60] },
  { ad: 'Pasta', kod: 'NUMUNE-02', renk: '#ff6fb1', taban: [100, 55, 20, 35] },
  { ad: 'Uyku',  kod: 'NUMUNE-03', renk: '#9aa5ff', taban: [40, 25, 85, 90] },
  { ad: 'Mesaj', kod: 'NUMUNE-04', renk: '#5dffb0', taban: [55, 15, 70, 95] }
];
const DURUM = [
  ['Kafein seviyesi taranıyor…', 'Damarlarda espresso tespit edildi.', 'Kahvesiz sabır modülü çalışmıyor.', 'Üçüncü fincan hesaba katılıyor…', '"Bir tane daha" refleksi doğrulandı.'],
  ['Krema yoğunluğu ölçülüyor…', 'Pasta radarı tam kapasite çalışıyor.', 'Çatal hareketi analiz ediliyor… hızlı.', 'Son dilim için savaş planı hesaplanıyor.', '"Sadece tadına baktım" savunması kaydedildi.'],
  ['Uyku borcu hesaplanıyor…', 'Hata: Yastıkla bağ fazla güçlü.', '"Beş dakika daha" sayacı taştı.', 'Sabah yüzü kalibre ediliyor…', 'Alarm sesi düşman olarak sınıflandırıldı.'],
  ['"Görüldü" bilgisi taranıyor…', 'Okunmamış mesaj yığını: tehlikeli.', '"Bakmamışım" cevabı hazırlanıyor.', 'Üç gün gecikmiş yanıt simüle ediliyor…', 'Sesli mesaj karşısında göz devirme tespit edildi.']
];
const TANI = [
  ['Kronik Kafein Bağımlılığı', 'Espresso Damarlı Birey', 'Fincan Dolmadan Çalışmayan Sistem'],
  ['Terminal Pasta Aşkı', 'Krema Seviyesi Kritik', 'Son Dilim Savunucusu'],
  ['Yastık Bağımlısı', 'Sabah İnsanı Olmayan Birey', 'Uyku Borcu Faiz İşliyor'],
  ['Okundu Ama Cevapsız Sendromu', 'Sesli Mesaj Alerjisi', 'Görüldü Ustası']
];
const NOT = [
  ['Öneri: Kahve ikmal edilmeden Hira ile müzakere yapılmaz.', 'Not: Üçüncü fincandan sonra espri toleransı iki katına çıkar.', 'Uyarı: Kahvesiz Hira, ayarları bozuk cihaz gibi çalışır.'],
  ['Öneri: Sinir düşük, çünkü pasta yakında. Pasta elden bırakılmamalı.', 'Not: Son dilim konusunda hukuki süreç başlatılabilir.', 'Rapor: Pasta varsa sistem huzurlu. Yoksa… yok.'],
  ['Öneri: Sabaha kadar konuşmayın. Öğleden sonra da riskli.', 'Not: "Beş dakika daha" fiilen yarım saat demektir.', 'Uyarı: Uyanık Hira ile erken saatte espri yapmak yasaktır.'],
  ['Öneri: Sesli mesaj göndermeyin. Gözler dayanamaz.', 'Not: "Görüldü" ile "cevap" arası mesafe: yaklaşık 3 gün.', 'Uyarı: Tek başına "naber" göz devirmeyi otomatik tetikler.']
];
/* metrik yorumu: [düşük, orta, yüksek] */
const YORUM = [
  ['Pasta mı? Bugün diyette gibi.', 'Pasta görürse durur, bakar, yer.', 'Pasta için tren bile durdurur.'],
  ['Sabır çoktan emekli.', 'Sabır var ama kısa vadeli.', 'Sabır taşıyor, sorun yok.'],
  ['Sakin. Şüpheli derecede.', 'Kaşlar hafif yukarıda.', 'Yaklaşma. Kaşlar alarmda.'],
  ['Göz sabit. Mucize.', 'Ara sıra bir tur atıyor.', 'Gözler turbo modunda.']
];
const OKUMA = [['NABIZ', 'bpm', 60, 140], ['KAŞ AÇISI', '°', 5, 70], ['PASTA SİNYALİ', '%', 10, 100], ['SABIR VOLTU', 'V', 0, 12]];
const METRIK = ['Pasta aşkı', 'Sabır', 'Sinir', 'Göz devirme'];

/* ======================= ÇİZİMLER ======================= */
const IC = {
  Kahve: '<svg viewBox="0 0 64 64" aria-hidden="true"><g class="ic-steam"><path d="M22 20c-4-4 4-6 0-12"/><path d="M32 20c-4-4 4-6 0-12"/><path d="M42 20c-4-4 4-6 0-12"/></g><path class="ic-fill" d="M14 26h34v14a14 14 0 0 1-14 14h-6a14 14 0 0 1-14-14z"/><path d="M48 30h4a6 6 0 0 1 0 12h-5"/><path d="M10 58h44"/></svg>',
  Pasta: '<svg viewBox="0 0 64 64" aria-hidden="true"><path class="ic-fill" d="M8 54V40l48-10v24z"/><path d="M8 47l48-10M8 54h48"/><path d="M8 40c6 4 10-3 15 1s9-4 14 0 10-5 19-11"/><g class="ic-cherry"><circle cx="44" cy="24" r="5"/><path d="M44 19c0-5 4-8 8-9"/></g></svg>',
  Uyku: '<svg viewBox="0 0 64 64" aria-hidden="true"><path class="ic-fill" d="M34 10a22 22 0 1 0 20 32A24 24 0 0 1 34 10z"/><text class="ic-z z1" x="44" y="26">z</text><text class="ic-z z2" x="50" y="16">z</text><text class="ic-z z3" x="56" y="8">Z</text></svg>',
  Mesaj: '<svg viewBox="0 0 64 64" aria-hidden="true"><path class="ic-fill" d="M10 12h44a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H30l-10 10V42H10a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z"/><circle class="ic-dot d1" cx="22" cy="27" r="3"/><circle class="ic-dot d2" cx="32" cy="27" r="3"/><circle class="ic-dot d3" cx="42" cy="27" r="3"/></svg>'
};

/* merkezi analiz makinesi */
function makine() {
  let tik = '';
  for (let i = 0; i < 48; i++) {
    const a = i * 7.5 * Math.PI / 180, u = i % 4 === 0 ? 9 : 4;
    tik += '<line x1="' + (120 + Math.cos(a) * 84).toFixed(1) + '" y1="' + (116 + Math.sin(a) * 84).toFixed(1) +
           '" x2="' + (120 + Math.cos(a) * (84 - u)).toFixed(1) + '" y2="' + (116 + Math.sin(a) * (84 - u)).toFixed(1) + '"/>';
  }
  return '<svg class="lab-mk" viewBox="0 0 240 240" aria-hidden="true"><defs>' +
    '<radialGradient id="labCore"><stop offset="0" stop-color="#eaffff"/><stop offset=".3" stop-color="#5ef2ff"/><stop offset="1" stop-color="#5ef2ff" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="labBeam" x1="0" x2="1"><stop offset="0" stop-color="#5ef2ff" stop-opacity="0"/><stop offset="1" stop-color="#5ef2ff" stop-opacity=".6"/></linearGradient></defs>' +
    '<ellipse class="mk-pad" cx="120" cy="222" rx="88" ry="12"/><ellipse class="mk-pad2" cx="120" cy="222" rx="58" ry="7"/>' +
    '<g class="mk-r1"><circle cx="120" cy="116" r="104"/></g><g class="mk-r2">' + tik + '</g>' +
    '<g class="mk-sweep"><path d="M120 116L204 116A84 84 0 0 0 180 56.6Z" fill="url(#labBeam)"/></g>' +
    '<g class="mk-hex"><polygon points="120,62 166.8,89 166.8,143 120,170 73.2,143 73.2,89"/></g>' +
    '<circle class="mk-core" cx="120" cy="116" r="40" fill="url(#labCore)"/><circle cx="120" cy="116" r="14" class="mk-eye"/>' +
    '<g class="mk-orb"><circle cx="120" cy="22" r="3.5"/></g><g class="mk-orb mk-orb2"><circle cx="120" cy="40" r="2.5"/></g></svg>';
}

/* ======================= GÖSTERGE YARDIMCILARI ======================= */
const kutup = (cx, cy, r, d) => [cx + r * Math.cos(d * Math.PI / 180), cy + r * Math.sin(d * Math.PI / 180)];
function yay(cx, cy, r, a0, a1) {
  const p0 = kutup(cx, cy, r, a0), p1 = kutup(cx, cy, r, a1);
  return 'M' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + 'A' + r + ' ' + r + ' 0 ' + ((a1 - a0) > 180 ? 1 : 0) + ' 1 ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2);
}
const renk = (v, ters) => { const k = ters ? 100 - v : v; return k > 66 ? '#ff5d7a' : k > 33 ? '#ffd166' : '#5dffb0'; };
const bant = v => v < 34 ? 0 : v < 67 ? 1 : 2;
const kirp = (v, a = 3, b = 100) => Math.max(a, Math.min(b, Math.round(v)));

/* dört gösterge iskeleti; değerler sonra CSS geçişleriyle canlandırılır */
function gostergeler() {
  const yari = yay(60, 62, 48, 180, 360), kadran = yay(60, 62, 46, 135, 405);
  let hucre = ''; for (let i = 0; i < 10; i++) hucre += '<i style="--i:' + i + '"></i>';
  let tikler = ''; for (let i = 0; i <= 10; i++) { const a = 135 + i * 27, p = kutup(60, 62, 52, a), q = kutup(60, 62, 56, a); tikler += '<line x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1) + '"/>'; }
  return [
    /* 0 · Pasta aşkı: yarım daire yay */
    '<svg viewBox="0 0 120 74" aria-hidden="true"><path class="g-iz" d="' + yari + '" pathLength="100"/><path class="g-dol" d="' + yari + '" pathLength="100"/><text class="g-no" x="60" y="60">0</text></svg>',
    /* 1 · Sabır: 10 hücreli pil */
    '<div class="g-pil" aria-hidden="true">' + hucre + '</div><b class="g-pno">0</b>',
    /* 2 · Sinir: 270° kadran + iğne */
    '<svg viewBox="0 0 120 100" aria-hidden="true"><path class="g-iz" d="' + kadran + '" pathLength="100"/><path class="g-tehlike" d="' + yay(60, 62, 46, 330, 405) + '"/>' +
    '<g class="g-tik">' + tikler + '</g><g class="g-igne"><path d="M60 62L57 60 60 22 63 60Z"/></g><circle cx="60" cy="62" r="5" class="g-mil"/><text class="g-no" x="60" y="92">0</text></svg>',
    /* 3 · Göz devirme: halka + dönen göz bebeği */
    '<svg viewBox="0 0 120 112" aria-hidden="true"><circle class="g-iz" cx="60" cy="48" r="38" pathLength="100" transform="rotate(-90 60 48)"/><circle class="g-dol" cx="60" cy="48" r="38" pathLength="100" transform="rotate(-90 60 48)"/>' +
    '<path class="g-goz" d="M36 48q24-20 48 0q-24 20-48 0z"/><g class="g-bebek"><circle cx="60" cy="48" r="8" class="g-iris"/><circle cx="60" cy="48" r="3.2" class="g-sk"/></g><text class="g-no g-gno" x="60" y="108">0</text></svg>'
  ];
}

/* ======================= KUR ======================= */
function kur(host, olcumSonrasi) {
  if (!host) return;
  const kok = make('div', 'lab'); kok.dataset.s = '1';
  const opt = SECENEK.map((o, i) =>
    '<button type="button" class="lab-opt" data-i="' + i + '" style="--c:' + o.renk + '"><span class="lo-k">' + o.kod + '</span><span class="lo-ic">' + IC[o.ad] + '</span><span class="lo-ad">' + o.ad + '</span><span class="lo-sg" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button>').join('');
  const okuma = OKUMA.map((o, i) => '<li><span>' + o[0] + '</span><b data-o="' + i + '">–</b><em>' + o[1] + '</em></li>').join('');
  const g = gostergeler();
  const kart = METRIK.map((m, i) => '<div class="lab-g lab-g' + i + '" data-g="' + i + '"><div class="lg-vis">' + g[i] + '</div><h4>' + m + '</h4><p class="lg-y"></p></div>').join('');
  kok.innerHTML =
    '<div class="lab-bg" aria-hidden="true"><span class="lb-grid"></span><span class="lb-glow"></span><span class="lb-line"></span></div>' +
    /* 1 · Giriş */
    '<div class="lab-sc lab-s1 on"><div class="lab-ust"><i></i><span>HL-15 · ÇEVRİMİÇİ</span></div>' + makine() +
    '<h3 class="lab-baslik">HİRA LABORATUVARI</h3><p class="lab-alt">Duygusal Analiz Merkezi</p>' +
    '<button type="button" class="lab-btn" data-a="basla"><span>ANALİZİ BAŞLAT</span></button></div>' +
    /* 2 · Numune seçimi */
    '<div class="lab-sc lab-s2"><div class="lab-ust"><i></i><span>ADIM 1 / 3 · NUMUNE SEÇİMİ</span></div><h3 class="lab-baslik lab-k">Numuneni seç</h3>' +
    '<p class="lab-alt">Hangi uyaranla analiz edelim?</p><div class="lab-optg">' + opt + '</div></div>' +
    /* 3 · Analiz */
    '<div class="lab-sc lab-s3"><div class="lab-ust"><i></i><span id="labSu">ANALİZ SÜRÜYOR</span></div>' +
    '<div class="lab-ret"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="r1" cx="100" cy="100" r="96"/><circle class="r2" cx="100" cy="100" r="84"/>' +
    '<path class="r3" d="M100 4v14M100 182v14M4 100h14M182 100h14"/></svg><div class="lab-foto"><img alt="" decoding="async"><span class="lab-tara"></span></div></div>' +
    '<div class="lab-prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><p class="lab-yuzde"><b>0</b>%</p>' +
    '<ul class="lab-okuma">' + okuma + '</ul><ul class="lab-log" aria-live="polite"></ul></div>' +
    /* 4 · Sonuç */
    '<div class="lab-sc lab-s4"><div class="lab-ust"><i></i><span>ANALİZ TAMAMLANDI</span></div><p class="lab-kod"></p><h3 class="lab-tani"></h3>' +
    '<div class="lab-gg">' + kart + '</div><p class="lab-not"></p>' +
    '<div class="lab-bt"><button type="button" class="lab-btn" data-a="tekrar"><span>TEKRAR ANALİZ ET</span></button>' +
    '<button type="button" class="lab-btn lab-btn2" data-a="don"><span>LABORATUVARA DÖN</span></button></div></div>';
  host.append(kok);
  kok.addEventListener('pointerdown', e => e.stopPropagation());

  const q = (s, r = kok) => r.querySelector(s), qa = (s, r = kok) => [...r.querySelectorAll(s)];
  const sahneler = [null, q('.lab-s1'), q('.lab-s2'), q('.lab-s3'), q('.lab-s4')];
  const img = q('.lab-foto img'), log = q('.lab-log'), prog = q('.lab-prog'), progI = q('i', prog), yuz = q('.lab-yuzde b');
  const son = { tani: -1, not: -1 };
  let sec = 0, analiz = null, sonucOt = null, ilkSonuc = true;

  /* çalışan her şeyi durdur */
  function iptal() { if (analiz) { analiz.temizle(); analiz = null; } if (sonucOt) { sonucOt.temizle(); sonucOt = null; } }

  /* sahne geçişi: ekranın tamamı gizli sahnelerle aynı hücrede durur (yükseklik taşması olmaz) */
  function git(n) {
    kok.dataset.s = String(n);
    sahneler.forEach((s, i) => { if (!s) return; const ac = i === n; s.classList.toggle('on', ac); s.inert = !ac; s.setAttribute('aria-hidden', ac ? 'false' : 'true'); });
    const hedef = q('.lab-btn, .lab-opt', sahneler[n]);
    if (hedef && n !== 3) setTimeout(() => { try { if (kok.isConnected) hedef.focus({ preventScroll: true }); } catch (_) { /* geç */ } }, 80);
  }
  sahneler.forEach((s, i) => { if (s && i !== 1) s.inert = true; });

  /* ---------- Sahne 3: analiz süreci ---------- */
  function analizBaslat(i) {
    iptal(); sec = i; const ot = analiz = E.oturum(), o = SECENEK[i];
    kok.style.setProperty('--c', o.renk);
    log.innerHTML = ''; progI.style.transform = 'scaleX(0)'; yuz.textContent = '0'; prog.setAttribute('aria-valuenow', '0');
    q('#labSu').textContent = 'ANALİZ SÜRÜYOR · ' + o.ad.toUpperCase();
    setFoto(img); git(3);
    const SURE = reduced ? 1500 : 5800, t0 = performance.now(), mesajlar = DURUM[i];
    let sonMesaj = -1, sonOkuma = 0, bitti = false;
    ot.kare(() => {
      const t = performance.now(), p = Math.min(1, (t - t0) / SURE), e = 1 - Math.pow(1 - p, 2.2);
      progI.style.transform = 'scaleX(' + e.toFixed(3) + ')'; const pc = Math.round(e * 100);
      yuz.textContent = String(pc); prog.setAttribute('aria-valuenow', String(pc));
      const mi = Math.min(mesajlar.length - 1, Math.floor(p * mesajlar.length));
      if (mi > sonMesaj) {
        sonMesaj = mi; const li = make('li', '', mesajlar[mi]); log.append(li);
        while (log.children.length > 3) log.firstChild.remove();
        vib(6);
        if (mi % 2 === 0 && !reduced) setFoto(img);
      }
      if (t - sonOkuma > 110 || p >= 1) {
        sonOkuma = t;
        OKUMA.forEach((r, k) => { const el = q('[data-o="' + k + '"]'); el.textContent = (k === 3 ? rnd(r[2], r[3]).toFixed(1) : Math.round(rnd(r[2], r[3]))); });
      }
      if (p >= 1 && !bitti) { bitti = true; ot.zaman(() => sonuc(i), reduced ? 100 : 500); }
    });
  }

  /* ---------- Sahne 4: sonuçlar ---------- */
  function sonuc(i) {
    if (sonucOt) sonucOt.temizle(); const ot = sonucOt = E.oturum();
    const o = SECENEK[i];
    const degerler = o.taban.map(v => kirp(v + rnd(-14, 14)));
    /* tanı ve not: art arda aynısı gelmesin */
    const sec3 = (n, anahtar) => { let k; do { k = Math.floor(Math.random() * 3); } while (k === son[anahtar] && n > 1); son[anahtar] = k; return k; };
    q('.lab-kod').textContent = o.kod + ' · ' + o.ad.toUpperCase() + ' ANALİZİ';
    q('.lab-tani').textContent = 'TANI: ' + TANI[i][sec3(3, 'tani')];
    q('.lab-not').textContent = NOT[i][sec3(3, 'not')];
    /* göstergeleri sıfırla (geçişler yeniden oynasın) */
    kok.classList.remove('lab-sonuc'); void kok.offsetWidth;
    qa('.lab-g').forEach((c, k) => { q('.lg-y', c).textContent = YORUM[k][bant(degerler[k])]; });
    git(4);
    ot.zaman(() => {
      kok.classList.add('lab-sonuc');
      const [pa, sb, sn, gd] = degerler;
      /* 0 · yarım daire */
      const c0 = q('.lab-g0'); q('.g-dol', c0).style.strokeDasharray = pa + ' 100'; q('.g-dol', c0).style.stroke = renk(pa, false);
      /* 1 · pil hücreleri */
      const c1 = q('.lab-g1'), dolu = Math.round(sb / 10); qa('i', c1).forEach((h, k) => { h.classList.toggle('dolu', k < dolu); h.style.setProperty('--r', renk(sb, true)); });
      /* 2 · kadran iğnesi */
      const c2 = q('.lab-g2'); q('.g-igne', c2).style.transform = 'rotate(' + (-135 + sn * 2.7) + 'deg)'; q('.g-igne', c2).style.fill = renk(sn, false);
      /* 3 · göz halkası + dönüş hızı */
      const c3 = q('.lab-g3'); q('.g-dol', c3).style.strokeDasharray = gd + ' 100'; q('.g-dol', c3).style.stroke = renk(gd, false);
      q('.g-bebek', c3).style.animationDuration = (4.2 - gd * 0.036).toFixed(2) + 's';
      /* sayılar: kareyle sayarak yükselir */
      const sayilar = [q('.g-no', c0), q('.g-pno', c1), q('.g-no', c2), q('.g-no', c3)];
      
      const s0 = performance.now(), D = reduced ? 1 : 1500;
      ot.kare(() => {
        const p = Math.min(1, (performance.now() - s0) / D), e = 1 - Math.pow(1 - p, 3);
        sayilar.forEach((el, k) => { el.textContent = '%' + Math.round(degerler[k] * e); });
      });
      vib([14, 30, 14]);
    }, 160);
    if (ilkSonuc) { ilkSonuc = false; sayac.art(1); if (olcumSonrasi) olcumSonrasi(); } else sayac.art(1);
  }

  /* ---------- düğmeler ---------- */
  kok.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || !kok.contains(b)) return;
    if (b.dataset.a === 'basla') { vib(12); git(2); }
    else if (b.classList.contains('lab-opt')) { vib([10, 30, 10]); analizBaslat(+b.dataset.i); }
    else if (b.dataset.a === 'tekrar') { vib(12); analizBaslat(sec); }
    else if (b.dataset.a === 'don') { vib(10); iptal(); git(1); }
  });

  /* #ch36 kapanınca (geri / devam) tüm işleri durdur ve girişe dön */
  const bolum = host.closest('section');
  if (bolum) new MutationObserver(() => { if (bolum.hidden) { iptal(); git(1); } }).observe(bolum, { attributes: true, attributeFilter: ['hidden'] });
  addEventListener('pagehide', iptal);
  document.addEventListener('visibilitychange', () => { if (document.hidden && kok.dataset.s === '3') { iptal(); git(2); } });
  git(1);
}

window.__lab = { kur };
(window.__ok = window.__ok || []).push('lab');
})();
