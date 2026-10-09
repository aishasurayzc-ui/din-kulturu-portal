/* ======================================================================
   LİNGO (paylaşılan) — TV'deki Lingo yarışmasının sınıf sürümü
   Kurallar: kelimenin ilk harfi verilir, 5 tahmin hakkı vardır.
     🟥 kırmızı kare  = harf doğru yerde
     🟡 sarı daire    = harf kelimede var ama yeri yanlış
     ⬛ gri           = harf kelimede yok
   Turlar: 4 harf → 5 harf → 6 harf (her turda 2 kelime).
   Modlar: Tek oyuncu / İki takım (bilemeyen takımın hakkı rakibe geçer:
   rakip bir harf daha açık olarak tek tahmin hakkı alır).
   Kelimeler ünitenin KENDİ kelime listelerinden gelir; yeni içerik
   uydurulmaz. Her sayfa yalnızca şunu çağırır:
     omLingoKur('lingo2', kelimeHavuzu2.concat(kelimeAvi2Listesi));
   Bu çağrı window['lingo2Baslat'] fonksiyonunu tanımlar; oyun-merkezi.js
   goster() ile bölüm açıldığında oyunu otomatik baştan kurar.
   Bağımlılık (varsa kullanılır): omKelimeSetiSec, sesCal (oyun-merkezi.js).
====================================================================== */
(function(){
  "use strict";

  var HAK = 5, TUR_KELIME = 2, UZUNLUKLAR = [4, 5, 6];
  var KLAVYE = [
    ['E','R','T','Y','U','I','O','P','Ğ','Ü'],
    ['A','S','D','F','G','H','J','K','L','Ş','İ'],
    ['GIR','Z','C','V','B','N','M','Ö','Ç','SIL']
  ];
  var HARF_RE = /^[A-ZÇĞİIÖŞÜ]$/;

  function trBuyuk(s){
    return String(s).toLocaleUpperCase('tr')
      .replace(/Â/g,'A').replace(/Î/g,'İ').replace(/Û/g,'U');
  }
  function karistir(d){
    var a = d.slice();
    for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; }
    return a;
  }
  function el(etiket, sinif, metin){
    var e = document.createElement(etiket);
    if(sinif) e.className = sinif;
    if(metin != null) e.textContent = metin;
    return e;
  }
  function ses(tur){ if(typeof window.sesCal === 'function'){ try{ window.sesCal(tur); }catch(e){} } }

  /* Tahmini değerlendir: 'd' doğru yer, 'v' var/yanlış yer, 'y' yok.
     Tekrarlı harfler doğru sayılır (önce doğru yerler, sonra kalanlar). */
  function degerlendir(tahmin, hedef){
    var n = hedef.length, sonuc = new Array(n), kalan = {};
    for(var i=0;i<n;i++){
      if(tahmin[i] === hedef[i]) sonuc[i] = 'd';
      else kalan[hedef[i]] = (kalan[hedef[i]] || 0) + 1;
    }
    for(var k=0;k<n;k++){
      if(sonuc[k]) continue;
      if(kalan[tahmin[k]] > 0){ sonuc[k] = 'v'; kalan[tahmin[k]]--; }
      else sonuc[k] = 'y';
    }
    return sonuc;
  }

  function havuzHazirla(liste){
    var gorulen = {}, havuz = {4:[],5:[],6:[]};
    (liste || []).forEach(function(o){
      if(!o || !o.kelime) return;
      var k = trBuyuk(o.kelime);
      if(gorulen[k] || !havuz[k.length]) return;
      for(var i=0;i<k.length;i++){ if(!HARF_RE.test(k[i])) return; }
      gorulen[k] = true;
      havuz[k.length].push({ kelime:k, anlam:o.anlam || o.ipucu || o.tanim || '' });
    });
    return havuz;
  }

  function kelimeSec(bolumId, havuz, uzunluk){
    var liste = havuz[uzunluk];
    if(!liste.length) return [];
    if(typeof window.omKelimeSetiSec === 'function'){
      try{ return window.omKelimeSetiSec('lingo' + uzunluk, liste, Math.min(TUR_KELIME, liste.length)); }catch(e){}
    }
    return karistir(liste).slice(0, TUR_KELIME);
  }

  window.omLingoKur = function(bolumId, liste){
    var bolum = document.getElementById(bolumId);
    if(!bolum) return;
    var alan = bolum.querySelector('.lingo');
    var sonucKutu = bolum.querySelector('.sonuc-kutusu');
    var havuz = havuzHazirla(liste);
    var d = null;   /* oyun durumu */

    /* ── 1) Mod seçimi ───────────────────────────────────── */
    function girisEkrani(){
      d = null;
      if(sonucKutu) sonucKutu.textContent = '';
      alan.innerHTML = '';
      var kutu = el('div','lingo-giris');
      kutu.appendChild(el('p','lingo-giris-baslik','Nasıl oynamak istersin?'));
      var modlar = el('div','lingo-modlar');
      var tek = el('button','lingo-mod','👤 Tek Oyuncu'); tek.type = 'button';
      var iki = el('button','lingo-mod','👥 İki Takım'); iki.type = 'button';
      modlar.appendChild(tek); modlar.appendChild(iki);
      kutu.appendChild(modlar);

      var adlar = el('div','lingo-adlar'); adlar.hidden = true;
      var a1 = el('input','lingo-ad'); a1.type='text'; a1.maxLength=20; a1.placeholder='Mavi Takım'; a1.setAttribute('aria-label','1. takımın adı');
      var a2 = el('input','lingo-ad'); a2.type='text'; a2.maxLength=20; a2.placeholder='Kırmızı Takım'; a2.setAttribute('aria-label','2. takımın adı');
      var basla = el('button','eylem','▶ Takımlarla Başla'); basla.type='button';
      adlar.appendChild(a1); adlar.appendChild(a2); adlar.appendChild(basla);
      kutu.appendChild(adlar);

      tek.onclick = function(){ oyunuKur(false); };
      iki.onclick = function(){ adlar.hidden = false; a1.focus(); };
      basla.onclick = function(){
        oyunuKur(true, [ '🔵 ' + (a1.value.trim() || 'Mavi Takım'), '🔴 ' + (a2.value.trim() || 'Kırmızı Takım') ]);
      };
      alan.appendChild(kutu);
    }

    /* ── 2) Oyunu kur: 4-5-6 harf turları ────────────────── */
    function oyunuKur(takimli, takimAdlari){
      var kelimeler = [];
      UZUNLUKLAR.forEach(function(u){
        kelimeSec(bolumId, havuz, u).forEach(function(k){ kelimeler.push({ kelime:k.kelime, anlam:k.anlam, uzunluk:u }); });
      });
      if(!kelimeler.length){ alan.textContent = 'Bu ünitede Lingo için uygun kelime bulunamadı.'; return; }
      d = {
        takimli: takimli,
        adlar: takimli ? takimAdlari : ['Sen'],
        puan: takimli ? [0,0] : [0],
        bilinen: takimli ? [0,0] : [0],
        kelimeler: kelimeler,
        i: -1
      };
      sonrakiKelime();
    }

    function sonrakiKelime(){
      d.i++;
      if(d.i >= d.kelimeler.length){ bitis(); return; }
      var k = d.kelimeler[d.i];
      d.hedef = k.kelime;
      d.satirlar = [];          /* [{harfler:[], sonuc:[]}] */
      d.yazilan = [d.hedef[0]];
      d.acikHarf = {0:true};   /* bilinen konumlar (ipucu satırında gösterilir) */
      d.sira = d.takimli ? (d.i % 2) : 0;
      d.calma = false;         /* rakibin tek tahmin hakkı mı? */
      d.ipucuAcik = false;
      d.bitti = false;
      d.klavyeDurum = {};
      ciz();
    }

    /* ── 3) Çizim ─────────────────────────────────────────── */
    function ciz(){
      alan.innerHTML = '';
      var k = d.kelimeler[d.i];

      var ust = el('div','lingo-ust');
      var tur = UZUNLUKLAR.indexOf(k.uzunluk) + 1;
      ust.appendChild(el('span','lingo-rozet', 'Tur ' + tur + ' · ' + k.uzunluk + ' harf'));
      ust.appendChild(el('span','lingo-rozet lingo-rozet-ikincil', 'Kelime ' + (d.i+1) + '/' + d.kelimeler.length));
      alan.appendChild(ust);

      var tablo = el('div','lingo-puanlar');
      d.adlar.forEach(function(ad, t){
        var p = el('div','lingo-puan' + (d.takimli ? ' lingo-takim' + (t+1) : '') + (t === d.sira && !d.bitti ? ' lingo-sirada' : ''));
        p.appendChild(el('span','lingo-puan-ad', ad));
        p.appendChild(el('b','lingo-puan-sayi', String(d.puan[t])));
        tablo.appendChild(p);
      });
      alan.appendChild(tablo);

      var durum = el('p','lingo-durum');
      durum.setAttribute('role','status'); durum.setAttribute('aria-live','polite');
      durum.textContent = durumMetni();
      alan.appendChild(durum);

      /* tahta */
      var tahta = el('div','lingo-tahta');
      tahta.style.setProperty('--lingo-n', k.uzunluk);
      tahta.setAttribute('aria-label', k.uzunluk + ' harfli Lingo tahtası');
      var satirSayisi = HAK + (d.calma ? 1 : 0);
      for(var r=0;r<satirSayisi;r++){
        var satir = el('div','lingo-satir' + (r >= HAK ? ' lingo-satir-calma' : ''));
        var veri = d.satirlar[r];
        var aktif = !d.bitti && r === d.satirlar.length;
        for(var c=0;c<k.uzunluk;c++){
          var hucre = el('div','lingo-hucre');
          if(veri){
            hucre.textContent = veri.harfler[c];
            hucre.classList.add('lingo-' + veri.sonuc[c]);
            hucre.style.animationDelay = (c * 0.09) + 's';
          } else if(aktif){
            if(d.yazilan[c]) hucre.textContent = d.yazilan[c];
            else if(d.acikHarf[c]) { hucre.textContent = d.hedef[c]; hucre.classList.add('lingo-ipucu-harf'); }
            if(c === 0) hucre.classList.add('lingo-ilk');
            if(c === d.yazilan.length) hucre.classList.add('lingo-imlec');
            hucre.classList.add('lingo-aktif');
          }
          satir.appendChild(hucre);
        }
        tahta.appendChild(satir);
      }
      alan.appendChild(tahta);

      /* anlam (ipucu ya da kelime bitince) */
      if(d.ipucuAcik || d.bitti){
        var anlam = el('p','lingo-anlam');
        anlam.appendChild(el('b', null, d.bitti ? d.hedef + ': ' : '💡 Anlamı: '));
        anlam.appendChild(document.createTextNode(k.anlam || '—'));
        alan.appendChild(anlam);
      }

      if(d.bitti){
        var alt = el('div','lingo-alt');
        var son = d.i + 1 >= d.kelimeler.length;
        var ileri = el('button','eylem', son ? '🏁 Sonuçları Gör' : 'Sonraki Kelime ➡'); ileri.type='button';
        ileri.onclick = sonrakiKelime;
        alt.appendChild(ileri);
        alan.appendChild(alt);
        setTimeout(function(){ try{ ileri.focus({preventScroll:true}); }catch(e){} }, 30);
        return;
      }

      alan.appendChild(klavyeCiz());

      var alt2 = el('div','lingo-alt');
      var ip = el('button','lingo-kucuk-btn', '💡 Anlamını göster (−10)'); ip.type='button';
      ip.disabled = d.ipucuAcik;
      ip.onclick = function(){ if(d.ipucuAcik) return; d.ipucuAcik = true; ciz(); };
      var pas = el('button','lingo-kucuk-btn lingo-kucuk-ikincil', '⏭ Pas geç'); pas.type='button';
      pas.onclick = function(){ kelimeyiKapat(-1, 0); };
      alt2.appendChild(ip); alt2.appendChild(pas);
      alan.appendChild(alt2);
    }

    function durumMetni(){
      if(d.bitti) return d.sonMesaj || '';
      var kalan = (d.calma ? 1 : HAK - d.satirlar.length);
      var kim = d.takimli ? d.adlar[d.sira] + ' — ' : '';
      if(d.calma) return kim + 'çalma hakkı! Bir harf daha açıldı, tek tahminin var.';
      return kim + 'ilk harf: ' + d.hedef[0] + ' · Kalan hak: ' + kalan;
    }

    function klavyeCiz(){
      var kl = el('div','lingo-klavye');
      kl.setAttribute('aria-label','Harf klavyesi');
      KLAVYE.forEach(function(sira){
        var s = el('div','lingo-k-satir');
        sira.forEach(function(t){
          var b = el('button','lingo-tus'); b.type='button';
          if(t === 'GIR'){ b.textContent = '↵ Gir'; b.classList.add('lingo-tus-genis'); b.setAttribute('aria-label','Tahmini gönder'); }
          else if(t === 'SIL'){ b.textContent = '⌫'; b.classList.add('lingo-tus-genis'); b.setAttribute('aria-label','Harfi sil'); }
          else { b.textContent = t; var dk = d.klavyeDurum[t]; if(dk) b.classList.add('lingo-' + dk); }
          b.onclick = function(){ tus(t); };
          s.appendChild(b);
        });
        kl.appendChild(s);
      });
      return kl;
    }

    /* ── 4) Giriş ─────────────────────────────────────────── */
    function tus(t){
      if(!d || d.bitti) return;
      var n = d.hedef.length;
      if(t === 'SIL'){ if(d.yazilan.length > 1) d.yazilan.pop(); ciz(); return; }
      if(t === 'GIR'){ gonder(); return; }
      if(!HARF_RE.test(t) || d.yazilan.length >= n) return;
      d.yazilan.push(t); ses('tik'); ciz();
    }

    function gonder(){
      var n = d.hedef.length;
      if(d.yazilan.length < n){ uyar('Kelime ' + n + ' harfli olmalı.'); return; }
      var tahmin = d.yazilan.slice();
      var sonuc = degerlendir(tahmin, d.hedef);
      d.satirlar.push({ harfler: tahmin, sonuc: sonuc });
      var oncelik = { d:3, v:2, y:1 }, harfAd = { d:'d', v:'v', y:'y' };
      tahmin.forEach(function(h, i){
        if(sonuc[i] === 'd') d.acikHarf[i] = true;
        var eski = d.klavyeDurum[h];
        if(!eski || oncelik[sonuc[i]] > oncelik[eski]) d.klavyeDurum[h] = harfAd[sonuc[i]];
      });

      if(tahmin.join('') === d.hedef){
        var deneme = d.satirlar.length;
        var kazanilan = d.calma ? 10 : (60 - deneme * 10);
        if(d.ipucuAcik) kazanilan = Math.max(5, kazanilan - 10);
        kelimeyiKapat(d.sira, kazanilan);
        return;
      }
      ses('yanlis');
      if(d.calma){ kelimeyiKapat(-1, 0); return; }
      if(d.satirlar.length >= HAK){
        if(d.takimli){
          /* hak rakibe geçer: kapalı bir harf daha açılır */
          d.calma = true;
          d.sira = 1 - d.sira;
          var kapali = [];
          for(var i=1;i<n;i++){ if(!d.acikHarf[i]) kapali.push(i); }
          if(kapali.length) d.acikHarf[kapali[Math.floor(Math.random()*kapali.length)]] = true;
        } else { kelimeyiKapat(-1, 0); return; }
      }
      d.yazilan = [d.hedef[0]];
      ciz();
    }

    function kelimeyiKapat(kazanan, puan){
      d.bitti = true;
      if(kazanan >= 0){
        d.puan[kazanan] += puan; d.bilinen[kazanan]++;
        d.sonMesaj = '✅ ' + (d.takimli ? d.adlar[kazanan] + ' bildi! ' : 'Bildin! ') + '+' + puan + ' puan';
        ses('dogru');
      } else {
        d.sonMesaj = '🔎 Doğru kelime: ' + d.hedef;
      }
      ciz();
    }

    function uyar(m){
      var dur = alan.querySelector('.lingo-durum');
      if(dur){ dur.textContent = m; }
      var satir = alan.querySelectorAll('.lingo-satir')[d.satirlar.length];
      if(satir){ satir.classList.remove('lingo-salla'); void satir.offsetWidth; satir.classList.add('lingo-salla'); }
    }

    /* ── 5) Bitiş ─────────────────────────────────────────── */
    function bitis(){
      alan.innerHTML = '';
      var kutu = el('div','lingo-bitis');
      var mesaj;
      if(d.takimli){
        var p = d.puan;
        mesaj = p[0] === p[1] ? '🏆 Berabere! İki takım da ' + p[0] + ' puan.'
              : '🏆 Kazanan: ' + d.adlar[p[0] > p[1] ? 0 : 1] + ' (' + Math.max(p[0],p[1]) + ' – ' + Math.min(p[0],p[1]) + ')';
      } else {
        mesaj = '🏆 Lingo tamamlandı! ' + d.puan[0] + ' puan · ' + d.bilinen[0] + '/' + d.kelimeler.length + ' kelime';
      }
      kutu.appendChild(el('p','lingo-bitis-baslik', mesaj));
      var liste = el('ul','lingo-ozet');
      d.kelimeler.forEach(function(k){
        var li = el('li');
        li.appendChild(el('b', null, k.kelime));
        li.appendChild(document.createTextNode(' — ' + (k.anlam || '')));
        liste.appendChild(li);
      });
      kutu.appendChild(liste);
      var tekrar = el('button','eylem','🔄 Yeni Lingo'); tekrar.type='button';
      tekrar.onclick = girisEkrani;
      kutu.appendChild(tekrar);
      alan.appendChild(kutu);
      if(sonucKutu) sonucKutu.textContent = mesaj;   /* 🏆 → oyun-merkezi puan/rozet sayacı */
      ses('kazanan');
      d = null;
    }

    /* fiziksel klavye: yalnızca bu bölüm açıkken ve bir metin kutusuna yazılmıyorken */
    document.addEventListener('keydown', function(e){
      if(!d || d.bitti || !bolum.classList.contains('aktif')) return;
      if(e.ctrlKey || e.metaKey || e.altKey) return;
      var hedefEl = e.target;
      if(hedefEl && (hedefEl.tagName === 'INPUT' || hedefEl.tagName === 'TEXTAREA' || hedefEl.isContentEditable)) return;
      if(e.key === 'Enter'){ if(hedefEl && hedefEl.tagName === 'BUTTON' && !hedefEl.classList.contains('lingo-tus')) return; e.preventDefault(); tus('GIR'); return; }
      if(e.key === 'Backspace'){ e.preventDefault(); tus('SIL'); return; }
      if(e.key && e.key.length === 1){
        var h = trBuyuk(e.key);
        if(HARF_RE.test(h)){ e.preventDefault(); tus(h); }
      }
    });

    window[bolumId + 'Baslat'] = girisEkrani;
    girisEkrani();
  };

  /* test için dışa açılır */
  window.omLingoDegerlendir = degerlendir;
})();
