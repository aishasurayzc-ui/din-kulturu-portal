/* =====================================================================
   ARA KENDİNİ DENE — Ayet/Hadis ↔ Kavram eşleştirme (9. sınıf 1. ünite)
   index.html içindeki <div class="akd" data-akd="12|13"> kutularına yerleşir.
   Her bölümde 50 madde, 5 tur × 10 kart. Her kartta bir ayet ya da hadis
   okunur, bölümün kavramlarından biriyle eşleştirilir; cevaptan sonra
   anahtar ifade işaretlenir ve gerekçe gösterilir.
   KAYNAK: Ayet mealleri Diyanet İşleri Başkanlığı mealinden birebir
   alınmıştır (uzun ayetlerde yalnızca ilgili bölüm, “…” ile). Hadisler,
   portalda künyesiyle yer alan metinlerdir. Kavram tanımları bu sayfadaki
   konu anlatımından alınmıştır.
   Madde alanları: [tür, metin, kaynak, doğru kavram, anahtar ifade, gerekçe, kabul edilen diğer kavramlar]
   Sıra sabittir: art arda gelen iki maddenin doğru kavramı aynı değildir.
   ===================================================================== */
(function(){
'use strict';
var VERI = {"12":{"baslik":"Ara Kendini Dene — 1.2 Doğruyu Arayan Bir Varlık Olarak İnsan","alt":"Marifet, tefekkür ve İslam’da bilginin kaynakları","kavram":{"İlim":"Bilgi; öğrenme ve öğretme. İslam okumayı, öğrenmeyi ve bilgide derinleşmeyi teşvik eder.","Salim duyular":"Sağlıklı çalışan duyu organları (görme, işitme, dokunma, koklama, tatma). Bilgi edinmenin ilk imkânıdır; aklın üzerinde çalışacağı ham veriyi sağlar.","Selim akıl":"Ön yargıdan arınmış, doğru işleyen akıl. Duyularla gelen bilgiyi sorgular, karşılaştırır, değerlendirir ve anlamlandırır.","Tefekkür":"Varlık ve olaylar üzerinde derin düşünmek, onlardan anlam çıkarmak; eşyanın bilgisini kavramak için aklın hareket hâlinde olması.","Marifet":"Derin düşünme yoluyla bir şeyin hakikatinin anlaşılması; irfan. Allah’ı tanımanın adıdır.","Vahiy":"Peygamberler aracılığıyla insanlara, hayatın hangi ilkelere göre yönlendirilmesi ve nelerden sakınılması gerektiğini bildiren ilahi bilgi.","Sadık haber":"Doğruluğu kesinleşmiş haber: yalan üzerinde birleşmeleri mümkün olmayan bir topluluğun aktardığı (mütevatir) ya da doğruluğu araştırılıp güvenilir kaynaktan alınmış haber.","Fıtrat":"İnsanın yaratılışında bulunan, hayatı anlamlandırma çabalarına yön veren, inanmayı da içeren doğuştan gelen yetenek.","Mükellefiyet":"Dinin emir ve yasakları karşısında sorumlu olmak. Şartları: akıl sağlığı, buluğ ve tebliğin ulaşması."},"maddeler":[["Ayet","Bil ki Allah'tan başka hiçbir ilah yoktur.…","Muhammed suresi, 19. ayet","Marifet","Bil ki Allah'tan başka hiçbir ilah yoktur","“Bil ki” emri, Allah’ın birliğini bilip tanımayı, yani marifeti ister.",["İlim"]],
  ["Ayet","…Allah'a karşı ancak; kulları içinden alim olanlar derin saygı duyarlar.","Fâtır suresi, 28. ayet","İlim","kulları içinden alim olanlar","Allah’a derin saygıyı “âlim olanlara” bağlar: bilgi, insanı Allah’a daha bilinçli yöneltir.",[]],
  ["Ayet","Allah, sizi analarınızın karnından, siz hiçbir şey bilmez durumda iken çıkardı. Şükredesiniz diye size kulaklar, gözler ve kalpler verdi.","Nahl suresi, 78. ayet","Salim duyular","size kulaklar, gözler ve kalpler verdi","İnsan hiçbir şey bilmez doğar; bilgi edinmesi için ona kulaklar ve gözler, yani duyular verilmiştir.",[]],
  ["Ayet","Hakkında kesin bilgi sahibi olmadığın şeyin peşine düşme. Çünkü kulak, göz ve kalp, bunların hepsi ondan sorumludur.","İsrâ suresi, 36. ayet","Sadık haber","kesin bilgi sahibi olmadığın şeyin peşine düşme","Doğruluğundan emin olunmayan bilginin peşinden gitmek yasaklanır; ancak sağlam, doğrulanmış bilgiye uyulur.",["Mükellefiyet"]],
  ["Ayet","Deveye bakmıyorlar mı, nasıl yaratılmıştır! Göğe bakmıyorlar mı, nasıl yükseltilmiştir! Dağlara bakmıyorlar mı, nasıl dikilmişlerdir! Yeryüzüne bakmıyorlar mı, nasıl yayılmıştır!","Gāşiye suresi, 17-20. ayetler","Salim duyular","Deveye bakmıyorlar mı","“Bakmıyorlar mı?” çağrısı gözlemi, yani duyularla bilgi edinmeyi öne çıkarır.",["Tefekkür"]],
  ["Ayet","O, nefis arzusu ile konuşmaz. (Size okuduğu) Kur'an ancak kendisine bildirilen bir vahiydir.","Necm suresi, 3-4. ayetler","Vahiy","kendisine bildirilen bir vahiydir","Hz. Peygamber’in okuduğu Kur’an kendi arzusu değil, Allah’ın bildirdiği vahiydir.",[]],
  ["Ayet","Şüphesiz, göklerin ve yerin yaratılışında, gece ile gündüzün birbiri ardınca gelişinde, insanlara yarar sağlayacak şeylerle denizde seyreden gemilerde, Allah'ın gökyüzünden indirip kendisiyle ölmüş toprağı dirilttiği yağmurda, yeryüzünde her çeşit canlıyı yaymasında, rüzgarları ve gökle yer arasındaki emre amade bulutları evirip çevirmesinde elbette düşünen bir topluluk için deliller vardır.","Bakara suresi, 164. ayet","Tefekkür","düşünen bir topluluk için deliller vardır","Gök, yer, yağmur, rüzgâr… Hepsi “düşünen bir topluluk için” delildir; varlık üzerinde derin düşünmeye çağırır.",["Selim akıl"]],
  ["Ayet","Allah, bir insanla ancak vahiy yoluyla, yahut perde arkasından konuşur. Yahut bir elçi gönderip, izniyle ona dilediğini vahyeder. Şüphesiz O yücedir, hüküm ve hikmet sahibidir.","Şûrâ suresi, 51. ayet","Vahiy","ancak vahiy yoluyla","Ayet, Allah’ın insana bilgi ulaştırma yollarını, yani vahyin geliş biçimlerini anlatır.",[]],
  ["Ayet","Onlar, kendi nefisleri(nin yaratılış incelikleri) hakkında hiç düşünmediler mi?…","Rûm suresi, 8. ayet","Tefekkür","hakkında hiç düşünmediler mi","İnsanın kendi yaratılışı üzerinde derin düşünmesi istenir; bu tefekkürdür.",[]],
  ["Ayet","Yine şöyle derler: \"Eğer kulak vermiş veya aklımızı kullanmış olsaydık, şu alevli ateştekilerden olmazdık.\"","Mülk suresi, 10. ayet","Selim akıl","aklımızı kullanmış olsaydık","Aklını kullanmayanların pişmanlığı, doğruyu bulmada aklın ne kadar önemli olduğunu gösterir.",[]],
  ["Ayet","Allah, bir kimseyi ancak gücünün yettiği şeyle yükümlü kılar. Onun kazandığı iyilik kendi yararına, kötülük de kendi zararınadır.…","Bakara suresi, 286. ayet","Mükellefiyet","ancak gücünün yettiği şeyle yükümlü kılar","İnsan dinin emir ve yasaklarından gücü ölçüsünde sorumludur (mükelleftir).",[]],
  ["Hadis","“Duyduğu her şeyi (araştırmadan) anlatması, kişiye yalan olarak yeter.”","Hz. Muhammed (sav) — Müslim, Mukaddime, 5","Sadık haber","Duyduğu her şeyi (araştırmadan) anlatması","Duyulan her haber doğru değildir; araştırmadan aktarmak yalana ortak olmaktır. Doğru bilgi, doğrulanmış haberdir.",[]],
  ["Ayet","Biz, Nuh'a ve ondan sonra gelen peygamberlere vahyettiğimiz gibi, sana da vahyettik.…","Nisâ suresi, 163. ayet","Vahiy","sana da vahyettik","Vahiy, Hz. Nuh’tan Hz. Muhammed’e kadar bütün peygamberlere gelen ilahi bilgidir.",[]],
  ["Ayet","Yaratan Rabbinin adıyla oku! O, insanı \"alak\"dan yarattı. Oku! Senin Rabbin en cömert olandır. O, kalemle yazmayı öğretendir, insana bilmediğini öğretendir.","Alak suresi, 1-5. ayetler","İlim","insana bilmediğini öğretendir","İlk inen ayetler “oku” emriyle başlar; kalemle yazmayı ve bilmediğini öğreten Allah, insanı bilgi edinmeye çağırır.",[]],
  ["Ayet","…Biz, bir peygamber göndermedikçe azap edici değiliz.","İsrâ suresi, 15. ayet","Mükellefiyet","bir peygamber göndermedikçe","Tebliğ ulaşmadan sorumluluk yoktur: tebliğin ulaşması mükellefiyetin şartlarındandır.",[]],
  ["Ayet","Üstlerindeki göğe bakmazlar mı? Onu nasıl bina ettik, nasıl donattık! Onda hiçbir düzensizlik ve eksiklik yoktur.","Kāf suresi, 6. ayet","Salim duyular","Üstlerindeki göğe bakmazlar mı?","Göğe bakıp düzeni görmeye çağırır: bilginin ilk adımı gözlemdir.",[]],
  ["Hadis","“Üç kişiden sorumluluk kaldırılmıştır: Uyanıncaya kadar uyuyandan, büluğ çağına gelinceye kadar çocuktan, aklı başına gelinceye kadar akıl hastasından.”","Hz. Muhammed (sav) — Ebû Dâvûd, Hudûd, 17","Mükellefiyet","Üç kişiden sorumluluk kaldırılmıştır","Akıl ve buluğ, dinî sorumluluğun (mükellefiyetin) şartlarıdır; bunlar yoksa sorumluluk kalkar.",[]],
  ["Hadis","“Her çocuk fıtrat üzere doğar…”","Hz. Muhammed (sav) — Buhârî, Cenâiz, 92","Fıtrat","fıtrat üzere doğar","Her insan, hakkı kabule yatkın, temiz bir yaratılışla doğar.",[]],
  ["Ayet","Varlığımızın delillerini, (kainattaki uçsuz bucaksız) ufuklarda ve kendi nefislerinde onlara göstereceğiz ki, o Kur'an'ın gerçek olduğu onlara iyice belli olsun. Rabbinin, her şeye şahit olması yetmez mi?","Fussılet suresi, 53. ayet","Marifet","ufuklarda ve kendi nefislerinde onlara göstereceğiz","Hem evrendeki hem insanın kendi içindeki deliller, hakikatin (Allah’ın) tanınması içindir; bu marifettir.",["Tefekkür"]],
  ["Ayet","Rahman, Kur'an'ı öğretti. İnsanı yarattı. Ona beyanı (düşünüp ifade etmeyi) öğretti.","Rahmân suresi, 1-4. ayetler","İlim","Ona beyanı (düşünüp ifade etmeyi) öğretti","Allah’ın insana Kur’an’ı ve beyanı (düşünüp ifade etmeyi) öğretmesi, insanın bilgi edinip aktarabilen bir varlık olduğunu gösterir.",[]],
  ["Ayet","Onlar Kur'an'ı düşünmüyorlar mı? Yoksa kalplerin üzerinde kilitleri mi var?","Muhammed suresi, 24. ayet","Tefekkür","Kur'an'ı düşünmüyorlar mı?","Kur’an üzerinde derin düşünmeyenler eleştirilir; okunan üzerinde düşünmek tefekkürdür.",[]],
  ["Ayet","Göklerin ve yerin yaratılışında, gece ile gündüzün birbiri ardınca gelip gidişinde selim akıl sahipleri için elbette ibretler vardır.","Âl-i İmrân suresi, 190. ayet","Selim akıl","selim akıl sahipleri için elbette ibretler vardır","Evrendeki düzenden ibret çıkaranlar “selim akıl sahipleri” olarak anılır.",["Tefekkür"]],
  ["Ayet","Kesin olarak inananlar için yeryüzünde ve kendi nefislerinizde birçok alametler vardır. Hala görmüyor musunuz?","Zâriyât suresi, 20-21. ayetler","Marifet","kendi nefislerinizde birçok alametler vardır","Yeryüzündeki ve insanın kendisindeki alametler, kesin bir inançla Allah’ı tanımaya götürür.",["Tefekkür"]],
  ["Ayet","Onlar ayaktayken, otururken ve yanları üzerine yatarken Allah'ı anarlar. Göklerin ve yerin yaratılışı üzerinde düşünürler. \"Rabbimiz! Bunu boş yere yaratmadın, seni eksikliklerden uzak tutarız. Bizi ateş azabından koru\" derler.","Âl-i İmrân suresi, 191. ayet","Tefekkür","Göklerin ve yerin yaratılışı üzerinde düşünürler","Göklerin ve yerin yaratılışı üzerinde düşünüp “Bunu boş yere yaratmadın” sonucuna varmak tefekkürün kendisidir.",[]],
  ["Ayet","Şüphesiz bu Kur'an, alemlerin Rabbi'nin indirmesidir. Uyarıcılardan olasın diye onu güvenilir Ruh (Cebrail) senin kalbine apaçık Arapça bir dil ile indirmiştir.","Şuarâ suresi, 192-194. ayetler","Vahiy","güvenilir Ruh (Cebrail) senin kalbine","Kur’an’ın Alemlerin Rabbi’nden Cebrail aracılığıyla peygambere indirilmesi vahyin ta kendisidir.",[]],
  ["Ayet","İnsan, kendisinin başıboş bırakılacağını mı zanneder.","Kıyâme suresi, 36. ayet","Mükellefiyet","başıboş bırakılacağını mı zanneder","İnsan başıboş değildir; yaptıklarından sorumlu tutulacaktır.",[]],
  ["Ayet","Hakka yönelen bir kimse olarak yüzünü dine çevir. Allah'ın insanları üzerinde yarattığı fıtrata sımsıkı tutun. Allah'ın yaratmasında hiçbir değiştirme yoktur. İşte bu dosdoğru dindir. Fakat insanların çoğu bilmezler.","Rûm suresi, 30. ayet","Fıtrat","insanları üzerinde yarattığı fıtrata sımsıkı tutun","Allah insanı hakka yönelmeye yatkın bir yaratılışla (fıtratla) var etmiştir.",[]],
  ["Ayet","Şüphesiz, yeryüzünde yürüyen canlıların Allah katında en kötüsü, akıllarını kullanmayan (gerçeği görmeyen) sağırlar, dilsizlerdir.","Enfâl suresi, 22. ayet","Selim akıl","akıllarını kullanmayan","Aklını kullanmayanların kınanması, aklın bilgi edinmede ve doğruyu bulmada temel bir araç olduğunu gösterir.",[]],
  ["Ayet","İşte bunlar, sana vahyettiğimiz gayb haberlerindendir. Bundan önce onları ne sen biliyordun, ne de kavmin.…","Hûd suresi, 49. ayet","Vahiy","sana vahyettiğimiz gayb haberlerindendir","Akıl ve duyuların ulaşamadığı gayb bilgisi ancak vahiyle öğrenilir.",[]],
  ["Hadis","Hz. Peygamber, Muaz’a “Allah’ın kitabında ve Resulünün sünnetinde bir hüküm bulamazsan ne yaparsın?” diye sorar. Muaz, “Kendi görüşümle içtihat ederek bir karara varırım.” der; Hz. Peygamber bu cevaptan memnun olur.","Hz. Muhammed (sav) — Tirmizî, Ahkâm, 3","Selim akıl","Kendi görüşümle içtihat ederek","Hakkında açık hüküm bulunmayan konularda akıl yürütme (içtihat) yoluyla karar vermek, aklın bilgi kaynağı olduğunu gösterir.",[]],
  ["Ayet","De ki: \"O, Allah'tır, bir tektir.\" \"Allah Samed'dir. (Her şey O'na muhtaçtır; O, hiçbir şeye muhtaç değildir.)\" O'ndan çocuk olmamıştır (Kimsenin babası değildir). Kendisi de doğmamıştır (kimsenin çocuğu değildir).\" \"Hiçbir şey O'na denk ve benzer değildir.\"","İhlâs suresi, 1-4. ayetler","Marifet","O, Allah'tır, bir tektir","İhlâs suresi Allah’ı bir, Samed ve eşsiz olarak tanıtır; Allah’ı doğru tanımak marifettir.",[]],
  ["Ayet","Her şeyden önce insan, yediği yemeğine bir baksın!","Abese suresi, 24. ayet","Salim duyular","yediği yemeğine bir baksın","“Bir baksın” emri, insanın en yakınındaki nimeti gözlemleyerek bilgi edinmesini ister.",[]],
  ["Ayet","…Eğer bilmiyorsanız ilim sahiplerine sorun.","Nahl suresi, 43. ayet","Sadık haber","ilim sahiplerine sorun","Bilinmeyen konuda güvenilir kaynağa başvurmak gerekir; bilgi, ehlinden doğru haber olarak alınır.",["İlim"]],
  ["Ayet","O, yeri yayıp döşeyen, orada dağlar, nehirler meydana getiren, orada her türlü meyveden (erkekli-dişili) iki eş yaratandır. O, geceyi gündüze bürüyor. Şüphesiz bunlarda, düşünen bir kavim için (Allah'ın varlığını gösteren) deliller vardır.","Ra‘d suresi, 3. ayet","Tefekkür","düşünen bir kavim için","Yeryüzündeki düzenin “düşünen bir kavim için” delil olduğunu söyler; delilden anlam çıkarmak tefekkürdür.",[]],
  ["Hadis","“Kim bilerek benim adıma yalan söylerse cehennemdeki yerine hazırlansın.”","Hz. Muhammed (sav) — Buhârî, İlim, 38 (altmıştan fazla sahabinin rivayet ettiği mütevatir hadis)","Sadık haber","benim adıma yalan söylerse","Bu hadis, yalan üzerinde birleşmeleri mümkün olmayan çok sayıda sahabi tarafından aktarılmıştır: mütevatir (sadık) haberin örneğidir.",[]],
  ["Hadis","“Akıllı kişi, nefsini hesaba çeken ve ölümden sonrası için çalışandır.”","Hz. Muhammed (sav) — Tirmizî, Sıfatü’l-kıyâme, 25","Selim akıl","Akıllı kişi","Selim aklın işareti, kendini sorgulayıp sonucu düşünerek doğru davranmaktır.",[]],
  ["Ayet","Şüphesiz biz emaneti göklere, yere ve dağlara teklif ettik de onlar onu yüklenmek istemediler, ondan çekindiler. Onu insan yüklendi. Çünkü o çok zalimdir, çok cahildir.","Ahzâb suresi, 72. ayet","Mükellefiyet","Onu insan yüklendi","Göklerin, yerin ve dağların yüklenmekten çekindiği emaneti (sorumluluğu) insan yüklenmiştir.",[]],
  ["Ayet","(Böyle bir kimse mi Allah katında makbuldür,) yoksa gece vakitlerinde, secde halinde ve ayakta, ahiretten korkarak ve Rabbinin rahmetini umarak itaat ve kulluk eden mi? De ki: \"Hiç bilenlerle bilmeyenler bir olur mu?\" Ancak akıl sahipleri öğüt alırlar.","Zümer suresi, 9. ayet","İlim","Hiç bilenlerle bilmeyenler bir olur mu?","“Bilenlerle bilmeyenler bir olur mu?” sorusu bilginin (ilmin) insana kazandırdığı değeri vurgular.",["Selim akıl"]],
  ["Ayet","Hani Rabbin (ezelde) Ademoğullarının sulplerinden zürriyetlerini almış, onları kendilerine karşı şahit tutarak, \"Ben sizin Rabbiniz değil miyim?\" demişti. Onlar da, \"Evet, şahit olduk (ki Rabbimizsin)\" demişlerdi. Böyle yapmamız kıyamet günü, \"Biz bundan habersizdik\" dememeniz içindir.","A‘râf suresi, 172. ayet","Fıtrat","\"Ben sizin Rabbiniz değil miyim?\"","İnsanın Rabbini tanıyıp “Evet” demesi, inanmanın yaratılışa (fıtrata) yerleştirildiğini anlatır.",[]],
  ["Ayet","İşte sizin Rabbiniz Allah. O'ndan başka hiçbir ilah yoktur. O, her şeyin yaratıcısıdır. Öyle ise O'na kulluk edin. O, her şeye vekil (her şeyi yöneten, görüp gözeten)dir.","En‘âm suresi, 102. ayet","Marifet","İşte sizin Rabbiniz Allah","Ayet Allah’ı sıfatlarıyla tanıtır ve tanımanın kulluğa dönüşmesini ister: marifet.",[]],
  ["Ayet","…İşte misaller! Biz onları insanlara düşünsünler diye veriyoruz.","Haşr suresi, 21. ayet","Tefekkür","düşünsünler diye","Misaller, insanların üzerinde derin düşünüp anlam çıkarması için verilir.",[]],
  ["Hadis","“Haber, görmek gibi değildir.”","Hz. Muhammed (sav) — Ahmed b. Hanbel, Müsned, I, 215 (no. 1842)","Salim duyular","görmek gibi değildir","Bizzat görmenin (duyuyla edinilen bilginin) duyulan haberden daha güçlü bir bilgi sağladığını anlatır.",[]],
  ["Ayet","Nefse ve onu düzgün bir biçimde şekillendirip ona kötülük duygusunu ve takvasını (kötülükten sakınma yeteneğini) ilham edene andolsun ki…","Şems suresi, 7-8. ayetler","Fıtrat","kötülük duygusunu ve takvasını (kötülükten sakınma yeteneğini) ilham edene","İyiyi ve kötüyü ayırt etme yeteneği insanın yaratılışında (fıtratında) vardır.",[]],
  ["Ayet","Artık kim zerre ağırlığınca bir hayır işlerse, onun mükafatını görecektir. Kim de zerre ağırlığınca bir kötülük işlerse, onun cezasını görecektir.","Zilzâl suresi, 7-8. ayetler","Mükellefiyet","zerre ağırlığınca","Zerre kadar iyiliğin de kötülüğün de karşılığı görülecektir; insan her davranışından sorumludur.",[]],
  ["Ayet","Ey iman edenler! Size bir fasık bir haber getirirse, bilmeyerek bir topluluğa zarar verip yaptığınıza pişman olmamak için o haberin doğruluğunu araştırın.","Hucurât suresi, 6. ayet","Sadık haber","o haberin doğruluğunu araştırın","Gelen haber araştırılıp doğrulanmadan kabul edilmemelidir; güvenilir bilgi sadık haberdir.",[]],
  ["Ayet","De ki: \"Ben de ancak sizin gibi bir insanım. (Ne var ki) bana, 'Sizin ilah'ınız ancak bir tek ilahtır\" diye vahyolunuyor.…","Kehf suresi, 110. ayet","Vahiy","diye vahyolunuyor","Peygamber bir insandır; onu diğer insanlardan ayıran, kendisine vahiy gelmesidir.",[]],
  ["Ayet","Andolsun ki, onların kıssalarında akıl sahipleri için ibret vardır.…","Yûsuf suresi, 111. ayet","Selim akıl","akıl sahipleri için ibret vardır","Kıssalardan ders çıkaranlar akıl sahipleridir; akıl olaylardan sonuç çıkarır.",[]],
  ["Ayet","…\"Rabbim! İlmimi arttır\" de.","Tâhâ suresi, 114. ayet","İlim","İlmimi arttır","Peygambere bile “Rabbim! İlmimi arttır” diye dua etmesi öğretilir; bilgi arayışı hiç bitmez.",[]],
  ["Hadis","“Hilali görünce oruç tutun, onu görünce de bayram yapın.”","Hz. Muhammed (sav) — Buhârî, Savm, 11","Salim duyular","Hilali görünce","Orucun başlangıcı ve bayram, hilalin gözle görülmesine, yani duyu yoluyla edinilen bilgiye bağlanmıştır.",[]],
  ["Ayet","…Allah içinizden inananların ve kendilerine ilim verilenlerin derecelerini yükseltsin.","Mücâdele suresi, 11. ayet","İlim","kendilerine ilim verilenlerin derecelerini yükseltsin","Ayet, ilim sahiplerinin derecelerinin yükseltileceğini bildirerek ilmin değerini gösterir.",[]]]},"13":{"baslik":"Ara Kendini Dene — 1.3 İbadet ve Dua Eden Bir Varlık Olarak İnsan","alt":"İbadet, dua, tövbe, hamt, şükür, zikir, Kur’an okuma ve Esmâ-i Hüsnâ","kavram":{"İbadet":"Sözlükte boyun eğme, itaat, kulluk. Terim olarak Allah’ın rızasına uygun şekilde yapılan bütün davranışlar.","Dua":"Kulun bütün benliğiyle Allah’a yönelerek O’ndan istek ve dilekte bulunması; acizliğini kavrayıp yalvarması.","Tövbe":"Yapılan hata ve günahlardan pişman olup Allah’tan bağışlanma dilemek (istiğfar) ve bir daha yapmamaya karar vermek.","Hamt":"Sevgi ve saygıyla Allah’ı övmek, yüceltmek; bütün övgülerin Allah’a ait olduğunu bilmek.","Şükür":"Nimetlere teşekkür etmek; nimeti verenin Allah olduğunu bilip nimeti O’nun rızasına uygun kullanmak.","Zikir":"Allah’ı anmak, hatırlamak; dil ve kalple O’nu sürekli hatırda tutmak.","Kur’an okuma":"Allah’ın kelamını okuyup dinlemek; onu okumak Allah ile doğrudan iletişim kurmaktır.","Esmâ-i Hüsnâ":"Allah’ın güzel isimleri. Kur’an’da dua ederken bu isimlerle Allah’a yönelmemiz istenir."},"maddeler":[["Ayet","\"Şüphe yok ki ben Allah'ım. Benden başka hiçbir ilah yoktur. O halde bana ibadet et ve beni anmak için namaz kıl.\"","Tâhâ suresi, 14. ayet","Zikir","beni anmak için namaz kıl","Namaz bile Allah’ı anmak için kılınır; zikrin önemini gösterir.",["İbadet"]],
  ["Ayet","Onlardan, \"Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru\" diyenler de vardır.","Bakara suresi, 201. ayet","Dua","Bize dünyada da iyilik ver, ahirette de iyilik ver","Dünya ve ahiret iyiliği istemek, duanın en kapsamlı örneklerindendir.",[]],
  ["Ayet","Hamd, Alemlerin Rabbi, Rahman, Rahim, hesap ve ceza gününün (ahiret gününün) maliki Allah'a mahsustur.","Fâtiha suresi, 2-4. ayetler","Hamt","Hamd, Alemlerin Rabbi","Fâtiha hamt ile başlar: bütün övgüler âlemlerin Rabbi Allah’a aittir.",[]],
  ["Ayet","…\"Ey Rabbim! Beni; bana ve ana babama verdiğin nimetlere şükretmeye ve razı olacağın salih ameller işlemeye sevk et ve beni rahmetinle salih kullarının arasına kat!\"","Neml suresi, 19. ayet","Şükür","verdiğin nimetlere şükretmeye","Hz. Süleyman, nimetlere şükredebilmeyi ister: şükür bilinci.",["Dua"]],
  ["Ayet","Halbuki onlara, ancak dini Allah'a has kılarak, hakka yönelen kimseler olarak O'na kulluk etmeleri, namazı kılmaları ve zekatı vermeleri emredilmişti. İşte bu dosdoğru dindir.","Beyyine suresi, 5. ayet","İbadet","dini Allah'a has kılarak","Allah’a ihlasla kulluk etmek, namaz kılmak ve zekât vermek ibadetin özüdür.",[]],
  ["Ayet","Her kim de işlediği zulmünün arkasından tövbe edip durumunu düzeltirse kuşkusuz, Allah onun tövbesini kabul eder. Şüphesiz Allah, çok bağışlayandır, çok merhamet edendir.","Mâide suresi, 39. ayet","Tövbe","tövbe edip durumunu düzeltirse","Hatadan pişman olup dönen ve durumunu düzelten kişinin tövbesi kabul edilir.",[]],
  ["Ayet","…Kur'an'ı ağır ağır, tane tane oku.","Müzzemmil suresi, 4. ayet","Kur’an okuma","tane tane oku","Kur’an’ın acele etmeden, anlayarak, tane tane okunması istenir.",[]],
  ["Ayet","Ey iman edenler! Allah'a karşı gelmekten sakınmanız için oruç, sizden öncekilere farz kılındığı gibi, size de farz kılındı.","Bakara suresi, 183. ayet","İbadet","oruç, sizden öncekilere farz kılındığı gibi","Oruç, şekli ve vakti belli olan farz bir ibadettir.",[]],
  ["Ayet","Hamd, gökleri ve yeri yaratan, karanlıkları ve aydınlığı var eden Allah'a mahsustur.…","En‘âm suresi, 1. ayet","Hamt","Hamd, gökleri ve yeri yaratan","Yaratan olduğu için bütün övgü Allah’a aittir.",[]],
  ["Ayet","Öyleyse yalnız beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.","Bakara suresi, 152. ayet","Zikir","yalnız beni anın ki ben de sizi anayım","Allah’ı anan kulu Allah da anar; zikir karşılıklı bir bağdır.",["Şükür"]],
  ["Ayet","…Ey mü'minler, hep birlikte tövbe ediniz ki kurtuluşa eresiniz!","Nûr suresi, 31. ayet","Tövbe","hep birlikte tövbe ediniz","Bütün müminler tövbeye ve Allah’a dönmeye çağrılır.",[]],
  ["Ayet","(Ey Muhammed!) De ki: \"Duanız olmasa, Rabbim size ne diye değer versin!…","Furkān suresi, 77. ayet","Dua","Duanız olmasa","Kulun Allah katındaki değeri, O’na yönelip dua etmesiyle ilgilidir.",[]],
  ["Ayet","Kur'an okunduğu zaman ona kulak verip dinleyin ve susun ki size merhamet edilsin.","A‘râf suresi, 204. ayet","Kur’an okuma","Kur'an okunduğu zaman ona kulak verip dinleyin","Kur’an okunduğunda onu dikkatle dinlemek de Kur’an’la bağ kurmaktır.",[]],
  ["Ayet","En güzel isimler Allah'ındır. O'na o güzel isimleriyle dua edin…","A‘râf suresi, 180. ayet","Esmâ-i Hüsnâ","En güzel isimler Allah'ındır","Allah’ın en güzel isimleri (esmâ-i hüsnâ) vardır; O’na bu isimlerle dua edilir.",["Dua"]],
  ["Ayet","Ey iman edenler! Allah'a içtenlikle tövbe edin. Umulur ki, Rabbiniz sizin kötülüklerinizi örter…","Tahrîm suresi, 8. ayet","Tövbe","Allah'a içtenlikle tövbe edin","Samimi (nasuh) tövbe, kötülüklerin örtülmesine vesile olur.",[]],
  ["Ayet","Bunların oradaki duaları, \"Seni eksikliklerden uzak tutarız Allah'ım!\", aralarındaki esenlik dilekleri, \"selam\"; dualarının sonu ise, \"Hamd alemlerin Rabbi Allah'a mahsustur\" sözleridir.","Yûnus suresi, 10. ayet","Hamt","dualarının sonu ise, \"Hamd alemlerin Rabbi Allah'a mahsustur\"","Cennet ehlinin dualarının sonu bile hamt cümlesidir.",["Dua"]],
  ["Hadis","“…Kulum beni andığında onunla beraberim. O beni anarsa ben de onu anarım…”","Hz. Muhammed (sav) — Buhârî, Tevhîd, 15 (kudsî hadis)","Zikir","Kulum beni andığında onunla beraberim","Allah’ı anan kul, Allah’ın beraberliğini kazanır.",[]],
  ["Ayet","Ey insanlar! Sizi ve sizden öncekileri yaratan Rabbinize ibadet edin ki, Allah'a karşı gelmekten sakınasınız.","Bakara suresi, 21. ayet","İbadet","Rabbinize ibadet edin","Bütün insanlar, kendilerini yaratan Rablerine ibadete çağrılır.",[]],
  ["Ayet","Şüphesiz, Allah'ın kitabını okuyanlar, namazı kılanlar ve kendilerine rızık olarak verdiğimiz şeylerden, gizlice ve açıktan Allah yolunda harcayanlar, asla zarar etmeyecek bir ticaret umabilirler.","Fâtır suresi, 29. ayet","Kur’an okuma","Allah'ın kitabını okuyanlar","Allah’ın kitabını okuyanlar, zarar etmeyecek bir ticaret umanlar arasında sayılır.",["İbadet"]],
  ["Ayet","Andolsun, biz Lokman'a \"Allah'a şükret\" diye hikmet verdik. Kim şükrederse, ancak kendisi için şükretmiş olur.…","Lokmân suresi, 12. ayet","Şükür","Kim şükrederse, ancak kendisi için şükretmiş olur","Şükrün faydası insanın kendisinedir; Allah’ın şükre ihtiyacı yoktur.",[]],
  ["Ayet","De ki: \"Ey kendilerinin aleyhine aşırı giden kullarım! Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah, bütün günahları affeder. Çünkü O, çok bağışlayandır, çok merhamet edendir.\"","Zümer suresi, 53. ayet","Tövbe","Allah'ın rahmetinden ümidinizi kesmeyin","Günah işleyen kişi Allah’ın affından ümit kesmemeli, O’na dönmelidir; tövbenin kapısı açıktır.",[]],
  ["Hadis","“Allah Teâlâ katında duadan daha kıymetli bir şey yoktur.”","Hz. Muhammed (sav) — Tirmizî, Deavât, 1","Dua","duadan daha kıymetli bir şey yoktur","Allah katında duanın değeri vurgulanır.",[]],
  ["Ayet","Namaz kılınınca artık yeryüzüne dağılın ve Allah'ın lütfundan nasibinizi arayın. Allah'ı çok zikredin ki kurtuluşa eresiniz.","Cuma suresi, 10. ayet","Zikir","Allah'ı çok zikredin","İş ve geçim arasında bile Allah’ı çok anmak kurtuluşa vesiledir.",[]],
  ["Ayet","\"Hamd, çocuk edinmeyen, mülkte ortağı olmayan, zillet ve acizliğin gerektirdiği bir yardımcıya ihtiyacı bulunmayan Allah'a mahsustur\" de ve O'nu tekbir ile yücelt.","İsrâ suresi, 111. ayet","Hamt","\"Hamd, çocuk edinmeyen","Eşi, ortağı ve yardımcıya ihtiyacı olmayan Allah övülür ve yüceltilir.",[]],
  ["Ayet","O, yaratan, yoktan var eden, şekil veren Allah'tır. Güzel isimler O'nundur.…","Haşr suresi, 24. ayet","Esmâ-i Hüsnâ","Güzel isimler O'nundur","Hâlık, Bâri, Musavvir gibi isimler sayılır: güzel isimler Allah’a aittir.",[]],
  ["Ayet","Allah, sözün en güzelini; ayetleri, (güzellikte) birbirine benzeyen ve (hükümleri, öğütleri, kıssaları) tekrarlanan bir kitap olarak indirmiştir. Rablerinden korkanların derileri (vücutları) ondan dolayı gerginleşir. Sonra derileri de (vücutları da) kalpleri de Allah'ın zikrine karşı yumuşar.…","Zümer suresi, 23. ayet","Kur’an okuma","sözün en güzelini","Kur’an okunup dinlendiğinde kalpleri etkiler ve yumuşatır.",["Zikir"]],
  ["Ayet","Kullarım, beni senden sorarlarsa, (bilsinler ki), gerçekten ben (onlara çok) yakınım. Bana dua edince, dua edenin duasına cevap veririm. O halde, doğru yolu bulmaları için benim davetime uysunlar, bana iman etsinler.","Bakara suresi, 186. ayet","Dua","dua edenin duasına cevap veririm","Allah kullarına yakındır ve dua edenin duasına cevap verir.",[]],
  ["Ayet","De ki: \"(Rabbinizi) ister Allah diye çağırın, ister Rahman diye çağırın. Hangisiyle çağırırsanız çağırın, nihayet en güzel isimler O'nundur.\"…","İsrâ suresi, 110. ayet","Esmâ-i Hüsnâ","nihayet en güzel isimler O'nundur","Allah, güzel isimlerinden hangisiyle çağrılırsa çağrılsın yalnızca O’dur.",["Dua"]],
  ["Ayet","Rabbinize alçak gönüllüce ve için için dua edin. Çünkü O, haddi aşanları sevmez.","A‘râf suresi, 55. ayet","Dua","alçak gönüllüce ve için için dua edin","Duanın edebi öğretilir: alçak gönüllülükle ve içten bir yalvarışla.",[]],
  ["Ayet","Sana ölüm gelinceye kadar Rabbine ibadet et.","Hicr suresi, 99. ayet","İbadet","Rabbine ibadet et","İbadet ömür boyu süren bir kulluk görevidir; ölüm gelinceye kadar devam eder.",[]],
  ["Ayet","Ey iman edenler! Eğer siz ancak Allah'a kulluk ediyorsanız, size verdiğimiz rızıkların iyi ve temizlerinden yiyin ve Allah'a şükredin.","Bakara suresi, 172. ayet","Şükür","Allah'a şükredin","Verilen temiz rızıklardan yiyip Allah’a şükretmek istenir.",["İbadet"]],
  ["Ayet","Rabbinizden bağışlanma dileyin, sonra da O'na tövbe edin…","Hûd suresi, 3. ayet","Tövbe","bağışlanma dileyin, sonra da O'na tövbe edin","Bağışlanma dilemek (istiğfar) ve Allah’a dönmek tövbenin iki yüzüdür.",[]],
  ["Ayet","Hamd, kuluna Kitab'ı (Kur'an'ı) indiren ve onda hiçbir eğrilik yapmayan Allah'a mahsustur.","Kehf suresi, 1. ayet","Hamt","Hamd, kuluna Kitab'ı (Kur'an'ı) indiren","Kur’an’ı indiren Allah’a hamt edilir.",[]],
  ["Ayet","Kur'an okuduğun zaman, kovulmuş şeytandan Allah'a sığın.","Nahl suresi, 98. ayet","Kur’an okuma","Kur'an okuduğun zaman","Kur’an okumaya başlarken şeytandan Allah’a sığınmak, okumanın edebidir.",[]],
  ["Ayet","O, ilk ve sondur. Zahir ve Batın'dır. O, her şeyi hakkıyla bilendir.","Hadîd suresi, 3. ayet","Esmâ-i Hüsnâ","O, ilk ve sondur. Zahir ve Batın'dır","el-Evvel, el-Âhir, ez-Zâhir, el-Bâtın ve el-Alîm, Allah’ın güzel isimlerindendir.",[]],
  ["Ayet","Ey iman edenler! Allah'ı çokça zikredin. O'nu sabah akşam tespih edin.","Ahzâb suresi, 41-42. ayetler","Zikir","Allah'ı çokça zikredin","Allah’ı çokça anmak ve sabah akşam tespih etmek emredilir.",[]],
  ["Hadis","“Kulun Rabbine en yakın olduğu an, secdede olduğu andır…”","Hz. Muhammed (sav) — Müslim, Salât, 215","İbadet","secdede olduğu andır","Namazın secdesi, kulun Allah’a en yakın olduğu ibadet anıdır.",["Dua"]],
  ["Ayet","Yine onlar, çirkin bir iş yaptıkları, yahut nefislerine zulmettikleri zaman Allah'ı hatırlayıp hemen günahlarının bağışlanmasını isteyenler -ki Allah'tan başka günahları kim bağışlar- ve bile bile işledikleri (günah) üzerinde ısrar etmeyenlerdir.","Âl-i İmrân suresi, 135. ayet","Tövbe","hemen günahlarının bağışlanmasını isteyenler","Hatasını fark edip hemen bağışlanma dileyen ve günahında ısrar etmeyenler övülür.",[]],
  ["Ayet","(Allahım!) Yalnız sana ibadet ederiz ve yalnız senden yardım dileriz.","Fâtiha suresi, 5. ayet","İbadet","Yalnız sana ibadet ederiz","Fâtiha’daki bu söz, ibadetin yalnızca Allah’a yapılacağının her rekâtta yenilenen ilanıdır.",["Dua"]],
  ["Ayet","Rabbiniz şöyle dedi: \"Bana dua edin, duanıza cevap vereyim.…","Mü’min suresi, 60. ayet","Dua","Bana dua edin, duanıza cevap vereyim","Allah kullarını kendisine dua etmeye çağırır ve cevap vereceğini bildirir.",[]],
  ["Ayet","…Ey Davud ailesi, şükredin! Kullarımdan şükredenler pek azdır.","Sebe’ suresi, 13. ayet","Şükür","Kullarımdan şükredenler pek azdır","Nimet çok, şükreden azdır; ayet şükre çağırır.",[]],
  ["Ayet","Onlar, inananlar ve kalpleri Allah'ı anmakla huzura kavuşanlardır. Biliniz ki, kalpler ancak Allah'ı anmakla huzur bulur.","Ra‘d suresi, 28. ayet","Zikir","kalpler ancak Allah'ı anmakla huzur bulur","Kalbin huzuru Allah’ı anmaktadır (zikir).",[]],
  ["Hadis","“…Bana dua eden yok mu, duasını kabul edeyim! Benden isteyen yok mu, ona vereyim! Benden mağfiret isteyen yok mu, onu bağışlayayım!”","Hz. Muhammed (sav) — Buhârî, Teheccüd, 14 (kudsî hadis)","Tövbe","Benden mağfiret isteyen yok mu, onu bağışlayayım","Allah, bağışlanma (mağfiret) dileyeni bağışlayacağını bildirir; tövbe ve istiğfara çağrıdır.",["Dua"]],
  ["Hadis","“Kim Kur’an-ı Kerim’den bir harf okursa onun için bir iyilik sevabı vardır. Her bir iyiliğin karşılığı da on sevaptır…”","Hz. Muhammed (sav) — Tirmizî, Fedâilü’l-Kur’ân, 16","Kur’an okuma","bir harf okursa","Kur’an’dan okunan her harf için sevap vardır.",[]],
  ["Hadis","“Dua, ibadetin özüdür.”","Hz. Muhammed (sav) — Tirmizî, Deavât, 1","Dua","Dua, ibadetin özüdür","Dua, kulun Allah’a yönelişinin özü olarak tanımlanır.",["İbadet"]],
  ["Ayet","Artık Allah'ın size helal ve temiz olarak verdiği rızıklardan yiyin. Eğer yalnız O'na ibadet ediyorsanız, Allah'ın nimetine şükredin.","Nahl suresi, 114. ayet","Şükür","Allah'ın nimetine şükredin","Helal ve temiz rızıktan yemek ve nimete şükretmek emredilir.",["İbadet"]],
  ["Ayet","Ben cinleri ve insanları, ancak bana kulluk etsinler diye yarattım.","Zâriyât suresi, 56. ayet","İbadet","ancak bana kulluk etsinler diye","İnsanın yaratılış amacı Allah’a kulluk, yani ibadettir.",[]],
  ["Ayet","Hamd, gökleri ve yeri yaratan, melekleri ikişer, üçer, dörder kanatlı elçiler yapan Allah'a mahsustur.…","Fâtır suresi, 1. ayet","Hamt","Hamd, gökleri ve yeri yaratan, melekleri","Allah, yaratıcılığı ve kudreti sebebiyle övülür.",[]],
  ["Ayet","Hani Rabbiniz şöyle duyurmuştu: \"Andolsun, eğer şükrederseniz elbette size nimetimi artırırım. Eğer nankörlük ederseniz, hiç şüphesiz azabım çok şiddetlidir.\"","İbrâhîm suresi, 7. ayet","Şükür","eğer şükrederseniz elbette size nimetimi artırırım","Şükür nimeti artırır; nankörlük ise azaba sebep olur.",[]],
  ["Ayet","Allah, kendisinden başka hiçbir ilah bulunmayandır. En güzel isimler O'nundur.","Tâhâ suresi, 8. ayet","Esmâ-i Hüsnâ","En güzel isimler O'nundur","Tek ilah olan Allah’ın en güzel isimleri vardır.",[]]]}};
var BOYUT = 10;

function e(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function oku(k){ try{ return JSON.parse(localStorage.getItem(k)||'null'); }catch(x){ return null; } }
function yaz(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(x){} }
function isaretle(m, ifade){ var i=m.indexOf(ifade); return i<0 ? e(m) : e(m.slice(0,i))+'<mark>'+e(ifade)+'</mark>'+e(m.slice(i+ifade.length)); }

function kur(kok){
  var id=kok.getAttribute('data-akd'), B=VERI[id]; if(!B) return;
  var M=B.maddeler, KAV=Object.keys(B.kavram), TUR=Math.ceil(M.length/BOYUT), ANAHTAR='u1-akd-'+id;
  var d=oku(ANAHTAR)||{}; var cevap=d.c||{}, aktif=(d.t>=0&&d.t<TUR)?d.t:0, goster=null;
  function kaydet(){ yaz(ANAHTAR,{c:cevap,t:aktif}); }
  function dogruMu(i,k){ return k===M[i][3] || M[i][6].indexOf(k)>=0; }
  function turMaddeleri(t){ var l=[]; for(var i=t*BOYUT;i<Math.min(M.length,(t+1)*BOYUT);i++) l.push(i); return l; }
  function skor(l){ var dg=0,c=0; l.forEach(function(i){ if(cevap[i]){ c++; if(dogruMu(i,cevap[i])) dg++; } }); return {d:dg,c:c}; }
  function ilkBos(t){ var l=turMaddeleri(t); for(var p=0;p<l.length;p++) if(!cevap[l[p]]) return p; return -1; }

  kok.innerHTML =
    '<div class="akd-ust"><div class="akd-turlar" role="group" aria-label="Turlar"></div><span class="akd-genel" aria-live="polite"></span></div>'+
    '<div class="akd-noktalar" role="group" aria-label="Turdaki sorular"></div>'+
    '<div class="akd-sahne" aria-live="polite"></div>'+
    '<div class="akd-alt"><button type="button" class="akd-btn ikincil" data-akd-is="sifirla">Baştan başla</button></div>'+
    '<details class="akd-anahtar"><summary>Cevap anahtarı (öğretmen için)</summary><div class="akd-anahtar-ic"></div></details>';
  var $=function(s){ return kok.querySelector(s); };

  function turlarCiz(){
    $('.akd-turlar').innerHTML=Array.apply(null,{length:TUR}).map(function(_,t){
      var s=skor(turMaddeleri(t)), tamam=s.c===turMaddeleri(t).length;
      return '<button type="button" class="akd-tur'+(t===aktif?' sec':'')+(tamam?' tamam':'')+'" data-akd-tur="'+t+'" aria-pressed="'+(t===aktif)+'">'+(t*BOYUT+1)+'–'+Math.min(M.length,(t+1)*BOYUT)+'<small>'+(tamam?'✓ ':'')+s.d+'/'+turMaddeleri(t).length+'</small></button>';
    }).join('');
    var g=skor(M.map(function(_,i){ return i; }));
    $('.akd-genel').textContent='Genel: '+g.d+' doğru · '+g.c+'/'+M.length+' cevaplandı';
  }
  function noktalarCiz(){
    $('.akd-noktalar').innerHTML=turMaddeleri(aktif).map(function(i,p){
      var c=cevap[i], cls=c?(dogruMu(i,c)?' d':' y'):'';
      return '<button type="button" class="akd-nokta'+cls+(p===goster?' aktif':'')+'" data-akd-p="'+p+'" aria-label="'+(i+1)+'. soru'+(c?(dogruMu(i,c)?', doğru':', yanlış'):'')+'">'+(i+1)+'</button>';
    }).join('');
  }
  function kartCiz(){
    var i=turMaddeleri(aktif)[goster], m=M[i], sec=cevap[i], had=m[0]==='Hadis';
    var h='<div class="akd-kart'+(had?' hadis':'')+'"><div class="akd-kart-ust"><span class="akd-rozet">'+(had?'💬 HADİS':'📜 AYET')+'</span><span class="akd-sayac">Soru '+(i+1)+' / '+M.length+'</span></div>'+
      '<p class="akd-metin">'+(sec?isaretle(m[1],m[4]):e(m[1]))+'</p><p class="akd-kay">— '+e(m[2])+'</p></div>'+
      '<p class="akd-soru">Bu '+(had?'hadis':'ayet')+' hangi kavramla eşleşir?</p><div class="akd-kavramlar" role="group" aria-label="Kavramlar">'+
      KAV.map(function(k,n){
        var cls='akd-kavram'; if(sec){ if(k===m[3]) cls+=' dogru'; else if(k===sec) cls+=(dogruMu(i,k)?' kabul':' yanlis'); }
        return '<button type="button" class="'+cls+'" data-akd-k="'+e(k)+'"'+(sec?' disabled':'')+'><kbd>'+(n+1)+'</kbd>'+e(k)+'</button>';
      }).join('')+'</div>';
    if(sec){
      var dg=dogruMu(i,sec), kabul=dg && sec!==m[3];
      h+='<div class="akd-gb '+(dg?'d':'y')+'"><p><b>'+(dg?'✓ Doğru! ':'✗ Doğru kavram: ')+e(m[3])+'.</b> '+e(B.kavram[m[3]])+'</p>'+
        (kabul?'<p class="akd-not">Seçtiğin “'+e(sec)+'” kavramı da bu metinle ilişkili olduğu için kabul edildi; ama en çok öne çıkan kavram <b>'+e(m[3])+'</b>.</p>':'')+
        '<p class="akd-neden"><b>🔗 Neden?</b> '+e(m[5])+' <span class="akd-ifade">Anahtar ifade: “'+e(m[4])+'”</span></p>'+
        (!dg?'<p class="akd-not"><b>Senin seçtiğin '+e(sec)+':</b> '+e(B.kavram[sec])+'</p>':'')+
        '<button type="button" class="akd-btn" data-akd-is="ileri">'+(ilkBos(aktif)<0?'Tur sonucunu gör →':'Sonraki soru →')+'</button></div>';
    }
    $('.akd-sahne').innerHTML=h;
  }
  function ozetCiz(){
    var l=turMaddeleri(aktif), s=skor(l), yanlis=l.filter(function(i){ return !dogruMu(i,cevap[i]); });
    $('.akd-sahne').innerHTML='<div class="akd-ozet"><p class="akd-ozet-skor">'+s.d+' / '+l.length+'</p><p><b>'+(aktif*BOYUT+1)+'–'+Math.min(M.length,(aktif+1)*BOYUT)+'. sorular tamamlandı.</b> '+
      (s.d===l.length?'Kusursuz! Bütün metinleri doğru kavramla eşleştirdin.':s.d>=7?'Güzel! Yanlışlarının gerekçelerine bir kez daha bak.':'Kavram tanımlarını tekrar oku, sonra yanlışlarını yeniden dene.')+'</p>'+
      (yanlis.length?'<ol class="akd-yanlislar">'+yanlis.map(function(i){ return '<li value="'+(i+1)+'"><b>'+e(M[i][3])+'</b> — '+e(M[i][2])+'</li>'; }).join('')+'</ol>':'')+
      '<div class="akd-dugmeler">'+(yanlis.length?'<button type="button" class="akd-btn ikincil" data-akd-is="yanlislar">Yanlışları yeniden dene</button>':'')+
      (aktif<TUR-1?'<button type="button" class="akd-btn" data-akd-is="sonrakiTur">Sonraki 10 soru →</button>':'<span class="akd-son">🏁 50 sorunun hepsini tamamladın.</span>')+'</div></div>';
  }
  function sahneCiz(){ if(goster===null){ var p=ilkBos(aktif); if(p<0){ noktalarCiz(); ozetCiz(); return; } goster=p; } noktalarCiz(); kartCiz(); }
  function anahtarCiz(){
    $('.akd-anahtar-ic').innerHTML='<ol>'+M.map(function(m){ return '<li><b>'+e(m[3])+'</b>'+(m[6].length?' <small>(kabul: '+e(m[6].join(', '))+')</small>':'')+' — '+e(m[2])+'</li>'; }).join('')+'</ol>';
  }
  function hepsi(){ turlarCiz(); sahneCiz(); }
  function sec(k){
    if(goster===null) return; var i=turMaddeleri(aktif)[goster]; if(cevap[i]) return;
    cevap[i]=k; kaydet(); hepsi();
    var b=$('[data-akd-is="ileri"]'); if(b) b.focus({preventScroll:true});
  }
  kok.addEventListener('click',function(ev){
    var t=ev.target.closest('button'); if(!t || !kok.contains(t)) return;
    if(t.hasAttribute('data-akd-k')){ sec(t.getAttribute('data-akd-k')); return; }
    if(t.hasAttribute('data-akd-tur')){ aktif=+t.getAttribute('data-akd-tur'); goster=null; kaydet(); hepsi(); return; }
    if(t.hasAttribute('data-akd-p')){ goster=+t.getAttribute('data-akd-p'); noktalarCiz(); kartCiz(); return; }
    var is=t.getAttribute('data-akd-is');
    if(is==='ileri'){ goster=null; hepsi(); var o=$('.akd-kavram:not([disabled]), [data-akd-is]'); if(o) o.focus({preventScroll:true}); }
    else if(is==='sonrakiTur'){ aktif=Math.min(TUR-1,aktif+1); goster=null; kaydet(); hepsi(); kok.scrollIntoView({behavior:'smooth',block:'start'}); }
    else if(is==='yanlislar'){ turMaddeleri(aktif).forEach(function(i){ if(!dogruMu(i,cevap[i])) delete cevap[i]; }); goster=null; kaydet(); hepsi(); }
    else if(is==='sifirla'){ if(window.confirm('Bu bölümdeki 50 sorunun bütün cevapları silinsin mi?')){ cevap={}; aktif=0; goster=null; kaydet(); hepsi(); } }
  });
  kok.addEventListener('keydown',function(ev){
    if(ev.target.closest('summary')) return;
    var n=+ev.key; if(n>=1 && n<=KAV.length && goster!==null){ var i=turMaddeleri(aktif)[goster]; if(!cevap[i]){ ev.preventDefault(); sec(KAV[n-1]); } }
  });
  anahtarCiz(); hepsi();
}
function basla(){ [].forEach.call(document.querySelectorAll('.akd[data-akd]'),kur); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',basla); else basla();
})();
