/* =====================================================================
   AÇIK UÇLU SORU MERKEZİ — uygulama
   ---------------------------------------------------------------------
   Veri: sorular-9.js / sorular-10.js / sorular-11.js (window.ACIK_UCLU).
   Kayıtlar yalnızca bu tarayıcının yerel deposunda tutulur:
     auc_cevap_<sid>   öğrenci cevapları {soruId: metin}
     auc_isaret_<sid>  işaretlenen soru id'leri
     auc_konum_<sid>   öğrencinin kaldığı soru
     auc_havuz_<sid>   öğretmenin düzenlediği havuz (yoksa varsayılan)
     auc_sinav_<sid>   sınav taslağı
   Depo kullanılamıyorsa (gizli pencere vb.) sayfa yine çalışır, yalnız
   kayıt tutmaz.
   ===================================================================== */
(function(){
'use strict';

var VERI = window.ACIK_UCLU || {};
var SINIFLAR = ['s9','s10','s11'];
var KATEGORI = {
  bilgi:'Bilgi ve kavram',
  aciklama:'Açıklama ve örneklendirme',
  yorum:'Yorumlama ve çıkarım yapma',
  hayat:'Günlük hayatla ilişkilendirme',
  analiz:'Analiz ve değerlendirme'
};
var ZORLUK = { kolay:'Kolay', orta:'Orta', zor:'Zor' };
var BECERILER = ['Bilgiye ulaşma ve bilgiyi kullanma','Eleştirel düşünme','Analitik düşünme','Problem çözme','Karar verme','Yorumlama','Çıkarım yapma','Karşılaştırma','Sorgulama','İletişim','Öz değerlendirme','Günlük hayatla ilişkilendirme'];
var DEGERLER = { s9:['Sabır','Sorumluluk'], s10:['Mütevazılık','Sorumluluk'], s11:['Özgürlük','Duyarlılık','Sorumluluk'] };

/* ---------- depo ---------- */
var depoUyari = false;
function oku(k, vars){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : vars; }catch(e){ return vars; } }
function yaz(k, v){
  try{ localStorage.setItem(k, JSON.stringify(v)); return true; }
  catch(e){ if(!depoUyari){ depoUyari = true; toast('Bu tarayıcıda kayıt yapılamıyor; cevaplar sayfa kapanınca kaybolur.'); } return false; }
}
function sil(k){ try{ localStorage.removeItem(k); }catch(e){} }

/* ---------- yardımcılar ---------- */
function $(s, k){ return (k||document).querySelector(s); }
function kac(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function toplamPuan(q){ return (q.olcut||[]).reduce(function(a,o){ return a + (Number(o[1])||0); }, 0); }
function kelimeSay(t){ var m = String(t||'').trim().match(/\S+/g); return m ? m.length : 0; }
function toast(m){
  var t = document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=m;
  document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 3200);
}
function yeniId(sid){ return sid + '-y' + Date.now().toString(36) + Math.floor(Math.random()*1e4).toString(36); }

/* ---------- durum ---------- */
var D = { sid:'s9', mod:'ogrenci', sekme:'havuz', idx:0, ogrZor:'', secili:{}, filtre:{kat:'', konu:'', zor:'', ara:''} };

function havuz(sid){
  sid = sid || D.sid;
  var varsayilan = (VERI[sid] ? VERI[sid].sorular : []).map(function(q, i){
    var c = JSON.parse(JSON.stringify(q)); c.id = sid + '-' + (i+1); return c;
  });
  var kayit = oku('auc_havuz_'+sid, null);
  if(!(kayit && kayit.length)) return varsayilan;
  /* Zorluk eklenmeden önce kaydedilmiş havuzlarda eksik zorluğu hazır havuzdan tamamla */
  kayit.forEach(function(q){
    if(q.zorluk) return;
    var v = varsayilan.find(function(x){ return x.soru===q.soru; }) || varsayilan.find(function(x){ return x.id===q.id; });
    q.zorluk = v ? v.zorluk : 'orta';
  });
  return kayit;
}
function zorlukRozet(q){ return q.zorluk ? '<span class="rozet z-'+q.zorluk+'">'+ZORLUK[q.zorluk]+'</span>' : ''; }
/* Öğrencinin seçtiği zorluk düzeyine göre süzülmüş liste; _no havuzdaki asıl numaradır */
function ogrListe(){
  return havuz().map(function(q,i){ q._no = i+1; return q; }).filter(function(q){ return !D.ogrZor || q.zorluk===D.ogrZor; });
}
function havuzKaydet(liste){ yaz('auc_havuz_'+D.sid, liste); }
function sinavAl(){ return oku('auc_sinav_'+D.sid, {okul:'', ad:'', tarih:'', ogretmen:'Ayşe Yazıcı', ogeler:[]}); }
function sinavKaydet(s){ yaz('auc_sinav_'+D.sid, s); }
function meta(){ return VERI[D.sid] || {konular:[], ciktilar:{}}; }

/* ---------- tema (portal ile ortak anahtar) ---------- */
function temaUygula(t){
  document.documentElement.setAttribute('data-tema', t);
  var b = $('#temaDugme'); if(b){ b.querySelector('.msi').textContent = t==='dark' ? 'light_mode' : 'dark_mode'; b.setAttribute('aria-pressed', t==='dark'); }
}

/* =====================================================================
   ÇİZİM
   ===================================================================== */
function ciz(){
  document.body.className = D.sid;
  SINIFLAR.forEach(function(s){ var b = $('#kart-'+s); if(b) b.setAttribute('aria-pressed', s===D.sid); });
  $('#modOgrenci').setAttribute('aria-pressed', D.mod==='ogrenci');
  $('#modOgretmen').setAttribute('aria-pressed', D.mod==='ogretmen');
  $('#ogrenciAlan').classList.toggle('gizli', D.mod!=='ogrenci');
  $('#ogretmenAlan').classList.toggle('gizli', D.mod!=='ogretmen');
  $('#uniteAdi').textContent = (meta().sinif||'') + '. Sınıf · ' + (meta().unite||'');
  if(D.mod==='ogrenci') ogrenciCiz(); else ogretmenCiz();
}

/* ---------------- ÖĞRENCİ ---------------- */
function ogrenciCiz(){
  var L = ogrListe(), cev = oku('auc_cevap_'+D.sid, {}), isr = oku('auc_isaret_'+D.sid, []);
  var zorSec = '<div class="zorluk-sec" role="group" aria-label="Zorluk düzeyi">'+
    [['','Tümü']].concat(Object.keys(ZORLUK).map(function(k){ return [k, ZORLUK[k]]; })).map(function(z){
      var n = havuz().filter(function(q){ return !z[0] || q.zorluk===z[0]; }).length;
      return '<button type="button" data-zor="'+z[0]+'" class="'+(z[0]?'z-'+z[0]:'')+'" aria-pressed="'+(D.ogrZor===z[0])+'">'+z[1]+' <small>('+n+')</small></button>';
    }).join('')+'</div>';
  if(!L.length){ $('#ogrenciAlan').innerHTML = zorSec + '<p class="bos">Bu düzeyde soru yok.</p>'; zorBagla(); return; }
  if(D.idx >= L.length) D.idx = L.length-1; if(D.idx < 0) D.idx = 0;
  var q = L[D.idx], m = meta();
  var dolu = L.filter(function(x){ return (cev[x.id]||'').trim(); }).length;
  var isaretli = isr.indexOf(q.id) > -1;

  $('#ogrenciAlan').innerHTML = zorSec +
    '<div class="ilerleme"><span id="ilerlemeMetin">'+dolu+' / '+L.length+' cevaplandı</span><div class="ilerleme-cubuk" id="ilerlemeCubuk" role="progressbar" aria-valuemin="0" aria-valuemax="'+L.length+'" aria-valuenow="'+dolu+'" aria-label="Cevaplanan soru oranı"><i style="width:'+(dolu/L.length*100)+'%"></i></div></div>'+
    '<article class="kutu soru-kart" aria-labelledby="soruMetin">'+
      '<div class="soru-ust"><span class="soru-no">Soru '+q._no+'</span>'+zorlukRozet(q)+'<span class="rozet kat">'+kac(KATEGORI[q.k]||q.k)+'</span><span class="rozet">'+kac(m.konular[q.konu]||'')+'</span><span class="rozet">'+toplamPuan(q)+' puan</span></div>'+
      '<p class="soru-metin" id="soruMetin">'+kac(q.soru)+'</p>'+
      '<label class="sr" for="cevap">Cevabınız</label>'+
      '<textarea id="cevap" class="cevap-alani" placeholder="Cevabını buraya yaz. Kendi cümlelerinle açıkla, örnek vermeyi unutma.">'+kac(cev[q.id]||'')+'</textarea>'+
      '<div class="cevap-alt"><span id="kelime" aria-live="polite">'+kelimeSay(cev[q.id])+' kelime</span><span id="kayitDurum">Cevaplar otomatik kaydedilir.</span></div>'+
      '<div class="gezinme">'+
        '<div class="arac"><button class="btn" id="onceki"'+(D.idx===0?' disabled':'')+'><span class="msi">arrow_back</span> Önceki</button>'+
        '<button class="btn" id="isaretle" aria-pressed="'+isaretli+'"><span class="msi">flag</span> '+(isaretli?'İşaretli':'İşaretle')+'</button>'+
        '<button class="btn btn-tehlike" id="temizle"><span class="msi">backspace</span> Temizle</button></div>'+
        '<button class="btn btn-ana" id="sonraki"'+(D.idx===L.length-1?' disabled':'')+'>Sonraki <span class="msi">arrow_forward</span></button>'+
      '</div>'+
    '</article>'+
    '<nav class="kutu" style="margin-top:14px" aria-label="Soru listesi"><strong>Sorular</strong>'+
      '<div class="numara-izgara">'+L.map(function(x,i){
        var c = [(cev[x.id]||'').trim()?'dolu':'', isr.indexOf(x.id)>-1?'isaretli':'', i===D.idx?'aktif':''].join(' ');
        return '<button data-git="'+i+'" class="'+c+'" aria-label="Soru '+x._no+((cev[x.id]||'').trim()?', cevaplandı':'')+(isr.indexOf(x.id)>-1?', işaretli':'')+'"'+(i===D.idx?' aria-current="true"':'')+'>'+x._no+'</button>';
      }).join('')+'</div>'+
      '<div class="lejant"><span><i style="background:var(--vurgu-acik);border-color:var(--vurgu)"></i>Cevaplandı</span><span><i style="background:var(--uyari);border-radius:50%"></i>İşaretli</span></div>'+
    '</nav>';

  var ta = $('#cevap'), zaman;
  ta.addEventListener('input', function(){
    $('#kelime').textContent = kelimeSay(ta.value) + ' kelime';
    $('#kayitDurum').textContent = 'Kaydediliyor…';
    clearTimeout(zaman);
    zaman = setTimeout(function(){
      var c = oku('auc_cevap_'+D.sid, {}); c[q.id] = ta.value;
      var ok = yaz('auc_cevap_'+D.sid, c);
      $('#kayitDurum').textContent = ok ? 'Kaydedildi ✓' : 'Kaydedilemedi';
      var nb = document.querySelector('[data-git="'+D.idx+'"]'); if(nb) nb.classList.toggle('dolu', !!ta.value.trim());
      var n = L.filter(function(x){ return (c[x.id]||'').trim(); }).length;
      $('#ilerlemeMetin').textContent = n + ' / ' + L.length + ' cevaplandı';
      $('#ilerlemeCubuk').setAttribute('aria-valuenow', n);
      $('#ilerlemeCubuk i').style.width = (n/L.length*100) + '%';
    }, 400);
  });
  $('#onceki').onclick = function(){ git(D.idx-1); };
  $('#sonraki').onclick = function(){ git(D.idx+1); };
  $('#temizle').onclick = function(){
    if(!ta.value.trim() || confirm('Bu sorunun cevabı silinsin mi?')){
      var c = oku('auc_cevap_'+D.sid, {}); delete c[q.id]; yaz('auc_cevap_'+D.sid, c); ogrenciCiz(); $('#cevap').focus();
    }
  };
  $('#isaretle').onclick = function(){
    var a = oku('auc_isaret_'+D.sid, []), i = a.indexOf(q.id);
    if(i>-1) a.splice(i,1); else a.push(q.id);
    yaz('auc_isaret_'+D.sid, a); ogrenciCiz(); $('#isaretle').focus();
  };
  Array.prototype.forEach.call(document.querySelectorAll('[data-git]'), function(b){ b.onclick = function(){ git(+b.dataset.git); }; });
  zorBagla();
}
function zorBagla(){
  Array.prototype.forEach.call(document.querySelectorAll('[data-zor]'), function(b){
    b.onclick = function(){ cevapSakla(); D.ogrZor = b.dataset.zor; D.idx = 0; ogrenciCiz(); };
  });
}
function cevapSakla(){
  var ta = $('#cevap');
  if(ta){ var c = oku('auc_cevap_'+D.sid, {}), q = ogrListe()[D.idx]; if(q){ c[q.id] = ta.value; yaz('auc_cevap_'+D.sid, c); } }
}
function git(i){
  cevapSakla();
  D.idx = i; yaz('auc_konum_'+D.sid, i); ogrenciCiz();
  $('#soruMetin').scrollIntoView({block:'center'}); $('#cevap').focus({preventScroll:true});
}

/* ---------------- ÖĞRETMEN ---------------- */
function ogretmenCiz(){
  Array.prototype.forEach.call(document.querySelectorAll('[data-sekme]'), function(b){ b.setAttribute('aria-selected', b.dataset.sekme===D.sekme); });
  $('#havuzSekme').classList.toggle('gizli', D.sekme!=='havuz');
  $('#sinavSekme').classList.toggle('gizli', D.sekme!=='sinav');
  if(D.sekme==='havuz') havuzCiz(); else sinavCiz();
}

function filtreliHavuz(){
  var f = D.filtre, a = f.ara.toLocaleLowerCase('tr');
  return havuz().map(function(q,i){ q._no = i+1; return q; }).filter(function(q){
    return (!f.kat || q.k===f.kat) && (f.konu==='' || String(q.konu)===f.konu) && (!f.zor || q.zorluk===f.zor) &&
      (!a || (q.soru+' '+q.beceri+' '+q.deger).toLocaleLowerCase('tr').indexOf(a) > -1);
  });
}

function havuzCiz(){
  var m = meta();
  $('#fUnite').innerHTML = '<option>'+kac(m.unite)+'</option>';
  $('#fKat').innerHTML = '<option value="">Tüm kategoriler</option>' + Object.keys(KATEGORI).map(function(k){ return '<option value="'+k+'"'+(D.filtre.kat===k?' selected':'')+'>'+KATEGORI[k]+'</option>'; }).join('');
  $('#fKonu').innerHTML = '<option value="">Tüm konular</option>' + m.konular.map(function(k,i){ return '<option value="'+i+'"'+(D.filtre.konu===String(i)?' selected':'')+'>'+kac(k)+'</option>'; }).join('');
  $('#fZor').innerHTML = '<option value="">Tüm düzeyler</option>' + Object.keys(ZORLUK).map(function(k){ return '<option value="'+k+'"'+(D.filtre.zor===k?' selected':'')+'>'+ZORLUK[k]+'</option>'; }).join('');
  $('#fAra').value = D.filtre.ara;

  var L = filtreliHavuz(), tum = havuz();
  var sec = Object.keys(D.secili).filter(function(id){ return tum.some(function(q){ return q.id===id; }); });
  $('#seciliSayi').textContent = sec.length + ' soru seçili · havuzda ' + tum.length + ' soru';
  $('#opListe').innerHTML = L.length ? L.map(function(q){
    return '<article class="op-soru">'+
      '<div class="op-soru-ust"><input type="checkbox" data-sec="'+q.id+'" id="c-'+q.id+'"'+(D.secili[q.id]?' checked':'')+' aria-label="Soru '+q._no+' seç">'+
      '<div style="flex:1;min-width:0"><label for="c-'+q.id+'"><strong style="color:var(--sv)">'+q._no+'.</strong> '+zorlukRozet(q)+' <span class="rozet kat">'+kac(KATEGORI[q.k]||q.k)+'</span> <span class="rozet">'+toplamPuan(q)+' puan</span></label>'+
      '<p class="m">'+kac(q.soru)+'</p>'+
      '<dl class="bilgi-tablo"><dt>Ünite / Konu</dt><dd>'+kac(m.unite)+' — '+kac(m.konular[q.konu]||'')+'</dd>'+
      '<dt>Beceri</dt><dd>'+kac(q.beceri)+'</dd><dt>Değer</dt><dd>'+kac(q.deger)+'</dd>'+
      '<dt>Öğrenme çıktısı</dt><dd>'+kac(q.cikti)+(m.ciktilar[q.cikti]?' — '+kac(m.ciktilar[q.cikti]):'')+'</dd></dl>'+
      '<details class="anahtar"><summary><span class="msi">key</span> Cevap anahtarı ve puanlama</summary>'+anahtarHTML(q, toplamPuan(q))+'</details>'+
      '<div class="op-soru-arac"><button class="btn" data-duzenle="'+q.id+'"><span class="msi">edit</span> Düzenle</button>'+
      '<button class="btn" data-kopyala="'+q.id+'"><span class="msi">content_copy</span> Kopyala</button>'+
      '<button class="btn btn-tehlike" data-sil="'+q.id+'"><span class="msi">delete</span> Sil</button></div>'+
      '</div></div></article>';
  }).join('') : '<p class="bos">Bu filtreye uyan soru yok.</p>';
}

function anahtarHTML(q, hedefPuan){
  var ol = olcutOlcekle(q, hedefPuan);
  return '<p style="margin:6px 0 2px"><strong>Beklenen cevap</strong> <small>(anlamca doğru farklı ifadeler kabul edilir)</small></p>'+
    '<ul>'+q.cevap.map(function(c){ return '<li>'+kac(c)+'</li>'; }).join('')+'</ul>'+
    '<table class="olcut"><thead><tr><th>Puanlama ölçütü</th><th class="p">Puan</th></tr></thead><tbody>'+
    ol.map(function(o){ return '<tr><td>'+kac(o[0])+'</td><td class="p">'+o[1]+'</td></tr>'; }).join('')+
    '<tr><th>Toplam</th><th class="p">'+hedefPuan+'</th></tr></tbody></table>';
}
/* Sınavda sorunun puanı değişince ölçüt puanlarını orantılı dağıtır
   (yuvarlama farkı en büyük ölçüte eklenir; toplam her zaman tutar). */
function olcutOlcekle(q, hedef){
  var t = toplamPuan(q); if(!t || t===hedef) return q.olcut.map(function(o){ return [o[0], Number(o[1])]; });
  var r = q.olcut.map(function(o){ return [o[0], Math.round(o[1]*hedef/t)]; });
  var fark = hedef - r.reduce(function(a,o){ return a+o[1]; }, 0), en = 0;
  r.forEach(function(o,i){ if(o[1] > r[en][1]) en = i; }); r[en][1] += fark;
  return r;
}

/* ---- düzenleme formu ---- */
var duzenlenen = null;
function formAc(q){
  var m = meta();
  duzenlenen = q ? q.id : null;
  $('#dlgBaslik').textContent = q ? 'Soruyu düzenle' : 'Yeni soru ekle';
  q = q || {k:'bilgi', zorluk:'orta', konu:0, cikti:Object.keys(m.ciktilar)[0], beceri:BECERILER[0], deger:DEGERLER[D.sid][0], soru:'', cevap:[], olcut:[['',5],['',5]]};
  $('#dSoru').value = q.soru;
  $('#dKat').innerHTML = Object.keys(KATEGORI).map(function(k){ return '<option value="'+k+'"'+(q.k===k?' selected':'')+'>'+KATEGORI[k]+'</option>'; }).join('');
  $('#dZor').innerHTML = Object.keys(ZORLUK).map(function(k){ return '<option value="'+k+'"'+(q.zorluk===k?' selected':'')+'>'+ZORLUK[k]+'</option>'; }).join('');
  $('#dKonu').innerHTML = m.konular.map(function(k,i){ return '<option value="'+i+'"'+(q.konu===i?' selected':'')+'>'+kac(k)+'</option>'; }).join('');
  $('#dCikti').innerHTML = Object.keys(m.ciktilar).map(function(k){ return '<option value="'+k+'"'+(q.cikti===k?' selected':'')+'>'+k+' — '+kac(m.ciktilar[k])+'</option>'; }).join('');
  $('#dBeceri').innerHTML = BECERILER.map(function(b){ return '<option'+(q.beceri===b?' selected':'')+'>'+b+'</option>'; }).join('');
  var dg = DEGERLER[D.sid].slice(); if(dg.indexOf(q.deger)<0) dg.push(q.deger);
  $('#dDeger').innerHTML = dg.map(function(d){ return '<option'+(q.deger===d?' selected':'')+'>'+kac(d)+'</option>'; }).join('');
  $('#dCevap').value = q.cevap.join('\n');
  $('#dOlcut').innerHTML = ''; q.olcut.forEach(function(o){ olcutSatir(o[0], o[1]); });
  olcutToplam();
  $('#dlg').showModal(); $('#dSoru').focus();
}
function olcutSatir(ad, p){
  var d = document.createElement('div'); d.className = 'olcut-satir';
  d.innerHTML = '<input type="text" aria-label="Ölçüt" placeholder="Ölçüt (ör. Kavramı doğru açıklama)" value="'+kac(ad)+'"><input type="number" min="0" aria-label="Puan" value="'+(p||0)+'"><button type="button" class="btn btn-tehlike" aria-label="Ölçütü sil" style="padding:0;justify-content:center">×</button>';
  d.querySelector('button').onclick = function(){ d.remove(); olcutToplam(); };
  d.querySelector('input[type=number]').oninput = olcutToplam;
  $('#dOlcut').appendChild(d);
}
function olcutToplam(){
  var t = 0; Array.prototype.forEach.call(document.querySelectorAll('#dOlcut input[type=number]'), function(i){ t += Number(i.value)||0; });
  $('#dToplam').textContent = 'Toplam: ' + t + ' puan';
}
function formKaydet(e){
  e.preventDefault();
  var soru = $('#dSoru').value.trim();
  var olcut = Array.prototype.map.call(document.querySelectorAll('#dOlcut .olcut-satir'), function(s){
    return [s.querySelector('input[type=text]').value.trim(), Number(s.querySelector('input[type=number]').value)||0];
  }).filter(function(o){ return o[0]; });
  var cevap = $('#dCevap').value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
  if(!soru){ toast('Soru metni boş olamaz.'); return; }
  if(!olcut.length){ toast('En az bir puanlama ölçütü ekleyin.'); return; }
  if(!cevap.length){ toast('Beklenen cevabı yazın.'); return; }
  var q = { k:$('#dKat').value, zorluk:$('#dZor').value, konu:+$('#dKonu').value, cikti:$('#dCikti').value, beceri:$('#dBeceri').value, deger:$('#dDeger').value, soru:soru, cevap:cevap, olcut:olcut };
  var L = havuz();
  if(duzenlenen){ var i = L.findIndex(function(x){ return x.id===duzenlenen; }); q.id = duzenlenen; L[i] = q; }
  else { q.id = yeniId(D.sid); L.push(q); }
  havuzKaydet(L); $('#dlg').close(); havuzCiz(); toast(duzenlenen ? 'Soru güncellendi.' : 'Soru havuza eklendi (sona).');
}

/* ---------------- SINAV OLUŞTURUCU ---------------- */
function puanDagit(ogeler, toplam){
  var n = ogeler.length; if(!n) return;
  var taban = Math.floor(toplam/n), kalan = toplam - taban*n;
  ogeler.forEach(function(o,i){ o.puan = taban + (i < kalan ? 1 : 0); });
}
function sinavaEkle(idler){
  var s = sinavAl(), var_ = {};
  s.ogeler.forEach(function(o){ var_[o.id] = 1; });
  var eklenen = idler.filter(function(id){ return !var_[id]; });
  eklenen.forEach(function(id){ s.ogeler.push({id:id, puan:0}); });
  puanDagit(s.ogeler, 100); sinavKaydet(s);
  return eklenen.length;
}
function sinavSorulari(){
  var L = havuz(), s = sinavAl();
  return s.ogeler.map(function(o){ var q = L.find(function(x){ return x.id===o.id; }); return q ? {q:q, puan:Number(o.puan)||0} : null; }).filter(Boolean);
}
function sinavCiz(){
  var s = sinavAl(), S = sinavSorulari();
  $('#sOkul').value = s.okul; $('#sAd').value = s.ad; $('#sTarih').value = s.tarih;
  var top = S.reduce(function(a,x){ return a + x.puan; }, 0);
  $('#sToplam').textContent = 'Toplam: ' + top + ' puan';
  $('#sDagilim').textContent = S.length ? S.length + ' soru · ' + Object.keys(ZORLUK).map(function(k){
    return S.filter(function(x){ return x.q.zorluk===k; }).length + ' ' + ZORLUK[k].toLocaleLowerCase('tr');
  }).join(', ') : '';
  $('#sToplam').classList.toggle('hatali', top !== 100);
  $('#sToplamNot').textContent = top !== 100 && S.length ? '(Varsayılan toplam 100’dür; “Puanları eşit dağıt” ile düzeltebilirsiniz.)' : '';
  $('#sListe').innerHTML = S.length ? S.map(function(x,i){
    return '<div class="sinav-satir"><span class="sira">'+(i+1)+'</span><span class="metin">'+zorlukRozet(x.q)+' '+kac(x.q.soru)+'</span>'+
      '<label><span class="sr">Soru '+(i+1)+' puanı</span><input type="number" min="0" max="100" value="'+x.puan+'" data-puan="'+i+'"></label>'+
      '<span class="tus"><button class="btn" data-yukari="'+i+'" aria-label="Yukarı taşı"'+(i===0?' disabled':'')+'><span class="msi">arrow_upward</span></button>'+
      '<button class="btn" data-asagi="'+i+'" aria-label="Aşağı taşı"'+(i===S.length-1?' disabled':'')+'><span class="msi">arrow_downward</span></button>'+
      '<button class="btn btn-tehlike" data-cikar="'+i+'" aria-label="Sınavdan çıkar"><span class="msi">close</span></button></span></div>';
  }).join('') : '<p class="bos">Sınavda henüz soru yok. Soru Havuzu’ndan soru seçip “Sınava ekle”ye basın ya da aşağıdan otomatik seçim yapın.</p>';
  $('#sOnizleme').innerHTML = '';
}
function sinavAlanKaydet(){
  var s = sinavAl(); s.okul = $('#sOkul').value; s.ad = $('#sAd').value; s.tarih = $('#sTarih').value; sinavKaydet(s);
}
/* Verilen listeden, kategorilere dengeli dağılmış N soru seçer */
function dengeliSec(n, L){
  L = L || havuz();
  var gruplar = {};
  L.forEach(function(q){ (gruplar[q.k] = gruplar[q.k] || []).push(q); });
  Object.keys(gruplar).forEach(function(k){ gruplar[k].sort(function(){ return Math.random()-.5; }); });
  var anah = Object.keys(KATEGORI).filter(function(k){ return gruplar[k]; }), sec = [], i = 0;
  while(sec.length < Math.min(n, L.length)){
    var g = gruplar[anah[i % anah.length]]; if(g.length) sec.push(g.shift()); i++;
  }
  return sec.map(function(q){ return q.id; });
}
/* Kolay → orta → zor sırasıyla, her düzeyde kategorilere dengeli seçim */
function zorlukluSec(adet){
  var L = havuz(), sec = [];
  Object.keys(ZORLUK).forEach(function(z){
    sec = sec.concat(dengeliSec(adet[z]||0, L.filter(function(q){ return q.zorluk===z; })));
  });
  return sec;
}

/* =====================================================================
   BASKI / PDF / WORD
   ===================================================================== */
function ustBilgi(baslik){
  var m = meta(), s = sinavAl();
  return '<h1>'+kac(s.okul || 'T.C. Millî Eğitim Bakanlığı')+'</h1>'+
    '<p class="kagit-alt"><strong>'+kac(baslik)+'</strong><br>'+m.sinif+'. Sınıf Din Kültürü ve Ahlak Bilgisi · '+kac(m.unite)+(s.tarih?' · '+kac(s.tarih):'')+'</p>';
}
function sinavKagidi(){
  var S = sinavSorulari(), s = sinavAl();
  return '<div class="kagit">'+ustBilgi(s.ad || 'Yazılı Sınav')+
    '<div class="ogr-bilgi"><span>Adı Soyadı: ………………………………</span><span>Sınıfı / No: …………</span><span>Puan: ………… / '+S.reduce(function(a,x){return a+x.puan;},0)+'</span></div>'+
    S.map(function(x,i){
      var satir = Math.max(4, Math.min(10, Math.round(x.puan/2)+2)), b = '';
      for(var j=0;j<satir;j++) b += '<div class="k-bosluk"></div>';
      return '<div class="k-soru"><span class="k-puan">('+x.puan+' puan)</span><p><strong>'+(i+1)+'.</strong> '+kac(x.q.soru)+'</p>'+b+'</div>';
    }).join('')+
    '<p style="text-align:right;margin-top:16px">Başarılar dilerim.<br><strong>'+kac(s.ogretmen||'')+'</strong><br>Din Kültürü ve Ahlak Bilgisi Öğretmeni</p></div>';
}
function sinavAnahtari(){
  var S = sinavSorulari(), s = sinavAl();
  return '<div class="kagit">'+ustBilgi((s.ad || 'Yazılı Sınav') + ' — Cevap Anahtarı ve Dereceli Puanlama')+
    S.map(function(x,i){ return '<div class="k-soru"><span class="k-puan">('+x.puan+' puan)</span><p><strong>'+(i+1)+'.</strong> '+kac(x.q.soru)+'</p>'+(x.q.zorluk?'<p class="k-meta">Zorluk: '+ZORLUK[x.q.zorluk]+'</p>':'')+anahtarHTML(x.q, x.puan)+'</div>'; }).join('')+'</div>';
}
function havuzKagidi(liste, anahtarli){
  var m = meta();
  return '<div class="kagit">'+ustBilgi('Açık Uçlu Soru Havuzu'+(anahtarli?' — Cevap Anahtarlı':''))+
    liste.map(function(q){
      return '<div class="k-soru"><span class="k-puan">('+toplamPuan(q)+' puan)</span><p><strong>'+q._no+'.</strong> '+kac(q.soru)+'</p>'+
        '<p class="k-meta">'+(q.zorluk?ZORLUK[q.zorluk]+' · ':'')+kac(KATEGORI[q.k])+' · Konu: '+kac(m.konular[q.konu]||'')+' · Beceri: '+kac(q.beceri)+' · Değer: '+kac(q.deger)+' · '+kac(q.cikti)+'</p>'+
        (anahtarli ? anahtarHTML(q, toplamPuan(q)) : '<div class="k-bosluk"></div><div class="k-bosluk"></div><div class="k-bosluk"></div><div class="k-bosluk"></div>')+'</div>';
    }).join('')+'</div>';
}
function yazdir(html, pdf){
  $('#baski').innerHTML = html;
  if(pdf) toast('Açılan pencerede Hedef olarak “PDF olarak kaydet”i seçin.');
  setTimeout(function(){ window.print(); }, pdf ? 400 : 50);
}
function wordIndir(html, ad){
  var css = Array.prototype.map.call(document.styleSheets, function(ss){
    try{ return Array.prototype.map.call(ss.cssRules, function(r){ return r.selectorText && /\.kagit|table\.olcut/.test(r.selectorText) ? r.cssText : ''; }).join('\n'); }catch(e){ return ''; }
  }).join('\n');
  var belge = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>'+kac(ad)+'</title><style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt}'+css+'</style></head><body>'+html+'</body></html>';
  var blob = new Blob(['﻿', belge], {type:'application/msword'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = ad.replace(/[\\/:*?"<>|]/g,'') + '.doc';
  document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function seciliListe(){
  var L = havuz().map(function(q,i){ q._no = i+1; return q; });
  var s = L.filter(function(q){ return D.secili[q.id]; });
  return s.length ? s : null;
}
function cikti(tur, anahtarli){
  var liste = seciliListe();
  if(!liste){ if(!confirm('Seçili soru yok. Havuzdaki tüm sorular ('+havuz().length+') kullanılsın mı?')) return; liste = havuz().map(function(q,i){ q._no=i+1; return q; }); }
  var html = havuzKagidi(liste, anahtarli), ad = meta().sinif+'-sinif-acik-uclu-'+(anahtarli?'cevap-anahtarli':'sorular');
  if(tur==='word') wordIndir(html, ad); else yazdir(html, tur==='pdf');
}

/* =====================================================================
   OLAYLAR
   ===================================================================== */
function baglan(){
  SINIFLAR.forEach(function(s){
    var b = $('#kart-'+s); if(!b) return;
    b.onclick = function(){ D.sid = s; D.idx = oku('auc_konum_'+s, 0)||0; D.secili = {}; urlGuncelle(); ciz(); };
  });
  $('#modOgrenci').onclick = function(){ D.mod='ogrenci'; urlGuncelle(); ciz(); };
  $('#modOgretmen').onclick = function(){ D.mod='ogretmen'; urlGuncelle(); ciz(); };
  $('#temaDugme').onclick = function(){
    var t = document.documentElement.getAttribute('data-tema')==='dark' ? 'light' : 'dark';
    temaUygula(t); try{ localStorage.setItem('dkab_tema', t); }catch(e){}
  };
  Array.prototype.forEach.call(document.querySelectorAll('[data-sekme]'), function(b){ b.onclick = function(){ D.sekme = b.dataset.sekme; ogretmenCiz(); }; });

  $('#fKat').onchange = function(){ D.filtre.kat = this.value; havuzCiz(); };
  $('#fKonu').onchange = function(){ D.filtre.konu = this.value; havuzCiz(); };
  $('#fZor').onchange = function(){ D.filtre.zor = this.value; havuzCiz(); };
  $('#fAra').oninput = function(){ D.filtre.ara = this.value; havuzCiz(); $('#fAra').focus(); };

  $('#opListe').addEventListener('change', function(e){
    var id = e.target.dataset.sec; if(!id) return;
    if(e.target.checked) D.secili[id] = 1; else delete D.secili[id];
    $('#seciliSayi').textContent = Object.keys(D.secili).length + ' soru seçili · havuzda ' + havuz().length + ' soru';
  });
  $('#opListe').addEventListener('click', function(e){
    var b = e.target.closest('button'); if(!b) return;
    var L = havuz(), id, i;
    if((id = b.dataset.duzenle)){ formAc(L.find(function(q){ return q.id===id; })); }
    else if((id = b.dataset.kopyala)){
      i = L.findIndex(function(q){ return q.id===id; });
      var k = JSON.parse(JSON.stringify(L[i])); k.id = yeniId(D.sid); L.splice(i+1, 0, k);
      havuzKaydet(L); havuzCiz(); toast('Soru kopyalandı ('+(i+2)+'. sıraya). Kopyayı düzenleyebilirsiniz.');
    }
    else if((id = b.dataset.sil)){
      i = L.findIndex(function(q){ return q.id===id; });
      if(confirm((i+1)+'. soru havuzdan silinsin mi? (“Varsayılan havuza dön” ile geri alınabilir.)')){
        L.splice(i,1); delete D.secili[id]; havuzKaydet(L);
        var s = sinavAl(); s.ogeler = s.ogeler.filter(function(o){ return o.id!==id; }); sinavKaydet(s);
        havuzCiz(); toast('Soru silindi.');
      }
    }
  });
  $('#tumunuSec').onclick = function(){ filtreliHavuz().forEach(function(q){ D.secili[q.id]=1; }); havuzCiz(); };
  $('#secimTemizle').onclick = function(){ D.secili = {}; havuzCiz(); };
  $('#yeniSoru').onclick = function(){ formAc(null); };
  $('#varsayilan').onclick = function(){
    if(confirm('Bu sınıfta yaptığınız tüm ekleme, düzenleme ve silmeler geri alınıp hazır 50 soruluk havuza dönülsün mü?')){
      sil('auc_havuz_'+D.sid); D.secili = {}; var s = sinavAl(), L = havuz();
      s.ogeler = s.ogeler.filter(function(o){ return L.some(function(q){ return q.id===o.id; }); }); sinavKaydet(s);
      havuzCiz(); toast('Varsayılan havuz yüklendi.');
    }
  };
  $('#yazSoru').onclick = function(){ cikti('yazdir', false); };
  $('#yazAnahtar').onclick = function(){ cikti('yazdir', true); };
  $('#pdfAl').onclick = function(){ cikti('pdf', $('#ciktiAnahtar').checked); };
  $('#wordAl').onclick = function(){ cikti('word', $('#ciktiAnahtar').checked); };
  $('#sinavaEkle').onclick = function(){
    var id = Object.keys(D.secili); if(!id.length){ toast('Önce soru seçin.'); return; }
    var n = sinavaEkle(id); toast(n + ' soru sınava eklendi; puanlar 100 üzerinden eşit dağıtıldı.');
    D.sekme = 'sinav'; ogretmenCiz();
  };

  ['sOkul','sAd','sTarih'].forEach(function(id){ $('#'+id).oninput = sinavAlanKaydet; });
  $('#sListe').addEventListener('change', function(e){
    var i = e.target.dataset.puan; if(i==null) return;
    var s = sinavAl(); s.ogeler[+i].puan = Math.max(0, Number(e.target.value)||0); sinavKaydet(s); sinavCiz();
  });
  $('#sListe').addEventListener('click', function(e){
    var b = e.target.closest('button'); if(!b) return;
    var s = sinavAl(), o = s.ogeler, i;
    if(b.dataset.yukari!=null){ i=+b.dataset.yukari; o.splice(i-1,0,o.splice(i,1)[0]); }
    else if(b.dataset.asagi!=null){ i=+b.dataset.asagi; o.splice(i+1,0,o.splice(i,1)[0]); }
    else if(b.dataset.cikar!=null){ o.splice(+b.dataset.cikar,1); }
    else return;
    sinavKaydet(s); sinavCiz();
  });
  $('#sEsit').onclick = function(){ var s = sinavAl(); puanDagit(s.ogeler, 100); sinavKaydet(s); sinavCiz(); };
  ['sKolay','sOrta','sZor'].forEach(function(id){ $('#'+id).oninput = sayiGoster; });
  function zorlukAdet(){
    var a = { kolay:Number($('#sKolay').value)||0, orta:Number($('#sOrta').value)||0, zor:Number($('#sZor').value)||0 };
    Object.keys(a).forEach(function(z){ a[z] = Math.max(0, Math.min(a[z], havuz().filter(function(q){ return q.zorluk===z; }).length)); });
    return a;
  }
  function sayiGoster(){ var a = zorlukAdet(); $('#sSayi').textContent = (a.kolay+a.orta+a.zor) + ' soru'; }
  sayiGoster();
  $('#sOtomatik').onclick = function(){
    var a = zorlukAdet(), n = a.kolay + a.orta + a.zor;
    if(!n){ toast('En az bir düzeyde soru sayısı girin.'); return; }
    if(sinavAl().ogeler.length && !confirm('Mevcut sınav listesi silinip havuzdan '+n+' soru seçilsin mi?')) return;
    var s = sinavAl(); s.ogeler = []; sinavKaydet(s); sinavaEkle(zorlukluSec(a)); sinavCiz();
    toast(a.kolay+' kolay, '+a.orta+' orta, '+a.zor+' zor soru seçildi (kolaydan zora sıralı).');
  };
  $('#sTemizle').onclick = function(){ if(confirm('Sınavdaki tüm sorular çıkarılsın mı?')){ var s = sinavAl(); s.ogeler = []; sinavKaydet(s); sinavCiz(); } };
  function bos(){ if(!sinavSorulari().length){ toast('Sınavda soru yok.'); return true; } }
  $('#sOnizle').onclick = function(){ if(bos()) return; $('#sOnizleme').innerHTML = sinavKagidi(); $('#sOnizleme').scrollIntoView({behavior:'smooth'}); };
  $('#sOnizleAnahtar').onclick = function(){ if(bos()) return; $('#sOnizleme').innerHTML = sinavAnahtari(); $('#sOnizleme').scrollIntoView({behavior:'smooth'}); };
  $('#sYazOgr').onclick = function(){ if(!bos()) yazdir(sinavKagidi()); };
  $('#sYazAnahtar').onclick = function(){ if(!bos()) yazdir(sinavAnahtari()); };
  $('#sPdf').onclick = function(){ if(!bos()) yazdir(sinavKagidi() + '<div class="sayfa-sonu"></div>' + sinavAnahtari(), true); };
  $('#sWordOgr').onclick = function(){ if(!bos()) wordIndir(sinavKagidi(), meta().sinif+'-sinif-yazili-ogrenci-kagidi'); };
  $('#sWordAnahtar').onclick = function(){ if(!bos()) wordIndir(sinavAnahtari(), meta().sinif+'-sinif-yazili-cevap-anahtari'); };

  $('#dForm').onsubmit = formKaydet;
  $('#dOlcutEkle').onclick = function(){ olcutSatir('', 2); olcutToplam(); };
  $('#dIptal').onclick = function(){ $('#dlg').close(); };
}
function urlGuncelle(){
  try{ history.replaceState(null, '', '?sinif='+D.sid.slice(1)+(D.mod==='ogretmen'?'&mod=ogretmen':'')); }catch(e){}
}

/* ---------- başlat ---------- */
function baslat(){
  var p = new URLSearchParams(location.search), s = 's' + (p.get('sinif')||'9');
  D.sid = VERI[s] ? s : 's9';
  D.mod = p.get('mod')==='ogretmen' ? 'ogretmen' : 'ogrenci';
  D.idx = oku('auc_konum_'+D.sid, 0) || 0;
  var t = null; try{ t = localStorage.getItem('dkab_tema'); }catch(e){}
  temaUygula(t || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  baglan(); ciz();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', baslat); else baslat();

/* test erişimi */
window.AUC = { D:D, havuz:havuz, olcutOlcekle:olcutOlcekle, dengeliSec:dengeliSec, zorlukluSec:zorlukluSec, sinavSorulari:sinavSorulari, sinavKagidi:sinavKagidi, sinavAnahtari:sinavAnahtari };
})();
