/* ======================================================================
   DERS AKIŞI (2026-11-07) — Konuyu Öğren sayfalarında video altındaki
   konu anlatımını 6 aşamalı, adım adım bir öğrenme akışına dönüştürür.

     📘 Konuyu Öğren → 🧩 Kavramları Tanı → 🗺️ Görsellerle Anla →
     📖 Ayet ve Hadislerle Pekiştir → 🎮 Etkinlik Yap → ✍️ Öğrendiklerini Kontrol Et

   KURALLAR
   • Hiçbir metin silinmez, kısaltılmaz, yeniden yazılmaz.
   • Her parça KENDİ KONUSUNUN İÇİNDE kalır; yalnızca konu içindeki sırası
     aşamalara göre düzenlenir (aynı aşamadaki parçaların kendi sırası korunur).
   • Bir konuda bulunmayan aşama için boş bölüm oluşturulmaz.
   • Başlıksız anlatım parçaları (paragraf, liste, tablo, metin içindeki
     alıntılar) yerinden oynamaz; hepsi "Konuyu Öğren" aşamasında kalır.
   • Eklenen yazılar (aşama başlıkları, adım göstergesi) CSS ile çizilir;
     sayfa metnine yazı eklenmez → sesli dinleme ve okuma süreleri etkilenmez.
   Önek: dak-  (mevcut sınıflarla çakışmaz)
   Yüklenme: ortak/portal-nav.js (4–8. sınıf "ogren" sayfaları)
====================================================================== */
(function(){
'use strict';
if(window.__dersAkisi) return;
window.__dersAkisi = true;

/* Önce örnek sayfada; onaydan sonra HEPSI = true yapılarak tüm sayfalara açılır. */
var HEPSI = true;   /* 2026-11-07 (studeo): tüm 4–8 "ogren" sayfalarına açıldı */
var ORNEK = ['din-kulturu-4sinif-1unite/unite2-konuyu-ogren.html'];
var yol = decodeURIComponent(location.pathname);
if(!HEPSI && !ORNEK.some(function(s){ return yol.slice(-s.length) === s; })) return;

var ASAMALAR = [
  { k:'ogren',   ikon:'📘', ad:'Konuyu Öğren',                  ac:'Konu anlatımı, temel bilgiler ve günlük hayattan örnekler' },
  { k:'kavram',  ikon:'🧩', ad:'Kavramları Tanı',               ac:'Önemli kavramlar ve açıklamaları' },
  { k:'gorsel',  ikon:'🗺️', ad:'Görsellerle Anla',              ac:'Kavram haritaları, şemalar ve bilgi kartları' },
  { k:'ayet',    ikon:'📖', ad:'Ayet ve Hadislerle Pekiştir',   ac:'Konuyla ilgili ayetler, hadisler ve açıklamaları' },
  { k:'etkinlik',ikon:'🎮', ad:'Etkinlik Yap',                  ac:'Düşün, uygula, ailenle yap' },
  { k:'kontrol', ikon:'✍️', ad:'Öğrendiklerini Kontrol Et',     ac:'Kendini değerlendir ve konu soruları' }
];
/* Parça türü → aşama. Sıra önemlidir: ilk eşleşen kural geçerlidir. */
var KURAL = [
  ['kontrol',  /(^|\s)(od-konu-kart|zb-degerlendir|kt-kutu|at-test|kd-bolum|mini-kontrol)(\s|$)|(^|\s)mk-/],
  ['etkinlik', /(^|\s)(ka-dusun-cevapla|ka-dusun|zb-dusun|zb-hayatta|zb-aile|zb-derin|zb-ikilem|ka-oyun|ed-blok|hk-bolum|cm-bolum|ah-bolum|yg-panel|ys-panel|bk-panel|ke-sar|zb-etkinlik)(\s|$)/],
  ['ayet',     /(^|\s)(zb-ayet|zb-hadis|ak-hadis|ka-ayet|ka-hadis)(\s|$)/],
  ['gorsel',   /(^|\s)(ka-kavram-haritasi|kavram-harita-panel|ka-surec-semasi|ka-karsilastirma-semasi|ka-zaman-semasi|ka-daire-semasi|ka-vs-semasi|ka-akis-semasi|ka-ozet-panosu|as-harita|ka-aklinda-kalsin|zb-unutma)(\s|$)/],
  ['kavram',   /(^|\s)(ak-bolum|kavram-kart-izgara|zb-kavram|ka-kavram|ka-kavramlar)(\s|$)/]
];
function asamaBul(el){
  var c = String(el.className || '');
  for(var i = 0; i < KURAL.length; i++) if(KURAL[i][1].test(c)) return KURAL[i][0];
  /* "Aklında Kalsın" başlıklı genel kutu → bilgi kartı */
  if(/kutu-panel/.test(c) && /Aklında Kalsın/.test((el.querySelector('h3,h4') || {}).textContent || '')) return 'gorsel';
  return 'ogren';
}
function kac(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function yazi(cls, t){ return '<span class="' + cls + '" data-t="' + kac(t) + '" aria-hidden="true"></span>'; }
function hareketAz(){ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
/* Ekranın üstüne yapışık duran çubukların (site başlığı, konu menüsü …) toplam yüksekliği */
function ustBosluk(){
  var y = 0, x = innerWidth / 2;
  for(var tur = 0; tur < 4; tur++){
    var el = document.elementFromPoint(x, y + 2), bulundu = 0;
    while(el && el !== document.body && el !== document.documentElement){
      var st = getComputedStyle(el);
      if(st.position === 'sticky' || st.position === 'fixed'){
        var r = el.getBoundingClientRect();
        if(r.top <= y + 2 && r.bottom > y && r.height < innerHeight * 0.5) bulundu = Math.max(bulundu, r.bottom);
      }
      el = el.parentElement;
    }
    if(!bulundu || bulundu <= y) break;
    y = bulundu;
  }
  return y;
}

/* ---------------- konuları bul (sayfanın kendi "İçindekiler" bağlantılarından) ---------------- */
function konular(){
  var o = [];
  Array.prototype.forEach.call(document.querySelectorAll('.ka-hero .ka-icindekiler a.ka-ic-link[href^="#"]'), function(a){
    var b = a.querySelector('b'); var no = b ? b.textContent.trim() : '';
    if(!/^\d+$/.test(no)) return;                                  /* ★ ek çalışmalar konu değildir */
    var k = document.getElementById(a.getAttribute('href').slice(1));
    if(!k || !k.closest('main')) return;
    var govde = k.closest('.ogr-modul-govde');
    if(!govde) return;                                             /* Öğrenme Yolu modülü olmayan sayfa: dokunma */
    o.push({ no:no, kart:k, govde:govde, ad:(a.textContent || '').replace(no, '').trim() });
  });
  return o;
}

/* Konu modülündeki parçalar, sayfadaki sırasıyla.
   Konu kartının (kutu-panel) ve öğretim kutusunun (ka-ogretim) içindekiler tek tek ele alınır. */
function parcalar(K){
  var bas = [], liste = [], son = [];
  Array.prototype.forEach.call(K.govde.children, function(c){
    if(/(^|\s)(ksx-|dak-)/.test(String(c.className))){ son.push(c); return; }
    if(c.contains(K.kart) && c !== K.kart){
      K.panel = c;
      var basta = true;
      Array.prototype.forEach.call(c.children, function(x){
        /* konu afişi ve konu başlığı en üstte kalır */
        if(basta && (x === K.kart || x.contains(K.kart) || /^H[2-4]$/.test(x.tagName))){ bas.push(x); return; }
        basta = false; liste.push(x);
      });
    } else if(/(^|\s)ka-ogretim(\s|$)/.test(String(c.className))){
      K.ogretim = K.ogretim || []; K.ogretim.push(c);
      Array.prototype.forEach.call(c.children, function(x){ liste.push(x); });
    } else liste.push(c);
  });
  return { bas:bas, liste:liste, son:son };
}

/* ---------------- düzenle ---------------- */
var TUM = [];   /* {konu, asamalar:[{k, el}]} */
function duzenle(K){
  var p = parcalar(K);
  if(!K.panel || p.liste.length < 2) return null;
  var gruplar = {};
  p.liste.forEach(function(el){ var a = asamaBul(el); (gruplar[a] = gruplar[a] || []).push(el); });
  var var_ = ASAMALAR.filter(function(a){ return gruplar[a.k]; });
  if(var_.length < 2) return null;

  /* adım göstergesi (konu başlığının hemen altında) */
  var nav = document.createElement('div');   /* <nav> değil: sayfaların genel nav stilleri uygulanmasın */
  nav.className = 'dak-adimlar';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Konu ' + K.no + ' öğrenme adımları');
  nav.innerHTML = '<ol>' + var_.map(function(a, i){
    return '<li><button type="button" class="dak-adim dak-' + a.k + '" data-dak-git="' + a.k + '" aria-label="' + kac('Adım ' + (i+1) + ': ' + a.ad) + '">' +
      yazi('dak-adim-no', String(i+1)) + yazi('dak-adim-ad', a.ikon + ' ' + a.ad) + '</button></li>';
  }).join('') + '</ol>';

  /* aşama bölümleri: konu kartının dışında, konu modülünün içinde, art arda */
  var kap = document.createElement('div');
  kap.className = 'dak-akis';
  var bolumler = [];
  var_.forEach(function(a, i){
    var s = document.createElement('div');
    s.className = 'dak-asama dak-' + a.k;
    s.setAttribute('role', 'region');
    s.setAttribute('aria-label', 'Adım ' + (i+1) + ' / ' + var_.length + ': ' + a.ad);
    s.setAttribute('data-dak', a.k);
    s.innerHTML = '<div class="dak-bas" aria-hidden="true">' + yazi('dak-bas-no', 'ADIM ' + (i+1) + ' / ' + var_.length) +
      yazi('dak-bas-ad', a.ikon + ' ' + a.ad) + yazi('dak-bas-ac', a.ac) + '</div>';
    var ic = document.createElement('div'); ic.className = 'dak-ic';
    gruplar[a.k].forEach(function(el){ ic.appendChild(el); });   /* aynı aşamadaki parçalar kendi sırasıyla */
    s.appendChild(ic);
    kap.appendChild(s);
    bolumler.push({ k:a.k, el:s });
  });

  /* yerleştir: konu kartı yalnızca afiş + başlık + adım göstergesi olarak kalır */
  K.panel.classList.add('dak-konu-kart');
  K.panel.appendChild(nav);
  K.panel.parentNode.insertBefore(kap, K.panel.nextSibling);
  /* boşalan öğretim kutusu gizlenir (DOM'da kalır) */
  (K.ogretim || []).forEach(function(o){ if(!o.children.length) o.classList.add('dak-bos'); });
  /* sayfanın gezinme satırları (ksx-) modülün sonunda kalsın */
  p.son.forEach(function(x){ if(!/(^|\s)dak-/.test(String(x.className))) K.govde.appendChild(x); });

  var kayit = { konu:K, nav:nav, bolumler:bolumler, aktif:-1 };
  TUM.push(kayit);
  return kayit;
}

/* ---------------- sayfa üstü: ders akışı şeridi (videonun hemen altında) ---------------- */
function serit(){
  var varOlan = {};
  TUM.forEach(function(t){ t.bolumler.forEach(function(b){ varOlan[b.k] = true; }); });
  var a = ASAMALAR.filter(function(x){ return varOlan[x.k]; });
  var d = document.createElement('div');
  d.className = 'dak-serit';
  d.setAttribute('role', 'navigation');
  d.setAttribute('aria-label', 'Bu dersin öğrenme akışı');
  d.innerHTML = '<div class="dak-serit-ic">' + yazi('dak-serit-bas', 'Bu derste nasıl ilerleyeceksin?') +
    yazi('dak-serit-alt', 'Videoyu izledikten sonra her konuyu bu adımlarla çalış. Konu başındaki adım göstergesi nerede olduğunu gösterir.') +
    '<ol>' + a.map(function(x, i){
      return '<li><button type="button" class="dak-serit-adim dak-' + x.k + '" data-dak-ilk="' + x.k + '" aria-label="' + kac((i+1) + '. ' + x.ad + ' — ilk konuda bu adıma git') + '">' +
        yazi('dak-adim-no', String(i+1)) + yazi('dak-serit-ikon', x.ikon) + yazi('dak-serit-ad', x.ad) + '</button></li>';
    }).join('') + '</ol>' +
    '<button type="button" class="dak-basla" data-dak-ilk="ogren" aria-label="Derse başla: Konu 1">' + yazi('', '▶ Derse başla') + '</button></div>';
  var video = document.querySelector('details.anlatim-video');
  var hedef = video || document.querySelector('.ka-hero') || document.querySelector('main');
  if(video) video.parentNode.insertBefore(d, video.nextSibling);
  else hedef.parentNode.insertBefore(d, hedef);
}

/* ---------------- sayfa başı sırası (2026-11-07, studeo) ----------------
   A. Konuya Giriş (ünite afişi) → C. Video ve Dinleme (tek bölüm) → ders akışı şeridi.
   Yalnızca sayfa başındaki üç öğenin YERİ değişir; video, oynatıcı ve sesli
   dinleme paneli aynı öğelerdir (kopya yok, metin eklenmez — başlık CSS ile). */
function medyaDuzenle(){
  var hero = document.querySelector('body > section.ka-hero');
  var video = document.querySelector('body > details.anlatim-video');
  var s = document.querySelector('body > .dak-serit');
  if(!hero) return;
  var m = null;
  if(video){
    m = document.createElement('div');
    m.className = 'dak-medya';
    m.setAttribute('role', 'region');
    m.setAttribute('aria-label', 'Video ve dinleme');
    m.innerHTML = '<div class="dak-medya-bas" aria-hidden="true">' + yazi('dak-medya-ad', '🎬 Video ve Dinleme') +
      yazi('dak-medya-ac', 'Önce konu videosunu izle; istersen konuyu baştan sona ya da yalnızca ezber bölümünü dinle.') + '</div>';
    hero.parentNode.insertBefore(m, hero.nextSibling);
    m.appendChild(video);
  }
  var son = m || hero;
  if(s) son.parentNode.insertBefore(s, son.nextSibling);
  if(!m) return;
  /* Sesli dinleme paneli (ortak/konu-dinle.js) afişin hemen altına sonradan eklenir */
  var deneme = 0;
  (function tasi(){
    var p = document.querySelector('body > section.sok-panel');
    if(p){ m.appendChild(p); return; }
    if(m.querySelector('section.sok-panel') || ++deneme > 40) return;
    setTimeout(tasi, 250);
  })();
}

/* ---------------- Öğrenme Laboratuvarı bağlantıları (2026-11-08) ----------------
   Laboratuvarı olan konunun "Etkinlik Yap" adımına (yoksa konunun son adımına)
   tek bir giriş kartı eklenir. Sayfa metnine dokunulmaz. */
var LAB_BAGLANTI = [
  { sinif:'5', unite:'1', konu:/evrendeki\s+m[üu]kemmel\s+d[üu]zen/i, id:'s5-u1-arilar',
    baslik:'Öğrenme Laboratuvarı: Arılar Yok Olursa?', ac:'Problemle karşılaş, araştır, farklı görüşleri incele ve kendi çözümünü geliştir. 7 adım · 3 seviye · Fen, Matematik, Türkçe' }
];
function labKartlari(){
  var m = document.getElementById('portalNav'); if(!m) return;
  LAB_BAGLANTI.forEach(function(b){
    if(m.dataset.sinif !== b.sinif || (m.dataset.unite || '1') !== b.unite) return;
    TUM.forEach(function(t){
      if(!b.konu.test(t.konu.ad || '')) return;
      var hedef = t.bolumler.filter(function(x){ return x.k === 'etkinlik'; })[0] || t.bolumler[t.bolumler.length - 1];
      var ic = hedef && hedef.el.querySelector('.dak-ic'); if(!ic || ic.querySelector('.dak-lab')) return;
      var a = document.createElement('a');
      a.className = 'dak-lab';
      a.href = '../ogrenme-laboratuvari/index.html?id=' + encodeURIComponent(b.id);
      a.innerHTML = '<span class="dak-lab-ikon" aria-hidden="true">🧪</span><span class="dak-lab-metin"><b>' + kac(b.baslik) + '</b><span>' + kac(b.ac) + '</span></span><span class="dak-lab-ok" aria-hidden="true">→</span>';
      ic.appendChild(a);
    });
  });
}

/* ---------------- fotoğraf destekli konu sahneleri (2026-11-08) ----------------
   Ortak bileşen ortak/konu-sahne.js + .css + -veri.js. Bileşen, sayfa için
   fotoğraf eşlemesi yoksa hiçbir şey yapmaz. Sıra: veri → bileşen. */
var DAK_KLASOR = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');
function sahneYukle(){
  if(!DAK_KLASOR || document.querySelector('script[src*="konu-sahne.js"]')) return;
  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = DAK_KLASOR + 'konu-sahne.css';
  document.head.appendChild(css);
  /* 2026-11-09: AKIS_SAYFALAR'daki ünitelerde fotoğraflı dikey akış (ortak/konu-akis.*)
     sahne penceresinin yerini alır; diğerlerinde sahne penceresi sürer. */
  var akis = AKIS_SAYFALAR.indexOf(dakSayfaAnahtari()) >= 0;
  if(akis){ css.href = DAK_KLASOR + 'konu-akis.css'; }
  var veri = document.createElement('script');
  veri.src = DAK_KLASOR + 'konu-sahne-veri.js';
  veri.onload = function(){
    var js = document.createElement('script');
    js.src = DAK_KLASOR + (akis ? 'konu-akis.js' : 'konu-sahne.js');
    document.body.appendChild(js);
  };
  document.body.appendChild(veri);
}
var AKIS_SAYFALAR = ['s5-u1'];
function dakSayfaAnahtari(){ var m = document.getElementById('portalNav'); return m ? 's' + m.dataset.sinif + '-u' + (m.dataset.unite || '1') : ''; }

/* ---------------- gezinme ve etkin adım ---------------- */
function bolumAc(el){
  /* gizli sekmedeyse sayfanın kendi menü düğmesiyle aç */
  var s = el.closest('main section');
  if(s && !s.classList.contains('aktif') && !el.getClientRects().length){
    var d = document.querySelectorAll('#oyun-gruplari button[onclick]');
    for(var i = 0; i < d.length; i++) if((d[i].getAttribute('onclick') || '').indexOf("goster('" + s.id + "'") >= 0){ d[i].click(); break; }
  }
}
var jeton = 0;
function git(el){
  bolumAc(el);
  var bu = ++jeton;
  function hedef(){ return Math.max(0, el.getBoundingClientRect().top + pageYOffset - ustBosluk() - 16); }
  function hizala(){ if(bu !== jeton) return; var y = hedef(); if(Math.abs(pageYOffset - y) > 4) scrollTo({ top:y, behavior:'auto' }); }
  requestAnimationFrame(function(){
    var bitti = false;
    function bitir(){
      if(bitti) return; bitti = true; removeEventListener('scrollend', bitir);
      hizala(); setTimeout(hizala, 250);            /* görseller yüklenip düzen kaydıysa yeniden hizala */
    }
    if(hareketAz()){ scrollTo({ top:hedef(), behavior:'auto' }); setTimeout(bitir, 60); return; }
    addEventListener('scrollend', bitir);
    scrollTo({ top:hedef(), behavior:'smooth' });
    setTimeout(bitir, 1500);
  });
}
var kilit = null;
function kilitle(t, i){
  clearTimeout(kilit && kilit.z);
  kilit = { t:t, i:i, z:setTimeout(function(){ kilit = null; }, 2200) };
  isaretle(t, i);
}
function izle(){
  var esik = ustBosluk() + Math.min(180, innerHeight * 0.22);   /* üst çubuğun hemen altı */
  TUM.forEach(function(t){
    if(kilit && kilit.t === t) return;
    var ai = -1;
    t.bolumler.forEach(function(b, i){ if(b.el.getClientRects().length && b.el.getBoundingClientRect().top <= esik) ai = i; });
    isaretle(t, ai);
  });
}
function isaretle(t, ai){
    if(ai === t.aktif) return;
    t.aktif = ai;
    Array.prototype.forEach.call(t.nav.querySelectorAll('.dak-adim'), function(btn, i){
      btn.classList.toggle('dak-simdi', i === ai);
      btn.classList.toggle('dak-gecti', ai > i);
      if(i === ai) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current');
    });
    t.bolumler.forEach(function(b, i){ b.el.classList.toggle('dak-simdi', i === ai); });
}

function kur(){
  var K = konular();
  K.forEach(function(k){ try{ duzenle(k); }catch(e){ if(window.console) console.warn('Ders akışı:', e); } });
  if(!TUM.length) return;
  document.documentElement.classList.add('dak-kok');
  serit();
  try{ medyaDuzenle(); }catch(e){ if(window.console) console.warn('Ders akışı (medya):', e); }
  try{ labKartlari(); }catch(e){ if(window.console) console.warn('Ders akışı (laboratuvar):', e); }
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-dak-git]');
    if(b){
      var t = TUM.filter(function(x){ return x.nav.contains(b); })[0];
      var hedef = t && t.bolumler.filter(function(x){ return x.k === b.getAttribute('data-dak-git'); })[0];
      if(hedef){ e.preventDefault(); kilitle(t, t.bolumler.indexOf(hedef)); git(hedef.el); }
      return;
    }
    var f = e.target.closest('[data-dak-ilk]');
    if(f){
      var k = f.getAttribute('data-dak-ilk');
      for(var i = 0; i < TUM.length; i++){
        var h = TUM[i].bolumler.filter(function(x){ return x.k === k; })[0];
        if(h){ e.preventDefault(); git(k === 'ogren' && i === 0 ? (TUM[0].konu.panel || TUM[0].konu.kart) : h.el); return; }
      }
    }
  });
  var bekle = false;
  addEventListener('scroll', function(){ if(bekle) return; bekle = true; requestAnimationFrame(function(){ bekle = false; izle(); }); }, { passive:true });
  addEventListener('resize', izle);
  document.addEventListener('click', function(e){ if(e.target.closest('#oyun-gruplari button, .ksx-toc, .ksx-sn')) setTimeout(izle, 150); });
  izle();
  window.DERS_AKISI = {
    durum:function(){ return TUM.map(function(t){ return { konu:t.konu.no, asamalar:t.bolumler.map(function(b){ return b.k + ':' + b.el.querySelector('.dak-ic').children.length; }), aktif:t.aktif }; }); },
    /* 2026-11-08: konu sahneleri bileşeni (ortak/konu-sahne.js) için salt-okunur yapı */
    yapi:function(){ return TUM.map(function(t){ return { konu:{ no:t.konu.no, ad:t.konu.ad }, nav:t.nav, bolumler:t.bolumler.slice() }; }); }
  };
  sahneYukle();
}

/* Öğrenme Yolu modülleri (sayfanın kendi betiği, DOMContentLoaded) ve
   portal-nav/konu-sayfa katmanı kurulduktan sonra çalış. */
function hazir(){ setTimeout(kur, 250); }
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hazir);
else hazir();
})();
