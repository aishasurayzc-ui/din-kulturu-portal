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

   'ogren' sayfalarında (2026-10-26) ana portalla aynı tasarım dili kullanılır:
   üst şerit + konum + ünite başlığı + yapışkan bölüm menüsü + sayfa sonu.
   Ayrıntı: aşağıdaki "KONU ANLATIM SAYFASI DÜZENİ" bölümü ve portal-nav.css.
   "N. Sınıf" bağlantıları artık ../din-kulturu-tum-siniflar.html?sinif=sN
   adresine gider (index.html bir sınıf sayfası değil, 1. ünite sayfasıdır).

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
/* Aşama çubuğunda gösterilen 5 durak (gezinme amaçlı). 'etkinlik' ve 'oyun'
   ikisi de aynı hedefe (yeni oyun motoruna, farklı formla) gider — ayrı bir
   fiziksel "etkinlik" sayfası yoktur, bu yüzden ziyaret takibi (ASAMA_TAKIP)
   sadece gerçekten var olan sayfa türlerini (hub/ogren/oyun/olcme) sayar. */
var ASAMA_SIRASI = ['hub','ogren','etkinlik','oyun','olcme'];
var ASAMA_TAKIP = ['hub','ogren','oyun','olcme'];
var ASAMA_ETIKET = {hub:'📖 Ünite', ogren:'🧠 Öğren', etkinlik:'🎨 Sınıf İçi Etkinlik', oyun:'🎮 Dijital Oyun', olcme:'📝 Pekiştir/Test'};

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
  if(ASAMA_TAKIP.indexOf(asama)<0) return;
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

/* Ana portal ve sınıf adresleri. Sınıf klasöründeki index.html bir "sınıf
   sayfası" DEĞİL, 1. ünitenin sayfasıdır; bu yüzden "N. Sınıf" bağlantıları
   ana portala, ilgili sınıf sekmesi (ve varsa ünite kartı) açık olarak gider.
   Ana portal ?sinif=sN&unite=M parametresini okuyup o kartı gösterir. */
var ANA_SAYFA = '../din-kulturu-tum-siniflar.html';
function sinifSayfasi(sinif, unite){
  return ANA_SAYFA+'?sinif=s'+sinif+(unite ? '&unite='+unite : '');
}

function dosyaAdi(unite, tur){
  var onEk = (unite===1) ? '' : ('unite'+unite+'-');
  if(tur==='hub')   return (unite===1) ? 'index.html' : ('unite'+unite+'.html');
  if(tur==='ogren') return onEk+'konuyu-ogren.html';
  if(tur==='olcme') return onEk+'degerlendirme.html';
  if(tur==='oyun')  return onEk+'oyun-merkezi.html';
  return 'index.html';
}

/* mod: 'etkinlik' -> yeni motorda Öğretmen Modu (görev bazlı) formu açılır;
   'oyun' (veya boş) -> klasik Etkinlik/Oyun Oluştur formu açılır. Yeni motor
   bu ünite için veri içermiyorsa (örn. 4. sınıf 6. ünite) her ikisi de aynı
   eski oyun-merkezi.html sayfasına düşer — orada ayrım yoktur. */
function oyunHedefi(sinif, unite, mod){
  if(YENI_MOTOR_DESTEKLI[sinif] && YENI_MOTOR_DESTEKLI[sinif].indexOf(unite)>=0){
    var url = '../din-kulturu-tum-siniflar.html?oyun=s'+sinif+'-u'+unite;
    if(mod==='etkinlik' || mod==='oyun') url += '&mod='+mod;
    return url;
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

/* Kırıntıda gösterilen "şu an neredesiniz" etiketleri. Aşama çubuğundaki
   (ASAMA_ETIKET) kısa adlardan ayrıdır: kırıntıda tam ad kullanılır. */
var KIRINTI_ASAMA = {
  ogren:    '🧠 Konuyu Öğren',
  etkinlik: '🎨 Sınıf İçi Etkinlik',
  oyun:     '🎮 Dijital Oyunlar',
  olcme:    '📝 Ölçme & Değerlendirme'
};

function kirintiHtml(sinif, unite, asama){
  var uAd = kacis(uniteAdi(sinif, unite));
  var suAn = KIRINTI_ASAMA[asama] || '';

  var h = '<nav class="pn-kirinti" aria-label="Sayfa yolu">'+
    '<ol class="pn-yol">'+
      '<li><a href="../din-kulturu-tum-siniflar.html">🏠 Ana Sayfa</a></li>'+
      '<li><span class="pn-ok" aria-hidden="true">›</span>'+
        (asama==='sinif'
          ? '<span class="pn-simdi" aria-current="page">📚 '+sinif+'. Sınıf</span>'
          : '<a href="'+sinifSayfasi(sinif)+'">📚 '+sinif+'. Sınıf</a>')+'</li>';

  if(asama!=='sinif'){
    h += '<li><span class="pn-ok" aria-hidden="true">›</span>'+
      (asama==='hub'
        ? '<span class="pn-simdi" aria-current="page">📖 '+unite+'. Ünite · '+uAd+'</span>'
        : '<a href="'+dosyaAdi(unite,'hub')+'">📖 '+unite+'. Ünite · '+uAd+'</a>')+'</li>';
  }
  if(suAn){
    h += '<li><span class="pn-ok" aria-hidden="true">›</span>'+
      '<span class="pn-simdi" aria-current="page">'+suAn+'</span></li>';
  }
  h += '</ol></nav>';
  return h;
}

function cubukHedefi(sinif, unite, a){
  /* İki ayrı durak, iki ayrı kanonik sahip:
       etkinlik → sınıf içi etkinlik motoru (portal)
       oyun     → dijital Oyun Merkezi sayfası */
  if(a==='etkinlik') return oyunHedefi(sinif,unite,'etkinlik');
  if(a==='oyun') return dosyaAdi(unite,'oyun')+'#oyun-gruplari';
  return dosyaAdi(unite,a);
}
function cubukHtml(sinif, unite, asama){
  if(asama==='sinif') return '';
  /* eski sayfalarda tek 'oyun' asaması vardı; yeni çubukta 'etkinlik' de
     ayrı bir durak olduğu için eşdeğer kabul edilir (ikisi de aynı adımı
     temsil eder). */
  var esdegerAsama = asama==='oyun' ? 'etkinlik' : asama;
  var suankiIndex = ASAMA_SIRASI.indexOf(asama);
  if(suankiIndex<0) suankiIndex = ASAMA_SIRASI.indexOf(esdegerAsama);
  var parcalar = ASAMA_SIRASI.map(function(a, i){
    var hedef = cubukHedefi(sinif,unite,a);
    var buradaMi = (a===asama) || (a==='etkinlik' && asama==='oyun');
    var durum = buradaMi ? 'aktif' : (i<suankiIndex ? 'tamam' : '');
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

/* Konu öğrenme sayfasının sonundaki çıkışlar. Her içerik türü için
   YALNIZCA BİR çıkış vardır:
     • Etkinlik & Oyun  → oyun motoru (etkinlik/oyun aynı kanonik sayfanın
                          iki modu, mod parametresiyle ayrılır)
     • Ölçme & Değerlendirme → degerlendirme sayfası
     • LGS ile Pekiştir → yalnızca 8. sınıfta, kanonik LGS merkezine
                          sınıf+ünite bağlamı korunarak gider.
   Daha önce "🧠 Pekiştir" ve "📝 Kendini Dene" butonlarının ikisi de aynı
   URL'e gidiyordu; tek çıkışa indirildi. */
function sinavCagrisiHtml(sinif, unite){
  if(sinif !== 8) return '';
  return '<a class="pn-aksiyon pn-aksiyon-sinav" href="../sinav-merkezi/lgs-hazirlik/index.html'+
    '?kart=konular&sekme=kazanim-testleri&unite=unite'+unite+'">🎯 LGS ile Pekiştir</a>';
}
function konuAksiyonlariHtml(sinif, unite){
  /* Sınıf içi etkinlik ile dijital oyun AYRI iki çalışma alanıdır:
     • Sınıf İçi Etkinlik → öğretmenin sınıfta yürüttüğü, ekransız
       etkinlikler (Sıcak Sandalye, Tahta Yarışı…). Portaldaki etkinlik
       motoru açar.
     • Dijital Oyunlar → öğrencinin ekranda tek başına oynadığı oyunlar
       (Kelime Avı, Çengel Bulmaca, Nonogram…). Oyun Merkezi sayfasıdır.
     Eskiden iki buton da etkinlik motorunu açıyordu ve dijital oyunlara
     buradan hiç yol yoktu. */
  return '<div class="pn-alt-baslik">🎯 Bu Konuyu Öğrendin mi?</div>'+
    '<div class="pn-aksiyon-satir">'+
      '<a class="pn-aksiyon" href="'+dosyaAdi(unite,'oyun')+'#oyun-gruplari">🎮 Dijital Oyunlar</a>'+
      '<a class="pn-aksiyon" href="'+oyunHedefi(sinif,unite,'etkinlik')+'">🎨 Sınıf İçi Etkinlik</a>'+
      '<a class="pn-aksiyon" href="'+dosyaAdi(unite,'olcme')+'">📝 Öğrenmeni Değerlendir</a>'+
      sinavCagrisiHtml(sinif, unite)+
    '</div>';
}
function altBarHtml(sinif, unite, asama){
  var sonrakiUnite = unite < UNITE_SAYISI[sinif] ? unite+1 : null;
  var ustEk = '', ic = '';
  if(asama==='hub'){
    ustEk = sureSecimiHtml(sinif,unite);
    ic = '<a class="pn-buyuk" href="'+dosyaAdi(unite,'ogren')+'">▶️ Derse Başla</a>';
  } else if(asama==='ogren'){
    return '<div class="pn-alt">'+konuAksiyonlariHtml(sinif,unite)+'</div>';
  } else if(asama==='oyun'){
    ic = '<a class="pn-buyuk" href="'+dosyaAdi(unite,'olcme')+'">📝 Öğrenmeni Değerlendir</a>';
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
      ic = '<a class="pn-buyuk" href="'+sinifSayfasi(sinif)+'">🏆 Bu sınıfın tüm üniteleri tamam — Sınıf Sayfasına Dön</a>';
    }
  }
  if(!ic && !ustEk) return '';
  return '<div class="pn-alt">'+ustEk+(ic?('<div class="pn-alt-baslik">🎯 Sıradaki Aşama</div>'+ic):'')+'</div>';
}

function raporHtml(sinif, unite, tamamMi){
  var d = ziyaretDurumu(sinif,unite);
  var satirlar = ASAMA_TAKIP.map(function(a){
    return '<span class="pn-rapor-oge'+(d[a]?' pn-rapor-oge-ok':'')+'">'+(d[a]?'✓':'○')+' '+ASAMA_ETIKET[a]+'</span>';
  }).join('');
  return '<div class="pn-rapor"><div class="pn-alt-baslik">📊 Ünite Raporu — '+kacis(uniteAdi(sinif,unite))+'</div>'+
    '<div class="pn-rapor-satir">'+satirlar+'</div>'+
    '<div class="pn-rapor-durum">'+(tamamMi ? '🏆 Durum: Tamamlandı ✓' : '⏳ Durum: Henüz tamamlanmadı')+'</div></div>';
}

function geriBarHtml(sinif, unite, asama){
  if(asama==='sinif' || asama==='hub') return '';
  return '<div class="pn-geri"><a href="'+dosyaAdi(unite,'hub')+'">← Üniteye Dön</a>'+
    '<a href="'+sinifSayfasi(sinif, unite)+'">← Sınıfa Dön</a></div>';
}

/* ======================================================================
   KONU ANLATIM SAYFASI DÜZENİ (yalnızca data-asama="ogren")
   ----------------------------------------------------------------------
   Konuyu Öğren sayfalarını ana portalın (din-kulturu-tum-siniflar.html)
   tasarım diliyle bütünleştirir. Sayfaların kendi içeriğine DOKUNMAZ:
     • Eski üst başlık (header), "Konuyu Öğren" bandı ve dikey menü
       (#oyun-gruplari) DOM'da kalır, yalnızca CSS ile gizlenir; menü
       düğmeleri yeni bölüm menüsü tarafından tıklanarak kullanılmaya devam
       eder (sayfanın kendi goster() mantığı aynen çalışır).
     • Ünite adı, konu listesi, okuma süresi gibi bilgiler sayfanın KENDİ
       verisinden (.ka-hero, .ka-icindekiler, Öğrenme Yolu) okunur.
     • Bölüm menüsünde yalnızca sayfada gerçekten bulunan bölümler yer alır.
   Tema: ana portalla aynı 'dkab_tema' anahtarı (light/dark) kullanılır.
====================================================================== */
var LS_TEMA = 'dkab_tema';
function temaOku(){
  var t = guvenliOku(LS_TEMA);
  if(t==='dark' || t==='light') return t;
  try{ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  catch(e){ return 'light'; }
}
function temaUygula(t){ document.documentElement.setAttribute('data-tema', t); }

/* ortak/ klasörünün adresi (konu-dinle.js'i bu betiğin yanından yüklemek için) */
var ORTAK_KLASOR = (document.currentScript && document.currentScript.src)
  ? document.currentScript.src.replace(/[^\/]*$/, '') : '../ortak/';

/* Sayfa çizilmeden önce (betik <body> başında, eşzamanlı çalışır) kök
   sınıfı ve temayı ayarla: eski başlık bir an bile görünüp kaybolmasın. */
(function(){
  var m = document.getElementById('portalNav');
  if(!m || m.dataset.asama!=='ogren') return;
  var kok = document.documentElement;
  kok.classList.add('ks-kok');
  kok.setAttribute('data-ks-sinif', m.dataset.sinif || '');
  temaUygula(temaOku());
})();

function emojiTemizle(t){
  return String(t||'')
    .replace(/^\s*\d+️?⃣\s*/,'')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu,'')
    .replace(/\s+/g,' ').trim();
}

var IKON_KEP = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm-6.82 9.68L5 13v3.5C5 18.43 8.13 20 12 20s7-1.57 7-3.5V13l-.18-.32L12 16.4l-6.82-3.72z"/></svg>';
var IKON_AY = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.3 2a9.9 9.9 0 0 0 0 19.8 10 10 0 0 0 8.7-5.1A8 8 0 0 1 12.3 2z"/></svg>';
var IKON_GUNES = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg>';

/* Sayfadaki gerçek ünite adı (.ka-hero başlığı); yoksa ortak ünite listesi. */
function sayfaUniteAdi(sinif, unite){
  var h = document.querySelector('.ka-hero .ka-hero-metin h2');
  var ad = h ? emojiTemizle(h.textContent) : '';
  return ad || uniteAdi(sinif, unite);
}

function ksUstHtml(sinif, unite){
  var tema = document.documentElement.getAttribute('data-tema')==='dark' ? 'dark' : 'light';
  var mod = modOku();
  var modDugme = '<button type="button" class="ks-pill" data-pn="mod" title="Öğrenci / Öğretmen modunu değiştir">'+
    (mod==='ogretmen' ? '👩‍🏫 Öğretmen' : '👨‍🎓 Öğrenci')+'</button>';
  if(mod==='ogretmen'){
    modDugme += '<button type="button" class="ks-pill ks-pill-ikincil" data-pn="kilit" title="Sıralı ilerleme kilidini değiştir">'+
      (kilitAcikMi() ? '🔓 Tüm üniteler açık' : '🔒 Sıralı ilerleme')+'</button>';
  }
  return '<div class="ks-ust" role="banner">'+
    '<div class="ks-ust-ic">'+
      '<a class="ks-marka" href="'+ANA_SAYFA+'" title="Ana sayfaya git">'+IKON_KEP+
        '<span class="ks-marka-ad">Ayşe Yazıcı</span><span class="ks-marka-ayrac" aria-hidden="true">·</span>'+
        '<span class="ks-marka-ders">Din Kültürü ve Ahlak Bilgisi</span></a>'+
      '<nav class="ks-ust-linkler" aria-label="Portal gezinmesi">'+
        '<a class="ks-ust-link" href="'+ANA_SAYFA+'">Ana Sayfa</a>'+
        '<a class="ks-ust-link" href="'+sinifSayfasi(sinif, unite)+'">'+sinif+'. Sınıf</a>'+
        '<a class="ks-ust-link" href="'+dosyaAdi(unite,'hub')+'">Üniteye Dön</a>'+
      '</nav>'+
      '<div class="ks-ust-arac">'+modDugme+
        '<button type="button" class="ks-tema" data-pn="tema" aria-pressed="'+(tema==='dark')+'" '+
          'aria-label="'+(tema==='dark' ? 'Açık temaya geç' : 'Koyu temaya geç')+'" title="'+(tema==='dark' ? 'Açık Tema' : 'Koyu Tema')+'">'+
          (tema==='dark' ? IKON_GUNES : IKON_AY)+'</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function ksKonumHtml(sinif, unite){
  var uAd = kacis(sayfaUniteAdi(sinif, unite));
  return '<div class="ks-konum">'+
    '<nav class="ks-kirinti" aria-label="Bulunduğun yer">'+
      '<ol>'+
        '<li><a href="'+ANA_SAYFA+'">Ana Sayfa</a></li>'+
        '<li><a href="'+sinifSayfasi(sinif)+'">'+sinif+'. Sınıf</a></li>'+
        '<li><a href="'+dosyaAdi(unite,'hub')+'">'+unite+'. Ünite</a></li>'+
        '<li><span aria-current="page">'+uAd+'</span></li>'+
      '</ol>'+
    '</nav>'+
    cubukHtml(sinif, unite, 'ogren')+
  '</div>';
}

/* Sayfa sonu: değerlendirme/etkinlik yönlendirmesi + önceki/sonraki ünite
   + dönüş bağlantıları. Etkinlik/oyun/değerlendirme/LGS hedefleri eski
   konuAksiyonlariHtml() ile birebir aynıdır. */
function ksAltHtml(sinif, unite){
  var onceki = unite>1 ? unite-1 : null;
  var sonraki = unite<UNITE_SAYISI[sinif] ? unite+1 : null;
  var lgs = sinif===8
    ? '<a class="ks-aksiyon" href="../sinav-merkezi/lgs-hazirlik/index.html?kart=konular&sekme=kazanim-testleri&unite=unite'+unite+'"><span aria-hidden="true">🎯</span> LGS ile Pekiştir</a>'
    : '';
  var uniteKarti = function(no, yon){
    return '<a class="ks-unite-kart ks-unite-kart--'+yon+'" href="'+dosyaAdi(no,'ogren')+'">'+
      '<span class="ks-uk-yon">'+(yon==='onceki' ? '← Önceki ünite' : 'Sonraki ünite →')+'</span>'+
      '<span class="ks-uk-ad">'+no+'. Ünite · '+kacis(uniteAdi(sinif,no))+'</span></a>';
  };
  return '<div class="ks-alt" role="region" aria-label="Konu sonu">'+
    '<div class="ks-alt-ic">'+
      '<div class="ks-alt-kart">'+
        '<p class="ks-on-etiket">Konuyu tamamladın mı?</p>'+
        '<p class="ks-alt-baslik">Öğrendiklerini pekiştir</p>'+
        '<p class="ks-alt-aciklama">Önce kendini değerlendir, ardından oyun ve etkinliklerle tekrar et.</p>'+
        '<div class="ks-aksiyonlar">'+
          '<a class="ks-aksiyon ks-aksiyon--birincil" href="'+dosyaAdi(unite,'olcme')+'"><span aria-hidden="true">📝</span> Öğrenmeni Değerlendir</a>'+
          '<a class="ks-aksiyon" href="'+dosyaAdi(unite,'oyun')+'#oyun-gruplari"><span aria-hidden="true">🎮</span> Dijital Oyunlar</a>'+
          '<a class="ks-aksiyon" href="'+oyunHedefi(sinif,unite,'etkinlik')+'"><span aria-hidden="true">🎨</span> Sınıf İçi Etkinlik</a>'+
          lgs+
        '</div>'+
      '</div>'+
      '<div class="ks-uniteler">'+
        (onceki ? uniteKarti(onceki,'onceki') : '<span class="ks-unite-bos"></span>')+
        (sonraki ? uniteKarti(sonraki,'sonraki')
          : '<a class="ks-unite-kart ks-unite-kart--sonraki" href="'+sinifSayfasi(sinif)+'"><span class="ks-uk-yon">Sınıfın son ünitesi</span><span class="ks-uk-ad">'+sinif+'. Sınıf ünitelerine dön →</span></a>')+
      '</div>'+
      '<div class="ks-donus">'+
        '<a class="ks-donus-link" href="'+sinifSayfasi(sinif, unite)+'">⌂ Ana Sayfaya Dön</a>'+
        '<a class="ks-donus-link" href="'+dosyaAdi(unite,'hub')+'">↩ Üniteye Dön</a>'+
        '<a class="ks-donus-link" href="#" data-ks="basa">↑ Sayfanın başına</a>'+
      '</div>'+
      '<p class="ks-imza">Ayşe Yazıcı · Din Kültürü ve Ahlak Bilgisi</p>'+
    '</div>'+
  '</div>';
}

/* ————— Bölüm menüsü: sayfada GERÇEKTEN bulunan bölümler ————— */
var KS_KATEGORILER = [
  {k:'kesfet',   ad:'Konuyu Keşfet',            ikon:'🧭'},
  {k:'anlatim',  ad:'Konu Anlatımı',            ikon:'📖'},
  {k:'ornek',    ad:'Örneklerle Öğren',         ikon:'💡'},
  {k:'gorsel',   ad:'Görseller ve Şemalar',     ikon:'🗺️'},
  {k:'etkinlik', ad:'Etkileşimli Etkinlikler',  ikon:'🧩'},
  {k:'deger',    ad:'Kendini Değerlendir',      ikon:'✅'}
];
var ks = { ogeler:[], aktif:null, aktifKat:null, kurulu:false };

function menuDugmesi(bolumId){
  var dugmeler = document.querySelectorAll('#oyun-gruplari button[onclick]');
  for(var i=0;i<dugmeler.length;i++){
    var oc = dugmeler[i].getAttribute('onclick') || '';
    if(oc.indexOf("goster('"+bolumId+"'")>=0) return dugmeler[i];
  }
  return null;
}
function idVer(el, onEk){
  if(el.id) return el.id;
  var n=1, aday=onEk;
  while(document.getElementById(aday)){ n++; aday=onEk+'-'+n; }
  el.id = aday; return aday;
}
function baslikBul(el, secici){
  var h = el.querySelector(secici || 'h2, h3, h4');
  return h ? emojiTemizle(h.textContent) : '';
}

function ksOgeleriTopla(){
  var ogeler = [];
  function ekle(kat, el, etiket, no){
    if(!el || !etiket) return;
    for(var i=0;i<ogeler.length;i++) if(ogeler[i].el===el) return;
    ogeler.push({kat:kat, el:el, id:idVer(el,'ks-bolum'), etiket:etiket, no:no||''});
  }
  /* 1) Eski menüdeki bölümler */
  var dugmeler = document.querySelectorAll('#oyun-gruplari button[onclick]');
  Array.prototype.forEach.call(dugmeler, function(b){
    var m = /goster\('([^']+)'/.exec(b.getAttribute('onclick')||'');
    if(!m) return;
    var sec = document.getElementById(m[1]);
    if(!sec) return;
    var id = m[1];
    var etiketEl = b.querySelector('b');
    var etiket = emojiTemizle(etiketEl ? etiketEl.textContent : b.textContent);
    if(/^ozet/.test(id)) return;                 /* konu anlatımı aşağıda, konu konu eklenir */
    if(id==='ayet-kavram') ekle('kesfet', sec, etiket || 'Ayetten Kavrama');
    else if(/^kilcik/.test(id)) ekle('gorsel', sec, 'Balık Kılçığı Şeması');
    else if(id==='slayt') ekle('gorsel', sec, 'Ünite Sunumu');
    else ekle('etkinlik', sec, etiket);
  });
  /* 2) Konu Anlatımı: konu özeti + sayfanın kendi konu listesi */
  var ozet = document.querySelector('main section[id^="ozet"]');
  var keMotor = ozet && ozet.querySelector('.ke-motor');
  if(keMotor) ekle('kesfet', keMotor, baslikBul(keMotor,'h3') || 'Keşif Modu');
  var konuLinkleri = document.querySelectorAll('.ka-hero .ka-icindekiler a.ka-ic-link[href^="#"]');
  if(konuLinkleri.length){
    Array.prototype.forEach.call(konuLinkleri, function(a, i){
      var hedef = document.getElementById(a.getAttribute('href').slice(1));
      var b = a.querySelector('b');
      var no = b ? b.textContent.trim() : String(i+1);
      var ad = emojiTemizle(a.textContent.replace(b ? b.textContent : '', ''));
      if(!hedef) return;
      /* Numarasız (★) içindekiler girdileri konu değil, ek çalışmadır */
      if(/^\d+$/.test(no)) ekle('anlatim', hedef, ad, no);
      else if(hedef.matches('.kd-bolum, .kt-bolum, .akd-kutu')) ekle('deger', hedef, ad);
      else ekle('etkinlik', hedef, ad);
    });
  } else if(ozet){
    ekle('anlatim', ozet, 'Konu Özeti');
  }
  if(ozet){
    /* 3) Etkileşimli etkinlikler ve değerlendirme blokları (yalnızca var olanlar) */
    Array.prototype.forEach.call(ozet.querySelectorAll('.yg-panel, .ys-panel'), function(p){
      ekle('etkinlik', p, baslikBul(p,'h3, h4').replace(/^Uygula\s*[—-]\s*/,'') || 'Uygulama');
    });
    var hk = ozet.querySelector('.hk-bolum');
    if(hk) ekle('etkinlik', hk, 'Hafıza Kartları');
    Array.prototype.forEach.call(ozet.querySelectorAll('.kt-bolum'), function(p, i){
      var ad = baslikBul(p,'h3, h4, .kt-baslik').replace(/^Konu Testleri\s*[—-]\s*/,'');
      ekle('deger', p, ad ? 'Test: '+ad : 'Konu Testi '+(i+1));
    });
    Array.prototype.forEach.call(ozet.querySelectorAll('.kd-bolum, .akd-kutu'), function(p){
      ekle('deger', p, 'Kendini Dene');
    });
  }
  /* Kategori sırasına göre diz, kategori içinde sayfa sırasını koru */
  var sira = {}; KS_KATEGORILER.forEach(function(k,i){ sira[k.k]=i; });
  ogeler.sort(function(a,b){
    if(a.kat!==b.kat) return sira[a.kat]-sira[b.kat];
    return (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
  });
  return ogeler;
}

function ksBolumNavHtml(){
  var katlar = KS_KATEGORILER.filter(function(k){
    return ks.ogeler.some(function(o){ return o.kat===k.k; });
  });
  return '<div class="ks-bn" role="navigation" aria-label="Konu içi bölümler">'+
    '<div class="ks-bn-ic">'+
      '<div class="ks-bn-katlar">'+katlar.map(function(k){
        var say = ks.ogeler.filter(function(o){ return o.kat===k.k; }).length;
        return '<button type="button" class="ks-bn-kat" data-ks-kat="'+k.k+'" aria-pressed="false">'+
          '<span aria-hidden="true">'+k.ikon+'</span><span class="ks-bn-kat-ad">'+k.ad+'</span>'+
          '<span class="ks-bn-say">'+say+'</span></button>';
      }).join('')+'</div>'+
      '<div class="ks-bn-satir">'+
        '<button type="button" class="ks-bn-ok" data-ks-yon="-1" aria-label="Önceki bölüm" title="Önceki bölüm">‹</button>'+
        '<div class="ks-bn-liste"></div>'+
        '<button type="button" class="ks-bn-ok" data-ks-yon="1" aria-label="Sonraki bölüm" title="Sonraki bölüm">›</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function ksListeCiz(kat){
  var liste = document.querySelector('.ks-bn-liste');
  if(!liste) return;
  ks.aktifKat = kat;
  liste.innerHTML = ks.ogeler.filter(function(o){ return o.kat===kat; }).map(function(o){
    return '<a class="ks-bn-oge" href="#'+o.id+'" data-ks-hedef="'+o.id+'" title="'+kacis(o.etiket)+'">'+
      (o.no ? '<b>'+kacis(o.no)+'</b>' : '')+'<span>'+kacis(o.etiket)+'</span></a>';
  }).join('');
  var katlar = document.querySelector('.ks-bn-katlar');
  document.querySelectorAll('.ks-bn-kat').forEach(function(b){
    var secili = b.dataset.ksKat===kat;
    b.classList.toggle('aktif', secili);
    b.setAttribute('aria-pressed', secili ? 'true' : 'false');
    if(secili && katlar){
      var sol = b.offsetLeft - katlar.offsetLeft, sag = sol + b.offsetWidth;
      if(sol < katlar.scrollLeft) katlar.scrollLeft = sol - 8;
      else if(sag > katlar.scrollLeft + katlar.clientWidth) katlar.scrollLeft = sag - katlar.clientWidth + 8;
    }
  });
}

function gorunurMu(el){
  if(!el || !el.isConnected) return false;
  return el.getClientRects().length > 0;
}
function sabitYukseklik(){
  var ust = document.querySelector('.ks-ust');
  var bn = document.querySelector('.ks-bn');
  var h = 0;
  if(ust && getComputedStyle(ust).position==='sticky') h += ust.offsetHeight;
  if(bn) h += bn.offsetHeight;
  return h;
}
function olcuGuncelle(){
  var ust = document.querySelector('.ks-ust');
  var kok = document.documentElement.style;
  var ustH = (ust && getComputedStyle(ust).position==='sticky') ? ust.offsetHeight : 0;
  kok.setProperty('--ks-ust-h', ustH+'px');
  kok.setProperty('--ks-sabit-h', sabitYukseklik()+'px');
}

function ksAktifIsaretle(o){
  if(!o) return;
  if(ks.aktifKat!==o.kat) ksListeCiz(o.kat);
  ks.aktif = o;
  var liste = document.querySelector('.ks-bn-liste');
  if(!liste) return;
  var aktifA = null;
  liste.querySelectorAll('.ks-bn-oge').forEach(function(a){
    var bu = a.dataset.ksHedef===o.id;
    a.classList.toggle('aktif', bu);
    if(bu){ a.setAttribute('aria-current','location'); aktifA = a; } else a.removeAttribute('aria-current');
  });
  if(aktifA){
    var sol = aktifA.offsetLeft - liste.offsetLeft, sag = sol + aktifA.offsetWidth;
    if(sol < liste.scrollLeft) liste.scrollLeft = sol - 8;
    else if(sag > liste.scrollLeft + liste.clientWidth) liste.scrollLeft = sag - liste.clientWidth + 8;
  }
  var idx = ks.ogeler.indexOf(o);
  var oklar = document.querySelectorAll('.ks-bn-ok');
  if(oklar.length===2){
    oklar[0].disabled = idx<=0;
    oklar[1].disabled = idx>=ks.ogeler.length-1;
  }
}

/* Görünür bölümler arasında, sabit menünün hemen altına gelmiş son bölüm aktiftir. */
function ksKaydirmaIzle(){
  if(ks.kilitliKaydirma) return;
  var esik = sabitYukseklik() + Math.min(160, Math.round(window.innerHeight*0.2));
  var gorunur = ks.ogeler.filter(function(o){ return gorunurMu(o.el); });
  if(!gorunur.length) return;
  gorunur.sort(function(a,b){
    return (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
  });
  var aktif = gorunur[0];
  gorunur.forEach(function(o){ if(o.el.getBoundingClientRect().top <= esik) aktif = o; });
  if(aktif!==ks.aktif) ksAktifIsaretle(aktif);
}

function hareketAzMi(){
  try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; }
}
/* Bir hedefe git: gizli bir bölümdeyse önce sayfanın kendi menü düğmesiyle
   o bölümü aç (goster()), sonra sabit menünün altına hizalayarak kaydır. */
function ksHedefeGit(el, adresGuncelle){
  if(!el) return;
  var bolum = el.closest('main section');
  if(bolum && !bolum.classList.contains('aktif')){
    var dugme = menuDugmesi(bolum.id);
    if(dugme) dugme.click();
    else { bolum.classList.add('aktif'); }
  }
  var o = null;
  ks.ogeler.forEach(function(x){ if(x.el===el) o = x; });
  if(o) ksAktifIsaretle(o);
  ks.kilitliKaydirma = true;
  clearTimeout(ks.kilitZaman);
  function hedefY(){ return Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - sabitYukseklik() - 12); }
  /* Kaydırma bitince (görseller yüklenip düzen kaydıysa) hedefe tam hizala;
     tıklanan bölüm aktif kalsın. */
  function bitir(){
    window.removeEventListener('scrollend', bitir);
    clearTimeout(ks.kilitZaman);
    var y = hedefY();
    if(Math.abs(window.pageYOffset - y) > 4) window.scrollTo({top:y, behavior:'auto'});
    setTimeout(function(){ ks.kilitliKaydirma = false; if(o) ksAktifIsaretle(o); }, 80);
  }
  requestAnimationFrame(function(){
    var y = hedefY();
    if(Math.abs(window.pageYOffset - y) < 2){ bitir(); return; }
    window.addEventListener('scrollend', bitir);
    window.scrollTo({top:y, behavior: hareketAzMi() ? 'auto' : 'smooth'});
    ks.kilitZaman = setTimeout(bitir, hareketAzMi() ? 80 : 1400);
  });
  if(adresGuncelle && el.id){ try{ history.replaceState(null, '', '#'+el.id); }catch(e){} }
}

function ksHeroGelistir(sinif, unite){
  var metin = document.querySelector('.ka-hero .ka-hero-metin');
  if(!metin || metin.querySelector('.ks-hero-meta')) return;
  var h2 = metin.querySelector('h2');
  if(h2){ h2.setAttribute('role','heading'); h2.setAttribute('aria-level','1'); }
  var parcalar = [];
  var konuSay = metin.querySelectorAll('.ka-ic-link').length;
  if(konuSay) parcalar.push('<span class="ks-meta-cip">📚 '+konuSay+' konu</span>');
  /* Okuma süresi: sayfanın kendi "Öğrenme Yolu" katmanının hesapladığı değer */
  var meta = document.querySelector('.ogr-ozet-meta');
  if(meta){
    var sure = Array.prototype.filter.call(meta.querySelectorAll('span'), function(s){ return /dk/.test(s.textContent); })[0];
    if(sure) parcalar.push('<span class="ks-meta-cip">'+kacis(sure.textContent.trim())+'</span>');
  }
  /* Öğretmenin ünite sayfasında seçtiği ders süresi (varsa) */
  var ders = sureOku(sinif, unite);
  if(ders) parcalar.push('<span class="ks-meta-cip">🕒 Ders süresi: '+kacis(ders)+' dk</span>');
  var ilk = ks.ogeler.filter(function(o){ return o.kat==='anlatim'; })[0] || ks.ogeler[0];
  var kutu = document.createElement('div');
  kutu.className = 'ks-hero-meta';
  kutu.innerHTML = parcalar.join('') +
    (ilk ? '<a class="ks-hero-basla" href="#'+ilk.id+'" data-ks-hedef="'+ilk.id+'">Konuya Başla <span aria-hidden="true">→</span></a>' : '');
  var p = metin.querySelector(':scope > p');
  if(p && p.nextSibling) metin.insertBefore(kutu, p.nextSibling);
  else metin.appendChild(kutu);
}

function ksKur(sinif, unite){
  if(ks.kurulu) return;
  ks.kurulu = true;
  /* Konuyu Dinle: her konuya sesli okuma alanı (ortak/konu-dinle.js) */
  if(!document.querySelector('script[src*="konu-dinle.js"]')){
    var dinle = document.createElement('script');
    dinle.src = ORTAK_KLASOR + 'konu-dinle.js';
    document.body.appendChild(dinle);
  }
  ks.ogeler = ksOgeleriTopla();
  ksHeroGelistir(sinif, unite);

  var main = document.querySelector('main');
  if(main && ks.ogeler.length){
    var kap = document.createElement('div');
    kap.innerHTML = ksBolumNavHtml();
    main.parentNode.insertBefore(kap.firstChild, main);
    ksListeCiz(ks.ogeler[0].kat);
  }

  document.addEventListener('click', function(e){
    if(e.defaultPrevented) return;
    var kat = e.target.closest('.ks-bn-kat');
    if(kat){
      var ilk = ks.ogeler.filter(function(o){ return o.kat===kat.dataset.ksKat; })[0];
      if(ilk) ksHedefeGit(ilk.el, true);
      return;
    }
    var ok = e.target.closest('.ks-bn-ok');
    if(ok){
      var i = ks.ogeler.indexOf(ks.aktif) + parseInt(ok.dataset.ksYon,10);
      if(i>=0 && i<ks.ogeler.length) ksHedefeGit(ks.ogeler[i].el, true);
      return;
    }
    if(e.target.closest('[data-ks="basa"]')){
      e.preventDefault();
      window.scrollTo({top:0, behavior: hareketAzMi() ? 'auto' : 'smooth'});
      return;
    }
    /* Sayfa içi bütün #bağlantılar: hedef gizli bir bölümdeyse önce aç */
    var a = e.target.closest('a[href^="#"]');
    if(!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var hedefId = decodeURIComponent(a.getAttribute('href').slice(1));
    var hedef = hedefId && document.getElementById(hedefId);
    if(!hedef || !hedef.closest('main')) return;
    e.preventDefault();
    ksHedefeGit(hedef, true);
  });

  var bekliyor = false;
  window.addEventListener('scroll', function(){
    if(bekliyor) return; bekliyor = true;
    requestAnimationFrame(function(){ bekliyor = false; ksKaydirmaIzle(); });
  }, {passive:true});
  window.addEventListener('resize', function(){ olcuGuncelle(); ksKaydirmaIzle(); });
  /* Eski menü düğmeleri başka bir yoldan tıklanırsa (sayfanın kendi
     bağlantıları) menü durumunu güncel tut */
  document.addEventListener('click', function(e){
    if(e.target.closest('#oyun-gruplari button')) setTimeout(ksKaydirmaIzle, 50);
  });

  olcuGuncelle();
  ksKaydirmaIzle();

  /* Adresle gelinen bölüm (#slayt, #ozet8, #ka-konu-2, #ktz1 …): gizli bir
     bölümdeyse aç ve oraya git. Ana portaldaki derin bağlantılar bunu kullanır. */
  function adrestekiHedef(){
    var id = '';
    try{ id = decodeURIComponent((location.hash||'').slice(1)); }catch(e){}
    var el = id && document.getElementById(id);
    if(el && el.closest('main')) ksHedefeGit(el, false);
  }
  adrestekiHedef();
  window.addEventListener('hashchange', adrestekiHedef);
  /* Sayfa ilk açılırken görseller ve sayfanın kendi betikleri düzeni bir
     süre değiştirebilir; öğrenci kendisi kaydırana kadar adresteki bölümü
     birkaç kez yeniden hizala. */
  var kullaniciKaydirdi = false;
  ['wheel','touchstart','keydown','mousedown'].forEach(function(t){
    window.addEventListener(t, function(){ kullaniciKaydirdi = true; }, {passive:true, once:true});
  });
  function yenidenHizala(){
    if(kullaniciKaydirdi || !location.hash) return;
    var id = ''; try{ id = decodeURIComponent(location.hash.slice(1)); }catch(e){}
    var el = id && document.getElementById(id);
    if(!el || !el.closest('main') || !gorunurMu(el)) return;
    var y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - sabitYukseklik() - 12);
    if(Math.abs(window.pageYOffset - y) > 4) window.scrollTo({top:y, behavior:'auto'});
  }
  window.addEventListener('load', function(){
    olcuGuncelle();
    if(location.hash){ adrestekiHedef(); [600, 1500, 3000].forEach(function(t){ setTimeout(yenidenHizala, t); }); }
  });
}

function temaDegistir(){
  var yeni = document.documentElement.getAttribute('data-tema')==='dark' ? 'light' : 'dark';
  temaUygula(yeni);
  guvenliYaz(LS_TEMA, yeni);
}

/* ————— olay yönetimi ————— */
function tiklamaYonet(e){
  var t = e.target.closest('[data-pn]');
  if(!t) return;
  var ne = t.dataset.pn;
  if(ne==='mod'){ modYaz(modOku()==='ogretmen' ? 'ogrenci' : 'ogretmen'); yenidenCiz(); return; }
  if(ne==='kilit'){ kilitDegistir(); yenidenCiz(); return; }
  if(ne==='tema'){ temaDegistir(); yenidenCiz(); return; }
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

  var ogrenDuzeni = asama==='ogren' && document.documentElement.classList.contains('ks-kok');
  mount.innerHTML = ogrenDuzeni
    ? ksUstHtml(sinif,unite) + ksKonumHtml(sinif,unite)
    : modSatiriHtml() + kirintiHtml(sinif,unite,asama) + cubukHtml(sinif,unite,asama) + geriBarHtml(sinif,unite,asama);
  mount.classList.add('pn-hazir');

  var altBar = ogrenDuzeni ? ksAltHtml(sinif,unite) : altBarHtml(sinif,unite,asama);
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
  /* Öğrenme Döngüsü (2026-10-31): konu sonu öz değerlendirme + "Eksiklerim
     ve Tekrar Planım" kutusu. Yalnızca konu ve ölçme sayfalarında. */
  if((asama==='ogren' || asama==='olcme') && !document.querySelector('script[src*="ogrenme-dongusu.js"]')){
    var odCss = document.createElement('link');
    odCss.rel = 'stylesheet'; odCss.href = ORTAK_KLASOR + 'ogrenme-dongusu.css';
    document.head.appendChild(odCss);
    var odJs = document.createElement('script');
    odJs.src = ORTAK_KLASOR + 'ogrenme-dongusu.js';
    document.body.appendChild(odJs);
  }

  document.addEventListener('click', tiklamaYonet);
  /* Konu anlatım sayfası: bölüm menüsü, ünite başlığı ve kaydırma takibi.
     Sayfanın kendi DOMContentLoaded betikleri (Öğrenme Yolu vb.) önce
     çalışsın diye bir tur sonra kurulur. */
  if(asama==='ogren' && document.documentElement.classList.contains('ks-kok')){
    setTimeout(function(){ ksKur(sinif, unite); }, 0);
  }
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', olustur);
else olustur();
})();
