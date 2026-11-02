/* ======================================================================
   ÖĞRENME ASİSTANI — "Bana Sor" (2026-10-31, ek katman)
   * Sağ altta sabit balon; tıklanınca sohbet penceresi açılır.
   * Sınıf, ünite, konu, etkinlik ve son yanlış cevap sayfadan otomatik
     algılanır; açık konunun metni ve ünitenin resmî öğrenme çıktıları
     yapay zekâya kaynak olarak gönderilir.
   * Yapay zekâ bağlantısı YALNIZCA yerel sunucu (asistan-sunucu.py)
     üzerinden yapılır; API anahtarı bu dosyada veya sayfalarda YOKTUR.
   * Sunucu yoksa ya da anahtar tanımlanmamışsa pencere bunu açıkça söyler,
     hiçbir hazır/sahte cevap üretmez.
   Sayfaların hiçbir mevcut işlevine dokunmaz.
====================================================================== */
(function(){
"use strict";
if(window.__dkabAsistan) return;
window.__dkabAsistan = true;
if(/yazili\d*(_klasik)?\.html$/i.test(location.pathname)) return;   /* basılı sınav kâğıtları */

var BETIK = document.currentScript || document.querySelector('script[src*="asistan.js"]');
var KLASOR = BETIK ? BETIK.getAttribute('src').replace(/asistan\.js.*$/, '') : 'ortak/';
var API = '/api/asistan';
var LS_GECMIS = 'dkabAsistanGecmis';
var ONERILER = [
  'Bu konuyu bana anlat.',
  'Daha basit açıkla.',
  'Günlük hayattan örnek ver.',
  'Kavramları karşılaştır.',
  'Bana 5 soru sor.',
  'Yanlışımı açıkla.'
];

/* ---------------- yardımcılar ---------------- */
function kac(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function temiz(s){ return String(s||'').replace(/\s+/g,' ').trim(); }
function emojiSiz(s){ return temiz(String(s||'').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{20E3}]/gu,'')); }
function gorunurMu(el){ if(!el) return false; var r = el.getBoundingClientRect(); return r.width>0 && r.height>0 && getComputedStyle(el).visibility!=='hidden'; }
function oturumOku(){ try{ return JSON.parse(sessionStorage.getItem(LS_GECMIS)) || []; }catch(e){ return []; } }
function oturumYaz(v){ try{ sessionStorage.setItem(LS_GECMIS, JSON.stringify(v.slice(-24))); }catch(e){} }

/* ---------------- bağlam algılama ---------------- */
var sonYanlis = null;
function sinifUnite(){
  var s = null, u = null;
  var nav = document.getElementById('portalNav');
  if(nav){ s = parseInt(nav.dataset.sinif,10) || null; u = parseInt(nav.dataset.unite,10) || null; }
  var yol = decodeURIComponent(location.pathname);
  var m = /din-kulturu-(\d+)sinif/.exec(yol);
  if(!s && m) s = parseInt(m[1],10);
  if(!s && /9-sinif-ders-notlari/.test(yol)) s = 9;
  if(!s && /lgs|zor-deneme|deneme-|cikmis-sorular|kim-din-dersinde/.test(yol)) s = 8;
  if(!s){
    var q = /[?&]sinif=s?(\d+)/.exec(location.search);
    if(q) s = parseInt(q[1],10);
    var panel = Array.prototype.filter.call(document.querySelectorAll('section.sinif-panel[id^="s"]'), gorunurMu)[0];
    if(panel) s = parseInt(panel.id.slice(1),10) || s;
  }
  if(!s){
    var bas = Array.prototype.filter.call(document.querySelectorAll('#uniteAdi, h1, h2, .hero, header'), gorunurMu).map(function(x){ return x.textContent; }).join(' ') + ' ' + document.title;
    var t = /(\d{1,2})\.\s*[Ss]ınıf/.exec(bas); if(t) s = parseInt(t[1],10);
    var tu = /(\d)\.\s*Ünite/.exec(bas); if(tu && !u) u = parseInt(tu[1],10);
  }
  if(!u && s){
    var um = /unite(\d+)/.exec(yol.split('/').pop());
    if(um) u = parseInt(um[1],10);
    else if(m) u = 1;
    var nm = /(\d)-unite/.exec(yol.split('/').pop());
    if(nm) u = parseInt(nm[1],10);
  }
  return {s:s, u:u};
}
function uniteAdi(){
  var h = document.querySelector('.ks-hero h1, .ka-hero h1, header h1, h1');
  var t = h ? emojiSiz(h.textContent) : '';
  if(!t || /^AYŞE/i.test(t)) t = emojiSiz(document.title.split(/[—|-]/)[0].replace(/^\d+\.\s*Sınıf Din Kültürü\s*/,''));
  return t.slice(0,120);
}
function konulariBul(){
  return Array.prototype.filter.call(document.querySelectorAll('[id^="ka-konu-"]'), function(e){ return /^ka-konu-\d+$/.test(e.id); });
}
function aktifKonu(){
  var k = konulariBul(); if(!k.length) return null;
  var orta = innerHeight * 0.4, sec = k[0];
  k.forEach(function(e){ var r = e.getBoundingClientRect(); if(r.top < orta && gorunurMu(e)) sec = e; });
  var ad = '', link = document.querySelector('a.ka-ic-link[href="#'+sec.id+'"]');
  if(link){ var bb = link.querySelector('b'); ad = temiz(link.textContent.replace(bb ? bb.textContent : '', '')); }
  if(!ad){ var hh = sec.querySelector('h2, h3, h4, .ka-konu-baslik'); ad = temiz(hh ? hh.textContent : sec.textContent).replace(/^KONU\s*\d+\s*/i,''); }
  var metin = '', e = sec.nextElementSibling;
  while(e && !/^ka-konu-\d+$/.test(e.id||'') && metin.length < 22000){
    if(!e.matches('script, style, .od-konu-kart, .od-adim, .kd-cubuk')) metin += '\n' + (e.innerText || e.textContent || '');
    e = e.nextElementSibling;
  }
  return {ad: emojiSiz(ad).slice(0,140), metin: temiz(metin).slice(0,22000), no: sec.id.replace('ka-konu-','')};
}
function aktifEtkinlik(){
  var adaylar = Array.prototype.filter.call(document.querySelectorAll('main section[id], section.egitim-icerik, section.oyun-bolum, .etkinlik, [class*="oyun-panel"]'), gorunurMu);
  var orta = innerHeight/2, en = null, uzak = 1e9;
  adaylar.forEach(function(s){ var r = s.getBoundingClientRect(); if(r.top < orta && r.bottom > 80){ var d = Math.abs(r.top); if(d < uzak){ uzak = d; en = s; } } });
  if(!en) return null;
  var h = en.querySelector('h2, h3');
  return {ad: h ? emojiSiz(h.textContent).slice(0,120) : '', el: en};
}
function ekrandakiSoru(kapsam){
  var adaylar = (kapsam || document).querySelectorAll('[id$="Soru"], [id$="SoruMetin"], .od-soru-metin, .soru-metin, .soru-baslik, .soru');
  for(var i=0;i<adaylar.length;i++){
    var t = temiz(adaylar[i].textContent);
    if(t.length > 12 && gorunurMu(adaylar[i])) return t.slice(0,600);
  }
  return '';
}
function sayfaMetni(){
  var kok = document.querySelector('main') || document.body;
  var ak = aktifEtkinlik();
  var metin = ak && ak.el ? ak.el.innerText : '';
  if(metin.length < 400) metin = (metin + '\n' + (kok.innerText || '')).trim();
  if(metin.length < 400 && kok !== document.body) metin = (metin + '\n' + (document.body.innerText || '')).trim();
  return temiz(metin).slice(0,18000);
}
function ciktilar(s, u){
  try{
    var P = window.MEB_PROGRAM, E = window.MEB_ESLESTIRME;
    if(!P || !s) return '';
    var liste = P.siniflar['s'+s]; if(!liste) return '';
    if(!u) return liste.map(function(un){ return un.no+'. Ünite: '+un.ad+' — '+(un.ogrenmeCiktilari||[]).map(function(c){ return c.kod+' '+c.ad; }).join('; '); }).join('\n').slice(0,3000);
    var mebNo = u;
    if(E && E['s'+s] && E['s'+s].sira){
      var bul = E['s'+s].sira.filter(function(x){ return (x.portal||[]).indexOf(u) >= 0; })[0];
      if(bul) mebNo = bul.meb; else if((E['s'+s].ek||[]).indexOf(u) >= 0) return '(Bu sayfa güncel programda ayrı bir üniteye karşılık gelmez.)';
    }
    var un = liste.filter(function(x){ return x.no===mebNo; })[0];
    if(!un) return '';
    return un.no+'. Ünite: '+un.ad+'\n'+(un.ogrenmeCiktilari||[]).map(function(c){ return c.kod+' — '+c.ad; }).join('\n');
  }catch(e){ return ''; }
}
function mebYukle(){
  if(window.MEB_PROGRAM || document.querySelector('script[src*="meb-program.js"]')) return;
  var sc = document.createElement('script'); sc.src = KLASOR + 'meb-program.js'; document.body.appendChild(sc);
}
var konuSayfasiMetni = null;
function konuSayfasiniOku(){
  var nav = document.getElementById('portalNav');
  if(!nav || nav.dataset.asama === 'ogren' || konuSayfasiMetni !== null || location.protocol === 'file:') return;
  konuSayfasiMetni = '';
  var u = parseInt(nav.dataset.unite,10) || 1;
  var dosya = (u > 1 ? 'unite'+u+'-' : '') + 'konuyu-ogren.html';
  fetch(dosya).then(function(r){ return r.ok ? r.text() : ''; }).then(function(h){
    if(!h) return;
    var d = new DOMParser().parseFromString(h, 'text/html');
    var parcalar = [];
    Array.prototype.forEach.call(d.querySelectorAll('[id^="ka-konu-"]'), function(a){
      if(!/^ka-konu-\d+$/.test(a.id)) return;
      var m = '', e = a.nextElementSibling;
      while(e && !/^ka-konu-\d+$/.test(e.id||'') && m.length < 6000){ if(!e.matches('script, style')) m += ' ' + e.textContent; e = e.nextElementSibling; }
      var link = d.querySelector('a.ka-ic-link[href="#'+a.id+'"]');
      parcalar.push('KONU: ' + temiz(link ? link.textContent : a.textContent).slice(0,120) + '\n' + temiz(m).slice(0,6000));
    });
    konuSayfasiMetni = parcalar.join('\n\n').slice(0,20000);
  }).catch(function(){});
}
function baglam(){
  var su = sinifUnite(), k = aktifKonu(), et = aktifEtkinlik();
  var b = {sinif: su.s, uniteNo: su.u, unite: su.u ? (su.u + '. ünite — ' + uniteAdi()) : uniteAdi(), sayfa: emojiSiz(document.title).slice(0,140)};
  if(k){ b.konu = k.ad; b.icerik = k.metin; }
  else {
    b.icerik = sayfaMetni();
    if(konuSayfasiMetni) b.icerik = ('ÜNİTENİN KONU ANLATIMI:\n' + konuSayfasiMetni + '\n\nAÇIK SAYFA:\n' + b.icerik).slice(0,22000);
  }
  if(et && et.ad && (!k || !/Konu Anlatımı/i.test(et.ad))) b.etkinlik = et.ad;
  var soru = ekrandakiSoru(et && et.el);
  if(soru) b.soru = soru;
  if(sonYanlis && Date.now() - sonYanlis.t < 30*60*1000) b.sonYanlis = 'Soru: '+sonYanlis.soru+' | Öğrencinin seçtiği: '+sonYanlis.secilen+(sonYanlis.dogru ? ' | Doğru cevap: '+sonYanlis.dogru : '');
  b.ciktilar = ciktilar(su.s, su.u);
  return b;
}
function baglamEtiketi(b){
  var p = [];
  if(b.sinif) p.push(b.sinif + '. sınıf');
  if(b.uniteNo) p.push(b.uniteNo + '. ünite');
  if(b.konu) p.push(b.konu);
  else if(b.etkinlik) p.push(b.etkinlik);
  return p.join(' · ') || 'Genel';
}
/* Yanlış cevap yakalama: tıklanan seçenek kısa süre içinde "yanlış" işareti alırsa kaydet */
document.addEventListener('click', function(e){
  var btn = e.target.closest('button, .merdiven-secenek, .secenek, [class*="secenek"]');
  if(!btn || btn.closest('#dkabAsistan')) return;
  setTimeout(function(){
    if(!/(^|\s)(yanlis|od-yanlis|yanlış|hatali)(\s|$)/.test(btn.className)) return;
    var kap = btn.parentElement, soru = '';
    for(var i=0; i<5 && kap && !soru; i++){ soru = ekrandakiSoru(kap.parentElement || kap); kap = kap.parentElement; }
    var dogruEl = btn.parentElement && btn.parentElement.querySelector('.dogru, .od-dogru');
    sonYanlis = {soru: soru || '(soru metni algılanamadı)', secilen: temiz(btn.textContent).slice(0,200), dogru: dogruEl ? temiz(dogruEl.textContent).slice(0,200) : '', t: Date.now()};
  }, 120);
}, true);

/* ---------------- arayüz ---------------- */
var kok, pencere, liste, girdi, gonderBtn, durumKutusu, baglamEl, acik = false, mesgul = false, durum = null;
function css(){
  if(document.querySelector('link[href*="asistan.css"]')) return;
  var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = KLASOR + 'asistan.css'; document.head.appendChild(l);
}
function kur(){
  css(); mebYukle(); konuSayfasiniOku();
  kok = document.createElement('div');
  kok.id = 'dkabAsistan';
  kok.innerHTML =
    '<button type="button" class="dka-balon" aria-expanded="false" aria-controls="dkaPencere"><span class="dka-balon-simge" aria-hidden="true">💬</span><span>Bana Sor</span></button>'+
    '<section class="dka-pencere" id="dkaPencere" role="dialog" aria-modal="false" aria-labelledby="dkaBaslik" hidden>'+
      '<header class="dka-ust"><div><h2 id="dkaBaslik">Öğrenme Asistanı</h2><p class="dka-baglam" aria-live="polite"></p></div>'+
      '<div class="dka-ust-dugmeler"><button type="button" class="dka-temizle" title="Sohbeti temizle" aria-label="Sohbeti temizle">🗑️</button>'+
      '<button type="button" class="dka-kapat" aria-label="Pencereyi kapat">✕</button></div></header>'+
      '<div class="dka-durum" hidden></div>'+
      '<div class="dka-mesajlar" role="log" aria-live="polite" aria-relevant="additions"></div>'+
      '<div class="dka-oneriler" role="group" aria-label="Hazır sorular">'+ONERILER.map(function(o){ return '<button type="button" class="dka-oneri">'+kac(o)+'</button>'; }).join('')+'</div>'+
      '<form class="dka-form"><label class="dka-gizli" for="dkaGirdi">Sorunu yaz</label>'+
      '<textarea id="dkaGirdi" rows="1" maxlength="1500" placeholder="Sorunu yaz…"></textarea>'+
      '<button type="submit" class="dka-gonder" aria-label="Gönder">➤</button></form>'+
      '<p class="dka-not">Yapay zekâ hata yapabilir. Dinî konularda öğretmenine danış.</p>'+
    '</section>';
  document.body.appendChild(kok);
  pencere = kok.querySelector('.dka-pencere'); liste = kok.querySelector('.dka-mesajlar');
  girdi = kok.querySelector('#dkaGirdi'); gonderBtn = kok.querySelector('.dka-gonder');
  durumKutusu = kok.querySelector('.dka-durum'); baglamEl = kok.querySelector('.dka-baglam');
  kok.querySelector('.dka-balon').addEventListener('click', function(){ acik ? kapat() : ac(); });
  kok.querySelector('.dka-kapat').addEventListener('click', kapat);
  kok.querySelector('.dka-temizle').addEventListener('click', function(){ oturumYaz([]); liste.innerHTML = ''; karsila(); });
  kok.querySelector('.dka-form').addEventListener('submit', function(e){ e.preventDefault(); gonder(girdi.value); });
  girdi.addEventListener('keydown', function(e){ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); gonder(girdi.value); } });
  girdi.addEventListener('input', function(){ girdi.style.height='auto'; girdi.style.height = Math.min(girdi.scrollHeight, 120)+'px'; });
  kok.querySelector('.dka-oneriler').addEventListener('click', function(e){ var b = e.target.closest('.dka-oneri'); if(b) gonder(b.textContent); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && acik){ kapat(); kok.querySelector('.dka-balon').focus(); } });
  /* Pencerede yazarken tuşlar sayfanın oyunlarına (ok tuşlu labirent vb.) gitmesin */
  ['keydown','keyup','keypress'].forEach(function(tur){
    kok.addEventListener(tur, function(e){
      if(tur==='keydown' && e.key==='Escape' && acik){ kapat(); kok.querySelector('.dka-balon').focus(); }
      e.stopPropagation();
    });
  });
  oturumOku().forEach(function(m){ mesajCiz(m.rol, m.metin); });
}
function ac(){
  acik = true; pencere.hidden = false; kok.classList.add('dka-acik');
  kok.querySelector('.dka-balon').setAttribute('aria-expanded','true');
  baglamEl.textContent = baglamEtiketi(baglam());
  if(!liste.children.length) karsila();
  durumKontrol();
  setTimeout(function(){ girdi.focus(); }, 30);
}
function kapat(){
  acik = false; pencere.hidden = true; kok.classList.remove('dka-acik');
  kok.querySelector('.dka-balon').setAttribute('aria-expanded','false');
}
function karsila(){
  var b = baglam();
  var yer = b.konu ? '“'+b.konu+'” konusundasın' : (b.etkinlik ? '“'+b.etkinlik+'” bölümündesin' : (b.sinif ? b.sinif+'. sınıf sayfasındasın' : 'portaldasın'));
  mesajCiz('asistan', 'Merhaba! Şu an '+yer+'. Aşağıdaki hazır sorulardan birini seçebilir ya da kendi sorunu yazabilirsin. Birlikte düşünelim. 🙂', true);
}
function bicimle(metin){
  var satirlar = kac(metin).split(/\n/), out = [], liste = null;
  satirlar.forEach(function(s){
    var t = s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
    var mm = /^\s*(?:[-•*]|\d+[.)])\s+(.*)$/.exec(t);
    if(mm){ var tur = /^\s*\d/.test(t) ? 'ol' : 'ul'; if(!liste || liste.t!==tur){ if(liste) out.push('</'+liste.t+'>'); liste = {t:tur}; out.push('<'+tur+'>'); } out.push('<li>'+mm[1]+'</li>'); }
    else { if(liste){ out.push('</'+liste.t+'>'); liste = null; } if(t.trim()) out.push('<p>'+t+'</p>'); }
  });
  if(liste) out.push('</'+liste.t+'>');
  return out.join('');
}
function mesajCiz(rol, metin, gecici){
  var d = document.createElement('div');
  d.className = 'dka-mesaj dka-' + (rol==='ogrenci' ? 'ogrenci' : rol==='sistem' ? 'sistem' : 'asistan');
  if(gecici) d.dataset.gecici = '1';
  d.innerHTML = rol==='ogrenci' ? '<p>'+kac(metin)+'</p>' : bicimle(metin);
  liste.appendChild(d); liste.scrollTop = liste.scrollHeight;
  return d;
}
function durumGoster(html){
  durumKutusu.innerHTML = html; durumKutusu.hidden = !html;
  var kapali = !!html;
  girdi.disabled = kapali; gonderBtn.disabled = kapali;
  Array.prototype.forEach.call(kok.querySelectorAll('.dka-oneri'), function(b){ b.disabled = kapali; });
}
var KURULUM = 'Öğretmenin kurulumu yapınca burada gerçek bir yapay zekâ asistanı seninle konuşacak. Kurulum adımları portal klasöründeki <b>ASISTAN-KURULUM.txt</b> dosyasında.';
function durumKontrol(){
  if(location.protocol === 'file:'){
    durumGoster('<b>Asistan şu an bağlı değil.</b> Portal dosyadan açıldığı için yapay zekâya bağlanılamıyor. Portalı klasördeki <b>baslat.vbs</b> ile açarsan asistan çalışır (API anahtarı tanımlıysa). ' + KURULUM);
    return;
  }
  if(!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)){
    durumGoster('<b>Asistan bu çevrim içi sürümde henüz etkin değil.</b> Şimdilik yalnızca öğretmenin bilgisayarında, portal baslat.vbs ile açıldığında çalışabilir. Bu yüzden şu an cevap veremiyorum.');
    return;
  }
  fetch(API + '/durum', {cache:'no-store'}).then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function(v){
      durum = v;
      if(!v.yapilandirildi) durumGoster('<b>Asistan henüz yapılandırılmadı.</b> Bu bilgisayarda yapay zekâ için API anahtarı tanımlanmamış; bu yüzden şu an cevap veremiyorum. ' + KURULUM);
      else durumGoster('');
    })
    .catch(function(){
      durumGoster('<b>Asistan şu an bağlı değil.</b> Portal, asistan sunucusu olmadan açılmış. Portalı <b>baslat.vbs</b> ile yeniden açmayı dene. ' + KURULUM);
    });
}
var HATA = {
  yapilandirilmadi: 'Asistan henüz yapılandırılmadı (API anahtarı yok).',
  anahtar_gecersiz: 'API anahtarı geçersiz görünüyor. Öğretmenin anahtarı kontrol etmeli.',
  yetki_yok: 'Bu API anahtarının bu işlem için yetkisi yok.',
  model_bulunamadi: 'Ayarlardaki yapay zekâ modeli bulunamadı.',
  yogunluk: 'Yapay zekâ servisi şu an yoğun. Biraz sonra tekrar dene.',
  cok_hizli: 'Çok hızlı soru gönderildi. Bir dakika bekleyip tekrar dene.',
  baglanti: 'Yapay zekâ servisine ulaşılamadı. İnternet bağlantısını kontrol et.',
  istek_buyuk: 'Mesaj çok uzun. Daha kısa yazmayı dene.'
};
function gonder(metin){
  metin = temiz(metin);
  if(!metin || mesgul || girdi.disabled) return;
  var b = baglam();
  baglamEl.textContent = baglamEtiketi(b);
  if(/^Yanlışımı açıkla\.?$/i.test(metin) && !b.sonYanlis && !b.soru){
    metin += ' (Ekranda yanlış yaptığım bir soru algılanmadıysa, hangi soruyu yanlış yaptığımı sana yazacağım.)';
  }
  Array.prototype.forEach.call(liste.querySelectorAll('[data-gecici]'), function(x){ x.removeAttribute('data-gecici'); });
  mesajCiz('ogrenci', metin);
  var gecmis = oturumOku(); gecmis.push({rol:'ogrenci', metin:metin}); oturumYaz(gecmis);
  girdi.value = ''; girdi.style.height = 'auto';
  mesgul = true; gonderBtn.disabled = true;
  var bekle = mesajCiz('sistem', 'Düşünüyorum…'); bekle.classList.add('dka-bekle');
  var govde = JSON.stringify({
    sinif: b.sinif, unite: b.unite, konu: b.konu, etkinlik: b.etkinlik, soru: b.soru, sonYanlis: b.sonYanlis,
    ciktilar: b.ciktilar, icerik: (b.icerik||'').slice(0, 20000),
    mesajlar: gecmis.slice(-12)
  });
  fetch(API, {method:'POST', headers:{'Content-Type':'application/json'}, body: govde})
    .then(function(r){ return r.json().catch(function(){ return {hata:'servis_hatasi'}; }); })
    .then(function(v){
      bekle.remove();
      if(v && v.cevap){
        mesajCiz('asistan', v.cevap);
        var g = oturumOku(); g.push({rol:'asistan', metin:v.cevap}); oturumYaz(g);
      } else {
        mesajCiz('sistem', '⚠️ ' + (HATA[v && v.hata] || 'Asistan şu an cevap veremedi.') + ' Bu bir yapay zekâ cevabı değildir.');
        if(v && v.hata === 'yapilandirilmadi') durumKontrol();
      }
    })
    .catch(function(){
      bekle.remove();
      mesajCiz('sistem', '⚠️ Asistan sunucusuna ulaşılamadı. Portalı baslat.vbs ile açtığından emin ol.');
    })
    .then(function(){ mesgul = false; gonderBtn.disabled = girdi.disabled; });
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur); else kur();
/* test ve öğretmen raporu için dışarıya açık, salt-okunur bağlam */
window.dkabAsistanBaglam = function(){ var b = baglam(); return {sinif:b.sinif, uniteNo:b.uniteNo, unite:b.unite, konu:b.konu, etkinlik:b.etkinlik, soru:b.soru, sonYanlis:b.sonYanlis, ciktilarVar:!!b.ciktilar, icerikUzunluk:(b.icerik||'').length}; };
})();
