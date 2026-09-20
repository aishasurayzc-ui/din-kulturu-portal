# Balık Kılçığı — 4. ve 8. Sınıf · 11 "Konuyu Öğren" Sayfası

**Tarih:** 14 Eylül 2026
**Kapsam:** 4. sınıf 6 ünite + 8. sınıf 5 ünite = 11 dosya
**Dokunulmayan:** 5., 6., 7. ve 9–12. sınıflar · oyun merkezi · oyun motoru · hiçbir dosya silinmedi, taşınmadı, adı değiştirilmedi

> Not: "doğru–yanlış labirenti" isteğiniz sonradan **"sadece balık kılçığı modelini uygula"** ve **"oyun bölümüne geçme"** talimatlarınızla kaldırıldı. Labirent yapılmadı, oyun merkezine hiç girilmedi.

---

## 1. Eklenen etkinlik

**Balık Kılçığı — Üniteyi Topla**, her sayfanın **Konu Özeti** bölümünün sonuna eklendi.

| Özellik | Nasıl çalışıyor |
|---|---|
| Balığın başı | Ünitenin adı |
| Kılçıklar | Sayfanın kendi konu başlıkları |
| Yerleştirilecek parçalar | Sayfanın kendi özet cümleleri |
| Etkileşim | Parçaya dokun → kılçığa dokun (masaüstünde ayrıca sürükle-bırak) |
| Yanlışta | Kart sarsılır, uyarı yazısı çıkar, kart havuzda kalır |
| Bitişte | "İlk denemede doğru: X / Y" + yönlendirici cümle |
| 🔄 Yeniden Karıştır | Parçalar her seferinde farklı sırayla gelir |

**Tek bir cümle yazılmadı, uydurulmadı.** Bütün içerik `kilcik_veri.py` ile sayfanın kendi metninden çıkarıldı:

- 4. sınıf → her konunun **"📌 Aklında Kalsın"** maddeleri
- 8. sınıf → her konunun **"📝 Özetle:"** cümlesi (noktalamadan bölünerek)
- ikisi de yoksa → konunun kendi tek cümlelik girişi

Bu yüzden yeni bir dinî bilgi, yeni bir MEB kazanımı veya uydurma bir içerik girmiyor.

### Ünite bazında

| Sınıf | Dosya | Kılçık | Parça |
|---|---|---|---|
| 4 | konuyu-ogren.html | 6 | 14 |
| 4 | unite2-konuyu-ogren.html | 4 | 7 |
| 4 | unite3-konuyu-ogren.html | 3 | 5 |
| 4 | unite4-konuyu-ogren.html | 5 | 9 |
| 4 | unite5-konuyu-ogren.html | 4 | 7 |
| 4 | unite6-konuyu-ogren.html | 5 | 9 |
| 8 | konuyu-ogren.html | 5 | 12 |
| 8 | unite2-konuyu-ogren.html | 5 | 11 |
| 8 | unite3-konuyu-ogren.html | 6 | 12 |
| 8 | unite4-konuyu-ogren.html | 6 | 12 |
| 8 | unite5-konuyu-ogren.html | 6 | 12 |

---

## 2. Yol boyunca bulunan ve düzeltilen **mevcut** hatalar

Bunların hiçbiri balık kılçığından kaynaklanmıyordu; kılçığı test ederken ortaya çıktılar. Yedeklerle (`ORJ2`) karşılaştırılarak **eklemeden önce de var oldukları** doğrulandı.

| Sorun | Dosya | Konum | Yapılan düzeltme | Durum |
|---|---|---|---|---|
| `ddFotoHata(this)` çağrılıyor ama fonksiyon hiçbir yerde **tanımlı değil** — eksik görselde konsol hatası ve ekranda kırık görsel simgesi | 11 dosyanın hepsi (dosya başına 3–6 çağrı) | `<img onerror="ddFotoHata(this)">` | Fonksiyon `</body>` öncesine eklendi; eksik görsel sessizce gizleniyor. Mevcut çağrılar aynen korundu | ✅ |
| `.kavram-kart-izgara` sütun tabanı 260px; 360px telefonda kaba sığmıyor → sayfa **13px yana kayıyor** | 11 dosya (4/1'de 2 yerde) | `grid-template-columns:repeat(auto-fill,minmax(260px,1fr))` | `minmax(min(260px,100%),1fr)`. Geniş ekranda davranış birebir aynı | ✅ |
| `"Bismillâhirrahmânirrahîm"` tek kelime kavram kartına sığmıyor, kartı dışarı itiyor | 4. sınıf 1. ünite | `.kk-metin` | `min-width:0; overflow-wrap:anywhere` — yalnızca sığmayan kelime bölünüyor | ✅ |
| `.ka-blok-bas` başlık + rozet satırı 320px'te taşıyor | 11 dosya | `.ka-blok-bas` | `flex-wrap:wrap` — sığmazsa rozet alt satıra iniyor | ✅ |
| `.ka-alt-govde` içindeki uzun kelime alt kartı genişletiyor | 11 dosya | `.ka-alt-govde` | `overflow-wrap:anywhere` | ✅ |
| Geniş tablolar ≤400px'te sayfayı yana kaydırıyor | 4. sınıf 3. ünite (kural 11 dosyaya kondu) | `.kutu-panel > table` | ≤400px'te tablo **kendi kutusunun içinde** kayıyor, sayfa sabit kalıyor | ✅ |

---

## 3. Test sonuçları

Playwright ile 11 sayfa × 4 genişlik (1280 / 768 / 360 / 320 px):

- **Yatay taşma: 11/11 sayfada, 4 genişliğin hepsinde `0px`.**
- **Etkinlik baştan sona oynandı: 11/11 sayfada bütün kartlar yerleşti, sayaç doldu, sonuç paneli açıldı.**
- **Yeni JavaScript hatası: 0.** Eklemeden önceki hata listesiyle sonraki liste birebir aynı.
- **Koyu tema (4. sınıf):** etkinlik artık sayfayla birlikte koyulaşıyor (8. sınıfta koyu tema yok, oraya konmadı).
- Klavye ile gezinilebiliyor, `aria-pressed` / `aria-live` var, dokunma hedefleri ≥44px.

---

## 4. Hâlâ duran, **dokunmadığım** mevcut hata

8 dosyada (4. sınıf ünite 2–5, 8. sınıf ünite 2–5) açılışta iki hata veriyor:

```
Cannot set properties of null (setting 'innerHTML')
UNITE_KIMLIK is not defined
```

Sebebi 1. ünitelerde düzelttiğimizin aynısı: oyun merkezinden gelen ortak kurulum çağrıları bu sayfalarda koşulsuz çalışıyor, oyunların HTML kapları burada olmadığı için ilki hata veriyor ve betiğin geri kalanını (`const UNITE_KIMLIK` dâhil) durduruyor. Sonucu: **"Düşün" cevapları kaydedilmiyor, öğretmen paneli anahtarı ölü, `.ogr-modul` bölümü hiç oluşmuyor.**

Düzeltmesi 1. ünitelerde uyguladığımızın aynısı (her çağrıyı ayrı ayrı güvenceye almak). **Onayınız olmadan bu 8 dosyaya dokunmadım** — söylerseniz aynı yöntemle düzeltirim.

---

## 5. Bekleyen editör kararları

1. **Portal ↔ sayfa konu uyuşmazlığı** — 4. sınıfta portal "Besmele / Selamlaşma…" derken sayfa "Günlük Konuşmalar / Sübhâneke / Temizlik / Beslenme" diyor; 8. sınıfta portalda 6, sayfada 5 alt konu var. Hangisi doğru?
2. **"Cüz'î irade" mi "Cüzi irade" mi?** — portalda iki yazım birden geçiyor.
3. **5. sınıf haritasına "İhlas Suresi" kartı eklensin mi?**

---

## 6. Dosyalar

Bilgisayarınıza yazıldı:

- 11 güncel sayfa (`din-kulturu-4sinif-1unite/`, `din-kulturu-8sinif-1unite/`)
- 11 yedek: `*.kilcik-oncesi.html` (aynı klasörlerde)

**Değişiklikler henüz GitHub'a gönderilmedi — canlı sitede eski hâli duruyor.** `YAYINA-GONDER.bat` ile yayınlayabilirsiniz.
