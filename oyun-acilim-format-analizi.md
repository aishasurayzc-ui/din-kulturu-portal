# Oyun Açılım Formatı — İnceleme Notları (Yedek/İndeks)

Tarih: 2026-08-04

## Amaç
"Oyun açılım formatı 4. ve 8. sınıf gibi olsun" isteği üzerine, portaldaki tüm sınıf/ünite dosyaları incelendi. Bu dosya, yapılan incelemenin ve varılan sonucun kaydıdır.

## Canlı site (GitHub Pages) durumu
- `din-kulturu-4sinif-1unite/index.html` (canlı, deploy edilmiş sürüm): özet+sunum+oyunlar+yazılı hepsi tek sayfada. Ayrı `oyun-merkezi.html` canlıda YOK.
- `din-kulturu-8sinif-1unite/`: sadece `index.html` + `unite2-5.html` + yazılı dosyaları var. Ayrı oyun-merkezi.html yok (GitHub repo içeriği API ile doğrulandı).
- Yani canlı sitede "4 ve 8 aynı, 5-6-7 farklı" durumu YOK; tam tersine 4-5-6-7-8 hepsi aynı eski (tek sayfa) formatta.

## Yerel dosyalar (Desktop/ayşe yazıcı) — gerçek durum
Klasörler bağlandıktan sonra yerel dosyalar incelendi; canlı siteden çok daha ileri durumda:

| Sınıf | index/uniteN.html | konuyu-ogren.html | degerlendirme.html | oyun-merkezi.html |
|---|---|---|---|---|
| 4. sınıf | Sade (hero + 3 mega-kart) ✅ | Var ✅ | Var ✅ | Var ✅ |
| 5. sınıf | Sade (hero + 3 mega-kart) ✅ | Var ✅ | Var ✅ | Var ✅ |
| 6. sınıf | **Eski format, her şey tek sayfada (4500+ satır)** ❌ | **Yok** ❌ | **Yok** ❌ | Var (ama index'ten tam yönlendirilmiyor) |
| 7. sınıf | Sade (hero + 3 mega-kart) ✅ | Var ✅ | Var ✅ | Var ✅ |

**Sonuç: Format sorunu sadece 6. sınıfta.** 5. ve 7. sınıf zaten 4. sınıfla birebir aynı 3 sayfalı yapıda (Konuyu Öğren / Oyunlar / Değerlendirme).

## Hedef format (4./5./7. sınıfın kullandığı kalıp)
Her ünite 4 dosyaya bölünüyor:
1. **index.html / uniteN.html** — sade açılış sayfası: `<header>` + `<section class="hero">` (▶ Üniteye Başla → #oyun-gruplari) + 3 `mega-kart` (Konuyu Öğren / Oyunlar / Değerlendirme) + `#ogretmenpaneli` bölümü.
2. **konuyu-ogren.html** — `ozet{sonek}` (konu özeti) + `slayt` (ünite sunumu) bölümleri. Üstte "◀ Ana Menüye Dön" + iç sekme menüsü.
3. **degerlendirme.html** — `konutekrari{sonek}` (50 soruluk test) + `yazili` (yazılı sınav linkleri) bölümleri.
4. **oyun-merkezi.html** — tüm interaktif oyunlar, kategori menüsüyle (`../ortak/oyun-merkezi.js` + `.css` kullanır).

Önemli teknik not: JS `<script>` bloğu her 3 dosyada (index/konuyu-ogren/degerlendirme) **aynı şekilde tekrar ediliyor** (kopyala-yapıştır) — o dosyada karşılığı olmayan fonksiyonlar (örn. oyun fonksiyonları index.html'de) sadece kullanılmıyor, hataya yol açmıyor. Migrasyon bu yüzden mekanik: HTML bölümlerini ayır, JS'i olduğu gibi taşı.

## Yapılacak iş (6. sınıf, 5 ünite)
Her ünite için (index/unite2/unite3/unite4/unite5.html):
- Yeni `{unite}-konuyu-ogren.html` ve `{unite}-degerlendirme.html` dosyaları oluştur (ozet+slayt / konutekrari+yazili bölümlerini taşı).
- `{unite}.html` dosyasını sadeleştirip hero+mega-kart açılış sayfasına indir.
- `{unite}-oyun-merkezi.html` zaten mevcut, dokunulmuyor.

Durum: Ünite 1 üzerinde çalışılıyor, sırada Ünite 2-5 var.
