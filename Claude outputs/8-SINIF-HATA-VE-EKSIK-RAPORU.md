# 8. SINIF HATA VE EKSİK RAPORU
### Kader İnancı (1. ünite) — değişiklik yapılmadan önceki durum

**Tarih:** 13 Eylül 2026
**Kapsam:** Yalnızca 8. sınıf. 4–7 ve 9–12. sınıf dosyaları okunmadı bile.
**Durum:** Bu rapor için **hiçbir dosya değiştirilmedi.** Aşağıdaki analiz
bilgisayarınızdaki güncel dosyalar üzerinden yapıldı.

---

## A. YAPILAN KONTROLLER

| Kontrol | Sonuç |
|---|---|
| Ana portal s8 sınıf kartı | ✅ var, klasör `din-kulturu-8sinif-1unite`, 5 ünite doğru |
| Kader İnancı ünite kartı | ✅ `index.html`, başlık "Kader İnancı" |
| `ALT_KONULAR['s8-u1']` | ✅ 6 alt konu tanımlı |
| `OYUN_VERI` içinde s8-u1 | ✅ var |
| `ACADEMIC` içinde s8-u1 | ✅ var |
| `index.html` (ünite ana sayfası) | ✅ açılıyor · 4 mega-kart + öğretmen paneli |
| `konuyu-ogren.html` | ✅ açılıyor · 5 konu bölümü · 200 test · 25 slayt |
| `oyun-merkezi.html` | ✅ 50 oyun, 50 HTML bölümü, hepsi eşleşiyor |
| `degerlendirme.html` | ✅ açılıyor · 4 yazılı bağlantısı çalışıyor |
| Sunum dosyaları | ✅ sayfa içinde 25 slayt (ayrı .pptx yok) |
| Dijital oyunlar | ✅ ilk 8 oyun tek tek açıldı, hepsi çalışıyor, JS hatası yok |
| Sınıf içi etkinlikler | ✅ Keşif Modu (6 konu) + 2 yeni "Kendini Dene" |
| Yazılı / değerlendirme | ✅ `yazili1/2` ve `yazili1/2_klasik` dosyaları mevcut |
| LGS bağlantısı | ⚠️ sadece `konuyu-ogren.html`'de (aşağıda) |
| Görseller | ⚠️ 22 yerel görselin dosya yolu doğru, ama bir kısmı henüz konmamış |
| Konu haritası | ✅ 2 kavram haritası bloğu var, 808×307 px görünür |
| Tüm `href` bağlantıları | ✅ **0 kırık bağlantı** |
| `#anchor` bağlantıları | ✅ 11 çapa bağlantısının hepsi hedefini buluyor |
| JavaScript olayları | ⚠️ 2 sayfada hata var (aşağıda) |
| Mobil görünüm | ✅ 360 / 390 / 430 / 768 / 1024 / 1440 px — **taşma 0** |

---

## B. TESPİT EDİLEN HATALAR

### H1 — `index.html` ve `degerlendirme.html`'de JavaScript hatası
```
TypeError: Cannot set properties of null (setting 'innerHTML')
    at bz8IzgaraOlustur
```
Oyun merkezine ait 9 kurulum fonksiyonu bu sayfalarda da koşulsuz çağrılıyor,
ama oyunların HTML kapları burada yok. Hata betiği durdurduğu için aynı
betikteki `const UNITE_KIMLIK = '8-1'` hiç çalışmıyor; bu yüzden bu iki
sayfada **öğretmen paneli anahtarı, ilerleme takibi ve cevap kaydı sessizce
ölü.**

Aynı hatayı `konuyu-ogren.html`'de dün düzeltmiştim; bu iki dosyada duruyor.
Düzeltmesi aynı tek satır. `unite2-` ve `unite3-konuyu-ogren.html`'de de var
(ama onlar 1. ünite değil).

### H2 — Ünite ana sayfasında LGS bağlantısı yok
`konuyu-ogren.html`'de "🎯 LGS ile Pekiştir" bağlantısı **var ve doğru
çalışıyor**:
`../sinav-merkezi/lgs-hazirlik/index.html?kart=konular&sekme=kazanim-testleri&unite=unite1`

Ama ünitenin **ana sayfasında (`index.html`) LGS kartı yok.** Öğrenci üniteye
girdiğinde dört kart görüyor: Keşif Modu, Konuyu Öğren, Oyunlar,
Değerlendirme. LGS'ye ancak konu anlatımına girip aşağı inerse ulaşıyor.

### H3 — Portal 6 konu diyor, konu anlatımı 5 bölüm
| Portal `ALT_KONULAR['s8-u1']` | Keşif Modu | Konu anlatımı bölümü |
|---|---|---|
| Kader ve kaza kavramları | ✅ Konu 1 | ✅ 1️⃣ Kader ve Kaza İnancı |
| Evrendeki yasalar | ✅ Konu 2 | ❌ ayrı bölüm yok |
| İnsanın iradesi ve sorumluluğu | ✅ Konu 3 | ✅ 2️⃣ İnsanın İradesi ve Kader |
| Ecel ve ömür | ✅ Konu 4 | ❌ ayrı bölüm yok |
| Rızık | ✅ Konu 5 | ❌ ayrı bölüm yok |
| Tevekkül | ✅ Konu 6 | ❌ ayrı bölüm yok |
| — | — | ➕ 3️⃣ Kaderle İlgili Kavramlar |
| — | — | ➕ 4️⃣ Hz. Musa (as) |
| — | — | ➕ 5️⃣ Ayetelkürsi |

**Önemli:** İçerik kayıp değil. "Evrendeki yasalar", "Ecel ve ömür", "Rızık"
ve "Tevekkül" konu anlatımında **3️⃣ Kaderle İlgili Kavramlar** başlığının
içinde toplu hâlde işleniyor (metinde sırasıyla 34, 73, 67, 111 kez geçiyor).
Keşif Modu ise altısını da ayrı ayrı işliyor. Yani **üç yerde üç farklı
yapı** var; sizin §11'de istediğiniz "6 konu kartı" düzeni bu uyumsuzluğu
çözer.

### H4 — Konular arası denge bozuk
| | test sorusu | düşün kutusu | görsel şema | etkileşimli etkinlik |
|---|---|---|---|---|
| Konu 1 | 80 | 5 | 1 karşılaştırma | 2 |
| Konu 2 | 112 | 1 | 1 kavram haritası | 0 |
| Konu 3 | 96 | 2 | 1 süreç şeması | 0 |
| Konu 4 | 64 | 1 | 1 kavram haritası | 0 |
| Konu 5 | 48 | 3 | — | 0 |

Konu 3, tek başına dört portal konusunu (yasalar, ecel, rızık, tevekkül)
taşıyor ama yalnızca bir süreç şeması ve iki düşün kutusu var.

---

## C. TESPİT EDİLEN EKSİKLER

### E1 — "Kadercilik" kelimesi hiçbir dosyada geçmiyor
Konu anlatımı: **0** · oyun merkezi: **0** · değerlendirme: **0**

Tevekkülün tanımı doğru yapılmış (aşağıda, akademik kontrol), ama
**tevekkülün karşıtı olan yanlış anlayışa bir ad verilmemiş.** Sizin §5 ve
§8'de istediğiniz bölümün tam olarak kapatacağı boşluk bu.

### E2 — Yazım: "Cüz'î irade" yerine "Cüzi irade"
Sayfada 16 kez **"Cüzi irade"** geçiyor; sizin kavram listenizde
**"Cüz'î irade"**. Tanım doğru, yalnızca yazım farklı. Toplu değiştirme
riskli olabileceği için dokunmadım — kararı size bırakıyorum.

### E3 — Konmamış görseller
`din-kulturu-slayt-gorseller/konu/` klasöründe olması beklenen ama henüz
konmamış dosyalar: `s8-u1-hero.jpg`, `s8-u1-k1-olay.jpg`,
`s8-u1-k1-gunluk.jpg`, `s8-u1-k2-olay.jpg`, `s8-u1-k2-fiz.jpg`,
`s8-u1-k2-biyo.jpg`, `s8-u1-k2-top.jpg`, `s8-u1-k2-ayet.jpg` ve diğerleri.
Sayfa bunlar olmadan bozulmuyor — çizim görünmeye devam ediyor.
(Bu, `BURAYA-FOTOGRAF-AT.txt`'deki sistemin beklediği davranış.)

---

## D. AKADEMİK KONTROL (§12)

| Kontrol | Sonuç |
|---|---|
| Kader ve kaza birbirine karıştırılıyor mu? | ✅ Hayır. "Kader… ezelî ilmiyle bilip belirlemesi", "kaza… zamanı gelince meydana gelmesi" — ayrım net |
| Kader insanın iradesini ortadan kaldırıyor gibi bir ifade var mı? | ✅ Hayır |
| Cüz'î irade doğru kullanılmış mı? | ✅ "Allah tarafından insana verilen sınırlı özgürlük ve tercih etme kabiliyeti"; külli irade ile karşıtlığı doğru |
| Sorumluluk–tercih bağı kurulmuş mu? | ✅ "Hatasını kabul edip telafi etmek sorumluluk bilincinin göstergesidir" |
| Fiziksel/biyolojik/toplumsal yasalar karışmış mı? | ✅ Hayır; üçü de ayrı ayrı tanımlı, sünnetullah çatı kavram |
| Ecel ve ömür doğru mu? | ✅ "Doğumla ölüm arasındaki süre ömür, bu sürenin sona erdiği belirlenmiş an ecel" |
| Rızıkta "çalışmaya gerek yok" algısı var mı? | ✅ Hayır — tam tersi: "isteyip çalışmadan sonuç alınamayacağı", "rızık için çalışmanın gerekli olduğu" |
| Tevekkül kadercilikle karıştırılıyor mu? | ✅ Hayır — "gereken tedbirleri aldıktan ve çabayı gösterdikten sonra sonucu Allah'a bırakmak" |
| Ayetler doğru bağlamda mı? | ✅ Ra'd 11 ("bir toplum kendini değiştirmedikçe…") toplumsal yasa bağlamında doğru kullanılmış |
| MEB kazanımı gibi sunulan uydurma içerik var mı? | ✅ Hayır. Sayfada 4 kazanım var (DKAB.8.1.1–8.1.4) ve kaynağı belirtilmiş |

**Akademik açıdan düzeltilmesi gereken bir hata bulamadım.** Tek eksik,
D bölümündeki E1: doğru anlayış var ama yanlış anlayış adlandırılmamış.

---

## E. ÖNEMLİ: İSTEDİĞİNİZ İKİ ETKİNLİK ZATEN VAR

Bugün eklediğimiz iki etkinlik, briefinizin §2 ve §3'üyle büyük ölçüde
örtüşüyor:

| Briefiniz | Sayfada hâlihazırda duran |
|---|---|
| **§2 "Hangisi Kader, Hangisi Kaza?"** — en az 12 örnek, KADER/KAZA seçimi, doğru/yanlışta açıklama | **"Yasa mı, Gerçekleşme mi?"** — 50 örnek, KADER/KAZA iki alan, iki deneme hakkı, örneğe özel açıklama |
| **§3 "Yasa mı, Sonuç mu?"** — fiziksel/biyolojik/toplumsal yasa + sonuç, en az 12 kart | **"Yasanı Seç"** — 50 örnek, fiziksel/biyolojik/toplumsal üç alan, zorluk dengeli |

İkisini de sıfırdan yeniden yazmak "gereksiz tekrar" olur. Bunun yerine:

* §2'nin istediği ama havuzda olmayan örnekleri (**"Allah'ın evrene ölçü ve
  düzen koyması"**, **"bir insanın doğması"**, **"bir insanın ölmesi"**,
  **"yağmurun yağması"** gibi) mevcut 50'lik havuza ekleyebilirim.
* §3'ün istediği **dördüncü kategori olan "SONUÇ"** alanını mevcut
  "Yasanı Seç"e ekleyebilirim — böylece hem yasa türünü hem de yasa/sonuç
  ayrımını aynı etkinlikte çalışır.

---

## F. GERİYE KALAN YENİ İŞ

Briefinizde gerçekten **sıfırdan yapılacak** olanlar:

| § | İş | Büyüklük |
|---|---|---|
| 4 | İrade Laboratuvarı (senaryo → irade/sorumluluk) | orta |
| 5 | Tevekkül mü, Kadercilik mi? (10+ senaryo) | orta |
| 6 | Etkileşimli Kader İnancı kavram haritası | orta |
| 7 | 10 yeni LGS tarzı soru (paragraf, çıkarım, çeldirici) | büyük |
| 8 | "Yanlış Kader Anlayışını Yakala" mini bölümü | orta |
| 9 | Ecel–Ömür ve Rızık bölümlerini hayatla ilişkilendirme | orta |
| 11 | 6 konu kartını ortak yapıya oturtma | **büyük** |
| 10 | Görsel kimlik (⚖️🌍🧭🎯⏳🤲, lacivert+altın) | §4–§9 ile birlikte |

§11 en büyüğü, çünkü konu anlatımı sayfasının bölüm mimarisini portal ve
Keşif Modu ile hizalamayı gerektiriyor (H3).

---

## G. AÇIK CEVAPLAR

**"MEVCUT DOSYALAR KORUNDU MU?"**
Evet. Bu rapor için hiçbir dosya değiştirilmedi, silinmedi, taşınmadı,
adı değiştirilmedi.

**"ÇALIŞAN ÖZELLİKLER BOZULDU MU?"**
Hayır. 50 oyun, 200 test sorusu, 25 slayt, Keşif Modu, öğretmen paneli,
yazılı bağlantıları — hepsi çalışır durumda.

**"4–7. SINIFLARA DOKUNULDU MU?"**
Hayır. 9–12. sınıflara da dokunulmadı. Yalnızca 8. sınıf klasörü ve ana
portal dosyası **okundu**.
