/* ======================================================================
   ÖĞRETMENE SOR — "Bana Sor" penceresine ek sekme (2026-11-14)
   * Pencerenin üstüne iki sekme ekler: "Yapay Zekâ" (mevcut asistan, hiç
     değişmez) ve "Öğretmene Sor".
   * Öğretmene Sor: öğrenci adını (ad + soyadının baş harfi), sınıfını,
     şubesini ve sorusunu yazar; soru bulut köprüsündeki (asistan-bulut/
     worker.js, /api/mesaj) mesaj kutusuna gider. Öğretmen "Mesajlar"
     panelinden (ogretmen-mesajlar.html) okuyup cevaplar.
   * "Sorularım": öğrencinin bu cihazdan gönderdiği sorular, durumları
     (gönderildi / öğretmen okudu / cevaplandı) ve öğretmen cevapları.
     Her soru için cihazda gizli bir anahtar saklanır; hesap/şifre yoktur.
   * Yeni cevap gelince "Bana Sor" balonunda ve sekmede kırmızı rozet çıkar.
   Önek: dos-   Yüklenme: ortak/asistan.js (kur() sonunda)
====================================================================== */
(function(){
'use strict';
if(window.__dkabOgretmeneSor) return;
window.__dkabOgretmeneSor = true;

var LS = 'dkabOgretmeneSor';
var AZAMI = 1200;
var SUBELER = ['A','B','C','D','E','F','G','H','I','J','K','L'];
var DURUM = {
  gonderildi: { ad:'Gönderildi', ikon:'🕓', s:'dos-d-gonderildi' },
  yeni:       { ad:'Gönderildi', ikon:'🕓', s:'dos-d-gonderildi' },
  okundu:     { ad:'Öğretmen okudu', ikon:'👀', s:'dos-d-okundu' },
  cevaplandi: { ad:'Cevaplandı', ikon:'✅', s:'dos-d-cevap' }
};
var HATA = {
  ad_gerekli: 'Adını yaz (en az 2 harf).',
  sinif_gerekli: 'Sınıfını seç.',
  soru_kisa: 'Sorun çok kısa; biraz daha açık yaz.',
  cok_hizli: 'Çok hızlı gönderdin. Bir dakika bekleyip tekrar dene.',
  saatlik_sinir: 'Bu cihazdan son bir saatte çok soru gönderildi. Biraz sonra tekrar dene.',
  gunluk_sinir_mesaj: 'Öğretmenin mesaj kutusu bugün çok doldu. Sorunu yarın gönderebilir ya da derste sorabilirsin.',
  mesaj_kapali: 'Öğretmene soru gönderme henüz açılmadı.',
  izin_yok: 'Bu adresten mesaj gönderilemiyor. Portalı internetteki adresinden aç.',
  bulunamadi: 'Bu soru bulunamadı (öğretmen silmiş olabilir).',
  yazisma_dolu: 'Bu yazışma çok uzadı. Yeni bir soru olarak gönder.',
  gecersiz_istek: 'Gönderilemedi. Sayfayı yenileyip tekrar dene.',
  sunucu_hatasi: 'Bir sorun oluştu. Biraz sonra tekrar dene.'
};

/* ---------------- yardımcılar ---------------- */
function kac(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function cokSatir(s){ return kac(s).replace(/\n/g, '<br>'); }
function oku(){ try{ var v = JSON.parse(localStorage.getItem(LS) || 'null'); if(v && typeof v === 'object'){ v.sorular = Array.isArray(v.sorular) ? v.sorular : []; v.gordum = v.gordum || {}; v.cache = v.cache || {}; return v; } }catch(e){} return { ad:'', sube:'', sorular:[], gordum:{}, cache:{} }; }
function yaz(){ try{ localStorage.setItem(LS, JSON.stringify(V)); }catch(e){} }
function cihazNo(){ var k = 'dkabCihaz'; try{ var v = localStorage.getItem(k); if(!v){ v = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(k, v); } return v; }catch(e){ return 'yok'; } }
function zamanYaz(t){
  if(!t) return '';
  var f = Date.now() - t, d = Math.round(f / 60000);
  if(d < 1) return 'şimdi';
  if(d < 60) return d + ' dk önce';
  var s = Math.round(d / 60); if(s < 24) return s + ' sa önce';
  var g = new Date(t);
  try{ return g.toLocaleDateString('tr-TR', { day:'numeric', month:'long' }) + ' ' + g.toLocaleTimeString('tr-TR', { hour:'2-digit', minute:'2-digit' }); }catch(e){ return g.toISOString().slice(0, 16).replace('T', ' '); }
}
function adres(){ var a = String(window.DKAB_ASISTAN_ADRES || '').trim().replace(/\/+$/, ''); return /^(https:\/\/|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$)/.test(a) ? a : null; }
function baglam(){ try{ return window.dkabAsistanBaglam ? window.dkabAsistanBaglam() : {}; }catch(e){ return {}; } }
function sayfaSinifi(){ var m = document.getElementById('portalNav'); var s = m ? parseInt(m.dataset.sinif, 10) : NaN; if(s >= 4 && s <= 12) return s; var b = baglam(); return b.sinif || null; }
function istek(yol, govde){
  var a = adres();
  if(!a) return Promise.reject({ hata:'mesaj_kapali' });
  return fetch(a + yol, govde ? { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(govde) } : { cache:'no-store' })
    .then(function(r){ return r.json().catch(function(){ return { hata:'sunucu_hatasi' }; }).then(function(v){ if(!r.ok) throw v; return v; }); });
}

var V = oku();
var kok, pencere, alan, sekmelerEl, sekmeAI, sekmeOgr, rozetSekme, rozetBalon, gorunum = 'yeni', aktifSekme = 'ai', etkin = null, sonYoklama = 0;

/* yeni (görülmemiş) öğretmen cevabı sayısı */
function yeniCevapSayisi(){
  return V.sorular.filter(function(q){ var c = V.cache[q.id]; return c && c.sonOgretmen && (!V.gordum[q.id] || V.gordum[q.id] < c.sonOgretmen); }).length;
}
function rozetleriGuncelle(){
  var n = yeniCevapSayisi();
  [rozetSekme, rozetBalon].forEach(function(r){ if(!r) return; r.textContent = n > 9 ? '9+' : String(n); r.hidden = !n; });
  if(rozetBalon) rozetBalon.setAttribute('aria-label', n + ' yeni öğretmen cevabı');
}

/* ---------------- sunucudan durum yoklama ---------------- */
function yokla(gordu){
  if(!V.sorular.length || !adres()) return Promise.resolve();
  sonYoklama = Date.now();
  return istek('/api/mesaj/benim', { liste: V.sorular.slice(-40).map(function(q){ return { id:q.id, anahtar:q.anahtar }; }), gordu: gordu || [] })
    .then(function(v){
      var bulunan = {};
      (v.mesajlar || []).forEach(function(m){ V.cache[m.id] = m; bulunan[m.id] = 1; });
      /* öğretmenin sildiği sorular */
      V.sorular.forEach(function(q){ if(!bulunan[q.id] && V.cache[q.id] !== undefined) V.cache[q.id] = { silindi:true }; });
      yaz(); rozetleriGuncelle();
      if(aktifSekme === 'ogr' && gorunum === 'liste') listeCiz();
    }).catch(function(){});
}

/* ---------------- arayüz ---------------- */
function css(){
  if(document.querySelector('link[href*="ogretmene-sor.css"]')) return;
  var src = (document.querySelector('script[src*="ogretmene-sor.js"]') || {}).src || '';
  var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = src.replace(/ogretmene-sor\.js.*$/, 'ogretmene-sor.css'); document.head.appendChild(l);
}
function kur(){
  kok = document.getElementById('dkabAsistan'); if(!kok || kok.dataset.dosKuruldu) return;
  kok.dataset.dosKuruldu = '1'; css();
  pencere = kok.querySelector('.dka-pencere');
  var ust = kok.querySelector('.dka-ust');
  var sekmeler = document.createElement('div');
  sekmeler.className = 'dos-sekmeler'; sekmeler.setAttribute('role', 'tablist'); sekmeler.setAttribute('aria-label', 'Kime soracaksın?');
  sekmeler.innerHTML =
    '<button type="button" role="tab" class="dos-sekme" data-s="ai" aria-selected="true"><span aria-hidden="true">🤖</span> Yapay Zekâ</button>' +
    '<button type="button" role="tab" class="dos-sekme" data-s="ogr" aria-selected="false"><span aria-hidden="true">👩‍🏫</span> Öğretmene Sor <span class="dos-rozet" hidden></span></button>';
  sekmeler.hidden = true;   /* mesaj kutusu bulutta kurulu değilse sekmeler hiç görünmez */
  ust.insertAdjacentElement('afterend', sekmeler); sekmelerEl = sekmeler;
  sekmeAI = sekmeler.querySelector('[data-s="ai"]'); sekmeOgr = sekmeler.querySelector('[data-s="ogr"]');
  rozetSekme = sekmeOgr.querySelector('.dos-rozet');
  alan = document.createElement('div'); alan.className = 'dos-alan'; alan.hidden = true; alan.setAttribute('role', 'tabpanel');
  sekmeler.insertAdjacentElement('afterend', alan);
  var balon = kok.querySelector('.dka-balon');
  rozetBalon = document.createElement('span'); rozetBalon.className = 'dos-rozet dos-rozet-balon'; rozetBalon.hidden = true; balon.appendChild(rozetBalon);
  sekmeler.addEventListener('click', function(e){ var b = e.target.closest('.dos-sekme'); if(b) sekmeSec(b.dataset.s); });
  sekmeler.addEventListener('keydown', function(e){ if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){ e.preventDefault(); sekmeSec(aktifSekme === 'ai' ? 'ogr' : 'ai'); (aktifSekme === 'ai' ? sekmeAI : sekmeOgr).focus(); } });
  alan.addEventListener('click', tiklama);
  alan.addEventListener('submit', gonderim);
  alan.addEventListener('input', function(e){ if(e.target.matches('.dos-soru')) sayacGuncelle(e.target); });
  /* balon açılınca: yeni cevap varsa doğrudan "Sorularım"ı aç */
  balon.addEventListener('click', function(){
    setTimeout(function(){
      if(yeniCevapSayisi()){ sekmeSec('ogr'); gorunum = 'liste'; ciz(); }
      if(Date.now() - sonYoklama > 30000) yokla();
    }, 60);
  });
  rozetleriGuncelle();
  durumSor();
  /* sayfa açılışında ve görünürken her 3 dakikada bir cevapları kontrol et */
  setTimeout(function(){ yokla(); }, 2500);
  setInterval(function(){ if(document.visibilityState === 'visible' && V.sorular.length) yokla(); }, 180000);
  document.addEventListener('visibilitychange', function(){ if(document.visibilityState === 'visible' && Date.now() - sonYoklama > 60000) yokla(); });
}
function sekmeSec(s){
  aktifSekme = s;
  sekmeAI.setAttribute('aria-selected', String(s === 'ai')); sekmeOgr.setAttribute('aria-selected', String(s === 'ogr'));
  kok.classList.toggle('dos-ogr-modu', s === 'ogr');
  alan.hidden = s !== 'ogr';
  var h = kok.querySelector('#dkaBaslik'); if(h) h.textContent = s === 'ogr' ? 'Öğretmene Sor' : 'Öğrenme Asistanı';
  if(s === 'ogr'){
    if(etkin === null) durumSor();
    if(gorunum !== 'liste' && gorunum !== 'basari') gorunum = V.sorular.length && yeniCevapSayisi() ? 'liste' : 'yeni';
    ciz();
    if(Date.now() - sonYoklama > 30000) yokla();
  } else {
    var g = kok.querySelector('#dkaGirdi'); if(g && !g.disabled) setTimeout(function(){ g.focus(); }, 30);
  }
}
function sekmelerGoster(){
  /* sekmeler yalnızca mesaj kutusu açıksa görünür; daha önce soru gönderilmişse bağlantı sorunu olsa da görünür */
  var goster = etkin === true || (etkin === 'baglanti' && V.sorular.length > 0);
  if(sekmelerEl) sekmelerEl.hidden = !goster;
  if(!goster && aktifSekme === 'ogr') sekmeSec('ai');
}
function durumSor(){
  if(location.protocol === 'file:'){ etkin = false; sekmelerGoster(); ciz(); return; }
  var bekle = 0;
  (function dene(){
    if(!adres() && bekle++ < 20) return setTimeout(dene, 150);
    if(!adres()){ etkin = false; sekmelerGoster(); ciz(); return; }
    fetch(adres() + '/api/mesaj/durum', { cache:'no-store' }).then(function(r){ return r.json(); })
      .then(function(v){ etkin = !!(v && v.etkin); sekmelerGoster(); ciz(); }).catch(function(){ etkin = 'baglanti'; sekmelerGoster(); ciz(); });
  })();
}

function ust(){
  var n = V.sorular.length, y = yeniCevapSayisi();
  return '<div class="dos-gecis" role="group" aria-label="Görünüm">' +
    '<button type="button" class="dos-gec" data-g="yeni" aria-pressed="' + (gorunum !== 'liste') + '">✍️ Yeni Soru</button>' +
    '<button type="button" class="dos-gec" data-g="liste" aria-pressed="' + (gorunum === 'liste') + '">📬 Sorularım' + (n ? ' <b>' + n + '</b>' : '') + (y ? ' <span class="dos-nokta" aria-label="yeni cevap var"></span>' : '') + '</button></div>';
}
function ciz(){
  if(!alan) return;
  if(location.protocol === 'file:'){ alan.innerHTML = bilgiKart('🌐', 'İnternet gerekli', 'Öğretmene soru göndermek için portalı internetteki adresinden ya da <b>baslat.vbs</b> ile aç.'); return; }
  if(etkin === false){ alan.innerHTML = bilgiKart('🔒', 'Henüz açılmadı', 'Öğretmenin mesaj kutusu henüz kurulmadı. O zamana kadar sorunu derste sorabilir ya da “Yapay Zekâ” sekmesini kullanabilirsin.'); return; }
  if(etkin === 'baglanti'){ alan.innerHTML = bilgiKart('📡', 'Bağlantı yok', 'Mesaj kutusuna ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.') + '<p class="dos-orta"><button type="button" class="dos-btn" data-is="tekrar">Tekrar dene</button></p>'; return; }
  if(gorunum === 'liste') return listeCiz();
  if(gorunum === 'basari') return basariCiz();
  formCiz();
}
function bilgiKart(ikon, baslik, metin){ return '<div class="dos-bilgi"><div class="dos-bilgi-ikon" aria-hidden="true">' + ikon + '</div><h3>' + baslik + '</h3><p>' + metin + '</p></div>'; }

function formCiz(taslak){
  var b = baglam(), s = sayfaSinifi() || '', konu = b.konu || (b.unite ? b.unite.replace(/^\d+\. ünite —\s*/, '') : '');
  var onceki = alan.querySelector('.dos-soru'); taslak = taslak != null ? taslak : (onceki ? onceki.value : (V.taslak || ''));
  alan.innerHTML = ust() +
    '<form class="dos-form" novalidate>' +
      '<div class="dos-tanit"><span class="dos-avatar" aria-hidden="true">👩‍🏫</span><div><b>Ayşe Yazıcı öğretmenine sor</b><span>Sorunu okuyup cevaplayacak. Cevabı bu cihazda <b>Sorularım</b> bölümünde göreceksin.</span></div></div>' +
      '<div class="dos-satir">' +
        '<label class="dos-alan-k dos-genis"><span>Adın</span><input class="dos-ad" type="text" maxlength="40" autocomplete="off" placeholder="Örn. Elif Y." value="' + kac(V.ad || '') + '" required><small>Adın ve soyadının baş harfi yeterli.</small></label>' +
      '</div>' +
      '<div class="dos-satir">' +
        '<label class="dos-alan-k"><span>Sınıf</span><select class="dos-sinif" required><option value="">Seç</option>' +
          [4,5,6,7,8,9,10,11,12].map(function(x){ return '<option value="' + x + '"' + (String(x) === String(s || V.sinif || '') ? ' selected' : '') + '>' + x + '. sınıf</option>'; }).join('') + '</select></label>' +
        '<label class="dos-alan-k"><span>Şube</span><select class="dos-sube"><option value="">—</option>' +
          SUBELER.map(function(x){ return '<option' + (x === V.sube ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></label>' +
      '</div>' +
      (konu ? '<p class="dos-konu"><span aria-hidden="true">📚</span> <span>Konu: <b>' + kac(konu) + '</b></span><button type="button" class="dos-konu-kaldir" data-is="konu-kaldir" aria-label="Konuyu kaldır" title="Bu soru bu konuyla ilgili değilse kaldır">✕</button></p>' : '') +
      '<label class="dos-alan-k dos-genis"><span>Sorun</span><textarea class="dos-soru" rows="5" maxlength="' + AZAMI + '" placeholder="Sorunu açıkça yaz. Örn: Haşir ile mahşer arasındaki farkı tam anlayamadım…" required>' + kac(taslak) + '</textarea>' +
      '<small class="dos-sayac" aria-live="polite">' + taslak.length + ' / ' + AZAMI + '</small></label>' +
      '<p class="dos-gizlilik">🔒 Sorunu yalnızca öğretmenin görür. Telefon numarası, adres gibi kişisel bilgilerini yazma.</p>' +
      '<p class="dos-hata" role="alert" hidden></p>' +
      '<button type="submit" class="dos-btn dos-btn-ana dos-gonder">Öğretmene Gönder <span aria-hidden="true">➤</span></button>' +
    '</form>';
  alan.dataset.konu = konu;
  var ilk = alan.querySelector(V.ad ? '.dos-soru' : '.dos-ad'); if(ilk) setTimeout(function(){ ilk.focus(); }, 30);
}
function sayacGuncelle(t){
  var s = alan.querySelector('.dos-sayac'); if(s){ s.textContent = t.value.length + ' / ' + AZAMI; s.classList.toggle('dos-sayac-dolu', t.value.length > AZAMI - 100); }
  V.taslak = t.value; yaz();
}
function gonderim(e){
  e.preventDefault();
  var f = e.target.closest('form'); if(!f) return;
  if(f.classList.contains('dos-form')) return soruGonder(f);
  if(f.classList.contains('dos-ek-form')) return ekGonder(f);
}
function hataGoster(f, m){ var h = f.querySelector('.dos-hata'); if(h){ h.textContent = m; h.hidden = !m; } }
function soruGonder(f){
  var ad = f.querySelector('.dos-ad').value.trim(), sinif = f.querySelector('.dos-sinif').value, sube = f.querySelector('.dos-sube').value, metin = f.querySelector('.dos-soru').value.trim();
  if(ad.length < 2){ hataGoster(f, HATA.ad_gerekli); f.querySelector('.dos-ad').focus(); return; }
  if(!sinif){ hataGoster(f, HATA.sinif_gerekli); f.querySelector('.dos-sinif').focus(); return; }
  if(metin.length < 5){ hataGoster(f, HATA.soru_kisa); f.querySelector('.dos-soru').focus(); return; }
  hataGoster(f, '');
  var btn = f.querySelector('.dos-gonder'); btn.disabled = true; btn.innerHTML = '<span class="dos-donen" aria-hidden="true"></span> Gönderiliyor…';
  var b = baglam();
  V.ad = ad; V.sube = sube; V.sinif = sinif; yaz();
  istek('/api/mesaj', { ad:ad, sinif:+sinif, sube:sube, metin:metin, konu: alan.dataset.konu || '', unite: b.unite || '', sayfa: location.href.split('#')[0].slice(0, 300), cihaz: cihazNo() })
    .then(function(v){
      V.sorular.push({ id:v.id, anahtar:v.anahtar, t:v.zaman || Date.now(), ozet: metin.slice(0, 140), konu: alan.dataset.konu || '' });
      if(V.sorular.length > 40) V.sorular = V.sorular.slice(-40);
      V.cache[v.id] = { id:v.id, durum:'yeni', konu: alan.dataset.konu || '', olusturma: v.zaman || Date.now(), iletiler:[{ kimden:'ogrenci', metin:metin, zaman: v.zaman || Date.now() }] };
      V.taslak = ''; yaz();
      gorunum = 'basari'; ciz();
    })
    .catch(function(v){ btn.disabled = false; btn.innerHTML = 'Öğretmene Gönder <span aria-hidden="true">➤</span>'; hataGoster(f, HATA[v && v.hata] || 'Gönderilemedi. İnternet bağlantını kontrol edip tekrar dene.'); });
}
function basariCiz(){
  alan.innerHTML = ust() +
    '<div class="dos-basari" role="status"><div class="dos-tik" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></div>' +
    '<h3>Sorun öğretmenine ulaştı!</h3><p>Öğretmenin cevap yazınca <b>Bana Sor</b> düğmesinde kırmızı bir işaret göreceksin. Cevabı <b>Sorularım</b> bölümünde okuyabilirsin.</p>' +
    '<p class="dos-orta"><button type="button" class="dos-btn dos-btn-ana" data-g="liste">📬 Sorularıma git</button> <button type="button" class="dos-btn" data-g="yeni">✍️ Yeni soru yaz</button></p></div>';
}

function listeCiz(){
  var acikOlan = alan.querySelector('.dos-kart[open]'); var acikId = acikOlan ? acikOlan.dataset.id : null;
  if(!V.sorular.length){ alan.innerHTML = ust() + bilgiKart('📭', 'Henüz soru göndermedin', 'Öğretmenine sormak istediğin bir şey varsa <b>Yeni Soru</b> bölümünden yazabilirsin.'); return; }
  var html = ust() + '<div class="dos-liste">';
  V.sorular.slice().reverse().forEach(function(q){
    var c = V.cache[q.id] || {}, silindi = c.silindi;
    var yeniCevap = c.sonOgretmen && (!V.gordum[q.id] || V.gordum[q.id] < c.sonOgretmen);
    var d = silindi ? { ad:'Kaldırıldı', ikon:'🗑️', s:'dos-d-silindi' } : (DURUM[c.durum] || DURUM.gonderildi);
    var iletiler = c.iletiler || [{ kimden:'ogrenci', metin:q.ozet, zaman:q.t }];
    html += '<details class="dos-kart' + (yeniCevap ? ' dos-kart-yeni' : '') + '" data-id="' + kac(q.id) + '"' + ((acikId === q.id || (yeniCevap && !acikId)) ? ' open' : '') + '>' +
      '<summary><span class="dos-durum ' + d.s + '"><span aria-hidden="true">' + d.ikon + '</span> ' + d.ad + '</span>' +
        (yeniCevap ? '<span class="dos-yeni-etiket">YENİ CEVAP</span>' : '') +
        '<span class="dos-ozet">' + kac(q.ozet) + '</span>' +
        '<span class="dos-meta">' + (q.konu ? '📚 ' + kac(q.konu) + ' · ' : '') + zamanYaz(q.t) + '</span></summary>' +
      '<div class="dos-yazisma">' +
        iletiler.map(function(m){
          var ogr = m.kimden === 'ogretmen';
          return '<div class="dos-ileti ' + (ogr ? 'dos-ileti-ogretmen' : 'dos-ileti-ben') + '">' + (ogr ? '<span class="dos-kim">👩‍🏫 Öğretmenin</span>' : '') +
            '<div class="dos-balon-metin">' + cokSatir(m.metin) + '</div><span class="dos-zaman">' + zamanYaz(m.zaman) + '</span></div>';
        }).join('') +
        (silindi ? '<p class="dos-kucuk">Bu soru öğretmenin mesaj kutusundan kaldırılmış.</p>' :
          (c.durum !== 'cevaplandi' ? '<p class="dos-kucuk">⏳ Öğretmenin cevabını bekliyorsun. Sabırlı ol; öğretmenin derslerden sonra cevaplar.</p>' : '') +
          '<form class="dos-ek-form" data-id="' + kac(q.id) + '"><label class="dos-gizli" for="dosEk' + kac(q.id) + '">Ek mesaj</label>' +
          '<textarea id="dosEk' + kac(q.id) + '" rows="1" maxlength="' + AZAMI + '" placeholder="' + (c.sonOgretmen ? 'Teşekkür et ya da ek soru sor…' : 'Sorunla ilgili eklemek istediğin bir şey var mı?') + '"></textarea>' +
          '<button type="submit" class="dos-btn dos-btn-ana dos-kucuk-btn" aria-label="Gönder">➤</button></form><p class="dos-hata" role="alert" hidden></p>') +
        '<p class="dos-alt-islem"><button type="button" class="dos-link" data-is="kaldir" data-id="' + kac(q.id) + '">Bu cihazdan kaldır</button></p>' +
      '</div></details>';
  });
  html += '</div><p class="dos-kucuk dos-orta">Sorular yalnızca bu cihazda listelenir. ' + (V.sorular.length ? '<button type="button" class="dos-link" data-is="yenile">🔄 Yenile</button>' : '') + '</p>';
  alan.innerHTML = html;
  /* açık kartlardaki yeni cevapları "görüldü" say */
  gorulduIsaretle();
  alan.querySelectorAll('.dos-kart').forEach(function(k){ k.addEventListener('toggle', function(){ if(k.open) gorulduIsaretle(); }); });
}
function gorulduIsaretle(){
  var liste = [];
  alan.querySelectorAll('.dos-kart[open]').forEach(function(k){
    var id = k.dataset.id, c = V.cache[id];
    if(c && c.sonOgretmen && (!V.gordum[id] || V.gordum[id] < c.sonOgretmen)){ V.gordum[id] = c.sonOgretmen; liste.push(id); }
  });
  if(liste.length){ yaz(); rozetleriGuncelle(); yokla(liste); }
}
function ekGonder(f){
  var t = f.querySelector('textarea'), metin = t.value.trim(), id = f.dataset.id, q = V.sorular.filter(function(x){ return x.id === id; })[0];
  var h = f.nextElementSibling;
  if(metin.length < 2 || !q) return;
  var btn = f.querySelector('button'); btn.disabled = true;
  istek('/api/mesaj/ek', { id:id, anahtar:q.anahtar, metin:metin })
    .then(function(v){
      var c = V.cache[id] || { iletiler:[] }; c.iletiler = (c.iletiler || []).concat([{ kimden:'ogrenci', metin:metin, zaman: v.zaman || Date.now() }]); c.durum = 'yeni'; V.cache[id] = c; yaz();
      listeCiz();
    })
    .catch(function(v){ btn.disabled = false; if(h){ h.textContent = HATA[v && v.hata] || 'Gönderilemedi.'; h.hidden = false; } });
}
function tiklama(e){
  var g = e.target.closest('[data-g]'); if(g){ gorunum = g.dataset.g; ciz(); if(gorunum === 'liste') yokla(); return; }
  var is = e.target.closest('[data-is]'); if(!is) return;
  var k = is.dataset.is;
  if(k === 'tekrar'){ etkin = null; durumSor(); }
  else if(k === 'yenile'){ is.disabled = true; yokla().then(function(){ is.disabled = false; }); }
  else if(k === 'konu-kaldir'){ alan.dataset.konu = ''; var p = is.closest('.dos-konu'); if(p) p.remove(); }
  else if(k === 'kaldir'){
    var id = is.dataset.id;
    if(!window.confirm('Bu soru bu cihazdaki listeden kaldırılsın mı? (Öğretmenin mesaj kutusunda kalır.)')) return;
    V.sorular = V.sorular.filter(function(q){ return q.id !== id; }); delete V.cache[id]; delete V.gordum[id]; yaz(); rozetleriGuncelle(); listeCiz();
  }
}

/* asistan penceresi hazır olunca kur */
(function bekle(n){
  if(document.getElementById('dkabAsistan')) return kur();
  if(n > 100) return;
  setTimeout(function(){ bekle(n + 1); }, 100);
})(0);
})();
