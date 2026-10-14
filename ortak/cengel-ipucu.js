/* ——— Çengel Bulmaca Harf İpuçları (bütün sınıflar) ———
   Seçili sorunun cevabından 🔤 baştan, 💡 ortadan, 🎯 sondan bir harf açar;
   🧠 Anlam İpucu cevabı söylemeyen kısa bir açıklama gösterir.
   - Harf konumları cevaptan hesaplanır; açılan harf kilitlenir, sonraki ipuçlarında kapanmaz.
   - Bir ipucu kelimenin bütün harflerini açacaksa verilmez (son harfi öğrenci bulur).
   - Kelime doğru tamamlanınca bildirilir; bütün bulmaca bitince sayfanın kendi kontrolü çağrılır.
   Bağlantılar: ortak/oyun-merkezi.js omCengel* (oyun merkezleri) ve
   CengelIpucu.zincireBagla (6. sınıf ünite sayfalarındaki zincir bulmaca). */
(function(){
  const SESLI = 'AEIİOÖUÜ';

  /* Türkçe harfleri tek tek ayırır (Ç, Ğ, İ, I, Ö, Ş, Ü birer harf); şapkalı harfler düz yazılır. */
  function harfler(metin){
    return Array.from(String(metin == null ? '' : metin).toLocaleUpperCase('tr-TR')
      .replace(/Â/g,'A').replace(/Î/g,'İ').replace(/Û/g,'U').replace(/[^A-ZÇĞİÖŞÜ]/g,''));
  }

  /* tur: 'bas' | 'orta' | 'son'. acik[i]: i. harf zaten açık mı. Uygun konum yoksa -1. */
  function konum(tur, n, acik){
    acik = acik || [];
    if(n < 1) return -1;
    if(tur === 'bas') return 0;
    if(tur === 'son') return n > 1 ? n - 1 : -1;
    if(n < 3) return -1;
    const merkez = (n - 1) / 2, adaylar = [];
    for(let i = 1; i < n - 1; i++) adaylar.push(i);
    adaylar.sort((a, b) => Math.abs(a - merkez) - Math.abs(b - merkez) || a - b);
    /* Ortadaki harf açıksa merkeze en yakın kapalı iç harf seçilir */
    const kapali = adaylar.find(i => !acik[i]);
    return kapali === undefined ? adaylar[0] : kapali;
  }

  /* İpucu verilebilir mi? {i, neden}: neden boşsa i. harf açılabilir. */
  function degerlendir(tur, n, acik, kullanilan){
    if(kullanilan && kullanilan.has(tur)) return {i: -1, neden: 'kullanildi'};
    const i = konum(tur, n, acik);
    if(i < 0) return {i: -1, neden: 'kisa'};
    if(acik[i]) return {i: i, neden: 'acik'};
    const acikSayisi = acik.filter(Boolean).length;
    if(acikSayisi + 1 >= n) return {i: i, neden: 'son-harf'};
    return {i: i, neden: ''};
  }

  /* "V _ _ _ _" biçimi; boşluklar korunur. */
  function desen(metin, acik, harf){
    const parcalar = [];
    let j = 0;
    Array.from(String(metin).toLocaleUpperCase('tr-TR')).forEach(ch => {
      if(/\s/.test(ch)){ if(parcalar.length && parcalar[parcalar.length - 1] !== ' ') parcalar.push(' '); return; }
      if(!harfler(ch).length) return;
      parcalar.push(acik[j] ? harf[j] : '_'); j++;
    });
    return parcalar;
  }

  const DUGMELER = [
    {tur: 'bas',   ikon: '🔤', ad: 'Baştan İpucu'},
    {tur: 'orta',  ikon: '💡', ad: 'Ortadan İpucu'},
    {tur: 'son',   ikon: '🎯', ad: 'Sondan İpucu'},
    {tur: 'anlam', ikon: '🧠', ad: 'Anlam İpucu'}
  ];
  const HARF_ADI = {bas: 'İlk', orta: 'Ortadaki bir', son: 'Son'};
  const NEDEN = {
    kullanildi: 'Bu ipucunu bu soruda zaten kullandın. Başka bir ipucu dene!',
    kisa: 'Bu cevap çok kısa; bu konumda ayrı bir harf yok. Başka bir ipucu dene!',
    acik: 'Bu harf zaten açık. Başka bir ipucu dene!',
    'son-harf': 'Bu ipucu cevabın tamamını gösterirdi. Kalan harfi sen bul! 🙂'
  };

  function stilEkle(){
    if(document.getElementById('cip-stil')) return;
    const s = document.createElement('style');
    s.id = 'cip-stil';
    s.textContent = `
  .cip-cubuk{ max-width:680px; margin:12px auto 0; padding:10px 12px; background:#f1f8fc; border:2px solid var(--acik,#a9d6e5); border-radius:12px; color:#22333b; text-align:center; }
  .cip-ust{ display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:6px 10px; font-size:.9em; }
  .cip-etiket{ font-weight:bold; color:var(--mavi,#2a6f97); }
  .cip-desen{ display:inline-flex; flex-wrap:wrap; gap:3px; }
  .cip-desen span{ display:inline-flex; align-items:center; justify-content:center; min-width:22px; height:26px; padding:0 2px; border-bottom:2px solid #8aa; font-weight:bold; color:#8a97a0; box-sizing:border-box; }
  .cip-desen span.cip-harf{ background:#d0ebff; color:#1864ab; border:2px solid #74c0fc; border-radius:4px; }
  .cip-desen span.cip-bosluk{ min-width:10px; border:none; }
  .cip-dugmeler{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:8px; }
  .cip-dugme{ flex:1 1 140px; max-width:190px; min-height:44px; padding:8px 10px; border-radius:22px; border:2px solid; font:inherit; font-weight:bold; font-size:.9em; color:#22333b; cursor:pointer; }
  .cip-dugme.cip-bas{ background:#e7f5ff; border-color:var(--mavi,#2a6f97); }
  .cip-dugme.cip-orta{ background:#fff4e6; border-color:var(--sari,#f4a261); }
  .cip-dugme.cip-son{ background:#ebfbee; border-color:var(--yesil,#40916c); }
  .cip-dugme.cip-anlam{ background:#f3f0ff; border-color:#7950f2; }
  .cip-dugme.cip-pasif{ opacity:.45; }
  .cip-dugme:focus-visible{ outline:3px solid var(--mavi,#2a6f97); outline-offset:2px; }
  .cip-mesaj{ margin-top:8px; font-size:.88em; min-height:1.2em; }
  .cip-mesaj:empty{ display:none; }
  .cip-mesaj .cip-anlam-metni{ display:block; margin-top:4px; padding:6px 10px; background:#f3f0ff; border-radius:8px; text-align:left; }
  .cip-mesaj .cip-tamam{ color:var(--yesil,#40916c); font-weight:bold; }
  .cengel-girdi.cip-acik:not(.dogru):not(.yanlis){ background:#d0ebff; color:#1864ab; border-color:#74c0fc; }
  .cengel-girdi.cip-aktif:not(.dogru):not(.yanlis):not(.cip-acik){ background:#fff3bf; }
  .cengel-liste li.cip-li{ cursor:pointer; border:2px solid transparent; }
  .cengel-liste li.cip-secili{ border-color:var(--mavi,#2a6f97); background:#e7f5ff; }
  .cengel-liste li.cip-tamam{ background:#d8f3dc; }
  @media (max-width:480px){ .cip-dugme{ flex:1 1 calc(50% - 8px); font-size:.85em; } }`;
    document.head.appendChild(s);
  }

  /* Ortak ipucu çubuğu.
     ayar.kelimeler: [{etiket, metin, soru, sorular?, harfler, hucreler:[input]}] (harfler[i] ↔ hucreler[i])
     ayar.kok: çubuğun önüne ekleneceği öğe (soru listesi)
     ayar.aktif(): seçili kelime | null      ayar.harfAc(kelime, i): harfi yazar ve kilitler
     ayar.ipucuSayildi(kelime)  ayar.kelimeDurumu(kelime, tamam)  ayar.bitti()  ayar.tamamlandi() */
  function kur(onek, ayar){
    stilEkle();
    const eski = document.getElementById(onek + 'IpucuCubugu');
    if(eski) eski.remove();
    const cubuk = document.createElement('div');
    cubuk.className = 'cip-cubuk';
    cubuk.id = onek + 'IpucuCubugu';
    cubuk.setAttribute('role', 'group');
    cubuk.setAttribute('aria-label', 'Harf ipuçları');
    cubuk.innerHTML = '<div class="cip-ust"><span class="cip-etiket"></span><span class="cip-desen" aria-hidden="true"></span></div>' +
      '<div class="cip-dugmeler">' + DUGMELER.map(d =>
        `<button type="button" class="cip-dugme cip-${d.tur}" data-tur="${d.tur}">${d.ikon} ${d.ad}</button>`).join('') + '</div>' +
      '<div class="cip-mesaj" aria-live="polite"></div>';
    ayar.kok.parentNode.insertBefore(cubuk, ayar.kok);
    const etiketEl = cubuk.querySelector('.cip-etiket'), desenEl = cubuk.querySelector('.cip-desen'), mesajEl = cubuk.querySelector('.cip-mesaj');

    const durum = new Map();   /* kelime → {kullanilan:Set, anlam:string|null} */
    const tamamlar = new Set();
    let bildirildi = false, sonKelime = null;
    const d = k => { if(!durum.has(k)) durum.set(k, {kullanilan: new Set(), anlam: null}); return durum.get(k); };
    const acikDizi = k => k.hucreler.map(g => !!(g && g.readOnly));
    const dogruMu = k => k.hucreler.every((g, i) => g && (harfler(g.value)[0] || '') === k.harfler[i]);
    const mesaj = html => { mesajEl.innerHTML = html; };
    const kac = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

    function anlamMetni(k){
      const cevap = harfler(k.metin).join('');
      const diger = (k.sorular || []).filter(s => s && s !== k.soru && harfler(s).join('').indexOf(cevap) < 0);
      if(diger.length) return 'Başka bir açıdan: ' + diger[0];
      const hece = k.harfler.filter(h => SESLI.indexOf(h) >= 0).length;
      const sozcukler = String(k.soru || '').split(/[\s,;:.!?“”"'()…]+/)
        .filter(w => w.length > 3 && harfler(w).join('') !== cevap)
        .sort((a, b) => b.length - a.length).slice(0, 2);
      return `Bu kavram ${hece} heceli.` + (sozcukler.length ? ` Tanımdaki şu anahtar sözcüklere odaklan: “${sozcukler.join('”, “')}”.` : '') +
        ' Ünitede bu anlamla geçen kavramı hatırlamaya çalış.';
    }

    function guncelle(){
      const k = ayar.aktif();
      const bitti = !!(ayar.bitti && ayar.bitti());
      /* Doğru tamamlanan kelimeler */
      let yeni = null;
      ayar.kelimeler.forEach(x => {
        const t = dogruMu(x);
        if(ayar.kelimeDurumu) ayar.kelimeDurumu(x, t);
        if(t && !tamamlar.has(x)){ tamamlar.add(x); yeni = x; }
      });
      if(!k){
        etiketEl.textContent = '👆 İpucu için bulmacadan bir soru ya da kutu seç';
        desenEl.innerHTML = '';
      } else {
        etiketEl.textContent = `${k.etiket} (${k.harfler.length} harf):`;
        desenEl.innerHTML = desen(k.metin, acikDizi(k), k.harfler).map(p =>
          p === ' ' ? '<span class="cip-bosluk"></span>' : p === '_' ? '<span>_</span>' : `<span class="cip-harf">${kac(p)}</span>`).join('');
      }
      cubuk.querySelectorAll('.cip-dugme').forEach(b => {
        const tur = b.dataset.tur;
        let pasif = !k || bitti || dogruMu(k);
        if(!pasif && tur === 'anlam') pasif = d(k).kullanilan.has('anlam');
        else if(!pasif) pasif = !!degerlendir(tur, k.harfler.length, acikDizi(k), d(k).kullanilan).neden;
        b.classList.toggle('cip-pasif', pasif);
        b.setAttribute('aria-disabled', pasif ? 'true' : 'false');
      });
      if(k !== sonKelime){
        sonKelime = k;
        mesaj(k && d(k).anlam ? `<span class="cip-anlam-metni">🧠 ${kac(d(k).anlam)}</span>` : '');
      }
      if(yeni) mesaj(`<span class="cip-tamam">✅ Harika! ${kac(yeni.etiket)} doğru: ${kac(harfler(yeni.metin).join(''))}</span>`);
      if(!bitti && !bildirildi && ayar.kelimeler.length && ayar.kelimeler.every(dogruMu)){
        bildirildi = true;
        mesaj('<span class="cip-tamam">🎉 Bütün kelimeler doğru! Bulmacayı tamamladın.</span>');
        if(ayar.tamamlandi) ayar.tamamlandi();
        cubuk.querySelectorAll('.cip-dugme').forEach(b => { b.classList.add('cip-pasif'); b.setAttribute('aria-disabled', 'true'); });
      }
    }

    function ipucuVer(tur){
      const k = ayar.aktif();
      if(!k){ mesaj('👆 Önce bulmacadan bir soru ya da kutu seç.'); return; }
      if((ayar.bitti && ayar.bitti()) || bildirildi){ mesaj('Bulmaca tamamlandı. 🎉'); return; }
      if(dogruMu(k)){ mesaj('<span class="cip-tamam">Bu kelimeyi zaten doğru buldun! ✅</span>'); return; }
      const st = d(k);
      if(tur === 'anlam'){
        if(!st.anlam){ st.anlam = anlamMetni(k); st.kullanilan.add('anlam'); if(ayar.ipucuSayildi) ayar.ipucuSayildi(k); }
        sonKelime = null; guncelle();
        return;
      }
      const sonuc = degerlendir(tur, k.harfler.length, acikDizi(k), st.kullanilan);
      if(sonuc.neden){
        const ek = sonuc.neden === 'kisa' && k.harfler.length === 1 ? ' Tek harfli cevapta 🧠 Anlam İpucu\'nu kullan.' : '';
        mesaj(NEDEN[sonuc.neden] + ek); return;
      }
      ayar.harfAc(k, sonuc.i);
      st.kullanilan.add(tur);
      if(ayar.ipucuSayildi) ayar.ipucuSayildi(k);
      sonKelime = k;
      guncelle();
      if(bildirildi || dogruMu(k)) return;
      mesaj(`${DUGMELER.find(x => x.tur === tur).ikon} ${HARF_ADI[tur]} harf açıldı: <b>${kac(k.harfler[sonuc.i])}</b> (${sonuc.i + 1}. harf). Gerisini sen bul!` +
        (st.anlam ? `<span class="cip-anlam-metni">🧠 ${kac(st.anlam)}</span>` : ''));
      const bos = k.hucreler.find(g => g && !g.readOnly && (harfler(g.value)[0] || '') !== k.harfler[k.hucreler.indexOf(g)]);
      if(bos) bos.focus({preventScroll: true});
    }

    cubuk.querySelectorAll('.cip-dugme').forEach(b => { b.onclick = () => ipucuVer(b.dataset.tur); });
    const hucreler = new Set();
    ayar.kelimeler.forEach(k => k.hucreler.forEach(g => g && hucreler.add(g)));
    hucreler.forEach(g => {
      g.addEventListener('input', guncelle);
      g.addEventListener('focus', guncelle);
    });
    guncelle();
    return { guncelle: guncelle, ipucuVer: ipucuVer, cubuk: cubuk };
  }

  /* 6. sınıf ünite sayfalarındaki zincir çengel bulmaca (cengel6*Olustur) için bağlantı.
     yerlesimler: [{kelime, anlam, dir, hucreler:[{r,c}]}], girdiler: {"r,c": input} */
  function zincireBagla(onek, yerlesimler, minR, minC, girdiler, kontrolEt){
    const liste = document.getElementById(onek + 'Liste');
    if(!liste) return null;
    const lis = Array.from(liste.children);
    const sirali = [];
    const kelimeler = yerlesimler.map((p, idx) => {
      const hucreler = p.hucreler.map(h => girdiler[(h.r - minR) + ',' + (h.c - minC)]);
      hucreler.forEach(g => { if(g && sirali.indexOf(g) < 0) sirali.push(g); });
      return { etiket: `${idx + 1}. ${p.dir === 'right' ? 'Soldan sağa' : 'Yukarıdan aşağı'}`, metin: p.kelime, soru: p.anlam,
        harfler: harfler(p.kelime), hucreler: hucreler, li: lis[idx] };
    });
    let aktif = null;
    const sec = (k, odakla) => {
      aktif = k;
      Object.values(girdiler).forEach(g => g.classList.remove('cip-aktif'));
      if(k) k.hucreler.forEach(g => g && g.classList.add('cip-aktif'));
      kelimeler.forEach(x => x.li && x.li.classList.toggle('cip-secili', x === k));
      if(k && odakla){ const bos = k.hucreler.find(g => g && !g.readOnly && !g.value) || k.hucreler.find(g => g && !g.readOnly); if(bos) bos.focus({preventScroll: true}); }
      if(api) api.guncelle();
    };
    let api = null;
    kelimeler.forEach(k => {
      if(!k.li) return;
      k.li.classList.add('cip-li'); k.li.tabIndex = 0;
      k.li.addEventListener('click', () => sec(k, true));
      k.li.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); sec(k, true); } });
    });
    sirali.forEach((g, i) => {
      g.addEventListener('focus', () => { if(!aktif || aktif.hucreler.indexOf(g) < 0) sec(kelimeler.find(k => k.hucreler.indexOf(g) >= 0), false); });
      /* Sayfanın kendi geçişi ipucuyla kilitlenen kutuya giderse sonraki boş kutuya atlanır */
      g.addEventListener('input', () => {
        const odak = document.activeElement;
        let j = sirali.indexOf(odak);
        if(j < 0 || !odak.readOnly) return;
        while(j < sirali.length && sirali[j].readOnly) j++;
        if(j < sirali.length) sirali[j].focus();
      });
    });
    api = kur(onek, {
      kok: liste, kelimeler: kelimeler,
      aktif: () => aktif,
      harfAc: (k, i) => { const g = k.hucreler[i]; g.value = k.harfler[i]; g.readOnly = true; g.classList.remove('dogru', 'yanlis'); g.classList.add('cip-acik'); },
      kelimeDurumu: (k, tamam) => { if(k.li) k.li.classList.toggle('cip-tamam', tamam); },
      tamamlandi: () => { if(typeof kontrolEt === 'function') kontrolEt(); }
    });
    return api;
  }

  window.CengelIpucu = { harfler: harfler, konum: konum, degerlendir: degerlendir, desen: desen, kur: kur, zincireBagla: zincireBagla };
})();
