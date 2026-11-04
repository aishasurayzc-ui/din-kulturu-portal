/* ======================================================================
   ANA SAYFA DÖNÜŞÜMÜ (2026-11-02) — ek katman
   * Ana sayfadaki yeni bölümleri portalın GERÇEK verileriyle doldurur:
     SINIFLAR, yaziliMevcutListesi(), mebUniteSayisi(), OYUN_VERI,
     MEB_PROGRAM, ACIK_UCLU ve Açık Uçlu Soru Merkezi havuz dosyaları.
   * Mevcut hiçbir fonksiyonu değiştirmez; yalnızca onları çağırır.
   * Sayfanın kendi kurulumu (DOMContentLoaded) bittikten sonra çalışır.
====================================================================== */
(function(){
"use strict";

/* Son eklenen gerçek içerikler. Yeni bir içerik eklendiğinde bu listeye
   bir satır eklemek yeterlidir; bölüm tarih sırasıyla kendiliğinden dizilir. */
var YENILIKLER = [
  {t:'2026-11-01', tur:'Yeni ünite', ikon:'science', baslik:'8. Sınıf · Müslümanların Bilim ve Kültüre Katkısı', ozet:'MEB 8.5 ünitesi konu anlatımı, değerlendirme ve oyun merkeziyle yayında.', url:'din-kulturu-8sinif-1unite/unite6.html'},
  {t:'2026-11-01', tur:'Soru bankası', ikon:'edit_note', baslik:'Açık Uçlu Soru Merkezi: 4–12. sınıflar', ozet:'45 ünitenin her biri için 50 soru; cevap anahtarı ve 10 puanlık ölçüt.', url:'acik-uclu-soru-merkezi/tum-siniflar.html'},
  {t:'2026-11-01', tur:'Araç', ikon:'forum', baslik:'Bana Sor öğrenme asistanı yenilendi', ozet:'Sınıf düzeyine göre konuşur; 10 çalışma biçimi, sesli soru ve sohbet geçmişi.', eylem:'asistan'},
  {t:'2026-10-31', tur:'Video', ikon:'smart_display', baslik:'Konu anlatım videoları', ozet:'4–11. sınıflarda ünite sayfalarına anlatım videoları eklendi.', url:'din-kulturu-8sinif-1unite/index.html'},
  {t:'2026-10-31', tur:'Öğretmen', ikon:'assessment', baslik:'Öğretmen raporu', ozet:'Ünite ziyaretleri, öz değerlendirmeler ve yanlış yapılan sorular tek raporda.', url:'ogretmen-raporu.html'},
  {t:'2026-10-26', tur:'Erişilebilirlik', ikon:'headphones', baslik:'Konuyu sesli dinle', ozet:'Konu anlatımlarını sesli dinleme ve 4–8. sınıflarda sure dinleme.', url:'din-kulturu-5sinif-1unite/konuyu-ogren.html'},
  {t:'2026-10-14', tur:'Öğretmen', ikon:'qr_code_2', baslik:'Test karekodları', ozet:'Ünite testleri, LGS denemeleri ve yazılı yoklamaları için yazdırılabilir karekodlar.', url:'test-karekodlari.html'}
];
var YENI_GUN = 21;

/* Sınıf kartı görselleri: yalnızca kamu malı / CC0 fotoğraflar
   (kaynakları din-kulturu-slayt-gorseller/ altındaki notlarda). */
/* 2026-11-02: kart görselleri tek tasarım ailesi — izometrik SVG (sinif-3b/). Eski fotoğraflar
   (sinif-sN.webp) diskte duruyor; geri dönmek için bu satırı eski hâline almak yeterli. */
var GORSEL = {s4:'sinif-3b/s4.svg', s5:'sinif-3b/s5.svg', s6:'sinif-3b/s6.svg', s7:'sinif-3b/s7.svg', s8:'sinif-3b/s8.svg', s9:'sinif-3b/s9.svg', s10:'sinif-3b/s10.svg', s11:'sinif-3b/s11.svg', s12:'sinif-3b/s12.svg'};
var BETIK = document.currentScript;
var KLASOR = BETIK ? BETIK.getAttribute('src').replace(/anasayfa\.js.*$/, '') : 'assets/anasayfa/';

function $(id){ return document.getElementById(id); }
function kac(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function sayiYaz(n){ return Number(n).toLocaleString('tr-TR'); }
function guvenli(f){ try{ f(); }catch(e){ if(window.console) console.warn('Ana sayfa bölümü:', e); } }
function varMi(ad){ try{ return typeof window[ad] !== 'undefined' || eval('typeof ' + ad) !== 'undefined'; }catch(e){ return false; } }
function oku(ad){ try{ return eval(ad); }catch(e){ return undefined; } }

/* ---------- gerçek sayılar ---------- */
var SAYI = {};
function sayilariHesapla(){
  var S = oku('SINIFLAR') || [];
  SAYI.unite = oku('TOPLAM_UNITE');
  SAYI.yazili = oku('TOPLAM_YAZILI');
  var V = window.OYUN_VERI;
  if(V && V.mekanikler){
    SAYI.mekanik = V.mekanikler.length;
    SAYI.oyunUnite = (V.uniteler || []).length;
    SAYI.oyunAtama = Object.keys(V.kutuphane || {}).reduce(function(t,k){ return t + (V.kutuphane[k] || []).length; }, 0);
  }
  if(window.AUC_LISTE) SAYI.acikUclu = Object.keys(window.AUC_LISTE).reduce(function(t,k){ return t + (+window.AUC_LISTE[k] || 0); }, 0);
  return S;
}
function sayilariYaz(){
  Array.prototype.forEach.call(document.querySelectorAll('[data-ph-sayi]'), function(el){
    var v = SAYI[el.getAttribute('data-ph-sayi')];
    if(typeof v === 'number' && v > 0) el.textContent = sayiYaz(v);
  });
}
/* Açık Uçlu Soru Merkezi'nin hazır havuz listesi (gerçek dosya sayısı) */
function aucListeYukle(sonra){
  if(window.AUC_LISTE){ sonra(); return; }
  var sc = document.createElement('script');
  sc.src = 'acik-uclu-soru-merkezi/havuz/liste.js';
  sc.onload = sonra; sc.onerror = sonra;
  document.body.appendChild(sc);
}

/* ---------- sınıf geçişi (mevcut fonksiyonlarla) ---------- */
function siniftaAc(sid, sekme){
  var panel = $(sid);
  if(!panel || typeof window.sinifGoster !== 'function'){ var h = $('sinifOdakBaslik'); if(h) h.scrollIntoView({behavior:'smooth'}); return; }
  window.sinifGoster(sid);
  if(sekme && typeof window.icerikGoster === 'function' && $('ib-' + sid + '-' + sekme)) window.icerikGoster(sid, sekme);
  var hedef = $('sinifSekme') || panel;
  setTimeout(function(){ hedef.scrollIntoView({behavior: azHareket() ? 'auto' : 'smooth', block:'start'}); }, 30);
}
function azHareket(){ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

/* ---------- sınıf kartları ---------- */
function sinifKartlari(S){
  var alan = $('phSinifKartlari'); if(!alan) return;
  var P = (window.MEB_PROGRAM && window.MEB_PROGRAM.siniflar) || {};
  var OS = oku('OYUN_SINIFLARI') || [], OG = oku('OGREN_SAYFALI') || [];
  alan.innerHTML = S.map(function(s){
    var no = parseInt(s.id.slice(1), 10);
    var mebToplam = (P[s.id] || []).length || 5;
    var yayinda = typeof window.mebUniteSayisi === 'function' ? window.mebUniteSayisi(s) : s.uniteler.length;
    var yazili = typeof window.yaziliMevcutListesi === 'function' ? window.yaziliMevcutListesi(s).length : 0;
    var auc = window.AUC_LISTE ? Object.keys(window.AUC_LISTE).filter(function(k){ return k.indexOf(s.id + '-') === 0; }).length * 50 : 0;
    var durum, durumSinif;
    if(yayinda >= mebToplam){ durum = 'Tüm üniteler hazır'; durumSinif = 'hazir'; }
    else if(yayinda > 0){ durum = yayinda + '/' + mebToplam + ' ünite yayında'; durumSinif = 'gelisiyor'; }
    else { durum = 'Ünite sayfaları hazırlanıyor'; durumSinif = 'hazirlaniyor'; }
    var araclar = [];
    if(OG.indexOf(s.id) >= 0 || yayinda > 0) araclar.push(['menu_book','Konu anlatımı']);
    if(OS.indexOf(s.id) >= 0){ araclar.push(['sports_esports','Etkinlik ve oyun']); araclar.push(['psychology','Kavram Kodlama']); }
    if(s.id === 's8') araclar.unshift(['target','LGS Hazırlık']);
    if(s.calismaKitabi) araclar.push(['menu_book','Yazılı çalışma kitabı']);
    if(auc) araclar.push(['edit_note','Açık uçlu sorular']);
    var icerikli = yayinda > 0;
    var dugme = icerikli
      ? '<button type="button" class="ph-btn" data-ph-sinif="'+s.id+'" data-ph-sekme="unite">'+kac(s.ad)+'’a git <span class="msi" aria-hidden="true">arrow_forward</span></button>'
      : (auc ? '<a class="ph-btn ph-btn--ikincil" href="acik-uclu-soru-merkezi/tum-siniflar.html#s'+no+'">Açık uçlu sorulara git <span class="msi" aria-hidden="true">arrow_forward</span></a>' : '');
    return '<article class="ph-sk'+(s.id === 's8' ? ' ph-sk--lgs' : '')+'" role="listitem" style="--sk:var('+s.vurgu+')">'+
      '<div class="ph-sk-gorsel"><img src="'+KLASOR+GORSEL[s.id]+'" alt="" loading="lazy" width="720" height="460">'+
        '<span class="ph-sk-no" aria-hidden="true">'+no+'</span>'+
        '<span class="ph-durum ph-durum--'+durumSinif+'">'+durum+'</span></div>'+
      '<div class="ph-sk-govde">'+
        '<h3>'+kac(s.ad)+'</h3>'+
        '<p class="ph-sk-slogan">'+kac(durumSinif === 'hazirlaniyor' ? 'Açık uçlu sorular ve Bana Sor ile çalışılabilir' : s.slogan)+'</p>'+
        '<dl class="ph-sk-sayilar">'+
          '<div><dt>Ünite</dt><dd>'+yayinda+'<small>/'+mebToplam+'</small></dd></div>'+
          '<div><dt>Yazılı</dt><dd>'+yazili+'</dd></div>'+
          '<div><dt>Açık uçlu</dt><dd>'+(auc ? sayiYaz(auc) : '—')+'</dd></div>'+
        '</dl>'+
        '<ul class="ph-sk-araclar">'+araclar.slice(0,4).map(function(a){ return '<li><span class="msi" aria-hidden="true">'+a[0]+'</span>'+kac(a[1])+'</li>'; }).join('')+'</ul>'+
        dugme+
      '</div>'+
    '</article>';
  }).join('');
}

/* ---------- vitrin: açık uçlu soru (gerçek havuz dosyasından) ---------- */
var aucSorular = null;
function acikUcluVitrin(){
  var kutu = $('phAcikKutu'); if(!kutu) return;
  function ciz(){
    var H = window.AUC_HAVUZ && window.AUC_HAVUZ['s8-u1'];
    if(!H || !H.sorular || !H.sorular.length){ $('phAcikSoru').textContent = 'Soru şu an yüklenemedi. Tüm sorular Açık Uçlu Soru Merkezi’nde.'; return; }
    aucSorular = H.sorular.filter(function(q){ return q[0] === 'hayat' || q[0] === 'metin' || q[0] === 'analiz'; });
    if(!aucSorular.length) aucSorular = H.sorular;
    yeniSoru();
    $('phAcikAnahtar').hidden = false; $('phAcikBaska').hidden = false;
  }
  if(window.AUC_HAVUZ && window.AUC_HAVUZ['s8-u1']) ciz();
  else {
    var sc = document.createElement('script');
    sc.src = 'acik-uclu-soru-merkezi/havuz/s8-u1.js';
    sc.onload = ciz; sc.onerror = ciz;
    document.body.appendChild(sc);
  }
  $('phAcikBaska').addEventListener('click', yeniSoru);
}
function yeniSoru(){
  if(!aucSorular) return;
  var q = aucSorular[Math.floor(Math.random() * aucSorular.length)];
  $('phAcikSoru').textContent = String(q[2]).split('\n').map(function(l){ l = l.trim(); if (l.charAt(0) === '|') return ''; return l.replace(/^(\? |> |- )/, '').replace(/:: /, ': '); }).filter(Boolean).join(' ');
  $('phAcikBeklenen').textContent = q[3];
  $('phAcikUnsur').innerHTML = (q[4] || []).map(function(u){ return '<li>'+kac(u)+'</li>'; }).join('');
  $('phAcikAnahtar').open = false;
}

/* ---------- vitrin: yazılı ölçütü (sayfadaki ACIK_UCLU verisinden) ---------- */
function olcutVitrin(){
  var A = oku('ACIK_UCLU'); if(!A || !A.s8) return;
  var q = A.s8.filter(function(x){ return x.olcut && x.olcut.length >= 2 && x.soru && x.soru.length < 240; })[0] || A.s8[0];
  if(!q) return;
  $('phOlcutSoru').textContent = q.soru.replace(/<[^>]+>/g,'');
  var toplam = 0;
  $('phOlcutTablo').querySelector('tbody').innerHTML = q.olcut.map(function(o){ toplam += +o[1] || 0; return '<tr><td>'+kac(String(o[0]).replace(/<[^>]+>/g,''))+'</td><td>'+kac(o[1])+'</td></tr>'; }).join('') +
    '<tr class="ph-toplam"><td>Toplam</td><td>'+toplam+'</td></tr>';
}

/* ---------- vitrin: mini kontrol (gerçek ders sorusu) ---------- */
function miniKontrol(){
  var g = document.querySelector('.ph-kutu--kontrol'); if(!g) return;
  var bilgi = g.querySelector('.ph-geri-bildirim');
  g.querySelector('.ph-secenekler').addEventListener('click', function(e){
    var b = e.target.closest('button'); if(!b) return;
    Array.prototype.forEach.call(this.children, function(x){ x.classList.remove('ph-dogru','ph-yanlis'); x.removeAttribute('aria-pressed'); });
    b.setAttribute('aria-pressed','true');
    if(b.dataset.dogru){ b.classList.add('ph-dogru'); bilgi.textContent = 'Doğru! Kader “plan”, kaza o planın zamanı gelince gerçekleşmesidir.'; }
    else { b.classList.add('ph-yanlis'); bilgi.textContent = 'Bu kısmı birlikte düzeltelim: kader takdir edilmesi, kaza ise gerçekleşmesidir. Bir daha dene.'; }
  });
}

/* ---------- vitrin: gerçek etkinlik adları ---------- */
function oyunCipleri(){
  var V = window.OYUN_VERI, ul = $('phOyunCipler');
  if(!V || !V.mekanikler || !ul) return;
  var ad = V.mekanikler.map(function(m){ return m.ad || m.baslik; }).filter(Boolean);
  if(ad.length >= 6) ul.innerHTML = ad.slice(0, 8).map(function(a){ return '<li>'+kac(a)+'</li>'; }).join('');
}

/* ---------- Maarif örneği (resmî program verisinden) ---------- */
function maarifOrnek(){
  var P = window.MEB_PROGRAM && window.MEB_PROGRAM.siniflar, el = $('phMaarifOrnek');
  if(!P || !P.s8 || !el) return;
  var c = (P.s8[0].ogrenmeCiktilari || [])[0];
  if(c) el.textContent = '8. sınıf, 1. ünite: ' + c.kod + ' — ' + c.ad;
}

/* ---------- Neler Yeni? ---------- */
function yenilikler(){
  var ol = $('phYeniListe'); if(!ol) return;
  var bugun = new Date();
  var l = YENILIKLER.slice().sort(function(a,b){ return a.t < b.t ? 1 : a.t > b.t ? -1 : 0; });
  ol.innerHTML = l.slice(0, 6).map(function(y){
    var d = new Date(y.t + 'T12:00:00');
    var yeni = (bugun - d) / 864e5 <= YENI_GUN;
    var tarih = d.toLocaleDateString('tr-TR', {day:'numeric', month:'long', year:'numeric'});
    var ic = '<span class="ph-yeni-ikon"><span class="msi" aria-hidden="true">'+y.ikon+'</span></span>'+
      '<span class="ph-yeni-metin"><span class="ph-yeni-ust">'+(yeni ? '<span class="ph-etiket-yeni">YENİ</span>' : '')+'<span class="ph-yeni-tur">'+kac(y.tur)+'</span><time datetime="'+y.t+'">'+tarih+'</time></span>'+
      '<b>'+kac(y.baslik)+'</b><span>'+kac(y.ozet)+'</span></span><span class="msi ph-yeni-ok" aria-hidden="true">arrow_forward</span>';
    return '<li>' + (y.eylem === 'asistan'
      ? '<button type="button" class="ph-yeni-oge" data-ph-asistan="1">'+ic+'</button>'
      : '<a class="ph-yeni-oge" href="'+kac(y.url)+'">'+ic+'</a>') + '</li>';
  }).join('');
}

/* ---------- düğmeler ---------- */
function dugmeler(){
  /* Hero: mevcut düğmelerin kimlikleri korunur, yeni görevleri atanır
     (klonlanarak eski dinleyiciler devreden çıkar). */
  /* Yakalama aşamasında yönlendirilir: eski dinleyiciler ne zaman
     bağlanmış olursa olsun düğmeye ulaşmadan yeni hedefe kaydırılır. */
  var HEDEF = { heroSiniflarBtn: 'siniflar', heroCalismaBtn: 'platform' };
  document.addEventListener('click', function(e){
    var d = e.target.closest && e.target.closest('#heroSiniflarBtn, #heroCalismaBtn');
    if(!d) return;
    var h = $(HEDEF[d.id]); if(!h) return;
    e.stopPropagation(); e.preventDefault();
    h.scrollIntoView({behavior: azHareket() ? 'auto' : 'smooth', block:'start'});
  }, true);
  document.addEventListener('click', function(e){
    var s = e.target.closest('[data-ph-sinif]');
    if(s){ e.preventDefault(); siniftaAc(s.getAttribute('data-ph-sinif'), s.getAttribute('data-ph-sekme')); return; }
    if(e.target.closest('[data-ph-em]')){ var k = $('emGirisKart'); if(k) k.click(); return; }
    if(e.target.closest('[data-ph-asistan]')){
      var balon = document.querySelector('#dkabAsistan .dka-balon');
      if(balon){ if(balon.getAttribute('aria-expanded') !== 'true') balon.click(); }
      return;
    }
  });
}

function kur(){
  var S = sayilariHesapla();
  guvenli(dugmeler);
  guvenli(miniKontrol);
  guvenli(olcutVitrin);
  guvenli(oyunCipleri);
  guvenli(maarifOrnek);
  guvenli(yenilikler);
  guvenli(acikUcluVitrin);
  aucListeYukle(function(){
    sayilariHesapla();
    guvenli(sayilariYaz);
    guvenli(function(){ sinifKartlari(S); });
  });
  guvenli(sayilariYaz);
  guvenli(function(){ sinifKartlari(S); });
}
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ guvenli(kur); });
else guvenli(kur);
})();

/* 2026-11-02 — İlk kez gelen ziyaretçi: henüz konu açmamış, tamamlamamış ve favori
   eklememişse kişisel bölümler (Kaldığın yer, Favorilerim, Önerilen) gizlenir. */
(function(){
  function dolu(k){
    var v = null;
    try{ v = localStorage.getItem(k); }catch(e){ return false; }
    if(!v) return false;
    try{
      var x = JSON.parse(v);
      if(Array.isArray(x)) return x.length > 0;
      if(x && typeof x === 'object') return Object.keys(x).length > 0;
      return !!x;
    }catch(e){ return true; }   /* JSON değilse: düz metin kayıt var */
  }
  var kullanmis = dolu('dkab_son_konu') || dolu('dkab_tamamlanan') || dolu('dkab_favoriler') || dolu('dkab_son_yazili');
  if(!kullanmis) document.documentElement.classList.add('ph-ilk-ziyaret');
})();

/* 2026-11-02 — ÇOK SADE ANA SAYFA: gizli bölümler istenince açılır */
(function(){
  var kok = document.documentElement;
  kok.classList.add('ph-cok-sade');
  var GIZLI = ['platform','kaldiginYer','favorilerimPanel','onerilenBolum','oyunlar','sinavMerkezi','ogretmenler','ogretmenPaneli','yenilikler','hakkimizda'];
  var BIRLIKTE = { ogretmenler:['ogretmenPaneli'], kaldiginYer:['favorilerimPanel','onerilenBolum'] };
  function ac(id){
    var el = document.getElementById(id);
    if(!el) return null;
    var bolum = null;
    for(var i = 0; i < GIZLI.length; i++){
      var b = document.getElementById(GIZLI[i]);
      if(b && (b === el || b.contains(el))){ bolum = b; break; }
    }
    if(bolum){
      bolum.classList.add('ph-acik');
      (BIRLIKTE[bolum.id] || []).forEach(function(x){ var e = document.getElementById(x); if(e) e.classList.add('ph-acik'); });
    }
    return el;
  }
  /* bağlantı tıklanınca: hedef gizli bölümdeyse önce aç, sonra oraya git */
  document.addEventListener('click', function(e){
    if(e.target.closest && e.target.closest('#heroCalismaBtn')) ac('platform');   /* "Platformu tanı" */
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if(!a || a.hasAttribute('data-ph-em')) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    if(!id) return;
    var el = document.getElementById(id);
    if(!el || el.offsetParent !== null) return;
    var hedef = ac(id);
    if(hedef){ e.preventDefault(); setTimeout(function(){ hedef.scrollIntoView({ behavior:'smooth', block:'start' }); }, 30); }
  }, true);
  /* adres #bolum ile açıldıysa */
  function hashAc(){
    var id = decodeURIComponent((location.hash || '').slice(1));
    if(!id) return;
    var el = ac(id);
    if(el) setTimeout(function(){ el.scrollIntoView({ block:'start' }); }, 60);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hashAc); else hashAc();
  window.addEventListener('hashchange', hashAc);
  /* Kaldığın yerden devam: son açılan konu varsa hızlı erişimin başında görünür */
  function devamKur(){
    var li = document.querySelector('.ph-ky-devam'), a = document.getElementById('phKyDevam');
    if(!li || !a) return;
    var son = null;
    try{ son = JSON.parse(localStorage.getItem('dkab_son_konu') || 'null'); }catch(x){ son = null; }
    if(son && son.href){
      a.href = son.href;
      var ad = document.getElementById('phKyDevamAd');
      if(ad && (son.baslik || son.ad)) ad.textContent = son.baslik || son.ad;
      li.hidden = false;
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', devamKur); else devamKur();
})();
