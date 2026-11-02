# -*- coding: utf-8 -*-
"""
DKAB Portal — yerel sunucu + Öğrenme Asistanı köprüsü (2026-10-31)

Ne yapar?
  * Portal klasörünü, eskiden kullanılan "python -m http.server 8844" gibi sunar.
  * Ek olarak iki uç nokta açar:
        GET  /api/asistan/durum   -> asistan yapılandırıldı mı?
        POST /api/asistan         -> öğrencinin sorusunu yapay zekâya iletir
  * API anahtarı HTML/JS'de BULUNMAZ. Şuradan okunur (ilk bulunan):
        1) ANTHROPIC_API_KEY ortam değişkeni
        2) Kullanıcı klasöründeki  .dkab-asistan.env  dosyası
           (Windows: C:\\Users\\<ad>\\.dkab-asistan.env)
     Dosya biçimi:
        ANTHROPIC_API_KEY=sk-ant-...
        MODEL=claude-sonnet-5-5        (isteğe bağlı)
  * Yalnızca bu bilgisayardan erişilebilir (127.0.0.1). Nokta ile başlayan
    dosyalar ve .env/.py dosyaları web'den okunamaz.
  * Yalnızca Python'ın kendi kütüphanelerini kullanır (kurulum gerekmez).

Çalıştırma:  py -3 asistan-sunucu.py 8844   (baslat.vbs bunu kendisi yapar)
"""
import http.server, json, os, sys, threading, time, urllib.request, urllib.error
from functools import partial

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8844
KOK = os.path.dirname(os.path.abspath(__file__))
API_URL = os.environ.get('ASISTAN_API_URL', 'https://api.anthropic.com/v1/messages')
VARSAYILAN_MODEL = 'claude-sonnet-5-5'
IZINLI_KOKENLER = {'http://localhost:%d' % PORT, 'http://127.0.0.1:%d' % PORT}
AZAMI_ISTEK = 60000          # bayt; bağlam metni dahil
DAKIKA_SINIRI = 20           # dakikada en fazla istek (kazara döngülere karşı)

def ayar_oku():
    ayar = {}
    yol = os.path.join(os.path.expanduser('~'), '.dkab-asistan.env')
    try:
        with open(yol, encoding='utf-8-sig') as f:
            for satir in f:
                satir = satir.strip()
                if not satir or satir.startswith('#') or '=' not in satir:
                    continue
                k, v = satir.split('=', 1)
                ayar[k.strip()] = v.strip().strip('"').strip("'")
    except OSError:
        pass
    anahtar = os.environ.get('ANTHROPIC_API_KEY') or ayar.get('ANTHROPIC_API_KEY', '')
    model = os.environ.get('ASISTAN_MODEL') or ayar.get('MODEL') or VARSAYILAN_MODEL
    return anahtar.strip(), model.strip()

# TALIMAT-BASLA — ortak talimat (asistan-bulut/worker.js ile birebir aynı; talimat.json'dan üretilir)
TALIMAT = json.loads(r"""{
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
}""")
# TALIMAT-BITIR

def _k(s, n):
    return str('' if s is None else s)[:n]

def sistem_talimati(b):
    try: s = int(b.get('sinif'))
    except (TypeError, ValueError): s = 0
    sk = str(s) if 4 <= s <= 12 else ''
    p = [TALIMAT['kimlik'], TALIMAT['sinif'][sk], TALIMAT['pedagoji'], TALIMAT['dogruluk'], TALIMAT['portal'], TALIMAT['bicim']]
    mod = b.get('mod')
    if isinstance(mod, str) and mod in TALIMAT['mod']: p.append(TALIMAT['mod'][mod])
    bag = []
    if sk: bag.append('Sınıf: ' + sk + (' (öğrenci kendisi seçti)' if b.get('sinifKaynak') == 'secim' else ''))
    if b.get('unite'): bag.append('Ünite: ' + _k(b.get('unite'), 200))
    if b.get('konu'): bag.append('Konu: ' + _k(b.get('konu'), 200))
    if b.get('etkinlik'): bag.append('Çalışılan etkinlik: ' + _k(b.get('etkinlik'), 200))
    if b.get('soru'): bag.append('Ekrandaki soru: ' + _k(b.get('soru'), 800))
    if b.get('sonYanlis'): bag.append('Öğrencinin son yanlış cevabı: ' + _k(b.get('sonYanlis'), 800))
    if bag: p.append('ÖĞRENCİNİN DURUMU (öğrenciye sınıfını veya konusunu tekrar sorma):\n' + '\n'.join(bag))
    if b.get('ciktilar'): p.append('RESMÎ ÖĞRENME ÇIKTILARI (MEB programı, bu ünite):\n' + _k(b.get('ciktilar'), 3000))
    if b.get('icerik'): p.append('PORTAL İÇERİĞİ (öğrencinin açık sayfasındaki ders metni):\n<<<\n' + _k(b.get('icerik'), 24000) + '\n>>>')
    else: p.append('PORTAL İÇERİĞİ: Bu sayfada ders metni algılanamadı; resmî öğrenme çıktılarına ve programa uygun, genel ve güvenli açıklamalar yap.')
    return '\n\n'.join(p)

_zamanlar = []
_kilit = threading.Lock()
def hiz_siniri_asildi():
    with _kilit:
        simdi = time.time()
        while _zamanlar and simdi - _zamanlar[0] > 60: _zamanlar.pop(0)
        if len(_zamanlar) >= DAKIKA_SINIRI: return True
        _zamanlar.append(simdi); return False

def yapay_zekaya_sor(b):
    anahtar, model = ayar_oku()
    if not anahtar:
        return 503, {'hata': 'yapilandirilmadi'}
    gecmis = []
    for m in (b.get('mesajlar') or [])[-12:]:
        rol = 'assistant' if m.get('rol') == 'asistan' else 'user'
        metin = str(m.get('metin', ''))[:4000].strip()
        if not metin: continue
        if gecmis and gecmis[-1]['role'] == rol:
            gecmis[-1]['content'] += '\n' + metin
        else:
            gecmis.append({'role': rol, 'content': metin})
    while gecmis and gecmis[0]['role'] != 'user': gecmis.pop(0)
    if not gecmis or gecmis[-1]['role'] != 'user':
        return 400, {'hata': 'mesaj_yok'}
    istek = {'model': model, 'max_tokens': 1500, 'system': sistem_talimati(b), 'messages': gecmis}
    req = urllib.request.Request(API_URL, data=json.dumps(istek).encode('utf-8'), method='POST', headers={
        'x-api-key': anahtar, 'anthropic-version': '2023-06-01', 'content-type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            yanit = json.loads(r.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        ayrinti = ''
        try: ayrinti = json.loads(e.read().decode('utf-8')).get('error', {}).get('message', '')
        except Exception: pass
        kod = {401: 'anahtar_gecersiz', 403: 'yetki_yok', 404: 'model_bulunamadi', 429: 'yogunluk', 529: 'yogunluk'}.get(e.code, 'servis_hatasi')
        return 502, {'hata': kod, 'ayrinti': ayrinti[:300]}
    except Exception as e:
        return 502, {'hata': 'baglanti', 'ayrinti': str(e)[:200]}
    metin = ''.join(p.get('text', '') for p in yanit.get('content', []) if p.get('type') == 'text').strip()
    if not metin:
        return 502, {'hata': 'bos_yanit'}
    return 200, {'cevap': metin, 'model': yanit.get('model', model)}

class Isleyici(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _json(self, kod, veri):
        govde = json.dumps(veri, ensure_ascii=False).encode('utf-8')
        self.send_response(kod)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(govde)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(govde)

    def _gizli_mi(self):
        yol = self.path.split('?', 1)[0].split('#', 1)[0]
        parcalar = [p for p in urllib.request.unquote(yol).split('/') if p]
        if any(p.startswith('.') for p in parcalar): return True
        son = parcalar[-1].lower() if parcalar else ''
        return son.endswith(('.env', '.py', '.pyc', '.vbs', '.bat'))

    def do_GET(self):
        if self.path.split('?')[0] == '/api/asistan/durum':
            anahtar, model = ayar_oku()
            return self._json(200, {'yapilandirildi': bool(anahtar), 'model': model if anahtar else None})
        if self._gizli_mi():
            return self.send_error(404)
        return super().do_GET()

    def do_HEAD(self):
        if self._gizli_mi(): return self.send_error(404)
        return super().do_HEAD()

    def do_POST(self):
        if self.path.split('?')[0] != '/api/asistan':
            return self.send_error(404)
        koken = self.headers.get('Origin')
        if koken and koken not in IZINLI_KOKENLER:
            return self._json(403, {'hata': 'izin_yok'})
        try:
            uzunluk = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            uzunluk = 0
        if uzunluk <= 0 or uzunluk > AZAMI_ISTEK:
            return self._json(413, {'hata': 'istek_buyuk'})
        try:
            b = json.loads(self.rfile.read(uzunluk).decode('utf-8'))
        except Exception:
            return self._json(400, {'hata': 'gecersiz_istek'})
        if hiz_siniri_asildi():
            return self._json(429, {'hata': 'cok_hizli'})
        kod, veri = yapay_zekaya_sor(b)
        return self._json(kod, veri)

if __name__ == '__main__':
    os.chdir(KOK)
    sunucu = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), partial(Isleyici, directory=KOK))
    anahtar, model = ayar_oku()
    print('DKAB Portal: http://localhost:%d/din-kulturu-tum-siniflar.html' % PORT)
    print('Öğrenme Asistanı: %s' % ('hazır (model: %s)' % model if anahtar else 'API anahtarı bulunamadı — ASISTAN-KURULUM.txt dosyasına bakın'))
    try:
        sunucu.serve_forever()
    except KeyboardInterrupt:
        pass
