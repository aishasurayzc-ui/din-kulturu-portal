/* ======================================================================
   ÖĞRENME LABORATUVARI — motor (2026-11-08)
   Veri: laboratuvarlar.js (window.OGRENME_LAB)
   Öğrenci cevapları YALNIZCA bu cihazda (localStorage 'olab:<id>') tutulur;
   öğretmene "dosya olarak indir" veya "yazdır" ile teslim edilir.
====================================================================== */
(function(){
'use strict';
var LABS = window.OGRENME_LAB || [];
var SEVIYELER = [
  { k:'baslangic', ad:'Başlangıç', ac:'Kavramları tanı, temel bilgi ve basit örnekler' },
  { k:'gelisim',   ad:'Gelişim',   ac:'Karşılaştır, yorumla, neden-sonuç ilişkisi kur' },
  { k:'ileri',     ad:'İleri',     ac:'Analiz et, eleştirel düşün, özgün çözüm üret' }
];
var OZ = ['Henüz değil', 'Kısmen', 'Evet'];
var kok = document.getElementById('lab');

function kac(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function oku(k){ try{ return JSON.parse(localStorage.getItem(k) || 'null'); }catch(e){ return null; } }
function yaz(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }

/* ---------------- liste ---------------- */
function listeCiz(){
  document.title = 'Öğrenme Laboratuvarı · Ayşe Yazıcı';
  kok.innerHTML = '<header class="ol-bas"><p class="ol-ust">Ayşe Yazıcı · Din Kültürü ve Ahlak Bilgisi</p>' +
    '<h1>Öğrenme Laboratuvarı</h1><p class="ol-alt">Bir problemle karşılaş, araştır, sorular üret, farklı görüşleri incele ve kendi çözümünü geliştir.</p></header>' +
    '<div class="ol-liste">' + LABS.map(function(L){
      var d = oku('olab:' + L.id) || {};
      return '<a class="ol-lab-kart" href="?id=' + encodeURIComponent(L.id) + '">' +
        '<span class="ol-etiket">' + L.sinif + '. Sınıf · ' + L.unite + '. Ünite · ' + kac(L.uniteAdi) + '</span>' +
        '<b>' + kac(L.baslik) + '</b><span>' + kac(L.ozet) + '</span>' +
        '<span class="ol-kart-alt">' + L.disiplinler.map(function(x){ return x.ikon + ' ' + kac(x.ad); }).join(' · ') +
        (d.guncelleme ? ' · <em>Devam ediyor</em>' : '') + (L.onayli ? '' : ' · <em class="ol-taslak-k">Taslak</em>') + '</span></a>';
    }).join('') + '</div>';
}

/* ---------------- laboratuvar ---------------- */
var L, D, adim = 0;
function kaydet(){
  D.guncelleme = new Date().toISOString();
  var ok = yaz('olab:' + L.id, D);
  var s = document.getElementById('olKayit');
  if(s) s.textContent = ok ? 'Bu cihaza kaydedildi' : 'Kaydedilemedi (tarayıcı izin vermiyor) — sayfadan ayrılmadan indir';
}
function cevapAnahtar(a, ek){ return a.k + ':' + D.seviye + (ek ? ':' + ek : ''); }
function deger(a, ek){ return (D.cevap || {})[cevapAnahtar(a, ek)] || ''; }
function adimDolu(a){
  var c = D.cevap || {}, on = a.k + ':';
  for(var k in c) if(k.indexOf(on) === 0 && String(c[k]).trim()) return true;
  if(a.k === 'degerlendir' && D.oz && Object.keys(D.oz).length) return true;
  return false;
}

function gorevHtml(a){
  var g = a.gorev[D.seviye]; if(!g) return '';
  var h = '<div class="ol-gorev"><p class="ol-gorev-bas"><span class="ol-sev-rozet ol-sev-' + D.seviye + '">' +
    kac(SEVIYELER.filter(function(s){ return s.k === D.seviye; })[0].ad) + '</span> ' + kac(g.soru) + '</p>';
  function alan(ek, etiket, satir){
    var id = 'g-' + a.k + '-' + (ek || 'ana');
    return (etiket ? '<label class="ol-etk" for="' + id + '">' + kac(etiket) + '</label>' : '') +
      '<textarea id="' + id + '" rows="' + (satir || 4) + '" data-c="' + kac(ek || '') + '"' +
      (etiket ? '' : ' aria-label="' + kac(g.soru) + '"') + '>' + kac(deger(a, ek)) + '</textarea>';
  }
  if(g.tur === 'metin') h += alan('', '', 5);
  else if(g.tur === 'zincir'){
    h += '<div class="ol-zincir"><span class="ol-halka ol-halka-sabit">Arılar yok olur</span>';
    for(var i = 1; i <= g.halka; i++) h += '<span class="ol-ok" aria-hidden="true">→</span>' +
      '<input type="text" class="ol-halka" aria-label="' + i + '. sonuç" data-c="h' + i + '" value="' + kac(deger(a, 'h' + i)) + '">';
    h += '</div>';
  } else if(g.tur === 'liste'){
    for(var j = 1; j <= g.adet; j++) h += '<input type="text" class="ol-satir" aria-label="' + j + '. madde" placeholder="' + j + '." data-c="m' + j + '" value="' + kac(deger(a, 'm' + j)) + '">';
  } else if(g.tur === 'degerlendir'){
    var v = deger(a, 'yargi');
    h += '<div class="ol-secim" role="radiogroup" aria-label="Görüş hakkındaki kararın">' + ['Doğru', 'Kısmen doğru', 'Yanlış'].map(function(t){
      return '<label><input type="radio" name="yargi-' + a.k + '" data-c="yargi" value="' + t + '"' + (v === t ? ' checked' : '') + '> ' + t + '</label>';
    }).join('') + '</div>' + alan('neden', 'Gerekçen (kartlardan bir bilgi kullan):', 3);
  } else if(g.tur === 'plan'){
    [['ne','Ne yapılacak?'],['kim','Kimler katılacak?'],['nasil','Nasıl yapılacak?'],['olcum','İşe yaradığını nasıl anlayacaksınız?']].forEach(function(p){ h += alan(p[0], p[1], 2); });
  }
  if(g.eminlik){
    var e = deger(a, 'eminlik');
    h += '<div class="ol-secim" role="radiogroup" aria-label="Tahminden ne kadar eminsin?"><span class="ol-etk">Ne kadar eminsin?</span>' +
      ['Az', 'Orta', 'Çok'].map(function(t){ return '<label><input type="radio" name="emin-' + a.k + '" data-c="eminlik" value="' + t + '"' + (e === t ? ' checked' : '') + '> ' + t + '</label>'; }).join('') + '</div>';
  }
  return h + '</div>';
}

function adimHtml(a, i){
  var h = '<section class="ol-adim" aria-labelledby="olAdimBas"><p class="ol-adim-no">Adım ' + (i + 1) + ' / ' + L.adimlar.length + '</p>' +
    '<h2 id="olAdimBas" tabindex="-1">' + a.ikon + ' ' + kac(a.ad) + '</h2><p class="ol-adim-metin">' + kac(a.metin) + '</p>';
  if(a.not) h += '<p class="ol-not">' + kac(a.not) + '</p>';
  if(a.kartlar) h += '<div class="ol-kartlar">' + L.bilgiKartlari.map(function(k){
      return '<article class="ol-bilgi' + (k.ayet ? ' ol-bilgi-ayet' : '') + '"><h3>' + kac(k.baslik) + '</h3><p>' + kac(k.metin) + '</p><p class="ol-kaynak">Kaynak: ' + kac(k.kaynak) + '</p></article>';
    }).join('') + '</div>';
  if(a.gorusler) h += '<p class="ol-not">Aşağıdakiler, düşünmen için hazırlanmış örnek görüşlerdir.</p><div class="ol-kartlar">' + a.gorusler.map(function(g){
      return '<article class="ol-gorus"><h3>' + kac(g.kim) + '</h3><p>“' + kac(g.soz) + '”</p></article>';
    }).join('') + '</div>';
  h += gorevHtml(a);
  if(a.matematik) h += '<div class="ol-kose"><p><b>➗ ' + kac(a.matematik.split(':')[0]) + ':</b>' + kac(a.matematik.slice(a.matematik.indexOf(':') + 1)) + '</p>' +
    '<input type="text" class="ol-satir" aria-label="Matematik köşesi cevabın" data-c="mat" data-sabit="1" value="' + kac(((D.cevap || {})[a.k + ':mat']) || '') + '"></div>';
  if(a.ayetler) h += '<div class="ol-ayetler">' + L.ayetler.map(function(y){
      return '<blockquote><p>“' + kac(y.metin) + '”</p><cite>' + kac(y.kaynak) + ' (Diyanet meali)</cite></blockquote>';
    }).join('') + '</div><div class="ol-gorev"><p class="ol-gorev-bas">🔗 ' + kac(a.bag) + '</p>' +
    '<textarea rows="4" aria-label="' + kac(a.bag) + '" data-c="bag" data-sabit="1">' + kac(((D.cevap || {})[a.k + ':bag']) || '') + '</textarea></div>';
  if(a.olcutler){
    D.oz = D.oz || {};
    h += '<table class="ol-oz"><caption>Öz değerlendirme</caption><thead><tr><th scope="col">Ölçüt</th>' + OZ.map(function(o){ return '<th scope="col">' + o + '</th>'; }).join('') + '</tr></thead><tbody>' +
      a.olcutler.map(function(o, n){
        return '<tr><th scope="row">' + kac(o) + '</th>' + OZ.map(function(x, m){
          return '<td><input type="radio" name="oz' + n + '" data-oz="' + n + '" value="' + m + '" aria-label="' + kac(o + ': ' + x) + '"' + (D.oz[n] === m ? ' checked' : '') + '></td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table><div id="olOneri" class="ol-oneri" role="status"></div>';
  }
  return h + '</section>';
}

function oneriGuncelle(){
  var k = document.getElementById('olOneri'); if(!k) return;
  var a = L.adimlar[L.adimlar.length - 1], say = a.olcutler.length, evet = 0, dolu = 0;
  for(var i = 0; i < say; i++){ if(D.oz[i] != null) dolu++; if(D.oz[i] === 2) evet++; }
  var si = SEVIYELER.map(function(s){ return s.k; }).indexOf(D.seviye);
  if(dolu < say){ k.innerHTML = ''; return; }
  if(evet === say && si < 2) k.innerHTML = '🎯 Bütün ölçütlerde “Evet” dedin. Bir üst seviyeyi denemeye hazırsın: <button type="button" data-sev="' + SEVIYELER[si + 1].k + '">' + SEVIYELER[si + 1].ad + ' seviyesine geç</button>';
  else if(evet === say) k.textContent = '🏅 İleri seviyeyi bütün ölçütlerle tamamladın. Çalışmanı indirip öğretmenine teslim edebilirsin.';
  else k.textContent = '🌱 “Henüz değil” ya da “Kısmen” dediğin ölçütler için ilgili adıma dönüp cevabını geliştirebilirsin.';
}

function labCiz(){
  document.title = L.baslik + ' · Öğrenme Laboratuvarı';
  D = oku('olab:' + L.id) || {};
  D.seviye = D.seviye || 'baslangic'; D.cevap = D.cevap || {}; D.oz = D.oz || {};
  if(typeof D.adim === 'number') adim = Math.min(Math.max(D.adim, 0), L.adimlar.length - 1);
  kok.innerHTML =
    '<header class="ol-bas"><p class="ol-ust"><a href="./">← Öğrenme Laboratuvarı</a> · ' + L.sinif + '. Sınıf · ' + L.unite + '. Ünite · ' + kac(L.uniteAdi) + '</p>' +
      (L.onayli ? '' : '<p class="ol-taslak" role="note">Taslak · Öğretmen onayı bekliyor</p>') +
      '<h1>' + kac(L.baslik) + '</h1><p class="ol-alt">' + kac(L.ozet) + '</p>' +
      '<div class="ol-cipler"><span class="ol-cip">⏱ ' + kac(L.sure) + '</span>' + L.disiplinler.map(function(x){
        return '<span class="ol-cip" title="' + kac(x.ne) + '">' + x.ikon + ' ' + kac(x.ad) + '</span>'; }).join('') + '</div>' +
      '<details class="ol-meb"><summary>MEB öğrenme çıktıları</summary><ul>' + L.meb.map(function(m){ return '<li><b>' + kac(m.kod) + '</b> ' + kac(m.ad) + '</li>'; }).join('') + '</ul></details>' +
    '</header>' +
    '<div class="ol-seviye" role="radiogroup" aria-label="Görev seviyesi"><span class="ol-etk">Seviyeni seç:</span>' + SEVIYELER.map(function(s){
      return '<button type="button" role="radio" data-sev="' + s.k + '" aria-checked="' + (D.seviye === s.k) + '" title="' + kac(s.ac) + '">' + s.ad + '</button>';
    }).join('') + '<span class="ol-sev-ac" id="olSevAc"></span></div>' +
    '<nav class="ol-adimlar" aria-label="Laboratuvar adımları"><ol>' + L.adimlar.map(function(a, i){
      return '<li><button type="button" data-adim="' + i + '"><span class="ol-no">' + (i + 1) + '</span><span class="ol-ad">' + kac(a.ad) + '</span></button></li>';
    }).join('') + '</ol></nav>' +
    '<div id="olIcerik"></div>' +
    '<div class="ol-gez"><button type="button" class="ol-btn" data-git="-1">← Önceki adım</button><span id="olKayit" class="ol-kayit" role="status"></span><button type="button" class="ol-btn ol-btn-ana" data-git="1">Sonraki adım →</button></div>' +
    '<section class="ol-teslim" aria-labelledby="olTeslimBas"><h2 id="olTeslimBas">Çalışmanı teslim et</h2>' +
      '<p>Cevapların yalnızca bu cihazda saklanır. Öğretmenine teslim etmek için dosya olarak indir veya yazdır.</p>' +
      '<label class="ol-etk" for="olAd">Adın ve sınıfın (isteğe bağlı, yalnızca indirilen dosyada görünür):</label>' +
      '<input type="text" id="olAd" class="ol-satir" autocomplete="off" value="' + kac(D.ad || '') + '">' +
      '<div class="ol-teslim-btn"><button type="button" class="ol-btn ol-btn-ana" id="olIndir">⬇ Çalışmamı dosya olarak indir</button>' +
      '<button type="button" class="ol-btn" id="olYazdir">🖨 Yazdır</button>' +
      '<button type="button" class="ol-btn ol-btn-sil" id="olSil">Cevaplarımı bu cihazdan sil</button></div></section>' +
    '<div id="olYazdirAlani" class="ol-yazdir" aria-hidden="true"></div>';
  adimGoster(adim, false);
}

function adimGoster(i, odak){
  adim = i; D.adim = i;
  var a = L.adimlar[i];
  document.getElementById('olIcerik').innerHTML = adimHtml(a, i);
  Array.prototype.forEach.call(kok.querySelectorAll('[data-adim]'), function(b, n){
    b.classList.toggle('ol-simdi', n === i);
    b.classList.toggle('ol-dolu', adimDolu(L.adimlar[n]));
    if(n === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
  });
  Array.prototype.forEach.call(kok.querySelectorAll('[data-sev]'), function(b){
    if(b.closest('.ol-seviye')) b.setAttribute('aria-checked', String(b.getAttribute('data-sev') === D.seviye));
  });
  document.getElementById('olSevAc').textContent = SEVIYELER.filter(function(s){ return s.k === D.seviye; })[0].ac;
  kok.querySelector('[data-git="-1"]').disabled = i === 0;
  var son = kok.querySelector('[data-git="1"]'); son.disabled = i === L.adimlar.length - 1;
  if(a.olcutler) oneriGuncelle();
  if(odak){ var h = document.getElementById('olAdimBas'); if(h){ h.focus({ preventScroll:true }); h.scrollIntoView({ block:'start', behavior:'smooth' }); } }
}

/* ---------------- teslim: indir / yazdır ---------------- */
function raporHtml(){
  var c = D.cevap || {}, h = '';
  L.adimlar.forEach(function(a, i){
    var parca = [];
    SEVIYELER.forEach(function(s){
      var g = a.gorev[s.k], on = a.k + ':' + s.k, satir = [];
      Object.keys(c).filter(function(k){ return (k === on || k.indexOf(on + ':') === 0) && String(c[k]).trim(); }).forEach(function(k){
        var ek = k.slice(on.length + 1); satir.push((ek ? '<i>' + kac(ek) + ':</i> ' : '') + kac(c[k]).replace(/\n/g, '<br>'));
      });
      if(satir.length) parca.push('<p><b>[' + s.ad + '] ' + kac(g.soru) + '</b><br>' + satir.join('<br>') + '</p>');
    });
    ['mat', 'bag'].forEach(function(x){ if(c[a.k + ':' + x]) parca.push('<p><b>' + (x === 'mat' ? 'Matematik köşesi' : 'Evrendeki düzen bağlantısı') + ':</b><br>' + kac(c[a.k + ':' + x]).replace(/\n/g, '<br>') + '</p>'); });
    if(a.olcutler && Object.keys(D.oz || {}).length) parca.push('<ul>' + a.olcutler.map(function(o, n){ return '<li>' + kac(o) + ' — <b>' + (D.oz[n] != null ? OZ[D.oz[n]] : '—') + '</b></li>'; }).join('') + '</ul>');
    h += '<h2>' + (i + 1) + '. ' + kac(a.ad) + '</h2>' + (parca.join('') || '<p><i>Bu adım boş bırakıldı.</i></p>');
  });
  return '<h1>Öğrenme Laboratuvarı: ' + kac(L.baslik) + '</h1><p>' + L.sinif + '. Sınıf · ' + L.unite + '. Ünite · ' + kac(L.uniteAdi) +
    '<br>Öğrenci: ' + kac(D.ad || '—') + '<br>Son çalışma: ' + (D.guncelleme ? new Date(D.guncelleme).toLocaleString('tr-TR') : '—') + '</p>' + h +
    '<hr><p><b>Öğretmen geri bildirimi:</b></p><p style="min-height:6em;border:1px solid #999;border-radius:6px"></p>';
}
function indir(){
  var doc = '<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>' + kac(L.baslik) + ' — ' + kac(D.ad || 'Öğrenci') + '</title>' +
    '<style>body{font-family:Nunito,Arial,sans-serif;max-width:760px;margin:24px auto;padding:0 16px;line-height:1.55;color:#1c2a3a}h1{color:#13294b}h2{color:#1f4f8f;border-bottom:1px solid #dbe2ec;padding-bottom:4px}</style></head><body>' + raporHtml() + '</body></html>';
  var url = URL.createObjectURL(new Blob([doc], { type:'text/html;charset=utf-8' }));
  var a = document.createElement('a');
  a.href = url; a.download = 'laboratuvar-' + L.id + (D.ad ? '-' + D.ad.replace(/[^\wçğıöşüÇĞİÖŞÜ]+/g, '-') : '') + '.html';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
}

/* ---------------- olaylar ---------------- */
document.addEventListener('input', function(e){
  var t = e.target; if(!L || !kok.contains(t)) return;
  if(t.id === 'olAd'){ D.ad = t.value; kaydet(); return; }
  if(t.hasAttribute('data-c')){
    var a = L.adimlar[adim], ek = t.getAttribute('data-c');
    var anahtar = t.hasAttribute('data-sabit') ? a.k + ':' + ek : cevapAnahtar(a, ek);
    D.cevap[anahtar] = t.value; kaydet();
    var b = kok.querySelectorAll('[data-adim]')[adim]; if(b) b.classList.toggle('ol-dolu', adimDolu(a));
  }
});
document.addEventListener('change', function(e){
  var t = e.target; if(!L || !kok.contains(t)) return;
  if(t.hasAttribute('data-oz')){ D.oz[t.getAttribute('data-oz')] = parseInt(t.value, 10); kaydet(); oneriGuncelle();
    var b = kok.querySelectorAll('[data-adim]')[adim]; if(b) b.classList.add('ol-dolu'); }
});
document.addEventListener('click', function(e){
  if(!L) return;
  var b = e.target.closest('button'); if(!b || !kok.contains(b)) return;
  if(b.hasAttribute('data-adim')){ adimGoster(parseInt(b.getAttribute('data-adim'), 10), true); kaydet(); }
  else if(b.hasAttribute('data-git')){ var n = adim + parseInt(b.getAttribute('data-git'), 10);
    if(n >= 0 && n < L.adimlar.length){ adimGoster(n, true); kaydet(); } }
  else if(b.hasAttribute('data-sev')){ D.seviye = b.getAttribute('data-sev'); kaydet(); adimGoster(adim, false); }
  else if(b.id === 'olIndir') indir();
  else if(b.id === 'olYazdir'){ document.getElementById('olYazdirAlani').innerHTML = raporHtml(); window.print(); }
  else if(b.id === 'olSil'){
    if(confirm('Bu laboratuvardaki bütün cevapların bu cihazdan silinecek. Emin misin?')){
      try{ localStorage.removeItem('olab:' + L.id); }catch(x){} adim = 0; labCiz(); }
  }
});
/* ok tuşlarıyla seviye seçimi (radiogroup) */
document.addEventListener('keydown', function(e){
  var b = e.target; if(!b.closest || !b.closest('.ol-seviye') || !/^Arrow(Left|Right)$/.test(e.key)) return;
  var i = SEVIYELER.map(function(s){ return s.k; }).indexOf(D.seviye) + (e.key === 'ArrowRight' ? 1 : -1);
  if(i < 0 || i > 2) return; e.preventDefault(); D.seviye = SEVIYELER[i].k; kaydet(); adimGoster(adim, false);
  kok.querySelector('.ol-seviye [data-sev="' + D.seviye + '"]').focus();
});

var id = new URLSearchParams(location.search).get('id');
L = LABS.filter(function(x){ return x.id === id; })[0] || (LABS.length === 1 && !id ? null : null);
if(L) labCiz(); else listeCiz();
})();
