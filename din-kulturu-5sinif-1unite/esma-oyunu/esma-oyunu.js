/* ======================================================================
   ALLAH’I GÜZEL İSİMLERİYLE TANIYORUM — 50 soruluk görsel oyun (2026-11-09)
   Veri: esma-veri.js (window.ESMA_OYUN). Yer: 5. sınıf 1. ünite sayfası
   (#esmaOyunu). İlerleme yalnızca bu cihazda saklanır (localStorage).
   Klavye: A–D veya 1–4 cevap, Enter sonraki soru.
====================================================================== */
(function(){
'use strict';
var V = window.ESMA_OYUN, kok = document.getElementById('esmaOyunu');
if(!V || !kok) return;
var LS = 'esma5_oyun', HARF = ['A','B','C','D'];
var TUR = { anlam:'Anlamını bul', isim:'İsmi bul', gunluk:'Günlük hayattan', karsilastir:'Karşılaştır', gorsel:'Görselden çıkar', davranis:'Davranışa yansıt' };
var BURASI = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');

function kac(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function oku(){ try{ return JSON.parse(localStorage.getItem(LS) || 'null'); }catch(e){ return null; } }
function yaz(v){ try{ localStorage.setItem(LS, JSON.stringify(v)); }catch(e){} }
function karistir(a){ a = a.slice(); for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

var D;   /* { sira:[soru no], i, cevap:{no: seçilen}, en:en iyi puan, mod:'tum'|'tekrar' } */

function giris(){
  var e = oku() || {};
  var devam = e.sira && e.i < e.sira.length && e.i > 0;
  kok.innerHTML =
    '<div class="eo-giris">' +
      '<p class="eo-ust">5. Sınıf · 1. Ünite · Allah İnancı</p>' +
      '<h2 class="eo-baslik" id="eoBaslik">🌸 Allah’ı Güzel İsimleriyle Tanıyorum</h2>' +
      '<p class="eo-ac">Dokuz güzel ismi anlamlarıyla öğren, ardından fotoğraflı 50 soruda kendini dene. Her sorudan sonra doğru cevabı ve açıklamasını göreceksin.</p>' +
      '<ul class="eo-isimler">' + Object.keys(V.isimler).map(function(k){
        var s = V.isimler[k];
        return '<li><b>' + kac(s.ad) + '</b><span>' + kac(s.anlam) + '</span></li>';
      }).join('') + '</ul>' +
      '<div class="eo-btnlar">' +
        (devam ? '<button type="button" class="eo-btn eo-btn-ana" data-eo="devam">▶ Kaldığın yerden devam et (' + (e.i + 1) + '. soru)</button>' : '') +
        '<button type="button" class="eo-btn ' + (devam ? '' : 'eo-btn-ana') + '" data-eo="basla">' + (devam ? '↺ Baştan başla' : '▶ Oyuna başla · 50 soru') + '</button>' +
      '</div>' +
      (e.en != null ? '<p class="eo-en">🏅 En iyi puanın: ' + e.en + ' / 50</p>' : '') +
    '</div>';
}

function basla(sira, mod){
  var e = oku() || {};
  D = { sira:sira, i:0, cevap:{}, en:e.en, mod:mod || 'tum' };
  yaz(D); soru();
}

function soru(){
  var no = D.sira[D.i], q = V.sorular[no], g = V.gorseller[q.g] || {}, isim = V.isimler[q.i];
  var dogruSay = Object.keys(D.cevap).filter(function(k){ return D.cevap[k] === V.sorular[k].d; }).length;
  var yuzde = Math.round(D.i / D.sira.length * 100);
  kok.innerHTML =
    '<div class="eo-soru-ekran">' +
      '<div class="eo-durum"><span class="eo-sayac">Soru ' + (D.i + 1) + ' / ' + D.sira.length + '</span>' +
        '<span class="eo-puan">⭐ ' + dogruSay + ' doğru</span>' +
        '<button type="button" class="eo-cik" data-eo="cik" aria-label="Oyundan çık">✕</button></div>' +
      '<div class="eo-cubuk" role="progressbar" aria-valuemin="0" aria-valuemax="' + D.sira.length + '" aria-valuenow="' + D.i + '" aria-label="İlerleme"><span style="width:' + yuzde + '%"></span></div>' +
      '<figure class="eo-foto"><img src="' + kac(BURASI + 'gorsel/' + q.g + '.jpg') + '" alt="' + kac(g.alt || '') + '" decoding="async" onerror="this.parentNode.classList.add(\'eo-yedek\');this.remove();">' +
        '<figcaption>Fotoğraf: ' + kac(g.kunye || '') + ' · Wikimedia Commons</figcaption></figure>' +
      '<p class="eo-tur eo-tur-' + q.t + '">' + kac(TUR[q.t] || '') + '</p>' +
      '<h3 class="eo-soru" id="eoSoru" tabindex="-1">' + kac(q.s) + '</h3>' +
      '<div class="eo-secenekler" role="group" aria-labelledby="eoSoru">' + q.sec.map(function(s, k){
        return '<button type="button" class="eo-sec" data-sec="' + k + '"><span class="eo-harf">' + HARF[k] + '</span><span class="eo-sec-m">' + kac(s) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="eo-geri" role="status" aria-live="polite"></div>' +
    '</div>';
  var on = V.sorular[D.sira[D.i + 1]]; if(on){ var im = new Image(); im.src = BURASI + 'gorsel/' + on.g + '.jpg'; }
  var h = document.getElementById('eoSoru'); if(h && D.i > 0) h.focus({ preventScroll:true });
  if(D.i > 0) kok.scrollIntoView({ block:'start', behavior:'smooth' });
}

function cevapla(k){
  var no = D.sira[D.i], q = V.sorular[no];
  if(kok.querySelector('.eo-sec[disabled]')) return;
  D.cevap[no] = k; yaz(D);
  var dogru = k === q.d, isim = V.isimler[q.i];
  Array.prototype.forEach.call(kok.querySelectorAll('.eo-sec'), function(b, n){
    b.disabled = true;
    if(n === q.d) b.classList.add('eo-dogru');
    else if(n === k) b.classList.add('eo-yanlis');
  });
  var son = D.i === D.sira.length - 1;
  kok.querySelector('.eo-geri').innerHTML =
    '<div class="eo-aciklama ' + (dogru ? 'eo-a-dogru' : 'eo-a-yanlis') + '">' +
      '<b>' + (dogru ? '✔ Doğru!' : '✗ Doğru cevap: ' + HARF[q.d]) + '</b>' +
      '<span><b>' + kac(isim.ad) + ':</b> ' + kac(isim.anlam) + '</span></div>' +
    '<button type="button" class="eo-btn eo-btn-ana eo-sonraki" data-eo="sonraki">' + (son ? '🏁 Sonucu gör' : 'Sonraki soru →') + '</button>';
  kok.querySelector('.eo-sonraki').focus({ preventScroll:true });
  var p = kok.querySelector('.eo-puan');
  if(p) p.textContent = '⭐ ' + Object.keys(D.cevap).filter(function(x){ return D.cevap[x] === V.sorular[x].d; }).length + ' doğru';
}

function sonuc(){
  var dogru = 0, isimler = {}, yanlislar = [];
  D.sira.forEach(function(no){
    var q = V.sorular[no], ok = D.cevap[no] === q.d;
    if(ok) dogru++; else yanlislar.push(no);
    var s = isimler[q.i] = isimler[q.i] || { d:0, t:0 }; s.t++; if(ok) s.d++;
  });
  var toplam = D.sira.length, yuzde = Math.round(dogru / toplam * 100);
  var e = oku() || {};
  if(D.mod === 'tum'){ e.en = Math.max(e.en || 0, dogru); }
  e.sira = null; e.i = 0; yaz(e);
  var mesaj = yuzde >= 90 ? '🏆 Harika! İsimleri çok iyi öğrenmişsin.' : yuzde >= 70 ? '🌟 Çok güzel! Birkaç ismi tekrar edersen tam olacak.' :
    yuzde >= 50 ? '🌱 İyi bir başlangıç. Aşağıdaki isimleri tekrar et.' : '📚 İsimlerin anlamlarını bir kez daha okuyup yeniden dene.';
  kok.innerHTML =
    '<div class="eo-sonuc">' +
      '<p class="eo-ust">' + (D.mod === 'tum' ? 'Oyun bitti' : 'Tekrar turu bitti') + '</p>' +
      '<h2 class="eo-baslik">' + dogru + ' / ' + toplam + ' doğru</h2>' +
      '<div class="eo-halka" style="--y:' + yuzde + '"><span>%' + yuzde + '</span></div>' +
      '<p class="eo-ac">' + mesaj + '</p>' +
      '<h3 class="eo-ara">İsimlere göre sonucun</h3>' +
      '<ul class="eo-tablo">' + Object.keys(V.isimler).filter(function(k){ return isimler[k]; }).map(function(k){
        var s = isimler[k], o = Math.round(s.d / s.t * 100);
        return '<li class="' + (o < 70 ? 'eo-zayif' : '') + '"><b>' + kac(V.isimler[k].ad) + '</b><span class="eo-mini"><i style="width:' + o + '%"></i></span><em>' + s.d + '/' + s.t + '</em>' +
          (o < 70 ? '<small>' + kac(V.isimler[k].anlam) + '</small>' : '') + '</li>';
      }).join('') + '</ul>' +
      '<div class="eo-btnlar">' +
        (yanlislar.length ? '<button type="button" class="eo-btn eo-btn-ana" data-eo="tekrar">🔁 Yanlışlarımı tekrar et (' + yanlislar.length + ')</button>' : '') +
        '<button type="button" class="eo-btn" data-eo="basla">↺ Yeniden oyna</button>' +
        '<button type="button" class="eo-btn" data-eo="giris">🌸 İsimlere dön</button>' +
      '</div>' +
      (D.mod === 'tum' && e.en != null ? '<p class="eo-en">🏅 En iyi puanın: ' + e.en + ' / 50</p>' : '') +
    '</div>';
  D.yanlislar = yanlislar;
  kok.scrollIntoView({ block:'start', behavior:'smooth' });
}

kok.addEventListener('click', function(ev){
  var b = ev.target.closest('button'); if(!b || !kok.contains(b)) return;
  var ne = b.getAttribute('data-eo');
  if(b.hasAttribute('data-sec')) cevapla(+b.getAttribute('data-sec'));
  else if(ne === 'basla') basla(karistir(V.sorular.map(function(_, n){ return n; })), 'tum');
  else if(ne === 'devam'){ D = oku(); soru(); }
  else if(ne === 'sonraki'){ D.i++; yaz(D); if(D.i >= D.sira.length) sonuc(); else soru(); }
  else if(ne === 'tekrar') basla(karistir(D.yanlislar), 'tekrar');
  else if(ne === 'giris' || ne === 'cik') giris();
});
kok.addEventListener('keydown', function(ev){
  if(ev.target.closest('input, textarea') || ev.ctrlKey || ev.metaKey || ev.altKey) return;
  var k = ev.key.toLocaleUpperCase('tr');
  var n = 'ABCD'.indexOf(k); if(n < 0) n = '1234'.indexOf(k);
  if(n >= 0 && kok.querySelector('.eo-sec:not([disabled])')){ ev.preventDefault(); cevapla(n); }
});

giris();
window.ESMA_OYUN_API = { durum:function(){ return D; } };
})();
