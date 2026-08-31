/* ======================================================================
   SINAV MERKEZİ — ortak JS yardımcıları
   Bağımsız çalışır; ana portalın (din-kulturu-tum-siniflar.html) JS'ine
   hiçbir referans/bağımlılık yoktur. localStorage anahtarları "smerkez_"
   önekiyle ayrı bir isim alanında tutulur.
====================================================================== */

function smOku(anahtar){
  try{ const ham = localStorage.getItem(anahtar); return ham ? JSON.parse(ham) : null; }
  catch(e){ return null; }
}
function smYaz(anahtar, deger){
  try{ localStorage.setItem(anahtar, JSON.stringify(deger)); }catch(e){ /* depolama kullanılamıyor */ }
}
function smBugun(){ return new Date().toISOString().slice(0,10); }

/* ===== Genel iç-sekme geçişi =====
   navSelector: sekme düğmelerini içeren konteyner
   Her düğme data-sekme="X" taşır; her panel data-panel="X" taşır.
   panelKapsayiciSelector (opsiyonel): verilirse, paneller yalnızca bu
   kapsayıcının İÇİNDEN aranır — aynı sayfada birden fazla bağımsız sekme
   grubu olduğunda (ör. YKS'de önce TYT/AYT dalı, sonra her dalın kendi
   modül sekmeleri) grupların birbirinin panelini gizlemesini önler.
   Verilmezse eskisi gibi tüm belgede arar (geriye dönük uyumlu). */
function smSekmeKur(navSelector, panelKapsayiciSelector){
  const nav = document.querySelector(navSelector);
  if(!nav) return;
  nav.addEventListener('click', function(e){
    const btn = e.target.closest('button[data-sekme]');
    if(!btn) return;
    nav.querySelectorAll('button[data-sekme]').forEach(function(b){
      b.setAttribute('aria-selected', b===btn ? 'true' : 'false');
    });
    const kok = panelKapsayiciSelector ? document.querySelector(panelKapsayiciSelector) : document;
    if(!kok) return;
    kok.querySelectorAll('[data-panel]').forEach(function(p){
      p.hidden = (p.dataset.panel !== btn.dataset.sekme);
    });
  });
}

/* ===== Günlük Hedef aracı =====
   modul: 'lgs' | 'tyt' | 'ayt' — her modülün hedefi/sayaçları birbirinden bağımsız saklanır. */
function smGunlukHedefKur(modul, kokId){
  const LS_HEDEF = 'smerkez_'+modul+'_gunluk_hedef';
  const LS_SAYAC = 'smerkez_'+modul+'_gunluk_sayac'; // {tarih, adet}

  function sayacOku(){
    const kayit = smOku(LS_SAYAC);
    if(kayit && kayit.tarih === smBugun()) return kayit.adet;
    return 0;
  }
  function sayacYaz(adet){ smYaz(LS_SAYAC, {tarih:smBugun(), adet:adet}); }

  const kok = document.getElementById(kokId);
  if(!kok) return;
  const hedefGirdi = kok.querySelector('.sm-hedef-girdi');
  const barIc = kok.querySelector('.sm-ilerleme-ic');
  const metin = kok.querySelector('.sm-hedef-metin');
  const artirBtn = kok.querySelector('.sm-hedef-artir');
  const sifirlaBtn = kok.querySelector('.sm-hedef-sifirla');

  function ciz(){
    const hedef = parseInt(smOku(LS_HEDEF), 10) || 10;
    hedefGirdi.value = hedef;
    const adet = sayacOku();
    const oran = Math.min(100, Math.round((adet/hedef)*100));
    barIc.style.width = oran+'%';
    metin.textContent = 'Bugün: '+adet+' / '+hedef+' soru';
  }

  hedefGirdi.addEventListener('change', function(){
    const deger = parseInt(hedefGirdi.value, 10) || 10;
    smYaz(LS_HEDEF, deger);
    ciz();
  });
  artirBtn.addEventListener('click', function(){
    sayacYaz(sayacOku()+1);
    ciz();
  });
  sifirlaBtn.addEventListener('click', function(){
    sayacYaz(0);
    ciz();
  });
  ciz();
}

/* ===== Çalışma Planı aracı (haftalık, serbest metin) =====
   Her gün için öğrencinin kendi yazdığı kısa çalışma notu — gerçek konu
   verisi henüz olmadığından serbest metin tabanlı, dürüst bir araçtır. */
function smCalismaPlaniKur(modul, kokId){
  const LS_PLAN = 'smerkez_'+modul+'_calisma_plani';
  const GUNLER = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
  const kok = document.getElementById(kokId);
  if(!kok) return;

  const plan = smOku(LS_PLAN) || {};
  kok.innerHTML = GUNLER.map(function(gun, i){
    const deger = plan[i] || '';
    return '<div class="sm-plan-gun"><b>'+gun+'</b><textarea data-gun="'+i+'" placeholder="Bugün ne çalışacaksın?">'+deger+'</textarea></div>';
  }).join('');

  kok.querySelectorAll('textarea').forEach(function(ta){
    ta.addEventListener('input', function(){
      const guncel = smOku(LS_PLAN) || {};
      guncel[ta.dataset.gun] = ta.value;
      smYaz(LS_PLAN, guncel);
    });
  });
}

/* ===== Yanlış Analiz — dürüst boş durum =====
   Henüz gerçek bir test çözme motoru olmadığından burada uydurma sonuç
   göstermek yerine, veri birikince dolacak şekilde tasarlanmış gerçek bir
   boş durum sunulur. */
function smYanlisAnalizKur(modul, kokId){
  const LS_SONUCLAR = 'smerkez_'+modul+'_test_sonuclari';
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const sonuclar = smOku(LS_SONUCLAR) || [];
  if(sonuclar.length === 0){
    kok.innerHTML =
      '<div class="sm-yakinda">'+
        '<span class="msi" aria-hidden="true">fact_check</span>'+
        '<h3>Henüz çözülmüş bir test yok</h3>'+
        '<p>Konu testleri ve denemeler yayınlanıp ilk testini çözdüğünde, doğru/yanlış/boş dağılımın ve en çok hata yaptığın konular burada görünecek.</p>'+
      '</div>';
    return;
  }
  /* İleride gerçek test motoru eklendiğinde, sonuclar dizisindeki gerçek
     kayıtlardan (konu, doğru, yanlış, boş) tablo/grafik üretilecek. */
}
