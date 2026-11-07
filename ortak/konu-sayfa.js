/* ======================================================================
   KONU SAYFASI — ortak gezinme katmanı (2026-11-07)
   4–8. sınıf "Konuyu Öğren" sayfaları (portal-nav.js → KS_API) ve
   9–11. sınıf ünite sayfaları (lise-yol.js → kendi bölüm listesi) için.

   SAYFA İÇERİĞİNE DOKUNMAZ: hiçbir metin silinmez, değiştirilmez, taşınmaz.
   Yalnızca üç gezinme öğesi EKLENİR:
     1) masaüstünde solda dikey konu menüsü (sayfadaki gerçek bölümler)
     2) üstte okuma ilerleme çubuğu
     3) her bölümün sonunda "Önceki · Başlıklar · Sonraki" satırı
   Mobilde dikey menü yerine sayfanın kendi üst (yatay) menüsü kullanılır.
   Bütün eklenen öğeler "ksx-" önekli; mevcut sınıflarla çakışmaz.
====================================================================== */
(function(){
"use strict";
if(window.__konuSayfa) return;
window.__konuSayfa = true;

function kacis(t){ return String(t == null ? '' : t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function azHareket(){ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }

/* ---------- kaynak: bölüm listesi ---------- */
var K = null; /* { ogeler:[{id,el,etiket,kat,no}], katlar:[{k,ad,ikon}], git(el) } */
if(window.KS_API){
  K = { ogeler: window.KS_API.ogeler(), katlar: window.KS_API.kategoriler, git: window.KS_API.git, olcu: window.KS_API.olcu, ks: true };
} else if(window.LISE_BOLUMLER){
  K = window.LISE_BOLUMLER; /* lise-yol.js hazırlar */
}
if(!K || !K.ogeler || K.ogeler.length < 2) return;
var O = K.ogeler;

/* ---------- 1) okuma ilerleme çubuğu ---------- */
var bar = document.createElement('div');
bar.className = 'ksx-ilerleme'; bar.setAttribute('aria-hidden', 'true');
bar.innerHTML = '<span></span>';
document.body.appendChild(bar);
function oran(){
  var h = document.documentElement.scrollHeight - innerHeight;
  return h > 0 ? Math.min(1, Math.max(0, pageYOffset / h)) : 0;
}

/* ---------- 2) dikey konu menüsü ---------- */
/* <nav> değil <div role=navigation>: sayfaların genel `nav{}` kuralları (yapışkan, ortalı) bu öğelere bulaşmasın */
var toc = document.createElement('div');
toc.className = 'ksx-toc'; toc.setAttribute('role', 'navigation'); toc.setAttribute('aria-label', 'Bu sayfadaki bölümler');
var gruplar = [];
(K.katlar || [{k:'_', ad:'Bölümler', ikon:'📖'}]).forEach(function(kt){
  var ic = O.filter(function(o){ return (o.kat || '_') === kt.k; });
  if(ic.length) gruplar.push({kt:kt, ogeler:ic});
});
toc.innerHTML =
  '<div class="ksx-toc-ust"><b>Bu sayfada</b><span class="ksx-toc-durum" aria-live="polite"></span></div>' +
  '<div class="ksx-toc-cubuk" aria-hidden="true"><span></span></div>' +
  '<div class="ksx-toc-liste">' + gruplar.map(function(g){
    return '<p class="ksx-toc-grup"><span aria-hidden="true">' + (g.kt.ikon || '') + '</span>' + kacis(g.kt.ad) + '</p><ol>' +
      g.ogeler.map(function(o){
        return '<li><a href="#' + kacis(o.id) + '" data-ksx="' + kacis(o.id) + '">' + (o.no ? '<b>' + kacis(o.no) + '</b>' : '') + '<span>' + kacis(o.etiket) + '</span></a></li>';
      }).join('') + '</ol>';
  }).join('') + '</div>';
document.body.appendChild(toc);

/* Menü yalnızca içerik sütununun solunda yeterli boşluk varsa açılır */
function icerikSol(){
  var en = Infinity;
  var bloklar = Array.prototype.slice.call(document.querySelectorAll('main > *, main section > *, .ks-konum, .ks-kirinti, .ka-hero, .ly-cubuk ~ *'));
  O.forEach(function(o){ if(o.el) bloklar.push(o.el); });
  bloklar.forEach(function(el){
    if(!el.getClientRects().length || el.classList.contains('ksx-toc') || el.classList.contains('ksx-sn') || el.classList.contains('ly-cubuk')) return;
    var st = getComputedStyle(el); if(st.position === 'fixed') return;
    var r = el.getBoundingClientRect();
    if(r.width > 280 && r.width < innerWidth - 40) en = Math.min(en, r.left);
  });
  return en === Infinity ? 0 : en;
}
var GEN = 224;
function yerlesim(){
  /* Geniş ekranda (≥1200px) menü her zaman açılır; içerik sütunu menünün
     sağındaki alanda ortalanır (body'ye sol boşluk verilir, içerik değişmez). */
  var acik = innerWidth >= 1200;
  document.documentElement.classList.toggle('ksx-toc-var', acik);
  toc.style.left = '';
  if(K.olcu) K.olcu();
}

/* ---------- 3) bölüm sonu gezinmesi ---------- */
/* Satır, iki bölümün gerçek sınırına konur: belge sırasıyla bir sonraki
   bölümün en üst kapsayıcısının hemen önüne. Farklı sayfa bölümlerinde
   (sayfanın aç/kapa ile gösterdiği section'lar) olan iki bölüm arasına konmaz. */
var D = O.slice().sort(function(a, b){ return (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1; });
function satirHtmlD(i){
  var once = D[i - 1], sonra = D[i];
  return '<span class="ksx-sn-ic">' +
    '<button type="button" class="ksx-sn-btn" data-ksx-id="' + kacis(once.id) + '"><small>← Önceki bölüm</small><span>' + kacis(once.etiket) + '</span></button>' +
    '<button type="button" class="ksx-sn-orta" data-ksx-basliklar="1"><span aria-hidden="true">☰</span> Konu başlıkları <small>' + (i + 1) + ' / ' + D.length + '</small></button>' +
    '<button type="button" class="ksx-sn-btn ksx-sn-btn--sonra" data-ksx-id="' + kacis(sonra.id) + '"><small>Sonraki bölüm →</small><span>' + kacis(sonra.etiket) + '</span></button>' +
  '</span>';
}
function sayfaBolumu(el){ return el.closest('main > section') || null; }
for(var di = 1; di < D.length; di++){
  var A = D[di - 1].el, B = D[di].el;
  if(!A || !B || A.contains(B) || B.contains(A)) continue;
  if(K.ks && sayfaBolumu(A) !== sayfaBolumu(B)) continue;
  /* lise: sekmeyle gizlenen bölümlerin yanına satır koyma */
  if(!K.ks && (D[di - 1].sekmeli || D[di].sekmeli)) continue;
  var dugum = B;
  while(dugum.parentNode && !dugum.parentNode.contains(A)) dugum = dugum.parentNode;
  var ebeveyn = dugum.parentNode;
  if(!ebeveyn || (K.ks && (ebeveyn === document.body || ebeveyn.tagName === 'MAIN'))) continue;
  var ds = getComputedStyle(ebeveyn);
  if(/grid/.test(ds.display) || (/flex/.test(ds.display) && !/column/.test(ds.flexDirection))) continue;
  var nav = document.createElement('div');
  nav.className = 'ksx-sn'; nav.setAttribute('role', 'navigation'); nav.setAttribute('aria-label', 'Bölüm gezinmesi');
  nav.innerHTML = satirHtmlD(di);
  ebeveyn.insertBefore(nav, dugum);
}

/* ---------- olaylar ---------- */
var aktifId = null;
function aktifYap(id){
  if(!id || id === aktifId) return;
  aktifId = id;
  var a = null;
  Array.prototype.forEach.call(toc.querySelectorAll('a[data-ksx]'), function(x){
    var bu = x.getAttribute('data-ksx') === id;
    x.classList.toggle('aktif', bu);
    if(bu){ x.setAttribute('aria-current', 'location'); a = x; } else x.removeAttribute('aria-current');
  });
  var sira = O.map(function(o){ return o.id; }).indexOf(id);
  toc.querySelector('.ksx-toc-durum').textContent = 'Bölüm ' + (sira + 1) + ' / ' + O.length;
  if(a && document.documentElement.classList.contains('ksx-toc-var')){
    var liste = toc.querySelector('.ksx-toc-liste'), r = a.getBoundingClientRect(), lr = liste.getBoundingClientRect();
    if(r.top < lr.top + 8 || r.bottom > lr.bottom - 8) liste.scrollTop += (r.top - lr.top) - lr.height / 3;
  }
}
document.addEventListener('ks:aktif', function(e){ if(e.detail) aktifYap(e.detail.id); });

function git(o){ if(!o) return; if(K.git) K.git(o.el); else o.el.scrollIntoView({behavior: azHareket() ? 'auto' : 'smooth', block:'start'}); aktifYap(o.id); }
toc.addEventListener('click', function(e){
  var a = e.target.closest('a[data-ksx]'); if(!a) return;
  e.preventDefault(); e.stopPropagation();
  var id = a.getAttribute('data-ksx');
  git(O.filter(function(o){ return o.id === id; })[0]);
});
document.addEventListener('click', function(e){
  var b = e.target.closest && e.target.closest('[data-ksx-id]');
  if(b){ e.preventDefault(); var id = b.getAttribute('data-ksx-id'); git(O.filter(function(o){ return o.id === id; })[0]); return; }
  if(e.target.closest && e.target.closest('[data-ksx-basliklar]')){
    e.preventDefault();
    if(document.documentElement.classList.contains('ksx-toc-var')){
      var ak = toc.querySelector('a.aktif') || toc.querySelector('a');
      toc.classList.add('ksx-vurgu'); setTimeout(function(){ toc.classList.remove('ksx-vurgu'); }, 900);
      if(ak) ak.focus();
    } else {
      var hedef = document.querySelector('.ka-hero .ka-icindekiler') || document.querySelector('.ks-bn') || document.getElementById('harita') || document.body;
      hedef.scrollIntoView({behavior: azHareket() ? 'auto' : 'smooth', block:'start'});
    }
  }
});

/* Lise sayfaları için aktif bölüm: KS_API olmadığında kendi izleyicimiz */
function kendiIzle(){
  var esik = Math.min(180, innerHeight * .25), aktif = null;
  O.forEach(function(o){ if(o.el.getClientRects().length && o.el.getBoundingClientRect().top <= esik) aktif = o; });
  aktifYap((aktif || O[0]).id);
}
var bek = false;
addEventListener('scroll', function(){
  if(bek) return; bek = true;
  requestAnimationFrame(function(){
    bek = false;
    var y = Math.round(oran() * 100);
    bar.firstChild.style.width = y + '%';
    toc.querySelector('.ksx-toc-cubuk span').style.width = y + '%';
    if(!K.ks) kendiIzle();
  });
}, {passive:true});
addEventListener('resize', yerlesim);
yerlesim();
setTimeout(yerlesim, 800);   /* görseller yüklenince içerik sütunu oturur */
var ilk = (window.KS_API && window.KS_API.aktif && window.KS_API.aktif()) || null;
aktifYap(ilk ? ilk.id : O[0].id);
if(!K.ks) kendiIzle();
})();
