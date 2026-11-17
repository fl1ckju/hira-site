
/* Parçacık efektleri: altın toz, kayan yıldızlar, konfeti ve yıldız yağmuru.
   index.html'de app.js'ten ÖNCE yüklenir; app.js bunlara window.FX üzerinden ulaşır. */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Parçacıklar: altın toz, kayan yıldızlar, konfeti ve yıldız yağmuru ---------- */
const cv = $('#dust'), cx = cv.getContext('2d'); let P = [];
const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
fit(); addEventListener('resize', fit);
const ALTIN = ['#c9a96a', '#e0a458', '#f4ecdc', '#ffd27a', '#b98b8b'];
const rnd = (lo, hi) => lo + Math.random() * (hi - lo);
const ekle = p => { if (P.length < 700) P.push(p); }; /* ekranı ve telefonu yormasın */

/* Süzülen altın toz */
if (!reduced) for (let i = 0; i < 45; i++) P.push({ k: 'toz', x: rnd(0, innerWidth), y: rnd(0, innerHeight), r: rnd(.4, 2.2), vx: rnd(-.1, .1), vy: -rnd(.05, .3), a: rnd(.15, .65) });

/* Altın kıvılcım patlaması */
function burst(x, y) {
  if (reduced) return;
  for (let i = 0; i < 90; i++) { const an = rnd(0, 6.283), s = rnd(1, 6); ekle({ k: 'kv', x, y, r: rnd(.8, 3.2), vx: Math.cos(an) * s, vy: Math.sin(an) * s - 2, life: 130, c: ALTIN[i % 5] }); }
}
/* Küçük, yumuşak kıvılcım demeti (Bölüm 04: kare uyanınca / yerleşince) */
function spark(x, y) {
  if (reduced) return;
  for (let i = 0; i < 22; i++) { const an = rnd(0, 6.283), s = rnd(.4, 2.6); ekle({ k: 'kv', x, y, r: rnd(.6, 2), vx: Math.cos(an) * s, vy: Math.sin(an) * s - .6, life: 70, c: ALTIN[i % 5] }); }
}
/* Dört köşeli parlak yıldız çizer */
function yildizCiz(x, y, r, rot) {
  cx.save(); cx.translate(x, y); cx.rotate(rot); cx.beginPath();
  for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4, d = i % 2 ? r * .32 : r; cx.lineTo(Math.cos(an) * d, Math.sin(an) * d); }
  cx.closePath(); cx.fill(); cx.restore();
}
/* Konfeti parçası (yukarıdan veya yanlardan) */
function konfeti(x, y, vx, vy) {
  ekle({ k: 'kf', x, y, w: rnd(5, 10), h: rnd(8, 16), rot: rnd(0, 6.283), vr: rnd(-.2, .2), vx, vy, ph: rnd(0, 6.283), c: ALTIN[Math.floor(rnd(0, 4))] });
}
/* Ekranda süzülen yıldız */
function suzulenYildiz(x, y) {
  const life = rnd(220, 420);
  ekle({ k: 'yd', x, y, s: rnd(6, 14), rot: rnd(0, 6.283), vr: rnd(-.025, .025), vx: rnd(-.35, .35), vy: -rnd(.35, 1.2), life, max: life, ph: rnd(0, 6.283), c: ALTIN[Math.floor(rnd(1, 4))] });
}
/* Final kutlaması: ~6 sn boyunca altın konfeti yağmuru + yükselen yıldızlar + patlamalar */
function kutlama() {
  if (reduced) return;
  const W = innerWidth, H = innerHeight; let n = 0;
  for (let i = 0; i < 40; i++) { /* iki yandan konfeti topu */
    konfeti(0, H * .75, rnd(3, 9), -rnd(7, 15)); konfeti(W, H * .75, -rnd(3, 9), -rnd(7, 15));
  }
  const iv = setInterval(() => {
    for (let i = 0; i < 9; i++) konfeti(rnd(0, W), rnd(-40, -5), rnd(-1.2, 1.2), rnd(1.5, 4));
    if (n % 2 === 0) suzulenYildiz(rnd(0, W), rnd(H * .5, H + 10));
    if (n % 14 === 3) burst(rnd(W * .15, W * .85), rnd(H * .2, H * .5));
    if (++n > 60) clearInterval(iv);
  }, 110);
}
/* Kayan yıldız: sağ üstten sol alta, her birkaç saniyede bir, sürekli */
function kayanYildiz() {
  const hiz = rnd(10, 16), te = rnd(.38, .7), life = Math.floor(rnd(45, 75));
  ekle({ k: 'ky', x: rnd(innerWidth * .3, innerWidth * 1.05), y: rnd(-20, innerHeight * .35), vx: -hiz * Math.cos(te), vy: hiz * Math.sin(te), life, max: life });
}
(function kayanDongu() { if (!reduced && !document.hidden) kayanYildiz(); setTimeout(kayanDongu, rnd(2600, 6200)); })();
if (!reduced) setTimeout(kayanYildiz, 1200);

(function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  P = P.filter(p => {
    p.x += p.vx; p.y += p.vy; let ok = true;
    switch (p.k) {
      case 'toz':
        if (p.y < -5) { p.y = innerHeight + 5; p.x = rnd(0, innerWidth); }
        cx.fillStyle = `rgba(224,164,88,${p.a})`; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill(); break;
      case 'kv':
        p.vy += .06; p.vx *= .99; ok = --p.life > 0;
        cx.globalAlpha = Math.max(p.life / (p.life > 70 ? 130 : 70), 0); cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill(); break;
      case 'kf':
        p.vy = Math.min(p.vy + .12, 4.4); p.vx *= .985; p.ph += .07; p.x += Math.sin(p.ph) * .7; p.rot += p.vr;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.scale(1, Math.cos(p.ph * 1.3)); cx.fillStyle = p.c;
        cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cx.restore();
        ok = p.y < innerHeight + 30; break;
      case 'yd':
        p.rot += p.vr; p.ph += .08; ok = --p.life > 0;
        cx.globalAlpha = Math.max(0, Math.min(1, p.life / 60, (p.max - p.life) / 30)) * (.65 + .35 * Math.sin(p.ph)); cx.fillStyle = p.c;
        yildizCiz(p.x, p.y, p.s, p.rot); break;
      case 'ky': {
        ok = --p.life > 0 && p.x > -200;
        const al = Math.min(1, p.life / 14, (p.max - p.life) / 6), tx = p.x - p.vx * 9, ty = p.y - p.vy * 9;
        const g = cx.createLinearGradient(p.x, p.y, tx, ty);
        g.addColorStop(0, `rgba(244,236,220,${al})`); g.addColorStop(.4, `rgba(224,164,88,${al * .5})`); g.addColorStop(1, 'rgba(224,164,88,0)');
        cx.strokeStyle = g; cx.lineWidth = 1.7; cx.lineCap = 'round';
        cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(tx, ty); cx.stroke();
        cx.globalAlpha = al; cx.fillStyle = '#fff6e0'; cx.beginPath(); cx.arc(p.x, p.y, 1.8, 0, 6.283); cx.fill(); break;
      }
    }
    cx.globalAlpha = 1;
    return ok;
  });
  requestAnimationFrame(loop);
})();

window.FX = { burst, kutlama, spark };
})();
