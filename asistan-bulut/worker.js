/* =====================================================================
   DKAB Öğrenme Asistanı — Cloudflare Worker (bulut köprüsü), 2026-10-31
   GitHub Pages'teki çevrim içi portalın "Bana Sor" penceresi buraya bağlanır;
   Worker da Anthropic Claude API'sine bağlanır. API anahtarı yalnızca
   Cloudflare'de "Secret" olarak saklanır; GitHub'a ve sayfalara hiç gitmez.

   İKİ ÇALIŞMA BİÇİMİ:
     A) ÜCRETSİZ (varsayılan): Cloudflare Workers AI. Ayarlar → Bindings →
        "Workers AI" bağlaması, değişken adı: AI. Anahtar gerekmez; günlük
        ücretsiz kota (10.000 neuron ≈ 150-200 soru) dolunca o gün durur.
     B) ÜCRETLİ: Anthropic Claude. ANTHROPIC_API_KEY tanımlanırsa bu kullanılır.
   Cloudflare'de tanımlanabilecek ayarlar (Settings → Variables and Secrets):
     ANTHROPIC_API_KEY   (Secret, isteğe bağlı) sk-ant-...  (tanımlıysa Claude)
     UCRETSIZ_MODEL      (Text, isteğe bağlı) varsayılan: @cf/google/gemma-4-26b-a4b-it
     ERISIM_KODU         (Secret, önerilir) öğrencilere verilen sınıf kodu
     IZINLI_KOKENLER     (Text, isteğe bağlı) virgülle ayrılmış izinli adresler
                         varsayılan: GitHub Pages siteniz + bu bilgisayardaki portal (localhost:8844)
     MODEL               (Text, isteğe bağlı) varsayılan: claude-sonnet-5-5
   Uç noktalar:  GET /api/asistan/durum   ·   POST /api/asistan
   2026-11-14: "Öğretmene Sor" mesaj kutusu eklendi (D1 bağlaması DB + OGRETMEN_SIFRESI); ayrıntı aşağıda.
   Bu dosya yerel sunucudaki (asistan-sunucu.py) kurallarla aynıdır.
   2026-11-01: sınıfa (4-12) göre dil, 10 çalışma biçimi (mod), pedagojik akış ve
   ayet/hadis doğruluk kuralları eklendi (TALIMAT).
===================================================================== */
const API_URL = 'https://api.anthropic.com/v1/messages';
const VARSAYILAN_MODEL = 'claude-sonnet-5-5';
const VARSAYILAN_KOKEN = 'https://aishasurayzc-ui.github.io,https://din-kulturu-portal.pages.dev,http://localhost:8844,http://127.0.0.1:8844';
const UCRETSIZ_MODEL = '@cf/google/gemma-4-26b-a4b-it';
const AZAMI_ISTEK = 60000;
const DAKIKA_SINIRI = 20;         // aynı IP'den dakikada en fazla soru (okulda tüm sınıf tek IP'den çıkar)

/* TALIMAT-BASLA — ortak talimat (asistan-sunucu.py ile birebir aynı; talimat.json'dan üretilir) */
const TALIMAT = {
 "kimlik": "Sen \"Öğrenme Asistanı\"sın: Ayşe Yazıcı'nın Din Kültürü ve Ahlak Bilgisi (DKAB) portalında 4-12. sınıf öğrencilerine yardım eden, sabırlı ve sıcak bir Din Kültürü öğretmeni gibi davranırsın. Türkçe konuş; Türkçe karakterleri (ç, ğ, ı, İ, ö, ş, ü, â, î, û) doğru kullan.",
 "sinif": {
  "4": "SINIF DİLİ (4. sınıf): Çok sade ve kısa cümlelerle konuş. Her açıklamada çocuğun yaşadığı günlük hayattan bir örnek ver (ev, okul, oyun, aile). Soyut terim kullanma; mecbursan hemen basitçe açıkla. Cevabın genellikle 5-8 kısa cümleyi geçmesin.",
  "5": "SINIF DİLİ (5. sınıf): Somut örnekler ve çocukların anlayabileceği benzetmeler kullan (örneğin bir kuralı oyun kuralına benzetmek gibi). Kısa paragraflar ve gerektiğinde 2-4 maddelik listeler kullan.",
  "6": "SINIF DİLİ (6. sınıf): Kavramları açık bir tanımla ver ve her kavramı günlük yaşamdan bir durumla ilişkilendir; kavramın öğrencinin davranışlarına nasıl yansıyacağını göster.",
  "7": "SINIF DİLİ (7. sınıf): Kavramlar arasındaki bağlantıları açıkla (neden-sonuç, benzerlik-farklılık, bütün-parça). Gerektiğinde kısa bir kavram zinciri ya da karşılaştırma listesi kullan.",
  "8": "SINIF DİLİ (8. sınıf, LGS): Yorumlama ve çıkarım becerilerini geliştir: metin ve öncül okuma, ayet mealinden çıkarım, \"aşağıdakilerden hangisine ulaşılabilir / ulaşılamaz\" mantığı, çeldiricileri ayırt etme. Kavramların LGS'de nasıl sorulduğunu göster.",
  "9": "SINIF DİLİ (9. sınıf): Kavramsal ve sistematik açıkla: tanım, temel özellikler, ilgili kavramlar ve örnek sırasıyla ilerle; kavramları sınıflandır.",
  "10": "SINIF DİLİ (10. sınıf): Bilgi, varlık ve din konularını derinlemesine ele al; bilginin kaynakları, akıl-vahiy ilişkisi, Allah-âlem ilişkisi gibi konularda gerekçeli ve kavramsal açıklamalar yap.",
  "11": "SINIF DİLİ (11. sınıf): Felsefi düşünmeyi destekle; irade, özgürlük, sorumluluk ve kader arasındaki bağlantıları kur, farklı görüşleri gerekçeleriyle karşılaştır, öğrenciyi akıl yürütmeye davet et.",
  "12": "SINIF DİLİ (12. sınıf, TYT-AYT): Akademik ve sınav odaklı açıkla: kavramları kesin tanımlarla ver, sık karıştırılan kavramları ayırt et, YKS Din Kültürü soru tarzına uygun özetler ve kontrol listeleri sun.",
  "": "SINIF DİLİ: Öğrencinin sınıfı bilinmiyor; ortaokul seviyesinde, sade ve açık konuş."
 },
 "pedagoji": "ÖĞRETİM YAKLAŞIMI: Uzun ve tek parça cevaplar yerine öğrenmeyi adım adım destekle: açıkla → günlük hayattan örnek ver → kısa bir düşünme sorusu sor → öğrencinin cevabını değerlendir → yanlışsa doğrusunu nedeniyle açıkla → gerekirse yeni ve daha basit bir örnek sun. Bir soruyu çözmesi istenirse önce ipucu ver, öğrencinin denemesini bekle. Öğrenciyi asla küçümseme, yargılama veya başarısız hissettirme: \"yanlış\" yerine \"Bu kısmı birlikte düzeltelim\" gibi destekleyici ifadeler kullan ve çabasını takdir et. Sınıf seviyesini aşan akademik terimlerden kaçın; kullanırsan hemen açıkla.",
 "dogruluk": "DOĞRULUK (en önemli kural): (1) Önce aşağıdaki PORTAL İÇERİĞİ ve RESMÎ ÖĞRENME ÇIKTILARI bölümlerini esas al; MEB (Türkiye Yüzyılı Maarif Modeli) DKAB öğretim programındaki kavram ve kazanımlarla uyumlu konuş. (2) Ayet aktarırken sure adını ve ayet numarasını ver, anlamı Diyanet mealine sadık kalarak aktar. Ayetin numarasından veya ifadesinden emin değilsen numara verme ve ayeti aktarma; \"Bu konudaki ayetleri öğretmeninle ya da Diyanet'in Kur'an Portalı'nda bulabilirsin\" de. (3) Hadisleri kaynağıyla (Buhârî, Müslim, Tirmizî, Ebû Dâvûd vb.) aktar. Kaynağını doğrulayamadığın bir sözü hadis olarak sunma; halk arasında hadis sanılan ama kaynağı belirsiz sözleri \"kaynağı doğrulanamamış bir söz\" diye belirt. ASLA ayet, hadis, kaynak, sayı veya alıntı uydurma. (4) Mezhepler veya yorumlar arasında farklılık olan konularda bunu belirt ve tarafsız kal (örneğin Hanefî ve Şâfiî görüşleri, Alevi-Bektaşi yorumları); tek bir görüşü herkes için kesin hüküm gibi sunma. (5) Kendi yorumunu kesin dinî hüküm gibi gösterme; fetva verme. Kişisel dinî hüküm soruları için öğretmenine, ailesine veya Diyanet İşleri Başkanlığı'na danışmasını öner. (6) Bir bilgiden emin değilsen bunu açıkça söyle; tahmin yürütme. (7) Soru portal içeriğinde yoksa bunu belirt ve yalnızca programla uyumlu, genel ve güvenli bir açıklama yap. (8) Ders dışı, uygunsuz ya da kişisel bilgi isteyen konulara girme; öğrencinin adını, okulunu, adresini sorma; nazikçe derse dön.",
 "portal": "PORTAL BÖLÜMLERİ: Portalda şu bölümler var: Açık Uçlu Soru Merkezi (4-12. sınıflar, her ünite için 50 soru, cevap anahtarı ve puanlama), Sınav Merkezi (LGS, TYT ve AYT hazırlık), Etkinlik ve Oyun Merkezi (4-8. sınıflar), sınıf sayfalarında yazılı sınavlar ve çalışma kâğıtları. Uygun olduğunda öğrenciyi bu bölümlerin ADINI anarak yönlendir (örneğin \"Açık Uçlu Soru Merkezi'nde bu ünitenin sorularıyla kendini deneyebilirsin\"). İnternet adresi veya bağlantı yazma; bağlantılar pencerede ayrıca gösterilir.",
 "bicim": "BİÇİM: Kısa cevaplarda düz metin kullan. Uzun cevaplarda \"### \" ile kısa başlıklar, \"- \" ile maddeler, önemli kavramlar için **kalın** kullan. Ayet ve hadis metinlerini \"> \" ile başlayan ayrı bir satırda ver. Tablo, HTML, bağlantı ve çok sayıda emoji kullanma. Bir cevap genellikle 180 kelimeyi geçmesin (konu anlatımı ve özette en fazla 260 kelime).",
 "mod": {
  "anlat": "ÇALIŞMA BİÇİMİ — Konuyu Anlat: Konuyu sınıf seviyesine uygun, adım adım anlat. Sıra: (1) kısa giriş ve temel kavramın tanımı, (2) 2-4 maddelik ana noktalar, (3) günlük hayattan bir örnek, (4) öğrencinin anladığını yoklayan TEK bir kısa düşünme sorusu. Öğrenci cevap verince değerlendir, sonra konunun bir sonraki bölümüne geç.",
  "acikla": "ÇALIŞMA BİÇİMİ — Anlamadığım Yeri Açıkla: Öğrencinin anlamadığı noktayı belirle ve önceki açıklamadan FARKLI, daha basit bir yoldan açıkla (benzetme, somut örnek, adım adım). Sonra anlayıp anlamadığını kısa bir soruyla kontrol et. Öğrenci hangi kısmı anlamadığını belirtmediyse önce nazikçe bunu sor.",
  "ornek": "ÇALIŞMA BİÇİMİ — Günlük Hayattan Örnek Ver: Konuyla ilgili öğrencinin yaşına uygun 2-3 günlük hayat örneği ver; her örnekte konunun hangi kavramının nasıl görüldüğünü bir cümleyle bağla. Sonunda öğrenciden kendi örneğini yazmasını iste; yazınca değerlendir.",
  "ayet": "ÇALIŞMA BİÇİMİ — Ayet ve Hadislerle Açıkla: Konuyu ilgili ayet ve hadislerle açıkla. Her ayet için sure adı ve ayet numarasını, her hadis için kaynağını ver (yukarıdaki doğruluk kurallarına kesinlikle uy). Ardından metnin konuyla bağlantısını ve sınıf seviyesine uygun yorumunu açıkla. En fazla 2-3 metin kullan; ezber değil anlama odaklan ve sonunda metni yorumlamasını isteyen kısa bir soru sor.",
  "karsilastir": "ÇALIŞMA BİÇİMİ — Kavramları Karşılaştır: Konudaki birbirine yakın veya sık karıştırılan 2-3 kavramı seç (öğrenci belirttiyse onları). Her kavramın kısa tanımını ver, sonra benzer ve farklı yönlerini maddelerle göster, her birine kısa örnek ekle. Sonunda iki kavramı ayırt etmesini isteyen küçük bir soru sor.",
  "soru5": "ÇALIŞMA BİÇİMİ — Bana 5 Soru Sor: Konudan sınıf seviyesine uygun 5 soru hazırla ama SORULARI TEK TEK sor: önce yalnızca 1. soruyu \"Soru 1/5\" diye yaz ve cevabı bekle; cevabı ASLA önceden verme. Öğrenci cevaplayınca: doğruysa kısaca takdir et ve nedenini söyle; kısmen doğruysa eksik kısmı tamamla; yanlışsa yargılamadan doğrusunu ve nedenini açıkla. Sonra bir sonraki soruya geç. Sorular çeşitli olsun (bilgi, yorum, günlük hayat). 5. sorudan sonra kısa bir değerlendirme yap: güçlü yönler ve tekrar edilmesi gereken kavramlar.",
  "lgs": "ÇALIŞMA BİÇİMİ — LGS Sorusu Çöz: Ekranda bir soru varsa onu LGS mantığıyla adım adım çözdür (metni/öncülü okuma, anahtar kavramı bulma, seçenekleri eleme) ve önce öğrencinin denemesini iste. Ekranda soru yoksa konudan LGS tarzında, 4 seçenekli (A, B, C, D) yeni bir soru yaz; doğru cevabı HEMEN verme, öğrencinin seçimini bekle; sonra her seçeneğin neden doğru ya da yanlış olduğunu açıkla. Öğrenci 8. sınıf değilse soruyu onun seviyesine uyarla ve bunu belirt.",
  "tyt": "ÇALIŞMA BİÇİMİ — TYT-AYT Hazırlık: YKS'deki Din Kültürü ve Ahlak Bilgisi sorularına uygun çalış. Konunun sınavda öne çıkan kavramlarını kısa ve kesin tanımlarla özetle, sık karıştırılan kavramları belirt, sonra 5 seçenekli (A-E) bir örnek soru yaz ve öğrencinin cevabını bekle; cevap gelince açıkla. Öğrenci 4-10. sınıftaysa bunun ileriki yıllara hazırlık olduğunu belirt ve soruyu seviyesine uyarla.",
  "yazili": "ÇALIŞMA BİÇİMİ — Yazılıya Hazırlan: Okul yazılı sınavına hazırlık yap. Önce konunun yazılıda sorulabilecek 3-5 temel noktasını maddele. Sonra bir açık uçlu yazılı sorusu sor ve öğrencinin cevabını bekle. Cevap gelince 10 puan üzerinden ölçütlere göre değerlendir (hangi unsurlar var, hangileri eksik), ardından tam puanlık örnek cevabı göster ve yeni bir soru öner.",
  "ozet": "ÇALIŞMA BİÇİMİ — Konuyu Özetle: Konuyu sınıf seviyesine uygun bir başlık ve 5-7 maddeyle özetle; temel kavramları **kalın** yaz. Sonunda \"### Kendini kontrol et\" başlığıyla 2 kısa soru sor."
 }
};
/* TALIMAT-BITIR */
const MODLAR = Object.keys(TALIMAT.mod);
function kisalt(s, n){ return String(s == null ? '' : s).slice(0, n); }
function sistemTalimati(b){
  const s = parseInt(b.sinif, 10);
  const sk = (s >= 4 && s <= 12) ? String(s) : '';
  const p = [TALIMAT.kimlik, TALIMAT.sinif[sk], TALIMAT.pedagoji, TALIMAT.dogruluk, TALIMAT.portal, TALIMAT.bicim];
  if(b.mod && MODLAR.includes(b.mod)) p.push(TALIMAT.mod[b.mod]);
  const bag = [];
  if(sk) bag.push('Sınıf: ' + sk + (b.sinifKaynak === 'secim' ? ' (öğrenci kendisi seçti)' : ''));
  if(b.unite) bag.push('Ünite: ' + kisalt(b.unite, 200));
  if(b.konu) bag.push('Konu: ' + kisalt(b.konu, 200));
  if(b.etkinlik) bag.push('Çalışılan etkinlik: ' + kisalt(b.etkinlik, 200));
  if(b.soru) bag.push('Ekrandaki soru: ' + kisalt(b.soru, 800));
  if(b.sonYanlis) bag.push('Öğrencinin son yanlış cevabı: ' + kisalt(b.sonYanlis, 800));
  if(bag.length) p.push('ÖĞRENCİNİN DURUMU (öğrenciye sınıfını veya konusunu tekrar sorma):\n' + bag.join('\n'));
  if(b.ciktilar) p.push('RESMÎ ÖĞRENME ÇIKTILARI (MEB programı, bu ünite):\n' + kisalt(b.ciktilar, 3000));
  if(b.icerik) p.push('PORTAL İÇERİĞİ (öğrencinin açık sayfasındaki ders metni):\n<<<\n' + kisalt(b.icerik, 24000) + '\n>>>');
  else p.push('PORTAL İÇERİĞİ: Bu sayfada ders metni algılanamadı; resmî öğrenme çıktılarına ve programa uygun, genel ve güvenli açıklamalar yap.');
  return p.join('\n\n');
}

const zamanlar = new Map();   // IP → son istek zamanları (aynı sunucu örneği içinde)
function hizSiniri(ip){
  const simdi = Date.now(), dizi = (zamanlar.get(ip) || []).filter(t => simdi - t < 60000);
  if(dizi.length >= DAKIKA_SINIRI){ zamanlar.set(ip, dizi); return true; }
  dizi.push(simdi); zamanlar.set(ip, dizi);
  if(zamanlar.size > 5000) zamanlar.clear();
  return false;
}
function izinliKokenler(env){
  return String(env.IZINLI_KOKENLER || VARSAYILAN_KOKEN).split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean);
}
function corsBasliklari(koken, env){
  const h = {'Vary': 'Origin'};
  if(koken && izinliKokenler(env).includes(koken)){
    h['Access-Control-Allow-Origin'] = koken;
    h['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Content-Type, X-Erisim-Kodu, X-Ogretmen-Sifresi';
    h['Access-Control-Max-Age'] = '86400';
  }
  return h;
}
function json(kod, veri, cors){
  return new Response(JSON.stringify(veri), {status: kod, headers: Object.assign({'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'}, cors)});
}

async function yapayZekayaSor(b, env){
  const gecmis = [];
  for(const m of (Array.isArray(b.mesajlar) ? b.mesajlar : []).slice(-12)){
    const rol = m && m.rol === 'asistan' ? 'assistant' : 'user';
    const metin = String((m && m.metin) || '').slice(0, 4000).trim();
    if(!metin) continue;
    if(gecmis.length && gecmis[gecmis.length-1].role === rol) gecmis[gecmis.length-1].content += '\n' + metin;
    else gecmis.push({role: rol, content: metin});
  }
  while(gecmis.length && gecmis[0].role !== 'user') gecmis.shift();
  if(!gecmis.length || gecmis[gecmis.length-1].role !== 'user') return [400, {hata: 'mesaj_yok'}];
  if(!env.ANTHROPIC_API_KEY) return ucretsizSor(b, gecmis, env);
  let r;
  try{
    r = await fetch(env.API_URL || API_URL, {
      method: 'POST',
      headers: {'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json'},
      body: JSON.stringify({model: env.MODEL || VARSAYILAN_MODEL, max_tokens: 1500, system: sistemTalimati(b), messages: gecmis})
    });
  }catch(e){ return [502, {hata: 'baglanti'}]; }
  if(!r.ok){
    const kod = {401: 'anahtar_gecersiz', 403: 'yetki_yok', 404: 'model_bulunamadi', 429: 'yogunluk', 529: 'yogunluk'}[r.status] || 'servis_hatasi';
    return [502, {hata: kod}];
  }
  const y = await r.json();
  const metin = (y.content || []).filter(p => p.type === 'text').map(p => p.text).join('').trim();
  if(!metin) return [502, {hata: 'bos_yanit'}];
  return [200, {cevap: metin, model: y.model}];
}

/* Ücretsiz yol: Cloudflare Workers AI (günlük kota dolunca o gün durur, ücret çıkmaz) */
async function ucretsizSor(b, gecmis, env){
  if(!env.AI) return [503, {hata: 'yapilandirilmadi'}];
  const kisa = Object.assign({}, b, {icerik: String(b.icerik || '').slice(0, 12000)});   // kotayı korumak için
  let y;
  try{
    y = await env.AI.run(env.UCRETSIZ_MODEL || UCRETSIZ_MODEL, {
      messages: [{role: 'system', content: sistemTalimati(kisa)}].concat(gecmis.slice(-8)),
      max_tokens: 3000, temperature: 0.4
    });
  }catch(e){
    const m = String((e && e.message) || e);
    if(/neuron|allocation|quota|daily|4006|limit/i.test(m)) return [429, {hata: 'gunluk_sinir'}];
    return [502, {hata: 'servis_hatasi'}];
  }
  let metin = '';
  const r0 = y && y.result ? y.result : y;
  if(r0 && typeof r0.response === 'string') metin = r0.response;
  else if(r0 && r0.choices && r0.choices[0]){
    const c = r0.choices[0].message || r0.choices[0];
    const icerik = c.content != null ? c.content : c.text;
    metin = Array.isArray(icerik) ? icerik.map(p => (p && (p.text || p.content)) || '').join('') : (icerik || '');
  }
  else if(r0 && typeof r0.output_text === 'string') metin = r0.output_text;
  else if(typeof r0 === 'string') metin = r0;
  metin = String(metin || '').replace(/<think>[\s\S]*?<\/think>/g, '').replace(/^[\s\S]*?<\/think>/, '').trim();
  if(!metin) return [502, {hata: 'bos_yanit', ayrinti: JSON.stringify(y).slice(0, 600)}];
  return [200, {cevap: metin, model: env.UCRETSIZ_MODEL || UCRETSIZ_MODEL}];
}


/* =====================================================================
   ÖĞRETMENE SOR — mesaj kutusu (2026-11-14)
   Öğrenci "Bana Sor" penceresindeki "Öğretmene Sor" sekmesinden soru gönderir;
   soru Cloudflare D1 veritabanında saklanır. Öğretmen, şifreyle girdiği
   "Mesajlar" panelinden (ogretmen-mesajlar.html) okur ve cevaplar; öğrenci
   cevabı aynı cihazda "Sorularım" bölümünde görür (cihazdaki gizli anahtarla).
   Gerekenler (Cloudflare → Worker → Settings):
     Bindings → D1 database, değişken adı: DB   (veritabanı: dkab-mesajlar)
     Variables and Secrets → Secret: OGRETMEN_SIFRESI (en az 8 karakter)
   Tablolar ilk istekte kendiliğinden oluşturulur.
   Uç noktalar:
     GET  /api/mesaj/durum                 → mesaj kutusu açık mı?
     POST /api/mesaj                       → yeni soru  {ad, sinif, sube, metin, konu, unite, sayfa}
     POST /api/mesaj/benim                 → öğrencinin sorularının durumu  {liste:[{id, anahtar}], gordu:[id]}
     POST /api/mesaj/ek                    → öğrencinin aynı soruya ek mesajı  {id, anahtar, metin}
     (öğretmen; başlık: X-Ogretmen-Sifresi)
     GET  /api/ogretmen/ozet               → sayılar ve son değişiklik zamanı (?hafif=1: yalnızca son zaman)
     GET  /api/ogretmen/mesajlar           → liste  ?kutu=yeni|okundu|cevaplandi|arsiv|onemli|tumu &sinif= &ara= &once=
     GET  /api/ogretmen/mesaj?id=          → tek soru ve bütün yazışma (okundu olarak işaretler)
     POST /api/ogretmen/cevap              → {id, metin}
     POST /api/ogretmen/isaret             → {id, durum?, onemli?}
     POST /api/ogretmen/sil                → {id}
===================================================================== */
const MESAJ_AZAMI = 1200, AD_AZAMI = 40, GUNLUK_TOPLAM = 600, SAATLIK_CIHAZ = 10, SAATLIK_IP = 150;   /* okulda bütün sınıf aynı IP'den çıkar */
const DURUMLAR = ['yeni', 'okundu', 'cevaplandi', 'arsiv'];
let tablolarHazir = false;
async function tablolar(env){
  if(tablolarHazir) return;
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS mesajlar (
      id TEXT PRIMARY KEY, anahtar TEXT NOT NULL, ad TEXT NOT NULL, sinif INTEGER, sube TEXT,
      konu TEXT, unite TEXT, sayfa TEXT, durum TEXT NOT NULL DEFAULT 'yeni', onemli INTEGER NOT NULL DEFAULT 0,
      olusturma INTEGER NOT NULL, guncelleme INTEGER NOT NULL, son_ogrenci INTEGER NOT NULL, son_ogretmen INTEGER,
      ogrenci_gordu INTEGER, ip TEXT, cihaz TEXT)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS iletiler (
      no INTEGER PRIMARY KEY AUTOINCREMENT, mesaj_id TEXT NOT NULL, kimden TEXT NOT NULL, metin TEXT NOT NULL, zaman INTEGER NOT NULL)`),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS i_mesaj_guncel ON mesajlar(guncelleme DESC)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS i_ileti_mesaj ON iletiler(mesaj_id, no)')
  ]);
  tablolarHazir = true;
}
function rastgele(n){ const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, x => x.toString(16).padStart(2, '0')).join(''); }
async function ozet(s){ const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s))); return Array.from(new Uint8Array(h), x => x.toString(16).padStart(2, '0')).join(''); }
function esitMi(a, b){ a = String(a); b = String(b); if(a.length !== b.length) return false; let f = 0; for(let i = 0; i < a.length; i++) f |= a.charCodeAt(i) ^ b.charCodeAt(i); return f === 0; }
function metinTemizle(s, n){ return String(s == null ? '' : s).replace(/\r/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, n); }
function tekSatir(s, n){ return metinTemizle(s, n).replace(/\s+/g, ' '); }
async function govdeOku(request, sinir){
  const t = await request.text();
  if(!t || t.length > sinir) return null;
  try{ return JSON.parse(t); }catch(e){ return null; }
}
const ogretmenDenemeleri = new Map();
function ogretmenKilitli(ip){
  const simdi = Date.now(), d = (ogretmenDenemeleri.get(ip) || []).filter(t => simdi - t < 10 * 60000);
  ogretmenDenemeleri.set(ip, d);
  return d.length >= 8;
}
async function ogretmenMi(request, env, ip){
  const s = request.headers.get('X-Ogretmen-Sifresi') || '';
  if(!env.OGRETMEN_SIFRESI || String(env.OGRETMEN_SIFRESI).length < 8) return 'sifre_tanimsiz';
  if(ogretmenKilitli(ip)) return 'cok_deneme';
  if(s && esitMi(await ozet(s), await ozet(env.OGRETMEN_SIFRESI))) return 'tamam';
  ogretmenDenemeleri.get(ip).push(Date.now());
  return 'sifre_hatali';
}
function mesajSatiri(r){
  return { id:r.id, ad:r.ad, sinif:r.sinif, sube:r.sube || '', konu:r.konu || '', unite:r.unite || '', sayfa:r.sayfa || '',
    durum:r.durum, onemli:!!r.onemli, olusturma:r.olusturma, guncelleme:r.guncelleme, sonOgrenci:r.son_ogrenci,
    sonOgretmen:r.son_ogretmen || null, ogrenciGordu:r.ogrenci_gordu || null };
}

async function mesajIstegi(request, env, url, cors){
  const yol = url.pathname, ip = request.headers.get('CF-Connecting-IP') || 'bilinmiyor';
  if(yol === '/api/mesaj/durum' && request.method === 'GET') return json(200, {etkin: !!env.DB, ogretmenHazir: !!(env.OGRETMEN_SIFRESI && String(env.OGRETMEN_SIFRESI).length >= 8)}, cors);
  const koken = request.headers.get('Origin');
  if(!koken || !izinliKokenler(env).includes(koken)) return json(403, {hata: 'izin_yok'}, cors);
  if(!env.DB) return json(503, {hata: 'mesaj_kapali'}, cors);
  await tablolar(env);
  const simdi = Date.now();

  /* ---------- öğrenci ---------- */
  if(yol === '/api/mesaj' && request.method === 'POST'){
    if(hizSiniri('m:' + ip)) return json(429, {hata: 'cok_hizli'}, cors);
    const b = await govdeOku(request, 8000); if(!b) return json(400, {hata: 'gecersiz_istek'}, cors);
    const ad = tekSatir(b.ad, AD_AZAMI), metin = metinTemizle(b.metin, MESAJ_AZAMI);
    const sinif = parseInt(b.sinif, 10), sube = tekSatir(b.sube, 4).toLocaleUpperCase('tr');
    if(ad.length < 2) return json(400, {hata: 'ad_gerekli'}, cors);
    if(!(sinif >= 4 && sinif <= 12)) return json(400, {hata: 'sinif_gerekli'}, cors);
    if(metin.length < 5) return json(400, {hata: 'soru_kisa'}, cors);
    const ipOzet = (await ozet('dkab:' + ip)).slice(0, 24), cihaz = (await ozet('dkab-c:' + tekSatir(b.cihaz, 64))).slice(0, 24);
    const say = await env.DB.prepare('SELECT (SELECT COUNT(*) FROM mesajlar WHERE ip = ?1 AND olusturma > ?2) AS ipde, (SELECT COUNT(*) FROM mesajlar WHERE cihaz = ?4 AND olusturma > ?2) AS cihazda, (SELECT COUNT(*) FROM mesajlar WHERE olusturma > ?3) AS gun')
      .bind(ipOzet, simdi - 3600000, simdi - 86400000, cihaz).first();
    if(say && (say.cihazda >= SAATLIK_CIHAZ || say.ipde >= SAATLIK_IP)) return json(429, {hata: 'saatlik_sinir'}, cors);
    if(say && say.gun >= GUNLUK_TOPLAM) return json(429, {hata: 'gunluk_sinir_mesaj'}, cors);
    const id = simdi.toString(36) + rastgele(4), anahtar = rastgele(16);
    await env.DB.batch([
      env.DB.prepare('INSERT INTO mesajlar (id, anahtar, ad, sinif, sube, konu, unite, sayfa, durum, olusturma, guncelleme, son_ogrenci, ip, cihaz) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,\'yeni\',?9,?9,?9,?10,?11)')
        .bind(id, await ozet(anahtar), ad, sinif, sube, tekSatir(b.konu, 160), tekSatir(b.unite, 160), tekSatir(b.sayfa, 300), simdi, ipOzet, cihaz),
      env.DB.prepare('INSERT INTO iletiler (mesaj_id, kimden, metin, zaman) VALUES (?1, \'ogrenci\', ?2, ?3)').bind(id, metin, simdi)
    ]);
    return json(200, {id, anahtar, zaman: simdi}, cors);
  }
  if(yol === '/api/mesaj/benim' && request.method === 'POST'){
    const b = await govdeOku(request, 20000); if(!b || !Array.isArray(b.liste)) return json(400, {hata: 'gecersiz_istek'}, cors);
    const liste = b.liste.slice(0, 40).filter(x => x && typeof x.id === 'string' && typeof x.anahtar === 'string');
    if(!liste.length) return json(200, {mesajlar: []}, cors);
    const yer = liste.map((_, i) => '?' + (i + 1)).join(',');
    const sat = await env.DB.prepare('SELECT * FROM mesajlar WHERE id IN (' + yer + ')').bind(...liste.map(x => x.id)).all();
    const gecerli = [];
    for(const r of sat.results || []){
      const k = liste.find(x => x.id === r.id);
      if(k && esitMi(await ozet(k.anahtar), r.anahtar)) gecerli.push(r);
    }
    const gordu = Array.isArray(b.gordu) ? b.gordu.filter(id => gecerli.some(r => r.id === id && r.son_ogretmen && (!r.ogrenci_gordu || r.ogrenci_gordu < r.son_ogretmen))) : [];
    if(gordu.length) await env.DB.batch(gordu.map(id => env.DB.prepare('UPDATE mesajlar SET ogrenci_gordu = ?1 WHERE id = ?2').bind(simdi, id)));
    const cikti = [];
    if(gecerli.length){
      const y2 = gecerli.map((_, i) => '?' + (i + 1)).join(',');
      const il = await env.DB.prepare('SELECT mesaj_id, kimden, metin, zaman FROM iletiler WHERE mesaj_id IN (' + y2 + ') ORDER BY no').bind(...gecerli.map(r => r.id)).all();
      for(const r of gecerli){
        cikti.push({ id:r.id, durum: r.durum === 'arsiv' ? (r.son_ogretmen ? 'cevaplandi' : 'okundu') : r.durum, konu:r.konu || '', olusturma:r.olusturma,
          sonOgretmen:r.son_ogretmen || null, gordu: gordu.includes(r.id) ? simdi : (r.ogrenci_gordu || null),
          iletiler: (il.results || []).filter(x => x.mesaj_id === r.id).map(x => ({kimden:x.kimden, metin:x.metin, zaman:x.zaman})) });
      }
    }
    return json(200, {mesajlar: cikti}, cors);
  }
  if(yol === '/api/mesaj/ek' && request.method === 'POST'){
    if(hizSiniri('m:' + ip)) return json(429, {hata: 'cok_hizli'}, cors);
    const b = await govdeOku(request, 8000); if(!b) return json(400, {hata: 'gecersiz_istek'}, cors);
    const metin = metinTemizle(b.metin, MESAJ_AZAMI);
    if(metin.length < 2) return json(400, {hata: 'soru_kisa'}, cors);
    const r = await env.DB.prepare('SELECT id, anahtar FROM mesajlar WHERE id = ?1').bind(String(b.id || '')).first();
    if(!r || !esitMi(await ozet(String(b.anahtar || '')), r.anahtar)) return json(404, {hata: 'bulunamadi'}, cors);
    const adet = await env.DB.prepare('SELECT COUNT(*) AS n FROM iletiler WHERE mesaj_id = ?1').bind(r.id).first();
    if(adet && adet.n >= 30) return json(429, {hata: 'yazisma_dolu'}, cors);
    await env.DB.batch([
      env.DB.prepare('INSERT INTO iletiler (mesaj_id, kimden, metin, zaman) VALUES (?1, \'ogrenci\', ?2, ?3)').bind(r.id, metin, simdi),
      env.DB.prepare('UPDATE mesajlar SET durum = \'yeni\', guncelleme = ?1, son_ogrenci = ?1 WHERE id = ?2').bind(simdi, r.id)
    ]);
    return json(200, {tamam: true, zaman: simdi}, cors);
  }

  /* ---------- öğretmen ---------- */
  if(yol.startsWith('/api/ogretmen/')){
    const yetki = await ogretmenMi(request, env, ip);
    if(yetki !== 'tamam') return json(yetki === 'sifre_tanimsiz' ? 503 : (yetki === 'cok_deneme' ? 429 : 401), {hata: yetki}, cors);
    if(yol === '/api/ogretmen/ozet' && request.method === 'GET'){
      if(url.searchParams.get('hafif')){   /* sık yoklama: yalnızca son değişiklik zamanı (dizinden tek satır okur) */
        const h = await env.DB.prepare('SELECT guncelleme AS son FROM mesajlar ORDER BY guncelleme DESC LIMIT 1').first();
        return json(200, {son: (h && h.son) || 0, zaman: simdi}, cors);
      }
      const r = await env.DB.prepare(`SELECT
        SUM(CASE WHEN durum='yeni' THEN 1 ELSE 0 END) AS yeni, SUM(CASE WHEN durum='okundu' THEN 1 ELSE 0 END) AS okundu,
        SUM(CASE WHEN durum='cevaplandi' THEN 1 ELSE 0 END) AS cevaplandi, SUM(CASE WHEN durum='arsiv' THEN 1 ELSE 0 END) AS arsiv,
        SUM(CASE WHEN onemli=1 AND durum!='arsiv' THEN 1 ELSE 0 END) AS onemli, COUNT(*) AS tumu,
        SUM(CASE WHEN olusturma > ?1 THEN 1 ELSE 0 END) AS bugun, MAX(guncelleme) AS son FROM mesajlar`).bind(simdi - 86400000).first();
      const ort = await env.DB.prepare('SELECT AVG(son_ogretmen - olusturma) AS ms FROM mesajlar WHERE son_ogretmen IS NOT NULL AND olusturma > ?1').bind(simdi - 30 * 86400000).first();
      const o = {}; for(const k of ['yeni','okundu','cevaplandi','arsiv','onemli','tumu','bugun']) o[k] = (r && r[k]) || 0;
      o.son = (r && r.son) || 0; o.ortalamaCevapMs = ort && ort.ms ? Math.round(ort.ms) : null; o.zaman = simdi;
      return json(200, o, cors);
    }
    if(yol === '/api/ogretmen/mesajlar' && request.method === 'GET'){
      const kutu = url.searchParams.get('kutu') || 'gelen', kosul = [], deg = [];
      if(kutu === 'gelen') kosul.push("durum != 'arsiv'");
      else if(kutu === 'onemli') kosul.push("onemli = 1 AND durum != 'arsiv'");
      else if(DURUMLAR.includes(kutu)) { kosul.push('durum = ?'); deg.push(kutu); }
      const s = parseInt(url.searchParams.get('sinif'), 10); if(s >= 4 && s <= 12){ kosul.push('sinif = ?'); deg.push(s); }
      const ara = tekSatir(url.searchParams.get('ara'), 60).toLocaleLowerCase('tr');
      if(ara){ kosul.push("(lower(ad) LIKE ? OR lower(konu) LIKE ? OR id IN (SELECT mesaj_id FROM iletiler WHERE lower(metin) LIKE ?))"); const a = '%' + ara.replace(/[%_]/g, '') + '%'; deg.push(a, a, a); }
      const once = parseInt(url.searchParams.get('once'), 10); if(once > 0){ kosul.push('guncelleme < ?'); deg.push(once); }
      const sql = 'SELECT m.*, (SELECT metin FROM iletiler WHERE mesaj_id = m.id ORDER BY no DESC LIMIT 1) AS son_metin, (SELECT kimden FROM iletiler WHERE mesaj_id = m.id ORDER BY no DESC LIMIT 1) AS son_kimden, (SELECT COUNT(*) FROM iletiler WHERE mesaj_id = m.id) AS ileti_sayisi FROM mesajlar m' +
        (kosul.length ? ' WHERE ' + kosul.join(' AND ') : '') + ' ORDER BY guncelleme DESC LIMIT 60';
      const r = await env.DB.prepare(sql).bind(...deg).all();
      return json(200, {mesajlar: (r.results || []).map(x => Object.assign(mesajSatiri(x), {onizleme: String(x.son_metin || '').slice(0, 160), sonKimden: x.son_kimden, iletiSayisi: x.ileti_sayisi})), devam: (r.results || []).length === 60}, cors);
    }
    if(yol === '/api/ogretmen/mesaj' && request.method === 'GET'){
      const id = String(url.searchParams.get('id') || '');
      const r = await env.DB.prepare('SELECT * FROM mesajlar WHERE id = ?1').bind(id).first();
      if(!r) return json(404, {hata: 'bulunamadi'}, cors);
      if(r.durum === 'yeni'){ await env.DB.prepare("UPDATE mesajlar SET durum = 'okundu' WHERE id = ?1").bind(id).run(); r.durum = 'okundu'; }
      const il = await env.DB.prepare('SELECT no, kimden, metin, zaman FROM iletiler WHERE mesaj_id = ?1 ORDER BY no').bind(id).all();
      const gecmis = await env.DB.prepare('SELECT COUNT(*) AS n FROM mesajlar WHERE ad = ?1 AND sinif = ?2 AND id != ?3').bind(r.ad, r.sinif, id).first();
      return json(200, Object.assign(mesajSatiri(r), {iletiler: il.results || [], ayniOgrenciDiger: (gecmis && gecmis.n) || 0}), cors);
    }
    if(yol === '/api/ogretmen/cevap' && request.method === 'POST'){
      const b = await govdeOku(request, 12000); if(!b) return json(400, {hata: 'gecersiz_istek'}, cors);
      const metin = metinTemizle(b.metin, 4000); if(metin.length < 1) return json(400, {hata: 'cevap_bos'}, cors);
      const r = await env.DB.prepare('SELECT id FROM mesajlar WHERE id = ?1').bind(String(b.id || '')).first();
      if(!r) return json(404, {hata: 'bulunamadi'}, cors);
      await env.DB.batch([
        env.DB.prepare("INSERT INTO iletiler (mesaj_id, kimden, metin, zaman) VALUES (?1, 'ogretmen', ?2, ?3)").bind(r.id, metin, simdi),
        env.DB.prepare("UPDATE mesajlar SET durum = 'cevaplandi', guncelleme = ?1, son_ogretmen = ?1 WHERE id = ?2").bind(simdi, r.id)
      ]);
      return json(200, {tamam: true, zaman: simdi}, cors);
    }
    if(yol === '/api/ogretmen/isaret' && request.method === 'POST'){
      const b = await govdeOku(request, 2000); if(!b) return json(400, {hata: 'gecersiz_istek'}, cors);
      const id = String(b.id || ''), parca = [], deg = [];
      if(b.durum !== undefined){ if(!DURUMLAR.includes(b.durum)) return json(400, {hata: 'gecersiz_durum'}, cors); parca.push('durum = ?'); deg.push(b.durum); }
      if(b.onemli !== undefined){ parca.push('onemli = ?'); deg.push(b.onemli ? 1 : 0); }
      if(!parca.length) return json(400, {hata: 'gecersiz_istek'}, cors);
      const r = await env.DB.prepare('UPDATE mesajlar SET ' + parca.join(', ') + ' WHERE id = ?').bind(...deg, id).run();
      return json(r.meta && r.meta.changes ? 200 : 404, r.meta && r.meta.changes ? {tamam: true} : {hata: 'bulunamadi'}, cors);
    }
    if(yol === '/api/ogretmen/sil' && request.method === 'POST'){
      const b = await govdeOku(request, 2000); if(!b) return json(400, {hata: 'gecersiz_istek'}, cors);
      const id = String(b.id || '');
      await env.DB.batch([ env.DB.prepare('DELETE FROM iletiler WHERE mesaj_id = ?1').bind(id), env.DB.prepare('DELETE FROM mesajlar WHERE id = ?1').bind(id) ]);
      return json(200, {tamam: true}, cors);
    }
  }
  return json(404, {hata: 'bulunamadi'}, cors);
}

export default {
  async fetch(request, env){
    const url = new URL(request.url);
    const koken = request.headers.get('Origin');
    const cors = corsBasliklari(koken, env);
    if(request.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors});
    if(url.pathname.startsWith('/api/mesaj') || url.pathname.startsWith('/api/ogretmen/')){
      try{ return await mesajIstegi(request, env, url, cors); }
      catch(e){ return json(500, {hata: 'sunucu_hatasi'}, cors); }
    }
    if(url.pathname === '/api/asistan/durum' && request.method === 'GET'){
      return json(200, {yapilandirildi: !!(env.ANTHROPIC_API_KEY || env.AI), ucretsiz: !env.ANTHROPIC_API_KEY && !!env.AI, kodGerekli: !!env.ERISIM_KODU}, cors);
    }
    if(url.pathname !== '/api/asistan' || request.method !== 'POST') return json(404, {hata: 'bulunamadi'}, cors);
    if(!koken || !izinliKokenler(env).includes(koken)) return json(403, {hata: 'izin_yok'}, cors);
    if(!env.ANTHROPIC_API_KEY && !env.AI) return json(503, {hata: 'yapilandirilmadi'}, cors);
    if(env.ERISIM_KODU){
      const k = (request.headers.get('X-Erisim-Kodu') || '').trim();
      if(!k) return json(401, {hata: 'kod_gerekli'}, cors);
      if(k.toLocaleLowerCase('tr') !== String(env.ERISIM_KODU).trim().toLocaleLowerCase('tr')) return json(401, {hata: 'kod_hatali'}, cors);
    }
    const ip = request.headers.get('CF-Connecting-IP') || 'bilinmiyor';
    if(hizSiniri(ip)) return json(429, {hata: 'cok_hizli'}, cors);
    const metin = await request.text();
    if(!metin || metin.length > AZAMI_ISTEK) return json(413, {hata: 'istek_buyuk'}, cors);
    let b;
    try{ b = JSON.parse(metin); }catch(e){ return json(400, {hata: 'gecersiz_istek'}, cors); }
    const [kod, veri] = await yapayZekayaSor(b, env);
    return json(kod, veri, cors);
  }
};
