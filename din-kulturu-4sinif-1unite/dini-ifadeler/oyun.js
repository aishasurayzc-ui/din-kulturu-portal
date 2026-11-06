/* =====================================================================
   DİNÎ İFADELER MACERASI · OYUN AKIŞI (2026-11-06)
   Kayıt: localStorage "dim4_macera_v1" = { c:{soruNo:seçilenMetin}, i:sıradakiSoru, r:[kazanılan rozetler], g:[gösterilen bölüm ekranları], ses:bool }
   ===================================================================== */
(function () {
  'use strict';
  var V = window.DIM_VERI, SH = window.DIM_SAHNE, Q = V.sorular, BOL = V.bolumler;
  var ANAHTAR = 'dim4_macera_v1', HARF = ['A', 'B', 'C', 'D'];
  var DOGRU_MESAJ = ['Harika! Bir yıldız daha kazandın!', 'Süpersin, tam isabet!', 'Bravo dedektif, çok iyi düşündün!', 'Muhteşem! Yıldızın parlıyor!', 'Aferin! Doğru ifadeyi buldun!', 'Çok güzel! Böyle devam!'];
  var DENE_MESAJ = ['Az kaldı! Doğrusunu birlikte keşfedelim.', 'Güzel bir denemeydi! Şimdi doğrusunu öğrenelim.', 'Sorun değil, her soruda yeni bir şey öğreniyoruz!', 'Bir dahaki sefere sen bulacaksın! Bak, doğrusu şu:'];

  function $(id) { return document.getElementById(id); }
  function k(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sec(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- seçenek sırası: her soru için sabit, yenilemede değişmez ---------- */
  var SIRA = Q.map(function (q, i) {
    var a = [q.d].concat(q.y), t = (i * 7919 + 104729) % 2147483647;
    for (var j = a.length - 1; j > 0; j--) { t = (t * 48271) % 2147483647; var r = t % (j + 1), x = a[j]; a[j] = a[r]; a[r] = x; }
    return a;
  });

  /* ---------- kayıt ---------- */
  var D = { c: {}, i: 0, r: [], g: [], ses: true };
  function oku() { try { var v = JSON.parse(localStorage.getItem(ANAHTAR) || 'null'); if (v && typeof v === 'object') { D.c = v.c || {}; D.i = Math.min(Math.max(+v.i || 0, 0), Q.length - 1); D.r = v.r || []; D.g = v.g || []; D.ses = v.ses !== false; } } catch (e) {} }
  function yaz() { try { localStorage.setItem(ANAHTAR, JSON.stringify(D)); } catch (e) {} }
  oku();

  /* ---------- hesaplar ---------- */
  function dogruMu(i) { return D.c[i] != null && D.c[i] === Q[i].d; }
  function cevapSay() { return Object.keys(D.c).length; }
  function dogruSay() { var n = 0; for (var i = 0; i < Q.length; i++) if (dogruMu(i)) n++; return n; }
  function bolumSoru(b) { var a = []; Q.forEach(function (q, i) { if (q.b === b) a.push(i); }); return a; }
  function bolumDogru(b) { return bolumSoru(b).filter(dogruMu).length; }
  function bolumBitti(b) { return bolumSoru(b).every(function (i) { return D.c[i] != null; }); }
  function ilkCevapsiz() { for (var i = 0; i < Q.length; i++) if (D.c[i] == null) return i; return -1; }

  /* ---------- ses (isteğe bağlı, kısa ve yumuşak) ---------- */
  var ac = null;
  function sesCal(tur) {
    if (!D.ses) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var notalar = tur === 'dogru' ? [660, 880] : tur === 'rozet' ? [523, 659, 784, 1047] : [440, 392];
      notalar.forEach(function (f, n) {
        var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + n * 0.12;
        o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.3);
      });
    } catch (e) {}
  }
  function sesDugme() { var b = $('sesDugme'); b.setAttribute('aria-pressed', D.ses ? 'true' : 'false'); b.innerHTML = D.ses ? '🔊' : '🔈'; b.title = D.ses ? 'Sesi kapat' : 'Sesi aç'; }
  $('sesDugme').addEventListener('click', function () { D.ses = !D.ses; yaz(); sesDugme(); });
  sesDugme();

  /* ---------- ekranlar ---------- */
  function goster(id) { ['ekranGiris', 'ekranSoru', 'ekranSonuc'].forEach(function (e) { $(e).hidden = e !== id; }); window.scrollTo(0, 0); }

  /* giriş: macera haritası */
  function giris() {
    goster('ekranGiris');
    $('girisBaykus').innerHTML = SH.baykus('sevinc');
    var cs = cevapSay();
    $('haritaListe').innerHTML = BOL.map(function (b, n) {
      var no = n + 1, bitti = bolumBitti(no), soru = bolumSoru(no), cev = soru.filter(function (i) { return D.c[i] != null; }).length;
      var acik = no === 1 || bolumBitti(no - 1);
      return '<li class="dim-durak' + (bitti ? ' bitti' : '') + (acik ? '' : ' kilitli') + '" style="--renk:' + b.renk + '">' +
        '<span class="dim-durak-no">' + no + '</span>' +
        '<div class="dim-durak-ic"><b>' + k(b.ad) + '</b><span>' + (bitti ? bolumDogru(no) + ' / 10 doğru · ' : cev ? cev + ' / 10 soru · ' : '10 soru · ') + 'Rozet: ' + k(b.rozet) + '</span></div>' +
        '<span class="dim-durak-rozet">' + SH.rozet(n, !bitti) + '</span>' +
        (acik ? '<button type="button" class="dim-btn dim-btn-kucuk" data-bolum="' + no + '">' + (bitti ? 'Tekrar bak' : cev ? 'Devam et' : 'Başla') + '</button>' : '<span class="dim-kilit" aria-label="Önceki bölümü bitirince açılır">🔒</span>') +
        '</li>';
    }).join('');
    $('baslaDugme').textContent = cs === 0 ? 'Başla' : cs === Q.length ? 'Sonuçlarımı Gör' : 'Devam Et (' + cs + ' / 50)';
    $('sifirlaAlan').hidden = cs === 0;
    ustCiz();
  }
  $('baslaDugme').addEventListener('click', function () {
    if (cevapSay() === Q.length) return sonuc();
    var i = ilkCevapsiz(); D.i = i < 0 ? 0 : i; yaz(); soru();
  });
  $('haritaListe').addEventListener('click', function (e) {
    var b = e.target.closest('[data-bolum]'); if (!b) return;
    var no = +b.getAttribute('data-bolum'), s = bolumSoru(no), ilk = s.filter(function (i) { return D.c[i] == null; })[0];
    D.i = ilk != null ? ilk : s[0]; yaz(); soru();
  });

  /* üst bilgi: ilerleme, yıldız, puan */
  function ustCiz() {
    var cs = cevapSay(), ds = dogruSay();
    $('ilerlemeDolu').style.width = (cs / Q.length * 100) + '%';
    $('ilerleme').setAttribute('aria-valuenow', cs);
    $('yildizSay').textContent = ds;
    $('puanSay').textContent = ds * 10;
    $('soruNo').textContent = $('ekranSoru').hidden ? cs + ' / 50' : 'Soru ' + (D.i + 1) + ' / 50';
  }

  /* soru ekranı */
  function soru() {
    goster('ekranSoru');
    var i = D.i, q = Q[i], b = BOL[q.b - 1], cevap = D.c[i];
    document.documentElement.style.setProperty('--bolum', b.renk);
    $('bolumAd').textContent = q.b + '. Bölüm · ' + b.ad;
    $('soruKart').className = 'dim-kart dim-giris-anim' + (q.g ? '' : ' metinli');
    $('soruGorsel').innerHTML = q.g ? SH.ciz(q.g) : '<div class="dim-metin-kart" aria-hidden="true">' + SH.baykus('mutlu') + '<span>Düşün, bul!</span></div>';
    $('soruMetin').textContent = q.s;
    $('secenekler').innerHTML = SIRA[i].map(function (m, n) {
      var cls = 'dim-secenek';
      if (cevap != null) { if (m === q.d) cls += ' dogru'; else if (m === cevap) cls += ' deneme'; else cls += ' soluk'; }
      return '<button type="button" class="' + cls + '" data-m="' + n + '"' + (cevap != null ? ' aria-disabled="true"' : '') + '><span class="dim-harf" aria-hidden="true">' + HARF[n] + '</span><span class="dim-secenek-metin">' + k(m) + '</span>' + (cevap != null && m === q.d ? '<span class="dim-tik" aria-hidden="true">✔</span>' : '') + '</button>';
    }).join('');
    geriBildirim(cevap != null ? (cevap === q.d) : null, false);
    noktaCiz();
    $('onceki').disabled = i === 0;
    $('sonraki').disabled = cevap == null;
    $('sonraki').innerHTML = (i === Q.length - 1 ? 'Sonuçlar' : 'Sonraki') + ' <span aria-hidden="true">➜</span>';
    ustCiz();
    var ilk = $('secenekler').querySelector('.dim-secenek'); if (cevap == null && ilk && document.activeElement && document.activeElement.classList.contains('dim-nav')) ilk.focus();
  }
  function noktaCiz() {
    var q = Q[D.i], s = bolumSoru(q.b);
    $('bolumNoktalar').innerHTML = s.map(function (i, n) {
      var c = D.c[i] == null ? '' : (dogruMu(i) ? ' dogru' : ' deneme');
      return '<span class="dim-nokta' + c + (i === D.i ? ' simdi' : '') + '" title="' + (n + 1) + '. soru"></span>';
    }).join('');
    $('bolumNoktalar').setAttribute('aria-label', q.b + '. bölüm: ' + s.filter(function (i) { return D.c[i] != null; }).length + ' / 10 soru cevaplandı');
  }
  function geriBildirim(durum, yeni) {
    var g = $('geriBildirim'), q = Q[D.i];
    if (durum === null) { g.hidden = true; g.className = 'dim-yanit'; return; }
    g.hidden = false;
    g.className = 'dim-yanit ' + (durum ? 'dogru' : 'deneme') + (yeni ? ' yeni' : '');
    g.innerHTML = '<div class="dim-yanit-baykus">' + SH.baykus(durum ? 'sevinc' : 'mutlu') + '</div><div class="dim-yanit-ic">' +
      '<p class="dim-yanit-baslik">' + (durum ? (yeni ? sec(DOGRU_MESAJ) : 'Bu soruyu doğru cevapladın!') + (yeni ? ' <span class="dim-arti">+10 puan</span>' : '') : (yeni ? sec(DENE_MESAJ) : 'Birlikte öğrendik:')) + '</p>' +
      (durum ? '' : '<p class="dim-yanit-dogru">Doğru cevap: <b>' + k(q.d) + '</b></p>') +
      '<p class="dim-yanit-aciklama">' + k(q.a) + '</p></div>';
  }
  $('secenekler').addEventListener('click', function (e) {
    var b = e.target.closest('.dim-secenek'); if (!b || D.c[D.i] != null) return;
    var m = SIRA[D.i][+b.getAttribute('data-m')], q = Q[D.i], ok = m === q.d;
    D.c[D.i] = m; yaz();
    soru();
    geriBildirim(ok, true);
    var secili = $('secenekler').querySelectorAll('.dim-secenek')[+b.getAttribute('data-m')];
    if (secili) secili.classList.add('vurgu');
    if (ok) { sesCal('dogru'); yildizUcur(secili); } else sesCal('deneme');
    $('sonraki').focus({ preventScroll: true });
    setTimeout(function () { $('geriBildirim').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
  });
  function yildizUcur(kaynak) {
    if (!kaynak || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var r = kaynak.getBoundingClientRect(), h = $('yildizKutu').getBoundingClientRect();
    var y = document.createElement('div'); y.className = 'dim-ucan'; y.textContent = '⭐';
    y.style.left = (r.left + r.width / 2) + 'px'; y.style.top = (r.top + r.height / 2) + 'px';
    document.body.appendChild(y);
    requestAnimationFrame(function () { y.style.transform = 'translate(' + (h.left + h.width / 2 - r.left - r.width / 2) + 'px,' + (h.top + h.height / 2 - r.top - r.height / 2) + 'px) scale(.6)'; y.style.opacity = '.2'; });
    setTimeout(function () { y.remove(); $('yildizKutu').classList.add('zipla'); setTimeout(function () { $('yildizKutu').classList.remove('zipla'); }, 500); }, 750);
  }
  $('onceki').addEventListener('click', function () { if (D.i > 0) { D.i--; yaz(); soru(); } });
  $('sonraki').addEventListener('click', function () {
    if (D.c[D.i] == null) return;
    var q = Q[D.i], son = bolumSoru(q.b), sonSoru = son[son.length - 1] === D.i;
    if (sonSoru && bolumBitti(q.b) && D.g.indexOf(q.b) < 0) {
      D.g.push(q.b); if (D.r.indexOf(q.b) < 0) D.r.push(q.b); yaz();
      if (q.b === BOL.length && cevapSay() === Q.length) return sonuc(true);
      return bolumEkrani(q.b);
    }
    if (D.i === Q.length - 1) { if (cevapSay() === Q.length) return sonuc(); var c = ilkCevapsiz(); D.i = c; yaz(); return soru(); }
    D.i++; yaz(); soru();
  });
  $('haritaDugme').addEventListener('click', giris);
  document.addEventListener('keydown', function (e) {
    if ($('ekranSoru').hidden || !$('bolumEkran').hidden || e.target.closest('input,textarea')) return;
    var n = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 }[e.key.toLowerCase()];
    if (n != null && D.c[D.i] == null) { var s = $('secenekler').querySelectorAll('.dim-secenek')[n]; if (s) s.click(); }
    else if (e.key === 'ArrowRight' && !$('sonraki').disabled) $('sonraki').click();
    else if (e.key === 'ArrowLeft' && !$('onceki').disabled) $('onceki').click();
  });

  /* ---------- bölüm tamamlandı ---------- */
  function konfeti(kap) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var renk = ['#ffd43b', '#ff6b6b', '#4dabf7', '#51cf66', '#cc5de8', '#ff922b'], h = '';
    for (var i = 0; i < 40; i++) h += '<span style="left:' + (Math.random() * 100) + '%;background:' + renk[i % renk.length] + ';animation-delay:' + (Math.random() * .8).toFixed(2) + 's;animation-duration:' + (1.8 + Math.random() * 1.4).toFixed(2) + 's;transform:rotate(' + (Math.random() * 360 | 0) + 'deg)"></span>';
    kap.innerHTML = h;
  }
  function yildizSira(n) { var h = ''; for (var i = 0; i < 10; i++) h += '<span class="dim-y' + (i < n ? ' dolu' : '') + '" style="animation-delay:' + (0.15 + i * 0.09).toFixed(2) + 's">★</span>'; return h; }
  function bolumMesaj(d) { return d >= 9 ? 'Muhteşem bir bölüm çıkardın!' : d >= 7 ? 'Çok başarılısın, harika gidiyorsun!' : d >= 5 ? 'Güzel ilerliyorsun, her soruda yeni bir şey öğrendin!' : 'Her soru yeni bir şey öğretir. Açıklamalar sayesinde artık daha çok şey biliyorsun!'; }
  function bolumEkrani(no) {
    var b = BOL[no - 1], d = bolumDogru(no);
    $('bolumEkran').hidden = false;
    $('bolumEkranIc').innerHTML = '<div class="dim-konfeti" id="konfeti" aria-hidden="true"></div>' +
      '<p class="dim-ust-etiket">' + no + '. bölüm tamamlandı!</p>' +
      '<div class="dim-rozet-buyuk">' + SH.rozet(no - 1) + '</div>' +
      '<h2 id="bolumEkranBaslik">“' + k(b.rozet) + '” rozetini kazandın!</h2>' +
      '<div class="dim-yildizlar" aria-label="10 sorudan ' + d + ' doğru">' + yildizSira(d) + '</div>' +
      '<p class="dim-bolum-skor"><b>' + d + '</b> / 10 doğru · <b>' + d * 10 + '</b> puan</p>' +
      '<p>' + k(b.mesaj) + ' ' + bolumMesaj(d) + '</p>' +
      '<div class="dim-baykus-kose">' + SH.baykus('sevinc') + '</div>' +
      '<button type="button" class="dim-btn" id="bolumDevam">' + (no < BOL.length ? (no + 1) + '. bölüme geç: ' + k(BOL[no].ad) : 'Sonuçlarımı gör') + ' ➜</button>';
    konfeti($('konfeti')); sesCal('rozet');
    $('bolumDevam').focus();
    $('bolumDevam').addEventListener('click', function () {
      $('bolumEkran').hidden = true;
      if (no >= BOL.length) return sonuc();
      var s = bolumSoru(no + 1), ilk = s.filter(function (i) { return D.c[i] == null; })[0];
      D.i = ilk != null ? ilk : s[0]; yaz(); soru();
    });
  }

  /* ---------- sonuç ekranı ---------- */
  function sonuc(kutla) {
    goster('ekranSonuc');
    var ds = dogruSay(), cs = cevapSay(), ys = cs - ds, yuzde = Math.round(ds / Q.length * 100);
    var mesaj = yuzde >= 90 ? 'Harikasın! Dinî ifadeleri hem biliyor hem de yerinde kullanıyorsun.' :
      yuzde >= 70 ? 'Çok başarılısın! Dinî ifadelerin çoğunu doğru yerde kullanmayı öğrendin.' :
      yuzde >= 50 ? 'Güzel bir sonuç! Aşağıdaki açıklamalara göz atarsan bir sonraki denemende daha da başarılı olacaksın.' :
      'Bu çalışmada pek çok yeni ifade öğrendin. Açıklamaları okuyup tekrar çözersen yıldızların çoğalacak. Seninle gurur duyuyoruz!';
    var tekrar = Q.map(function (q, i) { return i; }).filter(function (i) { return D.c[i] != null && !dogruMu(i); });
    $('sonucIc').innerHTML = '<div class="dim-konfeti" id="konfeti2" aria-hidden="true"></div>' +
      '<div class="dim-sonuc-ust"><div class="dim-sonuc-baykus">' + SH.baykus('sevinc') + '</div><div><p class="dim-ust-etiket">50 soru tamamlandı!</p><h1 id="sonucBaslik">' + k(V.ad) + '</h1><p class="dim-sonuc-mesaj">' + mesaj + '</p></div></div>' +
      '<div class="dim-istatistik">' +
      '<div class="dim-ist yesil"><b>' + ds + '</b><span>Doğru</span></div>' +
      '<div class="dim-ist turuncu"><b>' + ys + '</b><span>Tekrar bakılacak</span></div>' +
      '<div class="dim-ist mor"><b>%' + yuzde + '</b><span>Başarı</span></div>' +
      '<div class="dim-ist sari"><b>⭐ ' + ds + '</b><span>Yıldız · ' + ds * 10 + ' puan</span></div></div>' +
      '<h2>Kazandığın rozetler</h2><ul class="dim-rozetler">' + BOL.map(function (b, n) { var var_ = bolumBitti(n + 1); return '<li class="' + (var_ ? '' : 'kilitli') + '">' + SH.rozet(n, !var_) + '<span>' + k(b.rozet) + '</span></li>'; }).join('') + '</ul>' +
      '<h2>Bölüm bölüm başarın</h2><ul class="dim-bolum-cubuk">' + BOL.map(function (b, n) { var d = bolumDogru(n + 1); return '<li><span class="dim-bc-ad">' + (n + 1) + '. ' + k(b.ad) + '</span><span class="dim-bc-cubuk" role="img" aria-label="' + d + ' / 10 doğru"><span style="width:' + d * 10 + '%;background:' + b.renk + '"></span></span><b>' + d + ' / 10</b></li>'; }).join('') + '</ul>' +
      (tekrar.length ? '<h2>Birlikte tekrar bakalım (' + tekrar.length + ' soru)</h2><ol class="dim-tekrar">' + tekrar.map(function (i) {
        var q = Q[i]; return '<li><p class="dim-t-soru"><b>' + (i + 1) + '.</b> ' + k(q.s) + '</p><p class="dim-t-senin">Senin seçimin: ' + k(D.c[i]) + '</p><p class="dim-t-dogru">Doğru cevap: <b>' + k(q.d) + '</b></p><p class="dim-t-aciklama">' + k(q.a) + '</p><button type="button" class="dim-btn dim-btn-kucuk dim-btn-acik" data-git="' + i + '">Soruya git</button></li>';
      }).join('') + '</ol>' : '<p class="dim-tam">Bütün soruları doğru cevapladın. Tebrikler, harikasın! 🎉</p>') +
      '<div class="dim-sonuc-btn"><button type="button" class="dim-btn" id="yenidenOyna">Baştan başla</button><button type="button" class="dim-btn dim-btn-acik" id="haritayaDon">Başlangıç ekranı</button></div>';
    if (kutla !== false) { konfeti($('konfeti2')); sesCal('rozet'); }
    $('yenidenOyna').addEventListener('click', sifirlaSor);
    $('haritayaDon').addEventListener('click', giris);
    $('sonucIc').querySelectorAll('[data-git]').forEach(function (b) { b.addEventListener('click', function () { D.i = +b.getAttribute('data-git'); yaz(); soru(); }); });
    ustCiz();
  }

  /* ---------- sıfırlama (tarayıcı penceresi yerine sayfa içi onay) ---------- */
  function sifirlaSor() { $('onayKutu').hidden = false; $('onayEvet').focus(); }
  $('sifirlaDugme').addEventListener('click', sifirlaSor);
  $('onayHayir').addEventListener('click', function () { $('onayKutu').hidden = true; });
  $('onayEvet').addEventListener('click', function () {
    var ses = D.ses; D = { c: {}, i: 0, r: [], g: [], ses: ses }; yaz();
    $('onayKutu').hidden = true; giris();
  });

  /* başlangıç */
  giris();
  window.DIM_TEST = { D: function () { return D; }, SIRA: SIRA };
})();
