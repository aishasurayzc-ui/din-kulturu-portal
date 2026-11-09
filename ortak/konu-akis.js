/* ======================================================================
   KONU AKIŞI — fotoğraflı dikey öğrenme akışı (2026-11-09)
   ----------------------------------------------------------------------
   "Konuyu Öğren" sayfasını dergi / dikey akış görünümünde sunar.
   ortak/ders-akisi.js konuları adımlara ayırdıktan sonra yüklenir;
   fotoğraflar ortak/konu-sahne-veri.js'ten (KONU_SAHNE) gelir.

   KURALLAR
   • Sayfa içeriği taşınmaz, kopyalanmaz, silinmez: etkinlikler, sesli
     dinleme, testler aynen çalışır. Görünüm html.akis-kok sınıfıyla
     değişir; "Klasik görünüm" bu sınıfı kaldırır (tercih hatırlanır).
   • Eklenen yazılar (büyük konu başlığı, etiketler) CSS ile çizilir
     (data-t → ::before); sayfa metnine yazı eklenmez → sesli dinleme
     ve okuma süresi değişmez. Gerçek konu başlığı ekran okuyucular için
     yerinde kalır.
   • Fotoğraf yüklenemezse kırık görsel yerine renkli yedek zemin kalır.
   • prefers-reduced-motion: belirme animasyonları kapalı.
   Önek: akis-
====================================================================== */
(function(){
'use strict';
if(window.__konuAkis) return;
window.__konuAkis = true;

var BURASI = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');
var KOK_URL = BURASI + '../';
var LS = 'dkab_konu_gorunum';
var RENKLER = ['#1f6fb2', '#0e8a7e', '#7a4cc2', '#c2410c', '#be123c', '#2b4f86', '#0b8fa3', '#8a5a00'];
var ETKILESIMLI = 'button, input, select, textarea, audio, video, iframe, [onclick], [contenteditable]';

function kac(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function hareketAz(){ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
function oku(){ try{ return localStorage.getItem(LS); }catch(e){ return null; } }
function yaz(v){ try{ localStorage.setItem(LS, v); }catch(e){} }
function sayfaAnahtari(){ var m = document.getElementById('portalNav'); return m ? 's' + m.dataset.sinif + '-u' + (m.dataset.unite || '1') : ''; }
function yazi(cls, t){ return '<span class="' + cls + '" data-t="' + kac(t) + '" aria-hidden="true"></span>'; }

/* konu-sahne ile aynı süzgeç: fotoğraf eşlemelerindeki "bas" sırası buna göredir */
function uygunParca(el){
  if(/(^|\s)(dak-|ksx-|sok-|kd-|od-|konu-illustrasyon|akis-)/.test(String(el.className))) return false;
  if(el.matches(ETKILESIMLI) || el.querySelector(ETKILESIMLI)) return false;
  return (el.textContent || '').replace(/\s+/g, ' ').trim().length >= 3 || !!el.querySelector('img, svg, table');
}

/* parça türü → kart biçimi */
function tur(el){
  var c = String(el.className || ''), t = (el.textContent || '').replace(/\s+/g, ' ').trim();
  /* birden çok başlıklı kutu içeren panel: nötr kart (içindeki kutular kendi renklerini korur) */
  if(el.querySelectorAll('h3, h4, h5, .zb-kutu, .ka-blok, .kutu-panel').length >= 3) return 'diger';
  if(/(^|\s)(zb-ayet|zb-hadis|ak-hadis|ka-ayet|ka-hadis)(\s|$)/.test(c) || /^(📖\s*)?(Ayet|Hadis(-i Şerif)?)\s*:/.test(t)) return 'ayet';
  if(/(^|\s)(ka-karsilastirma-semasi|ka-vs-semasi)(\s|$)/.test(c) || /Yanlış Bilinen/.test(t.slice(0, 40))) return 'karsilastirma';
  if(/ka-gunluk-hayat/.test(c) || /^(🏠|🌍)?\s*(Günlük Hayat|Gerçek Hayat)/.test(t)) return 'gunluk';
  if(/(^|\s)(ka-aklinda|ka-aklinda-kalsin|zb-unutma)(\s|$)/.test(c) || /^(📌\s*)?(Aklında Kalsın|Unutma)/.test(t) || /^Değer\s*—/.test(t)) return 'onemli';
  if(/(^|\s)(zb-merak|ka-dusun|ka-dusun-cevapla|zb-dusun)(\s|$)/.test(c) || /^(🤔|💭)?\s*(Merak Ettin mi|Sıra Sende|Düşün)/.test(t)) return 'soru';
  if(/(^|\s)(ak-bolum|kavram-kart-izgara|zb-kavram|ka-kavram|ka-kavramlar|esma-gorsel)(\s|$)/.test(c)) return 'kavram';
  if(/(^|\s)(ka-surec-semasi|ka-kavram-haritasi|kavram-harita-panel|ka-zaman-semasi|ka-daire-semasi|ka-akis-semasi|ka-ozet-panosu)(\s|$)/.test(c) || /Kavram Haritası/.test(t.slice(0, 30))) return 'sema';
  if(/^(P|DIV)$/.test(el.tagName) && !el.querySelector('table, svg, img') && t.length) return 'metin';
  return 'diger';
}

function fotoEl(f, klasor, sinif){
  var fig = document.createElement('figure');
  fig.className = 'akis-foto ' + (sinif || '');
  fig.setAttribute('data-kunye', 'Fotoğraf: ' + f.kunye + ' · Wikimedia Commons');
  var img = document.createElement('img');
  img.alt = f.alt || ''; img.loading = 'lazy'; img.decoding = 'async';
  if(f.poz) img.style.objectPosition = f.poz;
  img.onerror = function(){ fig.classList.add('akis-yedek'); img.remove(); };
  img.src = KOK_URL + klasor + f.f;
  fig.appendChild(img);
  return fig;
}

/* ---------------- kurulum ---------------- */
var KONULAR = [];
function kur(){
  var veri = (window.KONU_SAHNE || {})[sayfaAnahtari()];
  var api = window.DERS_AKISI;
  if(!veri || !api || !api.yapi) return;
  var yapi = api.yapi();
  if(!yapi.length) return;
  var toplam = yapi.length;

  /* ünite girişi: ünite fotoğrafı (varsa) */
  var hero = document.querySelector('section.ka-hero');
  if(hero && veri.unite){
    hero.style.setProperty('--akis-unite', 'url("' + KOK_URL + veri.unite.f + '")');
    hero.setAttribute('data-akis-kunye', 'Fotoğraf: ' + veri.unite.kunye + ' · Wikimedia Commons');
    hero.classList.add('akis-unite-var');
    var on = new Image(); on.src = KOK_URL + veri.unite.f;
  }

  yapi.forEach(function(t, n){
    var v = veri.konular[t.konu.no] || {};
    var modul = t.nav && t.nav.closest('.ogr-modul');
    if(!modul || modul.querySelector('.akis-kapak')) return;
    var renk = RENKLER[n % RENKLER.length];
    modul.classList.add('akis-modul');
    modul.style.setProperty('--akis-renk', renk);

    /* 1) konu kapağı: büyük fotoğraf + numara + başlık (CSS ile çizilir) */
    var kap = document.createElement('div');
    kap.className = 'akis-kapak';
    kap.setAttribute('aria-hidden', 'true');
    kap.setAttribute('data-akis-no', t.konu.no);
    var sure = modul.querySelector('.ogr-modul-sure');
    kap.innerHTML = yazi('akis-kapak-etiket', 'KONU ' + t.konu.no + ' / ' + toplam) +
      yazi('akis-kapak-baslik', t.konu.ad) +
      (sure ? yazi('akis-kapak-sure', (sure.textContent || '').trim()) : '');
    if(v.kapak) kap.insertBefore(fotoEl(v.kapak, veri.klasor, 'akis-kapak-foto'), kap.firstChild);
    else kap.classList.add('akis-yedek');
    modul.insertBefore(kap, modul.firstChild);

    /* 2) adım içindeki parçalar: kart türleri */
    t.bolumler.forEach(function(b){
      if(b.k === 'etkinlik' || b.k === 'kontrol') return;   /* etkileşimli adımlar kendi tasarımında kalır */
      var ic = b.el.querySelector('.dak-ic'); if(!ic) return;
      Array.prototype.forEach.call(ic.children, function(el){
        if(/(^|\s)(akis-|dak-lab)/.test(String(el.className))) return;
        el.setAttribute('data-akis-tur', tur(el));
      });
    });

    /* 3) konu içi fotoğraflar: "Konuyu Öğren" adımında n. parçanın önüne;
          kavram / görsel / ayet adımlarının başına */
    var og = t.bolumler.filter(function(b){ return b.k === 'ogren'; })[0];
    if(og && v.ogren){
      var parcalar = Array.prototype.filter.call(og.el.querySelector('.dak-ic').children, uygunParca);
      v.ogren.forEach(function(g){
        var hedef = parcalar[g.bas];
        if(hedef) hedef.parentNode.insertBefore(fotoEl(g, veri.klasor, 'akis-ara-foto'), hedef);
      });
    }
    ['kavram', 'gorsel', 'ayet'].forEach(function(k){
      if(!v[k]) return;
      var b = t.bolumler.filter(function(x){ return x.k === k; })[0];
      var ic = b && b.el.querySelector('.dak-ic');
      if(ic) ic.insertBefore(fotoEl(v[k], veri.klasor, 'akis-ara-foto'), ic.firstChild);
    });

    KONULAR.push({ no:t.konu.no, ad:t.konu.ad, modul:modul, kapak:kap, renk:renk, nav:t.nav });
  });
  if(!KONULAR.length) return;

  gorunumCubugu();
  gosterge();
  sonBolum();
  belirme();
  if(oku() !== 'klasik') document.documentElement.classList.add('akis-kok');
  window.KONU_AKIS = { konular:function(){ return KONULAR.map(function(k){ return { no:k.no, ad:k.ad }; }); },
    klasik:function(v){ ayarla(v ? 'klasik' : 'akis'); } };
}

/* ---------------- görünüm seçimi ---------------- */
function ayarla(m){
  yaz(m);
  document.documentElement.classList.toggle('akis-kok', m !== 'klasik');
  var b = document.getElementById('akisGorunum');
  if(b){
    b.setAttribute('aria-pressed', String(m === 'klasik'));
    b.innerHTML = m === 'klasik' ? '✨ Akış görünümüne geç' : '📄 Klasik görünüm';
  }
  setTimeout(izle, 50);
}
function gorunumCubugu(){
  var hedef = document.querySelector('body > .dak-medya') || document.querySelector('section.ka-hero');
  if(!hedef) return;
  var d = document.createElement('div');
  d.className = 'akis-gorunum';
  d.innerHTML = '<button type="button" id="akisGorunum" class="akis-gorunum-btn" aria-pressed="false">📄 Klasik görünüm</button>';
  hedef.parentNode.insertBefore(d, hedef);
  d.querySelector('button').addEventListener('click', function(){
    ayarla(document.documentElement.classList.contains('akis-kok') ? 'klasik' : 'akis');
  });
  if(oku() === 'klasik') d.querySelector('button').innerHTML = '✨ Akış görünümüne geç';
}

/* ---------------- konu göstergesi (alt orta) ---------------- */
var gost = null, aktif = -1;
function gosterge(){
  gost = document.createElement('div');   /* <nav> değil: sayfaların genel nav stilleri uygulanmasın */
  gost.setAttribute('role', 'navigation');
  gost.className = 'akis-gosterge';
  gost.setAttribute('aria-label', 'Konular');
  gost.innerHTML = '<span class="akis-g-ad" aria-live="polite"></span><span class="akis-g-noktalar">' +
    KONULAR.map(function(k, i){
      return '<button type="button" data-akis-git="' + i + '" style="--akis-renk:' + k.renk + '" aria-label="' + kac('Konu ' + k.no + ': ' + k.ad) + '"></button>';
    }).join('') + '</span>';
  document.body.appendChild(gost);
  gost.addEventListener('click', function(e){
    var b = e.target.closest('[data-akis-git]'); if(!b) return;
    var k = KONULAR[+b.getAttribute('data-akis-git')];
    var bolum = k.modul.closest('main section');
    if(bolum && !bolum.classList.contains('aktif') && window.KS_API) window.KS_API.git(k.modul);
    k.modul.scrollIntoView({ behavior: hareketAz() ? 'auto' : 'smooth', block:'start' });
  });
  var bekle = false;
  addEventListener('scroll', function(){ if(bekle) return; bekle = true; requestAnimationFrame(function(){ bekle = false; izle(); }); }, { passive:true });
  addEventListener('resize', izle);
  izle();
}
function izle(){
  if(!gost) return;
  var acik = document.documentElement.classList.contains('akis-kok');
  var esik = innerHeight * 0.45, ai = -1, gorunur = false;
  KONULAR.forEach(function(k, i){
    if(!k.modul.getClientRects().length) return;
    var r = k.modul.getBoundingClientRect();
    if(r.top <= esik) ai = i;
    if(r.top < innerHeight && r.bottom > 0) gorunur = true;
  });
  gost.classList.toggle('akis-g-acik', acik && gorunur && ai >= 0);
  if(ai === aktif) return;
  aktif = ai;
  Array.prototype.forEach.call(gost.querySelectorAll('[data-akis-git]'), function(b, i){
    b.classList.toggle('akis-g-simdi', i === ai);
    b.classList.toggle('akis-g-gecti', i < ai);
    if(i === ai) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
  });
  gost.querySelector('.akis-g-ad').textContent = ai >= 0 ? 'Konu ' + KONULAR[ai].no + ' / ' + KONULAR.length + ' · ' + KONULAR[ai].ad : '';
  if(ai >= 0) gost.style.setProperty('--akis-renk', KONULAR[ai].renk);
}

/* ---------------- sayfa sonu: tamamladın + hatırlayalım + değerlendir ----------------
   main DIŞINDA durur (sesli dinleme yalnız main'i okur). "Konuyu hatırlayalım"
   kartları sayfadaki Aklında Kalsın kutularının salt-okunur kopyasıdır. */
function sonBolum(){
  var son = document.createElement('section');
  son.className = 'akis-son';
  son.setAttribute('aria-labelledby', 'akisSonBas');
  var hatir = [];
  KONULAR.forEach(function(k){
    Array.prototype.forEach.call(k.modul.querySelectorAll('[data-akis-tur="onemli"]'), function(el){
      if(!/Aklında Kalsın|Unutma/.test((el.textContent || '').slice(0, 60))) return;
      var c = el.cloneNode(true);
      [c].concat(Array.prototype.slice.call(c.querySelectorAll('*'))).forEach(function(x){
        if(x.closest && x.closest('svg')) return;
        ['id', 'onclick', 'tabindex', 'data-akis-tur'].forEach(function(a){ x.removeAttribute(a); });
      });
      hatir.push({ renk:k.renk, no:k.no, ad:k.ad, el:c });
    });
  });
  var olc = document.querySelector('body > .ks-alt .ks-aksiyon--birincil');
  son.innerHTML =
    '<div class="akis-son-ust"><span class="akis-son-ikon" aria-hidden="true">🎉</span>' +
      '<h2 id="akisSonBas">Konuyu tamamladın!</h2>' +
      '<p>' + KONULAR.length + ' konunun hepsini gezdin. Şimdi öğrendiklerini hatırla ve kendini değerlendir.</p></div>' +
    (hatir.length ? '<h3 class="akis-son-bas">📌 Konuyu hatırlayalım</h3><div class="akis-hatir"></div>' : '') +
    '<h3 class="akis-son-bas">✍️ Kendini değerlendir</h3>' +
    '<div class="akis-degerlendir">' + KONULAR.map(function(k, i){
      return '<button type="button" class="akis-deg-btn" data-akis-kontrol="' + i + '" style="--akis-renk:' + k.renk + '"><b>Konu ' + kac(k.no) + '</b><span>' + kac(k.ad) + '</span></button>';
    }).join('') + '</div>' +
    (olc ? '<a class="akis-son-ana" href="' + kac(olc.getAttribute('href')) + '">📝 Öğrenmeni Değerlendir</a>' : '');
  var kap = son.querySelector('.akis-hatir');
  hatir.forEach(function(h){
    var d = document.createElement('div');
    d.className = 'akis-hatir-kart'; d.style.setProperty('--akis-renk', h.renk);
    d.innerHTML = '<p class="akis-hatir-konu">Konu ' + kac(h.no) + ' · ' + kac(h.ad) + '</p>';
    d.appendChild(h.el); kap.appendChild(d);
  });
  var yer = document.querySelector('body > .od-ozet, body > .ks-alt');
  if(yer) yer.parentNode.insertBefore(son, yer); else document.body.appendChild(son);
  son.addEventListener('click', function(e){
    var b = e.target.closest('[data-akis-kontrol]'); if(!b) return;
    var k = KONULAR[+b.getAttribute('data-akis-kontrol')];
    var adim = k.nav && (k.nav.querySelector('[data-dak-git="kontrol"]') || k.nav.querySelector('[data-dak-git]:last-child'));
    if(adim) adim.click(); else k.modul.scrollIntoView({ behavior:'smooth' });
  });
}

/* ---------------- kaydırınca belirme ---------------- */
function belirme(){
  if(hareketAz() || !('IntersectionObserver' in window)) return;
  var hedefler = document.querySelectorAll('.akis-kapak, .akis-foto, .akis-modul [data-akis-tur]');
  var io = new IntersectionObserver(function(g){
    g.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('akis-gor'); io.unobserve(x.target); } });
  }, { rootMargin:'0px 0px -8% 0px', threshold:0.06 });
  Array.prototype.forEach.call(hedefler, function(el){ io.observe(el); });
  document.documentElement.classList.add('akis-anim');
  /* güvenlik: gezinme ile atlanan öğeler de görünür kalsın */
  setTimeout(function(){ Array.prototype.forEach.call(hedefler, function(el){ var r = el.getBoundingClientRect(); if(r.bottom < 0) el.classList.add('akis-gor'); }); }, 1500);
  document.addEventListener('click', function(e){
    if(e.target.closest('.ksx-toc, .ks-bn, [data-dak-git], [data-dak-ilk], [data-akis-git], [data-akis-kontrol]'))
      setTimeout(function(){ Array.prototype.forEach.call(hedefler, function(el){ el.classList.add('akis-gor'); }); }, 30);
  });
}

kur();
})();
