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

/* ===== Geri Sayım (sınav tarihine kaç gün kaldı) =====
   modul: 'lgs' | 'tyt' | 'ayt' — her modülün sınav tarihi ayrı saklanır.
   Gerçek sınav tarihi sabit kodlanmaz; öğrenci/öğretmen kendi girer. */
function smGeriSayimKur(modul, kokId){
  const LS_TARIH = 'smerkez_'+modul+'_sinav_tarihi';
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const girdi = kok.querySelector('.sm-geri-sayim-girdi');
  const kaydetBtn = kok.querySelector('.sm-geri-sayim-kaydet');
  const sonuc = kok.querySelector('.sm-geri-sayim-sonuc');

  function ciz(){
    const tarih = smOku(LS_TARIH);
    if(!tarih){
      sonuc.innerHTML = '<p class="sm-hedef-metin">Sınav tarihini girip kaydedersen geri sayım burada başlar.</p>';
      return;
    }
    girdi.value = tarih;
    const farkGun = Math.round((new Date(tarih+'T00:00:00') - new Date(smBugun()+'T00:00:00')) / 86400000);
    if(farkGun > 0){
      sonuc.innerHTML = '<div class="sm-geri-sayim-buyuk"><b>'+farkGun+'</b><span>gün kaldı</span></div>';
    } else if(farkGun === 0){
      sonuc.innerHTML = '<div class="sm-geri-sayim-buyuk"><b>Bugün!</b><span>Başarılar 🍀</span></div>';
    } else {
      sonuc.innerHTML = '<p class="sm-hedef-metin">Girilen tarih geçmiş görünüyor — tarihini güncelleyebilirsin.</p>';
    }
  }

  kaydetBtn.addEventListener('click', function(){
    if(girdi.value) smYaz(LS_TARIH, girdi.value);
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
  const toplamDogru = sonuclar.reduce((t,s)=>t+s.dogru,0);
  const toplamYanlis = sonuclar.reduce((t,s)=>t+s.yanlis,0);
  const toplamBos = sonuclar.reduce((t,s)=>t+s.bos,0);
  kok.innerHTML =
    '<div class="sm-dash-izgara" style="margin-bottom:20px;">' +
      '<div class="sm-dash-kart"><span class="msi" aria-hidden="true">check_circle</span><b>'+toplamDogru+'</b><span>Doğru</span></div>' +
      '<div class="sm-dash-kart"><span class="msi" aria-hidden="true">cancel</span><b>'+toplamYanlis+'</b><span>Yanlış</span></div>' +
      '<div class="sm-dash-kart"><span class="msi" aria-hidden="true">radio_button_unchecked</span><b>'+toplamBos+'</b><span>Boş</span></div>' +
      '<div class="sm-dash-kart"><span class="msi" aria-hidden="true">event_repeat</span><b>'+sonuclar.length+'</b><span>Çözülen Test</span></div>' +
    '</div>' +
    '<p style="font-size:.85em;color:var(--metin-ikincil);">Konu bazlı kırılım ve grafikler için <b>Performans Analizi</b> sekmesine göz at; tek tek yanlışların için <b>Favoriler</b> sekmesindeki "Yanlış Yaptıklarım" listesini kullanabilirsin.</p>';
}

/* ======================================================================
   LGS HAZIRLIK MERKEZİ — genişletilmiş modüller (2026-08-05)
   Tüm veriler smerkez_ önekli localStorage anahtarlarında GERÇEK olarak
   birikir; hiçbir yerde uydurma "geçmiş" sonuç gösterilmez — veri yoksa
   dürüst bir boş durum sunulur (bkz. smYanlisAnalizKur'daki ilke).
====================================================================== */

/* ---- Koyu/açık tema ---- */
(function(){
  try{
    const kayitli = localStorage.getItem('smerkez_tema');
    if(kayitli === 'dark' || kayitli === 'light') document.documentElement.setAttribute('data-theme', kayitli);
  }catch(e){}
})();
function smKoyuMu(){
  const kok = document.documentElement;
  return kok.getAttribute('data-theme') === 'dark' ||
    (kok.getAttribute('data-theme') !== 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
function smTemaDegistir(){
  const yeni = smKoyuMu() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', yeni);
  try{ localStorage.setItem('smerkez_tema', yeni); }catch(e){}
  smTemaButonGuncelle();
}
function smTemaButonGuncelle(){
  document.querySelectorAll('.sm-tema-btn').forEach(function(btn){
    btn.innerHTML = smKoyuMu()
      ? '<span class="msi" aria-hidden="true">light_mode</span> Açık Tema'
      : '<span class="msi" aria-hidden="true">dark_mode</span> Koyu Tema';
  });
}
document.addEventListener('DOMContentLoaded', smTemaButonGuncelle);

/* ---- Günlük sayaç (paylaşılan) — smGunlukHedefKur ile AYNI anahtarı okur/yazar ---- */
function smGunlukSayacOku(modul){
  const kayit = smOku('smerkez_'+modul+'_gunluk_sayac');
  if(kayit && kayit.tarih === smBugun()) return kayit.adet;
  return 0;
}
function smGunlukSayacArtir(modul, adet){
  const yeni = smGunlukSayacOku(modul) + adet;
  smYaz('smerkez_'+modul+'_gunluk_sayac', {tarih:smBugun(), adet:yeni});
  const LS_TARIHCE = 'smerkez_'+modul+'_gunluk_tarihce';
  const tarihce = smOku(LS_TARIHCE) || {};
  tarihce[smBugun()] = yeni;
  smYaz(LS_TARIHCE, tarihce);
  return yeni;
}

/* ---- Günlük çalışma serisi (gün üst üste kullanım) ---- */
function smSeriOku(modul){ return (smOku('smerkez_'+modul+'_seri') || {gun:0}).gun; }
function smSeriGuncelle(modul){
  const LS_SERI = 'smerkez_'+modul+'_seri';
  const kayit = smOku(LS_SERI) || {tarih:null, gun:0};
  const bugun = smBugun();
  if(kayit.tarih !== bugun){
    const dun = new Date(); dun.setDate(dun.getDate()-1);
    kayit.gun = (kayit.tarih === dun.toISOString().slice(0,10)) ? kayit.gun+1 : 1;
    kayit.tarih = bugun;
    smYaz(LS_SERI, kayit);
  }
  return kayit.gun;
}

/* ---- Son çalışılan konu takibi (link kartlarına tıklanınca kaydeder) ---- */
function smSonKonuTakibiKur(modul, kapsayiciSelector){
  document.querySelectorAll(kapsayiciSelector+' .sm-link-kart').forEach(function(kart){
    kart.addEventListener('click', function(){
      const b = kart.querySelector('b');
      smYaz('smerkez_'+modul+'_son_konu', {baslik: b ? b.textContent : kart.textContent.trim(), href: kart.getAttribute('href'), tarih: smBugun()});
    });
  });
}

/* ---- Favoriler: link kartlarına ⭐ ekler + ayrı favoriler paneli ---- */
function smFavoriListesiOku(modul){ return smOku('smerkez_'+modul+'_favoriler') || []; }
function smFavoriMi(modul, href){ return smFavoriListesiOku(modul).some(function(f){ return f.href===href; }); }
function smFavoriDegistir(modul, href, baslik, aciklama){
  let liste = smFavoriListesiOku(modul);
  if(smFavoriMi(modul, href)) liste = liste.filter(function(f){ return f.href!==href; });
  else liste.push({href:href, baslik:baslik, aciklama:aciklama});
  smYaz('smerkez_'+modul+'_favoriler', liste);
}
function smFavoriYildizlariEkle(modul, kapsayiciSelector){
  document.querySelectorAll(kapsayiciSelector+' .sm-link-kart').forEach(function(kart){
    if(kart.querySelector('.sm-favori-yildiz')) return;
    const href = kart.getAttribute('href');
    const b = kart.querySelector('b');
    const baslik = b ? b.textContent : kart.textContent.trim();
    const aciklama = kart.querySelectorAll('span span')[1] ? kart.querySelectorAll('span span')[1].textContent : '';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sm-favori-yildiz' + (smFavoriMi(modul, href) ? ' aktif' : '');
    btn.innerHTML = '<span class="msi" aria-hidden="true">star</span>';
    btn.setAttribute('aria-label','Favorilere ekle/çıkar');
    btn.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      smFavoriDegistir(modul, href, baslik, aciklama);
      btn.classList.toggle('aktif');
    });
    kart.appendChild(btn);
  });
}
function smFavorilerPaneliKur(modul, kokId){
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const liste = smFavoriListesiOku(modul);
  const sonuclar = smOku('smerkez_'+modul+'_test_sonuclari') || [];
  const yanlislar = [];
  sonuclar.forEach(function(s){ (s.yanlisSorular||[]).forEach(function(y){ yanlislar.push(y); }); });

  let html = '<h3 style="margin-top:0;">⭐ Daha Sonra Çöz / İşaretlediklerim</h3>';
  if(!liste.length){
    html += '<div class="sm-yakinda" style="margin:0 0 28px;"><span class="msi" aria-hidden="true">star_border</span><h3>Henüz favori eklemedin</h3><p>Diğer sekmelerdeki bağlantı kartlarının sağ üstündeki ⭐ simgesine tıklayarak burada bir liste oluşturabilirsin.</p></div>';
  } else {
    html += '<div class="sm-link-izgara" style="margin-bottom:28px;">' + liste.map(function(f){
      return '<a class="sm-link-kart" href="'+f.href+'"><span class="sm-link-ikon" aria-hidden="true"><span class="msi">star</span></span><span><b>'+f.baslik+'</b><span>'+f.aciklama+'</span></span></a>';
    }).join('') + '</div>';
  }
  html += '<h3>❌ Yanlış Yaptıklarım</h3>';
  if(!yanlislar.length){
    html += '<div class="sm-yakinda"><span class="msi" aria-hidden="true">check_circle</span><h3>Kayıtlı yanlışın yok</h3><p>Kazanım testi veya deneme çözdükçe yanlış yaptığın sorular burada birikecek ve tek tıkla tekrar çözebileceksin.</p></div>';
  } else {
    html += '<p style="color:var(--metin-ikincil);font-size:.88em;">'+yanlislar.length+' soruyu yanlış yaptın.</p>' +
      '<button type="button" class="sm-btn" id="smTekrarCozBtn">🔁 Hepsini Tekrar Çöz</button>' +
      '<div id="smTekrarCozAlani" style="margin-top:18px;"></div>';
  }
  kok.innerHTML = html;
  if(yanlislar.length){
    document.getElementById('smTekrarCozBtn').addEventListener('click', function(){
      const alan = document.getElementById('smTekrarCozAlani');
      alan.className = 'sm-deneme-oyun-alani';
      smDenemeCalistir(modul, alan, yanlislar, false, function(){ smFavorilerPaneliKur(modul, kokId); });
    });
  }
}

/* ---- Günlük Program (checklist, animasyonlu tik) ---- */
const SM_GUNLUK_PROGRAM_OGELERI = [
  {id:'ozet', ikon:'menu_book', metin:'Konu özetini oku'},
  {id:'video', ikon:'play_circle', metin:'Konu videosunu izle'},
  {id:'soru20', ikon:'quiz', metin:'20 soru çöz'},
  {id:'yeninesil', ikon:'auto_awesome', metin:'Yeni nesil soru dene'},
  {id:'deneme', ikon:'timer', metin:'Bir deneme çöz'}
];
function smGunlukProgramKur(modul, kokId){
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const anahtar = 'smerkez_'+modul+'_checklist_'+smBugun();
  function ciz(){
    const durum = smOku(anahtar) || {};
    kok.innerHTML = SM_GUNLUK_PROGRAM_OGELERI.map(function(o){
      const tamam = !!durum[o.id];
      return '<div class="sm-checklist-item'+(tamam?' tamam':'')+'" data-id="'+o.id+'" role="checkbox" aria-checked="'+tamam+'" tabindex="0">' +
        '<div class="sm-checklist-kutu"><span class="msi" aria-hidden="true">check</span></div>' +
        '<span class="msi" aria-hidden="true">'+o.ikon+'</span>' +
        '<span class="sm-checklist-metin">'+o.metin+'</span>' +
      '</div>';
    }).join('');
    kok.querySelectorAll('.sm-checklist-item').forEach(function(item){
      function tetikle(){
        const g = smOku(anahtar) || {};
        g[item.dataset.id] = !g[item.dataset.id];
        smYaz(anahtar, g);
        ciz();
      }
      item.addEventListener('click', tetikle);
      item.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); tetikle(); } });
    });
  }
  ciz();
}

/* ---- Dashboard ---- */
function smDashboardKur(modul, kokId){
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const hedef = parseInt(smOku('smerkez_'+modul+'_gunluk_hedef'),10) || 10;
  const yapilan = smGunlukSayacOku(modul);
  const seri = smSeriOku(modul);
  const sonuclar = smOku('smerkez_'+modul+'_test_sonuclari') || [];
  const sonKonu = smOku('smerkez_'+modul+'_son_konu');
  const sonDeneme = sonuclar.length ? sonuclar[sonuclar.length-1] : null;
  const toplamSoru = sonuclar.reduce(function(t,s){ return t+s.boyut; },0);
  const toplamDogru = sonuclar.reduce(function(t,s){ return t+s.dogru; },0);
  const basariYuzde = toplamSoru ? Math.round((toplamDogru/toplamSoru)*100) : 0;
  const toplamSaniye = sonuclar.reduce(function(t,s){ return t+(s.suresaniye||0); },0);
  const calismaSaati = (toplamSaniye/3600).toFixed(1);

  function kart(ikon, deger, etiket){
    return '<div class="sm-dash-kart"><span class="msi" aria-hidden="true">'+ikon+'</span><b>'+deger+'</b><span>'+etiket+'</span></div>';
  }
  kok.innerHTML =
    '<div class="sm-dash-izgara">' +
      kart('flag', yapilan+' / '+hedef, 'Günlük Hedef (soru)') +
      kart('timer', calismaSaati, 'Toplam Çalışma (saat)') +
      kart('quiz', toplamSoru, 'Çözülen Soru') +
      kart('percent', '%'+basariYuzde, 'Başarı Yüzdesi') +
      kart('local_fire_department', seri, 'Günlük Seri') +
    '</div>' +
    '<div class="sm-dash-son"><span class="msi" aria-hidden="true">history_edu</span><div><b>Son çalışılan konu</b><span>'+(sonKonu ? sonKonu.baslik : 'Henüz konu çalışmadın — Konu Anlatımları sekmesinden başla.') +'</span></div></div>' +
    '<div class="sm-dash-son"><span class="msi" aria-hidden="true">assignment_turned_in</span><div><b>Son deneme</b><span>'+(sonDeneme ? (sonDeneme.dogru+' doğru, '+sonDeneme.yanlis+' yanlış, net '+sonDeneme.net) : 'Henüz deneme çözmedin — Deneme Merkezi sekmesinden başla.')+'</span></div></div>';
}

/* ---- Günün Sorusu: gün numarasına göre havuzdan deterministik seçim ---- */
function smGunSayisi(){
  const simdi = new Date();
  const yilBasi = new Date(simdi.getFullYear(),0,0);
  return Math.floor((simdi - yilBasi) / 86400000);
}
function smGununSorusuKur(modul, kokId, soruHavuzu){
  const kok = document.getElementById(kokId);
  if(!kok || !soruHavuzu || !soruHavuzu.length) return;
  const soru = soruHavuzu[smGunSayisi() % soruHavuzu.length];
  kok.innerHTML =
    '<span class="sm-gunun-sorusu-etiket"><span class="msi" aria-hidden="true">today</span> Günün Sorusu</span>' +
    '<h3>'+soru.soru+'</h3>' +
    '<div class="sm-gunun-secenek-izgara" id="smGununSecenekler"></div>' +
    '<div class="sm-gunun-aciklama" id="smGununAciklama"></div>' +
    '<div class="sm-gunun-btn-satir">' +
      '<button type="button" class="sm-gunun-btn" id="smGununCevapGoster">Cevabı Göster</button>' +
      (soru.videoHref ? '<a class="sm-gunun-btn sm-gunun-btn-ikincil" href="'+soru.videoHref+'"><span class="msi" aria-hidden="true">play_circle</span> Video Çözüm</a>' : '') +
      (soru.benzerHref ? '<a class="sm-gunun-btn sm-gunun-btn-ikincil" href="'+soru.benzerHref+'"><span class="msi" aria-hidden="true">apps</span> Benzer Sorular</a>' : '') +
    '</div>';
  function goster(secilenBtn){
    kok.querySelectorAll('.sm-gunun-secenek').forEach(function(b){
      b.disabled = true;
      if(b.textContent === soru.dogru) b.classList.add('dogru');
      else if(b === secilenBtn) b.classList.add('yanlis');
    });
    const acik = document.getElementById('smGununAciklama');
    acik.textContent = soru.aciklama || ('Doğru cevap: '+soru.dogru);
    acik.classList.add('gorunur');
  }
  document.getElementById('smGununSecenekler').innerHTML='';
  const kutu = document.getElementById('smGununSecenekler');
  soru.secenekler.forEach(function(sec){
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'sm-gunun-secenek'; btn.textContent = sec;
    btn.addEventListener('click', function(){ goster(btn); });
    kutu.appendChild(btn);
  });
  document.getElementById('smGununCevapGoster').addEventListener('click', function(){ goster(null); });
}

/* ---- Akıllı Çalışma Koçu: kural tabanlı, GERÇEK localStorage sinyallerinden
   öneri üretir (uydurma sohbet metni değildir). ---- */
function smKocOnerileriUret(modul, uniteAdlari){
  const oneriler = [];
  const hedef = parseInt(smOku('smerkez_'+modul+'_gunluk_hedef'),10) || 10;
  const yapilan = smGunlukSayacOku(modul);
  const seri = smSeriOku(modul);
  const sonuclar = smOku('smerkez_'+modul+'_test_sonuclari') || [];
  const checklist = smOku('smerkez_'+modul+'_checklist_'+smBugun()) || {};

  if(sonuclar.length === 0){
    oneriler.push({ikon:'rocket_launch', metin:'Henüz hiç deneme çözmedin. İlk adım olarak bir Mini Deneme (10 soru) ile başla, sonuçların burada birikmeye başlasın.'});
  }
  if(!checklist.ozet){
    oneriler.push({ikon:'menu_book', metin:'Önce konu özetini oku — test çözmek sonra çok daha kolay gelecek.'});
  }
  if(yapilan < hedef){
    oneriler.push({ikon:'flag', metin:'Bugün henüz '+(hedef-yapilan)+' soru daha çözmen gerekiyor. Günlük hedefine ulaşmak için Deneme Merkezi veya Kazanım Testleri\'ne göz at.'});
  } else {
    oneriler.push({ikon:'celebration', metin:'Bugünkü hedefini tamamladın, harika gidiyorsun! 🎉'});
  }
  if(seri >= 2){
    oneriler.push({ikon:'local_fire_department', metin:seri+' gündür seri devam ediyor, bırakma!'});
  }

  const uniteToplam = {};
  sonuclar.forEach(function(s){
    Object.keys(s.uniteSonuclari||{}).forEach(function(uid){
      if(!uniteToplam[uid]) uniteToplam[uid] = {dogru:0, toplam:0};
      const u = s.uniteSonuclari[uid];
      uniteToplam[uid].dogru += u.dogru;
      uniteToplam[uid].toplam += u.dogru+u.yanlis+u.bos;
    });
  });
  let enZayifId = null, enZayifOran = 1;
  Object.keys(uniteToplam).forEach(function(uid){
    if(uniteToplam[uid].toplam < 3) return;
    const oran = uniteToplam[uid].dogru/uniteToplam[uid].toplam;
    if(oran < enZayifOran){ enZayifOran = oran; enZayifId = uid; }
  });
  if(enZayifId && uniteAdlari[enZayifId]){
    oneriler.push({ikon:'priority_high', metin: uniteAdlari[enZayifId]+' konusunda eksiklerin var gibi görünüyor (%'+Math.round(enZayifOran*100)+' doğru). Önce konu özetini tekrar oku, sonra o üniteye ait kazanım testini çöz, son olarak bir mini deneme dene.'});
  }
  return oneriler.slice(0,4);
}
function smKocKur(modul, kokId, uniteAdlari){
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const oneriler = smKocOnerileriUret(modul, uniteAdlari);
  kok.innerHTML = oneriler.map(function(o){
    return '<div class="sm-koc-oneri"><span class="msi" aria-hidden="true">'+o.ikon+'</span><p>'+o.metin+'</p></div>';
  }).join('');
}

/* ---- Deneme / Kazanım Test Motoru (GERÇEK, çalışan) ----
   smDenemeCalistir: verilen soru listesini sırayla sorar, süreli/süresiz
   destekler, bitince net/doğru/yanlış/boş hesaplar ve GERÇEK sonucu
   smerkez_<modul>_test_sonuclari dizisine kaydeder. */
function smSoruSecimi(soruHavuzu, adet){
  return soruHavuzu.slice().sort(function(){ return Math.random()-0.5; }).slice(0, Math.min(adet, soruHavuzu.length));
}
function smDenemeCalistir(modul, alan, sorular, sureliMi, bitisCallback, ekBilgi){
  const d = {sorular:sorular, index:0, cevaplar:[], baslangic:Date.now(), zamanlayici:null};
  const sureSN = 40;

  function soruGoster(){
    if(d.zamanlayici){ clearInterval(d.zamanlayici); d.zamanlayici=null; }
    if(d.index >= d.sorular.length){ bitir(); return; }
    const soru = d.sorular[d.index];
    alan.innerHTML =
      '<div class="sm-deneme-ustbilgi"><span>Soru '+(d.index+1)+' / '+d.sorular.length+'</span><span>'+(sureliMi ? '<span id="smDenemeSure">'+sureSN+'</span> sn kaldı' : 'Süresiz')+'</span></div>' +
      '<div class="sm-deneme-soru">'+soru.soru+'</div>' +
      '<div class="sm-deneme-secenekler" id="smDenemeSecenekler"></div>';
    const kutu = document.getElementById('smDenemeSecenekler');
    soru.secenekler.forEach(function(sec){
      const btn = document.createElement('button');
      btn.type='button'; btn.className='sm-deneme-secenek'; btn.textContent=sec;
      btn.addEventListener('click', function(){ cevapVer(sec); });
      kutu.appendChild(btn);
    });
    if(sureliMi){
      let kalan = sureSN;
      d.zamanlayici = setInterval(function(){
        kalan--;
        const el = document.getElementById('smDenemeSure');
        if(el) el.textContent = kalan;
        if(kalan<=0){ clearInterval(d.zamanlayici); d.zamanlayici=null; cevapVer(null); }
      }, 1000);
    }
  }
  function cevapVer(secim){
    if(d.zamanlayici){ clearInterval(d.zamanlayici); d.zamanlayici=null; }
    const soru = d.sorular[d.index];
    d.cevaplar.push({
      soru:soru.soru, secenekler:soru.secenekler, dogru:soru.dogru, aciklama:soru.aciklama,
      uniteId:soru.uniteId, kazanimId:soru.kazanimId, secilen:secim,
      dogruMu: secim===soru.dogru, bosMu: secim===null
    });
    d.index++;
    soruGoster();
  }
  function bitir(){
    const dogru = d.cevaplar.filter(function(c){ return c.dogruMu; }).length;
    const bos = d.cevaplar.filter(function(c){ return c.bosMu; }).length;
    const yanlis = d.cevaplar.length - dogru - bos;
    const net = Math.round(Math.max(0, dogru - yanlis*0.33)*100)/100;
    const suresaniye = Math.round((Date.now()-d.baslangic)/1000);
    const uniteSonuclari = {};
    d.cevaplar.forEach(function(c){
      if(!c.uniteId) return;
      if(!uniteSonuclari[c.uniteId]) uniteSonuclari[c.uniteId] = {dogru:0, yanlis:0, bos:0};
      if(c.dogruMu) uniteSonuclari[c.uniteId].dogru++;
      else if(c.bosMu) uniteSonuclari[c.uniteId].bos++;
      else uniteSonuclari[c.uniteId].yanlis++;
    });
    const kayit = Object.assign({
      tarih: smBugun(), zaman: Date.now(), boyut: d.sorular.length, sureliMi: sureliMi, suresaniye: suresaniye,
      dogru: dogru, yanlis: yanlis, bos: bos, net: net, uniteSonuclari: uniteSonuclari,
      yanlisSorular: d.cevaplar.filter(function(c){ return !c.dogruMu && !c.bosMu; })
    }, ekBilgi || {});
    const LS_SONUCLAR = 'smerkez_'+modul+'_test_sonuclari';
    const liste = smOku(LS_SONUCLAR) || [];
    liste.push(kayit);
    smYaz(LS_SONUCLAR, liste);
    smSeriGuncelle(modul);
    smGunlukSayacArtir(modul, d.sorular.length);

    alan.innerHTML =
      '<h3 style="margin-top:0;">🎉 Tamamlandı!</h3>' +
      '<div class="sm-deneme-sonuc-izgara">' +
        '<div class="sm-deneme-sonuc-kart"><b>'+dogru+'</b><span>Doğru</span></div>' +
        '<div class="sm-deneme-sonuc-kart"><b>'+yanlis+'</b><span>Yanlış</span></div>' +
        '<div class="sm-deneme-sonuc-kart"><b>'+bos+'</b><span>Boş</span></div>' +
        '<div class="sm-deneme-sonuc-kart"><b>'+net+'</b><span>Net</span></div>' +
      '</div>' +
      (kayit.yanlisSorular.length ? '<p style="font-size:.85em;color:var(--metin-ikincil);">Yanlış yaptığın sorular Favoriler sekmesinde birikti, istediğin zaman tekrar çözebilirsin.</p>' : '<p style="font-size:.85em;color:var(--metin-ikincil);">Tebrikler, hiç yanlışın yok! 🎉</p>') +
      '<button type="button" class="sm-btn" id="smDenemeGeriDonBtn">Geri Dön</button>';
    document.getElementById('smDenemeGeriDonBtn').addEventListener('click', function(){ bitisCallback && bitisCallback(); });
  }
  soruGoster();
}
function smDenemeBaslat(modul, alan, soruHavuzu, boyut, sureliMi, bitisCallback, ekBilgi){
  smDenemeCalistir(modul, alan, smSoruSecimi(soruHavuzu, boyut), sureliMi, bitisCallback, ekBilgi);
}

/* ---- Deneme Merkezi paneli ---- */
function smDenemeMerkeziKur(modul, kokId, soruHavuzu){
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const secimAlani = kok.querySelector('.sm-deneme-secim-alani');
  const oyunAlani = kok.querySelector('.sm-deneme-oyun-alani');
  let sureliMi = false;
  kok.querySelectorAll('.sm-deneme-sure-secim button').forEach(function(b){
    b.addEventListener('click', function(){
      kok.querySelectorAll('.sm-deneme-sure-secim button').forEach(function(x){ x.setAttribute('aria-pressed','false'); });
      b.setAttribute('aria-pressed','true');
      sureliMi = b.dataset.sureli === '1';
    });
  });
  kok.querySelectorAll('.sm-deneme-kart').forEach(function(kart){
    kart.addEventListener('click', function(){
      const boyut = parseInt(kart.dataset.boyut,10);
      secimAlani.hidden = true; oyunAlani.hidden = false;
      smDenemeBaslat(modul, oyunAlani, soruHavuzu, boyut, sureliMi, function(){
        secimAlani.hidden = false; oyunAlani.hidden = true;
      });
    });
  });
}

/* ---- Kazanım Testleri paneli ---- */
function smKazanimYuzdeOku(modul, kazanimId){
  const sonuclar = smOku('smerkez_'+modul+'_test_sonuclari') || [];
  let enIyi = 0;
  sonuclar.forEach(function(s){
    if(s.kazanimId !== kazanimId || !s.boyut) return;
    const yuzde = Math.round((s.dogru/s.boyut)*100);
    if(yuzde > enIyi) enIyi = yuzde;
  });
  return enIyi;
}
const SM_ZORLUK_ETIKET = {kolay:'Kolay', orta:'Orta', zor:'Zor', 'yeni-nesil':'Yeni Nesil'};
function smKazanimTestleriKur(modul, kokId, kazanimlar, soruHavuzu){
  const kok = document.getElementById(kokId);
  if(!kok) return;
  kok.innerHTML = kazanimlar.map(function(k){
    const yuzde = smKazanimYuzdeOku(modul, k.id);
    const cipler = k.zorluklar.map(function(z){ return '<span class="sm-zorluk-cip '+z+'">'+(SM_ZORLUK_ETIKET[z]||z)+'</span>'; }).join('');
    return '<div class="sm-kazanim-kart">' +
      '<div class="sm-kazanim-unite">'+k.uniteAd+'</div>' +
      '<h4>'+k.baslik+'</h4>' +
      '<div class="sm-zorluk-satir">'+cipler+'</div>' +
      '<div class="sm-ilerleme-dis"><div class="sm-ilerleme-ic" style="width:'+yuzde+'%"></div></div>' +
      '<div class="sm-kazanim-yuzde">%'+yuzde+' tamamlandı</div>' +
      '<button type="button" class="sm-btn" style="margin-top:10px;width:100%;" data-kazanim="'+k.id+'">Teste Başla</button>' +
    '</div>';
  }).join('');
  kok.querySelectorAll('button[data-kazanim]').forEach(function(btn){
    btn.addEventListener('click', function(){
      const kazanimId = btn.dataset.kazanim;
      const havuz = soruHavuzu.filter(function(s){ return s.kazanimId === kazanimId; });
      if(!havuz.length) return;
      const kart = btn.closest('.sm-kazanim-kart');
      kart.classList.add('sm-deneme-oyun-alani');
      smDenemeCalistir(modul, kart, smSoruSecimi(havuz, Math.min(5, havuz.length)), false, function(){
        kart.classList.remove('sm-deneme-oyun-alani');
        smKazanimTestleriKur(modul, kokId, kazanimlar, soruHavuzu);
      }, {kazanimId:kazanimId});
    });
  });
}

/* ---- Rozet Sistemi (GERÇEK ilerlemeden hesaplanır) ---- */
const SM_ROZET_TANIMLARI = [
  {id:'soru100', ikon:'🥉', ad:'100 Soru', kosul:function(v){ return v.toplamSoru>=100; }},
  {id:'soru500', ikon:'🥈', ad:'500 Soru', kosul:function(v){ return v.toplamSoru>=500; }},
  {id:'soru1000', ikon:'🥇', ad:'1000 Soru', kosul:function(v){ return v.toplamSoru>=1000; }},
  {id:'seri30', ikon:'🔥', ad:'30 Gün Serisi', kosul:function(v){ return v.seri>=30; }},
  {id:'kader', ikon:'⚖️', ad:'Kader Uzmanı', kosul:function(v){ return (v.uniteOran.unite1||0)>=0.8; }},
  {id:'kuran', ikon:'📖', ad:"Kur'an Uzmanı", kosul:function(v){ return (v.uniteOran.unite5||0)>=0.8; }},
  {id:'peygamber', ikon:'🌟', ad:'Peygamber Bilgini', kosul:function(v){ return (v.uniteOran.unite4||0)>=0.8; }},
  {id:'sampiyon', ikon:'🏆', ad:'LGS Şampiyonu', kosul:function(v){ return v.enIyiBuyukDenemeYuzde>=90; }}
];
function smRozetVerileriHesapla(modul){
  const sonuclar = smOku('smerkez_'+modul+'_test_sonuclari') || [];
  const toplamSoru = sonuclar.reduce(function(t,s){ return t+s.boyut; },0);
  const uniteToplam = {};
  sonuclar.forEach(function(s){
    Object.keys(s.uniteSonuclari||{}).forEach(function(uid){
      if(!uniteToplam[uid]) uniteToplam[uid] = {dogru:0, toplam:0};
      const u = s.uniteSonuclari[uid];
      uniteToplam[uid].dogru += u.dogru;
      uniteToplam[uid].toplam += u.dogru+u.yanlis+u.bos;
    });
  });
  const uniteOran = {};
  Object.keys(uniteToplam).forEach(function(uid){ uniteOran[uid] = uniteToplam[uid].toplam ? uniteToplam[uid].dogru/uniteToplam[uid].toplam : 0; });
  let enIyiBuyukDenemeYuzde = 0;
  sonuclar.forEach(function(s){ if(s.boyut>=20){ const y=(s.dogru/s.boyut)*100; if(y>enIyiBuyukDenemeYuzde) enIyiBuyukDenemeYuzde=y; } });
  return {toplamSoru:toplamSoru, seri:smSeriOku(modul), uniteOran:uniteOran, enIyiBuyukDenemeYuzde:enIyiBuyukDenemeYuzde};
}
function smRozetKur(modul, kokId){
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const v = smRozetVerileriHesapla(modul);
  kok.innerHTML = SM_ROZET_TANIMLARI.map(function(r){
    const kazanildi = r.kosul(v);
    return '<div class="sm-rozet'+(kazanildi?' kazanildi':'')+'"><div class="sm-rozet-ikon">'+r.ikon+'</div><b>'+r.ad+'</b><span>'+(kazanildi?'Kazanıldı':'Kilitli')+'</span></div>';
  }).join('');
}

/* ---- İstatistikler paneli ---- */
function smIstatistiklerKur(modul, kokId, uniteAdlari){
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const sonuclar = smOku('smerkez_'+modul+'_test_sonuclari') || [];
  const toplamSoru = sonuclar.reduce(function(t,s){ return t+s.boyut; },0);
  const toplamDogru = sonuclar.reduce(function(t,s){ return t+s.dogru; },0);
  const toplamYanlis = sonuclar.reduce(function(t,s){ return t+s.yanlis; },0);
  const toplamNet = Math.round(sonuclar.reduce(function(t,s){ return t+s.net; },0)*100)/100;
  const toplamSaniye = sonuclar.reduce(function(t,s){ return t+(s.suresaniye||0); },0);
  const calismaSaati = (toplamSaniye/3600).toFixed(1);
  const uniteToplam = {};
  sonuclar.forEach(function(s){
    Object.keys(s.uniteSonuclari||{}).forEach(function(uid){
      if(!uniteToplam[uid]) uniteToplam[uid] = {dogru:0, toplam:0};
      const u = s.uniteSonuclari[uid];
      uniteToplam[uid].dogru += u.dogru;
      uniteToplam[uid].toplam += u.dogru+u.yanlis+u.bos;
    });
  });
  let tamamlananUnite = 0;
  Object.keys(uniteAdlari).forEach(function(uid){
    if(uniteToplam[uid] && uniteToplam[uid].toplam>0 && (uniteToplam[uid].dogru/uniteToplam[uid].toplam)>=0.8) tamamlananUnite++;
  });
  let enGucluId=null, enGucluOran=-1, enZayifId=null, enZayifOran=2;
  Object.keys(uniteToplam).forEach(function(uid){
    if(uniteToplam[uid].toplam<3) return;
    const oran = uniteToplam[uid].dogru/uniteToplam[uid].toplam;
    if(oran>enGucluOran){ enGucluOran=oran; enGucluId=uid; }
    if(oran<enZayifOran){ enZayifOran=oran; enZayifId=uid; }
  });
  function kart(ikon, deger, etiket){
    return '<div class="sm-dash-kart"><span class="msi" aria-hidden="true">'+ikon+'</span><b>'+deger+'</b><span>'+etiket+'</span></div>';
  }
  kok.innerHTML = '<div class="sm-istatistik-izgara">' +
    kart('quiz', toplamSoru, 'Toplam Soru') +
    kart('check_circle', toplamDogru, 'Toplam Doğru') +
    kart('cancel', toplamYanlis, 'Toplam Yanlış') +
    kart('calculate', toplamNet, 'Net') +
    kart('timer', calismaSaati, 'Çalışma Saati') +
    kart('flag', tamamlananUnite+' / '+Object.keys(uniteAdlari).length, 'Tamamlanan Ünite') +
    kart('trending_up', enGucluId?uniteAdlari[enGucluId]:'—', 'En Güçlü Konu') +
    kart('trending_down', enZayifId?uniteAdlari[enZayifId]:'—', 'En Zayıf Konu') +
  '</div>';
}

/* ---- Performans Analizi: SVG radar + bar (gerçek veriden) ---- */
function smPerformansGrafikKur(modul, kokId, uniteAdlari){
  const kok = document.getElementById(kokId);
  if(!kok) return;
  const sonuclar = smOku('smerkez_'+modul+'_test_sonuclari') || [];
  if(!sonuclar.length){
    kok.innerHTML = '<div class="sm-yakinda"><span class="msi" aria-hidden="true">insights</span><h3>Henüz grafik oluşturacak veri yok</h3><p>Bir deneme veya kazanım testi çözdüğünde radar ve çubuk grafikler burada gerçek verilerinle dolacak.</p></div>';
    return;
  }
  const uniteler = Object.keys(uniteAdlari);
  const uniteToplam = {};
  sonuclar.forEach(function(s){
    Object.keys(s.uniteSonuclari||{}).forEach(function(uid){
      if(!uniteToplam[uid]) uniteToplam[uid] = {dogru:0, toplam:0};
      const u = s.uniteSonuclari[uid];
      uniteToplam[uid].dogru += u.dogru;
      uniteToplam[uid].toplam += u.dogru+u.yanlis+u.bos;
    });
  });
  const barHtml = uniteler.map(function(uid){
    const t = uniteToplam[uid];
    const yuzde = (t && t.toplam) ? Math.round((t.dogru/t.toplam)*100) : 0;
    return '<div class="sm-bar-satir"><span class="sm-bar-etiket">'+uniteAdlari[uid]+'</span><div class="sm-bar-dis"><div class="sm-bar-ic" style="width:'+yuzde+'%"></div></div><span class="sm-bar-deger">%'+yuzde+'</span></div>';
  }).join('');

  const mx=110, my=110, R=90, n=uniteler.length;
  function nokta(i, oran){
    const aci = (Math.PI*2*i/n) - Math.PI/2;
    return (mx + R*oran*Math.cos(aci)) + ',' + (my + R*oran*Math.sin(aci));
  }
  const noktalar = uniteler.map(function(uid,i){
    const t = uniteToplam[uid];
    const oran = (t && t.toplam) ? (t.dogru/t.toplam) : 0;
    return nokta(i, oran);
  }).join(' ');
  const izgara = [0.25,0.5,0.75,1].map(function(oran){
    const pts = uniteler.map(function(uid,i){ return nokta(i, oran); }).join(' ');
    return '<polygon points="'+pts+'" fill="none" stroke="var(--kenar)" stroke-width="1"></polygon>';
  }).join('');
  const eksenler = uniteler.map(function(uid,i){
    const uc = nokta(i, 1).split(',');
    return '<line x1="'+mx+'" y1="'+my+'" x2="'+uc[0]+'" y2="'+uc[1]+'" stroke="var(--kenar)" stroke-width="1"></line>';
  }).join('');
  const radarSvg = '<svg viewBox="0 0 220 220" style="width:100%;max-width:260px;display:block;margin:0 auto;">' + izgara + eksenler +
    '<polygon points="'+noktalar+'" fill="color-mix(in srgb, var(--vurgu) 30%, transparent)" stroke="var(--vurgu)" stroke-width="2"></polygon></svg>';

  kok.innerHTML = '<div class="sm-grafik-satir">' +
    '<div class="sm-grafik-kart"><h4>Ünite Bazlı Başarı</h4>'+barHtml+'</div>' +
    '<div class="sm-grafik-kart"><h4>Radar Görünüm</h4>'+radarSvg+'</div>' +
  '</div>';
}
