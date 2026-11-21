/* exp.js — ortak deneyim yöneticisi (Laboratuvar · HIRA.EXE · Hediye Galerisi)
   Görevleri:
   1) Aynı anda yalnızca BİR tam ekran deneyim açık olur (yenisi açılırken eskisi temizlenir).
   2) Her deneyim bir "oturum" alır: setTimeout / setInterval / requestAnimationFrame / olay dinleyicileri
      oturum üzerinden kurulur, deneyim kapanınca hepsi tek hamlede silinir (bellek sızıntısı olmaz).
   3) Kapanışta içerideki video/ses durdurulur, sayfa kaydırması geri açılır, odak eski yerine döner.
   shitpost.js'ten SONRA, lab.js / exe.js / gallery.js'ten ÖNCE yüklenir. Hiçbir mevcut dosyaya bağımlılığı bozmaz. */
(() => {
'use strict';
const S = window.__shx;
if (!S) { console.error('exp.js: shitpost.js yüklenmeden çalıştı'); return; }
const { make, reduced } = S;

/* ======================= OTURUM: izlenen zamanlayıcılar ve dinleyiciler ======================= */
function oturum() {
  const zamanlar = new Set(), araliklar = new Set(), kareler = new Set(), dinleyiciler = [];
  let bitti = false;
  return {
    get bitti() { return bitti; },
    /* tek seferlik gecikme */
    zaman(fn, ms) {
      if (bitti) return 0;
      const id = setTimeout(() => { zamanlar.delete(id); if (!bitti) fn(); }, ms);
      zamanlar.add(id); return id;
    },
    iptalZaman(id) { clearTimeout(id); zamanlar.delete(id); },
    /* tekrarlayan zamanlayıcı */
    aralik(fn, ms) {
      if (bitti) return 0;
      const id = setInterval(() => { if (!bitti) fn(); }, ms);
      araliklar.add(id); return id;
    },
    iptalAralik(id) { clearInterval(id); araliklar.delete(id); },
    /* animasyon karesi döngüsü; dönen fonksiyon döngüyü durdurur */
    kare(fn) {
      if (bitti) return () => {};
      let id = 0, dur = false;
      const dongu = t => { if (dur || bitti) return; fn(t); id = requestAnimationFrame(dongu); };
      id = requestAnimationFrame(dongu);
      const durdur = () => { dur = true; cancelAnimationFrame(id); kareler.delete(durdur); };
      kareler.add(durdur); return durdur;
    },
    /* olay dinleyicisi (temizlikte otomatik kaldırılır) */
    dinle(hedef, tur, fn, secenek) {
      hedef.addEventListener(tur, fn, secenek); dinleyiciler.push([hedef, tur, fn, secenek]);
    },
    temizle() {
      bitti = true;
      zamanlar.forEach(clearTimeout); zamanlar.clear();
      araliklar.forEach(clearInterval); araliklar.clear();
      [...kareler].forEach(f => f());
      dinleyiciler.forEach(([h, t, f, s]) => h.removeEventListener(t, f, s)); dinleyiciler.length = 0;
    }
  };
}

/* ======================= TAM EKRAN KATMAN ======================= */
let aktif = null;

function kapat() {
  if (!aktif) return;
  const a = aktif; aktif = null;
  try { if (a.temiz) a.temiz(); } catch (e) { console.error('exp.js temiz:', e); }
  a.ot.temizle();
  a.kok.querySelectorAll('video,audio').forEach(m => { try { m.pause(); } catch (_) { /* geç */ } });
  document.removeEventListener('keydown', a.tus, true);
  document.documentElement.classList.remove('exp-kilit');
  const ana = document.querySelector('main'); if (ana) ana.inert = false;
  a.kok.classList.remove('acik'); a.kok.classList.add('kapan');
  if (reduced) a.kok.remove(); else setTimeout(() => a.kok.remove(), 380);
  if (a.onceki && document.contains(a.onceki)) { try { a.onceki.focus({ preventScroll: true }); } catch (_) { /* geç */ } }
}

/* kur(host, oturum, kapat) → isteğe bağlı temizlik fonksiyonu döndürebilir */
function ac(sinif, etiket, kur) {
  if (aktif) kapat();
  const ot = oturum(), onceki = document.activeElement;
  const kok = make('div', 'exp ' + sinif);
  kok.setAttribute('role', 'dialog'); kok.setAttribute('aria-modal', 'true'); kok.setAttribute('aria-label', etiket); kok.tabIndex = -1;
  const host = make('div', 'exp-host');
  const x = make('button', 'exp-x', '✕'); x.type = 'button'; x.setAttribute('aria-label', 'Kapat');
  x.addEventListener('click', kapat);
  kok.append(host, x);
  document.body.append(kok);
  document.documentElement.classList.add('exp-kilit');
  const ana = document.querySelector('main'); if (ana) ana.inert = true;
  const tus = e => { if (e.key === 'Escape') { e.stopPropagation(); kapat(); } };
  document.addEventListener('keydown', tus, true);
  aktif = { kok, ot, tus, onceki, temiz: null };
  try { aktif.temiz = kur(host, ot, kapat) || null; } catch (e) { console.error('exp.js kur:', e); kapat(); return null; }
  requestAnimationFrame(() => { kok.classList.add('acik'); try { kok.focus({ preventScroll: true }); } catch (_) { /* geç */ } });
  return kok;
}

window.__exp = { oturum, ac, kapat, aktifMi: () => !!aktif };
(window.__ok = window.__ok || []).push('exp');
})();
