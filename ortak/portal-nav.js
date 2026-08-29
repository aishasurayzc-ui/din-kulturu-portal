/* ======================================================================
   PORTAL NAV — paylaşılan (ortak) sayfalar-arası navigasyon motoru
   SADECE jenerik fonksiyonlar. Hiçbir sınıf/ünite-özel içerik metni
   BURADA yoktur (sadece ünite başlıkları — bunlar din-kulturu-tum-siniflar.html
   içindeki gerçek ünite verisiyle birebir aynıdır).

   Kullanım — her sayfa <body> açılışından hemen sonra şunu koyar:
     <div id="portalNav" data-sinif="8" data-unite="2" data-asama="ogren"></div>
     <link rel="stylesheet" href="../ortak/portal-nav.css">
     <script src="../ortak/portal-nav.js"></script>

   data-asama değerleri: 'sinif' (sınıf ana sayfası) | 'hub' (ünite sayfası)
     | 'ogren' (konuyu-ogren.html) | 'oyun' (oyun-merkezi.html) | 'olcme' (degerlendirme.html)

   localStorage 'dkab_tamamlanan' anahtarı din-kulturu-tum-siniflar.html'in
   KENDİ tamamlanma/rozet sistemiyle (LS_TAMAMLANAN) aynı biçimi kullanır
   ("sN-uM"); böylece burada işaretlenen bir tamamlama, ana portaldaki
   rozet/ilerleme sistemine de otomatik yansır — ayrı bir rozet sistemi
   YOK, mevcut olana bağlanıyor.
====================================================================== */
(function(){
"use strict";

var UNITE_ADLARI = {
  "s4-1":"Günlük Hayattaki Dinî İfadeler","s4-2":"İslam’ı Tanıyalım","s4-3":"Güzel Ahlak",
  "s4-4":"Hz. Muhammed’i Tanıyalım","s4-5":"Din ve Temizlik","s4-6":"Allah Sevgisi",
  "s5-1":"Allah İnancı","s5-2":"Allah’ın Huzurunda Olmak: Namaz İbadeti","s5-3":"Kur’an-ı Kerim",
  "s5-4":"Peygamber Kıssaları","s5-5":"Mimarimizde Dinî Motifler",
  "s6-1":"Peygamber ve İlahi Kitap İnancı","s6-2":"Ramazan ve Oruç","s6-3":"Ahlaki Davranışlar",
  "s6-4":"Peygamberliğinden Önce Hz. Muhammed","s6-5":"Kültürümüzdeki Dinî Motifler",
  "s7-1":"Melek ve Ahiret İnancı","s7-2":"Hac ve Kurban","s7-3":"Ahlaki Davranışlar",
  "s7-4":"Allah’ın Kulu ve Elçisi: Hz. Muhammed","s7-5":"İslam Düşüncesinde Yorumlar",
  "s8-1":"Kader İnancı","s8-2":"Zekât ve Sadaka","s8-3":"Din ve Hayat",
  "s8-4":"Hz. Muhammed’in Örnekliği","s8-5":"Kur’an-ı Kerim ve Özellikleri"
};
var UNITE_SAYISI = {4:6, 5:5, 6:5, 7:5, 8:5};
var YENI_MOTOR_DESTEKLI = {
  4:[1,2,3,4,5], 5:[1,2,3,4,5], 6:[1,2,3,4,5], 7:[1,2,3,4,5], 8:[1,2,3,4,5]
};
var ASAMA_SIRASI = ['hub','ogren','oyun','olcme'];
var ASAMA_ETIKET = {hub:'📖 Ünite', ogren:'🧠 Öğren', oyun:'🎮 Oyun', olcme:'📝 Ölç'};

/* ————— localStorage yardımcıları (güvenli, sessiz başarısız olur) ————— */
var LS_TAMAMLANAN = 'dkab_tamamlanan';
var LS_ZIYARET = 'dkab_ziyaret';
var LS_KILIT_AC = 'dkab_kilit_ac';
var LS_MOD = 'dkab_mod';
var LS_SURE = 'dkab_sure_secimi';

function guvenliOku(anahtar){ try{ return localStorage.getItem(anahtar); }catch(e){ return null; } }
function guvenliYaz(anahtar, deger){ try{ localStorage.setItem(anahtar, deger); }catch(e){} }
function listeOku(anahtar){ try{ var v=JSON.parse(guvenliOku(anahtar)||'[]'); return Array.isArray(v)?v:[]; }catch(e){ return []; } }
function nesneOku(anahtar){ try{ var v=JSON.parse(guvenliOku(anahtar)||'{}'); return (v&&typeof v==='object')?v:{}; }catch(e){ return {}; } }

function id(sinif,unite){ return 's'+sinif+'-u'+unite; }

function tamamlandiMi(sinif,unite){ return listeOku(LS_TAMAMLANAN).indexOf(id(sinif,unite))>=0; }
function tamamlandiIsaretle(sinif,unite){
  var liste = listeOku(LS_TAMAMLANAN), gid = id(sinif,unite);
  if(liste.indexOf(gid)<0){ liste.push(gid); guvenliYaz(LS_TAMAMLANAN, JSON.stringify(liste)); }
}

function ziyaretIsaretle(sinif,unite,asama){
  if(ASAMA_SIRASI.indexOf(asama)<0) return;
  var tumu = nesneOku(LS_ZIYARET), gid = id(sinif,unite);
  tumu[gid] = tumu[gid] || {};
  tumu[gid][asama] = true;
  guvenliYaz(LS_ZIYARET, JSON.stringify(tumu));
}
function ziyaretDurumu(sinif,unite){
  var tumu = nesneOku(LS_ZIYARET);
  return tumu[id(sinif,unite)] || {};
}

function kilitAcikMi(){ return guvenliOku(LS_KILIT_AC)==='1'; }
function kilitDegistir(){ guvenliYaz(LS_KILIT_AC, kilitAcikMi()?'0':'1'); }

function modOku(){ return guvenliOku(LS_MOD)==='ogretmen' ? 'ogretmen' : 'ogrenci'; }
function modYaz(deger){ guvenliYaz(LS_MOD, deger); }

function sureYaz(sinif,unite,dk){ guvenliYaz(LS_SURE+'_'+id(sinif,unite), dk); }
function sureOku(sinif,unite){ return guvenliOku(LS_SURE+'_'+id(sinif,unite)); }

/* ————— saf yardımcılar ————— */
function uniteAdi(sinif, unite){ return UNITE_ADLARI['s'+sinif+'-'+unite] || (unite+'. Ünite'); }

function dosyaAdi(unite, tur){
  var onEk = (unite===1) ? '' : ('unite'+unite+'-');
  if(tur==='hub')   return (unite===1) ? 'index.html' : ('unite'+unite+'.html');
  if(tur==='ogren') return onEk+'konuyu-ogren.html';
  if(tur==='olcme') return onEk+'degerlendirme.html';
  if(tur==='oyun')  return onEk+'oyun-merkezi.html';
  return 'index.html';
}

function oyunHedefi(sinif, unite){
  if(YENI_MOTOR_DESTEKLI[sinif] && YENI_MOTOR_DESTEKLI[sinif].indexOf(unite)>=0){
    return '../din-kulturu-tum-siniflar.html?oyun=s'+sinif+'-u'+unite;
  }
  return dosyaAdi(unite,'oyun');
}

function kacis(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ————— HTML üreticiler ————— */
function modSatiriHtml(){
  var mod = modOku();
  var h = '<div class="pn-mod-satir">'+
    '<button type="button" class="pn-pill" data-pn="mod">'+
      (mod==='ogretmen' ? '👩‍🏫 Öğretmen Modu' : '👨‍🎓 Öğrenci Modu')+' — değiştir</button>';
  if(mod==='ogretmen'){
    h += '<button type="button" class="pn-pill pn-pill-ikincil" data-pn="kilit">'+
      (kilitAcikMi() ? '🔓 Tüm Üniteler Açık' : '🔒 Sıralı İlerleme Açık')+' — değiştir</button>';
  }
  h += '</div>';
  return h;
}

function kirintiHtml(sinif, unite, asama){
  var h = '<nav class="pn-kirinti" aria-label="Sayfa yolu">'+
    '<a href="../din-kulturu-tum-siniflar.html">🏠 Ana Sayfa</a><span class="pn-ok">›</span>'+
    '<a href="index.html">📚 '+sinif+'. Sınıf</a>';
  if(asama!=='sinif'){
    h += '<span class="pn-ok">›</span><a href="'+dosyaAdi(unite,'hub')+'">📖 '+kacis(uniteAdi(sinif,unite))+'</a>';
  }
  h += '</nav>';
  return h;
}

function cubukHtml(sinif, unite, asama){
  if(asama==='sinif') return '';
  var suankiIndex = ASAMA_SIRASI.indexOf(asama);
  var parcalar = ASAMA_SIRASI.map(function(a, i){
    var hedef = (a==='oyun') ? oyunHedefi(sinif,unite) : dosyaAdi(unite,a);
    var durum = i===suankiIndex ? 'aktif' : (i<suankiIndex ? 'tamam' : '');
    return '<a class="pn-adim '+durum+'" href="'+hedef+'">'+
      (durum==='tamam'?'✓ ':'')+ASAMA_ETIKET[a]+'</a>';
  });
  return '<div class="pn-cubuk">'+parcalar.join('<span class="pn-ok pn-ok-cubuk">→</span>')+'</div>';
}

function kilitliMi(sinif, unite){
  if(unite<=1) return false;
  if(kilitAcikMi() || modOku()==='ogretmen') return false;
  return !tamamlandiMi(sinif, unite-1);
}

function sureSecimiHtml(sinif,unite){
  var secili = sureOku(sinif,unite);
  return '<div class="pn-sure-satir"><span class="pn-sure-etiket">⏱️ Ders süresi:</span>'+
    [20,40,80].map(function(dk){
      return '<button type="button" class="pn-pill pn-pill-kucuk'+(String(dk)===secili?' pn-pill-secili':'')+
        '" data-pn="sure" data-dk="'+dk+'">'+dk+' dk</button>';
    }).join('')+'</div>';
}

function altBarHtml(sinif, unite, asama){
  var sonrakiUnite = unite < UNITE_SAYISI[sinif] ? unite+1 : null;
  var ustEk = '', ic = '';
  if(asama==='hub'){
    ustEk = sureSecimiHtml(sinif,unite);
    ic = '<a class="pn-buyuk" href="'+dosyaAdi(unite,'ogren')+'">▶️ Derse Başla</a>';
  } else if(asama==='ogren'){
    ic = '<a class="pn-buyuk" href="'+oyunHedefi(sinif,unite)+'">🎯 Şimdi Uygula — 🎮 Oyuna Geç</a>';
  } else if(asama==='oyun'){
    ic = '<a class="pn-buyuk" href="'+dosyaAdi(unite,'olcme')+'">🧠 Pekiştir — 📝 Kendini Dene</a>';
  } else if(asama==='olcme'){
    var tamamMi = tamamlandiMi(sinif,unite);
    ustEk = raporHtml(sinif,unite,tamamMi);
    if(!tamamMi){
      ic = '<button type="button" class="pn-buyuk" data-pn="tamamla" data-sinif="'+sinif+'" data-unite="'+unite+'">✅ Bu Üniteyi Tamamladım</button>';
    } else if(sonrakiUnite){
      var kilitli = kilitliMi(sinif, sonrakiUnite);
      ic = '<a class="pn-buyuk" href="'+dosyaAdi(sonrakiUnite,'hub')+'">➡️ Sonraki Ünite: '+kacis(uniteAdi(sinif,sonrakiUnite))+
        (kilitli?' <span class="pn-kilit-rozet">🔒</span>':'')+'</a>';
    } else {
      ic = '<a class="pn-buyuk" href="index.html">🏆 Bu sınıfın tüm üniteleri tamam — Sınıf Sayfasına Dön</a>';
    }
  }
  if(!ic && !ustEk) return '';
  return '<div class="pn-alt">'+ustEk+(ic?('<div class="pn-alt-baslik">🎯 Sıradaki Aşama</div>'+ic):'')+'</div>';
}

function raporHtml(sinif, unite, tamamMi){
  var d = ziyaretDurumu(sinif,unite);
  var satirlar = ASAMA_SIRASI.map(function(a){
    return '<span class="pn-rapor-oge'+(d[a]?' pn-rapor-oge-ok':'')+'">'+(d[a]?'✓':'○')+' '+ASAMA_ETIKET[a]+'</span>';
  }).join('');
  return '<div class="pn-rapor"><div class="pn-alt-baslik">📊 Ünite Raporu — '+kacis(uniteAdi(sinif,unite))+'</div>'+
    '<div class="pn-rapor-satir">'+satirlar+'</div>'+
    '<div class="pn-rapor-durum">'+(tamamMi ? '🏆 Durum: Tamamlandı ✓' : '⏳ Durum: Henüz tamamlanmadı')+'</div></div>';
}

function geriBarHtml(sinif, unite, asama){
  if(asama==='sinif' || asama==='hub') return '';
  return '<div class="pn-geri"><a href="'+dosyaAdi(unite,'hub')+'">← Üniteye Dön</a>'+
    '<a href="index.html">← Sınıfa Dön</a></div>';
}

/* ————— olay yönetimi ————— */
function tiklamaYonet(e){
  var t = e.target.closest('[data-pn]');
  if(!t) return;
  var ne = t.dataset.pn;
  if(ne==='mod'){ modYaz(modOku()==='ogretmen' ? 'ogrenci' : 'ogretmen'); yenidenCiz(); return; }
  if(ne==='kilit'){ kilitDegistir(); yenidenCiz(); return; }
  if(ne==='sure'){ yenidenCizSayfaBaglami(function(sinif,unite){ sureYaz(sinif,unite,t.dataset.dk); }); yenidenCiz(); return; }
  if(ne==='tamamla'){
    tamamlandiIsaretle(parseInt(t.dataset.sinif,10), parseInt(t.dataset.unite,10));
    yenidenCiz();
    return;
  }
}
function yenidenCizSayfaBaglami(fn){
  var mount = document.getElementById('portalNav');
  if(!mount) return;
  fn(parseInt(mount.dataset.sinif,10), parseInt(mount.dataset.unite,10)||1);
}

var altKutu = null;
function yenidenCiz(){
  var mount = document.getElementById('portalNav');
  if(!mount) return;
  var sinif = parseInt(mount.dataset.sinif,10);
  var unite = parseInt(mount.dataset.unite,10) || 1;
  var asama = mount.dataset.asama || 'sinif';
  if(!sinif) return;

  mount.innerHTML = modSatiriHtml() + kirintiHtml(sinif,unite,asama) + cubukHtml(sinif,unite,asama) + geriBarHtml(sinif,unite,asama);
  mount.classList.add('pn-hazir');

  var altBar = altBarHtml(sinif,unite,asama);
  if(altKutu && altKutu.parentNode) altKutu.parentNode.removeChild(altKutu);
  altKutu = null;
  if(altBar){
    var kutu = document.createElement('div');
    kutu.innerHTML = altBar;
    altKutu = kutu.firstChild;
    document.body.appendChild(altKutu);
  }
}

function olustur(){
  var mount = document.getElementById('portalNav');
  if(!mount) return;
  var sinif = parseInt(mount.dataset.sinif,10);
  var unite = parseInt(mount.dataset.unite,10) || 1;
  var asama = mount.dataset.asama || 'sinif';
  if(!sinif) return;

  ziyaretIsaretle(sinif, unite, asama);
  yenidenCiz();

  document.addEventListener('click', tiklamaYonet);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', olustur);
else olustur();
})();
