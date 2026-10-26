/* ======================================================================
   SURE / DUA DİNLE — 4. ve 8. sınıf "konuyu-ogren" sayfaları
   Sayfadaki sure/dua okunuş bölümünü metninden bulur, "🔊 Dinle" ve
   "🗣️ Anlamını Dinle" butonlarını ekler. Sayfanın mevcut HTML'ine
   dokunmaz; yalnızca buton ve vurgu ekler.
   - Sureler: Mişari Raşid el-Afasi tilaveti (internetten, ayet ayet MP3)
     Kaynak: everyayah.com, yedek: cdn.islamic.network
   - Dualar ve Türkçe anlamlar: tarayıcının Türkçe sesi (Web Speech API)
====================================================================== */
(function(){
  'use strict';

  var KAYNAK1 = 'https://everyayah.com/data/Alafasy_128kbps/';
  var KAYNAK2 = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/';
  // islamic.network genel ayet numarası = surenin başlangıcı + ayet - 1
  var SURE_BASLANGIC = { 1:1, 2:8, 103:6177, 106:6194, 107:6198, 112:6222 };

  function ayet(sure, no){ return { sure:sure, no:no }; }
  function besmele(){ return ayet(1, 1); }
  function sureAyetleri(sure, adet){
    var a = [besmele()];
    for(var i = 1; i <= adet; i++) a.push(ayet(sure, i));
    return a;
  }

  /* ---- Sayfa tanımları: metinden bulunur, hangi sayfadaysa o çalışır ---- */
  var TANIMLAR = [
    // 4. sınıf
    { ad:'Sübhâneke Duası', tur:'dua', bul:subhanekeBul },
    { ad:'Âmentü Duası', tur:'dua', bul:tabloBul('Velyevmilâhiri', 0, 1) },
    { ad:'Fatiha Suresi', tur:'sure', bul:tabloBul('Mâliki yevmiddîn', 0, 1),
      ayetler:[ayet(1,1),ayet(1,2),ayet(1,3),ayet(1,4),ayet(1,5),ayet(1,6),ayet(1,7)] },
    { ad:'Salli ve Barik Duaları', tur:'dua', bul:tabloBul('Allâhümme bârik alâ', 1, 2) },
    { ad:'Âmentü Duası', tur:'dua', bul:duaSatirBul },
    // 8. sınıf
    { ad:'Ayetelkürsi', tur:'sure', bul:okunusKutusuBul('Ayetelkürsi'),
      ayetler:[besmele(), ayet(2,255)], tekAyet:true },
    { ad:'Maun Suresi', tur:'sure', bul:okunusKutusuBul('Maun Suresi'), ayetler:sureAyetleri(107,7) },
    { ad:'Asr Suresi', tur:'sure', bul:okunusKutusuBul('Asr Suresi'), ayetler:sureAyetleri(103,3) },
    { ad:'Kureyş Suresi', tur:'sure', bul:okunusKutusuBul('Kureyş Suresi'), ayetler:sureAyetleri(106,4) },
    { ad:'İhlâs Suresi', tur:'sure', bul:okunusKutusuBul('İhlâs Suresi'), ayetler:sureAyetleri(112,4) }
  ];

  /* ---- Bulucular: { yer: butonların ekleneceği öğe (önüne), satirlar:[{el, hucre, okunus, anlam}] } ---- */
  function metin(el){ return (el && el.textContent || '').replace(/\s+/g, ' ').trim(); }

  function tabloBul(anahtar, okunusSutun, anlamSutun){
    return function(){
      var tablolar = document.querySelectorAll('table');
      for(var i = 0; i < tablolar.length; i++){
        if(metin(tablolar[i]).indexOf(anahtar) === -1) continue;
        var satirlar = [];
        tablolar[i].querySelectorAll('tr').forEach(function(tr){
          var td = tr.querySelectorAll('td');
          if(td.length <= Math.max(okunusSutun, anlamSutun)) return;
          satirlar.push({ el:tr, hucre:td[okunusSutun], okunus:metin(td[okunusSutun]), anlam:metin(td[anlamSutun]) });
        });
        return { yer:tablolar[i], satirlar:satirlar };
      }
      return null;
    };
  }

  function okunusKutusuBul(baslik){
    return function(){
      var kutular = document.querySelectorAll('.zb-okunus');
      for(var i = 0; i < kutular.length; i++){
        var b = kutular[i].querySelector('.zb-baslik');
        if(!b || metin(b).indexOf(baslik) === -1) continue;
        var tablo = kutular[i].querySelector('table');
        if(!tablo) return null;
        var satirlar = [];
        tablo.querySelectorAll('tr').forEach(function(tr){
          var o = tr.querySelector('.okunus-sutun'), a = tr.querySelector('.anlam-sutun');
          if(o && a) satirlar.push({ el:tr, hucre:o, okunus:metin(o), anlam:metin(a) });
        });
        return { yer:tablo, satirlar:satirlar };
      }
      return null;
    };
  }

  function subhanekeBul(){
    var p = Array.prototype.find.call(document.querySelectorAll('p'), function(x){
      return metin(x).indexOf('Sübhânekellâhümme ve bi hamdik ve tebârekesmük') === 0;
    });
    if(!p) return null;
    var ul = p.nextElementSibling;
    while(ul && ul.tagName !== 'UL') ul = ul.nextElementSibling;
    var satirlar = [];
    if(ul){
      ul.querySelectorAll('li').forEach(function(li){
        var b = li.querySelector('b');
        if(!b) return;
        var anlam = metin(li).slice(metin(b).length).replace(/^[\s—–-]+/, '');
        satirlar.push({ el:li, hucre:li, okunus:metin(b), anlam:anlam });
      });
    }
    return { yer:p, sonra:true, butunOkunus:metin(p), satirlar:satirlar };
  }

  function duaSatirBul(){
    var ilk = Array.prototype.find.call(document.querySelectorAll('.dua-satir'), function(x){
      return metin(x).indexOf('Âmentü billâhi') !== -1;
    });
    if(!ilk) return null;
    var satirlar = [];
    var el = ilk;
    while(el && el.classList.contains('dua-satir')){
      var a = el.nextElementSibling;
      var anlamVar = a && a.classList.contains('aciklama');
      satirlar.push({ el:el, hucre:el, okunus:metin(el), anlam:anlamVar ? metin(a) : '', anlamEl:anlamVar ? a : null });
      el = anlamVar ? a.nextElementSibling : null;
    }
    return { yer:ilk, satirlar:satirlar };
  }

  /* ---- Ses: tilavet (Audio) ve Türkçe konuşma (speechSynthesis) ---- */
  var ses = window.speechSynthesis || null;
  var turkceSes = null;
  function sesSec(){
    if(!ses) return;
    var liste = ses.getVoices() || [];
    turkceSes = liste.find(function(v){ return /^tr(-|_|$)/i.test(v.lang); }) || null;
  }
  if(ses){ sesSec(); if('onvoiceschanged' in ses) ses.addEventListener('voiceschanged', sesSec); }

  // Türkçe sesin düzgün okuması için okunuş metnini sadeleştirir
  function okunusSadelestir(t){
    return t.replace(/^\d+\.\s*/, '')
      .replace(/ḥ/g,'h').replace(/Ḥ/g,'H').replace(/ḳ/g,'k').replace(/ḫ/g,'h').replace(/ẕ/g,'z').replace(/ṣ/g,'s').replace(/ṭ/g,'t')
      .replace(/[’'`]/g, '');
  }

  var calan = null;     // { durdur: fn }
  var oynatici = null;

  function hepsiniDurdur(){
    if(calan){ var c = calan; calan = null; c.durdur(); }
  }

  function konus(metinler, bitti){
    // metinler: [{t, el}] — sırayla okunur, okunan satır vurgulanır
    var i = 0, iptal = false;
    function sonraki(){
      if(iptal) return;
      if(i >= metinler.length){ vurgula(null); bitti && bitti(); return; }
      var m = metinler[i++];
      vurgula(m.el);
      var u = new SpeechSynthesisUtterance(m.t);
      u.lang = 'tr-TR'; u.rate = 0.85;
      if(turkceSes) u.voice = turkceSes;
      u.onend = function(){ setTimeout(sonraki, 250); };
      u.onerror = function(){ setTimeout(sonraki, 50); };
      ses.speak(u);
    }
    ses.cancel();
    sonraki();
    return function(){ iptal = true; ses.cancel(); vurgula(null); };
  }

  function tilavet(liste, bitti, hata){
    // liste: [{a:ayet, el}] — sırayla çalınır
    var i = 0, iptal = false;
    if(!oynatici) oynatici = new Audio();
    var o = oynatici;
    function cal(m, yedek){
      var url = yedek
        ? KAYNAK2 + (SURE_BASLANGIC[m.a.sure] + m.a.no - 1) + '.mp3'
        : KAYNAK1 + ('00' + m.a.sure).slice(-3) + ('00' + m.a.no).slice(-3) + '.mp3';
      o.onended = function(){ sonraki(); };
      o.onerror = function(){
        if(iptal) return;
        if(!yedek) cal(m, true);
        else { iptal = true; vurgula(null); hata && hata(); }
      };
      o.src = url;
      var p = o.play();
      if(p && p.catch) p.catch(function(){ /* onerror yakalar */ });
    }
    function sonraki(){
      if(iptal) return;
      if(i >= liste.length){ vurgula(null); bitti && bitti(); return; }
      var m = liste[i++];
      vurgula(m.el);
      cal(m, false);
    }
    sonraki();
    return function(){ iptal = true; o.onended = o.onerror = null; o.pause(); vurgula(null); };
  }

  var vurguluEl = [];
  function vurgula(el){
    vurguluEl.forEach(function(x){ x.classList.remove('sd-caliyor'); });
    vurguluEl = [];
    if(!el) return;
    (Array.isArray(el) ? el : [el]).forEach(function(x){ if(x){ x.classList.add('sd-caliyor'); vurguluEl.push(x); } });
    var ilk = vurguluEl[0];
    if(ilk && ilk.scrollIntoView){
      var r = ilk.getBoundingClientRect();
      if(r.top < 60 || r.bottom > window.innerHeight - 20) ilk.scrollIntoView({ block:'center', behavior:'smooth' });
    }
  }

  /* ---- Butonlar ---- */
  function buton(etiket, sinif, baslik){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'sd-btn ' + (sinif || '');
    b.innerHTML = etiket;
    if(baslik){ b.title = baslik; b.setAttribute('aria-label', baslik); }
    return b;
  }

  // Bir butonu oynat/durdur düğmesi yapar
  function oynatDurdur(b, baslat, durEtiket){
    var asil = b.innerHTML;
    b.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      if(b.classList.contains('sd-aktif')){ hepsiniDurdur(); return; }
      hepsiniDurdur();
      b.classList.add('sd-aktif');
      b.setAttribute('aria-pressed', 'true');
      if(durEtiket) b.innerHTML = durEtiket;
      function geriAl(){
        b.classList.remove('sd-aktif');
        b.setAttribute('aria-pressed', 'false');
        b.innerHTML = asil;
      }
      var durdurFn = baslat(function(){ if(calan && calan.b === b) calan = null; geriAl(); });
      calan = { b:b, durdur:function(){ durdurFn && durdurFn(); geriAl(); } };
    });
  }

  function uyari(cubuk, yazi){
    var n = cubuk.querySelector('.sd-not');
    if(!n){ n = document.createElement('span'); n.className = 'sd-not'; cubuk.appendChild(n); }
    n.textContent = yazi;
  }

  function kur(tanim){
    var bulunan = tanim.bul();
    if(!bulunan || !bulunan.yer || bulunan.yer.getAttribute('data-sd')) return;
    bulunan.yer.setAttribute('data-sd', '1');
    var satirlar = bulunan.satirlar;
    var sure = tanim.tur === 'sure';

    var cubuk = document.createElement('div');
    cubuk.className = 'sd-cubuk';
    cubuk.setAttribute('role', 'group');
    cubuk.setAttribute('aria-label', tanim.ad + ' dinleme');

    // 1) Ana "Dinle" butonu
    var dinle = buton('🔊 Dinle', 'sd-ana', tanim.ad + (sure ? ' — hafız sesiyle dinle' : ' — okunuşunu dinle'));
    cubuk.appendChild(dinle);
    if(sure){
      oynatDurdur(dinle, function(bitti){
        var liste = tanim.ayetler.map(function(a, i){
          // Ayetelkürsi tek ayettir: tablo satırları ayet değil, tümü birlikte vurgulanır
          var el = tanim.tekAyet ? (i === 0 ? satirlar[0] && satirlar[0].el : satirlar.slice(1).map(function(s){ return s.el; }))
                                 : (satirlar[i] && satirlar[i].el);
          return { a:a, el:el };
        });
        // İnternet yoksa okunuş Türkçe sesle okunur
        var aktif = { dur:null };
        aktif.dur = tilavet(liste, bitti, function(){
          uyari(cubuk, 'Hafız sesi için internet bağlantısı gerekiyor. Okunuş bilgisayar sesiyle okunuyor.');
          if(ses) aktif.dur = konus(satirlar.map(function(s){ return { t:okunusSadelestir(s.okunus), el:s.el }; }), bitti);
          else bitti();
        });
        return function(){ aktif.dur && aktif.dur(); };
      }, '⏹ Durdur');
    } else {
      oynatDurdur(dinle, function(bitti){
        var m = bulunan.butunOkunus
          ? [{ t:okunusSadelestir(bulunan.butunOkunus), el:bulunan.yer }]
          : satirlar.map(function(s){ return { t:okunusSadelestir(s.okunus), el:s.el }; });
        return konus(m, bitti);
      }, '⏹ Durdur');
    }

    // 2) "Anlamını Dinle" butonu (Türkçe ses)
    if(ses && satirlar.some(function(s){ return s.anlam; })){
      var anlamBtn = buton('🗣️ Anlamını Dinle', 'sd-anlam', tanim.ad + ' — Türkçe anlamını dinle');
      cubuk.appendChild(anlamBtn);
      oynatDurdur(anlamBtn, function(bitti){
        return konus(satirlar.filter(function(s){ return s.anlam; }).map(function(s){
          return { t:s.anlam, el:s.anlamEl ? [s.el, s.anlamEl] : s.el };
        }), bitti);
      }, '⏹ Durdur');
    }

    if(!sure && !ses){ dinle.disabled = true; uyari(cubuk, 'Bu tarayıcı sesli okumayı desteklemiyor.'); }
    else if(!sure && ses && !turkceSes){
      setTimeout(function(){ if(!turkceSes) uyari(cubuk, 'Bilgisayarda Türkçe ses bulunamadı; telaffuz farklı olabilir.'); }, 1500);
    }

    if(bulunan.sonra) bulunan.yer.parentNode.insertBefore(cubuk, bulunan.yer.nextSibling);
    else bulunan.yer.parentNode.insertBefore(cubuk, bulunan.yer);

    // 3) Satır satır küçük dinle butonları
    if(tanim.tekAyet) return;
    satirlar.forEach(function(s, i){
      if(!sure && !ses) return;
      var kucuk = buton('🔊', 'sd-satir', (sure ? 'Bu ayeti dinle: ' : 'Bu satırı dinle: ') + s.okunus);
      oynatDurdur(kucuk, function(bitti){
        if(sure && tanim.ayetler[i]){
          return tilavet([{ a:tanim.ayetler[i], el:s.el }], bitti, function(){
            uyari(cubuk, 'Hafız sesi için internet bağlantısı gerekiyor.');
            bitti();
          });
        }
        return konus([{ t:okunusSadelestir(s.okunus), el:s.el }], bitti);
      }, '⏹');
      s.hucre.appendChild(kucuk);
    });
  }

  function stilEkle(){
    if(document.getElementById('sd-stil')) return;
    var st = document.createElement('style');
    st.id = 'sd-stil';
    st.textContent =
      '.sd-cubuk{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0;}' +
      '.sd-btn{font:inherit;font-size:.92em;font-weight:700;cursor:pointer;border-radius:999px;border:2px solid #7c3aed;' +
        'background:#7c3aed;color:#fff;padding:7px 16px;line-height:1.2;transition:transform .12s,box-shadow .12s;}' +
      '.sd-btn:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(124,58,237,.3);}' +
      '.sd-btn:focus-visible{outline:3px solid #f6c453;outline-offset:2px;}' +
      '.sd-btn.sd-anlam{background:transparent;color:#7c3aed;}' +
      '[data-theme="dark"] .sd-btn.sd-anlam{color:#c4b5fd;border-color:#a78bfa;}' +
      '.sd-btn.sd-aktif{background:#dc2626;border-color:#dc2626;color:#fff;}' +
      '.sd-btn:disabled{opacity:.5;cursor:not-allowed;}' +
      '.sd-btn.sd-satir{font-size:.8em;padding:2px 8px;margin-left:8px;vertical-align:middle;font-style:normal;' +
        'background:transparent;color:#7c3aed;border-width:1.5px;}' +
      '[data-theme="dark"] .sd-btn.sd-satir{color:#c4b5fd;border-color:#a78bfa;}' +
      '.sd-btn.sd-satir.sd-aktif{background:#dc2626;border-color:#dc2626;color:#fff;}' +
      '.sd-caliyor,.sd-caliyor > td{background:rgba(246,196,83,.32) !important;transition:background .2s;}' +
      '.sd-not{font-size:.82em;opacity:.8;}' +
      '@media print{.sd-cubuk,.sd-satir{display:none !important;}}';
    document.head.appendChild(st);
  }

  function baslat(){
    stilEkle();
    TANIMLAR.forEach(function(t){ try{ kur(t); }catch(e){ if(window.console) console.warn('sure-dinle:', t.ad, e); } });
  }

  window.addEventListener('pagehide', hepsiniDurdur);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', baslat);
  else baslat();
})();
