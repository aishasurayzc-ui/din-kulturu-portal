/* ======================================================================
   ANLATIM VİDEOSU — 3 boyutlu görünüm (2026-11-07)
   ----------------------------------------------------------------------
   Sayfadaki her "Anlatım Videosu" (details.anlatim-video > video) bir
   3B ekran çerçevesine alınır: hafif perspektif, derinlik gölgesi ve
   fareyle izlenen eğim. Video oynatılınca ekran düzleşir (okunaklı izleme),
   durunca yeniden eğilir. Videonun kendisi, kaynağı, kapağı ve oynatıcı
   düğmeleri DEĞİŞMEZ; video öğesi yalnızca bir çerçeve kutusuna alınır.
   Hareket azaltma tercihinde ve dokunmatik ekranlarda eğim yapılmaz.
   Önek: v3d-   Yüklenme: ortak/portal-nav.js (4–8) ve ortak/lise-yol.js (9–11)
====================================================================== */
(function(){
'use strict';
if(window.__video3d) return;
window.__video3d = true;

function hareketAz(){ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
function inceImlec(){ try{ return matchMedia('(hover: hover) and (pointer: fine)').matches; }catch(e){ return false; } }

function kur(video){
  if(!video || video.closest('.v3d-cerceve')) return;
  var sahne = document.createElement('div');
  sahne.className = 'v3d-sahne';
  var cerceve = document.createElement('div');
  cerceve.className = 'v3d-cerceve';
  var parlama = document.createElement('span');
  parlama.className = 'v3d-parlama';
  parlama.setAttribute('aria-hidden', 'true');
  video.parentNode.insertBefore(sahne, video);
  sahne.appendChild(cerceve);
  cerceve.appendChild(video);          /* aynı video öğesi taşınır: oynatma durumu ve olaylar korunur */
  cerceve.appendChild(parlama);

  function durum(){
    var oynuyor = !video.paused && !video.ended;
    sahne.classList.toggle('v3d-oynuyor', oynuyor);
    if(oynuyor){ sahne.style.removeProperty('--v3d-rx'); sahne.style.removeProperty('--v3d-ry'); }
  }
  ['play','playing','pause','ended','emptied'].forEach(function(t){ video.addEventListener(t, durum); });
  durum();

  /* fareyle hafif eğim (yalnızca fare/dokunmatik olmayan ekran, video dururken) */
  var bekle = false;
  sahne.addEventListener('pointermove', function(e){
    if(!inceImlec() || hareketAz() || sahne.classList.contains('v3d-oynuyor') || bekle) return;
    bekle = true;
    requestAnimationFrame(function(){
      bekle = false;
      var r = sahne.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      sahne.style.setProperty('--v3d-ry', (x * 10).toFixed(2) + 'deg');
      sahne.style.setProperty('--v3d-rx', (6 - y * 8).toFixed(2) + 'deg');
      sahne.style.setProperty('--v3d-px', ((x + 0.5) * 100).toFixed(1) + '%');
    });
  });
  sahne.addEventListener('pointerleave', function(){
    sahne.style.removeProperty('--v3d-rx'); sahne.style.removeProperty('--v3d-ry'); sahne.style.removeProperty('--v3d-px');
  });
}

function hepsi(){
  document.documentElement.classList.add('v3d-kok');
  Array.prototype.forEach.call(document.querySelectorAll('details.anlatim-video video'), kur);
}
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hepsi);
else hepsi();
})();
