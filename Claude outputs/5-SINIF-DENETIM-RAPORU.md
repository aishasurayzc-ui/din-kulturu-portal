# 5. SINIF DENETİM RAPORU — 1. Ünite (Allah İnancı)

**Tarih:** 13 Eylül 2026
**Kapsam:** Yalnızca `din-kulturu-5sinif-1unite/` klasörü + portalın `s5-*` verisi.
**4, 6, 7 ve 8. sınıf dosyalarına dokunulmadı.** Hiçbir dosya silinmedi,
taşınmadı, yeniden adlandırılmadı; hiçbir çalışan özellik kaldırılmadı.
Sıra: önce analiz → sonra tespit → en son düzeltme.

---

## 1. DÜZELTİLEN HATALAR

| Sorun | Dosya | Konum | Yapılan düzeltme | Durum |
|---|---|---|---|---|
| Ünite haritasındaki 6 kartın **altısı da** `konuyu-ogren.html` köküne gidiyordu; hangi konuya tıklanırsa tıklansın sayfanın en üstü açılıyordu | `index.html` | `.u51-harita` ünite haritası, 01–06 kartları | Konu anlatımı sayfasında **zaten var olan** `#ka-konu-1…4` çapaları kullanıldı. 01 → `#ka-konu-2`, 02 → `#ka-konu-1`, 03 → `#ka-konu-3` | ✅ Düzeltildi |
| "Allah'ın sıfatları" kartı, karşılığı olmayan bir sayfaya bağlıydı | `index.html` | Kart 04 (`u51-sifat`) | Kart `oyun-merkezi.html#oyun-gruplari` adresine bağlandı; kartın üstüne "Bu başlığın ayrı bir konu anlatımı bölümü yok; oyun merkezindeki sorularda işleniyor." notu eklendi. Eylem metni "Oyunlarla çalış" oldu | ✅ Düzeltildi (içerik eksiği sürüyor → §2) |
| "Allah–insan ilişkisi" kartı aynı şekilde boşa bağlıydı | `index.html` | Kart 05 (`u51-bag`) | Aynı düzeltme | ✅ Düzeltildi (içerik eksiği sürüyor → §2) |
| "Dua etmek" kartı aynı şekilde boşa bağlıydı | `index.html` | Kart 06 (`u51-dua`) | Aynı düzeltme | ✅ Düzeltildi (içerik eksiği sürüyor → §2) |
| **375 px'te sayfa 8 px yatay taşıyordu** — İhlas suresi tablosunun en dar hâli 293 px, kabı 283 px | `konuyu-ogren.html` | `#ozet1` → `.ogr-modul-govde .kutu-panel > table` | Yalnızca ≤560 px'te tablo kendi kabında yatay kaydırılır hâle getirildi (`display:block; overflow-x:auto`). Tablonun satırlarına, içeriğine ve yazı boyutuna dokunulmadı; 560 px üstünde tablo eskisi gibi | ✅ Düzeltildi |

**Düzeltme sonrası ölçüm:** 320 / 375 / 390 / 430 / 768 / 1024 / 1440 px —
her genişlikte **taşma 0 px**, JS hatası 0, kırık çapa 0.

---

## 2. DÜZELTMEDİĞİM, ÖNÜNÜZE GETİRDİĞİM EKSİKLER

Bunlar kod hatası değil, **içerik eksiği**. Kuralınız gereği
("BOŞ ALANLARI RASTGELE İÇERİKLE DOLDURMA. Eksik olan alanı önce raporla.")
hiçbirine metin uydurmadım.

| Eksik | Nerede var / yok | Ne yaptım | Kararı size ait |
|---|---|---|---|
| **Allah'ın sıfatları** | `konuyu-ogren.html`'de **hiç yok** (sayfada "sıfat" kelimesi 0 kez geçiyor). Oyun merkezinde var: `merdiven1Havuz` (VÜCUD, KIDEM, BEKA, HAYAT, SEM, BASAR, KELAM tanımlarıyla), `ezberVeri1`, `BA1_SORULAR` | Kart oyun merkezine bağlandı + dürüst not | Konu anlatımına 5. bölüm olarak eklensin mi? |
| **Allah–insan ilişkisi** | `konuyu-ogren.html`'de ayrı bölüm yok; "kulluk" yalnızca Tevhit paragrafının içinde 1 kez geçiyor. Oyun merkezinde `BA1_SORULAR` ve `SA1_KARTLAR`'da var | Aynı | Aynı |
| **Dua etmek** | `konuyu-ogren.html`'de ayrı bölüm yok. Oyun merkezinde var: `dilDedektifi1Listesi`, `ezberVeri1` ("O, duaları işiten ve kabul edendir"), `ddl1` doğru-yanlış soruları, `SA1_KARTLAR` | Aynı | Aynı |
| **"Bir Sure Öğreniyorum: İhlas Suresi"** | Konu anlatımında **4. bölüm olarak var** (`#ka-konu-4`), ama portalın `s5-u1` konu listesinde **yok** → ünite haritasında kartı da yok | Hiçbir şey — portal listesi sizin editoryal kararınız | 7. kart olarak eklensin mi, yoksa alt başlık sayılmasın mı? |

Ayrıca **konu sırası** portal ile sayfa arasında farklı:
portal "1. Allah'ın varlığı ve birliği → 2. Evrendeki düzen", konu anlatımı
"1. Evrendeki Mükemmel Düzen → 2. Allah'ın Varlığı ve Birliği".
Bağlantıları doğru eşleştirdim (kart 01 → `#ka-konu-2`), ama numaralar
görsel olarak karışık duruyor. İsterseniz ikisinden birinin sırasını
eşitlerim — hangisi doğru sıra, siz söyleyin.

MEB kazanımı konusunda: sayfada **DKAB.5.1.1 – DKAB.5.1.4** olmak üzere
**dört** kazanım var, portalda ise **altı** alt başlık. Yeni kazanım
yazmadım, mevcutlara dokunmadım.

---

## 3. HATA ÇIKMAYAN, DOĞRULANMIŞ ALANLAR

| Kontrol | Sonuç |
|---|---|
| Esmâ-i hüsnâ anlamları (er-Rahmân, er-Rezzâk, el-Alîm, el-Gafûr, Tevhit) | ✅ Akademik olarak doğru, sizin verdiğiniz metinle birebir |
| Dinî içerik hatası / kaynaksız hadis / peygamber tasviri | ✅ Hiçbiri yok |
| Oyun merkezi bağlantısı (`UNITE_KIMLIK='5-1'`, `oyunMerkeziOlustur(OYUN_LISTESI,'1','index.html')`, `dkabPuanDurumu5sinif`) | ✅ Doğru; 52 oyun listeleniyor |
| Portal ↔ sayfa konu başlıkları (yazım, kesme işareti, "Esmâ-i hüsnâ") | ✅ Altı başlık da birebir aynı |
| Geçen haftaki görsel yenilemede kaybolan şey | ✅ Yok — `goster`, `opGirisKontrol`, `opVerileriTemizle`, `opOgrenciDegistir`, 11 mega-kart, `portalNav`, `ogretmenpaneli`, `oyun-gruplari` hepsi yerinde |
| `portalNav` sınıf/ünite kimliği (`data-sinif="5"`, `data-unite="1"`) | ✅ Doğru |
| JS konsol hatası (4 sayfa × 7 genişlik) | ✅ 0 |

**Yanlış alarm olarak elenen 25 bulgu:** 8 adet `../en/...` bağlantısı
(hedefler bilgisayarınızdaki `en/` klasöründe **var**, test ortamıma
kopyalanmamıştı), `nightsky1_orta.jpg` (bilgisayarınızda **var**), ve
11 adet JS ile dolan boş kap (`#ka1Sonuc`, `#kt1rSoru`,
`#ogrIlerlemeCubuk` gibi — sayfa açıldığında boş olmaları normal).

**Bir eksiklik, hata değil:** 5. sınıfta koyu tema düğmesi yok,
4. sınıfta var. İsterseniz eklerim.

---

## 4. DEĞİŞEN DOSYALAR

| Dosya | Yedek |
|---|---|
| `din-kulturu-5sinif-1unite/index.html` | `index.denetim-oncesi.html` |
| `din-kulturu-5sinif-1unite/konuyu-ogren.html` | `konuyu-ogren.denetim-oncesi.html` |

Her ikisi de bilgisayarınıza yazıldı. Değişiklikler **eklemeli**:
yalnızca 6 kartın `href`'i, 3 kartın not satırı ve iki adet `u51-` ön ekli
`<style>` bloğu. Mevcut hiçbir kural ezilmedi.

> Not: Bu değişiklikler henüz GitHub'a gönderilmedi; yayındaki site hâlâ
> eski hâlini gösteriyor.
