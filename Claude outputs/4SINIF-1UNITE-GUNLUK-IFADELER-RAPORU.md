# Günlük Hayatta Dinî İfadeler — 4. Sınıf 1. Ünite

**Tarih:** 14 Eylül 2026
**Kapsam:** Tek dosya — `din-kulturu-4sinif-1unite/konuyu-ogren.html`

---

## 1. Değiştirilen dosyalar

| Dosya | Ne yapıldı |
|---|---|
| `din-kulturu-4sinif-1unite/konuyu-ogren.html` | Yeni bileşen eklendi; genel "Balık Kılçığı — Üniteyi Topla" bu sayfadan kaldırıldı (sizin kararınız) |

**Başka hiçbir dosyaya dokunulmadı.** Silme, taşıma, yeniden adlandırma yok.
Yedek: `konuyu-ogren.kilcik-oncesi.html` aynı klasörde duruyor.

---

## 2. Eklenen bileşen

**"Günlük Hayatta Dinî İfadeler"** — menüde ilk sırada, kendi sekmesinde.

Ad alanı `gi-` / `gi` (sayfada hiç kullanılmıyordu, grep ile doğrulandı).
JS tek bir IIFE içinde; global alana hiçbir şey bırakmıyor.

### Öğrenme zinciri

Her kılçık açıldığında dört adım sırayla görünüyor:

```
DURUM → HANGİ İFADE? → NE ANLAMA GELİYOR? → GÜNLÜK HAYATA NASIL YANSIR?
                                                      ↓
                                              ŞİMDİ SEN SEÇ! (3 şıklı)
```

### Altı kılçık

| # | Durum | İfade |
|---|---|---|
| 1 | BİR İŞE BAŞLARKEN | Besmele |
| 2 | BİRİYLE KARŞILAŞTIĞIMDA | Selamlaşma |
| 3 | BİR NİMETE KAVUŞTUĞUMDA | Elhamdülillah |
| 4 | GELECEKLE İLGİLİ BİR DİLEĞİM OLDUĞUNDA | İnşallah |
| 5 | GÜZEL BİR ŞEY GÖRDÜĞÜMDE | Maşallah |
| 6 | ALLAH'TAN BİR ŞEY İSTEDİĞİMDE | Dua ve "Âmin" |

Merkez (balığın başı): **GÜNLÜK HAYATTA DİNÎ İFADELER**

### UX

- İlk ekranda **sadece** şema ve 6 kılçık var. Hiçbir ayrıntı, hiçbir soru görünmüyor.
- Bir kılçığa dokununca ayrıntı **altında** açılıyor. Aynı anda tek panel açık.
- Aynı kılçığa tekrar dokunmak paneli kapatıyor; "✕ Kapat" düğmesi de var.
- Doğru cevaplanan kılçığa "✓ tamamlandı" işareti geliyor, başlıktaki sayaç ilerliyor (0/6 → 6/6).
- Altısı da doğru olunca kapanış cümlesi çıkıyor.

---

## 3. İçeriğin kaynağı — hiçbir dinî bilgi uydurulmadı

Her ANLAM ve GÜNLÜK HAYAT cümlesi **sayfanın kendi metninden** alındı:

| Kılçık | Anlam / günlük hayat cümlesinin kaynağı |
|---|---|
| Besmele | Konu 1 · Besmele kavram kartı; Konu 2 · "İşe başlarken Bismillah" |
| Selamlaşma | Konu 1 · Selam kavram kartı; Konu 2 · "Arkadaşı görünce Selâmünaleyküm" |
| Elhamdülillah | Konu 1 · Hamd ve Şükür kavram kartları; Konu 2 · "Uyanınca Elhamdülillah" |
| İnşallah | Konu 2 · "İnşallah — Allah dilerse"; `labirentIfadeHavuzu` · İnşallah |
| Maşallah | Konu 2 · "Maşallah — Allah nazardan korusun"; `labirentIfadeHavuzu` · Maşallah |
| Dua / Âmin | Konu 2 · "Âmin — Duam kabul olsun"; `ifadelerG1` · "Dua, Allah'a yalvarmak ve istekte bulunmaktır." |

**Sadece iki tür cümle biçimlendi** (sizin onayınızla): durum cümlesi ve soru cümlesi. İkisi de sayfanın kendi "durum → ifade" eşleşmelerinden türetildi; şıklar sayfadaki ifadelerden seçildi. Bu cümlelerin tamamı `gunluk_veri.py` dosyasında, her biri `kaynak` alanıyla birlikte duruyor — değiştirmek isterseniz tek yerden.

---

## 4. Korunan mevcut sistemler

| Sistem | Durum |
|---|---|
| `goster()` sekme motoru | Yeniden yazılmadı — yeni bölüm mevcut `.egitim-icerik` + `.aktif` düzenine katıldı |
| `labirentIfadeHavuzu`, `surukleVerisi`, `ifadelerG1`, `kategorilerK1`, `ezberVeri` vb. | Hiçbirine dokunulmadı; yalnızca **okundu** |
| `KONU_FOTOGRAFLARI` / görsel katmanı | Dokunulmadı |
| Oyun motoru (`ortak/oyun-merkezi.js`) | Dokunulmadı |
| Konu 1–3 bölümleri, Özet, Ünite Sunumu | Aynen duruyor |
| Öğrenme Yolculuğu, Merak Et / Keşfet blokları | Aynen duruyor |
| Koyu tema sistemi (`data-theme`) | Bileşen mevcut değişken düzenine bağlandı |

---

## 5. Test sonuçları

### Bağlantılar

| Test | Sonuç |
|---|---|
| Sayfa açılıyor mu | ✅ |
| Balık kılçığı görünüyor mu | ✅ menüde ilk sırada, 6 kılçık, 24 kemik çizgisi |
| 6 kılçık doğru içeriği açıyor mu | ✅ 6/6 — her panelde 4 adım (DURUM / HANGİ İFADE / ANLAM / GÜNLÜK HAYAT) |
| Etkileşim soruları çalışıyor mu | ✅ 6/6 — doğru ✓, yanlışta doğrusu işaretleniyor + açıklama |
| Sayaç ve bitiş | ✅ 6/6 olunca kapanış mesajı çıktı |
| Menü bağlantıları | ✅ Ana Menüye Dön · Günlük Hayatta Dinî İfadeler · Konu Özeti · Konu 1 · Konu 2 · Konu 3 · Ünite Sunumu |
| Bölümler | ✅ `ka-hero, ozet, konu1, konu2, konu3, gunluk-ifadeler, slayt` |
| Oyun bağlantıları | ✅ 2 adet, çalışıyor |
| Değerlendirme bağlantıları | ✅ 2 adet, çalışıyor |

### Konsol

**JavaScript hatası: 0** — değişiklikten önce de sonra da sıfır.
Yüklenemeyen kaynak listesi önce/sonra **birebir aynı** (bunlar sizin bilgisayarınızda olan ama test ortamında bulunmayan fotoğraflar ve engellenen Google Fonts adresi).

### Mobil

| Genişlik | Yatay taşma |
|---|---|
| 1280px | 0 |
| 768px | 0 |
| 390px | 0 |
| 360px | 0 |
| 320px | 0 |

820px altında yatay kılçık **dikey listeye** dönüşüyor: merkez + altı kart, her biri kendi renginde şeritle. Kemik çizimi mobilde kapalı (zorla küçültme yok). Dokunma alanları: kılçık kartları ≥64px, şıklar ≥50px, Kapat ≥38px.

### Koyu tema

✅ Bozulmadı. Bileşen sayfanın `:root[data-theme="dark"]` ve `prefers-color-scheme` düzenine bağlandı. İlk denemede "ŞİMDİ SEN SEÇ" etiketi ve A/B/C rozetleri koyu zeminde okunmuyordu — düzeltildi.

### Erişilebilirlik

- Klavye: Tab ile kılçığa gidilir, **Enter** paneli açar, odak doğrudan panele geçer, Tab ile şıklara ulaşılır, Enter seçer, **Kapat** odağı kılçığa geri verir. ✅
- `aria-expanded` / `aria-controls` / `role="region"` / `aria-live="polite"` kullanıldı.
- **Renk tek başına anlam taşımıyor:** doğru/yanlış hem ✓ / ✕ işaretiyle hem "✓ Doğru." / "✕ Doğrusu: …" yazısıyla veriliyor.
- `focus-visible` mevcut sistemle aynı biçimde.
- `prefers-reduced-motion` destekleniyor (panel animasyonu ve kılçık geçişleri kapanıyor).

### İçerik kaybı

Sayfadaki 25 karakterden uzun **553 benzersiz metin parçasının tamamı** duruyor. **Kaybolan: 0.** Eklenen: 4 (yeni bileşenin sabit metinleri).

### Diğer sınıflar

| Sınıf | Durum |
|---|---|
| 4. sınıf 2–6. üniteler | **Dokunulmadı** |
| 5, 6, 7. sınıflar | **Dokunulmadı** (klasörleri çalışma alanıma hiç alınmadı) |
| 8. sınıf | **Dokunulmadı** |
| 9–12. sınıflar | **Dokunulmadı** |

---

## 6. Bekleyen kararınız

Mesajınızda **"4 ve 8 arasındaki tüm kademelere uygula"** dediniz; ama aynı briefte "5, 6, 7 ve 8. sınıflara dokunma" yazıyordu. Çelişkiyi kendi başıma çözmedim, o klasörlere girmedim.

İki ayrı iş var, hangisini istediğinizi söylerseniz yaparım:

1. **Genel "Balık Kılçığı — Üniteyi Topla"yı 5, 6, 7. sınıflara da ekle.** Bu kolay — içerik zaten her sayfanın kendi özet cümlelerinden çıkıyor, 4 ve 8'de çalışan sistemin aynısı.
2. **"Durum → İfade → Anlam → Davranış" modelini diğer ünitelere uyarla.** Bu, her ünite için ayrı ayrı durum ve soru yazmayı gerektirir; içerik sizin onayınızdan geçmeli. Hangi ünitelerden başlayalım?

---

## 7. Yayın

Değişiklik bilgisayarınıza yazıldı; **canlı siteye gönderilmedi**. `YAYINA-GONDER.bat` ile yayınlayabilirsiniz. Tarayıcıda **Ctrl+F5**.
