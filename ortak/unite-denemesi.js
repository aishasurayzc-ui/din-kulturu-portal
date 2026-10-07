/* =====================================================================
   ÜNİTE DENEMESİ — konunun başında “ön değerlendirme / hazırbulunuşluk” denemesi
   ---------------------------------------------------------------------
   Modülerdir: Her ünite kendi soru verisini hazırlar ve şöyle çağırır:

     UniteDenemesi.kur({
       kap: '#deneme',                 // denemenin çizileceği kutu
       anahtar: 'dk11-u1-deneme',      // cihazdaki kayıt anahtarı (ünite başına tekil)
       ust: 'Konuya başlamadan önce',
       baslik: 'Ayet – Hadis – Kavram Denemesi',
       secenekSayisi: 3, toplamPuan: 100,
       konuHedef: '#giris',            // “Konuya Geç →” düğmesinin gideceği yer
       konuAdi: 'Kader, İrade ve Sorumluluk',
       sorular: [ { tur:'Ayet'|'Hadis', metin, kaynak, dogru, yanlislar:[…], aciklama } ]
                // ya da function(N){ … } → her denemede yeni bir soru seti döndürür
     });

   - yanlislar: en yakından en uzağa sıralı çeldirici adayları; ilk (secenekSayisi-1)
     tanesi kullanılır. Doğru cevap ve şık sırası her denemede karıştırılır.
   - Deneme konu içeriğinin yerine geçmez; yalnızca konunun başında durur.
   - Sayfanın renk değişkenlerini (--vurgu, --altin, --dogru …) kullanır.
   ===================================================================== */
(function(){
'use strict';
function $(s,r){ return (r||document).querySelector(s); }
function e(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function karistir(a){ var b=a.slice(); for(var i=b.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=b[i]; b[i]=b[j]; b[j]=t; } return b; }
var HARF='ABCDE';

function kur(o){
  var kap = typeof o.kap==='string' ? $(o.kap) : o.kap; if(!kap) return;
  /* o.sorular bir dizi ya da her denemede yeni set üreten bir işlev olabilir: function(N){ return [...]; } */
  var N = o.soruSayisi || (Array.isArray(o.sorular) ? o.sorular.length : 50), SS = o.secenekSayisi||3, TP = o.toplamPuan||100, birim = TP/N;
  function oku(k,v){ try{ var x=localStorage.getItem(o.anahtar+'-'+k); return x===null?v:JSON.parse(x); }catch(err){ return v; } }
  function yaz(k,v){ try{ localStorage.setItem(o.anahtar+'-'+k, JSON.stringify(v)); }catch(err){} }
  function sil(k){ try{ localStorage.removeItem(o.anahtar+'-'+k); }catch(err){} }
  var d = oku('durum', null);     /* { sira:[…], secenek:[[…]], cevap:{}, i } */
  var durum = 'giris';
  /* Soru ya da seçenek sayısı değiştiyse yarım kalan eski deneme geçersiz sayılır. */
  if(d && d.sorular && d.sorular.length===N && d.secenek && d.secenek[0] && d.secenek[0].length===SS && Object.keys(d.cevap).length<N) durum='devam';
  else if(d) { d=null; sil('durum'); }

  function yeniDeneme(){
    var liste = (typeof o.sorular==='function' ? o.sorular(N) : karistir(o.sorular)).slice(0,N);
    /* Doğru cevabın harfi A–E arasında eşit dağılır (50 soru × 5 seçenek → her harften 10). */
    var poz=[]; for(var i=0;i<liste.length;i++) poz.push(i%SS); poz=karistir(poz);
    d = { cevap:{}, i:0,
          sorular: liste.map(function(s){ return { tur:s.tur, metin:s.metin, kaynak:s.kaynak, dogru:s.dogru, aciklama:s.aciklama||'' }; }),
          secenek: liste.map(function(s,k){ var y=karistir(s.yanlislar.slice(0,SS-1)); y.splice(poz[k],0,s.dogru); return y; }) };
    yaz('durum', d);
  }
  function puan(){ var p=0; d.sorular.forEach(function(s,k){ if(d.cevap[k]===s.dogru) p++; }); return p; }

  function girisCiz(){
    var son = oku('son', null);
    kap.innerHTML = '<div class="ud-kart ud-giris">'+
      '<span class="ud-ust">📝 '+e(o.ust||'Konuya başlamadan önce')+'</span>'+
      '<h2 class="ud-baslik">'+e(o.baslik)+'</h2>'+
      '<div class="ud-ozellik"><span><b>'+N+'</b> soruluk deneme</span><span><b>'+SS+'</b> seçenek</span><span><b>'+TP+'</b> puan</span></div>'+
      '<p class="ud-aciklama">'+e(o.aciklama||'Bu konudaki kavramları ne kadar biliyorsun? Her soruda bir ayet ya da hadis var; ait olduğu kavramı seç. Sonuç ekranında doğru cevapları ve açıklamalarını görebilirsin.')+'</p>'+
      (son ? '<p class="ud-son">Son denemen: <b>'+son.puan+' / '+TP+'</b> ('+son.dogru+' doğru) · '+new Date(son.t).toLocaleDateString('tr-TR')+'</p>' : '')+
      '<div class="ud-dugmeler">'+
        (durum==='devam' ? '<button class="btn" type="button" data-ud="devam">▶ Denemeye devam et ('+Object.keys(d.cevap).length+'/'+N+')</button><button class="btn ikincil" type="button" data-ud="basla">Baştan başla</button>'
                         : '<button class="btn ud-buyuk" type="button" data-ud="basla">DENEMEYE BAŞLA</button>')+
        '<a class="ud-gec" href="'+e(o.konuHedef)+'" data-ud="atla">Denemeyi atla, konuya geç ↓</a>'+
      '</div></div>';
  }
  function soruCiz(){
    var k=d.i, s=d.sorular[k], sec=d.secenek[k], ver=d.cevap[k], cevaplanan=Object.keys(d.cevap).length;
    kap.innerHTML = '<div class="ud-kart">'+
      '<div class="ud-ilerleme"><div class="ud-ilerleme-yazi"><span>Soru <b>'+(k+1)+'</b> / '+N+'</span><span>'+cevaplanan+' cevaplandı</span></div>'+
        '<div class="ud-cubuk" aria-hidden="true"><span style="width:'+(cevaplanan*100/N)+'%"></span></div></div>'+
      '<div class="ud-metin '+(s.tur==='Hadis'?'hadis':'')+'"><div class="ud-metin-ust"><span class="ud-rozet">'+(s.tur==='Hadis'?'💬 HADİS':'📜 AYET')+'</span><span class="ud-kay">'+e(s.kaynak)+'</span></div>'+
        '<p class="ud-m">“'+e(s.metin)+'”</p></div>'+
      '<p class="ud-soru">'+(k+1)+'. Bu '+(s.tur==='Hadis'?'hadis':'ayet')+' hangi kavrama aittir?</p>'+
      '<div class="ud-secenekler" role="radiogroup" aria-label="Seçenekler">'+sec.map(function(x,i){
        return '<button type="button" class="ud-sec'+(ver===x?' sec':'')+'" role="radio" aria-checked="'+(ver===x)+'" data-sec="'+i+'"><b>'+HARF[i]+')</b> '+e(x)+'</button>'; }).join('')+'</div>'+
      '<div class="ud-gezinti"><button class="btn ikincil" type="button" data-ud="geri"'+(k===0?' disabled':'')+'>← Önceki</button>'+
        (k<N-1 ? '<button class="btn" type="button" data-ud="ileri">Sonraki →</button>' : '<button class="btn" type="button" data-ud="bitir">Denemeyi bitir</button>')+'</div>'+
      (cevaplanan===N && k<N-1 ? '<p class="ud-not">Bütün soruları cevapladın. <button class="ud-link" type="button" data-ud="bitir">Denemeyi bitir →</button></p>' : '')+
    '</div>';
  }
  function sonucCiz(){
    var dogru=puan(), p=Math.round(dogru*birim*10)/10, bos=N-Object.keys(d.cevap).length;
    yaz('son', { puan:p, dogru:dogru, t:Date.now() });
    var kv={}; d.sorular.forEach(function(s,k){ var x=kv[s.dogru]=kv[s.dogru]||{d:0,t:0}; x.t++; if(d.cevap[k]===s.dogru) x.d++; });
    var yanlis = d.sorular.map(function(s,k){ return {s:s, v:d.cevap[k]}; }).filter(function(x){ return x.v!==x.s.dogru; });
    var yorum = p>=85 ? 'Bu konunun kavramlarına oldukça hâkimsin. Konuyu okurken ayrıntılara ve kavramlar arasındaki ince farklara odaklan.' :
                p>=60 ? 'Kavramların çoğunu tanıyorsun. Aşağıdaki “gözden geçir” kavramlarına konu içinde özellikle dikkat et.' :
                'Bu konu senin için yeni kavramlar içeriyor; çok doğal. Konuyu öğrendikten sonra denemeyi yeniden çöz ve farkı gör.';
    kap.innerHTML = '<div class="ud-kart ud-sonuc">'+
      '<span class="ud-ust">🏆 Deneme sonucu</span>'+
      '<div class="ud-puan"><span class="ud-puan-sayi">'+p+'</span><span class="ud-puan-max">/ '+TP+'</span></div>'+
      '<p class="ud-ozet">'+dogru+' doğru · '+(N-dogru-bos)+' yanlış'+(bos?' · '+bos+' boş':'')+'</p>'+
      '<p class="ud-aciklama">'+yorum+'</p>'+
      '<div class="ud-dugmeler"><a class="btn ud-buyuk" href="'+e(o.konuHedef)+'" data-ud="konuya">Konuya Geç →</a></div>'+
      '<h3 class="ud-alt">Kavramlara göre durumun</h3><div class="ud-kavramlar">'+Object.keys(kv).sort(function(a,b){ return kv[a].d/kv[a].t - kv[b].d/kv[b].t; }).map(function(k){
        var x=kv[k], c = x.d===x.t?'d':x.d===0?'y':'o'; return '<span class="'+c+'">'+(c==='d'?'✓ ':c==='y'?'✗ ':'◐ ')+e(k)+' <small>'+x.d+'/'+x.t+'</small></span>'; }).join('')+'</div>'+
      (yanlis.length ? '<details class="ud-gozden"><summary>Yanlış ve boş bıraktığın '+yanlis.length+' soruyu gözden geçir</summary><ol>'+yanlis.map(function(x){
        return '<li><p class="ud-gm">“'+e(x.s.metin)+'” <span>— '+e(x.s.kaynak)+'</span></p><p><b>Doğru kavram: '+e(x.s.dogru)+'</b>'+(x.v?' · Senin cevabın: '+e(x.v):' · Boş')+'</p>'+(x.s.aciklama?'<p class="ud-acik">'+e(x.s.aciklama)+'</p>':'')+'</li>'; }).join('')+'</ol></details>' : '<p class="ud-not">Bütün soruları doğru cevapladın. 🎉</p>')+
      '<div class="ud-dugmeler"><button class="btn ikincil" type="button" data-ud="basla">Denemeyi yeniden çöz</button></div>'+
    '</div>';
    sil('durum'); durum='giris';
  }

  kap.addEventListener('click',function(ev){
    var b=ev.target.closest('[data-sec]');
    if(b){ var k=d.i; d.cevap[k]=d.secenek[k][+b.getAttribute('data-sec')]; yaz('durum',d);
      if(d.i<N-1){ soruCiz(); setTimeout(function(){ if(d && d.i===k && durum==='soru'){ d.i++; yaz('durum',d); soruCiz(); odak(); } },350); } else soruCiz();
      return; }
    var a=ev.target.closest('[data-ud]'); if(!a) return;
    var x=a.getAttribute('data-ud');
    if(x==='basla'){ yeniDeneme(); durum='soru'; soruCiz(); kapGor(); odak(); }
    else if(x==='devam'){ durum='soru'; var bos=0; while(bos<N && d.cevap[bos]!==undefined) bos++; d.i=Math.min(bos,N-1); soruCiz(); kapGor(); odak(); }
    else if(x==='geri'){ if(d.i>0){ d.i--; yaz('durum',d); soruCiz(); } }
    else if(x==='ileri'){ if(d.i<N-1){ d.i++; yaz('durum',d); soruCiz(); odak(); } }
    else if(x==='bitir'){
      var kalan=N-Object.keys(d.cevap).length;
      if(kalan && !window.confirm(kalan+' soru boş. Yine de denemeyi bitirmek istiyor musun?')) return;
      durum='sonuc'; sonucCiz(); kapGor();
    }
    else if(x==='konuya' || x==='atla'){
      /* Önce sonuç kutusu kısa giriş kartına döner, ardından konuya kaydırılır (yerleşim kaymasın). */
      if(x==='konuya') girisCiz();
      var h=$(o.konuHedef); if(h){ ev.preventDefault(); try{ history.replaceState(null,'',o.konuHedef); }catch(err){}
        h.scrollIntoView({behavior:'smooth',block:'start'}); }
    }
  });
  function kapGor(){ var r=kap.getBoundingClientRect(); if(r.top<0 || r.top>window.innerHeight*0.4) kap.scrollIntoView({behavior:'smooth',block:'start'}); }
  function odak(){ var f=$('.ud-sec',kap); if(f) f.focus({preventScroll:true}); }
  if(durum==='devam' || durum==='giris') girisCiz();
}
window.UniteDenemesi = { kur:kur };
})();
