/* =====================================================================
   🔭 KAVRAM LABORATUVARI — 10. Sınıf 1. Ünite: İslam’da Varlık ve Bilgi
   ---------------------------------------------------------------------
   index.html#kavram-lab içine yerleşir. Sayfanın mevcut kodlarına
   dokunmaz; kendi kapsamı (IIFE) içinde çalışır. Motor (DURUM'dan
   itibaren) 11. sınıf laboratuvarıyla aynıdır; yalnızca veri değişir.

   İÇERİK AYRIMI (önemli):
   • KL_CIKTI → Resmî MEB metni (TYMM DKAB 10. sınıf 1. ünite öğrenme
     çıktıları; bkz. ../ortak/meb-program.js). Ekranda yalnızca
     "MEB çıktısı" etiketiyle, koduyla ve resmî adıyla gösterilir.
   • Kavram açıklamaları, etkinlikler, "amac" ve geri bildirimler PORTAL
     tarafından, ünite sayfasındaki ders kitabı özetinden hareketle
     hazırlanmıştır; resmî kazanım olarak sunulmaz.
   • İlerleme göstergesi "Portal öğrenme ilerlemesi"dir; cihazda tutulur,
     resmî ölçme sonucu değildir.
   ===================================================================== */
(function(){
'use strict';

/* ---------- Resmî MEB öğrenme çıktıları (olduğu gibi) ---------- */
var KL_CIKTI = {
  'DKAB.10.1.1':'İslam’da bilginin yerini ve kaynaklarını çözümleyebilme',
  'DKAB.10.1.2':'Allah-âlem ilişkisini tefekkür ederek sorgulayabilme',
  'DKAB.10.1.3':'İsra suresi 36 ve Mülk suresi 23. ayetlerin mesajlarını özetleyebilme'
};
var VARSAYILAN_CIKTI = 'DKAB.10.1.1';
var ANAHTAR_ONEKI = 'dk10kl';
var ETKINLIK_SAYFASI = 'dusun-dogrula.html';
var ETKINLIK_SAYFASI_AD = 'Düşün, Araştır, Doğrula';

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
  sadik:{ ad:'Sadık haber', cikti:'DKAB.10.1.1',
    aciklama:'Fiilen gerçekleşmiş bir olayın aktarılması. İki kısımdır: haberiresul (vahiy) ve mütevatir haber. Esas olan kişinin inanması değil, olayın gerçekten yaşanmış olmasıdır.',
    anahtar:['gerçekleşmiş olay','aktarım','haberiresul','mütevatir'],
    karisan:'zan',
    fark:'Sadık haber gerçekleşmiş bir olayı bildirir ve kesin bilgi verir. Zan ise kanıta dayanmayan tahmindir; ne kadar çok kişi tekrar ederse etsin sadık habere dönüşmez.',
    ornek:'Kur’an’daki bilgiler ve İstanbul’un 1453’te fethedildiği bilgisi.',
    bag:[['vahiy','Sadık haberin birinci kısmıdır.'],['mutevatir','Sadık haberin ikinci kısmıdır.'],['zan','Gerçekleşmemiş ya da kanıtsız söz sadık haber değildir.']] },
  vahiy:{ ad:'Vahiy (haberiresul)', cikti:'DKAB.10.1.1',
    aciklama:'Peygamberlerin Allah’tan (cc) alıp insanlara ulaştırdığı ilahi bilgi ve bu bilginin gönderiliş biçimi. İnananlar için kesin ve bağlayıcıdır.',
    anahtar:['ilahi bilgi','peygamber','kesin','bağlayıcı'],
    karisan:'mutevatir',
    fark:'Vahyin kaynağı Allah’tır, aracısı peygamberdir. Mütevatir haberin kaynağı ise olayı görüp duyan insan topluluklarıdır. Kur’an vahiydir; bize ulaşma yolu ise tevatürdür.',
    ornek:'Meleklerin, ahiretin ve cennetin özelliklerini Kur’an’dan öğrenmek.',
    bag:[['sadik','Vahiy sadık haberin bir kısmıdır.'],['gayb','Gayb âlemi hakkındaki bilgi vahiyle gelir.'],['akil','Akıl, vahyin açık hüküm koymadığı yerde onun ışığında çıkarım yapar.']] },
  mutevatir:{ ad:'Mütevatir haber', cikti:'DKAB.10.1.1',
    aciklama:'Yalan üzerinde birleşmeleri mümkün olmayan bir topluluğun, farklı zaman ve mekânlarda aynı içerikle aktardığı haber. Doğruluğundan şüphe edilmez.',
    anahtar:['kalabalık topluluk','kesintisiz aktarım','yalanda birleşemez','farklı zaman ve mekân'],
    karisan:'zan',
    fark:'Mütevatir haber, olayı bizzat görüp duyanlardan gelen ve birbirinden bağımsız çok sayıdaki aktarıma dayanır. Kalabalığın tekrar ettiği bir söylenti ise kaynağı belirsiz olduğu için zandır; paylaşılma sayısı onu mütevatir yapmaz.',
    ornek:'Malazgirt Savaşı’nın 1071’de yapıldığını hem Müslüman hem Bizans kaynaklarının aynı şekilde aktarması.',
    bag:[['sadik','Mütevatir haber sadık haberin bir kısmıdır.'],['vahiy','Kur’an vahiydir ve bize tevatürle ulaşmıştır.'],['zan','Kalabalığın tekrar ettiği söylenti mütevatir değildir.']] },
  akil:{ ad:'Selim akıl', cikti:'DKAB.10.1.1',
    aciklama:'Doğru karar vermeyi sağlayan, kötü etkilerden korunmuş akıl. Kavramlar arasında ilişki kurar, karşılaştırır, çıkarım yapar. Dinî sorumluluğun şartıdır.',
    anahtar:['çıkarım','karşılaştırma','doğruyu ayırma','sorumluluğun şartı'],
    karisan:'duyu',
    fark:'Duyular bilgiyi dış dünyadan toplar; akıl bu bilgiyi değerlendirir, ilişkilendirir ve sonuç çıkarır. Duyunun yanılmasını fark edip düzelten de akıldır.',
    ornek:'Dağın ardından yükselen dumana bakıp orada ateş yandığına hükmetmek.',
    bag:[['duyu','Akıl, duyuların getirdiği bilgiyi denetler.'],['vahiy','Akıl vahiyle birlikte doğru bilgiye ulaşır.'],['oznel','Öznel bilgiyi akıl teyit etmelidir.'],['alem','Âlemdeki düzenden yaratıcıya akılla ulaşılır.']] },
  duyu:{ ad:'Salim duyular', cikti:'DKAB.10.1.1',
    aciklama:'Herhangi bir etkenle temel özelliğini yitirmemiş görme, işitme, koklama, tatma ve dokunma duyuları. Gözlem ve deneyin aracıdır; sınırlıdır ve bazen yanılabilir.',
    anahtar:['gözlem','deney','beş duyu','sınırlı'],
    karisan:'akil',
    fark:'Duyular algılar, akıl yorumlar. Suya batırılan kalemi göz kırık görür; kalemin sağlam olduğuna akıl karar verir.',
    ornek:'Sütün bozulduğunu kokusundan anlamak; hilali gözle görmek.',
    bag:[['akil','Duyuların verdiği bilgi akılla denetlenir.'],['sehadet','Şehadet âlemi duyularla algılanır.'],['sukur','Duyular, şükredilmesi gereken nimetlerdir (Mülk 23).']] },
  oznel:{ ad:'Öznel bilgi', cikti:'DKAB.10.1.1',
    aciklama:'Kişinin kendi tecrübesiyle edindiği bilgi: sezgi, rüya, keşif, ilham; aile ve çevreden gelen kişisel bilgiler. Kesin değildir, doğrulanmaya (teyide) muhtaçtır.',
    anahtar:['sezgi','rüya','ilham','teyide muhtaç'],
    karisan:'akil',
    fark:'Akıl yürütme, herkesin izleyip denetleyebileceği adımlarla ilerler. Sezgi ve rüya ise yalnızca yaşayan kişiye aittir; başkası için kanıt sayılmaz ve akılla, vahiyle teyit edilmelidir.',
    ornek:'“İçimden bir ses bu bölümü seçmemi söylüyor.” diyen öğrencinin hissi.',
    bag:[['akil','Öznel bilgiyi akıl teyit eder.'],['zan','Teyit edilmeyen öznel bilgi zanna dönüşebilir.'],['vahiy','Öznel bilgi vahye aykırı olamaz.']] },
  zan:{ ad:'Zan', cikti:'DKAB.10.1.3',
    aciklama:'Kanıta dayanmayan tahmin ve kanaat. Hakikat adına bir şey ifade etmez (Yunus 36); kesin bilgi olmadan hüküm vermek yasaklanmıştır (İsra 36).',
    anahtar:['tahmin','kanıtsız','söylenti','kesin değil'],
    karisan:'mutevatir',
    fark:'Zan, kaynağı belirsiz ya da kanıtsız bir kanaattir. Mütevatir haber ise gerçekleşmiş bir olayın, yalanda birleşmesi imkânsız topluluklarca aktarılmasıdır. Bir söylentinin çok yayılması onu mütevatir yapmaz.',
    ornek:'Kimsenin görmediği hâlde “Kopya çekmiş galiba.” diye yayılan söylenti.',
    bag:[['dogrulama','Zandan kurtulmanın yolu doğrulamadır.'],['mutevatir','Söylenti, tevatürle karıştırılmamalıdır.'],['sadik','Zan sadık haberin karşıtıdır.']] },
  dogrulama:{ ad:'Doğrulama (tebeyyün)', cikti:'DKAB.10.1.3',
    aciklama:'Gelen bir haberin doğruluğunu, ona göre davranmadan ve onu yaymadan önce araştırmak (Hucurat 6). Meşru ve gerekli bir araştırmadır.',
    anahtar:['araştırmak','kaynağı sormak','karşılaştırmak','yaymadan önce'],
    karisan:'tecessus',
    fark:'Doğrulama, bir haberin gerçek olup olmadığını araştırmaktır ve emredilmiştir. Tecessüs ise başkalarının saklamak istediği gizli hâllerini araştırmaktır ve yasaktır. Biri haberin doğruluğunu, diğeri insanların özelini hedef alır.',
    ornek:'“Yarın okullar tatil” mesajını paylaşmadan önce resmî açıklamayı kontrol etmek.',
    bag:[['zan','Doğrulama zannı bilgiye ya da yanlışa ayırır.'],['tecessus','Doğrulama tecessüsle karıştırılmamalıdır.'],['akil','Doğrulama aklın gereğidir.']] },
  alem:{ ad:'Âlem', cikti:'DKAB.10.1.2',
    aciklama:'Akıl ve duyularla bilinebilen veya varlığı düşünülebilen, Allah’ın (cc) dışındaki bütün varlıklar. Varlığını sürdürmek için Allah’a muhtaçtır.',
    anahtar:['Allah’ın dışındaki varlıklar','yaratılmış','muhtaç','âlemlerin Rabbi'],
    karisan:'sehadet',
    fark:'Âlem görülen ve görülemeyen bütün varlıkları kapsar. Şehadet âlemi ise bunun yalnızca duyularla algılanabilen bölümüdür.',
    ornek:'İnsanlar, hayvanlar, yıldızlar, melekler: Hepsi âlemin parçasıdır.',
    bag:[['sehadet','Âlemin duyularla algılanan bölümü.'],['gayb','Âlemin duyularla algılanamayan bölümü.'],['akil','Âlemdeki düzen, akla yaratıcıyı gösterir.']] },
  sehadet:{ ad:'Şehadet âlemi', cikti:'DKAB.10.1.2',
    aciklama:'İnsanın duyular yoluyla (çıplak gözle ya da araçlar yardımıyla) algılayabildiği varlıklardan oluşan âlem.',
    anahtar:['görülen','duyularla algılanan','gözlem','evren'],
    karisan:'gayb',
    fark:'Şehadet âlemi duyularla algılanır ve gözlemle incelenir. Gayb âlemi ise akıl ve duyularla algılanamaz; onun bilgisi vahiyle gelir.',
    ornek:'Teleskopla gözlemlenen uzak galaksiler, mikroskopla görülen bakteriler.',
    bag:[['duyu','Şehadet âlemi duyularla bilinir.'],['gayb','Âlemin diğer bölümüdür.'],['alem','Âlemin bir bölümüdür.']] },
  gayb:{ ad:'Gayb âlemi', cikti:'DKAB.10.1.2',
    aciklama:'Akıl ve duyular yoluyla algılanamayan varlıkların oluşturduğu âlem: melek, cin, şeytan, ruh, ahiret, cennet, cehennem. Bilgisi vahiyle gelir (Cin 26-27).',
    anahtar:['görülmeyen','melek','ahiret','vahiyle bilinir'],
    karisan:'sehadet',
    fark:'Bir şeyin şu an görülmemesi onu gayb yapmaz: Bakteri çıplak gözle görülmez ama mikroskopla gözlemlenir, yani şehadet âlemindendir. Gayb, ilkesel olarak duyu ve deneyle ulaşılamayan alandır.',
    ornek:'Meleklerin varlığını ve görevlerini Kur’an’dan öğrenmek.',
    bag:[['vahiy','Gayb hakkındaki bilgi vahiyle gelir.'],['sehadet','Âlemin diğer bölümüdür.'],['duyu','Duyuların sınırı gaybın eşiğidir.']] },
  tecessus:{ ad:'Tecessüs', cikti:'DKAB.10.1.3',
    aciklama:'Başkalarının sırlarını, özel hayatlarını, hata ve kusurlarını araştırmak. Hucurat 12’de yasaklanmıştır.',
    anahtar:['gizli hâller','kusur araştırmak','özel hayat','yasak'],
    karisan:'dogrulama',
    fark:'Tecessüs insanların özelini kurcalamaktır ve yasaktır. Doğrulama ise yayılan bir haberin gerçek olup olmadığını araştırmaktır ve emredilmiştir.',
    ornek:'Bir arkadaşın telefonunu izinsiz karıştırıp mesajlarını okumak.',
    bag:[['dogrulama','Meşru araştırma ile tecessüs karıştırılmamalıdır.'],['sukur','Göz ve kulak nimetini tecessüste kullanmak şükre aykırıdır.']] },
  sukur:{ ad:'Şükür', cikti:'DKAB.10.1.3',
    aciklama:'Allah’ın (cc) nimetlerine minnettarlığı söz ve davranışla ifade etmek; nimeti veriliş amacına uygun kullanmak. Her nimetin şükrü kendi cinsiyledir.',
    anahtar:['minnettarlık','nimet','amacına uygun kullanmak','davranış'],
    karisan:'tecessus',
    fark:'İkisi de göz ve kulak gibi nimetlerin kullanımıyla ilgilidir: Şükür nimeti amacına uygun kullanmaktır; tecessüs aynı nimeti başkalarının gizlisini araştırmak için kullanmak, yani nimeti kötüye kullanmaktır.',
    ornek:'Gözünü haramdan sakınıp faydalı bir kitap okumak.',
    bag:[['duyu','Kulak, göz ve kalp şükredilmesi gereken nimetlerdir (Mülk 23).'],['tecessus','Nimeti kötüye kullanmak şükre aykırıdır.']] }
};
var K_SIRA = ['sadik','vahiy','mutevatir','akil','duyu','oznel','zan','dogrulama','alem','sehadet','gayb','tecessus','sukur'];

/* ---------- Etkinlik türü varsayılanları (portal) ---------- */
var TUR = {
  tani:     { etkinlikTuru:'Kavramı tanıma (eşleştirme)', beceri:'KB2.4. Çözümleme', deger:'D16. Sorumluluk', olcmeTuru:'Çoktan seçmeli, anında geri bildirim', boyut:'tanima', adim:1 },
  fark:     { etkinlikTuru:'Karşılaştırma (önce yaz, sonra aç)', beceri:'KB2.4. Çözümleme', deger:'D10. Mütevazılık', olcmeTuru:'Açık uçlu + öz değerlendirme', boyut:'ayirt', adim:2 },
  bul:      { etkinlikTuru:'Olayda kavramı bulma', beceri:'KB2.8. Sorgulama', deger:'D16. Sorumluluk', olcmeTuru:'Çoklu seçim + gerekçeli geri bildirim', boyut:'analiz', adim:3 },
  dedektif: { etkinlikTuru:'Kavram dedektifi (metinden kanıt)', beceri:'KB2.4. Çözümleme', deger:'D16. Sorumluluk', olcmeTuru:'Etiketleme + kanıt eşleştirme', boyut:'analiz', adim:3 },
  zincir:   { etkinlikTuru:'Kavramlar zinciri (sıralama)', beceri:'KB2.4. Çözümleme', deger:'D16. Sorumluluk', olcmeTuru:'Sıralama + kısa cevap', boyut:'iliski', adim:4 },
  coklu:    { etkinlikTuru:'Çok kavramlı açıklama', beceri:'KB2.8. Sorgulama', deger:'D16. Sorumluluk', olcmeTuru:'Açık uçlu + dereceli ölçüt (öz değerlendirme)', boyut:'analiz', adim:4 },
  ayet:     { etkinlikTuru:'Ayet–kavram eşleştirme', beceri:'KB2.3. Özetleme', deger:'D16. Sorumluluk', olcmeTuru:'Eşleştirme + gerekçeli geri bildirim', boyut:'iliski', adim:4 },
  yanilgi:  { etkinlikTuru:'Kavram yanılgısını yakala', beceri:'KB2.8. Sorgulama', deger:'D10. Mütevazılık', olcmeTuru:'Doğru–yanlış + yanılgı teşhisi', boyut:'ayirt', adim:5 },
  hayat:    { etkinlikTuru:'Hayattan kavrama (senaryo)', beceri:'KB2.4. Çözümleme', deger:'D16. Sorumluluk', olcmeTuru:'Çoklu seçim + “Neden?” açık uçlu', boyut:'ornek', adim:6 },
  ayniolay: { etkinlikTuru:'Aynı olay – farklı kavram', beceri:'KB2.8. Sorgulama', deger:'D16. Sorumluluk', olcmeTuru:'Açık uçlu + öz değerlendirme', boyut:'ornek', adim:6 },
  cumle:    { etkinlikTuru:'Benim cümlem', beceri:'KB2.3. Özetleme', deger:'D16. Sorumluluk', olcmeTuru:'Yazılı ürün (tamamlama)', boyut:'ornek', adim:7 },
  tabu:     { etkinlikTuru:'Kavram Tabu (süreli)', beceri:'KB2.3. Özetleme', deger:'D16. Sorumluluk', olcmeTuru:'Süreli üretim + yasaklı kelime kontrolü', boyut:'tanima', adim:7 }
};

/* ---------- 2. AYIRT ET ---------- */
var FARK = [
  { id:'fark-vahiy-mutevatir', a:'vahiy', b:'mutevatir', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1',
    benzer:'İkisi de sadık haberin kısımlarıdır ve kesin bilgi verir.',
    farkli:'Vahyin kaynağı Allah’tır, aracısı peygamberdir. Mütevatir haberin kaynağı ise olayı bizzat görüp duyan ve yalan üzerinde birleşmesi imkânsız insan topluluklarıdır.',
    ornek:'Kur’an’ın içeriği vahiydir; Kur’an’ın bize değişmeden ulaşması ise tevatürle olmuştur.' },
  { id:'fark-akil-duyu', a:'akil', b:'duyu', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1',
    benzer:'İkisi de İslam düşüncesinde nesnel bilgi kaynağıdır ve insana Allah’ın verdiği nimetlerdendir.',
    farkli:'Duyular dış dünyayı algılar; akıl algılananı değerlendirir, karşılaştırır ve sonuç çıkarır.',
    ornek:'Göz suya batırılan kalemi kırık görür (duyu); ışığın kırıldığını bilip kalemin sağlam olduğuna karar veren akıldır.' },
  { id:'fark-sehadet-gayb', a:'sehadet', b:'gayb', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.2',
    benzer:'İkisi de âlemin bölümleridir; ikisini de Allah yaratmıştır ve ikisi de O’na muhtaçtır.',
    farkli:'Şehadet âlemi duyularla algılanabilir ve gözlemle incelenir. Gayb âlemi akıl ve duyularla algılanamaz; bilgisi vahiyle gelir.',
    ornek:'Uzak bir galaksi teleskopla görüldüğü için şehadet âlemindendir; melekler ise gayb âlemindendir.' },
  { id:'fark-mutevatir-zan', a:'mutevatir', b:'zan', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.1',
    benzer:'İkisinde de bir bilgi çok sayıda kişi tarafından aktarılıyor olabilir.',
    farkli:'Mütevatir haber, olayı bizzat görüp duyanlardan gelir ve farklı zaman ve mekânlarda birbirinden bağımsız kişilerce aynı şekilde aktarılır. Zan ise kaynağı belirsiz ya da kanıtsızdır; kalabalığın tekrar etmesi onu kesinleştirmez.',
    ornek:'Çanakkale Savaşı’nın yaşandığı mütevatirdir. Binlerce kez paylaşılan kaynaksız bir “şok haber” ise zandır.' },
  { id:'fark-dogrulama-tecessus', a:'dogrulama', b:'tecessus', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.3',
    benzer:'İkisi de bir tür araştırmadır ve bilgi edinmeye yöneliktir.',
    farkli:'Doğrulama, yayılan bir haberin gerçek olup olmadığını araştırmaktır ve emredilmiştir (Hucurat 6). Tecessüs ise başkalarının saklamak istediği gizli hâllerini araştırmaktır ve yasaklanmıştır (Hucurat 12).',
    ornek:'Bir haberi paylaşmadan önce resmî kaynaktan kontrol etmek doğrulamadır; arkadaşının mesajlarını gizlice okumak tecessüstür.' },
  { id:'fark-oznel-akil', a:'oznel', b:'akil', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.1',
    benzer:'İkisi de insanın iç dünyasında gerçekleşir ve bir kanaate ulaşmasını sağlar.',
    farkli:'Akıl yürütme, başkalarının da izleyip denetleyebileceği adımlarla ilerler; bu yüzden nesneldir. Sezgi, rüya ve ilham yalnızca yaşayana aittir, başkası için kanıt sayılmaz ve teyit edilmelidir.',
    ornek:'“Bu sitenin yazarı belli değil, bilgisi başka kaynaklarla çelişiyor.” akıl yürütmedir. “İçimden bir ses bu bilgi doğru diyor.” sezgidir.' }
];

/* ---------- 3. OLAYDA KAVRAMI BUL ---------- */
var BUL = [
  { id:'bul-viral', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.3',
    metin:'Selin, sosyal medyada gördüğü “Yarın okullar tatil!” mesajını kaynağına bakmadan sınıf grubuna gönderdi. “Çok kişi paylaşmış, demek ki doğru.” dedi.',
    secenekler:['zan','dogrulama','mutevatir','sadik','duyu','gayb'],
    gerekli:['zan','dogrulama'], kabul:['mutevatir','sadik'],
    neden:{ zan:'Kaynağı belirsiz mesaj kanıtsız bir kanaattir.', dogrulama:'Selin’in yapması gereken, mesajı paylaşmadan önce doğrulamaktı.', mutevatir:'Selin çok paylaşılmayı tevatür sanıyor; yanılgı burada.', sadik:'Gerçekleştiği bilinmeyen bir olay sadık haber değildir.', duyu:'Olayda bilginin gözlemle edinilmesi söz konusu değil.', gayb:'Olay gayb âlemiyle ilgili değil.' },
    yanlisKavram:['mutevatir'],
    dogruGB:'Çok paylaşılmak tevatür değildir. Mütevatir haber, olayı bizzat görüp duyanlardan gelir ve birbirinden bağımsız kişilerce aynı şekilde aktarılır.',
    yanlisGB:'Burada mütevatir haber, kalabalığın tekrar ettiği söylentiyle karıştırılmış. Hucurat 6: Haberin doğruluğunu araştırın.' },
  { id:'bul-ruya', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1',
    metin:'Kerem rüyasında sınavdan yüksek not aldığını gördü ve “Nasılsa geçeceğim.” diyerek çalışmayı bıraktı.',
    secenekler:['oznel','akil','vahiy','duyu','mutevatir','sehadet'],
    gerekli:['oznel'], kabul:['akil'],
    neden:{ oznel:'Rüya öznel bir bilgi kaynağıdır.', akil:'Akıl, rüyaya dayanıp çalışmayı bırakmanın yanlışlığını görmeyi sağlar.', vahiy:'Peygamber olmayan birinin rüyası vahiy değildir.', duyu:'Rüya duyularla edinilen bir bilgi değildir.', mutevatir:'Olayda toplu bir aktarım yok.', sehadet:'Olayın odağı âlem türleri değil.' },
    yanlisKavram:['oznel'],
    dogruGB:'Rüya kişiye özel, kesin olmayan bir bilgidir; ona dayanarak sorumluluk terk edilemez.',
    yanlisGB:'Öznel bilgi kesin bilgi gibi görülmüş. Rüya ne başkasını bağlar ne de çalışma sorumluluğunu kaldırır.' },
  { id:'bul-kalem', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.1',
    metin:'Fen dersinde suya batırılan kalem kırık göründü. Öğrenciler kalemi sudan çıkarıp baktılar; öğretmen de ışığın sudan havaya geçerken kırıldığını anlattı.',
    secenekler:['duyu','akil','sadik','oznel','zan','gayb'],
    gerekli:['duyu','akil'], kabul:['sadik'],
    neden:{ duyu:'Kalemin kırık görünmesi ve sudan çıkarılıp yeniden bakılması duyularla ilgilidir.', akil:'Çelişkiyi fark edip açıklamayı kavrayan akıldır.', sadik:'Öğretmenden öğrenilen bilimsel bilgi güvenilir bir aktarımdır; ama metnin odağı duyu–akıl ilişkisidir.', oznel:'Olayda sezgi ya da rüya yok.', zan:'Sonuç tahmine değil gözlem ve açıklamaya dayanıyor.', gayb:'Kalem ve ışık şehadet âlemine aittir.' },
    yanlisKavram:['yok'],
    dogruGB:'Bu olayda kavramlar doğru kullanılmış: Duyunun yanılgısı yeniden gözlem ve akılla düzeltilmiş.',
    yanlisGB:'Bu olayda yanlış anlaşılan bir kavram yok. Kaynaklar birbirini denetlemiş.' },
  { id:'bul-melek', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.2',
    metin:'Bir öğrenci, “Melekleri ne mikroskopla ne de teleskopla görebiliyoruz; demek ki yoklar.” dedi.',
    secenekler:['gayb','sehadet','vahiy','duyu','akil','mutevatir'],
    gerekli:['gayb','duyu','vahiy'], kabul:['sehadet','akil'],
    neden:{ gayb:'Melekler gayb âlemine aittir.', duyu:'Öğrenci duyuları ve araçları her şeyin ölçüsü sanıyor.', vahiy:'Meleklerin varlığı vahiyle bildirilmiştir.', sehadet:'Mikroskop ve teleskop şehadet âlemini inceler; gaybı değil.', akil:'Bir şeyi görmemenin onun yokluğunu kanıtlamadığını akıl fark eder.', mutevatir:'Olayın odağı toplu aktarım değil.' },
    yanlisKavram:['duyu'],
    dogruGB:'Duyuların ve araçların bir sınırı vardır; gayb âlemi ilkesel olarak bu sınırın ötesindedir. Onun bilgisi vahiyle gelir.',
    yanlisGB:'Duyular her şeyin ölçüsü sanılmış. Görmemek, yokluğun kanıtı değildir.' },
  { id:'bul-tecessus', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.3',
    metin:'Ece, sınıf arkadaşının telefonunu izinsiz karıştırıp mesajlarını okudu. “Sadece gerçeği öğrenmek istedim; araştırmak kötü bir şey mi?” dedi.',
    secenekler:['tecessus','dogrulama','akil','sukur','zan','duyu'],
    gerekli:['tecessus'], kabul:['dogrulama','sukur'],
    neden:{ tecessus:'Başkasının özelini izinsiz araştırmak tecessüstür.', dogrulama:'Ece yaptığı şeyi meşru bir doğrulama gibi sunuyor; yanılgı burada.', akil:'Olayın odağı akıl yürütme değil.', sukur:'Göz nimetini başkasının gizlisine bakmak için kullanmak şükre aykırıdır.', zan:'Olayda tahmin değil, gizli bilgiye ulaşma çabası var.', duyu:'Duyu kullanılmış ama asıl mesele nimetin nasıl kullanıldığıdır.' },
    yanlisKavram:['dogrulama'],
    dogruGB:'Her araştırma meşru değildir. Haberin doğruluğunu araştırmak emredilmiş, insanların gizli hâllerini araştırmak yasaklanmıştır (Hucurat 6 ve 12).',
    yanlisGB:'Tecessüs, meşru araştırma (doğrulama) gibi gösterilmiş.' },
  { id:'bul-muaz', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.1',
    metin:'Hz. Peygamber, Yemen’e vali olarak gönderdiği Muaz’a nasıl hüküm vereceğini sordu. Muaz önce Allah’ın kitabına, sonra Resulullahın sünnetine, orada da bulamazsa kendi görüşüyle içtihat ederek karar vereceğini söyledi. Hz. Peygamber bu cevaptan memnun oldu (Tirmizi, Ahkâm, 3).',
    secenekler:['vahiy','akil','sadik','oznel','mutevatir','zan'],
    gerekli:['vahiy','akil'], kabul:['sadik'],
    neden:{ vahiy:'Kitap ve sünnet, haberiresul kapsamındadır.', akil:'İçtihat, vahyin ışığında akıl yürütmektir.', sadik:'Vahiy sadık haberin bir kısmıdır.', oznel:'İçtihat keyfî bir his değil, kaynaklara dayalı akıl yürütmedir.', mutevatir:'Metnin odağı aktarım yolu değil, hüküm verirken başvurulan kaynaklardır.', zan:'Muaz kanıtsız bir kanaatle değil, kaynaklara dayanarak karar veriyor.' },
    yanlisKavram:['yok'],
    dogruGB:'Kavramlar doğru kullanılmış: Önce vahiy (Kur’an ve sünnet), sonra onun ışığında akıl. Kaynaklar sıralı ve tamamlayıcıdır.',
    yanlisGB:'Bu metinde yanlış anlaşılan bir kavram yok; bilgi kaynakları doğru sırayla kullanılmış.' }
];

/* ---------- 3. KAVRAM DEDEKTİFİ ---------- */
var DEDEKTIF = [
  { id:'ded-deprem', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.3',
    cumleler:['Ahmet, bir grupta “Şehrimizde yarın büyük deprem olacak!” diyen bir mesaj gördü.','Mesajın kimden çıktığını sordu; kaynağı belirsizdi.','Resmî kurumların sitelerine bakıp böyle bir açıklama olmadığını gördü.','Depremin zamanının bugünkü bilgiyle kesin olarak bilinemeyeceğini düşündü.','Mesajı paylaşmadı ve gruptakilerden de yaymamalarını rica etti.'],
    etiketler:['zan','dogrulama','akil','sadik','duyu'],
    kanit:{ zan:[0,1], dogrulama:[1,2,4], akil:[3] },
    tuzak:{ sadik:'Kaynağı belirsiz mesaj sadık haber değildir; gerçekleşmiş bir olayı aktarmıyor.', duyu:'Metinde bilgiyi doğrudan gözlemle edinme yok.' },
    geriBildirim:'Kaynaksız mesaj zandır; kaynağı sormak, resmî açıklamayı kontrol etmek ve yaymamak doğrulamadır; depremin zamanının kesin bilinemeyeceğini düşünmek aklın işidir.' },
  { id:'ded-heysem', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.1',
    cumleler:['İbnü’l-Heysem, görmenin nasıl gerçekleştiğini merak etti.','Önceki âlimlerin görüşlerini okudu ve aralarındaki çelişkileri fark etti.','Karanlık bir odada ışığın küçük bir delikten geçişini defalarca gözlemledi.','Gözlemlerinden, ışığın cisimden göze geldiği sonucunu çıkardı.','Sonuçlarını kitabına yazarak sonraki nesillere aktardı.'],
    etiketler:['duyu','akil','oznel','zan','vahiy'],
    kanit:{ duyu:[2], akil:[1,3] },
    tuzak:{ oznel:'Metinde sezgi ya da rüyaya dayanan bilgi yok; bilgi gözlem ve akılla elde ediliyor.', zan:'Ulaşılan sonuç tahmine değil, tekrarlanan gözleme dayanıyor.', vahiy:'Konu bir doğa olayı; bilgi vahiyle değil, gözlem ve akılla edinilmiş.' },
    geriBildirim:'Çelişkileri fark etmek ve gözlemden sonuç çıkarmak aklın, ışığı defalarca gözlemlemek duyuların işidir. Bilimsel bilgi bu iki kaynağın birlikte çalışmasıyla üretilir.' },
  { id:'ded-gece', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.2',
    cumleler:['Zeynep bir yaz gecesi gökyüzündeki yıldızları seyretti.','Teleskopla bakınca çıplak gözle göremediği yıldızları da gördü.','Bu kadar büyük bir düzenin kendiliğinden olamayacağını düşündü.','Melekleri ve ahireti ise ne gözle ne de teleskopla görebileceğini fark etti.','Bunları öğrenmek için Kur’an’a başvurdu ve Cin suresinin 26-27. ayetlerini okudu.','Kendisine bakan gözleri ve düşünen aklı verdiği için Allah’a şükretti.'],
    etiketler:['duyu','sehadet','akil','gayb','vahiy','sukur','zan'],
    kanit:{ duyu:[0,1], sehadet:[0,1], akil:[2], gayb:[3], vahiy:[4], sukur:[5] },
    tuzak:{ zan:'Metindeki çıkarımlar tahmine değil gözleme, akla ve vahye dayanıyor.' },
    geriBildirim:'Yıldızları gözlemek duyuların, yıldızlar şehadet âleminin, düzenden yaratıcıya ulaşmak aklın işidir. Melekler ve ahiret gaybdır; bilgisi vahiyle gelir. Bilgi araçları için teşekkür etmek şükürdür.' }
];
var EK_ETIKET = {};

/* ---------- 4. KAVRAMLAR ZİNCİRİ ---------- */
var ZINCIR = [
  { id:'zin-bilgi', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['sadik','akil'],
    ogeler:['Doğru bilgi','Doğru inanç','Doğru davranış'],
    esdeger:[],
    model:'Doğru bilgi insanı doğru inanca, doğru inanç da doğru davranışa yönlendirir. Bu yüzden bilginin kaynağı ve doğruluğu, davranışlarımızın sağlamlığını doğrudan etkiler.' },
  { id:'zin-dogrulama', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.3', kavram:['dogrulama','zan'],
    ogeler:['Bir haber duymak','Haberin kaynağını sormak','Güvenilir kaynaklarla karşılaştırmak','Doğruysa paylaşmak, değilse yaymamak'],
    esdeger:[],
    model:'Duyulan her haber önce bir iddiadır. Kaynağı sorulup güvenilir kaynaklarla karşılaştırıldıktan sonra bilgiye ya da yanlışa ayrılır. Hucurat 6’daki “doğruluğunu araştırın” emri bu zincirin özüdür.' },
  { id:'zin-kalem', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['duyu','akil'],
    ogeler:['Göz, sudaki kalemi kırık görür','Akıl, kalemin aslında kırılmış olamayacağını sorgular','Kalem sudan çıkarılıp yeniden bakılır','Işığın kırılması bilgisiyle görüntü açıklanır'],
    esdeger:[],
    model:'Duyu bir veri getirir; akıl çelişkiyi fark edip sorgular; yeni bir gözlem yapılır; öğrenilmiş bilgiyle sonuç açıklanır. Bilgi kaynakları birbirini denetleyerek doğru bilgiye ulaştırır.' },
  { id:'zin-alem', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.2', kavram:['sehadet','akil','gayb','vahiy','sukur'],
    ogeler:['Âlemdeki düzeni gözlemlemek (şehadet âlemi)','Bu düzenin bir yaratıcısı olduğunu akılla çıkarmak','Görülmeyen âlem hakkında vahye başvurmak (gayb)','Kulluk ve şükürle karşılık vermek'],
    esdeger:[],
    model:'İnsan önce gördüğü âlemi gözlemler, aklıyla düzenden yaratıcıya ulaşır. Göremediği gayb âlemini vahiyden öğrenir. Bu bilgi onu kulluğa ve nimetlere şükre yöneltir.' },
  { id:'zin-muaz', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['vahiy','akil'],
    ogeler:['Allah’ın kitabı (Kur’an)','Resulullahın sünneti','Kur’an ve sünnetin ışığında içtihat (akıl)'],
    esdeger:[],
    model:'Muaz hadisindeki sıra: önce Kur’an, sonra sünnet, en son bunların ışığında içtihat. Akıl vahyin yerine geçmez; vahyin açık hüküm koymadığı yerde onun rehberliğinde çalışır.' }
];

/* ---------- 4. ÇOK KAVRAMLI AÇIKLAMA (derin) ---------- */
var COKLU = [
  { id:'cok-kaynak', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['vahiy','akil','duyu'],
    soru:'Sadık haber, selim akıl ve salim duyuların birbirini nasıl tamamladığını kendi seçtiğin bir örnek üzerinden açıkla.',
    olcut:['Üç nesnel bilgi kaynağını doğru adlandırdım.','Her kaynağın ne tür bilgi verdiğini belirttim.','Duyuların sınırını ve aklın denetleyici rolünü açıkladım.','Gayb gibi konularda vahyin zorunlu olduğunu belirttim.','Açıklamamı somut bir örnekle destekledim.'],
    esik:4,
    model:'Örnek: Bir öğrencinin âlemi tanıması. Gözleriyle yıldızları ve canlıları gözlemler (salim duyular); ama duyular sınırlıdır, uzaktaki yıldızı küçük görür. Aklı, gözlemlerini değerlendirir, yıldızın aslında çok büyük olduğunu hesaplar ve bu düzenin bir yaratıcısı olduğu sonucuna varır (selim akıl). Melekler ve ahiret gibi gözlem ve akılla ulaşılamayan konuları ise Kur’an’dan öğrenir (sadık haber/vahiy). Kaynaklar birbirine rakip değil, birbirini tamamlayan ve denetleyen yollardır.' },
  { id:'cok-dijital', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.3', kavram:['zan','dogrulama','sukur'],
    soru:'İsra 36 ve Mülk 23. ayetleri birlikte düşünerek bir öğrencinin sosyal medya kullanımı için üç ilke yaz ve her birini gerekçelendir.',
    olcut:['Kesin bilgi olmadan paylaşmama ilkesini İsra 36 ile ilişkilendirdim.','Doğrulama (kaynak sorma, karşılaştırma) adımı önerdim.','Kulak, göz ve kalbin sorumluluğuna değindim.','Bu nimetlerin şükrünü (amacına uygun kullanım) açıkladım.','Tecessüs ya da iftiradan kaçınmaya değindim.'],
    esik:4,
    model:'1) Doğrulamadan paylaşmam: İsra 36’ya göre hakkında kesin bilgim olmayan şeyin peşine düşemem; Hucurat 6 da haberin doğruluğunu araştırmamı ister. 2) Gözümü ve kulağımı başkalarının özel hayatına çevirmem: Kulak, göz ve kalp nasıl kullanıldıklarından sorumludur; başkalarının gizlisini araştırmak tecessüstür. 3) Bu araçları faydalı bilgi için kullanırım: Mülk 23’e göre onları veren Allah’tır; şükür, nimeti amacına uygun kullanmaktır.' }
];

/* ---------- 4. AYET–KAVRAM EŞLEŞTİRME ----------
   Meal metinleri ünite sayfası (index.html) ve “Düşün, Araştır, Doğrula”
   sayfasındaki metinlerle aynıdır. Eşleştirme ve açıklamalar portalındır. */
var AYET_METIN = {
  isra36:      { kisa:'İsra 36', kay:'İsra suresi, 36. ayet',
    m:'Hakkında kesin bilgi sahibi olmadığın şeyin peşine düşme. Çünkü kulak, göz ve kalp, bunların hepsi ondan sorumludur.' },
  mulk23:      { kisa:'Mülk 23', kay:'Mülk suresi, 23. ayet',
    m:'De ki: “O, sizi yaratan ve size kulaklar, gözler ve kalpler verendir. Ne kadar da az şükrediyorsunuz!”' },
  hucurat6:    { kisa:'Hucurat 6', kay:'Hucurat suresi, 6. ayet',
    m:'Ey iman edenler! Size bir fasık bir haber getirirse, bilmeyerek bir topluluğa zarar verip yaptığınıza pişman olmamak için o haberin doğruluğunu araştırın.' },
  hucurat12:   { kisa:'Hucurat 12', kay:'Hucurat suresi, 12. ayet',
    m:'…Birbirinizin gizli hâllerini araştırmayın…' },
  aliimran190: { kisa:'Al-i İmran 190', kay:'Al-i İmran suresi, 190. ayet',
    m:'Göklerin ve yerin yaratılışında, gece ile gündüzün farklı oluşunda aklıselim sahipleri için elbette ibretler vardır.' },
  gasiye:      { kisa:'Gaşiye 17-20', kay:'Gaşiye suresi, 17-20. ayetler',
    m:'Peki onlar devenin nasıl yaratıldığına, göğün nasıl yükseltildiğine, dağların nasıl dikildiğine, yeryüzünün nasıl yayıldığına bakmazlar mı?' },
  cin26:       { kisa:'Cin 26-27', kay:'Cin suresi, 26-27. ayetler',
    m:'O, gaybı bilendir. Hiç kimseye gaybını bildirmez. Ancak seçtiği resuller başka (onlara bildirir)…' },
  bakara170:   { kisa:'Bakara 170', kay:'Bakara suresi, 170. ayet',
    m:'Onlara, “Allah’ın indirdiğine uyun.” denildiğinde, “Hayır, atalarımızdan gördüğümüze uyarız.” dediler. Ya atalarının aklı bir şeye ermemiş, doğru yolu bulamamışlarsa!' },
  yunus36:     { kisa:'Yunus 36', kay:'Yunus suresi, 36. ayet',
    m:'Onların çoğu ancak zannın ardından gider. Oysa zan, hak namına hiçbir şeyin yerini tutmaz…' }
};
var AYET_ESLE = [
  { id:'ayet-kavram-1', mod:'kavram', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1',
    secenekler:['vahiy','akil','duyu','oznel','zan'],
    satirlar:[
      { a:'aliimran190', ana:'akil', kabul:['duyu'], neden:'Evrendeki düzen üzerinde düşünüp ibret çıkarmak “aklıselim sahiplerine” bağlanmıştır.' },
      { a:'gasiye', ana:'duyu', kabul:['akil'], neden:'Ayet “bakmaya”, yani gözleme çağırır; bilgi görme duyusuyla başlar.' },
      { a:'bakara170', ana:'oznel', kabul:['zan'], neden:'Ataların geleneği öznel bir bilgi kaynağıdır; doğrulanmadan izlenmesi eleştirilir.' },
      { a:'cin26', ana:'vahiy', kabul:[], neden:'Gayb bilgisi yalnızca Allah’ın seçtiği elçilere, yani vahiyle açılır.' }
    ] },
  { id:'ayet-kavram-2', mod:'kavram', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.3',
    secenekler:['zan','dogrulama','tecessus','sukur','gayb'],
    satirlar:[
      { a:'yunus36', ana:'zan', kabul:[], neden:'Zan, hak namına hiçbir şeyin yerini tutmaz; ona uyulmaz.' },
      { a:'hucurat6', ana:'dogrulama', kabul:['zan'], neden:'Güvenilmez kişinin getirdiği haberin doğruluğunun araştırılması emredilir.' },
      { a:'hucurat12', ana:'tecessus', kabul:[], neden:'İnsanların gizli hâllerini araştırmak, yani tecessüs yasaklanır.' },
      { a:'mulk23', ana:'sukur', kabul:[], neden:'Kulak, göz ve kalbin verildiği hatırlatılır ve şükür istenir.' }
    ] },
  { id:'ayet-yanilgi', mod:'yanilgi', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.3',
    secenekler:['isra36','hucurat6','cin26','aliimran190','bakara170'],
    satirlar:[
      { cumle:'“Bir şeyi tam bilmesem de herkes söylüyorsa ben de söylerim.”', ana:'isra36', kavram:['zan'],
        neden:'Hakkında kesin bilgi sahibi olmadığın şeyin peşine düşme; kulak, göz ve kalp bundan sorumludur.' },
      { cumle:'“Görmediğim hiçbir şeyin var olduğuna inanmam.”', ana:'cin26', kavram:['gayb','duyu'],
        neden:'Gayb âlemi duyularla algılanamaz; Allah onu elçilerine vahiyle bildirmiştir.' },
      { cumle:'“Babamdan, dedemden böyle gördüm; sorgulamaya gerek yok.”', ana:'bakara170', kavram:['oznel'],
        neden:'Ataların geleneği doğrulanmadan izlenemez: “Ya atalarının aklı bir şeye ermemişse!”' },
      { cumle:'“Din düşünmeyi değil, yalnızca kabul etmeyi ister.”', ana:'aliimran190', kavram:['akil'],
        neden:'Kur’an evrendeki düzen üzerinde düşünmeyi aklıselim sahiplerinden ister.' },
      { cumle:'“Mesaj kimden gelirse gelsin, hemen paylaşırım.”', ana:'hucurat6', kavram:['dogrulama'],
        neden:'Haberin doğruluğu araştırılmalıdır; aksi hâlde bilmeden bir topluluğa zarar verilebilir.' }
    ] }
];

/* ---------- 5. KAVRAM YANILGISINI YAKALA ---------- */
var YANILGI = [
  { id:'yan-1', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['duyu','akil'], dogru:false,
    cumle:'“Gözümle gördüğüm her şey kesinlikle doğrudur.”',
    yanilgilar:['Duyuların sınırlı olduğu ve yanılabileceği göz ardı edilmiş.','Vahiy ile mütevatir haber karıştırılmış.','Gayb ile şehadet karıştırılmış.'], dogruYanilgi:0,
    aciklama:'Duyular nesnel bir kaynaktır ama sınırlıdır: Suya batırılan kalem kırık, uzaktaki yıldız küçük görünür. Duyunun verdiği bilgi akılla denetlenir.' },
  { id:'yan-2', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['mutevatir','zan'], dogru:false,
    cumle:'“Çok sayıda kişinin paylaştığı her haber mütevatir haberdir.”',
    yanilgilar:['Akıl ile duyu karıştırılmış.','Mütevatir haber, kalabalığın tekrar ettiği söylentiyle karıştırılmış.','Şükür ile tecessüs karıştırılmış.'], dogruYanilgi:1,
    aciklama:'Mütevatir haber, olayı bizzat görüp duyan ve birbirinden bağımsız kişilerin farklı zaman ve mekânlarda aynı şekilde aktardığı haberdir. Paylaşım sayısı tek başına tevatür sağlamaz.' },
  { id:'yan-3', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['mutevatir','vahiy'], dogru:true,
    cumle:'“Kur’an-ı Kerim bize tevatür yoluyla, değişmeden ulaşmıştır.”',
    aciklama:'Kur’an vahiydir; her nesilde binlerce hafız ve yazılı nüshayla kesintisiz aktarılarak, yani tevatürle bize ulaşmıştır.' },
  { id:'yan-4', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['oznel'], dogru:false,
    cumle:'“Rüyada görülen şey herkes için bağlayıcı bir bilgidir.”',
    yanilgilar:['Rüyanın öznel ve kesin olmayan bir bilgi olduğu göz ardı edilmiş.','Mütevatir haber ile vahiy karıştırılmış.','Âlem ile şehadet âlemi karıştırılmış.'], dogruYanilgi:0,
    aciklama:'Peygamber dışındaki insanların rüyası öznel bir bilgidir: Yalnızca kişiye aittir, kesin değildir, başkasını bağlamaz ve dinî hüküm rüyaya dayandırılmaz.' },
  { id:'yan-5', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.2', kavram:['gayb','vahiy'], dogru:false,
    cumle:'“Melekleri göremiyorsak onlar hakkında hiçbir şey bilemeyiz.”',
    yanilgilar:['Tecessüs ile doğrulama karıştırılmış.','Gayb âlemine ait bilginin vahiyle geldiği unutulmuş.','Şükür yalnızca sözle yapılır sanılmış.'], dogruYanilgi:1,
    aciklama:'Gayb âlemi duyularla algılanamaz ama bilinemez değildir: Allah onu elçilerine vahiyle bildirmiştir (Cin 26-27).' },
  { id:'yan-6', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['akil'], dogru:true,
    cumle:'“Akıl sahibi olmak, dinî sorumluluğun şartlarındandır.”',
    aciklama:'Hz. Peygamber, aklı başına gelinceye kadar akıl hastasından sorumluluğun kaldırıldığını bildirmiştir (Ebu Davud, Hudud, 17).' },
  { id:'yan-7', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.3', kavram:['tecessus','dogrulama'], dogru:false,
    cumle:'“Başkalarının gizli hâllerini araştırmak da bir tür bilgi edinmedir; bunda sakınca yoktur.”',
    yanilgilar:['Zan ile şehadet karıştırılmış.','Mütevatir ile sadık haber karıştırılmış.','Tecessüs, meşru araştırma (doğrulama) ile karıştırılmış.'], dogruYanilgi:2,
    aciklama:'Haberin doğruluğunu araştırmak emredilmiştir (Hucurat 6); insanların gizli hâllerini araştırmak ise yasaktır (Hucurat 12). Her araştırma meşru değildir.' },
  { id:'yan-8', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.3', kavram:['sukur'], dogru:false,
    cumle:'“Şükür, yalnızca dille ‘Elhamdülillah’ demektir.”',
    yanilgilar:['Şükrün nimeti amacına uygun kullanmayı da kapsadığı unutulmuş.','Şükür ile tecessüs karıştırılmış.','Gayb ile âlem karıştırılmış.'], dogruYanilgi:0,
    aciklama:'Şükür yalnızca dille olmaz; her nimetin şükrü kendi cinsiyledir. Gözün şükrü haramdan sakınıp helale bakmak, dilin şükrü doğruyu konuşmaktır.' },
  { id:'yan-9', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.2', kavram:['gayb','vahiy'], dogru:true,
    cumle:'“Gayb âlemi hakkındaki bilgiye vahiy yoluyla ulaşılır.”',
    aciklama:'Akıl ve duyuların ulaşamadığı gayb âlemi hakkında bilgi, Allah’ın elçilerine bildirdiği vahiyle gelir.' },
  { id:'yan-10', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.3', kavram:['dogrulama','zan'], dogru:false,
    cumle:'“Doğrulamadan yaydığım bir haber yanlış çıkarsa sorumlu değilim; çünkü onu ben uydurmadım.”',
    yanilgilar:['Akıl ile duyu karıştırılmış.','Doğrulanmamış haberi yaymanın da sorumluluk doğurduğu göz ardı edilmiş.','Vahiy ile öznel bilgi karıştırılmış.'], dogruYanilgi:1,
    aciklama:'Kulak, göz ve kalp sorumludur (İsra 36). Kişiye duyduğu her şeyi araştırmadan anlatması yalan olarak yeter (Müslim, Mukaddime, 5).' },
  { id:'yan-11', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.2', kavram:['alem','gayb'], dogru:false,
    cumle:'“Âlem, yalnızca gözle görülebilen varlıklardan ibarettir.”',
    yanilgilar:['Âlemin görülemeyen (gayb) varlıkları da kapsadığı unutulmuş.','Zan ile doğrulama karıştırılmış.','Şükür ile kulluk karıştırılmış.'], dogruYanilgi:0,
    aciklama:'Âlem, Allah’ın dışındaki bütün varlıklardır: Duyularla algılanan şehadet âlemi ile algılanamayan gayb âlemini birlikte kapsar.' },
  { id:'yan-12', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.1', kavram:['vahiy','akil'], dogru:false,
    cumle:'“Vahiy ile akıl birbirine zıttır; biri varsa diğerine gerek yoktur.”',
    yanilgilar:['Duyu ile şehadet âlemi karıştırılmış.','Bilgi kaynaklarının birbirini tamamladığı göz ardı edilmiş.','Tecessüs ile zan karıştırılmış.'], dogruYanilgi:1,
    aciklama:'Kur’an aklı kullanmayı ister (Al-i İmran 190); Muaz hadisinde akıl, vahyin ışığında içtihat eder. Kaynaklar sıralı ve tamamlayıcıdır.' }
];

/* ---------- 6. HAYATTAN KAVRAMA ---------- */
var HAYAT = [
  { id:'hay-odev', baslik:'Ödev araştırması', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1',
    metin:'Elif bir ödev için internetten bilgi topladı. Bir sitede yazanı iki güvenilir kaynakla karşılaştırdı ve çelişen kısmı ödevine almadı.',
    secenekler:['dogrulama','akil','zan','duyu','gayb','sukur'], gerekli:['dogrulama','akil'], kabul:['zan'],
    neden:'Bilgiyi başka kaynaklarla karşılaştırmak doğrulamadır; çelişkiyi fark edip ayıklamak aklın işidir. Ödevden çıkarılan kısım doğrulanamadığı için zan düzeyinde kalmıştır.' },
  { id:'hay-dedikodu', baslik:'Sınıfta söylenti', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.3',
    metin:'Sınıfta bir arkadaş hakkında “Kopya çekmiş.” söylentisi yayıldı. Kimse olayı görmemişti ama herkes konuşuyordu.',
    secenekler:['zan','dogrulama','tecessus','duyu','vahiy','sukur'], gerekli:['zan'], kabul:['dogrulama','duyu'],
    neden:'Kimsenin görmediği, kaynağı belirsiz söz zandır. İsra 36 kesin bilgi olmadan hüküm vermeyi yasaklar. Olayı gören olmadığı için duyuya dayanan bir bilgi de yoktur; yapılması gereken doğrulamadan konuşmamaktır.' },
  { id:'hay-fen', baslik:'Fen laboratuvarı', zorluk:'temel', ogrenmeCiktisi:'DKAB.10.1.1',
    metin:'Fen laboratuvarında öğrenciler suyun kaynama sıcaklığını termometreyle ölçüp sonuçlarını defterlerine yazdı.',
    secenekler:['duyu','akil','oznel','zan','vahiy','gayb'], gerekli:['duyu'], kabul:['akil'],
    neden:'Ölçmek ve gözlemlemek salim duyulara dayanır; sonuçları kaydedip yorumlamak aklın işidir. Bilimsel bilgi deney ve gözlemle elde edilir.' },
  { id:'hay-tarih', baslik:'Tarih dersi', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.1',
    metin:'Tarih öğretmeni, Malazgirt Savaşı’nın 1071’de yapıldığını hem Müslüman hem Bizans kaynaklarının birbirinden bağımsız olarak aynı şekilde aktardığını anlattı.',
    secenekler:['mutevatir','sadik','zan','oznel','duyu','vahiy'], gerekli:['mutevatir'], kabul:['sadik'],
    neden:'Karşı tarafların bile bağımsız olarak aynı olayı aktarması tevatürdür; mütevatir haber de sadık haberin bir kısmıdır.' },
  { id:'hay-telefon', baslik:'Masada açık telefon', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.3',
    metin:'Burak, kardeşinin telefonu masada açık kalınca mesajlarını okumak istedi ama “Bu onun özel alanı.” diyerek vazgeçti.',
    secenekler:['tecessus','akil','sukur','dogrulama','zan','gayb'], gerekli:['tecessus'], kabul:['akil','sukur'],
    neden:'Mesajları okumak tecessüs olurdu (Hucurat 12). Burak aklıyla bunun yanlış olduğunu fark etti; göz nimetini kötüye kullanmamak da şükrün bir yönüdür.' },
  { id:'hay-gozluk', baslik:'Yeniden görmek', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.3',
    metin:'Göz ameliyatından sonra yeniden net görebilen dede, ilk iş olarak torunlarına kitap okudu ve “Gözlerimin hakkını hayırla vermek istiyorum.” dedi.',
    secenekler:['sukur','duyu','tecessus','zan','gayb','mutevatir'], gerekli:['sukur'], kabul:['duyu'],
    neden:'Göz bir duyu ve nimettir; onu faydalı bir iş için kullanmak, nimetin kendi cinsiyle şükrüdür (Mülk 23).' },
  { id:'hay-uzay', baslik:'Uzaydan bakış', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.2',
    metin:'Bir astronot uzaydan Dünya’ya bakarken “Bu kadar düzenli işleyen bir sistemin bir yaratıcısı olmalı.” dedi.',
    secenekler:['sehadet','akil','alem','gayb','duyu','oznel'], gerekli:['sehadet','akil'], kabul:['alem','duyu'],
    neden:'Dünya ve uzay şehadet âlemindendir ve gözlemle (duyu) incelenir. Gözlemlenen düzenden yaratıcıya ulaşmak ise aklın çıkarımıdır (Al-i İmran 190).' },
  { id:'hay-gelenek', baslik:'“Atalarımızdan böyle gördük”', zorluk:'derin', ogrenmeCiktisi:'DKAB.10.1.1',
    metin:'Bir köyde “Atalarımızdan böyle gördük.” denilerek hastalara doktora gitmek yerine yalnızca bir ağaca bez bağlamaları söyleniyor.',
    secenekler:['oznel','akil','vahiy','dogrulama','mutevatir','sukur'], gerekli:['oznel','akil'], kabul:['vahiy','dogrulama'],
    neden:'Ataların geleneği öznel bir bilgi kaynağıdır ve doğrulanmaya muhtaçtır (Bakara 170). Akıl, bu uygulamanın sağlığa bir katkısı olmadığını görür; vahiy de tedavi olmayı ve hurafeden uzak durmayı öğütler.' }
];

/* ---------- 6. AYNI OLAY – FARKLI KAVRAM ---------- */
var AYNI_OLAY = { id:'ayni-bitki', zorluk:'gelistir', ogrenmeCiktisi:'DKAB.10.1.3',
  olay:'Bir öğrenci sosyal medyada “Bilim insanları açıkladı: Bu bitki her hastalığı iyileştiriyor!” başlıklı bir paylaşım gördü.',
  ozet:'Aynı olay; akılla tutarlılığına, duyularla kanıtına, doğrulamayla kaynağına, zan kavramıyla kesinliğine, şükürle bilgi araçlarının doğru kullanımına bakılarak farklı yönlerden açıklanabilir.',
  kavramlar:{
    akil:{ gorev:'Selim akıl açısından: Bu iddiada aklı uyaran ne var?', model:'“Her hastalığı” iyileştiren tek bir bitki iddiası abartılıdır; hastalıkların sebepleri birbirinden çok farklıdır. Akıl, “Hangi bilim insanları? Hangi araştırma?” diye sorar.' },
    duyu:{ gorev:'Salim duyular açısından: Bu iddia hangi gözlem ve deneylerle desteklenmeliydi?', model:'Bilimsel bilgi deney ve gözleme dayanır. Kontrollü deneyler, ölçülebilir sonuçlar ve tekrar edilebilir araştırmalar gösterilmedikçe iddia kanıtlanmış sayılmaz.' },
    dogrulama:{ gorev:'Doğrulama açısından: Öğrenci paylaşmadan önce hangi adımları atmalı?', model:'Kaynağı ve yazarı kontrol eder, Sağlık Bakanlığı gibi resmî kurumların ve güvenilir bilimsel kaynakların ne dediğine bakar, doğrulanamıyorsa paylaşmaz (Hucurat 6).' },
    zan:{ gorev:'Zan açısından: Bu paylaşım neden kesin bilgi sayılamaz?', model:'Kaynağı belirsizdir ve kanıt sunmaz; “Bilim insanları açıkladı” ifadesi tek başına kanıt değildir. Bu yüzden zan düzeyindedir ve ona göre hüküm verilemez (İsra 36, Yunus 36).' },
    sukur:{ gorev:'Şükür açısından: Göz, kulak ve akıl nimetini bu durumda nasıl kullanmak şükrün gereğidir?', model:'Bu nimetleri, yanlış bilgiyi yaymak için değil, doğruyu ayırt etmek için kullanmak; sağlığı korumak için de doktora ve güvenilir bilgiye başvurmak şükrün gereğidir (Mülk 23).' }
  } };

/* ---------- 7. KAVRAM TABU ---------- */
/* y: [gösterilen, kökler] — küçük harf, şapkasız; "|" ile alternatif kök.
   Kök önek olarak aranır; "=" ile başlayan kök yalnızca tam kelime olarak aranır. */
var TABU = [
  { k:'vahiy', y:[['Allah','allah'],['Peygamber','peygamber'],['Kur’an','kuran|=kur'],['Melek','melek'],['İlahi','ilahi']],
    model:'Yaratıcının, seçtiği elçilere bildirdiği ve insanlara iletilmesini istediği mesaj; inananlar için kesin ve bağlayıcıdır.' },
  { k:'mutevatir', y:[['Kalabalık','kalabal'],['Yalan','yalan'],['Nesil','nesil|nesl'],['Topluluk','toplul'],['Haber','haber']],
    model:'Birbirinden habersiz çok sayıda kişinin, farklı yer ve zamanlarda aynı olayı aynı şekilde aktarması; uydurulması imkânsız olduğu için kesin kabul edilir.' },
  { k:'sadik', y:[['Doğru','dogru'],['Haber','haber'],['Gerçek','gercek'],['Olay','olay'],['Yalan','yalan']],
    model:'Yaşanmış bir şeyin aktarılması; ister Yaratıcıdan elçiyle, ister çok sayıda güvenilir insan aracılığıyla bize ulaşsın.' },
  { k:'akil', y:[['Düşünmek','dusun'],['Beyin','beyin'],['Mantık','mantik'],['Doğru','dogru'],['Zekâ','zeka']],
    model:'İnsanın iyiyi kötüden ayırmasını, sebepten sonuca ulaşmasını sağlayan yeti; dinen yükümlü olmanın ilk şartı.' },
  { k:'duyu', y:[['Göz','goz'],['Kulak','kulak'],['Görmek','gor'],['Duymak','duy'],['Dokunmak','dokun']],
    model:'Dış dünyayı algılamamızı sağlayan, işlevini yitirmemiş beş pencere; tat, koku, ses, ışık ve temasla bilgi getirir.' },
  { k:'oznel', y:[['Rüya','ruya'],['Sezgi','sezgi'],['Kişisel','kisisel'],['Kesin','kesin'],['His','=his|hiss']],
    model:'Yalnızca yaşayanın iç dünyasına ait olan, başkası için kanıt sayılmayan ve teyit edilmesi gereken bilgi; içe doğan bir duygu ya da uykuda görülen bir sahne gibi.' },
  { k:'zan', y:[['Tahmin','tahmin'],['Şüphe','suphe'],['Sanmak','=san|sanm|sandi|saniyor'],['Kesin','kesin'],['Söylenti','soylent']],
    model:'Kanıta dayanmayan, “Galiba öyledir.” türünden bir kanaat; hakikat adına bir şey ifade etmez.' },
  { k:'dogrulama', y:[['Araştırmak','arast'],['Kontrol','kontrol'],['Kaynak','kaynak'],['Haber','haber'],['Doğru','dogru']],
    model:'Bir bilgiyi yaymadan ya da ona göre davranmadan önce nereden geldiğini, kimin söylediğini ve başka güvenilir yerlerin ne dediğini sorgulamak.' },
  { k:'gayb', y:[['Görünmez','gorunm'],['Melek','melek'],['Ahiret','ahiret'],['Vahiy','vahiy|vahy'],['Gizli','gizli']],
    model:'Göz, kulak ya da deneyle ulaşılamayan; ancak Yaratıcının elçilerine bildirdiğiyle öğrenebildiğimiz varlıklar alanı.' },
  { k:'sehadet', y:[['Görmek','gor'],['Duyu','duyu'],['Gözlem','gozlem'],['Madde','madde'],['Dünya','dunya']],
    model:'Beş his ve araçlar yardımıyla algılayabildiğimiz varlıkların alanı: dağlar, denizler, canlılar, yıldızlar.' },
  { k:'tecessus', y:[['Gizli','gizli'],['Araştırmak','arast'],['Kusur','kusur'],['Özel','ozel'],['Merak','merak']],
    model:'Başkalarının saklamak istediği hâllerini, ayıplarını kurcalayıp ortaya çıkarmaya çalışmak; Hucurat 12’de yasaklanmıştır.' },
  { k:'sukur', y:[['Teşekkür','tesekk'],['Nimet','nimet'],['Allah','allah'],['Hamd','hamd'],['Minnet','minnet']],
    model:'Verilen her iyiliği tanıyıp Verene karşı gönülden borçluluk duymak ve o iyiliği amacına uygun kullanmak.' },
  { k:'alem', y:[['Evren','evren'],['Varlık','varlik'],['Dünya','dunya'],['Kâinat','kainat'],['Yaratılmış','yarat']],
    model:'Allah’ın dışında kalan, görülen ve görülemeyen her şeyin toplamı.' }
];

/* ================= ETKİNLİK LİSTESİ (normalize) ================= */
function meta(tur, o, kavram, gb){
  var t = TUR[tur];
  return { id:o.id, tur:tur, kavram:kavram, amac:o.amac||t.amac||AMAC[tur], beceri:o.beceri||t.beceri, deger:o.deger||t.deger,
    ogrenmeCiktisi:o.ogrenmeCiktisi||VARSAYILAN_CIKTI, etkinlikTuru:t.etkinlikTuru, zorluk:o.zorluk||'temel',
    olcmeTuru:t.olcmeTuru, geriBildirim:gb||'', boyut:o.boyut||t.boyut, adim:t.adim, veri:o };
}
var AMAC = {
  tani:'Kavramı açıklamasından tanıyabilme.',
  fark:'Birbirine karıştırılan iki kavramın benzer ve farklı yönlerini ayırt edebilme.',
  bul:'Bir olayda hangi kavramların devreye girdiğini bulup yanlış anlaşılan kavramı teşhis edebilme.',
  dedektif:'Metindeki kavramları bulup her birini metinden bir kanıtla destekleyebilme.',
  zincir:'Kavramlar arasındaki sebep–sonuç ve süreç ilişkisini kurabilme.',
  coklu:'Birden fazla kavramı birlikte kullanarak bir ilişkiyi açıklayabilme.',
  ayet:'Ayetlerin öne çıkardığı kavramları belirleyip yanlış bilgi anlayışlarını bu metinlere dayanarak düzeltebilme.',
  yanilgi:'Günlük hayattaki cümlelerde bilgi ve varlıkla ilgili kavram yanılgılarını fark edip adlandırabilme.',
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
var ANAHTAR = ANAHTAR_ONEKI+'-v1';
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
  '<p class="kl-iz">Meal metinleri ünite sayfasındaki ve <a href="'+ETKINLIK_SAYFASI+'#ayet">'+ETKINLIK_SAYFASI_AD+'</a> sayfasındaki metinlerle aynıdır.</p>'+
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
      kavramMod ? 'Bir metin birden fazla kavramla ilgili olabilir; burada metnin en çok öne çıkardığı kavram aranır.' : 'Bir yanılgıyı düzeltmenin en sağlam yolu, ayetlerin ne söylediğine bakmaktır.')+
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
      '</ul><p style="margin:6px 0 0">'+e(o.ozet||'')+'</p></div>';
  }
  ciz();
};

/* --- cumle: benim cümlem --- */
R.cumle = function(kap){
  var aktif = K_SIRA[0];
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
      '<p class="ornek" style="margin:0 0 10px">'+K_SIRA.length+' kavramın her biri için bir soru. Yanlış yaptığın kavram tekrar sırasına eklenir.</p><div data-tur></div></div>';
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
  { no:1, ad:'Kavramı Tanı', aciklama:K_SIRA.length+' kavramı ilişkileriyle birlikte tanı; sonra tanıma turunda kendini yokla.' },
  { no:2, ad:'Ayırt Et', aciklama:'Birbirine karıştırılan kavramları karşılaştır. Önce kendin yaz, sonra açıklamayı aç.' },
  { no:3, ad:'Olayda Bul', aciklama:'Kısa olaylarda devreye giren kavramları bul; metinden kanıt göster.' },
  { no:4, ad:'İlişki Kur', aciklama:'Kavram zincirlerini kur, kavramlar arasındaki bağı kendi cümlenle açıkla; ayet ve hadisleri kavramlarla eşleştir.' },
  { no:5, ad:'Yanlışı Yakala', aciklama:'Günlük hayatta duyduğun cümlelerdeki kavram yanılgılarını yakala.' },
  { no:6, ad:'Hayatla İlişkilendir', aciklama:'Gerçek hayat senaryolarında hangi kavramların işlediğini gerekçelendir.' },
  { no:7, ad:'Kendi Örneğini Üret', aciklama:'Kavramı kendi cümlenle anlat; Tabu oyununda ezber kelimeler olmadan açıkla.' }
];
var seviye = (function(){ try{ return localStorage.getItem(ANAHTAR_ONEKI+'-seviye')||'tumu'; }catch(x){ return 'tumu'; } })();
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
    alan.insertAdjacentHTML('beforeend','<div class="kart kl-harita-git"><span class="gd-etiket">Kavram Haritası</span><p style="margin:4px 0 10px">Bütün kavramları tek bir haritada, aralarındaki bağlarla görmek için ünite sonu kavram haritasını aç. Bir kavrama dokunduğunda tanımı, örneği ve bağlantıları açılır.</p><a class="btn kucuk" href="'+ETKINLIK_SAYFASI+'#son">Kavram haritasını aç →</a></div>'); }
  if(aktifAdim===5) listeCiz(alan, karistir(turdeki('yanilgi')));
  if(aktifAdim===6){ listeCiz(alan, turdeki('hayat'), 'Hayattan Kavrama');
    var ao=ETK_ID[AYNI_OLAY.id]; alan.insertAdjacentHTML('beforeend','<h3 class="kl-grup-bas">Aynı Olay – Farklı Kavram</h3>');
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
    seviye=b.getAttribute('data-seviye'); try{ localStorage.setItem(ANAHTAR_ONEKI+'-seviye',seviye); }catch(x){}
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
