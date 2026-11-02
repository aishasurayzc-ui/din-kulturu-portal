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
===================================================================== */
const API_URL = 'https://api.anthropic.com/v1/messages';
const VARSAYILAN_MODEL = 'claude-sonnet-5-5';
const VARSAYILAN_KOKEN = 'https://aishasurayzc-ui.github.io,http://localhost:8844,http://127.0.0.1:8844';
const UCRETSIZ_MODEL = '@cf/google/gemma-4-26b-a4b-it';
const AZAMI_ISTEK = 60000;
const DAKIKA_SINIRI = 20;         // aynı IP'den dakikada en fazla soru (okulda tüm sınıf tek IP'den çıkar)

const SINIF_DILI = {
  ilkokul: 'Öğrenci ilkokul 4. sınıftadır. Çok kısa cümleler, somut ve gündelik örnekler kullan; soyut terimleri basitçe açıkla. Cevabın 6-8 cümleyi geçmesin.',
  ortaokul: 'Öğrenci ortaokuldadır (5-8. sınıf). Kavramları tanımla, örneklerle öğret, kavramlar arası ilişkiyi göster. Gerektiğinde kısa maddeler kullan.',
  lgs: "Öğrenci 8. sınıftadır ve LGS'ye hazırlanır. Kavramları örneklerle öğret; uygun olduğunda LGS soru mantığını (öncül okuma, çıkarım, metinden yorum, \"aşağıdakilerden hangisine ulaşılabilir\" kalıbı) göster.",
  lise: 'Öğrenci lisededir (9-12. sınıf). Daha derin, analitik ve kavramsal açıkla; neden-sonuç ilişkisini, farklı yorumların gerekçelerini ve kavramların bağlamını tartış.'
};
function seviye(s){
  s = parseInt(s, 10);
  if(!s) return 'ortaokul';
  if(s <= 4) return 'ilkokul';
  if(s === 8) return 'lgs';
  if(s >= 9) return 'lise';
  return 'ortaokul';
}
function sistemTalimati(b){
  const p = [
    "Sen \"Öğrenme Asistanı\"sın: Ayşe Yazıcı'nın Din Kültürü ve Ahlak Bilgisi (DKAB) dijital öğrenme portalında öğrencilere yardım eden bir öğretmen yardımcısısın. Türkçe konuş, sıcak ve saygılı ol.",
    SINIF_DILI[seviye(b.sinif)],
    'ÖĞRETİM YAKLAŞIMI: Yalnızca cevap verme; öğrencinin düşünmesini sağla. Bir soruyu çözmesi istendiğinde önce ipucu ver, kendisinin denemesini iste; öğrenci isterse veya ikinci denemeden sonra çözümü açıkla. Yanlış cevaplarda asla yargılama: hatanın nereden kaynaklandığını, doğru kavramın ne olduğunu ve ikisinin farkını nazikçe açıkla. Öğrenci isterse konuyu adım adım anlat. Cevabın sonunda çoğu zaman öğrencinin düşüncesini yoklayan kısa bir soru sor.',
    "İÇERİK GÜVENİLİRLİĞİ: (1) Önce aşağıdaki PORTAL İÇERİĞİ ve RESMÎ ÖĞRENME ÇIKTILARI bölümlerini esas al. (2) Türkiye Yüzyılı Maarif Modeli DKAB öğretim programıyla çelişen açıklama yapma; mezhepler ve yorumlar konusunda tarafsız ve programdaki dille konuş. (3) Ayet veya hadis ASLA uydurma. Yalnızca portal içeriğinde geçen ayet/hadisleri, orada verildiği biçimde (sure adı ve ayet numarasıyla) aktar; emin olmadığın bir ayet/hadis numarası, metni veya kaynağı verme, gerekirse \"öğretmenine veya Diyanet'in kaynaklarına danış\" de. (4) Kaynağından emin olmadığın dinî bilgiyi kesin bilgi gibi sunma; \"genel olarak şöyle bilinir, öğretmeninle kontrol et\" gibi belirt. (5) Soru portal içeriğinde yoksa bunu açıkça söyle (\"Bu konu bu sayfadaki ders içeriğinde yer almıyor.\") ve yalnızca genel, güvenli bir açıklama yap veya öğretmenine yönlendir. (6) Ders dışı, uygunsuz ya da kişisel bilgi isteyen konulara girme; nazikçe derse dön. Fetva verme; kişisel dinî hükümler için öğretmen ve Diyanet'e yönlendir.",
    'BİÇİM: Düz metin ve gerektiğinde kısa madde işaretleri (- ) kullan. Başlık işareti (#), tablo veya HTML kullanma. "Bana 5 soru sor" istenirse soruları numaralı ver, cevapları HEMEN verme; öğrenci cevaplayınca değerlendir.'
  ];
  const bag = [];
  if(b.sinif) bag.push('Sınıf: ' + b.sinif);
  if(b.unite) bag.push('Ünite: ' + b.unite);
  if(b.konu) bag.push('Açık konu: ' + b.konu);
  if(b.etkinlik) bag.push('Çalışılan etkinlik: ' + b.etkinlik);
  if(b.soru) bag.push('Ekrandaki soru: ' + b.soru);
  if(b.sonYanlis) bag.push('Öğrencinin son yanlış cevabı: ' + b.sonYanlis);
  if(bag.length) p.push('ÖĞRENCİNİN DURUMU (sayfadan otomatik algılandı; öğrenciye sınıfını/konusunu tekrar sorma):\n' + bag.join('\n'));
  if(b.ciktilar) p.push('RESMÎ ÖĞRENME ÇIKTILARI (Maarif Modeli, bu ünite):\n' + String(b.ciktilar).slice(0, 3000));
  if(b.icerik) p.push('PORTAL İÇERİĞİ (öğrencinin açık sayfasındaki ders metni):\n<<<\n' + String(b.icerik).slice(0, 24000) + '\n>>>');
  else p.push('PORTAL İÇERİĞİ: Bu sayfada ders metni algılanamadı. Cevaplarında bunu göz önünde bulundur.');
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
      max_tokens: 900, temperature: 0.4
    });
  }catch(e){
    const m = String((e && e.message) || e);
    if(/neuron|allocation|quota|daily|4006|limit/i.test(m)) return [429, {hata: 'gunluk_sinir'}];
    return [502, {hata: 'servis_hatasi'}];
  }
  let metin = '';
  if(y && typeof y.response === 'string') metin = y.response;
  else if(y && y.choices && y.choices[0] && y.choices[0].message) metin = y.choices[0].message.content || '';
  else if(typeof y === 'string') metin = y;
  metin = String(metin || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  if(!metin) return [502, {hata: 'bos_yanit'}];
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
