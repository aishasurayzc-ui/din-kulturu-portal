/* ======================================================================
   KONU SAHNELERİ — fotoğraf destekli kayan konu anlatımı (2026-11-08)
   ----------------------------------------------------------------------
   Ortak bileşen. ortak/ders-akisi.js konuları adımlara ayırdıktan sonra
   yüklenir; sayfa için ortak/konu-sahne-veri.js'te fotoğraf eşlemesi
   varsa her konunun başına "Görsel anlatımı başlat" düğmesi ekler.

   KURALLAR
   • Sayfa metni değiştirilmez, taşınmaz, silinmez. Sahnelerdeki metin,
     konu anlatımındaki parçaların salt-okunur KOPYASIDIR (kimlikler ve
     tıklama olayları temizlenir) — okuma görünümü olduğu gibi kalır.
   • Etkileşimli parçalar (etkinlik, test, oyun, dinleme düğmeleri)
     sahneye kopyalanmaz; "Etkinliğe git" ile sayfadaki asıl yerine gidilir.
   • Fotoğraf yüklenemezse kırık görsel gösterilmez; yedek tasarım çizilir.
   • Klavye: ← → önceki/sonraki, Home/End, Esc kapat. Dokunmatik: kaydır.
   • prefers-reduced-motion: geçiş animasyonları kapanır.
   Önek: ksh-
====================================================================== */
(function(){
'use strict';
if(window.__konuSahne) return;
window.__konuSahne = true;

var BURASI = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');
var KOK_URL = BURASI + '../';
var ASAMA_AD = { ogren:'Konuyu Öğren', kavram:'Kavramları Tanı', gorsel:'Görsellerle Anla', ayet:'Ayet ve Hadislerle Pekiştir' };
var ETKILESIMLI = 'button, input, select, textarea, audio, video, iframe, [onclick], [contenteditable]';

function kac(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function hareketAz(){ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }

function sayfaAnahtari(){
  var m = document.getElementById('portalNav');
  return m ? 's' + m.dataset.sinif + '-u' + (m.dataset.unite || '1') : '';
}
/* Sahneye konabilecek (salt-okunur) parça mı? */
function uygunParca(el){
  if(/(^|\s)(dak-|ksx-|sok-|kd-|od-|konu-illustrasyon)/.test(String(el.className))) return false;
  if(el.matches(ETKILESIMLI) || el.querySelector(ETKILESIMLI)) return false;
  var metin = (el.textContent || '').replace(/\s+/g, ' ').trim();
  return metin.length >= 3 || !!el.querySelector('img, svg, table');
}
function kopya(el){
  var k = el.cloneNode(true);
  [k].concat(Array.prototype.slice.call(k.querySelectorAll('*'))).forEach(function(x){
    /* SVG içindeki kimlikler (gradyan, ok ucu) korunur: url(#…) aynı tanımı gösterir */
    if(x.closest && x.closest('svg')) return;
    ['id', 'onclick', 'for', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'tabindex', 'data-dak-git'].forEach(function(a){ x.removeAttribute(a); });
  });
  Array.prototype.forEach.call(k.querySelectorAll('[class*="sok-"], [class*="kd-"], [class*="dak-"]'), function(x){ x.parentNode && x.parentNode.removeChild(x); });
  return k;
}

/* Bir konu için sahne listesi */
function sahneler(t, v){
  var parca = {};
  t.bolumler.forEach(function(b){
    parca[b.k] = Array.prototype.filter.call(b.el.querySelector('.dak-ic').children, uygunParca);
  });
  var liste = [];
  var foto = v.kapak;
  var ogren = parca.ogren || [];
  liste.push({ tur:'kapak', asama:'ogren', foto:v.kapak, el:ogren[0] || null });
  ogren.slice(1).forEach(function(el, i){
    var n = i + 1;
    (v.ogren || []).forEach(function(g){ if(g.bas <= n) foto = g; });
    liste.push({ tur:'parca', asama:'ogren', foto:foto, el:el });
  });
  ['kavram', 'gorsel', 'ayet'].forEach(function(k){
    if(v[k]) foto = v[k];
    (parca[k] || []).forEach(function(el){ liste.push({ tur:'parca', asama:k, foto:foto, el:el }); });
  });
  var son = t.bolumler.filter(function(b){ return b.k === 'etkinlik' || b.k === 'kontrol'; });
  if(son.length) liste.push({ tur:'son', asama:'son', foto:v.kapak, bolumler:son });
  return liste;
}

/* ---------------- arayüz ---------------- */
var P = null;   /* açık pencere durumu */
function fotoHtml(f, klasor){
  if(!f) return '<div class="ksh-foto ksh-yedek" aria-hidden="true"></div>';
  return '<figure class="ksh-foto">' +
    '<img src="' + kac(KOK_URL + klasor + f.f) + '" alt="' + kac(f.alt) + '" decoding="async" style="object-position:' + kac(f.poz || 'center') + '"' +
    ' onerror="this.parentNode.classList.add(\'ksh-yedek\');this.remove();">' +
    '<figcaption class="ksh-kunye">Fotoğraf: ' + kac(f.kunye) + ' · Wikimedia Commons</figcaption></figure>';
}
function sahneCiz(yon){
  var s = P.liste[P.i], t = P.t, klasor = P.klasor;
  var ust = P.kok.querySelector('.ksh-sahne');
  var govde;
  if(s.tur === 'son'){
    govde = '<p class="ksh-etiket">Sıra sende</p><h2 class="ksh-baslik" id="kshBaslik">Öğrendiklerini uygula</h2>' +
      '<div class="ksh-govde"><p>Görsel anlatımı tamamladın. Şimdi konunun etkinliklerine ve kendini değerlendirme bölümüne geç.</p>' +
      '<div class="ksh-git">' + s.bolumler.map(function(b){
        var ad = b.k === 'etkinlik' ? '🎮 Etkinlik Yap' : '✍️ Öğrendiklerini Kontrol Et';
        var n = b.el.querySelector('.dak-ic').children.length;
        return '<button type="button" class="ksh-btn ksh-btn-ana" data-ksh-git="' + b.k + '">' + ad + ' <small>(' + n + ' bölüm)</small></button>';
      }).join('') + '<button type="button" class="ksh-btn" data-ksh="basa">↺ Görsel anlatımı baştan izle</button></div></div>';
  } else if(s.tur === 'kapak'){
    /* kapak: konu başlığı fotoğrafın üzerinde, giriş metni yanda */
    govde = '<p class="ksh-etiket">Konuya giriş</p><div class="ksh-govde"></div>';
  } else {
    govde = '<p class="ksh-etiket">' + kac(t.konu.ad) + '</p>' +
      '<h2 class="ksh-baslik" id="kshBaslik">' + kac(ASAMA_AD[s.asama] || '') + '</h2><div class="ksh-govde"></div>';
  }
  var yeni = document.createElement('div');
  yeni.className = 'ksh-sahne ksh-' + s.tur + (yon && !hareketAz() ? ' ksh-gir ksh-gir-' + (yon > 0 ? 'ileri' : 'geri') : '');
  yeni.innerHTML = fotoHtml(s.foto, klasor) + '<div class="ksh-metin">' + govde + '</div>';
  if(s.tur === 'kapak'){
    var yazi = document.createElement('div');
    yazi.className = 'ksh-kapak-yazi';
    yazi.innerHTML = '<p class="ksh-etiket">Konu ' + kac(t.konu.no) + '</p><h2 class="ksh-baslik" id="kshBaslik">' + kac(t.konu.ad) + '</h2>';
    yeni.querySelector('.ksh-foto').appendChild(yazi);
  }
  if(s.el) yeni.querySelector('.ksh-govde').appendChild(kopya(s.el));
  if(ust) ust.parentNode.replaceChild(yeni, ust); else P.kok.querySelector('.ksh-sahne-yer').appendChild(yeni);
  if(yon && !hareketAz()) requestAnimationFrame(function(){ requestAnimationFrame(function(){ yeni.classList.remove('ksh-gir'); }); });
  var n = P.liste.length;
  P.kok.querySelector('.ksh-ilerleme span').style.width = Math.round((P.i + 1) / n * 100) + '%';
  P.kok.querySelector('.ksh-sayac').textContent = 'Sahne ' + (P.i + 1) + ' / ' + n;
  P.kok.querySelector('[data-ksh="geri"]').disabled = P.i === 0;
  P.kok.querySelector('[data-ksh="ileri"]').disabled = P.i === n - 1;
  P.kok.querySelector('.ksh-durum').textContent = (P.i + 1) + '. sahne: ' + (yeni.querySelector('.ksh-baslik') || {}).textContent;
  /* sıradaki fotoğrafı önceden yükle */
  var sonraki = P.liste[P.i + 1];
  if(sonraki && sonraki.foto){ var im = new Image(); im.src = KOK_URL + klasor + sonraki.foto.f; }
}
function git(yon){
  var j = P.i + yon;
  if(j < 0 || j >= P.liste.length) return;
  P.i = j; sahneCiz(yon);
}
function ac(t, v, dugme, klasor){
  if(P) kapat();
  var liste = sahneler(t, v);
  if(liste.length < 2) return;
  var kok = document.createElement('div');
  kok.className = 'ksh-kok';
  kok.setAttribute('role', 'dialog'); kok.setAttribute('aria-modal', 'true');
  kok.setAttribute('aria-label', 'Görsel anlatım: ' + t.konu.ad);
  kok.innerHTML =
    '<div class="ksh-ust"><div class="ksh-ilerleme" aria-hidden="true"><span></span></div>' +
      '<span class="ksh-sayac"></span><span class="ksh-konu">' + kac(t.konu.ad) + '</span>' +
      '<button type="button" class="ksh-kapat" data-ksh="kapat" aria-label="Görsel anlatımı kapat">✕ <span>Kapat</span></button></div>' +
    '<div class="ksh-sahne-yer"></div>' +
    '<div class="ksh-alt"><button type="button" class="ksh-btn" data-ksh="geri">← Önceki</button>' +
      '<span class="ksh-ipucu" aria-hidden="true">← → tuşları · kaydır</span>' +
      '<button type="button" class="ksh-btn ksh-btn-ana" data-ksh="ileri">Sonraki →</button></div>' +
    '<p class="ksh-durum" role="status" aria-live="polite"></p>';
  document.body.appendChild(kok);
  document.documentElement.classList.add('ksh-acik');
  P = { kok:kok, t:t, v:v, liste:liste, i:0, dugme:dugme, klasor:klasor || '' };
  sahneCiz(0);
  kok.querySelector('[data-ksh="ileri"]').focus();
  kok.addEventListener('click', tikla);
  kok.addEventListener('keydown', tus);
  kaydirmaKur(kok.querySelector('.ksh-sahne-yer'));
}
function kapat(){
  if(!P) return;
  var d = P.dugme;
  P.kok.parentNode && P.kok.parentNode.removeChild(P.kok);
  document.documentElement.classList.remove('ksh-acik');
  P = null;
  if(d) d.focus();
}
function tikla(e){
  var b = e.target.closest('button'); if(!b) return;
  var ne = b.getAttribute('data-ksh');
  if(ne === 'kapat') kapat();
  else if(ne === 'ileri') git(1);
  else if(ne === 'geri') git(-1);
  else if(ne === 'basa'){ P.i = 0; sahneCiz(-1); }
  else if(b.hasAttribute('data-ksh-git')){
    var k = b.getAttribute('data-ksh-git'), nav = P.t.nav;
    kapat();
    var adim = nav && nav.querySelector('[data-dak-git="' + k + '"]');
    if(adim) adim.click();
  }
}
function tus(e){
  /* pencere açıkken sayfanın kendi klavye kısayolları (oyunlar vb.) tetiklenmesin */
  e.stopPropagation();
  if(e.key === 'Escape'){ e.preventDefault(); kapat(); return; }
  var alan = e.target.closest && e.target.closest('.ksh-govde');
  if(e.key === 'ArrowRight' && !alan){ e.preventDefault(); git(1); }
  else if(e.key === 'ArrowLeft' && !alan){ e.preventDefault(); git(-1); }
  else if(e.key === 'Home'){ e.preventDefault(); P.i = 0; sahneCiz(-1); }
  else if(e.key === 'End'){ e.preventDefault(); P.i = P.liste.length - 1; sahneCiz(1); }
  else if(e.key === 'Tab'){
    /* odak pencerenin içinde kalsın */
    var o = Array.prototype.filter.call(P.kok.querySelectorAll('button:not([disabled]), a[href]'), function(x){ return x.getClientRects().length; });
    if(!o.length) return;
    if(e.shiftKey && document.activeElement === o[0]){ e.preventDefault(); o[o.length - 1].focus(); }
    else if(!e.shiftKey && document.activeElement === o[o.length - 1]){ e.preventDefault(); o[0].focus(); }
  }
}
function kaydirmaKur(alan){
  var x0 = null, y0 = 0;
  alan.addEventListener('pointerdown', function(e){ if(e.pointerType === 'mouse') return; x0 = e.clientX; y0 = e.clientY; });
  alan.addEventListener('pointerup', function(e){
    if(x0 === null) return;
    var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
    if(Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) git(dx < 0 ? 1 : -1);
  });
  alan.addEventListener('pointercancel', function(){ x0 = null; });
}

/* ---------------- kurulum ---------------- */
function kur(){
  var veri = (window.KONU_SAHNE || {})[sayfaAnahtari()];
  var api = window.DERS_AKISI;
  if(!veri || !api || !api.yapi) return;
  api.yapi().forEach(function(t){
    var v = veri.konular[t.konu.no];
    if(!v || !t.nav || t.nav.parentNode.querySelector('.ksh-baslat')) return;
    var d = document.createElement('button');
    d.type = 'button';
    d.className = 'ksh-baslat';
    d.innerHTML = '<span class="ksh-baslat-ikon" aria-hidden="true">▶</span><span><b>Görsel anlatımı başlat</b><small>Fotoğraflarla, adım adım</small></span>';
    d.setAttribute('aria-label', 'Konu ' + t.konu.no + ' için görsel anlatımı başlat: ' + t.konu.ad);
    d.addEventListener('click', function(){ ac(t, v, d, veri.klasor); });
    t.nav.parentNode.insertBefore(d, t.nav.nextSibling);
  });
  window.KONU_SAHNE_API = { ac:function(no){ var t = api.yapi().filter(function(x){ return x.konu.no === String(no); })[0]; if(t && veri.konular[t.konu.no]) ac(t, veri.konular[t.konu.no], null, veri.klasor); }, kapat:kapat, durum:function(){ return P ? { i:P.i, toplam:P.liste.length } : null; } };
}
kur();
})();
