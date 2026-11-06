/* =====================================================================
   YAZILI KÂĞIDI OLUŞTURUCU (yazili-olustur.html) · 2026-11-06
   Açık Uçlu Soru Merkezi havuzlarından (havuz/<sN-uM>.js) yazdırılabilir
   yazılı kâğıdı ve cevap anahtarı hazırlar. Havuz dosyalarını değiştirmez.
   Kâğıt üst bilgileri localStorage "yzo_bilgi" anahtarında saklanır.
   ===================================================================== */
(function () {
  'use strict';
  var PROG = (window.MEB_PROGRAM && window.MEB_PROGRAM.siniflar) || {};
  var LISTE = window.AUC_LISTE || {};
  var SINIFLAR = ['4', '5', '6', '7', '8', '9', '10', '11', '12'];
  var TUR_SIRA = ['bilgi', 'aciklama', 'metin', 'yorum', 'hayat', 'karsilastirma', 'analiz'];
  var TUR_AD = { bilgi: 'Bilgi ve kavram', aciklama: 'Açıklama ve anlama', metin: 'Ayet, hadis ve metin yorumlama', yorum: 'Yorumlama ve çıkarım', hayat: 'Günlük hayatla ilişkilendirme', karsilastirma: 'Karşılaştırma ve ilişkilendirme', analiz: 'Analiz ve değerlendirme' };
  var S = { sinif: null, uniteler: [], havuz: {}, secili: [], anahtar: false };

  function $(id) { return document.getElementById(id); }
  function kac(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function karistir(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function uniteAd(uid) { var m = uid.match(/^s(\d+)-u(\d+)$/); var u = (PROG['s' + m[1]] || [])[+m[2] - 1]; return (S.havuz[uid] && S.havuz[uid].ad) || (u && u.ad) || uid; }
  function uniteNo(uid) { return +uid.split('-u')[1]; }

  /* ---------- tema ---------- */
  function temaUygula(t) { document.documentElement.setAttribute('data-tema', t); $('temaDugme').setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false'); }
  try { temaUygula(localStorage.getItem('dkab_tema') === 'dark' ? 'dark' : 'light'); } catch (e) {}
  $('temaDugme').addEventListener('click', function () {
    var y = document.documentElement.getAttribute('data-tema') === 'dark' ? 'light' : 'dark';
    temaUygula(y); try { localStorage.setItem('dkab_tema', y); } catch (e) {}
  });

  /* ---------- soru metni (merkez.js ile aynı biçim kuralları) ---------- */
  function soruMetni(s) {
    s = String(s == null ? '' : s);
    if (s.indexOf('\n') < 0) return '<p class="mz-y-kok">' + kac(s) + '</p>';
    var out = [], tablo = [], liste = [];
    function bosalt() {
      if (liste.length) { out.push('<ul class="mz-y-liste">' + liste.join('') + '</ul>'); liste = []; }
      if (tablo.length) {
        out.push('<div class="mz-y-tablo-sar"><table class="mz-y-tablo">' + tablo.map(function (r) {
          return '<tr>' + r.map(function (c, j) { c = c.trim(); var b = (c === '…' || c === ''); return (j === 0 ? '<th scope="row">' : '<td' + (b ? ' class="bos"' : '') + '>') + (b ? '' : kac(c)) + (j === 0 ? '</th>' : '</td>'); }).join('') + '</tr>';
        }).join('') + '</table></div>');
        tablo = [];
      }
    }
    s.split('\n').forEach(function (l) {
      var t = l.trim(); if (!t) { bosalt(); return; }
      if (t.charAt(0) === '|') { if (liste.length) bosalt(); tablo.push(t.replace(/^\||\|$/g, '').split('|')); return; }
      if (tablo.length) bosalt();
      if (t.indexOf('- ') === 0) { var li = t.slice(2); liste.push('<li' + (/^([IVX]+\.|\d+\.|[a-zçğ]\))\s/.test(li) ? ' class="no"' : '') + '>' + kac(li) + '</li>'); return; }
      bosalt();
      if (t.indexOf('? ') === 0) { out.push('<p class="mz-y-kok">' + kac(t.slice(2)) + '</p>'); return; }
      if (t.indexOf('> ') === 0) { out.push('<p class="mz-y-alinti">' + kac(t.slice(2)) + '</p>'); return; }
      var d = t.indexOf(':: ');
      if (d > 0 && d < 30) { out.push('<p class="mz-y-diyalog"><b>' + kac(t.slice(0, d)) + ':</b> <span>' + kac(t.slice(d + 3)) + '</span></p>'); return; }
      out.push('<p class="mz-y-p">' + kac(t) + '</p>');
    });
    bosalt();
    return out.join('');
  }
  function tabloluMu(s) { return /(^|\n)\s*\|/.test(String(s)); }
  function kisaKok(s) {
    var satirlar = String(s).split('\n'), kok = '';
    satirlar.forEach(function (l) { if (l.indexOf('? ') === 0) kok = l.slice(2); });
    return kok || satirlar[0];
  }

  /* ---------- havuz yükleme ---------- */
  function betikYukle(src, bitti) {
    var s = document.createElement('script'); s.src = src;
    s.onload = function () { bitti(true); }; s.onerror = function () { bitti(false); };
    document.head.appendChild(s);
  }
  function havuzlariYukle(uidler, bitti) {
    var kalan = uidler.filter(function (u) { return !S.havuz[u]; });
    if (!kalan.length) return bitti();
    var say = kalan.length;
    kalan.forEach(function (uid) {
      betikYukle('havuz/' + uid + '.js', function (ok) {
        var H = ok && window.AUC_HAVUZ && window.AUC_HAVUZ[uid];
        if (H) S.havuz[uid] = { ad: H.ad, konular: H.konular, sorular: H.sorular };
        if (--say === 0) bitti();
      });
    });
  }

  /* ---------- 1-2. sınıf ve ünite seçimi ---------- */
  function sinifCiz() {
    $('sinifSec').innerHTML = SINIFLAR.map(function (s) {
      return '<button type="button" role="radio" class="yo-sinif-btn" style="--sv:var(--s' + s + ')" aria-checked="' + (S.sinif === s) + '" data-sinif="' + s + '">' + s + '. Sınıf</button>';
    }).join('');
  }
  function uniteCiz() {
    if (!S.sinif) return;
    var u = PROG['s' + S.sinif] || [];
    $('uniteSec').innerHTML = u.map(function (x, i) {
      var uid = 's' + S.sinif + '-u' + (i + 1), hazir = !!LISTE[uid];
      return '<label class="yo-unite' + (hazir ? '' : ' bos') + '"><input type="checkbox" value="' + uid + '"' + (S.uniteler.indexOf(uid) >= 0 ? ' checked' : '') + (hazir ? '' : ' disabled') + '> <span><b>' + (i + 1) + '. Ünite:</b> ' + kac(x.ad) + (hazir ? '' : ' <em>(hazırlanıyor)</em>') + '</span></label>';
    }).join('') || '<p class="yo-ipucu">Bu sınıfın ünite listesi bulunamadı.</p>';
    olusturDurum();
  }
  function olusturDurum() { $('olusturDugme').disabled = !S.uniteler.length; }
  $('sinifSec').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sinif]'); if (!b) return;
    if (S.sinif !== b.getAttribute('data-sinif')) { S.sinif = b.getAttribute('data-sinif'); S.uniteler = []; }
    sinifCiz(); uniteCiz();
  });
  $('uniteSec').addEventListener('change', function () {
    S.uniteler = [].slice.call($('uniteSec').querySelectorAll('input:checked')).map(function (i) { return i.value; });
    olusturDurum();
  });

  /* ---------- otomatik soru seçimi ---------- */
  /* Ünitelere sırayla dağıtır; her ünitede soru türlerini kolaydan zora döndürerek seçer. */
  function sec(adet) {
    var havuzlar = {}, siralar = {};
    S.uniteler.forEach(function (uid) {
      var g = {}; (S.havuz[uid] ? S.havuz[uid].sorular : []).forEach(function (q, i) { (g[q[0]] = g[q[0]] || []).push(i); });
      Object.keys(g).forEach(function (t) { g[t] = karistir(g[t]); });
      havuzlar[uid] = g;
      siralar[uid] = karistir(TUR_SIRA.filter(function (t) { return g[t]; }));
    });
    var uidler = S.uniteler.filter(function (u) { return S.havuz[u]; });
    var sonuc = [], adim = 0, bos = 0;
    while (sonuc.length < adet && uidler.length && bos < uidler.length) {
      var uid = uidler[adim % uidler.length], g = havuzlar[uid], sira = siralar[uid], alindi = false;
      for (var k = 0; k < sira.length && !alindi; k++) {
        var t = sira[(Math.floor(adim / uidler.length) + k) % sira.length];
        if (g[t] && g[t].length) { sonuc.push({ uid: uid, i: g[t].pop() }); alindi = true; }
      }
      bos = alindi ? 0 : bos + 1; adim++;
    }
    return sirala(sonuc);
  }
  function turIdx(x) { return TUR_SIRA.indexOf(S.havuz[x.uid].sorular[x.i][0]); }
  function sirala(a) { return a.sort(function (x, y) { return (uniteNo(x.uid) - uniteNo(y.uid)) || (turIdx(x) - turIdx(y)) || (x.i - y.i); }); }
  function puanDagit() {
    var n = S.secili.length; if (!n) return;
    var taban = Math.floor(100 / n), artan = 100 - taban * n;
    S.secili.forEach(function (x, k) { x.puan = taban + (k >= n - artan ? 1 : 0); });
  }
  function kullanildi(uid, i) { return S.secili.some(function (x) { return x.uid === uid && x.i === i; }); }

  $('olusturDugme').addEventListener('click', function () {
    var b = this; b.disabled = true;
    havuzlariYukle(S.uniteler, function () {
      b.disabled = false;
      S.secili = sec(+$('adet').value); puanDagit();
      $('onizleme').classList.remove('gizli');
      ekleUniteCiz(); ciz();
      $('onizleme').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  $('karistirDugme').addEventListener('click', function () { S.secili = sec(+$('adet').value); puanDagit(); ciz(); });
  $('satir').addEventListener('change', function () { if (S.secili.length) ciz(); });

  /* ---------- üst bilgiler ---------- */
  var ALANLAR = ['bOkul', 'bYil', 'bDonem', 'bYazili', 'bOgretmen', 'bSure'];
  (function () {
    var y = new Date(), bas = y.getMonth() >= 7 ? y.getFullYear() : y.getFullYear() - 1;
    $('bYil').value = bas + '-' + (bas + 1);
    try { var v = JSON.parse(localStorage.getItem('yzo_bilgi') || '{}'); ALANLAR.forEach(function (a) { if (v[a]) $(a).value = v[a]; }); } catch (e) {}
  })();
  ALANLAR.forEach(function (a) {
    $(a).addEventListener('input', function () {
      var v = {}; ALANLAR.forEach(function (b) { v[b] = $(b).value; });
      try { localStorage.setItem('yzo_bilgi', JSON.stringify(v)); } catch (e) {}
      if (S.secili.length) ustCiz();
    });
  });

  /* ---------- kâğıt ---------- */
  function ustBilgi() {
    var okul = $('bOkul').value.trim();
    return '<header class="yo-baslik">' +
      (okul ? '<p class="yo-okul">' + kac(okul) + '</p>' : '') +
      '<p class="yo-ders">' + kac($('bYil').value.trim()) + ' Eğitim-Öğretim Yılı · ' + S.sinif + '. Sınıf Din Kültürü ve Ahlak Bilgisi Dersi</p>' +
      '<p class="yo-ders">' + kac($('bDonem').value) + ' Dönem ' + kac($('bYazili').value) + ' Yazılı Sınavı</p>' +
      '</header>' +
      '<table class="yo-ogrenci"><tr><th>Adı Soyadı</th><td></td><th>Numarası</th><td class="kisa"></td></tr>' +
      '<tr><th>Sınıfı / Şubesi</th><td></td><th>Puanı</th><td class="kisa"></td></tr></table>' +
      '<p class="yo-yonerge">Sorular açık uçludur; cevaplarınızı her sorunun altında ayrılan yere kendi cümlelerinizle yazınız. Tablolu sorularda tablodaki boşlukları doldurunuz.' +
      ($('bSure').value.trim() ? ' Süre: ' + kac($('bSure').value.trim()) + '.' : '') + ' Her sorunun puanı yanında yazılıdır.</p>';
  }
  function ustCiz() { var h = $('kagit').querySelector('.yo-ust'); if (h) h.innerHTML = ustBilgi(); var a = $('anahtar').querySelector('.yo-ust-a'); if (a) a.innerHTML = anahtarBaslik(); }
  function ciz() {
    var satir = +$('satir').value;
    var ogr = $('bOgretmen').value.trim();
    $('kagit').innerHTML = '<div class="yo-ust">' + ustBilgi() + '</div>' +
      '<ol class="yo-sorular">' + S.secili.map(function (x, k) {
        var q = S.havuz[x.uid].sorular[x.i], n = tabloluMu(q[2]) ? Math.max(2, Math.round(satir / 2)) : satir;
        return '<li class="yo-soru" data-k="' + k + '">' +
          '<div class="yo-soru-ust"><span class="yo-no">' + (k + 1) + '.</span>' +
          '<span class="yo-puan">(<input type="number" min="0" max="100" value="' + x.puan + '" aria-label="' + (k + 1) + '. sorunun puanı" data-puan="' + k + '"><span class="yo-puan-yaz">' + x.puan + '</span> puan)</span>' +
          '<span class="yo-soru-arac">' +
          '<button type="button" class="yo-mini" data-degistir="' + k + '" title="Benzer başka bir soru seç"><span class="msi" aria-hidden="true">sync</span><span class="yo-gizle">Değiştir</span></button>' +
          '<button type="button" class="yo-mini" data-yukari="' + k + '" title="Yukarı taşı"' + (k ? '' : ' disabled') + '><span class="msi" aria-hidden="true">arrow_upward</span><span class="yo-gizle">Yukarı</span></button>' +
          '<button type="button" class="yo-mini" data-cikar="' + k + '" title="Soruyu çıkar"><span class="msi" aria-hidden="true">close</span><span class="yo-gizle">Çıkar</span></button>' +
          '</span></div>' +
          '<div class="mz-yazili yo-metin">' + soruMetni(q[2]) + '</div>' +
          '<div class="yo-cizgiler" style="--n:' + n + '" aria-hidden="true"></div>' +
          '</li>';
      }).join('') + '</ol>' +
      '<p class="yo-son">Başarılar dilerim.' + (ogr ? '<br><b>' + kac(ogr) + '</b><br>Din Kültürü ve Ahlak Bilgisi Öğretmeni' : '') + '</p>';
    anahtarCiz(); toplamCiz(); ekleListeCiz();
  }
  function toplamCiz() {
    var t = S.secili.reduce(function (a, x) { return a + (+x.puan || 0); }, 0);
    $('toplamPuan').innerHTML = S.secili.length + ' soru · toplam <b>' + t + '</b> puan' + (t !== 100 ? ' <span class="yo-uyari">(100 değil)</span>' : '');
  }

  /* ---------- cevap anahtarı ---------- */
  function anahtarBaslik() {
    return '<header class="yo-baslik"><p class="yo-okul">Cevap Anahtarı ve Puanlama</p><p class="yo-ders">' + S.sinif + '. Sınıf Din Kültürü ve Ahlak Bilgisi · ' + kac($('bDonem').value) + ' Dönem ' + kac($('bYazili').value) + ' Yazılı</p></header>' +
      '<p class="yo-yonerge">Cevaplar örnek niteliğindedir; öğrencinin aynı unsurları kendi cümleleriyle yazması yeterlidir. Puanlar unsurlara göre dağıtılmıştır; ifade ve düzen puanı her soruda ayrıca verilmiştir.</p>';
  }
  function unsurPuan(q, puan) {
    var u = q[4] || [], n = u.length;
    var w = q[5] && q[5].length === n ? q[5] : (n === 2 ? [4, 4] : n === 3 ? [3, 3, 2] : [2, 2, 2, 2].slice(0, n));
    w = w.concat([2]);
    var top = w.reduce(function (a, b) { return a + b; }, 0) || 1;
    var p = w.map(function (x) { return Math.floor(puan * x / top); });
    var fark = puan - p.reduce(function (a, b) { return a + b; }, 0);
    for (var i = 0; fark > 0; i = (i + 1) % p.length, fark--) p[i]++;
    return p;
  }
  function anahtarCiz() {
    $('anahtar').innerHTML = '<div class="yo-ust-a">' + anahtarBaslik() + '</div><ol class="yo-sorular">' + S.secili.map(function (x, k) {
      var q = S.havuz[x.uid].sorular[x.i], p = unsurPuan(q, +x.puan || 0), u = q[4] || [];
      return '<li class="yo-cevap"><p class="yo-cevap-ust"><b>' + (k + 1) + '. soru</b> · ' + (+x.puan || 0) + ' puan · <span class="yo-etiket">' + kac(TUR_AD[q[0]] || q[0]) + ' · ' + uniteNo(x.uid) + '. ünite</span></p>' +
        '<p class="yo-kisa-kok">' + kac(kisaKok(q[2])) + '</p>' +
        '<p><b>Örnek cevap:</b> ' + kac(q[3]) + '</p>' +
        '<table class="yo-puanlama"><thead><tr><th>Cevapta aranacak unsur</th><th>Puan</th></tr></thead><tbody>' +
        u.map(function (s, j) { return '<tr><td>' + kac(s) + '</td><td>' + p[j] + '</td></tr>'; }).join('') +
        '<tr><td>Cevabı açık, düzenli ve kendi cümleleriyle yazma</td><td>' + p[u.length] + '</td></tr></tbody></table></li>';
    }).join('') + '</ol>';
  }

  /* ---------- düzenleme ---------- */
  $('kagit').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var k;
    if (b.hasAttribute('data-cikar')) { k = +b.getAttribute('data-cikar'); S.secili.splice(k, 1); puanDagit(); ciz(); if (!S.secili.length) $('toplamPuan').textContent = 'Soru kalmadı. Havuzdan ekleyebilir ya da yeniden seçebilirsin.'; return; }
    if (b.hasAttribute('data-yukari')) { k = +b.getAttribute('data-yukari'); var t = S.secili[k]; S.secili[k] = S.secili[k - 1]; S.secili[k - 1] = t; ciz(); return; }
    if (b.hasAttribute('data-degistir')) {
      k = +b.getAttribute('data-degistir'); var x = S.secili[k], sq = S.havuz[x.uid].sorular, tur = sq[x.i][0];
      var aday = karistir(sq.map(function (_, i) { return i; }).filter(function (i) { return !kullanildi(x.uid, i); }));
      var ayni = aday.filter(function (i) { return sq[i][0] === tur; });
      var yeni = ayni.length ? ayni[0] : aday[0];
      if (yeni == null) return;
      x.i = yeni; ciz();
      var el = $('kagit').querySelector('[data-k="' + k + '"]'); if (el) { el.classList.add('yo-yeni'); setTimeout(function () { el.classList.remove('yo-yeni'); }, 900); }
    }
  });
  $('kagit').addEventListener('input', function (e) {
    var i = e.target.getAttribute('data-puan'); if (i == null) return;
    var v = Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0));
    S.secili[+i].puan = v; e.target.nextElementSibling.textContent = v;
    toplamCiz(); anahtarCiz();
  });

  /* ---------- havuzdan ekleme ---------- */
  function ekleUniteCiz() {
    $('ekleUnite').innerHTML = S.uniteler.filter(function (u) { return S.havuz[u]; }).map(function (uid) { return '<option value="' + uid + '">' + uniteNo(uid) + '. Ünite: ' + kac(uniteAd(uid)) + '</option>'; }).join('');
    $('ekleTur').innerHTML = '<option value="">Hepsi</option>' + TUR_SIRA.map(function (t) { return '<option value="' + t + '">' + TUR_AD[t] + '</option>'; }).join('');
  }
  function ekleListeCiz() {
    var uid = $('ekleUnite').value, tur = $('ekleTur').value, H = S.havuz[uid];
    if (!H) { $('ekleListe').innerHTML = ''; return; }
    $('ekleListe').innerHTML = H.sorular.map(function (q, i) {
      if (tur && q[0] !== tur) return '';
      var var_ = kullanildi(uid, i);
      return '<li value="' + (i + 1) + '"><span class="yo-ekle-metin"><span class="yo-etiket">' + kac(TUR_AD[q[0]] || q[0]) + '</span> ' + kac(kisaKok(q[2])) + '</span>' +
        '<button type="button" class="yo-mini" data-ekle="' + i + '"' + (var_ ? ' disabled' : '') + '>' + (var_ ? 'Kâğıtta' : '<span class="msi" aria-hidden="true">add</span>Ekle') + '</button></li>';
    }).join('');
  }
  $('ekleUnite').addEventListener('change', ekleListeCiz);
  $('ekleTur').addEventListener('change', ekleListeCiz);
  $('ekleListe').addEventListener('click', function (e) {
    var b = e.target.closest('[data-ekle]'); if (!b || b.disabled) return;
    S.secili.push({ uid: $('ekleUnite').value, i: +b.getAttribute('data-ekle'), puan: 0 });
    puanDagit(); ciz();
  });

  /* ---------- görünüm ve yazdırma ---------- */
  $('anahtarGoster').addEventListener('click', function () {
    S.anahtar = !S.anahtar; this.setAttribute('aria-pressed', S.anahtar);
    $('anahtar').classList.toggle('gizli', !S.anahtar);
    this.lastChild.textContent = S.anahtar ? ' Cevap anahtarını gizle' : ' Cevap anahtarını göster';
  });
  [].forEach.call(document.querySelectorAll('[data-yazdir]'), function (b) {
    b.addEventListener('click', function () {
      if (!S.secili.length) return;
      document.body.setAttribute('data-yazdir', b.getAttribute('data-yazdir'));
      window.print();
    });
  });
  window.addEventListener('afterprint', function () { document.body.removeAttribute('data-yazdir'); });

  /* ---------- başlangıç: ?sinif=9 ya da #s9 ---------- */
  sinifCiz();
  var m = (location.search.match(/[?&]sinif=(\d{1,2})/) || location.hash.match(/^#s(\d{1,2})/) || [])[1];
  if (m && SINIFLAR.indexOf(m) >= 0) { S.sinif = m; sinifCiz(); uniteCiz(); }
})();
