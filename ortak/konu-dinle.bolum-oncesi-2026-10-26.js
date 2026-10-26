/* ======================================================================
   KONUYU DİNLE — 4.–8. sınıf "konuyu-ogren" sayfaları
   ----------------------------------------------------------------------
   Her konu anlatımının başına (konu afişinin hemen altına) bir "Konuyu
   Dinle" alanı ekler; ünite başlığına "Tüm üniteyi dinle" düğmesi koyar.
   Dinleme sürerken ekranın altında küçük bir oynatıcı görünür:
   önceki/sonraki paragraf, duraklat/sürdür, durdur, okuma hızı.

   • Okunan metin sayfanın KENDİ konu anlatımıdır (konu afişinden bir
     sonraki konunun afişine kadar olan başlıklar, paragraflar, maddeler).
     Testler, oyunlar, şıklar, yazma alanları, fotoğraf altı yazıları,
     kaynak/kazanım satırları ve sure–dua okunuş tabloları okunmaz
     (sure ve dualar için sure-dinle.js'deki hafız kaydı kullanılır).
   • Ses: tarayıcının Türkçe sesi (Web Speech API). Bilgisayarda kurulu
     Türkçe ses internetsiz çalışır; Edge'in "doğal" sesleri internet ister
     ve varsa önceliklidir. Türkçe ses yoksa öğrenci uyarılır.
   • Sayfanın HTML'ine dokunmaz; yalnızca düğme ve vurgu ekler.
   • portal-nav.js tarafından yalnızca data-asama="ogren" sayfalarında
     yüklenir. Hız tercihi bu cihazda 'dkab_dinle_hiz' anahtarında tutulur.
====================================================================== */
(function(){
  'use strict';
  if(window.__konuDinle) return;
  window.__konuDinle = true;

  var ses = window.speechSynthesis || null;
  var HIZLAR = [0.8, 0.95, 1.1, 1.25];
  var LS_HIZ = 'dkab_dinle_hiz';

  function oku(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function yaz(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function kacis(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function metin(el){ return (el && el.textContent || '').replace(/\s+/g, ' ').trim(); }

  var hiz = parseFloat(oku(LS_HIZ));
  if(HIZLAR.indexOf(hiz) < 0) hiz = 0.95;

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
    document.querySelectorAll('.kd-not-ses').forEach(function(n){ n.hidden = !!turkceSes; });
  }
  if(ses){ sesSec(); if('onvoiceschanged' in ses) ses.addEventListener('voiceschanged', sesSec); }

  /* ---------- Okunacak metni toplama ---------- */
  var ATLA = [
    'script','style','noscript','svg','button','select','textarea','input','label','table','figure','figcaption',
    'nav','[hidden]','[aria-hidden="true"]',
    '.ka-konu-gorsel','.kt-bolum','.hk-bolum','.yg-panel','.ys-panel','.kd-bolum','.akd-kutu','.ke-motor',
    '.bk-panel','.sd-cubuk','.kd-alan','.ogr-ozet-ust','.ogr-modul-no','.ogr-modul-sure','.kavram-harita-aciklama',
    '[class*="kazanim"]','[class*="secenek"]','[class*="soru"]','[class*="test"]',
    '[class*="oyun"]','[class*="quiz"]','.zb-cevap-not','[class*="cevap-alan"]','[class*="okunus"]','[class*="kaynak"]','[class*="secim"]',
    '[class*="mk-"]','[class*="mini-kontrol"]','[class*="sunum"]','[class*="gorev"]'
  ].join(',');
  var BLOK = 'h2,h3,h4,h5,p,li,blockquote,dt,dd,.ka-krs-sut,.ka-alt-kart,.kavram-harita';
  /* Bir bloğun içinde okunmayacak küçük parçalar (rozet, düğme, simge) */
  var IC_ATLA = '.ka-rozet,.ka-alt-gorsel,.ka-krs-ikon,button,svg,sup,.sd-btn,.sd-not,[aria-hidden="true"]';
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
          if(e.closest(ATLA) && x.contains(e.closest(ATLA))) return NodeFilter.FILTER_REJECT;
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
    if(el.closest(ATLA)) return false;
    for(var i = 0; i < ekCalismalar.length; i++){ if(ekCalismalar[i].contains(el)) return false; }
    if(el.closest('.kd-cubuk, .kd-oynatici')) return false;
    var t = blokMetni(el);
    if(t.replace(/[\s.:,]/g, '').length < 2) return false;
    if(/^(Kaynak|Fotoğraf|Görsel|Kazanım|MEB Kazanım)/i.test(t)) return false;
    return true;
  }

  /* Konu afişinden bir sonraki konunun afişine kadar olan bloklar */
  function konuMetni(k){
    var aralik = document.createRange();
    aralik.setStartAfter(k.el);
    if(k.bitis === k.bolum) aralik.setEnd(k.bolum, k.bolum.childNodes.length);
    else aralik.setEndBefore(k.bitis);
    var adaylar = Array.prototype.filter.call(k.bolum.querySelectorAll(BLOK), function(el){
      return aralik.intersectsNode(el) && !k.el.contains(el) && okunurMu(el);
    });
    /* İç içe bloklarda (li içinde p gibi) yalnızca en dıştaki okunur */
    adaylar = adaylar.filter(function(el){
      var u = el.parentElement;
      while(u && u !== k.bolum){ if(adaylar.indexOf(u) >= 0) return false; u = u.parentElement; }
      return true;
    });
    var parcalar = [{ t:'Konu ' + k.no + '. ' + sadelestir(k.ad) + '.', el:k.el }];
    var onceki = '';
    adaylar.forEach(function(el){
      var t = sadelestir(blokMetni(el));
      if(!t || karsilastir(t) === karsilastir(onceki)) return;   /* tekrarları atla */
      if(karsilastir(t) === karsilastir(k.ad)) return;            /* konu başlığı zaten okundu */
      onceki = t;
      cumlelere(t).forEach(function(c){ parcalar.push({ t:c, el:el }); });
    });
    return parcalar;
  }

  function sureTahmini(parcalar){
    var harf = parcalar.reduce(function(s, p){ return s + p.t.length; }, 0);
    return Math.max(1, Math.round(harf / (13 * hiz) / 60));
  }

  /* ---------- Oynatma ---------- */
  var durum = null;   /* { kuyruk:[{konu, parcalar}], ki, pi, calisiyor, duraklatildi } */
  var bizimIptal = false;

  function digerSesleriDurdur(){
    /* sure-dinle.js çalıyorsa kendi düğmesiyle durdur */
    var aktif = document.querySelector('.sd-btn.sd-aktif');
    if(aktif) aktif.click();
  }

  var vurgulu = null;
  function vurgula(el){
    if(vurgulu) vurgulu.classList.remove('kd-okunuyor');
    vurgulu = el || null;
    if(!el) return;
    el.classList.add('kd-okunuyor');
    if(durum && durum.takip){
      var r = el.getBoundingClientRect();
      var ust = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ks-sabit-h'), 10) || 0;
      if(r.top < ust + 10 || r.bottom > window.innerHeight - 90){
        window.scrollTo({ top:Math.max(0, r.top + window.pageYOffset - ust - 24), behavior:'smooth' });
      }
    }
  }

  function bolumuAc(konu){
    var sec = konu.el.closest('main section');
    if(sec && !sec.classList.contains('aktif')){
      var dugmeler = document.querySelectorAll('#oyun-gruplari button[onclick]');
      for(var i = 0; i < dugmeler.length; i++){
        if((dugmeler[i].getAttribute('onclick') || '').indexOf("goster('" + sec.id + "'") >= 0){ dugmeler[i].click(); return; }
      }
      sec.classList.add('aktif');
    }
  }

  function simdiki(){ return durum && durum.kuyruk[durum.ki]; }
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
    if(!k){ bitir(); return; }
    if(durum.pi >= k.parcalar.length){
      durum.ki++; durum.pi = 0;
      if(!simdiki()){ bitir(); return; }
      bolumuAc(simdiki().konu);
      arayuzGuncelle();
      planla(400);
      return;
    }
    var p = k.parcalar[durum.pi];
    vurgula(p.el);
    arayuzGuncelle();
    var u = new SpeechSynthesisUtterance(p.t);
    u.lang = 'tr-TR'; u.rate = hiz; u.pitch = 1;
    if(turkceSes) u.voice = turkceSes;
    var kimlik = durum.sayac = (durum.sayac || 0) + 1;
    u.onend = function(){
      if(!durum || durum.sayac !== kimlik || durum.duraklatildi) return;
      durum.pi++; planla(120);
    };
    u.onerror = function(e){
      if(!durum || durum.sayac !== kimlik) return;
      if(bizimIptal){ return; }
      /* Başka bir okuma (ör. sure dinleme) sesi kestiyse dinlemeyi bitir */
      if(e && (e.error === 'interrupted' || e.error === 'canceled')){ bitir(); return; }
      durum.pi++; planla(120);
    };
    bizimIptal = false;
    ses.speak(u);
  }

  function iptalEt(){
    clearTimeout(zamanlayici);
    bizimIptal = true;
    if(ses) ses.cancel();
    setTimeout(function(){ bizimIptal = false; }, 60);
  }

  function baslat(kuyruk, kaynak){
    if(!ses || !kuyruk.length) return;
    digerSesleriDurdur();
    iptalEt();
    durum = { kuyruk:kuyruk, ki:0, pi:0, duraklatildi:false, takip:true, kaynak:kaynak };
    bolumuAc(kuyruk[0].konu);
    oynaticiGoster(true);
    planla(80);
  }
  function duraklat(){
    if(!durum) return;
    durum.duraklatildi = true; iptalEt(); arayuzGuncelle();
  }
  function surdur(){
    if(!durum) return;
    digerSesleriDurdur();
    durum.duraklatildi = false; arayuzGuncelle(); konus();
  }
  function bitir(){
    iptalEt();
    durum = null;
    vurgula(null);
    oynaticiGoster(false);
    arayuzGuncelle();
  }
  function atla(yon){
    if(!durum) return;
    var k = simdiki(); if(!k) return;
    /* Paragraf (blok) bazında ileri/geri */
    var el = k.parcalar[Math.min(durum.pi, k.parcalar.length - 1)].el, i = durum.pi;
    if(yon > 0){ while(i < k.parcalar.length && k.parcalar[i].el === el) i++; }
    else {
      while(i > 0 && k.parcalar[i - 1].el === el) i--;
      if(i > 0){ var oe = k.parcalar[i - 1].el; i--; while(i > 0 && k.parcalar[i - 1].el === oe) i--; }
      else if(durum.ki > 0){ durum.ki--; i = 0; }
    }
    durum.pi = i;
    iptalEt();
    var devam = !durum.duraklatildi;
    durum.duraklatildi = false;
    if(devam) planla(80); else { durum.duraklatildi = true; arayuzGuncelle(); var p = simdiki() && simdiki().parcalar[durum.pi]; if(p) vurgula(p.el); }
  }
  function hizDegistir(){
    hiz = HIZLAR[(HIZLAR.indexOf(hiz) + 1) % HIZLAR.length];
    yaz(LS_HIZ, String(hiz));
    if(durum && !durum.duraklatildi){ iptalEt(); planla(80); }
    arayuzGuncelle();
  }
  function hizEtiketi(){ return '×' + String(hiz).replace('.', ','); }

  /* ---------- Arayüz ---------- */
  function svg(yol){ return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' + yol + '</svg>'; }
  var IKON = {
    hoparlor: svg('<path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>'),
    oynat: svg('<path fill="currentColor" d="M7 4.5v15l13-7.5z"/>'),
    duraklat: svg('<path fill="currentColor" d="M6 4h4.5v16H6zM13.5 4H18v16h-4.5z"/>'),
    geri: svg('<path fill="currentColor" d="M5 5h2.5v14H5zM20 5v14L9 12z"/>'),
    ileri: svg('<path fill="currentColor" d="M16.5 5H19v14h-2.5zM4 5v14l11-7z"/>'),
    kapat: svg('<path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/>'),
    kulaklik: svg('<path fill="none" stroke="currentColor" stroke-width="2" d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="5" height="7" rx="2" fill="currentColor"/><rect x="16" y="14" width="5" height="7" rx="2" fill="currentColor"/>')
  };
  var konular = [];
  var oynatici = null;

  function konuSerit(k){
    var parcalar = konuMetni(k);
    k.parcalar = parcalar;
    var serit = document.createElement('div');
    serit.className = 'kd-cubuk';
    serit.setAttribute('role', 'group');
    serit.setAttribute('aria-label', 'Konu ' + k.no + ' dinleme');
    serit.innerHTML =
      '<button type="button" class="kd-dinle" data-kd="konu" data-kd-no="' + kacis(k.no) + '" aria-pressed="false">' +
        '<span class="kd-ikon" aria-hidden="true">' + IKON.hoparlor + '</span><span class="kd-etiket">Konuyu Dinle</span></button>' +
      '<span class="kd-bilgi">Konu ' + kacis(k.no) + ' · yaklaşık ' + sureTahmini(parcalar) + ' dk</span>' +
      (ses ? '<span class="kd-not kd-not-ses"' + (turkceSes ? ' hidden' : '') + '>Bu bilgisayarda Türkçe ses bulunamadı; okuma farklı bir aksanla yapılabilir.</span>'
           : '<span class="kd-not">Bu tarayıcı sesli okumayı desteklemiyor. Chrome veya Edge ile açabilirsiniz.</span>');
    if(!ses) serit.querySelector('.kd-dinle').disabled = true;
    k.el.parentNode.insertBefore(serit, k.el.nextSibling);
    k.serit = serit;
  }

  function heroDugmesi(){
    var meta = document.querySelector('.ka-hero .ks-hero-meta') || document.querySelector('.ka-hero .ka-hero-metin');
    if(!meta || !konular.length || meta.querySelector('.kd-hepsi')) return;
    var dk = konular.reduce(function(s, k){ return s + sureTahmini(k.parcalar); }, 0);
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'kd-hepsi'; b.setAttribute('data-kd', 'hepsi');
    b.innerHTML = IKON.kulaklik + ' Tüm üniteyi dinle <small>~' + dk + ' dk</small>';
    if(!ses) b.disabled = true;
    var basla = meta.querySelector('.ks-hero-basla');
    if(basla) meta.insertBefore(b, basla); else meta.appendChild(b);
  }

  function oynaticiOlustur(){
    oynatici = document.createElement('div');
    oynatici.className = 'kd-oynatici';
    oynatici.setAttribute('role', 'region');
    oynatici.setAttribute('aria-label', 'Sesli okuma oynatıcısı');
    oynatici.hidden = true;
    oynatici.innerHTML =
      '<div class="kd-o-bilgi"><span class="kd-o-dalga" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<span class="kd-o-metin"><b class="kd-o-baslik"></b><span class="kd-o-ilerleme"></span></span></div>' +
      '<div class="kd-o-dugmeler">' +
        '<button type="button" data-kd="geri" aria-label="Önceki paragraf" title="Önceki paragraf">' + IKON.geri + '</button>' +
        '<button type="button" data-kd="oynat" class="kd-o-ana" aria-label="Duraklat" title="Duraklat">' + IKON.duraklat + '</button>' +
        '<button type="button" data-kd="ileri" aria-label="Sonraki paragraf" title="Sonraki paragraf">' + IKON.ileri + '</button>' +
        '<button type="button" data-kd="hiz" class="kd-o-hiz" aria-label="Okuma hızı" title="Okuma hızı"></button>' +
        '<button type="button" data-kd="takip" class="kd-o-takip" aria-pressed="true" title="Okunan yeri ekranda takip et">Takip</button>' +
        '<button type="button" data-kd="dur" aria-label="Dinlemeyi bitir" title="Dinlemeyi bitir">' + IKON.kapat + '</button>' +
      '</div>' +
      '<div class="kd-o-cubuk" aria-hidden="true"><i></i></div>';
    document.body.appendChild(oynatici);
  }
  function oynaticiGoster(acik){
    if(!oynatici) return;
    oynatici.hidden = !acik;
    document.documentElement.classList.toggle('kd-oynatici-acik', !!acik);
  }

  function arayuzGuncelle(){
    var k = simdiki();
    konular.forEach(function(x){
      if(!x.serit) return;
      var b = x.serit.querySelector('.kd-dinle');
      var bu = !!(k && k.konu === x);
      x.serit.classList.toggle('kd-aktif', bu);
      b.setAttribute('aria-pressed', bu ? 'true' : 'false');
      b.querySelector('.kd-etiket').textContent = bu ? (durum.duraklatildi ? 'Sürdür' : 'Duraklat') : 'Konuyu Dinle';
      b.querySelector('.kd-ikon').innerHTML = bu ? (durum.duraklatildi ? IKON.oynat : IKON.duraklat) : IKON.hoparlor;
    });
    var hepsi = document.querySelector('.kd-hepsi');
    if(hepsi) hepsi.classList.toggle('kd-aktif', !!(durum && durum.kaynak === 'hepsi'));
    if(!oynatici || !k) return;
    oynatici.querySelector('.kd-o-baslik').textContent = 'Konu ' + k.konu.no + ': ' + k.konu.ad;
    oynatici.querySelector('.kd-o-ilerleme').textContent =
      (durum.duraklatildi ? 'Duraklatıldı · ' : '') + Math.min(durum.pi + 1, k.parcalar.length) + ' / ' + k.parcalar.length +
      (durum.kuyruk.length > 1 ? ' · ' + (durum.ki + 1) + '. konu / ' + durum.kuyruk.length : '');
    var ana = oynatici.querySelector('.kd-o-ana');
    ana.innerHTML = durum.duraklatildi ? IKON.oynat : IKON.duraklat;
    ana.setAttribute('aria-label', durum.duraklatildi ? 'Sürdür' : 'Duraklat');
    ana.title = ana.getAttribute('aria-label');
    oynatici.classList.toggle('kd-duraklatildi', !!durum.duraklatildi);
    oynatici.querySelector('.kd-o-hiz').textContent = hizEtiketi();
    var takip = oynatici.querySelector('.kd-o-takip');
    takip.setAttribute('aria-pressed', durum.takip ? 'true' : 'false');
    oynatici.querySelector('.kd-o-cubuk i').style.width = Math.round(100 * Math.min(durum.pi + 1, k.parcalar.length) / k.parcalar.length) + '%';
  }

  function tiklama(e){
    var t = e.target.closest('[data-kd]');
    if(!t) return;
    var ne = t.getAttribute('data-kd');
    e.preventDefault();
    if(ne === 'konu'){
      var no = t.getAttribute('data-kd-no');
      var k = simdiki();
      if(k && k.konu.no === no){ durum.duraklatildi ? surdur() : duraklat(); return; }
      var konu = konular.filter(function(x){ return x.no === no; })[0];
      if(konu) baslat([{ konu:konu, parcalar:konuMetni(konu) }], 'konu');
    } else if(ne === 'hepsi'){
      if(durum && durum.kaynak === 'hepsi'){ durum.duraklatildi ? surdur() : duraklat(); return; }
      baslat(konular.map(function(x){ return { konu:x, parcalar:konuMetni(x) }; }), 'hepsi');
    } else if(ne === 'oynat'){ if(durum) durum.duraklatildi ? surdur() : duraklat(); }
    else if(ne === 'dur'){ bitir(); }
    else if(ne === 'ileri'){ atla(1); }
    else if(ne === 'geri'){ atla(-1); }
    else if(ne === 'hiz'){ hizDegistir(); }
    else if(ne === 'takip'){ if(durum){ durum.takip = !durum.takip; arayuzGuncelle(); } }
  }

  function stilEkle(){
    if(document.getElementById('kd-stil')) return;
    var st = document.createElement('style');
    st.id = 'kd-stil';
    st.textContent = [
      '.kd-cubuk{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;margin:10px 0 14px;padding:10px 12px;',
        'background:#eef6f8;border:1px solid #cfe6ea;border-radius:10px;font-family:Nunito,system-ui,sans-serif;}',
      '.kd-dinle{display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:14.5px;font-weight:800;cursor:pointer;',
        'color:#fff;background:#13294b;border:0;border-radius:999px;padding:8px 16px;min-height:38px;}',
      '.kd-dinle:hover{background:#1f4f8f;}',
      '.kd-dinle:focus-visible,.kd-hepsi:focus-visible,.kd-oynatici button:focus-visible{outline:3px solid #0b8fa3;outline-offset:2px;}',
      '.kd-dinle:disabled{opacity:.5;cursor:not-allowed;}',
      '.kd-cubuk.kd-aktif{background:#e3f4f6;border-color:#0b8fa3;}',
      '.kd-cubuk.kd-aktif .kd-dinle{background:#0b8fa3;color:#04141a;}',
      '.kd-bilgi{font-size:13px;font-weight:700;color:#556274;}',
      '.kd-not{flex-basis:100%;font-size:12.5px;color:#8a5a00;}',
      '.kd-hepsi{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:14px;font-weight:800;cursor:pointer;',
        'color:#13294b;background:#fff;border:1.5px solid #13294b;border-radius:10px;padding:8px 14px;}',
      '.kd-hepsi small{font-weight:700;opacity:.7;}','.kd-ikon{display:inline-flex;}',
      '.kd-hepsi:hover{background:#eef2f7;}',
      '.kd-hepsi.kd-aktif{background:#e3f4f6;border-color:#0b8fa3;color:#08707f;}',
      ':root[data-tema="dark"] .kd-hepsi{background:transparent;color:#c4d2ef;border-color:#c4d2ef;}',
      ':root[data-tema="dark"] .kd-hepsi.kd-aktif{color:#5fc7d4;border-color:#5fc7d4;}',
      '.kd-okunuyor{background:rgba(11,143,163,.13) !important;box-shadow:-4px 0 0 #0b8fa3;border-radius:4px;transition:background .2s;}',
      '.kd-oynatici{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:90;width:min(640px,calc(100vw - 24px));',
        'display:grid;grid-template-columns:1fr auto;align-items:center;gap:6px 12px;padding:10px 12px 12px 14px;',
        'background:#13294b;color:#fff;border-radius:14px;box-shadow:0 10px 30px rgba(19,41,75,.35);font-family:Nunito,system-ui,sans-serif;}',
      '.kd-oynatici[hidden]{display:none;}',
      '.kd-o-bilgi{display:flex;align-items:center;gap:10px;min-width:0;}',
      '.kd-o-metin{display:flex;flex-direction:column;min-width:0;}',
      '.kd-o-baslik{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.kd-o-ilerleme{font-size:12px;opacity:.8;}',
      '.kd-o-dalga{display:inline-flex;align-items:flex-end;gap:2px;height:16px;flex:none;}',
      '.kd-o-dalga i{width:3px;height:6px;background:#5fc7d4;border-radius:2px;animation:kdDalga 1s ease-in-out infinite;}',
      '.kd-o-dalga i:nth-child(2){animation-delay:.2s}.kd-o-dalga i:nth-child(3){animation-delay:.4s}',
      '.kd-duraklatildi .kd-o-dalga i{animation:none;height:4px;}',
      '@keyframes kdDalga{0%,100%{height:4px}50%{height:16px}}',
      '@media (prefers-reduced-motion:reduce){.kd-o-dalga i{animation:none}}',
      '.kd-o-dugmeler{display:flex;align-items:center;gap:4px;}',
      '.kd-oynatici button{display:inline-flex;align-items:center;justify-content:center;font:inherit;font-size:15px;font-weight:800;color:#fff;background:rgba(255,255,255,.1);border:0;',
        'border-radius:8px;min-width:36px;height:36px;padding:0 8px;cursor:pointer;}',
      '.kd-oynatici button:hover{background:rgba(255,255,255,.2);}',
      '.kd-oynatici .kd-o-ana{background:#0b8fa3;color:#04141a;min-width:42px;}',
      '.kd-oynatici .kd-o-hiz,.kd-oynatici .kd-o-takip{font-size:12.5px;}',
      '.kd-oynatici .kd-o-takip[aria-pressed="false"]{opacity:.55;text-decoration:line-through;}',
      '.kd-o-cubuk{grid-column:1/-1;height:3px;background:rgba(255,255,255,.15);border-radius:3px;overflow:hidden;}',
      '.kd-o-cubuk i{display:block;height:100%;width:0;background:#5fc7d4;transition:width .3s;}',
      ':root[data-tema="dark"] .kd-oynatici{background:#1c293e;border:1px solid #25344c;}',
      'html.kd-oynatici-acik .ks-alt{padding-bottom:110px;}',
      '@media (max-width:560px){.kd-oynatici{grid-template-columns:1fr;bottom:8px;}',
        '.kd-o-dugmeler{justify-content:space-between;}.kd-oynatici button{min-width:40px;height:40px;}}',
      '@media print{.kd-cubuk,.kd-oynatici,.kd-hepsi{display:none !important;}}'
    ].join('');
    document.head.appendChild(st);
  }

  function kur(){
    konular = konulariBul();
    if(!konular.length) return;
    stilEkle();
    konular.forEach(function(k){ try{ konuSerit(k); }catch(e){ if(window.console) console.warn('konu-dinle:', k.no, e); } });
    heroDugmesi();
    oynaticiOlustur();
    document.addEventListener('click', tiklama);
    document.addEventListener('keydown', function(e){
      if(!durum || e.key !== 'Escape') return;
      bitir();
    });
    /* Sure/dua dinleme başlarsa konu okumasını kapat */
    document.addEventListener('click', function(e){ if(durum && e.target.closest('.sd-btn')) bitir(); }, true);
    window.addEventListener('pagehide', function(){ if(ses) ses.cancel(); });
    /* Test/hata ayıklama için: okunacak metni görmek */
    window.konuDinleMetni = function(no){
      var k = konular.filter(function(x){ return x.no === String(no); })[0];
      return k ? konuMetni(k).map(function(p){ return p.t; }) : null;
    };
  }

  /* portal-nav.js ünite başlığını ve bölüm menüsünü kurduktan sonra çalış */
  function bekleVeKur(){ setTimeout(kur, 60); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bekleVeKur);
  else bekleVeKur();
})();
