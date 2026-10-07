/* =====================================================================
   KAVRAMI ANLAMA: AYET/HADİS → KAVRAM  (11. sınıf 1. ünite)
   index.html#ayet-kavram içine yerleşir; sayfanın diğer kodlarına
   dokunmaz, kendi kapsamında (IIFE) çalışır.

   Akış: 📜 Metin → 🔍 Düşün → 🧠 Kavram → 🔗 Neden? → 🏆 Sonuç
   Puan: kavram +10 · gerekçe +10 (ilk denemede doğruysa). Havuzdaki “hayat”
   senaryoları şu an kullanılmıyor; veri olarak duruyor.

   KAYNAK KURALI: Ayet mealleri Diyanet İşleri Başkanlığı mealinden
   (acikkuran.com üzerinden karşılaştırılarak) birebir alınmıştır. Hadisler
   bu ünitenin sayfalarında künyesiyle yer alan hadislerdir. Kavramlar ve
   tanımları index.html’deki Kavramlar listesinden alınmıştır.
   ===================================================================== */
(function(){
'use strict';

/* ---------- Kavram tanımları (index.html Kavramlar listesinden) ---------- */
var TANIM = {
  'Kader':'Allah’ın (cc) ezelî ilmiyle olacak her şeyi bilmesi, ölçü ve plan dâhilinde takdir etmesi.',
  'Kaza':'Takdir edilen planın zamanı geldiğinde gerçekleşmesi; hüküm, karar.',
  'Sünnetullah':'Allah’ın (cc) evrene koyduğu değişmez fiziksel, biyolojik ve toplumsal yasalar.',
  'Rızık':'Allah’ın (cc) canlılara verdiği maddi ve manevi tüm nimetler.',
  'Sabır':'Zorluklar karşısında Allah’a (cc) sığınarak direnç göstermek, acele etmemek.',
  'Ömür':'Doğumla ölüm arasında yaşanan süre.',
  'Ecel':'Varlıklar için belirlenen sürenin sonu, ölüm anı; değişmez.',
  'Dua':'Kulun acizliğini kabul ederek Allah’tan (cc) yardım dilemesi; ibadetin özü.',
  'Tevekkül':'Gerekli tedbiri alıp çalıştıktan sonra sonucu Allah’a (cc) bırakmak.',
  'Teslimiyet':'Allah’ın (cc) iradesine gönülden boyun eğmek, sonucu kabullenmek.',
  'Rıza':'Allah’tan (cc) gelen sevindirici veya üzücü her şeyden hoşnut olmak, isyan etmemek.',
  'İmtihan':'İnsanın nimetler ve zorluklar karşısında sınanması.',
  'İrade':'İnsanın seçenekler arasında tercih yapabilme gücü (cüz’î irade).',
  'Külli irade':'Allah’ın (cc) hiçbir zorunluluğa bağlı olmadan dilediğini gerçekleştirmesi.',
  'Sorumluluk':'İnsanın özgür iradesiyle yaptığı tercihlerin sonuçlarını üstlenmesi.',
  'Çaba':'Hedef için emek harcamak; sonucun sebeplerindendir ama garantisi değildir.',
  'Tedbir':'Olası zararlara karşı önlem almak, sebeplere uymak; tevekkülün ön şartı.'
};

/* ---------- Görev havuzu ----------
   k: ana kavram · cel: yakın çeldiriciler (aynı üniteden) · yakin: ayırt etme çifti
   ifade: metindeki anahtar ifade · mesaj: [doğru, yanlış, yanlış]
   gerekce: [[metin, geri bildirim], …] ilki doğru · hayat: {s, k, o:[[metin, gb], …] ilki doğru} */
var H = [
  { id:'kamer49', tur:'Ayet', kay:'Kamer suresi, 49. ayet', m:'Gerçekten biz, her şeyi bir ölçü ve dengede yarattık.',
    k:'Kader', cel:['Kaza','Sünnetullah','Külli irade'], yakin:'Kaza', ifade:'her şeyi bir ölçü ve dengede',
    fark:'Kader, olacakların ölçü ve plan dâhilinde takdir edilmesidir; kaza, bu takdirin zamanı gelince gerçekleşmesidir. Ayet “her şeyi bir ölçü ve dengede yarattık” diyerek takdiri öne çıkarır.',
    mesaj:['Allah her şeyi bir ölçü ve plan dâhilinde takdir etmiştir.','Takdir edilen her şey hemen o anda gerçekleşir.','Olayların ölçüsünü insanın kendi tercihleri belirler.'],
    gerekce:[['Çünkü metin, her şeyin önceden bir ölçüye göre belirlendiğini, yani Allah’ın takdirini anlatır.',''],
             ['Çünkü metin, takdir edilen bir olayın gerçekleştiği anı anlatır.','Bu kazanın anlamıdır. Ayette “gerçekleşme anı” değil, “ölçü ve dengede yaratma”, yani takdir vardır.'],
             ['Çünkü metin, insanın kendi tercihiyle her şeyin ölçüsünü belirlediğini söyler.','Ayette ölçüyü koyan “Biz”, yani Allah’tır; insanın tercihi ayrı bir konudur.']],
    hayat:{ s:'Bir arkadaşın “Madem her şey bir ölçü ve dengede yaratılmış, benim çalışmamın bir anlamı yok.” diyor.', k:'Bu düşüncedeki yanlış nedir?',
      o:[['Kaderi, insanın iradesini ve çabasını ortadan kaldıran bir zorlama sanması',''],
         ['Kaderin varlığına inanması','Kadere inanmak yanlış değildir; yanlış olan, kaderi çabayı bırakmanın gerekçesi yapmaktır.'],
         ['Çalışmanın her zaman başarıyı garanti ettiğini bilmemesi','Çaba sonucun garantisi değildir ama sebebidir; asıl hata kaderi tembelliğe bahane etmektir.'],
         ['Ölçünün yalnızca doğa olayları için geçerli olduğunu düşünmesi','Metindeki düşüncenin sorunu bu değil; arkadaşın, takdiri iradeyi yok eden bir zorlama sanıyor.']] } },

  { id:'rahman5', tur:'Ayet', kay:'Rahmân suresi, 5. ayet', m:'Güneş ve ay bir hesaba göre hareket etmektedir.',
    k:'Sünnetullah', cel:['Kader','Kaza','Külli irade'], yakin:'Kader', ifade:'bir hesaba göre',
    fark:'Kader her şeyin takdiridir; sünnetullah ise bu takdirin evrende değişmez yasalar hâlinde işlemesidir. Ayet gök cisimlerinin hesaplı hareketini, yani yasayı anlatır.',
    mesaj:['Evrende gök cisimleri değişmeyen bir düzen ve hesap içinde hareket eder.','Gök cisimlerinin hareketi insanın tercihlerine bağlıdır.','Güneş ve ayın hareketi tesadüflere göre değişir.'],
    gerekce:[['Çünkü güneş ve ayın bir hesaba göre hareket etmesi, evrende değişmeyen yasaların işlediğini gösterir.',''],
             ['Çünkü ayet, bir olayın zamanı gelince gerçekleşmesini anlatır.','Bu kazaya yakın bir anlam; ayet ise süregiden, değişmeyen bir düzeni (yasayı) anlatır.'],
             ['Çünkü ayet, insanın gök cisimlerinin hareketini değiştirebileceğini söyler.','Ayet tam tersine, bu düzenin Allah’ın koyduğu bir hesapla işlediğini bildirir.']],
    hayat:{ s:'Bir mühendis köprüyü tasarlarken yer çekimini, rüzgâr yükünü ve malzemenin dayanımını tek tek hesaplıyor.', k:'Mühendisin bu tutumu hangi kavramla en iyi açıklanır?',
      o:[['Sünnetullahı dikkate alarak tedbirli davranmak',''],
         ['Sonucu kabullenmek (teslimiyet)','Teslimiyet sonuç ortaya çıktıktan sonra gösterilir; burada mühendis henüz hesap yapıyor.'],
         ['Kaderi bahane etmek','Mühendis tam tersine, evrendeki yasaları hesaba katarak sorumlu davranıyor.'],
         ['Rıza göstermek','Rıza, gelen sonuçtan hoşnut olmaktır; burada henüz bir sonuç yok.']] } },

  { id:'sura30', tur:'Ayet', kay:'Şûrâ suresi, 30. ayet', m:'Başınıza her ne musibet gelirse, kendi yaptıklarınız yüzündendir. O, yine de çoğunu affeder.',
    k:'Sorumluluk', cel:['Kader','İmtihan','Teslimiyet'], yakin:'Kader', ifade:'kendi yaptıklarınız yüzündendir',
    fark:'Kader her şeyin takdiridir; ama bu ayet başa gelenlerde insanın kendi yaptıklarının payını, yani sorumluluğu vurgular.',
    mesaj:['İnsanın tercih ve ihmalleri başına gelenlerde etkilidir; Allah bunların çoğunu affeder.','Her musibet, kişinin işlediği bir suçun cezasıdır.','Musibetlerde insanın hiçbir payı yoktur.'],
    gerekce:[['Çünkü “kendi yaptıklarınız yüzündendir” ifadesi, insanın tercih ve ihmallerinin sonuç doğurduğunu gösterir.',''],
             ['Çünkü ayet, her musibetin kişinin bir suçunun cezası olduğunu söyler.','Ayetin devamı “yine de çoğunu affeder” der; Hz. Eyyüb örneğinde olduğu gibi her sıkıntı bir kusurun cezası değildir.'],
             ['Çünkü ayet, musibetlerin kaderin dışında gerçekleştiğini söyler.','Musibetler de kader kapsamındadır; ayet kaderi değil, insanın payını öne çıkarır.']],
    hayat:{ s:'Dere yatağına izinsiz yapılan bir ev selde yıkıldı. Ev sahibi “Kaderimiz buymuş, elimizden bir şey gelmezdi.” diyor.', k:'Ayetin mesajına göre en doğru değerlendirme hangisidir?',
      o:[['Afet kader kapsamındadır ama riskli yere ev yapma tercihi sorumluluk doğurur; bundan ders çıkarıp tedbir alınmalıdır.',''],
         ['Selin hiçbir insani sebebi yoktur; tamamen kaderdir.','Yağmur insanın elinde değildir; onu afete dönüştüren ise dere yatağına ev yapma tercihidir.'],
         ['Ev sahibi bu musibeti hak etmiştir.','Başkasının musibetini suçlama aracı yapmak yanlıştır; ayet herkesi kendi payını görmeye çağırır.'],
         ['Tedbir almak kadere aykırı olurdu.','Tedbir de kaderin içindedir; Hz. Ömer’in “Allah’ın kaderinden yine Allah’ın kaderine” sözünü hatırla.']] } },

  { id:'mulk21', tur:'Ayet', kay:'Mülk suresi, 21. ayet', m:'Peki, Allah rızkını keserse, kimdir size rızık verecek olan?…',
    k:'Rızık', cel:['Çaba','Tevekkül','Kader'], yakin:'Çaba', ifade:'kimdir size rızık verecek olan',
    fark:'Rızık, Allah’ın verdiği nimetlerdir; çaba ise insanın o rızkı helal yoldan araması için gösterdiği emektir. Ayet rızkın kaynağını vurgular.',
    mesaj:['Rızkı veren de kesebilen de yalnızca Allah’tır.','Rızık yalnızca insanın kendi emeğiyle kazanılır.','Rızık takdir edildiği için çalışmaya gerek yoktur.'],
    gerekce:[['Çünkü ayet, rızkı verenin ve kesebilenin yalnızca Allah olduğunu hatırlatır.',''],
             ['Çünkü ayet, insanın çalışmasına gerek olmadığını söyler.','Ayet rızkın kaynağını bildirir; çalışma sorumluluğunu kaldırmaz.'],
             ['Çünkü ayet, rızkın yalnızca insanın emeğiyle kazanıldığını söyler.','Ayetin sorusu tam tersini vurgular: Allah kesse, kimse veremez.']],
    hayat:{ s:'Mert, “Rızkım nasılsa yazılmış.” diyerek iş aramayı bıraktı.', k:'Mert’in eksik bıraktığı nedir?',
      o:[['Rızkı veren Allah’tır; ama helal yoldan çalışmak ve sebeplere sarılmak onun görevidir.',''],
         ['Hiçbir şey eksik değil; doğru tevekkül etmiştir.','Tevekkül çalıştıktan sonra gelir; çabayı bırakmak tevekkül değildir.'],
         ['Rızkın Allah’tan geldiğine inanmaması','Mert buna inanıyor; hatası, bu inancı çalışmamaya bahane etmesi.'],
         ['Sabretmemesi','Konu sabır değil; Mert’in eksiği çaba ve tedbirdir.']] } },

  { id:'buyu15', tur:'Hadis', kay:'Hz. Muhammed (sav) — Buhârî, Büyû‘, 15', m:'Hiç kimse elinin emeğinden daha hayırlı bir yemek yememiştir. Allah’ın peygamberi Dâvûd (as) da kendi elinin emeğini yerdi.',
    k:'Çaba', cel:['Rızık','Tevekkül','Rıza'], yakin:'Rızık', ifade:'elinin emeğinden',
    fark:'Rızık Allah’ın verdiği nimetlerdir; bu hadis ise o rızkı insanın kendi emeğiyle kazanmasını, yani çabayı öne çıkarır.',
    mesaj:['En hayırlı kazanç, kişinin kendi emeğiyle elde ettiğidir.','Rızık çalışmadan da gelir; emek gereksizdir.','Peygamberler çalışmazdı.'],
    gerekce:[['Çünkü hadis “elinin emeği” ifadesiyle, kişinin kendi çalışmasıyla kazanmasını över.',''],
             ['Çünkü hadis, rızkın çalışmadan geleceğini anlatır.','Hadis tam tersine emeği över; Hz. Dâvûd da kendi elinin emeğini yerdi.'],
             ['Çünkü hadis, sonucu kabullenip isyan etmemeyi anlatır.','Bu teslimiyet ve rızanın anlamıdır; hadiste öne çıkan emektir.']],
    hayat:{ s:'Ece hafta sonları ailesinin dükkânında çalışıp harçlığını kazanıyor. Arkadaşı “Rızkın zaten yazılı, neden yoruluyorsun?” diyor.', k:'Ece’nin vereceği en uygun cevap hangisidir?',
      o:[['Rızkı veren Allah’tır; ben de onu helal yoldan, emeğimle aramakla sorumluyum.',''],
         ['Haklısın, çalışmayı bırakmalıyım.','Hadis emeği över; rızkın takdiri çabayı gereksiz kılmaz.'],
         ['Rızık sadece benim emeğimle olur; Allah’ın bunda payı yoktur.','Rızkı veren Allah’tır; emek onun sebebidir. İkisi birlikte düşünülür.'],
         ['Çalışırsam kadere karşı gelmiş olurum.','Çalışmak sebeplere uymaktır; kadere aykırı değildir.']] } },

  { id:'bakara155', tur:'Ayet', kay:'Bakara suresi, 155. ayet', m:'Andolsun ki sizi biraz korku ve açlıkla, bir de mallar, canlar ve ürünlerden eksilterek deneriz. Sabredenleri müjdele.',
    k:'Sabır', cel:['Teslimiyet','Rıza','Tevekkül'], yakin:'Teslimiyet', ifade:'Sabredenleri müjdele',
    fark:'Teslimiyet, ortaya çıkan sonucu gönülden kabullenmektir; sabır ise zorluk sürerken Allah’a sığınarak dayanmaktır. Ayet “sabredenleri müjdele” der.',
    mesaj:['Zorluklarla denenen insan sabrederse müjdelenir.','Zorluklar yalnızca günahkârların başına gelir.','Zorluk karşısında hiçbir şey yapmadan beklemek gerekir.'],
    gerekce:[['Çünkü ayet, korku, açlık ve kayıplarla denenen insana “sabredenleri müjdele” diyerek dayanmayı öğütler.',''],
             ['Çünkü ayet, zorluklar gelmeden önce tedbir almayı anlatır.','Tedbir önemlidir ama bu ayette öne çıkan, zorluk geldiğinde gösterilen sabırdır.'],
             ['Çünkü ayet, zorluk karşısında hiçbir şey yapmadan beklemeyi öğütler.','Sabır pasif beklemek değildir; zorluk karşısında Allah’a sığınarak direnmek ve çabayı sürdürmektir.']],
    hayat:{ s:'Ayşe’nin babası işini kaybetti. Ayşe “Artık hiçbir şey düzelmez.” diyerek ümitsizliğe kapıldı.', k:'Ayetin mesajına göre Ayşe’nin tutumunda eksik olan nedir?',
      o:[['Zorluğu bir imtihan olarak görüp sabırla, ümidini kaybetmeden çabalamak',''],
         ['Olanları yalnızca kadere bağlamak','Kaderi anmak yanlış değildir; eksik olan sabır ve ümittir.'],
         ['Daha çok endişelenmek','Endişeyi artırmak çözüm değildir; ayet sabrı öğütler.'],
         ['Zorluğu görmezden gelmek','Sabır zorluğu yok saymak değil, ona Allah’a sığınarak dayanmaktır.']] } },

  { id:'araf34', tur:'Ayet', kay:'A‘râf suresi, 34. ayet', m:'Her milletin belli bir eceli vardır. Onların eceli geldi mi, ne bir an geri kalabilirler, ne de öne geçebilirler.',
    k:'Ecel', cel:['Ömür','Kaza','Kader'], yakin:'Ömür', ifade:'ne bir an geri kalabilirler, ne de öne geçebilirler',
    fark:'Ömür doğumla ölüm arasındaki süredir; ecel bu sürenin sonudur. Ayet “eceli geldi mi” diyerek sürenin sonunu anlatır.',
    mesaj:['Belirlenen sürenin sonu ne öne alınabilir ne de ertelenebilir.','İnsan ömrünü kendi çabasıyla istediği kadar uzatabilir.','Ecel, milletler için değil yalnızca bireyler için geçerlidir.'],
    gerekce:[['Çünkü ayet, belirlenen sürenin sonunun ne öne alınabileceğini ne de geciktirilebileceğini söyler.',''],
             ['Çünkü ayet, insanın ömrünü nasıl değerlendireceğini anlatır.','Bu ömür kavramına yakın; ayet ise sürenin değerlendirilmesini değil, sonunu anlatır.'],
             ['Çünkü ayet, ecelin tedbirle değiştirilebileceğini söyler.','Ayet tam tersine ecelin değişmediğini söyler; tedbir ise ecel bilinmediği için gereklidir.']],
    hayat:{ s:'Bir sürücü, “Ecelim ne zaman gelecekse o zaman gelir.” diyerek emniyet kemeri takmıyor.', k:'Bu düşüncenin hatası nedir?',
      o:[['İnsan ecelini bilmez; kendini tehlikeye atmamak ve tedbir almak onun sorumluluğudur.',''],
         ['Ecelin belli olduğuna inanması','Ecelin belli olduğu doğrudur; hata, bunu tedbirsizliğe bahane etmektir.'],
         ['Kemerin eceli değiştireceğini bilmemesi','Kemer ecel değiştirmek için değil, insanın sorumluluğunu yerine getirmesi için takılır.'],
         ['Trafik cezasından korkmaması','Asıl mesele ceza değil; kendini bile bile tehlikeye atmamaktır (Bakara 195).']] } },

  { id:'insan3', tur:'Ayet', kay:'İnsan suresi, 3. ayet', m:'Şüphesiz biz onu (ömür boyu yürüyeceği) yola koyduk. O bu yolu ya şükrederek ya da nankörlük ederek kat eder.',
    k:'İrade', cel:['Külli irade','Kader','Kaza'], yakin:'Külli irade', ifade:'ya şükrederek ya da nankörlük ederek kat eder',
    fark:'Küllî irade Allah’ın dilediğini gerçekleştirmesidir; cüz’î irade insanın seçme gücüdür. Ayet şükür ya da nankörlüğü insanın seçimine bırakır.',
    mesaj:['Allah insanı bir yola koymuş; o yolu şükürle mi nankörlükle mi yürüyeceğini insana bırakmıştır.','İnsanın hangi yolu seçeceği zorla belirlenmiştir.','İnsan seçimlerinden sorumlu değildir.'],
    gerekce:[['Çünkü “ya şükrederek ya da nankörlük ederek kat eder” ifadesi, yolu nasıl yürüyeceğini seçmenin insana bırakıldığını gösterir.',''],
             ['Çünkü ayet, insanın hangi yolu seçeceğinin zorla belirlendiğini söyler.','Ayet seçimi insana bırakır; Allah’ın bilmesi zorlamak değildir.'],
             ['Çünkü ayet, Allah’ın dilediğini hiçbir zorunluluğa bağlı olmadan gerçekleştirmesini anlatır.','Bu küllî iradenin tanımıdır; ayette öne çıkan ise insanın seçme gücüdür.']],
    hayat:{ s:'Arkadaşı sınavda Berk’ten kopya istedi. Berk, “Benim elimde değil, ne olacaksa o olur.” diyerek kopya verdi.', k:'Berk’in sözündeki yanlış nedir?',
      o:[['Kopya verip vermemek onun iradesindeydi; seçimini kadere yükleyerek sorumluluktan kaçtı.',''],
         ['Arkadaşına yardım etmek istemesi','Yardım etmek güzeldir ama kopya vermek haksızlıktır; asıl sorun seçimini kadere yüklemesi.'],
         ['Kadere inanması','Kadere inanmak doğrudur; hata, kendi tercihini kadere yüklemektir.'],
         ['Sınavın zor olması','Sınavın zorluğu Berk’in seçimini zorunlu kılmaz.']] } },

  { id:'furkan77', tur:'Ayet', kay:'Furkan suresi, 77. ayet', m:'(Ey Muhammed!) De ki: “Duanız olmasa, Rabbim size ne diye değer versin!…”',
    k:'Dua', cel:['Tevekkül','Rıza','Teslimiyet'], yakin:'Tevekkül', ifade:'Duanız olmasa',
    fark:'Tevekkül, tedbirden sonra sonucu Allah’a bırakmaktır; dua ise Allah’a yönelip O’ndan istemektir. Ayet kulun değerini duasına bağlar.',
    mesaj:['Kulun Allah katındaki değeri, O’na yönelip dua etmesiyle ilgilidir.','Dua, çalışmanın yerini tutar.','Allah kullarına hiçbir durumda değer vermez.'],
    gerekce:[['Çünkü ayet, kulun Allah katındaki değerini O’na yönelip dua etmesine bağlar.',''],
             ['Çünkü ayet, sonuç ortaya çıktıktan sonra onu kabullenmeyi anlatır.','Bu teslimiyetin anlamıdır; ayette öne çıkan Allah’a yönelip istemektir.'],
             ['Çünkü ayet, duanın çalışmanın yerini tuttuğunu söyler.','Ayet duanın değerini anlatır; dua çaba ve tedbirle birlikte yapılır.']],
    hayat:{ s:'Kerem sınava hiç çalışmadı ama her gün “Allah’ım, beni geçir.” diye dua etti.', k:'Kerem’in dua anlayışında eksik olan nedir?',
      o:[['Dua, çabanın ve tedbirin yerini tutmaz; çalışmalı, sonra dua edip tevekkül etmeliydi.',''],
         ['Dua etmesi gereksizdi.','Dua değerlidir; eksik olan çabadır.'],
         ['Daha uzun dua etmeliydi.','Sorun duanın uzunluğu değil; çalışmamasıdır.'],
         ['Sonucu kabullenmemesi','Henüz sonuç ortaya çıkmadı; eksik olan çabadır.']] } },

  { id:'daavat1', tur:'Hadis', kay:'Hz. Muhammed (sav) — Tirmizî, Daavât, 1', m:'Dua ibadetin ta kendisidir.',
    k:'Dua', cel:['Tevekkül','Rıza','İmtihan'], yakin:'Tevekkül', ifade:'ibadetin ta kendisidir',
    fark:'Tevekkül, sonucu Allah’a bırakmaktır; dua ise kulun Allah’a yönelip O’ndan istemesidir. Hadis duayı ibadetin özü olarak tanımlar.',
    mesaj:['Dua, kulun Allah’a yönelişinin ve ibadetin özüdür.','Dua yalnızca zor zamanlarda yapılır.','İbadet yalnızca duadan ibarettir.'],
    gerekce:[['Çünkü hadis, duayı ibadetin özü olarak tanımlar; dua kulun Allah’a yönelişidir.',''],
             ['Çünkü hadis, duanın yalnızca zor zamanlarda yapılacağını söyler.','Hadiste böyle bir sınır yok; dua her durumda yapılabilir.'],
             ['Çünkü hadis, ibadetin yalnızca duadan ibaret olduğunu söyler.','Hadis duanın önemini vurgular; diğer ibadetleri gereksiz kılmaz.']],
    hayat:{ s:'Selin, yalnızca başı sıkıştığında dua ettiğini fark etti.', k:'Hadisin mesajına göre Selin ne yapabilir?',
      o:[['Duayı sevinçte de sıkıntıda da Allah’la bağını güçlendiren bir ibadet olarak sürdürmek',''],
         ['Dua etmeyi tamamen bırakmak','Hadis duanın ibadetin özü olduğunu söyler; bırakmak çözüm değildir.'],
         ['Yalnızca büyük sorunlarda dua etmek','Bu Selin’in zaten yaptığı şey; hadis duayı her duruma yayar.'],
         ['Dua yerine yalnızca çalışmak','Çalışmak gereklidir ama duanın yerini tutmaz; ikisi birlikte olur.']] } },

  { id:'ahzab3', tur:'Ayet', kay:'Ahzâb suresi, 3. ayet', m:'Allah’a tevekkül et, vekil olarak Allah yeter.',
    k:'Tevekkül', cel:['Teslimiyet','Rıza','Tedbir'], yakin:'Teslimiyet', ifade:'Allah’a tevekkül et',
    fark:'Tevekkül, sonuç ortaya çıkmadan, tedbirden sonra Allah’a güvenmektir; teslimiyet ise sonuç ortaya çıktıktan sonra onu gönülden kabullenmektir.',
    mesaj:['Allah’a güvenip dayanmak için O yeterlidir.','Allah’a güvenen kişinin tedbir almasına gerek yoktur.','Güven yalnızca sonuç ortaya çıktıktan sonra gösterilir.'],
    gerekce:[['Çünkü ayet “Allah’a tevekkül et, vekil olarak Allah yeter” diyerek Allah’a dayanıp güvenmeyi emreder.',''],
             ['Çünkü ayet, tedbir almadan sonucu beklemeyi öğütler.','Tevekkül tedbirsizlik değildir: “Önce deveni bağla, sonra tevekkül et.”'],
             ['Çünkü ayet, sonuç ortaya çıktıktan sonra onu kabullenmeyi anlatır.','Bu teslimiyettir; tevekkül sonuçtan önceki güvendir.']],
    hayat:{ s:'Bir öğrenci sınava düzenli hazırlandı, eksiklerini tamamladı. Sonucu beklerken “Elimden geleni yaptım, sonucu Allah’a bırakıyorum.” diyor.', k:'Bu durumda hangi kavram doğru anlaşılmıştır?',
      o:[['Tevekkül: Önce tedbir ve çaba, sonra sonucu Allah’a bırakmak',''],
         ['Teslimiyet: Sonucu kabullenmek','Teslimiyet sonuç açıklandıktan sonra gösterilir; burada sonuç henüz yok.'],
         ['Kader: Çalışmanın gereksiz olması','Öğrenci çalışmış; kaderi bahane etmiyor.'],
         ['Rıza: Gelen sonuçtan hoşnut olmak','Henüz gelen bir sonuç yok; burada sonuçtan önceki güven, yani tevekkül var.']] } },

  { id:'deve', tur:'Hadis', kay:'Hz. Muhammed (sav) — Tirmizî, Sıfatü’l-kıyâme, 60', m:'Bir adam, “Ey Allah’ın Resulü! Devemi bağlayıp mı tevekkül edeyim, yoksa salıverip mi tevekkül edeyim?” diye sordu. Hz. Peygamber, “Onu bağla ve tevekkül et.” buyurdu.',
    k:'Tedbir', cel:['Tevekkül','Teslimiyet','Kader'], yakin:'Tevekkül', ifade:'Onu bağla',
    fark:'Tedbir insanın alması gereken önlemdir; tevekkül tedbirden sonra Allah’a güvenmektir. Hadis önce bağlamayı, yani tedbiri vurgular ve ikisini birlikte ister.',
    mesaj:['Allah’a güvenmeden önce gerekli önlem alınmalıdır; tedbir ve tevekkül birlikte olur.','Allah’a güvenen kişi önlem almaz.','Tedbir alan kişinin Allah’a güvenmesine gerek yoktur.'],
    gerekce:[['Çünkü “onu bağla” ifadesi, Allah’a güvenmeden önce gerekli önlemin alınmasını ister.',''],
             ['Çünkü hadis, deveyi salıverip yalnızca Allah’a güvenmeyi öğütler.','Hz. Peygamber tam tersini söyler: “Onu bağla.”'],
             ['Çünkü hadis, tedbirin tevekkülün yerini tuttuğunu söyler.','Hadis ikisini birlikte ister: bağla VE tevekkül et.']],
    hayat:{ s:'Can bisikletini kilitlemeden markete girdi ve “Allah korur.” dedi.', k:'Can’ın davranışında eksik olan nedir?',
      o:[['Tedbir: Önce bisikleti kilitlemeli, sonra Allah’a güvenmeliydi.',''],
         ['Dua','Can Allah’a güvendiğini söylüyor; eksik olan önlemdir.'],
         ['Teslimiyet','Teslimiyet sonuç ortaya çıktıktan sonra gösterilir; burada eksik olan önceki adım.'],
         ['Sabır','Konu sabır değil; deveyi bağlamak gibi bir önlem almamasıdır.']] } },

  { id:'omer', tur:'Hadis', kay:'Hz. Ömer’in sözü — Buhârî, Tıb, 30; Müslim, Selâm, 98', m:'Veba salgını olan bir bölgeye girmekten vazgeçen Hz. Ömer’e “Allah’ın kaderinden mi kaçıyorsun?” denildi. O, “Evet, Allah’ın kaderinden yine Allah’ın kaderine kaçıyoruz.” cevabını verdi.',
    k:'Tedbir', cel:['Kader','Teslimiyet','Kaza'], yakin:'Kader', ifade:'Allah’ın kaderinden yine Allah’ın kaderine',
    fark:'Kader her şeyin takdiridir; tedbir ise sebeplere uymaktır. Hz. Ömer’e göre tehlikeden korunmak da kaderin içindedir.',
    mesaj:['Tehlikeden korunmak kadere karşı gelmek değildir; tedbir de kaderin içindedir.','İnsan kaderden kaçabilir.','Salgın bölgesine girmek tevekküldür.'],
    gerekce:[['Çünkü Hz. Ömer, salgından korunmayı kadere karşı gelmek değil, Allah’ın koyduğu sebeplere uymak olarak görür.',''],
             ['Çünkü Hz. Ömer, kaderden kaçılabileceğini söyler.','Hz. Ömer kaderden kaçmayı değil, bir takdirden diğer takdire yönelmeyi anlatır; ikisi de kaderin içindedir.'],
             ['Çünkü Hz. Ömer, tehlikeye girmenin tevekkül olduğunu söyler.','Tam tersi: Kendini tehlikeye atmak tevekkül değildir.']],
    hayat:{ s:'Salgın döneminde bir kişi, “Hastalanacaksam hastalanırım.” diyerek hiçbir hijyen kuralına uymuyor.', k:'Hz. Ömer’in sözüne göre bu düşüncenin hatası nedir?',
      o:[['Korunmak için tedbir almak da kaderin içindedir; tedbiri terk etmek teslimiyet değil, sorumsuzluktur.',''],
         ['Hastalığın kader olduğuna inanması','Bu doğrudur; hata, bunu tedbirsizliğe bahane etmesi.'],
         ['Hijyen kurallarının gereksiz olduğunu bilmemesi','Hijyen kuralları gereklidir; Hz. Ömer de tehlikeden korunmuştur.'],
         ['Hastalanmaktan korkmaması','Mesele korku değil; sebeplere uyup uymamaktır.']] } },

  { id:'bakara286', tur:'Ayet', kay:'Bakara suresi, 286. ayet', m:'Allah, bir kimseyi ancak gücünün yettiği şeyle yükümlü kılar. Onun kazandığı iyilik kendi yararına, kötülük de kendi zararınadır…',
    k:'Sorumluluk', cel:['İrade','Kader','Teslimiyet'], yakin:'İrade', ifade:'ancak gücünün yettiği şeyle yükümlü kılar',
    fark:'İrade seçme gücüdür; sorumluluk ise bu seçimin hesabını vermektir. Ayet sorumluluğun güç ölçüsünde olduğunu söyler.',
    mesaj:['Herkes gücü ölçüsünde sorumludur ve kendi kazandığının karşılığını görür.','İnsan gücünü aşan şeylerden de sorumludur.','Kimse yaptıklarından sorumlu tutulmaz.'],
    gerekce:[['Çünkü ayet, yükümlülüğün güç ölçüsünde olduğunu ve herkesin kendi kazandığının karşılığını göreceğini söyler.',''],
             ['Çünkü ayet, insanın gücünü aşan şeylerden de sorumlu olduğunu söyler.','Ayet tam tersini söyler: “ancak gücünün yettiği şeyle”.'],
             ['Çünkü ayet, insanın seçenekler arasında tercih yapma gücünü tanımlar.','Bu iradenin tanımıdır; ayette öne çıkan, tercihin hesabı ve sınırıdır.']],
    hayat:{ s:'Sınav günü ateşlenen Can elinden geleni yaptı ama düşük aldı. “Hiç çalışmasaydım da aynı olurdu.” diyor.', k:'Ayetin mesajına göre Can’a ne söylenebilir?',
      o:[['Gücünün yetmediği şeyden (hastalık) sorumlu değilsin; sorumluluğun gösterdiğin çabaya göredir ve emeğin boşa gitmedi.',''],
         ['Haklısın, çalışmanın anlamı yok.','Ayet herkesin kazandığının karşılığını göreceğini söyler; çaba boşa gitmez.'],
         ['Hastalandığın için suçlusun.','Hastalık Can’ın elinde değildi; ayet gücün yetmediği şeyden sorumlu tutulmayacağını söyler.'],
         ['Sonuç her zaman çabayı gösterir.','Sonuç birçok sebebe bağlıdır; çaba sebebidir ama garantisi değildir.']] } },

  { id:'necm39', tur:'Ayet', kay:'Necm suresi, 39-40. ayetler', m:'İnsan için ancak çalıştığı vardır. Şüphesiz onun çalışması ileride görülecektir.',
    k:'Çaba', cel:['Tevekkül','Rızık','Teslimiyet'], yakin:'Tevekkül', ifade:'ancak çalıştığı vardır',
    fark:'Çaba, insanın emek harcamasıdır; tevekkül ise çabadan sonra sonucu Allah’a bırakmaktır. Ayet sonucu değil, “çalışma”yı vurgular.',
    mesaj:['İnsanın asıl sahip olduğu emeğidir ve çalışması karşılıksız kalmaz.','Çalışan herkes mutlaka istediği sonuca ulaşır.','Sonuç tamamen insanın elindedir.'],
    gerekce:[['Çünkü ayet “başarı” değil “çalışma” kelimesini kullanır; insanın asıl sahip olduğu şeyin emeği olduğunu söyler.',''],
             ['Çünkü ayet, çalışan herkesin mutlaka istediği sonuca ulaşacağını garanti eder.','Çaba sonucun sebebidir ama garantisi değildir; ayet çalışmanın karşılıksız kalmayacağını söyler.'],
             ['Çünkü ayet, tedbirden sonra sonucu Allah’a bırakmayı anlatır.','Bu tevekküldür; ayette öne çıkan çalışmanın kendisidir.']],
    hayat:{ s:'Deniz bir yıl düzenli çalıştı ama hedeflediği bölümü kazanamadı ve “Emeklerim boşa gitti.” dedi.', k:'Ayete göre bu düşünce neden yanlıştır?',
      o:[['Çalışma karşılıksız kalmaz; kazandığı bilgi, disiplin ve emeğin karşılığı onunladır.',''],
         ['Deniz yeterince çalışmamıştır.','Sonuçtan geriye doğru çabayı yargılamak doğru değildir; sonuç birçok sebebe bağlıdır.'],
         ['Çalışmak sonucu garanti eder.','Çaba sonucun garantisi değildir; ama karşılıksız da kalmaz.'],
         ['Sonuç kaderdir, çalışmak gereksizdir.','Ayet tam tersine çalışmayı insanın asıl sahip olduğu şey olarak gösterir.']] } },

  { id:'rad11', tur:'Ayet', kay:'Ra‘d suresi, 11. ayet', m:'…Şüphesiz ki, bir kavim kendi durumunu değiştirmedikçe Allah onların durumunu değiştirmez…',
    k:'İrade', cel:['Kader','Teslimiyet','Kaza'], yakin:'Kader', ifade:'kendi durumunu değiştirmedikçe',
    fark:'Kader Allah’ın takdiridir; bu ayet ise değişimin insanın kendi iradesiyle başladığını vurgular.',
    mesaj:['Değişim, insanın kendi iradesiyle ve tercihiyle başlar.','İnsan hiçbir şeyi değiştiremez.','Değişim için yalnızca beklemek gerekir.'],
    gerekce:[['Çünkü ayet, değişimin önce insanın kendi tercihiyle başlaması gerektiğini söyler.',''],
             ['Çünkü ayet, insanın hiçbir şeyi değiştiremeyeceğini söyler.','Ayet tam tersini söyler: Değişim insanın kendi durumunu değiştirmesiyle başlar.'],
             ['Çünkü ayet, sonucu gönülden kabullenmeyi öğütler.','Bu teslimiyettir; ayette öne çıkan insanın harekete geçmesidir.']],
    hayat:{ s:'Elif, “Ben zaten matematikte kötüyüm, kaderim bu.” diyerek çalışmayı bıraktı.', k:'Ayetin mesajına göre Elif ne yapmalı?',
      o:[['Değişimi kendisi başlatmalı: yeni bir çalışma planı yapıp öğretmeninden destek istemeli.',''],
         ['Kaderine razı olup bırakmalı.','Kaderi geleceğe dair değişmez bir hüküm gibi görmek yanlış kader anlayışıdır.'],
         ['Başkasının onu değiştirmesini beklemeli.','Ayet değişimin insanın kendisiyle başladığını söyler.'],
         ['Matematiği önemsememeli.','Sorun dersin önemi değil; Elif’in iradesini kullanmamasıdır.']] } },

  { id:'aliimran159', tur:'Ayet', kay:'Âl-i İmrân suresi, 159. ayet', m:'…İş konusunda onlarla müşavere et. Bir kere de karar verip azmettin mi, artık Allah’a tevekkül et, (ona dayanıp güven). Şüphesiz Allah, tevekkül edenleri sever.',
    k:'Tevekkül', cel:['Teslimiyet','Tedbir','Rıza'], yakin:'Tedbir', ifade:'karar verip azmettin mi, artık Allah’a tevekkül et',
    fark:'Tedbir, danışmak ve hazırlanmak gibi insanın üzerine düşen adımlardır; tevekkül bu adımlardan sonra Allah’a güvenmektir. Ayet sırayı verir: müşavere (istişare) → karar → tevekkül.',
    mesaj:['Danışıp karar verdikten sonra Allah’a güvenilir.','Karar vermeden önce sonuç Allah’a bırakılır, danışmaya gerek yoktur.','Danışmak tevekküle aykırıdır.'],
    gerekce:[['Çünkü ayet, danışıp karar verdikten sonra, yani akıl ve iradeyi kullandıktan sonra Allah’a güvenmeyi ister.',''],
             ['Çünkü ayet, karar vermeden önce sonucu Allah’a bırakmayı söyler.','Ayetteki sıra tersidir: önce istişare ve karar, sonra tevekkül.'],
             ['Çünkü ayet, sonuç ortaya çıktıktan sonra onu kabullenmeyi anlatır.','Bu teslimiyettir; ayet kararın hemen ardından gelen güveni anlatır.']],
    hayat:{ s:'Zeynep meslek seçerken hiç araştırmadan “Allah neyi uygun görürse o olur.” dedi ve rastgele bir bölüm yazdı.', k:'Ayetteki sıralamaya göre Zeynep’in eksiği nedir?',
      o:[['Önce araştırıp danışmalı, sonra karar vermeli; tevekkül bu adımlardan sonra gelir.',''],
         ['Dua etmemesi','Dua değerlidir ama ayetteki eksik adım istişare ve karardır.'],
         ['Sonuçtan memnun olmaması','Henüz sonuç yok; eksik olan karar öncesi adımlar.'],
         ['Hiçbir şey eksik değil.','Araştırmadan ve danışmadan “tevekkül” etmek, ayetteki sırayı atlamaktır.']] } },

  { id:'enbiya35', tur:'Ayet', kay:'Enbiyâ suresi, 35. ayet', m:'Her nefis ölümü tadacaktır. Sizi bir imtihan olarak hayır ile de şer ile de deniyoruz. Ancak bize döndürüleceksiniz.',
    k:'İmtihan', cel:['Sabır','Ecel','Kader'], yakin:'Sabır', ifade:'hayır ile de şer ile de deniyoruz',
    fark:'Sabır zorluğa dayanmaktır; imtihan ise hem nimetle hem zorlukla sınanmaktır. Ayet “hayır ile de şer ile de deniyoruz” der.',
    mesaj:['İnsan hem nimetlerle hem de zorluklarla sınanır.','İnsan yalnızca zorluklarla sınanır.','Nimetlerin bir sınavı yoktur.'],
    gerekce:[['Çünkü ayet, insanın hem iyilik (nimet) hem de kötülük (zorluk) ile sınandığını söyler.',''],
             ['Çünkü ayet, insanın yalnızca zorluklarla sınandığını söyler.','Ayette “hayır ile de” ifadesi var; nimetler de sınavdır.'],
             ['Çünkü ayet, ölümün zamanının değişmediğini anlatır.','Ayet ölümü hatırlatır ama asıl vurgusu sınanmadır.']],
    hayat:{ s:'Kerem bir yarışmada birinci oldu ve “Bu başarı tamamen benim eserim.” diyerek kibirlendi.', k:'Ayetin mesajına göre Kerem neyi gözden kaçırıyor?',
      o:[['Başarı ve nimet de bir imtihandır; şükür ve tevazuyla karşılanmalıdır.',''],
         ['Çalışmanın gereksiz olduğunu','Kerem’in çabası değerlidir; gözden kaçırdığı, başarının da bir sınav olmasıdır.'],
         ['Başarının tesadüf olduğunu','Başarı tesadüf değildir; ama bir nimettir ve sınavdır.'],
         ['Yalnızca zorlukların imtihan olduğunu','Bu zaten yanlış bir düşünce; ayet nimetlerin de imtihan olduğunu söyler.']] } },

  { id:'beyyine', tur:'Ayet', kay:'Beyyine suresi, 8. ayet', m:'…Allah onlardan razı olmuştur, onlar da Allah’tan razı olmuşlardır…',
    k:'Rıza', cel:['Teslimiyet','Tevekkül','Sabır'], yakin:'Teslimiyet', ifade:'razı olmuşlardır',
    fark:'Teslimiyet sonuca boyun eğmektir; rıza ise ondan gönülden hoşnut olmaktır. Ayet “razı olmuşlardır” diyerek karşılıklı hoşnutluğu anlatır.',
    mesaj:['Allah ile kul arasında karşılıklı bir hoşnutluk vardır.','Kul, Allah’tan gelen her şeye isyan etmelidir.','Hoşnutluk yalnızca dünyadaki başarıyla ilgilidir.'],
    gerekce:[['Çünkü ayet, Allah ile kul arasındaki karşılıklı hoşnutluğu (razı olmayı) anlatır.',''],
             ['Çünkü ayet, sonuç gelmeden önce Allah’a güvenmeyi anlatır.','Bu tevekküldür; ayette öne çıkan hoşnutluktur.'],
             ['Çünkü ayet, zorluklara karşı dayanmayı anlatır.','Bu sabırdır; ayet hoşnut olmayı anlatır.']],
    hayat:{ s:'Ali istediği okula yerleşemedi. “Elimden geleni yaptım, Rabbimin takdirinden razıyım.” diyerek yeni okulunda çalışmaya başladı.', k:'Ali’nin tutumunda hangi kavramlar doğru anlaşılmıştır?',
      o:[['Rıza ve teslimiyet: Sonucu gönülden kabullenip yeniden çabalamak',''],
         ['Tevekkül: Sonuç gelmeden önce güvenmek','Sonuç zaten ortaya çıktı; Ali’nin tutumu sonuçtan sonraki hoşnutluktur.'],
         ['Kaderi bahane etmek','Ali çabasını sürdürüyor; kaderi bahane etmiyor.'],
         ['Sabırsızlık','Ali isyan etmiyor; tam tersine razı oluyor.']] } },

  { id:'hakim', tur:'Hadis', kay:'Hz. Muhammed (sav) — Hâkim, Müstedrek, IV, 341', m:'Beş şey gelmeden önce beş şeyin değerini iyi bil: ihtiyarlığından önce gençliğinin, hastalığından önce sağlığının, yokluğundan önce varlığının, meşguliyetinden önce boş vaktinin ve ölümünden önce hayatının.',
    k:'Ömür', cel:['Ecel','İmtihan','Rızık'], yakin:'Ecel', ifade:'ölümünden önce hayatının',
    fark:'Ömür yaşanan süredir; ecel bu sürenin sonudur. Hadis sürenin sonunu değil, süreyi değerlendirmeyi öğütler.',
    mesaj:['Gençlik, sağlık ve hayat gibi nimetler geçicidir; vakit varken değerlendirilmelidir.','Ölümün zamanı bildirilmiştir.','Zenginlik her şeyden önemlidir.'],
    gerekce:[['Çünkü hadis, gençlik, sağlık ve hayat gibi nimetlerin geçici olduğunu ve vakit varken değerlendirilmesi gerektiğini söyler.',''],
             ['Çünkü hadis, ölümün ne zaman geleceğini bildirir.','Hadis ecelin zamanını bildirmez; yaşanan süreyi değerlendirmeyi öğütler.'],
             ['Çünkü hadis, zenginliğin her şeyden önemli olduğunu söyler.','Varlık da sayılan beş nimetten biridir; hadisin özü ömrü değerlendirmektir.']],
    hayat:{ s:'Burak, “Daha gencim, sağlığım yerinde; sorumluluklarımı sonra düşünürüm.” diyerek her şeyi erteliyor.', k:'Hadise göre Burak’ın hatası nedir?',
      o:[['Gençlik ve sağlık geçicidir; ömrü değerlendirmeyi ertelememelidir.',''],
         ['Genç olduğunu düşünmesi','Gençliği bir gerçek; hata onu ertelemenin gerekçesi yapması.'],
         ['Sağlığına dikkat etmesi','Sağlığa dikkat güzeldir; hadis sağlığın değerini bilmeyi öğütler.'],
         ['Hiçbir hata yok.','Hadis tam olarak bu ertelemeye karşı uyarır.']] } }
];
/* ---------- Ek 30 metin (toplam 50) ----------
   Ayet mealleri Diyanet İşleri Başkanlığı mealinden (acikkuran.com ile karşılaştırıldı);
   hadis künyeleri doğrulandı. Bu metinler kader-ayet-hadis-kavram.html sayfasıyla aynıdır.
   Ek metinlerde yalnızca kavram aşaması ve gerekçe (Neden?) aşaması vardır. */
H = H.concat([
  { id:'furkan2', tur:'Ayet', kay:'Furkan suresi, 2. ayet', m:'…O, her şeyi yaratmış ve yarattığı o şeyleri bir ölçüye göre takdir etmiştir.',
    k:'Kader', kabul:[], ifade:'bir ölçüye göre takdir etmiştir',
    gerekce:[['Çünkü “bir ölçüye göre takdir etmiştir” ifadesi, Allah’ın her şeyi ölçü ve plan dâhilinde belirlediğini anlatır.',''],
             ['Çünkü ayet, takdir edilen şeyin zamanı gelince gerçekleştiğini anlatır.','Bu kazanın anlamıdır; ayet gerçekleşmeyi değil, ölçüyle takdir etmeyi anlatır.'],
             ['Çünkü ayet, insanın her şeyin ölçüsünü kendisinin belirlediğini söyler.','Ayette takdir eden Allah’tır; insanın ölçüyü belirlemesinden söz edilmez.']] },
  { id:'hicr21', tur:'Ayet', kay:'Hicr suresi, 21. ayet', m:'Hiçbir şey yoktur ki hazineleri yanımızda olmasın. Biz onu ancak belli bir ölçüyle indiririz.',
    k:'Kader', kabul:['Rızık'], ifade:'belli bir ölçüyle indiririz',
    gerekce:[['Çünkü her şeyin Allah katında belli bir ölçüyle takdir edilip indirildiği bildirilir.',''],
             ['Çünkü ayet, her şeyin tesadüfen ve ölçüsüz geldiğini söyler.','Ayet tam tersine “belli bir ölçüyle” der.'],
             ['Çünkü ayet, insanın istediği kadar nimet elde edebileceğini söyler.','Ayette ölçüyü belirleyen Allah’tır; insanın sınırsız elde etmesinden söz edilmez.']] },
  { id:'hadid22', tur:'Ayet', kay:'Hadîd suresi, 22. ayet', m:'Yeryüzünde ve kendi nefislerinizde uğradığınız hiçbir musibet yoktur ki, biz onu yaratmadan önce, bir kitapta (Levh-i Mahfuz’da) yazılmış olmasın. Şüphesiz bu, Allah’a göre kolaydır.',
    k:'Kader', kabul:['İmtihan'], ifade:'biz onu yaratmadan önce, bir kitapta (Levh-i Mahfuz’da) yazılmış olmasın',
    gerekce:[['Çünkü musibetlerin yaratılmadan önce yazılmış olması, olacakların önceden bilinip takdir edildiğini gösterir.',''],
             ['Çünkü ayet, musibetlerin yalnızca insanın hatalarından doğduğunu söyler.','Ayet musibetlerin önceden yazıldığını anlatır; insanın payı başka ayetlerde vurgulanır (Şûrâ 30).'],
             ['Çünkü ayet, musibetten sonra hiçbir şey yapmadan beklemeyi öğütler.','Ayet bir tutum öğütlemiyor; olayların önceden takdir edildiğini bildiriyor.']] },
  { id:'tevbe51', tur:'Ayet', kay:'Tevbe suresi, 51. ayet', m:'De ki: “Bizim başımıza ancak, Allah’ın bizim için yazdığı şeyler gelir. O, bizim yardımcımızdır. Öyleyse mü’minler, yalnız Allah’a güvensinler.”',
    k:'Kader', kabul:['Tevekkül'], ifade:'Allah’ın bizim için yazdığı şeyler gelir',
    gerekce:[['Çünkü “Allah’ın bizim için yazdığı şeyler” ifadesi, başa gelenlerin Allah’ın takdiri olduğunu anlatır.',''],
             ['Çünkü ayet, başa gelenlerde insanın hiçbir sorumluluğu olmadığını söyler.','Ayet takdiri bildirir; insanın tercihlerinden sorumlu olduğunu ortadan kaldırmaz.'],
             ['Çünkü ayet, Allah’ın her şeyin yaratıcısı olduğunu söyler.','Bu doğru bir bilgi ama ayetteki anahtar ifade “yazdığı şeyler”, yani takdirdir.']] },
  { id:'kader34', tur:'Hadis', kay:'Hz. Muhammed (sav) — Müslim, Kader, 34', m:'Kuvvetli mümin, zayıf müminden daha hayırlı ve sevimlidir… Sana fayda verecek şeye sarıl, Allah’tan yardım dile ve acze düşme. Başına bir şey gelirse “Şöyle yapsaydım böyle olurdu.” deme; “Allah takdir etti, dilediğini yaptı.” de.',
    k:'Teslimiyet', kabul:['Kader','Tedbir','Tevekkül','Çaba'], ifade:'“Allah takdir etti, dilediğini yaptı.” de',
    gerekce:[['Çünkü hadis, sonuç ortaya çıktıktan sonra hayıflanmadan “Allah takdir etti” demeyi, yani takdire gönülden boyun eğmeyi öğütler.',''],
             ['Çünkü hadis, hiçbir şey yapmadan sonucu beklemeyi öğütler.','Hadis tam tersine “fayda verecek şeye sarıl, acze düşme” der; teslimiyet çabadan sonradır.'],
             ['Çünkü hadis, başa gelenleri değiştirmek için geçmişe dönüp hayıflanmayı öğütler.','Hadis “Şöyle yapsaydım…” demeyi yasaklar.']] },
  { id:'bakara117', tur:'Ayet', kay:'Bakara suresi, 117. ayet', m:'O, gökleri ve yeri örneksiz yaratandır. Bir işe hükmetti mi ona sadece “ol” der, o da hemen oluverir.',
    k:'Kaza', kabul:['Kader','Külli irade'], ifade:'Bir işe hükmetti mi ona sadece “ol” der, o da hemen oluverir',
    gerekce:[['Çünkü Allah’ın bir işe hükmetmesi ve onun hemen gerçekleşmesi, kazanın (hüküm ve gerçekleşme) anlamıdır.',''],
             ['Çünkü ayet, insanın bir işe karar verince onun hemen gerçekleştiğini söyler.','Ayette hükmeden Allah’tır, insan değil.'],
             ['Çünkü ayet, olayların bir ölçüye göre planlanmasını anlatır.','Bu kaderin anlamına yakındır; ayetteki vurgu hükmün gerçekleşmesidir.']] },
  { id:'ahzab38', tur:'Ayet', kay:'Ahzâb suresi, 38. ayet', m:'…Daha önce gelip geçen peygamberler hakkında da Allah’ın kanunu böyledir. Allah’ın emri, kesinleşmiş bir hükümdür.',
    k:'Kaza', kabul:['Kader','Sünnetullah'], ifade:'Allah’ın emri, kesinleşmiş bir hükümdür',
    gerekce:[['Çünkü “kesinleşmiş bir hüküm” ifadesi, takdirin hükme bağlanıp gerçekleşmesini anlatır.',''],
             ['Çünkü ayet, Allah’ın emrinin değişebileceğini söyler.','Ayet tam tersine emrin “kesinleşmiş” olduğunu söyler.'],
             ['Çünkü ayet, insanın emri yerine getirip getirmemekte özgür olduğunu anlatır.','Bu iradeyle ilgili bir konu; ayetteki vurgu hükmün kesinliğidir.']] },
  { id:'ahzab62', tur:'Ayet', kay:'Ahzâb suresi, 62. ayet', m:'Daha önce gelip geçenler hakkında da Allah’ın kanunu böyledir. Allah’ın kanununda asla değişme bulamazsın.',
    k:'Sünnetullah', kabul:[], ifade:'Allah’ın kanununda asla değişme bulamazsın',
    gerekce:[['Çünkü “Allah’ın kanunu” sünnetullahın kelime anlamıdır ve ayet onun değişmezliğini vurgular.',''],
             ['Çünkü ayet, kanunların zamanla değiştiğini söyler.','Ayet “asla değişme bulamazsın” der.'],
             ['Çünkü ayet, yalnızca peygamberlerin hayatındaki olayları anlatır.','Ayet geçmiş toplumları örnek verir ama asıl vurgusu Allah’ın değişmeyen yasasıdır.']] },
  { id:'rum41', tur:'Ayet', kay:'Rûm suresi, 41. ayet', m:'İnsanların kendi işledikleri (kötülükler) sebebiyle karada ve denizde bozulma ortaya çıkmıştır…',
    k:'Sorumluluk', kabul:['İrade'], ifade:'kendi işledikleri (kötülükler) sebebiyle',
    gerekce:[['Çünkü bozulmanın insanların “kendi işledikleri” yüzünden ortaya çıktığı bildirilir; insan yaptıklarının sonucundan sorumludur.',''],
             ['Çünkü ayet, doğadaki bozulmanın insanla hiçbir ilgisi olmadığını söyler.','Ayet tam tersine bozulmayı insanların yaptıklarına bağlar.'],
             ['Çünkü ayet, doğadaki değişmeyen yasaları anlatır.','Ayetteki vurgu yasa değil, insanın yaptıklarının sonucudur.']] },
  { id:'hud6', tur:'Ayet', kay:'Hûd suresi, 6. ayet', m:'Yeryüzünde hiçbir canlı yoktur ki, rızkı Allah’a ait olmasın…',
    k:'Rızık', kabul:['Kader'], ifade:'rızkı Allah’a ait olmasın',
    gerekce:[['Çünkü ayet, yeryüzündeki her canlının rızkının Allah’a ait olduğunu bildirir.',''],
             ['Çünkü ayet, canlıların rızkı kendi güçleriyle kazandığını söyler.','Ayet rızkın Allah’a ait olduğunu söyler.'],
             ['Çünkü ayet, insanın çalışmaya ihtiyacı olmadığını söyler.','Ayet rızkın kaynağını bildirir; çalışma sorumluluğunu kaldırmaz.']] },
  { id:'zariyat58', tur:'Ayet', kay:'Zâriyât suresi, 58. ayet', m:'Şüphesiz Allah rızık verendir, güçlüdür, çok kuvvetlidir.',
    k:'Rızık', kabul:[], ifade:'Allah rızık verendir',
    gerekce:[['Çünkü ayet, Allah’ın “rızık veren” (Rezzak) olduğunu bildirir.',''],
             ['Çünkü ayet, yalnızca Allah’ın gücünü anlatır; rızıkla ilgisi yoktur.','Ayetin ilk ifadesi “rızık verendir”; güç sıfatları bunu pekiştirir.'],
             ['Çünkü ayet, rızkın ancak çalışarak kazanılacağını söyler.','Ayette çalışmadan söz edilmez; rızkı verenin Allah olduğu bildirilir.']] },
  { id:'cuma10', tur:'Ayet', kay:'Cuma suresi, 10. ayet', m:'Namaz kılınınca artık yeryüzüne dağılın ve Allah’ın lütfundan nasibinizi arayın…',
    k:'Çaba', kabul:['Rızık'], ifade:'yeryüzüne dağılın ve Allah’ın lütfundan nasibinizi arayın',
    gerekce:[['Çünkü ayet, namazdan sonra yeryüzüne dağılıp rızkı çalışarak aramayı emreder.',''],
             ['Çünkü ayet, ibadetten sonra çalışmaya gerek olmadığını söyler.','Ayet tam tersine “nasibinizi arayın” der.'],
             ['Çünkü ayet, rızkın kendiliğinden geleceğini söyler.','Ayet rızkı aramayı, yani çabayı emreder.']] },
  { id:'bakara153', tur:'Ayet', kay:'Bakara suresi, 153. ayet', m:'Ey iman edenler! Sabrederek ve namaz kılarak Allah’tan yardım dileyin. Şüphe yok ki, Allah sabredenlerle beraberdir.',
    k:'Sabır', kabul:['Dua'], ifade:'Allah sabredenlerle beraberdir',
    gerekce:[['Çünkü ayet, zorlukta sabrederek Allah’tan yardım dilemeyi öğütler ve Allah’ın sabredenlerle beraber olduğunu bildirir.',''],
             ['Çünkü ayet, zorluklara karşı hiçbir şey yapmadan beklemeyi öğütler.','Sabır pasif beklemek değildir; ayet sabırla birlikte namaz ve yardım dilemeyi ister.'],
             ['Çünkü ayet, sonucu ortaya çıktıktan sonra kabullenmeyi anlatır.','Bu teslimiyete yakın; ayetteki anahtar kelime “sabır”dır.']] },
  { id:'zumer10', tur:'Ayet', kay:'Zümer suresi, 10. ayet', m:'…Sabredenlere mükâfatları elbette hesapsız olarak verilir.',
    k:'Sabır', kabul:[], ifade:'Sabredenlere mükâfatları elbette hesapsız olarak verilir',
    gerekce:[['Çünkü ayet, sabredenlerin ödülünün hesapsız olduğunu bildirir.',''],
             ['Çünkü ayet, mükâfatın yalnızca dünyada verildiğini söyler.','Ayet mükâfatın ölçüsünü değil kimlere verildiğini, sabredenlere hesapsız verildiğini bildirir.'],
             ['Çünkü ayet, mükâfatın çalışmadan verildiğini söyler.','Ayetteki ölçüt sabırdır.']] },
  { id:'imran145', tur:'Ayet', kay:'Âl-i İmrân suresi, 145. ayet', m:'Hiçbir kimse Allah’ın izni olmadan ölmez. Ölüm belirli bir süreye göre yazılmıştır…',
    k:'Ecel', kabul:['Kader'], ifade:'Ölüm belirli bir süreye göre yazılmıştır',
    gerekce:[['Çünkü ölümün belirli bir süreye göre yazılmış olması, belirlenen sürenin sonunu, yani eceli anlatır.',''],
             ['Çünkü ayet, ömrün nasıl değerlendirileceğini anlatır.','Bu ömür kavramına yakın; ayet sürenin sonunu (ölümü) anlatır.'],
             ['Çünkü ayet, insanın tedbir alarak ölümünü erteleyebileceğini söyler.','Ayet ölümün yazılmış olduğunu söyler; tedbir ecel bilinmediği için gereklidir.']] },
  { id:'tedavi', tur:'Hadis', kay:'Hz. Muhammed (sav) — Ebû Dâvûd, Tıb, 1; Tirmizî, Tıb, 2', m:'Ey Allah’ın kulları! Tedavi olunuz. Çünkü Allah, bir hastalık hariç her hastalığın şifasını yaratmıştır.',
    k:'Tedbir', kabul:['Sorumluluk'], ifade:'Tedavi olunuz',
    gerekce:[['Çünkü hadis, şifanın Allah’tan olduğunu bildirirken tedavi olmayı, yani sebeplere uymayı emreder.',''],
             ['Çünkü hadis, şifa Allah’tan geldiği için tedavinin gereksiz olduğunu söyler.','Hadis tam tersine “Tedavi olunuz” der.'],
             ['Çünkü hadis, hastalığın bir imtihan olduğunu anlatır.','Hastalık bir imtihan olabilir; ama hadisteki anahtar ifade “Tedavi olunuz”dur.']] },
  { id:'kasas56', tur:'Ayet', kay:'Kasas suresi, 56. ayet', m:'Şüphesiz sen sevdiğin kimseyi doğru yola iletemezsin. Fakat Allah, dilediği kimseyi doğru yola eriştirir…',
    k:'Külli irade', kabul:['Kader'], ifade:'Allah, dilediği kimseyi doğru yola eriştirir',
    gerekce:[['Çünkü “Allah, dilediği kimseyi” ifadesi, Allah’ın hiçbir zorunluluğa bağlı olmadan dilediğini gerçekleştirmesini anlatır.',''],
             ['Çünkü ayet, insanın sevdiği herkesi doğru yola iletebileceğini söyler.','Ayet tam tersine “iletemezsin” der.'],
             ['Çünkü ayet, insanın seçme gücünü (cüz’î irade) anlatır.','Ayette dileyen Allah’tır; bu küllî iradedir.']] },
  { id:'fatiha6', tur:'Ayet', kay:'Fâtiha suresi, 6-7. ayetler', m:'Bizi doğru yola, kendilerine nimet verdiklerinin yoluna ilet; gazaba uğrayanlarınkine ve sapıklarınkine değil.',
    k:'Dua', kabul:[], ifade:'Bizi doğru yola',
    gerekce:[['Çünkü ayette kul, Allah’a yönelip doğru yola iletilmeyi diler; bu bir duadır.',''],
             ['Çünkü ayet, sonucu Allah’a bırakmayı anlatır.','Bu tevekküle yakın; ayette Allah’tan istemek, yani dua vardır.'],
             ['Çünkü ayet, insanın kendi gücüyle doğru yolu bulacağını söyler.','Ayette doğru yolu Allah’tan isteme vardır.']] },
  { id:'beled8', tur:'Ayet', kay:'Beled suresi, 8-10. ayetler', m:'Biz ona iki göz, bir dil, iki dudak vermedik mi; iki apaçık yolu (hayır ve şer yollarını) göstermedik mi?',
    k:'İrade', kabul:['Sorumluluk'], ifade:'iki apaçık yolu (hayır ve şer yollarını) göstermedik mi',
    gerekce:[['Çünkü hayır ve şer yollarının gösterilmesi, bunlar arasında seçimin insana bırakıldığını anlatır.',''],
             ['Çünkü ayet, insanın tek bir yola zorlandığını söyler.','Ayet “iki apaçık yol” der; seçim insana bırakılmıştır.'],
             ['Çünkü ayet, insana verilen nimetlerin yalnızca göz, dil ve dudak olduğunu söyler.','Bu nimetler sayılır ama ayetin sonucu iki yolun gösterilmesidir.']] },
  { id:'bakara216', tur:'Ayet', kay:'Bakara suresi, 216. ayet', m:'…Olur ki, bir şey sizin için hayırlı iken, siz onu hoş görmezsiniz. Yine olur ki, bir şey sizin için kötü iken, siz onu seversiniz. Allah bilir, siz bilmezsiniz.',
    k:'Teslimiyet', kabul:['Rıza','Kader'], ifade:'Allah bilir, siz bilmezsiniz',
    gerekce:[['Çünkü ayet, hoşa gitmeyen bir sonucun bile hayırlı olabileceğini hatırlatarak Allah’ın takdirine gönülden boyun eğmeyi öğretir.',''],
             ['Çünkü ayet, hoşa giden her şeyin mutlaka hayırlı olduğunu söyler.','Ayet tam tersine hoşa gidenin kötü olabileceğini söyler.'],
             ['Çünkü ayet, sonuçlardan önce tedbir almayı anlatır.','Ayetteki vurgu, gelen sonuca bakışımızdır.']] },
  { id:'zilzal7', tur:'Ayet', kay:'Zilzâl suresi, 7-8. ayetler', m:'Artık kim zerre ağırlığınca bir hayır işlerse, onun mükâfatını görecektir. Kim de zerre ağırlığınca bir kötülük işlerse, onun cezasını görecektir.',
    k:'Sorumluluk', kabul:[], ifade:'zerre ağırlığınca',
    gerekce:[['Çünkü ayet, en küçük iyiliğin de kötülüğün de karşılığının görüleceğini, yani insanın yaptıklarının hesabını vereceğini bildirir.',''],
             ['Çünkü ayet, yalnızca büyük kötülüklerin hesaba katıldığını söyler.','Ayet “zerre ağırlığınca” der; en küçük iş bile karşılıksız kalmaz.'],
             ['Çünkü ayet, insanın yaptıklarının kaderde zaten yazılı olduğunu anlatır.','Ayetteki vurgu yaptıkların karşılığının görülmesidir.']] },
  { id:'mumin60', tur:'Ayet', kay:'Mü’min suresi, 60. ayet', m:'Rabbiniz şöyle dedi: “Bana dua edin, duanıza cevap vereyim…”',
    k:'Dua', kabul:[], ifade:'Bana dua edin, duanıza cevap vereyim',
    gerekce:[['Çünkü Allah, kullarına kendisine dua etmelerini emreder ve duaya cevap vereceğini bildirir.',''],
             ['Çünkü ayet, duanın yalnızca peygamberlere özgü olduğunu söyler.','Ayet “Rabbiniz” diyerek bütün insanlara hitap eder.'],
             ['Çünkü ayet, dua eden kişinin çalışmasına gerek olmadığını söyler.','Ayet duayı emreder; çalışmayı gereksiz kılmaz.']] },
  { id:'talak3', tur:'Ayet', kay:'Talâk suresi, 3. ayet', m:'…Kim Allah’a tevekkül ederse, O kendisine yeter. Şüphesiz Allah, emrini yerine getirendir. Allah, her şeye bir ölçü koymuştur.',
    k:'Tevekkül', kabul:['Kader'], ifade:'Kim Allah’a tevekkül ederse, O kendisine yeter',
    gerekce:[['Çünkü ayet, Allah’a tevekkül edene O’nun yeteceğini bildirir.',''],
             ['Çünkü ayet, tevekkül edenin tedbir almasına gerek olmadığını söyler.','Tevekkül tedbirden sonra gelir; ayet tedbiri gereksiz kılmaz.'],
             ['Çünkü ayet, sonuç ortaya çıktıktan sonra razı olmayı anlatır.','Bu rıza ve teslimiyete yakın; ayetteki anahtar kelime “tevekkül”dür.']] },
  { id:'bakara156', tur:'Ayet', kay:'Bakara suresi, 156. ayet', m:'Onlar; başlarına bir musibet gelince, “Biz şüphesiz (her şeyimizle) Allah’a aidiz ve şüphesiz O’na döneceğiz” derler.',
    k:'Teslimiyet', kabul:['Sabır','Rıza'], ifade:'Biz şüphesiz (her şeyimizle) Allah’a aidiz',
    gerekce:[['Çünkü musibet geldikten sonra her şeyin Allah’a ait olduğunu söylemek, takdire gönülden boyun eğmektir.',''],
             ['Çünkü ayet, musibet gelmeden önce tedbir almayı anlatır.','Ayet musibet geldikten sonraki tutumu anlatır.'],
             ['Çünkü ayet, musibete isyan etmeyi anlatır.','Ayetteki söz isyan değil, kabullenmedir.']] },
  { id:'mulk2', tur:'Ayet', kay:'Mülk suresi, 2. ayet', m:'O, hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratandır…',
    k:'İmtihan', kabul:['Ömür','Ecel'], ifade:'sınamak için ölümü ve hayatı yaratandır',
    gerekce:[['Çünkü ayet, ölümün ve hayatın, insanın hangi amelleri yapacağını sınamak için yaratıldığını bildirir.',''],
             ['Çünkü ayet, yalnızca ölümün zamanını anlatır.','Ayet ölümü ve hayatı birlikte anar; vurgusu sınanmadır.'],
             ['Çünkü ayet, amellerin hiçbir karşılığı olmadığını söyler.','Ayet tam tersine “daha güzel amel” için sınandığımızı söyler.']] },
  { id:'kehf29', tur:'Ayet', kay:'Kehf suresi, 29. ayet', m:'De ki: “Hak, Rabbinizdendir. Artık dileyen iman etsin, dileyen inkâr etsin.”…',
    k:'İrade', kabul:['Sorumluluk'], ifade:'dileyen iman etsin, dileyen inkâr etsin',
    gerekce:[['Çünkü “dileyen iman etsin, dileyen inkâr etsin” ifadesi, iman ya da inkârın insanın seçimine bırakıldığını gösterir.',''],
             ['Çünkü ayet, insanın iman etmeye zorlandığını söyler.','Ayet “dileyen” diyerek seçimi insana bırakır.'],
             ['Çünkü ayet, Allah’ın dilediğini hiçbir zorunluluk olmadan yapmasını anlatır.','Bu küllî iradedir; ayette dileyen insandır.']] },
  { id:'muddessir38', tur:'Ayet', kay:'Müddessir suresi, 38. ayet', m:'Herkes kazandığına karşılık bir rehindir.',
    k:'Sorumluluk', kabul:[], ifade:'kazandığına karşılık bir rehindir',
    gerekce:[['Çünkü ayet, herkesin kendi kazandığının (yaptıklarının) karşılığında tutulduğunu, yani sorumlu olduğunu bildirir.',''],
             ['Çünkü ayet, insanın başkalarının yaptıklarından sorumlu olduğunu söyler.','Ayet “herkes kazandığına karşılık” der; sorumluluk kişiseldir.'],
             ['Çünkü ayet, rızkın kazanılmasını anlatır.','Buradaki “kazanmak” iyi ve kötü amelleri kapsar; konu sorumluluktur.']] },
  { id:'akilli', tur:'Hadis', kay:'Hz. Muhammed (sav) — Tirmizî, Sıfatü’l-kıyâme, 25', m:'Akıllı kişi, nefsini hesaba çeken ve ölümden sonrası için çalışandır…',
    k:'Sorumluluk', kabul:['Çaba','Ömür'], ifade:'nefsini hesaba çeken',
    gerekce:[['Çünkü kendini hesaba çekmek, yaptıklarının sorumluluğunu üstlenmektir.',''],
             ['Çünkü hadis, aklı yalnızca dünya işlerinde başarılı olmak olarak tanımlar.','Hadis akıllı kişiyi ölümden sonrası için de çalışan biri olarak tanımlar.'],
             ['Çünkü hadis, insanın yaptıklarından sorumlu tutulmayacağını söyler.','Hadis tam tersine kişinin kendini hesaba çekmesini ister.']] },
  { id:'bakara195', tur:'Ayet', kay:'Bakara suresi, 195. ayet', m:'…Kendi kendinizi tehlikeye atmayın. İyilik edin. Şüphesiz Allah iyilik edenleri sever.',
    k:'Tedbir', kabul:['Sorumluluk'], ifade:'Kendi kendinizi tehlikeye atmayın',
    gerekce:[['Çünkü kendini tehlikeye atmamak, olası zararlara karşı önlem almayı, yani tedbirli olmayı gerektirir.',''],
             ['Çünkü ayet, ecel belli olduğu için önlem almaya gerek olmadığını söyler.','Ayet tam tersine kendini tehlikeye atmayı yasaklar.'],
             ['Çünkü ayet, sonucu Allah’a bırakmayı anlatır.','Bu tevekküldür; ayetteki vurgu tehlikeden korunmaktır.']] },
  { id:'ankebut2', tur:'Ayet', kay:'Ankebût suresi, 2. ayet', m:'İnsanlar, “İnandık” demekle imtihan edilmeden bırakılacaklarını mı zannederler.',
    k:'İmtihan', kabul:[], ifade:'imtihan edilmeden bırakılacaklarını',
    gerekce:[['Çünkü ayet, “İnandık” demenin yetmediğini, inananların da sınanacağını bildirir.',''],
             ['Çünkü ayet, inananların hiçbir zaman sınanmayacağını söyler.','Ayet bu düşünceyi soru yoluyla reddeder.'],
             ['Çünkü ayet, zorlukta sabretmeyi öğütler.','Sabır imtihanla ilişkilidir ama ayette öne çıkan sınanmanın kendisidir.']] }
]);

/* Kavramlar, ünite sayfasındaki Kavramlar listesinin sırasıyla (TANIM nesnesindeki sıra) dizilir. */
var KAVRAMLAR = Object.keys(TANIM);
/* Bir metin birden fazla kavrama uyabiliyorsa ana kavramın yanında kabul edilen kavramlar */
var KABUL = { rahman5:['Kader'], buyu15:['Rızık'], bakara155:['İmtihan'], deve:['Tevekkül'], omer:['Kader'],
  bakara286:['İrade'], necm39:['Sorumluluk'], rad11:['Sünnetullah'], aliimran159:['Tedbir'], enbiya35:['Ecel'],
  beyyine:['Teslimiyet'], hakim:['Ecel'] };
H.forEach(function(h){ h.kabul = KABUL[h.id] || h.kabul || []; });
var HID = {}; H.forEach(function(h){ HID[h.id]=h; });

/* ---------- Görev türleri ve seviyeler ---------- */
var TURLER = {
  ayetKavram:   { ad:'📜 Ayet → Kavram' },
  hadisKavram:  { ad:'💬 Hadis → Kavram' },
  kavramAyet:   { ad:'🧠 Kavram → Ayet/Hadis' },
  mesaj:        { ad:'🔍 Ayet → Ana mesaj' },
  ayirt:        { ad:'⚖️ İki kavramı ayırt et' },
  yanlis:       { ad:'🕵️ Yanlış eşleştirmeyi bul' }
};
var SEVIYE = {
  temel:   { ad:'🟢 Temel',  aciklama:'Ayet/hadisi oku, bütün kavramların arasından ait olduğu kavramı bul.', turlar:['ayetKavram','ayetKavram','hadisKavram','ayetKavram','ayetKavram','ayetKavram'], asama:1 },
  ileri:   { ad:'🔴 İleri',  aciklama:'Kavramı bul, ardından nedenini (gerekçesini) seç.', turlar:['ayetKavram','ayetKavram','hadisKavram','ayetKavram','ayetKavram','ayetKavram'], asama:2 }
};

/* ---------- Durum ---------- */
var ANAHTAR='dk11-akg-';
function oku(k,v){ try{ var x=localStorage.getItem(ANAHTAR+k); return x===null?v:JSON.parse(x); }catch(e){ return v; } }
function yaz(k,v){ try{ localStorage.setItem(ANAHTAR+k,JSON.stringify(v)); }catch(e){} }
var seviye = oku('seviye','ileri'); if(!SEVIYE[seviye]) seviye='ileri';
var tur = null;          /* {gorevler:[…], i:aktif görev, puan} */

/* ---------- Yardımcılar ---------- */
function $(s,r){ return (r||document).querySelector(s); }
function $$(s,r){ return [].slice.call((r||document).querySelectorAll(s)); }
function e(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function karistir(a){ var b=a.slice(); for(var i=b.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=b[i]; b[i]=b[j]; b[j]=t; } return b; }
function vurgula(m, ifade){ var i=m.indexOf(ifade); return i<0 ? e(m) : e(m.slice(0,i))+'<mark>'+e(ifade)+'</mark>'+e(m.slice(i+ifade.length)); }

/* ---------- Torba: her metin bir kez çıkar, torba bitince yeniden dolar ---------- */
function torbadanAl(kosul, haric){
  var torba = oku('torba50',[]).filter(function(id){ return HID[id]; });
  var aday = torba.filter(function(id){ return kosul(HID[id]) && haric.indexOf(id)<0; });
  if(!aday.length){
    /* Torbada uygun metin kalmadı: bu türün metinlerini torbaya yeniden ekle (son turdakiler hariç). */
    var son = oku('sonTur',[]);
    var yeni = karistir(H.filter(function(h){ return kosul(h) && torba.indexOf(h.id)<0; }).map(function(h){ return h.id; }));
    var tercih = yeni.filter(function(id){ return son.indexOf(id)<0; });
    torba = torba.concat(tercih.length ? tercih : yeni);
    aday = torba.filter(function(id){ return kosul(HID[id]) && haric.indexOf(id)<0; });
  }
  var sec = aday[Math.floor(Math.random()*aday.length)];
  torba.splice(torba.indexOf(sec),1); yaz('torba50',torba);
  return sec;
}

/* ---------- Tur oluştur ---------- */
function yeniTur(){
  var S=SEVIYE[seviye], kullanilan=[], gorevler=[];
  S.turlar.forEach(function(tr){
    var kosul = tr==='hadisKavram' ? function(h){ return h.tur==='Hadis'; } : tr==='ayetKavram' || tr==='mesaj' ? function(h){ return h.tur==='Ayet'; } : function(){ return true; };
    var id = torbadanAl(kosul, kullanilan); kullanilan.push(id);
    gorevler.push(gorevKur(tr, HID[id]));
  });
  yaz('sonTur', kullanilan);
  tur = { gorevler:gorevler, i:0, seviye:seviye };
  ciz();
}
function celdiriciler(h, n){
  var S=SEVIYE[seviye], yakin=karistir(h.cel).slice(0,Math.min(S.yakinCel,n));
  var uzak=karistir(KAVRAMLAR.filter(function(k){ return k!==h.k && h.cel.indexOf(k)<0; })).slice(0,n-yakin.length);
  return yakin.concat(uzak);
}
function gorevKur(tr, h){
  var g = { tur:tr, h:h, asama:0, sonuc:{ kavram:null, ilk:null, gerekce:null, hayat:null }, denendi:[], puan:0 };
  if(tr==='ayetKavram' || tr==='hadisKavram'){
    g.secenek = KAVRAMLAR.slice();
  } else if(tr==='kavramAyet'){
    /* Seçenekler: hedef metin + kavramı hedefin yakın kavramlarından biri olan metinler (karıştırılabilir olanlar) */
    var yakinlar = karistir(H.filter(function(x){ return x.id!==h.id && x.k!==h.k && h.cel.indexOf(x.k)>=0; }));
    var digerleri = karistir(H.filter(function(x){ return x.id!==h.id && x.k!==h.k && yakinlar.indexOf(x)<0; }));
    var secilen=[], kav=[h.k];
    yakinlar.concat(digerleri).forEach(function(x){ if(secilen.length<3 && kav.indexOf(x.k)<0){ secilen.push(x.id); kav.push(x.k); } });
    g.secenek = karistir([h.id].concat(secilen));
  } else if(tr==='mesaj'){
    var baska = karistir(H.filter(function(x){ return x.id!==h.id && x.k!==h.k; }))[0];
    g.secenek = karistir([h.mesaj[0], h.mesaj[1], h.mesaj[2], baska.mesaj[0]]);
  } else if(tr==='ayirt'){
    g.secenek = karistir([h.k, h.yakin]);
  } else if(tr==='yanlis'){
    /* Hedef metin yakın kavramıyla (yanlış), diğer üç metin kendi kavramlarıyla (doğru) eşleşir. */
    var dig = karistir(H.filter(function(x){ return x.id!==h.id && x.k!==h.yakin; })).slice(0,3);
    g.ciftler = karistir([{ id:h.id, k:h.yakin, yanlis:true }].concat(dig.map(function(x){ return { id:x.id, k:x.k, yanlis:false }; })));
    g.secenek = g.ciftler.map(function(_,i){ return i; });
  }
  g.gerekce = karistir(h.gerekce.map(function(x,i){ return { t:x[0], gb:x[1], d:i===0 }; }));
  g.hayat = h.hayat ? karistir(h.hayat.o.map(function(x,i){ return { t:x[0], gb:x[1], d:i===0 }; })) : [];
  return g;
}

/* ---------- Çizim ---------- */
var ADIM = [['📜','Metin'],['🔍','Düşün'],['🧠','Kavram'],['🔗','Neden?'],['🏆','Sonuç']];
function akisCiz(aktifAdim){
  return '<ol class="akg-akis" aria-label="Görev akışı">'+ADIM.map(function(a,i){
    var gizli = (i===3 && SEVIYE[tur.seviye].asama<2);
    if(gizli) return '';
    return '<li class="'+(i<aktifAdim?'bitti':i===aktifAdim?'aktif':'')+'"><span>'+a[0]+'</span>'+a[1]+'</li>'; }).join('')+'</ol>';
}
function metinKarti(h, isaretle){
  return '<div class="akg-metin '+(h.tur==='Hadis'?'hadis':'')+'"><div class="akg-metin-ust"><span class="akg-rozet">'+(h.tur==='Hadis'?'💬 HADİS':'📜 AYET')+'</span><span class="akg-kay">'+e(h.kay)+'</span></div>'+
    '<p class="akg-m">“'+(isaretle?vurgula(h.m,h.ifade):e(h.m))+'”</p></div>';
}
function ciz(){
  var kap = $('#akgSahne'); if(!kap) return;
  if(!tur){ kap.innerHTML=''; return; }
  if(tur.i>=tur.gorevler.length){ raporCiz(); return; }
  var g = tur.gorevler[tur.i], h=g.h, S=SEVIYE[tur.seviye], toplam=tur.gorevler.length;
  var ust = '<div class="akg-gorev-ust"><span class="akg-tur">'+TURLER[g.tur].ad+'</span><span>Görev '+(tur.i+1)+' / '+toplam+' · '+S.ad+'</span><span class="akg-puan">'+turPuan()+' puan</span></div>';
  var h1='', adim=0;

  if(g.asama===0){
    /* METİN → DÜŞÜN: cevap gösterilmeden önce düşünme */
    adim=1;
    var ipucu = g.tur==='kavramAyet' ? 'Önce kavramın tanımını oku. Bu tanıma uyan bir ayet ya da hadis nasıl bir ifade içerir?' :
      g.tur==='yanlis' ? 'Dört eşleştirmeden biri hatalı. Her metnin anahtar ifadesini düşün.' :
      'Metni dikkatle oku. Metindeki <b>anahtar ifade</b> ne? Bu ifade hangi kavramın anlamını taşıyor? Düşündükten sonra bütün kavramlar açılacak.';
    h1 = (g.tur==='kavramAyet' ? '<div class="akg-kavram-kart"><span class="akg-rozet">🧠 KAVRAM</span><h4>'+e(h.k)+'</h4><p>'+e(TANIM[h.k])+'</p></div>' :
          g.tur==='yanlis' ? '' : metinKarti(h,false))+
      '<div class="akg-dusun"><p>🔍 '+ipucu+'</p><button class="btn" type="button" data-akg="dusundum">Düşündüm, seçenekleri göster</button></div>';
  } else if(g.asama===1){
    adim=2; h1 = asama1Html(g);
  } else if(g.asama===2){
    adim=3; h1 = metinKarti(h,false)+asama1Ozet(g)+
      '<h4 class="akg-soru">🔗 Bu metin “'+e(h.k)+'” kavramını neden destekliyor?</h4><div class="akg-sec dikey">'+
      g.gerekce.map(function(x,i){ return secBtn('g'+i, ['A','B','C'][i]+') '+x.t, g.denendi.indexOf('g'+i)>=0 ? (x.d?'dogru':'yanlis') : ''); }).join('')+'</div><div class="akg-gb" aria-live="polite">'+gbYaz(g,'g')+'</div>';
  } else if(g.asama===3){
    adim=4; h1 = metinKarti(h,true)+'<div class="akg-neden"><b>🔗 Neden?</b> '+e(h.gerekce[0][0])+'</div>'+
      '<div class="akg-hayat"><span class="akg-rozet">🌍 HAYATA UYGULA</span><p>'+e(h.hayat.s)+'</p></div>'+
      '<h4 class="akg-soru">'+e(h.hayat.k)+'</h4><div class="akg-sec dikey">'+
      g.hayat.map(function(x,i){ return secBtn('h'+i, ['A','B','C','D'][i]+') '+x.t, g.denendi.indexOf('h'+i)>=0 ? (x.d?'dogru':'yanlis') : ''); }).join('')+'</div><div class="akg-gb" aria-live="polite">'+gbYaz(g,'h')+'</div>';
  } else {
    adim=4; h1 = metinKarti(h,true)+gorevOzet(g)+
      '<div class="dugmeler"><button class="btn" type="button" data-akg="sonraki">'+(tur.i<toplam-1?'Sonraki görev →':'🏆 Tur sonucunu gör')+'</button></div>';
  }
  kap.innerHTML = akisCiz(adim)+ust+h1;
  var odak = $('.akg-sec button:not(:disabled), [data-akg]', kap); if(odak && g.asama>0) odak.focus({preventScroll:true});
}
function secBtn(kod, metin, durum){
  return '<button type="button" class="akg-btn '+durum+'" data-sec="'+kod+'"'+(durum?' disabled':'')+'>'+e(metin)+'</button>';
}
function asama1Html(g){
  var h=g.h, s='';
  if(g.tur==='ayetKavram' || g.tur==='hadisKavram'){
    s = metinKarti(h,false)+'<h4 class="akg-soru">🧠 Bu '+(h.tur==='Hadis'?'hadis':'ayet')+' hangi kavrama aittir? Bütün kavramların arasından bul.</h4><div class="akg-sec tum">'+
      g.secenek.map(function(k,i){ return secBtn('k'+i, (i+1)+'. '+k, g.denendi.indexOf('k'+i)>=0 ? (dogruMu(g,'k'+i)?'dogru':'yanlis') : ''); }).join('')+'</div>';
  } else if(g.tur==='kavramAyet'){
    s = '<div class="akg-kavram-kart"><span class="akg-rozet">🧠 KAVRAM</span><h4>'+e(h.k)+'</h4><p>'+e(TANIM[h.k])+'</p></div>'+
      '<h4 class="akg-soru">📜 Bu kavramın temel anlamı en çok hangi metinde öne çıkmaktadır?</h4><div class="akg-sec dikey">'+
      g.secenek.map(function(id,i){ var x=HID[id]; return secBtn('k'+i, ['A','B','C','D'][i]+') “'+x.m+'” — '+x.kay, g.denendi.indexOf('k'+i)>=0 ? (id===h.id?'dogru':'yanlis') : ''); }).join('')+'</div>';
  } else if(g.tur==='mesaj'){
    s = metinKarti(h,false)+'<h4 class="akg-soru">🔍 Bu ayetin ana mesajı hangisidir?</h4><div class="akg-sec dikey">'+
      g.secenek.map(function(m,i){ return secBtn('k'+i, ['A','B','C','D'][i]+') '+m, g.denendi.indexOf('k'+i)>=0 ? (m===h.mesaj[0]?'dogru':'yanlis') : ''); }).join('')+'</div>';
  } else if(g.tur==='ayirt'){
    s = metinKarti(h,false)+'<h4 class="akg-soru">⚖️ Bu iki kavramdan hangisi metne daha uygundur?</h4><div class="akg-sec ikili">'+
      g.secenek.map(function(k,i){ return secBtn('k'+i, k, g.denendi.indexOf('k'+i)>=0 ? (k===h.k?'dogru':'yanlis') : ''); }).join('')+'</div>';
  } else if(g.tur==='yanlis'){
    s = '<h4 class="akg-soru">🕵️ Aşağıdaki eşleştirmelerden hangisi <u>yanlıştır</u>?</h4><div class="akg-sec dikey">'+
      g.ciftler.map(function(c,i){ var x=HID[c.id]; return secBtn('k'+i, ['A','B','C','D'][i]+') “'+x.m+'” ('+x.kay+') → '+c.k, g.denendi.indexOf('k'+i)>=0 ? (c.yanlis?'dogru':'yanlis') : ''); }).join('')+'</div>';
  }
  return s+'<div class="akg-gb" aria-live="polite">'+gbYaz(g,'k')+'</div>';
}
function dogruMu(g, kod){
  var i=+kod.slice(1), t=kod[0];
  if(t==='g') return g.gerekce[i].d;
  if(t==='h') return g.hayat[i].d;
  if(g.tur==='ayetKavram'||g.tur==='hadisKavram') return g.secenek[i]===g.h.k || g.h.kabul.indexOf(g.secenek[i])>=0;
  if(g.tur==='ayirt') return g.secenek[i]===g.h.k;
  if(g.tur==='kavramAyet') return g.secenek[i]===g.h.id;
  if(g.tur==='mesaj') return g.secenek[i]===g.h.mesaj[0];
  if(g.tur==='yanlis') return g.ciftler[i].yanlis;
}
/* Son denemenin geri bildirimi */
function gbYaz(g, t){
  var son = g.denendi.filter(function(k){ return k[0]===t; }).slice(-1)[0]; if(!son) return '';
  var h=g.h, i=+son.slice(1), d=dogruMu(g,son);
  if(t==='g') return d ? '' : '<div class="akg-not y"><b>❌ Bu gerekçe metni tam karşılamıyor.</b> '+e(g.gerekce[i].gb)+' Tekrar dene.</div>';
  if(t==='h') return d ? '' : '<div class="akg-not y"><b>❌ Bu değerlendirme eksik.</b> '+e(g.hayat[i].gb)+' Tekrar dene.</div>';
  if(d) return '';
  /* Kavram aşamasında yanlış: cevabı söylemeden yönlendir */
  if(g.tur==='ayetKavram'||g.tur==='hadisKavram'||g.tur==='ayirt'){
    var k=g.secenek[i];
    return '<div class="akg-not y"><b>❌ “'+e(k)+'” bu metnin ana mesajını tam karşılamıyor.</b> '+e(k)+': '+e(TANIM[k]||'')+' Metindeki anahtar ifadeye dön: <i>“'+e(h.ifade)+'”</i>. Tekrar dene.</div>';
  }
  if(g.tur==='kavramAyet'){
    var x=HID[g.secenek[i]];
    return '<div class="akg-not y"><b>❌ Bu metnin öne çıkardığı kavram başka.</b> Seçtiğin metin daha çok “'+e(x.k)+'” kavramıyla ilgilidir: '+e(TANIM[x.k])+' “'+e(h.k)+'” tanımına yeniden bak. Tekrar dene.</div>';
  }
  if(g.tur==='mesaj') return '<div class="akg-not y"><b>❌ Bu ifade ayetin ana mesajı değil.</b> Ayette ne söylendiğine, özellikle <i>“'+e(h.ifade)+'”</i> ifadesine dikkat et. Tekrar dene.</div>';
  if(g.tur==='yanlis'){ var c=g.ciftler[i]; return '<div class="akg-not y"><b>❌ Bu eşleştirme doğru.</b> “'+e(HID[c.id].ifade)+'” ifadesi gerçekten “'+e(c.k)+'” kavramını öne çıkarır. Diğerlerine bak. Tekrar dene.</div>'; }
}
function asama1Ozet(g){
  var h=g.h, ek='';
  if(g.tur==='ayirt') ek='<p class="akg-fark"><b>⚖️ Fark:</b> '+e(h.fark)+'</p>';
  if(g.tur==='yanlis') ek='<p class="akg-fark"><b>🕵️ Doğrusu:</b> Bu metnin kavramı “'+e(h.yakin)+'” değil, “'+e(h.k)+'”dir. '+e(h.fark)+'</p>';
  if(g.tur==='mesaj') ek='<p class="akg-fark"><b>🔍 Ana mesaj:</b> '+e(h.mesaj[0])+' Bu mesajın kavramı: <b>'+e(h.k)+'</b>.</p>';
  var bulunan = g.denendi.filter(function(k){ return k[0]==='k' && dogruMu(g,k); })[0], bk = bulunan && (g.tur==='ayetKavram'||g.tur==='hadisKavram') ? g.secenek[+bulunan.slice(1)] : h.k;
  if(bk!==h.k) ek = '<p class="akg-fark"><b>Kabul edilir:</b> Metin “'+e(bk)+'” kavramıyla da ilişkilidir; ama en çok öne çıkan kavram <b>'+e(h.k)+'</b>.</p>'+ek;
  return '<div class="akg-not d"><b>✅ DOĞRU — '+e(h.k)+'</b> '+e(TANIM[h.k])+(g.sonuc.ilk?'':' <span class="akg-kucuk">(İlk denemede bulamadığın için bu aşamadan puan alınmadı.)</span>')+'</div>'+ek;
}
function gorevOzet(g){
  var h=g.h, S=SEVIYE[tur.seviye];
  var satir = function(ad, v){ return '<li>'+(v===null?'—':v?'✅':'❌')+' '+ad+'</li>'; };
  return '<div class="akg-neden"><b>🔗 Neden?</b> '+e(h.gerekce[0][0])+'</div>'+(h.kabul.length?'<p class="akg-kucuk">Bu metinle ilişkili diğer kavram'+(h.kabul.length>1?'lar':'')+': '+e(h.kabul.join(', '))+'.</p>':'')+
    (g.tur==='ayirt'||g.tur==='yanlis' ? '<p class="akg-fark"><b>⚖️ '+e(h.k)+' ↔ '+e(h.yakin)+':</b> '+e(h.fark)+'</p>' : '')+
    '<div class="akg-gorev-sonuc"><b>Görev puanı: '+g.puan+' / '+(S.asama*10)+'</b><ul>'+
      satir('Kavramı ilk denemede buldu (+10)', g.sonuc.ilk)+
      (S.asama>=2 ? satir('Gerekçeyi ilk denemede buldu (+10)', g.sonuc.gerekce) : '')+
      (S.asama>=3 ? satir('Hayat örneğini ilk denemede analiz etti (+10)', g.sonuc.hayat) : '')+'</ul></div>';
}
function turPuan(){ return tur.gorevler.reduce(function(t,g){ return t+g.puan; },0); }
function turMax(){ return tur.gorevler.length*SEVIYE[tur.seviye].asama*10; }

/* ---------- Öğretmen raporu ---------- */
function raporCiz(){
  var S=SEVIYE[tur.seviye], p=turPuan(), m=turMax();
  var kayit = { t:Date.now(), seviye:tur.seviye, puan:p, max:m, gorev:tur.gorevler.map(function(g){ return { id:g.h.id, tur:g.tur, k:g.h.k, ilkSecim:g.sonuc.ilkSecim, ilk:g.sonuc.ilk, gerekce:g.sonuc.gerekce, hayat:g.sonuc.hayat, puan:g.puan }; }) };
  if(!tur.kaydedildi){ var gec=oku('gecmis',[]); gec.push(kayit); yaz('gecmis',gec.slice(-30)); tur.kaydedildi=true; }
  var isaret=function(v){ return v===null||v===undefined?'—':v?'✓':'✗'; };
  $('#akgSahne').innerHTML = akisCiz(4)+
    '<div class="akg-rapor"><div class="akg-rapor-ust"><span class="akg-kupa" aria-hidden="true">🏆</span><div><h4>Tur tamamlandı · '+S.ad+'</h4><p><b>'+p+' / '+m+' puan</b> · %'+Math.round(p*100/m)+'</p></div></div>'+
    '<div class="akg-tablo-sar"><table class="akg-tablo"><thead><tr><th>#</th><th>Görev</th><th>Metin</th><th>Doğru kavram</th><th>İlk seçim</th><th>Kavram</th>'+(S.asama>=2?'<th>Gerekçe</th>':'')+(S.asama>=3?'<th>Hayat</th>':'')+'<th>Puan</th></tr></thead><tbody>'+
    tur.gorevler.map(function(g,i){ return '<tr><td>'+(i+1)+'</td><td>'+TURLER[g.tur].ad+'</td><td>'+e(g.h.kay.replace(/^Hz\. Muhammed \(sav\) — /,''))+'</td><td><b>'+e(g.h.k)+'</b></td><td>'+e(g.sonuc.ilkSecim||'—')+'</td><td class="'+(g.sonuc.ilk?'d':'y')+'">'+isaret(g.sonuc.ilk)+'</td>'+
      (S.asama>=2?'<td class="'+(g.sonuc.gerekce?'d':'y')+'">'+isaret(g.sonuc.gerekce)+'</td>':'')+(S.asama>=3?'<td class="'+(g.sonuc.hayat?'d':'y')+'">'+isaret(g.sonuc.hayat)+'</td>':'')+'<td>'+g.puan+'</td></tr>'; }).join('')+
    '</tbody></table></div>'+
    '<p class="akg-kucuk">“İlk seçim”, öğrencinin kavram aşamasındaki ilk cevabıdır. ✓ = ilk denemede doğru, ✗ = ilk denemede yanlış (öğrenci geri bildirimle doğruyu buldu).</p>'+
    '<div class="dugmeler"><button class="btn" type="button" data-akg="yeni">🔄 Yeni Tur</button><button class="btn ikincil" type="button" data-akg="gecmis">📋 Öğretmen özeti (tüm turlar)</button></div><div id="akgGecmis"></div></div>';
}
function gecmisCiz(){
  var gec=oku('gecmis',[]), kap=$('#akgGecmis'); if(!kap) return;
  if(!gec.length){ kap.innerHTML='<p class="akg-kucuk">Henüz kayıtlı tur yok.</p>'; return; }
  var k={}, gerek=[0,0], hayat=[0,0], kav=[0,0];
  gec.forEach(function(t){ t.gorev.forEach(function(g){
    var x=k[g.k]=k[g.k]||{d:0,t:0}; x.t++; if(g.ilk) x.d++;
    kav[1]++; if(g.ilk) kav[0]++;
    if(g.gerekce!==null&&g.gerekce!==undefined){ gerek[1]++; if(g.gerekce) gerek[0]++; }
    if(g.hayat!==null&&g.hayat!==undefined){ hayat[1]++; if(g.hayat) hayat[0]++; }
  }); });
  var oran=function(a){ return a[1]?Math.round(a[0]*100/a[1])+'% ('+a[0]+'/'+a[1]+')':'—'; };
  kap.innerHTML='<div class="akg-gecmis"><h4>📋 Öğretmen özeti · bu cihazdaki son '+gec.length+' tur</h4>'+
    '<ul><li>Kavramı ilk denemede doğru bulma: <b>'+oran(kav)+'</b></li><li>Kavramı doğru gerekçelendirme: <b>'+oran(gerek)+'</b></li><li>Toplam puan: <b>'+gec.reduce(function(t,x){ return t+x.puan; },0)+' / '+gec.reduce(function(t,x){ return t+x.max; },0)+'</b></li></ul>'+
    '<p class="akg-kucuk" style="margin:8px 0 4px">Kavram bazında ilk denemede doğru:</p><div class="akg-kavram-ozet">'+Object.keys(k).sort(function(a,b){ return (k[a].d/k[a].t)-(k[b].d/k[b].t); }).map(function(n){ var x=k[n]; return '<span class="'+(x.d===x.t?'d':x.d===0?'y':'')+'">'+e(n)+' '+x.d+'/'+x.t+'</span>'; }).join('')+'</div>'+
    '<div class="dugmeler"><button class="btn ikincil" type="button" data-akg="temizle">Özeti temizle</button></div></div>';
}

/* ---------- Etkileşim ---------- */
function sec(kod){
  var g=tur.gorevler[tur.i], S=SEVIYE[tur.seviye]; if(g.denendi.indexOf(kod)>=0) return;
  g.denendi.push(kod);
  var d=dogruMu(g,kod), t=kod[0];
  if(t==='k'){
    if(g.sonuc.ilk===null){ g.sonuc.ilk=d; g.sonuc.ilkSecim=secimAdi(g,kod); if(d) g.puan+=10; }
    if(d){ g.asama = S.asama>=2 ? 2 : 4; }
  } else if(t==='g'){
    if(g.sonuc.gerekce===null){ g.sonuc.gerekce=d; if(d) g.puan+=10; }
    if(d){ g.asama = S.asama>=3 ? 3 : 4; }
  } else if(t==='h'){
    if(g.sonuc.hayat===null){ g.sonuc.hayat=d; if(d) g.puan+=10; }
    if(d) g.asama=4;
  }
  ciz();
}
function secimAdi(g,kod){
  var i=+kod.slice(1);
  if(g.tur==='kavramAyet') return HID[g.secenek[i]].kay.replace(/^Hz\. Muhammed \(sav\) — /,'');
  if(g.tur==='mesaj') return g.secenek[i]===g.h.mesaj[0]?'Doğru mesaj':'Yanlış mesaj';
  if(g.tur==='yanlis'){ var c=g.ciftler[i]; return HID[c.id].kay.replace(/^Hz\. Muhammed \(sav\) — /,'')+' → '+c.k; }
  return g.secenek[i];
}
function kur(){
  var kok=$('#ayet-kavram'); if(!kok) return;
  $('#akgGovde',kok).innerHTML =
    '<div class="akg-ust"><div class="akg-seviyeler" role="group" aria-label="Seviye">'+Object.keys(SEVIYE).map(function(s){
      return '<button type="button" class="kutu-btn'+(s===seviye?' sec':'')+'" data-seviye="'+s+'" aria-pressed="'+(s===seviye)+'" title="'+e(SEVIYE[s].aciklama)+'">'+SEVIYE[s].ad+'</button>'; }).join('')+
    '</div><button class="btn" type="button" data-akg="yeni">🔄 Yeni Tur</button></div>'+
    '<p class="akg-seviye-not" id="akgSeviyeNot">'+e(SEVIYE[seviye].aciklama)+' · Puan: kavram +10'+(SEVIYE[seviye].asama>=2?' · gerekçe +10':'')+'</p>'+
    '<div id="akgSahne" class="akg-sahne" aria-live="polite"></div>';
  kok.addEventListener('click',function(ev){
    var b=ev.target.closest('[data-sec]'); if(b && !b.disabled){ sec(b.getAttribute('data-sec')); return; }
    var a=ev.target.closest('[data-akg]'); if(a){
      var x=a.getAttribute('data-akg');
      if(x==='yeni'){ yeniTur(); $('#akgSahne').scrollIntoView({behavior:'smooth',block:'start'}); }
      if(x==='dusundum'){ tur.gorevler[tur.i].asama=1; ciz(); }
      if(x==='sonraki'){ tur.i++; ciz(); $('#akgSahne').scrollIntoView({behavior:'smooth',block:'start'}); }
      if(x==='gecmis') gecmisCiz();
      if(x==='temizle'){ if(window.confirm('Bu cihazdaki tüm tur kayıtları silinsin mi?')){ yaz('gecmis',[]); gecmisCiz(); } }
      return;
    }
    var s=ev.target.closest('[data-seviye]'); if(s){
      seviye=s.getAttribute('data-seviye'); yaz('seviye',seviye);
      $$('[data-seviye]',kok).forEach(function(x){ var on=x===s; x.classList.toggle('sec',on); x.setAttribute('aria-pressed',String(on)); });
      $('#akgSeviyeNot').textContent=SEVIYE[seviye].aciklama+' · Puan: kavram +10'+(SEVIYE[seviye].asama>=2?' · gerekçe +10':'');
      yeniTur();
    }
  });
  yeniTur();
}
window.AYET_KAVRAM_GOREV = { havuz:H, tanim:TANIM, durum:function(){ return tur; } };
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',kur); else kur();
})();
