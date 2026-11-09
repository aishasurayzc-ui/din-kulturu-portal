/* ======================================================================
   ÖĞRENME LABORATUVARI — görev verileri (2026-11-08)
   ----------------------------------------------------------------------
   Her laboratuvar 7 adımlı bir sorgulama döngüsüdür:
     1 Problemle karşılaş · 2 Tahmin et · 3 Araştır · 4 Soru üret ·
     5 Farklı görüşleri incele · 6 Çözümünü geliştir ve açıkla · 7 Kendini değerlendir
   Adımlardaki görevler 3 seviyelidir: baslangic · gelisim · ileri.
   onayli:false → sayfada "Taslak · öğretmen onayı bekliyor" etiketi görünür.
   Ayet mealleri: Diyanet İşleri Başkanlığı meali (api.alquran.cloud tr.diyanet ile doğrulandı).
   Bilimsel veriler: IPBES (2016) Tozlayıcılar, Tozlaşma ve Gıda Üretimi Değerlendirme Raporu.
====================================================================== */
window.OGRENME_LAB = [
{
  id: 's5-u1-arilar',
  sinif: 5, unite: 1, uniteAdi: 'Allah İnancı', konu: 'Evrendeki düzen ve ölçü',
  baslik: 'Arılar Yok Olursa?',
  ozet: 'Arı ile çiçek arasındaki uyumu araştırarak evrendeki düzen ve ölçü üzerine düşün.',
  onayli: false,
  sure: '2 ders saati',
  meb: [
    { kod: 'DKAB.5.1.1', ad: 'Evrendeki mükemmel düzene ilişkin akıl yürütebilme' },
    { kod: 'DKAB.5.1.2', ad: 'Evrendeki mükemmel düzeni gözlem yoluyla fark edip Allah’ın (cc) varlığı ve birliğini gözleme dayalı tahmin edebilme' }
  ],
  disiplinler: [
    { ad: 'Fen Bilimleri', ikon: '🔬', ne: 'Tozlaşma, besin zinciri, canlıların birbirine bağlılığı' },
    { ad: 'Matematik', ikon: '➗', ne: 'Yüzde ve oranları yorumlama' },
    { ad: 'Türkçe', ikon: '✍️', ne: 'Düşünceni gerekçeleriyle yazma' }
  ],
  bilgiKartlari: [
    { baslik: 'Tozlaşma nedir?', metin: 'Çiçekli bitkilerin meyve ve tohum verebilmesi için çiçek tozlarının bir çiçekten başka bir çiçeğe taşınması gerekir. Buna tozlaşma denir. Arılar çiçekten çiçeğe konarken tozları taşır.', kaynak: 'Fen Bilimleri ders bilgisi' },
    { baslik: 'Besin bitkileri', metin: 'Dünyada en çok yetiştirilen besin bitkisi türlerinin dörtte üçünden fazlası (yüzde 75’ten fazlası), tozlaşma için az ya da çok hayvanlara (arı, kelebek, sinek, kuş gibi) ihtiyaç duyar.', kaynak: 'IPBES Tozlayıcılar Raporu, 2016' },
    { baslik: 'Rüzgârla tozlaşanlar', metin: 'Buğday, pirinç ve mısır gibi tahıllar tozlaşmak için arılara ihtiyaç duymaz; tozlarını rüzgâr taşır ya da kendi kendine tozlaşır.', kaynak: 'Fen Bilimleri ders bilgisi' },
    { baslik: 'Yabani bitkiler', metin: 'Doğadaki yabani çiçekli bitki türlerinin yaklaşık yüzde 90’ı tozlaşmak için az ya da çok hayvanlara ihtiyaç duyar. Bu bitkiler pek çok hayvanın besini ve barınağıdır.', kaynak: 'IPBES Tozlayıcılar Raporu, 2016' },
    { baslik: 'Tek tozlayıcı arı değil', metin: 'Bal arısının yanında yaban arıları, kelebekler, bazı sinekler, kuşlar ve yarasalar da tozlaşma yapar.', kaynak: 'IPBES Tozlayıcılar Raporu, 2016' },
    { baslik: 'Kur’an’da bal arısı', metin: '“Rabbin bal arısına: ‘Dağlarda, ağaçlarda ve hazırlanmış kovanlarda yuva edin; sonra her çeşit üründen ye; sonra da Rabbinin işlemen için gösterdiği yollardan yürü’ diye öğretti. Karınlarından insanlara şifa olan çeşitli renklerde bal çıkar. Düşünen bir millet için bunda ibret vardır.”', kaynak: 'Nahl suresi, 68-69. ayetler (Diyanet meali)', ayet: true }
  ],
  ayetler: [
    { metin: 'Şüphesiz Biz her şeyi bir ölçüye göre yaratmışızdır.', kaynak: 'Kamer suresi, 49. ayet' },
    { metin: 'Rahman’ın bu yaratmasında bir düzensizlik bulamazsın. Gözünü bir çevir bak, bir çatlak görebilir misin?', kaynak: 'Mülk suresi, 3. ayetten' }
  ],
  adimlar: [
    { k: 'problem', ad: 'Problemle Karşılaş', ikon: '🧭',
      metin: 'Bir sabah uyandığını ve dünyadaki bütün arıların ortadan kaybolduğunu düşün. Bahçeler, tarlalar, ormanlar ve sofralarımız bu durumdan nasıl etkilenir?',
      not: 'Bu bir düşünce deneyidir. Amacımız korkmak değil; canlılar arasındaki bağı ve düzeni fark etmektir.',
      gorev: {
        baslangic: { soru: 'Problemi kendi cümlelerinle yaz: Bu laboratuvarda neyi merak ediyoruz?', tur: 'metin' },
        gelisim:   { soru: 'Problemi kendi cümlelerinle yaz ve arıların doğada hangi işleri yaptığını bildiğin kadarıyla ekle.', tur: 'metin' },
        ileri:     { soru: 'Problemi bir araştırma sorusu hâline getir. (Örnek kalıp: “Arıların yok olması … nasıl etkiler?”)', tur: 'metin' }
      } },
    { k: 'tahmin', ad: 'Tahmin Et', ikon: '💭',
      metin: 'Henüz araştırma yapmadan ne düşündüğünü yaz. Tahminin yanlış çıkabilir; bu da öğrenmenin bir parçasıdır.',
      gorev: {
        baslangic: { soru: 'Arılar yok olursa ilk olarak ne olur? Bir tahmin yaz.', tur: 'metin', eminlik: true },
        gelisim:   { soru: 'Arılar yok olursa olabilecek iki sonucu tahmin et. Her birinin nedenini yaz.', tur: 'metin', eminlik: true },
        ileri:     { soru: 'Kısa vadede (bir yıl içinde) ve uzun vadede (yıllar sonra) neler olabileceğini ayrı ayrı tahmin et.', tur: 'metin', eminlik: true }
      } },
    { k: 'arastir', ad: 'Araştır', ikon: '🔍',
      metin: 'Bilgi kartlarını oku. Her kartın kaynağına dikkat et: Bilgiyi kim, nerede söylemiş?',
      kartlar: true,
      gorev: {
        baslangic: { soru: 'Kartlardan yararlanarak arıların doğada yaptığı işi bir cümleyle anlat.', tur: 'metin' },
        gelisim:   { soru: 'Neden-sonuç zinciri kur: Arılar yok olur → … → … → …', tur: 'zincir', halka: 3 },
        ileri:     { soru: 'Kartlara göre hangi besinler arıların yok olmasından daha çok etkilenir, hangileri daha az etkilenir? Nedenini açıkla. (İpucu: “Besin bitkileri” ve “Rüzgârla tozlaşanlar” kartlarını karşılaştır.)', tur: 'metin' }
      },
      matematik: 'Matematik köşesi: “Yüzde 75’ten fazlası” ne demektir? 100 besin bitkisi türünden yaklaşık kaçının tozlaşma için hayvanlara ihtiyaç duyduğunu hesapla.' },
    { k: 'soru', ad: 'Soru Üret', ikon: '❓',
      metin: 'İyi bir araştırmacı yalnızca cevap bulmaz, yeni sorular da sorar.',
      gorev: {
        baslangic: { soru: '“Ne, nerede, kim” ile başlayan iki soru yaz.', tur: 'liste', adet: 2 },
        gelisim:   { soru: '“Neden” ve “nasıl” ile başlayan iki soru yaz.', tur: 'liste', adet: 2 },
        ileri:     { soru: '“Ya … olsaydı?” biçiminde iki soru yaz ve bunlardan birinin cevabını nasıl araştıracağını belirt.', tur: 'liste', adet: 3 }
      } },
    { k: 'gorusler', ad: 'Farklı Görüşleri İncele', ikon: '🗣️',
      metin: 'Aynı konuya farklı insanlar farklı açılardan bakar. Her görüşü kartlardaki bilgilerle karşılaştır.',
      gorusler: [
        { kim: 'Bir arıcı', soz: 'Arılar olmazsa yalnızca bal kaybolmaz; arılar çiçekleri dolaştıkça bahçeler ve meyve ağaçları da bereketlenir.' },
        { kim: 'Buğday yetiştiren bir çiftçi', soz: 'Benim tarlam arılar olmasa da ürün verir; buğdayı rüzgâr tozlaştırır.' },
        { kim: 'Bir arkadaşın', soz: 'Arılar yok olursa bütün insanlar hemen açlıktan ölür.' },
        { kim: 'Bir bilim insanı', soz: 'Besinlerimiz azalır ve çeşitlenmesi zorlaşır; meyve, sebze ve kuruyemiş en çok etkilenenler arasında olur.' }
      ],
      gorev: {
        baslangic: { soru: 'Hangi görüşe katılıyorsun? Bir nedenini yaz.', tur: 'metin' },
        gelisim:   { soru: 'Arkadaşının görüşü doğru mu, kısmen mi doğru, yanlış mı? Kartlardan bir bilgiyle gerekçelendir.', tur: 'degerlendir' },
        ileri:     { soru: 'Çiftçi ile bilim insanının görüşlerini karşılaştır: İkisi de nasıl haklı olabilir? Görüşleri birleştiren bir cümle yaz.', tur: 'metin' }
      } },
    { k: 'cozum', ad: 'Çözümünü Geliştir ve Açıkla', ikon: '🛠️',
      metin: 'Öğrendiklerini bir çözüme dönüştür ve bunu evrendeki düzen ve ölçü ile ilişkilendir.',
      ayetler: true,
      gorev: {
        baslangic: { soru: 'Arıları korumak için senin ya da ailenin yapabileceği iki şey yaz.', tur: 'liste', adet: 2 },
        gelisim:   { soru: 'Arıları korumak için bir çözüm öner. Bu çözümün neden işe yarayacağını açıkla.', tur: 'metin' },
        ileri:     { soru: 'Okulun ya da mahallen için “arı dostu” bir proje planla: Ne yapılacak? Kimler katılacak? Nasıl yapılacak? İşe yarayıp yaramadığını nasıl anlayacaksınız?', tur: 'plan' }
      },
      bag: 'Arı ile çiçek arasındaki uyum, evrendeki düzen ve ölçü hakkında sana ne düşündürüyor? Ayetlerden yararlanarak birkaç cümle yaz.' },
    { k: 'degerlendir', ad: 'Kendini Değerlendir', ikon: '🌱',
      metin: 'Bu laboratuvarda nasıl çalıştığını düşün. Dürüst olmak, gelişmenin ilk adımıdır.',
      olcutler: [
        'Düşüncemi açıkça anlatabildim.',
        'Görüşlerimi gerekçeleriyle destekledim.',
        'Farklı görüşleri saygıyla inceledim.',
        'Bilgi kartlarından örnek kullandım.',
        'Bir çözüm önerisi geliştirdim.'
      ],
      gorev: {
        baslangic: { soru: 'Bu laboratuvarda öğrendiğin en önemli şey neydi?', tur: 'metin' },
        gelisim:   { soru: 'Tahminin ile araştırma sonrasında öğrendiklerin arasında ne fark vardı?', tur: 'metin' },
        ileri:     { soru: 'Bir dahaki laboratuvarda neyi farklı yapardın? Öğrenmeni nasıl daha da geliştirebilirsin?', tur: 'metin' }
      } }
  ]
}
];
