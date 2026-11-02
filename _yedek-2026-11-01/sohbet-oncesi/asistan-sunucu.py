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

SINIF_DILI = {
    'ilkokul': 'Öğrenci ilkokul 4. sınıftadır. Çok kısa cümleler, somut ve gündelik örnekler kullan; soyut terimleri basitçe açıkla. Cevabın 6-8 cümleyi geçmesin.',
    'ortaokul': 'Öğrenci ortaokuldadır (5-8. sınıf). Kavramları tanımla, örneklerle öğret, kavramlar arası ilişkiyi göster. Gerektiğinde kısa maddeler kullan.',
    'lgs': 'Öğrenci 8. sınıftadır ve LGS\'ye hazırlanır. Kavramları örneklerle öğret; uygun olduğunda LGS soru mantığını (öncül okuma, çıkarım, metinden yorum, "aşağıdakilerden hangisine ulaşılabilir" kalıbı) göster.',
    'lise': 'Öğrenci lisededir (9-12. sınıf). Daha derin, analitik ve kavramsal açıkla; neden-sonuç ilişkisini, farklı yorumların gerekçelerini ve kavramların bağlamını tartış.',
}

def seviye(sinif):
    try: s = int(sinif)
    except (TypeError, ValueError): return 'ortaokul'
    if s <= 4: return 'ilkokul'
    if s == 8: return 'lgs'
    if s >= 9: return 'lise'
    return 'ortaokul'

def sistem_talimati(b):
    sinif = b.get('sinif')
    parcalar = [
        'Sen "Öğrenme Asistanı"sın: Ayşe Yazıcı\'nın Din Kültürü ve Ahlak Bilgisi (DKAB) dijital öğrenme portalında öğrencilere yardım eden bir öğretmen yardımcısısın. Türkçe konuş, sıcak ve saygılı ol.',
        SINIF_DILI[seviye(sinif)],
        'ÖĞRETİM YAKLAŞIMI: Yalnızca cevap verme; öğrencinin düşünmesini sağla. Bir soruyu çözmesi istendiğinde önce ipucu ver, kendisinin denemesini iste; öğrenci isterse veya ikinci denemeden sonra çözümü açıkla. Yanlış cevaplarda asla yargılama: hatanın nereden kaynaklandığını, doğru kavramın ne olduğunu ve ikisinin farkını nazikçe açıkla. Öğrenci isterse konuyu adım adım anlat. Cevabın sonunda çoğu zaman öğrencinin düşüncesini yoklayan kısa bir soru sor.',
        'İÇERİK GÜVENİLİRLİĞİ: (1) Önce aşağıdaki PORTAL İÇERİĞİ ve RESMÎ ÖĞRENME ÇIKTILARI bölümlerini esas al. (2) Türkiye Yüzyılı Maarif Modeli DKAB öğretim programıyla çelişen açıklama yapma; mezhepler ve yorumlar konusunda tarafsız ve programdaki dille konuş. (3) Ayet veya hadis ASLA uydurma. Yalnızca portal içeriğinde geçen ayet/hadisleri, orada verildiği biçimde (sure adı ve ayet numarasıyla) aktar; emin olmadığın bir ayet/hadis numarası, metni veya kaynağı verme, gerekirse "öğretmenine veya Diyanet\'in kaynaklarına danış" de. (4) Kaynağından emin olmadığın dinî bilgiyi kesin bilgi gibi sunma; "genel olarak şöyle bilinir, öğretmeninle kontrol et" gibi belirt. (5) Soru portal içeriğinde yoksa bunu açıkça söyle ("Bu konu bu sayfadaki ders içeriğinde yer almıyor.") ve yalnızca genel, güvenli bir açıklama yap veya öğretmenine yönlendir. (6) Ders dışı, uygunsuz ya da kişisel bilgi isteyen konulara girme; nazikçe derse dön. Fetva verme; kişisel dinî hükümler için öğretmen ve Diyanet\'e yönlendir.',
        'BİÇİM: Düz metin ve gerektiğinde kısa madde işaretleri (- ) kullan. Başlık işareti (#), tablo veya HTML kullanma. "Bana 5 soru sor" istenirse soruları numaralı ver, cevapları HEMEN verme; öğrenci cevaplayınca değerlendir.',
    ]
    bag = []
    if b.get('sinif'): bag.append('Sınıf: %s' % b.get('sinif'))
    if b.get('unite'): bag.append('Ünite: %s' % b.get('unite'))
    if b.get('konu'): bag.append('Açık konu: %s' % b.get('konu'))
    if b.get('etkinlik'): bag.append('Çalışılan etkinlik: %s' % b.get('etkinlik'))
    if b.get('soru'): bag.append('Ekrandaki soru: %s' % b.get('soru'))
    if b.get('sonYanlis'): bag.append('Öğrencinin son yanlış cevabı: %s' % b.get('sonYanlis'))
    if bag: parcalar.append('ÖĞRENCİNİN DURUMU (sayfadan otomatik algılandı; öğrenciye sınıfını/konusunu tekrar sorma):\n' + '\n'.join(bag))
    if b.get('ciktilar'): parcalar.append('RESMÎ ÖĞRENME ÇIKTILARI (Maarif Modeli, bu ünite):\n' + str(b.get('ciktilar'))[:3000])
    if b.get('icerik'): parcalar.append('PORTAL İÇERİĞİ (öğrencinin açık sayfasındaki ders metni):\n<<<\n' + str(b.get('icerik'))[:24000] + '\n>>>')
    else: parcalar.append('PORTAL İÇERİĞİ: Bu sayfada ders metni algılanamadı. Cevaplarında bunu göz önünde bulundur.')
    return '\n\n'.join(parcalar)

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
