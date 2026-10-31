/* ======================================================================
   ÖĞRENME DÖNGÜSÜ — "Kendini değerlendir → Eksiklerini gör → Tekrar çalış"
   (2026-10-31, ek katman; mevcut sayfaların hiçbir işlevini değiştirmez)

   portal-nav.js tarafından 'ogren' ve 'olcme' sayfalarına yüklenir.
   Yeni içerik (soru, kazanım, kod) ÜRETMEZ; yalnızca sayfalarda zaten var
   olan kayıtları okur ve öğrenciye görünür kılar:
     • dkabZayifSorular_<s-u>   → Konu Tekrarı testinde yanlış yapılan sorular
                                  (değerlendirme sayfalarının kendi kaydı)
     • dkabDegerlendirme_<s-u>  → "Kendimi Değerlendiriyorum" kutucukları
     • dkab_ziyaret             → portal-nav aşama ziyaretleri
   Tek yeni kayıt:
     • dkabKonuOzDeg_s<S>-u<U>  → konu sonu öz değerlendirme
                                  { "<konuNo>": "tamam" | "kismen" | "tekrar" }
   Ek davranış: Konu Tekrarı testinde daha önce yanlış yapılmış bir soru
   artık doğru cevaplanınca o sorunun "zayıf" sayacı bir azaltılır; böylece
   "Eksiklerim" listesi öğrenci ilerledikçe kısalır.
====================================================================== */
(function(){
"use strict";
var mount = document.getElementById('portalNav');
if(!mount || window.__ogrenmeDongusu) return;
window.__ogrenmeDongusu = true;

var S = parseInt(mount.dataset.sinif,10), U = parseInt(mount.dataset.unite,10) || 1;
var ASAMA = mount.dataset.asama || '';
if(!S || (ASAMA!=='ogren' && ASAMA!=='olcme')) return;

var GID = 's'+S+'-u'+U, UK = S+'-'+U;
var K_OZ = 'dkabKonuOzDeg_'+GID, K_ZAYIF = 'dkabZayifSorular_'+UK, K_DEG = 'dkabDegerlendirme_'+UK;

function oku(k, vars){ try{ var v = JSON.parse(localStorage.getItem(k)); return v==null ? vars : v; }catch(e){ return vars; } }
function yaz(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function kac(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function dosya(tur){
  var on = U>1 ? 'unite'+U+'-' : '';
  if(tur==='ogren') return on+'konuyu-ogren.html';
  if(tur==='oyun') return on+'oyun-merkezi.html';
  if(tur==='olcme') return (U>1 ? 'unite'+U+'-' : '')+'degerlendirme.html';
  return U>1 ? 'unite'+U+'.html' : 'index.html';
}
var DURUM = {
  tamam:  {etiket:'Anladım', simge:'✅'},
  kismen: {etiket:'Kısmen anladım', simge:'🤔'},
  tekrar: {etiket:'Tekrar etmeliyim', simge:'🔁'}
};

/* ---------- Konu listesi (sayfanın kendi içindekiler bağlantılarından) ---------- */
function konulariBul(){
  var out = [];
  var linkler = document.querySelectorAll('.ka-icindekiler a.ka-ic-link[href^="#"]');
  Array.prototype.forEach.call(linkler, function(a){
    var b = a.querySelector('b');
    var no = b ? b.textContent.trim() : '';
    if(!/^\d+$/.test(no)) return;
    var hedef = document.getElementById(a.getAttribute('href').slice(1));
    if(!hedef) return;
    var ad = a.textContent.replace(no,'').replace(/\s+/g,' ').trim();
    out.push({no:no, ad:ad, el:hedef, id:hedef.id});
  });
  return out;
}

/* ---------- Konu sayfası: her konunun sonuna öz değerlendirme ---------- */
function konuKartiHtml(k, secili){
  var dugmeler = ['tamam','kismen','tekrar'].map(function(d){
    return '<button type="button" class="od-sec'+(secili===d?' od-secili':'')+'" data-od-konu="'+kac(k.no)+'" data-od-durum="'+d+'" aria-pressed="'+(secili===d)+'">'+
      DURUM[d].simge+' '+DURUM[d].etiket+'</button>';
  }).join('');
  return '<div class="od-konu-kart" data-od-kart="'+kac(k.no)+'" role="group" aria-label="'+kac(k.no+'. konu için öz değerlendirme')+'">'+
    '<div class="od-konu-soru">🧭 <b>Kendini değerlendir:</b> “'+kac(k.ad)+'” konusunu ne kadar anladın?</div>'+
    '<div class="od-sec-satir">'+dugmeler+'</div>'+
    '<div class="od-konu-not" aria-live="polite"></div></div>';
}
function konuSonu(konular, i){
  /* i. konunun içeriği, bir sonraki konu çapasına ya da konu dışı bir
     bölüme (★ ek çalışma, test, hafıza kartı…) kadar süren kardeşlerdir. */
  var sonraki = konular[i+1] ? konular[i+1].el : null;
  var e = konular[i].el, son = e;
  while(e.nextElementSibling){
    var n = e.nextElementSibling;
    if(n===sonraki) break;
    if(n.matches && n.matches('.kd-bolum, .kt-bolum, .hk-bolum, .akd-kutu, .yg-panel, .ys-panel, script, footer')) break;
    if(n.id && /^ka-konu-/.test(n.id)) break;
    e = n; son = n;
  }
  return son;
}
function konuNotu(kart, durum){
  var not = kart.querySelector('.od-konu-not');
  if(!not) return;
  if(durum==='tamam') not.textContent = 'Harika! Sıradaki konuya geçebilirsin.';
  else if(durum==='kismen') not.textContent = 'Bu konu “Eksiklerim” listene eklendi. Konuyu dinleyerek ya da yeniden okuyarak pekiştirebilirsin.';
  else if(durum==='tekrar') not.textContent = 'Bu konu “Eksiklerim” listene eklendi. Önce konuyu yeniden oku, sonra oyunlarla pekiştir.';
  else not.textContent = '';
}
function ogrenKur(){
  var konular = konulariBul();
  if(!konular.length) return;
  var oz = oku(K_OZ, {});
  konular.forEach(function(k, i){
    if(document.querySelector('[data-od-kart="'+k.no+'"]')) return;
    var son = konuSonu(konular, i);
    var kap = document.createElement('div');
    kap.innerHTML = konuKartiHtml(k, oz[k.no]);
    var kart = kap.firstChild;
    son.parentNode.insertBefore(kart, son.nextSibling);
    konuNotu(kart, oz[k.no]);
  });
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-od-durum]');
    if(!b) return;
    var no = b.getAttribute('data-od-konu'), d = b.getAttribute('data-od-durum');
    var v = oku(K_OZ, {});
    if(v[no]===d) delete v[no]; else v[no] = d;
    var kn = konulariBul().filter(function(k){ return k.no===no; })[0];
    if(kn) v['_ad'+no] = kn.ad;
    v._t = new Date().toISOString();
    yaz(K_OZ, v);
    var kart = b.closest('.od-konu-kart');
    Array.prototype.forEach.call(kart.querySelectorAll('.od-sec'), function(x){
      var sec = x.getAttribute('data-od-durum')===v[no];
      x.classList.toggle('od-secili', sec); x.setAttribute('aria-pressed', sec);
    });
    konuNotu(kart, v[no]);
    ozetCiz();
  });
  ozetCiz();
}

/* ---------- Eksiklerim özeti (konu ve ölçme sayfalarında) ---------- */
function eksikler(){
  var oz = oku(K_OZ, {}), konuAd = {};
  var tekrar = [];
  Object.keys(oz).forEach(function(no){
    if(no.charAt(0)==='_') return;
    if(oz[no]==='kismen' || oz[no]==='tekrar') tekrar.push({no:no, durum:oz[no], ad:(oz['_ad'+no]||'')});
  });
  tekrar.sort(function(a,b){ return a.no-b.no; });
  var z = oku(K_ZAYIF, {});
  var zayif = Object.keys(z).filter(function(s){ return z[s]>0; })
    .map(function(s){ return {soru:s, n:z[s]}; })
    .sort(function(a,b){ return b.n-a.n; });
  var deg = oku(K_DEG, {}), degToplam = 0, degEksik = 0;
  Object.keys(deg).forEach(function(k){ degToplam++; if(!deg[k]) degEksik++; });
  return {tekrar:tekrar, zayif:zayif, degToplam:degToplam, degEksik:degEksik, oz:oz};
}
function ozetHtml(){
  var e = eksikler();
  var konular = ASAMA==='ogren' ? konulariBul() : [];
  var ad = {}; konular.forEach(function(k){ ad[k.no] = k.ad; });
  var oz = e.oz, degerlendirilen = 0, toplam = konular.length;
  konular.forEach(function(k){ if(oz[k.no]) degerlendirilen++; });
  var satirlar = [];
  if(e.tekrar.length){
    satirlar.push('<div class="od-alt-baslik">Tekrar etmek istediğin konular</div><ul class="od-liste">'+
      e.tekrar.map(function(t){
        var hedef = (ASAMA==='ogren' ? '' : dosya('ogren'))+'#ka-konu-'+t.no;
        return '<li><a href="'+hedef+'">'+DURUM[t.durum].simge+' '+t.no+'. konu'+((ad[t.no]||t.ad)?': '+kac(ad[t.no]||t.ad):'')+'</a></li>';
      }).join('')+'</ul>');
  }
  if(e.zayif.length){
    satirlar.push('<div class="od-alt-baslik">Konu Tekrarı testinde zorlandığın sorular</div><ul class="od-liste od-soru-liste">'+
      e.zayif.slice(0,5).map(function(z){
        return '<li><span class="od-soru">'+kac(z.soru.length>140 ? z.soru.slice(0,137)+'…' : z.soru)+'</span> <span class="od-rozet">'+z.n+' kez yanlış</span></li>';
      }).join('')+'</ul>'+(e.zayif.length>5 ? '<div class="od-kucuk">+'+(e.zayif.length-5)+' soru daha. Testi yeniden çözdüğünde bu sorular daha sık karşına çıkar.</div>' : ''));
  }
  if(e.degToplam && e.degEksik){
    satirlar.push('<div class="od-kucuk">📋 “Kendimi Değerlendiriyorum” listesinde henüz işaretlemediğin '+e.degEksik+' madde var.</div>');
  }
  var bos = !satirlar.length;
  var ilerleme = ASAMA==='ogren' && toplam
    ? '<div class="od-ilerleme"><span>Öz değerlendirme: '+degerlendirilen+' / '+toplam+' konu</span><span class="od-cubuk"><i style="width:'+Math.round(degerlendirilen/toplam*100)+'%"></i></span></div>'
    : '';
  var aksiyon = '<div class="od-aksiyonlar">'+
    (ASAMA==='olcme' ? '<a class="od-btn" href="'+dosya('ogren')+'">📖 Konuyu yeniden oku / dinle</a>' : '')+
    '<a class="od-btn" href="'+dosya('oyun')+'#oyun-gruplari">🎮 Oyunlarla pekiştir</a>'+
    (ASAMA==='olcme'
      ? (document.querySelector('#oyun-gruplari button[onclick*="konutekrari"]') ? '<button type="button" class="od-btn od-btn-ana" data-od="test">📝 Eksik sorularla yeniden test</button>' : '')
      : '<a class="od-btn od-btn-ana" href="'+dosya('olcme')+'">📝 Kendini sına</a>')+
    '</div>';
  return '<section class="od-ozet" aria-labelledby="odBaslik">'+
    '<h2 id="odBaslik" class="od-baslik">🔎 Eksiklerim ve Tekrar Planım</h2>'+
    '<p class="od-yol">Öğren → Pekiştir → Kendini değerlendir → <b>Eksiklerini gör</b> → <b>Tekrar çalış</b></p>'+
    ilerleme+
    (bos ? '<p class="od-kucuk">Henüz bir eksik kaydı yok. '+(ASAMA==='ogren' ? 'Her konunun sonundaki “Kendini değerlendir” düğmelerini kullan; emin olmadığın konular burada listelenir.' : 'Konu Tekrarı testini çözdüğünde yanlış yaptığın sorular burada listelenir.')+'</p>' : satirlar.join(''))+
    aksiyon+'</section>';
}
var ozetKutu = null;
function ozetCiz(){
  var kap = document.createElement('div');
  kap.innerHTML = ozetHtml();
  var yeni = kap.firstChild;
  if(ozetKutu && ozetKutu.parentNode){ ozetKutu.parentNode.replaceChild(yeni, ozetKutu); }
  else {
    var alt = document.querySelector('body > .pn-alt, body > .ks-alt, body > footer.ks-alt, body > .ks-son');
    if(alt) alt.parentNode.insertBefore(yeni, alt);
    else document.body.appendChild(yeni);
  }
  ozetKutu = yeni;
}

/* ---------- Ölçme sayfası: doğru cevaplanan zayıf sorunun sayacını azalt ---------- */
function olcmeKur(){
  ozetCiz();
  document.addEventListener('click', function(e){
    if(!e.target.closest('[data-od="test"]')) return;
    var b = document.querySelector('#oyun-gruplari button[onclick*="konutekrari"]');
    if(b){ b.click(); var m = /goster\('([^']+)'/.exec(b.getAttribute('onclick')||''); var s = m && document.getElementById(m[1]); if(s){
      var bas = s.querySelector('button[onclick*="rBaslat"]');
      var soru = s.querySelector('[id$="rSoru"]');
      if(bas && (!soru || !soru.textContent.trim())) bas.click();
      s.scrollIntoView({behavior:'smooth', block:'start'});
    } }
  });
  var kutular = Array.prototype.filter.call(document.querySelectorAll('[id$="rSecenekler"]'), function(el){ return /^kt\w*rSecenekler$/.test(el.id); });
  kutular.forEach(function(kutu){
    var soruEl = document.getElementById(kutu.id.replace(/Secenekler$/,'Soru'));
    if(!soruEl) return;
    var islendi = false;
    new MutationObserver(function(){
      var dogru = kutu.querySelector('.dogru'), yanlis = kutu.querySelector('.yanlis');
      if(!dogru && !yanlis){ islendi = false; return; }
      if(islendi) return;
      islendi = true;
      setTimeout(function(){
        if(kutu.querySelector('.yanlis')){ ozetCiz(); return; }
        var metin = soruEl.textContent, z = oku(K_ZAYIF, {});
        if(z[metin] > 0){ z[metin]--; if(!z[metin]) delete z[metin]; yaz(K_ZAYIF, z); }
        ozetCiz();
      }, 30);
    }).observe(kutu, {subtree:true, attributes:true, attributeFilter:['class'], childList:true});
  });
}

function basla(){
  if(ASAMA==='ogren') ogrenKur(); else olcmeKur();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(basla, 50); });
else setTimeout(basla, 50);
})();
