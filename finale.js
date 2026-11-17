/* Bölüm 05 (mektup) ve 06 (ASCII pasta finali). app.js'ten sonra yüklenir; ortak yardımcıları window.__app'ten alır */
(() => {
'use strict';
const { C, FX, $, make, pad, vib, kalp, isik, reduced, photo, watch } = window.__app;
const IT = C.intertitles || {};

/* Bölüm 05 */
const paper = $('#paper'), env = $('#envelope');
[C.letter.to, ...C.letter.paragraphs, C.letter.sign].filter(Boolean).forEach((t, i, a) => {
  const p = make('p', i === 0 ? 'to' : i === a.length - 1 ? 'sign' : '', t); p.style.setProperty('--d', i); paper.append(p);
});
const envWrap = $('#envwrap'), envHint = $('#envhint');
function mektupAc() {
  if (env.classList.contains('open')) return;
  env.classList.add('open'); env.setAttribute('aria-expanded', 'true'); envWrap.classList.add('opened');
  kalp();
  setTimeout(() => {
    envHint.hidden = true; env.classList.add('gone'); paper.hidden = false; paper.classList.add('on'); paper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const r = paper.getBoundingClientRect(); isik(innerWidth / 2, Math.max(80, r.top + 60), '#ffd27a');
    setTimeout(() => { const b6 = $('#to6'); b6.hidden = false; b6.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 1800 + paper.children.length * 750); /* mektup okunsun, sonra devam (eskiden ~5,5 sn) */
  }, 1400);
}
env.onclick = mektupAc; envHint.onclick = mektupAc;

/* Bölüm 06: ASCII pasta (cake.js — orijinal kod JIN2 / @jin_22ee). Pasta ekrana girince kurulur, mum yanınca "Mumu üfle" görünür */
const w = $('#wish'), f = make('figure'), fc = make('figcaption', '', C.finale.photo.caption);
f.append(photo(C.finale.photo, pad(C.memories.length + C.gallery.length)));
if (C.finale.photo.caption) f.append(fc);
w.append(make('h3', '', C.finale.line1), make('h3', '', C.finale.line2), f);

let uflendi = false;
const blowBtn = $('#blow'), gosterBlow = () => {
  if (uflendi) return;
  blowBtn.classList.add('show'); $('#spinhint').hidden = false; $('#stage').classList.add('lit'); document.body.classList.add('cakelit'); /* ışık pastaya toplanır */
};
const stageEl = $('#stage');
const pastaHata = msg => { /* pasta çizilemezse sebebini sahnede küçük bir notla göster */
  stageEl.replaceChildren(make('p', 'cakeerr', msg)); gosterBlow();
};
let cake = null;
try {
  if (!window.CAKE) pastaHata('Pasta başlatılamadı (CAKE bulunamadı). Sayfayı Ctrl+F5 ile yenile.');
  else cake = window.CAKE.create($('#cakeCv'), $('#cakeGlow'), { reduced, onLit: gosterBlow, onError: e => pastaHata('Pasta çizilemedi: ' + (e && e.message)) });
} catch (err) { console.error('Pasta kurulamadı:', err); pastaHata('Pasta kurulamadı: ' + err.message); }
if (cake && 'IntersectionObserver' in window) {
  new IntersectionObserver(es => es.forEach(e => cake.setVisible(e.isIntersecting)), { threshold: .3 }).observe(stageEl);
} else if (cake) cake.setVisible(true);
/* Mektuptan sonra "Devam et": perde kapanır, son sahne karanlıkta açılır. Düğme her ihtimale karşı 26 sn sonra görünür */
const to6 = $('#to6');
to6.onclick = () => { to6.disabled = true; window.__sahne([$('#ch5')], [$('#ch6')], null, () => { setTimeout(gosterBlow, 26000); }, IT.c6); };

blowBtn.onclick = () => {
  uflendi = true; blowBtn.hidden = true; $('#spinhint').hidden = true; stageEl.classList.remove('lit'); document.body.classList.remove('cakelit'); vib([20, 70, 20, 70, 50]);
  const yazi = cake && cake.blow(); /* mum söner, ASCII konfeti ve HAPPY BIRTHDAY başlar */
  const r = stageEl.getBoundingClientRect();
  setTimeout(() => { FX.kutlama(); FX.burst(r.left + r.width / 2, r.top + r.height * .3); }, yazi ? 1000 : 0);
  setTimeout(() => FX.burst(innerWidth * .22, innerHeight * .4), yazi ? 1600 : 600);
  setTimeout(() => FX.burst(innerWidth * .78, innerHeight * .35), yazi ? 2100 : 1100);
  setTimeout(() => isik(innerWidth / 2, innerHeight * .4, '#ffd27a'), yazi ? 900 : 0);
  const bekleme = yazi ? 9000 : 0; /* yazıları izlemeye zaman tanı, sonra fotoğrafa kay */
  setTimeout(() => { w.classList.add('on'); w.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, bekleme);
  setTimeout(() => $('#closing').classList.add('on'), bekleme + 6500);
};
$('#again').onclick = () => location.reload();

/* Başlıklar da kaydırınca belirir */
document.querySelectorAll('#story h2, #story .kick').forEach(watch);

/* Parçacık efektleri (altın toz, kayan yıldız, konfeti): fx.js içinde. Yüklenemezse site yine çalışır. */
(window.__ok = window.__ok || []).push('finale');
})();
