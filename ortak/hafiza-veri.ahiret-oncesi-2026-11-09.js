/* ======================================================================
   HAFIZA KARTLARI — tek veri kaynağı (4-8. sınıf)
   Her ünite: kartlar (kavram · hatırlatma kelimesi · somutlaştırma ve
   sınırı · anlam bağlantısı · günlük hayat · karıştırma uyarısı ·
   hatırlama sorusu) + 5 aşamalı karşılaşma (öğren → görsel → senaryo →
   karşılaştır → uygula) için sorular ve uygulama etkinlikleri.
   Kodlama bir HATIRLAMA YÖNTEMİDİR; kavramın dinî anlamının yerine geçmez.
   Motor: ortak/hafiza-kartlari.js
====================================================================== */
window.HAFIZA_VERI = {

/* ───────────── 4. SINIF · 1. ÜNİTE ───────────── */
's4-u1': {
  baslik: 'Günlük Hayattaki Dinî İfadeler',
  giris: 'Benzer duyulan dinî ifadeleri karıştırmamak için her birine bir “hatırlatma kelimesi” verdik. Önce kartları oku, sonra etkinliklerle hatırla.',
  kartlar: [
    { id:'besmele', kavram:'Besmele (Bismillahirrahmanirrahim)', kelime:'BAŞLA', simge:'🚦', neden:'Yeşil ışık “şimdi başlayabilirsin” demektir; besmele de bir işin başında söylenir.',
      somut:'Yolda yeşil ışığı görünce yürümeye başlamak.', sinir:'Besmele bir trafik işareti değildir; işe Allah’ın adıyla başlamak demektir.',
      tanim:'“Rahmân ve Rahîm olan Allah’ın adıyla” anlamına gelir. Yemeğe, derse, yolculuğa başlarken söylenir.',
      anlam:'BAŞLA kelimesi, besmelenin bir işin BAŞINDA söylendiğini hatırlatır.',
      gunluk:'Kahvaltıya oturduğunda ilk lokmadan önce “Bismillah” dersin.',
      karisan:{ ad:'Elhamdülillah', fark:'Besmele işin başında, Elhamdülillah iş bitince ya da bir nimete kavuşunca söylenir.' },
      soru:{ s:'Besmele ne zaman söylenir?', o:['Bir işe başlarken','Bir iş bitince','Bir şeyi beğenince'], d:0 } },
    { id:'sukur', kavram:'Şükür (Elhamdülillah)', kelime:'TEŞEKKÜR', simge:'💌', neden:'Teşekkür kartı, birine minnettar olduğumuzu gösterir; şükür de Allah’a teşekkürdür.',
      somut:'Hediye veren birine teşekkür kartı yazmak.', sinir:'Şükür yalnızca söz değildir; nimeti yerinde kullanmak da şükürdür.',
      tanim:'Allah’ın verdiği nimetlerin farkına varıp O’na teşekkür etmektir. “Elhamdülillah” (Allah’a hamdolsun) diyerek dile getiririz.',
      anlam:'TEŞEKKÜR kelimesi şükrün özünü anlatır: Nimeti vereni hatırlayıp teşekkür etmek.',
      gunluk:'Hastalıktan iyileşince “Elhamdülillah” demek ve sağlığını korumaya özen göstermek.',
      karisan:{ ad:'Dua', fark:'Şükürde verilen nimet için teşekkür ederiz; duada ise Allah’tan bir şey isteriz.' },
      soru:{ s:'Şükür en iyi hangi kelimeyle hatırlanır?', o:['Teşekkür','Başlamak','Beğenmek'], d:0 } },
    { id:'dua', kavram:'Dua', kelime:'YÖNELMEK', simge:'💬', neden:'Konuşma balonu, içimizden geçen dileği anlatmayı hatırlatır.',
      somut:'İçten bir dileği anlatan konuşma balonu.', sinir:'Dua bir telefon görüşmesi değildir: Allah’ı aramak için numaraya gerek yoktur; O her an işitir ve bilir.',
      tanim:'Allah’a yönelmek, O’ndan yardım ve iyilik dilemektir. Her dilde, her yerde dua edilebilir.',
      anlam:'YÖNELMEK kelimesi duanın özünü anlatır: Kalbimizle Allah’a dönmek.',
      gunluk:'Sınavdan önce çalıştıktan sonra “Allah’ım, bana kolaylık ver” demek.',
      karisan:{ ad:'Şükür', fark:'Duada isteriz, şükürde teşekkür ederiz. İkisi de Allah’a yönelmektir.' },
      soru:{ s:'Dua etmek ne demektir?', o:['Allah’a yönelip O’ndan dilekte bulunmak','Yalnızca bir işe başlamak','Bir şeyi beğendiğini söylemek'], d:0 } },
    { id:'masallah', kavram:'Maşallah', kelime:'BEĞEN', simge:'🌷', neden:'Güzel bir çiçeği görünce hayran kalırız; maşallah da beğendiğimiz bir şey karşısında söylenir.',
      somut:'Bahçedeki güzel bir çiçeğe hayranlıkla bakmak.', sinir:'Maşallah yalnızca “güzel” demek değildir; o güzelliği verenin Allah olduğunu hatırlamaktır.',
      tanim:'“Allah dilemiş” anlamına gelir. Güzel ve beğendiğimiz bir şey gördüğümüzde söylenir.',
      anlam:'BEĞEN kelimesi, maşallahın beğeni anında söylendiğini hatırlatır.',
      gunluk:'Arkadaşının yaptığı güzel resmi görünce “Maşallah, çok güzel olmuş!” demek.',
      karisan:{ ad:'İnşallah', fark:'Maşallah şimdi gördüğümüz güzellik için, inşallah gelecekte yapmak istediğimiz iş için söylenir.' },
      soru:{ s:'Kardeşinin yüksek notunu görünce hangisini söylersin?', o:['Maşallah','İnşallah','Bismillah'], d:0 } },
    { id:'insallah', kavram:'İnşallah', kelime:'YARIN', simge:'📅', neden:'Takvim, ileride yapacağımız işleri gösterir; inşallah da gelecekteki planlar için söylenir.',
      somut:'Takvime “Cumartesi pikniğe gideceğiz” yazmak.', sinir:'İnşallah “belki yaparım” demek değildir; planı yapıp Allah’ın iznine güvenmektir.',
      tanim:'“Allah dilerse” anlamına gelir. Gelecekte yapmayı düşündüğümüz işlerden söz ederken söylenir.',
      anlam:'YARIN kelimesi, inşallahın gelecek için söylendiğini hatırlatır.',
      gunluk:'“Yarın inşallah dedemi ziyaret edeceğim.”',
      karisan:{ ad:'Maşallah', fark:'İnşallah gelecek için, maşallah şimdi gördüğümüz güzellik için söylenir.' },
      soru:{ s:'“İnşallah” hangi zamanla ilgilidir?', o:['Gelecekle','Geçmişle','Hiçbir zamanla'], d:0 } }
  ],
  senaryo: [
    { s:'Elif yeni bir kitaba başlamadan önce ne söyler?', o:['Bismillah','Maşallah','Elhamdülillah','İnşallah'], d:0, k:'besmele', a:'Bir işin başında besmele çekilir.' },
    { s:'Ali hafta sonu ormana gitmeyi planlıyor ve bundan söz ediyor. Cümlesinin sonuna ne ekler?', o:['İnşallah','Maşallah','Bismillah','Elhamdülillah'], d:0, k:'insallah', a:'Gelecekteki planlar için “inşallah” denir.' },
    { s:'Zeynep yemeğini bitirdi ve nimet için teşekkür etmek istiyor. Ne der?', o:['Elhamdülillah','İnşallah','Maşallah','Bismillah'], d:0, k:'sukur', a:'Nimet için Allah’a teşekkür, “Elhamdülillah” ile dile getirilir.' },
    { s:'Can hasta olan babaannesinin iyileşmesi için ne yapabilir?', o:['Allah’a dua eder','Maşallah der','Bismillah deyip bekler','Hiçbir şey yapmaz'], d:0, k:'dua', a:'Bir dileği Allah’a yönelerek dile getirmek duadır.' }
  ],
  karsilastir: [
    { s:'“Ne güzel bir bahçe!” derken hangisi söylenir?', o:['Maşallah','İnşallah'], d:0, k:'masallah', a:'Şimdi gördüğümüz güzellik için maşallah denir. İnşallah gelecek içindir.' },
    { s:'“Yarın bahçeye çiçek dikeceğiz” derken hangisi söylenir?', o:['İnşallah','Maşallah'], d:0, k:'insallah', a:'Gelecekteki plan için inşallah denir.' },
    { s:'Allah’tan bir şey istemek hangisidir?', o:['Dua','Şükür'], d:0, k:'dua', a:'Duada isteriz, şükürde teşekkür ederiz.' },
    { s:'Sahip olduğumuz nimet için Allah’a teşekkür etmek hangisidir?', o:['Şükür','Dua'], d:0, k:'sukur', a:'Teşekkür etmek şükürdür.' }
  ],
  etkinlikler: [
    { tur:'esles', baslik:'Hatırlatma kelimesini ifadeyle eşleştir', ciftler:[['BAŞLA','Bismillah'],['TEŞEKKÜR','Elhamdülillah'],['BEĞEN','Maşallah'],['YARIN','İnşallah'],['YÖNELMEK','Dua']],
      a:'Kelimeyi hatırlamak yetmez; her ifadenin hangi durumda söylendiğini de bilmelisin.' }
  ],
  uygula: [
    { s:'Selin doğum gününde aldığı hediyeyi açtı. Hem hediyeyi beğendiğini hem de Allah’a şükrettiğini göstermek istiyor. Hangi ikisini söylemesi uygundur?', o:['Maşallah ve Elhamdülillah','Bismillah ve İnşallah','İnşallah ve Maşallah','Bismillah ve Elhamdülillah'], d:0, k:'sukur', a:'Beğeni için maşallah, nimet için Elhamdülillah söylenir.' },
    { s:'Hangisi YANLIŞ bir kullanımdır?', o:['Yemeği bitirince “Bismillah” demek','Yola çıkarken “Bismillah” demek','Gelecek plan için “İnşallah” demek','Güzel bir şey görünce “Maşallah” demek'], d:0, k:'besmele', a:'Besmele işin başında söylenir; yemek bitince Elhamdülillah denir.' }
  ]
},

/* ───────────── 4. SINIF · 5. ÜNİTE ───────────── */
's4-u5': {
  baslik: 'İslam Dini ve Temizlik',
  giris: 'Temizliği “beş bölmeli bir çanta” gibi düşün: Her bölme temizliğin bir alanıdır. En önemli bölme gözle görünmez: kalp temizliği.',
  kartlar: [
    { id:'beden', kavram:'Beden temizliği', kelime:'VÜCUT', simge:'🧼', neden:'Sabun, vücudumuzu temizlemek için kullandığımız en tanıdık araçtır.',
      somut:'Çantanın 1. bölmesi: sabun ve havlu.', sinir:'Beden temizliği yalnızca güzel görünmek için değil, sağlık ve ibadete hazırlık içindir.',
      tanim:'Ellerimizi, dişlerimizi, saçımızı ve bütün vücudumuzu temiz tutmaktır. Abdest de beden temizliğini içerir.',
      anlam:'VÜCUT kelimesi bu temizliğin doğrudan bedenimizle ilgili olduğunu hatırlatır.',
      gunluk:'Yemekten önce ve sonra ellerini yıkamak, dişlerini fırçalamak.',
      karisan:{ ad:'Kalp temizliği', fark:'Beden temizliği görünen temizliktir; kalp temizliği kötü duygulardan arınmaktır.' },
      soru:{ s:'Diş fırçalamak hangi temizliğe örnektir?', o:['Beden temizliği','Çevre temizliği','Kalp temizliği'], d:0 } },
    { id:'giysi', kavram:'Giysi temizliği', kelime:'ELBİSE', simge:'👕', neden:'Tişört, her gün giydiğimiz kıyafetleri hatırlatır.',
      somut:'Çantanın 2. bölmesi: katlanmış temiz tişört.', sinir:'Temiz giysi pahalı giysi demek değildir; önemli olan temiz ve düzenli olmasıdır.',
      tanim:'Giydiğimiz kıyafetleri temiz ve düzenli tutmaktır. Temiz giysi hem sağlık hem saygı işaretidir.',
      anlam:'ELBİSE kelimesi bu temizliğin kıyafetlerimizle ilgili olduğunu hatırlatır.',
      gunluk:'Kirlenen formanı yıkanmak üzere çamaşır sepetine koymak.',
      karisan:{ ad:'Beden temizliği', fark:'Beden temizliği vücudumuzla, giysi temizliği giydiklerimizle ilgilidir.' },
      soru:{ s:'Kirlenen kıyafeti değiştirmek hangi temizliktir?', o:['Giysi temizliği','Kalp temizliği','Çevre temizliği'], d:0 } },
    { id:'ev', kavram:'Ev ve okul temizliği', kelime:'YAŞAM ALANI', simge:'🏫', neden:'Okul binası, her gün birlikte yaşadığımız ortak alanları hatırlatır.',
      somut:'Çantanın 3. bölmesi: düzenli kalem kutusu ve defterler.', sinir:'Bu temizlik yalnızca görevlilerin işi değildir; her birimizin sorumluluğudur.',
      tanim:'Odamızı, evimizi, sınıfımızı ve okulumuzu temiz ve düzenli tutmaktır.',
      anlam:'YAŞAM ALANI kelimesi her gün içinde bulunduğumuz yerleri hatırlatır.',
      gunluk:'Teneffüsten sonra sırandaki kâğıtları çöp kutusuna atmak.',
      karisan:{ ad:'Çevre temizliği', fark:'Ev ve okul temizliği kapalı yaşam alanlarımızla, çevre temizliği sokak, park ve doğayla ilgilidir.' },
      soru:{ s:'Sınıfı toplamak hangi temizliğe örnektir?', o:['Ev ve okul temizliği','Beden temizliği','Kalp temizliği'], d:0 } },
    { id:'cevre', kavram:'Çevre temizliği', kelime:'DOĞA', simge:'🌳', neden:'Ağaç, hepimizin ortak evi olan doğayı hatırlatır.',
      somut:'Çantanın 4. bölmesi: piknikte çöpleri topladığımız poşet.', sinir:'Çevre temizliği yalnızca çöp toplamak değildir; suyu ve doğayı korumak da bu temizliğe girer.',
      tanim:'Sokakları, parkları, suları ve doğayı temiz tutmak, kirletmemektir.',
      anlam:'DOĞA kelimesi bu temizliğin hepimizin ortak alanıyla ilgili olduğunu hatırlatır.',
      gunluk:'Parkta yediğin şeyin ambalajını yere değil çöp kutusuna atmak.',
      karisan:{ ad:'Ev ve okul temizliği', fark:'Çevre temizliği ortak dış alanlarla, ev ve okul temizliği yaşadığımız iç mekânlarla ilgilidir.' },
      soru:{ s:'Musluğu açık bırakmamak ve suyu kirletmemek hangi temizlikle ilgilidir?', o:['Çevre temizliği','Giysi temizliği','Beden temizliği'], d:0 } },
    { id:'kalp', kavram:'Kalp temizliği (manevi temizlik)', kelime:'İÇ', simge:'💚', neden:'Kalp simgesi duygularımızı temsil eder; kalp temizliği de duygu ve düşüncelerimizle ilgilidir.',
      somut:'Çantanın 5. ve en önemli bölmesi: gözle görünmez ama en çok özen istenir.', sinir:'Buradaki “kalp” vücudumuzdaki organ değil, duygu ve düşüncelerimizdir.',
      tanim:'Kıskançlık, kin, yalan ve kötü düşüncelerden uzak durmaktır. Kültürümüzde iç temizliği de denir.',
      anlam:'İÇ kelimesi bu temizliğin dışarıdan görünmeyen iç dünyamızla ilgili olduğunu hatırlatır.',
      gunluk:'Arkadaşına küstüğünde barışmak, onu kıskanmak yerine başarısına sevinmek.',
      karisan:{ ad:'Beden temizliği', fark:'Beden temizliği görünür; kalp temizliği görünmez ama davranışlarımıza yansır.' },
      soru:{ s:'Kıskançlıktan uzak durmak hangi temizliktir?', o:['Kalp temizliği','Beden temizliği','Çevre temizliği'], d:0 } }
  ],
  senaryo: [
    { s:'Mert piknikten dönerken bütün çöpleri poşete topladı.', o:['Çevre temizliği','Kalp temizliği','Giysi temizliği','Beden temizliği'], d:0, k:'cevre', a:'Doğayı temiz tutmak çevre temizliğidir.' },
    { s:'Ayşe arkadaşının başarısını kıskanmak yerine onu tebrik etti.', o:['Kalp temizliği','Ev ve okul temizliği','Beden temizliği','Giysi temizliği'], d:0, k:'kalp', a:'Kötü duygulardan arınmak kalp temizliğidir.' },
    { s:'Emre okula gitmeden önce formasının temiz olup olmadığına baktı.', o:['Giysi temizliği','Çevre temizliği','Kalp temizliği','Ev ve okul temizliği'], d:0, k:'giysi', a:'Kıyafetle ilgili olduğu için giysi temizliğidir.' },
    { s:'Defne nöbetçi olduğu gün sınıfın tahtasını sildi ve sıraları düzenledi.', o:['Ev ve okul temizliği','Beden temizliği','Kalp temizliği','Giysi temizliği'], d:0, k:'ev', a:'Ortak yaşam alanını temiz tutmak ev ve okul temizliğidir.' }
  ],
  karsilastir: [
    { s:'Gözle görülemeyen ama davranışlara yansıyan temizlik hangisidir?', o:['Kalp temizliği','Beden temizliği'], d:0, k:'kalp', a:'Kalp temizliği iç dünyamızla ilgilidir.' },
    { s:'Okul bahçesindeki ağaçları korumak hangisidir?', o:['Çevre temizliği','Ev ve okul temizliği'], d:0, k:'cevre', a:'Doğayı, ağaçları korumak çevre temizliğidir. Sınıfı toplamak ise ev ve okul temizliğidir.' },
    { s:'Abdest almak hangisinin içinde yer alır?', o:['Beden temizliği','Giysi temizliği'], d:0, k:'beden', a:'Abdestte el, yüz, ayak gibi organlar yıkanır; bu beden temizliğidir.' }
  ],
  etkinlikler: [
    { tur:'grup', baslik:'Davranışları çantanın doğru bölmesine yerleştir',
      kovalar:['🧼 Beden','👕 Giysi','🏫 Ev ve okul','🌳 Çevre','💚 Kalp'],
      ogeler:[['Tırnaklarımı kesmek',0],['Lekelenen gömleğimi değiştirmek',1],['Odamı toplamak',2],['Sahilde çöp toplamak',3],['Kırdığım arkadaşımdan özür dilemek',4],['Yemekten önce el yıkamak',0],['Ağaçlara zarar vermemek',3],['Kin tutmamak',4]],
      a:'Her bölme temizliğin farklı bir alanıdır; hepsi birlikte “temiz bir insan” olmayı anlatır.' }
  ],
  uygula: [
    { s:'Bir öğrenci dışarıdan çok temiz ve düzenli görünüyor ama arkadaşlarıyla sürekli alay ediyor. Hangi temizlikte eksiği vardır?', o:['Kalp temizliği','Beden temizliği','Giysi temizliği','Çevre temizliği'], d:0, k:'kalp', a:'Dış temizlik yetmez; kalbi kötü davranışlardan temizlemek de gerekir.' },
    { s:'Hangisi birden fazla temizlik alanına örnek olur?', o:['Pikniğe temiz kıyafetle gidip dönüşte çöpleri toplamak','Sadece dişlerini fırçalamak','Sadece odasını toplamak','Sadece ellerini yıkamak'], d:0, k:'cevre', a:'Temiz kıyafet giysi temizliği, çöpleri toplamak çevre temizliğidir.' }
  ]
},

/* ───────────── 4. SINIF · 6. ÜNİTE ───────────── */
's4-u6': {
  baslik: 'Allah Sevgisi',
  giris: 'Kelime-i tevhit ve kelime-i şehadet birbirine çok benzer. Aradaki farkı iki kelimeyle hatırla: BİR ve ŞAHİT.',
  kartlar: [
    { id:'tevhit', kavram:'Kelime-i Tevhit', kelime:'BİR', simge:'☝️', neden:'Yukarı kalkan tek parmak “bir”i gösterir; kelime-i tevhit de Allah’ın bir olduğunu anlatır.',
      somut:'Tek parmakla “bir” işareti yapmak.', sinir:'İşaret yalnızca hatırlatmadır; asıl önemli olan cümlenin anlamına kalpten inanmaktır.',
      tanim:'“Lâ ilâhe illallah Muhammedün resûlullah” cümlesidir: Allah’tan başka ilah yoktur, Hz. Muhammed O’nun elçisidir.',
      anlam:'BİR kelimesi “tevhit” sözcüğünün anlamını taşır: birlemek, Allah’ın bir olduğunu kabul etmek.',
      gunluk:'Namazda ve dualarda bu cümleyi tekrar ederek imanımızı dile getirmek.',
      karisan:{ ad:'Kelime-i Şehadet', fark:'İkisi de aynı inancı anlatır. Kelime-i şehadette bu inanca “şahitlik ederim” (eşhedü) diyerek tanıklık ederiz.' },
      soru:{ s:'Kelime-i tevhit hangi inancı anlatır?', o:['Allah’ın bir olduğunu ve Hz. Muhammed’in O’nun elçisi olduğunu','Yalnızca meleklerin varlığını','Ahiret gününü'], d:0 } },
    { id:'sehadet', kavram:'Kelime-i Şehadet', kelime:'ŞAHİT', simge:'🙋', neden:'Söz alan öğrenci “ben de biliyorum, söylüyorum” der; şahitlik de bildiğini açıkça söylemektir.',
      somut:'Bir olayı gören kişinin “Ben gördüm, şahidim” demesi.', sinir:'Burada gözle görmek değil, kalpten inanıp dille açıkça söylemek kastedilir.',
      tanim:'“Eşhedü en lâ ilâhe illallah ve eşhedü enne Muhammeden abdühû ve rasûlühû” cümlesidir: Şahitlik ederim ki Allah’tan başka ilah yoktur; yine şahitlik ederim ki Muhammed O’nun kulu ve elçisidir.',
      anlam:'ŞAHİT kelimesi cümledeki “eşhedü” (şahitlik ederim) ifadesini hatırlatır.',
      gunluk:'Doğru bildiğin bir şeyi açıkça ve dürüstçe söylemek.',
      karisan:{ ad:'Kelime-i Tevhit', fark:'Fark, şehadette “eşhedü – şahitlik ederim” sözünün bulunmasıdır.' },
      soru:{ s:'Kelime-i şehadeti tevhitten ayıran ifade hangisidir?', o:['Eşhedü (şahitlik ederim)','Bismillah','Âmin'], d:0 } },
    { id:'amentu', kavram:'Âmentü duası', kelime:'İNANDIM LİSTESİ', simge:'📋', neden:'Liste maddeleri sıralar; Âmentü de imanın esaslarını tek tek sayar.',
      somut:'Madde madde yazılmış bir liste.', sinir:'Âmentü bir alışveriş listesi değildir; her maddesi kalpten inanılan bir esastır.',
      tanim:'“İnandım” anlamına gelen âmentü ile başlar: Allah’a, meleklerine, kitaplarına, peygamberlerine, ahiret gününe, kadere, hayır ve şerrin Allah’tan olduğuna inanmayı sayar.',
      anlam:'İNANDIM LİSTESİ, Âmentü’nün imanın esaslarını sırayla saydığını hatırlatır.',
      gunluk:'Önemli şeyleri unutmamak için madde madde not almak gibi.',
      karisan:{ ad:'Kelime-i Tevhit', fark:'Kelime-i tevhit tek bir cümledir; Âmentü imanın bütün esaslarını sayar.' },
      soru:{ s:'Âmentü duası neyi sayar?', o:['İmanın esaslarını','Namazın farzlarını','Abdestin bölümlerini'], d:0 } }
  ],
  senaryo: [
    { s:'Bir öğrenci “Eşhedü en lâ ilâhe illallah…” diye başlayan cümleyi okuyor. Bu hangisidir?', o:['Kelime-i şehadet','Kelime-i tevhit','Âmentü','Sübhâneke'], d:0, k:'sehadet', a:'“Eşhedü” ile başlayan cümle kelime-i şehadettir.' },
    { s:'Öğretmen “İmanın esaslarını sayan duayı okuyalım” dedi. Hangi dua okunur?', o:['Âmentü','Kelime-i tevhit','Sübhâneke','Besmele'], d:0, k:'amentu', a:'İmanın esaslarını Âmentü sayar.' },
    { s:'“Allah’tan başka ilah yoktur, Muhammed Allah’ın elçisidir” anlamındaki kısa cümle hangisidir?', o:['Kelime-i tevhit','Âmentü','Kelime-i şehadet','Kunut'], d:0, k:'tevhit', a:'“Lâ ilâhe illallah Muhammedün resûlullah” kelime-i tevhittir.' }
  ],
  karsilastir: [
    { s:'İçinde “şahitlik ederim” sözü geçen hangisidir?', o:['Kelime-i şehadet','Kelime-i tevhit'], d:0, k:'sehadet', a:'Eşhedü = şahitlik ederim.' },
    { s:'Tek bir cümleyle Allah’ın birliğini anlatan hangisidir?', o:['Kelime-i tevhit','Âmentü'], d:0, k:'tevhit', a:'Âmentü imanın bütün esaslarını sayan daha uzun bir duadır.' }
  ],
  etkinlikler: [
    { tur:'tamamla', baslik:'Eksik kelimeyi tamamla', secenekler:['bir','şahitlik','inandım','elçisidir'],
      cumleler:[['Kelime-i tevhit, Allah’ın ___ olduğunu anlatır.','bir'],['Kelime-i şehadetteki “eşhedü” sözü ___ ederim demektir.','şahitlik'],['“Âmentü” kelimesi ___ anlamına gelir.','inandım'],['Hz. Muhammed Allah’ın kulu ve ___.','elçisidir']],
      a:'Kelimeleri anlamlarıyla birlikte hatırlamak kalıcı öğrenmeyi sağlar.' }
  ],
  uygula: [
    { s:'Kelime-i tevhit ve kelime-i şehadet için hangisi doğrudur?', o:['İkisi de aynı inancı anlatır; şehadette bu inanca şahitlik edilir','İkisi tamamen farklı inançları anlatır','Şehadette Hz. Muhammed’den söz edilmez','Tevhitte Allah’tan söz edilmez'], d:0, k:'sehadet', a:'İki cümle aynı inancı anlatır; fark “şahitlik ederim” ifadesidir.' }
  ]
},

/* ───────────── 5. SINIF · 1. ÜNİTE ───────────── */
's5-u1': {
  baslik: 'Allah İnancı',
  giris: 'Tevhit ve şirk yalnızca ezberlenecek iki kelime değildir. Hatırlatma kelimeleri anlamı akılda tutmana yardım eder; ama anlamı da mutlaka öğren.',
  baglanti: { metin:'Tevhit ve şirki ayet ve hadislerden çıkarımlarla öğrenmek için:', href:'tevhit-ve-sirk.html', yazi:'Tevhit–Şirk keşif sayfası →' },
  kartlar: [
    { id:'tevhit', kavram:'Tevhit', kelime:'TEK', simge:'☀️', neden:'Güneş sisteminin tek bir merkezi vardır; evrendeki düzen de tek bir yaratıcıyı düşündürür.',
      somut:'Gezegenlerin tek bir güneşin etrafında düzenle dönmesi.', sinir:'Allah güneşe ya da hiçbir varlığa benzemez; benzetme yalnızca “tek merkezli düzen” fikrini hatırlatır.',
      tanim:'Allah’ın bir olduğuna, O’nun eşi, benzeri ve ortağı bulunmadığına inanmaktır.',
      anlam:'TEK kelimesi tevhidin özünü anlatır: Allah birdir, tektir.',
      gunluk:'Evrendeki düzeni, mevsimlerin sırayla gelmesini görünce bu düzenin tek bir Yaratıcı’nın eseri olduğunu düşünmek.',
      karisan:{ ad:'Şirk', fark:'Tevhit Allah’ı bir bilmek, şirk Allah’a ortak koşmaktır.' },
      soru:{ s:'Tevhit nedir?', o:['Allah’ın bir olduğuna inanmak','Allah’a ortak koşmak','Yalnızca dua etmek'], d:0 } },
    { id:'sirk', kavram:'Şirk', kelime:'ORTAK KOŞMAK', simge:'🚫', neden:'Yasak işareti, şirkin tevhit inancına aykırı olduğunu hatırlatır.',
      somut:'Allah’a inanmakla birlikte başka varlıkları da tanrı kabul etmek.', sinir:'Bu kavram bir inancı açıklar; insanları yargılamak için kullanılmaz. Doktordan ya da arkadaşından yardım istemek şirk değildir.',
      tanim:'Allah’a inanmakla birlikte başka varlıkları da tanrı kabul etmek, Allah’a ortak koşmaktır.',
      anlam:'ORTAK KOŞMAK, şirkin anlamını doğrudan anlatır: Allah’ın yanına başka ilahlar koymak.',
      gunluk:'Bir taşın, ağacın ya da muskanın insana kendi başına fayda vereceğine inanmanın neden yanlış olduğunu düşünmek.',
      karisan:{ ad:'Günlük yardımlaşma', fark:'İnsanlardan yardım istemek şirk değildir; şirk, Allah’tan başka bir varlığı ilah kabul etmektir.' },
      soru:{ s:'Şirk nedir?', o:['Allah’a ortak koşmak','Doktordan yardım istemek','Allah’a dua etmek'], d:0 } },
    { id:'esma', kavram:'Esmâ-i hüsnâ', kelime:'GÜZEL İSİMLER', simge:'📛', neden:'İsim kartı birini tanıtır; Esmâ-i hüsnâ da Allah’ı bize tanıtan güzel isimlerdir.',
      somut:'Bir kişiyi tanıtan isim kartı.', sinir:'Allah’ı tam olarak anlatmaya hiçbir isim yetmez; isimler O’nu tanımamıza yardım eder.',
      tanim:'Allah’ın güzel isimleridir. Örneğin er-Rahmân (çok merhametli), el-Alîm (her şeyi bilen), er-Rezzâk (rızık veren), el-Gafûr (çok bağışlayan).',
      anlam:'GÜZEL İSİMLER, “esmâ-i hüsnâ” ifadesinin Türkçe karşılığıdır.',
      gunluk:'Rızkını yediğinde er-Rezzâk ismini, hata yapıp pişman olduğunda el-Gafûr ismini hatırlamak.',
      karisan:{ ad:'Tevhit', fark:'Tevhit Allah’ın bir olduğuna inanmak, Esmâ-i hüsnâ ise O’nu tanıtan isimlerdir.' },
      soru:{ s:'“er-Rezzâk” hangi anlama gelir?', o:['Rızık veren','Her şeyi bilen','Çok bağışlayan'], d:0 } }
  ],
  senaryo: [
    { s:'Mehmet yağmur yağsın diye Allah’a dua etti. Bu davranış hangi inançla uyumludur?', o:['Tevhit','Şirk','Hiçbiri','Kader'], d:0, k:'tevhit', a:'Yalnızca Allah’a yönelip dua etmek tevhit inancıyla uyumludur.' },
    { s:'Eski bir toplum bir heykelin kendilerine yağmur yağdıracağına inanıp ona tapıyordu. Bu hangi kavrama örnektir?', o:['Şirk','Tevhit','Esmâ-i hüsnâ','Dua'], d:0, k:'sirk', a:'Bir varlığı ilah kabul edip ona tapmak şirktir.' },
    { s:'Elif hastalanınca doktora gitti ve aynı zamanda iyileşmek için Allah’a dua etti. Bu durum için hangisi doğrudur?', o:['Tevhit inancıyla uyumludur; doktordan yardım istemek şirk değildir','Doktora gitmek şirktir','Dua etmek gereksizdir','Sadece doktora gitmek yeterlidir, dua şirktir'], d:0, k:'sirk', a:'Sebeplere başvurmak ve Allah’a dua etmek birlikte yapılır; şirk değildir.' }
  ],
  karsilastir: [
    { s:'“Allah birdir, eşi ve ortağı yoktur.”', o:['Tevhit','Şirk'], d:0, k:'tevhit', a:'Allah’ı bir bilmek tevhittir.' },
    { s:'“Allah’ın yanında başka varlıkları da tanrı kabul etmek.”', o:['Şirk','Tevhit'], d:0, k:'sirk', a:'Allah’a ortak koşmak şirktir.' },
    { s:'Allah’ı bize tanıtan güzel isimler hangisidir?', o:['Esmâ-i hüsnâ','Tevhit'], d:0, k:'esma', a:'Esmâ-i hüsnâ Allah’ın güzel isimleridir.' }
  ],
  etkinlikler: [
    { tur:'grup', baslik:'Karıştırılan kavramları ayır', kovalar:['Tevhit inancına uygun','Şirktir','Şirk değildir (günlük yardım)'],
      ogeler:[['Her şeyin yaratıcısının yalnızca Allah olduğuna inanmak',0],['Bir taşı tanrı kabul edip ona tapmak',1],['Ödevinde zorlanınca öğretmeninden yardım istemek',2],['Sıkıntıda Allah’a dua etmek',0],['Güneşin bir tanrı olduğuna inanmak',1],['Hastalanınca doktora gitmek',2]],
      a:'İnsanlardan yardım istemek şirk değildir. Şirk, Allah’tan başka bir varlığı ilah kabul etmektir.' }
  ],
  uygula: [
    { s:'“Evrendeki düzen, tek bir Yaratıcı’yı gösterir.” Bu yargı hangi kavramla en çok ilgilidir?', o:['Tevhit','Şirk','Esmâ-i hüsnâ','Dua'], d:0, k:'tevhit', a:'Düzenin tek bir kaynağı olduğu fikri tevhidi destekler.' },
    { s:'Hata yapıp pişman olan biri Allah’ın hangi ismini hatırlayarak umutlanır?', o:['el-Gafûr','er-Rezzâk','el-Alîm','el-Hâlık'], d:0, k:'esma', a:'el-Gafûr çok bağışlayan demektir.' }
  ]
},

/* ───────────── 5. SINIF · 2. ÜNİTE ───────────── */
's5-u2': {
  baslik: 'Allah’ın Huzurunda Olmak: Namaz İbadeti',
  giris: 'Namazın hareketleri bir zincirin halkaları gibi sırayla gelir. Her halkaya bir hatırlatma kelimesi verdik.',
  kartlar: [
    { id:'kible', kavram:'Kıble', kelime:'YÖN', simge:'🧭', neden:'Pusula yön gösterir; kıble de namazda yöneldiğimiz yöndür.',
      somut:'Pusulanın hep aynı yönü göstermesi.', sinir:'Kıble Kâbe’nin bulunduğu yöndür; Allah bir yerde bulunmaz, kıble Müslümanların ortak yönüdür.',
      tanim:'Namaz kılarken yöneldiğimiz, Kâbe’nin bulunduğu yöndür. Bütün Müslümanları ortak bir merkezde birleştirir.',
      anlam:'YÖN kelimesi kıblenin bir yer değil, bir yöneliş olduğunu hatırlatır.',
      gunluk:'Yeni bir şehirde namaz kılarken telefonla ya da pusulayla kıbleyi bulmak.',
      karisan:{ ad:'Mihrap', fark:'Kıble yöndür; mihrap camide kıble yönünü gösteren duvar girintisidir.' },
      soru:{ s:'Kıble nedir?', o:['Namazda yöneldiğimiz, Kâbe’nin bulunduğu yön','Camideki kürsü','Namazın bir rekâtı'], d:0 } },
    { id:'kiyam', kavram:'Kıyam', kelime:'AYAKTA', simge:'🧍', neden:'Ayakta duran insan figürü kıyamı hatırlatır.',
      somut:'Zincirin 1. halkası: ayakta durmak.', sinir:'Kıyam yalnızca ayakta durmak değildir; huşu içinde Allah’ın huzurunda durmaktır.',
      tanim:'Namazda ayakta durmaktır. Kıyamda Kur’an’dan ayetler okunur (kıraat).',
      anlam:'AYAKTA kelimesi kıyamın duruşunu hatırlatır.',
      gunluk:'Namaza başlarken tekbir alıp ayakta durmak.',
      karisan:{ ad:'Rükû', fark:'Kıyamda dik durulur, rükûda eğilinir.' },
      soru:{ s:'Kıyam nedir?', o:['Namazda ayakta durmak','Namazda eğilmek','Namazda yere kapanmak'], d:0 } },
    { id:'ruku', kavram:'Rükû', kelime:'EĞİL', simge:'🙇', neden:'Öne eğilen figür rükûyu hatırlatır.',
      somut:'Zincirin 2. halkası: elleri dizlere koyup eğilmek.', sinir:'Rükû bir selamlaşma eğilmesi değildir; yalnızca Allah için yapılan bir ibadet hareketidir.',
      tanim:'Kıyamdan sonra elleri dizlere koyarak öne eğilmektir.',
      anlam:'EĞİL kelimesi rükûdaki hareketi hatırlatır.',
      gunluk:'Rükûda “Sübhâne rabbiye’l-azîm” denir.',
      karisan:{ ad:'Rekât', fark:'Rükû bir harekettir; rekât ise kıyam, kıraat, rükû ve iki secdeden oluşan bölümün adıdır.' },
      soru:{ s:'Rükû nedir?', o:['Elleri dizlere koyarak eğilmek','Ayakta durmak','Oturmak'], d:0 } },
    { id:'secde', kavram:'Secde', kelime:'YERE KAPAN', simge:'🤲', neden:'Açık eller teslimiyeti hatırlatır; secde Allah’a en yakın olunan andır.',
      somut:'Zincirin 3. halkası: alnı ve burnu yere koymak.', sinir:'Secde yalnızca Allah’a yapılır; başka hiçbir varlığa secde edilmez.',
      tanim:'Alnı, burnu, elleri, dizleri ve ayak parmaklarını yere koyarak kapanmaktır. Her rekâtta iki secde vardır.',
      anlam:'YERE KAPAN kelimesi secdenin hareketini ve tevazuyu hatırlatır.',
      gunluk:'Peygamberimize göre secde, kulun Allah’a en yakın olduğu andır.',
      karisan:{ ad:'Rükû', fark:'Rükûda eğilinir, secdede yere kapanılır.' },
      soru:{ s:'Her rekâtta kaç secde vardır?', o:['İki','Bir','Dört'], d:0 } },
    { id:'rekat', kavram:'Rekât', kelime:'BÖLÜM', simge:'🔁', neden:'Tekrar eden döngü işareti rekâtların sırayla tekrarlanmasını hatırlatır.',
      somut:'Zincirin bütün halkalarından oluşan bir tur.', sinir:'Rekât tek bir hareket değil, hareketlerden oluşan bütün bir bölümdür.',
      tanim:'Namazın kıyam, kıraat, rükû ve iki secdeden oluşan her bir bölümüdür.',
      anlam:'BÖLÜM kelimesi rekâtın namazın bir parçası olduğunu hatırlatır.',
      gunluk:'Sabah namazının farzı iki rekâttır.',
      karisan:{ ad:'Rükû', fark:'Rükû bir hareket, rekât ise birçok hareketten oluşan bölümdür.' },
      soru:{ s:'Rekât nedir?', o:['Kıyam, kıraat, rükû ve iki secdeden oluşan bölüm','Yalnızca eğilme hareketi','Kıblenin adı'], d:0 } }
  ],
  senaryo: [
    { s:'Ahmet otelde namaz kılmadan önce Kâbe’nin hangi yönde olduğunu öğrenmek istedi. Neyi arıyor?', o:['Kıbleyi','Rekâtı','Secdeyi','Rükûyu'], d:0, k:'kible', a:'Namazda yönelinen yön kıbledir.' },
    { s:'Namazda imam eğilip ellerini dizlerine koydu. Cemaat hangi hareketi yapıyor?', o:['Rükû','Secde','Kıyam','Selam'], d:0, k:'ruku', a:'Eğilmek rükûdur.' },
    { s:'Zehra sabah namazının farzını kıldığını, iki tur kıyam-rükû-secde yaptığını anlatıyor. “Tur” yerine hangi kavramı kullanmalı?', o:['Rekât','Kıble','Kıyam','Ezan'], d:0, k:'rekat', a:'Bu hareketlerden oluşan her bir bölüme rekât denir.' }
  ],
  karsilastir: [
    { s:'Namazda yapılan bir HAREKET hangisidir?', o:['Rükû','Rekât'], d:0, k:'ruku', a:'Rükû harekettir; rekât birçok hareketten oluşan bölümdür.' },
    { s:'Kâbe’nin bulunduğu yön hangisidir?', o:['Kıble','Mihrap'], d:0, k:'kible', a:'Mihrap camide kıble yönünü gösteren girintidir.' },
    { s:'Yere kapanmak hangisidir?', o:['Secde','Rükû'], d:0, k:'secde', a:'Secdede yere kapanılır, rükûda eğilinir.' }
  ],
  etkinlikler: [
    { tur:'sira', baslik:'Bir rekâtın hareketlerini sıraya diz', sira:['Kıyam (ayakta durma) ve kıraat','Rükû (eğilme)','Rükûdan doğrulma','Birinci secde','İkinci secde'],
      a:'Bir rekât: kıyam ve kıraat → rükû → doğrulma → iki secde.' }
  ],
  uygula: [
    { s:'“Namaz kılan biri ayakta durur, eğilir ve yere kapanır.” Bu cümlede sırasıyla hangi kavramlar anlatılmıştır?', o:['Kıyam, rükû, secde','Rükû, kıyam, secde','Secde, rükû, kıyam','Kıble, rekât, secde'], d:0, k:'kiyam', a:'Ayakta durmak kıyam, eğilmek rükû, yere kapanmak secdedir.' },
    { s:'Dört rekâtlık bir namazda toplam kaç secde yapılır?', o:['Sekiz','Dört','İki','On altı'], d:0, k:'rekat', a:'Her rekâtta iki secde vardır: 4 × 2 = 8.' }
  ]
},

/* ───────────── 5. SINIF · 5. ÜNİTE ───────────── */
's5-u5': {
  baslik: 'Mimarimizde Dinî Motifler',
  giris: 'Caminin bölümlerini işlevleriyle hatırla: Her bölümün bir “görev kelimesi” var.',
  kartlar: [
    { id:'mihrap', kavram:'Mihrap', kelime:'YÖN GÖSTEREN', simge:'🕳️', neden:'Duvardaki girinti şekli mihrabın kendisini hatırlatır.',
      somut:'Duvarda kıble yönünü gösteren oyuk.', sinir:'Mihrap kutsal bir nesne değildir; kıble yönünü gösterir ve imamın namaz kıldırdığı yerdir.',
      tanim:'İmamın namaz kıldırdığı yeri ve kıble yönünü gösteren, duvardaki girintili bölümdür.',
      anlam:'YÖN GÖSTEREN kelimesi mihrabın kıble yönünü belirttiğini hatırlatır.',
      gunluk:'Camiye girince mihraba bakarak kıbleyi bulmak.',
      karisan:{ ad:'Minber', fark:'Mihrap girintidir, imam namaz kıldırır; minber merdivenlidir, hutbe okunur.' },
      soru:{ s:'Mihrabın görevi nedir?', o:['Kıble yönünü göstermek','Ezan okumak','Abdest almak'], d:0 } },
    { id:'minber', kavram:'Minber', kelime:'BASAMAK – HUTBE', simge:'🪜', neden:'Merdiven, minberin basamaklı yapısını hatırlatır.',
      somut:'Mihrabın sağındaki merdivenli yüksek yer.', sinir:'Minber bir sahne değildir; hutbe okunurken cemaatin imamı görüp duyması içindir.',
      tanim:'Cuma ve bayram hutbelerinin okunduğu, merdiven basamaklı yüksek kürsüdür.',
      anlam:'BASAMAK – HUTBE: Basamaklı yapısı ve hutbe görevi.',
      gunluk:'Cuma namazında imamın hutbe için basamaklardan çıkması.',
      karisan:{ ad:'Vaaz kürsüsü', fark:'Minberde hutbe okunur; kürsüde oturarak vaaz verilir.' },
      soru:{ s:'Minberde ne okunur?', o:['Hutbe','Ezan','Kamet'], d:0 } },
    { id:'kursu', kavram:'Vaaz kürsüsü', kelime:'OTURARAK ANLAT', simge:'🪑', neden:'Sandalye, kürsüde oturarak konuşulmasını hatırlatır.',
      somut:'Cami içinde yükseltilmiş oturma yeri.', sinir:'Kürsü bir öğretmen masası değildir ama işlevi benzerdir: cemaate dinî bilgi anlatmak.',
      tanim:'Cemaate dinî bilgiler anlatmak (vaaz vermek) için kullanılan yükseltilmiş kürsüdür.',
      anlam:'OTURARAK ANLAT: Vaiz kürsüde oturur ve anlatır.',
      gunluk:'Cuma namazından önce vaizin kürsüde konuşması.',
      karisan:{ ad:'Minber', fark:'Kürsüde vaaz verilir; minberde hutbe okunur.' },
      soru:{ s:'Vaaz kürsüsü ne için kullanılır?', o:['Cemaate dinî bilgi anlatmak','Hutbe okumak','Ezan okumak'], d:0 } },
    { id:'minare', kavram:'Minare', kelime:'ÇAĞRI KULESİ', simge:'🗼', neden:'Yüksek kule, sesin uzağa ulaşması için yükselen minareyi hatırlatır.',
      somut:'Caminin yanında yükselen ince uzun kule.', sinir:'Minare bir gözetleme kulesi değildir; ezanı duyurmak için yapılmıştır.',
      tanim:'Ezanın uzaklara duyurulması için yapılan, caminin yanındaki yüksek kuledir.',
      anlam:'ÇAĞRI KULESİ: Ezan namaza çağrıdır, minare bu çağrıyı yükseltir.',
      gunluk:'Uzaktan bakınca bir caminin yerini minaresinden tanımak.',
      karisan:{ ad:'Kubbe', fark:'Minare ince uzun kuledir; kubbe caminin üstünü örten yarım küredir.' },
      soru:{ s:'Minare ne için yapılmıştır?', o:['Ezanı uzaklara duyurmak için','Abdest almak için','Hutbe okumak için'], d:0 } },
    { id:'kubbe', kavram:'Kubbe', kelime:'ÇATI', simge:'⛺', neden:'Çadırın yuvarlak üstü, kubbenin örtme görevini hatırlatır.',
      somut:'Caminin üstünü örten yarım küre.', sinir:'Kubbe gökyüzünü temsil eden bir süs olarak da yorumlanır; ama asıl görevi geniş bir alanı örtmektir.',
      tanim:'Caminin üzerini örten yarım küre biçimindeki büyük çatıdır.',
      anlam:'ÇATI kelimesi kubbenin örtme görevini hatırlatır.',
      gunluk:'Süleymaniye Camii’nin büyük kubbesi uzaktan görünür.',
      karisan:{ ad:'Minare', fark:'Kubbe örter, minare yükselir.' },
      soru:{ s:'Kubbe nedir?', o:['Caminin üstünü örten yarım küre çatı','Ezan okunan kule','Abdest alınan yer'], d:0 } },
    { id:'sadirvan', kavram:'Şadırvan', kelime:'ABDEST SUYU', simge:'⛲', neden:'Çeşme, şadırvanın musluklu su yapısını hatırlatır.',
      somut:'Avludaki musluklu havuz.', sinir:'Şadırvan bir süs havuzu değildir; abdest almak için kullanılır.',
      tanim:'Cami avlusunda abdest almak için kullanılan musluklu havuzdur.',
      anlam:'ABDEST SUYU: Şadırvanın görevi abdest için su sağlamaktır.',
      gunluk:'Cuma namazından önce şadırvanda abdest almak.',
      karisan:{ ad:'Avlu', fark:'Avlu caminin dış bahçesidir; şadırvan avludaki abdest yeridir.' },
      soru:{ s:'Şadırvanda ne yapılır?', o:['Abdest alınır','Hutbe okunur','Vaaz verilir'], d:0 } }
  ],
  senaryo: [
    { s:'Cuma günü imam merdivenlerden çıkıp hutbe okudu. Neredeydi?', o:['Minberde','Mihrapta','Kürsüde','Minarede'], d:0, k:'minber', a:'Hutbe minberde okunur.' },
    { s:'Bir turist camiye girince “Kıble hangi yönde?” diye sordu. Ona neyi göstermek en doğrudur?', o:['Mihrabı','Kubbeyi','Şadırvanı','Minareyi'], d:0, k:'mihrap', a:'Mihrap kıble yönünü gösterir.' },
    { s:'Namazdan önce avluda abdest almak isteyen biri nereye gider?', o:['Şadırvana','Minbere','Mihraba','Kürsüye'], d:0, k:'sadirvan', a:'Şadırvan abdest almak içindir.' },
    { s:'Vaiz efendi oturarak cemaate ahlak üzerine konuştu. Neredeydi?', o:['Vaaz kürsüsünde','Minberde','Minarede','Mihrapta'], d:0, k:'kursu', a:'Oturarak vaaz verilen yer kürsüdür.' }
  ],
  karsilastir: [
    { s:'Hutbe nerede okunur?', o:['Minber','Kürsü'], d:0, k:'minber', a:'Minberde hutbe, kürsüde vaaz.' },
    { s:'İmam namazı nerede kıldırır?', o:['Mihrap','Minber'], d:0, k:'mihrap', a:'Namaz mihrapta kıldırılır, hutbe minberde okunur.' },
    { s:'Caminin üstünü örten bölüm hangisidir?', o:['Kubbe','Minare'], d:0, k:'kubbe', a:'Kubbe örter; minare yükselir.' }
  ],
  etkinlikler: [
    { tur:'gorsel', baslik:'Cami çiziminde numaralı bölümleri bul', svg:'cami',
      noktalar:[[1,'Kubbe'],[2,'Minare'],[3,'Mihrap'],[4,'Minber'],[5,'Vaaz kürsüsü'],[6,'Şadırvan']],
      a:'Kubbe örter, minare çağırır, mihrap yön gösterir, minberde hutbe okunur, kürsüde vaaz verilir, şadırvanda abdest alınır.' },
    { tur:'duzelt', baslik:'Yanlış eşleştirmeleri düzelt', ciftler:[['Minber','Hutbe okunur','Ezan okunur'],['Mihrap','Kıble yönünü gösterir','Abdest alınır'],['Şadırvan','Abdest alınır','Kıble yönünü gösterir'],['Minare','Ezan okunur','Hutbe okunur']],
      a:'Her bölümün kendi görevi vardır; görev kelimelerini hatırla.' }
  ],
  uygula: [
    { s:'Bir mimar yeni bir cami çiziyor ve “ezan sesi uzaklara ulaşsın” istiyor. Hangi bölümü yüksek yapmalıdır?', o:['Minareyi','Mihrabı','Şadırvanı','Minberi'], d:0, k:'minare', a:'Ezanın uzaklara ulaşması için minare yüksek yapılır.' }
  ]
},

/* ───────────── 6. SINIF · 1. ÜNİTE ───────────── */
's6-u1': {
  baslik: 'Peygamber ve İlahi Kitap İnancı',
  giris: 'Vahiy, tebliğ, peygamber ve mucize birbirine bağlı ama farklı kavramlardır. Her birine ayrı bir simge verdik. Benzetmeler yalnızca hatırlatmak içindir; peygamberlik sıradan bir iletişimle eşit değildir.',
  baglanti: { metin:'Elçi, mühür ve güven kalkanı benzetmeleriyle adım adım keşfetmek için:', href:'peygamberlik.html', yazi:'Peygamberlik keşif sayfası →' },
  kartlar: [
    { id:'vahiy', kavram:'Vahiy', kelime:'İLAHİ MESAJ', simge:'📜', neden:'Mühürlü mektup, Allah’tan gelen özel mesajı hatırlatır.',
      somut:'Gönderenin kendisinden gelen, değiştirilemez bir mektup.', sinir:'Vahiy sıradan bir mektup değildir; Allah’ın peygamberine özel yolla bildirdiği ilahi mesajdır ve yalnızca peygamberlere gelir.',
      tanim:'Allah’ın emir ve yasaklarını peygamberlerine özel bir yolla bildirmesidir. Hz. Muhammed’e vahyi Cebrâil getirmiştir.',
      anlam:'İLAHİ MESAJ: Vahyin kaynağı Allah’tır, alıcısı peygamberdir.',
      gunluk:'Kur’an-ı Kerim, Hz. Muhammed’e gelen vahiylerin toplanmasıyla oluşmuştur.',
      karisan:{ ad:'Tebliğ', fark:'Vahiy Allah’tan peygambere gelir; tebliğ peygamberden insanlara ulaştırılır.' },
      soru:{ s:'Vahiy kimden kime gelir?', o:['Allah’tan peygambere','Peygamberden insanlara','İnsanlardan peygambere'], d:0 } },
    { id:'teblig', kavram:'Tebliğ', kelime:'ULAŞTIRMAK', simge:'📣', neden:'Megafon, bir mesajın insanlara duyurulmasını hatırlatır.',
      somut:'Alınan mesajı eksiksiz olarak herkese duyurmak.', sinir:'Tebliğ bir reklam ya da zorlamayla yapılan duyuru değildir; peygamber mesajı güzellikle ve eksiksiz bildirir, kabul etmeye zorlamaz.',
      tanim:'Peygamberin Allah’tan aldığı mesajı insanlara eksiksiz bildirmesidir. Peygamberlerin temel görevidir.',
      anlam:'ULAŞTIRMAK kelimesi tebliğin yönünü anlatır: peygamberden insanlara.',
      gunluk:'Hz. Muhammed’in Kur’an ayetlerini insanlara okuyup açıklaması.',
      karisan:{ ad:'Vahiy', fark:'Vahiyde mesaj peygambere GELİR; tebliğde peygamber mesajı insanlara GÖTÜRÜR.' },
      soru:{ s:'Tebliğ nedir?', o:['Alınan ilahi mesajı insanlara bildirmek','Allah’ın peygambere mesaj göndermesi','Olağanüstü bir olay'], d:0 } },
    { id:'peygamber', kavram:'Peygamber (Resul · Nebi)', kelime:'ELÇİ', simge:'🕊️', neden:'Barış güvercini, iyi haber getiren elçiyi hatırlatır.',
      somut:'Güvenilir bir elçinin mesajı olduğu gibi iletmesi.', sinir:'Peygamber sıradan bir postacı değildir; Allah’ın seçtiği, örnek ahlaklı, güvenilir bir insandır.',
      tanim:'Allah’ın mesajını insanlara bildirmek için seçtiği elçidir. Kur’an’da peygamberler için resul (elçi) ve nebi (haberci) kavramları kullanılır.',
      anlam:'ELÇİ kelimesi “resul” kavramının Türkçe karşılığıdır.',
      gunluk:'Peygamberlerin doğruluk (sıdk), güvenilirlik (emanet), akıllılık (fetanet) ve günahsızlık (ismet) özellikleri vardır.',
      karisan:{ ad:'Melek', fark:'Cebrâil vahyi peygambere getiren melektir; peygamber ise insanlara bildiren insandır.' },
      soru:{ s:'“Resul” kelimesinin anlamı nedir?', o:['Elçi','Mucize','Kitap'], d:0 } },
    { id:'mucize', kavram:'Mucize', kelime:'ONAY MÜHRÜ', simge:'🔏', neden:'Mühür bir belgenin gerçek olduğunu onaylar; mucize de peygamberin doğruluğunu gösterir.',
      somut:'Resmî belgenin üzerindeki onay mührü.', sinir:'Mucize peygamberin kendi gücüyle yaptığı bir gösteri ya da sihir değildir; Allah’ın izniyle gerçekleşir.',
      tanim:'Peygamberin doğruluğunu gösteren, Allah’ın izniyle gerçekleşen olağanüstü olaydır. Hz. Muhammed’in en büyük mucizesi Kur’an-ı Kerim’dir.',
      anlam:'ONAY MÜHRÜ: Mucize, peygamberliği destekleyen bir onay gibidir.',
      gunluk:'Hz. Mûsâ’ya verilen mucizeler, insanların onun peygamberliğini anlamasına yardım etmiştir.',
      karisan:{ ad:'Sihir', fark:'Sihir bir hiledir; mucize Allah’ın izniyle gerçekleşir ve peygamberliği destekler.' },
      soru:{ s:'Mucize kimin izniyle gerçekleşir?', o:['Allah’ın','Peygamberin kendi gücüyle','İnsanların isteğiyle'], d:0 } }
  ],
  senaryo: [
    { s:'Hira mağarasında Hz. Muhammed’e ilk ayetler bildirildi. Bu olay hangi kavramla ilgilidir?', o:['Vahiy','Tebliğ','Mucize','Sihir'], d:0, k:'vahiy', a:'Allah’tan peygambere mesaj gelmesi vahiydir.' },
    { s:'Hz. Muhammed ayetleri önce yakınlarına, sonra bütün insanlara okudu. Bu hangi kavramdır?', o:['Tebliğ','Vahiy','Mucize','İsmet'], d:0, k:'teblig', a:'Mesajı insanlara bildirmek tebliğdir.' },
    { s:'Bir peygamberin, Allah’ın izniyle insanların benzerini yapamayacağı olağanüstü bir olayı göstermesi hangi kavramdır?', o:['Mucize','Tebliğ','Vahiy','Fetanet'], d:0, k:'mucize', a:'Peygamberliği destekleyen olağanüstü olay mucizedir.' }
  ],
  karsilastir: [
    { s:'Mesajın Allah’tan peygambere gelmesi hangisidir?', o:['Vahiy','Tebliğ'], d:0, k:'vahiy', a:'Vahiy GELİR, tebliğ GÖTÜRÜLÜR.' },
    { s:'Mesajın peygamberden insanlara ulaştırılması hangisidir?', o:['Tebliğ','Vahiy'], d:0, k:'teblig', a:'Tebliğ insanlara bildirmektir.' },
    { s:'Allah’ın izniyle gerçekleşen olay hangisidir?', o:['Mucize','Sihir'], d:0, k:'mucize', a:'Sihir hiledir; mucize Allah’ın izniyle olur.' }
  ],
  etkinlikler: [
    { tur:'sira', baslik:'Mesajın yolculuğunu sırala', sira:['Allah mesajı gönderir','Cebrâil vahyi peygambere getirir','Peygamber mesajı insanlara tebliğ eder','İnsanlar mesajı öğrenir ve yaşar'],
      a:'Kaynak Allah’tır; vahiy peygambere gelir, peygamber tebliğ eder.' },
    { tur:'esles', baslik:'Kavramı simgesiyle eşleştir', ciftler:[['Vahiy','📜 Mühürlü mektup'],['Tebliğ','📣 Duyuru'],['Peygamber','🕊️ Güvenilir elçi'],['Mucize','🔏 Onay mührü']],
      a:'Her kavramın simgesi farklıdır; aynı simgeyi iki kavrama vermiyoruz.' }
  ],
  uygula: [
    { s:'“Peygamber kendisine gelen mesajı değiştirmeden insanlara bildirmiştir.” Bu cümle hangi iki kavramı birlikte anlatır?', o:['Vahiy ve tebliğ','Mucize ve sihir','Nebi ve kitap','Tebliğ ve mucize'], d:0, k:'teblig', a:'Gelen mesaj vahiy, bildirilmesi tebliğdir.' }
  ]
},

/* ───────────── 6. SINIF · 2. ÜNİTE ───────────── */
's6-u2': {
  baslik: 'Ramazan ve Oruç',
  giris: 'Ramazan kavramlarının çoğu bir oruç gününün saatlerine yerleşir. Kavramları bir saat üzerinde düşün.',
  kartlar: [
    { id:'sahur', kavram:'Sahur', kelime:'ÖNCESİ', simge:'🌙', neden:'Hilal, gece karanlığında kalkıp yenen sahur yemeğini hatırlatır.',
      somut:'Saat imsaktan önce, gece yenen yemek.', sinir:'Sahur bir “ziyafet” değildir; oruca hazırlık için yenen yemektir.',
      tanim:'Oruç tutmak için imsaktan önce yenilen yemek vaktidir.',
      anlam:'ÖNCESİ kelimesi sahurun imsaktan ÖNCE olduğunu hatırlatır.',
      gunluk:'Ramazanda gece kalkıp ailece sahur yapmak.',
      karisan:{ ad:'İmsak', fark:'Sahur yemek vaktidir; imsak orucun başladığı andır. Sahur imsaktan önce biter.' },
      soru:{ s:'Sahur ne zaman yapılır?', o:['İmsaktan önce','İftardan sonra','Öğle vakti'], d:0 } },
    { id:'imsak', kavram:'İmsak', kelime:'BAŞLANGIÇ', simge:'⏰', neden:'Çalar saat, belli bir anı haber verir; imsak da orucun başladığı andır.',
      somut:'Saatin “şimdi başla” dediği an.', sinir:'İmsak bir yemek değildir; yemenin ve içmenin bittiği, orucun başladığı vakittir.',
      tanim:'Oruca başlama vaktidir. İmsaktan iftara kadar yemek ve içmek bırakılır.',
      anlam:'BAŞLANGIÇ kelimesi imsakın orucun başladığı an olduğunu hatırlatır.',
      gunluk:'İmsakiyeye bakarak imsak vaktini öğrenmek.',
      karisan:{ ad:'Sahur', fark:'Sahur yemektir, imsak başlangıç anıdır.' },
      soru:{ s:'İmsak nedir?', o:['Oruca başlama vakti','Orucu açma vakti','Ramazan’da kılınan namaz'], d:0 } },
    { id:'iftar', kavram:'İftar', kelime:'AÇILIŞ', simge:'🌇', neden:'Güneşin batışı, orucun açıldığı akşam vaktini hatırlatır.',
      somut:'Güneş batınca sofraya oturmak.', sinir:'İftar yalnızca yemek değildir; şükürle ve paylaşarak yapılan bir buluşmadır.',
      tanim:'Akşam vaktinde orucun açılmasıdır. Orucun açılışında iftar duası okunur.',
      anlam:'AÇILIŞ kelimesi iftarın orucu “açmak” olduğunu hatırlatır.',
      gunluk:'Akşam ezanı okununca hurma ve suyla orucu açmak.',
      karisan:{ ad:'Sahur', fark:'Sahur günün başında, iftar günün sonunda yapılır.' },
      soru:{ s:'İftar ne zaman yapılır?', o:['Akşam vakti, oruç açılırken','Gece, imsaktan önce','Öğle vakti'], d:0 } },
    { id:'teravih', kavram:'Teravih namazı', kelime:'RAMAZAN GECESİ', simge:'🕌', neden:'Cami simgesi, teravihin genellikle camide cemaatle kılınmasını hatırlatır.',
      somut:'Yatsıdan sonra camide cemaatle kılınan namaz.', sinir:'Teravih farz değil sünnettir.',
      tanim:'Ramazan’da yatsı namazından sonra kılınan (genellikle yirmi rekât) sünnet namazdır.',
      anlam:'RAMAZAN GECESİ: Teravih yalnızca Ramazan gecelerinde kılınır.',
      gunluk:'Ailece teravih namazına camiye gitmek.',
      karisan:{ ad:'Yatsı namazı', fark:'Yatsı her gün kılınan farz namazdır; teravih Ramazan’da yatsıdan sonra kılınan sünnet namazdır.' },
      soru:{ s:'Teravih namazı ne zaman kılınır?', o:['Ramazan’da yatsıdan sonra','Her gün sabahleyin','Bayram sabahı'], d:0 } },
    { id:'fitre', kavram:'Fitre', kelime:'BAYRAM ÖNCESİ PAYLAŞIM', simge:'🎁', neden:'Hediye paketi, bayram öncesinde ihtiyaç sahiplerine verilen yardımı hatırlatır.',
      somut:'Bayramdan önce ihtiyaç sahibine verilen yardım.', sinir:'Fitre gönüllü bir bağış değil, şartları taşıyan Müslümanlar için vacip olan bir sadakadır.',
      tanim:'Temel ihtiyaçlarından fazla olarak nisap miktarı mala sahip Müslümanların Ramazan ayında vermesi vacip olan sadakadır.',
      anlam:'BAYRAM ÖNCESİ PAYLAŞIM: Fitre, ihtiyaç sahiplerinin de bayramı sevinçle karşılaması için verilir.',
      gunluk:'Ailenin, bayramdan önce fitresini bir ihtiyaç sahibine ulaştırması.',
      karisan:{ ad:'Zekât', fark:'Fitre Ramazan’a özgüdür ve kişi başına verilir; zekât malın belli bir oranıdır ve yılda bir verilir.' },
      soru:{ s:'Fitre hangi ayda verilir?', o:['Ramazan ayında','Kurban Bayramı’nda','Her ayın başında'], d:0 } }
  ],
  senaryo: [
    { s:'Saat 04.10’da imsak var. Ailesi saat 03.30’da kalkıp yemek yedi. Bu yemeğin adı nedir?', o:['Sahur','İftar','İmsak','Teravih'], d:0, k:'sahur', a:'İmsaktan önce yenen yemek sahurdur.' },
    { s:'Akşam ezanı okununca Elif hurmayla orucunu açtı. Bu hangisidir?', o:['İftar','Sahur','İmsak','Fitre'], d:0, k:'iftar', a:'Orucu açmak iftardır.' },
    { s:'Ramazan’da yatsıdan sonra camide cemaatle kılınan sünnet namaz hangisidir?', o:['Teravih','Bayram namazı','Cuma namazı','Sabah namazı'], d:0, k:'teravih', a:'Ramazan gecelerinde yatsıdan sonra teravih kılınır.' },
    { s:'Babası bayramdan önce ihtiyaç sahibi bir aileye vacip olan sadakayı ulaştırdı. Bu hangisidir?', o:['Fitre','İftar','Teravih','İmsak'], d:0, k:'fitre', a:'Ramazan’da verilmesi vacip olan sadaka fitredir.' }
  ],
  karsilastir: [
    { s:'Yemek değil, orucun başladığı AN hangisidir?', o:['İmsak','Sahur'], d:0, k:'imsak', a:'İmsak başlangıç anıdır; sahur ondan önce yenen yemektir.' },
    { s:'Ramazan’a özgü olan ve kişi başına verilen hangisidir?', o:['Fitre','Zekât'], d:0, k:'fitre', a:'Zekât yılda bir, malın belli oranıyla verilir; fitre Ramazan’a özgüdür.' },
    { s:'Her gün kılınan farz namaz hangisidir?', o:['Yatsı','Teravih'], d:0, k:'teravih', a:'Teravih sünnettir ve yalnızca Ramazan’da kılınır.' }
  ],
  etkinlikler: [
    { tur:'sira', baslik:'Bir oruç gününü saat sırasına diz', sira:['Sahur yemeği','İmsak (oruç başlar)','Gün boyu oruç','İftar (oruç açılır)','Teravih namazı'],
      a:'Sahur imsaktan önce, iftar akşam, teravih yatsıdan sonradır.' }
  ],
  uygula: [
    { s:'Bir öğrenci “Sahur bitti, şimdi imsak yemeğini yiyelim” dedi. Yanlışı nedir?', o:['İmsak bir yemek değil, orucun başladığı vakittir','Sahur akşam yapılır','İmsak iftardan sonra gelir','Hiçbir yanlışı yoktur'], d:0, k:'imsak', a:'İmsak başlangıç vaktidir; o andan itibaren yenmez ve içilmez.' }
  ]
},

/* ───────────── 7. SINIF · 2. ÜNİTE ───────────── */
's7-u2': {
  baslik: 'Hac, Umre ve Kurban',
  giris: 'Hac bir yolculuktur: Her durağın bir hatırlatma kelimesi var. Hac ile umrenin farkını da bu kartlarla ayırt et.',
  kartlar: [
    { id:'ihram', kavram:'İhram', kelime:'GİRİŞ KAPISI', simge:'🚪', neden:'Kapı, haccın ya da umrenin başlangıcını hatırlatır: ihramla bu ibadete girilir.',
      somut:'Mîkat sınırında niyet edip ihram giymek.', sinir:'İhram yalnızca bir kıyafet değildir; niyetle birlikte bazı davranışları kendine yasaklamaktır.',
      tanim:'Hac ya da umreye niyet edip mîkat sınırında ihrama girmektir; erkekler dikişsiz iki parça ihram giyer.',
      anlam:'GİRİŞ KAPISI: Hac ve umre ihramla başlar.',
      gunluk:'Herkesin aynı sade ihramı giymesi, zengin–fakir farkını ortadan kaldırır.',
      karisan:{ ad:'Mîkat', fark:'Mîkat ihrama girilen sınır bölgedir; ihram bu sınırda girilen durumdur.' },
      soru:{ s:'İhrama nerede girilir?', o:['Mîkat sınırında','Arafat’ta','Mina’da'], d:0 } },
    { id:'tavaf', kavram:'Tavaf', kelime:'DÖNMEK', simge:'🔄', neden:'Dönen ok işareti tavafı hatırlatır: Kâbe’nin etrafında dönmek.',
      somut:'Kâbe’nin etrafında yedi kez dönmek.', sinir:'Tavafta Kâbe’ye değil, Allah’a ibadet edilir; Kâbe yön birliğinin merkezidir.',
      tanim:'Kâbe’nin etrafında yedi kez dönmektir. Haccın farzlarından biridir; umrede de yapılır.',
      anlam:'DÖNMEK kelimesi tavafın hareketini hatırlatır.',
      gunluk:'Hacıların Mekke’den ayrılmadan önce veda tavafı yapması.',
      karisan:{ ad:'Sa’y', fark:'Tavafta Kâbe’nin etrafında dönülür; sa’yde Safâ ile Merve arasında gidip gelinir.' },
      soru:{ s:'Tavaf nedir?', o:['Kâbe’nin etrafında yedi kez dönmek','Safâ ile Merve arasında yürümek','Arafat’ta beklemek'], d:0 } },
    { id:'say', kavram:'Sa’y', kelime:'GİDİP GELMEK', simge:'↔️', neden:'Çift yönlü ok, Safâ ile Merve arasında gidip gelmeyi hatırlatır.',
      somut:'İki tepe arasında yedi kez gidip gelmek.', sinir:'Sa’y bir koşu yarışı değildir; Hz. Hacer’in su arayışını hatırlatan bir ibadettir.',
      tanim:'Safâ ile Merve tepeleri arasında yedi kez gidip gelmektir. Hem hacda hem umrede yapılır.',
      anlam:'GİDİP GELMEK, sa’yin iki nokta arasındaki hareketini anlatır.',
      gunluk:'Hz. Hacer’in oğlu Hz. İsmail için su ararken iki tepe arasında koşması hatırlanır.',
      karisan:{ ad:'Tavaf', fark:'Sa’y düz bir hatta gidip gelmektir; tavaf daire çizerek dönmektir.' },
      soru:{ s:'Sa’y hangi iki tepe arasında yapılır?', o:['Safâ ile Merve','Arafat ile Mina','Mekke ile Medine'], d:0 } },
    { id:'vakfe', kavram:'Vakfe', kelime:'BEKLEMEK', simge:'⛰️', neden:'Dağ simgesi, vakfenin yapıldığı Arafat’ı hatırlatır.',
      somut:'Arafat’ta belirli bir süre durup dua etmek.', sinir:'Vakfe bir mola değildir; haccın en önemli rüknüdür.',
      tanim:'Arafat’ta belirli bir süre bulunmaktır. Haccın farzıdır; umrede vakfe yoktur.',
      anlam:'BEKLEMEK kelimesi vakfenin “durmak, beklemek” anlamını hatırlatır.',
      gunluk:'Hacıların Arafat’ta dua ederek vakfeye durması.',
      karisan:{ ad:'Umre', fark:'Vakfe yalnızca hacda vardır; umrede vakfe, şeytan taşlama ve kurban kesme yoktur.' },
      soru:{ s:'Vakfe nerede yapılır?', o:['Arafat’ta','Safâ’da','Mîkat’ta'], d:0 } },
    { id:'umre', kavram:'Umre', kelime:'KÜÇÜK ZİYARET', simge:'🧳', neden:'Küçük bavul, daha kısa ve yılın her zamanı yapılabilen ziyareti hatırlatır.',
      somut:'İhram, tavaf ve sa’yden oluşan kısa ziyaret.', sinir:'Umre haccın yerini tutmaz; hac farz, umre sünnettir.',
      tanim:'Yılın belirli günleri dışında her zaman yapılabilen, ihram, tavaf ve sa’yden oluşan ibadettir. Hac farz, umre sünnettir.',
      anlam:'KÜÇÜK ZİYARET: Umre hacca göre daha kısadır ve zamanı serbesttir.',
      gunluk:'Bir ailenin ramazanda umreye gitmesi.',
      karisan:{ ad:'Hac', fark:'Hac belli günlerde yapılır ve vakfe içerir; umre her zaman yapılabilir ve vakfe içermez.' },
      soru:{ s:'Umrede hangisi YAPILMAZ?', o:['Vakfe','Tavaf','Sa’y'], d:0 } }
  ],
  senaryo: [
    { s:'Hacılar Kâbe’nin etrafında yedi kez döndü. Bu hangi ibadettir?', o:['Tavaf','Sa’y','Vakfe','İhram'], d:0, k:'tavaf', a:'Kâbe’nin etrafında dönmek tavaftır.' },
    { s:'Bir hacı Safâ’dan Merve’ye, Merve’den Safâ’ya yedi kez yürüdü. Bu hangisidir?', o:['Sa’y','Tavaf','Vakfe','Kurban'], d:0, k:'say', a:'İki tepe arasında gidip gelmek sa’ydir.' },
    { s:'Zilhicce’nin 9. günü hacılar Arafat’ta toplanıp dua etti. Bu hangisidir?', o:['Vakfe','Tavaf','Sa’y','Umre'], d:0, k:'vakfe', a:'Arafat’ta bulunmak vakfedir.' },
    { s:'Bir aile Mart ayında Mekke’ye gidip ihram, tavaf ve sa’y yaptı. Bu ibadet hangisidir?', o:['Umre','Hac','Kurban','Vakfe'], d:0, k:'umre', a:'Yılın her zamanı yapılabilen, vakfesiz ibadet umredir.' }
  ],
  karsilastir: [
    { s:'Kâbe’nin etrafında dönmek hangisidir?', o:['Tavaf','Sa’y'], d:0, k:'tavaf', a:'Tavaf döner, sa’y gidip gelir.' },
    { s:'Vakfe hangisinde vardır?', o:['Hac','Umre'], d:0, k:'vakfe', a:'Umrede vakfe yoktur.' },
    { s:'Farz olan hangisidir?', o:['Hac','Umre'], d:0, k:'umre', a:'Hac farz, umre sünnettir.' }
  ],
  etkinlikler: [
    { tur:'sira', baslik:'Hac yolculuğunun duraklarını sırala', sira:['Mîkat’ta ihrama girmek','Arafat’ta vakfe','Müzdelife’de gece vakfesi','Mina’da şeytan taşlama','Mekke’den ayrılırken veda tavafı'],
      a:'Hac ihramla başlar, Arafat vakfesiyle zirveye ulaşır, veda tavafıyla tamamlanır.' },
    { tur:'grup', baslik:'Hac ile umreyi ayır', kovalar:['Hem hacda hem umrede var','Yalnızca hacda var'],
      ogeler:[['İhram',0],['Tavaf',0],['Sa’y',0],['Arafat’ta vakfe',1],['Şeytan taşlama',1],['Hac kurbanı',1]],
      a:'Umrede vakfe, şeytan taşlama ve kurban kesme yoktur.' }
  ],
  uygula: [
    { s:'Bir öğrenci “Umreye giden kişi hac görevini de yapmış olur” diyor. Hangi bilgi bu düşünceyi düzeltir?', o:['Umrede Arafat vakfesi yoktur; hac belirli günlerde yapılan farz bir ibadettir','Umrede tavaf yapılmaz','Hacda ihrama girilmez','Hac sünnettir'], d:0, k:'umre', a:'Umre haccın yerini tutmaz.' }
  ]
},

/* ───────────── 8. SINIF · 1. ÜNİTE (LGS) ───────────── */
's8-u1': {
  baslik: 'Kaza ve Kader İnancı',
  giris: 'Kader, kaza, irade, sorumluluk ve tevekkül LGS’de en çok karıştırılan kavramlardır. Hatırlatma kelimeleri yalnızca kapı açar; sorular anlamı bilmeden çözülemez.',
  lgs: true,
  kartlar: [
    { id:'kader', kavram:'Kader', kelime:'ÖLÇÜ', simge:'📏', neden:'Cetvel ölçmeyi hatırlatır; kader de Allah’ın her şeyi bir ölçüye göre takdir etmesidir.',
      somut:'Bir mimarın binayı yapmadan önce her şeyin ölçüsünü belirlemesi.', sinir:'Benzetme sınırlıdır: Allah’ın bilgisi mimarın planı gibi sonradan oluşmaz, ezelîdir. Kader insanı bir şeye zorlamaz.',
      tanim:'Allah’ın evrende olacak her şeyi ezelden bilmesi, zamanını, yerini ve özelliklerini belirlemesidir.',
      anlam:'ÖLÇÜ kelimesi kaderin “takdir etmek, ölçüyle belirlemek” anlamını hatırlatır.',
      ayet:{ m:'Gerçekten biz, her şeyi bir ölçü ve dengede yarattık.', k:'Kamer suresi, 49. ayet' },
      gunluk:'Suyun 100 derecede kaynaması, mevsimlerin sırası gibi değişmeyen yasalar kaderin evrendeki ölçüsünü gösterir.',
      karisan:{ ad:'Kaza', fark:'Kader planlamadır (takdir), kaza o takdirin zamanı gelince gerçekleşmesidir. Kaza kaderden sonra gelir.' },
      soru:{ s:'Kader nedir?', o:['Allah’ın olacak her şeyi ezelden bilip ölçüsünü belirlemesi','Takdir edilenin zamanı gelince gerçekleşmesi','İnsanın seçme gücü'], d:0 } },
    { id:'kaza', kavram:'Kaza', kelime:'GERÇEKLEŞME', simge:'✅', neden:'Onay işareti, bir işin tamamlanıp gerçekleştiğini hatırlatır.',
      somut:'Planlanan binanın zamanı gelince inşa edilip tamamlanması.', sinir:'Burada “kaza”, günlük dildeki trafik kazası anlamında değildir; dinî kavram olarak takdirin gerçekleşmesidir.',
      tanim:'Allah’ın ezelde takdir ettiği şeylerin, zamanı ve yeri gelince bilgisi, iradesi ve kudretiyle gerçekleşmesidir.',
      anlam:'GERÇEKLEŞME kelimesi kazanın kaderin “uygulanması” olduğunu hatırlatır.',
      gunluk:'Bir tohumun belli şartlar oluşunca filizlenmesi, takdir edilenin zamanı gelince gerçekleşmesine örnektir.',
      karisan:{ ad:'Günlük dildeki “kaza”', fark:'Günlük dilde kaza istenmeden olan kötü olaydır; dinî kavram olarak kaza takdirin gerçekleşmesidir.' },
      soru:{ s:'Kader ile kaza arasındaki ilişki nedir?', o:['Kaza, kaderin zamanı gelince gerçekleşmesidir','Kader, kazanın gerçekleşmesidir','İkisi tamamen ilgisizdir'], d:0 } },
    { id:'irade', kavram:'Cüz’î irade', kelime:'SEÇİM DÜĞMESİ', simge:'🔘', neden:'Düğme, bir seçeneği seçip seçmemenin bize bırakıldığını hatırlatır.',
      somut:'Önündeki iki düğmeden birine basma kararı.', sinir:'Düğmeleri biz yapmadık: Seçme gücünü Allah verdi (külli irade). Biz yalnızca seçeriz.',
      tanim:'İnsanın iyi ile kötü arasında seçim yapabilme gücüdür. Allah’ın sınırsız iradesine külli irade denir.',
      anlam:'SEÇİM DÜĞMESİ: Cüz’î irade insanın seçme özgürlüğüdür.',
      gunluk:'Ders çalışmak ile telefonda vakit geçirmek arasında karar vermek.',
      karisan:{ ad:'Külli irade', fark:'Cüz’î irade insanın sınırlı seçme gücüdür; külli irade Allah’ın sınırsız iradesidir.' },
      soru:{ s:'Cüz’î irade nedir?', o:['İnsanın seçme gücü','Allah’ın sınırsız iradesi','Değişmeyen doğa yasaları'], d:0 } },
    { id:'sorumluluk', kavram:'Sorumluluk', kelime:'SONUÇ KARTI', simge:'🧾', neden:'Fiş, yaptığımız alışverişin kaydını tutar; sorumluluk da seçimlerimizin sonucunu üstlenmektir.',
      somut:'Seçtiğin düğmenin sonucunu gösteren kart.', sinir:'Sorumluluk gücün ölçüsündedir: Gücümüzün yetmediği şeyden sorumlu tutulmayız.',
      tanim:'İnsanın, akıl ve irade sahibi olduğu için seçimlerinin sonuçlarını üstlenmesidir. Sorumluluk kişinin gücü ölçüsündedir.',
      anlam:'SONUÇ KARTI: Her seçimin bir sonucu vardır ve o sonuç bize aittir.',
      gunluk:'Ödevi yapmamayı seçen öğrencinin düşük notu “kader” diye açıklaması yanlıştır; sorumluluk onun seçimine aittir.',
      karisan:{ ad:'Kader', fark:'Kader insanın seçimini ortadan kaldırmaz; insan kendi seçiminden sorumludur.' },
      soru:{ s:'İnsan neden yaptıklarından sorumludur?', o:['Akıl ve seçme gücü (irade) olduğu için','Kader onu zorladığı için','Hiçbir şeyi seçemediği için'], d:0 } },
    { id:'tevekkul', kavram:'Tevekkül', kelime:'ÇABA + GÜVEN', simge:'🌱', neden:'Tohum ekilir, sulanır, sonra büyümesi beklenir: önce çaba, sonra güven.',
      somut:'Çiftçinin tarlayı sürüp tohumu ekmesi, sonra yağmur ve hasat için Allah’a güvenmesi.', sinir:'Tevekkül sürecin sonudur, başı değil: Hiç çalışmadan “Allah’a bıraktım” demek tevekkül değildir.',
      tanim:'Gereken her türlü çabayı gösterip tedbiri aldıktan sonra sonucu Allah’a bırakmak ve O’na güvenmektir.',
      anlam:'ÇABA + GÜVEN: Sıra önemlidir; önce çaba, sonra güven.',
      ayet:{ m:'Bir kere de karar verip azmettin mi, artık Allah’a tevekkül et, (ona dayanıp güven). Şüphesiz Allah, tevekkül edenleri sever.', k:'Âl-i İmrân suresi, 159. ayet (kısaltılarak)' },
      gunluk:'Sınava iyi hazırlanıp sonra kaygılanmadan “Elimden geleni yaptım, gerisini Allah’a bırakıyorum” demek.',
      karisan:{ ad:'Tembellik (tevâkül)', fark:'Çalışmadan sonucu beklemek tevekkül değil tembelliktir.' },
      soru:{ s:'Tevekkülde doğru sıra hangisidir?', o:['Önce çaba ve tedbir, sonra Allah’a güven','Önce güven, sonra hiçbir şey yapmamak','Yalnızca çaba, güvene gerek yok'], d:0 } }
  ],
  senaryo: [
    { s:'Kemal sınava hiç çalışmadı ve “Kaderimde ne varsa o olur” dedi. Kemal hangi kavramı yanlış anlamıştır?', o:['Tevekkül ve sorumluluk','Kaza','Külli irade','Rızık'], d:0, k:'tevekkul', a:'Çaba göstermeden sonucu beklemek tevekkül değildir; Kemal seçiminden sorumludur.' },
    { s:'Bir ilaç fabrikası her ilacı belirli ölçülerle üretir; ölçü değişirse ilaç işe yaramaz. Bu durum en çok hangi kavramı somutlaştırır?', o:['Kader (ölçü)','Tevekkül','Cüz’î irade','Kaza (günlük dil)'], d:0, k:'kader', a:'Ölçü ve düzen, kaderin evrendeki yansımasıdır.' },
    { s:'Selin arkadaşına yalan söylemek ile doğruyu söylemek arasında kaldı ve doğruyu söyledi. Bu seçimde hangi kavram öne çıkar?', o:['Cüz’î irade','Kaza','Külli irade','Ecel'], d:0, k:'irade', a:'İki seçenek arasında karar vermek cüz’î iradedir.' }
  ],
  karsilastir: [
    { s:'“Takdir edilenin zamanı gelince gerçekleşmesi.”', o:['Kaza','Kader'], d:0, k:'kaza', a:'Kader takdir, kaza gerçekleşme.' },
    { s:'“Allah’ın sınırsız iradesi.”', o:['Külli irade','Cüz’î irade'], d:0, k:'irade', a:'Cüz’î irade insanın sınırlı seçme gücüdür.' },
    { s:'“Çalışmadan sonucu beklemek.”', o:['Tembellik','Tevekkül'], d:0, k:'tevekkul', a:'Tevekkül çabadan sonra gelir.' }
  ],
  etkinlikler: [
    { tur:'grup', baslik:'Kartları doğru kavrama yerleştir', kovalar:['📏 Kader','✅ Kaza','🔘 Cüz’î irade','🌱 Tevekkül'],
      ogeler:[['Allah’ın her şeyi ezelden bilmesi',0],['Takdir edilenin zamanı gelince olması',1],['Ödev mi oyun mu diye karar vermek',2],['Hazırlanıp sonucu Allah’a bırakmak',3],['Evrendeki her şeyin bir ölçüsünün olması',0],['Doğru sözü söylemeyi seçmek',2]],
      a:'Kader ve kaza Allah’la, cüz’î irade insanın seçimiyle ilgilidir; tevekkül çabadan sonraki güvendir.' }
  ],
  uygula: []
},

/* ───────────── 8. SINIF · 2. ÜNİTE (LGS) ───────────── */
's8-u2': {
  baslik: 'Zekât ve Sadaka',
  giris: 'Zekât, sadaka, fitre ve infak hepsi “paylaşmak”tır; ama kimin, ne zaman, ne kadar vereceği farklıdır. Hatırlatma kelimeleri bu farkı tutar.',
  lgs: true,
  kartlar: [
    { id:'zekat', kavram:'Zekât', kelime:'FARZ PAY', simge:'🧮', neden:'Hesap makinesi, zekâtın ölçüsü belli bir hesapla verildiğini hatırlatır.',
      somut:'Birikimin üzerinden bir yıl geçince belli bir oranın hesaplanıp verilmesi.', sinir:'Zekât bir vergi değildir; Allah rızası için yapılan farz bir ibadettir.',
      tanim:'Dinen zengin sayılan Müslümanın, nisap miktarı malı üzerinden bir yıl geçince malının belli bir oranını ihtiyaç sahiplerine vermesidir. Farzdır.',
      anlam:'FARZ PAY: Zekât zorunludur ve ölçüsü bellidir.',
      gunluk:'Nisap miktarı birikimi olan bir ailenin, yılı dolunca zekâtını hesaplayıp vermesi.',
      karisan:{ ad:'Sadaka', fark:'Zekât farzdır, ölçüsü ve zamanı bellidir; sadaka gönüllüdür, miktarı serbesttir.' },
      soru:{ s:'Zekât için hangisi doğrudur?', o:['Farzdır, ölçüsü ve zamanı bellidir','Gönüllüdür, miktarı serbesttir','Yalnızca Ramazan’da verilir'], d:0 } },
    { id:'nisap', kavram:'Nisap', kelime:'EŞİK', simge:'🚧', neden:'Bariyer bir sınırı gösterir; nisap da zekât yükümlülüğünün başladığı sınırdır.',
      somut:'Bir yarışmaya katılmak için gereken en düşük puan barajı.', sinir:'Nisap bir “zenginlik yarışı” değildir; zekâtla yükümlü olmanın mali ölçüsüdür.',
      tanim:'Zekât için gereken mali yeterlilik ölçüsüdür. Temel ihtiyaçlar ve borçlar dışında bu miktara sahip olan zekâtla yükümlü olur.',
      anlam:'EŞİK: Nisabın altında kalan zekâtla yükümlü değildir, üstündeki yükümlüdür.',
      gunluk:'Birikimi nisap miktarının altında olan bir öğretmen zekât vermekle yükümlü değildir.',
      karisan:{ ad:'Zekât', fark:'Nisap ölçüdür (sınır), zekât verilen paydır.' },
      soru:{ s:'Nisap nedir?', o:['Zekâtla yükümlü olmanın mali ölçüsü','Zekât olarak verilen para','Ramazan’da verilen sadaka'], d:0 } },
    { id:'sadaka', kavram:'Sadaka ve infak', kelime:'GÖNÜLLÜ İYİLİK', simge:'🤝', neden:'Uzanan eller, karşılık beklemeden yapılan yardımı hatırlatır.',
      somut:'Miktarı ve zamanı serbest olan her türlü iyilik.', sinir:'Sadaka yalnızca para değildir: Güler yüz, bilgi, emek de sadakadır. İnfak, Allah rızası için imkânları paylaşmanın genel adıdır.',
      tanim:'Allah rızası için gönüllü olarak yapılan her türlü yardım ve iyiliktir. İnfak, sahip olunan imkânları ihtiyaç sahipleriyle paylaşmaktır.',
      anlam:'GÖNÜLLÜ İYİLİK: Sadaka zorunlu değildir, gönülden yapılır.',
      gunluk:'Ders çalışmakta zorlanan arkadaşına konuyu anlatmak, güler yüz göstermek.',
      karisan:{ ad:'Zekât', fark:'Sadaka gönüllü ve serbesttir; zekât farz ve ölçülüdür.' },
      soru:{ s:'Hangisi sadakaya örnektir?', o:['Arkadaşına güler yüz göstermek','Nisap miktarının belli oranını yılda bir vermek','Bayramdan önce vacip olan payı vermek'], d:0 } },
    { id:'fitre', kavram:'Fitre (fıtır sadakası)', kelime:'RAMAZAN PAYI', simge:'🌙', neden:'Hilal Ramazan ayını hatırlatır; fitre Ramazan’da verilir.',
      somut:'Bayramdan önce ailenin her ferdi için verilen pay.', sinir:'Fitre gönüllü sadaka değil, şartları taşıyanlar için vacip olan özel bir sadakadır.',
      tanim:'Ramazan ayında, ailenin her ferdi adına verilmesi vacip olan özel bir sadakadır.',
      anlam:'RAMAZAN PAYI: Fitrenin zamanı Ramazan’dır ve kişi başına verilir.',
      gunluk:'Bir babanın bayramdan önce kendisi ve çocukları için fitre vermesi.',
      karisan:{ ad:'Zekât', fark:'Fitre kişi başına ve Ramazan’da; zekât malın oranına göre ve yıllık verilir.' },
      soru:{ s:'Fitre ne zaman verilir?', o:['Ramazan ayında','Kurban Bayramı’nda','Malın üzerinden yıl geçince'], d:0 } },
    { id:'cariye', kavram:'Sadaka-i câriye', kelime:'AKAN İYİLİK', simge:'🚰', neden:'Akan çeşme, faydası sürekli devam eden iyiliği hatırlatır.',
      somut:'Yapıldıktan sonra yıllarca insanlara su veren bir çeşme.', sinir:'Sadaka-i câriye büyük ve pahalı olmak zorunda değildir; faydası devam eden her iyilik olabilir.',
      tanim:'Yapıldıktan sonra da fayda üretmeye devam eden sadakadır. “Câriye” akan, devam eden demektir.',
      anlam:'AKAN İYİLİK: Câriye kelimesinin anlamı “akan”dır.',
      gunluk:'Okul kütüphanesine kitap bağışlamak, ağaç dikmek.',
      karisan:{ ad:'Sadaka', fark:'Her sadaka iyiliktir; sadaka-i câriyenin faydası yapıldıktan sonra da devam eder.' },
      soru:{ s:'Hangisi sadaka-i câriyeye örnektir?', o:['Köye çeşme yaptırmak','Bir kereliğine yemek ısmarlamak','Güler yüz göstermek'], d:0 } }
  ],
  senaryo: [
    { s:'Ayşe Hanım’ın birikimi nisap miktarının üzerinde ve üzerinden bir yıl geçti. Ne yapmalıdır?', o:['Zekâtını vermelidir','Yalnızca fitre vermelidir','Hiçbir şey yapmasına gerek yoktur','Yalnızca sadaka-i câriye yapmalıdır'], d:0, k:'zekat', a:'Nisap + bir yıl şartları oluşunca zekât farz olur.' },
    { s:'Emre okulundaki ihtiyaç sahibi bir arkadaşına kendi harçlığıyla kitap aldı. Bu hangisidir?', o:['Sadaka','Zekât','Fitre','Nisap'], d:0, k:'sadaka', a:'Gönüllü yapılan, miktarı serbest iyilik sadakadır.' },
    { s:'Bir hayırsever köydeki okula kütüphane yaptırdı; öğrenciler yıllardır kitap okuyor. Bu hangisidir?', o:['Sadaka-i câriye','Fitre','Zekât','Nisap'], d:0, k:'cariye', a:'Faydası devam eden sadaka câriyedir.' }
  ],
  karsilastir: [
    { s:'Farz, ölçüsü ve zamanı belli olan hangisidir?', o:['Zekât','Sadaka'], d:0, k:'zekat', a:'Sadaka gönüllüdür.' },
    { s:'Ramazan’da kişi başına verilen hangisidir?', o:['Fitre','Zekât'], d:0, k:'fitre', a:'Zekât yıllık ve malın oranına göredir.' },
    { s:'Zekâtla yükümlü olmanın sınırı hangisidir?', o:['Nisap','Zekât'], d:0, k:'nisap', a:'Nisap eşik, zekât verilen paydır.' }
  ],
  etkinlikler: [
    { tur:'grup', baslik:'Paylaşma türlerini ayır', kovalar:['🧮 Zekât','🌙 Fitre','🤝 Sadaka','🚰 Sadaka-i câriye'],
      ogeler:[['Nisap miktarı malın üzerinden yıl geçince verilir',0],['Bayramdan önce kişi başına verilir',1],['Güler yüz göstermek',2],['Okula kütüphane yaptırmak',3],['Malın belli oranı (çoğunlukla kırkta biri) verilir',0],['Yolda zorlanan yaşlıya yardım etmek',2],['Mahalleye ağaç dikmek',3],['Ramazan’da ailenin her ferdi adına verilir',1]],
      a:'Hepsi paylaşmaktır; farkı kimin, ne zaman, ne kadar vereceğindedir.' }
  ],
  uygula: []
}

};

/* ───────────── 8. SINIF LGS SORULARI: her kavram için 5 tür ─────────────
   temel · senaryo · cikarim · karistirma · yeni   (anahtar = kart id) */
window.HAFIZA_VERI['s8-u1'].lgsSorular = [
  /* KADER */
  { k:'kader', tip:'temel', s:'Kader inancıyla ilgili aşağıdakilerden hangisi doğrudur?', o:['Allah’ın olacak her şeyi ezelden bilmesi ve ölçüsünü belirlemesidir','İnsanın seçme gücünün olmadığını gösterir','Yalnızca kötü olayları kapsar','İnsanın kendi geleceğini önceden bilmesidir'], d:0, a:'Kader Allah’ın bilmesi ve takdir etmesidir; insanı zorlamaz.' },
  { k:'kader', tip:'senaryo', s:'Bir astronom gezegenlerin hareketlerini yüzlerce yıl önceden hesaplayabildiğini söylüyor. Bu durum kader inancının hangi yönüyle ilişkilidir?', o:['Evrendeki her şeyin bir ölçü ve düzene göre yaratılmasıyla','İnsanın seçme özgürlüğüyle','Tevekkülün çalışmadan beklemek olmasıyla','Rızkın yalnızca para olmasıyla'], d:0, a:'Hesaplanabilir düzen, kaderin evrendeki ölçüsünü gösterir (Kamer, 49).' },
  { k:'kader', tip:'cikarim', s:'“Gerçekten biz, her şeyi bir ölçü ve dengede yarattık.” (Kamer, 49) Bu ayetten hangi sonuç çıkarılabilir?', o:['Evrende rastgelelik değil, Allah’ın belirlediği bir ölçü vardır','İnsan hiçbir şey seçemez','Ölçüler insanlar tarafından belirlenir','Doğa yasaları zaman zaman kendiliğinden değişir'], d:0, a:'Ayet evrendeki ölçü ve dengeyi vurgular; insanın iradesini ortadan kaldırdığını söylemez.' },
  { k:'kader', tip:'karistirma', s:'“Allah’ın takdir ettiği bir şeyin zamanı gelince gerçekleşmesi” aşağıdakilerden hangisidir?', o:['Kaza','Kader','Tevekkül','Cüz’î irade'], d:0, a:'Bu tanım kazadır; kader takdirin kendisidir. Kodu bilen ama anlamı bilmeyen burada şaşırır.' },
  { k:'kader', tip:'yeni', s:'Bir öğrenci “Madem kader var, o hâlde ders çalışmamın bir anlamı yok” diyor. Bu düşüncedeki hata nedir?', o:['Kader insanı zorlamaz; insan seçimlerinden sorumludur','Kader yalnızca büyükler için geçerlidir','Ders çalışmak kaderle çelişir','Kader yalnızca doğa olaylarını kapsar'], d:0, a:'Kaderi bahane etmek yanlıştır; çaba ve seçim insana aittir.' },
  /* KAZA */
  { k:'kaza', tip:'temel', s:'Kaza kavramı için hangisi doğrudur?', o:['Takdir edilen şeyin zamanı ve yeri gelince gerçekleşmesidir','Allah’ın olacakları önceden bilmesidir','Trafikte yaşanan kötü olaydır','İnsanın seçme gücüdür'], d:0, a:'Dinî kavram olarak kaza, takdirin gerçekleşmesidir.' },
  { k:'kaza', tip:'senaryo', s:'Tarladaki buğday, gerekli şartlar (su, güneş, zaman) oluşunca başak verdi. Bu durum hangi kavramla açıklanabilir?', o:['Kaza','Tevekkül','Cüz’î irade','Nisap'], d:0, a:'Belirlenen şartlar içinde takdirin gerçekleşmesi kazadır.' },
  { k:'kaza', tip:'cikarim', s:'“Kaza, kaderden sonra gelir.” cümlesinden hangisi çıkarılır?', o:['Önce takdir edilir, sonra zamanı gelince gerçekleşir','Önce gerçekleşir, sonra takdir edilir','İkisi aynı anda ve aynı anlamdadır','Kaza kaderi değiştirir'], d:0, a:'Kader plan, kaza uygulamadır.' },
  { k:'kaza', tip:'karistirma', s:'“Kaza geçirdi” sözündeki “kaza” ile dinî kavram olan “kaza” arasındaki fark nedir?', o:['Günlük dilde istenmeyen olay, dinî kavramda takdirin gerçekleşmesi anlamındadır','İkisi tamamen aynıdır','Dinî kavram yalnızca trafik olaylarını anlatır','Günlük dildeki anlam kaderi anlatır'], d:0, a:'Aynı kelimenin iki farklı anlamı vardır; kavram sorularında bu ayrım önemlidir.' },
  { k:'kaza', tip:'yeni', s:'Bir bilim insanı, belli sıcaklıkta suyun her seferinde kaynadığını gözlemliyor. Bu gözlemde hangi iki kavram birlikte görülür?', o:['Ölçünün belirlenmesi (kader) ve zamanı gelince gerçekleşmesi (kaza)','Tevekkül ve sorumluluk','Cüz’î irade ve külli irade','Zekât ve nisap'], d:0, a:'Ölçü kaderle, her seferinde gerçekleşmesi kazayla ilgilidir.' },
  /* CÜZ'Î İRADE */
  { k:'irade', tip:'temel', s:'Cüz’î irade için hangisi doğrudur?', o:['İnsanın iyi ile kötü arasında seçim yapma gücüdür','Allah’ın sınırsız iradesidir','Doğa yasalarının adıdır','Yalnızca peygamberlere verilmiştir'], d:0, a:'Cüz’î irade insana verilen sınırlı seçme gücüdür.' },
  { k:'irade', tip:'senaryo', s:'Kerem bulduğu cüzdanı sahibine vermek ile kendine saklamak arasında kaldı ve sahibine verdi. Kerem’in davranışı hangi kavramı en iyi gösterir?', o:['Cüz’î irade','Külli irade','Kaza','Ecel'], d:0, a:'Seçenekler arasında karar vermek cüz’î iradedir.' },
  { k:'irade', tip:'cikarim', s:'İnsanın seçme gücü olmasaydı aşağıdakilerden hangisi anlamını yitirirdi?', o:['Sorumluluk, ödül ve ceza','Doğa yasaları','Mevsimlerin değişmesi','Gezegenlerin dönmesi'], d:0, a:'Seçme gücü olmayan biri sorumlu tutulamaz.' },
  { k:'irade', tip:'karistirma', s:'“Allah’ın her şeyi kuşatan sınırsız iradesi” hangisidir?', o:['Külli irade','Cüz’î irade','Kaza','Tevekkül'], d:0, a:'Külli irade Allah’a, cüz’î irade insana aittir.' },
  { k:'irade', tip:'yeni', s:'Bir oyun tasarımcısı oyunun kurallarını ve haritasını belirliyor; oyuncular ise hangi yoldan gideceklerini kendileri seçiyor. Bu benzetmede oyuncuların seçimi hangi kavrama karşılık gelir? (Benzetme sınırlıdır.)', o:['Cüz’î irade','Külli irade','Kader','Kaza'], d:0, a:'Oyuncunun seçimi cüz’î iradeye benzetilebilir. Benzetme sınırlıdır: Allah bir oyun tasarımcısı gibi değildir.' },
  /* SORUMLULUK */
  { k:'sorumluluk', tip:'temel', s:'İnsanın sorumluluğu ile ilgili hangisi doğrudur?', o:['Sorumluluk kişinin gücü ölçüsündedir','Herkes her şeyden eşit derecede sorumludur','Çocuklar ve büyükler aynı sorumluluğu taşır','Sorumluluk yalnızca dünyada geçerlidir'], d:0, a:'Allah kimseye gücünün yetmediğini yüklemez.' },
  { k:'sorumluluk', tip:'senaryo', s:'Arda maçta kural dışı hareket yaptı ve kırmızı kart gördü. “Kaderimde varmış” dedi. Bu açıklama neden yanlıştır?', o:['Kural dışı hareketi kendi seçimiyle yaptığı için sorumluluk ona aittir','Kader spor müsabakalarını kapsamaz','Hakem kaderi belirler','Kırmızı kart tevekküldür'], d:0, a:'Kendi seçimimizin sonucunu kadere yüklemek sorumluluktan kaçmaktır.' },
  { k:'sorumluluk', tip:'cikarim', s:'“Akıl hastası ve küçük çocuk dinî bakımdan sorumlu tutulmaz.” Bu bilgiden hangi sonuç çıkar?', o:['Sorumluluğun şartı akıl ve ayırt etme gücüdür','Sorumluluk yaşa bağlı değildir','Herkes eşit sorumludur','Sorumluluk yalnızca zenginler içindir'], d:0, a:'Ayırt etme gücü olmayan sorumlu tutulmaz.' },
  { k:'sorumluluk', tip:'karistirma', s:'Hangisi kader ile sorumluluk ilişkisini doğru açıklar?', o:['Kader, insanın seçme özgürlüğünü ve sorumluluğunu ortadan kaldırmaz','Kader varsa sorumluluk yoktur','Sorumluluk varsa kader yoktur','Kader yalnızca sorumlu olmayanlar içindir'], d:0, a:'İkisi birlikte vardır: Allah bilir ve takdir eder; insan seçer ve sorumlu olur.' },
  { k:'sorumluluk', tip:'yeni', s:'Bir şirket, çevreyi kirletmesine rağmen “Bu bölgenin kaderi buymuş” diye açıklama yaptı. Bu açıklama için en doğru değerlendirme hangisidir?', o:['Kendi tercihinin sonucunu kadere yüklemek yanlıştır; şirket sorumludur','Kader her durumda bahane olabilir','Çevre kirliliği kazadır, kimse sorumlu değildir','Şirket tevekkül etmiştir'], d:0, a:'Sorumluluk seçim yapana aittir; kader bahane edilemez.' },
  /* TEVEKKÜL */
  { k:'tevekkul', tip:'temel', s:'Tevekkül nedir?', o:['Gereken çabayı gösterip tedbiri aldıktan sonra sonucu Allah’a bırakmak','Hiçbir şey yapmadan sonucu beklemek','Yalnızca çalışmak, Allah’a güvenmemek','Sonucu önceden bilmek'], d:0, a:'Tevekkül sürecin sonudur, başı değil.' },
  { k:'tevekkul', tip:'senaryo', s:'Bir çiftçi tarlasını sürdü, tohumu ekti, suladı; sonra “Gerisi Allah’a kalmış” dedi. Bu davranış neye örnektir?', o:['Tevekkül','Tembellik','Kaza','Nisap'], d:0, a:'Önce çaba, sonra güven: tevekkül.' },
  { k:'tevekkul', tip:'cikarim', s:'“Bir kere de karar verip azmettin mi, artık Allah’a tevekkül et.” (Âl-i İmrân, 159) Ayetteki sıralamadan hangi sonuç çıkar?', o:['Tevekkül karar ve azimden sonra gelir','Tevekkül karar vermeden önce yapılır','Karar vermek tevekküle aykırıdır','Azim gereksizdir'], d:0, a:'Ayet sırayı açıkça verir: karar ve azim, sonra tevekkül.' },
  { k:'tevekkul', tip:'karistirma', s:'Hangisi tevekkül DEĞİLDİR?', o:['Arabasını kilitlemeden bırakıp “Allah korur” demek','Sınava hazırlanıp sonra sonucu Allah’a bırakmak','Tedavi olup şifayı Allah’tan beklemek','İşini dikkatle yapıp sonucu Allah’a havale etmek'], d:0, a:'Tedbir almadan beklemek tevekkül değil, tembelliktir.' },
  { k:'tevekkul', tip:'yeni', s:'Bir proje ekibi haftalarca çalıştı, sunumu hazırladı ve sunum sabahı “Elimizden geleni yaptık, sonucu Allah’a bırakıyoruz” dedi. Ekibin tutumu için hangisi söylenebilir?', o:['Çaba ve tedbirden sonra Allah’a güvenmişlerdir','Çalışmadan sonuç beklemişlerdir','Kaderi bahane etmişlerdir','Sorumluluktan kaçmışlardır'], d:0, a:'Doğru sıra izlenmiştir: çaba + güven.' }
];
window.HAFIZA_VERI['s8-u2'].lgsSorular = [
  /* ZEKÂT */
  { k:'zekat', tip:'temel', s:'Zekâtın şartlarıyla ilgili aşağıdakilerden hangisi doğrudur?', o:['Nisap miktarı malı olan Müslümanın, mal üzerinden bir yıl geçince belli bir oranını vermesidir','Her Müslümanın her ay vermesi gereken bağıştır','Yalnızca Ramazan’da kişi başına verilir','Miktarı tamamen serbest olan gönüllü yardımdır'], d:0, a:'Zekâtın şartları: nisap ve üzerinden bir yıl geçmesi.' },
  { k:'zekat', tip:'senaryo', s:'Murat Bey’in temel ihtiyaçları ve borçları dışında nisap miktarından fazla birikimi var ve üzerinden bir yıl geçti. Murat Bey için hangisi söylenebilir?', o:['Zekât vermekle yükümlüdür','Yalnızca sadaka vermelidir','Zekât yükümlülüğü yoktur','Yalnızca fitre vermelidir'], d:0, a:'Şartlar tamam olduğu için zekât farzdır.' },
  { k:'zekat', tip:'cikarim', s:'Zekâtın toplumsal faydası düşünüldüğünde hangisi çıkarılabilir?', o:['Zengin ile yoksul arasındaki uçurumun azalmasına katkı sağlar','Yalnızca vereni ilgilendirir','Toplumu etkilemez','Yoksulluğu artırır'], d:0, a:'Zekât dayanışmayı ve sosyal adaleti güçlendirir.' },
  { k:'zekat', tip:'karistirma', s:'“Gönüllü, miktarı ve zamanı serbest yardım” hangisidir?', o:['Sadaka','Zekât','Fitre','Nisap'], d:0, a:'Zekât farzdır ve ölçülüdür; tanım sadakaya aittir.' },
  { k:'zekat', tip:'yeni', s:'Bir öğrenci “Zekât bir çeşit vergidir, ibadet değildir” diyor. Bu düşünceyi en iyi düzelten cümle hangisidir?', o:['Zekât Allah rızası için yapılan farz bir ibadettir; malı ve kalbi arındırır','Zekât yalnızca devlete ödenir','Zekât isteğe bağlıdır','Zekâtın dinle ilgisi yoktur'], d:0, a:'Zekât bir ibadettir; vergi ile aynı şey değildir.' },
  /* NİSAP */
  { k:'nisap', tip:'temel', s:'Zekât konusundaki “nisap” kavramı aşağıdakilerden hangisidir?', o:['Zekâtla yükümlü olmak için gereken mali yeterlilik ölçüsü','Zekât olarak verilen miktar','Ramazan’da verilen sadaka','Bir kuyu yaptırmak'], d:0, a:'Nisap eşik değerdir.' },
  { k:'nisap', tip:'senaryo', s:'Zeynep Hanım’ın birikimi nisap miktarının altında. Zekât konusunda durumu nedir?', o:['Zekât vermekle yükümlü değildir; ama isterse sadaka verebilir','Zekât vermek zorundadır','Fitre de veremez','Sadaka vermesi yasaktır'], d:0, a:'Nisabın altındaki kişi zekâtla yükümlü değildir.' },
  { k:'nisap', tip:'cikarim', s:'Nisap ölçüsünün olması hangi ilkeyi gösterir?', o:['Kişinin yükümlülüğü gücü ve imkânı ölçüsündedir','Herkes aynı miktarda zekât verir','Zekât yalnızca yoksullara farzdır','Mal miktarının önemi yoktur'], d:0, a:'İmkânı olmayana zekât yüklenmez.' },
  { k:'nisap', tip:'karistirma', s:'Nisap ile zekât arasındaki ilişki hangisinde doğru verilmiştir?', o:['Nisap sınırdır, zekât bu sınırı aşan maldan verilen paydır','Nisap verilen paydır, zekât sınırdır','İkisi aynı şeydir','Nisap Ramazan’da verilen sadakadır'], d:0, a:'Eşik (nisap) ve pay (zekât) ayrı kavramlardır.' },
  { k:'nisap', tip:'yeni', s:'Bir sporcunun milli takıma girebilmesi için belirli bir derece barajını geçmesi gerekiyor. Bu baraj zekât konusunda hangi kavrama benzetilebilir? (Benzetme sınırlıdır.)', o:['Nisap','Fitre','Sadaka-i câriye','İnfak'], d:0, a:'Baraj, yükümlülüğün başladığı sınırı (nisap) hatırlatır; ama nisap bir yarış değildir.' },
  /* SADAKA / İNFAK */
  { k:'sadaka', tip:'temel', s:'Sadaka için hangisi doğrudur?', o:['Gönüllüdür; para dışındaki iyilikler de sadaka olabilir','Yalnızca zenginlere farzdır','Yalnızca para ile verilir','Yalnızca Ramazan’da verilir'], d:0, a:'Güler yüz göstermek bile sadakadır.' },
  { k:'sadaka', tip:'senaryo', s:'Ece, matematik dersinde zorlanan sınıf arkadaşına teneffüslerde konuyu anlattı. Bu davranış hangi kavrama örnektir?', o:['Sadaka (bilgiyi paylaşmak)','Zekât','Fitre','Nisap'], d:0, a:'Bilgi ve emek paylaşmak da sadakadır.' },
  { k:'sadaka', tip:'cikarim', s:'“Güler yüz göstermek bile sadaka sayılır.” cümlesinden hangi sonuç çıkar?', o:['Herkes, imkânı ne olursa olsun sadaka verebilir','Sadaka yalnızca zenginlerin işidir','Sadaka mutlaka para ile olur','Güler yüz bir ibadet değildir'], d:0, a:'Sadaka herkesin yapabileceği bir iyiliktir.' },
  { k:'sadaka', tip:'karistirma', s:'“İnfak” kavramı için hangisi doğrudur?', o:['Allah rızası için imkânları ihtiyaç sahipleriyle paylaşmanın genel adıdır','Yalnızca bayramda verilen paydır','Zekâtla yükümlülük sınırıdır','Trafik kazası anlamına gelir'], d:0, a:'İnfak genel paylaşma kavramıdır; zekât ve sadaka da infakın içindedir.' },
  { k:'sadaka', tip:'yeni', s:'Bir gönüllü grubu, deprem bölgesindeki çocuklar için oyuncak ve kırtasiye topladı. Bu davranış en çok hangisine örnektir?', o:['Sadaka / infak','Nisap','Fitre','Zekâtın şartı'], d:0, a:'Gönüllü paylaşım sadaka ve infaktır.' },
  /* FİTRE */
  { k:'fitre', tip:'temel', s:'Fitre için hangisi doğrudur?', o:['Ramazan’da, ailenin her ferdi adına verilmesi vacip olan sadakadır','Malın üzerinden yıl geçince verilir','Tamamen gönüllüdür ve zamanı yoktur','Kurban Bayramı’nda verilir'], d:0, a:'Fitre Ramazan’a özgü ve kişi başınadır.' },
  { k:'fitre', tip:'senaryo', s:'Dört kişilik bir aile, Ramazan Bayramı’ndan önce dört kişi için ayrı ayrı belirli bir miktar ayırıp ihtiyaç sahibine verdi. Bu hangisidir?', o:['Fitre','Zekât','Sadaka-i câriye','Nisap'], d:0, a:'Kişi başına ve Ramazan’da verilen fitredir.' },
  { k:'fitre', tip:'cikarim', s:'Fitrenin bayramdan önce verilmesinin amacı ne olabilir?', o:['İhtiyaç sahiplerinin de bayramı sevinçle karşılayabilmesi','Malın üzerinden yıl geçmesini beklemek','Nisap miktarını belirlemek','Yalnızca vereni sevindirmek'], d:0, a:'Fitre bayram sevincinin paylaşılmasını sağlar.' },
  { k:'fitre', tip:'karistirma', s:'Fitre ile zekât arasındaki fark hangisidir?', o:['Fitre kişi başına ve Ramazan’da, zekât malın oranına göre ve yıllık verilir','İkisi de yalnızca Ramazan’da verilir','Fitre farz, zekât gönüllüdür','Aralarında fark yoktur'], d:0, a:'Zaman ve hesaplama biçimleri farklıdır.' },
  { k:'fitre', tip:'yeni', s:'Bir derneğin afişinde “Bayram yaklaşırken her bir aile ferdi için payınızı unutmayın” yazıyor. Afiş hangi ibadeti hatırlatmaktadır?', o:['Fitre','Zekât','Sadaka-i câriye','Kurban'], d:0, a:'“Her aile ferdi için” ve “bayram öncesi” ifadeleri fitreyi gösterir.' },
  /* SADAKA-İ CÂRİYE */
  { k:'cariye', tip:'temel', s:'Sadaka-i câriye nedir?', o:['Yapıldıktan sonra da faydası devam eden sadaka','Ramazan’da verilen vacip sadaka','Zekâtla yükümlülük sınırı','Bir kereliğine verilen yemek'], d:0, a:'Câriye “akan, devam eden” demektir.' },
  { k:'cariye', tip:'senaryo', s:'Emekli bir öğretmen köyüne bir okul kütüphanesi kurdu; yıllardır öğrenciler oradan kitap okuyor. Bu hangisine örnektir?', o:['Sadaka-i câriye','Fitre','Nisap','Zekâtın şartı'], d:0, a:'Faydası süren iyilik sadaka-i câriyedir.' },
  { k:'cariye', tip:'cikarim', s:'Sadaka-i câriyenin diğer sadakalardan farkı düşünüldüğünde hangisi çıkarılabilir?', o:['İyiliğin etkisi, yapan kişi olmasa bile sürebilir','Yalnızca bir kez fayda sağlar','Sadece para ile yapılır','Yalnızca Ramazan’da yapılır'], d:0, a:'Etkisi kalıcıdır.' },
  { k:'cariye', tip:'karistirma', s:'Hangisi sadaka-i câriye DEĞİLDİR?', o:['Yolda karşılaştığı birine bir kez su vermek','Köye çeşme yaptırmak','Mahalleye ağaç dikmek','Okula kitap bağışlamak'], d:0, a:'Bir kez su vermek güzel bir sadakadır; ama faydası süreklilik göstermez.' },
  { k:'cariye', tip:'yeni', s:'Bir öğrenci, yazdığı ücretsiz ders notlarını internette paylaştı ve bu notlardan yıllarca binlerce öğrenci yararlandı. Bu davranış en çok hangisine benzer?', o:['Sadaka-i câriye','Fitre','Nisap','Zekât'], d:0, a:'Faydası devam eden bilgi paylaşımı sadaka-i câriyeye örnek verilebilir.' }
];
