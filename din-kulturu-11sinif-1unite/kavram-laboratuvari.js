/* =====================================================================
   ⚖️ KAVRAM LABORATUVARI — 11. Sınıf 1. Ünite: Kader, İrade ve Sorumluluk
   ---------------------------------------------------------------------
   index.html#kavram-lab içine yerleşir. Sayfanın mevcut kodlarına
   dokunmaz; kendi kapsamı (IIFE) içinde çalışır.

   İÇERİK AYRIMI (önemli):
   • KL_CIKTI → Resmî MEB metni (TYMM DKAB 11. sınıf 1. ünite öğrenme
     çıktıları; bkz. ../ortak/meb-program.js). Ekranda yalnızca
     "MEB çıktısı" etiketiyle, koduyla ve resmî adıyla gösterilir.
   • Kavram açıklamaları, etkinlikler, "amac" ve geri bildirimler PORTAL
     tarafından, ünite sayfasındaki ders kitabı özetinden hareketle
     hazırlanmıştır; resmî kazanım olarak sunulmaz.
   • İlerleme göstergesi "Portal öğrenme ilerlemesi"dir; cihazda tutulur,
     resmî ölçme sonucu değildir.

   Etkinlik veri yapısı (normalize edilmiş hâli window.KAVRAM_LAB.etkinlikler):
   { id, kavram:[…], amac, beceri, deger, ogrenmeCiktisi, etkinlikTuru,
     zorluk:'temel'|'gelistir'|'derin', olcmeTuru, geriBildirim, boyut, adim }
   ===================================================================== */
(function(){
'use strict';

/* ---------- Resmî MEB öğrenme çıktıları (olduğu gibi) ---------- */
var KL_CIKTI = {
  'DKAB.11.1.1':'Kader ve kaderle ilgili kavramları yapılandırabilme',
  'DKAB.11.1.2':'İnsan, akıl, irade ve sorumluluk kavramları arasındaki ilişki hakkında eleştirel düşünebilme',
  'DKAB.11.1.3':'Bakara suresi 286. ayetin mesajlarını özetleyebilme'
};

/* ---------- 5 boyut (portal öğrenme ilerlemesi) ---------- */
var BOYUTLAR = [
  ['tanima','Kavramı tanıyor'],
  ['ayirt','Kavramı ayırt ediyor'],
  ['iliski','Kavramı ilişkilendiriyor'],
  ['ornek','Kavramı örneklendiriyor'],
  ['analiz','Kavramı analiz ediyor']
];
var ZORLUK = { temel:'🟢 Temel', gelistir:'🟡 Geliştir', derin:'🔴 Derin Düşün' };
var ZORLUK_ACIKLAMA = { temel:'Kavramı tanı.', gelistir:'Kavramı ayırt et ve ilişkilendir.', derin:'Bir olayda birden fazla kavramı birlikte analiz et.' };

/* ---------- KAVRAM HAVUZU (portal açıklamaları) ---------- */
var K = {
  kader:{ ad:'Kader', cikti:'DKAB.11.1.1',
    aciklama:'Allah’ın (cc) ezelî ilmiyle olacak her şeyi bilmesi, ölçü ve plan dâhilinde takdir etmesi.',
    anahtar:['ezelî ilim','takdir','ölçü','plan'],
    karisan:'kaza',
    fark:'Kader olacakların bilinip ölçüye göre belirlenmesidir; kaza bu takdirin zamanı gelince gerçekleşmesidir. Kader plan, kaza o planın hayata geçmesidir.',
    ornek:'Bir tohumun hangi şartlarda nasıl bir ağaca dönüşeceğinin ölçüsünün belirlenmiş olması.',
    bag:[['kaza','Takdir edilen, zamanı gelince gerçekleşir.'],['irade','Kader, insana seçme gücü verilmesini de kapsar; bilmek zorlamak değildir.'],['ecel','Ömrün süresi Allah’ın takdiridir.'],['rizik','Rızkı takdir eden Allah’tır.']] },
  kaza:{ ad:'Kaza', cikti:'DKAB.11.1.1',
    aciklama:'Takdir edilen şeyin zamanı gelince gerçekleşmesi; hüküm, karar.',
    anahtar:['gerçekleşme','zamanı gelince','hüküm'],
    karisan:'kader',
    fark:'Günlük dilde “kaza” talihsiz bir olay (trafik kazası gibi) anlamında kullanılır. Dinî terim olarak kaza, iyi ya da kötü her takdirin gerçekleşmesidir. Kader plan, kaza gerçekleşmedir.',
    ornek:'Aylardır beklenen sınav sonucunun açıklandığı an: takdir edilen sonuç gerçekleşmiştir.',
    bag:[['kader','Kaza, kaderin gerçekleşmesidir.'],['teslimiyet','Gerçekleşen sonuca gönülden razı olmak teslimiyettir.']] },
  akil:{ ad:'Akıl', cikti:'DKAB.11.1.2',
    aciklama:'İnsanın doğruyu yanlıştan, iyiyi kötüden ayırmasını sağlayan yeti; temyiz ve tefrik kabiliyeti. Sorumluluğun ön şartıdır.',
    anahtar:['temyiz','tefrik','ayırt etme','değerlendirme'],
    karisan:'irade',
    fark:'Akıl seçenekleri tartar ve değerlendirir; irade bunlardan birini seçer. Akıl “Ne doğru?”, irade “Ne yapacağım?” sorusunu cevaplar.',
    ornek:'Sınav haftasında telefonun dikkatini dağıttığını fark edip bunun zararını görmek.',
    bag:[['irade','Akıl tartar, irade seçer.'],['sorumluluk','Aklı olmayan kişi dinen sorumlu tutulmaz (mükellefiyetin şartı).'],['ozgurluk','Özgürlüğün sınırlarını akıl kavrar.']] },
  irade:{ ad:'İrade', cikti:'DKAB.11.1.2',
    aciklama:'İnsanın seçenekler arasında tercih yapabilme gücü (cüz’î irade). Sorumluluğun temelidir.',
    anahtar:['tercih','seçme gücü','cüz’î irade','kesb'],
    karisan:'sorumluluk',
    fark:'İrade seçme gücüdür; sorumluluk bu seçimin ve sonuçlarının hesabını vermektir. İrade kullanılınca sorumluluk doğar; irade yoksa sorumluluk da olmaz.',
    ornek:'Telefonu bırakıp derse başlamaya karar vermek.',
    bag:[['akil','Aklın tarttığı seçeneklerden birini irade seçer.'],['sorumluluk','Seçen, seçiminin sonucunu üstlenir.'],['ozgurluk','İrade, dış zorlama olmadan kullanılabildiğinde özgürlükten söz edilir.']] },
  ozgurluk:{ ad:'Özgürlük', cikti:'DKAB.11.1.2',
    aciklama:'İradeyi dış zorlama olmadan kullanabilmek. Sınırsız değildir; başkalarının hakları, ahlaki değerler ve hukukla sınırlıdır.',
    anahtar:['zorlama yokluğu','karar verme','sınır','hürriyet'],
    karisan:'irade',
    fark:'İrade insanın içindeki seçme gücüdür; özgürlük bu gücün dış baskı olmadan kullanılabilmesidir. Zorla bir şey yaptırılan kişinin iradesi vardır ama o anda özgür değildir; bu yüzden sorumluluğu da azalır.',
    ornek:'Sosyal medyada görüş bildirmek özgürlüktür; bir arkadaşının fotoğrafını izinsiz paylaşmak özgürlüğün sınırını aşmaktır.',
    bag:[['sorumluluk','Özgürlük olmadan sorumluluk olmaz; sorumluluk da özgürlüğü sınırlar.'],['irade','Özgürlük, iradenin baskısız kullanılmasıdır.']] },
  sorumluluk:{ ad:'Sorumluluk', cikti:'DKAB.11.1.2',
    aciklama:'İnsanın özgür iradesiyle yaptığı tercihlerin ve davranışların sonuçlarını üstlenmesi. Akıl, irade ve güç ölçüsündedir (Bakara 286).',
    anahtar:['üstlenmek','hesap vermek','güç yetmesi','mükellef'],
    karisan:'irade',
    fark:'Sorumluluk, iradenin kullanılmasıyla doğar. İrade “seçebilirim” demektir; sorumluluk “seçimimin hesabını veririm” demektir. Sorumluluk sonuca göre değil, tercih ve çabaya göre ölçülür.',
    ornek:'Kırdığı camın parasını ödemek; yanlış bir paylaşımı kaldırıp özür dilemek.',
    bag:[['irade','İrade olmadan sorumluluk olmaz.'],['akil','Akıl, sorumluluğun ön şartıdır.'],['tedbir','Tedbir almak insanın sorumluluğudur.']] },
  ecel:{ ad:'Ecel', cikti:'DKAB.11.1.1',
    aciklama:'Varlıklar için belirlenen sürenin sonu, ölüm anı. Öne alınamaz, geri bırakılamaz (A‘râf 34).',
    anahtar:['sürenin sonu','ölüm anı','belirlenmiş vakit'],
    karisan:'omur',
    fark:'Ömür yaşanan sürenin tamamıdır; ecel bu sürenin bittiği andır. Ömür bir yolsa, ecel o yolun son noktasıdır.',
    ornek:'İnsan ecelinin ne zaman geleceğini bilmediği için emniyet kemeri takmak gibi tedbirleri almakla sorumludur.',
    bag:[['omur','Ecel, ömrün sona erdiği andır.'],['tedbir','Ecel bilinmediği için tedbir sorumluluğu sürer.'],['kader','Ecel, Allah’ın takdiridir.']] },
  omur:{ ad:'Ömür', cikti:'DKAB.11.1.1',
    aciklama:'Doğumla ölüm arasında geçen süre; insana verilmiş bir imkân ve emanet.',
    anahtar:['yaşanan süre','zaman','emanet'],
    karisan:'ecel',
    fark:'Ömür süredir, ecel o sürenin sonudur. İnsan ömrünün uzunluğunu değil, onu nasıl değerlendireceğini seçer ve bundan sorumludur.',
    ornek:'Gençlik yıllarını plansız harcamak yerine bir hedef için değerlendirmek.',
    bag:[['ecel','Ömrün sonu eceldir.'],['sorumluluk','Ömrü nasıl değerlendirdiğinden insan sorumludur.']] },
  rizik:{ ad:'Rızık', cikti:'DKAB.11.1.1',
    aciklama:'Allah’ın (cc) canlılara verdiği maddi ve manevi tüm nimetler. Veren Allah’tır (Rezzak); insan helal yoldan çalışmakla sorumludur.',
    anahtar:['nimet','helal kazanç','Rezzak','çalışma'],
    karisan:'kader',
    fark:'Rızkın takdiri Allah’a aittir; bu, insanın çalışma sorumluluğunu kaldırmaz. “Rızkım nasılsa yazılmış” deyip çalışmamak, kaderi tembelliğe bahane etmektir.',
    ornek:'Sağlık, bilgi, arkadaşlık ve helal yoldan elde edilen kazanç.',
    bag:[['kader','Rızkı takdir eden Allah’tır.'],['sorumluluk','Rızkı helal yoldan aramak insanın görevidir.']] },
  tevekkul:{ ad:'Tevekkül', cikti:'DKAB.11.1.1',
    aciklama:'Gerekli tedbiri alıp elinden geleni yaptıktan sonra sonucu Allah’a (cc) bırakmak ve O’na güvenmek.',
    anahtar:['güven','tedbirden sonra','sonucu bırakmak','süreç'],
    karisan:'teslimiyet',
    fark:'Tevekkül, sonuç ortaya çıkmadan önce, sürecin sonunda Allah’a güvenmektir. Teslimiyet, sonuç ortaya çıktıktan sonra onu gönülden kabullenmektir.',
    ornek:'Başvuru dosyasını eksiksiz hazırladıktan sonra dua edip sonucu Allah’a bırakmak.',
    bag:[['tedbir','Tevekkül tedbirden sonra gelir.'],['teslimiyet','Tevekkül sonuçtan önce, teslimiyet sonuçtan sonradır.']] },
  teslimiyet:{ ad:'Teslimiyet', cikti:'DKAB.11.1.1',
    aciklama:'Allah’ın (cc) takdirine gönülden boyun eğmek; ortaya çıkan sonucu isyan etmeden kabullenmek. Pasiflik değildir.',
    anahtar:['kabullenmek','rıza','sonuçtan sonra','isyan etmemek'],
    karisan:'tevekkul',
    fark:'Teslimiyet sonuçtan sonraki gönül hâlidir; tevekkül sonuçtan önceki güvendir. Teslimiyet ders çıkarmayı ve yeniden çabalamayı engellemez.',
    ornek:'Elinden geleni yaptığı hâlde kaybedilen maçı isyan etmeden kabullenip yeniden antrenmana başlamak.',
    bag:[['kaza','Gerçekleşen takdire razı olmaktır.'],['tevekkul','Tevekkülün ardından gelir.']] },
  tedbir:{ ad:'Tedbir', cikti:'DKAB.11.1.2',
    aciklama:'Olası zararlara karşı önlem almak, sebeplere uymak. Tevekkülün ön şartıdır.',
    anahtar:['önlem','sebeplere uymak','hazırlık','risk'],
    karisan:'tevekkul',
    fark:'Tedbir insanın yapması gerekendir; tevekkül tedbirden sonra sonucu Allah’a bırakmaktır. Tedbirsiz “tevekkül”, tevekkül değil tembellik ya da kendini tehlikeye atmaktır (Bakara 195).',
    ornek:'Deprem çantası hazırlamak, oturduğu binayı denetletmek.',
    bag:[['tevekkul','Tedbirden sonra tevekkül gelir.'],['sorumluluk','Tedbir almak insanın sorumluluğudur.'],['ecel','Ecel bilinmediği için tedbir sürer.']] }
};
var K_SIRA = ['kader','kaza','akil','irade','ozgurluk','sorumluluk','ecel','omur','rizik','tevekkul','teslimiyet','tedbir'];

/* ---------- Etkinlik türü varsayılanları (portal) ---------- */
var TUR = {
  tani:     { etkinlikTuru:'Kavramı tanıma (eşleştirme)', beceri:'KB2.13. Yapılandırma', deger:'D16. Sorumluluk', olcmeTuru:'Çoktan seçmeli, anında geri bildirim', boyut:'tanima', adim:1 },
  fark:     { etkinlikTuru:'Karşılaştırma (önce yaz, sonra aç)', beceri:'KB3.3. Eleştirel Düşünme', deger:'D16. Sorumluluk', olcmeTuru:'Açık uçlu + öz değerlendirme', boyut:'ayirt', adim:2 },
  bul:      { etkinlikTuru:'Olayda kavramı bulma', beceri:'KB3.3. Eleştirel Düşünme', deger:'D16. Sorumluluk', olcmeTuru:'Çoklu seçim + gerekçeli geri bildirim', boyut:'analiz', adim:3 },
  dedektif: { etkinlikTuru:'Kavram dedektifi (metinden kanıt)', beceri:'KB2.13. Yapılandırma', deger:'D16. Sorumluluk', olcmeTuru:'Etiketleme + kanıt eşleştirme', boyut:'analiz', adim:3 },
  zincir:   { etkinlikTuru:'Kavramlar zinciri (sıralama)', beceri:'KB2.13. Yapılandırma', deger:'D16. Sorumluluk', olcmeTuru:'Sıralama + kısa cevap', boyut:'iliski', adim:4 },
  coklu:    { etkinlikTuru:'Çok kavramlı açıklama', beceri:'KB3.3. Eleştirel Düşünme', deger:'D11. Özgürlük', olcmeTuru:'Açık uçlu + dereceli ölçüt (öz değerlendirme)', boyut:'analiz', adim:4 },
  ayet:     { etkinlikTuru:'Ayet–kavram eşleştirme', beceri:'KB2.13. Yapılandırma', deger:'D16. Sorumluluk', olcmeTuru:'Eşleştirme + gerekçeli geri bildirim', boyut:'iliski', adim:4 },
  yanilgi:  { etkinlikTuru:'Yanlış kader anlayışını yakala', beceri:'KB3.3. Eleştirel Düşünme', deger:'D16. Sorumluluk', olcmeTuru:'Doğru–yanlış + yanılgı teşhisi', boyut:'ayirt', adim:5 },
  hayat:    { etkinlikTuru:'Hayattan kavrama (senaryo)', beceri:'KB2.13. Yapılandırma', deger:'D5. Duyarlılık', olcmeTuru:'Çoklu seçim + “Neden?” açık uçlu', boyut:'ornek', adim:6 },
  ayniolay: { etkinlikTuru:'Aynı olay – farklı kavram', beceri:'KB3.3. Eleştirel Düşünme', deger:'D16. Sorumluluk', olcmeTuru:'Açık uçlu + öz değerlendirme', boyut:'ornek', adim:6 },
  cumle:    { etkinlikTuru:'Benim cümlem', beceri:'KB2.3. Özetleme', deger:'D16. Sorumluluk', olcmeTuru:'Yazılı ürün (tamamlama)', boyut:'ornek', adim:7 },
  tabu:     { etkinlikTuru:'Kavram Tabu (süreli)', beceri:'KB2.3. Özetleme', deger:'D16. Sorumluluk', olcmeTuru:'Süreli üretim + yasaklı kelime kontrolü', boyut:'tanima', adim:7 }
};

/* ---------- 2. AYIRT ET: kavramlar arasındaki fark ---------- */
var FARK = [
  { id:'fark-omur-ecel', a:'omur', b:'ecel', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1',
    benzer:'İkisi de insanın hayat süresiyle ilgilidir ve Allah’ın takdiri dâhilindedir.',
    farkli:'Ömür doğumla ölüm arasındaki sürenin tamamıdır; ecel bu sürenin sona erdiği andır.',
    ornek:'“Ömrümü boşa harcamayacağım” bir süreyi değerlendirmekle ilgilidir. “Ecelimi bilmiyorum, o yüzden tedbirli olurum” sürenin sonuyla ilgilidir.' },
  { id:'fark-kader-kaza', a:'kader', b:'kaza', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1',
    benzer:'İkisi de Allah’ın ilim, irade ve kudretiyle ilgilidir; birlikte “kaza ve kader” olarak anılır.',
    farkli:'Kader, olacakların ezelde bilinip ölçüye göre takdir edilmesidir; kaza, bu takdirin zamanı gelince gerçekleşmesidir.',
    ornek:'Bir binanın hangi şartlarda ayakta kalacağının ölçüsü kaderle, depremin olduğu an gerçekleşen sonuç kazayla ilgilidir.' },
  { id:'fark-irade-sorumluluk', a:'irade', b:'sorumluluk', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2',
    benzer:'İkisi de insanın davranışlarıyla ilgilidir ve insanı diğer canlılardan ayıran özelliklerdir.',
    farkli:'İrade seçme gücüdür; sorumluluk bu seçimin ve sonuçlarının hesabını vermektir. İrade sebep, sorumluluk onun doğurduğu sonuçtur.',
    ornek:'Ödev yerine oyun oynamayı seçmek iradeyi, ertesi gün ödevin yapılmamasının hesabını vermek sorumluluğu gösterir.' },
  { id:'fark-tedbir-tevekkul', a:'tedbir', b:'tevekkul', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.1',
    benzer:'İkisi de bir hedefe ulaşma sürecinin parçasıdır ve birbirini tamamlar.',
    farkli:'Tedbir insanın alması gereken önlemdir; tevekkül tedbirden sonra sonucu Allah’a bırakıp O’na güvenmektir. Tedbir olmadan tevekkül olmaz.',
    ornek:'Bisikleti kilitlemek tedbirdir; kilitledikten sonra endişeye kapılmadan Allah’a güvenmek tevekküldür.' },
  { id:'fark-tevekkul-teslimiyet', a:'tevekkul', b:'teslimiyet', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.1',
    benzer:'İkisi de Allah’a güvenme ve O’nun takdirine saygı duyma tutumudur; ikisi de insanın elinden geleni yapmasıyla birlikte anlam kazanır.',
    farkli:'Tevekkül sonuç ortaya çıkmadan önce, sürecin sonunda Allah’a güvenmektir. Teslimiyet sonuç ortaya çıktıktan sonra onu isyan etmeden kabullenmektir.',
    ornek:'Maçtan önce iyi hazırlanıp “Gerisi Allah’a kalmış” demek tevekküldür. Maç kaybedildikten sonra itiraz etmeden yeniden çalışmaya başlamak teslimiyettir.' }
];

/* ---------- 3. OLAYDA KAVRAMI BUL ---------- */
var BUL = [
  { id:'bul-ali', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1',
    metin:'Ali sınava hiç çalışmadı. “Nasıl olsa kaderimde varsa kazanırım.” dedi.',
    secenekler:['kader','irade','sorumluluk','tedbir','tevekkul','ecel','rizik'],
    gerekli:['kader','irade','sorumluluk'], kabul:['tedbir','tevekkul'],
    neden:{ kader:'Ali kaderi, çalışmamasının bahanesi yapıyor.', irade:'Çalışmamak Ali’nin kendi tercihidir.', sorumluluk:'Tercihinin sonucundan Ali sorumludur.', tedbir:'Çalışmak, sınav için alınacak tedbirdir; Ali bunu almamış.', tevekkul:'Ali’nin sözü tevekkül gibi görünse de tedbirsiz güven tevekkül değildir.', ecel:'Olayda ömrün sonuyla ilgili bir durum yok.', rizik:'Olay rızıkla değil sınav hazırlığıyla ilgili.' },
    yanlisKavram:['kader','tevekkul'],
    dogruGB:'İnsan, tercihleri ve eylemleri nedeniyle sorumluluk sahibidir. Allah’ın bilmesi Ali’yi çalışmamaya zorlamaz.',
    yanlisGB:'Burada kader, çalışmamanın bahanesi yapılmış; tevekkül de tedbirsizlikle karıştırılmıştır.' },
  { id:'bul-mert', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1',
    metin:'Mert, “Rızkım nasılsa yazılmış.” diyerek iş aramayı bıraktı.',
    secenekler:['rizik','kader','irade','sorumluluk','ecel','teslimiyet'],
    gerekli:['rizik','kader'], kabul:['irade','sorumluluk'],
    neden:{ rizik:'Olay doğrudan rızık anlayışıyla ilgili.', kader:'“Yazılmış” sözü kader inancına dayanıyor.', irade:'İş aramayı bırakmak Mert’in tercihidir.', sorumluluk:'Helal yoldan çalışmak insanın sorumluluğudur.', ecel:'Olayda ömrün sonuyla ilgili bir durum yok.', teslimiyet:'Ortada kabullenilecek bir sonuç yok; Mert süreci baştan bırakıyor.' },
    yanlisKavram:['rizik','kader'],
    dogruGB:'Rızkı veren Allah’tır; bu, insanın helal yoldan çalışma sorumluluğunu kaldırmaz.',
    yanlisGB:'Rızkın takdiri, çalışmamanın gerekçesi yapılmış. Takdir, sebeplere uymayı ortadan kaldırmaz.' },
  { id:'bul-selin', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2',
    metin:'Selin kırmızı ışıkta karşıya geçerken bir bisikletliye çarptı. “Olacağı varmış.” dedi.',
    secenekler:['irade','sorumluluk','tedbir','kader','kaza','rizik','omur'],
    gerekli:['irade','sorumluluk','tedbir'], kabul:['kader','kaza'],
    neden:{ irade:'Kırmızı ışıkta geçmek Selin’in tercihidir.', sorumluluk:'Tercihinin yol açtığı zarardan Selin sorumludur.', tedbir:'Trafik kurallarına uymak temel bir tedbirdir; alınmamış.', kader:'“Olacağı varmış” sözüyle kader, sorumluluktan kaçmak için kullanılmış.', kaza:'Olay gerçekleşmiştir; ama terim olarak kaza, insanın tercihinin sonucunu ortadan kaldırmaz.', rizik:'Olay rızıkla ilgili değil.', omur:'Olay ömrün değerlendirilmesiyle doğrudan ilgili değil.' },
    yanlisKavram:['kader'],
    dogruGB:'Kurala uymamak bir tercihtir; sonucundan tercihi yapan sorumludur.',
    yanlisGB:'“Olacağı varmış” diyerek kendi tercihinin sonucu kadere yüklenmiş. Bu, yanlış kader anlayışının tipik bir örneğidir.' },
  { id:'bul-emre', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.1',
    metin:'Emre, doktorun verdiği ilacı kullanmadı. “Şifayı veren Allah, ilaç ne işe yarar?” dedi.',
    secenekler:['tevekkul','tedbir','sorumluluk','kader','ecel','rizik','ozgurluk'],
    gerekli:['tevekkul','tedbir'], kabul:['sorumluluk','kader'],
    neden:{ tevekkul:'Emre’nin sözü tevekküle dayanıyor ama yanlış anlaşılmış.', tedbir:'Tedavi olmak sağlık için alınması gereken tedbirdir.', sorumluluk:'Sağlığını korumak insanın sorumluluğudur.', kader:'Şifanın Allah’tan olması kader inancıyla ilgilidir.', ecel:'Olayda ecel doğrudan konu edilmiyor.', rizik:'Sağlık bir nimettir ama olayın odağı tedavi ve tedbirdir.', ozgurluk:'İlacı kullanmamak özgür bir seçim gibi görünse de olayın asıl sorunu tevekkül anlayışıdır.' },
    yanlisKavram:['tevekkul'],
    dogruGB:'Şifayı veren Allah’tır; tedavi olmak ise sebeplere uymaktır. Tedbir ve tevekkül birlikte olur.',
    yanlisGB:'Tevekkül, tedbiri terk etmek sanılmış. Hz. Peygamber hastalara tedavi olmalarını tavsiye etmiştir.' },
  { id:'bul-belediye', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2',
    metin:'Deprem bölgesindeki bir belediye eski binaları denetleyip güçlendirdi, halka afet eğitimi verdi. Deprem olduğunda can kaybı çok az oldu.',
    secenekler:['tedbir','sorumluluk','akil','kader','tevekkul','ecel','rizik'],
    gerekli:['tedbir','sorumluluk'], kabul:['akil','kader','tevekkul'],
    neden:{ tedbir:'Denetim, güçlendirme ve eğitim tedbirdir.', sorumluluk:'Belediye kamu sorumluluğunu yerine getirmiş.', akil:'Riski görüp önceden plan yapmak aklın işidir.', kader:'Depremin olması insanın elinde değildir; takdir dâhilindedir.', tevekkul:'Tedbirden sonra sonucu Allah’a bırakmak tevekküldür.', ecel:'Ecel konu edilse de olayın odağı alınan önlemlerdir.', rizik:'Olay rızıkla ilgili değil.' },
    yanlisKavram:['yok'],
    dogruGB:'Bu olayda kavramlar doğru kullanılmış: Doğa olayı insanın elinde değildir, onun afete dönüşmesini önlemek insanın sorumluluğudur.',
    yanlisGB:'Bu olayda yanlış anlaşılan bir kavram yok. Tedbir alınmış, sorumluluk yerine getirilmiş.' },
  { id:'bul-zeynep', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.2',
    metin:'Zeynep üniversite tercihlerini yaparken puanını, ilgi alanlarını ve şehirleri araştırdı, ailesine danıştı. Listesini gönderdikten sonra “Üzerime düşeni yaptım, gerisi Allah’a kalmış.” dedi. Beşinci tercihine yerleşti ve isyan etmeden yeni okuluna hazırlanmaya başladı.',
    secenekler:['irade','tevekkul','teslimiyet','akil','tedbir','ecel','rizik'],
    gerekli:['irade','tevekkul','teslimiyet'], kabul:['akil','tedbir','rizik'],
    neden:{ irade:'Tercih listesini kendi seçimiyle oluşturmuş.', tevekkul:'Üzerine düşeni yaptıktan sonra sonucu Allah’a bırakmış.', teslimiyet:'Sonuç ortaya çıktıktan sonra isyan etmeden kabullenmiş.', akil:'Araştırıp değerlendirme yapmak aklın işidir.', tedbir:'Araştırmak ve danışmak tedbirdir.', rizik:'Eğitim imkânı da manevi rızık sayılabilir; ama olayın odağı değildir.', ecel:'Olayda ecelle ilgili bir durum yok.' },
    yanlisKavram:['yok'],
    dogruGB:'Tercih, tedbir, tevekkül ve teslimiyet doğru sırayla yaşanmış. Teslimiyet yeniden çabayı engellemiyor.',
    yanlisGB:'Bu olayda kavramlar doğru kullanılmış: önce tedbir ve tercih, sonra tevekkül, en son teslimiyet.' }
];

/* ---------- 3. KAVRAM DEDEKTİFİ ---------- */
var DEDEKTIF = [
  { id:'ded-mehmet', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.2',
    cumleler:['Mehmet sınava hazırlanmak için plan yaptı.','Düzenli çalıştı.','Eksiklerini tamamladı.','Sınav günü gerekli hazırlıklarını yaptı.','Sonucu Allah’a bıraktı.'],
    etiketler:['akil','irade','tedbir','caba','tevekkul','sorumluluk','ecel'],
    kanit:{ akil:[0], irade:[0,1], tedbir:[3,2], caba:[1,2], tevekkul:[4], sorumluluk:[1,2,3,0] },
    tuzak:{ ecel:'Metinde ömrün sonuyla ilgili bir ifade yok.' },
    geriBildirim:'Plan yapmak aklı, düzenli çalışmak iradeyi ve çabayı, hazırlıklar tedbiri, sonucu Allah’a bırakmak tevekkülü gösterir. Bu adımların tamamı Mehmet’in sorumluluğunu yerine getirmesidir.' },
  { id:'ded-elif', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2',
    cumleler:['Elif, bir arkadaşının fotoğrafını izinsiz paylaşmak üzereydi.','Paylaşmadan önce durup bunun arkadaşını üzebileceğini düşündü.','Fotoğrafı paylaşmamaya karar verdi.','Daha önce izinsiz paylaştığı bir gönderiyi de silip arkadaşından özür diledi.'],
    etiketler:['akil','irade','ozgurluk','sorumluluk','kaza','tevekkul'],
    kanit:{ akil:[1], irade:[2], ozgurluk:[0,2], sorumluluk:[3] },
    tuzak:{ kaza:'Metinde gerçekleşen bir takdir değil, Elif’in tercihleri anlatılıyor.', tevekkul:'Metinde sonucu Allah’a bırakma ifadesi yok.' },
    geriBildirim:'Elif paylaşma özgürlüğünün bir sınırı olduğunu aklıyla fark etti, iradesiyle vazgeçti ve geçmişteki hatasının sorumluluğunu üstlendi.' },
  { id:'ded-aile', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.1',
    cumleler:['Bir aile, evlerinin deprem yönetmeliğine uygun olup olmadığını uzmanlara kontrol ettirdi.','Dolapları duvara sabitledi, deprem çantası hazırladı.','Deprem olduğunda evde kimse yaralanmadı ama evin camları kırıldı.','Aile, “Tedbirimizi aldık; bu da Allah’ın takdiri.” diyerek kırılan camları onarttı.','Komşularına da evlerini kontrol ettirmeleri için yardım etti.'],
    etiketler:['akil','tedbir','kaza','teslimiyet','sorumluluk','tevekkul','ecel'],
    kanit:{ akil:[0], tedbir:[0,1], kaza:[2], teslimiyet:[3], sorumluluk:[4,3] },
    tuzak:{ tevekkul:'Dikkat: Tevekkül sonuçtan önceki güvendir. Metinde sonuçtan sonraki kabullenme, yani teslimiyet anlatılıyor.', ecel:'Metinde ölümle ilgili bir ifade yok.' },
    geriBildirim:'Uzmana danışmak akıl ve tedbir, hazırlıklar tedbir, depremin olması ve sonucun gerçekleşmesi kaza, sonucu kabullenip onarım yapmak teslimiyet, komşulara yardım sorumluluk bilincidir.' }
];
var EK_ETIKET = { caba:'Çaba' };

/* ---------- 4. KAVRAMLAR ZİNCİRİ ---------- */
var ZINCIR = [
  { id:'zin-omur', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['omur','ecel'],
    ogeler:['Doğum','Ömür (yaşanan süre)','Ecel (sürenin sonu)'],
    esdeger:[],
    model:'Ömür doğumla başlayan süredir; ecel bu sürenin sona erdiği andır. İnsan ecelini bilmediği için ömrünü değerlendirmekten ve tedbir almaktan sorumludur.' },
  { id:'zin-tedbir', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['tedbir','tevekkul'],
    ogeler:['Tedbir','Çaba','Tevekkül'],
    esdeger:[[0,1]],
    model:'Tedbir ve çaba insanın üzerine düşendir ve birlikte yürür. Tevekkül ikisinden sonra gelir: Elinden geleni yapan insan sonucu Allah’a bırakır.' },
  { id:'zin-akil', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2', kavram:['akil','irade','sorumluluk'],
    ogeler:['Akıl','İrade','Tercih','Eylem','Sonuç','Sorumluluk'],
    esdeger:[],
    model:'Akıl seçenekleri tartar, irade birini seçer; tercih eyleme dönüşür, eylemin bir sonucu olur. İnsan bu sürecin tamamından sorumludur. Akıl ve irade olmadan sorumluluk doğmaz.' },
  { id:'zin-teslimiyet', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['tevekkul','teslimiyet'],
    ogeler:['Tedbir ve çaba','Tevekkül','Sonucun ortaya çıkması','Sonucu kabullenme (teslimiyet)','Ders çıkarıp yeniden çabalama'],
    esdeger:[],
    model:'Tevekkül sonuçtan önce, teslimiyet sonuçtan sonradır. Teslimiyet pasiflik değildir: Sonucu kabullenen insan ders çıkarır ve yeniden çabalar.' },
  { id:'zin-kader', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['kader','irade','tedbir','tevekkul','kaza','teslimiyet'],
    ogeler:['Kader (Allah’ın ezelî takdiri)','İrade (insanın tercihi)','Tedbir ve çaba','Tevekkül','Kaza (takdirin gerçekleşmesi)','Teslimiyet (sonuca razı olmak)'],
    esdeger:[],
    model:'Allah her şeyi ezelde bilir ve takdir eder; bu bilgi insanı zorlamaz. İnsan iradesiyle tercih yapar, tedbir alır ve çabalar; sonra tevekkül eder. Takdir edilen sonuç zamanı gelince gerçekleşir (kaza); insan ona teslimiyetle razı olur. İnsan sonuçtan değil, tercihinden ve çabasından sorumludur.' }
];

/* ---------- 4. ÇOK KAVRAMLI AÇIKLAMA (derin) ---------- */
var COKLU = [
  { id:'cok-kis', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.2', kavram:['kader','irade','sorumluluk'],
    soru:'Kader, irade ve sorumluluk arasındaki ilişkiyi kendi seçtiğin bir örnek üzerinden açıkla.',
    olcut:['Kaderi Allah’ın ezelî bilgisi ve takdiri olarak tanımladım.','Allah’ın bilmesinin insanı zorlamadığını belirttim.','İradeyi insanın seçme gücü olarak açıkladım.','Sorumluluğun tercihe ve çabaya bağlı olduğunu belirttim.','Açıklamamı somut bir örnekle destekledim.'],
    esik:4,
    model:'Örnek: Bir öğrencinin sınava çalışıp çalışmayacağı. Allah, öğrencinin ne seçeceğini ezelden bilir; bu bilgi onu zorlamaz, tıpkı hava durumunu bilen birinin yağmuru yağdırmaması gibi. Çalışmayı ya da çalışmamayı seçen öğrencinin kendi iradesidir. Bu yüzden öğrenci, sonucun tamamından değil, tercihinden ve gösterdiği çabadan sorumludur. Kader insanın sorumluluğunu kaldırmaz; sorumluluğun zemini iradedir.' },
  { id:'cok-iddia', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.3', kavram:['sorumluluk','akil','irade'],
    soru:'Bir arkadaşın “Kader varsa sorumluluk olmaz.” diyor. Bu iddiayı akıl, irade ve Bakara suresi 286. ayet bağlamında değerlendir.',
    olcut:['İddianın neden hatalı olduğunu açıkça söyledim.','Aklın sorumluluğun ön şartı olduğunu belirttim.','İradenin tercih imkânı verdiğini açıkladım.','Bakara 286’daki “gücün yettiği ölçüde sorumluluk” ilkesini kullandım.','Kaderin bilmek olduğunu, zorlamak olmadığını vurguladım.'],
    esik:4,
    model:'İddia hatalıdır. Kader Allah’ın bilmesi ve takdir etmesidir; bilmek zorlamak değildir. İnsan aklıyla doğruyu yanlıştan ayırır, iradesiyle seçer. Bakara 286’ya göre Allah kimseye gücünün yetmeyeceği bir yük yüklemez; sorumluluk insanın aklı, iradesi ve gücü ölçüsündedir. Demek ki sorumluluk, kaderle değil insanın tercih imkânıyla ilgilidir.' }
];

/* ---------- 4. AYET–KAVRAM EŞLEŞTİRME ----------
   Meal ve hadis metinleri dusun-karar-ver.html “Ayet ve Hadisi Yorumla”
   (AYETLER) etkinliğindekiyle birebir aynıdır; yeni meal yazılmamıştır.
   Eşleştirme cevapları ve açıklamalar portal tarafından hazırlanmıştır. */
var AYET_METIN = {
  bakara286:  { kisa:'Bakara 286', kay:'Bakara suresi, 286. ayet',
    m:'Allah bir kimseyi ancak gücünün yettiği şeyle yükümlü kılar. Onun kazandığı iyilik kendi yararına, kötülük de kendi zararınadır…' },
  sura30:     { kisa:'Şûrâ 30', kay:'Şûrâ suresi, 30. ayet',
    m:'Başınıza gelen herhangi bir musibet, kendi ellerinizle işledikleriniz yüzündendir. (Bununla beraber) O, çoğunu affeder.' },
  necm39:     { kisa:'Necm 39-40', kay:'Necm suresi, 39-40. ayetler',
    m:'Şüphesiz insan için kendi çalışmasından başka bir şey yoktur. Şüphesiz onun çalışması ileride görülecektir.' },
  rad11:      { kisa:'Ra‘d 11', kay:'Ra‘d suresi, 11. ayet',
    m:'…Bir toplum kendi durumunu değiştirmedikçe Allah onların durumunu değiştirmez…' },
  aliimran159:{ kisa:'Âl-i İmrân 159', kay:'Âl-i İmrân suresi, 159. ayet',
    m:'…İş hususunda onlarla istişare et. Karar verdiğin zaman da artık Allah’a tevekkül et. Şüphesiz Allah, tevekkül edenleri sever.' },
  deve:       { kisa:'“Deveni bağla” hadisi', kay:'Hz. Muhammed (sav) — Tirmizî, Sıfatü’l-kıyâme, 60',
    m:'Bir adam, “Ey Allah’ın Resulü! Devemi bağlayıp mı tevekkül edeyim, yoksa salıverip mi tevekkül edeyim?” diye sordu. Hz. Peygamber, “Onu bağla ve tevekkül et.” buyurdu.' },
  omer:       { kisa:'Hz. Ömer’in sözü', kay:'Hz. Ömer’in sözü — Buhârî, Tıb, 30; Müslim, Selâm, 98',
    m:'Veba salgını olan bir bölgeye girmekten vazgeçen Hz. Ömer’e “Allah’ın kaderinden mi kaçıyorsun?” denildi. O, “Evet, Allah’ın kaderinden yine Allah’ın kaderine kaçıyoruz.” cevabını verdi.' }
};
var AYET_ESLE = [
  { id:'ayet-kavram-1', mod:'kavram', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1',
    secenekler:['kader','irade','sorumluluk','caba','tedbir'],
    satirlar:[
      { a:'bakara286', ana:'sorumluluk', kabul:['irade'], neden:'Ayet, insanın ancak gücü ölçüsünde yükümlü olduğunu ve kazandığının karşılığını göreceğini bildirir. Sorumluluk güçle orantılıdır.' },
      { a:'necm39', ana:'caba', kabul:['sorumluluk'], neden:'Ayet “başarı” değil “çalışma” der. İnsanın asıl sahip olduğu ve karşılığını göreceği şey emeğidir.' },
      { a:'rad11', ana:'irade', kabul:[], neden:'Değişim insanın kendi iradesiyle başlar. Bekleyişle değil, kararla ve tercihle başlar.' },
      { a:'deve', ana:'tedbir', kabul:['tevekkul'], neden:'“Onu bağla ve tevekkül et.” Tedbir tevekkülün şartıdır; tedbirsiz güven tevekkül değildir.' }
    ] },
  { id:'ayet-kavram-2', mod:'kavram', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2',
    secenekler:['kader','irade','sorumluluk','tedbir','tevekkul','teslimiyet'],
    satirlar:[
      { a:'sura30', ana:'sorumluluk', kabul:['irade'], neden:'İnsanın tercih ve ihmalleri başına gelenlerde etkilidir. Ayet, insanı kendi payını görmeye çağırır.' },
      { a:'aliimran159', ana:'tevekkul', kabul:['irade'], neden:'Sıra açıktır: danışmak (istişare) → karar vermek → Allah’a güvenmek. Tevekkül, akıl ve iradenin kullanıldığı adımlardan sonra gelir.' },
      { a:'omer', ana:'tedbir', kabul:['kader'], neden:'Tedbir de kaderin içindedir. Tehlikeden korunmak kadere karşı gelmek değil, Allah’ın koyduğu yasalara uymaktır.' }
    ] },
  { id:'ayet-yanilgi', mod:'yanilgi', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.2',
    secenekler:['bakara286','necm39','rad11','deve','omer'],
    satirlar:[
      { cumle:'“Çalışmadım ama kaderimde varsa kazanırım.”', ana:'necm39', kavram:['kader','sorumluluk'],
        neden:'İnsan için kendi çalışmasından başka bir şey yoktur. Kader, çabayı gereksiz kılmaz.' },
      { cumle:'“Hiç tedbir almadan Allah’a güvenmek tevekküldür.”', ana:'deve', kavram:['tevekkul','tedbir'],
        neden:'Hz. Peygamber “Onu bağla ve tevekkül et.” buyurmuştur. Önce tedbir, sonra tevekkül.' },
      { cumle:'“Ben böyle yaratılmışım, değişemem.”', ana:'rad11', kavram:['irade'],
        neden:'Değişim insanın kendi durumunu değiştirmesiyle, yani iradesiyle başlar.' },
      { cumle:'“Tedbir almak kadere karşı gelmektir.”', ana:'omer', kavram:['tedbir','kader'],
        neden:'Hz. Ömer’in ifadesiyle “Allah’ın kaderinden yine Allah’ın kaderine” kaçılır; tedbir de kaderin içindedir.' },
      { cumle:'“Allah, insana taşıyamayacağı sorumluluklar yükler.”', ana:'bakara286', kavram:['sorumluluk'],
        neden:'Allah bir kimseyi ancak gücünün yettiği şeyle yükümlü kılar. Sorumluluk güç ölçüsündedir.' }
    ] }
];

/* ---------- 5. YANLIŞ KADER ANLAYIŞINI YAKALA ---------- */
var YANILGI = [
  { id:'yan-1', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['kader','sorumluluk'], dogru:false,
    cumle:'“Çalışmadım ama kaderimde varsa kazanırım.”',
    yanilgilar:['Kader, insanın çabasını gereksiz kılan bir zorunluluk gibi görülmüş.','Kader ile ecel karıştırılmış.','Rızık kavramı yanlış anlaşılmış.'], dogruYanilgi:0,
    aciklama:'Allah’ın bilmesi, insanı çalışıp çalışmamaya zorlamaz. Çalışmamak insanın kendi tercihidir ve sonucundan kendisi sorumludur (Necm 39).' },
  { id:'yan-2', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2', kavram:['kader','irade'], dogru:false,
    cumle:'“Nasıl olsa Allah biliyor, benim tercihimin önemi yok.”',
    yanilgilar:['Akıl ile irade karıştırılmış.','Allah’ın bilmesi, insanın tercihini ortadan kaldıran bir zorlama sanılmış.','Tevekkül ile teslimiyet karıştırılmış.'], dogruYanilgi:1,
    aciklama:'Bilmek zorlamak değildir. Allah insanın ne seçeceğini bilir ama seçen insandır; bu yüzden tercih önemlidir ve sorumluluk doğurur.' },
  { id:'yan-3', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['tevekkul','tedbir'], dogru:false,
    cumle:'“Hiç tedbir almadan Allah’a güvenmek tevekküldür.”',
    yanilgilar:['Tevekkül, teslimiyetle karıştırılmış.','Tedbir, sorumlulukla karıştırılmış.','Tevekkül, tedbirsizlikle karıştırılmış.'], dogruYanilgi:2,
    aciklama:'Tevekkül, tedbir alıp elinden geleni yaptıktan sonra sonucu Allah’a bırakmaktır. Devesini bağlayıp mı yoksa salıverip mi tevekkül edeceğini soran kişiye Hz. Peygamber “Onu bağla ve tevekkül et.” buyurmuştur (Tirmizî).' },
  { id:'yan-4', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.2', kavram:['sorumluluk','irade'], dogru:true,
    cumle:'“İnsan yaptığı tercihlerden sorumludur.”',
    aciklama:'İrade sahibi insan, tercihlerinin sonuçlarını üstlenir. Sorumluluk akıl, irade ve güç ölçüsündedir (Bakara 286).' },
  { id:'yan-5', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['tevekkul'], dogru:true,
    cumle:'“Üzerime düşeni yaptıktan sonra sonucu Allah’a bırakırım.”',
    aciklama:'Doğru tevekkül tam olarak budur: önce tedbir ve çaba, sonra Allah’a güven.' },
  { id:'yan-6', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['ecel','tedbir'], dogru:false,
    cumle:'“Ecelim ne zaman gelecekse o zaman gelir; emniyet kemeri takmama gerek yok.”',
    yanilgilar:['Ecelin bilinmediği ve tedbir sorumluluğunun sürdüğü göz ardı edilmiş.','Ömür ile rızık karıştırılmış.','Kaza ile kader karıştırılmış.'], dogruYanilgi:0,
    aciklama:'Ecel Allah’ın takdiridir ama insan ecelini bilmez. Kendini tehlikeye atmak yasaklanmıştır (Bakara 195); tedbir almak insanın sorumluluğudur.' },
  { id:'yan-7', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2', kavram:['ozgurluk','sorumluluk'], dogru:false,
    cumle:'“Özgür bir insan, başkalarına zarar verse bile istediği her şeyi yapabilir.”',
    yanilgilar:['İrade ile tedbir karıştırılmış.','Özgürlük, sınırsızlık olarak anlaşılmış.','Özgürlük ile kader karıştırılmış.'], dogruYanilgi:1,
    aciklama:'Mutlak özgürlük yoktur. Özgürlük; başkalarının hakları, ahlaki değerler ve hukukla sınırlıdır. Özgürce karar veren kişi sonucundan da sorumludur.' },
  { id:'yan-8', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['rizik'], dogru:true,
    cumle:'“Rızkı veren Allah’tır; helal yoldan çalışmak ise insanın görevidir.”',
    aciklama:'Rızkı veren Allah’tır (Rezzak); insan onu helal yoldan çalışarak aramakla sorumludur.' },
  { id:'yan-9', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['teslimiyet','tevekkul'], dogru:false,
    cumle:'“Teslimiyet, hiçbir şey yapmadan olacakları beklemektir.”',
    yanilgilar:['Teslimiyet, pasiflik ve tedbirsizlikle karıştırılmış.','Teslimiyet ile ecel karıştırılmış.','Kaza ile kader karıştırılmış.'], dogruYanilgi:0,
    aciklama:'Teslimiyet, elinden geleni yaptıktan sonra ortaya çıkan sonucu gönülden kabullenmektir. Ders çıkarmayı ve yeniden çabalamayı engellemez.' },
  { id:'yan-10', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2', kavram:['akil','sorumluluk'], dogru:true,
    cumle:'“Aklı yerinde olmayan ya da ergenlik çağına ulaşmamış kişi, dinî emir ve yasaklardan sorumlu tutulmaz.”',
    aciklama:'Mükellef olmanın şartları akıl ve ergenliktir. Akıl, sorumluluğun ön şartıdır.' },
  { id:'yan-11', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.1', kavram:['kader','sorumluluk'], dogru:false,
    cumle:'“Başıma gelen her kötü olayın tek sebebi kaderdir; benim hiçbir payım olamaz.”',
    yanilgilar:['Rıza ile sabır karıştırılmış.','İnsanın kendi tercihlerinin sonuçları doğrudan kadere yüklenmiş.','Özgürlük ile hürriyet karıştırılmış.'], dogruYanilgi:1,
    aciklama:'Kur’an, insanların kendi yaptıkları yüzünden karada ve denizde düzenin bozulduğunu bildirir (Rum 41). Bazı olaylar insanın elinde değildir; ama tercihlerimizin sonuçlarını kadere yüklemek sorumluluktan kaçmaktır.' },
  { id:'yan-12', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.2', kavram:['teslimiyet','sorumluluk'], dogru:false,
    cumle:'“Sonuç istediğim gibi olmadıysa demek ki çabam boşa gitmiştir.”',
    yanilgilar:['Tedbir ile akıl karıştırılmış.','Ecel ile ömür karıştırılmış.','Sorumluluğun sonuca göre değil, tercih ve çabaya göre ölçüldüğü unutulmuş.'], dogruYanilgi:2,
    aciklama:'İnsan, sonuçtan değil çabasından ve tercihinden sorumludur (Necm 39-40). Sonuç Allah’ın takdiriyle gerçekleşir; çaba kendi başına değerlidir, teslimiyet de yeniden denemeyi engellemez.' }
];

/* ---------- 6. HAYATTAN KAVRAMA ---------- */
var HAYAT = [
  { id:'hay-sinav', baslik:'Sınav', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.3',
    metin:'Sınava bir hafta kala Can bir çalışma programı hazırladı; ancak son iki gün hastalandı ve planına uyamadı. Yine de sınava girip elinden geleni yaptı.',
    secenekler:['tedbir','sorumluluk','tevekkul','teslimiyet','ecel','rizik'], gerekli:['tedbir','sorumluluk'], kabul:['tevekkul','teslimiyet'],
    neden:'Program yapmak tedbirdir. Hastalık Can’ın elinde değildir; Bakara 286’ya göre insan gücünün yettiği ölçüde sorumludur. Elinden geleni yapıp sonucu Allah’a bırakması tevekkül, sonucu kabullenmesi teslimiyettir.' },
  { id:'hay-spor', baslik:'Spor', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.1',
    metin:'Takım maça iyi hazırlandı ama son dakikada yenildi. Kaptan “Bu işin kaderi buymuş.” dedi ve antrenmanlara gelmeyi bıraktı.',
    secenekler:['teslimiyet','sorumluluk','kader','irade','ecel','rizik'], gerekli:['teslimiyet','sorumluluk'], kabul:['kader','irade'],
    neden:'Yenilgiyi kabullenmek teslimiyettir; ama teslimiyet pasiflik değildir. Antrenmanı bırakmak kaptanın tercihidir ve takımına karşı sorumluluğunu aksatır. Kader, vazgeçmenin gerekçesi yapılmamalıdır.' },
  { id:'hay-trafik', baslik:'Trafik', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.2',
    metin:'Bir sürücü kırmızı ışıkta geçti ve bir yayaya çarptı.',
    secenekler:['irade','sorumluluk','tedbir','akil','ecel','rizik','teslimiyet'], gerekli:['irade','sorumluluk'], kabul:['tedbir','akil'],
    neden:'Kırmızıda geçmek sürücünün iradesiyle yaptığı bir tercihtir; doğan zarardan o sorumludur. Kurallara uymak temel bir tedbirdir.' },
  { id:'hay-saglik', baslik:'Sağlık', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1',
    metin:'Doktor, Ayşe Hanım’a düzenli yürüyüş ve ilaç önerdi. Ayşe Hanım tedaviye uydu ve şifa için dua etti.',
    secenekler:['tedbir','tevekkul','sorumluluk','omur','kaza','ozgurluk'], gerekli:['tedbir','tevekkul'], kabul:['sorumluluk','omur'],
    neden:'Tedaviye uymak tedbir, dua edip sonucu Allah’a bırakmak tevekküldür. Sağlığını korumak ömrü bir emanet olarak görmenin ve sorumluluğun gereğidir.' },
  { id:'hay-is', baslik:'İş güvenliği', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2',
    metin:'Bir inşaat işçisi, “Ecel gelince baret kurtarmaz.” diyerek baret ve emniyet kemeri takmayı reddetti.',
    secenekler:['ecel','tedbir','sorumluluk','akil','rizik','teslimiyet'], gerekli:['ecel','tedbir','sorumluluk'], kabul:['akil'],
    neden:'Ecel Allah’ın takdiridir ama insan onu bilmez; bu yüzden tedbir sorumluluğu sürer. Kendini tehlikeye atmak yasaklanmıştır (Bakara 195). İş sağlığı ve güvenliği kuralları bu sorumluluğun parçasıdır.' },
  { id:'hay-sosyal', baslik:'Sosyal medya', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2',
    metin:'Deniz, doğruluğunu kontrol etmediği bir haberi paylaştı. Haber yalan çıktı ve bir kişi zarar gördü.',
    secenekler:['sorumluluk','irade','ozgurluk','akil','tedbir','ecel','rizik'], gerekli:['sorumluluk','irade'], kabul:['ozgurluk','akil','tedbir'],
    neden:'Paylaşmak Deniz’in tercihidir ve doğan zarardan sorumludur. Paylaşma özgürlüğü başkalarının hakkıyla sınırlıdır. Doğrulamak aklın gereği ve bir tedbirdir.' },
  { id:'hay-arkadas', baslik:'Arkadaşlık', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.2',
    metin:'Arkadaşı Berk’ten sınavda kopya vermesini istedi. Berk bunun yanlış olduğunu düşünüp reddetti ve arkadaşına ders çalışmada yardım etmeyi teklif etti.',
    secenekler:['akil','irade','sorumluluk','ozgurluk','kaza','ecel'], gerekli:['akil','irade'], kabul:['sorumluluk','ozgurluk'],
    neden:'Doğruyu yanlıştan ayırmak aklın, reddetmeye karar vermek iradenin işidir. Arkadaşına doğru yoldan yardım etmek sorumluluk bilincidir.' },
  { id:'hay-kariyer', baslik:'Kariyer', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.1',
    metin:'Selin sevdiği meslek için yıllarca çalıştı; ancak ekonomik kriz yüzünden iş bulamadı. Üzülse de bunu kabullendi, farklı bir alanda sertifika alıp yeniden başvurdu.',
    secenekler:['rizik','teslimiyet','irade','tevekkul','tedbir','sorumluluk','ecel'], gerekli:['rizik','teslimiyet'], kabul:['irade','tevekkul','tedbir','sorumluluk'],
    neden:'İş ve kazanç rızıkla ilgilidir; rızkı veren Allah’tır, insan helal yoldan aramakla sorumludur. Sonucu kabullenmek teslimiyet; yeni bir yol seçip hazırlanmak irade ve tedbirdir. Teslimiyet yeniden çabayı engellemiyor.' },
  { id:'hay-tercih', baslik:'Üniversite tercihi', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2',
    metin:'Ahmet üniversite tercihlerini hiç araştırma yapmadan, arkadaşları hangi bölümü yazdıysa onu yazarak yaptı.',
    secenekler:['akil','irade','sorumluluk','tedbir','ozgurluk','ecel','rizik'], gerekli:['akil','irade','sorumluluk'], kabul:['tedbir','ozgurluk'],
    neden:'Seçenekleri tartmak aklın işidir; Ahmet bunu yapmamış. Arkadaşlarını taklit etmek de onun kendi tercihidir ve sonucundan kendisi sorumludur. Araştırmak bir tedbirdir.' },
  { id:'hay-basarisiz', baslik:'Başarısızlık', zorluk:'temel', ogrenmeCiktisi:'DKAB.11.1.1',
    metin:'Elif sınavdan düşük aldı. “Ben zaten yapamam, kaderim bu.” dedi.',
    secenekler:['kader','irade','sorumluluk','teslimiyet','ecel','rizik'], gerekli:['kader','irade'], kabul:['sorumluluk','teslimiyet'],
    neden:'Elif kaderi, geleceğe dair değişmez bir hüküm gibi görüyor; bu yanlış bir kader anlayışıdır. Bir sonraki sınav için ne yapacağı onun iradesindedir (Ra‘d 11).' },
  { id:'hay-basari', baslik:'Başarı', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.1',
    metin:'Kerem bir yarışmada birinci oldu. “Bu başarı tamamen benim eserim; hiçbir şeye borçlu değilim.” dedi.',
    secenekler:['rizik','kader','irade','sorumluluk','ecel','tedbir'], gerekli:['rizik','kader'], kabul:['irade','sorumluluk','tedbir'],
    neden:'Çaba başarının sebebidir ve değerlidir. Ancak sağlık, yetenek ve imkânlar da Allah’ın verdiği nimetlerdir (rızık); sonuç O’nun takdiriyle gerçekleşir. Başarıda şükür, kibri önler.' },
  { id:'hay-afet', baslik:'Afet ve tedbir', zorluk:'derin', ogrenmeCiktisi:'DKAB.11.1.1',
    metin:'Bir köyde dere yatağına ev yapılmasına izin verildi. Şiddetli yağmurda sel evleri yıktı. Bazı köylüler “Kader.” dedi, bazıları “Burada ev yapılmamalıydı.” dedi.',
    secenekler:['tedbir','sorumluluk','kader','akil','irade','kaza','ecel','rizik'], gerekli:['tedbir','sorumluluk','kader'], kabul:['akil','irade','kaza'],
    neden:'Yağmurun yağması insanın elinde değildir. Onu afete dönüştüren, dere yatağına ev yapma tercihi ve alınmayan tedbirdir. “Kader” deyip geçmek, sorumluları ve alınması gereken yeni tedbirleri gözden kaçırır (Rum 41).' }
];

/* ---------- 6. AYNI OLAY – FARKLI KAVRAM ---------- */
var AYNI_OLAY = { id:'ayni-sinav', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.11.1.2',
  olay:'Bir öğrenci sınavdan düşük aldı.',
  kavramlar:{
    akil:{ gorev:'Akıl açısından: Öğrenci düşük notun sebeplerini nasıl değerlendirmeli?', model:'Akıl, düşük notun sebeplerini (çalışma yöntemi, süre, dikkat, sınav kaygısı) ayırt etmeyi ve bir sonraki sınav için doğru dersi çıkarmayı sağlar.' },
    irade:{ gorev:'İrade açısından: Bu olaydan sonra öğrenci hangi seçimleri yapabilir?', model:'Yeni bir çalışma planı yapmak, öğretmeninden destek istemek ya da vazgeçmek arasında seçim yapabilir. Hangisini seçeceği onun iradesindedir.' },
    sorumluluk:{ gorev:'Sorumluluk açısından: Bu olayda öğrencinin sorumluluğu nedir?', model:'Sınava ne kadar hazırlandığından ve çalışma tercihlerinden sorumludur. Kendi payını kabul edip eksiklerini gidermek de sorumluluğudur. Elinde olmayan sebeplerden (ani bir hastalık gibi) sorumlu tutulmaz (Bakara 286).' },
    tevekkul:{ gorev:'Tevekkül açısından: Öğrenci bir sonraki sınava nasıl yaklaşmalı?', model:'Önce çalışıp tedbir alır, sonra sonucu Allah’a bırakır. Sınava kaygıyla değil güvenle girer.' },
    kader:{ gorev:'Kader açısından: Bu olay nasıl yorumlanmalı, nasıl yorumlanmamalı?', model:'Sonucun gerçekleşmesi Allah’ın takdiri dâhilindedir. Fakat “Kaderim bu, yapamam.” demek yanlıştır; kader, çalışmamanın bahanesi ya da geleceğe dair değişmez bir hüküm gibi görülemez.' }
  } };

/* ---------- 7. KAVRAM TABU ---------- */
/* y: [gösterilen, kökler] — küçük harf, şapkasız; "|" ile alternatif kök.
   Kök önek olarak aranır (seç → seçmek, seçim); "=" ile başlayan kök yalnızca
   tam kelime olarak aranır (=son → "sonra" yakalanmaz). */
var TABU = [
  { k:'tevekkul', y:[['Allah','allah'],['Çalışmak','calis'],['Sonuç','sonuc'],['Tedbir','tedbir'],['Güvenmek','guven']],
    model:'Kişinin elinden gelen her önlemi alıp emek verdikten sonra, neticeyi Rabbine bırakıp içi rahat biçimde beklemesi.' },
  { k:'sorumluluk', y:[['Görev','gorev'],['Sonuç','sonuc'],['İrade','irade'],['Hesap','hesap'],['Davranış','davran']],
    model:'Kişinin kendi seçimleriyle yaptıklarının ardından çıkan durumu sahiplenmesi, “Bunu ben yaptım.” diyebilmesi.' },
  { k:'kader', y:[['Allah','allah'],['Takdir','takdir'],['Plan','plan'],['Ölçü','olcu'],['Yazgı','yazgi']],
    model:'Yaratıcının, olacak her şeyi ezelden bilip her varlığa bir düzen ve miktar belirlemesi.' },
  { k:'kaza', y:[['Kader','kader'],['Gerçekleşmek','gerceklesm'],['Olay','olay'],['Hüküm','hukum'],['Takdir','takdir']],
    model:'Ezelde belirlenmiş olan her şeyin, vakti geldiğinde hayata geçmesi; iyi ya da kötü her netice bunun içindedir.' },
  { k:'akil', y:[['Düşünmek','dusun'],['Beyin','beyin'],['Doğru','dogru'],['Yanlış','yanlis'],['Zekâ','zeka']],
    model:'İnsanın iyiyi kötüden, faydalıyı zararlıdan ayırmasını sağlayan yeti; dinen yükümlü olmanın ilk şartı.' },
  { k:'irade', y:[['Seçmek','sec'],['Tercih','tercih'],['Karar','karar'],['İstemek','istem|istey|istiy|isted|istek'],['Güç','guc']],
    model:'İnsanın önündeki yollardan birine yönelebilme yeteneği; yaptıklarının hesabının sorulmasının temeli.' },
  { k:'ozgurluk', y:[['Özgür','ozgur'],['Serbest','serbest'],['Zorlama','zorla'],['İstediğini','istedig'],['Sınır','sinir']],
    model:'Kişinin baskı altında kalmadan kendi kararını verebilmesi; başkalarının hakkına dokunmadığı sürece geçerli bir imkân.' },
  { k:'ecel', y:[['Ölüm','olum'],['Ömür','omur'],['Son','=son|=sonu|=sona|=sonunda|=sonudur'],['Zaman','zaman'],['Vakit','vakit']],
    model:'Her canlının dünya hayatının bitişi için belirlenmiş, ne öne alınabilen ne de ertelenebilen an.' },
  { k:'omur', y:[['Yaşamak','=yasa|yasam|yasad|yasay|yasiy'],['Hayat','hayat'],['Süre','sure'],['Doğum','dogum'],['Ölüm','olum']],
    model:'İnsana dünyaya geldiği günden ayrılacağı güne kadar verilen, değerlendirilmesi gereken emanet.' },
  { k:'rizik', y:[['Para','para'],['Nimet','nimet'],['Kazanç','kazan'],['Yemek','yemek'],['Allah','allah']],
    model:'Canlıların varlığını sürdürmesi için Rezzak’ın verdiği her şey: sağlık, bilgi, aile, helal yoldan elde edilen gelir.' },
  { k:'teslimiyet', y:[['Kabul','kabul'],['Boyun eğmek','boyun'],['Razı','razi'],['Sonuç','sonuc'],['İsyan','isyan']],
    model:'Olan bitenin ardından Rabbin takdirine gönülden bağlanmak; itiraz etmeden huzur bulmak ve yola devam etmek.' },
  { k:'tedbir', y:[['Önlem','onlem'],['Hazırlık','hazirl'],['Risk','risk'],['Korunmak','korun'],['Sebep','sebep']],
    model:'Olası bir zarardan önce aklın gösterdiği yolu izleyip gereğini yapmak: kemer takmak, binayı denetletmek gibi.' }
];

/* ================= ETKİNLİK LİSTESİ (normalize) ================= */
function meta(tur, o, kavram, gb){
  var t = TUR[tur];
  return { id:o.id, tur:tur, kavram:kavram, amac:o.amac||t.amac||AMAC[tur], beceri:o.beceri||t.beceri, deger:o.deger||t.deger,
    ogrenmeCiktisi:o.ogrenmeCiktisi||'DKAB.11.1.1', etkinlikTuru:t.etkinlikTuru, zorluk:o.zorluk||'temel',
    olcmeTuru:t.olcmeTuru, geriBildirim:gb||'', boyut:o.boyut||t.boyut, adim:t.adim, veri:o };
}
var AMAC = {
  tani:'Kavramı açıklamasından tanıyabilme.',
  fark:'Birbirine karıştırılan iki kavramın benzer ve farklı yönlerini ayırt edebilme.',
  bul:'Bir olayda hangi kavramların devreye girdiğini bulup yanlış anlaşılan kavramı teşhis edebilme.',
  dedektif:'Metindeki kavramları bulup her birini metinden bir kanıtla destekleyebilme.',
  zincir:'Kavramlar arasındaki sebep–sonuç ve süreç ilişkisini kurabilme.',
  coklu:'Birden fazla kavramı birlikte kullanarak bir ilişkiyi açıklayabilme.',
  ayet:'Ayet ve hadislerin öne çıkardığı kavramları belirleyip yanlış kader anlayışlarını bu metinlere dayanarak düzeltebilme.',
  yanilgi:'Günlük hayattaki cümlelerde yanlış kader anlayışını fark edip yanılgıyı adlandırabilme.',
  hayat:'Bir hayat durumunda devreye giren kavramları belirleyip gerekçelendirebilme.',
  ayniolay:'Aynı olayın farklı kavramlarla farklı yönlerden açıklanabildiğini fark edebilme.',
  cumle:'Kavramı kendi cümlesiyle açıklayıp kendi hayatından örneklendirebilme.',
  tabu:'Kavramı ezber anahtar kelimeler kullanmadan kendi cümlesiyle açıklayabilme.'
};
var ETK = [];
K_SIRA.forEach(function(k){ ETK.push(meta('tani',{ id:'tani-'+k, ogrenmeCiktisi:K[k].cikti, zorluk:'temel' },[k],K[k].aciklama)); });
FARK.forEach(function(o){ ETK.push(meta('fark',o,[o.a,o.b],o.farkli)); });
BUL.forEach(function(o){ ETK.push(meta('bul',o,o.gerekli.slice(),o.dogruGB)); });
DEDEKTIF.forEach(function(o){ ETK.push(meta('dedektif',o,Object.keys(o.kanit).filter(function(x){return K[x];}),o.geriBildirim)); });
ZINCIR.forEach(function(o){ ETK.push(meta('zincir',o,o.kavram,o.model)); });
COKLU.forEach(function(o){ ETK.push(meta('coklu',o,o.kavram,o.model)); });
AYET_ESLE.forEach(function(o){
  var ks = []; o.satirlar.forEach(function(s){ (o.mod==='kavram' ? [s.ana] : s.kavram).forEach(function(k){ if(K[k] && ks.indexOf(k)<0) ks.push(k); }); });
  ETK.push(meta('ayet', o, ks, o.mod==='kavram' ? 'Her metnin ana kavramı ve gerekçesi, cevaptan sonra satır satır gösterilir.' : 'Her yanlış düşünceyi düzelten metin ve gerekçesi, cevaptan sonra satır satır gösterilir.'));
});
YANILGI.forEach(function(o){ ETK.push(meta('yanilgi',o,o.kavram,o.aciklama)); });
HAYAT.forEach(function(o){ ETK.push(meta('hayat',o,o.gerekli.slice(),o.neden)); });
ETK.push(meta('ayniolay',AYNI_OLAY,Object.keys(AYNI_OLAY.kavramlar),'Aynı olay, seçilen kavrama göre farklı bir yönüyle açıklanır.'));
K_SIRA.forEach(function(k){ ETK.push(meta('cumle',{ id:'cumle-'+k, ogrenmeCiktisi:K[k].cikti, zorluk:'gelistir' },[k],'')); });
TABU.forEach(function(o){ ETK.push(meta('tabu',{ id:'tabu-'+o.k, ogrenmeCiktisi:K[o.k].cikti, zorluk:'gelistir' },[o.k],o.model)); });
var ETK_ID = {}; ETK.forEach(function(e){ ETK_ID[e.id]=e; });

/* ================= DURUM (localStorage) ================= */
var ANAHTAR = 'dk11kl-v1';
var D = (function(){ try{ var v = JSON.parse(localStorage.getItem(ANAHTAR)||'null'); if(v && v.sonuc) return v; }catch(e){} return null; })()
        || { sonuc:{}, tekrar:[], cumle:{}, tabuPuan:0, pekisen:[] };
if(!D.pekisen) D.pekisen=[];
function kaydet(){ try{ localStorage.setItem(ANAHTAR, JSON.stringify(D)); }catch(e){} }

/* ================= YARDIMCILAR ================= */
function $(s,k){ return (k||document).querySelector(s); }
function $$(s,k){ return [].slice.call((k||document).querySelectorAll(s)); }
function e(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function karistir(a){ var b=a.slice(); for(var i=b.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=b[i]; b[i]=b[j]; b[j]=t; } return b; }
function kAd(k){ return K[k] ? K[k].ad : (EK_ETIKET[k]||k); }
function sade(s){ return String(s).toLocaleLowerCase('tr').replace(/[âà]/g,'a').replace(/[îì]/g,'i').replace(/[ûù]/g,'u')
  .replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u'); }
function kelimeler(s){ return sade(s).split(/[^a-z0-9]+/).filter(Boolean); }
var uid = 0; function yeniId(p){ uid++; return 'kl-'+p+'-'+uid; }
function yasakEslesir(kelimeListesi, kokler){
  return kokler.split('|').some(function(kok){
    var tam = kok.charAt(0)==='='; if(tam) kok = kok.slice(1);
    return kelimeListesi.some(function(x){ return tam ? x===kok : x.indexOf(kok)===0; });
  });
}

/* Sonuç kaydı: her etkinliğin son sonucu tutulur (tekrar çözmek sayıyı şişirmez). */
function sonucYaz(et, dogru, kavramlar){
  D.sonuc[et.id] = { d:!!dogru, b:et.boyut, t:Date.now() };
  if(!dogru){ (kavramlar||et.kavram).forEach(function(k){ if(K[k]) tekrarEkle(k, et.id); }); }
  kaydet(); ilerlemeCiz(); tekrarSeritCiz(); adimDurumCiz();
}
function ilerlemeNotu(et){
  var b = BOYUTLAR.filter(function(x){ return x[0]===et.boyut; })[0];
  return '<p class="kl-iz">→ Portal öğrenme ilerlemesinde “'+b[1]+'” boyutuna işlendi.</p>';
}

/* ================= PEKİŞTİRME (tekrar) ================= */
var ASAMA = ['Kısa açıklama','Kolay örnek','Orta düzey örnek','Ayırt etme sorusu','Günlük hayat senaryosu'];
function tekrarEkle(k, kaynakId){
  var t = D.tekrar.filter(function(x){ return x.k===k; })[0];
  if(t){ if(t.gorulen.indexOf(kaynakId)<0) t.gorulen.push(kaynakId); return; }
  D.tekrar.push({ k:k, asama:0, gorulen:[kaynakId] });
  D.pekisen = D.pekisen.filter(function(x){ return x!==k; });
}
var OTOMATIK = { tani:1, bul:1, yanilgi:1, hayat:1, dedektif:1, zincir:1 };
function havuz(k, zorluklar, turler, gorulen){
  return ETK.filter(function(et){
    return OTOMATIK[et.tur] && et.tur!=='tani' && et.kavram.indexOf(k)>=0 && zorluklar.indexOf(et.zorluk)>=0 &&
      (!turler || turler.indexOf(et.tur)>=0) && gorulen.indexOf(et.id)<0;
  });
}
/* Aşamaya göre, daha önce görülmemiş bir öğe seçer; yoksa kavram kartından yeni bir soru üretir. */
function tekrarOgesi(t){
  var s = t.asama, k = t.k, adaylar;
  /* Farklı bağlam: bu tekrarda kullanılmış türler ve 4.–5. aşamaya ayrılan türler (yanılgı, senaryo) mümkünse atlanır. */
  var kacin = ['yanilgi','hayat'].concat(t.turler||[]);
  function tercihli(a){ var iyi = a.filter(function(x){ return kacin.indexOf(x.tur)<0; }); return iyi.length ? iyi : a; }
  if(s===0) return { ozel:'kart' };
  if(s===1) adaylar = tercihli(havuz(k,['temel'],null,t.gorulen));
  if(s===2) adaylar = tercihli(havuz(k,['gelistir','derin'],null,t.gorulen));
  if(s===3) adaylar = havuz(k,['temel','gelistir','derin'],['yanilgi'],t.gorulen);
  if(s===4){
    /* Günlük hayat senaryosu: önce kavramın temel olduğu, sonra kabul edildiği senaryolar; yoksa gerçek hayattan olay metinleri. */
    adaylar = havuz(k,['temel','gelistir','derin'],['hayat'],t.gorulen);
    if(!adaylar.length) adaylar = ETK.filter(function(et){ return (et.tur==='hayat'||et.tur==='bul') && t.gorulen.indexOf(et.id)<0 &&
      (et.veri.gerekli.indexOf(k)>=0 || et.veri.kabul.indexOf(k)>=0); });
  }
  if(adaylar && adaylar.length) return { et:adaylar[Math.floor(Math.random()*adaylar.length)] };
  /* Uygun hazır etkinlik kalmadıysa kavram kartından soru üretilir. Aynı soruyu aynen
     tekrar etmemek için her seferinde kullanılmamış bir biçim seçilir. */
  if(s===3) return { ozel:'ayirt' };
  var kalan = ['tanim','ornek','anahtar'].filter(function(b){
    return (t.uretilen||[]).indexOf(b)<0 && !(b==='tanim' && t.gorulen.indexOf('tani-'+k)>=0); });
  if(!kalan.length){ t.uretilen = []; kalan = ['ornek','anahtar']; }
  if(kalan[0]==='tanim') return { et:ETK_ID['tani-'+k], bicim:'tanim' };
  return { ozel:kalan[0] };
}

/* ================= ORTAK PARÇALAR ================= */
function etiketSatiri(et){
  return '<div class="kl-meta-bas"><span class="kl-zorluk kl-z-'+et.zorluk+'">'+ZORLUK[et.zorluk]+'</span>'+
    '<span class="kl-tur">'+e(et.etkinlikTuru)+'</span>'+
    (D.sonuc[et.id] ? '<span class="kl-durum '+(D.sonuc[et.id].d?'ok':'no')+'">'+(D.sonuc[et.id].d?'✓ Çözüldü':'↻ Tekrar dene')+'</span>' : '')+'</div>';
}
function etkinlikBilgisi(et){
  return '<details class="kl-bilgi"><summary>Etkinlik bilgisi</summary><dl>'+
    '<dt>MEB çıktısı <small>(resmî)</small></dt><dd><b>'+e(et.ogrenmeCiktisi)+'.</b> '+e(KL_CIKTI[et.ogrenmeCiktisi])+'</dd>'+
    '<dt>Etkinliğin amacı <small>(portal)</small></dt><dd>'+e(et.amac)+'</dd>'+
    '<dt>İlişkili beceri / değer <small>(program kodları)</small></dt><dd>'+e(et.beceri)+' · '+e(et.deger)+'</dd>'+
    '<dt>Ölçme türü</dt><dd>'+e(et.olcmeTuru)+'</dd>'+
    '<dt>Kavramlar</dt><dd>'+et.kavram.map(kAd).map(e).join(', ')+'</dd>'+
  '</dl></details>';
}
function cip(k, ek){ return '<button type="button" class="kutu-btn kl-cip" data-k="'+k+'"'+(ek||'')+' aria-pressed="false">'+e(kAd(k))+'</button>'; }
function gb(dogru, baslik, metin){
  return '<div class="kl-gb '+(dogru?'kl-gb-d':'kl-gb-y')+'"><b>'+(dogru?'✓ ':'✗ ')+e(baslik)+'</b><p>'+metin+'</p></div>';
}
function yaziAlani(ad, etiket, kayitli){
  var id = yeniId('y');
  return '<label class="kl-etiket" for="'+id+'">'+etiket+'</label><textarea class="yazi kl-yazi" id="'+id+'" data-ad="'+ad+'" rows="3">'+e(kayitli||'')+'</textarea>';
}
function ozDegerlendirme(){
  return '<fieldset class="kl-oz"><legend>Cevabını örnek açıklamayla karşılaştır:</legend>'+
    '<button type="button" class="kutu-btn" data-oz="1">Örtüşüyor</button>'+
    '<button type="button" class="kutu-btn" data-oz="0.5">Kısmen</button>'+
    '<button type="button" class="kutu-btn" data-oz="0">Eksik kaldı</button></fieldset>';
}
function ozBagla(kap, et, sonra){
  $$('[data-oz]',kap).forEach(function(b){ b.addEventListener('click',function(){
    $$('[data-oz]',kap).forEach(function(x){ x.classList.toggle('sec', x===b); x.setAttribute('aria-pressed', x===b?'true':'false'); });
    var v = +b.getAttribute('data-oz');
    sonucYaz(et, v>=0.5);
    var n = $('.kl-oz-not',kap) || kap.appendChild(document.createElement('div'));
    n.className='kl-oz-not';
    n.innerHTML = (v===0 ? '<p class="kl-iz">Bu kavramlar tekrar sırasına eklendi; farklı örneklerle yeniden karşına çıkacak.</p>' : '') + ilerlemeNotu(et);
    if(sonra) sonra(v>=0.5);
  }); });
}

/* ================= RENDERERS ================= */
/* Her renderer: (et, kap, bitti(dogru)) — hem adımlarda hem tekrar akışında kullanılır. */
var R = {};

/* --- tani: açıklamadan kavramı bul --- */
R.tani = function(et, kap, bitti, bicim){
  var k = et.kavram[0], kar = K[k].karisan;
  var diger = karistir(K_SIRA.filter(function(x){ return x!==k && x!==kar; })).slice(0,2);
  var sec = karistir([k,kar].concat(diger));
  var ipucu = bicim==='ornek' ? K[k].ornek : bicim==='anahtar' ? K[k].anahtar.join(' · ') : K[k].aciklama;
  var soru = bicim==='ornek' ? 'Bu günlük hayat örneği en çok hangi kavramla ilgilidir?' : bicim==='anahtar' ? 'Bu anahtar kelimeler hangi kavramı anlatır?' : 'Bu açıklama hangi kavrama aittir?';
  kap.innerHTML = etiketSatiri(et)+
    '<p class="kl-soru">'+soru+'</p>'+
    '<blockquote class="kl-alinti">'+e(ipucu)+'</blockquote>'+
    '<div class="kl-cipler" role="group">'+sec.map(function(x){ return cip(x); }).join('')+'</div>'+
    '<div class="kl-sonuc" aria-live="polite"></div>'+etkinlikBilgisi(et);
  $$('.kl-cip',kap).forEach(function(b){ b.addEventListener('click',function(){
    if(kap.getAttribute('data-bitti')) return; kap.setAttribute('data-bitti','1');
    var s = b.getAttribute('data-k'), d = s===k;
    $$('.kl-cip',kap).forEach(function(x){ x.disabled=true; var xk=x.getAttribute('data-k'); if(xk===k) x.classList.add('kl-dogru'); else if(x===b) x.classList.add('kl-yanlis'); });
    $('.kl-sonuc',kap).innerHTML = gb(d, d?'Doğru: '+kAd(k):'Bu açıklama “'+kAd(k)+'” kavramına ait.',
      d ? e(K[k].aciklama) : (K[k].karisan===s ? '<b>Sık karıştırılan ikili.</b> '+e(K[k].fark) : 'Senin seçtiğin “'+e(kAd(s))+'”: '+e(K[s].aciklama)))+ilerlemeNotu(et);
    sonucYaz(et, d, d?[k]:[k]); if(bitti) bitti(d);
  }); });
};

/* --- fark: önce yaz, sonra aç --- */
R.fark = function(et, kap, bitti){
  var o = et.veri, kay = D.cumle['fark:'+o.id] || {};
  kap.innerHTML = etiketSatiri(et)+
    '<h4 class="kl-cift">'+e(kAd(o.a))+' <span aria-hidden="true">↔</span><span class="sr"> ile </span> '+e(kAd(o.b))+'</h4>'+
    '<div class="kl-uclu">'+
      '<div>'+yaziAlani('benzer','Benzer yön',kay.benzer)+'</div>'+
      '<div>'+yaziAlani('farkli','Farklı yön',kay.farkli)+'</div>'+
      '<div>'+yaziAlani('ornek','Günlük hayat örneği',kay.ornek)+'</div>'+
    '</div>'+
    '<div class="dugmeler"><button type="button" class="btn kucuk" data-ac>Açıklamayı göster</button></div>'+
    '<p class="kl-uyari gizli" aria-live="polite">Önce en az bir alanı kendi cümlenle doldur.</p>'+
    '<div class="acilan gizli" data-acilan>'+
      '<h4>Benzer yön</h4><p>'+e(o.benzer)+'</p><h4>Farklı yön</h4><p>'+e(o.farkli)+'</p><h4>Günlük hayat örneği</h4><p>'+e(o.ornek)+'</p>'+
      ozDegerlendirme()+
    '</div>'+etkinlikBilgisi(et);
  $$('.kl-yazi',kap).forEach(function(t){ t.addEventListener('input',function(){
    var v = D.cumle['fark:'+o.id] = D.cumle['fark:'+o.id] || {}; v[t.getAttribute('data-ad')] = t.value; kaydet(); }); });
  $('[data-ac]',kap).addEventListener('click',function(){
    var dolu = $$('.kl-yazi',kap).some(function(t){ return t.value.trim().length>=10; });
    $('.kl-uyari',kap).classList.toggle('gizli', dolu);
    if(!dolu) return;
    $('[data-acilan]',kap).classList.remove('gizli');
  });
  ozBagla(kap, et, bitti);
};

/* --- bul: olayda kavramı bul + yanlış anlaşılan kavram --- */
R.bul = function(et, kap, bitti){
  var o = et.veri, secili = {};
  kap.innerHTML = etiketSatiri(et)+
    '<blockquote class="kl-olay">'+e(o.metin)+'</blockquote>'+
    '<p class="kl-soru">1. Bu olayla ilgili kavramları seç (birden fazla).</p>'+
    '<div class="kl-cipler" role="group" aria-label="Kavramlar">'+o.secenekler.map(function(x){ return cip(x); }).join('')+'</div>'+
    '<div class="dugmeler"><button type="button" class="btn kucuk" data-kontrol>Kontrol et</button></div>'+
    '<div class="kl-sonuc" data-s1 aria-live="polite"></div>'+
    '<div class="gizli" data-adim2>'+
      '<p class="kl-soru">2. Bu olayda kavramlardan hangisi yanlış anlaşılmıştır?</p>'+
      '<div class="kl-cipler" role="group">'+o.secenekler.concat(['yok']).map(function(x){
        return '<button type="button" class="kutu-btn kl-y2" data-k="'+x+'">'+(x==='yok'?'Hiçbiri, kavramlar doğru kullanılmış':e(kAd(x)))+'</button>'; }).join('')+'</div>'+
      '<div class="kl-sonuc" data-s2 aria-live="polite"></div>'+
    '</div>'+etkinlikBilgisi(et);
  $$('.kl-cip',kap).forEach(function(b){ b.addEventListener('click',function(){
    if(kap.getAttribute('data-k1')) return;
    var k=b.getAttribute('data-k'); secili[k]=!secili[k]; b.classList.toggle('sec',secili[k]); b.setAttribute('aria-pressed',secili[k]?'true':'false');
  }); });
  var d1 = false, hatali = [];
  $('[data-kontrol]',kap).addEventListener('click',function(){
    var s = Object.keys(secili).filter(function(k){ return secili[k]; });
    if(!s.length){ $('[data-s1]',kap).innerHTML='<p class="kl-uyari">En az bir kavram seç.</p>'; return; }
    kap.setAttribute('data-k1','1'); this.disabled=true;
    var izin = o.gerekli.concat(o.kabul);
    var eksik = o.gerekli.filter(function(k){ return s.indexOf(k)<0; });
    var fazla = s.filter(function(k){ return izin.indexOf(k)<0; });
    hatali = eksik.concat(fazla);
    d1 = !eksik.length && !fazla.length;
    var liste = o.secenekler.map(function(k){
      var sec = s.indexOf(k)>=0, gerek = o.gerekli.indexOf(k)>=0, kab = o.kabul.indexOf(k)>=0;
      var isaret = gerek ? (sec?'✓':'◌ Eksik') : kab ? (sec?'✓':'○ İsteğe bağlı') : (sec?'✗ İlgisiz':'—');
      var b = $('.kl-cip[data-k="'+k+'"]',kap); b.disabled=true;
      if(sec && (gerek||kab)) b.classList.add('kl-dogru'); else if(sec) b.classList.add('kl-yanlis'); else if(gerek) b.classList.add('kl-eksik');
      return '<li><b>'+e(kAd(k))+'</b> <span class="kl-isaret">'+isaret+'</span>: '+e(o.neden[k]||'')+'</li>';
    }).join('');
    $('[data-s1]',kap).innerHTML = gb(d1, d1?'Kavramları doğru belirledin.':'Bazı kavramlar eksik ya da ilgisiz.', '')+'<ul class="kl-neden">'+liste+'</ul>';
    $('[data-adim2]',kap).classList.remove('gizli');
  });
  $$('.kl-y2',kap).forEach(function(b){ b.addEventListener('click',function(){
    if(kap.getAttribute('data-k2')) return; kap.setAttribute('data-k2','1');
    var k=b.getAttribute('data-k'), d2 = o.yanlisKavram.indexOf(k)>=0;
    $$('.kl-y2',kap).forEach(function(x){ x.disabled=true; if(o.yanlisKavram.indexOf(x.getAttribute('data-k'))>=0) x.classList.add('kl-dogru'); else if(x===b) x.classList.add('kl-yanlis'); });
    var d = d1 && d2;
    $('[data-s2]',kap).innerHTML = gb(d2, d2?'Doğru teşhis.':'Teşhis hatalı.', d2 ? e(o.dogruGB) : e(o.yanlisGB))+
      (d2 ? '' : '<p class="kl-ek">'+e(o.dogruGB)+'</p>')+ilerlemeNotu(et);
    /* Tekrar sırasına yalnızca gerçekten hata yapılan kavramlar girer. */
    var tekrarK = hatali.concat(d2 ? [] : o.yanlisKavram.concat(k==='yok'?[]:[k])).filter(function(x,i,a){ return K[x] && a.indexOf(x)===i; });
    sonucYaz(et, d, tekrarK.length ? tekrarK : et.kavram); if(bitti) bitti(d);
  }); });
};

/* --- dedektif: metindeki kavramlar + kanıt cümlesi --- */
R.dedektif = function(et, kap, bitti){
  var o = et.veri, secili = {};
  kap.innerHTML = etiketSatiri(et)+
    '<ol class="kl-metin">'+o.cumleler.map(function(c,i){ return '<li data-i="'+i+'">'+e(c)+'</li>'; }).join('')+'</ol>'+
    '<p class="kl-soru">Metinde bulunan kavramların etiketlerini seç. Her etiket için kanıt cümlesini de gösterebilirsin.</p>'+
    '<div class="kl-cipler" role="group" aria-label="Etiketler">'+o.etiketler.map(function(x){ return cip(x); }).join('')+'</div>'+
    '<div class="kl-kanitlar" data-kanitlar></div>'+
    '<div class="dugmeler"><button type="button" class="btn kucuk" data-kontrol>Kontrol et</button></div>'+
    '<div class="kl-sonuc" aria-live="polite"></div>'+etkinlikBilgisi(et);
  function kanitCiz(){
    $('[data-kanitlar]',kap).innerHTML = Object.keys(secili).filter(function(k){ return secili[k]; }).map(function(k){
      var id=yeniId('kn');
      return '<div class="kl-kanit"><label for="'+id+'"><b>'+e(kAd(k))+'</b> için kanıt cümlesi:</label>'+
        '<select id="'+id+'" data-kanit="'+k+'"><option value="">— isteğe bağlı —</option>'+
        o.cumleler.map(function(c,i){ return '<option value="'+i+'">'+(i+1)+'. '+e(c.length>60?c.slice(0,58)+'…':c)+'</option>'; }).join('')+'</select></div>';
    }).join('');
  }
  $$('.kl-cip',kap).forEach(function(b){ b.addEventListener('click',function(){
    if(kap.getAttribute('data-bitti')) return;
    var k=b.getAttribute('data-k'); secili[k]=!secili[k]; b.classList.toggle('sec',secili[k]); b.setAttribute('aria-pressed',secili[k]?'true':'false');
    var onceki = {}; $$('[data-kanit]',kap).forEach(function(s){ onceki[s.getAttribute('data-kanit')]=s.value; });
    kanitCiz(); $$('[data-kanit]',kap).forEach(function(s){ var v=onceki[s.getAttribute('data-kanit')]; if(v) s.value=v; });
  }); });
  $('[data-kontrol]',kap).addEventListener('click',function(){
    var s = Object.keys(secili).filter(function(k){ return secili[k]; });
    if(!s.length){ $('.kl-sonuc',kap).innerHTML='<p class="kl-uyari">En az bir etiket seç.</p>'; return; }
    kap.setAttribute('data-bitti','1'); this.disabled=true;
    var dogrular = Object.keys(o.kanit), eksik = dogrular.filter(function(k){ return s.indexOf(k)<0; }), fazla = s.filter(function(k){ return !o.kanit[k]; });
    var kanitSatir = [];
    $$('[data-kanit]',kap).forEach(function(sel){
      var k=sel.getAttribute('data-kanit'); sel.disabled=true; if(sel.value==='') return;
      var i=+sel.value, iyi = o.kanit[k] && o.kanit[k].indexOf(i)>=0;
      kanitSatir.push('<li>'+(iyi?'✓':'✗')+' <b>'+e(kAd(k))+'</b> → '+(i+1)+'. cümle'+(iyi?'':' (daha uygun: '+(o.kanit[k]?o.kanit[k].map(function(x){return (x+1)+'.';}).join(' / '):'—')+' cümle)')+'</li>');
      var li=$('.kl-metin li[data-i="'+i+'"]',kap); if(li) li.classList.add(iyi?'kl-kanit-iyi':'kl-kanit-zayif');
    });
    $$('.kl-cip',kap).forEach(function(b){ var k=b.getAttribute('data-k'); b.disabled=true;
      if(secili[k] && o.kanit[k]) b.classList.add('kl-dogru'); else if(secili[k]) b.classList.add('kl-yanlis'); else if(o.kanit[k]) b.classList.add('kl-eksik'); });
    var d = !eksik.length && !fazla.length;
    $('.kl-sonuc',kap).innerHTML = gb(d, d?'Bütün kavramları buldun.':'Eksik ya da fazla etiket var.',
      (eksik.length?'Metinde olup seçmediğin: <b>'+eksik.map(kAd).map(e).join(', ')+'</b>. ':'')+
      fazla.map(function(k){ return '<br><b>'+e(kAd(k))+'</b>: '+e(o.tuzak[k]||'Metinde bu kavrama işaret eden bir ifade yok.'); }).join(''))+
      (kanitSatir.length?'<ul class="kl-neden">'+kanitSatir.join('')+'</ul>':'')+
      '<p class="kl-ek">'+e(o.geriBildirim)+'</p>'+ilerlemeNotu(et);
    sonucYaz(et, d, eksik.concat(fazla).filter(function(k){ return K[k]; }).length ? eksik.concat(fazla).filter(function(k){ return K[k]; }) : et.kavram);
    if(bitti) bitti(d);
  });
};

/* --- zincir: dokun-yerleştir (+ masaüstünde sürükle-bırak) --- */
R.zincir = function(et, kap, bitti){
  var o = et.veri, dizi = [], havuzSira = karistir(o.ogeler.map(function(_,i){ return i; }));
  if(havuzSira.join()===o.ogeler.map(function(_,i){return i;}).join() && o.ogeler.length>1) havuzSira.reverse();
  kap.innerHTML = etiketSatiri(et)+
    '<p class="kl-soru">Kavramları doğru ilişki sırasına yerleştir. <span class="ornek">Dokun: sıraya ekle · Sıradakine dokun: geri al · Masaüstünde sürükleyebilirsin.</span></p>'+
    '<div class="kl-havuz" data-havuz aria-label="Yerleştirilecek kavramlar"></div>'+
    '<ol class="kl-zincir" data-dizi aria-label="Senin sıralaman"></ol>'+
    '<div class="dugmeler"><button type="button" class="btn kucuk" data-kontrol>Kontrol et</button><button type="button" class="btn ikincil kucuk" data-sifirla>Baştan</button></div>'+
    '<div class="kl-sonuc" aria-live="polite"></div>'+
    '<div class="gizli" data-iliski>'+yaziAlani('iliski','Bu kavramlar arasında nasıl bir ilişki vardır?',(D.cumle['zincir:'+o.id]||{}).iliski)+
      '<div class="dugmeler"><button type="button" class="btn kucuk" data-model>Örnek açıklamayı göster</button></div>'+
      '<div class="acilan gizli" data-acilan><h4>Örnek açıklama</h4><p>'+e(o.model)+'</p></div></div>'+
    etkinlikBilgisi(et);
  var kilit=false;
  function ciz(){
    $('[data-havuz]',kap).innerHTML = havuzSira.filter(function(i){ return dizi.indexOf(i)<0; }).map(function(i){
      return '<button type="button" class="kt-kart kl-oge" draggable="true" data-i="'+i+'">'+e(o.ogeler[i])+'</button>'; }).join('') || '<span class="ornek">Hepsi yerleşti.</span>';
    $('[data-dizi]',kap).innerHTML = dizi.map(function(i,p){
      return '<li><button type="button" class="kt-kart kl-oge kl-dizide" draggable="true" data-i="'+i+'" data-p="'+p+'" aria-label="'+e(o.ogeler[i])+', '+(p+1)+'. sırada. Geri almak için dokun.">'+e(o.ogeler[i])+'</button></li>'; }).join('')+
      (dizi.length<o.ogeler.length?'<li class="kl-bos" data-p="'+dizi.length+'">'+(dizi.length+1)+'. halka</li>':'');
  }
  kap.addEventListener('click',function(ev){
    var b = ev.target.closest('.kl-oge'); if(!b || kilit || !kap.contains(b)) return;
    var i=+b.getAttribute('data-i');
    if(b.classList.contains('kl-dizide')) dizi.splice(dizi.indexOf(i),1); else dizi.push(i);
    ciz();
  });
  var surulen=null;
  kap.addEventListener('dragstart',function(ev){ var b=ev.target.closest && ev.target.closest('.kl-oge'); if(!b||kilit) return; surulen=+b.getAttribute('data-i'); try{ ev.dataTransfer.setData('text/plain',String(surulen)); }catch(x){} });
  kap.addEventListener('dragover',function(ev){ if(surulen!==null && ev.target.closest && ev.target.closest('[data-dizi]')) ev.preventDefault(); });
  kap.addEventListener('drop',function(ev){
    if(surulen===null) return; var hedef = ev.target.closest && ev.target.closest('[data-p]'); if(!ev.target.closest('[data-dizi]')) { surulen=null; return; }
    ev.preventDefault();
    var eski=dizi.indexOf(surulen); if(eski>=0) dizi.splice(eski,1);
    var p = hedef ? +hedef.getAttribute('data-p') : dizi.length; if(p>dizi.length) p=dizi.length;
    dizi.splice(p,0,surulen); surulen=null; ciz();
  });
  kap.addEventListener('dragend',function(){ surulen=null; });
  $('[data-sifirla]',kap).addEventListener('click',function(){ if(kilit) return; dizi=[]; ciz(); $('.kl-sonuc',kap).innerHTML=''; });
  $('[data-kontrol]',kap).addEventListener('click',function(){
    if(dizi.length<o.ogeler.length){ $('.kl-sonuc',kap).innerHTML='<p class="kl-uyari">Önce bütün halkaları yerleştir.</p>'; return; }
    var dogruMu = function(p,i){ if(i===p) return true; return o.esdeger.some(function(g){ return g.indexOf(i)>=0 && g.indexOf(p)>=0; }); };
    var d = dizi.every(function(i,p){ return dogruMu(p,i); });
    kilit=true; this.disabled=true; $('[data-sifirla]',kap).disabled=true;
    $$('[data-dizi] .kl-oge',kap).forEach(function(b){ var p=+b.getAttribute('data-p'), i=+b.getAttribute('data-i'); b.classList.add(dogruMu(p,i)?'dogru':'yanlis'); b.disabled=true; });
    $('.kl-sonuc',kap).innerHTML = gb(d, d?'Zincir doğru kuruldu.':'Bazı halkalar yer değiştirmeli.',
      d?'':'Doğru sıra: '+o.ogeler.map(e).join(' → '))+ilerlemeNotu(et);
    $('[data-iliski]',kap).classList.remove('gizli');
    sonucYaz(et,d); if(bitti) bitti(d);
  });
  kap.addEventListener('input',function(ev){ if(ev.target.getAttribute('data-ad')==='iliski'){ (D.cumle['zincir:'+o.id]=D.cumle['zincir:'+o.id]||{}).iliski=ev.target.value; kaydet(); } });
  $('[data-model]',kap).addEventListener('click',function(){
    var t=$('[data-ad="iliski"]',kap); if(t.value.trim().length<15){ t.focus(); t.setAttribute('placeholder','Önce kendi cümlenle birkaç kelime yaz…'); return; }
    $('[data-acilan]',kap).classList.remove('gizli');
  });
  ciz();
};

/* --- coklu: açık uçlu + dereceli ölçüt --- */
R.coklu = function(et, kap, bitti){
  var o = et.veri;
  kap.innerHTML = etiketSatiri(et)+'<p class="kl-soru">'+e(o.soru)+'</p>'+
    yaziAlani('cevap','Cevabın',(D.cumle['coklu:'+o.id]||{}).cevap)+
    '<div class="dugmeler"><button type="button" class="btn kucuk" data-ac>Ölçütleri aç</button></div>'+
    '<div class="acilan gizli" data-acilan><h4>Dereceli ölçüt — cevabında olanları işaretle</h4>'+
      '<div class="secenekler">'+o.olcut.map(function(x,i){ return '<label><input type="checkbox" data-o="'+i+'"> '+e(x)+'</label>'; }).join('')+'</div>'+
      '<div class="dugmeler"><button type="button" class="btn kucuk" data-puan>Değerlendir</button></div>'+
      '<div class="kl-sonuc" aria-live="polite"></div></div>'+etkinlikBilgisi(et);
  $('[data-ad="cevap"]',kap).addEventListener('input',function(){ (D.cumle['coklu:'+o.id]=D.cumle['coklu:'+o.id]||{}).cevap=this.value; kaydet(); });
  $('[data-ac]',kap).addEventListener('click',function(){
    if($('[data-ad="cevap"]',kap).value.trim().length<40){ $('[data-ad="cevap"]',kap).focus(); $('[data-ad="cevap"]',kap).setAttribute('placeholder','Ölçütleri açmadan önce en az iki cümle yaz…'); return; }
    $('[data-acilan]',kap).classList.remove('gizli');
  });
  $('[data-puan]',kap).addEventListener('click',function(){
    var n = $$('[data-o]:checked',kap).length, d = n>=o.esik;
    $('.kl-sonuc',kap,this).innerHTML = gb(d, n+' / '+o.olcut.length+' ölçüt', d?'Kavramları birlikte, ilişkili biçimde kullanmışsın.':'Eksik kalan ölçütlere göre cevabını geliştirebilirsin.')+
      '<div class="acilan"><h4>Örnek cevap</h4><p>'+e(o.model)+'</p></div>'+ilerlemeNotu(et);
    sonucYaz(et,d); if(bitti) bitti(d);
  });
};

/* --- ayet: ayet/hadis ↔ kavram (ya da yanlış düşünce ↔ onu düzelten metin) eşleştirme --- */
R.ayet = function(et, kap, bitti){
  var o = et.veri, kavramMod = o.mod==='kavram', secim = {};
  function etiket(x){ return kavramMod ? kAd(x) : AYET_METIN[x].kisa; }
  var html = etiketSatiri(et)+
    '<p class="kl-soru">'+(kavramMod ? 'Her metni, en çok öne çıkardığı kavramla eşleştir.' : 'Her yanlış düşünceyi, onu düzelten ayet ya da hadisle eşleştir.')+'</p>';
  if(!kavramMod){
    html += '<details class="kl-ae-metinler"><summary>Metinleri oku ('+o.secenekler.length+')</summary>'+o.secenekler.map(function(a){
      return '<blockquote class="kl-alinti">“'+e(AYET_METIN[a].m)+'”<cite>'+e(AYET_METIN[a].kay)+'</cite></blockquote>'; }).join('')+'</details>';
  }
  html += '<ol class="kl-ae-liste">'+o.satirlar.map(function(s,r){
    var ust = kavramMod
      ? '<blockquote class="kl-alinti">“'+e(AYET_METIN[s.a].m)+'”<cite>'+e(AYET_METIN[s.a].kay)+'</cite></blockquote>'
      : '<blockquote class="kl-olay kl-cumle">'+e(s.cumle)+'</blockquote>';
    return '<li class="kl-ae-satir" data-r="'+r+'">'+ust+
      '<div class="kl-cipler" role="group" aria-label="'+(r+1)+'. '+(kavramMod?'metin için kavram':'düşünce için metin')+'">'+
      o.secenekler.map(function(x){ return '<button type="button" class="kutu-btn kl-cip" data-r="'+r+'" data-k="'+x+'" aria-pressed="false">'+e(etiket(x))+'</button>'; }).join('')+
      '</div><div class="kl-ae-gb" aria-live="polite"></div></li>';
  }).join('')+'</ol>'+
  '<div class="dugmeler"><button type="button" class="btn kucuk" data-kontrol>Kontrol et</button></div>'+
  '<div class="kl-sonuc" aria-live="polite"></div>'+
  '<p class="kl-iz">Meal ve hadis metinleri “Düşün, Karar Ver” sayfasındaki <a href="dusun-karar-ver.html#ayet">Ayet ve Hadisi Yorumla</a> etkinliğiyle aynıdır.</p>'+
  etkinlikBilgisi(et);
  kap.innerHTML = html;
  $$('.kl-cip',kap).forEach(function(b){ b.addEventListener('click',function(){
    if(kap.getAttribute('data-bitti')) return;
    var r = b.getAttribute('data-r'); secim[r] = b.getAttribute('data-k');
    $$('.kl-cip[data-r="'+r+'"]',kap).forEach(function(x){ var s = x===b; x.classList.toggle('sec',s); x.setAttribute('aria-pressed',s?'true':'false'); });
  }); });
  $('[data-kontrol]',kap).addEventListener('click',function(){
    var bos = o.satirlar.filter(function(_,r){ return !secim[r]; }).length;
    if(bos){ $('.kl-sonuc',kap).innerHTML='<p class="kl-uyari">Önce bütün satırları eşleştir ('+bos+' satır boş).</p>'; return; }
    kap.setAttribute('data-bitti','1'); this.disabled=true;
    var dogruSay = 0, tekrarK = [];
    o.satirlar.forEach(function(s,r){
      var sec = secim[r], iyi = sec===s.ana || (kavramMod && (s.kabul||[]).indexOf(sec)>=0);
      if(iyi) dogruSay++;
      else (kavramMod ? [s.ana, sec] : s.kavram).forEach(function(k){ if(K[k] && tekrarK.indexOf(k)<0) tekrarK.push(k); });
      $$('.kl-cip[data-r="'+r+'"]',kap).forEach(function(x){ var k=x.getAttribute('data-k'); x.disabled=true;
        if(k===s.ana || (iyi && k===sec)) x.classList.add('kl-dogru'); else if(k===sec) x.classList.add('kl-yanlis'); });
      var bas = kavramMod
        ? (sec===s.ana ? '✓ Doğru: '+etiket(s.ana) : iyi ? '✓ Kabul edilir. Ana kavram: '+etiket(s.ana) : '✗ Ana kavram: '+etiket(s.ana))
        : (iyi ? '✓ Doğru: '+etiket(s.ana) : '✗ Bu düşünceyi düzelten metin: '+etiket(s.ana));
      var g = $('.kl-ae-satir[data-r="'+r+'"] .kl-ae-gb',kap);
      g.className = 'kl-ae-gb '+(iyi?'kl-gb kl-gb-d':'kl-gb kl-gb-y');
      g.innerHTML = '<b>'+e(bas)+'</b><p>'+e(s.neden)+'</p>';
    });
    var d = dogruSay===o.satirlar.length;
    $('.kl-sonuc',kap).innerHTML = gb(d, d ? 'Bütün eşleştirmeler doğru ('+dogruSay+'/'+o.satirlar.length+').' : dogruSay+'/'+o.satirlar.length+' eşleştirme doğru.',
      kavramMod ? 'Bir metin birden fazla kavramla ilgili olabilir; burada metnin en çok öne çıkardığı kavram aranır.' : 'Yanlış bir kader anlayışını düzeltmenin en sağlam yolu, ayet ve hadislerin ne söylediğine bakmaktır.')+
      (tekrarK.length ? '<p class="kl-iz">Tekrar sırasına eklenen kavramlar: '+tekrarK.map(kAd).map(e).join(', ')+'.</p>' : '')+ilerlemeNotu(et);
    sonucYaz(et, d, tekrarK.length ? tekrarK : et.kavram); if(bitti) bitti(d);
  });
};

/* --- yanilgi: doğru/yanlış + yanılgı teşhisi --- */
R.yanilgi = function(et, kap, bitti){
  var o = et.veri;
  kap.innerHTML = etiketSatiri(et)+'<blockquote class="kl-olay kl-cumle">'+e(o.cumle)+'</blockquote>'+
    '<div class="kl-dy" role="group" aria-label="Bu düşünce doğru mu?"><button type="button" class="kutu-btn" data-dy="1">✓ DOĞRU</button><button type="button" class="kutu-btn" data-dy="0">✗ YANLIŞ</button></div>'+
    '<div class="kl-sonuc" data-s1 aria-live="polite"></div><div data-t></div>'+etkinlikBilgisi(et);
  $$('[data-dy]',kap).forEach(function(b){ b.addEventListener('click',function(){
    if(kap.getAttribute('data-k1')) return; kap.setAttribute('data-k1','1');
    var cev = b.getAttribute('data-dy')==='1', d1 = cev===o.dogru;
    $$('[data-dy]',kap).forEach(function(x){ x.disabled=true; if((x.getAttribute('data-dy')==='1')===o.dogru) x.classList.add('kl-dogru'); else if(x===b) x.classList.add('kl-yanlis'); });
    if(o.dogru){
      $('[data-s1]',kap).innerHTML = gb(d1, d1?'Doğru: Bu düşünce doğru.':'Bu düşünce aslında doğru.', e(o.aciklama))+ilerlemeNotu(et);
      sonucYaz(et,d1); if(bitti) bitti(d1); return;
    }
    $('[data-s1]',kap).innerHTML = gb(d1, d1?'Doğru: Bu düşünce yanlış.':'Bu düşünce yanlış bir kavrayışa dayanıyor.', 'Şimdi yanılgıyı adlandır.');
    $('[data-t]',kap).innerHTML = '<p class="kl-soru">Bu düşüncedeki kavram yanılgısı nedir?</p><div class="secenekler">'+
      o.yanilgilar.map(function(y,i){ return '<button type="button" class="kutu-btn kl-yan" data-y="'+i+'">'+e(y)+'</button>'; }).join('')+'</div><div class="kl-sonuc" data-s2 aria-live="polite"></div>';
    $$('.kl-yan',kap).forEach(function(yb){ yb.addEventListener('click',function(){
      if(kap.getAttribute('data-k2')) return; kap.setAttribute('data-k2','1');
      var i=+yb.getAttribute('data-y'), d2 = i===o.dogruYanilgi, d = d1 && d2;
      $$('.kl-yan',kap).forEach(function(x){ x.disabled=true; if(+x.getAttribute('data-y')===o.dogruYanilgi) x.classList.add('kl-dogru'); else if(x===yb) x.classList.add('kl-yanlis'); });
      $('[data-s2]',kap).innerHTML = gb(d2, d2?'Yanılgıyı doğru teşhis ettin.':'Asıl yanılgı: '+o.yanilgilar[o.dogruYanilgi], e(o.aciklama))+ilerlemeNotu(et);
      sonucYaz(et,d); if(bitti) bitti(d);
    }); });
  }); });
};

/* --- hayat: senaryo + hangi kavram + neden --- */
R.hayat = function(et, kap, bitti){
  var o = et.veri, secili={};
  kap.innerHTML = etiketSatiri(et)+'<h4 class="kl-senaryo-bas">'+e(o.baslik)+'</h4><blockquote class="kl-olay">'+e(o.metin)+'</blockquote>'+
    '<p class="kl-soru">Bu durumda hangi kavram ya da kavramlar devreye girer?</p>'+
    '<div class="kl-cipler" role="group">'+o.secenekler.map(function(x){ return cip(x); }).join('')+'</div>'+
    '<div class="dugmeler"><button type="button" class="btn kucuk" data-kontrol>Kontrol et</button></div>'+
    '<div class="kl-sonuc" aria-live="polite"></div>'+
    '<div class="gizli" data-neden>'+yaziAlani('neden','Neden? Seçtiğin kavramların bu durumdaki rolünü açıkla.',(D.cumle['hayat:'+o.id]||{}).neden)+
      '<div class="dugmeler"><button type="button" class="btn kucuk" data-model>Açıklamayı göster</button></div>'+
      '<div class="acilan gizli" data-acilan><h4>Açıklama</h4><p>'+e(o.neden)+'</p></div></div>'+etkinlikBilgisi(et);
  $$('.kl-cip',kap).forEach(function(b){ b.addEventListener('click',function(){
    if(kap.getAttribute('data-bitti')) return; var k=b.getAttribute('data-k'); secili[k]=!secili[k]; b.classList.toggle('sec',secili[k]); b.setAttribute('aria-pressed',secili[k]?'true':'false'); }); });
  $('[data-kontrol]',kap).addEventListener('click',function(){
    var s = Object.keys(secili).filter(function(k){ return secili[k]; });
    if(!s.length){ $('.kl-sonuc',kap).innerHTML='<p class="kl-uyari">En az bir kavram seç.</p>'; return; }
    kap.setAttribute('data-bitti','1'); this.disabled=true;
    var izin=o.gerekli.concat(o.kabul), eksik=o.gerekli.filter(function(k){ return s.indexOf(k)<0; }), fazla=s.filter(function(k){ return izin.indexOf(k)<0; });
    var d=!eksik.length && !fazla.length;
    $$('.kl-cip',kap).forEach(function(b){ var k=b.getAttribute('data-k'); b.disabled=true;
      if(secili[k] && izin.indexOf(k)>=0) b.classList.add('kl-dogru'); else if(secili[k]) b.classList.add('kl-yanlis'); else if(o.gerekli.indexOf(k)>=0) b.classList.add('kl-eksik'); });
    $('.kl-sonuc',kap).innerHTML = gb(d, d?'Kavramları doğru belirledin.':'Kavram seçimini gözden geçir.',
      'Temel kavramlar: <b>'+o.gerekli.map(kAd).map(e).join(', ')+'</b>'+(o.kabul.length?' · Bunları da seçebilirdin: '+o.kabul.map(kAd).map(e).join(', '):'')+
      (fazla.length?'<br>İlgisiz: '+fazla.map(kAd).map(e).join(', '):''))+ilerlemeNotu(et);
    $('[data-neden]',kap).classList.remove('gizli');
    sonucYaz(et,d, d?et.kavram:eksik.concat(fazla).filter(function(k){return K[k];})); if(bitti) bitti(d);
  });
  kap.addEventListener('input',function(ev){ if(ev.target.getAttribute('data-ad')==='neden'){ (D.cumle['hayat:'+o.id]=D.cumle['hayat:'+o.id]||{}).neden=ev.target.value; kaydet(); } });
  $('[data-model]',kap).addEventListener('click',function(){
    var t=$('[data-ad="neden"]',kap); if(t.value.trim().length<15){ t.focus(); t.setAttribute('placeholder','Önce kendi gerekçeni yaz…'); return; }
    $('[data-acilan]',kap).classList.remove('gizli');
  });
};

/* --- ayniolay: rastgele kavram, aynı olay --- */
R.ayniolay = function(et, kap){
  var o = et.veri, anahtarlar = Object.keys(o.kavramlar), yapilan = (D.cumle['ayni']||{});
  function ver(onceki){
    var kalan = anahtarlar.filter(function(k){ return k!==onceki && !yapilan[k]; });
    if(!kalan.length) kalan = anahtarlar.filter(function(k){ return k!==onceki; });
    return kalan[Math.floor(Math.random()*kalan.length)];
  }
  var aktif = ver(null);
  function ciz(){
    var v = o.kavramlar[aktif];
    kap.innerHTML = etiketSatiri(et)+'<blockquote class="kl-olay kl-cumle">'+e(o.olay)+'</blockquote>'+
      '<div class="kl-kavram-ver"><span>Sana düşen kavram:</span> <b class="kl-rozet-k">'+e(kAd(aktif))+'</b> '+
      '<button type="button" class="btn ikincil kucuk" data-baska>Başka kavram ver</button></div>'+
      '<p class="kl-soru">'+e(v.gorev)+'</p>'+yaziAlani('ayni',"Bu olayı seçtiğin kavram açısından açıkla.",yapilan[aktif]&&yapilan[aktif].metin)+
      '<div class="dugmeler"><button type="button" class="btn kucuk" data-ac>Örnek açıklamayı göster</button></div>'+
      '<div class="acilan gizli" data-acilan><h4>'+e(kAd(aktif))+' açısından</h4><p>'+e(v.model)+'</p>'+ozDegerlendirme()+'</div>'+
      '<div class="kl-ayni-ozet">'+ozet()+'</div>'+etkinlikBilgisi(et);
    $('[data-baska]',kap).addEventListener('click',function(){ aktif = ver(aktif); ciz(); });
    $('[data-ad="ayni"]',kap).addEventListener('input',function(){ yapilan[aktif]=yapilan[aktif]||{}; yapilan[aktif].metin=this.value; D.cumle['ayni']=yapilan; kaydet(); });
    $('[data-ac]',kap).addEventListener('click',function(){
      var t=$('[data-ad="ayni"]',kap); if(t.value.trim().length<15){ t.focus(); t.setAttribute('placeholder','Önce kendi açıklamanı yaz…'); return; }
      $('[data-acilan]',kap).classList.remove('gizli');
    });
    ozBagla(kap, et, function(){ yapilan[aktif]=yapilan[aktif]||{}; yapilan[aktif].tamam=true; D.cumle['ayni']=yapilan; kaydet(); $('.kl-ayni-ozet',kap).innerHTML=ozet(); });
  }
  function ozet(){
    var t = anahtarlar.filter(function(k){ return yapilan[k] && yapilan[k].tamam; });
    if(t.length<2) return '<p class="ornek">Tamamlanan kavram: '+t.length+' / '+anahtarlar.length+'. En az iki farklı kavramla açıkladığında, aynı olayın nasıl farklı yönlerden görülebildiğini burada karşılaştırabilirsin.</p>';
    return '<div class="acilan"><h4>Aynı olay, farklı kavramlar ('+t.length+' / '+anahtarlar.length+')</h4><ul>'+t.map(function(k){ return '<li><b>'+e(kAd(k))+':</b> '+e(yapilan[k].metin||'')+'</li>'; }).join('')+
      '</ul><p style="margin:6px 0 0">Aynı olay; akılla sebeplerine, iradeyle seçeneklerine, sorumlulukla hesabına, tevekkülle sürecine, kaderle anlamına bakılarak farklı yönlerden açıklanabilir.</p></div>';
  }
  ciz();
};

/* --- cumle: benim cümlem --- */
R.cumle = function(kap){
  var aktif = 'tevekkul';
  function ciz(){
    var k = aktif, v = D.cumle['benim:'+k] || {}, et = ETK_ID['cumle-'+k];
    kap.innerHTML = etiketSatiri(et)+
      '<div class="kl-cipler kl-secici" role="group" aria-label="Kavram seç">'+K_SIRA.map(function(x){
        var t = D.sonuc['cumle-'+x] && D.sonuc['cumle-'+x].d;
        return '<button type="button" class="kutu-btn'+(x===k?' sec':'')+'" data-kk="'+x+'" aria-pressed="'+(x===k)+'">'+(t?'✓ ':'')+e(kAd(x))+'</button>'; }).join('')+'</div>'+
      '<div class="kl-cumle-form">'+
        yaziAlani('tanim','“'+e(kAd(k))+' benim için … demektir.”',v.tanim)+
        yaziAlani('ornek','Günlük hayatımdan örneğim:',v.ornek)+
        '<label class="kl-etiket" for="kl-karis">“'+e(kAd(k))+'”i en çok hangi kavramla karıştırabilirim?</label>'+
        '<select id="kl-karis" data-ad="karis"><option value="">— seç —</option>'+K_SIRA.filter(function(x){return x!==k;}).map(function(x){ return '<option value="'+x+'"'+(v.karis===x?' selected':'')+'>'+e(kAd(x))+'</option>'; }).join('')+'</select>'+
        yaziAlani('fark','Aralarındaki fark:',v.fark)+
      '</div>'+
      '<div class="dugmeler"><button type="button" class="btn kucuk" data-tamam>Cümlemi kaydet</button><button type="button" class="btn ikincil kucuk" data-kart>Kavram kartıyla karşılaştır</button></div>'+
      '<div class="kl-sonuc" aria-live="polite"></div><div class="acilan gizli" data-acilan>'+kartIc(k)+'</div>'+etkinlikBilgisi(et);
    $$('[data-kk]',kap).forEach(function(b){ b.addEventListener('click',function(){ aktif=b.getAttribute('data-kk'); ciz(); var f=$('[data-kk="'+aktif+'"]',kap); if(f) f.focus(); }); });
    $$('[data-ad]',kap).forEach(function(t){ t.addEventListener(t.tagName==='SELECT'?'change':'input',function(){ var x=D.cumle['benim:'+k]=D.cumle['benim:'+k]||{}; x[t.getAttribute('data-ad')]=t.value; kaydet(); }); });
    $('[data-kart]',kap).addEventListener('click',function(){ $('[data-acilan]',kap).classList.toggle('gizli'); });
    $('[data-tamam]',kap).addEventListener('click',function(){
      var x = D.cumle['benim:'+k]||{}, eksik=[];
      if((x.tanim||'').trim().length<10) eksik.push('tanım'); if((x.ornek||'').trim().length<10) eksik.push('örnek');
      if(!x.karis) eksik.push('karıştırılan kavram'); if((x.fark||'').trim().length<10) eksik.push('fark');
      if(eksik.length){ $('.kl-sonuc',kap).innerHTML='<p class="kl-uyari">Tamamlanmayan alan: '+eksik.join(', ')+'.</p>'; return; }
      sonucYaz(et,true);
      $('.kl-sonuc',kap).innerHTML = gb(true,'Cümlen kaydedildi.', (x.karis===K[k].karisan?'Seçtiğin kavram, en sık karıştırılan kavramla aynı. ':'Kavram kartında en sık karıştırılan kavram: <b>'+e(kAd(K[k].karisan))+'</b>. ')+'Kendi farkını kartla karşılaştırmayı unutma.')+ilerlemeNotu(et);
      $$('[data-kk="'+k+'"]',kap).forEach(function(b){ if(b.textContent.indexOf('✓')<0) b.textContent='✓ '+kAd(k); });
    });
  }
  ciz();
};

/* --- tabu: süreli, yasaklı kelimeli --- */
R.tabu = function(kap){
  var sira = karistir(TABU.map(function(_,i){ return i; })), p = 0, sure = 90, zamanlayici = null, kalan = sure;
  function yasakli(metin, t){
    var w = kelimeler(metin), bulunan = [];
    t.y.forEach(function(y){ if(yasakEslesir(w, y[1])) bulunan.push(y[0]); });
    /* Kavramın kendi adı da yasak. */
    var ad = sade(K[t.k].ad); if(w.some(function(x){ return x.indexOf(ad)===0; })) bulunan.push(K[t.k].ad+' (kavramın kendisi)');
    return bulunan;
  }
  function ciz(){
    clearInterval(zamanlayici); kalan = sure;
    var t = TABU[sira[p % sira.length]], et = ETK_ID['tabu-'+t.k];
    kap.innerHTML = etiketSatiri(et)+
      '<div class="kl-tabu-ust"><span>Tabu puanı: <b data-puan>'+D.tabuPuan+'</b></span><span class="kl-sure" data-sure aria-live="off">'+kalan+' sn</span></div>'+
      '<div class="kl-tabu-kart"><span class="gd-etiket">Kavram</span><h4>'+e(K[t.k].ad).toLocaleUpperCase('tr')+'</h4>'+
        '<span class="gd-etiket">Yasaklı kelimeler</span><ul class="kl-yasak">'+t.y.map(function(y){ return '<li>'+e(y[0])+'</li>'; }).join('')+'</ul></div>'+
      '<label class="kl-etiket" for="kl-tabu-yazi">Yasaklı kelimeleri kullanmadan kavramı açıkla (en az 10 kelime):</label>'+
      '<textarea class="yazi" id="kl-tabu-yazi" rows="3"></textarea>'+
      '<p class="kl-canli" data-canli aria-live="polite"></p>'+
      '<div class="dugmeler"><button type="button" class="btn kucuk" data-bitir>Bitir</button><button type="button" class="btn ikincil kucuk" data-sonraki>Sonraki kavram</button></div>'+
      '<div class="kl-sonuc" aria-live="polite"></div>'+etkinlikBilgisi(et);
    var yazi=$('#kl-tabu-yazi',kap), basladi=false, bitti=false;
    yazi.addEventListener('input',function(){
      if(!basladi){ basladi=true; zamanlayici=setInterval(function(){ kalan--; var s=$('[data-sure]',kap); if(!s){ clearInterval(zamanlayici); return; } s.textContent=Math.max(kalan,0)+' sn'; s.classList.toggle('kl-az',kalan<=15); if(kalan<=0) clearInterval(zamanlayici); },1000); }
      var b=yasakli(yazi.value,t); $('[data-canli]',kap).innerHTML = b.length?'⚠ Yasaklı: <b>'+b.map(e).join(', ')+'</b>':'<span class="ornek">'+kelimeler(yazi.value).length+' kelime</span>';
    });
    $('[data-bitir]',kap).addEventListener('click',function(){
      if(bitti) return;
      var n=kelimeler(yazi.value).length; if(n<3){ yazi.focus(); return; }
      bitti=true; clearInterval(zamanlayici); yazi.readOnly=true; this.disabled=true;
      var b=yasakli(yazi.value,t), temiz=!b.length, yeter=n>=10, puan = temiz&&yeter ? (kalan>0?10:5) : 0;
      D.tabuPuan += puan; kaydet(); $('[data-puan]',kap).textContent=D.tabuPuan;
      $('.kl-sonuc',kap).innerHTML = gb(temiz&&yeter, temiz&&yeter?'+'+puan+' puan'+(kalan>0?'':' (süre doldu, yarım puan)'):'Puan alınamadı',
        (temiz?'':'Kullandığın yasaklı kelimeler: <b>'+b.map(e).join(', ')+'</b>. ')+(yeter?'':'Açıklaman 10 kelimeden kısa. ')+'Bu oyun, kavramı ezber kelimelere yaslanmadan anlatabildiğini gösterir.')+
        '<div class="acilan"><h4>Örnek anlatım (yasaklı kelime yok)</h4><p>'+e(t.model)+'</p></div>'+ilerlemeNotu(et);
      sonucYaz(et, temiz&&yeter);
    });
    $('[data-sonraki]',kap).addEventListener('click',function(){ p++; ciz(); var y=$('#kl-tabu-yazi',kap); if(y) y.focus(); });
  }
  ciz();
};

/* ================= KAVRAM KARTLARI (1. adım) ================= */
function kartIc(k){
  var c = K[k];
  return '<h4 class="kl-kart-ad">'+e(c.ad)+'</h4><p>'+e(c.aciklama)+'</p>'+
    '<p class="kl-alan"><span>Anahtar kelimeler</span></p><div class="etiketler">'+c.anahtar.map(function(a){ return '<span>'+e(a)+'</span>'; }).join('')+'</div>'+
    '<p class="kl-alan"><span>Karıştırılabilecek kavram</span> <b>'+e(kAd(c.karisan))+'</b></p>'+
    '<p class="kl-alan"><span>Temel fark</span></p><p>'+e(c.fark)+'</p>'+
    '<p class="kl-alan"><span>Günlük hayat örneği</span></p><p>'+e(c.ornek)+'</p>';
}
function kartlarCiz(kap){
  kap.innerHTML =
    '<div class="kl-kart-izgara">'+K_SIRA.map(function(k){
      var c = K[k];
      return '<article class="kl-kart" id="kl-kart-'+k+'" tabindex="-1">'+kartIc(k)+
        '<p class="kl-alan"><span>İlişkiler</span></p><ul class="kl-bag">'+c.bag.map(function(b){
          return '<li><button type="button" class="kl-bag-btn" data-git="'+b[0]+'">→ '+e(kAd(b[0]))+'</button> '+e(b[1])+'</li>'; }).join('')+'</ul>'+
      '</article>';
    }).join('')+'</div>'+
    '<div class="kart kl-tur-kutu"><span class="gd-etiket">Tanıma turu</span><h3 style="margin:0 0 6px">Açıklamayı oku, kavramı bul</h3>'+
      '<p class="ornek" style="margin:0 0 10px">12 kavramın her biri için bir soru. Yanlış yaptığın kavram tekrar sırasına eklenir.</p><div data-tur></div></div>';
  $$('[data-git]',kap).forEach(function(b){ b.addEventListener('click',function(){
    var h = $('#kl-kart-'+b.getAttribute('data-git'));
    if(h){ h.scrollIntoView({behavior:'smooth',block:'center'}); h.classList.add('kl-vurgu'); h.focus({preventScroll:true}); setTimeout(function(){ h.classList.remove('kl-vurgu'); },1600); }
  }); });
  var tur = karistir(K_SIRA), i = 0, alan = $('[data-tur]',kap);
  function soru(){
    if(i>=tur.length){ alan.innerHTML='<p><b>Tur bitti.</b> Sonuçlar ilerleme paneline işlendi.</p><div class="dugmeler"><button type="button" class="btn kucuk" data-yeni>Yeni tur</button></div>';
      $('[data-yeni]',alan).addEventListener('click',function(){ tur=karistir(K_SIRA); i=0; soru(); }); return; }
    var kutu = document.createElement('div'); alan.innerHTML='<p class="ornek">Soru '+(i+1)+' / '+tur.length+'</p>'; alan.appendChild(kutu);
    R.tani(ETK_ID['tani-'+tur[i]], kutu, function(){
      var s=document.createElement('div'); s.className='dugmeler'; s.innerHTML='<button type="button" class="btn kucuk">Sonraki soru</button>'; alan.appendChild(s);
      s.firstChild.addEventListener('click',function(){ i++; soru(); var f=$('.kl-cip',alan); if(f) f.focus(); });
    });
  }
  soru();
}

/* ================= ADIMLAR ================= */
var ADIMLAR = [
  { no:1, ad:'Kavramı Tanı', aciklama:'12 kavramı ilişkileriyle birlikte tanı; sonra tanıma turunda kendini yokla.' },
  { no:2, ad:'Ayırt Et', aciklama:'Birbirine karıştırılan kavramları karşılaştır. Önce kendin yaz, sonra açıklamayı aç.' },
  { no:3, ad:'Olayda Bul', aciklama:'Kısa olaylarda devreye giren kavramları bul; metinden kanıt göster.' },
  { no:4, ad:'İlişki Kur', aciklama:'Kavram zincirlerini kur, kavramlar arasındaki bağı kendi cümlenle açıkla; ayet ve hadisleri kavramlarla eşleştir.' },
  { no:5, ad:'Yanlışı Yakala', aciklama:'Günlük hayatta duyduğun cümlelerdeki kavram yanılgılarını yakala.' },
  { no:6, ad:'Hayatla İlişkilendir', aciklama:'Gerçek hayat senaryolarında hangi kavramların işlediğini gerekçelendir.' },
  { no:7, ad:'Kendi Örneğini Üret', aciklama:'Kavramı kendi cümlenle anlat; Tabu oyununda ezber kelimeler olmadan açıkla.' }
];
var seviye = (function(){ try{ return localStorage.getItem('dk11kl-seviye')||'tumu'; }catch(x){ return 'tumu'; } })();
var aktifAdim = 1;

function listeCiz(kap, etler, baslik){
  var gorunen = etler.filter(function(et){ return seviye==='tumu' || et.zorluk===seviye; });
  var html = (baslik?'<h3 class="kl-grup-bas">'+baslik+'</h3>':'');
  if(!gorunen.length){ kap.insertAdjacentHTML('beforeend', html+'<p class="ornek kl-bos-seviye">Bu bölümde seçili seviyede ('+ZORLUK[seviye]+') etkinlik yok. Başka bir seviye seç.</p>'); return; }
  kap.insertAdjacentHTML('beforeend', html);
  gorunen.forEach(function(et){
    var d = document.createElement('div'); d.className='kart kl-etk'; d.id='kl-e-'+et.id; kap.appendChild(d); R[et.tur](et,d);
  });
}
function adimCiz(){
  var alan = $('#klAdimIcerik'), a = ADIMLAR[aktifAdim-1];
  alan.innerHTML = '<p class="alt-bilgi kl-adim-aciklama"><b>'+a.no+'. '+e(a.ad)+':</b> '+e(a.aciklama)+'</p>';
  var turdeki = function(t){ return ETK.filter(function(x){ return x.tur===t; }); };
  if(aktifAdim===1){ var k=document.createElement('div'); alan.appendChild(k); kartlarCiz(k); }
  if(aktifAdim===2) listeCiz(alan, turdeki('fark'));
  if(aktifAdim===3){ listeCiz(alan, turdeki('bul'), 'Kavramı Bul'); listeCiz(alan, turdeki('dedektif'), 'Kavram Dedektifi'); }
  if(aktifAdim===4){ listeCiz(alan, turdeki('zincir'), 'Kavramlar Zinciri'); listeCiz(alan, turdeki('coklu'), 'Kavramları Birlikte Açıkla'); listeCiz(alan, turdeki('ayet'), 'Ayet–Kavram Eşleştirme');
    alan.insertAdjacentHTML('beforeend','<div class="kart kl-harita-git"><span class="gd-etiket">Kavram Haritası</span><p style="margin:4px 0 10px">Bütün kavramları tek bir haritada, aralarındaki bağlarla görmek için ünite sonu kavram haritasını aç. Bir kavrama dokunduğunda tanımı, örneği ve bağlantıları açılır.</p><a class="btn kucuk" href="dusun-karar-ver.html#son">Kavram haritasını aç →</a></div>'); }
  if(aktifAdim===5) listeCiz(alan, karistir(turdeki('yanilgi')));
  if(aktifAdim===6){ listeCiz(alan, turdeki('hayat'), 'Hayattan Kavrama');
    var ao=ETK_ID['ayni-sinav']; alan.insertAdjacentHTML('beforeend','<h3 class="kl-grup-bas">Aynı Olay – Farklı Kavram</h3>');
    if(seviye==='tumu'||seviye===ao.zorluk){ var d=document.createElement('div'); d.className='kart kl-etk'; alan.appendChild(d); R.ayniolay(ao,d); }
    else alan.insertAdjacentHTML('beforeend','<p class="ornek kl-bos-seviye">Bu etkinlik '+ZORLUK[ao.zorluk]+' seviyesindedir.</p>'); }
  if(aktifAdim===7){
    alan.insertAdjacentHTML('beforeend','<h3 class="kl-grup-bas">Benim Cümlem</h3>'); var c=document.createElement('div'); c.className='kart kl-etk'; alan.appendChild(c); R.cumle(c);
    alan.insertAdjacentHTML('beforeend','<h3 class="kl-grup-bas">Kavram Tabu</h3>'); var t=document.createElement('div'); t.className='kart kl-etk'; alan.appendChild(t); R.tabu(t);
  }
}
function adimDurumCiz(){
  $$('#klAdimlar [data-adim]').forEach(function(b){
    var n=+b.getAttribute('data-adim'), liste=ETK.filter(function(x){ return x.adim===n; }), yapilan=liste.filter(function(x){ return D.sonuc[x.id]; }).length;
    var s=$('.kl-adim-sayi',b); if(s) s.textContent = yapilan+'/'+liste.length;
  });
}

/* ================= İLERLEME PANELİ ================= */
function ilerlemeCiz(){
  var kap = $('#klIlerleme'); if(!kap) return;
  var say = {}; BOYUTLAR.forEach(function(b){ say[b[0]]={d:0,t:0,top:0}; });
  ETK.forEach(function(et){ if(say[et.boyut]) say[et.boyut].top++; });
  Object.keys(D.sonuc).forEach(function(id){ var s=D.sonuc[id]; if(!ETK_ID[id]||!say[s.b]) return; say[s.b].t++; if(s.d) say[s.b].d++; });
  var topD=0, topT=0;
  kap.innerHTML = BOYUTLAR.map(function(b){
    var x=say[b[0]], oran = x.t ? Math.round(100*x.d/x.t) : 0; topD+=x.d; topT+=x.t;
    return '<div class="kl-boyut"><div class="kl-boyut-ust"><span>'+(x.t && x.d===x.t?'✓ ':'')+b[1]+'</span>'+
      '<span class="kl-boyut-sayi">'+(x.t? x.d+'/'+x.t+' doğru · ':'')+x.t+'/'+x.top+' denendi</span></div>'+
      '<div class="kl-cubuk" role="img" aria-label="'+b[1]+': '+x.t+' etkinlikten '+x.d+' doğru; toplam '+x.top+' etkinlik"><span style="width:'+oran+'%"></span></div></div>';
  }).join('');
  var oz = $('#klIlerlemeOzet'); if(oz) oz.textContent = topT ? topT+' etkinlik · '+topD+' doğru' : 'henüz etkinlik yok';
}
function tekrarSeritCiz(){
  var kap = $('#klTekrarSerit'); if(!kap) return;
  if(!D.tekrar.length){
    kap.innerHTML = '<p class="ornek" style="margin:0">🔁 Tekrar sırası boş. Bir kavramda hata yaparsan, o kavram farklı bağlamlarda yeniden karşına çıkar.'+
      (D.pekisen.length?' Pekiştirilen kavramlar: <b>'+D.pekisen.map(kAd).map(e).join(', ')+'</b>.':'')+'</p>'; return;
  }
  kap.innerHTML = '<span class="kl-tekrar-bas">🔁 Tekrar sırası:</span> '+D.tekrar.map(function(t){
    return '<button type="button" class="kutu-btn kl-tekrar-btn" data-tekrar="'+t.k+'">'+e(kAd(t.k))+' <small>'+(t.asama)+'/5</small></button>'; }).join(' ');
  $$('[data-tekrar]',kap).forEach(function(b){ b.addEventListener('click',function(){ tekrarBaslat(b.getAttribute('data-tekrar')); }); });
}

/* ================= PEKİŞTİRME AKIŞI ================= */
function tekrarBaslat(k){
  var t = D.tekrar.filter(function(x){ return x.k===k; })[0]; if(!t) return;
  var kap = $('#klTekrarAlan'); kap.classList.remove('gizli');
  var sec = tekrarOgesi(t), ic;
  kap.innerHTML = '<div class="kl-tekrar-ust"><span class="gd-etiket">Pekiştirme · '+e(kAd(k))+'</span>'+
    '<ol class="kl-asamalar">'+ASAMA.map(function(a,i){ return '<li class="'+(i<t.asama?'ok':i===t.asama?'simdi':'')+'">'+a+'</li>'; }).join('')+'</ol>'+
    '<button type="button" class="btn ikincil kucuk" data-kapat>Kapat</button></div><div data-ic></div>';
  $('[data-kapat]',kap).addEventListener('click',function(){ kap.classList.add('gizli'); kap.innerHTML=''; });
  ic = $('[data-ic]',kap);
  function ilerle(d, id){
    if(id && t.gorulen.indexOf(id)<0) t.gorulen.push(id);
    if(id && ETK_ID[id]) (t.turler = t.turler || []).push(ETK_ID[id].tur);
    if(d) t.asama++;
    if(t.asama>=ASAMA.length){
      D.tekrar = D.tekrar.filter(function(x){ return x!==t; }); if(D.pekisen.indexOf(k)<0) D.pekisen.push(k); kaydet(); tekrarSeritCiz();
      ic.insertAdjacentHTML('beforeend','<div class="kl-gb kl-gb-d"><b>✓ “'+e(kAd(k))+'” pekişti.</b><p>Beş aşamanın tamamını farklı bağlamlarla geçtin. Kavram tekrar sırasından çıkarıldı.</p></div>');
      return;
    }
    kaydet(); tekrarSeritCiz();
    ic.insertAdjacentHTML('beforeend','<div class="dugmeler"><button type="button" class="btn kucuk" data-devam>'+(d?'Sonraki aşama: '+ASAMA[t.asama]:'Aynı aşama, farklı bir örnekle')+' →</button></div>');
    $('[data-devam]',ic).addEventListener('click',function(){ tekrarBaslat(k); var f=$('#klTekrarAlan button, #klTekrarAlan textarea'); if(f) f.focus(); });
  }
  if(sec.ozel==='kart'){
    ic.innerHTML = '<div class="kart">'+kartIc(k)+'<div class="dugmeler"><button type="button" class="btn kucuk" data-okudum>Okudum, devam</button></div></div>';
    $('[data-okudum]',ic).addEventListener('click',function(){ this.disabled=true; t.asama=1; kaydet(); tekrarSeritCiz(); tekrarBaslat(k); });
  } else if(sec.ozel){
    var AD = { ayirt:'Ayırt etme (tekrar)', ornek:'Örnekten tanıma (tekrar)', anahtar:'Anahtar kelimelerden tanıma (tekrar)' };
    var sanal = { id:'tekrar-'+sec.ozel+'-'+k, tur:'tani', kavram:[k],
      amac: sec.ozel==='ayirt'?'Kavramı en sık karıştırıldığı kavramdan ayırt edebilme.':'Kavramı farklı bir ipucundan tanıyabilme.',
      beceri:'KB3.3. Eleştirel Düşünme', deger:'D16. Sorumluluk', ogrenmeCiktisi:K[k].cikti, etkinlikTuru:AD[sec.ozel],
      zorluk: sec.ozel==='ayirt'?'gelistir':'temel', olcmeTuru:'Seçmeli, anında geri bildirim', geriBildirim:K[k].fark, boyut: sec.ozel==='ayirt'?'ayirt':'tanima', adim:0 };
    if(sec.ozel!=='ayirt') (t.uretilen = t.uretilen || []).push(sec.ozel);
    if(sec.ozel==='ayirt') ayirtSorusu(sanal, ic, t, function(d){ ilerle(d, null); });
    else { var kk=document.createElement('div'); kk.className='kart'; ic.appendChild(kk); R.tani(sanal, kk, function(d){ ilerle(d, null); }, sec.ozel); }
  } else {
    var kutu = document.createElement('div'); kutu.className='kart'; ic.appendChild(kutu);
    R[sec.et.tur](sec.et, kutu, function(d){ ilerle(d, sec.et.id); });
  }
  kap.scrollIntoView({behavior:'smooth', block:'start'});
}
/* Tekrar için üretilen ayırt etme sorusu: kavram ile en sık karıştırıldığı kavramın örnekleri. */
function ayirtSorusu(et, ic, t, bitti){
  /* Her denemede sırayla kavramın ve karıştırıldığı kavramın örneği gösterilir; aynı soru arka arkaya gelmez. */
  var k = et.kavram[0], kar = K[k].karisan, sayac = t.ayirt||0, hangisi = sayac%2===0 ? k : kar;
  t.ayirt = sayac+1; kaydet();
  var kutu = document.createElement('div'); kutu.className='kart'; ic.appendChild(kutu);
  kutu.innerHTML = etiketSatiri(et)+'<p class="kl-soru">Bu örnek hangi kavrama daha uygundur?</p><blockquote class="kl-alinti">'+e(K[hangisi].ornek)+'</blockquote>'+
    '<div class="kl-cipler">'+karistir([k,kar]).map(function(x){ return cip(x); }).join('')+'</div><div class="kl-sonuc" aria-live="polite"></div>';
  $$('.kl-cip',kutu).forEach(function(b){ b.addEventListener('click',function(){
    if(kutu.getAttribute('data-bitti')) return; kutu.setAttribute('data-bitti','1');
    var d = b.getAttribute('data-k')===hangisi;
    $$('.kl-cip',kutu).forEach(function(x){ x.disabled=true; if(x.getAttribute('data-k')===hangisi) x.classList.add('kl-dogru'); else if(x===b) x.classList.add('kl-yanlis'); });
    $('.kl-sonuc',kutu).innerHTML = gb(d, d?'Doğru ayırt ettin.':'Bu örnek “'+kAd(hangisi)+'” ile ilgili.', e(K[k].fark))+ilerlemeNotu(et);
    D.sonuc[et.id]={ d:d, b:et.boyut, t:Date.now() }; kaydet(); ilerlemeCiz();
    bitti(d);
  }); });
}

/* ================= KURULUM ================= */
function kur(){
  var kok = document.getElementById('kavram-lab'); if(!kok) return;
  var gov = $('#klGovde',kok);
  gov.innerHTML =
    '<div class="kl-ust-izgara">'+
      '<div class="kart kl-seviye-kart"><span class="gd-etiket">Seviye</span>'+
        '<div class="kl-seviyeler" role="group" aria-label="Zorluk seviyesi">'+
          [['tumu','Tümü']].concat(Object.keys(ZORLUK).map(function(z){ return [z,ZORLUK[z]]; })).map(function(z){
            return '<button type="button" class="kutu-btn'+(seviye===z[0]?' sec':'')+'" data-seviye="'+z[0]+'" aria-pressed="'+(seviye===z[0])+'"'+(ZORLUK_ACIKLAMA[z[0]]?' title="'+ZORLUK_ACIKLAMA[z[0]]+'"':'')+'>'+z[1]+'</button>'; }).join('')+
        '</div><p class="ornek kl-seviye-not">'+(ZORLUK_ACIKLAMA[seviye]||'Bütün seviyeler gösteriliyor.')+'</p>'+
        '<div id="klTekrarSerit" class="kl-tekrar-serit"></div></div>'+
      '<details class="kart kl-ilerleme-kart" id="klIlerlemeKutu"><summary><span class="gd-etiket">Portal öğrenme ilerlemesi</span><span class="kl-ozet" id="klIlerlemeOzet"></span></summary>'+
        '<div id="klIlerleme"></div>'+
        '<p class="kl-not">Bu gösterge yalnızca bu cihazda, laboratuvardaki etkinliklerden hesaplanır. Resmî MEB ölçmesi ya da not değildir.</p>'+
        '<button type="button" class="btn ikincil kucuk" id="klSifirla">İlerlemeyi sıfırla</button></details>'+
    '</div>'+
    '<div id="klTekrarAlan" class="kl-tekrar-alan gizli" aria-live="polite"></div>'+
    '<div class="kl-adimlar" id="klAdimlar" role="tablist" aria-label="Laboratuvar adımları">'+ADIMLAR.map(function(a){
      return '<button type="button" role="tab" id="kl-tab-'+a.no+'" aria-controls="klAdimIcerik" aria-selected="'+(a.no===aktifAdim)+'" tabindex="'+(a.no===aktifAdim?0:-1)+'" data-adim="'+a.no+'">'+
        '<span class="kl-adim-no">'+a.no+'</span><span class="kl-adim-ad">'+e(a.ad)+'</span><span class="kl-adim-sayi"></span></button>'; }).join('')+'</div>'+
    '<div id="klAdimIcerik" role="tabpanel" aria-labelledby="kl-tab-'+aktifAdim+'" tabindex="0"></div>';

  var tablar = $$('#klAdimlar [data-adim]',kok);
  function sec(n, odak){
    aktifAdim=n;
    tablar.forEach(function(b){ var s=+b.getAttribute('data-adim')===n; b.setAttribute('aria-selected',s); b.tabIndex=s?0:-1; if(s&&odak) b.focus(); });
    $('#klAdimIcerik').setAttribute('aria-labelledby','kl-tab-'+n);
    adimCiz(); adimDurumCiz();
  }
  tablar.forEach(function(b){
    b.addEventListener('click',function(){ sec(+b.getAttribute('data-adim')); });
    b.addEventListener('keydown',function(ev){
      var n=+b.getAttribute('data-adim'), y=null;
      if(ev.key==='ArrowRight'||ev.key==='ArrowDown') y = n%7+1;
      if(ev.key==='ArrowLeft'||ev.key==='ArrowUp') y = (n+5)%7+1;
      if(ev.key==='Home') y=1; if(ev.key==='End') y=7;
      if(y){ ev.preventDefault(); sec(y,true); }
    });
  });
  $$('[data-seviye]',kok).forEach(function(b){ b.addEventListener('click',function(){
    seviye=b.getAttribute('data-seviye'); try{ localStorage.setItem('dk11kl-seviye',seviye); }catch(x){}
    $$('[data-seviye]',kok).forEach(function(x){ var s=x===b; x.classList.toggle('sec',s); x.setAttribute('aria-pressed',s); });
    $('.kl-seviye-not',kok).textContent = ZORLUK_ACIKLAMA[seviye]||'Bütün seviyeler gösteriliyor.';
    adimCiz();
  }); });
  $('#klSifirla',kok).addEventListener('click',function(){
    if(!window.confirm('Laboratuvardaki ilerleme, tekrar sırası, Tabu puanı ve yazdığın cümleler bu cihazdan silinsin mi?')) return;
    D = { sonuc:{}, tekrar:[], cumle:{}, tabuPuan:0, pekisen:[] }; kaydet(); ilerlemeCiz(); tekrarSeritCiz(); adimDurumCiz(); adimCiz();
    $('#klTekrarAlan').classList.add('gizli');
  });
  /* Geniş ekranda panel açık, telefonda kapalı gelir (etkinliklere hızlı ulaşım). */
  try{ if(!window.matchMedia || window.matchMedia('(min-width: 861px)').matches) $('#klIlerlemeKutu',kok).open = true; }catch(x){ $('#klIlerlemeKutu',kok).open = true; }
  ilerlemeCiz(); tekrarSeritCiz(); sec(aktifAdim);
}

window.KAVRAM_LAB = { kavramlar:K, etkinlikler:ETK.map(function(x){ var y={}; Object.keys(x).forEach(function(k){ if(k!=='veri') y[k]=x[k]; }); return y; }),
  cikti:KL_CIKTI, tabu:TABU, durum:function(){ return D; }, veri:function(id){ return ETK_ID[id] && ETK_ID[id].veri; } };
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',kur); else kur();
})();
