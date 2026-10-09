/* ======================================================================
   HAFIZA KARTLARI — kelime kodlama ve somutlaştırma motoru (4-8. sınıf)
   Sayfada:  <div class="kutu-panel hk-bolum" data-hafiza="s8-u1"></div>
   Veri:     ortak/hafiza-veri.js (window.HAFIZA_VERI)
   Akış (aralıklı karşılaşma):
     1 Öğren → 2 Görseli hatırla → 3 Senaryoda bul → 4 Karşılaştır →
     5 Uygula (8. sınıfta LGS soruları) · 🔁 Tekrar (yanlış yapılanlar)
   Kayıt yalnızca bu cihazda (localStorage "hk:<ünite>"). Yanlışta
   utandırmaz: ipucu, doğru cevap ve ilgili kart hatırlatılır.
====================================================================== */
(function(){
  'use strict';
  var VERI = window.HAFIZA_VERI; if(!VERI) return;
  var ASAMALAR = [
    { no:1, ad:'Öğren', ikon:'📘', alt:'Kartları oku: kelime, görsel, anlam, fark.' },
    { no:2, ad:'Görseli hatırla', ikon:'🖼️', alt:'Görsel ve benzetme hangi kavramı anlatıyor?' },
    { no:3, ad:'Senaryoda bul', ikon:'🎬', alt:'Kısa olaylarda kavramı tanı.' },
    { no:4, ad:'Karşılaştır', ikon:'⚖️', alt:'Benzer kavramları birbirinden ayır.' },
    { no:5, ad:'Uygula', ikon:'🚀', alt:'Yeni durumlarda kullan.' }
  ];
  var TIP_AD = { temel:'Temel bilgi', senaryo:'Günlük hayat senaryosu', cikarim:'Çıkarım', karistirma:'Kavram karıştırma', yeni:'Yeni durum' };
  var HARF = ['A','B','C','D','E'];

  function karistir(d){ d = d.slice(); for(var i=d.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=d[i]; d[i]=d[j]; d[j]=t; } return d; }
  function el(etiket, sinif, metin){ var x = document.createElement(etiket); if(sinif) x.className = sinif; if(metin != null) x.textContent = metin; return x; }
  function btn(sinif, metin){ var b = el('button', sinif, metin); b.type = 'button'; return b; }

  function kur(kok){
    var id = kok.getAttribute('data-hafiza'), U = VERI[id]; if(!U || kok.dataset.hkKuruldu) return;
    kok.dataset.hkKuruldu = '1';
    var ANAHTAR = 'hk:' + id;
    var D = { asama:{}, yanlis:{} };
    try { var k = JSON.parse(localStorage.getItem(ANAHTAR) || 'null'); if(k && k.yanlis) D = { asama:k.asama || {}, yanlis:k.yanlis }; } catch(e){}
    function kaydet(){ try { localStorage.setItem(ANAHTAR, JSON.stringify(D)); } catch(e){} }
    var KART = {}; U.kartlar.forEach(function(c){ KART[c.id] = c; });

    /* bütün sorular tek havuzda (tekrar alanı için) */
    var SORU = {};
    U.kartlar.forEach(function(c){
      SORU['c-' + c.id] = { s:c.soru.s, o:c.soru.o, d:c.soru.d, k:c.id, a:c.tanim };
      var digerleri = karistir(U.kartlar.filter(function(x){ return x.id !== c.id; })).slice(0, 3).map(function(x){ return x.kavram; });
      SORU['g-' + c.id] = { simge:c.simge, s:'Bu görsel ve benzetme hangi kavramı hatırlatıyor? “' + c.somut + '”', o:[c.kavram].concat(digerleri), d:0, k:c.id, a:c.neden };
    });
    (U.senaryo || []).forEach(function(q, i){ SORU['s-' + i] = q; });
    (U.karsilastir || []).forEach(function(q, i){ SORU['k-' + i] = q; });
    (U.uygula || []).forEach(function(q, i){ SORU['u-' + i] = q; });
    (U.lgsSorular || []).forEach(function(q, i){ SORU['l-' + i] = q; });

    kok.innerHTML = '';
    var bas = el('div', 'hk-bas');
    bas.appendChild(el('span', 'hk-bas-ikon', '🧠'));
    var h = el('h3'); h.appendChild(el('small', null, 'Hafıza Kartları · Kelime kodlama')); h.appendChild(document.createTextNode(U.baslik));
    bas.appendChild(h); kok.appendChild(bas);
    kok.appendChild(el('p', 'hk-giris', U.giris));
    kok.appendChild(el('p', 'hk-not', '💡 Önce yukarıdaki konu anlatımını oku. Hatırlatma kelimeleri bir hatırlama yöntemidir; kavramın dinî anlamının yerine geçmez.'));
    if(U.baglanti){
      var bg = el('p', 'hk-baglanti'); bg.appendChild(document.createTextNode(U.baglanti.metin + ' '));
      var a = el('a', null, U.baglanti.yazi); a.href = U.baglanti.href; bg.appendChild(a); kok.appendChild(bg);
    }
    var nav = el('div', 'hk-nav'); nav.setAttribute('role', 'tablist'); nav.setAttribute('aria-label', 'Öğrenme aşamaları');
    var alan = el('div', 'hk-alan'); alan.setAttribute('role', 'tabpanel');
    kok.appendChild(nav); kok.appendChild(alan);
    var aktif = 1;

    function navCiz(){
      nav.innerHTML = '';
      ASAMALAR.forEach(function(A){
        var b = btn('hk-sekme' + (aktif === A.no ? ' hk-aktif' : '') + (D.asama[A.no] ? ' hk-tamam' : ''));
        b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', aktif === A.no ? 'true' : 'false');
        b.appendChild(el('b', null, A.no)); b.appendChild(el('span', null, A.ikon + ' ' + A.ad));
        b.addEventListener('click', function(){ goster(A.no); });
        nav.appendChild(b);
      });
      var yanlisSay = Object.keys(D.yanlis).length;
      var t = btn('hk-sekme hk-sekme-tekrar' + (aktif === 'T' ? ' hk-aktif' : ''));
      t.setAttribute('role', 'tab'); t.setAttribute('aria-selected', aktif === 'T' ? 'true' : 'false');
      t.appendChild(el('b', null, '🔁')); t.appendChild(el('span', null, 'Tekrar' + (yanlisSay ? ' (' + yanlisSay + ')' : '')));
      t.addEventListener('click', function(){ goster('T'); });
      nav.appendChild(t);
    }

    /* ── çoktan seçmeli soru ── */
    function soruKart(qid, q, etiket, bitince){
      var kart = el('div', 'hk-soru');
      if(etiket) kart.appendChild(el('span', 'hk-etiket', etiket));
      if(q.simge){ var sm = el('div', 'hk-soru-simge', q.simge); sm.setAttribute('aria-hidden', 'true'); kart.appendChild(sm); }
      kart.appendChild(el('p', 'hk-soru-metin', q.s));
      var kutu = el('div', 'hk-secenekler' + (q.o.length === 2 ? ' hk-iki' : '')), dogru = q.o[q.d];
      karistir(q.o).forEach(function(se, j){
        var b = btn('hk-sec'); b.dataset.m = se;
        if(q.o.length > 2) b.appendChild(el('span', 'hk-harf', HARF[j]));
        b.appendChild(el('span', null, se));
        b.addEventListener('click', function(){
          if(kutu.dataset.kilit) return; kutu.dataset.kilit = '1';
          var ok = se === dogru;
          kutu.querySelectorAll('.hk-sec').forEach(function(x){ x.disabled = true; if(x.dataset.m === dogru) x.classList.add('hk-dogru'); });
          if(!ok) b.classList.add('hk-tekrar-sec');
          sonucIsle(qid, ok);
          kart.appendChild(geriBildirim(ok, q, dogru));
          if(bitince) bitince(ok);
        });
        kutu.appendChild(b);
      });
      kart.appendChild(kutu);
      return kart;
    }
    function geriBildirim(ok, q, dogruMetni){
      var g = el('div', 'hk-gb ' + (ok ? 'hk-gb-iyi' : 'hk-gb-dene'));
      if(ok) g.appendChild(el('p', null, '✅ Doğru! ' + (q.a || '')));
      else {
        g.appendChild(el('p', null, '🔎 Bu sefer olmadı, birlikte bakalım. Doğru cevap: “' + dogruMetni + '”.'));
        if(q.a) g.appendChild(el('p', null, '📘 ' + q.a));
        var c = q.k && KART[q.k];
        if(c) g.appendChild(el('p', 'hk-gb-kart', '🔁 Kartı hatırla: ' + c.kavram + ' → “' + c.kelime + '”. ' + c.tanim));
        g.appendChild(el('p', 'hk-gb-kucuk', 'Bu soru “Tekrar” bölümüne eklendi; daha sonra yeniden çözebilirsin.'));
      }
      return g;
    }
    function sonucIsle(qid, ok){
      if(ok) delete D.yanlis[qid]; else D.yanlis[qid] = 1;
      kaydet(); navCiz();
    }
    function setKur(kap, liste, etiketFn, asamaNo){
      var cozulen = 0, dogru = 0;
      var ozet = el('div', 'hk-set-ozet'); ozet.hidden = true;
      liste.forEach(function(qid, i){
        kap.appendChild(soruKart(qid, SORU[qid], etiketFn ? etiketFn(qid, i) : null, function(ok){
          cozulen++; if(ok) dogru++;
          if(cozulen === liste.length){
            if(asamaNo){ D.asama[asamaNo] = 1; kaydet(); navCiz(); }
            ozet.hidden = false; ozet.innerHTML = '';
            var oran = dogru / liste.length;
            ozet.appendChild(el('p', null, liste.length + ' sorudan ' + dogru + ' tanesini doğru cevapladın. ' +
              (oran >= .8 ? 'Harika! Kavramları birbirinden ayırabiliyorsun.' : 'Kartları yeniden gözden geçirerek daha da güçlenebilirsin.')));
            ileriDugmesi(ozet, asamaNo);
          }
        }));
      });
      kap.appendChild(ozet);
    }
    function ileriDugmesi(kap, asamaNo){
      if(typeof asamaNo !== 'number') return;
      var dug = el('div', 'hk-dugmeler');
      if(asamaNo < 5){ var b = btn('hk-btn', 'Sıradaki aşama: ' + ASAMALAR[asamaNo].ad + ' ▶'); b.addEventListener('click', function(){ goster(asamaNo + 1); kaydir(); }); dug.appendChild(b); }
      if(Object.keys(D.yanlis).length){ var t = btn('hk-btn hk-btn-ikincil', '🔁 Yanlışlarımı tekrar et'); t.addEventListener('click', function(){ goster('T'); kaydir(); }); dug.appendChild(t); }
      kap.appendChild(dug);
    }
    function kaydir(){ try { kok.scrollIntoView({ block:'start', behavior:'smooth' }); } catch(e){} }

    /* ── 1) Öğren: öğrenme kartları ── */
    function kartlarCiz(){
      var izgara = el('div', 'hk-kartlar');
      U.kartlar.forEach(function(c){
        var k = el('div', 'hk-kart'); k.id = 'hk-' + id + '-' + c.id;
        var ust = el('div', 'hk-kart-ust');
        var sm = el('span', 'hk-simge', c.simge); sm.setAttribute('aria-hidden', 'true'); ust.appendChild(sm);
        var ad = el('div', 'hk-kart-ad'); ad.appendChild(el('b', null, c.kavram)); ad.appendChild(el('span', 'hk-kelime', c.kelime)); ust.appendChild(ad);
        k.appendChild(ust);
        function satir(baslik, metin, sinif){ var p = el('p', 'hk-satir' + (sinif ? ' ' + sinif : '')); p.appendChild(el('b', null, baslik)); p.appendChild(document.createTextNode(metin)); k.appendChild(p); }
        satir('Kısa açıklama', c.tanim);
        satir('Neden bu görsel?', c.neden);
        satir('Somutlaştırma', c.somut);
        satir('Benzetmenin sınırı', c.sinir, 'hk-sinir');
        satir('Anlam bağlantısı', c.anlam);
        if(c.ayet){
          var f = el('figure', 'hk-ayet'); f.appendChild(el('span', 'hk-ayet-etiket', 'Ayet meali'));
          f.appendChild(el('blockquote', null, '“' + c.ayet.m + '”')); f.appendChild(el('figcaption', null, c.ayet.k)); k.appendChild(f);
        }
        satir('Günlük hayattan', c.gunluk);
        satir('Karıştırma uyarısı · ' + c.karisan.ad, c.karisan.fark, 'hk-uyari');
        var sq = el('div', 'hk-kart-soru'); sq.appendChild(el('b', null, '🤔 Hatırlama sorusu'));
        sq.appendChild(soruKart('c-' + c.id, SORU['c-' + c.id], null, null));
        k.appendChild(sq);
        izgara.appendChild(k);
      });
      alan.appendChild(izgara);
      var bitir = el('div', 'hk-dugmeler'), b = btn('hk-btn', '✔ Kartları okudum · Görseli hatırla ▶');
      b.addEventListener('click', function(){ D.asama[1] = 1; kaydet(); goster(2); kaydir(); });
      bitir.appendChild(b); alan.appendChild(bitir);
    }

    /* ── uygulama etkinlikleri ── */
    function etkinlik(e, ei){
      var kap = el('div', 'hk-etkinlik');
      kap.appendChild(el('h4', null, '🧩 ' + e.baslik));
      var qid = 'e-' + ei;
      var dug = el('div', 'hk-dugmeler'), kontrol = btn('hk-btn', '✅ Kontrol et'), sifirla = btn('hk-btn hk-btn-ikincil', '↺ Baştan');
      var gb = el('div'); var kontrolFn;
      function bitir(ok, ayrinti){
        sonucIsle(qid, ok);
        gb.innerHTML = '';
        var g = el('div', 'hk-gb ' + (ok ? 'hk-gb-iyi' : 'hk-gb-dene'));
        g.appendChild(el('p', null, ok ? '✅ Harika, hepsi doğru! ' + (e.a || '') : '🔎 ' + (ayrinti || 'Bazıları yerinde değil.') + ' Sarı işaretlilere bir daha bak ve yeniden dene.'));
        if(!ok && e.a) g.appendChild(el('p', null, '📘 ' + e.a));
        gb.appendChild(g);
      }
      if(e.tur === 'grup'){
        var secili = null;
        var havuz = el('div', 'hk-havuz'); havuz.setAttribute('aria-label', 'Yerleştirilecek kartlar');
        var kovalar = el('div', 'hk-kovalar');
        var kovaEl = e.kovalar.map(function(ad, ki){
          var kv = el('div', 'hk-kova'); kv.tabIndex = 0; kv.setAttribute('role', 'button'); kv.dataset.k = ki;
          kv.appendChild(el('b', null, ad)); var ic = el('div', 'hk-kova-ic'); kv.appendChild(ic);
          function birak(){ if(secili){ ic.appendChild(secili); secili.classList.remove('hk-secili', 'hk-yanlis-yer', 'hk-dogru-yer'); secili = null; } }
          kv.addEventListener('click', function(ev){ if(ev.target.closest('.hk-fis') && ev.target.closest('.hk-kova-ic')) return; birak(); });
          kv.addEventListener('keydown', function(ev){ if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); birak(); } });
          kovalar.appendChild(kv); return kv;
        });
        function fis(m, dogruK){
          var f = btn('hk-fis', m); f.dataset.k = dogruK;
          f.addEventListener('click', function(ev){
            ev.stopPropagation();
            if(f.parentNode !== havuz){ havuz.appendChild(f); f.classList.remove('hk-yanlis-yer', 'hk-dogru-yer'); return; }
            if(secili === f){ f.classList.remove('hk-secili'); secili = null; return; }
            if(secili) secili.classList.remove('hk-secili'); secili = f; f.classList.add('hk-secili');
          });
          return f;
        }
        function doldur(){ havuz.innerHTML = ''; kovaEl.forEach(function(kv){ kv.querySelector('.hk-kova-ic').innerHTML = ''; }); karistir(e.ogeler).forEach(function(o){ havuz.appendChild(fis(o[0], o[1])); }); gb.innerHTML = ''; }
        kap.appendChild(el('p', 'hk-ipucu', 'Bir karta dokun, sonra doğru kutuya dokun. Kutudaki karta dokunursan geri gelir.'));
        kap.appendChild(havuz); kap.appendChild(kovalar);
        kontrolFn = function(){
          if(havuz.children.length){ gb.innerHTML = ''; gb.appendChild(el('p', 'hk-gb hk-gb-dene', 'Önce bütün kartları bir kutuya yerleştir (' + havuz.children.length + ' kart kaldı).')); return; }
          var yanlis = 0;
          kovaEl.forEach(function(kv){ kv.querySelectorAll('.hk-fis').forEach(function(f){ var ok = f.dataset.k === kv.dataset.k; f.classList.toggle('hk-dogru-yer', ok); f.classList.toggle('hk-yanlis-yer', !ok); if(!ok) yanlis++; }); });
          bitir(!yanlis, yanlis + ' kart yanlış kutuda.');
        };
        sifirla.addEventListener('click', doldur); doldur();
      } else if(e.tur === 'sira'){
        var hedef = el('ol', 'hk-sira-hedef'), havuz2 = el('div', 'hk-havuz');
        function fis2(m){
          var f = btn('hk-fis', m); f.dataset.m = m;
          f.addEventListener('click', function(){
            if(f.disabled) return;
            if(f.parentNode === havuz2){ var li = el('li'); li.appendChild(f); hedef.appendChild(li); }
            else { var li2 = f.parentNode; havuz2.appendChild(f); li2.remove(); f.classList.remove('hk-yanlis-yer', 'hk-dogru-yer'); }
          });
          return f;
        }
        function doldur2(){ hedef.innerHTML = ''; havuz2.innerHTML = ''; var s = karistir(e.sira); if(s.join('|') === e.sira.join('|')) s.reverse(); s.forEach(function(m){ havuz2.appendChild(fis2(m)); }); gb.innerHTML = ''; }
        kap.appendChild(el('p', 'hk-ipucu', 'Kartlara doğru sırayla dokun. Yanlış yerleştirdiğin karta dokunursan geri gelir.'));
        kap.appendChild(hedef); kap.appendChild(havuz2);
        kontrolFn = function(){
          if(havuz2.children.length){ gb.innerHTML = ''; gb.appendChild(el('p', 'hk-gb hk-gb-dene', 'Önce bütün kartları sıraya yerleştir.')); return; }
          var yanlis = 0;
          hedef.querySelectorAll('.hk-fis').forEach(function(f, j){ var ok = f.dataset.m === e.sira[j]; f.classList.toggle('hk-dogru-yer', ok); f.classList.toggle('hk-yanlis-yer', !ok); if(!ok) yanlis++; });
          bitir(!yanlis, yanlis + ' kart yanlış sırada.');
        };
        sifirla.addEventListener('click', doldur2); doldur2();
      } else {
        /* esles · tamamla · duzelt · gorsel: her satırda bir seçim kutusu */
        var satirlar = [], secenekler;
        if(e.tur === 'esles'){ secenekler = e.ciftler.map(function(c){ return c[1]; }); satirlar = e.ciftler.map(function(c){ return { sol:c[0], dogru:c[1] }; }); }
        if(e.tur === 'tamamla'){ secenekler = e.secenekler; satirlar = e.cumleler.map(function(c){ return { sol:c[0], dogru:c[1] }; }); }
        if(e.tur === 'duzelt'){ secenekler = e.ciftler.map(function(c){ return c[1]; }); satirlar = e.ciftler.map(function(c){ return { sol:c[0], dogru:c[1], ilk:c[2] }; }); }
        if(e.tur === 'gorsel'){
          secenekler = e.noktalar.map(function(n){ return n[1]; }); satirlar = e.noktalar.map(function(n){ return { sol:'Numara ' + n[0], dogru:n[1] }; });
          var sv = el('div', 'hk-gorsel'); sv.innerHTML = SVG[e.svg] || ''; kap.appendChild(sv);
        }
        if(e.tur === 'duzelt') kap.appendChild(el('p', 'hk-ipucu', 'Bazı eşleştirmeler yanlış yapılmış. Yanlış olanları bulup doğru görevi seç.'));
        var liste = el('div', 'hk-esles'), selectler = [];
        satirlar.forEach(function(r, j){
          var row = el('div', 'hk-esles-satir'); var lid = 'hk-' + id + '-' + ei + '-' + j;
          var lb = el('label', 'hk-esles-sol', r.sol); lb.htmlFor = lid;
          var sel = el('select'); sel.id = lid; sel.appendChild(new Option('Seç…', ''));
          karistir(secenekler).forEach(function(o){ sel.appendChild(new Option(o, o)); });
          if(r.ilk) sel.value = r.ilk;
          row.appendChild(lb); row.appendChild(sel); liste.appendChild(row); selectler.push(sel);
        });
        kap.appendChild(liste);
        kontrolFn = function(){
          if(selectler.some(function(s){ return !s.value; })){ gb.innerHTML = ''; gb.appendChild(el('p', 'hk-gb hk-gb-dene', 'Önce her satır için bir seçim yap.')); return; }
          var yanlis = 0;
          selectler.forEach(function(s, j){ var ok = s.value === satirlar[j].dogru; s.parentNode.classList.toggle('hk-dogru-yer', ok); s.parentNode.classList.toggle('hk-yanlis-yer', !ok); if(!ok) yanlis++; });
          bitir(!yanlis, yanlis + ' eşleştirme yanlış.');
        };
        sifirla.addEventListener('click', function(){ selectler.forEach(function(s, j){ s.value = satirlar[j].ilk || ''; s.parentNode.classList.remove('hk-dogru-yer', 'hk-yanlis-yer'); }); gb.innerHTML = ''; });
      }
      kontrol.addEventListener('click', function(){ kontrolFn(); });
      dug.appendChild(kontrol); dug.appendChild(sifirla);
      kap.appendChild(dug); kap.appendChild(gb);
      return kap;
    }

    /* ── aşamalar ── */
    function goster(no){
      aktif = no; navCiz(); alan.innerHTML = '';
      if(no !== 'T'){ var A = ASAMALAR[no - 1]; alan.appendChild(el('p', 'hk-asama-alt', A.ikon + ' ' + A.no + '. karşılaşma: ' + A.alt)); }
      if(no === 1) kartlarCiz();
      if(no === 2){ setKur(alan, karistir(U.kartlar.map(function(c){ return 'g-' + c.id; })), null, 2); }
      if(no === 3){ setKur(alan, (U.senaryo || []).map(function(q, i){ return 's-' + i; }), null, 3); }
      if(no === 4){
        var gruplar = (U.etkinlikler || []).map(function(e, i){ return [e, i]; }).filter(function(x){ return x[0].tur === 'grup' || x[0].tur === 'duzelt'; });
        gruplar.forEach(function(x){ alan.appendChild(etkinlik(x[0], x[1])); });
        setKur(alan, (U.karsilastir || []).map(function(q, i){ return 'k-' + i; }), null, 4);
      }
      if(no === 5){
        (U.etkinlikler || []).forEach(function(e, i){ if(e.tur !== 'grup' && e.tur !== 'duzelt') alan.appendChild(etkinlik(e, i)); });
        if(U.lgsSorular) lgsCiz();
        else setKur(alan, (U.uygula || []).map(function(q, i){ return 'u-' + i; }), null, 5);
      }
      if(no === 'T') tekrarCiz();
    }
    function lgsCiz(){
      alan.appendChild(el('p', 'hk-lgs-not', '🎯 LGS tarzı sorular: Her kavram için temel bilgi, günlük hayat senaryosu, çıkarım, kavram karıştırma ve yeni durum soruları. Yalnızca hatırlatma kelimesini bilmek yetmez; kavramın anlamını kullanman gerekir.'));
      var cipler = el('div', 'hk-cipler'), lkap = el('div');
      U.kartlar.forEach(function(c, ci){
        var b = btn('hk-cip', c.simge + ' ' + c.kavram);
        b.addEventListener('click', function(){
          cipler.querySelectorAll('.hk-cip').forEach(function(x){ x.classList.remove('hk-aktif'); }); b.classList.add('hk-aktif');
          lkap.innerHTML = '';
          var ids = []; U.lgsSorular.forEach(function(q, i){ if(q.k === c.id) ids.push('l-' + i); });
          setKur(lkap, ids, function(qid){ return TIP_AD[SORU[qid].tip] || ''; }, null);
          var tumu = U.kartlar.every(function(x){ return D.asama['l-' + x.id]; });
          D.asama['l-' + c.id] = 1; kaydet();
          if(!tumu && U.kartlar.every(function(x){ return D.asama['l-' + x.id]; })){ D.asama[5] = 1; kaydet(); navCiz(); }
        });
        cipler.appendChild(b);
        if(ci === 0) setTimeout(function(){ b.click(); }, 0);
      });
      alan.appendChild(cipler); alan.appendChild(lkap);
    }
    function tekrarCiz(){
      var ids = Object.keys(D.yanlis).filter(function(q){ return SORU[q] || /^e-/.test(q); });
      alan.appendChild(el('p', 'hk-asama-alt', '🔁 Tekrar alanı: Yanlış yaptığın sorular burada toplanır. Doğru cevapladığında listeden çıkar.'));
      if(!ids.length){ alan.appendChild(el('p', 'hk-bos', '🌟 Şu an tekrar edilecek soru yok. Aşamaları çözdükçe yanlışların burada birikir.')); return; }
      var etkinlikIds = ids.filter(function(q){ return /^e-/.test(q); }), soruIds = ids.filter(function(q){ return !/^e-/.test(q); });
      etkinlikIds.forEach(function(q){ var i = +q.slice(2); if(U.etkinlikler[i]) alan.appendChild(etkinlik(U.etkinlikler[i], i)); });
      if(soruIds.length) setKur(alan, karistir(soruIds), function(qid){ var c = SORU[qid].k && KART[SORU[qid].k]; return c ? c.kavram : ''; }, null);
    }

    navCiz(); goster(1);
  }

  /* Basit cami şeması (5. sınıf 5. ünite) — numaralar etkinlikteki satırlarla eşleşir */
  var SVG = {
    cami: '<svg viewBox="0 0 440 270" role="img" aria-label="Cami şeması: 1 kubbe, 2 minare, 3 mihrap, 4 minber, 5 vaaz kürsüsü, 6 şadırvan">' +
      '<rect width="440" height="270" rx="16" fill="#eef6fb"/>' +
      '<path d="M0 238 H440" stroke="#9fb6c9" stroke-width="3"/>' +
      /* şadırvan */
      '<g><rect x="34" y="200" width="62" height="38" rx="4" fill="#cfe3f0" stroke="#2a6f97" stroke-width="2.5"/><path d="M28 202 L65 176 L102 202 Z" fill="#7fb3d5" stroke="#2a6f97" stroke-width="2.5"/>' +
      '<path d="M48 214 v10 M65 214 v10 M82 214 v10" stroke="#2a6f97" stroke-width="3" stroke-linecap="round"/></g>' +
      /* ana yapı (kesit) */
      '<rect x="130" y="138" width="210" height="100" fill="#fff" stroke="#2a6f97" stroke-width="3"/>' +
      '<path d="M165 138 A70 70 0 0 1 305 138 Z" fill="#cfe3f0" stroke="#2a6f97" stroke-width="3"/><path d="M235 68 v-14" stroke="#c9a227" stroke-width="3"/><circle cx="235" cy="50" r="5" fill="#c9a227"/>' +
      /* mihrap */
      '<path d="M220 238 V200 A15 15 0 0 1 250 200 V238" fill="#e9dcc3" stroke="#8a6d2b" stroke-width="2.5"/>' +
      /* minber */
      '<path d="M262 238 L262 222 L272 222 L272 208 L282 208 L282 194 L294 194 L294 238 Z" fill="#e9dcc3" stroke="#8a6d2b" stroke-width="2.5"/><path d="M294 194 V174 L300 166 L306 174 V238" fill="none" stroke="#8a6d2b" stroke-width="2.5"/>' +
      /* vaaz kürsüsü */
      '<rect x="160" y="212" width="34" height="26" fill="#e9dcc3" stroke="#8a6d2b" stroke-width="2.5"/><path d="M164 212 V196 H190 V212" fill="none" stroke="#8a6d2b" stroke-width="2.5"/>' +
      /* minare */
      '<rect x="360" y="70" width="18" height="168" fill="#fff" stroke="#2a6f97" stroke-width="3"/><path d="M354 118 H384 M356 92 H382" stroke="#2a6f97" stroke-width="3"/><path d="M360 70 L369 34 L378 70 Z" fill="#7fb3d5" stroke="#2a6f97" stroke-width="2.5"/>' +
      /* numaralar */
      ['<g font-family="Nunito,Segoe UI,sans-serif" font-weight="900" font-size="15" text-anchor="middle">',
       [[235,98,1],[369,150,2],[235,190,3],[288,160,4],[177,186,5],[65,168,6]].map(function(n){
         return '<circle cx="'+n[0]+'" cy="'+n[1]+'" r="13" fill="#c9740b" stroke="#fff" stroke-width="2.5"/><text x="'+n[0]+'" y="'+(n[1]+5)+'" fill="#fff">'+n[2]+'</text>';
       }).join(''), '</g>'].join('') +
      '</svg>'
  };

  function hepsiniKur(){ document.querySelectorAll('[data-hafiza]').forEach(kur); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hepsiniKur); else hepsiniKur();
  window.hafizaKartlariKur = hepsiniKur;
})();
