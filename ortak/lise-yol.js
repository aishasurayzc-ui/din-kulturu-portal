/* ======================================================================
   LİSE ÖĞRENME YOLU (2026-11-06) — 9, 10 ve 11. sınıf ünite sayfaları
   4–8. sınıflardaki portal-nav.js çubuğunun lise karşılığı: 7 aşamalı
   ortak öğrenme yolu (Keşfet · Öğren · Anla · Uygula · Düşün · Ölç ·
   Değerlendir). Yeni içerik üretmez; her adım sayfanın ZATEN var olan
   bölümüne gider (çapalar dosyalarda doğrulandı). Karşılığı olmayan adım
   soluk gösterilir. Kullanım (sayfanın sonunda tek satır):
     <script src="../ortak/lise-yol.js" data-sinif="9" data-unite="2" defer></script>
====================================================================== */
(function(){
"use strict";
var betik = document.currentScript || document.querySelector('script[src*="lise-yol.js"]');
if(!betik || window.__liseYol) return;
window.__liseYol = true;
var S = parseInt(betik.getAttribute('data-sinif'), 10), U = parseInt(betik.getAttribute('data-unite'), 10) || 1;
var AUC = '../acik-uclu-soru-merkezi/tum-siniflar.html#s' + S;

/* sınıf → [adım hedefleri]; '' = bu ünitede karşılığı yok */
function hedefler(){
  if(S === 9){
    var f = U === 1 ? 'index.html' : 'unite' + U + '.html';
    var mini = {2:'sifat-test', 3:'sinif-test', 4:'erdem-test'}[U];
    return [f+'#harita', f+'#k1', f+'#kavramlar', mini ? f+'#'+mini : '', AUC, f+'#test', ''];
  }
  if(S === 10) return ['index.html#giris','index.html#k1','index.html#kavramlar','index.html#kavram-lab','dusun-dogrula.html','index.html#test','dusun-dogrula.html#son'];
  if(S === 11) return ['index.html#giris','index.html#k1','index.html#kavramlar','index.html#kavram-lab','dusun-karar-ver.html','index.html#test','dusun-karar-ver.html#son'];
  return null;
}
var H = hedefler(); if(!H) return;
var AD = [['🔍','Keşfet'],['📖','Öğren'],['🧩','Anla'],['🎮','Uygula'],['💭','Düşün'],['📝','Ölç'],['📊','Değerlendir']];
var dosya = (location.pathname.split('/').pop() || 'index.html');
/* bu sayfa hangi adım(lar)ın sayfası? (bütün sayfayı kapsayan adım) */
var SAYFA_ADIM = {'dusun-dogrula.html':[4], 'dusun-karar-ver.html':[4], 'kader-ayet-hadis-kavram.html':[2]};

var stil = document.createElement('style');
stil.textContent =
 '.ly-cubuk{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:5px;padding:10px 14px;background:#f7f9fc;border-bottom:1px solid #dbe3ec;font-family:inherit;position:relative;z-index:50}'+
 '.ly-baslik{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#52606d;margin-right:4px}'+
 '.ly-adim{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:999px;font-size:13px;font-weight:700;text-decoration:none;color:#1e3a5f;background:#fff;border:1px solid #dbe3ec;transition:background .2s,color .2s,border-color .2s}'+
 '.ly-adim b{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;background:#1e3a8a;color:#fff;font-size:11px}'+
 'a.ly-adim:hover,a.ly-adim:focus-visible{border-color:#0f766e;color:#0f766e}'+
 'a.ly-adim:focus-visible{outline:3px solid #f0a202;outline-offset:2px}'+
 '.ly-adim.aktif{background:#0f766e;color:#fff;border-color:#0f766e}.ly-adim.aktif b{background:#fff;color:#0f766e}'+
 '.ly-adim.yok{opacity:.4;cursor:default;border-style:dashed}'+
 '.ly-ok{color:#94a3b8;font-size:14px}'+
 '@media (max-width:640px){.ly-cubuk{justify-content:flex-start;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.ly-cubuk::-webkit-scrollbar{display:none}.ly-adim{flex-shrink:0;font-size:12px;padding:5px 10px}.ly-baslik{display:none}}'+
 '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]):not([data-tema="light"]) .ly-cubuk{background:#111c2e;border-color:#25344d}:root:not([data-theme="light"]):not([data-tema="light"]) .ly-adim{background:#16243a;color:#e2e8f0;border-color:#2b3d5a}}'+
 '[data-theme="dark"] .ly-cubuk,[data-tema="dark"] .ly-cubuk{background:#111c2e;border-color:#25344d}'+
 '[data-theme="dark"] .ly-adim,[data-tema="dark"] .ly-adim{background:#16243a;color:#e2e8f0;border-color:#2b3d5a}'+
 '[data-theme="dark"] .ly-adim.aktif,[data-tema="dark"] .ly-adim.aktif{background:#2dd4bf;color:#04141a;border-color:#2dd4bf}';
document.head.appendChild(stil);

function kur(){
  var nav = document.createElement('nav');
  nav.className = 'ly-cubuk'; nav.setAttribute('aria-label', 'Öğrenme yolu: 7 adım');
  var html = '<a class="ly-adim" href="../din-kulturu-tum-siniflar.html?sinif=s'+S+'&unite='+U+'">📚 '+S+'. Sınıf</a><span class="ly-ok" aria-hidden="true">→</span><span class="ly-baslik">Öğrenme yolu</span>';
  var sabit = SAYFA_ADIM[dosya] || [];
  H.forEach(function(h, i){
    var ic = '<b>'+(i+1)+'</b>'+AD[i][0]+' '+AD[i][1];
    if(!h){ html += '<span class="ly-adim yok" title="'+AD[i][1]+': bu ünitede ayrı bir bölüm yok">'+ic+'</span>'; return; }
    var aktif = sabit.indexOf(i) >= 0;
    html += '<a class="ly-adim'+(aktif?' aktif':'')+'" data-ly="'+i+'" href="'+h+'"'+(aktif?' aria-current="step"':'')+' title="'+(i+1)+'. adım: '+AD[i][1]+'">'+ic+'</a>';
  });
  nav.innerHTML = html;
  document.body.insertBefore(nav, document.body.firstChild);

  /* aynı sayfadaki adımlar: hangi bölüm ekrandaysa o adım vurgulanır */
  if(sabit.length || !('IntersectionObserver' in window)) return;
  var izle = [];
  H.forEach(function(h, i){
    if(!h) return;
    var p = h.split('#');
    if(p[0] !== dosya || !p[1]) return;
    var el = document.getElementById(p[1]);
    if(el) izle.push([el, i]);
  });
  var linkler = nav.querySelectorAll('a[data-ly]');
  function isaretle(i){
    Array.prototype.forEach.call(linkler, function(a){
      var on = +a.getAttribute('data-ly') === i;
      a.classList.toggle('aktif', on);
      if(on) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
  }
  var gorunen = {};
  var gozcu = new IntersectionObserver(function(kayitlar){
    kayitlar.forEach(function(k){ gorunen[k.target.id] = k.isIntersecting ? k.intersectionRatio : 0; });
    var en = -1, enOran = 0;
    izle.forEach(function(x){ var o = gorunen[x[0].id] || 0; if(o > enOran){ enOran = o; en = x[1]; } });
    if(en >= 0) isaretle(en);
  }, {threshold:[0, .15, .4]});
  izle.forEach(function(x){ gozcu.observe(x[0]); });
}
/* ---------- 2026-11-07: ortak konu sayfası katmanı (ortak/konu-sayfa.js) ----------
   Bölüm listesi sayfanın GERÇEK başlıklarından (section[id] > h2) kurulur.
   9. sınıf sekmeli sayfada hedefin sekmesi önce sayfanın kendi sekmeAc()
   işleviyle açılır. İçeriğe dokunulmaz. */
function temiz(t){ return String(t || '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️]/gu, '').replace(/\s+/g, ' ').trim(); }
function sekmesi(el){
  if(!el) return null;
  var t = el.closest('[data-tab]');
  if(t) return t.getAttribute('data-tab');
  if(el.querySelector && el.querySelector('[data-tab="konu"]')) return 'konu';
  return null;
}
function ustYukseklik(){
  var h = 0;
  Array.prototype.forEach.call(document.querySelectorAll('nav.sekmeler, .topbar, header'), function(x){
    var st = getComputedStyle(x); if(st.position === 'sticky' || st.position === 'fixed') h = Math.max(h, x.offsetHeight);
  });
  return h;
}
function goster(el){
  var sk = sekmesi(el);
  if(sk && typeof window.sekmeAc === 'function'){ try{ window.sekmeAc(sk, false); }catch(e){} }
  var y = el.getBoundingClientRect().top + pageYOffset - (ustYukseklik() + 12);
  var az = false; try{ az = matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  scrollTo({top:Math.max(0, y), behavior: az ? 'auto' : 'smooth'});
}
function konuSayfasiKur(){
  var bolumler = [];
  Array.prototype.forEach.call(document.querySelectorAll('section[id]'), function(sec){
    if(sec.classList.contains('hero')) return;
    var h = sec.querySelector('h2'); var ad = h ? temiz(h.textContent) : '';
    if(!ad) return;
    var no = (/^k(\d)$/.exec(sec.id) || [])[1] || '';
    bolumler.push({id:sec.id, el:sec, etiket:ad.length > 60 ? ad.slice(0, 58) + '…' : ad, kat:'_', no:no, sekmeli:sec.hasAttribute('data-tab')});
  });
  if(bolumler.length < 2) return;
  window.LISE_BOLUMLER = { ogeler:bolumler, katlar:[{k:'_', ad:S + '. sınıf · bu ünite', ikon:'📖'}], git:goster, lise:true };
  /* sekmeli sayfada çubuktaki aynı sayfa bağlantıları önce sekmeyi açsın */
  if(document.querySelector('[data-tab]') && typeof window.sekmeAc === 'function'){
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('.ly-cubuk a[href]');
      if(!a) return;
      var p = a.getAttribute('href').split('#');
      if(!p[1] || (p[0] && p[0] !== dosya)) return;
      var el = document.getElementById(p[1]);
      if(!el) return;
      e.preventDefault(); goster(el);
    });
  }
  var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = '../ortak/konu-sayfa.css'; document.head.appendChild(css);
  var js = document.createElement('script'); js.src = '../ortak/konu-sayfa.js'; document.body.appendChild(js);
}
function hepsi(){ kur(); try{ konuSayfasiKur(); }catch(e){ if(window.console) console.warn('Konu sayfası:', e); } }
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hepsi); else hepsi();
})();
