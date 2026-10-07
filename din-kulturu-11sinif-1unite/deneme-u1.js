/* =====================================================================
   11. sınıf 1. ünite — “Konuya Başlarken Kendini Dene” (Ayet – Hadis – Kavram)
   Motor: ../ortak/unite-denemesi.js (ortak, modüler)

   KAPSAM: Konunun Kavramlar listesindeki 37 kavramın tamamı seçeneklerde yer alır;
   35’i en az bir sorunun doğru cevabıdır. “Sabûr” ve “Hürriyet” için doğrudan bu
   kavramı anlatan doğrulanmış bir ayet/hadis bulunmadığından bu ikisi yalnızca
   çeldirici olarak kullanılır (metin uydurulmamıştır).

   VERİ: ayet-kavram-gorev.js içindeki 50 metin + aşağıdaki ek metinler.
   Ayet mealleri Diyanet İşleri Başkanlığı meali (acikkuran.com ile karşılaştırıldı);
   hadis künyeleri kontrol edildi.

   Her denemede havuzdan 50 soru seçilir: her kavram en az bir kez, kalanlar rastgele.
   Tek doğru cevap kuralı: Metne de uyabilecek kavramlar (GRUP, kabul, EK_YASAK)
   hiçbir zaman seçeneğe konmaz.

   Yeni bir ünite için: Bu dosyanın bir kopyası o ünitenin verisiyle hazırlanır,
   ünite sayfasının başına <section id="deneme"> eklenir ve iki betik yüklenir.
   ===================================================================== */
(function(){
'use strict';
var A = window.AYET_KAVRAM_GOREV;
if(!A || !window.UniteDenemesi) return;
function karistir(a){ var b=a.slice(); for(var i=b.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=b[i]; b[i]=b[j]; b[j]=t; } return b; }

/* Konunun Kavramlar listesi (index.html, KAVRAMLAR) — 37 kavram */
var TUM = ['Kader','Kaza','Sünnetullah','Afet','Rızık','Rezzak','Sabır','Sabûr','Ömür','Ecel','Hidayet','Dalalet','Hayır','Şer',
  'Dua','Tevekkül','Teslimiyet','Rıza','İmtihan','İrade','Külli irade','Sorumluluk','Temyiz','Tefrik','Özgürlük','Hürriyet',
  'Mükellef','İlim','Kudret','Kadir','Kesb','Halk','Tercih','Çaba','Tedbir','Sebep–sonuç','Âmenerrasûlü'];

/* Birbirinin yerine geçebilecek kavramlar: biri doğru cevapsa diğerleri seçeneğe konmaz. */
var GRUP = [['Rızık','Rezzak'],['Sabır','Sabûr'],['İrade','Tercih','Kesb'],['Özgürlük','Hürriyet'],['Temyiz','Tefrik'],
  ['Kudret','Kadir'],['Sorumluluk','Mükellef'],['Sünnetullah','Sebep–sonuç']];

/* Çeldirici adayları: aynı üniteden, anlamca yakın, karıştırılabilir kavramlar (önce bunlar kullanılır). */
var YAKIN = {
  'Kader':['Kaza','Sünnetullah','Külli irade','Teslimiyet','İmtihan','Tevekkül','Ecel'],
  'Kaza':['Kader','Sünnetullah','Ecel','Teslimiyet','Afet','İmtihan'],
  'Sünnetullah':['Kader','Kaza','Külli irade','Afet','İlim','Tedbir'],
  'Afet':['Ecel','Sabır','Rızık','Dalalet','Hidayet','Teslimiyet','Kaza'],
  'Rızık':['Çaba','Kader','Tevekkül','Dua','Sabır','Rıza'],
  'Rezzak':['Halk','İlim','Çaba','Tevekkül','Kader','Sabûr'],
  'Sabır':['Teslimiyet','Rıza','Tevekkül','İmtihan','Dua','Tedbir'],
  'Ömür':['Ecel','İmtihan','Kader','Rızık','Çaba','Sorumluluk'],
  'Ecel':['Ömür','Kader','Kaza','İmtihan','Afet','Tedbir'],
  'Hidayet':['Külli irade','Dua','İlim','Kader','Sabır','Rıza','Dalalet','İrade'],
  'Dalalet':['Hidayet','İrade','Afet','Sorumluluk','İmtihan','Kader'],
  'Hayır':['Şer','Rıza','İmtihan','Çaba','Teslimiyet','Sabır'],
  'Şer':['Hayır','Afet','İmtihan','Rıza','Sabır','Ecel'],
  'Dua':['Tevekkül','Rıza','Teslimiyet','Sabır','Hidayet','İlim'],
  'Tevekkül':['Teslimiyet','Tedbir','Rıza','Sabır','Dua','Kader'],
  'Teslimiyet':['Tevekkül','Rıza','Sabır','Kader','Dua','Tedbir'],
  'Rıza':['Teslimiyet','Sabır','Tevekkül','Hayır','Dua','İmtihan'],
  'İmtihan':['Sabır','Kader','Ecel','Afet','Hayır','Şer','Ömür'],
  'İrade':['Külli irade','Sorumluluk','Kader','Özgürlük','Temyiz','Teslimiyet'],
  'Külli irade':['İrade','Kader','Kaza','Halk','İlim','Sünnetullah'],
  'Sorumluluk':['İrade','Kader','Çaba','Tedbir','Teslimiyet','Temyiz'],
  'Temyiz':['İrade','Hidayet','Özgürlük','İlim','Sorumluluk','Kader','Teslimiyet'],
  'Tefrik':['Hidayet','İrade','İlim','Özgürlük','Sorumluluk','Kader'],
  'Özgürlük':['İrade','Tercih','Hidayet','Sorumluluk','Mükellef','Temyiz','Teslimiyet','Kader'],
  'Mükellef':['Kesb','İrade','Temyiz','Teslimiyet','Kader','Tedbir'],
  'İlim':['Kader','Kudret','Kadir','Külli irade','Halk','Kaza'],
  'Kudret':['Külli irade','İlim','Halk','Kader','Kaza','Rezzak'],
  'Kadir':['Külli irade','İlim','Halk','Rezzak','Kader','Kaza'],
  'Kesb':['Halk','Kader','Rızık','Teslimiyet','Temyiz','Çaba'],
  'Halk':['Kesb','Kader','Külli irade','İrade','Sünnetullah','İlim'],
  'Tercih':['Temyiz','Külli irade','Kader','Teslimiyet','Mükellef','Özgürlük','Hidayet'],
  'Çaba':['Tevekkül','Sorumluluk','Tedbir','Sabır','Rıza','Rızık'],
  'Tedbir':['Tevekkül','Teslimiyet','Sorumluluk','Kader','Dua','Sabır'],
  'Sebep–sonuç':['Kader','Kaza','Tedbir','Rızık','Tevekkül','Çaba'],
  'Âmenerrasûlü':['Kader','Mükellef','Hidayet','İlim','Tevekkül','Sabır']
};

/* Etkinlik metinlerinin denemedeki kavramı: Kavramlar listesindeki karşılığa göre. */
var DEGISTIR = {
  sura30:      { k:'Afet', a:'Musibetler kader kapsamındadır; ayet, başa gelen musibetlerde insanın kendi yaptıklarının payını hatırlatır. Afet, insanın tedbir sorumluluğunu kaldırmaz.' },
  zariyat58:   { k:'Rezzak', a:'“Allah rızık verendir” ifadesi, Allah’ın rızık veren anlamındaki Rezzak ismini anlatır.' },
  insan3:      { k:'Hidayet', a:'Ayet, Allah’ın insana doğru yolu göstermesini, yani hidayeti anlatır; o yolda yürüyüp yürümemek insanın seçimine bırakılmıştır.' },
  beled8:      { k:'Temyiz', a:'Hayır ve şer yollarının gösterilmesi, insanın bunları ayırt edip iradesini buna göre kullanabilme gücünü (temyiz) anlatır.' },
  bakara286:   { k:'Mükellef', a:'“Ancak gücünün yettiği şeyle yükümlü kılar” anlamı, insanın dinin emir ve yasaklarından sorumlu (mükellef) tutulmasını ve bunun sınırını anlatır.' },
  muddessir38: { k:'Kesb', a:'“Herkes kazandığına karşılık bir rehindir” anlamı, insanın kendi iradesiyle yönelip kazandığından (kesb) sorumlu olduğunu anlatır.' },
  kehf29:      { k:'Tercih', a:'“Dileyen iman etsin, dileyen inkâr etsin” anlamı, iman ile inkâr arasındaki seçimi, yani tercihi insana bırakır.' },
  necm39:      { k:'Sebep–sonuç', a:'İnsan için ancak çalıştığının olması, emeğin sonuç doğurduğunu, yani sebep–sonuç ilişkisini anlatır.' }
};
/* Zilzâl 7-8 denemede iki ayrı soruya bölünür (hayır / şer). */
var CIKAR = ['zilzal7'];

/* Ek metinler (yalnızca denemede). Ayetler Diyanet İşleri Başkanlığı meali. */
var EK = [
  { id:'zilzal7a', tur:'Ayet', kay:'Zilzâl suresi, 7. ayet', m:'Artık kim zerre ağırlığınca bir hayır işlerse, onun mükâfatını görecektir.', k:'Hayır', yasak:['Sorumluluk','Kesb','Mükellef'], a:'Ayet, en küçük hayrın bile karşılıksız kalmayacağını bildirir.' },
  { id:'zilzal8', tur:'Ayet', kay:'Zilzâl suresi, 8. ayet', m:'Kim de zerre ağırlığınca bir kötülük işlerse, onun cezasını görecektir.', k:'Şer', yasak:['Sorumluluk','Kesb','Mükellef','Dalalet'], a:'Ayet, en küçük kötülüğün (şer) bile karşılığının görüleceğini bildirir.' },
  { id:'nisa116', tur:'Ayet', kay:'Nisâ suresi, 116. ayet', m:'…Allah’a ortak koşan, kuşkusuz, derin bir sapıklığa düşmüştür.', k:'Dalalet', yasak:['Şer'], a:'“Derin bir sapıklığa düşmek”, doğru yoldan sapmak, yani dalalettir.' },
  { id:'bakara256', tur:'Ayet', kay:'Bakara suresi, 256. ayet', m:'Dinde zorlama yoktur. Çünkü doğruluk sapıklıktan iyice ayrılmıştır…', k:'Özgürlük', yasak:['Hidayet','Dalalet','Tercih','İrade','Temyiz','Tefrik'], a:'“Dinde zorlama yoktur” ifadesi, insanın inancında dış zorlama olmadan karar verebilmesini, yani özgürlüğü anlatır.' },
  { id:'bakara284', tur:'Ayet', kay:'Bakara suresi, 284. ayet', m:'…Allah’ın gücü her şeye hakkıyla yeter.', k:'Kudret', yasak:['Külli irade'], a:'Allah’ın gücünün her şeye yetmesi, kudret sıfatını anlatır.' },
  { id:'imran29', tur:'Ayet', kay:'Âl-i İmrân suresi, 29. ayet', m:'…Allah, her şeye hakkıyla gücü yetendir.', k:'Kadir', yasak:['Külli irade'], a:'“Her şeye hakkıyla gücü yeten” anlamı, Allah’ın Kadir ismini anlatır.' },
  { id:'enam59', tur:'Ayet', kay:'En’âm suresi, 59. ayet', m:'Gaybın anahtarları yalnızca O’nun katındadır. Onları ancak O bilir. Karada ve denizde olanı da bilir. Hiçbir yaprak düşmez ki onu bilmesin…', k:'İlim', yasak:['Kader','Kudret','Kadir'], a:'Ayet, Allah’ın görünen ve görünmeyen her şeyi bildiğini, yani ilim sıfatını anlatır.' },
  { id:'saffat96', tur:'Ayet', kay:'Sâffât suresi, 96. ayet', m:'“Oysa Allah sizi de, yaptığınız şeyleri de yaratmıştır.”', k:'Halk', yasak:['Kudret','Kadir','Külli irade'], a:'İnsanın yaptığı fiilleri de yaratanın Allah olması halk kavramıdır; insan seçer ve yönelir (kesb), Allah yaratır (halk).' },
  { id:'bakara285', tur:'Ayet', kay:'Bakara suresi, 285. ayet', m:'Peygamber, Rabbinden kendisine indirilene iman etti, mü’minler de (iman ettiler). Her biri; Allah’a, meleklerine, kitaplarına ve peygamberlerine iman ettiler…', k:'Âmenerrasûlü', yasak:['Dua','Teslimiyet'], a:'Bakara suresinin iman esaslarını ve duaları içeren son iki ayeti (285-286), ilk kelimelerinden dolayı Âmenerrasûlü diye bilinir.' },
  { id:'sems7', tur:'Ayet', kay:'Şems suresi, 7-9. ayetler', m:'Nefse ve onu düzgün bir biçimde şekillendirip ona kötülük duygusunu ve takvasını (kötülükten sakınma yeteneğini) ilham edene andolsun ki, nefsini arındıran kurtuluşa ermiştir.', k:'Tefrik', yasak:['Hidayet','Hayır','Şer','İrade'], a:'İnsana kötülüğü ve ondan sakınmayı ayırt edebilme yeteneğinin verilmesi, farklı durumlar arasındaki ayrımı anlayabilme (tefrik) yeteneğidir.' }
];

/* Metne özel ek yasaklar: metin bu kavramla da açıklanabileceği için seçeneğe konmaz. */
var EK_YASAK = {
  sura30:['Sorumluluk','İmtihan','Kader','Kaza','Şer','Sebep–sonuç'], zariyat58:['Kudret','Kadir'],
  insan3:['İrade','Tercih','Dalalet','Özgürlük','Temyiz','Tefrik','Hayır','Şer'],
  beled8:['Hidayet','İrade','Tercih','Hayır','Şer','Özgürlük'], bakara286:['Sorumluluk','Kesb','İrade','Dua'],
  muddessir38:['Sorumluluk','Mükellef','Çaba'], kehf29:['Özgürlük','Hürriyet','Dalalet','Hidayet','Sorumluluk'],
  necm39:['Çaba','Sorumluluk','Kesb','Sünnetullah'],
  kamer49:['Halk','Kudret','Kadir','İlim'], furkan2:['Halk','Kudret','Kadir','İlim'], hicr21:['Rezzak','Halk'], hadid22:['İlim','Afet','Kaza'],
  bakara117:['Kudret','Kadir','Halk','Külli irade'], ahzab38:['Külli irade'], kasas56:['Hidayet','Dalalet','Kudret','Kadir'],
  rahman5:['Kader'], ahzab62:['Kader'], mulk21:['Kudret','Kadir'], hud6:['Kader','İlim'], cuma10:['Çaba'], buyu15:['Kesb','Rezzak'],
  imran145:['Halk','İlim'], mulk2:['Halk','Ömür','Ecel'], enbiya35:['Hayır','Şer','Ecel'], bakara216:['Hayır','Şer','İlim','Rıza','Kader'],
  fatiha6:['Hidayet','Dalalet'], rad11:['Sebep–sonuç','Özgürlük'], omer:['Sebep–sonuç'], deve:['Sebep–sonuç'], tedavi:['Sebep–sonuç'],
  akilli:['Temyiz','Tefrik','Mükellef','Kesb'], rum41:['Afet','Sebep–sonuç','Kesb','Mükellef'], tevbe51:['İlim'], kader34:['Kesb'],
  bakara155:['Afet','Şer'], bakara153:['Dua'], bakara156:['Sabır','Rıza','Kader'], ahzab3:['Dua'], aliimran159:['İrade'], talak3:['Kader','Rızık']
};

/* Havuz: etkinlik metinleri (DEGISTIR uygulanmış) + ek metinler */
var HAVUZ = A.havuz.filter(function(h){ return CIKAR.indexOf(h.id)<0; }).map(function(h){
  var dg = DEGISTIR[h.id];
  return { id:h.id, tur:h.tur, kay:h.kay, m:h.m, k:dg?dg.k:h.k,
           yasak:(dg?[h.k]:[]).concat(h.kabul||[], EK_YASAK[h.id]||[]),
           a: dg ? dg.a : (h.gerekce && h.gerekce[0] ? h.gerekce[0][0] : '') };
}).concat(EK);

function grupYasak(k){ var y=[]; GRUP.forEach(function(g){ if(g.indexOf(k)>=0) y=y.concat(g); }); return y; }
function soruYap(h){
  var yasak=[h.k].concat(h.yasak||[], grupYasak(h.k));
  var yakin=karistir((YAKIN[h.k]||[]).filter(function(k){ return yasak.indexOf(k)<0; }));
  var diger=karistir(TUM.filter(function(k){ return yasak.indexOf(k)<0 && yakin.indexOf(k)<0; }));
  return { tur:h.tur, metin:h.m, kaynak:h.kay, dogru:h.k, yanlislar:yakin.concat(diger), aciklama:h.a };
}
/* Her denemede: her kavramdan en az bir soru, kalanlar rastgele (N soru). */
function soruSeti(N){
  var gore={}; HAVUZ.forEach(function(h){ (gore[h.k]=gore[h.k]||[]).push(h); });
  var secilen=[];
  Object.keys(gore).forEach(function(k){ secilen.push(karistir(gore[k])[0]); });
  var kalan=karistir(HAVUZ.filter(function(h){ return secilen.indexOf(h)<0; }));
  return karistir(secilen.concat(kalan).slice(0,N)).map(soruYap);
}

window.DENEME_U1 = { havuz:HAVUZ, tum:TUM, soruYap:soruYap, soruSeti:soruSeti };

window.UniteDenemesi.kur({
  kap:'#denemeKap',
  anahtar:'dk11-u1-deneme',
  ust:'Ayet – Hadis – Kavram',
  baslik:'Konuya Başlarken Kendini Dene',
  aciklama:'“Kader, İrade ve Sorumluluk” konusunda geçen bütün kavramları ne kadar biliyorsun? Her soruda bir ayet ya da hadis var; ait olduğu kavramı beş seçenekten seç. Her doğru 2 puan. Sonuçta doğru cevapları ve açıklamalarını görüp konuya geçebilirsin.',
  secenekSayisi:5, toplamPuan:100, soruSayisi:50,
  konuHedef:'#giris',
  konuAdi:'Kader, İrade ve Sorumluluk',
  sorular:soruSeti
});
})();
