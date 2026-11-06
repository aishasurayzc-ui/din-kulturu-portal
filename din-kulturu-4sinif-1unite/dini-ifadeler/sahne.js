/* =====================================================================
   DİNÎ İFADELER MACERASI · ÇİZİM MOTORU (2026-11-06)
   Özgün çizgi karakterler ve sahneler SVG olarak üretilir; dış görsel yoktur.
   window.DIM_SAHNE.ciz(ad) -> <svg> metni
   window.DIM_SAHNE.baykus(ruh) -> rehber karakter "Bilge Baykuş"
   window.DIM_SAHNE.rozet(no) -> rozet çizimi
   ===================================================================== */
(function () {
  'use strict';
  var sayac = 0;
  function k(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- renkler ---------- */
  var TEN = ['#f6cfae', '#e9b48a', '#c98d62', '#f3d2b8', '#dca37a'];
  var SAC = { kahve: '#5b3a22', siyah: '#2b2324', sari: '#d9a441', kizil: '#a2502a', gri: '#b9bcc4', beyaz: '#eceff3' };

  /* ---------- karakter ---------- */
  /* o: x,y (ayak), s (ölçek), ten, sac, stil, ust, alt, yuz, poz, gozluk, biyik, takke, ortu */
  function insan(o) {
    o = o || {};
    var ten = o.ten || TEN[0], sac = o.sac || SAC.kahve, ust = o.ust || '#4dabf7', alt = o.alt || '#364fc7';
    var s = o.s || 1, stil = o.stil || 'kisa', yuz = o.yuz || 'mutlu', poz = o.poz || 'dur';
    var g = [];
    /* arka saç */
    if (stil === 'uzun') g.push('<path d="M-29,-104 Q-32,-62 -22,-58 L22,-58 Q32,-62 29,-104 Z" fill="' + sac + '"/>');
    if (stil === 'atkuyrugu') g.push('<path d="M22,-112 Q46,-108 40,-80 Q36,-70 30,-76 Q36,-92 20,-100 Z" fill="' + sac + '"/>');
    if (o.ortu) g.push('<path d="M-31,-104 Q-34,-60 -24,-52 L24,-52 Q34,-60 31,-104 Q30,-134 0,-134 Q-30,-134 -31,-104 Z" fill="' + o.ortu + '"/>');
    /* bacaklar ve ayakkabılar */
    if (poz !== 'gizli-bacak') {
      g.push('<rect x="-13" y="-36" width="10" height="34" rx="5" fill="' + alt + '"/><rect x="3" y="-36" width="10" height="34" rx="5" fill="' + alt + '"/>');
      g.push('<ellipse cx="-9" cy="-1" rx="9" ry="4.5" fill="#3d3a4b"/><ellipse cx="9" cy="-1" rx="9" ry="4.5" fill="#3d3a4b"/>');
    }
    /* gövde */
    g.push('<path d="M-20,-36 Q-22,-70 -12,-74 L12,-74 Q22,-70 20,-36 Z" fill="' + ust + '"/>');
    g.push('<path d="M-8,-74 Q0,-66 8,-74" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2"/>');
    /* kollar */
    var kol = {
      dur: [[-17, -68, -25, -52, -25, -38], [17, -68, 25, -52, 25, -38]],
      salla: [[-17, -68, -25, -52, -25, -38], [17, -68, 32, -84, 36, -104]],
      dua: [[-17, -68, -22, -52, -12, -64], [17, -68, 22, -52, 12, -64]],
      tut: [[-17, -68, -24, -54, -9, -54], [17, -68, 24, -54, 9, -54]],
      uzat: [[-17, -68, -25, -52, -25, -38], [17, -68, 34, -64, 50, -64]],
      isaret: [[-17, -68, -25, -52, -25, -38], [17, -68, 34, -82, 46, -98]],
      yanak: [[-17, -68, -30, -78, -20, -92], [17, -68, 30, -78, 20, -92]],
      sevinc: [[-17, -68, -32, -86, -34, -106], [17, -68, 32, -86, 34, -106]],
      bel: [[-17, -68, -30, -56, -19, -44], [17, -68, 30, -56, 19, -44]],
      agiz: [[-17, -68, -25, -52, -25, -38], [17, -68, 22, -80, 6, -88]]
    }[poz] || [[-17, -68, -25, -52, -25, -38], [17, -68, 25, -52, 25, -38]];
    kol.forEach(function (a) {
      g.push('<path d="M' + a[0] + ',' + a[1] + ' Q' + a[2] + ',' + a[3] + ' ' + a[4] + ',' + a[5] + '" fill="none" stroke="' + ust + '" stroke-width="9" stroke-linecap="round"/>');
      g.push('<circle cx="' + a[4] + '" cy="' + a[5] + '" r="5.5" fill="' + ten + '"/>');
    });
    /* boyun, kafa, kulak */
    g.push('<rect x="-5" y="-80" width="10" height="8" fill="' + ten + '"/>');
    g.push('<circle cx="-25" cy="-100" r="5" fill="' + ten + '"/><circle cx="25" cy="-100" r="5" fill="' + ten + '"/>');
    g.push('<circle cx="0" cy="-102" r="26" fill="' + ten + '"/>');
    /* ön saç */
    if (o.ortu) g.push('<path d="M-27,-104 Q-26,-126 0,-128 Q26,-126 27,-104 Q20,-118 0,-119 Q-20,-118 -27,-104 Z" fill="' + o.ortu + '"/>');
    else if (stil === 'kel') g.push('<path d="M-26,-100 Q-28,-112 -20,-112 Q-22,-104 -24,-96 Z M26,-100 Q28,-112 20,-112 Q22,-104 24,-96 Z" fill="' + sac + '"/>');
    else if (stil === 'kivircik') g.push('<g fill="' + sac + '"><circle cx="-18" cy="-118" r="10"/><circle cx="-4" cy="-126" r="11"/><circle cx="12" cy="-124" r="10"/><circle cx="23" cy="-112" r="8"/><circle cx="-25" cy="-106" r="7"/></g>');
    else if (stil === 'topuz') g.push('<path d="M-27,-100 Q-28,-130 0,-130 Q28,-130 27,-100 Q18,-120 0,-118 Q-18,-120 -27,-100 Z" fill="' + sac + '"/><circle cx="0" cy="-134" r="10" fill="' + sac + '"/>');
    else g.push('<path d="M-27,-98 Q-30,-132 0,-131 Q30,-132 27,-98 Q24,-114 10,-116 Q2,-108 -8,-116 Q-22,-114 -27,-98 Z" fill="' + sac + '"/>');
    if (o.takke) g.push('<path d="M-22,-120 Q0,-140 22,-120 Z" fill="' + o.takke + '"/>');
    /* yüz */
    var gz = '';
    if (yuz === 'mutlu') gz = '<path d="M-14,-103 Q-9,-109 -4,-103 M4,-103 Q9,-109 14,-103" fill="none" stroke="#2d2a32" stroke-width="2.6" stroke-linecap="round"/>';
    else if (yuz === 'hasta' || yuz === 'uykulu') gz = '<path d="M-14,-102 L-4,-102 M4,-102 L14,-102" stroke="#2d2a32" stroke-width="2.6" stroke-linecap="round"/>';
    else if (yuz === 'saskin') gz = '<circle cx="-9" cy="-104" r="4.6" fill="#2d2a32"/><circle cx="9" cy="-104" r="4.6" fill="#2d2a32"/><circle cx="-7.5" cy="-106" r="1.5" fill="#fff"/><circle cx="10.5" cy="-106" r="1.5" fill="#fff"/>';
    else gz = '<circle cx="-9" cy="-103" r="3.6" fill="#2d2a32"/><circle cx="9" cy="-103" r="3.6" fill="#2d2a32"/><circle cx="-8" cy="-104.5" r="1.2" fill="#fff"/><circle cx="10" cy="-104.5" r="1.2" fill="#fff"/>';
    g.push(gz);
    if (yuz === 'uzgun') g.push('<path d="M-15,-112 L-5,-109 M15,-112 L5,-109" stroke="#2d2a32" stroke-width="2" stroke-linecap="round"/>');
    g.push('<ellipse cx="-15" cy="-93" rx="5" ry="3" fill="#ff8fa3" opacity=".55"/><ellipse cx="15" cy="-93" rx="5" ry="3" fill="#ff8fa3" opacity=".55"/>');
    var ag = { mutlu: '<path d="M-8,-92 Q0,-83 8,-92 Z" fill="#c2255c"/>', gulumse: '<path d="M-6,-91 Q0,-86 6,-91" fill="none" stroke="#2d2a32" stroke-width="2.4" stroke-linecap="round"/>', uzgun: '<path d="M-6,-87 Q0,-92 6,-87" fill="none" stroke="#2d2a32" stroke-width="2.4" stroke-linecap="round"/>', saskin: '<ellipse cx="0" cy="-88" rx="4" ry="5" fill="#c2255c"/>', hasta: '<path d="M-6,-89 Q-3,-91 0,-89 Q3,-87 6,-89" fill="none" stroke="#2d2a32" stroke-width="2.2" stroke-linecap="round"/>', konus: '<ellipse cx="0" cy="-89" rx="5" ry="3.6" fill="#c2255c"/>', uykulu: '<path d="M-5,-89 Q0,-86 5,-89" fill="none" stroke="#2d2a32" stroke-width="2.2"/>' }[yuz] || '<path d="M-6,-91 Q0,-86 6,-91" fill="none" stroke="#2d2a32" stroke-width="2.4" stroke-linecap="round"/>';
    if (yuz === 'mutlu' && poz === 'agiz') ag = '<ellipse cx="0" cy="-89" rx="5" ry="3.6" fill="#c2255c"/>';
    g.push(ag);
    if (o.gozluk) g.push('<g fill="none" stroke="#3d3a4b" stroke-width="2"><circle cx="-9" cy="-103" r="7"/><circle cx="9" cy="-103" r="7"/><path d="M-2,-103 L2,-103"/></g>');
    if (o.biyik) g.push('<path d="M-10,-94 Q-5,-98 0,-95 Q5,-98 10,-94 Q5,-92 0,-93 Q-5,-92 -10,-94 Z" fill="' + o.biyik + '"/>');
    if (yuz === 'hasta') g.push('<path d="M-22,-118 Q0,-124 22,-118" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>');
    return '<g transform="translate(' + (o.x || 0) + ',' + (o.y || 0) + ') scale(' + s + ')">' + g.join('') + '</g>';
  }

  /* ---------- arka planlar ---------- */
  function zemin(tip, id) {
    var g = '';
    if (tip === 'ev' || tip === 'oda') {
      var duvar = tip === 'ev' ? '#fff0e0' : '#ede7ff';
      g = '<rect width="400" height="250" fill="' + duvar + '"/>' +
        '<g opacity=".35" fill="' + (tip === 'ev' ? '#ffd8a8' : '#d0bfff') + '"><circle cx="40" cy="30" r="3"/><circle cx="120" cy="60" r="3"/><circle cx="210" cy="24" r="3"/><circle cx="300" cy="58" r="3"/><circle cx="370" cy="26" r="3"/></g>' +
        '<rect y="196" width="400" height="54" fill="' + (tip === 'ev' ? '#e6b98a' : '#c9b6f0') + '"/><path d="M0,196 L400,196" stroke="rgba(0,0,0,.08)" stroke-width="4"/>' +
        '<g stroke="rgba(0,0,0,.06)" stroke-width="2"><path d="M60,196 L40,250 M160,196 L150,250 M260,196 L265,250 M350,196 L370,250"/></g>';
    } else if (tip === 'okul') {
      g = '<rect width="400" height="250" fill="#e3f2fd"/><rect x="40" y="26" width="200" height="96" rx="8" fill="#2f9e44" stroke="#a9744f" stroke-width="7"/>' +
        '<g stroke="#e9fbe9" stroke-width="3" fill="none" opacity=".75"><path d="M64,58 q14,-16 28,0 t28,0"/><circle cx="182" cy="70" r="16"/><path d="M70,96 L130,96"/></g>' +
        '<rect y="196" width="400" height="54" fill="#cfd8dc"/><g fill="#90caf9"><rect x="280" y="40" width="34" height="156" rx="4"/><rect x="320" y="40" width="34" height="156" rx="4"/></g><g fill="#64b5f6"><circle cx="306" cy="110" r="3"/><circle cx="346" cy="110" r="3"/></g>';
    } else if (tip === 'gece') {
      g = '<defs><linearGradient id="gk' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f5e"/><stop offset="1" stop-color="#4b3f9c"/></linearGradient></defs><rect width="400" height="250" fill="url(#gk' + id + ')"/>' +
        '<g fill="#fff8d6">' + [[40, 30, 2], [90, 60, 1.6], [150, 22, 2.2], [210, 52, 1.5], [270, 30, 2], [330, 70, 1.6], [370, 24, 2.2], [120, 100, 1.4], [240, 96, 1.6], [60, 120, 1.4], [350, 120, 1.5]].map(function (y) { return '<circle cx="' + y[0] + '" cy="' + y[1] + '" r="' + y[2] + '"><animate attributeName="opacity" values="1;.35;1" dur="' + (2 + y[2]) + 's" repeatCount="indefinite"/></circle>'; }).join('') + '</g>' +
        '<circle cx="320" cy="56" r="24" fill="#fff3bf"/><circle cx="331" cy="49" r="22" fill="#2a2a72"/>' +
        '<path d="M0,210 Q100,170 200,200 Q300,230 400,190 L400,250 L0,250 Z" fill="#2b8a3e"/><path d="M0,226 Q120,206 250,226 Q330,238 400,222 L400,250 L0,250 Z" fill="#237032"/>';
    } else {
      /* gündüz: bahçe, park, yol, cami */
      g = '<defs><linearGradient id="gk' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3ff"/><stop offset="1" stop-color="#dff3ff"/></linearGradient></defs><rect width="400" height="250" fill="url(#gk' + id + ')"/>' +
        gunes(52, 44) + bulut(150, 40, 1) + bulut(300, 62, .8);
      if (tip === 'cami') g += cami(250, 196, 1.1);
      g += '<path d="M0,170 Q90,140 190,165 Q300,190 400,150 L400,250 L0,250 Z" fill="#a9e34b"/>';
      if (tip === 'yol') g += '<path d="M0,214 L400,214 L400,250 L0,250 Z" fill="#868e96"/><g stroke="#fff" stroke-width="4" stroke-dasharray="22 18"><path d="M0,232 L400,232"/></g><path d="M0,196 L400,196 L400,214 L0,214 Z" fill="#8ce99a"/>';
      else g += '<path d="M0,196 Q200,184 400,196 L400,250 L0,250 Z" fill="#69db7c"/>';
    }
    return g;
  }

  /* ---------- nesneler ---------- */
  function gunes(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><g stroke="#ffd43b" stroke-width="4" stroke-linecap="round"><path d="M0,-30 L0,-38 M0,30 L0,38 M-30,0 L-38,0 M30,0 L38,0 M21,21 L27,27 M-21,-21 L-27,-27 M21,-21 L27,-27 M-21,21 L-27,27"/><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="30s" repeatCount="indefinite"/></g><circle r="22" fill="#ffd43b"/><circle r="22" fill="none" stroke="#fab005" stroke-width="3"/></g>'; }
  function bulut(x, y, s) { return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" fill="#fff"><ellipse cx="0" cy="0" rx="34" ry="14"/><circle cx="-14" cy="-8" r="14"/><circle cx="10" cy="-12" r="17"/><animateTransform attributeName="transform" type="translate" values="' + x + ',' + y + ';' + (x + 10) + ',' + y + ';' + x + ',' + y + '" dur="12s" repeatCount="indefinite" additive="replace"/></g>'; }
  function agac(x, y, s) { s = s || 1; return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><rect x="-6" y="-46" width="12" height="46" rx="4" fill="#a9744f"/><circle cx="0" cy="-62" r="28" fill="#40c057"/><circle cx="-18" cy="-52" r="18" fill="#37b24d"/><circle cx="18" cy="-54" r="18" fill="#51cf66"/></g>'; }
  function cicek(x, y, renk, s) { s = s || 1; return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M0,0 Q-2,-14 0,-26" stroke="#2f9e44" stroke-width="3" fill="none"/><ellipse cx="-7" cy="-12" rx="6" ry="3" fill="#40c057" transform="rotate(-30 -7 -12)"/><g fill="' + renk + '"><circle cx="0" cy="-36" r="6"/><circle cx="9" cy="-30" r="6"/><circle cx="-9" cy="-30" r="6"/><circle cx="6" cy="-21" r="6"/><circle cx="-6" cy="-21" r="6"/></g><circle cx="0" cy="-28" r="5" fill="#ffd43b"/></g>'; }
  function cami(x, y, s) { return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><rect x="-70" y="-60" width="140" height="60" fill="#f1f3f5"/><path d="M-46,-60 Q-46,-118 0,-118 Q46,-118 46,-60 Z" fill="#74c0fc"/><path d="M0,-118 L0,-130" stroke="#fab005" stroke-width="3"/><circle cx="0" cy="-134" r="4" fill="#fab005"/>' +
    '<rect x="78" y="-150" width="14" height="150" fill="#f1f3f5"/><path d="M76,-150 L85,-174 L94,-150 Z" fill="#74c0fc"/><rect x="74" y="-104" width="22" height="6" rx="2" fill="#dee2e6"/><path d="M85,-174 L85,-182" stroke="#fab005" stroke-width="2"/>' +
    '<g fill="#a5d8ff"><path d="M-54,-40 Q-54,-50 -46,-50 Q-38,-50 -38,-40 L-38,-20 L-54,-20 Z"/><path d="M38,-40 Q38,-50 46,-50 Q54,-50 54,-40 L54,-20 L38,-20 Z"/></g><path d="M-12,0 L-12,-30 Q0,-44 12,-30 L12,0 Z" fill="#1c7ed6"/></g>'; }
  function masa(x, y, w) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="' + (-w / 2) + '" y="0" width="' + w + '" height="12" rx="6" fill="#d9480f"/><rect x="' + (-w / 2 + 8) + '" y="12" width="' + (w - 16) + '" height="44" fill="#e8590c"/><path d="M' + (-w / 2 + 8) + ',22 L' + (w / 2 - 8) + ',22" stroke="#fff" stroke-width="5" stroke-dasharray="10 10" opacity=".55"/></g>'; }
  function tabak(x, y, dolu) {
    return '<g transform="translate(' + x + ',' + y + ')"><ellipse rx="22" ry="7" fill="#fff" stroke="#ced4da" stroke-width="2"/>' +
      (dolu ? '<ellipse cx="0" cy="-4" rx="14" ry="6" fill="#ffd8a8"/><circle cx="-6" cy="-7" r="3" fill="#2f9e44"/><circle cx="5" cy="-8" r="3" fill="#e03131"/><circle cx="0" cy="-5" r="2.5" fill="#f08c00"/>' + (dolu === 'buhar' ? '<g stroke="#adb5bd" stroke-width="2" fill="none" stroke-linecap="round"><path d="M-5,-14 q4,-6 0,-12"><animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></path><path d="M5,-14 q4,-6 0,-12"><animate attributeName="opacity" values="1;0;1" dur="2.4s" repeatCount="indefinite"/></path></g>' : '') : '<ellipse cx="0" cy="-1" rx="13" ry="4" fill="#f1f3f5"/>') + '</g>';
  }
  function bardak(x, y, renk) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-7,-20 L7,-20 L5,0 L-5,0 Z" fill="#e7f5ff" stroke="#a5d8ff" stroke-width="1.5"/><path d="M-6,-12 L6,-12 L5,0 L-5,0 Z" fill="' + (renk || '#ffa94d') + '"/></g>'; }
  function balon(x, y, w, metin, kuyruk) {
    kuyruk = kuyruk || 'sol';
    var kx = kuyruk === 'sol' ? x + 18 : x + w - 18;
    var kd = kuyruk === 'sol' ? 'M' + kx + ',' + (y + 34) + ' L' + (kx - 10) + ',' + (y + 50) + ' L' + (kx + 10) + ',' + (y + 34) : 'M' + kx + ',' + (y + 34) + ' L' + (kx + 10) + ',' + (y + 50) + ' L' + (kx - 10) + ',' + (y + 34);
    return '<g class="dim-balon"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="36" rx="18" fill="#fff" stroke="#495057" stroke-width="2"/><path d="' + kd + '" fill="#fff" stroke="#495057" stroke-width="2" stroke-linejoin="round"/><rect x="' + (kx - 11) + '" y="' + (y + 30) + '" width="22" height="6" fill="#fff"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + 24) + '" text-anchor="middle" font-family="Nunito,Segoe UI,sans-serif" font-weight="900" font-size="15" fill="#343a40">' + k(metin) + '</text></g>';
  }
  function dusunce(x, y, r, ic) { return '<g><circle cx="' + (x - r * .9) + '" cy="' + (y + r * 1.25) + '" r="4" fill="#fff" stroke="#adb5bd" stroke-width="1.5"/><circle cx="' + (x - r * .6) + '" cy="' + (y + r * 1.0) + '" r="6" fill="#fff" stroke="#adb5bd" stroke-width="1.5"/><ellipse cx="' + x + '" cy="' + y + '" rx="' + (r * 1.3) + '" ry="' + r + '" fill="#fff" stroke="#adb5bd" stroke-width="2"/>' + ic + '</g>'; }
  function yildiz(x, y, r, renk) { var p = []; for (var i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r; p.push((x + rr * Math.cos(a)).toFixed(1) + ',' + (y + rr * Math.sin(a)).toFixed(1)); } return '<polygon points="' + p.join(' ') + '" fill="' + (renk || '#ffd43b') + '"/>'; }
  function parilti(x, y, s) { return '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="#fcc419"><path d="M0,-10 L2.5,-2.5 L10,0 L2.5,2.5 L0,10 L-2.5,2.5 L-10,0 L-2.5,-2.5 Z"><animateTransform attributeName="transform" type="scale" values="1;.6;1" dur="1.8s" repeatCount="indefinite"/></path></g>'; }
  function kalp(x, y, s, renk) { return '<path transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" d="M0,6 C-10,-2 -10,-12 -4,-12 C-1,-12 0,-9 0,-8 C0,-9 1,-12 4,-12 C10,-12 10,-2 0,6 Z" fill="' + (renk || '#ff6b6b') + '"/>'; }
  function kitap(x, y, acik, renk) { renk = renk || '#4263eb'; return acik ? '<g transform="translate(' + x + ',' + y + ')"><path d="M0,0 Q-14,-6 -30,-2 L-30,-26 Q-14,-30 0,-24 Z" fill="#fff" stroke="' + renk + '" stroke-width="3"/><path d="M0,0 Q14,-6 30,-2 L30,-26 Q14,-30 0,-24 Z" fill="#fff" stroke="' + renk + '" stroke-width="3"/><g stroke="#ced4da" stroke-width="2"><path d="M-24,-18 L-6,-20 M-24,-11 L-6,-13 M6,-20 L24,-18 M6,-13 L24,-11"/></g></g>' : '<g transform="translate(' + x + ',' + y + ')"><rect x="-16" y="-22" width="32" height="22" rx="3" fill="' + renk + '"/><rect x="-12" y="-5" width="26" height="4" fill="#fff"/></g>'; }
  function hediye(x, y, renk) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="-16" y="-26" width="32" height="26" rx="3" fill="' + renk + '"/><rect x="-18" y="-32" width="36" height="8" rx="2" fill="' + renk + '" stroke="rgba(0,0,0,.12)"/><rect x="-3" y="-32" width="6" height="32" fill="#ffe066"/><path d="M0,-32 Q-14,-44 -8,-34 M0,-32 Q14,-44 8,-34" stroke="#ffe066" stroke-width="4" fill="none"/></g>'; }
  function oyuncakAraba(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-22,-8 L-22,-18 L-10,-18 L-4,-28 L12,-28 L18,-18 L24,-18 L24,-8 Z" fill="#fa5252"/><rect x="-2" y="-25" width="12" height="7" fill="#d0ebff"/><circle cx="-12" cy="-6" r="6" fill="#343a40"/><circle cx="14" cy="-6" r="6" fill="#343a40"/><circle cx="-12" cy="-6" r="2" fill="#adb5bd"/><circle cx="14" cy="-6" r="2" fill="#adb5bd"/></g>'; }
  function bisiklet(x, y) { return '<g transform="translate(' + x + ',' + y + ')" fill="none" stroke-linecap="round"><circle cx="-28" cy="-20" r="18" stroke="#343a40" stroke-width="4"/><circle cx="28" cy="-20" r="18" stroke="#343a40" stroke-width="4"/><path d="M-28,-20 L-6,-20 L10,-44 L-14,-44 Z M10,-44 L28,-20 M-6,-20 L-14,-48 M10,-44 L8,-54 L18,-54" stroke="#12b886" stroke-width="5"/><path d="M-20,-50 L-8,-50" stroke="#343a40" stroke-width="5"/>' + parilti(40, -56, .8) + '</g>'; }
  function araba(x, y, renk) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-70,-14 L-70,-38 Q-66,-46 -54,-46 L-36,-46 L-20,-70 L34,-70 L52,-46 L64,-44 Q72,-42 72,-32 L72,-14 Z" fill="' + renk + '"/><path d="M-14,-64 L28,-64 L42,-46 L-26,-46 Z" fill="#d0ebff"/><path d="M8,-64 L8,-46" stroke="' + renk + '" stroke-width="5"/><circle cx="-40" cy="-12" r="14" fill="#343a40"/><circle cx="44" cy="-12" r="14" fill="#343a40"/><circle cx="-40" cy="-12" r="5" fill="#ced4da"/><circle cx="44" cy="-12" r="5" fill="#ced4da"/><rect x="62" y="-36" width="8" height="6" rx="2" fill="#ffe066"/><rect x="-26" y="-92" width="58" height="18" rx="4" fill="#ffa94d"/><rect x="-22" y="-98" width="22" height="8" rx="2" fill="#f76707"/></g>'; }
  function ev(x, y, renk) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="-56" y="-80" width="112" height="80" fill="' + renk + '"/><path d="M-66,-78 L0,-126 L66,-78 Z" fill="#e8590c"/><rect x="-14" y="-44" width="28" height="44" rx="3" fill="#a9744f"/><circle cx="8" cy="-22" r="2.5" fill="#ffd43b"/><rect x="-44" y="-62" width="22" height="20" fill="#d0ebff" stroke="#fff" stroke-width="3"/><rect x="22" y="-62" width="22" height="20" fill="#d0ebff" stroke="#fff" stroke-width="3"/></g>'; }
  function yatak(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="-80" y="-34" width="160" height="26" rx="8" fill="#748ffc"/><rect x="-86" y="-70" width="12" height="70" rx="5" fill="#a9744f"/><rect x="74" y="-50" width="12" height="50" rx="5" fill="#a9744f"/><rect x="-74" y="-46" width="40" height="16" rx="8" fill="#fff"/><path d="M-36,-40 Q20,-56 74,-38 L74,-24 L-36,-24 Z" fill="#91a7ff"/></g>'; }
  function vazoKirik(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-30,0 L-20,-14 L-12,-4 Z" fill="#4dabf7"/><path d="M0,0 L8,-18 L18,-6 L14,0 Z" fill="#339af0"/><path d="M22,0 L30,-10 L36,0 Z" fill="#74c0fc"/>' + cicek(-40, 2, '#f06595', .7) + '<g stroke="#adb5bd" stroke-width="2" stroke-linecap="round"><path d="M-6,-20 L-10,-28 M10,-26 L12,-34 M26,-18 L32,-24"/></g></g>'; }
  function top(x, y, r) { return '<g transform="translate(' + x + ',' + y + ')"><circle r="' + r + '" fill="#fff" stroke="#343a40" stroke-width="2"/><path d="M0,-' + (r * .45) + ' L' + (r * .43) + ',-' + (r * .14) + ' L' + (r * .27) + ',' + (r * .36) + ' L-' + (r * .27) + ',' + (r * .36) + ' L-' + (r * .43) + ',-' + (r * .14) + ' Z" fill="#343a40"/></g>'; }
  function takvim(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="-38" y="-46" width="76" height="66" rx="6" fill="#fff" stroke="#495057" stroke-width="2"/><rect x="-38" y="-46" width="76" height="16" rx="6" fill="#fa5252"/><g fill="#dee2e6">' + [0, 1, 2, 3].map(function (r) { return [0, 1, 2, 3, 4].map(function (c) { return '<rect x="' + (-32 + c * 13) + '" y="' + (-24 + r * 10) + '" width="10" height="7" rx="1.5"/>'; }).join(''); }).join('') + '</g><circle cx="21" cy="-1" r="8" fill="none" stroke="#2f9e44" stroke-width="3"/><g fill="#495057"><rect x="-26" y="-52" width="4" height="10" rx="2"/><rect x="22" y="-52" width="4" height="10" rx="2"/></g></g>'; }
  function seccade(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-46,0 L46,0 L36,-22 L-36,-22 Z" fill="#c92a2a"/><path d="M-36,-4 L36,-4 L30,-18 L-30,-18 Z" fill="none" stroke="#ffd43b" stroke-width="2"/><path d="M-8,-8 Q0,-18 8,-8 Z" fill="#ffd43b"/></g>'; }
  function karinca(x, y, s) { return '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')"><ellipse cx="-7" cy="0" rx="5" ry="4" fill="#5c3d2e"/><circle cx="0" cy="-1" r="3" fill="#5c3d2e"/><circle cx="6" cy="-2" r="3.5" fill="#5c3d2e"/><g stroke="#5c3d2e" stroke-width="1.2"><path d="M-2,1 L-5,6 M0,1 L0,6 M2,1 L5,6 M7,-5 L10,-9"/></g><rect x="3" y="-10" width="7" height="5" rx="1.5" fill="#ffe066"/></g>'; }
  function ari(x, y, s) { return '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')"><ellipse cx="0" cy="0" rx="12" ry="9" fill="#ffd43b"/><path d="M-4,-8 L-4,8 M4,-8 L4,8" stroke="#343a40" stroke-width="3"/><ellipse cx="-3" cy="-12" rx="7" ry="5" fill="#e7f5ff" opacity=".9"/><ellipse cx="5" cy="-12" rx="7" ry="5" fill="#e7f5ff" opacity=".9"/><circle cx="11" cy="-2" r="1.6" fill="#343a40"/></g>'; }
  function petek(x, y) { var h = []; for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) { var cx = x + c * 22 + (r % 2 ? 11 : 0), cy = y + r * 19; h.push('<polygon points="' + [0, 1, 2, 3, 4, 5].map(function (i) { var a = Math.PI / 3 * i + Math.PI / 6; return (cx + 12 * Math.cos(a)).toFixed(1) + ',' + (cy + 12 * Math.sin(a)).toFixed(1); }).join(' ') + '" fill="#ffd43b" stroke="#f08c00" stroke-width="2"/>'); } return h.join(''); }
  function televizyon(x, y, ic) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="-70" y="-96" width="140" height="92" rx="10" fill="#343a40"/><rect x="-62" y="-88" width="124" height="76" rx="6" fill="#d3f9d8"/>' + ic + '<rect x="-20" y="-4" width="40" height="8" fill="#495057"/><rect x="-36" y="4" width="72" height="6" rx="3" fill="#495057"/></g>'; }
  function tuval(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-30,0 L-14,-90 M30,0 L14,-90 M0,-20 L0,0" stroke="#a9744f" stroke-width="5"/><rect x="-36" y="-96" width="72" height="62" rx="3" fill="#fff" stroke="#a9744f" stroke-width="4"/><circle cx="16" cy="-80" r="8" fill="#ffd43b"/><path d="M-30,-40 L-12,-62 L4,-46 L14,-56 L30,-40 Z" fill="#69db7c"/><path d="M-30,-40 L30,-40" stroke="#4dabf7" stroke-width="4"/>' + cicek(-20, -40, '#f06595', .45) + '</g>'; }
  function fidan(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><ellipse cx="0" cy="2" rx="26" ry="6" fill="#8d5a3b"/><path d="M0,0 L0,-34" stroke="#2f9e44" stroke-width="4"/><ellipse cx="-10" cy="-28" rx="11" ry="6" fill="#51cf66" transform="rotate(-30 -10 -28)"/><ellipse cx="10" cy="-36" rx="11" ry="6" fill="#40c057" transform="rotate(30 10 -36)"/></g>'; }
  function kurek(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M0,0 L0,-50" stroke="#a9744f" stroke-width="5" stroke-linecap="round"/><path d="M-10,0 L10,0 L6,16 L-6,16 Z" fill="#adb5bd"/></g>'; }
  function canta(x, y, renk) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="-16" y="-28" width="32" height="28" rx="5" fill="' + (renk || '#e64980') + '"/><path d="M-9,-28 Q0,-42 9,-28" fill="none" stroke="' + (renk || '#e64980') + '" stroke-width="4"/><circle cx="-6" cy="-36" r="5" fill="#ff922b"/><path d="M4,-32 L10,-42" stroke="#2f9e44" stroke-width="4" stroke-linecap="round"/></g>'; }
  function telefon(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="-8" y="-15" width="16" height="28" rx="4" fill="#343a40"/><rect x="-6" y="-12" width="12" height="20" rx="2" fill="#74c0fc"/></g>'; }
  function termometre(x, y) { return '<g transform="translate(' + x + ',' + y + ') rotate(-30)"><rect x="-3" y="-22" width="6" height="22" rx="3" fill="#fff" stroke="#adb5bd"/><rect x="-1.5" y="-12" width="3" height="12" fill="#fa5252"/><circle cx="0" cy="2" r="4.5" fill="#fa5252"/></g>'; }
  function madalya(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-10,-30 L-4,-10 L4,-10 L10,-30" fill="#4dabf7"/><circle cx="0" cy="-2" r="11" fill="#fcc419" stroke="#f08c00" stroke-width="2"/>' + yildiz(0, -2, 6, '#fff3bf') + '</g>'; }
  function kupa(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-16,-40 L16,-40 L12,-18 Q0,-10 -12,-18 Z" fill="#fcc419"/><path d="M-16,-36 Q-28,-34 -14,-22 M16,-36 Q28,-34 14,-22" fill="none" stroke="#fcc419" stroke-width="4"/><rect x="-4" y="-14" width="8" height="8" fill="#f08c00"/><rect x="-12" y="-6" width="24" height="6" rx="2" fill="#e8590c"/></g>'; }
  function kapi(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="-34" y="-150" width="68" height="150" fill="#a9744f"/><rect x="-28" y="-144" width="56" height="144" fill="#c08a5c"/><circle cx="18" cy="-70" r="4" fill="#ffd43b"/><rect x="-22" y="-134" width="44" height="40" rx="3" fill="#d0ebff" opacity=".8"/></g>'; }
  function hilal(x, y, r) { return '<g transform="translate(' + x + ',' + y + ')"><circle r="' + r + '" fill="#fff3bf"/><circle cx="' + (r * .45) + '" cy="' + (-r * .2) + '" r="' + (r * .88) + '" fill="#2a2a72"/></g>'; }
  function hapsu(x, y) { return '<g transform="translate(' + x + ',' + y + ')" fill="#d0ebff"><circle cx="0" cy="0" r="3"/><circle cx="8" cy="-4" r="2.4"/><circle cx="8" cy="5" r="2.2"/><circle cx="15" cy="0" r="1.8"/></g>'; }
  function kulaklik(x, y, s) { return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-28,-100 Q-28,-134 0,-134 Q28,-134 28,-100" fill="none" stroke="#343a40" stroke-width="5"/><rect x="-34" y="-110" width="12" height="20" rx="5" fill="#f03e3e"/><rect x="22" y="-110" width="12" height="20" rx="5" fill="#f03e3e"/></g>'; }
  function nota(x, y) { return '<g transform="translate(' + x + ',' + y + ')" fill="#7950f2"><circle cx="0" cy="0" r="4"/><path d="M3,0 L3,-14 L10,-11" stroke="#7950f2" stroke-width="2" fill="none"/><animateTransform attributeName="transform" type="translate" values="' + x + ',' + y + ';' + (x + 4) + ',' + (y - 8) + ';' + x + ',' + y + '" dur="2s" repeatCount="indefinite"/></g>'; }
  function ayakkabi(x, y, renk) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-22,0 L-22,-14 Q-20,-20 -12,-20 L-4,-20 Q0,-12 10,-10 L20,-8 Q26,-6 26,0 Z" fill="' + renk + '"/><path d="M-22,0 L26,0" stroke="#fff" stroke-width="4"/><g stroke="#fff" stroke-width="2"><path d="M-8,-18 L-2,-14 M-4,-19 L2,-15"/></g>' + parilti(32, -18, .6) + '</g>'; }
  function poset(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-14,0 L-16,-30 L16,-30 L14,0 Z" fill="#ffe8cc" stroke="#e8590c" stroke-width="2"/><path d="M-8,-30 Q0,-42 8,-30" fill="none" stroke="#e8590c" stroke-width="3"/><circle cx="-4" cy="-34" r="5" fill="#ff922b"/><path d="M6,-32 L10,-44" stroke="#2f9e44" stroke-width="4" stroke-linecap="round"/></g>'; }
  function bebek(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><ellipse cx="0" cy="0" rx="26" ry="14" fill="#e7f5ff" stroke="#a5d8ff" stroke-width="2"/><circle cx="-14" cy="-6" r="11" fill="' + TEN[3] + '"/><path d="M-19,-7 Q-17,-9 -15,-7 M-12,-7 Q-10,-9 -8,-7" stroke="#2d2a32" stroke-width="1.5" fill="none"/></g>'; }
  function cerceve(x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="#fff" stroke="#ffc078" stroke-width="5"/><path d="M' + (x + 6) + ',' + (y + h - 6) + ' L' + (x + w / 3) + ',' + (y + h / 2) + ' L' + (x + w / 2) + ',' + (y + h - 12) + ' L' + (x + 2 * w / 3) + ',' + (y + h / 2.6) + ' L' + (x + w - 6) + ',' + (y + h - 6) + ' Z" fill="#8ce99a"/>'; }
  function pencere(x, y, w, h, gece) { return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + (gece ? '#364fc7' : '#a5d8ff') + '" stroke="#fff" stroke-width="6"/><path d="M' + (x + w / 2) + ',' + y + ' L' + (x + w / 2) + ',' + (y + h) + '" stroke="#fff" stroke-width="5"/>' + (gece ? hilal(x + w * .72, y + h * .35, 11) + yildiz(x + w * .25, y + h * .3, 4, '#fff3bf') : '<circle cx="' + (x + w * .3) + '" cy="' + (y + h * .35) + '" r="8" fill="#ffe066"/>') + '<path d="M' + (x - 8) + ',' + (y - 6) + ' Q' + (x + 6) + ',' + (y + h / 2) + ' ' + (x - 4) + ',' + (y + h + 6) + ' L' + (x - 14) + ',' + (y + h + 6) + ' L' + (x - 14) + ',' + (y - 6) + ' Z" fill="#ff8787"/><path d="M' + (x + w + 8) + ',' + (y - 6) + ' Q' + (x + w - 6) + ',' + (y + h / 2) + ' ' + (x + w + 4) + ',' + (y + h + 6) + ' L' + (x + w + 14) + ',' + (y + h + 6) + ' L' + (x + w + 14) + ',' + (y - 6) + ' Z" fill="#ff8787"/></g>'; }
  function sayi(x, y, n) { return '<g><circle cx="' + x + '" cy="' + y + '" r="13" fill="#7048e8" stroke="#fff" stroke-width="3"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-family="Nunito,Segoe UI,sans-serif" font-weight="900" font-size="15" fill="#fff">' + n + '</text></g>'; }
  function damla(x, y) { return '<path transform="translate(' + x + ',' + y + ')" d="M0,-8 Q6,0 0,6 Q-6,0 0,-8 Z" fill="#4dabf7"><animateTransform attributeName="transform" type="translate" values="' + x + ',' + (y - 20) + ';' + x + ',' + (y + 10) + '" dur="1.4s" repeatCount="indefinite"/></path>'; }

  /* ---------- hazır karakterler ---------- */
  var C = {
    ece: { ten: TEN[0], sac: SAC.kahve, stil: 'atkuyrugu', ust: '#f06595', alt: '#5c7cfa' },
    can: { ten: TEN[1], sac: SAC.siyah, stil: 'kisa', ust: '#20c997', alt: '#364fc7' },
    zeynep: { ten: TEN[3], sac: SAC.kizil, stil: 'uzun', ust: '#ffa94d', alt: '#7048e8' },
    ali: { ten: TEN[2], sac: SAC.siyah, stil: 'kivircik', ust: '#4dabf7', alt: '#495057' },
    elif: { ten: TEN[4], sac: SAC.sari, stil: 'uzun', ust: '#cc5de8', alt: '#1c7ed6' },
    mert: { ten: TEN[0], sac: SAC.kahve, stil: 'kisa', ust: '#fab005', alt: '#2b8a3e' },
    anne: { ten: TEN[0], sac: SAC.kahve, stil: 'uzun', ust: '#e64980', alt: '#862e9c', s: 1.28, ortu: '#74c0fc' },
    baba: { ten: TEN[1], sac: SAC.siyah, stil: 'kisa', ust: '#1971c2', alt: '#343a40', s: 1.32, biyik: '#2b2324' },
    dede: { ten: TEN[1], sac: SAC.beyaz, stil: 'kel', ust: '#868e96', alt: '#495057', s: 1.24, gozluk: true, biyik: '#dee2e6' },
    nine: { ten: TEN[3], sac: SAC.gri, stil: 'topuz', ust: '#ae3ec9', alt: '#5f3dc4', s: 1.2, ortu: '#ffd8a8', gozluk: true },
    ogretmen: { ten: TEN[3], sac: SAC.kahve, stil: 'uzun', ust: '#0ca678', alt: '#364fc7', s: 1.3, gozluk: true }
  };
  function kisi(ad, ek) { var o = {}, b = C[ad], x; for (x in b) o[x] = b[x]; for (x in ek) o[x] = ek[x]; return insan(o); }

  /* ---------- sahneler ---------- */
  function sofra(bitti, yer) {
    return zemin('ev') + pencere(150, 34, 100, 70) + cerceve(300, 46, 56, 40) +
      kisi('anne', { x: 96, y: 196, yuz: 'gulumse' }) + kisi(yer || 'ece', { x: 200, y: 196, s: 1.05, poz: bitti ? 'bel' : 'tut', yuz: bitti ? 'mutlu' : 'gulumse' }) + kisi('baba', { x: 306, y: 196, yuz: 'gulumse' }) +
      masa(200, 150, 330) + tabak(110, 150, bitti ? 0 : 'buhar') + tabak(200, 150, bitti ? 0 : 'buhar') + tabak(290, 150, bitti ? 0 : 'buhar') + bardak(146, 148) + bardak(246, 148, '#ff8787') + bardak(334, 148);
  }
  function panel(i, ic) {
    var x = 6 + i * 131;
    return '<g><clipPath id="pn' + i + '_' + sayac + '"><rect x="' + x + '" y="6" width="125" height="238" rx="12"/></clipPath><g clip-path="url(#pn' + i + '_' + sayac + ')"><g transform="translate(' + x + ',6)">' + ic + '</g></g><rect x="' + x + '" y="6" width="125" height="238" rx="12" fill="none" stroke="#fff" stroke-width="4"/>' + sayi(x + 18, 24, i + 1) + '</g>';
  }

  var S = {
    sofra_basla: function () { return sofra(false); },
    sofra_bitti: function () { return sofra(true, 'can'); },
    okul_karsilasma: function () { return zemin('bahce') + '<rect x="150" y="70" width="230" height="126" fill="#ffe8cc"/><path d="M140,72 L265,30 L390,72 Z" fill="#e8590c"/><rect x="240" y="124" width="48" height="72" rx="4" fill="#4dabf7"/><g fill="#d0ebff"><rect x="166" y="96" width="40" height="30"/><rect x="320" y="96" width="40" height="30"/></g>' + kisi('zeynep', { x: 120, y: 214, poz: 'salla', yuz: 'mutlu' }) + kisi('ali', { x: 210, y: 214, poz: 'salla', yuz: 'mutlu' }) + canta(150, 214, '#7950f2') + parilti(165, 80, .8); },
    selam_cevap: function () { return zemin('park') + agac(60, 200, 1.1) + agac(350, 196, .9) + kisi('mert', { x: 150, y: 214, poz: 'salla', yuz: 'konus' }) + kisi('ali', { x: 262, y: 214, poz: 'dur', yuz: 'gulumse' }) + top(312, 208, 11) + balon(40, 40, 178, 'Esselamü aleyküm!', 'sag'); },
    cicek: function () { return zemin('bahce') + agac(340, 200, 1.1) + [[40, '#f06595'], [70, '#ffd43b'], [100, '#845ef7'], [250, '#ff6b6b'], [280, '#4dabf7'], [310, '#f783ac'], [130, '#ff922b']].map(function (c, i) { return cicek(c[0], 220 - (i % 2) * 6, c[1], 1.3); }).join('') + kisi('elif', { x: 190, y: 214, poz: 'yanak', yuz: 'saskin' }) + parilti(130, 150, 1) + parilti(255, 140, .8) + parilti(90, 120, .7) + '<g><path d="M290,120 q8,-10 16,0 q8,-10 16,0" fill="none" stroke="#845ef7" stroke-width="3"><animateTransform attributeName="transform" type="translate" values="0,0;-20,-10;0,0" dur="5s" repeatCount="indefinite"/></path></g>'; },
    hasta_ziyaret: function () { return zemin('oda') + pencere(260, 30, 90, 64) + yatak(140, 196) + kisi('can', { x: 100, y: 162, poz: 'gizli-bacak', yuz: 'hasta', s: .95 }) + '<path d="M60,160 Q130,140 214,160 L214,180 L60,180 Z" fill="#91a7ff"/>' + termometre(140, 132) + kisi('mert', { x: 290, y: 214, poz: 'tut', yuz: 'gulumse' }) + poset(290, 168) + bardak(232, 172, '#ffa94d') + '<rect x="222" y="172" width="22" height="24" fill="#a9744f"/>'; },
    yardim_kitap: function () { return zemin('okul') + kisi('ece', { x: 120, y: 214, poz: 'yanak', yuz: 'saskin' }) + kisi('ali', { x: 250, y: 214, poz: 'tut', yuz: 'mutlu' }) + '<g transform="translate(250,160)">' + kitap(0, 0, false, '#f03e3e') + kitap(0, -20, false, '#1c7ed6') + '</g>' + kitap(170, 222, true, '#2f9e44') + kitap(205, 228, false, '#fab005') + kalp(186, 120, 1.2) + kalp(205, 104, .8, '#ff8787'); },
    yeni_oyuncak: function () { return zemin('ev') + pencere(40, 40, 90, 64) + kisi('mert', { x: 230, y: 214, poz: 'uzat', yuz: 'mutlu' }) + oyuncakAraba(292, 152) + parilti(310, 120, 1) + parilti(270, 118, .7) + kisi('elif', { x: 130, y: 214, poz: 'yanak', yuz: 'saskin' }) + hediye(350, 214, '#4dabf7') + '<path d="M330,214 L370,214" stroke="#fff" stroke-width="0"/>'; },
    vedalasma: function () { return zemin('bahce') + '<rect x="250" y="60" width="150" height="136" fill="#ffe8cc"/><path d="M240,62 L325,26 L410,62 Z" fill="#e8590c"/><rect x="300" y="128" width="40" height="68" rx="4" fill="#4dabf7"/>' + kisi('can', { x: 110, y: 214, poz: 'salla', yuz: 'gulumse' }) + canta(80, 214, '#f76707') + kisi('mert', { x: 220, y: 214, poz: 'salla', yuz: 'gulumse' }) + '<path d="M150,236 L60,236" stroke="#2f9e44" stroke-width="3" stroke-dasharray="6 6" marker-end=""/><path d="M60,230 L48,236 L60,242" fill="none" stroke="#2f9e44" stroke-width="3"/><path d="M190,236 L280,236" stroke="#2f9e44" stroke-width="3" stroke-dasharray="6 6"/><path d="M280,230 L292,236 L280,242" fill="none" stroke="#2f9e44" stroke-width="3"/>'; },
    plan_park: function () { return zemin('ev') + pencere(250, 34, 100, 70) + kisi('zeynep', { x: 150, y: 214, poz: 'isaret', yuz: 'mutlu' }) + kisi('anne', { x: 300, y: 214, yuz: 'gulumse' }) + dusunce(110, 60, 38, '<g transform="translate(110,60) scale(.32)">' + agac(-80, 60, 1) + '<rect x="-20" y="10" width="90" height="10" rx="4" fill="#a9744f"/><rect x="-14" y="20" width="8" height="30" fill="#a9744f"/><rect x="56" y="20" width="8" height="30" fill="#a9744f"/>' + gunes(70, -50) + '</g>'); },
    takvim: function () { return zemin('oda') + pencere(40, 40, 90, 64) + kisi('can', { x: 190, y: 214, poz: 'isaret', yuz: 'mutlu' }) + takvim(300, 120) + '<rect x="250" y="160" width="100" height="36" fill="#a9744f"/>' + dusunce(100, 150, 30, '<g transform="translate(100,162) scale(.3)">' + ev(0, 0, '#ffd8a8') + '</g>') + kalp(128, 132, .7); },
    yagmur_bahce: function () { return zemin('bahce') + bulut(120, 40, 1.3) + bulut(260, 50, 1.1) + damla(100, 80) + damla(140, 90) + damla(250, 86) + damla(290, 76) + '<path d="M40,214 L360,214" stroke="#8d5a3b" stroke-width="16" stroke-linecap="round"/>' + [70, 120, 270, 320].map(function (x) { return fidan(x, 212); }).join('') + kisi('dede', { x: 196, y: 222, poz: 'dua', yuz: 'mutlu', takke: '#fff' }) + '<path d="M40,30 a90,90 0 0 1 120,0" fill="none" stroke="#ff8787" stroke-width="6" opacity=".7"/><path d="M48,36 a80,80 0 0 1 104,0" fill="none" stroke="#ffd43b" stroke-width="6" opacity=".7"/><path d="M56,42 a70,70 0 0 1 88,0" fill="none" stroke="#69db7c" stroke-width="6" opacity=".7"/>'; },
    kitap_ac: function () { return zemin('oda') + pencere(270, 34, 90, 64) + kisi('elif', { x: 190, y: 196, poz: 'tut', yuz: 'gulumse' }) + '<rect x="90" y="156" width="210" height="12" rx="5" fill="#a9744f"/><rect x="100" y="168" width="10" height="50" fill="#8d5a3b"/><rect x="280" y="168" width="10" height="50" fill="#8d5a3b"/>' + kitap(190, 158, true, '#7048e8') + '<g transform="translate(250,156)"><rect x="-4" y="-30" width="8" height="30" fill="#fab005"/><path d="M-4,-30 L0,-38 L4,-30 Z" fill="#ffd8a8"/></g>' + kitap(130, 156, false, '#e64980') + parilti(160, 110, .8); },
    gece: function () { return zemin('gece') + kisi('ali', { x: 150, y: 214, poz: 'yanak', yuz: 'saskin' }) + kisi('baba', { x: 240, y: 214, poz: 'isaret', yuz: 'gulumse' }) + '<path d="M60,40 L90,64" stroke="#fff" stroke-width="2" opacity=".8"><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/></path>'; },
    karinca: function () { return zemin('bahce') + agac(350, 200, 1) + '<path d="M30,232 Q120,222 200,236 T360,230" fill="none" stroke="#c4a484" stroke-width="10" stroke-linecap="round" opacity=".6"/>' + [50, 80, 110, 140, 170, 200, 230].map(function (x, i) { return karinca(x, 230 + (i % 2 ? 3 : -2), 1.3); }).join('') + '<g transform="translate(270,214)"><path d="M-30,0 Q0,-30 30,0 Z" fill="#8d5a3b"/><ellipse cx="0" cy="-2" rx="6" ry="3" fill="#3d2a1f"/></g>' + kisi('ece', { x: 150, y: 196, poz: 'yanak', yuz: 'saskin', s: .9 }) + '<g transform="translate(205,170)"><circle r="16" fill="#e7f5ff" stroke="#495057" stroke-width="4" opacity=".85"/><path d="M11,11 L24,24" stroke="#495057" stroke-width="6" stroke-linecap="round"/></g>'; },
    kirik_vazo: function () { return zemin('ev') + pencere(260, 34, 100, 70) + '<rect x="60" y="150" width="70" height="46" fill="#a9744f"/>' + vazoKirik(210, 212) + top(320, 214, 12) + kisi('mert', { x: 150, y: 214, poz: 'yanak', yuz: 'uzgun' }) + kisi('anne', { x: 270, y: 214, yuz: 'gulumse', poz: 'bel' }); },
    namaz_dede: function () { return zemin('ev') + pencere(150, 34, 100, 70) + '<rect x="20" y="60" width="70" height="136" fill="#ffe8cc" opacity=".6"/>' + seccade(260, 214) + kisi('dede', { x: 250, y: 214, poz: 'tut', yuz: 'gulumse', takke: '#fff' }) + kisi('can', { x: 130, y: 214, poz: 'dur', yuz: 'mutlu' }) + parilti(200, 70, .8); },
    eve_varis: function () { return zemin('yol') + ev(300, 196, '#ffd8a8') + araba(130, 226, '#4c6ef5') + kisi('ece', { x: 220, y: 214, poz: 'sevinc', yuz: 'mutlu', s: .85 }) + kisi('baba', { x: 250, y: 214, s: 1.1, yuz: 'gulumse' }) + '<g transform="translate(195,214)"><rect x="-14" y="-30" width="28" height="30" rx="4" fill="#f76707"/><rect x="-6" y="-36" width="12" height="6" rx="2" fill="none" stroke="#f76707" stroke-width="3"/></g>' + kalp(220, 70, 1.2); },
    yarisma: function () { return zemin('okul') + '<rect x="250" y="150" width="90" height="46" fill="#ffd8a8"/><rect x="262" y="138" width="66" height="12" fill="#ffc078"/>' + tuval(80, 196) + kisi('zeynep', { x: 295, y: 150, poz: 'sevinc', yuz: 'mutlu', s: .95 }) + madalya(295, 82) + kisi('ali', { x: 180, y: 214, poz: 'salla', yuz: 'mutlu' }) + kisi('elif', { x: 380, y: 214, poz: 'salla', yuz: 'mutlu' }) + yildiz(240, 50, 10) + yildiz(352, 40, 8, '#ff922b') + parilti(220, 100, 1) + '<g fill="#f783ac"><rect x="200" y="30" width="6" height="10" transform="rotate(30 200 30)"/><rect x="330" y="80" width="6" height="10" transform="rotate(-20 330 80)"/><rect x="260" y="20" width="6" height="10" fill="#4dabf7"/></g>'; },
    dua_sinif: function () { return zemin('okul') + kisi('ogretmen', { x: 340, y: 214, poz: 'dua', yuz: 'gulumse' }) + kisi('ece', { x: 80, y: 214, poz: 'dua', yuz: 'gulumse', s: .9 }) + kisi('ali', { x: 160, y: 214, poz: 'dua', yuz: 'gulumse', s: .9 }) + kisi('elif', { x: 240, y: 214, poz: 'dua', yuz: 'gulumse', s: .9 }) + kalp(200, 40, 1.4, '#ffa8a8'); },
    balon_razi: function () { return zemin('bahce') + ev(330, 196, '#ffe8cc') + kisi('nine', { x: 250, y: 214, poz: 'dua', yuz: 'mutlu' }) + kisi('can', { x: 140, y: 214, poz: 'tut', yuz: 'mutlu' }) + poset(128, 172) + poset(156, 174) + balon(170, 34, 170, 'Allah razı olsun!', 'sag'); },
    balon_fidan: function () { return zemin('bahce') + agac(60, 196, .9) + fidan(240, 220) + kurek(290, 216) + kisi('ali', { x: 180, y: 214, poz: 'uzat', yuz: 'konus' }) + balon(120, 46, 116, 'Bismillah!', 'sol'); },
    selam_kulaklik: function () { return zemin('park') + agac(370, 200, .9) + '<rect x="230" y="176" width="110" height="10" rx="4" fill="#a9744f"/><rect x="240" y="186" width="8" height="28" fill="#a9744f"/><rect x="322" y="186" width="8" height="28" fill="#a9744f"/>' + kisi('mert', { x: 110, y: 214, poz: 'salla', yuz: 'konus' }) + kisi('can', { x: 286, y: 186, poz: 'gizli-bacak', yuz: 'uykulu' }) + kulaklik(286, 186, 1) + nota(320, 90) + nota(250, 80) + balon(30, 34, 178, 'Esselamü aleyküm!', 'sol'); },
    bayram_cami: function () { return zemin('cami') + kisi('baba', { x: 90, y: 222, poz: 'dur', yuz: 'gulumse', takke: '#fff' }) + kisi('ali', { x: 140, y: 222, poz: 'dur', yuz: 'mutlu', takke: '#fff', s: .85 }) + kisi('dede', { x: 380, y: 222, poz: 'dur', yuz: 'gulumse', takke: '#fff' }) + '<g fill="#ffd43b">' + yildiz(170, 50, 6) + yildiz(330, 40, 5) + '</g>' + '<g fill="none" stroke="#fab005" stroke-width="3" stroke-linecap="round"><path d="M320,40 q8,-8 16,0"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/></path><path d="M314,30 q14,-14 28,0"><animate attributeName="opacity" values="0;1;0" dur="2s" begin=".5s" repeatCount="indefinite"/></path></g>'; },
    telefon_hasta: function () { return zemin('ev') + '<rect x="200" y="0" width="200" height="250" fill="#ede7ff"/><path d="M200,0 L200,250" stroke="#fff" stroke-width="6"/>' + kisi('ece', { x: 100, y: 214, poz: 'agiz', yuz: 'gulumse' }) + telefon(108, 128) + yatak(310, 214) + kisi('zeynep', { x: 270, y: 180, poz: 'gizli-bacak', yuz: 'hasta', s: .9 }) + '<path d="M240,178 Q300,160 384,180 L384,196 L240,196 Z" fill="#91a7ff"/>' + termometre(300, 150) + '<g stroke="#7950f2" stroke-width="3" fill="none" stroke-linecap="round"><path d="M150,110 q10,10 0,20"/><path d="M162,104 q16,16 0,32"/></g>'; },
    yeni_ev: function () { return zemin('bahce') + ev(280, 200, '#d0bfff') + '<g transform="translate(160,214)"><rect x="-26" y="-36" width="52" height="36" fill="#e8b073"/><path d="M-26,-36 L26,-36" stroke="#c08a5c" stroke-width="4"/></g><g transform="translate(200,214)"><rect x="-18" y="-24" width="36" height="24" fill="#e8b073"/></g>' + kisi('baba', { x: 90, y: 214, poz: 'tut', yuz: 'mutlu' }) + kisi('elif', { x: 360, y: 214, poz: 'salla', yuz: 'mutlu', s: .85 }) + hediye(332, 214, '#f06595'); },
    iftar: function () { return zemin('ev') + pencere(150, 24, 100, 70, true) + kisi('elif', { x: 110, y: 196, poz: 'tut', yuz: 'mutlu' }) + kisi('anne', { x: 290, y: 196, poz: 'tut', yuz: 'gulumse' }) + masa(200, 150, 330) + tabak(120, 150, 'buhar') + tabak(200, 150, 'buhar') + tabak(280, 150, 'buhar') + bardak(160, 148, '#ffe066') + '<g transform="translate(244,148)"><ellipse rx="16" ry="5" fill="#a9744f"/><circle cx="-6" cy="-4" r="4" fill="#5c3d2e"/><circle cx="4" cy="-5" r="4" fill="#5c3d2e"/></g>'; },
    tv_ari: function () { return zemin('ev') + televizyon(220, 170, '<g transform="translate(-50,-74)">' + petek(0, 0) + '</g>' + ari(-28, -60, 1) + ari(36, -30, .9)) + '<rect x="130" y="170" width="180" height="26" fill="#a9744f"/>' + kisi('can', { x: 70, y: 222, poz: 'yanak', yuz: 'saskin', s: .9 }) + kisi('ece', { x: 360, y: 222, poz: 'isaret', yuz: 'mutlu', s: .9 }); },
    resim_kardes: function () { return zemin('oda') + pencere(40, 30, 80, 60) + tuval(250, 214) + kisi('zeynep', { x: 140, y: 214, poz: 'yanak', yuz: 'saskin' }) + kisi('ali', { x: 330, y: 214, poz: 'uzat', yuz: 'mutlu', s: .8 }) + '<g transform="translate(360,150)"><rect x="-4" y="-16" width="8" height="18" fill="#f06595"/><rect x="6" y="-14" width="8" height="16" fill="#4dabf7"/></g>' + parilti(292, 100, .8); },
    misafir_ayrilis: function () { return zemin('ev') + kapi(320, 214) + kisi('anne', { x: 270, y: 214, poz: 'salla', yuz: 'gulumse', ortu: '#ffa8a8', ust: '#ff922b' }) + canta(300, 214, '#7048e8') + kisi('elif', { x: 140, y: 214, poz: 'salla', yuz: 'gulumse' }) + kisi('anne', { x: 70, y: 214, poz: 'salla', yuz: 'gulumse' }); },
    hapsirma: function () { return zemin('okul') + kisi('can', { x: 140, y: 214, poz: 'agiz', yuz: 'uykulu' }) + hapsu(160, 110) + kisi('ece', { x: 270, y: 214, poz: 'dur', yuz: 'saskin' }) + balon(36, 26, 200, 'Hapşu! Elhamdülillah.', 'sol'); },
    bisiklet: function () { return zemin('park') + agac(50, 200, 1) + bisiklet(150, 220) + kisi('mert', { x: 230, y: 214, poz: 'isaret', yuz: 'mutlu' }) + kisi('ali', { x: 310, y: 214, poz: 'yanak', yuz: 'saskin', s: .95 }) + kisi('elif', { x: 370, y: 214, poz: 'sevinc', yuz: 'mutlu', s: .85 }); },
    odev_bitti: function () { return zemin('oda') + pencere(280, 30, 80, 60, true) + '<rect x="60" y="150" width="210" height="12" rx="5" fill="#a9744f"/><rect x="70" y="162" width="10" height="56" fill="#8d5a3b"/><rect x="250" y="162" width="10" height="56" fill="#8d5a3b"/>' + kisi('ali', { x: 166, y: 190, poz: 'sevinc', yuz: 'konus' }) + kitap(120, 152, false, '#2f9e44') + kitap(220, 152, true, '#e64980') + '<g transform="translate(220,128)"><path d="M-6,0 L-1,6 L8,-6" fill="none" stroke="#2f9e44" stroke-width="4" stroke-linecap="round"/></g>' + balon(206, 50, 110, 'İnşallah!', 'sol'); },
    ayakkabi: function () { return zemin('okul') + kisi('ali', { x: 120, y: 214, poz: 'isaret', yuz: 'konus' }) + kisi('mert', { x: 270, y: 214, poz: 'bel', yuz: 'mutlu' }) + ayakkabi(330, 222, '#f03e3e') + balon(30, 34, 140, 'Maşallah!', 'sol'); },
    kapi_tutma: function () { return zemin('ev') + kapi(150, 214) + kisi('elif', { x: 200, y: 214, poz: 'uzat', yuz: 'gulumse', s: .95 }) + kisi('dede', { x: 300, y: 214, poz: 'tut', yuz: 'mutlu', gozluk: false }) + poset(286, 170) + poset(316, 172) + balon(220, 28, 176, 'Allah razı olsun, kızım!', 'sag'); },
    uc_panel_zeynep: function () {
      return '<rect width="400" height="250" fill="#fff4e6"/>' +
        panel(0, zemin('bahce').replace(/width="400"/g, 'width="125"') + '<rect x="70" y="96" width="70" height="100" fill="#ffe8cc"/><path d="M62,98 L105,74 L148,98 Z" fill="#e8590c"/><rect x="88" y="150" width="24" height="46" fill="#4dabf7"/>' + kisi('zeynep', { x: 30, y: 222, poz: 'salla', s: .78, yuz: 'mutlu' }) + kisi('ece', { x: 84, y: 222, poz: 'salla', s: .78, yuz: 'mutlu' }) + canta(56, 222, '#7950f2')) +
        panel(1, '<rect width="125" height="238" fill="#fff0e0"/><rect y="190" width="125" height="48" fill="#e6b98a"/>' + kisi('zeynep', { x: 62, y: 190, poz: 'bel', s: .8, yuz: 'mutlu' }) + masa(62, 152, 116) + tabak(40, 152, 0) + tabak(86, 152, 0)) +
        panel(2, '<defs><linearGradient id="ga' + sayac + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffa94d"/><stop offset="1" stop-color="#ffe8cc"/></linearGradient></defs><rect width="125" height="238" fill="url(#ga' + sayac + ')"/><circle cx="96" cy="70" r="16" fill="#ffd43b"/><path d="M0,170 Q62,150 125,170 L125,238 L0,238 Z" fill="#82c91e"/>' + kisi('zeynep', { x: 30, y: 222, poz: 'salla', s: .78, yuz: 'gulumse' }) + kisi('ece', { x: 96, y: 222, poz: 'salla', s: .78, yuz: 'gulumse' }) + '<g stroke="#e8590c" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M44,112 L10,112 M18,104 L10,112 L18,120"/><path d="M82,112 L116,112 M108,104 L116,112 L108,120"/></g>');
    },
    uc_panel_ayse: function () {
      return '<rect width="400" height="250" fill="#f3f0ff"/>' +
        panel(0, '<rect width="125" height="238" fill="#fff0e0"/><rect y="190" width="125" height="48" fill="#e6b98a"/>' + pencere(30, 20, 64, 46) + kisi('elif', { x: 62, y: 190, poz: 'tut', s: .8, yuz: 'gulumse' }) + masa(62, 152, 116) + tabak(62, 152, 'buhar') + bardak(98, 150, '#ffa94d')) +
        panel(1, '<rect width="125" height="238" fill="#fff0e0"/><rect y="190" width="125" height="48" fill="#e6b98a"/>' + pencere(30, 20, 64, 46) + kisi('elif', { x: 62, y: 190, poz: 'bel', s: .8, yuz: 'mutlu' }) + masa(62, 152, 116) + tabak(62, 152, 0) + bardak(98, 150, '#e7f5ff')) +
        panel(2, '<defs><linearGradient id="gb' + sayac + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff922b"/><stop offset=".6" stop-color="#ffc078"/><stop offset="1" stop-color="#ffe8cc"/></linearGradient></defs><rect width="125" height="238" fill="url(#gb' + sayac + ')"/><circle cx="62" cy="150" r="30" fill="#ffd43b"/><path d="M0,160 Q62,140 125,160 L125,238 L0,238 Z" fill="#5c940d"/>' + kisi('elif', { x: 62, y: 226, poz: 'yanak', s: .8, yuz: 'saskin' }) + '<g fill="#495057"><path d="M20,60 q5,-5 10,0 q5,-5 10,0" fill="none" stroke="#495057" stroke-width="2"/><path d="M80,40 q4,-4 8,0 q4,-4 8,0" fill="none" stroke="#495057" stroke-width="2"/></g>');
    }
  };

  function ciz(ad) {
    var f = S[ad]; if (!f) return '';
    sayac++;
    return '<svg class="dim-svg" viewBox="0 0 400 250" role="img" aria-label="Soru görseli" xmlns="http://www.w3.org/2000/svg">' + f() + '</svg>';
  }

  /* ---------- rehber karakter: Bilge Baykuş ---------- */
  function baykus(ruh) {
    ruh = ruh || 'mutlu';
    var gz = ruh === 'sevinc' ? '<path d="M30,44 q8,-9 16,0 M54,44 q8,-9 16,0" fill="none" stroke="#2d2a32" stroke-width="4" stroke-linecap="round"/>' : '<circle cx="38" cy="44" r="7" fill="#2d2a32"/><circle cx="62" cy="44" r="7" fill="#2d2a32"/><circle cx="40" cy="41" r="2.4" fill="#fff"/><circle cx="64" cy="41" r="2.4" fill="#fff"/>';
    return '<svg class="dim-baykus" viewBox="0 0 100 110" aria-hidden="true"><path d="M20,30 L14,8 L34,20 Z M80,30 L86,8 L66,20 Z" fill="#7048e8"/><ellipse cx="50" cy="62" rx="38" ry="44" fill="#845ef7"/><ellipse cx="50" cy="76" rx="24" ry="26" fill="#e5dbff"/><g fill="#d0bfff"><path d="M40,74 q5,5 10,0 q5,5 10,0"/><path d="M40,86 q5,5 10,0 q5,5 10,0"/></g><circle cx="38" cy="44" r="15" fill="#fff"/><circle cx="62" cy="44" r="15" fill="#fff"/>' + gz +
      '<path d="M46,54 L54,54 L50,62 Z" fill="#fab005"/><path d="M14,64 Q4,78 16,90" fill="none" stroke="#7048e8" stroke-width="8" stroke-linecap="round"' + (ruh === 'sevinc' ? ' transform="rotate(30 14 64)"' : '') + '/><path d="M86,64 Q96,78 84,90" fill="none" stroke="#7048e8" stroke-width="8" stroke-linecap="round"' + (ruh === 'sevinc' ? ' transform="rotate(-30 86 64)"' : '') + '/><g fill="#fab005"><ellipse cx="40" cy="105" rx="7" ry="3.5"/><ellipse cx="60" cy="105" rx="7" ry="3.5"/></g><ellipse cx="26" cy="56" rx="5" ry="3" fill="#ff8fa3" opacity=".6"/><ellipse cx="74" cy="56" rx="5" ry="3" fill="#ff8fa3" opacity=".6"/></svg>';
  }

  /* ---------- rozetler ---------- */
  var ROZET_RENK = ['#4dabf7', '#20c997', '#fcc419', '#f783ac', '#9775fa'];
  function rozet(no, kilitli) {
    var r = ROZET_RENK[no] || '#adb5bd', ic = '';
    if (no === 0) ic = '<circle cx="46" cy="46" r="14" fill="none" stroke="#fff" stroke-width="6"/><path d="M56,56 L68,68" stroke="#fff" stroke-width="8" stroke-linecap="round"/>';
    else if (no === 1) ic = '<path d="M50,68 Q38,60 26,64 L26,36 Q38,32 50,40 Z M50,68 Q62,60 74,64 L74,36 Q62,32 50,40 Z" fill="#fff"/>';
    else if (no === 2) ic = yildiz(50, 50, 20, '#fff');
    else if (no === 3) ic = '<path d="M50,68 C30,54 30,34 42,34 C47,34 50,40 50,42 C50,40 53,34 58,34 C70,34 70,54 50,68 Z" fill="#fff"/>';
    else ic = '<path d="M36,32 L64,32 L60,54 Q50,62 40,54 Z" fill="#fff"/><path d="M36,36 Q24,38 38,50 M64,36 Q76,38 62,50" fill="none" stroke="#fff" stroke-width="4"/><rect x="44" y="60" width="12" height="6" fill="#fff"/><rect x="38" y="66" width="24" height="6" rx="2" fill="#fff"/>';
    return '<svg class="dim-rozet-svg' + (kilitli ? ' kilitli' : '') + '" viewBox="0 0 100 120" aria-hidden="true"><path d="M30,84 L22,116 L36,108 L44,118 L50,90 Z M70,84 L78,116 L64,108 L56,118 L50,90 Z" fill="' + (kilitli ? '#ced4da' : '#ff6b6b') + '"/><circle cx="50" cy="50" r="40" fill="' + (kilitli ? '#dee2e6' : r) + '"/><circle cx="50" cy="50" r="33" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3" stroke-dasharray="4 5"/>' + (kilitli ? '<rect x="38" y="46" width="24" height="20" rx="4" fill="#adb5bd"/><path d="M42,46 L42,38 Q50,28 58,38 L58,46" fill="none" stroke="#adb5bd" stroke-width="5"/>' : ic) + '</svg>';
  }

  window.DIM_SAHNE = { ciz: ciz, baykus: baykus, rozet: rozet, adlar: Object.keys(S), yildiz: yildiz };
})();
