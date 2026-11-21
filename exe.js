/* exe.js — HIRA.EXE · THE PATIENCE SYSTEM (eski "Darlama Butonu" yerine)
   Eski kart (#shx-darla) bu dosya çalışınca bir "çalıştır" kartıyla değiştirilir; asıl deneyim __exp ile tam ekran açılır.
   Sahneler: Açılış (terminal) → Ana etkileşim (6 seviye) → Çöküş (pencere yağmuru + CRT kapanması + mavi ekran) → Yeniden başlat.
   Tüm zamanlayıcı / dinleyiciler oturuma bağlıdır; ✕ ile kapanınca tek hamlede temizlenir. */
(() => {
'use strict';
const S = window.__shx, E = window.__exp;
if (!S || !E) { console.error('exe.js: shitpost.js / exp.js eksik'); return; }
const { $, make, vib, reduced, rnd, deste, sayac, FX, guvenli } = S;

/* ======================= SEVİYELER ======================= */
const CRASH_AT = 60;                       /* bu kadar darlamada sistem çöker */
const ESIK = [0, 6, 16, 30, 44, 60];       /* her seviyenin başladığı darlama sayısı */
const SEV = [
  { ad: 'Sakin', durum: 'STABİL', etiket: 'DARLA', alt: 'basılı tutabilirsin', msj: [
    'Hira.exe çalışıyor. Ortam huzurlu, çay demli.', 'Sistem şu an hiçbir şeye kızgın değil. Tuhaf.', 'Darlama sayacı: masum görünüyor.',
    'Pasta rezervi yeterli. Moral yüksek.', 'Hira bir şey fark etti ama henüz söylemiyor.', 'CPU %3. Gerisi hâlâ "beş dakika daha" modunda.'] },
  { ad: 'Hafif Rahatsız', durum: 'HAFİF GERGİN', etiket: 'DARLA.', alt: 'bir daha mı?', msj: [
    'Hira bir kaşını kaldırdı. Sistem not aldı.', 'Fan sesi arttı. Bu uyarı değil, sadece iç çekiş.', '"Tamam, anladım" mesajı taslaklara kaydedildi.',
    'Göz devirme motoru ısınıyor…', 'Sabır modülü: "Beni sonra ara" diyor.', 'Bildirim: Hira "ya yeter" yazdı ve sildi.'] },
  { ad: 'Şüpheli Sessizlik', durum: 'SESSİZ…', etiket: '…', alt: 'hâlâ orada mısın?', msj: [
    '…', 'Sistem sustu. Bu hiç iyi bir işaret değil.', 'Hira artık cevap vermiyor. Sadece bakıyor.', 'Ekran loş. Biri izliyor. Sen.',
    'Sessizlik de bir cevaptır. Genelde en kötüsü.', '"Görüldü" üç dakikadır orada duruyor.'] },
  { ad: 'Sabır Tükeniyor', durum: 'ISINIYOR', etiket: 'DARLAMA!', alt: 'cesursun…', msj: [
    'Sabır yüzde 40\'ın altında. Hâlâ basıyorsun. Cesursun.', 'Hata 0x15: Tahammül bulunamadı.', 'Hira "kahve içmem lazım" diyerek ayağa kalktı.',
    'Gözler devriliyor. Tam 360°. Yağlanmış gibi.', 'Sinir seviyesi kabarıyor. Pasta ile bastırılabilir.', 'Uyarı: Basmaya devam etmenin cezası yok ama bakışı var.'] },
  { ad: 'KRİTİK DURUM', durum: 'KRİTİK!', etiket: 'DUR!!', alt: 'son uyarı', msj: [
    'KRİTİK: Sabır depolarında son damla!', 'ALARM! Hira\'nın kaşı sistem sınırını aştı.', 'Soğutma başarısız. Pasta ile söndürmeyi deneyin.',
    'Her darlama bir "yeter artık!" demek.', 'Yangın söndürücü: "Şu an sadece pasta."', 'Son uyarı: Sistem sana uzaktan bakıyor ve gülmüyor.'] },
  { ad: 'SİSTEM ÇÖKTÜ', durum: 'ÇÖKTÜ', etiket: '✕', alt: '', msj: ['…'] }
];
const POPUP = ['Sabır.dll yanıt vermiyor', 'Göz devirme motoru aşırı ısındı', 'Beklenmeyen darlama algılandı', 'Pasta bulunamadı', 'Hira.exe: "yeter" yazdı', 'Kaş sensörü: tavan'];
const CASKAD = [['Hira.exe', 'Hira.exe çalışmayı durdurdu.'], ['Sabır.dll', 'Sabır.dll bulunamadı.'], ['Uyarı', 'Göz devirme motoru aşırı ısındı.'], ['Hata', 'Beklenmeyen darlama algılandı.'],
  ['Sistem', 'Pasta bulunamadı: kritik.'], ['Hira.exe', '"Yeter artık." (Tamam / Tamam)'], ['Uyarı', 'Bu işlem geri alınamaz. Pastayı da.'], ['Kaş.sys', 'Kaş sensörü tavana çarptı.']];
const BOOT = [
  'HIRA.EXE v15.0  ·  (c) Sabır Sistemleri A.Ş.', '', '> çekirdek yükleniyor ............ TAMAM', '> pasta_radari.sys .............. TAMAM',
  '> sabir.dll ..................... UYARI: boş', '> goz_devirme_motoru.drv ........ TAMAM (fazla iyi)', '> 15_yas_modulu ................. YÜKLENDİ (maalesef)', '',
  'Hoş geldin. Bu sistem sabırla çalışır.', 'Kullanım: Düğmeye bas. Basılı tutarsan daha da güzel.', 'Uyarı: Sabır sınırlıdır. Üreticinin sabrı dahil.'
];
const BOOT2 = ['> sistem yeniden başlatılıyor ...', '> sabir.dll ..................... %100 (bir süreliğine)', '> kaş sensörü sıfırlandı ........ TAMAM', 'Hadi bakalım. Bu sefer daha nazik ol.'];

const seviye = n => { let l = 0; ESIK.forEach((e, i) => { if (n >= e) l = i; }); return l; };
const boz = m => m.replace(/[a-zçğıöşü]/gi, c => Math.random() < 0.07 ? '▒▓#░'[Math.floor(Math.random() * 4)] : c);
const sifir = (n, k) => String(n).padStart(k, '0');

/* büyük düğme çizimi: dönen halka + çatlak katmanı */
const DUGME = '<span class="x-ring" aria-hidden="true"></span><span class="x-ring x-ring2" aria-hidden="true"></span><span class="x-core"><b class="x-lab">DARLA</b><small class="x-alt">basılı tutabilirsin</small></span>' +
  '<svg class="x-crack" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4 46 26 58 40 42 54 56 70 48 96M58 40 80 34M42 54 18 60M56 70 78 78"/></svg>';
const GOZ = '<svg viewBox="0 0 120 70" aria-hidden="true"><path class="e-k" d="M6 35Q60-18 114 35Q60 88 6 35Z"/><circle class="e-i" cx="60" cy="35" r="17"/><circle class="e-p" cx="60" cy="35" r="7"/></svg>';

/* ======================= DENEYİM ======================= */
function ac() {
  E.ac('exe', 'HIRA.EXE — Sabır Sistemi', (host, ot) => {
    const kok = make('div', 'x'); kok.dataset.lv = '1'; kok.dataset.sc = 'boot';
    let seg = ''; for (let i = 0; i < 20; i++) seg += '<i></i>';
    let pip = ''; SEV.forEach((s, i) => { pip += '<li data-p="' + (i + 1) + '"><b>' + (i + 1) + '</b></li>'; });
    kok.innerHTML =
      '<div class="x-bg" aria-hidden="true"><i class="x-grid"></i><i class="x-heat"></i><i class="x-scan"></i><i class="x-noise"></i></div>' +
      '<div class="x-over" aria-hidden="true"><i class="x-vig"></i><i class="x-siren"></i><i class="x-haz x-haz1"></i><i class="x-haz x-haz2"></i><i class="x-gl x-gl1"></i><i class="x-gl x-gl2"></i><i class="x-gl x-gl3"></i>' +
      '<div class="x-pops"></div><i class="x-flash"></i></div>' +
      '<header class="x-top"><b>HIRA.EXE</b><span class="x-stat">DURUM: BEKLEMEDE</span></header>' +
      /* 1 · açılış */
      '<section class="x-sc x-boot"><pre class="x-term" aria-live="polite"></pre><button type="button" class="x-go" hidden>SİSTEMİ BAŞLAT</button><p class="x-skip">ekrana dokun: atla</p></section>' +
      /* 2 · ana etkileşim */
      '<section class="x-sc x-main" aria-hidden="true"><div class="x-hud"><div class="x-cnt"><small>DARLAMA SAYACI</small><b class="x-n">000</b></div>' +
      '<div class="x-pat"><small>SABIR <em class="x-pp">100%</em></small><div class="x-seg" role="progressbar" aria-label="Sabır" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">' + seg + '</div></div></div>' +
      '<div class="x-lvl"><span class="x-lvn">SEVİYE 1 · SAKİN</span><ul class="x-pips">' + pip + '</ul></div>' +
      '<div class="x-stage"><i class="x-eye" aria-hidden="true">' + GOZ + '</i><button type="button" class="x-big" aria-label="Darla">' + DUGME + '</button></div>' +
      '<p class="x-msg" aria-live="polite"></p>' +
      '<ul class="x-sys"><li><span>CPU</span><i><u class="s-cpu"></u></i></li><li><span>ISI</span><i><u class="s-isi"></u></i></li><li><span>KAŞ</span><i><u class="s-kas"></u></i></li></ul></section>' +
      /* 3 · çöküş */
      '<section class="x-sc x-fail"><div class="x-casc"></div><div class="x-bsod"><b class="x-yuz">:(</b><h3>HIRA.EXE ÇÖKTÜ</h3>' +
      '<p class="x-bm">Sabır tamamen tükendi. Sebep: sen. Ama bugün doğum günü olduğu için ceza yok.</p>' +
      '<p class="x-bt">Toplam darlama: <b class="x-bn">0</b></p><div class="x-rp"><i></i></div><p class="x-rm">Hata raporu toplanıyor… %0</p>' +
      '<p class="x-kod">DURDURMA KODU: SEN_ARTIK_15_OLDUN</p><button type="button" class="x-rs" hidden>SİSTEMİ YENİDEN BAŞLAT</button></div></section>';
    host.append(kok);
    kok.addEventListener('contextmenu', e => e.preventDefault());

    const q = (s, r = kok) => r.querySelector(s);
    const term = q('.x-term'), go = q('.x-go'), big = q('.x-big'), stage = q('.x-stage'), msg = q('.x-msg');
    const nEl = q('.x-n'), pp = q('.x-pp'), segEl = q('.x-seg'), segs = [...segEl.children], lvn = q('.x-lvn'), stat = q('.x-stat');
    const pops = q('.x-pops'), casc = q('.x-casc'), lab = q('.x-lab'), alt = q('.x-alt'), pips = [...kok.querySelectorAll('.x-pips li')];
    const sCpu = q('.s-cpu'), sIsi = q('.s-isi'), sKas = q('.s-kas');
    let n = 0, lv = 0, kilit = true, basili = false, tid = 0, adim = 0, sc = 'boot', yazIptal = null, mesajlar = [];

    const sahne = s => {
      sc = s; kok.dataset.sc = s;
      q('.x-boot').inert = s !== 'boot'; q('.x-main').inert = s !== 'main'; q('.x-fail').inert = s !== 'fail';
      q('.x-main').setAttribute('aria-hidden', s === 'main' ? 'false' : 'true');
    };
    sahne('boot');
    const odak = el => ot.zaman(() => { try { el.focus({ preventScroll: true }); } catch (_) { /* geç */ } }, 60);

    /* ---------- terminal yazısı: karakter karakter, dokununca atlar ---------- */
    function yaz(satirlar, bitince) {
      if (yazIptal) yazIptal();
      term.textContent = '';
      if (reduced) { term.textContent = satirlar.join('\n'); bitince(); return; }
      let s = 0, c = 0, bitti = false, id = 0;
      const bit = () => { if (bitti) return; bitti = true; ot.iptalAralik(id); term.textContent = satirlar.join('\n'); yazIptal = null; bitince(); };
      yazIptal = bit;
      id = ot.aralik(() => {
        if (s >= satirlar.length) { bit(); return; }
        const sat = satirlar[s]; c += 2;
        term.textContent = satirlar.slice(0, s).join('\n') + (s ? '\n' : '') + sat.slice(0, c) + '█';
        if (c >= sat.length) { s++; c = 0; }
      }, 22);
    }
    function acilis() {
      sahne('boot'); go.hidden = true; q('.x-skip').hidden = false; stat.textContent = 'DURUM: BAŞLATILIYOR';
      yaz(BOOT, () => { go.hidden = false; q('.x-skip').hidden = true; stat.textContent = 'DURUM: HAZIR'; odak(go); });
    }
    ot.dinle(q('.x-boot'), 'pointerdown', e => { if (yazIptal && !e.target.closest('.x-go')) yazIptal(); });

    /* ---------- ana ekran durumunu çiz ---------- */
    function guncelle() {
      const pat = Math.max(0, Math.round(100 - n * 100 / CRASH_AT));
      nEl.textContent = sifir(n, 3); pp.textContent = pat + '%';
      const dolu = Math.ceil(pat / 5); segs.forEach((e, i) => e.classList.toggle('d', i < dolu));
      segEl.setAttribute('aria-valuenow', String(pat));
      const f = n / CRASH_AT;
      sCpu.style.width = Math.min(100, Math.round(6 + f * 94 + rnd(-4, 4))) + '%';
      sIsi.style.width = Math.min(100, Math.round(Math.pow(f, 1.4) * 100 + rnd(-3, 3))) + '%';
      sKas.style.width = Math.min(100, Math.round(Math.pow(f, 0.8) * 100)) + '%';
    }
    function seviyeAyarla(l, ilk) {
      lv = l; kok.dataset.lv = String(l + 1); const s = SEV[l];
      lvn.textContent = 'SEVİYE ' + (l + 1) + ' · ' + s.ad.toUpperCase(); stat.textContent = 'DURUM: ' + s.durum;
      lab.textContent = s.etiket; alt.textContent = s.alt;
      pips.forEach((p, i) => { p.classList.toggle('on', i <= l); p.classList.toggle('now', i === l); });
      mesajlar = deste(s.msj);
      if (!ilk) { S.yeniden(lvn, 'x-lvup'); S.yeniden(q('.x-flash'), 'x-fl'); vib([20, 40, 30]); if (l >= 3) sayac.art(1); }
      if (l < 3) pops.textContent = '';
    }

    /* ---------- bir darlama ---------- */
    function efekt() {
      const k = lv; /* 0..4 */
      if (!reduced) {
        stage.style.setProperty('--sh', [0, .6, 0, 1.6, 3.2][k] || 0);
        S.yeniden(stage, 'x-shk');
        /* dalga halkası */
        if (stage.querySelectorAll('.x-rip').length < 6) { const r = make('i', 'x-rip'); stage.append(r); r.addEventListener('animationend', () => r.remove(), { once: true }); }
        /* yükselen "+1" */
        if (stage.querySelectorAll('.x-plus').length < 10) {
          const p = make('i', 'x-plus', k >= 4 ? ['+1', '!!', '+1', '✕'][Math.floor(rnd(0, 4))] : '+1');
          p.style.setProperty('--px', rnd(-70, 70).toFixed(0) + 'px'); stage.append(p); p.addEventListener('animationend', () => p.remove(), { once: true });
        }
        /* kıvılcım: seviye 3'ten itibaren */
        if (k >= 2) {
          const adet = k === 2 ? 2 : k === 3 ? 5 : 9;
          for (let i = 0; i < adet && stage.querySelectorAll('.x-sp').length < 36; i++) {
            const a = rnd(0, Math.PI * 2), d = rnd(70, 150), sp = make('i', 'x-sp');
            sp.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px'); sp.style.setProperty('--dy', (Math.sin(a) * d).toFixed(0) + 'px');
            stage.append(sp); sp.addEventListener('animationend', () => sp.remove(), { once: true });
          }
        }
      }
      /* seviye 4+: köşelerden açılır pencere */
      if (k >= 3 && n % 4 === 0) {
        const w = make('div', 'x-pop'); w.innerHTML = '<b>⚠ Hata</b><span></span>'; w.lastChild.textContent = POPUP[Math.floor(rnd(0, POPUP.length))];
        w.style.left = rnd(2, 52).toFixed(0) + '%'; w.style.top = rnd(10, 78).toFixed(0) + '%'; w.style.setProperty('--r', rnd(-5, 5).toFixed(1) + 'deg');
        pops.append(w); while (pops.children.length > 4) pops.firstChild.remove();
      }
    }
    function vur() {
      if (kilit || sc !== 'main') return;
      n++; const yeni = seviye(n);
      if (n >= CRASH_AT) { guncelle(); coktu(); return; }
      if (yeni !== lv) seviyeAyarla(yeni, false);   /* önce seviye, sonra mesaj: mesaj yeni seviyeye ait olur */
      guncelle(); efekt();
      const m = mesajlar(); msg.textContent = lv >= 4 ? boz(m) : m; S.yeniden(msg, 'x-mi');
      vib(lv >= 4 ? [12, 20, 12] : 8);
    }

    /* ---------- dokun / basılı tut ---------- */
    function dongu() { if (!basili || kilit) return; vur(); adim++; tid = ot.zaman(dongu, Math.max(80, 230 - adim * 7)); }
    function tut(e) {
      if (kilit || (e.button != null && e.button > 0)) return;
      e.preventDefault();
      try { big.setPointerCapture(e.pointerId); } catch (_) { /* geç */ }
      basili = true; adim = 0; big.classList.add('x-down'); vur();
      ot.iptalZaman(tid); tid = ot.zaman(dongu, 420);
    }
    function birak() { basili = false; ot.iptalZaman(tid); big.classList.remove('x-down'); }
    ot.dinle(big, 'pointerdown', tut);
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => ot.dinle(big, t, birak));
    ot.dinle(window, 'blur', birak);
    ot.dinle(document, 'visibilitychange', () => { if (document.hidden) birak(); });
    ot.dinle(big, 'keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); big.classList.add('x-down'); vur(); } });
    ot.dinle(big, 'keyup', e => { if (e.key === ' ' || e.key === 'Enter') big.classList.remove('x-down'); });

    /* ---------- ana sahneye geçiş ---------- */
    function baslat() {
      n = 0; kilit = false; basili = false; pops.textContent = ''; stage.querySelectorAll('.x-rip,.x-plus,.x-sp').forEach(e => e.remove());
      kok.classList.remove('x-crash', 'x-off', 'x-bs'); kok.dataset.lv = '1'; msg.textContent = '';
      seviyeAyarla(0, true); guncelle(); sahne('main'); odak(big);
      msg.textContent = 'Sistem hazır. Düğmeye bas.';
    }
    go.addEventListener('click', () => { vib(14); baslat(); });

    /* ---------- ÇÖKÜŞ ---------- */
    function coktu() {
      kilit = true; birak(); sayac.art(2);
      kok.dataset.lv = '6'; stat.textContent = 'DURUM: ÇÖKTÜ'; lvn.textContent = 'SEVİYE 6 · SİSTEM ÇÖKTÜ'; lab.textContent = '✕';
      pips.forEach(p => p.classList.add('on')); vib([60, 40, 60, 40, 140]);
      q('.x-bn').textContent = String(n);
      kok.classList.add('x-crash'); S.yeniden(q('.x-flash'), 'x-fl');
      guvenli(() => FX.burst(innerWidth * .5, innerHeight * .45));
      const bsodGoster = () => {
        kok.classList.add('x-off'); sahne('fail'); casc.textContent = ''; pops.textContent = '';
        ot.zaman(() => {
          kok.classList.add('x-bs');
          const rp = q('.x-rp i'), rm = q('.x-rm'), rs = q('.x-rs'); const t0 = performance.now(), D = reduced ? 200 : 2600;
          const dur = ot.kare(() => {
            const p = Math.min(1, (performance.now() - t0) / D), y = Math.round(p * 100);
            rp.style.transform = 'scaleX(' + p.toFixed(3) + ')'; rm.textContent = p < 1 ? 'Hata raporu toplanıyor… %' + y : 'Rapor Hira\'ya gönderildi. Hira zaten biliyordu.';
            if (p >= 1) { dur(); rs.hidden = false; odak(rs); }
          });
        }, reduced ? 0 : 900);
      };
      if (reduced) { bsodGoster(); return; }
      /* pencere yağmuru → CRT kapanışı → mavi ekran */
      sahne('fail');
      let i = 0;
      const id = ot.aralik(() => {
        const [b, t] = CASKAD[i % CASKAD.length]; i++;
        const w = make('div', 'x-cw'); w.innerHTML = '<b></b><p></p><u>Tamam</u>'; w.firstChild.textContent = b; w.children[1].textContent = t;
        w.style.left = rnd(0, 58).toFixed(0) + '%'; w.style.top = rnd(4, 84).toFixed(0) + '%'; w.style.zIndex = String(i);
        casc.append(w); vib(8);
        if (i >= 26) ot.iptalAralik(id);
      }, 95);
      ot.zaman(bsodGoster, 3300);
    }

    /* ---------- YENİDEN BAŞLAT: sayfa yenilemeden ---------- */
    q('.x-rs').addEventListener('click', () => {
      vib(16); q('.x-rs').hidden = true; casc.textContent = ''; kok.classList.remove('x-crash', 'x-off', 'x-bs');
      q('.x-rp i').style.transform = 'scaleX(0)'; kok.dataset.lv = '1'; stat.textContent = 'DURUM: YENİDEN BAŞLATILIYOR';
      sahne('boot'); go.hidden = true; q('.x-skip').hidden = true;
      yaz(BOOT2, () => ot.zaman(baslat, reduced ? 0 : 500));
    });

    acilis();
  });
}

/* ======================= GİRİŞ KARTI (eski Darlama bloğunun yerine) ======================= */
guvenli(() => {
  const to5m = $('#to5m'); if (!to5m) return;
  const eski = $('#shx-darla');
  const kart = make('section', 'exe-kart'); kart.id = 'exe-kart';
  kart.innerHTML = '<div class="ek-pen"><i></i><i></i><i></i><b>HIRA.EXE</b></div><h3>Darlama Butonu</h3>' +
    '<p class="ek-t">&gt; Sabır Sistemi hazır. Yüklü sabır: sınırlı.<span class="ek-im"></span></p>' +
    '<button type="button" class="ek-btn">SİSTEMİ ÇALIŞTIR</button>';
  if (eski) eski.replaceWith(kart); else to5m.before(kart);
  kart.querySelector('.ek-btn').addEventListener('click', () => { vib(12); ac(); });
  kart.addEventListener('pointerdown', e => e.stopPropagation());
});

window.__exe = { ac };
(window.__ok = window.__ok || []).push('exe');
})();
