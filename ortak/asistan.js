/* ======================================================================
   ÖĞRENME ASİSTANI — "Bana Sor" (2026-10-31, ek katman; 2026-11-01 geliştirildi)
   * Sağ altta sabit balon; tıklanınca sohbet penceresi açılır.
   * Sınıf, ünite, konu, etkinlik ve son yanlış cevap sayfadan otomatik
     algılanır; açık konunun metni ve ünitenin resmî öğrenme çıktıları
     yapay zekâya kaynak olarak gönderilir.
   * 2026-11-01: sınıf seçimi (4-12), 10 çalışma biçimi, ünite/konu seçici,
     sohbet geçmişi, yeni sohbet, kopyalama, yazıyor animasyonu, sesli soru
     ve sesli okuma, portal bölümlerine bağlantılar.
   * Yapay zekâ bağlantısı YALNIZCA yerel sunucu (asistan-sunucu.py) veya
     Cloudflare Worker (asistan-bulut/worker.js) üzerinden yapılır; API
     anahtarı bu dosyada veya sayfalarda YOKTUR.
   * Sunucu yoksa ya da yapılandırılmamışsa pencere bunu açıkça söyler,
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
var LS_KOD = 'dkabAsistanKod';
var YEREL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
var ayarHazir = null;   /* ortak/asistan-ayar.js yüklendiğinde çözülür */
function ayarYukle(){
  if(ayarHazir) return ayarHazir;
  ayarHazir = new Promise(function(coz){
    if(location.protocol === 'file:') return coz();
    var sc = document.createElement('script');
    sc.src = KLASOR + 'asistan-ayar.js?v=' + Math.floor(Date.now()/3600000);
    sc.onload = function(){ coz(); }; sc.onerror = function(){ coz(); };
    document.head.appendChild(sc);
  });
  return ayarHazir;
}
/* Yerelde: asistan-sunucu.py (aynı adres). Çevrim içi sürümde: asistan-ayar.js'teki bulut adresi. */
function bulutAdresi(){
  var a = String(window.DKAB_ASISTAN_ADRES || '').trim().replace(/\/+$/,'');
  return /^https:\/\//.test(a) ? a : null;
}
var secilenTaban;   /* durumKontrol belirler: '' = yerel sunucu, 'https://…' = bulut */
function apiTaban(){
  if(secilenTaban !== undefined) return secilenTaban;
  return YEREL ? '' : bulutAdresi();
}
function kodOku(){ try{ return localStorage.getItem(LS_KOD) || ''; }catch(e){ return ''; } }
function kodYaz(k){ try{ if(k) localStorage.setItem(LS_KOD, k); else localStorage.removeItem(LS_KOD); }catch(e){} }
var LS_GECMIS = 'dkabAsistanGecmis';

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

/* ======================================================================
   2026-11-01 — SOHBET GELİŞTİRMESİ (ek katman)
   * Sınıf seviyesi: sayfadan algılanır; algılanamazsa öğrenciye sorulur.
   * 10 çalışma biçimi (mod), ünite/konu seçici (MEB programından).
   * Sohbet geçmişi (yalnızca bu cihazda), yeni sohbet, kopyalama,
     yazıyor animasyonu, sesli soru ve sesli okuma, geniş görünüm.
   * Portal bölümlerine (Açık Uçlu Soru Merkezi, Sınav Merkezi, Etkinlik
     ve Oyun) bağlantılar YEREL olarak üretilir; yapay zekâ adres yazmaz.
   * Sunucu/bulut bağlantısı yoksa hiçbir sahte cevap üretilmez.
====================================================================== */
var LS_SOHBETLER = 'dkabAsistanSohbetler', LS_AKTIF = 'dkabAsistanAktif', LS_SINIF = 'dkabAsistanSinif', LS_SES = 'dkabAsistanSes';
var AZAMI_SOHBET = 20, AZAMI_MESAJ = 40;
var MODLAR = [
  {k:'anlat',       ad:'Konuyu Anlat',              ikon:'📖', cumle:'{K} anlatır mısın?'},
  {k:'acikla',      ad:'Anlamadığım Yeri Açıkla',   ikon:'❓', girdi:'Hangi kısmı anlamadın? Buraya yaz…'},
  {k:'ornek',       ad:'Günlük Hayattan Örnek Ver', ikon:'🏠', cumle:'{K} için günlük hayattan örnek verir misin?'},
  {k:'ayet',        ad:'Ayet ve Hadislerle Açıkla', ikon:'📜', cumle:'{K} ayet ve hadislerle açıklar mısın?'},
  {k:'karsilastir', ad:'Kavramları Karşılaştır',    ikon:'⚖️', cumle:'{K} ilgili kavramları karşılaştırır mısın?'},
  {k:'soru5',       ad:'Bana 5 Soru Sor',           ikon:'✅', cumle:'{K} ilgili bana 5 soru sor. Soruları tek tek sor.'},
  {k:'lgs',         ad:'LGS Sorusu Çöz',            ikon:'🎯', cumle:'{K} ilgili bir LGS sorusu çözelim.'},
  {k:'tyt',         ad:'TYT–AYT Hazırlık',          ikon:'🎓', cumle:'{K} ilgili TYT–AYT hazırlığı yapalım.'},
  {k:'yazili',      ad:'Yazılıya Hazırlan',         ikon:'📝', cumle:'{K} ilgili yazılıya hazırlanmak istiyorum.'},
  {k:'ozet',        ad:'Konuyu Özetle',             ikon:'🗂️', cumle:'{K} özetler misin?'}
];
function modBul(k){ return MODLAR.filter(function(m){ return m.k===k; })[0] || null; }

/* ---------------- yerel depolama (yalnızca bu cihaz) ---------------- */
function lsOku(k, v){ try{ var x = localStorage.getItem(k); return x === null ? v : JSON.parse(x); }catch(e){ return v; } }
function lsYaz(k, v){ try{ if(v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function sohbetler(){ var l = lsOku(LS_SOHBETLER, []); return Array.isArray(l) ? l : []; }
function sohbetleriYaz(l){
  l = l.filter(function(s){ return s && s.m && s.m.length; }).sort(function(a,b){ return b.t - a.t; }).slice(0, AZAMI_SOHBET);
  l.forEach(function(s){ s.m = s.m.slice(-AZAMI_MESAJ); });
  lsYaz(LS_SOHBETLER, l);
}
function yeniSohbetNesnesi(){ return {id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2,6), t: Date.now(), baslik: '', sinif: null, sinifElle: false, mod: null, secim: null, m: []}; }
var S = null;   /* etkin sohbet */
function sohbetYukle(){
  var id = lsOku(LS_AKTIF, null), l = sohbetler();
  S = l.filter(function(s){ return s.id === id; })[0] || null;
  if(!S){
    S = yeniSohbetNesnesi();
    var eski = oturumOku();   /* önceki sürümün oturum geçmişi */
    if(eski.length){ S.m = eski.map(function(x){ return {rol: x.rol === 'asistan' ? 'asistan' : 'ogrenci', metin: String(x.metin||'')}; }); S.baslik = basliktan(S.m); try{ sessionStorage.removeItem(LS_GECMIS); }catch(e){} }
  }
  lsYaz(LS_AKTIF, S.id);
}
function basliktan(m){ var ilk = (m||[]).filter(function(x){ return x.rol === 'ogrenci'; })[0]; return ilk ? temiz(ilk.metin).slice(0,60) : ''; }
function sohbetKaydet(){
  if(!S) return;
  S.t = Date.now(); if(!S.baslik) S.baslik = basliktan(S.m);
  var l = sohbetler().filter(function(s){ return s.id !== S.id; });
  if(S.m.length) l.push(S);
  sohbetleriYaz(l); lsYaz(LS_AKTIF, S.id);
}

/* ---------------- sınıf, ünite, konu ---------------- */
function sayfaSinifi(){ var s = sinifUnite().s; return (s >= 4 && s <= 12) ? s : null; }
function etkinSinif(){
  var p = sayfaSinifi();
  if(S && S.sinif && (S.sinifElle || !p)) return {s: S.sinif, kaynak: 'secim'};
  if(p) return {s: p, kaynak: 'sayfa'};
  var k = parseInt(lsOku(LS_SINIF, 0), 10);
  return (k >= 4 && k <= 12) ? {s: k, kaynak: 'secim'} : {s: null, kaynak: ''};
}
function mebNo(s, portalU){
  var E = window.MEB_ESLESTIRME;
  if(!portalU) return null;
  if(E && E['s'+s] && E['s'+s].sira){
    var b = E['s'+s].sira.filter(function(x){ return (x.portal||[]).indexOf(portalU) >= 0; })[0];
    return b ? b.meb : null;
  }
  return portalU;
}
function portalNo(s, meb){
  var E = window.MEB_ESLESTIRME;
  if(!meb) return null;
  if(E && E['s'+s] && E['s'+s].sira){
    var b = E['s'+s].sira.filter(function(x){ return x.meb === meb; })[0];
    return b && b.portal && b.portal.length ? b.portal[0] : null;
  }
  return meb;
}
function mebUniteleri(s){ var P = window.MEB_PROGRAM; return (P && P.siniflar && P.siniflar['s'+s]) || []; }
function mebUnite(s, no){ return mebUniteleri(s).filter(function(u){ return u.no === no; })[0] || null; }
function secimIcerigi(s, u){
  var un = mebUnite(s, u); if(!un) return {ciktilar:'', icerik:''};
  return {
    ciktilar: un.no + '. Ünite: ' + un.ad + '\n' + (un.ogrenmeCiktilari||[]).map(function(c){ return c.kod + ' — ' + c.ad; }).join('\n'),
    icerik: 'ÜNİTENİN İÇERİK ÇERÇEVESİ (MEB): ' + (un.icerikCercevesi||[]).join('; ') + '\nANAHTAR KAVRAMLAR: ' + (un.anahtarKavramlar||[]).join(', ')
  };
}
/* Sunucuya gidecek bağlamı sohbetin sınıf/konu seçimiyle birleştirir */
function tamBaglam(){
  var b = baglam(), es = etkinSinif();
  b.sinif = es.s; b.sinifKaynak = es.kaynak;
  if(es.kaynak === 'secim' && sayfaSinifi() && sayfaSinifi() !== es.s){ b.unite = ''; b.uniteNo = null; b.konu = ''; b.icerik = ''; b.ciktilar = ''; b.etkinlik = ''; b.soru = ''; }
  if(S && S.secim && S.secim.s === es.s){
    var si = secimIcerigi(es.s, S.secim.u);
    b.unite = S.secim.u + '. ünite — ' + S.secim.uAd;
    b.konu = S.secim.konu || '';
    b.ciktilar = si.ciktilar; b.icerik = si.icerik; b.etkinlik = ''; b.soru = '';
    b.mebU = S.secim.u; b.portalU = portalNo(es.s, S.secim.u);
  } else if(b.uniteNo && es.kaynak === 'sayfa'){
    b.portalU = b.uniteNo; b.mebU = mebNo(es.s, b.uniteNo);
  }
  return b;
}
function konuEtiketi(b){
  if(b.konu) return b.konu;
  if(S && S.secim && S.secim.s === b.sinif) return S.secim.uAd;
  if(b.unite && b.uniteNo) return b.unite.replace(/^\d+\. ünite —\s*/,'');
  return '';
}
function konuVarMi(b){ return !!(b.konu || b.uniteNo || (S && S.secim && S.secim.s === b.sinif)); }

/* ---------------- portal bağlantıları (yerel, sabit) ---------------- */
var KOK = (function(){ try{ return new URL('../', BETIK && BETIK.src ? BETIK.src : location.href).href; }catch(e){ return KLASOR + '../'; } })();
function baglantilar(b, mod){
  var g = b.sinif, out = [];
  if(!g) return out;
  var acik = {ad:'✍️ Açık uçlu sorular', url: KOK + 'acik-uclu-soru-merkezi/tum-siniflar.html#s' + g + (b.mebU ? '-u' + b.mebU : '')};
  var oyun = (g >= 4 && g <= 8 && b.portalU) ? {ad:'🎮 Etkinlik ve oyun', url: KOK + 'din-kulturu-tum-siniflar.html?oyun=s' + g + '-u' + b.portalU} : null;
  var yazili = {ad:'📄 Yazılı sınavlar', url: KOK + 'din-kulturu-tum-siniflar.html?sinif=s' + g};
  var lgs = {ad:'🎯 LGS Hazırlık', url: KOK + 'sinav-merkezi/lgs-hazirlik/index.html'};
  var tyt = {ad:'🎓 TYT hazırlık', url: KOK + 'sinav-merkezi/tyt-hazirlik/index.html'};
  var ayt = {ad:'🎓 AYT hazırlık', url: KOK + 'sinav-merkezi/ayt-hazirlik/index.html'};
  var sinav = {ad:'🏁 Sınav Merkezi', url: KOK + 'sinav-merkezi/index.html'};
  if(mod === 'lgs') out = [g === 8 ? lgs : sinav, acik];
  else if(mod === 'tyt') out = g >= 9 ? [tyt, ayt, acik] : [sinav, acik];
  else if(mod === 'yazili') out = [yazili, acik];
  else { out = [acik]; if(oyun) out.push(oyun); if(g === 8) out.push(lgs); else if(g >= 11) out.push(tyt); }
  return out.filter(Boolean).slice(0,3);
}

/* ---------------- biçimlendirme ---------------- */
function bicimle(metin){
  var satirlar = kac(metin).split(/\n/), out = [], liste = null;
  function listeKapat(){ if(liste){ out.push('</'+liste+'>'); liste = null; } }
  satirlar.forEach(function(s){
    var t = s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<b>$1</b>');
    var bas = /^\s*#{1,4}\s+(.*)$/.exec(t);
    if(bas){ listeKapat(); out.push('<h3 class="dka-b">'+bas[1].replace(/\s*#+\s*$/,'')+'</h3>'); return; }
    var alinti = /^\s*&gt;\s?(.*)$/.exec(t);
    if(alinti){ listeKapat(); out.push('<blockquote>'+alinti[1]+'</blockquote>'); return; }
    var mm = /^\s*(?:[-•*]|\d+[.)])\s+(.*)$/.exec(t);
    if(mm){ var tur = /^\s*\d/.test(t) ? 'ol' : 'ul'; if(liste !== tur){ listeKapat(); liste = tur; out.push('<'+tur+'>'); } out.push('<li>'+mm[1]+'</li>'); return; }
    listeKapat(); if(t.trim()) out.push('<p>'+t+'</p>');
  });
  listeKapat();
  return out.join('');
}
function duzMetin(m){ return String(m||'').replace(/\*\*(.+?)\*\*/g,'$1').replace(/^\s*#{1,4}\s+/gm,'').replace(/^\s*>\s?/gm,'').replace(/`/g,''); }

/* ---------------- ses: konuşma tanıma ve sesli okuma ---------------- */
var TANIMA = window.SpeechRecognition || window.webkitSpeechRecognition || null;
var SENTEZ = ('speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function') ? window.speechSynthesis : null;
var sesAcik = !!lsOku(LS_SES, false), konusanDugme = null, trSesUyari = false;
function turkceSes(){ if(!SENTEZ) return null; var v = SENTEZ.getVoices() || []; return v.filter(function(x){ return /^tr(-|_|$)/i.test(x.lang); })[0] || null; }
function seslendir(metin, dugme){
  if(!SENTEZ) return;
  sesDurdur();
  var parca = emojiSiz(duzMetin(metin)).replace(/\s*\n+\s*/g, '. ').slice(0, 4000);
  if(!parca) return;
  var u = new SpeechSynthesisUtterance(parca);
  u.lang = 'tr-TR'; u.rate = 0.98;
  var v = turkceSes(); if(v) u.voice = v;
  else if(!trSesUyari && SENTEZ.getVoices().length){ trSesUyari = true; mesajCiz('sistem', 'Bu cihazda Türkçe ses bulunamadı; okuma başka bir sesle yapılabilir.'); }
  if(dugme){ konusanDugme = dugme; dugme.classList.add('dka-konusuyor'); dugme.setAttribute('aria-pressed','true'); }
  u.onend = u.onerror = function(){ if(konusanDugme){ konusanDugme.classList.remove('dka-konusuyor'); konusanDugme.setAttribute('aria-pressed','false'); konusanDugme = null; } };
  SENTEZ.speak(u);
}
function sesDurdur(){ if(SENTEZ){ try{ SENTEZ.cancel(); }catch(e){} } if(konusanDugme){ konusanDugme.classList.remove('dka-konusuyor'); konusanDugme.setAttribute('aria-pressed','false'); konusanDugme = null; } }
if(SENTEZ && SENTEZ.addEventListener) SENTEZ.addEventListener('voiceschanged', function(){});
var dinleyici = null, dinliyor = false;
function mikrofon(){
  if(!TANIMA || girdi.disabled) return;
  if(dinliyor && dinleyici){ dinleyici.stop(); return; }
  sesDurdur();
  try{
    dinleyici = new TANIMA();
    dinleyici.lang = 'tr-TR'; dinleyici.interimResults = true; dinleyici.continuous = false; dinleyici.maxAlternatives = 1;
  }catch(e){ mesajCiz('sistem', 'Bu tarayıcı sesli soru özelliğini desteklemiyor.'); return; }
  var onceki = girdi.value ? girdi.value.replace(/\s+$/,'') + ' ' : '';
  dinleyici.onresult = function(e){
    var t = ''; for(var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
    girdi.value = onceki + t; girdi.dispatchEvent(new Event('input'));
  };
  dinleyici.onerror = function(e){
    var m = {'not-allowed':'Mikrofon izni verilmedi. Tarayıcının adres çubuğundan mikrofon iznini açabilirsin.', 'service-not-allowed':'Mikrofon izni verilmedi.', 'no-speech':'Ses algılanamadı. Tekrar dene.', 'audio-capture':'Mikrofon bulunamadı.', 'network':'Sesli soru için internet bağlantısı gerekiyor.'}[e.error];
    if(m) mesajCiz('sistem', m);
  };
  dinleyici.onend = function(){ dinliyor = false; micBtn.classList.remove('dka-dinliyor'); micBtn.setAttribute('aria-pressed','false'); micBtn.setAttribute('aria-label','Sesli soru sor'); girdi.focus(); };
  try{ dinleyici.start(); dinliyor = true; micBtn.classList.add('dka-dinliyor'); micBtn.setAttribute('aria-pressed','true'); micBtn.setAttribute('aria-label','Dinlemeyi durdur'); }
  catch(e){ dinliyor = false; }
}

/* ---------------- arayüz ---------------- */
var kok, pencere, liste, girdi, gonderBtn, micBtn, durumKutusu, baglamEl, cubuk, modlarEl, panelEl, acik = false, mesgul = false, durum = null, bekleyenMod = null;
function css(){
  if(document.querySelector('link[href*="asistan.css"]')) return;
  var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = KLASOR + 'asistan.css'; document.head.appendChild(l);
}
function dugme(sinif, ikon, etiket, ek){ return '<button type="button" class="'+sinif+'" title="'+kac(etiket)+'" aria-label="'+kac(etiket)+'"'+(ek||'')+'>'+ikon+'</button>'; }
function kur(){
  css(); mebYukle(); konuSayfasiniOku(); ayarYukle(); sohbetYukle();
  kok = document.createElement('div');
  kok.id = 'dkabAsistan';
  kok.innerHTML =
    '<button type="button" class="dka-balon" aria-expanded="false" aria-controls="dkaPencere"><span class="dka-balon-simge" aria-hidden="true">💬</span><span>Bana Sor</span></button>'+
    '<section class="dka-pencere" id="dkaPencere" role="dialog" aria-modal="false" aria-labelledby="dkaBaslik" hidden>'+
      '<header class="dka-ust"><div class="dka-ust-sol"><h2 id="dkaBaslik">Öğrenme Asistanı</h2><p class="dka-baglam" aria-live="polite"></p></div>'+
      '<div class="dka-ust-dugmeler">'+
        dugme('dka-gecmis-ac', '🕘', 'Sohbet geçmişi')+
        dugme('dka-yeni', '＋', 'Yeni sohbet')+
        (SENTEZ ? dugme('dka-ses', '🔈', 'Sesli okuma', ' aria-pressed="false"') : '')+
        dugme('dka-genislet', '⤢', 'Pencereyi büyüt', ' aria-pressed="false"')+
        dugme('dka-kapat', '✕', 'Pencereyi kapat')+
      '</div></header>'+
      '<div class="dka-cubuk" role="group" aria-label="Sınıf, konu ve çalışma biçimi"></div>'+
      '<div class="dka-durum" hidden></div>'+
      '<div class="dka-mesajlar" role="log" aria-live="polite" aria-relevant="additions"></div>'+
      '<div class="dka-panel" hidden></div>'+
      '<div class="dka-modlar" role="group" aria-label="Çalışma biçimleri">'+
        '<button type="button" class="dka-mod-ac" aria-expanded="false" title="Tüm çalışma biçimlerini göster" aria-label="Tüm çalışma biçimlerini göster">▦</button>'+
        MODLAR.map(function(m){ return '<button type="button" class="dka-oneri dka-mod" data-mod="'+m.k+'"><span aria-hidden="true">'+m.ikon+'</span> '+kac(m.ad)+'</button>'; }).join('')+
      '</div>'+
      '<form class="dka-form"><label class="dka-gizli" for="dkaGirdi">Sorunu yaz</label>'+
      (TANIMA ? '<button type="button" class="dka-mik" aria-label="Sesli soru sor" aria-pressed="false" title="Sesli soru sor">🎤</button>' : '')+
      '<textarea id="dkaGirdi" rows="1" maxlength="1500" placeholder="Sorunu yaz…" lang="tr"></textarea>'+
      '<button type="submit" class="dka-gonder" aria-label="Gönder">➤</button></form>'+
      '<p class="dka-not">Yapay zekâ hata yapabilir; ayet ve hadisleri öğretmeninle kontrol et. Sohbetlerin yalnızca bu cihazda saklanır.</p>'+
    '</section>';
  document.body.appendChild(kok);
  pencere = kok.querySelector('.dka-pencere'); liste = kok.querySelector('.dka-mesajlar');
  girdi = kok.querySelector('#dkaGirdi'); gonderBtn = kok.querySelector('.dka-gonder'); micBtn = kok.querySelector('.dka-mik');
  durumKutusu = kok.querySelector('.dka-durum'); baglamEl = kok.querySelector('.dka-baglam');
  cubuk = kok.querySelector('.dka-cubuk'); modlarEl = kok.querySelector('.dka-modlar'); panelEl = kok.querySelector('.dka-panel');
  kok.querySelector('.dka-balon').addEventListener('click', function(){ acik ? kapat() : ac(); });
  kok.querySelector('.dka-kapat').addEventListener('click', kapat);
  kok.querySelector('.dka-yeni').addEventListener('click', yeniSohbet);
  kok.querySelector('.dka-gecmis-ac').addEventListener('click', function(){ panelEl.dataset.tur === 'gecmis' && !panelEl.hidden ? panelKapat() : gecmisGoster(); });
  kok.querySelector('.dka-genislet').addEventListener('click', function(){ var g = kok.classList.toggle('dka-genis'); this.setAttribute('aria-pressed', String(g)); this.setAttribute('aria-label', g ? 'Pencereyi küçült' : 'Pencereyi büyüt'); this.title = this.getAttribute('aria-label'); });
  var sesBtn = kok.querySelector('.dka-ses');
  if(sesBtn){ sesDugmesi(sesBtn); sesBtn.addEventListener('click', function(){ sesAcik = !sesAcik; lsYaz(LS_SES, sesAcik); if(!sesAcik) sesDurdur(); sesDugmesi(sesBtn); }); }
  if(micBtn) micBtn.addEventListener('click', mikrofon);
  kok.querySelector('.dka-form').addEventListener('submit', function(e){ e.preventDefault(); gonder(girdi.value); });
  girdi.addEventListener('keydown', function(e){ if(e.key==='Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); gonder(girdi.value); } });
  girdi.addEventListener('input', function(){ girdi.style.height='auto'; girdi.style.height = Math.min(girdi.scrollHeight, 140)+'px'; });
  modlarEl.addEventListener('click', function(e){
    if(e.target.closest('.dka-mod-ac')){ var a = modlarEl.classList.toggle('dka-modlar-acik'); e.target.closest('.dka-mod-ac').setAttribute('aria-expanded', String(a)); return; }
    var b = e.target.closest('[data-mod]'); if(b) modSec(b.dataset.mod);
    var y = e.target.closest('.dka-yanlis'); if(y) gonder('Yanlışımı açıkla.');
  });
  cubuk.addEventListener('click', function(e){
    if(e.target.closest('.dka-sinif-btn')) sinifSor();
    else if(e.target.closest('.dka-konu-btn')) konuSec(null);
    else if(e.target.closest('.dka-mod-kapat')){ S.mod = null; sohbetKaydet(); cubukCiz(); girdi.placeholder = 'Sorunu yaz…'; }
  });
  liste.addEventListener('click', mesajTiklama);
  panelEl.addEventListener('click', panelTiklama);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && acik){ kapat(); kok.querySelector('.dka-balon').focus(); } });
  /* Pencerede yazarken tuşlar sayfanın oyunlarına (ok tuşlu labirent vb.) gitmesin */
  ['keydown','keyup','keypress'].forEach(function(tur){
    kok.addEventListener(tur, function(e){
      if(tur==='keydown' && e.key==='Escape' && acik){ if(!panelEl.hidden){ panelKapat(); } else { kapat(); kok.querySelector('.dka-balon').focus(); } }
      e.stopPropagation();
    });
  });
  sohbetCiz();
  /* 2026-11-14: "Öğretmene Sor" sekmesi (ortak/ogretmene-sor.js) — öğrencinin sorusu öğretmenin Mesajlar paneline gider */
  if(!document.querySelector('script[src*="ogretmene-sor.js"]')){
    var os = document.createElement('script'); os.src = KLASOR + 'ogretmene-sor.js?v=20261114'; document.head.appendChild(os);
  }
}
function sesDugmesi(b){ b.textContent = sesAcik ? '🔊' : '🔈'; b.setAttribute('aria-pressed', String(sesAcik)); var t = sesAcik ? 'Sesli okuma açık (kapatmak için tıkla)' : 'Sesli okuma kapalı (açmak için tıkla)'; b.title = t; b.setAttribute('aria-label', t); }
function ac(){
  acik = true; pencere.hidden = false; kok.classList.add('dka-acik');
  kok.querySelector('.dka-balon').setAttribute('aria-expanded','true');
  cubukCiz();
  if(!liste.children.length) karsila();
  durumKontrol();
  yanlisCipi();
  setTimeout(function(){ if(!etkinSinif().s) sinifSor(); else girdi.focus(); }, 30);
}
function kapat(){
  acik = false; pencere.hidden = true; kok.classList.remove('dka-acik');
  kok.querySelector('.dka-balon').setAttribute('aria-expanded','false');
  sesDurdur(); if(dinliyor && dinleyici) dinleyici.stop();
}
function cubukCiz(){
  var b = tamBaglam(), es = etkinSinif(), m = S && S.mod ? modBul(S.mod) : null;
  baglamEl.textContent = baglamEtiketi(b);
  var konu = konuEtiketi(b);
  cubuk.innerHTML =
    '<button type="button" class="dka-cip dka-sinif-btn" title="Sınıfını değiştir">🎓 '+(es.s ? es.s+'. sınıf' : 'Sınıf seç')+' ▾</button>'+
    (es.s ? '<button type="button" class="dka-cip dka-konu-btn" title="Ünite ve konu seç">📚 '+kac(konu ? konu.slice(0,38) : 'Konu seç')+' ▾</button>' : '')+
    (m ? '<span class="dka-cip dka-mod-cip">'+m.ikon+' '+kac(m.ad)+'<button type="button" class="dka-mod-kapat" aria-label="Çalışma biçimini kapat" title="Serbest sohbete dön">✕</button></span>' : '');
  Array.prototype.forEach.call(modlarEl.querySelectorAll('[data-mod]'), function(x){ x.setAttribute('aria-pressed', String(!!(m && x.dataset.mod === m.k))); });
}
function yanlisCipi(){
  var var_ = sonYanlis && Date.now() - sonYanlis.t < 30*60*1000, el = modlarEl.querySelector('.dka-yanlis');
  if(var_ && !el){ var b = document.createElement('button'); b.type = 'button'; b.className = 'dka-oneri dka-yanlis'; b.innerHTML = '<span aria-hidden="true">🔁</span> Yanlışımı açıkla'; modlarEl.insertBefore(b, modlarEl.children[1]); }
  else if(!var_ && el) el.remove();
}
function karsila(){
  var b = tamBaglam();
  var yer = b.konu ? '“'+b.konu+'” konusundasın' : (b.etkinlik ? '“'+b.etkinlik+'” bölümündesin' : (b.sinif ? b.sinif+'. sınıf için hazırım' : 'portaldasın'));
  mesajCiz('asistan', 'Merhaba! Şu an '+yer+'. Aşağıdaki çalışma biçimlerinden birini seçebilir ya da sorunu kendin yazabilirsin. 🎤 düğmesiyle sesli de sorabilirsin. Birlikte düşünelim. 🙂', {gecici:true});
}
function sohbetCiz(){
  liste.innerHTML = '';
  S.m.forEach(function(x, i){ mesajCiz(x.rol, x.metin, {son: i === S.m.length - 1}); });
  cubukCiz();
  girdi.placeholder = S.mod && modBul(S.mod) && modBul(S.mod).girdi ? modBul(S.mod).girdi : 'Sorunu yaz…';
}
function yeniSohbet(){
  sesDurdur(); panelKapat();
  sohbetKaydet();
  var onceki = S; S = yeniSohbetNesnesi();
  if(onceki && onceki.sinifElle){ S.sinif = onceki.sinif; S.sinifElle = true; }
  lsYaz(LS_AKTIF, S.id);
  sohbetCiz(); karsila(); girdi.value = ''; girdi.focus();
}
function mesajCiz(rol, metin, ops){
  ops = ops || {};
  var d = document.createElement('div');
  d.className = 'dka-mesaj dka-' + (rol==='ogrenci' ? 'ogrenci' : rol==='sistem' ? 'sistem' : 'asistan');
  if(ops.gecici) d.dataset.gecici = '1';
  if(rol === 'ogrenci') d.innerHTML = '<p>'+kac(metin).replace(/\n/g,'<br>')+'</p>';
  else if(rol === 'sistem') d.innerHTML = '<p>'+kac(metin)+'</p>';
  else {
    d.innerHTML = '<div class="dka-icerik">'+bicimle(metin)+'</div>' + (ops.gecici ? '' :
      '<div class="dka-araclar">'+
        '<button type="button" class="dka-arac dka-kopyala" aria-label="Cevabı kopyala">📋 Kopyala</button>'+
        (SENTEZ ? '<button type="button" class="dka-arac dka-dinle" aria-label="Cevabı dinle" aria-pressed="false">🔊 Dinle</button>' : '')+
      '</div>');
    d._metin = metin;
  }
  liste.appendChild(d);
  if(rol === 'asistan' && !ops.gecici && ops.son){ baglantiCiz(d); }
  liste.scrollTop = liste.scrollHeight;
  return d;
}
function baglantiCiz(d){
  Array.prototype.forEach.call(liste.querySelectorAll('.dka-baglantilar'), function(x){ x.remove(); });
  var l = baglantilar(tamBaglam(), S && S.mod);
  if(!l.length) return;
  var k = document.createElement('div'); k.className = 'dka-baglantilar';
  k.innerHTML = '<span>Portalda devam et:</span>' + l.map(function(x){ return '<a href="'+kac(x.url)+'">'+kac(x.ad)+'</a>'; }).join('');
  d.appendChild(k);
}
function kopyala(metin, btn){
  var t = duzMetin(metin);
  var bitti = function(){ var e = btn.textContent; btn.textContent = '✓ Kopyalandı'; setTimeout(function(){ btn.textContent = e; }, 1600); };
  if(navigator.clipboard && window.isSecureContext){ navigator.clipboard.writeText(t).then(bitti, function(){ eskiKopya(t) && bitti(); }); }
  else if(eskiKopya(t)) bitti();
}
function eskiKopya(t){
  try{ var a = document.createElement('textarea'); a.value = t; a.setAttribute('readonly',''); a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); var ok = document.execCommand('copy'); a.remove(); return ok; }catch(e){ return false; }
}
function mesajTiklama(e){
  var m = e.target.closest('.dka-mesaj'); if(!m) return;
  if(e.target.closest('.dka-kopyala')) kopyala(m._metin, e.target.closest('.dka-kopyala'));
  else if(e.target.closest('.dka-dinle')){ var b = e.target.closest('.dka-dinle'); if(b.classList.contains('dka-konusuyor')) sesDurdur(); else seslendir(m._metin, b); }
}
/* ---- paneller: sınıf seçimi, konu seçimi, geçmiş ---- */
function panelAc(tur, html){ panelEl.dataset.tur = tur; panelEl.innerHTML = html; panelEl.hidden = false; var f = panelEl.querySelector('button'); if(f) setTimeout(function(){ f.focus(); }, 20); }
function panelKapat(){ panelEl.hidden = true; panelEl.innerHTML = ''; panelEl.dataset.tur = ''; }
function panelBaslik(t){ return '<div class="dka-panel-ust"><h3>'+t+'</h3><button type="button" class="dka-panel-kapat" aria-label="Kapat">✕</button></div>'; }
function sinifSor(){
  var es = etkinSinif(), not = sayfaSinifi() ? '<p class="dka-panel-not">Bu sayfa '+sayfaSinifi()+'. sınıfa ait. Farklı bir sınıf seçersen asistan seninle o sınıfın düzeyinde konuşur.</p>' : '<p class="dka-panel-not">Sana uygun dilde konuşabilmem için sınıfını seç.</p>';
  var h = panelBaslik('Kaçıncı sınıftasın?') + not + '<div class="dka-izgara dka-sinif-izgara">';
  for(var s = 4; s <= 12; s++) h += '<button type="button" data-sinif="'+s+'"'+(es.s === s ? ' aria-pressed="true"' : '')+'>'+s+'. sınıf</button>';
  panelAc('sinif', h + '</div>');
}
function konuSec(sonra){
  var es = etkinSinif(); if(!es.s){ sinifSor(); return; }
  bekleyenMod = sonra || null;
  var u = mebUniteleri(es.s);
  if(!u.length){ panelAc('konu', panelBaslik('Ünite seç') + '<p class="dka-panel-not">Ünite listesi yükleniyor…</p>'); setTimeout(function(){ if(panelEl.dataset.tur === 'konu') konuSec(sonra); }, 700); return; }
  var h = panelBaslik(es.s + '. sınıf · Ünite seç') + (bekleyenMod ? '<p class="dka-panel-not">Önce çalışmak istediğin üniteyi seç.</p>' : '') + '<div class="dka-izgara dka-unite-izgara">' +
    u.map(function(x){ return '<button type="button" data-unite="'+x.no+'"><b>'+x.no+'. Ünite</b> '+kac(x.ad)+'</button>'; }).join('') + '</div>' +
    ((S.secim || sayfaSinifi() === es.s) ? '<button type="button" class="dka-panel-link" data-sayfa-konu="1">↩ Sayfadaki konuya dön</button>' : '');
  panelAc('konu', h);
}
function konuListesi(no){
  var es = etkinSinif(), un = mebUnite(es.s, no); if(!un) return;
  var h = panelBaslik(no + '. Ünite · ' + kac(un.ad)) + '<div class="dka-izgara dka-konu-izgara">' +
    '<button type="button" data-konu="" data-u="'+no+'"><b>Ünitenin tamamı</b></button>' +
    (un.icerikCercevesi || []).map(function(k){ return '<button type="button" data-konu="'+kac(k)+'" data-u="'+no+'">'+kac(k)+'</button>'; }).join('') + '</div>' +
    '<button type="button" class="dka-panel-link" data-geri="1">← Ünitelere dön</button>';
  panelAc('konu', h);
}
function gecmisGoster(){
  sohbetKaydet();
  var l = sohbetler();
  var h = panelBaslik('Sohbet geçmişi') + '<p class="dka-panel-not">Sohbetlerin yalnızca bu cihazda, bu tarayıcıda saklanır; başka hiçbir yere kaydedilmez. En fazla '+AZAMI_SOHBET+' sohbet tutulur.</p>';
  if(!l.length) h += '<p class="dka-panel-bos">Henüz kayıtlı sohbet yok.</p>';
  else h += '<ul class="dka-gecmis">' + l.map(function(s){
    var t = new Date(s.t), tarih = t.toLocaleDateString('tr-TR', {day:'numeric', month:'short'}) + ' ' + t.toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'});
    return '<li'+(S && s.id === S.id ? ' class="dka-gecmis-aktif"' : '')+'><button type="button" class="dka-gecmis-ac-btn" data-id="'+s.id+'"><b>'+kac(s.baslik || 'Sohbet')+'</b><span>'+(s.sinif ? s.sinif+'. sınıf · ' : '')+tarih+' · '+s.m.length+' mesaj</span></button>'+
      '<button type="button" class="dka-gecmis-sil" data-sil="'+s.id+'" aria-label="Bu sohbeti sil">🗑️</button></li>';
  }).join('') + '</ul><button type="button" class="dka-panel-link dka-tumunu-sil" data-tumunu-sil="1">Tüm geçmişi sil</button>';
  panelAc('gecmis', h);
}
function panelTiklama(e){
  var t = e.target.closest('button'); if(!t) return;
  if(t.classList.contains('dka-panel-kapat')){ panelKapat(); girdi.focus(); return; }
  if(t.dataset.sinif){
    var s = parseInt(t.dataset.sinif, 10);
    S.sinif = s; S.sinifElle = (sayfaSinifi() !== s);
    if(S.secim && S.secim.s !== s) S.secim = null;
    lsYaz(LS_SINIF, s); sohbetKaydet(); panelKapat(); cubukCiz();
    mesajCiz('sistem', s + '. sınıf seçildi. Seninle bu sınıfın düzeyinde konuşacağım.');
    girdi.focus(); return;
  }
  if(t.dataset.unite){ konuListesi(parseInt(t.dataset.unite, 10)); return; }
  if(t.dataset.geri){ konuSec(bekleyenMod); return; }
  if(t.dataset.u){
    var es = etkinSinif(), no = parseInt(t.dataset.u, 10), un = mebUnite(es.s, no);
    S.secim = {s: es.s, u: no, uAd: un ? un.ad : '', konu: t.dataset.konu || ''};
    sohbetKaydet(); panelKapat(); cubukCiz();
    mesajCiz('sistem', 'Konu: ' + (S.secim.konu || (no + '. ünite — ' + S.secim.uAd)));
    if(bekleyenMod){ var m = bekleyenMod; bekleyenMod = null; modSec(m); } else girdi.focus();
    return;
  }
  if(t.dataset.sayfaKonu){ S.secim = null; S.sinifElle = false; sohbetKaydet(); panelKapat(); cubukCiz(); mesajCiz('sistem', 'Sayfadaki konuya dönüldü.'); return; }
  if(t.dataset.id){
    sohbetKaydet();
    var bul = sohbetler().filter(function(x){ return x.id === t.dataset.id; })[0];
    if(bul){ sesDurdur(); S = bul; lsYaz(LS_AKTIF, S.id); panelKapat(); sohbetCiz(); if(!S.m.length) karsila(); }
    return;
  }
  if(t.dataset.sil){
    sohbetleriYaz(sohbetler().filter(function(x){ return x.id !== t.dataset.sil; }));
    if(S && S.id === t.dataset.sil){ S = yeniSohbetNesnesi(); lsYaz(LS_AKTIF, S.id); sohbetCiz(); karsila(); }
    gecmisGoster(); return;
  }
  if(t.dataset.tumunuSil){
    if(!t.dataset.onay){ t.dataset.onay = '1'; t.textContent = 'Emin misin? Silmek için tekrar tıkla'; return; }
    lsYaz(LS_SOHBETLER, null); S = yeniSohbetNesnesi(); lsYaz(LS_AKTIF, S.id); panelKapat(); sohbetCiz(); karsila(); return;
  }
}
/* ---- çalışma biçimi seçimi ---- */
function modSec(k){
  var m = modBul(k); if(!m || girdi.disabled || mesgul) return;
  var es = etkinSinif();
  if(!es.s){ sinifSor(); return; }
  var b = tamBaglam();
  if(!konuVarMi(b)){ konuSec(k); return; }
  S.mod = k; sohbetKaydet(); cubukCiz();
  if(m.girdi){ girdi.placeholder = m.girdi; girdi.focus(); mesajCiz('sistem', m.ikon + ' ' + m.ad + ': ' + m.girdi.replace(/ Buraya yaz…$/,'').replace(/…$/,'')); return; }
  girdi.placeholder = 'Cevabını ya da sorunu yaz…';
  var konu = konuEtiketi(b);
  var ozne = konu ? '“' + konu + '” konusunu' : 'Bu konuyu';
  if(/ ilgili/.test(m.cumle)) ozne = konu ? '“' + konu + '” konusuyla' : 'Bu konuyla';
  else if(/ için /.test(m.cumle)) ozne = konu ? '“' + konu + '” konusu' : 'Bu konu';
  gonder(m.cumle.replace('{K}', ozne));
}
var KURULUM = 'Öğretmenin kurulumu yapınca burada gerçek bir yapay zekâ asistanı seninle konuşacak. Kurulum adımları portal klasöründeki <b>ASISTAN-KURULUM.txt</b> dosyasında.';
function durumGoster(html){
  durumKutusu.innerHTML = html; durumKutusu.hidden = !html;
  var kapali = !!html;
  girdi.disabled = kapali; gonderBtn.disabled = kapali; if(micBtn) micBtn.disabled = kapali;
  Array.prototype.forEach.call(modlarEl.querySelectorAll('.dka-oneri'), function(b){ b.disabled = kapali; });
}
function durumKontrol(){
  if(location.protocol === 'file:'){
    durumGoster('<b>Asistan şu an bağlı değil.</b> Portal dosyadan açıldığı için yapay zekâya bağlanılamıyor. Portalı klasördeki <b>baslat.vbs</b> ile açarsan asistan çalışır (API anahtarı tanımlıysa). ' + KURULUM);
    return;
  }
  ayarYukle().then(function(){
    var bulut = bulutAdresi();
    /* Bu bilgisayarda: yerel sunucu hazırsa onu, değilse (ücretsiz) bulut köprüsünü kullan */
    var once = YEREL
      ? fetch(API + '/durum', {cache:'no-store'}).then(function(r){ return r.ok ? r.json() : {}; }).catch(function(){ return {}; })
          .then(function(v){ return (v && v.yapilandirildi) ? '' : (bulut || ''); })
      : Promise.resolve(bulut);
    return once;
  }).then(function(taban){
    if(taban === undefined) return;
    secilenTaban = taban;
    if(taban === null){
      durumGoster('<b>Asistan bu çevrim içi sürümde henüz etkin değil.</b> Öğretmenin bulut bağlantısını kurması gerekiyor. Bu yüzden şu an cevap veremiyorum. Sohbet geçmişine yine de bakabilirsin.');
      return;
    }
    fetch(taban + API + '/durum', {cache:'no-store'}).then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function(v){
        durum = v;
        if(!v.yapilandirildi) durumGoster('<b>Asistan henüz yapılandırılmadı.</b> Yapay zekâ bağlantısı tanımlanmamış; bu yüzden şu an cevap veremiyorum. ' + (YEREL ? KURULUM : ''));
        else if(v.kodGerekli && !kodOku()) kodSor('');
        else durumGoster('');
      })
      .catch(function(){
        durumGoster(YEREL
          ? '<b>Asistan şu an bağlı değil.</b> Portal, asistan sunucusu olmadan açılmış. Portalı <b>baslat.vbs</b> ile yeniden açmayı dene. ' + KURULUM
          : '<b>Asistan şu an bağlı değil.</b> Asistan sunucusuna ulaşılamadı. İnternet bağlantını kontrol edip biraz sonra tekrar dene.');
      });
  });
}
/* Öğretmenin verdiği sınıf erişim kodu (yalnızca bulutta ERISIM_KODU tanımlıysa istenir) */
function kodSor(uyari){
  durumGoster('<b>Sınıf kodunu yaz.</b> Asistanı kullanmak için öğretmeninin verdiği kodu bir kez girmen yeterli.'+
    (uyari ? '<br><span class="dka-kod-uyari">'+kac(uyari)+'</span>' : '')+
    '<form class="dka-kod-form"><label class="dka-gizli" for="dkaKod">Sınıf kodu</label><input id="dkaKod" type="text" autocomplete="off" maxlength="40">'+
    '<button type="submit">Tamam</button></form>');
  var f = durumKutusu.querySelector('.dka-kod-form'), g = durumKutusu.querySelector('#dkaKod');
  setTimeout(function(){ g.focus(); }, 30);
  f.addEventListener('submit', function(e){ e.preventDefault(); var k = temiz(g.value); if(!k) return; kodYaz(k); durumGoster(''); girdi.focus(); });
}
var HATA = {
  yapilandirilmadi: 'Asistan henüz yapılandırılmadı (yapay zekâ bağlantısı yok).',
  anahtar_gecersiz: 'API anahtarı geçersiz görünüyor. Öğretmenin anahtarı kontrol etmeli.',
  yetki_yok: 'Bu API anahtarının bu işlem için yetkisi yok.',
  model_bulunamadi: 'Ayarlardaki yapay zekâ modeli bulunamadı.',
  yogunluk: 'Yapay zekâ servisi şu an yoğun. Biraz sonra tekrar dene.',
  cok_hizli: 'Çok hızlı soru gönderildi. Bir dakika bekleyip tekrar dene.',
  baglanti: 'Yapay zekâ servisine ulaşılamadı. İnternet bağlantısını kontrol et.',
  istek_buyuk: 'Mesaj çok uzun. Daha kısa yazmayı dene.',
  kod_gerekli: 'Sınıf kodu gerekiyor.',
  kod_hatali: 'Sınıf kodu doğru değil.',
  gunluk_sinir: 'Bugünkü ücretsiz soru hakkı doldu. Yarın (saat 03.00’ten sonra) tekrar dene.',
  izin_yok: 'Bu adresten asistana erişim izni yok.',
  servis_hatasi: 'Yapay zekâ servisinde bir sorun oluştu. Biraz sonra tekrar dene.',
  bos_yanit: 'Yapay zekâ boş bir cevap döndürdü. Sorunu biraz farklı yazarak tekrar dene.',
  mesaj_yok: 'Gönderilecek bir mesaj bulunamadı.',
  gecersiz_istek: 'İstek okunamadı. Sayfayı yenileyip tekrar dene.'
};
function yaziyorGoster(){
  var d = document.createElement('div');
  d.className = 'dka-mesaj dka-asistan dka-yaziyor'; d.setAttribute('role','status'); d.setAttribute('aria-label','Asistan yazıyor');
  d.innerHTML = '<span></span><span></span><span></span>';
  liste.appendChild(d); liste.scrollTop = liste.scrollHeight;
  return d;
}
function gonder(metin){
  metin = String(metin == null ? '' : metin).replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
  if(!metin || mesgul || girdi.disabled) return;
  if(!etkinSinif().s){ sinifSor(); return; }
  panelKapat();
  var b = tamBaglam();
  baglamEl.textContent = baglamEtiketi(b);
  if(/^Yanlışımı açıkla\.?$/i.test(metin) && !b.sonYanlis && !b.soru){
    metin += ' (Ekranda yanlış yaptığım bir soru algılanmadıysa, hangi soruyu yanlış yaptığımı sana yazacağım.)';
  }
  Array.prototype.forEach.call(liste.querySelectorAll('[data-gecici]'), function(x){ x.remove(); });
  mesajCiz('ogrenci', metin);
  S.m.push({rol:'ogrenci', metin:metin}); if(!S.sinif) S.sinif = b.sinif; sohbetKaydet();
  girdi.value = ''; girdi.style.height = 'auto';
  mesgul = true; gonderBtn.disabled = true; sesDurdur();
  var bekle = yaziyorGoster();
  var govde = JSON.stringify({
    sinif: b.sinif, sinifKaynak: b.sinifKaynak, mod: S.mod || null,
    unite: b.unite, konu: b.konu, etkinlik: b.etkinlik, soru: b.soru, sonYanlis: b.sonYanlis,
    ciktilar: b.ciktilar, icerik: (b.icerik||'').slice(0, 20000),
    mesajlar: S.m.slice(-12)
  });
  var taban = apiTaban(), basliklar = {'Content-Type':'application/json; charset=utf-8'};
  if(kodOku()) basliklar['X-Erisim-Kodu'] = kodOku();
  if(taban === null || taban === undefined){ bekle.remove(); mesgul = false; gonderBtn.disabled = false; durumKontrol(); return; }
  var kontrol = window.AbortController ? new AbortController() : null;
  var zaman = setTimeout(function(){ if(kontrol) kontrol.abort(); }, 95000);
  fetch(taban + API, {method:'POST', headers:basliklar, body: govde, signal: kontrol ? kontrol.signal : undefined})
    .then(function(r){ return r.json().catch(function(){ return {hata:'servis_hatasi'}; }); })
    .then(function(v){
      bekle.remove();
      if(v && v.cevap){
        S.m.push({rol:'asistan', metin:v.cevap}); sohbetKaydet();
        var d = mesajCiz('asistan', v.cevap, {son:true});
        if(sesAcik) seslendir(v.cevap, d.querySelector('.dka-dinle'));
      } else {
        mesajCiz('sistem', '⚠️ ' + (HATA[v && v.hata] || 'Asistan şu an cevap veremedi.') + ' Bu bir yapay zekâ cevabı değildir.');
        if(v && v.hata === 'yapilandirilmadi') durumKontrol();
        if(v && (v.hata === 'kod_gerekli' || v.hata === 'kod_hatali')){ kodYaz(''); kodSor(v.hata === 'kod_hatali' ? 'Kod doğru değil, tekrar dene.' : ''); }
      }
    })
    .catch(function(e){
      bekle.remove();
      mesajCiz('sistem', '⚠️ ' + (e && e.name === 'AbortError' ? 'Cevap çok uzun sürdü; bağlantı kesildi. Tekrar dene.' : 'Asistan sunucusuna ulaşılamadı. ' + (YEREL ? 'Portalı baslat.vbs ile açtığından emin ol.' : 'İnternet bağlantını kontrol et.')));
    })
    .then(function(){ clearTimeout(zaman); mesgul = false; gonderBtn.disabled = girdi.disabled; });
}

function guvenliKur(){ try{ kur(); }catch(e){ if(window.console) console.warn('Öğrenme Asistanı başlatılamadı:', e); } }
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', guvenliKur); else guvenliKur();
/* test ve öğretmen raporu için dışarıya açık, salt-okunur bağlam */
window.dkabAsistanBaglam = function(){ var b = tamBaglam(); return {sinif:b.sinif, sinifKaynak:b.sinifKaynak, uniteNo:b.uniteNo, unite:b.unite, konu:b.konu, etkinlik:b.etkinlik, soru:b.soru, sonYanlis:b.sonYanlis, mod: S && S.mod, ciktilarVar:!!b.ciktilar, icerikUzunluk:(b.icerik||'').length}; };
})();
