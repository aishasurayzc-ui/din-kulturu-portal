/* ======================================================================
   SESLİ DİNLEME — 4.–12. sınıf konu sayfaları için ORTAK sistem
   (2026-11-02: eski "her konuda / her başlıkta Dinle düğmesi" yapısının
   yerini alır; eski sürüm: konu-dinle.ust-panel-oncesi-2026-11-02.js)
   ----------------------------------------------------------------------
   • Sayfanın başına, içerikten önce TEK bir "Sesli Dinleme" alanı ekler:
       🔊 Tüm Sayfayı Dinle   — sayfadaki konu anlatımının tamamı, sırasıyla
       🧠 Ezber Bölümünü Dinle — yalnızca ezber kutuları ("Aklında Kalsın",
                                 "Unutma!", "Ezberlenmesi gereken listeler",
                                 "Ezber formülü" ve data-ezber ile işaretlenenler)
   • İki seçenek aynı oynatıcıyı kullanır: başlat/duraklat/devam et, durdur,
     ileri/geri (bölüm bölüm), hız (0.75×–1.5×), ilerleme çubuğu, okunan
     cümle ve sayfada vurgulama/takip. Oynatıcı ekrandan çıkınca altta sabitlenir.
   • Okunmayanlar: menüler, düğmeler, testler, oyunlar, şıklar, yazma alanları,
     fotoğraf altı yazıları, kaynak/kazanım satırları, sure–dua okunuş tabloları
     (sure ve dualar için sure-dinle.js'deki hafız kaydı ayrıca çalışır).
   • Ses: varsa hazır kayıt (ortak/ses/konu/sN-uM.js + mp3), yoksa tarayıcının
     Türkçe sesi (Web Speech API; Edge'in doğal Türkçe sesleri önceliklidir).
   • Aynı anda tek okuma: yeni okuma eskisini durdurur; başka sekmede okuma
     başlarsa bu sekmedeki duraklar; sayfadan çıkınca okuma durur.
   • Sayfanın içeriğine dokunmaz; yalnızca dinleme alanı ve vurgu ekler.
   • 4–8: portal-nav.js "ogren" sayfalarında yükler. 9–11: sayfa kendisi yükler.
====================================================================== */
(function(){
  'use strict';
  if(window.__sesliOkuma) return;
  window.__sesliOkuma = true;
  window.__konuDinle = true;   /* eski adla yükleme denetimi yapan betikler için */

  var ses = window.speechSynthesis || null;
  var CARPANLAR = [0.75, 1, 1.25, 1.5];
  var LS_CARPAN = 'dkab_dinle_carpan';
  var TEMEL_HIZ = 0.95;        /* 1× = tarayıcı sesinde doğal Türkçe okuma hızı */

  function oku(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function yaz(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function kacis(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function metin(el){ return (el && el.textContent || '').replace(/\s+/g, ' ').trim(); }

  var carpan = parseFloat(oku(LS_CARPAN));
  if(CARPANLAR.indexOf(carpan) < 0) carpan = 1;
  var hiz = TEMEL_HIZ * carpan;

  /* ---------- Türkçe ses seçimi: doğal (Natural/Online) > Google > diğer ---------- */
  var turkceSes = null;
  function sesSec(){
    if(!ses) return;
    var tr = (ses.getVoices() || []).filter(function(v){ return /^tr(-|_|$)/i.test(v.lang); });
    function puan(v){
      var n = v.name || '';
      return (/natural|online/i.test(n) ? 4 : 0) + (/google/i.test(n) ? 2 : 0) + (v.localService ? 1 : 0);
    }
    tr.sort(function(a, b){ return puan(b) - puan(a); });
    turkceSes = tr[0] || null;
    if(typeof sesNotuGuncelle === 'function') sesNotuGuncelle();
  }
  if(ses){ sesSec(); if('onvoiceschanged' in ses) ses.addEventListener('voiceschanged', sesSec); }

  /* ---------- Okunacak metni toplama ---------- */
  var ATLA_ORTAK = [
    'script','style','noscript','svg','button','select','textarea','input','label','figure','figcaption','video','audio','thead',
    'nav','[hidden]','[aria-hidden="true"]','.sok-panel','.sok-oynatici',
    '.ka-konu-gorsel','.kt-bolum','.hk-bolum','.yg-panel','.ys-panel','.kd-bolum','.akd-kutu','.ke-motor',
    '.bk-panel','.sd-cubuk','.kd-alan','.ogr-ozet-ust','.ogr-modul-no','.ogr-modul-sure','.kavram-harita-aciklama',
    '[class*="kazanim"]','[class*="secenek"]','[class*="soru"]','[class*="test"]',
    '[class*="oyun"]','[class*="quiz"]','.zb-cevap-not','[class*="cevap-alan"]','[class*="okunus"]','[class*="kaynak"]','[class*="secim"]',
    '[class*="mk-"]','[class*="mini-kontrol"]','[class*="sunum"]','[class*="gorev"]'
  ];
  /* 4–8 konu sayfalarında konu afişi dışındaki tablolar sure/dua okunuş tablosudur: okunmaz */
  var ATLA = ATLA_ORTAK.concat(['table:not(.ka-konu table)']).join(',');
  /* 9–12 sayfalarında tablolar konu bilgisidir (listeler, karşılaştırmalar): okunur.
     Etkinlik, test, deneme, yazılı ve çıkmış soru alanları okunmaz. */
  var ATLA_GENEL = ATLA_ORTAK.concat([
    'header','footer','thead','details.anlatim-video','.cikmis','.etkinlik','.quiz-bar','.skor-kart','.sekmeler',
    '[data-tab="etkinlik"]','[data-tab="dene"]','[data-tab="degerlendirme"]',
    '#test','#yazili','#deneme','#kavram-lab','#testAlani','#quiz'
  ]).join(',');
  var BLOK = 'h2,h3,h4,h5,p,li,blockquote,dt,dd,tr,.ka-krs-sut,.ka-alt-kart,.kavram-harita';
  var BLOK_GENEL = BLOK;
  var BASLIK = 'h2,h3,h4,h5,.zb-baslik,.ka-blok-bas,.dd-bas';
  /* Bir bloğun içinde okunmayacak küçük parçalar (rozet, düğme, simge) */
  var IC_ATLA = '.ka-rozet,.ka-alt-gorsel,.ka-krs-ikon,button,svg,sup,.sd-btn,.sd-not,[aria-hidden="true"]';
  var aktifAtla = ATLA;   /* sayfa türüne göre kur() içinde belirlenir */

  function blokMetni(el){
    /* Metin düğümlerini sırayla birleştirir; blok öğeler arasına (ör. "01"
       ile "Gör" arasına) duraklama koyar, satır içi öğeleri (<b>vicdan</b>ın)
       bitişik bırakır. Gizli parçalar ve rozetler okunmaz. */
    function duz(x){
      var parcalar = [], oncekiEl = null;
      var yuruyen = document.createTreeWalker(x, NodeFilter.SHOW_TEXT, {
        acceptNode:function(n){
          var e = n.parentElement;
          if(!e || !n.nodeValue.trim() && !/\s/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
          if(e !== x && e.closest(IC_ATLA) && x.contains(e.closest(IC_ATLA))) return NodeFilter.FILTER_REJECT;
          if(e.closest(aktifAtla) && x.contains(e.closest(aktifAtla))) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      function blokMu(e){
        var d = getComputedStyle(e).display;
        return d !== 'inline' && d !== 'contents';
      }
      var n;
      while((n = yuruyen.nextNode())){
        var e = n.parentElement;
        if(oncekiEl && e !== oncekiEl && parcalar.length){
          /* İki metin arasında bir blok sınırı var mı? */
          var ortak = oncekiEl, sinir = false;
          while(ortak && !ortak.contains(e)) { if(blokMu(ortak)) sinir = true; ortak = ortak.parentElement; }
          var y = e; while(y && y !== ortak){ if(blokMu(y)) sinir = true; y = y.parentElement; }
          if(sinir){
            var son = parcalar[parcalar.length - 1].replace(/\s+$/, '');
            parcalar[parcalar.length - 1] = son + (/[.!?…:;,]$/.test(son) ? ' ' : '. ');
          }
        }
        parcalar.push(n.nodeValue);
        oncekiEl = e;
      }
      return parcalar.join('').replace(/\s+/g, ' ').trim();
    }
    if(el.matches('tr')){
      var hucreler = Array.prototype.map.call(el.children, duz).filter(Boolean);
      if(!hucreler.length) return '';
      return hucreler[0].replace(/[.:]+$/, '') + (hucreler.length > 1 ? ': ' + hucreler.slice(1).join(', ') : '') + '.';
    }
    if(el.matches('.ka-krs-sut')){
      var bas = el.querySelector('h5,h4,b');
      var ogeler = Array.prototype.map.call(el.querySelectorAll('.ka-krs-satir'), duz).filter(Boolean);
      return (bas ? duz(bas) + ': ' : '') + ogeler.join(', ') + '.';
    }
    if(el.matches('.ka-alt-kart')){
      var no = el.querySelector('.ka-alt-no'), b = el.querySelector('b'), d = el.querySelector('.ka-alt-govde > span:not(.ka-alt-no)');
      return (no ? duz(no) + '. ' : '') + (b ? duz(b) : '') + (d ? ': ' + duz(d) : '') + '.';
    }
    if(el.matches('.kavram-harita')){
      var m = el.querySelector('.kh-merkez');
      var kv = Array.prototype.map.call(el.querySelectorAll('.kh-kavram'), duz).filter(Boolean);
      return (m ? duz(m) + ' konusunun anahtar kavramları: ' : 'Anahtar kavramlar: ') + kv.join(', ') + '.';
    }
    return duz(el);
  }

  function sadelestir(t){
    return String(t)
      .replace(/(^|\s)\d\uFE0F?\u20E3/g, ' ')
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu, ' ')
      .replace(/\bHz\.\s*/g, 'Hazreti ')
      .replace(/\(\s*s\.?\s*a\.?\s*v\.?\s*\)/gi, '(sallallahu aleyhi ve sellem)')
      .replace(/\(\s*a\.?\s*s\.?\s*\)/gi, '(aleyhisselam)')
      .replace(/\(\s*r\.?\s*a\.?\s*\)/gi, '(radıyallahu anh)')
      .replace(/\(\s*c\.?\s*c\.?\s*\)/gi, '(celle celâlühû)')
      .replace(/\bvb\./g, 've benzeri').replace(/\bvs\./g, 've saire').replace(/\bbkz\./gi, 'bakınız')
      .replace(/(^|[\s(])ör\./gi, '$1örneğin').replace(/(^|\s)yy\./g, '$1yüzyıl')
      .replace(/[→⇒➜]/g, ', ').replace(/[•·▪►]/g, ' ').replace(/[“”"]/g, '')
      .replace(/([—–-])\s*\.\s*/g, '$1 ').replace(/\s+([.,;:!?])/g, '$1').replace(/([.!?…])(\s*\.)+/g, '$1')
      .replace(/\s+/g, ' ').trim();
  }
  function karsilastir(t){ return String(t).toLocaleLowerCase('tr').replace(/[^\p{L}\p{N}]+/gu, ''); }
  /* Uzun metinler tarayıcıda yarıda kesilebildiği için cümle cümle okunur */
  function cumlelere(t){
    /* Yalnızca nokta/ünlem/soru işaretinden sonra büyük harf, rakam veya
       tırnakla başlayan yeni cümlede böl ("119. ayet" gibi yerler bölünmez) */
    var parca = t.split(/(?<=[.!?…])\s+(?=[\p{Lu}\d"'(«“])/u);
    var sonuc = [], tampon = '';
    parca.forEach(function(p){
      p = p.trim(); if(!p) return;
      tampon = tampon ? tampon + ' ' + p : p;
      /* "01." "Gör." gibi çok kısa parçalar bir sonrakiyle birlikte okunur */
      if(tampon.length >= 40 || (/[.!?…]$/.test(tampon) && tampon.length >= 18)){ sonuc.push(tampon); tampon = ''; }
    });
    if(tampon) sonuc.push(tampon);
    /* Çok uzun cümleleri virgülden böl */
    var kisa = [];
    sonuc.forEach(function(c){
      while(c.length > 220){
        var i = c.lastIndexOf(',', 200); if(i < 60) i = c.indexOf(' ', 180); if(i < 0) break;
        kisa.push(c.slice(0, i + 1)); c = c.slice(i + 1).trim();
      }
      if(/[\p{L}\p{N}]/u.test(c)) kisa.push(c);
    });
    return kisa;
  }

  function konulariBul(){
    var linkler = document.querySelectorAll('.ka-hero .ka-icindekiler a.ka-ic-link[href^="#"]');
    var konular = [];
    ekCalismalar = [];
    Array.prototype.forEach.call(linkler, function(a){
      var b = a.querySelector('b');
      var no = b ? b.textContent.trim() : '';
      if(!/^\d+$/.test(no)){                               /* ★ ek çalışmalar konu değil, okunmaz */
        var ek = document.getElementById(a.getAttribute('href').slice(1));
        if(ek) ekCalismalar.push(ek);
        return;
      }
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if(!el || !el.closest('main')) return;
      konular.push({ no:no, ad:metin(a).replace(no, '').trim(), el:el });
    });
    konular.sort(function(x, y){
      return (x.el.compareDocumentPosition(y.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
    });
    konular.forEach(function(k, i){
      var sinir = konular[i + 1] ? konular[i + 1].el : null;
      var bolum = k.el.closest('main section') || k.el.closest('main');
      k.bitis = sinir || bolum;
      k.bolum = bolum;
    });
    return konular;
  }

  var ekCalismalar = [];
  function okunurMu(el){
    if(el.closest(aktifAtla)) return false;
    for(var i = 0; i < ekCalismalar.length; i++){ if(ekCalismalar[i].contains(el)) return false; }
    var t = blokMetni(el);
    if(t.replace(/[\s.:,]/g, '').length < 2) return false;
    if(/^(Kaynak|Fotoğraf|Görsel|Kazanım|MEB Kazanım)/i.test(t)) return false;
    return true;
  }

  /* Konu afişinden bir sonraki konunun afişine kadar olan bloklar */
  function konuMetni(k){
    var aralik = document.createRange();
    /* Yeni biçimli sayfalarda (ör. 7.6, 8.6) konunun anlatımı afişin İÇİNDEDİR */
    var icerikli = k.el.querySelectorAll('p, li, tr').length >= 2;
    if(icerikli) aralik.setStartBefore(k.el); else aralik.setStartAfter(k.el);
    if(k.bitis === k.bolum) aralik.setEnd(k.bolum, k.bolum.childNodes.length);
    else aralik.setEndBefore(k.bitis);
    var adaylar = Array.prototype.filter.call(k.bolum.querySelectorAll(BLOK), function(el){
      return aralik.intersectsNode(el) && (icerikli ? el !== k.el : !k.el.contains(el)) && okunurMu(el);
    });
    /* İç içe bloklarda (li içinde p gibi) yalnızca en dıştaki okunur */
    adaylar = adaylar.filter(function(el){
      var u = el.parentElement;
      while(u && u !== k.bolum){ if(adaylar.indexOf(u) >= 0) return false; u = u.parentElement; }
      return true;
    });
    /* Bölümler: konu içindeki her başlık ("Merak Ettin mi?", "Aklında Kalsın",
       "03 Öğren" …) yeni bir bölüm başlatır; her bölüm ayrı ayrı dinlenebilir. */
    var bolumler = [{ ad:'Giriş', el:null, ilk:0 }];
    var parcalar = [{ t:'Konu ' + k.no + '. ' + sadelestir(k.ad) + '.', el:k.el, b:0 }];
    var onceki = '';
    function baslikBul(el){
      if(el.matches(BASLIK)) return el;
      if(el.matches('.ka-krs-sut,.ka-alt-kart,.kavram-harita')) return null;   /* tablo sütunları bölüm değil */
      var ic = el.querySelector(BASLIK);
      if(!ic || el.closest(aktifAtla)) return null;
      var bt = karsilastir(blokMetni(ic)), et = karsilastir(blokMetni(el));
      return bt && et.indexOf(bt) >= 0 && et.indexOf(bt) <= 4 ? ic : null;
    }
    function bolumAdi(h){
      return sadelestir(blokMetni(h)).replace(/^\d+[.)]?\s*/, '').replace(/[.:]+$/, '').trim() || 'Bölüm';
    }
    adaylar.forEach(function(el){
      var t = sadelestir(blokMetni(el));
      var h = baslikBul(el);
      if(h && karsilastir(bolumAdi(h)) === karsilastir(k.ad)){
        /* Konu adını tekrarlayan başlık: giriş bölümünün düğmesi buraya konur */
        if(!bolumler[0].el) bolumler[0].el = h;
        if(h === el) return;
      } else if(h){
        var kapsam = (h === el) ? h.parentElement : el;
        var son = bolumler[bolumler.length - 1];
        if(son.ilk === parcalar.length && son.el){ son.el = h; son.ad = bolumAdi(h); son.kapsam = kapsam; }   /* boş kalan bölümü yeniden kullan */
        else bolumler.push({ ad:bolumAdi(h), el:h, ilk:parcalar.length, kapsam:kapsam });
      } else {
        /* Başlıklı bir kutudan çıkıldıysa (ör. Dijital Ders bitti) metin yeni bir bölümdür */
        var sb = bolumler[bolumler.length - 1];
        if(sb.kapsam && !sb.kapsam.contains(el) && parcalar.length > sb.ilk){
          bolumler.push({ ad:'Konu Anlatımı', el:null, onune:el, ilk:parcalar.length, kapsam:null });
        }
      }
      if(!t || karsilastir(t) === karsilastir(onceki)) return;   /* tekrarları atla */
      if(karsilastir(t) === karsilastir(k.ad)) return;            /* konu başlığı zaten okundu */
      onceki = t;
      var bi = bolumler.length - 1;
      cumlelere(t).forEach(function(c){ parcalar.push({ t:c, el:el, b:bi }); });
    });
    bolumler = bolumler.filter(function(b, i){
      var sonraki = bolumler[i + 1] ? bolumler[i + 1].ilk : parcalar.length;
      return sonraki > b.ilk;
    });
    bolumler.forEach(function(b, i){
      b.i = i;
      b.son = (bolumler[i + 1] ? bolumler[i + 1].ilk : parcalar.length) - 1;
      for(var j = b.ilk; j <= b.son; j++) parcalar[j].b = i;
    });
    parcalar.bolumler = bolumler;
    return parcalar;
  }

  /* Kayıt varsa gerçek süre, yoksa metin uzunluğundan tahmin (dakika) */
  function konuSuresi(k, parcalar){
    var m = kayitlar(), liste = m && m.konular && m.konular[k.no];
    if(liste && liste.length){
      var sn = liste.reduce(function(t, x){ return t + (x.s || 0); }, 0) / kayitHizi();
      return Math.max(1, Math.round(sn / 60));
    }
    return sureTahmini(parcalar);
  }
  function sureTahmini(parcalar){
    var harf = parcalar.reduce(function(s, p){ return s + p.t.length; }, 0);
    return Math.max(1, Math.round(harf / (13 * hiz) / 60));
  }

  /* ---------- 9–12. sınıf (genel) sayfaları: bölümler <section> / data-tab alanlarıdır ---------- */
  var sayfaTuru = 'ka';      /* 'ka' (4–8 konu anlatımı) | 'genel' (9–12) */
  function okunurGenel(el){
    if(el.closest(aktifAtla)) return false;
    var t = blokMetni(el);
    if(t.replace(/[\s.:,]/g, '').length < 2) return false;
    if(/^(Kaynak|Fotoğraf|Görsel|Kazanım|MEB Kazanım)/i.test(t)) return false;
    return true;
  }
  /* 9–12 ve ezber metinlerinde "a · b · c" listeleri virgülle okunur */
  function sadeGenel(t){ return sadelestir(String(t).replace(/\s*[·•]\s*/g, ', ')); }
  function noktala(t){ return /[.!?…]$/.test(t) ? t : t + '.'; }
  function enDistakiler(liste, kok){
    return liste.filter(function(el){
      var u = el.parentElement;
      while(u && u !== kok){ if(liste.indexOf(u) >= 0) return false; u = u.parentElement; }
      return true;
    });
  }
  function ilkBaslik(el){
    var h = el.querySelector('h2') || el.querySelector('h3') || el.querySelector('.sec-head, .bolum-bas');
    var t = h ? sadelestir(blokMetni(h)).replace(/^[\s.,;:·—–-]+/, '').replace(/[.:]+$/, '') : '';
    return t.length > 70 ? t.slice(0, 68) + '…' : t;
  }
  /* Etkinlik/oyun bölümleri (bölüm etiketi "Oyun", "Eşleştirme", "Test"…) konu anlatımı değildir */
  var ETKINLIK_ETIKET = /^(oyun|eşleştir|etkinlik|test|deneme|yazılı|kendini dene|alıştırma|laboratuvar|lab\b|kavram lab)/i;
  function etkinlikBolumuMu(el){
    var bas = el.querySelector('.bolum-bas, .sec-head');
    if(!bas) return false;
    var etiket = Array.prototype.filter.call(bas.querySelectorAll('span, small, p, div'), function(x){ return !x.querySelector('h2,h3') && metin(x); })[0];
    return !!etiket && ETKINLIK_ETIKET.test(metin(etiket).replace(/^[^\p{L}]+/u, ''));
  }
  function genelKonulariBul(){
    var kok = document.querySelector('main') || document.body;
    var adaylar = Array.prototype.filter.call(kok.querySelectorAll('section, [data-tab]'), function(el){
      return !el.closest(aktifAtla) && !el.matches(aktifAtla) && !el.closest('.sok-panel');
    });
    adaylar = enDistakiler(adaylar, kok);
    var sonuc = [];
    adaylar.forEach(function(el){
      if(etkinlikBolumuMu(el)) return;
      var k = { no:String(sonuc.length + 1), ad:ilkBaslik(el) || 'Bölüm ' + (sonuc.length + 1), el:el, genel:true };
      k.parcalar = genelKonuMetni(k);
      if(k.parcalar.length > 1) sonuc.push(k);
    });
    sonuc.forEach(function(k, i){ k.no = String(i + 1); k.parcalar[0].t = noktala(sadelestir(k.ad)); });
    return sonuc;
  }
  function genelKonuMetni(k){
    var bloklar = Array.prototype.filter.call(k.el.querySelectorAll(BLOK_GENEL), okunurGenel);
    bloklar = enDistakiler(bloklar, k.el);
    var parcalar = [{ t:noktala(sadelestir(k.ad)), el:k.el, b:0 }];
    var bolumler = [{ ad:k.ad, el:k.el, ilk:0, i:0 }];
    var onceki = '', ilkBaslikGecti = false;
    bloklar.forEach(function(el){
      var t = sadeGenel(blokMetni(el)).replace(/^[\s.,;:·—–-]+/, '');
      if(!t || karsilastir(t) === karsilastir(onceki)) return;
      if(karsilastir(t) === karsilastir(k.ad)){ ilkBaslikGecti = true; return; }   /* bölüm adı zaten okundu */
      if(el.matches('h2,h3,h4') && parcalar.length > 1){
        bolumler.push({ ad:t.replace(/[.:]+$/, ''), el:el, ilk:parcalar.length, i:bolumler.length });
      }
      onceki = t;
      var bi = bolumler.length - 1;
      cumlelere(t).forEach(function(c){ parcalar.push({ t:c, el:el, b:bi }); });
    });
    bolumler.forEach(function(b, i){ b.son = (bolumler[i + 1] ? bolumler[i + 1].ilk : parcalar.length) - 1; });
    parcalar.bolumler = bolumler;
    return parcalar;
  }

  /* ---------- EZBER bölümü ----------
     Ezber kutusu sayılanlar: data-ezber ile işaretlenen alanlar, "Aklında Kalsın"
     (4–7), "Unutma!" (8) kutuları ve başlığı "Ezberlenmesi gereken…",
     "Ezber formülü", "Ezberleyelim", "Unutmayalım" gibi başlayan alanlar.
     ("Ezberleme, anla!" gibi ezberi önermeyen başlıklar sayılmaz.) */
  var EZBER_SECICI = '[data-ezber], .ka-aklinda-kalsin, .zb-unutma';
  var EZBER_BASLIK = /^(akl[ıi]nda kals[ıi]n|unutma(yal[ıi]m)?(?![a-zçğıöşü])|ezber form[uü]l|ezberlenmesi gereken|ezberle(yelim|yin|necek)|ezber(?![a-zçğıöşü])|ezber b[oö]l[uü]m)/;
  var EZBER_DEGIL = /^(ezber\s+de[gğ]il|ezberleme(?![a-zçğıöşü]))/;
  function ezberBaslikMi(el){
    var t = metin(el).toLocaleLowerCase('tr').replace(/^[^a-zçğıöşü]+/, '');
    return EZBER_BASLIK.test(t) && !EZBER_DEGIL.test(t);
  }
  function ezberAlanlari(){
    var kok = document.querySelector('main') || document.body;
    var alanlar = [];
    function ekle(el, ad, ogeler){
      if(!el || el.closest('.sok-panel')) return;
      alanlar.push({ el:el, ad:ad, ogeler:ogeler || [el] });
    }
    Array.prototype.forEach.call(kok.querySelectorAll(EZBER_SECICI), function(el){
      var h = el.querySelector(BASLIK + ',b,strong');
      ekle(el, h ? sadelestir(metin(h)).replace(/[.:!]+$/, '') : 'Ezber');
    });
    Array.prototype.forEach.call(kok.querySelectorAll('h2,h3,h4,h5,.zb-baslik,.ka-blok-bas,.dd-bas,b,strong'), function(h){
      if(h.closest(EZBER_SECICI) || h.closest(ATLA_ORTAK.join(',')) || !ezberBaslikMi(h)) return;
      var ad = sadelestir(metin(h)).replace(/[.:!]+$/, '');
      if(h.matches('b,strong')){
        /* paragrafın başındaki kalın yazı ("Ezber formülü: …"): o blok okunur */
        var blok = h.closest('p,li,div,td,blockquote');
        if(blok && metin(blok).indexOf(metin(h)) <= 3) ekle(blok, ad);
        return;
      }
      var ust = h.parentElement;
      var tekBaslikli = ust && ust.firstElementChild === h && ust.querySelectorAll('h2,h3,h4,h5').length === 1 &&
                        !ust.matches('main,body,section,[data-tab],.wrap');
      if(tekBaslikli){ ekle(ust, ad); return; }
      /* başlıktan bir sonraki aynı ya da üst düzey başlığa kadar */
      var duzey = /^h[2-5]$/i.test(h.tagName) ? +h.tagName[1] : 6, ogeler = [h], s = h.nextElementSibling;
      while(s){
        var sh = s.matches('h2,h3,h4,h5') ? +s.tagName[1] : 0;
        if(sh && sh <= duzey) break;
        ogeler.push(s); s = s.nextElementSibling;
      }
      ekle(h, ad, ogeler);
    });
    /* iç içe/aynı alanları ayıkla, belge sırasına diz */
    alanlar = alanlar.filter(function(a, i){
      return !alanlar.some(function(b, j){
        if(i === j) return false;
        return b.ogeler.some(function(o){ return o !== a.el && o.contains(a.el); }) || (b.el === a.el && j < i);
      });
    });
    alanlar.sort(function(x, y){ return (x.el.compareDocumentPosition(y.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1; });
    return alanlar;
  }
  function konuAdiBul(el){
    /* 4–8: ezber kutusunun ait olduğu konu */
    var bulunan = null;
    konular.forEach(function(k){
      if(k.genel) return;
      if(k.el === el || (k.el.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) bulunan = k;
    });
    return bulunan;
  }
  function ezberKuyrugu(){
    var alanlar = ezberAlanlari(), kuyruk = [];
    var eskiAtla = aktifAtla;
    aktifAtla = ATLA_ORTAK.join(',');            /* ezberde tablolar (listeler) de okunur */
    alanlar.forEach(function(a, i){
      var k = sayfaTuru === 'ka' ? konuAdiBul(a.el) : null;
      var etiket = (k ? 'Konu ' + k.no + ' · ' : '') + (a.ad || 'Ezber');
      var parcalar = [{ t:'Ezber ' + (i + 1) + '. ' + (k ? 'Konu ' + k.no + ', ' + sadelestir(k.ad) + '. ' : '') + noktala(sadelestir(a.ad || 'Ezber')), el:a.el, b:0 }];
      var onceki = '';
      a.ogeler.forEach(function(o){
        var bloklar = o.matches(BLOK_GENEL) ? [o] : Array.prototype.filter.call(o.querySelectorAll(BLOK_GENEL), function(x){ return !x.closest(aktifAtla); });
        bloklar = enDistakiler(bloklar, o);
        if(!bloklar.length && metin(o)) bloklar = [o];
        bloklar.forEach(function(el){
          var t = sadeGenel(blokMetni(el));
          if(!t || karsilastir(t) === karsilastir(onceki) || karsilastir(t) === karsilastir(a.ad)) return;
          /* başlık bloğun başındaysa ("Ezber formülü: …") tekrar okunmasın */
          var bas = sadelestir(a.ad || '');
          if(bas && t.indexOf(bas) === 0) t = t.slice(bas.length).replace(/^[\s.:!—–-]+/, '');
          if(!t) return;
          onceki = t;
          cumlelere(t).forEach(function(c){ parcalar.push({ t:c, el:el, b:0 }); });
        });
      });
      if(parcalar.length < 2) return;
      parcalar.bolumler = [{ ad:etiket, el:a.el, ilk:0, son:parcalar.length - 1, i:0 }];
      kuyruk.push({ konu:{ no:'E' + (i + 1), ad:etiket, el:a.el, ezber:true }, parcalar:parcalar });
    });
    aktifAtla = eskiAtla;
    return kuyruk;
  }

  var vurgulu = null;
  function vurgula(el){
    if(vurgulu) vurgulu.classList.remove('sok-okunuyor');
    vurgulu = el || null;
    if(!el) return;
    el.classList.add('sok-okunuyor');
    if(durum && durum.takip){
      var r = el.getBoundingClientRect();
      var ust = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ks-sabit-h'), 10) || 0;
      if(r.top < ust + 10 || r.bottom > window.innerHeight - 170){
        window.scrollTo({ top:Math.max(0, r.top + window.pageYOffset - ust - 24), behavior:'smooth' });
      }
    }
  }

  /* Okunacak yer gizli bir sekmede/bölümdeyse önce onu aç */
  function bolumuAc(el){
    if(!el) return;
    if(sayfaTuru === 'ka'){
      var sec = el.closest('main section');
      if(sec && !sec.classList.contains('aktif')){
        var dugmeler = document.querySelectorAll('#oyun-gruplari button[onclick]');
        for(var i = 0; i < dugmeler.length; i++){
          if((dugmeler[i].getAttribute('onclick') || '').indexOf("goster('" + sec.id + "'") >= 0){ dugmeler[i].click(); return; }
        }
        sec.classList.add('aktif');
      }
      return;
    }
    /* 9. sınıf sayfaları: data-tab sekmeleri */
    var tab = el.closest('[data-tab]');
    if(tab && !tab.classList.contains('panel-aktif')){
      var ad = tab.getAttribute('data-tab');
      if(typeof window.sekmeAc === 'function'){ try{ window.sekmeAc(ad, false); return; }catch(e){} }
      var b = document.querySelector('.sekme-btn[data-git="' + ad + '"]');
      if(b) b.click();
    }
  }

  /* ---------- Hazır bölüm kayıtları (ortak/ses/konu/sN-uM.js + mp3) ----------
     Kayıt varsa ve bölümün metni kayıttaki metinle aynıysa (özet "h") o bölüm
     MP3'ten çalınır; yoksa tarayıcının Türkçe sesiyle okunur. */
  var KAYIT_KLASORU = (function(){
    var b = document.currentScript && document.currentScript.src;
    return b ? b.replace(/[^\/]*$/, 'ses/konu/') : '../ortak/ses/konu/';
  })();
  var sayfaKimligi = '';
  function ozet(metinler){
    var s = metinler.join('\n'), h = 5381;
    for(var i = 0; i < s.length; i++){ h = ((h << 5) + h + s.charCodeAt(i)) | 0; }
    return (h >>> 0).toString(36);
  }
  function kayitlar(){ return (window.KONU_SES_KAYIT || {})[sayfaKimligi] || null; }
  function kayitBul(konu, parcalar, bi){
    var m = kayitlar();
    var liste = m && m.konular && m.konular[konu.no];
    var k = liste && liste[bi];
    var b = parcalar.bolumler[bi];
    if(!liste || !b) return null;
    var metinler = parcalar.slice(b.ilk, b.son + 1).map(function(p){ return p.t; });
    var h = ozet(metinler);
    if(k && !k.bozuk && k.h === h && k.t.length === metinler.length) return k;
    /* 2026-11-07 — Ders akışı konu içindeki bölümlerin SIRASINI değiştirebilir;
       metni aynı kalan bölümün kaydı sıra numarasıyla değil, metin özetiyle bulunur
       (her bölümün kayıttaki başlangıç saniyesi "o" ayrıdır). */
    for(var j = 0; j < liste.length; j++){
      var x = liste[j];
      if(x && !x.bozuk && x.h === h && x.t.length === metinler.length) return x;
    }
    return null;
  }
  var cal = null;   /* tek <audio> öğesi */
  function calici(){
    if(!cal){ cal = new Audio(); cal.preload = 'auto'; }
    return cal;
  }
  function kayitHizi(){ return carpan; }
  function kayittanCal(k, kayit){
    var b = k.parcalar.bolumler[k.parcalar[durum.pi].b];
    var a = calici(), oturum = durum;
    /* Bütün bölümler sayfa başına tek bir dosyada; "o" bölümün başladığı saniye */
    var url = KAYIT_KLASORU + (kayit.o != null ? kayit.d : sayfaKimligi + '/' + kayit.d);
    var o = kayit.o || 0;
    var bas = o + (kayit.t[Math.max(0, durum.pi - b.ilk)] || 0);
    function bolumBitti(){
      if(durum !== oturum || durum.duraklatildi) return;
      kayitDurdur();
      durum.pi = b.son + 1; durum.sesModu = false; planla(200);
    }
    durum.sesModu = true;
    vurgula(k.parcalar[durum.pi].el);
    arayuzGuncelle();
    a.onended = bolumBitti;
    a.ontimeupdate = function(){
      if(durum !== oturum) return;
      var ct = a.currentTime - o;
      if(kayit.s && ct >= kayit.s - 0.04){ bolumBitti(); return; }   /* bölümün sonu */
      var j = kayit.t.length - 1;
      while(j > 0 && kayit.t[j] > ct + 0.05) j--;
      var yeni = b.ilk + j;
      if(yeni !== durum.pi && yeni <= b.son){ durum.pi = yeni; vurgula(k.parcalar[yeni].el); arayuzGuncelle(); }
    };
    a.onerror = function(){
      if(durum !== oturum) return;
      kayit.bozuk = true; durum.sesModu = false;     /* dosya açılamadı: bu bölüm tarayıcı sesiyle */
      konus();
    };
    function oynat(){
      try{ a.currentTime = bas; }catch(e){}
      a.playbackRate = kayitHizi();
      var p = a.play();
      if(p && p.catch) p.catch(function(err){
        if(durum !== oturum || (err && err.name === 'AbortError')) return;
        kayit.bozuk = true; durum.sesModu = false; konus();
      });
    }
    if(a.getAttribute('data-sok-src') !== url){
      a.setAttribute('data-sok-src', url);
      a.src = url;
      a.onloadedmetadata = function(){ a.onloadedmetadata = null; if(durum === oturum && !durum.duraklatildi) oynat(); };
      a.load();
    } else oynat();
  }
  function kayitDurdur(){
    if(!cal) return;
    cal.onended = cal.ontimeupdate = cal.onerror = cal.onloadedmetadata = null;
    try{ cal.pause(); }catch(e){}
  }

  /* ---------- Oynatma ---------- */
  var durum = null;   /* { kuyruk:[{konu, parcalar, bas?, son?}], ki, pi, duraklatildi, kaynak:'tum'|'ezber' } */
  var bizimIptal = false;
  var konular = [];

  function digerSesleriDurdur(){
    /* sure-dinle.js çalıyorsa kendi düğmesiyle durdur */
    var aktif = document.querySelector('.sd-btn.sd-aktif');
    if(aktif) aktif.click();
  }

  function simdiki(){ return durum && durum.kuyruk[durum.ki]; }
  function girisBas(g){ return g.bas != null ? g.bas : 0; }
  function girisSon(g){ return g.son != null ? g.son : g.parcalar.length - 1; }
  /* Tek bir zamanlayıcı: yeni bir okuma başlarken eskisinin bekleyen adımı çalışmasın */
  var zamanlayici = null;
  function planla(ms){
    clearTimeout(zamanlayici);
    var d = durum;
    zamanlayici = setTimeout(function(){ if(durum && durum === d) konus(); }, ms);
  }

  function konus(){
    if(!durum || durum.duraklatildi) return;
    var k = simdiki();
    if(!k){ bitir(true); return; }
    if(durum.pi > girisSon(k)){
      durum.ki++;
      if(!simdiki()){ bitir(true); return; }
      durum.pi = girisBas(simdiki());
      bolumuAc(simdiki().konu.el);
      arayuzGuncelle();
      planla(400);
      return;
    }
    var p = k.parcalar[durum.pi];
    bolumuAc(p.el);
    var kayit = (durum.kaynak === 'tum' && !k.konu.genel && !k.konu.ezber) ? kayitBul(k.konu, k.parcalar, p.b) : null;
    if(kayit){ kayittanCal(k, kayit); return; }
    durum.sesModu = false;
    if(!ses){ durum.pi++; planla(50); return; }       /* ne kayıt ne tarayıcı sesi: atla */
    vurgula(p.el);
    arayuzGuncelle();
    var u = new SpeechSynthesisUtterance(p.t);
    u.lang = 'tr-TR'; u.rate = hiz; u.pitch = 1;
    if(turkceSes) u.voice = turkceSes;
    /* Her söz kendi okuma oturumuna bağlıdır: tarayıcı, iptal edilen eski
       bir sözün olayını geç bildirirse yeni okumayı etkilemesin */
    var oturum = durum;
    var kimlik = durum.sayac = (durum.sayac || 0) + 1;
    u.onend = function(){
      if(!durum || durum !== oturum || durum.sayac !== kimlik || durum.duraklatildi) return;
      durum.pi++; planla(120);
    };
    u.onerror = function(e){
      if(!durum || durum !== oturum || durum.sayac !== kimlik) return;
      if(bizimIptal){ return; }
      /* Başka bir ses (sure dinleme, asistan) okumayı kestiyse duraklat; kaldığı yerden sürdürülebilir */
      if(e && (e.error === 'interrupted' || e.error === 'canceled')){ duraklat('Başka bir ses başladığı için dinleme duraklatıldı.'); return; }
      durum.pi++; planla(120);
    };
    bizimIptal = false;
    ses.speak(u);
  }

  function iptalEt(){
    clearTimeout(zamanlayici);
    kayitDurdur();
    bizimIptal = true;
    if(ses) ses.cancel();
    setTimeout(function(){ bizimIptal = false; }, 60);
  }

  function baslat(kuyruk, kaynak){
    if(!kuyruk.length) return;
    if(!ses && !kayitlar()){ bilgiGoster('Bu tarayıcı sesli okumayı desteklemiyor. Chrome, Edge ya da Safari ile açabilirsin.'); return; }
    digerSesleriDurdur();
    iptalEt();
    bizimIptal = false;
    durum = { kuyruk:kuyruk, ki:0, pi:girisBas(kuyruk[0]), duraklatildi:false, takip:true, kaynak:kaynak };
    toplamHesapla();
    sekmelereBildir();
    bilgiGoster('');
    /* İlk söz tıklamanın içinde başlar: telefonlarda (iOS) ses ancak böyle açılır */
    konus();
  }
  function duraklat(not){
    if(!durum) return;
    durum.duraklatildi = true; iptalEt(); arayuzGuncelle();
    if(typeof not === 'string') bilgiGoster(not);
  }
  function surdur(){
    if(!durum) return;
    digerSesleriDurdur();
    sekmelereBildir();
    bilgiGoster('');
    durum.duraklatildi = false; arayuzGuncelle(); konus();
  }
  function bitir(sonaGeldi){
    iptalEt();
    var kaynak = durum && durum.kaynak;
    durum = null;
    vurgula(null);
    arayuzGuncelle();
    if(sonaGeldi === true) bilgiGoster(kaynak === 'ezber' ? 'Ezber bölümü bitti. Bir kez daha dinlemek pekiştirir.' : 'Sayfanın sonuna gelindi.');
  }

  /* Bölümler: kuyruktaki her girişin bölümleri tek bir sırada (ileri/geri bunun üzerinde) */
  function bolumListesi(){
    var liste = [];
    if(!durum) return liste;
    durum.kuyruk.forEach(function(g, ki){
      var bas = girisBas(g), son = girisSon(g);
      (g.parcalar.bolumler || [{ ilk:0, son:g.parcalar.length - 1 }]).forEach(function(b){
        var ilk = Math.max(b.ilk, bas), bit = Math.min(b.son, son);
        if(bit >= ilk) liste.push({ ki:ki, ilk:ilk, son:bit, ad:b.ad });
      });
    });
    return liste;
  }
  function suankiBolum(liste){
    for(var i = 0; i < liste.length; i++){
      var b = liste[i];
      if(b.ki === durum.ki && durum.pi >= b.ilk && durum.pi <= b.son) return i;
    }
    return 0;
  }
  function atla(yon){
    if(!durum) return;
    var liste = bolumListesi(); if(!liste.length) return;
    var i = suankiBolum(liste), hedef;
    if(yon > 0) hedef = i + 1;
    else hedef = (durum.pi > liste[i].ilk + 1 || i === 0) ? i : i - 1;   /* önce bölümün başına, sonra önceki bölüme */
    if(hedef >= liste.length){ bitir(true); return; }
    var devam = !durum.duraklatildi;
    iptalEt();
    durum.ki = liste[hedef].ki; durum.pi = liste[hedef].ilk;
    if(devam){ durum.duraklatildi = false; bolumuAc(simdiki().konu.el); planla(80); }
    else { arayuzGuncelle(); var p = simdiki().parcalar[durum.pi]; if(p){ bolumuAc(p.el); vurgula(p.el); } }
  }
  function carpanSec(c){
    if(CARPANLAR.indexOf(c) < 0) return;
    carpan = c; hiz = TEMEL_HIZ * c;
    yaz(LS_CARPAN, String(c));
    if(durum && durum.sesModu && cal){ cal.playbackRate = kayitHizi(); }
    else if(durum && !durum.duraklatildi){ iptalEt(); planla(80); }
    arayuzGuncelle();
  }
  function toplamHesapla(){
    var t = 0;
    durum.kuyruk.forEach(function(g){ g.onceki = t; t += girisSon(g) - girisBas(g) + 1; });
    durum.toplam = t;
  }
  function ilerleme(){
    if(!durum || !durum.toplam) return 0;
    var g = simdiki(); if(!g) return 1;
    return Math.min(1, (g.onceki + Math.max(0, durum.pi - girisBas(g)) + (durum.duraklatildi ? 0 : 0.5)) / durum.toplam);
  }

  /* ---------- Aynı anda tek okuma: diğer sekmeler ---------- */
  var SEKME = Math.random().toString(36).slice(2);
  var kanal = null;
  try{ kanal = new BroadcastChannel('dkab-sesli-okuma'); }catch(e){}
  function sekmelereBildir(){
    var m = { tip:'basladi', sekme:SEKME, z:Date.now() };
    if(kanal){ try{ kanal.postMessage(m); }catch(e){} }
    yaz('dkab_sesli_okuma_aktif', JSON.stringify(m));
  }
  function baskaSekme(m){
    if(!m || m.sekme === SEKME || m.tip !== 'basladi') return;
    if(durum && !durum.duraklatildi) duraklat('Başka bir sayfada dinleme başladığı için bu sayfadaki dinleme duraklatıldı.');
  }
  if(kanal) kanal.onmessage = function(e){ baskaSekme(e.data); };
  window.addEventListener('storage', function(e){
    if(e.key !== 'dkab_sesli_okuma_aktif' || !e.newValue) return;
    try{ baskaSekme(JSON.parse(e.newValue)); }catch(x){}
  });

  /* ---------- Arayüz ---------- */
  function svg(yol, b){ b = b || 20; return '<svg viewBox="0 0 24 24" width="' + b + '" height="' + b + '" aria-hidden="true" focusable="false">' + yol + '</svg>'; }
  var IKON = {
    kitapSes: svg('<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M2.5 6.2C4.6 5.2 7 5.1 9 6v12.4c-2-.9-4.4-.8-6.5.2zM9 6c1.4-.8 3-1 4.5-.6M9 18.4c1.2-.6 2.6-.8 4-.6"/><path fill="currentColor" d="M14 10.2v3.6h2.2l2.8 2.4V7.8l-2.8 2.4z"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M20.6 9.4a4 4 0 0 1 0 5.2"/>', 30),
    beyin: svg('<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 4.5A2.5 2.5 0 0 0 6.5 7a2.8 2.8 0 0 0-2 4.6A3 3 0 0 0 6 16.8 2.7 2.7 0 0 0 9 19.5zM15 4.5A2.5 2.5 0 0 1 17.5 7a2.8 2.8 0 0 1 2 4.6 3 3 0 0 1-1.5 5.2 2.7 2.7 0 0 1-3 2.7zM9 4.5c1.2 0 2.2.8 3 2 .8-1.2 1.8-2 3-2M9 19.5c1.2 0 2.2-.8 3-2 .8 1.2 1.8 2 3 2M12 6.5v11M9 10.5c1 0 1.8.6 2.2 1.4M15 13.5c-1 0-1.8-.6-2.2-1.4"/>', 30),
    oynat: svg('<path fill="currentColor" d="M7 4.5v15l13-7.5z"/>'),
    duraklat: svg('<path fill="currentColor" d="M6 4h4.5v16H6zM13.5 4H18v16h-4.5z"/>'),
    durdur: svg('<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>'),
    geri: svg('<path fill="currentColor" d="M5 5h2.5v14H5zM20 5v14L9 12z"/>'),
    ileri: svg('<path fill="currentColor" d="M16.5 5H19v14h-2.5zM4 5v14l11-7z"/>'),
    takip: svg('<circle cx="12" cy="12" r="3.2" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/>', 18)
  };
  var panel = null, oynatici = null, yer = null, ezberSayisi = 0, tumKuyrukOnbellek = null;

  function tumKuyrugu(){
    if(sayfaTuru === 'ka') return konular.map(function(x){ return { konu:x, parcalar:konuMetni(x) }; });
    return konular.map(function(x){ return { konu:x, parcalar:genelKonuMetni(x) }; });
  }
  function dakika(kuyruk){
    var dk = 0;
    kuyruk.forEach(function(g){
      if(sayfaTuru === 'ka' && !g.konu.ezber) dk += konuSuresi(g.konu, g.parcalar);
      else dk += sureTahmini(g.parcalar);
    });
    return Math.max(1, Math.round(dk));
  }

  function panelOlustur(){
    var tum = tumKuyrugu(), ez = ezberKuyrugu();
    ezberSayisi = ez.length;
    panel = document.createElement('section');
    panel.className = 'sok-panel';
    panel.setAttribute('aria-labelledby', 'sokBaslik');
    panel.innerHTML =
      '<div class="sok-ust"><div class="sok-ust-metin"><h2 class="sok-baslik" id="sokBaslik">Sesli Dinleme</h2>' +
        '<p class="sok-aciklama">Konuyu baştan sona dinleyebilir ya da yalnızca ezberlemen gerekenleri tekrar edebilirsin.</p></div></div>' +
      '<div class="sok-secenekler" role="group" aria-label="Ne dinlemek istersin?">' +
        '<button type="button" class="sok-secenek sok-secenek--tum" data-so="tum" aria-pressed="false">' +
          '<span class="sok-s-ikon">' + IKON.kitapSes + '</span>' +
          '<span class="sok-s-metin"><b>Tüm Sayfayı Dinle</b><small>' + tum.length + ' bölüm · yaklaşık ' + dakika(tum) + ' dk</small></span>' +
          '<span class="sok-s-rozet" aria-hidden="true">Dinleniyor</span></button>' +
        '<button type="button" class="sok-secenek sok-secenek--ezber' + (ezberSayisi ? '' : ' sok-yok') + '" data-so="ezber" aria-pressed="false"' + (ezberSayisi ? '' : ' aria-describedby="sokBilgi"') + '>' +
          '<span class="sok-s-ikon">' + IKON.beyin + '</span>' +
          '<span class="sok-s-metin"><b>Ezber Bölümünü Dinle</b><small>' +
            (ezberSayisi ? ezberSayisi + ' ezber kutusu · yaklaşık ' + dakika(ez) + ' dk' : 'Bu sayfada ezber bölümü yok') + '</small></span>' +
          '<span class="sok-s-rozet" aria-hidden="true">Dinleniyor</span></button>' +
      '</div>' +
      '<p class="sok-bilgi" id="sokBilgi" role="status" aria-live="polite" hidden></p>' +
      '<div class="sok-yer"></div>';
    yer = panel.querySelector('.sok-yer');
    oynaticiOlustur();
    yer.appendChild(oynatici);
    /* Yerleşim: içerikten önce (4–8: ünite afişinin hemen altı; 9–12: sayfa başlığının altı) */
    var hedef = document.querySelector('section.ka-hero');
    if(hedef) hedef.parentNode.insertBefore(panel, hedef.nextSibling);
    else {
      var bas = document.querySelector('.sekmeler') || document.querySelector('body > header.hero, body > section.hero, body > header.gb-ust');
      var kok = document.querySelector('main');
      if(bas && !(kok && kok.contains(bas)) && (bas.matches('.sekmeler') || !kok || (bas.compareDocumentPosition(kok) & Node.DOCUMENT_POSITION_FOLLOWING))){
        /* sekmelerin üstüne, yoksa sayfa başlığının altına */
        if(bas.matches('.sekmeler')) bas.parentNode.insertBefore(panel, bas);
        else { var sonHero = document.querySelectorAll('body > header.hero, body > section.hero'); sonHero = sonHero[sonHero.length - 1] || bas; sonHero.parentNode.insertBefore(panel, sonHero.nextSibling); }
      } else if(kok) kok.insertBefore(panel, kok.firstChild);
      else document.body.insertBefore(panel, document.body.firstChild);
    }
    sesNotuGuncelle();
    /* Panel ekrandan çıkınca oynatıcı altta sabitlenir */
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(g){
        panel.classList.toggle('sok-panel-gorunmez', !g[0].isIntersecting);
        yuzdur();
      }, { threshold:0 }).observe(yer);
    }
  }
  function yuzdur(){
    if(!oynatici || !panel) return;
    var yuz = !!durum && panel.classList.contains('sok-panel-gorunmez');
    if(yuz && !oynatici.classList.contains('sok-yuzen')) yer.style.minHeight = oynatici.offsetHeight + 'px';
    if(!yuz) yer.style.minHeight = '';
    oynatici.classList.toggle('sok-yuzen', yuz);
    document.documentElement.classList.toggle('sok-oynatici-acik', yuz);
  }

  function oynaticiOlustur(){
    oynatici = document.createElement('div');
    oynatici.className = 'sok-oynatici';
    oynatici.setAttribute('role', 'region');
    oynatici.setAttribute('aria-label', 'Ses oynatıcı');
    oynatici.innerHTML =
      '<div class="sok-o-ust"><span class="sok-o-mod">Hazır</span><b class="sok-o-baslik">Dinlemek için yukarıdan bir seçenek seç</b><span class="sok-o-sayac"></span></div>' +
      '<p class="sok-o-metin" aria-live="off"></p>' +
      '<div class="sok-o-cubuk" role="progressbar" aria-label="İlerleme" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>' +
      '<div class="sok-o-alt">' +
        '<div class="sok-o-dugmeler">' +
          '<button type="button" data-so="geri" class="sok-d" aria-label="Önceki bölüm" title="Önceki bölüm">' + IKON.geri + '</button>' +
          '<button type="button" data-so="oynat" class="sok-d sok-d-ana" aria-label="Başlat">' + IKON.oynat + '<span>Başlat</span></button>' +
          '<button type="button" data-so="ileri" class="sok-d" aria-label="Sonraki bölüm" title="Sonraki bölüm">' + IKON.ileri + '</button>' +
          '<button type="button" data-so="dur" class="sok-d" aria-label="Durdur" title="Durdur">' + IKON.durdur + '</button>' +
        '</div>' +
        '<div class="sok-hiz" role="group" aria-label="Okuma hızı">' +
          CARPANLAR.map(function(c){ return '<button type="button" data-so="hiz" data-c="' + c + '" aria-pressed="false">' + String(c).replace('.', ',') + '×</button>'; }).join('') +
        '</div>' +
        '<button type="button" data-so="takip" class="sok-takip" aria-pressed="true" title="Okunan yeri ekranda takip et">' + IKON.takip + '<span>Takip</span></button>' +
      '</div>';
  }

  function bilgiGoster(t){
    var b = panel && panel.querySelector('.sok-bilgi');
    if(!b) return;
    b.textContent = t || '';
    b.hidden = !t;
  }
  function sesNotuGuncelle(){
    if(!panel) return;
    var not = panel.querySelector('.sok-ses-notu');
    var gerek = !ses && !kayitlar() ? 'Bu tarayıcı sesli okumayı desteklemiyor. Chrome, Edge ya da Safari ile açabilirsin.'
              : (ses && !turkceSes && !kayitlar() && (ses.getVoices() || []).length ? 'Bu cihazda Türkçe ses bulunamadı; okuma farklı bir aksanla yapılabilir. (Edge tarayıcısının doğal Türkçe sesleri en iyi sonucu verir.)' : '');
    if(!gerek){ if(not) not.remove(); return; }
    if(!not){ not = document.createElement('p'); not.className = 'sok-ses-notu'; panel.querySelector('.sok-ust-metin').appendChild(not); }
    not.textContent = gerek;
  }

  function arayuzGuncelle(){
    if(!panel) return;
    var k = simdiki();
    ['tum', 'ezber'].forEach(function(ad){
      var b = panel.querySelector('.sok-secenek[data-so="' + ad + '"]');
      var bu = !!(durum && durum.kaynak === ad);
      b.classList.toggle('sok-aktif', bu);
      b.classList.toggle('sok-duraklatildi', bu && durum.duraklatildi);
      b.setAttribute('aria-pressed', bu ? 'true' : 'false');
      b.querySelector('.sok-s-rozet').textContent = bu ? (durum.duraklatildi ? 'Duraklatıldı' : 'Dinleniyor') : '';
    });
    var ana = oynatici.querySelector('.sok-d-ana');
    var etiket = !durum ? 'Başlat' : durum.duraklatildi ? 'Devam Et' : 'Duraklat';
    ana.innerHTML = (!durum || durum.duraklatildi ? IKON.oynat : IKON.duraklat) + '<span>' + etiket + '</span>';
    ana.setAttribute('aria-label', etiket);
    oynatici.classList.toggle('sok-calisiyor', !!durum && !durum.duraklatildi);
    oynatici.classList.toggle('sok-bos', !durum);
    Array.prototype.forEach.call(oynatici.querySelectorAll('[data-so="hiz"]'), function(b){
      b.setAttribute('aria-pressed', +b.getAttribute('data-c') === carpan ? 'true' : 'false');
    });
    var takip = oynatici.querySelector('.sok-takip');
    takip.setAttribute('aria-pressed', !durum || durum.takip ? 'true' : 'false');
    var mod = oynatici.querySelector('.sok-o-mod'), bas = oynatici.querySelector('.sok-o-baslik'),
        say = oynatici.querySelector('.sok-o-sayac'), mt = oynatici.querySelector('.sok-o-metin'),
        cub = oynatici.querySelector('.sok-o-cubuk');
    if(!durum || !k){
      mod.textContent = 'Hazır'; bas.textContent = 'Dinlemek için yukarıdan bir seçenek seç';
      say.textContent = ''; mt.textContent = ''; cub.querySelector('i').style.width = '0%'; cub.setAttribute('aria-valuenow', '0');
      yuzdur();
      return;
    }
    mod.textContent = durum.kaynak === 'ezber' ? 'Ezber' : 'Tüm sayfa';
    var liste = bolumListesi(), i = suankiBolum(liste), bl = liste[i] || {};
    var ad = k.konu.ezber ? k.konu.ad : (sayfaTuru === 'ka' ? 'Konu ' + k.konu.no + ' · ' : '') + (bl.ad && bl.ad !== 'Giriş' && bl.ad !== k.konu.ad ? k.konu.ad + ' — ' + bl.ad : k.konu.ad);
    bas.textContent = ad;
    say.textContent = (durum.kaynak === 'ezber' ? 'Ezber ' + (durum.ki + 1) + ' / ' + durum.kuyruk.length : 'Bölüm ' + (i + 1) + ' / ' + liste.length);
    var p = k.parcalar[Math.min(durum.pi, k.parcalar.length - 1)];
    mt.textContent = p ? p.t : '';
    var y = Math.round(ilerleme() * 100);
    cub.querySelector('i').style.width = y + '%';
    cub.setAttribute('aria-valuenow', String(y));
    yuzdur();
  }

  function tiklama(e){
    var t = e.target.closest('[data-so]');
    if(!t || !panel || !(panel.contains(t) || oynatici.contains(t))) return;
    var ne = t.getAttribute('data-so');
    e.preventDefault();
    if(ne === 'tum' || ne === 'ezber'){
      if(durum && durum.kaynak === ne){ durum.duraklatildi ? surdur() : duraklat(); return; }
      if(ne === 'ezber' && !ezberSayisi){
        bilgiGoster('Bu sayfada ayrı bir ezber bölümü bulunmuyor. Konunun tamamını "Tüm Sayfayı Dinle" ile dinleyebilirsin.');
        return;
      }
      var kuyruk = ne === 'tum' ? tumKuyrugu() : ezberKuyrugu();
      if(!kuyruk.length){ bilgiGoster('Bu sayfada okunacak konu anlatımı bulunamadı.'); return; }
      baslat(kuyruk, ne);
    } else if(ne === 'oynat'){
      if(!durum){ var kq = tumKuyrugu(); if(kq.length) baslat(kq, 'tum'); return; }
      durum.duraklatildi ? surdur() : duraklat();
    }
    else if(ne === 'dur'){ bitir(); bilgiGoster(''); }
    else if(ne === 'ileri'){ atla(1); }
    else if(ne === 'geri'){ atla(-1); }
    else if(ne === 'hiz'){ carpanSec(parseFloat(t.getAttribute('data-c'))); }
    else if(ne === 'takip'){ if(durum){ durum.takip = !durum.takip; arayuzGuncelle(); } }
  }

  function stilEkle(){
    if(document.getElementById('sok-stil')) return;
    var st = document.createElement('style');
    st.id = 'sok-stil';
    st.textContent = [
      '.sok-panel{--sok-lacivert:#13294b;--sok-mavi:#1d4ed8;--sok-mavi-ac:#e8effd;--sok-mor:#6d28d9;--sok-mor-ac:#f1eafd;--sok-turkuaz:#0b8fa3;',
        '--sok-zemin:#ffffff;--sok-zemin2:#f3f8fb;--sok-kenar:#d6e4ec;--sok-metin:#13294b;--sok-ikincil:#4b5b72;',
        'box-sizing:border-box;width:min(1040px,calc(100% - 24px));margin:18px auto 22px;padding:18px clamp(14px,2.4vw,22px) 16px;',
        'background:linear-gradient(180deg,var(--sok-zemin2),var(--sok-zemin));border:1px solid var(--sok-kenar);border-radius:20px;',
        'box-shadow:0 10px 30px -22px rgba(19,41,75,.45);font-family:Nunito,"Segoe UI",system-ui,sans-serif;color:var(--sok-metin);text-align:left;}',
      '.sok-panel *,.sok-panel *::before{box-sizing:border-box;}',
      '.sok-ust{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;}',
      '.sok-baslik{margin:0;font-size:1.15rem;font-weight:900;letter-spacing:-.01em;color:var(--sok-metin);line-height:1.25;}',
      '.sok-aciklama{margin:3px 0 0;font-size:.9rem;color:var(--sok-ikincil);line-height:1.45;}',
      '.sok-ses-notu{margin:6px 0 0;font-size:.82rem;color:#8a5a00;}',
      '.sok-secenekler{display:grid;grid-template-columns:1fr;gap:10px;}',
      '@media (min-width:600px){.sok-secenekler{grid-template-columns:1fr 1fr;}}',
      '.sok-secenek{position:relative;display:flex;align-items:center;gap:14px;width:100%;min-height:76px;padding:12px 16px;text-align:left;cursor:pointer;',
        'font:inherit;color:var(--sok-metin);background:var(--sok-zemin);border:2px solid var(--sok-kenar);border-radius:16px;',
        'transition:border-color .2s,box-shadow .2s,transform .2s,background-color .2s;}',
      '.sok-secenek:hover{transform:translateY(-1px);box-shadow:0 10px 22px -16px rgba(19,41,75,.5);}',
      '.sok-s-ikon{display:grid;place-items:center;flex-shrink:0;width:54px;height:54px;border-radius:15px;}',
      '.sok-secenek--tum .sok-s-ikon{background:var(--sok-mavi-ac);color:var(--sok-mavi);}',
      '.sok-secenek--ezber .sok-s-ikon{background:var(--sok-mor-ac);color:var(--sok-mor);}',
      '.sok-s-metin{display:flex;flex-direction:column;gap:2px;min-width:0;}',
      '.sok-s-metin b{font-size:1.02rem;font-weight:900;line-height:1.25;}',
      '.sok-s-metin small{font-size:.82rem;font-weight:700;color:var(--sok-ikincil);}',
      '.sok-s-rozet{margin-left:auto;align-self:center;font-size:.72rem;font-weight:900;letter-spacing:.02em;padding:4px 10px;border-radius:999px;color:#fff;opacity:0;transform:scale(.9);transition:opacity .2s,transform .2s;white-space:nowrap;}',
      '.sok-secenek--tum.sok-aktif{border-color:var(--sok-mavi);background:var(--sok-mavi-ac);box-shadow:0 0 0 4px rgba(29,78,216,.14);}',
      '.sok-secenek--ezber.sok-aktif{border-color:var(--sok-mor);background:var(--sok-mor-ac);box-shadow:0 0 0 4px rgba(109,40,217,.14);}',
      '.sok-secenek--tum.sok-aktif .sok-s-rozet{background:var(--sok-mavi);opacity:1;transform:none;}',
      '.sok-secenek--ezber.sok-aktif .sok-s-rozet{background:var(--sok-mor);opacity:1;transform:none;}',
      '.sok-secenek.sok-duraklatildi .sok-s-rozet{background:#64748b !important;}',
      '.sok-secenek.sok-yok{border-style:dashed;}',
      '.sok-secenek.sok-yok .sok-s-ikon{filter:grayscale(.7);opacity:.7;}',
      '.sok-secenek:focus-visible,.sok-oynatici button:focus-visible{outline:3px solid #f0a202;outline-offset:2px;}',
      '.sok-bilgi{margin:10px 0 0;padding:9px 12px;border-radius:12px;background:#fff7e6;border:1px solid #f3d9a4;color:#7a4b00;font-size:.88rem;font-weight:700;line-height:1.4;}',
      '.sok-yer{margin-top:12px;}',
      /* oynatıcı */
      '.sok-oynatici{box-sizing:border-box;display:flex;flex-direction:column;gap:8px;padding:12px 14px;border-radius:16px;',
        'background:#13294b;color:#fff;font-family:Nunito,"Segoe UI",system-ui,sans-serif;text-align:left;}',
      '.sok-oynatici *{box-sizing:border-box;}',
      '.sok-o-ust{display:flex;align-items:center;gap:10px;min-width:0;}',
      '.sok-o-mod{flex-shrink:0;font-size:.7rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.14);}',
      '.sok-calisiyor .sok-o-mod{background:#0b8fa3;}',
      '.sok-o-baslik{flex:1;min-width:0;font-size:.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.sok-o-sayac{flex-shrink:0;font-size:.78rem;font-weight:800;opacity:.8;}',
      '.sok-o-metin{margin:0;min-height:1.4em;font-size:.92rem;line-height:1.45;color:rgba(255,255,255,.88);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}',
      '.sok-bos .sok-o-metin{display:none;}',
      '.sok-o-cubuk{height:6px;border-radius:6px;background:rgba(255,255,255,.18);overflow:hidden;}',
      '.sok-o-cubuk i{display:block;height:100%;width:0;border-radius:6px;background:linear-gradient(90deg,#5eead4,#38bdf8);transition:width .4s ease;}',
      '.sok-o-alt{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;}',
      '.sok-o-dugmeler{display:flex;align-items:center;gap:6px;}',
      '.sok-oynatici button{font:inherit;cursor:pointer;color:#fff;}',
      '.sok-d{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:42px;height:42px;padding:0 10px;border-radius:12px;border:0;background:rgba(255,255,255,.1);}',
      '.sok-d:hover{background:rgba(255,255,255,.2);}',
      '.sok-d-ana{min-width:132px;padding:0 16px;background:#fff;color:#13294b !important;font-weight:900;font-size:.95rem;}',
      '.sok-d-ana:hover{background:#e0f2fe;}',
      '.sok-hiz{display:inline-flex;padding:3px;border-radius:12px;background:rgba(255,255,255,.1);}',
      '.sok-hiz button{border:0;background:transparent;font-size:.82rem;font-weight:800;padding:7px 9px;border-radius:9px;min-width:44px;}',
      '.sok-hiz button[aria-pressed="true"]{background:#fff;color:#13294b;}',
      '.sok-takip{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 12px;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:transparent;font-size:.82rem;font-weight:800;margin-left:auto;}',
      '.sok-takip[aria-pressed="false"]{opacity:.6;}',
      '.sok-oynatici.sok-yuzen{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:95;width:min(760px,calc(100vw - 16px));box-shadow:0 18px 40px -12px rgba(2,8,23,.55);}',
      '.sok-yuzen .sok-o-metin{-webkit-line-clamp:1;}',
      'html.sok-oynatici-acik body{padding-bottom:170px;}',
      '.sok-okunuyor{background:rgba(11,143,163,.13) !important;box-shadow:-4px 0 0 #0b8fa3;border-radius:4px;transition:background .2s;}',
      '@media (max-width:599px){',
        '.sok-panel{width:calc(100% - 16px);border-radius:16px;padding:14px 12px;}',
        '.sok-secenek{min-height:66px;padding:10px 12px;gap:12px;}',
        '.sok-s-ikon{width:46px;height:46px;border-radius:13px;}',
        '.sok-o-alt{gap:8px;}',
        '.sok-o-dugmeler{width:100%;}',
        '.sok-d-ana{flex:1;min-width:0;}',
        '.sok-hiz{flex:1;}',
        '.sok-hiz button{flex:1;min-width:0;}',
        '.sok-takip{margin-left:0;}',
        '.sok-oynatici.sok-yuzen{bottom:76px;}',
        '.sok-s-rozet{position:absolute;top:7px;right:9px;font-size:.66rem;padding:3px 8px;}',
        'html.sok-oynatici-acik body{padding-bottom:230px;}',
        '.sok-yuzen .sok-hiz,.sok-yuzen .sok-takip{display:none;}',
      '}',
      '@media (prefers-reduced-motion:reduce){.sok-secenek,.sok-o-cubuk i,.sok-s-rozet{transition:none;}.sok-secenek:hover{transform:none;}}',
      ':root[data-tema="dark"] .sok-panel{--sok-zemin:#0f1a2e;--sok-zemin2:#13213a;--sok-kenar:#2a3b5c;--sok-metin:#e6edf7;--sok-ikincil:#a9b8cf;--sok-mavi-ac:#17305e;--sok-mor-ac:#2e1f57;--sok-mavi:#93b4ff;--sok-mor:#c4a8ff;}',
      ':root[data-tema="dark"] .sok-bilgi{background:#3a2b0b;border-color:#6b4e12;color:#ffd892;}',
      '@media print{.sok-panel,.sok-oynatici{display:none !important;}}'
    ].join('');
    document.head.appendChild(st);
  }

  function kur(){
    konular = konulariBul();
    if(konular.length){
      sayfaTuru = 'ka'; aktifAtla = ATLA;
      konular.forEach(function(k){ try{ k.parcalar = konuMetni(k); }catch(e){ k.parcalar = [{ t:k.ad, el:k.el, b:0 }]; k.parcalar.bolumler = [{ ilk:0, son:0, i:0 }]; } });
    } else {
      sayfaTuru = 'genel'; aktifAtla = ATLA_GENEL;
      konular = genelKonulariBul();
    }
    if(!konular.length) return;
    stilEkle();
    panelOlustur();
    arayuzGuncelle();
    document.addEventListener('click', tiklama);
    document.addEventListener('keydown', function(e){
      if(!durum || e.key !== 'Escape') return;
      bitir();
    });
    /* Sure/dua (hafız) dinleme başlarsa konu okumasını duraklat */
    document.addEventListener('click', function(e){
      if(durum && !durum.duraklatildi && e.target.closest('.sd-btn')) duraklat('Sure/dua kaydı başladığı için dinleme duraklatıldı.');
    }, true);
    /* Sayfadan çıkınca okuma durur */
    window.addEventListener('pagehide', function(){ if(durum) bitir(); else if(ses) ses.cancel(); });
    window.addEventListener('beforeunload', function(){ if(durum) bitir(); });
    /* Test/hata ayıklama */
    window.sesliOkuma = {
      tur:function(){ return sayfaTuru; },
      tumMetin:function(){ return tumKuyrugu().map(function(g){ return g.parcalar.slice(girisBas(g), girisSon(g) + 1).map(function(p){ return p.t; }); }); },
      ezberMetin:function(){ return ezberKuyrugu().map(function(g){ return g.parcalar.map(function(p){ return p.t; }); }); },
      durum:function(){ return durum ? { kaynak:durum.kaynak, ki:durum.ki, pi:durum.pi, duraklatildi:durum.duraklatildi, toplam:durum.toplam } : null; }
    };
    window.konuDinleBolumleri = function(no){
      var k = konular.filter(function(x){ return x.no === String(no); })[0];
      if(!k || k.genel) return null;
      var pr = konuMetni(k);
      return pr.bolumler.map(function(b){ return { ad:b.ad, metin:pr.slice(b.ilk, b.son + 1).map(function(p){ return p.t; }) }; });
    };
    window.konuDinleMetni = function(no){
      var k = konular.filter(function(x){ return x.no === String(no); })[0];
      return k ? (k.genel ? genelKonuMetni(k) : konuMetni(k)).map(function(p){ return p.t; }) : null;
    };
  }

  /* 4–8: portal-nav.js ünite başlığını ve bölüm menüsünü kurduktan sonra çalış;
     hazır ses kayıtlarının listesi (ortak/ses/konu/sN-uM.js) varsa önce o yüklenir. */
  function bekleVeKur(){
    var pn = document.getElementById('portalNav');
    var sinif = pn && pn.getAttribute('data-sinif'), unite = pn && (pn.getAttribute('data-unite') || '1');
    if(!sinif){ setTimeout(kur, 120); return; }
    sayfaKimligi = 's' + sinif + '-u' + unite;
    var bitti = false;
    function devam(){ if(bitti) return; bitti = true; kur(); }
    var sc = document.createElement('script');
    sc.src = KAYIT_KLASORU + sayfaKimligi + '.js';
    sc.onload = sc.onerror = function(){ setTimeout(devam, 0); };
    document.head.appendChild(sc);
    setTimeout(devam, 3000);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bekleVeKur);
  else bekleVeKur();
})();
