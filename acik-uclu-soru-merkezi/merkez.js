/* =====================================================================
   AÇIK UÇLU SORU MERKEZİ · 4–12. SINIFLAR (tum-siniflar.html)
   9, 10 ve 11. sınıflar 2026-11-01’de yeni biçimli havuzlarla (1-5. üniteler) yeniden eklendi.
   Sınıf → Ünite → Soru türü → Soru
   Ünite ve sınıf listesi: ortak/meb-program.js (resmî TYMM verisi).
   Soru havuzları: havuz/<sN-uM>.js (window.AUC_HAVUZ), liste: havuz/liste.js.
   9-11. sınıf 1. ünite havuzları mevcut sorular-9/10/11.js dosyalarından
   (window.ACIK_UCLU) okunur; o dosyalar değiştirilmez.
   Kayıt: localStorage "aucm_<uid>" = { c:{no:cevap}, t:[tamamlanan no], p:{no:puan} }
   ===================================================================== */
(function () {
  'use strict';
  var PROG = (window.MEB_PROGRAM && window.MEB_PROGRAM.siniflar) || {};
  var LISTE = window.AUC_LISTE || {};
  var ESKI = {};   /* eski 9-11 havuzları yerine yeni biçimli s9-u1, s10-u1, s11-u1 kullanılıyor (2026-11-01) */
  var TUR = [
    ['bilgi', 'Bilgi ve kavram', 'lightbulb'],
    ['aciklama', 'Açıklama ve anlama', 'chat'],
    ['metin', 'Ayet, hadis ve metin yorumlama', 'menu_book'],
    ['yorum', 'Yorumlama ve çıkarım', 'menu_book'],
    ['hayat', 'Günlük hayatla ilişkilendirme', 'diversity_3'],
    ['karsilastirma', 'Karşılaştırma ve ilişkilendirme', 'compare_arrows'],
    ['analiz', 'Analiz, değerlendirme ve çıkarım', 'psychology']
  ];
  var TUR_AD = {}; TUR.forEach(function (t) { TUR_AD[t[0]] = t[1]; });
  var SINIFLAR = ['4', '5', '6', '7', '8', '9', '10', '11', '12'];
  var D = { sinif: null, uid: null, havuz: null, tur: '', no: 0 };

  /* ---------- yardımcılar ---------- */
  function $(id) { return document.getElementById(id); }
  function kac(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function oku(uid) { try { var v = JSON.parse(localStorage.getItem('aucm_' + uid) || 'null'); if (v && typeof v === 'object') return { c: v.c || {}, t: v.t || [], p: v.p || {} }; } catch (e) {} return { c: {}, t: [], p: {} }; }
  var depoUyari = false;
  function yaz(uid, v) { try { localStorage.setItem('aucm_' + uid, JSON.stringify(v)); } catch (e) { if (!depoUyari) { depoUyari = true; bildir('Bu tarayıcıda kayıt yapılamıyor; cevapların sayfa kapanınca kaybolur.'); } } }
  function bildir(m) { var t = document.createElement('div'); t.className = 'mz-toast'; t.setAttribute('role', 'status'); t.textContent = m; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200); }
  function uniteler(s) { return PROG['s' + s] || []; }
  function hazirMi(uid) { return !!(LISTE[uid] || ESKI[uid]); }

  /* ---------- tema (portalın dkab_tema anahtarı) ---------- */
  function temaUygula(t) { document.documentElement.setAttribute('data-tema', t); $('temaDugme').setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false'); }
  try { temaUygula(localStorage.getItem('dkab_tema') === 'dark' ? 'dark' : 'light'); } catch (e) {}
  $('temaDugme').addEventListener('click', function () {
    var y = document.documentElement.getAttribute('data-tema') === 'dark' ? 'light' : 'dark';
    temaUygula(y); try { localStorage.setItem('dkab_tema', y); } catch (e) {}
  });

  /* ---------- havuz yükleme ---------- */
  var yuklenen = {};
  function betikYukle(src, bitti) {
    var s = document.createElement('script'); s.src = src;
    s.onload = function () { bitti(true); }; s.onerror = function () { bitti(false); };
    document.head.appendChild(s);
  }
  /* Yazılıya Hazırlanıyorum biçimi (2026-11-04): satır sonu içeren sorular için.
     "? " soru kökü (kalın) · "- " madde · "> " ayet/alıntı · "Ad:: metin" diyalog · "| a | b |" tablo · "…" boş hücre.
     Tek satırlık eski sorular eskisi gibi başlık olarak gösterilir. */
  function soruMetni(s) {
    s = String(s == null ? '' : s);
    if (s.indexOf('\n') < 0) return '<h2 class="mz-soru-metin">' + kac(s) + '</h2>';
    var out = [], tablo = [], liste = [];
    function bosalt() {
      if (liste.length) { out.push('<ul class="mz-y-liste">' + liste.join('') + '</ul>'); liste = []; }
      if (tablo.length) {
        out.push('<div class="mz-y-tablo-sar"><table class="mz-y-tablo">' + tablo.map(function (r) {
          return '<tr>' + r.map(function (c, j) { c = c.trim(); var b = (c === '…' || c === ''); return (j === 0 ? '<th scope="row">' : '<td' + (b ? ' class="bos"' : '') + '>') + (b ? '<span aria-label="boş">……</span>' : kac(c)) + (j === 0 ? '</th>' : '</td>'); }).join('') + '</tr>';
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
    return '<div class="mz-soru-metin mz-yazili" role="heading" aria-level="2">' + out.join('') + '</div>';
  }
  function rubrik(unsur, agirlik) {
    var n = unsur.length;
    var w = agirlik && agirlik.length === n ? agirlik : (n === 2 ? [4, 4] : n === 3 ? [3, 3, 2] : [2, 2, 2, 2]);
    var o = unsur.map(function (u, i) { return [u, w[i]]; });
    o.push(['Cevabı açık, düzenli ve kendi cümleleriyle yazma', 2]);
    return o;
  }
  function eskidenCevir(E) {
    var konular = (E.konular || []).slice();
    return {
      ad: String(E.unite || '').replace(/^\d+\.\s*Ünite:\s*/, ''), konular: konular, eski: true,
      sorular: (E.sorular || []).map(function (q) {
        return { tur: q.k, konu: konular[q.konu] || '', soru: q.soru, beklenen: (q.cevap || []).join(' '), unsur: q.cevap || [], olcut: q.olcut || [] };
      })
    };
  }
  function havuzGetir(uid, bitti) {
    if (yuklenen[uid]) return bitti(yuklenen[uid]);
    if (ESKI[uid]) {
      var e = ESKI[uid];
      var hazir = window.ACIK_UCLU && window.ACIK_UCLU[e[1]];
      if (hazir) { yuklenen[uid] = eskidenCevir(hazir); return bitti(yuklenen[uid]); }
      return betikYukle(e[0], function (ok) {
        var v = ok && window.ACIK_UCLU && window.ACIK_UCLU[e[1]];
        yuklenen[uid] = v ? eskidenCevir(v) : null; bitti(yuklenen[uid]);
      });
    }
    if (!LISTE[uid]) return bitti(null);
    betikYukle('havuz/' + uid + '.js', function (ok) {
      var H = ok && window.AUC_HAVUZ && window.AUC_HAVUZ[uid];
      if (!H) { yuklenen[uid] = null; return bitti(null); }
      yuklenen[uid] = {
        ad: H.ad, konular: H.konular,
        sorular: H.sorular.map(function (x) {
          return { tur: x[0], konu: H.konular[x[1]] || '', soru: x[2], beklenen: x[3], unsur: x[4], olcut: rubrik(x[4], x[5]) };
        })
      };
      bitti(yuklenen[uid]);
    });
  }

  /* ---------- gezinme (adres çubuğu: #s4, #s4-u1, #s4-u1-12) ---------- */
  function git(h) { if (location.hash !== '#' + h) location.hash = h; else yonlendir(); }
  function yonlendir() {
    var h = location.hash.replace('#', '');
    var m = h.match(/^s(\d{1,2})(?:-u(\d))?(?:-(\d{1,2}))?$/);
    if (!m || SINIFLAR.indexOf(m[1]) < 0) return sinifEkrani();
    if (!m[2]) return uniteEkrani(m[1]);
    var uid = 's' + m[1] + '-u' + m[2];
    if (!uniteler(m[1])[+m[2] - 1]) return uniteEkrani(m[1]);
    soruEkrani(m[1], uid, m[3] ? +m[3] - 1 : null);
  }
  function goster(id) {
    ['adimSinif', 'adimUnite', 'adimSoru'].forEach(function (a) { $(a).classList.toggle('gizli', a !== id); });
  }
  function yolCiz(parcalar) {
    $('yol').innerHTML = parcalar.map(function (p, i) {
      return i < parcalar.length - 1 ? '<a href="#' + p[1] + '">' + kac(p[0]) + '</a><span aria-hidden="true">›</span>' : '<span aria-current="page">' + kac(p[0]) + '</span>';
    }).join(' ');
  }

  /* ---------- 1. sınıf ---------- */
  function sinifEkrani() {
    goster('adimSinif'); yolCiz([['Sınıflar', '']]); document.title = 'Açık Uçlu Soru Merkezi · 4–12. Sınıflar';
    $('sinifIzgara').innerHTML = SINIFLAR.map(function (s) {
      var u = uniteler(s), hazir = 0, tamam = 0, toplam = 0;
      u.forEach(function (_, i) { var uid = 's' + s + '-u' + (i + 1); if (hazirMi(uid)) { hazir++; toplam += 50; tamam += oku(uid).t.length; } });
      return '<a role="listitem" class="mz-sinif-kart" style="--sv:var(--s' + s + ')" href="#s' + s + '">' +
        '<span class="no">' + s + '</span><strong>' + s + '. Sınıf</strong>' +
        '<span class="alt">' + hazir + '/' + u.length + ' ünite hazır · ' + (hazir * 50) + ' soru</span>' +
        (tamam ? '<span class="alt">Tamamlanan: ' + tamam + '</span>' : '') + '</a>';
    }).join('');
  }

  /* ---------- 2. ünite ---------- */
  function uniteEkrani(s) {
    goster('adimUnite'); D.sinif = s;
    yolCiz([['Sınıflar', ''], [s + '. Sınıf', 's' + s]]);
    $('bUnite').textContent = s + '. Sınıf · Üniteler';
    document.title = s + '. Sınıf · Açık Uçlu Soru Merkezi';
    $('uniteIzgara').innerHTML = uniteler(s).map(function (u, i) {
      var uid = 's' + s + '-u' + (i + 1), hazir = hazirMi(uid), k = oku(uid), t = k.t.length;
      var yuzde = Math.round(t / 50 * 100);
      return '<div role="listitem" class="mz-unite-kart' + (hazir ? '' : ' bos') + '" style="--sv:var(--s' + s + ')">' +
        '<span class="mz-unite-no">' + (i + 1) + '. Ünite</span>' +
        '<h2>' + kac(u.ad) + '</h2>' +
        (hazir
          ? '<p class="mz-bilgi"><span class="msi" aria-hidden="true">quiz</span> 50 açık uçlu soru · cevap anahtarı ve puanlama</p>' +
            '<div class="mz-ilerleme" role="progressbar" aria-valuemin="0" aria-valuemax="50" aria-valuenow="' + t + '" aria-label="Tamamlanan soru"><span style="width:' + yuzde + '%"></span></div>' +
            '<p class="mz-tamam">Tamamlanan: <strong>' + t + '</strong> / 50</p>' +
            '<a class="mz-btn mz-btn-ana" href="#' + uid + '"><span class="msi" aria-hidden="true">play_arrow</span> ' + (t ? 'Devam et' : 'Soru çözmeye başla') + '</a>'
          : '<p class="mz-bilgi">Bu ünitenin soruları henüz eklenmedi.</p><span class="mz-btn" aria-disabled="true">Hazırlanıyor</span>') +
        '</div>';
    }).join('');
  }

  /* ---------- 3-4. tür ve soru ---------- */
  function soruEkrani(s, uid, no) {
    goster('adimSoru'); D.sinif = s;
    var u = uniteler(s)[+uid.split('-u')[1] - 1];
    yolCiz([['Sınıflar', ''], [s + '. Sınıf', 's' + s], [u.ad, uid]]);
    $('bSoru').textContent = s + '. Sınıf · ' + uid.split('-u')[1] + '. Ünite: ' + u.ad;
    document.title = u.ad + ' · Açık Uçlu Sorular';
    if (D.uid !== uid) { D.tur = ''; }
    $('soruKart').innerHTML = '<p class="mz-bekle">Sorular yükleniyor…</p>';
    havuzGetir(uid, function (H) {
      if (!H) { $('soruKart').innerHTML = '<p class="mz-bekle">Bu ünitenin soruları henüz eklenmedi.</p>'; $('turler').innerHTML = ''; $('numaralar').innerHTML = ''; $('uniteOzet').innerHTML = ''; return; }
      D.uid = uid; D.havuz = H;
      var liste = filtreli();
      if (no == null || no < 0 || no >= H.sorular.length) no = liste.length ? liste[0] : 0;
      D.no = no;
      if (D.tur && H.sorular[no].tur !== D.tur) D.tur = '';
      ciz();
    });
  }
  function filtreli() {
    var out = [];
    D.havuz.sorular.forEach(function (q, i) { if (!D.tur || q.tur === D.tur) out.push(i); });
    return out;
  }
  function ciz() {
    var H = D.havuz, k = oku(D.uid);
    var puanT = 0, puanN = 0; Object.keys(k.p).forEach(function (n) { puanT += k.p[n]; puanN++; });
    $('uniteOzet').innerHTML = '<span><strong>' + k.t.length + '</strong> / ' + H.sorular.length + ' tamamlandı</span>' +
      (puanN ? '<span>Öz puan ortalaması: <strong>' + (puanT / puanN).toFixed(1) + '</strong> / 10 (' + puanN + ' soru)</span>' : '') +
      (H.eski ? '<span class="mz-not">Bu ünitenin soruları önceki soru merkezinden gelir.</span>' : '');
    var say = {}; H.sorular.forEach(function (q) { say[q.tur] = (say[q.tur] || 0) + 1; });
    $('turler').innerHTML = '<button type="button" data-tur="" aria-pressed="' + (!D.tur) + '">Tümü <span class="say">' + H.sorular.length + '</span></button>' +
      TUR.filter(function (t) { return say[t[0]]; }).map(function (t) {
        return '<button type="button" data-tur="' + t[0] + '" aria-pressed="' + (D.tur === t[0]) + '"><span class="msi" aria-hidden="true">' + t[2] + '</span> ' + t[1] + ' <span class="say">' + say[t[0]] + '</span></button>';
      }).join('');
    var liste = filtreli();
    $('numaralar').innerHTML = liste.map(function (i) {
      var c = 'mz-no' + (k.t.indexOf(i) >= 0 ? ' bitti' : '') + (k.c[i] ? ' yazildi' : '') + (i === D.no ? ' secili' : '');
      return '<button type="button" class="' + c + '" data-no="' + i + '" aria-label="Soru ' + (i + 1) + (k.t.indexOf(i) >= 0 ? ', tamamlandı' : '') + '"' + (i === D.no ? ' aria-current="true"' : '') + '>' + (i + 1) + '</button>';
    }).join('');
    soruCiz(liste, k);
  }
  function soruCiz(liste, k) {
    var q = D.havuz.sorular[D.no], i = D.no, sira = liste.indexOf(i);
    var bitti = k.t.indexOf(i) >= 0;
    var olcut = q.olcut, toplam = olcut.reduce(function (a, o) { return a + (+o[1] || 0); }, 0);
    var p = k.p[i];
    $('soruKart').innerHTML =
      '<div class="mz-soru-ust"><span class="mz-rozet">' + kac(TUR_AD[q.tur] || q.tur) + '</span>' + (q.konu ? '<span class="mz-konu">' + kac(q.konu) + '</span>' : '') + '<span class="mz-sira">Soru ' + (i + 1) + ' / ' + D.havuz.sorular.length + '</span></div>' +
      soruMetni(q.soru) +
      '<p class="mz-puan-bilgi">' + toplam + ' puan</p>' +
      '<label class="mz-etiket" for="cevapAlan">Cevabın</label>' +
      '<textarea id="cevapAlan" rows="5" placeholder="Cevabını kendi cümlelerinle buraya yaz…">' + kac(k.c[i] || '') + '</textarea>' +
      '<div class="mz-arac">' +
        '<button type="button" class="mz-btn" id="anahtarDugme" aria-expanded="false" aria-controls="anahtar"><span class="msi" aria-hidden="true">key</span> Cevap anahtarını göster</button>' +
        '<button type="button" class="mz-btn ' + (bitti ? 'mz-btn-bitti' : 'mz-btn-ana') + '" id="bittiDugme" aria-pressed="' + bitti + '"><span class="msi" aria-hidden="true">' + (bitti ? 'task_alt' : 'check') + '</span> ' + (bitti ? 'Tamamlandı' : 'Tamamladım olarak işaretle') + '</button>' +
      '</div>' +
      '<div id="anahtar" class="mz-anahtar" hidden>' +
        '<h3>Beklenen cevap</h3><p>' + kac(q.beklenen) + '</p>' +
        '<h3>Cevapta bulunması gereken temel unsurlar</h3><ul>' + q.unsur.map(function (u) { return '<li>' + kac(u) + '</li>'; }).join('') + '</ul>' +
        '<h3>Puanlama ölçütleri ve kendini puanla</h3>' +
        '<table class="mz-tablo"><thead><tr><th scope="col">Ölçüt</th><th scope="col">Tam</th><th scope="col">Kısmen</th><th scope="col">Yok</th></tr></thead><tbody>' +
        olcut.map(function (o, j) {
          var tam = +o[1], yarim = Math.ceil(tam / 2);
          return '<tr><th scope="row">' + kac(o[0]) + '</th>' +
            [tam, yarim, 0].map(function (v, m) { return '<td><label><input type="radio" name="o' + j + '" value="' + v + '"> ' + v + '</label></td>'; }).join('') + '</tr>';
        }).join('') +
        '</tbody><tfoot><tr><th scope="row">Toplam</th><td colspan="3"><strong id="ozPuan">' + (p != null ? p : '–') + '</strong> / ' + toplam + '</td></tr></tfoot></table>' +
        '<p class="mz-not">“Kısmen”: ölçütteki bilgi eksik ya da kısmen doğru yazıldıysa seç. Tüm ölçütleri işaretleyince puanın kaydedilir.</p>' +
      '</div>' +
      '<div class="mz-gecis">' +
        '<button type="button" class="mz-btn" id="onceki"' + (sira <= 0 ? ' disabled' : '') + '><span class="msi" aria-hidden="true">chevron_left</span> Önceki</button>' +
        '<button type="button" class="mz-btn" id="sonraki"' + (sira >= liste.length - 1 ? ' disabled' : '') + '>Sonraki <span class="msi" aria-hidden="true">chevron_right</span></button>' +
      '</div>';

    var zaman;
    $('cevapAlan').addEventListener('input', function (e) {
      clearTimeout(zaman); var v = e.target.value;
      zaman = setTimeout(function () { var kk = oku(D.uid); if (v.trim()) kk.c[i] = v; else delete kk.c[i]; yaz(D.uid, kk); }, 400);
    });
    $('anahtarDugme').addEventListener('click', function () {
      var a = $('anahtar'), ac = a.hidden; a.hidden = !ac;
      this.setAttribute('aria-expanded', ac); this.innerHTML = '<span class="msi" aria-hidden="true">key</span> ' + (ac ? 'Cevap anahtarını gizle' : 'Cevap anahtarını göster');
    });
    $('bittiDugme').addEventListener('click', function () {
      var kk = oku(D.uid), x = kk.t.indexOf(i);
      if (x >= 0) kk.t.splice(x, 1); else kk.t.push(i);
      yaz(D.uid, kk); ciz();
      if (x < 0) bildir('Soru ' + (i + 1) + ' tamamlandı olarak işaretlendi.');
    });
    $('anahtar').addEventListener('change', function () {
      var top = 0, hepsi = true;
      olcut.forEach(function (_, j) { var r = document.querySelector('input[name="o' + j + '"]:checked'); if (r) top += +r.value; else hepsi = false; });
      if (hepsi) { $('ozPuan').textContent = top; var kk = oku(D.uid); kk.p[i] = top; yaz(D.uid, kk); }
    });
    $('onceki').addEventListener('click', function () { if (sira > 0) git(D.uid + '-' + (liste[sira - 1] + 1)); });
    $('sonraki').addEventListener('click', function () { if (sira < liste.length - 1) git(D.uid + '-' + (liste[sira + 1] + 1)); });
  }
  $('turler').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-tur]'); if (!b || !D.havuz) return;
    D.tur = b.getAttribute('data-tur');
    var l = filtreli(); git(D.uid + '-' + ((l.indexOf(D.no) >= 0 ? D.no : l[0]) + 1));
    ciz();
  });
  $('numaralar').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-no]'); if (!b) return;
    git(D.uid + '-' + (+b.getAttribute('data-no') + 1));
  });

  /* Eski bağlantılar: ?sinif=9 gibi */
  (function () { var m = location.search.match(/[?&]sinif=(\d{1,2})/); if (m && !location.hash && SINIFLAR.indexOf(m[1]) >= 0) history.replaceState(null, '', '#s' + m[1]); })();
  window.addEventListener('hashchange', yonlendir);
  yonlendir();
})();
