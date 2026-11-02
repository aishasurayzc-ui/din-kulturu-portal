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
    h['Access-Control-Allow-Headers'] = 'Content-Type, X-Erisim-Kodu';
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

export default {
  async fetch(request, env){
    const url = new URL(request.url);
    const koken = request.headers.get('Origin');
    const cors = corsBasliklari(koken, env);
    if(request.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors});
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
