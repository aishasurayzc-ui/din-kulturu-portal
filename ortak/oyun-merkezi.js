/* ======================================================================
   OYUN MERKEZI - PAYLASILAN (ORTAK) MOTOR (v2 - dogru ayiklama)
   SADECE jenerik fonksiyonlar. Hicbir sinif/unite-ozel veri veya id
   BURADA yoktur. Sayfaya ozel LS_PUAN_ANAHTARI ve UNITE_KIMLIK bu
   dosyadan ONCE, sayfanin kendi inline scriptinde tanimlanmalidir.
====================================================================== */

/* ---- tema (acik/koyu) degistirme ---- */
/* Tema (açık/koyu) — erken uygulama: yanıp sönmeyi (flash) önlemek için body render olmadan önce çalışır.
   Yeni localStorage anahtarı kullanılır; mevcut 'dkabPuanDurumu' vb. anahtarlara dokunulmaz. */
(function(){
  try{
    var kayitliTema = localStorage.getItem('dkabTemaTercihi');
    if(kayitliTema === 'dark' || kayitliTema === 'light'){
      document.documentElement.setAttribute('data-theme', kayitliTema);
    }
  }catch(e){}
})();
function temaDegistir(){
  var kok = document.documentElement;
  var suanKoyuMu = kok.getAttribute('data-theme') === 'dark'
    || (kok.getAttribute('data-theme') !== 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var yeniTema = suanKoyuMu ? 'light' : 'dark';
  kok.setAttribute('data-theme', yeniTema);
  try{ localStorage.setItem('dkabTemaTercihi', yeniTema); }catch(e){}
  temaButonEtiketiGuncelle();
}
function temaButonEtiketiGuncelle(){
  var btn = document.getElementById('temaDegistirBtn');
  if(!btn) return;
  var kok = document.documentElement;
  var koyuMu = kok.getAttribute('data-theme') === 'dark'
    || (kok.getAttribute('data-theme') !== 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  btn.textContent = koyuMu ? '☀️ Açık Tema' : '🌙 Koyu Tema';
}
document.addEventListener('DOMContentLoaded', temaButonEtiketiGuncelle);

/* ---- oyun secme/kategori/puan motoru ---- */
function goster(id, ev){
  document.querySelectorAll('section').forEach(s=>s.classList.remove('aktif'));
  document.getElementById(id).classList.add('aktif');
  document.querySelectorAll('.oyun-grubu button').forEach(b=>b.classList.remove('aktif'));
  if(ev && ev.target) ev.target.classList.add('aktif');
}
function kategoriGoster(id, ev){
  document.querySelectorAll('.oyun-grubu').forEach(g=>g.classList.remove('aktif'));
  document.getElementById(id).classList.add('aktif');
  document.querySelectorAll('.kategori-nav button').forEach(b=>b.classList.remove('kat-aktif'));
  if(ev && ev.target) ev.target.classList.add('kat-aktif');
}
function kategoriGosterVeKaydir(kategoriId){
  document.querySelectorAll('.oyun-grubu').forEach(g=>g.classList.remove('aktif'));
  document.getElementById(kategoriId).classList.add('aktif');
  document.querySelectorAll('.kategori-nav button').forEach(b=>{
    b.classList.toggle('kat-aktif', b.getAttribute('onclick').includes(kategoriId));
  });
  document.getElementById('oyun-gruplari').scrollIntoView({behavior:'smooth'});
}

function karistir(a){ return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]); }

let puanDurumu;
try{ puanDurumu = JSON.parse(localStorage.getItem(LS_PUAN_ANAHTARI)) || {}; }catch(e){ puanDurumu = {}; }
puanDurumu = Object.assign({toplamPuan:0, tamamlanan:0, rozetler:[], sonOyunTarihi:null, seri:0}, puanDurumu);

function puanKaydet(){ try{ localStorage.setItem(LS_PUAN_ANAHTARI, JSON.stringify(puanDurumu)); }catch(e){} }

function gunlukSeriGuncelle(){
  const bugun = new Date().toDateString();
  if(puanDurumu.sonOyunTarihi !== bugun){
    const dun = new Date(); dun.setDate(dun.getDate()-1);
    puanDurumu.seri = (puanDurumu.sonOyunTarihi === dun.toDateString()) ? puanDurumu.seri+1 : 1;
    puanDurumu.sonOyunTarihi = bugun;
  }
}

function istatistikleriGuncelleGoster(){
  const tp = document.getElementById('istToplamPuan');
  if(!tp) return;
  document.getElementById('istToplamPuan').textContent = puanDurumu.toplamPuan;
  document.getElementById('istTamamlanan').textContent = puanDurumu.tamamlanan;
  document.getElementById('istSeri').textContent = puanDurumu.seri;
  document.getElementById('istRozet').textContent = puanDurumu.rozetler.length;
}

function oyunTamamlandi(bolumId){
  puanDurumu.toplamPuan += 10;
  puanDurumu.tamamlanan++;
  gunlukSeriGuncelle();
  const esikler = [{sayi:1,ad:"🥉 İlk Adım"},{sayi:5,ad:"🥈 Azimli Öğrenci"},{sayi:10,ad:"🥇 Kelime Ustası"},{sayi:20,ad:"🏆 Efsane"}];
  esikler.forEach(e=>{
    if(puanDurumu.tamamlanan>=e.sayi && !puanDurumu.rozetler.includes(e.ad)) puanDurumu.rozetler.push(e.ad);
  });
  puanKaydet();
  istatistikleriGuncelleGoster();
  opOyunTamamlandiKaydet(bolumId, puanDurumu.toplamPuan, puanDurumu.rozetler);
}

function sonucIzlemeBaslat(){
  document.querySelectorAll('.sonuc-kutusu').forEach(el=>{
    const gozlemci = new MutationObserver(()=>{
      const metin = el.textContent;
      if((metin.includes('🎉') || metin.includes('🏆')) && el.dataset.sonOdul !== metin){
        el.dataset.sonOdul = metin;
        oyunTamamlandi(el.closest('section') ? el.closest('section').id : null);
      }
    });
    gozlemci.observe(el, {childList:true, characterData:true, subtree:true});
  });
}

function siraOlustur(cfg){
  const banka = document.getElementById(cfg.bankaId);
  const cevap = document.getElementById(cfg.cevapId);
  banka.innerHTML=''; cevap.innerHTML='';
  let beklenen = 0;
  const karisikSira = karistir(cfg.tokens.map((t,i)=>({t,i})));
  karisikSira.forEach(obj=>{
    const tas = document.createElement('div');
    tas.className='kelime-tas';
    tas.textContent = obj.t;
    tas.dataset.sira = obj.i;
    tas.onclick = ()=>{
      if(tas.classList.contains('kullanildi')) return;
      if(parseInt(tas.dataset.sira,10) === beklenen){
        tas.classList.add('kullanildi');
        tas.onclick = null;
        const kopya = document.createElement('div');
        kopya.className='kelime-tas';
        kopya.textContent = obj.t;
        cevap.appendChild(kopya);
        beklenen++;
        if(cfg.ilerleme) cfg.ilerleme(beklenen);
        if(beklenen === cfg.tokens.length && cfg.tamamlandi) cfg.tamamlandi();
      } else {
        tas.classList.add('yanlis');
        setTimeout(()=>tas.classList.remove('yanlis'), 300);
      }
    };
    banka.appendChild(tas);
  });
}

/* ---- ogrenme deneyimi katmani ---- */
/* ===================== OGRENME DENEYIMI KATMANI (JS) =====================
   Sadece EKLEME yapar: mevcut id/onclick/veri yapisina dokunmaz, hicbir
   fonksiyonu yeniden tanimlamaz. Amac: hero'ya hedef+ilerleme, konu ozetine
   "ogrenme yolu" (modul kartlari + ilerleme cubugu), sunum/test bolumlerine
   kisa tanitim kartlari eklemek. Tum yeni fonksiyon/degiskenler "ogr" onekiyle
   isimlendirildi ki mevcut kodla asla çakismasin. */
(function(){
  function ogrUniteKimlik(){ return (typeof UNITE_KIMLIK !== 'undefined') ? UNITE_KIMLIK : location.pathname; }
  function ogrEmojiTemizle(t){
    return (t||'')
      .replace(/^\s*\d+️?⃣\s*/,'') /* baştaki "1️⃣" gibi sayı+tuş takımı simgesi */
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2000}-\u{206F}️⃣]/gu,'')
      .trim();
  }
  function ogrSureTahmini(karakterSayisi){
    return Math.max(1, Math.round(karakterSayisi/700));
  }
  function ogrGorulenOku(anahtar){
    try{ return JSON.parse(localStorage.getItem(anahtar)) || []; }catch(e){ return []; }
  }
  function ogrGorulenYaz(anahtar, dizi){
    try{ localStorage.setItem(anahtar, JSON.stringify(dizi)); }catch(e){}
  }

  /* ---------- 1) KONU OZETI: ogrenme yolu + ilerleme ---------- */
  function ogrOzetGelistir(){
    const ozet = document.querySelector('main section[id^="ozet"]');
    if(!ozet || ozet.dataset.ogrHazir) return;

    const cocuklar = Array.from(ozet.children);
    const modulBaslar = [];
    cocuklar.forEach(function(c, i){
      if(c.classList && c.classList.contains('kutu-panel') && c.querySelector(':scope > h3')) modulBaslar.push(i);
    });
    if(modulBaslar.length < 2) return; /* tek modullu ünitede ekstra karmasaya gerek yok */
    ozet.dataset.ogrHazir = '1';

    const moduller = modulBaslar.map(function(baslangic, idx){
      const bitis = idx+1 < modulBaslar.length ? modulBaslar[idx+1] : cocuklar.length;
      const nodes = cocuklar.slice(baslangic, bitis);
      const h3 = nodes[0].querySelector(':scope > h3');
      const baslikMetni = ogrEmojiTemizle(h3 ? h3.textContent : ('Bölüm ' + (idx+1)));
      const karakterSayisi = nodes.reduce(function(t,n){ return t + (n.textContent||'').length; }, 0);
      return { nodes:nodes, baslik:baslikMetni, sure: ogrSureTahmini(karakterSayisi) };
    });
    const toplamSure = moduller.reduce(function(t,m){ return t+m.sure; }, 0);

    const gorulenAnahtar = 'dkabOzetGorulen_' + ogrUniteKimlik();
    let gorulenler = ogrGorulenOku(gorulenAnahtar);

    /* Üst özet paneli */
    const ustPanel = document.createElement('div');
    ustPanel.className = 'ogr-ozet-ust';
    const yolLi = moduller.map(function(m,i){
      return '<a href="#ogrModul'+i+'" class="ogr-yol-adim" data-ogr-index="'+i+'">'+
        '<span class="ogr-yol-no">'+(i+1)+'</span><span class="ogr-yol-baslik">'+m.baslik+'</span></a>';
    }).join('');
    ustPanel.innerHTML =
      '<div class="ogr-ozet-ust-satir">'+
        '<p class="ogr-ozet-baslik">🗺️ Öğrenme Yolu</p>'+
        '<div class="ogr-ozet-meta">'+
          '<span>📚 '+moduller.length+' bölüm</span>'+
          '<span>⏱️ ~'+toplamSure+' dk okuma</span>'+
        '</div>'+
      '</div>'+
      '<ul class="ogr-yol-liste">'+yolLi+'</ul>'+
      '<div class="ogr-ilerleme-cubuk-dis"><div class="ogr-ilerleme-cubuk-ic" id="ogrIlerlemeCubuk"></div></div>';
    const ozetH2 = ozet.querySelector(':scope > h2');
    if(ozetH2 && ozetH2.nextSibling) ozet.insertBefore(ustPanel, ozetH2.nextSibling);
    else ozet.insertBefore(ustPanel, ozet.firstChild);

    ustPanel.querySelectorAll('.ogr-yol-adim').forEach(function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        const hedef = document.getElementById('ogrModul'+a.dataset.ogrIndex);
        if(hedef) hedef.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });

    /* Modülleri sar (mevcut node'lar tasinir, KOPYALANMAZ; id/onclick/veri korunur) */
    moduller.forEach(function(m, i){
      const sarmalayici = document.createElement('div');
      sarmalayici.className = 'ogr-modul';
      sarmalayici.id = 'ogrModul' + i;
      if(gorulenler.indexOf(i) !== -1) sarmalayici.classList.add('ogr-tamamlandi');
      const no = document.createElement('div'); no.className='ogr-modul-no'; no.textContent = String(i+1);
      const sure = document.createElement('div'); sure.className='ogr-modul-sure'; sure.textContent = '⏱️ ~'+m.sure+' dk';
      const govde = document.createElement('div'); govde.className='ogr-modul-govde';
      m.nodes.forEach(function(n){ govde.appendChild(n); }); /* appendChild = tasima, kopyalama degil */
      sarmalayici.appendChild(no);
      sarmalayici.appendChild(sure);
      sarmalayici.appendChild(govde);
      ozet.appendChild(sarmalayici);
    });

    function ogrIlerlemeGuncelle(){
      const oran = moduller.length ? gorulenler.length/moduller.length : 0;
      const cubuk = document.getElementById('ogrIlerlemeCubuk');
      if(cubuk) cubuk.style.width = Math.round(oran*100)+'%';
      ustPanel.querySelectorAll('.ogr-yol-adim').forEach(function(a){
        a.classList.toggle('ogr-gorulen', gorulenler.indexOf(+a.dataset.ogrIndex) !== -1);
      });
    }
    ogrIlerlemeGuncelle();

    if('IntersectionObserver' in window){
      const gozlemci = new IntersectionObserver(function(kayitlar){
        let degisti = false;
        kayitlar.forEach(function(kayit){
          if(kayit.isIntersecting){
            const idx = +kayit.target.id.replace('ogrModul','');
            if(gorulenler.indexOf(idx) === -1){
              gorulenler.push(idx);
              kayit.target.classList.add('ogr-tamamlandi');
              degisti = true;
            }
          }
        });
        if(degisti){ ogrGorulenYaz(gorulenAnahtar, gorulenler); ogrIlerlemeGuncelle(); }
      }, {threshold:0.55});
      moduller.forEach(function(m,i){ gozlemci.observe(document.getElementById('ogrModul'+i)); });
    }
  }

  /* ---------- 2) HERO: ogrenme hedefleri + ilerleme rozeti ---------- */
  function ogrHeroGelistir(){
    const hedefKonteyner = document.getElementById('ogrHedefKonteyner');
    if(!hedefKonteyner || hedefKonteyner.dataset.ogrHazir) return;
    hedefKonteyner.dataset.ogrHazir = '1';

    const basliklar = Array.from(document.querySelectorAll('main section[id^="ozet"] .kutu-panel > h3')).map(function(h){
      return ogrEmojiTemizle(h.textContent);
    });
    const ek = document.createElement('div');
    ek.className = 'ogr-hero-ek';
    let ic = '';
    if(basliklar.length){
      ic += '<div class="ogr-hedef-satir">' + basliklar.map(function(b,i){
        return '<span class="ogr-hedef-cip"><span class="ogr-hedef-no">'+(i+1)+'</span>'+b+'</span>';
      }).join('') + '</div>';
    }
    ic += '<span class="ogr-ilerleme-rozet"><svg class="ogr-ring" viewBox="0 0 32 32" aria-hidden="true">'+
      '<circle class="ogr-ring-arka" cx="16" cy="16" r="13"></circle>'+
      '<circle class="ogr-ring-on" id="ogrHeroRing" cx="16" cy="16" r="13" stroke-dasharray="81.68" stroke-dashoffset="81.68"></circle>'+
      '</svg><span id="ogrHeroRozetMetin">Bu üniteye yeni başlıyorsun</span></span>';
    ek.innerHTML = ic;
    hedefKonteyner.appendChild(ek);

    const toplamEtkinlik = document.querySelectorAll('.oyun-grubu button').length || 1;
    function ogrHeroIlerlemeGuncelle(){
      const tamamlananEl = document.getElementById('istTamamlanan');
      const tamamlanan = tamamlananEl ? (parseInt(tamamlananEl.textContent,10) || 0) : 0;
      const oran = Math.min(1, tamamlanan/toplamEtkinlik);
      const ring = document.getElementById('ogrHeroRing');
      if(ring) ring.setAttribute('stroke-dashoffset', String(81.68*(1-oran)));
      const metin = document.getElementById('ogrHeroRozetMetin');
      if(metin){
        metin.textContent = tamamlanan===0
          ? 'Bu üniteye yeni başlıyorsun'
          : (tamamlanan+'/'+toplamEtkinlik+' etkinlik tamamlandı (%'+Math.round(oran*100)+')');
      }
    }
    ogrHeroIlerlemeGuncelle();
    const istTamamlananEl = document.getElementById('istTamamlanan');
    if(istTamamlananEl && 'MutationObserver' in window){
      new MutationObserver(ogrHeroIlerlemeGuncelle).observe(istTamamlananEl, {childList:true, characterData:true, subtree:true});
    }
  }

  /* ---------- 3) SUNUM / TEST: kisa tanitim kartlari ---------- */
  function ogrGirisKartiEkle(sectionEl, ikon, baslik, metin){
    if(!sectionEl || sectionEl.dataset.ogrGirisHazir) return;
    sectionEl.dataset.ogrGirisHazir = '1';
    const h2 = sectionEl.querySelector(':scope > h2');
    if(!h2) return;
    const kart = document.createElement('div');
    kart.className = 'ogr-giris-karti';
    kart.innerHTML = '<div class="ogr-giris-ikon">'+ikon+'</div><div class="ogr-giris-metin"><b>'+baslik+'</b><span>'+metin+'</span></div>';
    h2.insertAdjacentElement('afterend', kart);
  }
  function ogrSunumTanitimEkle(){
    const slaytBolumu = document.getElementById('slayt');
    if(!slaytBolumu) return;
    const sayac = slaytBolumu.querySelector('#sunumSayac');
    const eslesme = sayac ? sayac.textContent.match(/\/\s*(\d+)/) : null;
    const toplamSlayt = eslesme ? eslesme[1] : '?';
    ogrGirisKartiEkle(slaytBolumu, '🖥️', 'Ünitenin tamamını 5-10 dakikada gözden geçir',
      toplamSlayt+' slaytlık kısa bir sunum — okuduğun konuları toparlamak için ideal.');
  }
  function ogrTestTanitimEkle(){
    const testBolumu = document.querySelector('main section[id^="konutekrari"]');
    if(!testBolumu) return;
    const h2Metin = testBolumu.querySelector(':scope > h2') ? testBolumu.querySelector(':scope > h2').textContent : '';
    const eslesme = h2Metin.match(/\((\d+)\s*Soru\)/i);
    const soruSayisi = eslesme ? eslesme[1] : '?';
    ogrGirisKartiEkle(testBolumu, '📝', 'Ne kadar hazır olduğunu ölç',
      soruSayisi+' soruluk karma bir test — her yanlışta açıklamasıyla birlikte anında geri bildirim alırsın.');
  }

  function ogrBaslat(){
    ogrOzetGelistir();
    ogrHeroGelistir();
    ogrSunumTanitimEkle();
    ogrTestTanitimEkle();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ogrBaslat);
  else ogrBaslat();
})();
/* ======================================================================
   OYUN MERKEZI KART SABLONU (paylasilan HTML uretici)
   Her sayfa sadece kendi OYUN_LISTESI dizisini tanimlar:
     const OYUN_LISTESI = [
       {id:'kelimeavi', kategori:'bulmaca', ikon:'🔎', baslik:'Kelime Avi', aciklama:'...'},
       ...
     ];
   Kategori adi/ikonu/alt-metni ve zorluk seviyesi burada MERKEZI olarak
   tanimlidir; hicbir sayfa bunlari tekrar yazmaz. suffix ise o sayfanin
   kategori/oyun id'lerine eklenen sonek (orn. "8", "62", "1").
====================================================================== */
const OM_KATEGORILER = [
  {anahtar:'bulmaca', ikon:'🧩', baslik:'Kelime Bulmacaları', alt:'Çengel, şifre, kodlama ve daha fazlası', zorluk:'Orta'},
  {anahtar:'yarisma', ikon:'🎮', baslik:'Yarışma Oyunları', alt:'Yarışma ve turnuva oyunları', zorluk:'Orta'},
  {anahtar:'mantik', ikon:'🕵️', baslik:'Mantık & Dedektiflik', alt:'Bulmacalar ve akıl yürütme etkinlikleri', zorluk:'Orta'},
  {anahtar:'macera', ikon:'🌀', baslik:'Macera', alt:'Labirent ve keşif oyunu', zorluk:'Kolay'},
  {anahtar:'ezber', ikon:'🕌', baslik:'Ezber Etkinlikleri', alt:'Sırala, eşleştir ve ezberle', zorluk:'Kolay'},
  {anahtar:'ikikisilik', ikon:'🤝', baslik:'İki Kişilik Oyunlar', alt:'Arkadaşınla aynı cihazdan sırayla oyna', zorluk:'Kolay'},
];

function omKartHtml(oyun, suffix, zorluk){
  const hedefId = oyun.id + suffix;
  return '        <div class="omg-oyun-kart" onclick="goster(\'' + hedefId + '\', event); var _t=document.getElementById(\'' + hedefId + '\'); if(_t) _t.scrollIntoView({behavior:\'smooth\', block:\'start\'});">\n' +
    '          <div class="omg-oyun-kart-ikon">' + oyun.ikon + '</div>\n' +
    '          <h4>' + oyun.baslik + '</h4>\n' +
    '          <p>' + oyun.aciklama + '</p>\n' +
    '          <div class="omg-oyun-kart-alt"><span class="omg-zorluk">' + zorluk + '</span><span class="omg-oyna-ok">Oyna →</span></div>\n' +
    '        </div>';
}

function omNavBtnHtml(kat, aktifMi, suffix){
  return '    <button class="omg-yan-oge' + (aktifMi ? ' kat-aktif' : '') + '" onclick="kategoriGoster(\'kat-' + kat.anahtar + suffix + '\', event)"><span class="gb-kart-ikon" aria-hidden="true">' + kat.ikon + '</span><span class="gb-kart-metin"><b>' + kat.baslik + '</b><small>' + kat.alt + '</small></span></button>';
}

function omSidebarHtml(currentKatAnahtari, suffix, anaSayfaHref){
  return '  <div class="omg-yan-menu">\n' +
    '    <button class="geri-btn" onclick="window.location.href=\'' + (anaSayfaHref || 'index.html') + '\'">◀ Ana Menüye Dön</button>\n' +
    '    <button class="omg-ses-btn" onclick="sesDegistir()">🔊 Ses Açık</button>\n' +
    '    <div class="omg-yan-baslik">🎮 Oyun Merkezi</div>\n' +
    OM_KATEGORILER.map(k => omNavBtnHtml(k, k.anahtar === currentKatAnahtari, suffix)).join('\n') + '\n' +
    '  </div>';
}

function oyunMerkeziOlustur(oyunListesi, suffix, anaSayfaHref){
  const konteyner = document.getElementById('oyun-gruplari');
  if(!konteyner) return;
  const gruplar = {};
  OM_KATEGORILER.forEach(k => gruplar[k.anahtar] = []);
  oyunListesi.forEach(o => { if(gruplar[o.kategori]) gruplar[o.kategori].push(o); });

  const html = OM_KATEGORILER.map((kat, i) => {
    const oyunlar = gruplar[kat.anahtar];
    const kartlar = oyunlar.map(o => omKartHtml(o, suffix, kat.zorluk)).join('\n');
    return '<div class="oyun-grubu omg-2kolon' + (i===0 ? ' aktif' : '') + '" id="kat-' + kat.anahtar + suffix + '">\n' +
      omSidebarHtml(kat.anahtar, suffix, anaSayfaHref) + '\n' +
      '  <div class="omg-kart-alan">\n    <div class="omg-kart-izgara">\n' + kartlar + '\n    </div>\n  </div>\n</div>';
  }).join('\n\n');

  konteyner.innerHTML = html;
  sesButonlariniGuncelle();
}

/* ======================================================================
   IKI KISILIK OYUN CERCEVESI (paylasilan)
   "Iki Kisilik Oyunlar" kategorisindeki tum oyunlar bu tek motoru kullanir.
   Her sayfa sadece kendi soru dizisini + bir baslatma cagrisini tanimlar:
     ikiliOyunBaslat({onek:'qb1', sorular:[{soru, secenekler:[...], dogru}], sureSN:15});
   Beklenen DOM id'leri (onek = ayar.onek):
     <onek>SoruNo, <onek>Toplam, <onek>Puan1, <onek>Puan2, <onek>Sure,
     <onek>ElDegistir, <onek>SiraKimde, <onek>SoruMetin, <onek>Secenekler,
     <onek>Sonuc, <onek>YenidenBaslat
   Istege bagli (varsa kullanilir, yoksa "1. Oyuncu"/"2. Oyuncu" varsayilanina
   duser): <onek>Isim1, <onek>Isim2 (isim giris input'lari).
====================================================================== */
const ikiliOyunDurumlari = {};
function ikiliOyunDurum(onek){ return (ikiliOyunDurumlari[onek] || (ikiliOyunDurumlari[onek] = {})); }
function ikiliMetinAyarla(id, deger){ const el = document.getElementById(id); if(el) el.textContent = deger; }
function ikiliHtmlAyarla(id, deger){ const el = document.getElementById(id); if(el) el.innerHTML = deger; }

/* ---- isim etiketi: <onek>Isim1/<onek>Isim2 input'u varsa onu, yoksa
   "1. Oyuncu"/"2. Oyuncu" varsayilanini kullanir (eski sayfalarda bu
   input'lar hic olmadigi icin gorunum birebir ayni kalir). ---- */
function ikiliOyuncuAdi(onek, no){
  const el = document.getElementById(onek+'Isim'+no);
  const deger = el && el.value && el.value.trim();
  return deger ? deger : (no + '. Oyuncu');
}
function ikiliOyuncuEtiket(onek, no){
  return (no===1 ? '🔵 ' : '🔴 ') + ikiliOyuncuAdi(onek, no);
}

/* ---- ses motoru (Web Audio ile sentezlenir, dis dosya gerekmez) ----
   Tum ikili-* oyunlarda (mevcut + yeni) dogru/yanlis/kazanan aninda calinir.
   Tercih 'dkabSesTercihi' anahtariyla kalici saklanir, varsayilan acik. ---- */
let sesAcikMi = true;
try{ const _sv = localStorage.getItem('dkabSesTercihi'); sesAcikMi = (_sv===null) ? true : _sv==='1'; }catch(e){}
let _sesCtx = null;
function sesBaglamAl(){
  if(!_sesCtx){ try{ _sesCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  return _sesCtx;
}
function sesCal(tur){
  if(!sesAcikMi) return;
  const ctx = sesBaglamAl();
  if(!ctx) return;
  if(ctx.state==='suspended'){ try{ ctx.resume(); }catch(e){} }
  const profil = {
    dogru:  [660, 990, 0.14],
    yanlis: [220, 150, 0.20],
    tik:    [440, 440, 0.05],
    kazanan:[523, 1046, 0.45]
  }[tur] || [440,440,0.08];
  try{
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    const simdi = ctx.currentTime;
    o.frequency.setValueAtTime(profil[0], simdi);
    o.frequency.linearRampToValueAtTime(profil[1], simdi+profil[2]);
    g.gain.setValueAtTime(0.16, simdi);
    g.gain.exponentialRampToValueAtTime(0.001, simdi+profil[2]);
    o.start(simdi); o.stop(simdi+profil[2]+0.02);
  }catch(e){}
}
function sesButonlariniGuncelle(){
  document.querySelectorAll('.omg-ses-btn').forEach(b=>{ b.textContent = sesAcikMi ? '🔊 Ses Açık' : '🔇 Ses Kapalı'; });
}
function sesDegistir(){
  sesAcikMi = !sesAcikMi;
  try{ localStorage.setItem('dkabSesTercihi', sesAcikMi ? '1' : '0'); }catch(e){}
  sesButonlariniGuncelle();
  if(sesAcikMi) sesCal('tik');
}
document.addEventListener('DOMContentLoaded', sesButonlariniGuncelle);

/* ---- kazanan animasyonu: sonuc kutusuna kisa sureli bir vurgu sinifi ekler ---- */
function ikiliKazananVurgula(onek){
  const el = document.getElementById(onek+'Sonuc');
  if(!el) return;
  el.classList.remove('omg-kazanan-vurgu');
  void el.offsetWidth;
  el.classList.add('omg-kazanan-vurgu');
}

/* ---- klavye destegi: aktif oyun bolumundeki secenek/eylem butonlarini
   1-9 tuslariyla, ipucu girdisini Enter ile tetikler. Diger sayfalardaki
   ozel klavye dinleyicileriyle (labirent, sunum vb.) cakismaz cunku
   sadece '.oyun-grubu ~ main section.aktif' icindeki .eylem butonlarina
   bakar. ---- */
document.addEventListener('keydown', function(e){
  const hedef = e.target;
  const hedefEtiket = hedef ? hedef.tagName : '';
  if(hedefEtiket === 'INPUT' || hedefEtiket === 'TEXTAREA'){
    if(e.key === 'Enter' && hedef.id && hedef.id.endsWith('Girdi')){
      const onek = hedef.id.slice(0, -('Girdi'.length));
      if(typeof ikiliIpucuGonder === 'function' && document.getElementById(onek+'Ipucu')){
        e.preventDefault();
        ikiliIpucuGonder(onek);
      }
    }
    return;
  }
  const aktifBolum = document.querySelector('main > section.aktif');
  if(!aktifBolum) return;
  if(e.key >= '1' && e.key <= '9'){
    const secenekKutusu = aktifBolum.querySelector('[id$="Secenekler"]');
    if(!secenekKutusu) return;
    const butonlar = secenekKutusu.querySelectorAll('button.eylem');
    const idx = parseInt(e.key,10) - 1;
    if(butonlar[idx]){ e.preventDefault(); butonlar[idx].click(); }
  }
});

function ikiliOyunBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  Object.assign(d, {ayar, index:0, puan1:0, puan2:0, sira:1, zamanlayici:null});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliMetinAyarla(ayar.onek+'Toplam', ayar.sorular.length);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliHtmlAyarla(ayar.onek+'SoruMetin', '');
  ikiliHtmlAyarla(ayar.onek+'Secenekler', '');
  ikiliElDegistirGoster(ayar.onek);
}

function ikiliZamanlayiciDurdur(onek){
  const d = ikiliOyunDurum(onek);
  if(d.zamanlayici){ clearInterval(d.zamanlayici); d.zamanlayici = null; }
}

function ikiliElDegistirGoster(onek){
  ikiliZamanlayiciDurdur(onek);
  const d = ikiliOyunDurum(onek);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  const oyuncu = ikiliOyuncuEtiket(onek, d.sira);
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + oyuncu + '\'ya ver!</p>' +
    '<button class="eylem" onclick="ikiliSoruGoster(\'' + onek + '\')">✅ Hazırım, Soruyu Göster</button>');
}

function ikiliSoruGoster(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  const soru = d.ayar.sorular[d.index];
  ikiliMetinAyarla(onek+'SoruNo', d.index+1);
  ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
  ikiliMetinAyarla(onek+'SoruMetin', '❓ ' + soru.soru);
  const kutu = document.getElementById(onek+'Secenekler');
  kutu.innerHTML = '';
  karistir(soru.secenekler.slice()).forEach(secenek => {
    const btn = document.createElement('button');
    btn.className = 'eylem';
    btn.textContent = secenek;
    btn.onclick = () => ikiliCevapVer(onek, secenek === soru.dogru);
    kutu.appendChild(btn);
  });
  if(d.ayar.sureSN) ikiliZamanlayiciBaslat(onek);
}

function ikiliZamanlayiciBaslat(onek, sureBittiCagrisi){
  const d = ikiliOyunDurum(onek);
  let kalan = d.ayar.sureSN;
  ikiliMetinAyarla(onek+'Sure', kalan);
  d.zamanlayici = setInterval(() => {
    kalan--;
    ikiliMetinAyarla(onek+'Sure', kalan);
    if(kalan <= 0) (sureBittiCagrisi || ikiliCevapVer)(onek, false);
  }, 1000);
}

function ikiliCevapVer(onek, dogruMu){
  const d = ikiliOyunDurum(onek);
  ikiliZamanlayiciDurdur(onek);
  const suankiSoru = d.ayar.sorular[d.index];
  const kazanc = (dogruMu && suankiSoru && suankiSoru.bonus) ? 2 : 1;
  sesCal(dogruMu ? 'dogru' : 'yanlis');
  if(dogruMu){
    if(d.sira===1){ d.puan1+=kazanc; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
    else { d.puan2+=kazanc; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
  }
  d.sira = d.sira===1 ? 2 : 1;
  d.index++;
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'SoruMetin', '');
  ikiliHtmlAyarla(onek+'Secenekler', '');
  setTimeout(() => {
    if(d.index >= d.ayar.sorular.length) ikiliBitir(onek);
    else ikiliElDegistirGoster(onek);
  }, 400);
}

function ikiliBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.puan1 > d.puan2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.puan1} - ${d.puan2})`;
  else if(d.puan2 > d.puan1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.puan2} - ${d.puan1})`;
  else sonuc = `🤝 Berabere! (${d.puan1} - ${d.puan2})`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliOyunBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ======================================================================
   IKI KISILIK OYUN CERCEVESI - EK MOTORLAR (hafiza, sirala, ipucu, hayatta)
   Ayni "onek/ayar" deseni + ayni CSS siniflari (.hafiza-kart, .kelime-tas,
   .eylem, .sonuc-kutusu) kullanilir. Yeni bir tasarim sistemi YOKTUR.
====================================================================== */

/* ---- B) HAFIZA ESLESTIRME DUELLOSU ----
   ikiliHafizaBaslat({onek, ciftler:[{metin1,metin2}, ...]})
   DOM: <onek>Puan1, <onek>Puan2, <onek>SiraKimde, <onek>Izgara, <onek>Sonuc, <onek>YenidenBaslat */
function ikiliHafizaBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  const kartlar = [];
  ayar.ciftler.forEach((c,i)=>{ kartlar.push({ciftId:i, metin:c.metin1}); kartlar.push({ciftId:i, metin:c.metin2}); });
  Object.assign(d, {ayar, kartlar:karistir(kartlar), acikIndeksler:[], bulunanCiftler:0, puan1:0, puan2:0, sira:1, kilit:false});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliMetinAyarla(ayar.onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(ayar.onek, d.sira));
  ikiliHafizaCiz(ayar.onek);
}
function ikiliHafizaCiz(onek){
  const d = ikiliOyunDurum(onek);
  const izgara = document.getElementById(onek+'Izgara');
  if(!izgara) return;
  izgara.innerHTML = '';
  d.kartlar.forEach((k, idx)=>{
    const kart = document.createElement('div');
    kart.className = 'hafiza-kart' + ((d.acikIndeksler.includes(idx) || k.bulundu) ? ' acik' : '') + (k.bulundu ? ' bulundu' : '');
    const on = document.createElement('div'); on.className='hafiza-on'; on.textContent='❔';
    const arka = document.createElement('div'); arka.className='hafiza-arka'; arka.textContent=k.metin;
    kart.appendChild(on); kart.appendChild(arka);
    if(!k.bulundu) kart.onclick = ()=> ikiliHafizaKartAc(onek, idx);
    izgara.appendChild(kart);
  });
}
function ikiliHafizaKartAc(onek, idx){
  const d = ikiliOyunDurum(onek);
  if(d.kilit || d.acikIndeksler.includes(idx) || d.kartlar[idx].bulundu) return;
  d.acikIndeksler.push(idx);
  ikiliHafizaCiz(onek);
  if(d.acikIndeksler.length === 2){
    d.kilit = true;
    const [i1,i2] = d.acikIndeksler;
    const eslesti = d.kartlar[i1].ciftId === d.kartlar[i2].ciftId;
    setTimeout(()=>{
      sesCal(eslesti ? 'dogru' : 'yanlis');
      if(eslesti){
        d.kartlar[i1].bulundu = true; d.kartlar[i2].bulundu = true;
        d.bulunanCiftler++;
        if(d.sira===1){ d.puan1++; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
        else { d.puan2++; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
      } else {
        d.sira = d.sira===1 ? 2 : 1;
      }
      d.acikIndeksler = [];
      d.kilit = false;
      ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
      ikiliHafizaCiz(onek);
      if(d.bulunanCiftler === d.ayar.ciftler.length) ikiliHafizaBitir(onek);
    }, 700);
  }
}
function ikiliHafizaBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.puan1>d.puan2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.puan1} - ${d.puan2})`;
  else if(d.puan2>d.puan1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.puan2} - ${d.puan1})`;
  else sonuc = `🤝 Berabere! (${d.puan1} - ${d.puan2})`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliHafizaBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ---- C) KRONOLOJI / SIRALAMA DUELLOSU ----
   ikiliSiralaBaslat({onek, turlar:[{baslik, ogeler:[dogru sirada...]}]})
   DOM: <onek>Puan1, <onek>Puan2, <onek>TurNo, <onek>TurToplam, <onek>SiraKimde,
        <onek>ElDegistir, <onek>Baslik, <onek>Banka, <onek>Cevap, <onek>Sonuc, <onek>YenidenBaslat */
function ikiliSiralaBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  Object.assign(d, {ayar, turIndex:0, puan1:0, puan2:0, sira:1});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliMetinAyarla(ayar.onek+'TurToplam', ayar.turlar.length);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliSiralaElDegistir(ayar.onek);
}
function ikiliSiralaElDegistir(onek){
  const d = ikiliOyunDurum(onek);
  const oyuncu = ikiliOyuncuEtiket(onek, d.sira);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'Baslik', '');
  const banka=document.getElementById(onek+'Banka'); if(banka) banka.innerHTML='';
  const cevap=document.getElementById(onek+'Cevap'); if(cevap) cevap.innerHTML='';
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + oyuncu + '\'ya ver!</p>' +
    '<button class="eylem" onclick="ikiliSiralaTurGoster(\'' + onek + '\')">✅ Hazırım, Turu Göster</button>');
}
function ikiliSiralaTurGoster(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  const tur = d.ayar.turlar[d.turIndex];
  ikiliMetinAyarla(onek+'TurNo', d.turIndex+1);
  ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
  ikiliMetinAyarla(onek+'Baslik', '📌 ' + tur.baslik);
  const banka = document.getElementById(onek+'Banka');
  const cevap = document.getElementById(onek+'Cevap');
  banka.innerHTML=''; cevap.innerHTML='';
  let beklenen = 0;
  let doguOlmadi = true;
  const karisikSira = karistir(tur.ogeler.map((t,i)=>({t,i})));
  karisikSira.forEach(obj=>{
    const tas = document.createElement('div');
    tas.className='kelime-tas';
    tas.textContent=obj.t;
    tas.onclick = ()=>{
      if(tas.classList.contains('kullanildi')) return;
      if(obj.i === beklenen){
        sesCal('dogru');
        tas.classList.add('kullanildi'); tas.onclick=null;
        const kopya=document.createElement('div'); kopya.className='kelime-tas'; kopya.textContent=obj.t;
        cevap.appendChild(kopya);
        beklenen++;
        if(beklenen === tur.ogeler.length){
          if(doguOlmadi){
            if(d.sira===1){ d.puan1++; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
            else { d.puan2++; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
          }
          d.sira = d.sira===1 ? 2 : 1;
          d.turIndex++;
          setTimeout(()=> d.turIndex>=d.ayar.turlar.length ? ikiliSiralaBitir(onek) : ikiliSiralaElDegistir(onek), 700);
        }
      } else {
        sesCal('yanlis');
        doguOlmadi = false;
        tas.classList.add('yanlis');
        setTimeout(()=>tas.classList.remove('yanlis'), 300);
      }
    };
    banka.appendChild(tas);
  });
}
function ikiliSiralaBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.puan1>d.puan2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.puan1} - ${d.puan2})`;
  else if(d.puan2>d.puan1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.puan2} - ${d.puan1})`;
  else sonuc = `🤝 Berabere! (${d.puan1} - ${d.puan2})`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliSiralaBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ---- D) IPUCU-TAHMIN DUELLOSU (Code Breaker / Puzzle Duel icin) ----
   ikiliIpucuBaslat({onek, sorular:[{cevap, ipuclari:[ipucu1, ipucu2, ...]}]})
   DOM: <onek>Puan1, <onek>Puan2, <onek>SiraKimde, <onek>SoruNo, <onek>Toplam,
        <onek>ElDegistir, <onek>Ipucu, <onek>Girdi, <onek>Sonuc, <onek>YenidenBaslat */
function ikiliIpucuBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  Object.assign(d, {ayar, index:0, puan1:0, puan2:0, sira:1, ipucuNo:0});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliMetinAyarla(ayar.onek+'Toplam', ayar.sorular.length);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliIpucuElDegistir(ayar.onek);
}
function ikiliIpucuElDegistir(onek){
  const d = ikiliOyunDurum(onek);
  const oyuncu = ikiliOyuncuEtiket(onek, d.sira);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'Ipucu', '');
  const girdi=document.getElementById(onek+'Girdi'); if(girdi) girdi.value='';
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + oyuncu + '\'ya ver!</p>' +
    '<button class="eylem" onclick="ikiliIpucuSoruGoster(\'' + onek + '\')">✅ Hazırım, Soruyu Göster</button>');
}
function ikiliIpucuSoruGoster(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  d.ipucuNo = 1;
  const soru = d.ayar.sorular[d.index];
  ikiliMetinAyarla(onek+'SoruNo', d.index+1);
  ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
  ikiliMetinAyarla(onek+'Ipucu', '💡 İpucu 1: ' + soru.ipuclari[0]);
  const girdi=document.getElementById(onek+'Girdi'); if(girdi) girdi.value='';
}
function ikiliIpucuYeni(onek){
  const d = ikiliOyunDurum(onek);
  const soru = d.ayar.sorular[d.index];
  if(!soru || d.ipucuNo >= soru.ipuclari.length) return;
  d.ipucuNo++;
  ikiliMetinAyarla(onek+'Ipucu', '💡 İpucu ' + d.ipucuNo + ': ' + soru.ipuclari[d.ipucuNo-1]);
}
function ikiliIpucuGonder(onek){
  const d = ikiliOyunDurum(onek);
  const soru = d.ayar.sorular[d.index];
  const girdi = document.getElementById(onek+'Girdi');
  const tahmin = (girdi ? girdi.value : '').trim().toLocaleUpperCase('tr-TR');
  const dogruMu = tahmin.length>0 && tahmin === soru.cevap.toLocaleUpperCase('tr-TR');
  sesCal(dogruMu ? 'dogru' : 'yanlis');
  if(dogruMu){
    const puan = Math.max(1, soru.ipuclari.length - d.ipucuNo + 1);
    if(d.sira===1){ d.puan1+=puan; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
    else { d.puan2+=puan; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
    ikiliMetinAyarla(onek+'Ipucu', '✅ Doğru! Cevap: ' + soru.cevap + ' (+' + puan + ' puan)');
  } else {
    ikiliMetinAyarla(onek+'Ipucu', '❌ Yanlış. Doğru cevap: ' + soru.cevap);
  }
  d.sira = d.sira===1 ? 2 : 1;
  d.index++;
  setTimeout(()=> d.index>=d.ayar.sorular.length ? ikiliIpucuBitir(onek) : ikiliIpucuElDegistir(onek), 1300);
}
function ikiliIpucuBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.puan1>d.puan2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.puan1} - ${d.puan2})`;
  else if(d.puan2>d.puan1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.puan2} - ${d.puan1})`;
  else sonuc = `🤝 Berabere! (${d.puan1} - ${d.puan2})`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliIpucuBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ---- F) HAYATTA KALMA DUELLOSU (can bazli) ----
   ikiliHayattaBaslat({onek, sorular:[{soru, secenekler:[...], dogru}], can:3})
   DOM: <onek>Can1, <onek>Can2, <onek>SiraKimde, <onek>ElDegistir, <onek>SoruNo,
        <onek>SoruMetin, <onek>Secenekler, <onek>Sonuc, <onek>YenidenBaslat */
function ikiliHayattaBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  const canBas = ayar.can || 3;
  Object.assign(d, {ayar, index:0, can1:canBas, can2:canBas, sira:1});
  ikiliMetinAyarla(ayar.onek+'Can1', '❤️'.repeat(canBas));
  ikiliMetinAyarla(ayar.onek+'Can2', '❤️'.repeat(canBas));
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliHayattaElDegistir(ayar.onek);
}
function ikiliHayattaElDegistir(onek){
  const d = ikiliOyunDurum(onek);
  const oyuncu = ikiliOyuncuEtiket(onek, d.sira);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'SoruMetin', '');
  ikiliHtmlAyarla(onek+'Secenekler', '');
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + oyuncu + '\'ya ver!</p>' +
    '<button class="eylem" onclick="ikiliHayattaSoruGoster(\'' + onek + '\')">✅ Hazırım, Soruyu Göster</button>');
}
function ikiliHayattaSoruGoster(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  const soru = d.ayar.sorular[d.index % d.ayar.sorular.length];
  ikiliMetinAyarla(onek+'SoruNo', d.index+1);
  ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
  ikiliMetinAyarla(onek+'SoruMetin', '❓ ' + soru.soru);
  const kutu = document.getElementById(onek+'Secenekler');
  kutu.innerHTML = '';
  karistir(soru.secenekler.slice()).forEach(secenek=>{
    const btn = document.createElement('button');
    btn.className='eylem';
    btn.textContent=secenek;
    btn.onclick = ()=> ikiliHayattaCevapVer(onek, secenek===soru.dogru);
    kutu.appendChild(btn);
  });
}
function ikiliHayattaCevapVer(onek, dogruMu){
  const d = ikiliOyunDurum(onek);
  sesCal(dogruMu ? 'dogru' : 'yanlis');
  if(!dogruMu){
    const canBas = d.ayar.can || 3;
    if(d.sira===1){ d.can1--; ikiliMetinAyarla(onek+'Can1', '❤️'.repeat(Math.max(0,d.can1)) + '🖤'.repeat(canBas-Math.max(0,d.can1))); }
    else { d.can2--; ikiliMetinAyarla(onek+'Can2', '❤️'.repeat(Math.max(0,d.can2)) + '🖤'.repeat(canBas-Math.max(0,d.can2))); }
  }
  d.sira = d.sira===1 ? 2 : 1;
  d.index++;
  ikiliHtmlAyarla(onek+'SoruMetin', '');
  ikiliHtmlAyarla(onek+'Secenekler', '');
  setTimeout(()=>{
    if(d.can1<=0 || d.can2<=0) ikiliHayattaBitir(onek);
    else ikiliHayattaElDegistir(onek);
  }, 500);
}
function ikiliHayattaBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.can1<=0 && d.can2<=0) sonuc = '🤝 İkisi de elendi, berabere!';
  else if(d.can1<=0) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}!`;
  else sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}!`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliHayattaBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ======================================================================
   IKI KISILIK OYUN CERCEVESI - 20 YENI OYUN ICIN EK MOTORLAR (G-M)
   Ayni "onek/ayar" deseni + ayni CSS siniflari kullanilir. Her motor
   birden fazla oyun tarafindan (farkli soru/icerikle) paylasilabilir.
====================================================================== */

/* ---- G) BUZZER YARISI (ilk basan cevaplar) ----
   ikiliBuzzerBaslat({onek, sorular:[{soru, secenekler:[...], dogru}], sureSN})
   DOM: <onek>SoruNo, <onek>Toplam, <onek>Puan1, <onek>Puan2, <onek>Sure,
        <onek>SoruMetin, <onek>BuzzerAlan, <onek>Secenekler, <onek>Sonuc, <onek>YenidenBaslat */
function ikiliBuzzerBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  Object.assign(d, {ayar, index:0, puan1:0, puan2:0, kilitli:false, buzzanOyuncu:null, zamanlayici:null});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliMetinAyarla(ayar.onek+'Toplam', ayar.sorular.length);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliBuzzerSoruGoster(ayar.onek);
}
function ikiliBuzzerSoruGoster(onek){
  const d = ikiliOyunDurum(onek);
  d.kilitli = false;
  d.buzzanOyuncu = null;
  const soru = d.ayar.sorular[d.index];
  ikiliMetinAyarla(onek+'SoruNo', d.index+1);
  ikiliMetinAyarla(onek+'SoruMetin', '❓ ' + soru.soru);
  ikiliHtmlAyarla(onek+'Secenekler', '');
  ikiliHtmlAyarla(onek+'BuzzerAlan',
    '<div class="omg-buzzer-satir">' +
    '<button class="omg-buzzer-btn omg-buzzer-1" onclick="ikiliBuzzerBas(\'' + onek + '\',1)">🔵 ' + ikiliOyuncuAdi(onek,1) + '<br><span>BASTIM!</span></button>' +
    '<button class="omg-buzzer-btn omg-buzzer-2" onclick="ikiliBuzzerBas(\'' + onek + '\',2)">🔴 ' + ikiliOyuncuAdi(onek,2) + '<br><span>BASTIM!</span></button>' +
    '</div>');
}
function ikiliBuzzerBas(onek, no){
  const d = ikiliOyunDurum(onek);
  if(d.kilitli) return;
  d.kilitli = true;
  d.buzzanOyuncu = no;
  sesCal('tik');
  ikiliHtmlAyarla(onek+'BuzzerAlan', '<p style="font-weight:bold;text-align:center;">' + ikiliOyuncuEtiket(onek,no) + ' bastı! Şimdi cevapla:</p>');
  const soru = d.ayar.sorular[d.index];
  const kutu = document.getElementById(onek+'Secenekler');
  kutu.innerHTML = '';
  karistir(soru.secenekler.slice()).forEach(secenek=>{
    const btn = document.createElement('button');
    btn.className = 'eylem';
    btn.textContent = secenek;
    btn.onclick = ()=> ikiliBuzzerCevapVer(onek, secenek===soru.dogru);
    kutu.appendChild(btn);
  });
  if(d.ayar.sureSN) ikiliZamanlayiciBaslat(onek, ikiliBuzzerCevapVer);
}
function ikiliBuzzerCevapVer(onek, dogruMu){
  const d = ikiliOyunDurum(onek);
  ikiliZamanlayiciDurdur(onek);
  sesCal(dogruMu ? 'dogru' : 'yanlis');
  const no = d.buzzanOyuncu || 1;
  if(dogruMu){
    if(no===1){ d.puan1++; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
    else { d.puan2++; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
  }
  ikiliHtmlAyarla(onek+'Secenekler', '');
  ikiliHtmlAyarla(onek+'BuzzerAlan', '');
  d.index++;
  setTimeout(()=> d.index>=d.ayar.sorular.length ? ikiliBuzzerBitir(onek) : ikiliBuzzerSoruGoster(onek), 500);
}
function ikiliBuzzerBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.puan1>d.puan2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.puan1} - ${d.puan2})`;
  else if(d.puan2>d.puan1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.puan2} - ${d.puan1})`;
  else sonuc = `🤝 Berabere! (${d.puan1} - ${d.puan2})`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliBuzzerBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ---- H) PUAN CALMA DUELLOSU (yanlis cevap rakibe puan kazandirir) ----
   ikiliCalmaBaslat({onek, sorular:[{soru, secenekler:[...], dogru}], sureSN})
   DOM: aynen ikiliOyunBaslat ile ayni ( <onek>SoruNo, Toplam, Puan1, Puan2, Sure,
        ElDegistir, SiraKimde, SoruMetin, Secenekler, Sonuc, YenidenBaslat ) */
function ikiliCalmaBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  Object.assign(d, {ayar, index:0, puan1:0, puan2:0, sira:1, zamanlayici:null});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliMetinAyarla(ayar.onek+'Toplam', ayar.sorular.length);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliCalmaElDegistir(ayar.onek);
}
function ikiliCalmaElDegistir(onek){
  ikiliZamanlayiciDurdur(onek);
  const d = ikiliOyunDurum(onek);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + ikiliOyuncuEtiket(onek, d.sira) + '\'ya ver!</p>' +
    '<button class="eylem" onclick="ikiliCalmaSoruGoster(\'' + onek + '\')">✅ Hazırım, Soruyu Göster</button>');
}
function ikiliCalmaSoruGoster(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  const soru = d.ayar.sorular[d.index];
  ikiliMetinAyarla(onek+'SoruNo', d.index+1);
  ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
  ikiliMetinAyarla(onek+'SoruMetin', '❓ ' + soru.soru);
  const kutu = document.getElementById(onek+'Secenekler');
  kutu.innerHTML = '';
  karistir(soru.secenekler.slice()).forEach(secenek=>{
    const btn = document.createElement('button');
    btn.className = 'eylem';
    btn.textContent = secenek;
    btn.onclick = ()=> ikiliCalmaCevapVer(onek, secenek===soru.dogru);
    kutu.appendChild(btn);
  });
  if(d.ayar.sureSN) ikiliZamanlayiciBaslat(onek, ikiliCalmaCevapVer);
}
function ikiliCalmaCevapVer(onek, dogruMu){
  const d = ikiliOyunDurum(onek);
  ikiliZamanlayiciDurdur(onek);
  sesCal(dogruMu ? 'dogru' : 'yanlis');
  if(dogruMu){
    if(d.sira===1){ d.puan1++; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
    else { d.puan2++; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
  } else {
    if(d.sira===1){ d.puan2++; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
    else { d.puan1++; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
  }
  d.sira = d.sira===1 ? 2 : 1;
  d.index++;
  ikiliHtmlAyarla(onek+'SoruMetin', '');
  ikiliHtmlAyarla(onek+'Secenekler', '');
  setTimeout(()=> d.index>=d.ayar.sorular.length ? ikiliCalmaBitir(onek) : ikiliCalmaElDegistir(onek), 500);
}
function ikiliCalmaBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.puan1>d.puan2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.puan1} - ${d.puan2})`;
  else if(d.puan2>d.puan1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.puan2} - ${d.puan1})`;
  else sonuc = `🤝 Berabere! (${d.puan1} - ${d.puan2})`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliCalmaBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ---- I) BILGI CARKI (cark cevrilir, kategori+soru rastgele gelir) ----
   ikiliCarkBaslat({onek, kategoriler:[{ad, ikon, sorular:[{soru,secenekler,dogru}]}], turSayisi, sureSN})
   DOM: <onek>SoruNo, <onek>Toplam, <onek>Puan1, <onek>Puan2, <onek>Sure,
        <onek>ElDegistir, <onek>SiraKimde, <onek>SoruMetin, <onek>Secenekler, <onek>Sonuc, <onek>YenidenBaslat */
function ikiliCarkBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  const toplamTur = ayar.turSayisi || 8;
  Object.assign(d, {ayar, tur:0, toplamTur, puan1:0, puan2:0, sira:1, zamanlayici:null});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliMetinAyarla(ayar.onek+'Toplam', toplamTur);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliCarkElDegistir(ayar.onek);
}
function ikiliCarkElDegistir(onek){
  ikiliZamanlayiciDurdur(onek);
  const d = ikiliOyunDurum(onek);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'SoruMetin', '');
  ikiliHtmlAyarla(onek+'Secenekler', '');
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + ikiliOyuncuEtiket(onek, d.sira) + '\'ya ver!</p>' +
    '<button class="eylem" onclick="ikiliCarkCevir(\'' + onek + '\')">🎡 Çarkı Çevir</button>');
}
function ikiliCarkCevir(onek){
  ikiliHtmlAyarla(onek+'ElDegistir', '<div class="omg-cark-donuyor">🎡 Çark dönüyor...</div>');
  sesCal('tik');
  setTimeout(()=> ikiliCarkSoruGoster(onek), 900);
}
function ikiliCarkSoruGoster(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  const kategori = d.ayar.kategoriler[Math.floor(Math.random()*d.ayar.kategoriler.length)];
  const soru = kategori.sorular[Math.floor(Math.random()*kategori.sorular.length)];
  ikiliMetinAyarla(onek+'SoruNo', d.tur+1);
  ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
  ikiliHtmlAyarla(onek+'SoruMetin', '<span class="omg-cark-kategori">' + kategori.ikon + ' ' + kategori.ad + '</span><br>❓ ' + soru.soru);
  const kutu = document.getElementById(onek+'Secenekler');
  kutu.innerHTML = '';
  karistir(soru.secenekler.slice()).forEach(secenek=>{
    const btn = document.createElement('button');
    btn.className = 'eylem';
    btn.textContent = secenek;
    btn.onclick = ()=> ikiliCarkCevapVer(onek, secenek===soru.dogru);
    kutu.appendChild(btn);
  });
  if(d.ayar.sureSN) ikiliZamanlayiciBaslat(onek, ikiliCarkCevapVer);
}
function ikiliCarkCevapVer(onek, dogruMu){
  const d = ikiliOyunDurum(onek);
  ikiliZamanlayiciDurdur(onek);
  sesCal(dogruMu ? 'dogru' : 'yanlis');
  if(dogruMu){
    if(d.sira===1){ d.puan1++; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
    else { d.puan2++; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
  }
  d.sira = d.sira===1 ? 2 : 1;
  d.tur++;
  ikiliHtmlAyarla(onek+'SoruMetin', '');
  ikiliHtmlAyarla(onek+'Secenekler', '');
  setTimeout(()=> d.tur>=d.toplamTur ? ikiliCarkBitir(onek) : ikiliCarkElDegistir(onek), 500);
}
function ikiliCarkBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.puan1>d.puan2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.puan1} - ${d.puan2})`;
  else if(d.puan2>d.puan1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.puan2} - ${d.puan1})`;
  else sonuc = `🤝 Berabere! (${d.puan1} - ${d.puan2})`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliCarkBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ---- J) TAHTA ILERLEME DUELLOSU (merdiven/labirent/satranç ortak motoru) ----
   ikiliTahtaBaslat({onek, sorular:[{soru,secenekler,dogru}], uzunluk:8, tema:'merdiven'|'labirent'|'satranc', sureSN})
   DOM: <onek>SoruNo, <onek>Toplam, <onek>Puan1, <onek>Puan2, <onek>Sure, <onek>Parkur,
        <onek>ElDegistir, <onek>SiraKimde, <onek>SoruMetin, <onek>Secenekler, <onek>Sonuc, <onek>YenidenBaslat */
function ikiliTahtaBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  Object.assign(d, {ayar, index:0, pos1:0, pos2:0, sira:1, zamanlayici:null});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliMetinAyarla(ayar.onek+'Toplam', ayar.sorular.length);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliTahtaCiz(ayar.onek);
  ikiliTahtaElDegistir(ayar.onek);
}
function ikiliTahtaCiz(onek){
  const d = ikiliOyunDurum(onek);
  const kutu = document.getElementById(onek+'Parkur');
  if(!kutu) return;
  const uzunluk = d.ayar.uzunluk || 8;
  const ikon = {merdiven:'🪜', labirent:'🌀', satranc:'♟️'}[d.ayar.tema] || '🔸';
  let html = '<div class="omg-tahta-parkur">';
  for(let i=0;i<=uzunluk;i++){
    html += '<div class="omg-tahta-hucre' + (i===uzunluk?' omg-tahta-hedef':'') + '">' +
      (i===uzunluk?'🏁':ikon) +
      (d.pos1===i?'<span class="omg-tahta-token omg-tahta-token1">🔵</span>':'') +
      (d.pos2===i?'<span class="omg-tahta-token omg-tahta-token2">🔴</span>':'') +
      '</div>';
  }
  html += '</div>';
  kutu.innerHTML = html;
}
function ikiliTahtaElDegistir(onek){
  ikiliZamanlayiciDurdur(onek);
  const d = ikiliOyunDurum(onek);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + ikiliOyuncuEtiket(onek, d.sira) + '\'ya ver!</p>' +
    '<button class="eylem" onclick="ikiliTahtaSoruGoster(\'' + onek + '\')">✅ Hazırım, Soruyu Göster</button>');
}
function ikiliTahtaSoruGoster(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  const soru = d.ayar.sorular[d.index % d.ayar.sorular.length];
  ikiliMetinAyarla(onek+'SoruNo', d.index+1);
  ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
  ikiliMetinAyarla(onek+'SoruMetin', '❓ ' + soru.soru);
  const kutu = document.getElementById(onek+'Secenekler');
  kutu.innerHTML = '';
  karistir(soru.secenekler.slice()).forEach(secenek=>{
    const btn = document.createElement('button');
    btn.className = 'eylem';
    btn.textContent = secenek;
    btn.onclick = ()=> ikiliTahtaCevapVer(onek, secenek===soru.dogru);
    kutu.appendChild(btn);
  });
  if(d.ayar.sureSN) ikiliZamanlayiciBaslat(onek, ikiliTahtaCevapVer);
}
function ikiliTahtaCevapVer(onek, dogruMu){
  const d = ikiliOyunDurum(onek);
  ikiliZamanlayiciDurdur(onek);
  sesCal(dogruMu ? 'dogru' : 'yanlis');
  const uzunluk = d.ayar.uzunluk || 8;
  if(dogruMu){
    if(d.sira===1) d.pos1 = Math.min(uzunluk, d.pos1+1);
    else d.pos2 = Math.min(uzunluk, d.pos2+1);
  }
  ikiliMetinAyarla(onek+'Puan1', d.pos1);
  ikiliMetinAyarla(onek+'Puan2', d.pos2);
  ikiliTahtaCiz(onek);
  d.sira = d.sira===1 ? 2 : 1;
  d.index++;
  ikiliHtmlAyarla(onek+'SoruMetin', '');
  ikiliHtmlAyarla(onek+'Secenekler', '');
  setTimeout(()=>{
    if(d.pos1>=uzunluk || d.pos2>=uzunluk || d.index>=d.ayar.sorular.length) ikiliTahtaBitir(onek);
    else ikiliTahtaElDegistir(onek);
  }, 500);
}
function ikiliTahtaBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.pos1>d.pos2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.pos1} - ${d.pos2} adım)`;
  else if(d.pos2>d.pos1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.pos2} - ${d.pos1} adım)`;
  else sonuc = `🤝 Berabere! (${d.pos1} - ${d.pos2} adım)`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliTahtaBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ---- K) ANLAT DUELLOSU (Tabu / Sessiz Anlat ortak motoru) ----
   ikiliAnlatBaslat({onek, kartlar:[{kelime, yasakli:[...] (bos=Sessiz Anlat)}], sureSN:60})
   DOM: <onek>Puan1, <onek>Puan2, <onek>Sure, <onek>SiraKimde, <onek>ElDegistir,
        <onek>Kelime, <onek>Yasakli, <onek>Sonuc, <onek>YenidenBaslat.
   Sayfada ayrica sabit iki buton bulunur:
     onclick="ikiliAnlatSonucVer('onek', true)"  -> ✅ Doğru Bildi
     onclick="ikiliAnlatSonucVer('onek', false)" -> ⏭️ Pas */
function ikiliAnlatBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  Object.assign(d, {ayar, kartSirasi: karistir(ayar.kartlar.map((k,i)=>i)), kartIndex:0, puan1:0, puan2:0, sira:1, zamanlayici:null});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliAnlatElDegistir(ayar.onek);
}
function ikiliAnlatElDegistir(onek){
  ikiliZamanlayiciDurdur(onek);
  const d = ikiliOyunDurum(onek);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'Kelime', '');
  ikiliHtmlAyarla(onek+'Yasakli', '');
  if(d.kartIndex >= d.kartSirasi.length){ ikiliAnlatBitir(onek); return; }
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + ikiliOyuncuEtiket(onek, d.sira) + '\'ya ver! (Anlatan sensin, karşı taraf tahmin edecek)</p>' +
    '<button class="eylem" onclick="ikiliAnlatTuruBaslat(\'' + onek + '\')">✅ Hazırım, Süreyi Başlat</button>');
}
function ikiliAnlatTuruBaslat(onek){
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  const d = ikiliOyunDurum(onek);
  ikiliMetinAyarla(onek+'SiraKimde', 'Anlatan: ' + ikiliOyuncuEtiket(onek, d.sira));
  let kalan = d.ayar.sureSN || 60;
  ikiliMetinAyarla(onek+'Sure', kalan);
  ikiliAnlatKartGoster(onek);
  d.zamanlayici = setInterval(()=>{
    kalan--;
    ikiliMetinAyarla(onek+'Sure', kalan);
    if(kalan<=0){
      clearInterval(d.zamanlayici); d.zamanlayici = null;
      ikiliAnlatSuresiDoldu(onek);
    }
  }, 1000);
}
function ikiliAnlatKartGoster(onek){
  const d = ikiliOyunDurum(onek);
  if(d.kartIndex >= d.kartSirasi.length){ ikiliZamanlayiciDurdur(onek); ikiliAnlatBitir(onek); return; }
  const kart = d.ayar.kartlar[d.kartSirasi[d.kartIndex]];
  ikiliHtmlAyarla(onek+'Kelime', '🗣️ ' + kart.kelime);
  ikiliHtmlAyarla(onek+'Yasakli', (kart.yasakli && kart.yasakli.length) ? ('🚫 Yasaklı kelimeler: ' + kart.yasakli.join(', ')) : '');
}
function ikiliAnlatSonucVer(onek, dogruMu){
  const d = ikiliOyunDurum(onek);
  if(!d.zamanlayici) return;
  sesCal(dogruMu ? 'dogru' : 'tik');
  if(dogruMu){
    if(d.sira===1){ d.puan1++; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
    else { d.puan2++; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
  }
  d.kartIndex++;
  ikiliAnlatKartGoster(onek);
}
function ikiliAnlatSuresiDoldu(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'Kelime', '');
  ikiliHtmlAyarla(onek+'Yasakli', '');
  ikiliMetinAyarla(onek+'SiraKimde', '');
  sesCal('tik');
  if(d.kartIndex >= d.kartSirasi.length){ ikiliAnlatBitir(onek); return; }
  d.sira = d.sira===1 ? 2 : 1;
  ikiliAnlatElDegistir(onek);
}
function ikiliAnlatBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.puan1>d.puan2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.puan1} - ${d.puan2})`;
  else if(d.puan2>d.puan1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.puan2} - ${d.puan1})`;
  else sonuc = `🤝 Berabere! (${d.puan1} - ${d.puan2})`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliAnlatBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ---- L) BILGI BINGO (dogru cevap kendi 3x3 kartinda bir kutu isaretler) ----
   ikiliBingoBaslat({onek, sorular:[{soru,secenekler,dogru}], kavramlar:[en az 9 kavram], sureSN})
   DOM: <onek>SoruNo, <onek>Toplam, <onek>Sure, <onek>Izgara1, <onek>Izgara2,
        <onek>ElDegistir, <onek>SiraKimde, <onek>SoruMetin, <onek>Secenekler, <onek>Sonuc, <onek>YenidenBaslat */
function ikiliBingoBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  const izgara1 = karistir(ayar.kavramlar.slice()).slice(0,9).map(k=>({kavram:k, isaretli:false}));
  const izgara2 = karistir(ayar.kavramlar.slice()).slice(0,9).map(k=>({kavram:k, isaretli:false}));
  Object.assign(d, {ayar, izgara1, izgara2, index:0, sira:1, zamanlayici:null});
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliMetinAyarla(ayar.onek+'Toplam', ayar.sorular.length);
  ikiliBingoCiz(ayar.onek);
  ikiliBingoElDegistir(ayar.onek);
}
function ikiliBingoCiz(onek){
  const d = ikiliOyunDurum(onek);
  [1,2].forEach(no=>{
    const kutu = document.getElementById(onek+'Izgara'+no);
    if(!kutu) return;
    const izgara = no===1 ? d.izgara1 : d.izgara2;
    kutu.innerHTML = izgara.map(h=>'<div class="omg-bingo-hucre' + (h.isaretli?' omg-bingo-isaretli':'') + '">' + h.kavram + '</div>').join('');
  });
}
function ikiliBingoElDegistir(onek){
  ikiliZamanlayiciDurdur(onek);
  const d = ikiliOyunDurum(onek);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + ikiliOyuncuEtiket(onek, d.sira) + '\'ya ver!</p>' +
    '<button class="eylem" onclick="ikiliBingoSoruGoster(\'' + onek + '\')">✅ Hazırım, Soruyu Göster</button>');
}
function ikiliBingoSoruGoster(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  const soru = d.ayar.sorular[d.index % d.ayar.sorular.length];
  ikiliMetinAyarla(onek+'SoruNo', d.index+1);
  ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
  ikiliMetinAyarla(onek+'SoruMetin', '❓ ' + soru.soru);
  const kutu = document.getElementById(onek+'Secenekler');
  kutu.innerHTML = '';
  karistir(soru.secenekler.slice()).forEach(secenek=>{
    const btn = document.createElement('button');
    btn.className = 'eylem';
    btn.textContent = secenek;
    btn.onclick = ()=> ikiliBingoCevapVer(onek, secenek===soru.dogru);
    kutu.appendChild(btn);
  });
  if(d.ayar.sureSN) ikiliZamanlayiciBaslat(onek, ikiliBingoCevapVer);
}
function ikiliBingoSiraKontrol(izgara){
  const cizgiler = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return cizgiler.some(c=>c.every(i=>izgara[i].isaretli));
}
function ikiliBingoCevapVer(onek, dogruMu){
  const d = ikiliOyunDurum(onek);
  ikiliZamanlayiciDurdur(onek);
  sesCal(dogruMu ? 'dogru' : 'yanlis');
  let bingoOldu = false;
  if(dogruMu){
    const izgara = d.sira===1 ? d.izgara1 : d.izgara2;
    const bosHucreler = izgara.map((h,i)=> h.isaretli ? -1 : i).filter(i=>i>=0);
    if(bosHucreler.length){
      const secilen = bosHucreler[Math.floor(Math.random()*bosHucreler.length)];
      izgara[secilen].isaretli = true;
    }
    bingoOldu = ikiliBingoSiraKontrol(izgara);
  }
  ikiliBingoCiz(onek);
  d.sira = d.sira===1 ? 2 : 1;
  d.index++;
  ikiliHtmlAyarla(onek+'SoruMetin', '');
  ikiliHtmlAyarla(onek+'Secenekler', '');
  setTimeout(()=>{
    if(bingoOldu || d.index>=d.ayar.sorular.length) ikiliBingoBitir(onek, bingoOldu);
    else ikiliBingoElDegistir(onek);
  }, 500);
}
function ikiliBingoBitir(onek, bingoOldu){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(bingoOldu){
    const kazananNo = d.sira===1 ? 2 : 1;
    sonuc = `🏆 BİNGO! Kazanan: ${ikiliOyuncuAdi(onek,kazananNo)}!`;
  } else {
    const isaretli1 = d.izgara1.filter(h=>h.isaretli).length;
    const isaretli2 = d.izgara2.filter(h=>h.isaretli).length;
    if(isaretli1>isaretli2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${isaretli1} - ${isaretli2} kutu)`;
    else if(isaretli2>isaretli1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${isaretli2} - ${isaretli1} kutu)`;
    else sonuc = '🤝 Berabere!';
  }
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliBingoBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}

/* ---- M) SANS KUTUSU (soruya ek olarak rastgele bonus/ceza puanı) ----
   ikiliSansBaslat({onek, sorular:[{soru,secenekler,dogru}], sanslar:[{metin, puan}], sureSN})
   DOM: <onek>SoruNo, <onek>Toplam, <onek>Puan1, <onek>Puan2, <onek>Sure, <onek>SansKutu,
        <onek>ElDegistir, <onek>SiraKimde, <onek>SoruMetin, <onek>Secenekler, <onek>Sonuc, <onek>YenidenBaslat */
function ikiliSansBaslat(ayar){
  const d = ikiliOyunDurum(ayar.onek);
  Object.assign(d, {ayar, index:0, puan1:0, puan2:0, sira:1, zamanlayici:null});
  ikiliMetinAyarla(ayar.onek+'Puan1', 0);
  ikiliMetinAyarla(ayar.onek+'Puan2', 0);
  ikiliMetinAyarla(ayar.onek+'Toplam', ayar.sorular.length);
  ikiliHtmlAyarla(ayar.onek+'Sonuc', '');
  ikiliHtmlAyarla(ayar.onek+'YenidenBaslat', '');
  ikiliSansElDegistir(ayar.onek);
}
function ikiliSansElDegistir(onek){
  ikiliZamanlayiciDurdur(onek);
  const d = ikiliOyunDurum(onek);
  ikiliMetinAyarla(onek+'SiraKimde', '');
  ikiliHtmlAyarla(onek+'SansKutu', '');
  ikiliHtmlAyarla(onek+'ElDegistir',
    '<p style="font-weight:bold;">📱 Cihazı ' + ikiliOyuncuEtiket(onek, d.sira) + '\'ya ver!</p>' +
    '<button class="eylem" onclick="ikiliSansSoruGoster(\'' + onek + '\')">✅ Hazırım, Soruyu Göster</button>');
}
function ikiliSansSoruGoster(onek){
  const d = ikiliOyunDurum(onek);
  ikiliHtmlAyarla(onek+'ElDegistir', '');
  const soru = d.ayar.sorular[d.index];
  ikiliMetinAyarla(onek+'SoruNo', d.index+1);
  ikiliMetinAyarla(onek+'SiraKimde', 'Sıra: ' + ikiliOyuncuEtiket(onek, d.sira));
  ikiliMetinAyarla(onek+'SoruMetin', '❓ ' + soru.soru);
  const kutu = document.getElementById(onek+'Secenekler');
  kutu.innerHTML = '';
  karistir(soru.secenekler.slice()).forEach(secenek=>{
    const btn = document.createElement('button');
    btn.className = 'eylem';
    btn.textContent = secenek;
    btn.onclick = ()=> ikiliSansCevapVer(onek, secenek===soru.dogru);
    kutu.appendChild(btn);
  });
  if(d.ayar.sureSN) ikiliZamanlayiciBaslat(onek, ikiliSansCevapVer);
}
function ikiliSansCevapVer(onek, dogruMu){
  const d = ikiliOyunDurum(onek);
  ikiliZamanlayiciDurdur(onek);
  sesCal(dogruMu ? 'dogru' : 'yanlis');
  if(dogruMu){
    if(d.sira===1){ d.puan1++; ikiliMetinAyarla(onek+'Puan1', d.puan1); }
    else { d.puan2++; ikiliMetinAyarla(onek+'Puan2', d.puan2); }
  }
  ikiliHtmlAyarla(onek+'SoruMetin', '');
  ikiliHtmlAyarla(onek+'Secenekler', '');
  ikiliHtmlAyarla(onek+'SansKutu', '<button class="eylem omg-sans-btn" onclick="ikiliSansKutuAc(\'' + onek + '\')">🎁 Şans Kutusunu Aç!</button>');
}
function ikiliSansKutuAc(onek){
  const d = ikiliOyunDurum(onek);
  const sans = d.ayar.sanslar[Math.floor(Math.random()*d.ayar.sanslar.length)];
  sesCal(sans.puan>=0 ? 'dogru' : 'yanlis');
  if(d.sira===1){ d.puan1 = Math.max(0, d.puan1+sans.puan); ikiliMetinAyarla(onek+'Puan1', d.puan1); }
  else { d.puan2 = Math.max(0, d.puan2+sans.puan); ikiliMetinAyarla(onek+'Puan2', d.puan2); }
  ikiliHtmlAyarla(onek+'SansKutu', '<p class="omg-sans-sonuc">' + sans.metin + '</p>');
  d.sira = d.sira===1 ? 2 : 1;
  d.index++;
  setTimeout(()=> d.index>=d.ayar.sorular.length ? ikiliSansBitir(onek) : ikiliSansElDegistir(onek), 1200);
}
function ikiliSansBitir(onek){
  const d = ikiliOyunDurum(onek);
  let sonuc;
  if(d.puan1>d.puan2) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,1)}! (${d.puan1} - ${d.puan2})`;
  else if(d.puan2>d.puan1) sonuc = `🏆 Kazanan: ${ikiliOyuncuAdi(onek,2)}! (${d.puan2} - ${d.puan1})`;
  else sonuc = `🤝 Berabere! (${d.puan1} - ${d.puan2})`;
  ikiliHtmlAyarla(onek+'Sonuc', '🎉 Oyun bitti! ' + sonuc);
  sesCal('kazanan');
  ikiliKazananVurgula(onek);
  ikiliHtmlAyarla(onek+'YenidenBaslat', '<button class="eylem" onclick="ikiliSansBaslat(ikiliOyunDurum(\'' + onek + '\').ayar)">🔄 Yeniden Başlat</button>');
}
