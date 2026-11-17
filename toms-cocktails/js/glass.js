/* Tom's Cocktails — SVG-glazen met animatie
   Elk glas: binnenvorm (clip), buitenlijn, voet, vulbereik en rand. */
(function () {
  'use strict';
  var uid = 0;

  var G = {
    highball: {
      inner: 'M64,44 L64,214 Q64,222 72,222 L128,222 Q136,222 136,214 L136,44 Z',
      outer: 'M58,40 L58,226 Q58,234 68,234 L132,234 Q142,234 142,226 L142,40',
      base: 'M60,222 L140,222 L140,226 Q140,232 132,232 L68,232 Q60,232 60,226 Z',
      yTop: 44, yBot: 222, fill: 0.86, rim: { y: 40, x1: 58, x2: 142 }, ice: [66, 134], iceS: 24
    },
    rocks: {
      inner: 'M54,112 L60,206 Q61,212 67,212 L133,212 Q139,212 140,206 L146,112 Z',
      outer: 'M48,106 L56,226 Q57,234 66,234 L134,234 Q143,234 144,226 L152,106',
      base: 'M58,212 L142,212 L141,226 Q140,232 133,232 L67,232 Q60,232 59,226 Z',
      yTop: 112, yBot: 212, fill: 0.8, rim: { y: 106, x1: 48, x2: 152 }, ice: [60, 140], iceS: 28
    },
    martini: {
      inner: 'M34,64 L100,146 L166,64 Z',
      outer: 'M28,58 L100,150 L172,58',
      base: 'M98,148 L98,226 L102,226 L102,148 Z M56,232 Q100,220 144,232 Q100,238 56,232 Z',
      yTop: 64, yBot: 146, fill: 0.86, rim: { y: 58, x1: 28, x2: 172 }
    },
    coupe: {
      inner: 'M40,72 C40,116 68,130 100,130 C132,130 160,116 160,72 Z',
      outer: 'M34,66 C34,120 64,136 100,136 C136,136 166,120 166,66',
      base: 'M97,136 L97,226 L103,226 L103,136 Z M58,232 Q100,220 142,232 Q100,238 58,232 Z',
      yTop: 72, yBot: 130, fill: 0.84, rim: { y: 66, x1: 34, x2: 166 }
    },
    shot: {
      inner: 'M68,114 L75,210 L125,210 L132,114 Z',
      outer: 'M62,108 L70,232 L130,232 L138,108',
      base: 'M74,210 L126,210 L129,230 L71,230 Z',
      yTop: 114, yBot: 210, fill: 0.86, rim: { y: 108, x1: 62, x2: 138 }
    },
    hurricane: {
      inner: 'M70,34 C56,80 54,118 72,156 C80,172 88,178 100,178 C112,178 120,172 128,156 C146,118 144,80 130,34 Z',
      outer: 'M64,30 C49,80 47,120 66,160 C74,176 84,184 100,184 C116,184 126,176 134,160 C153,120 151,80 136,30',
      base: 'M94,182 Q97,202 92,224 L108,224 Q103,202 106,182 Z M58,232 Q100,218 142,232 Q100,238 58,232 Z',
      yTop: 34, yBot: 178, fill: 0.88, rim: { y: 30, x1: 64, x2: 136 }, ice: [72, 128], iceS: 22
    },
    wijn: {
      inner: 'M62,52 C50,82 46,120 60,140 C72,156 128,156 140,140 C154,120 150,82 138,52 Z',
      outer: 'M56,46 C42,82 40,124 56,146 C70,164 130,164 144,146 C160,124 158,82 144,46',
      base: 'M97,160 L97,226 L103,226 L103,160 Z M56,232 Q100,220 144,232 Q100,238 56,232 Z',
      yTop: 52, yBot: 154, fill: 0.72, rim: { y: 46, x1: 56, x2: 144 }, ice: [60, 140], iceS: 26
    },
    flute: {
      inner: 'M82,34 C80,90 84,138 92,156 Q100,166 108,156 C116,138 120,90 118,34 Z',
      outer: 'M76,28 C74,92 78,142 88,162 Q100,176 112,162 C122,142 126,92 124,28',
      base: 'M98,170 L98,226 L102,226 L102,170 Z M64,232 Q100,222 136,232 Q100,238 64,232 Z',
      yTop: 34, yBot: 162, fill: 0.86, rim: { y: 28, x1: 76, x2: 124 }
    },
    mok: {
      inner: 'M54,82 L58,220 L138,220 L142,82 Z',
      outer: 'M50,78 L54,222 Q55,232 66,232 L130,232 Q141,232 142,222 L146,78',
      base: '',
      yTop: 82, yBot: 220, fill: 0.9, rim: { y: 78, x1: 50, x2: 146 }, ice: [60, 136], iceS: 26, opaque: true
    },
    irish: {
      inner: 'M66,52 L71,166 Q72,174 80,174 L120,174 Q128,174 129,166 L134,52 Z',
      outer: 'M60,46 L66,170 Q68,182 80,182 L120,182 Q132,182 134,170 L140,46',
      base: 'M93,182 L93,214 L107,214 L107,182 Z M60,228 Q100,212 140,228 Q100,236 60,228 Z',
      handle: 'M138,70 C170,70 170,142 132,142',
      yTop: 52, yBot: 174, fill: 0.9, rim: { y: 46, x1: 60, x2: 140 }
    },
    tulp: {
      inner: 'M70,34 C74,56 60,82 60,110 C60,144 78,158 100,158 C122,158 140,144 140,110 C140,82 126,56 130,34 Z',
      outer: 'M64,28 C68,56 54,82 54,110 C54,150 76,164 100,164 C124,164 146,150 146,110 C146,82 132,56 136,28',
      base: 'M93,164 L96,224 L104,224 L107,164 Z M58,232 Q100,220 142,232 Q100,238 58,232 Z',
      yTop: 34, yBot: 158, fill: 0.92, rim: { y: 28, x1: 64, x2: 136 }
    },
    margarita: {
      inner: 'M30,64 C34,94 66,100 84,104 C84,128 90,138 100,138 C110,138 116,128 116,104 C134,100 166,94 170,64 Z',
      outer: 'M24,58 C28,100 64,106 80,110 C80,134 88,144 100,144 C112,144 120,134 120,110 C136,106 172,100 176,58',
      base: 'M98,144 L98,226 L102,226 L102,144 Z M58,232 Q100,220 142,232 Q100,238 58,232 Z',
      yTop: 64, yBot: 138, fill: 0.9, rim: { y: 58, x1: 24, x2: 176 }
    }
  };

  // Pseudo-random, stabiel per cocktail
  function rng(seed) {
    var s = 0;
    for (var i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0;
    return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  }

  function shade(hex, amt) {
    var c = window.TC_DATA.hexToRgb(hex);
    return window.TC_DATA.rgbToHex(c.map(function (v) { return amt < 0 ? v * (1 + amt) : v + (255 - v) * amt; }));
  }

  /* ---------- Garnituur-primitieven (rond de oorsprong getekend) ---------- */
  var CITRUS = {
    limoen: ['#4f8f22', '#eef5cf', '#a9d24f'],
    citroen: ['#e7c21e', '#fff8cf', '#f6e173'],
    sinaas: ['#ec7f12', '#fde6c0', '#f7a43a'],
    pompelmoes: ['#ee8a52', '#fde2d2', '#f0716a']
  };
  function wheel(kind) {
    var c = CITRUS[kind] || CITRUS.limoen, s = '';
    s += '<circle r="17" fill="' + c[0] + '"/><circle r="14.6" fill="' + c[1] + '"/><circle r="12.6" fill="' + c[2] + '"/>';
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4;
      s += '<line x1="0" y1="0" x2="' + (Math.cos(a) * 12.6).toFixed(1) + '" y2="' + (Math.sin(a) * 12.6).toFixed(1) + '" stroke="' + c[1] + '" stroke-width="1.4"/>';
    }
    s += '<circle r="2" fill="' + c[1] + '"/>';
    s += '<path d="M0,-17 L0,-4" stroke="#1a1010" stroke-opacity=".35" stroke-width="1.2"/>';
    return s;
  }
  function wedge(kind) {
    var c = CITRUS[kind] || CITRUS.limoen;
    return '<path d="M-14,0 A14,14 0 0 0 14,0 Z" fill="' + c[0] + '"/><path d="M-11.5,0 A11.5,11.5 0 0 0 11.5,0 Z" fill="' + c[2] + '"/>' +
      '<path d="M0,0 L0,11 M0,0 L-8,8 M0,0 L8,8" stroke="' + c[1] + '" stroke-width="1.2"/>';
  }
  function cherry() {
    return '<path d="M0,-6 C2,-16 6,-22 14,-28" stroke="#5a3a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<circle r="8" fill="#b3102a"/><circle r="8" fill="url(#cherryShade)" opacity=".0"/>' +
      '<ellipse cx="-3" cy="-3" rx="2.4" ry="1.6" fill="#fff" opacity=".7"/>';
  }
  function leaf(x, y, rot, s, col) {
    return '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ') scale(' + s + ')">' +
      '<path d="M0,0 C6,-6 6,-18 0,-26 C-6,-18 -6,-6 0,0 Z" fill="' + (col || '#3f9a4a') + '"/>' +
      '<path d="M0,-2 L0,-23" stroke="#a8e0a4" stroke-width=".9" opacity=".7"/></g>';
  }
  function sprig() {
    return '<path d="M0,8 C0,-4 -2,-14 -1,-26" stroke="#2f6e33" stroke-width="2" fill="none"/>' +
      leaf(-1, -4, -48, 0.85) + leaf(0, -6, 44, 0.85) + leaf(-1, -14, -28, 0.75, '#4aae55') + leaf(0, -15, 30, 0.72, '#4aae55') + leaf(-1, -24, 0, 0.6, '#5cc066');
  }
  function bean(x, y, rot) {
    return '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')"><ellipse rx="6" ry="4" fill="#3b1d0e"/>' +
      '<path d="M-5,0 C-2,-2 2,2 5,0" stroke="#160903" stroke-width="1.2" fill="none"/><ellipse cx="-2" cy="-1.8" rx="2" ry=".8" fill="#fff" opacity=".25"/></g>';
  }
  function beans() { return bean(-13, 0, -15) + bean(0, -2, 10) + bean(13, 0, -5); }
  function olivePick() {
    return '<line x1="0" y1="-46" x2="0" y2="34" stroke="#d8b27a" stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle cx="0" cy="-46" r="3" fill="#c23a2a"/>' +
      '<ellipse cx="0" cy="10" rx="8" ry="10" fill="#7d8c2a"/><ellipse cx="0" cy="2" rx="3" ry="2.4" fill="#d2402c"/>' +
      '<ellipse cx="-3" cy="12" rx="2" ry="3" fill="#fff" opacity=".25"/>';
  }
  function twist(col) {
    return '<path d="M0,0 C10,4 14,14 6,20 C-2,26 -6,34 2,40 C8,44 12,48 8,54" stroke="' + col + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M0,0 C10,4 14,14 6,20 C-2,26 -6,34 2,40 C8,44 12,48 8,54" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
  }
  function pineapple() {
    return '<path d="M-14,0 L14,0 L0,-26 Z" fill="#f2c94c" stroke="#c99a22" stroke-width="1.2"/>' +
      '<path d="M-14,0 L14,0" stroke="#9a6b16" stroke-width="3"/>' +
      '<path d="M0,-26 C-6,-38 -10,-44 -12,-50 M0,-26 C0,-40 2,-46 3,-54 M0,-26 C6,-36 12,-40 16,-44" stroke="#3f9a4a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M-6,-6 L-2,-12 M4,-6 L0,-14 M-1,-18 L2,-22" stroke="#c99a22" stroke-width="1"/>';
  }
  function celery() {
    return '<rect x="-4" y="-20" width="8" height="120" rx="4" fill="#8cc152"/><rect x="-1" y="-20" width="2" height="120" fill="#b5dd84" opacity=".7"/>' +
      leaf(-2, -18, -30, 0.8, '#6aab3a') + leaf(2, -20, 25, 0.8, '#6aab3a') + leaf(0, -24, 0, 0.7, '#7cc04a');
  }
  function umbrella() {
    return '<line x1="0" y1="0" x2="0" y2="46" stroke="#e8d7b0" stroke-width="2"/>' +
      '<path d="M-26,0 Q0,-30 26,0 Q19.5,-4 13,0 Q6.5,-4 0,0 Q-6.5,-4 -13,0 Q-19.5,-4 -26,0 Z" fill="#e2566e"/>' +
      '<path d="M0,-15 L-13,0 M0,-15 L13,0 M0,-15 L0,0" stroke="#fbd1d9" stroke-width="1" opacity=".8"/>';
  }
  function straw(col) {
    var stripes = '';
    for (var i = 0; i < 12; i++) stripes += '<rect x="-3.5" y="' + (i * 14) + '" width="7" height="6" fill="#fff" opacity=".85"/>';
    return '<rect x="-3.5" y="0" width="7" height="170" rx="2" fill="' + (col || '#c8343f') + '"/>' + stripes;
  }
  function cucumber() {
    return '<circle r="13" fill="#2f7a3a"/><circle r="11" fill="#cfe9b8"/><circle r="6" fill="#e8f5da"/>' +
      '<circle cx="-3" cy="-2" r="1" fill="#a7cf8a"/><circle cx="3" cy="1" r="1" fill="#a7cf8a"/><circle cx="0" cy="3.5" r="1" fill="#a7cf8a"/>';
  }
  function raspberry() {
    var s = '', pts = [[0, 0], [-4, -3], [4, -3], [-4, 3], [4, 3], [0, -6], [0, 6], [-7, 0], [7, 0]];
    pts.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.3" fill="#c21f4a"/><circle cx="' + (p[0] - 1) + '" cy="' + (p[1] - 1) + '" r="1" fill="#fff" opacity=".35"/>'; });
    return s;
  }
  function juniper() {
    return '<circle cx="-7" cy="0" r="4.5" fill="#2e3a6a"/><circle cx="3" cy="-2" r="4.5" fill="#3b4a80"/><circle cx="10" cy="3" r="4.5" fill="#28325c"/>' +
      '<circle cx="-8" cy="-1.5" r="1.2" fill="#fff" opacity=".35"/><circle cx="2" cy="-3.5" r="1.2" fill="#fff" opacity=".35"/>';
  }
  function strawberry() {
    var s = '<path d="M0,22 C-16,10 -16,-6 -10,-10 C-6,-12 -2,-10 0,-8 C2,-10 6,-12 10,-10 C16,-6 16,10 0,22 Z" fill="#d7263d"/>';
    [[-6, -2], [0, 2], [6, -2], [-4, 8], [4, 8], [0, 14], [-8, 4], [8, 4]].forEach(function (p) { s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx=".9" ry="1.4" fill="#ffd36b"/>'; });
    s += leaf(-4, -9, -70, 0.45, '#3f9a4a') + leaf(4, -9, 70, 0.45, '#3f9a4a') + leaf(0, -9, 0, 0.4, '#3f9a4a');
    return s;
  }
  function cinnamon() {
    return '<rect x="-4" y="-40" width="8" height="80" rx="3" fill="#8a4a20"/><rect x="-4" y="-40" width="3" height="80" rx="1.5" fill="#b26a35"/>' +
      '<ellipse cx="0" cy="-40" rx="4" ry="2" fill="#5a2c10"/>';
  }
  function dust(w, col) {
    var r = rng('dust' + w), s = '';
    for (var i = 0; i < 26; i++) s += '<circle cx="' + ((r() - 0.5) * w).toFixed(1) + '" cy="' + ((r() - 0.5) * 5).toFixed(1) + '" r="' + (0.8 + r() * 1.1).toFixed(1) + '" fill="' + col + '"/>';
    return s;
  }
  function cream(w) {
    var s = '', n = 5, step = w / (n - 1);
    for (var i = 0; i < n; i++) {
      var x = -w / 2 + i * step, rr = 12 + (i % 2 ? 3 : 0);
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + (i % 2 ? -4 : 0) + '" r="' + rr + '" fill="#fbf5ea"/>';
    }
    s += '<circle cx="0" cy="-14" r="13" fill="#fdf9f1"/><circle cx="0" cy="-26" r="7" fill="#fffdf8"/>';
    s += '<path d="M-' + (w / 2 + 8) + ',6 L' + (w / 2 + 8) + ',6" stroke="#e8dcc4" stroke-width="3" stroke-linecap="round"/>';
    return s;
  }
  function starfruit() {
    var s = '<path d="', n = 5;
    for (var i = 0; i < n * 2; i++) {
      var a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? 7 : 17;
      s += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1) + ' ';
    }
    s += 'Z" fill="#f2d24a" stroke="#c9a420" stroke-width="1.5" stroke-linejoin="round"/>';
    s += '<circle r="3" fill="#fff4b8"/>';
    return s;
  }
  function kumquat() {
    return '<ellipse rx="10" ry="13" fill="#f39a1e"/><ellipse cx="-3" cy="-4" rx="3" ry="4" fill="#fff" opacity=".3"/>' + leaf(0, -12, 30, 0.45, '#3f9a4a');
  }
  function driedOrange() {
    var c = ['#b8560c', '#e9b97a', '#d27a22'], s = '<circle r="17" fill="' + c[0] + '"/><circle r="14.6" fill="' + c[1] + '" opacity=".9"/><circle r="12.6" fill="' + c[2] + '" opacity=".85"/>';
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; s += '<line x1="0" y1="0" x2="' + (Math.cos(a) * 12.6).toFixed(1) + '" y2="' + (Math.sin(a) * 12.6).toFixed(1) + '" stroke="' + c[1] + '" stroke-width="1.6"/>'; }
    return s;
  }
  function chocoStreaks() {
    return '<path d="M-26,-40 C-20,-20 -30,0 -24,30 M0,-44 C6,-20 -4,0 2,34 M24,-40 C30,-18 20,4 26,30" stroke="#3a1a0c" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>';
  }

  var PRIM = {
    limoen: function () { return wheel('limoen'); }, citroen: function () { return wheel('citroen'); },
    sinaas: function () { return wheel('sinaas'); }, pompelmoes: function () { return wheel('pompelmoes'); },
    limoenpartjes: function () { return wedge('limoen'); }, kers: cherry, munt: sprig,
    'munt-blad': function () { return leaf(0, 8, 70, 0.8); }, bonen: beans, olijf: olivePick,
    twist: function () { return twist('#ecc928'); }, 'twist-oranje': function () { return twist('#ee8a1e'); },
    ananas: pineapple, selder: celery, parapluutje: umbrella, rietje: straw, komkommer: cucumber,
    framboos: raspberry, bessen: juniper, aardbei: strawberry, kaneel: cinnamon,
    slagroom: function () { return cream(50); }, cacao: function () { return dust(40, '#5a2e14'); },
    nootmuskaat: function () { return dust(40, '#8a5a2e'); }, stervrucht: starfruit, kumquat: kumquat,
    'gedroogde-sinaas': driedOrange, chocostrepen: chocoStreaks,
    zoutrand: function () { return '<path d="M-30,0 Q0,-10 30,0" stroke="#fff" stroke-width="7" stroke-dasharray="1 3.2" stroke-linecap="round" fill="none"/><path d="M-30,6 Q0,-4 30,6" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>'; },
    suikerrand: function () { return '<path d="M-30,0 Q0,-10 30,0" stroke="#f6e7c3" stroke-width="7" stroke-dasharray="1 3.2" stroke-linecap="round" fill="none"/><path d="M-30,6 Q0,-4 30,6" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>'; }
  };

  function at(x, y, s, inner, cls, d) {
    return '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + s + ')"><g class="' + (cls || '') + '"' + (d != null ? ' style="--d:' + d.toFixed(2) + 's"' : '') + '>' + inner + '</g></g>';
  }

  /* ---------- Hoofdfunctie ---------- */
  function svg(c, o) {
    o = o || {};
    var g = G[c.g] || G.highball;
    var id = 'g' + (++uid);
    var level = o.level == null ? 1 : o.level;      // tot waar het glas gevuld is (0..1 van de drank)
    var from = o.from == null ? 0 : o.from;          // tot waar het al gevuld wás (statisch)
    var showIce = o.ice == null ? true : o.ice;
    var showGarnish = o.garnish == null ? true : o.garnish;
    var animate = o.animate !== false;
    var pourT = o.pourTime || 1.5;
    var rnd = rng(c.id || c.n || 'x');
    var full = g.fill;
    var H = (g.yBot - g.yTop) * full;
    var foamH = c.foam ? Math.min(12, H * 0.14) : 0;
    var liqH = H - foamH;
    var yLevel = g.yBot - liqH * level - (level >= 1 ? foamH : 0);
    var yFull = g.yBot - H;
    var alpha = c.alpha == null ? 0.85 : c.alpha;
    var hasIce = showIce && g.ice && c.ice && c.ice !== 'none';
    var iceDelay = 0;
    var pourStart = hasIce && animate && from === 0 ? 0.35 : 0.05;
    var s = '';

    // Defs
    s += '<defs>' +
      '<clipPath id="' + id + 'i"><path d="' + g.inner + '"/></clipPath>' +
      '<clipPath id="' + id + 'l"><rect x="0" y="' + (yLevel).toFixed(1) + '" width="200" height="' + (g.yBot - yLevel + 2).toFixed(1) + '"/></clipPath>' +
      '<linearGradient id="' + id + 's" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".22" stop-color="#fff" stop-opacity=".04"/><stop offset=".7" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity=".16"/></linearGradient>' +
      '<linearGradient id="' + id + 'd" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".28" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>' +
      '<linearGradient id="' + id + 'v" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      '<radialGradient id="' + id + 'c" cx=".7" cy=".6" r=".9"><stop offset="0" stop-color="#e79a5e"/><stop offset=".55" stop-color="#b8612e"/><stop offset="1" stop-color="#6e3416"/></radialGradient>' +
      '</defs>';

    // Schaduw op de toog
    s += '<ellipse cx="100" cy="236" rx="62" ry="6" fill="#000" opacity=".38"/>';
    if (g.base) s += '<path d="' + g.base + '" fill="#fff" fill-opacity=".13" stroke="#fff" stroke-opacity=".42" stroke-width="1.4"/>';

    var gk = showGarnish ? (c.gk || []) : [];
    var rx1 = g.rim.x1, rx2 = g.rim.x2, ry = g.rim.y, rw = rx2 - rx1, cx = (rx1 + rx2) / 2;

    // Rietje en selder achter de vloeistof
    if (gk.indexOf('rietje') > -1) s += '<g transform="translate(' + (cx + rw * 0.18) + ',' + (ry - 46) + ') rotate(12)">' + '<g class="gar" style="--d:' + (pourStart + pourT + 0.1).toFixed(2) + 's">' + straw(c.cat === 'mocktail' ? '#2f8f6a' : '#c8343f') + '</g></g>';
    if (gk.indexOf('selder') > -1) s += at(cx - rw * 0.12, ry - 34, 1, '<g transform="rotate(-8)">' + celery() + '</g>', 'gar', pourStart + pourT + 0.1);
    if (gk.indexOf('kaneel') > -1) s += at(cx + rw * 0.16, ry + 4, 1, '<g transform="rotate(18)">' + cinnamon() + '</g>', 'gar', pourStart + pourT + 0.15);

    // Binnenkant van het glas
    s += '<g clip-path="url(#' + id + 'i)">';
    s += '<path d="' + g.inner + '" fill="#fff" fill-opacity=".035"/>';

    // Straal bij het inschenken
    if (o.stream && animate && level > from) {
      var topCol = c.L[c.L.length - 1][0];
      s += '<rect class="stream" x="98" y="0" width="4.5" height="' + g.yBot + '" rx="2" fill="' + topCol + '" style="--t:' + pourT + 's;--d:' + pourStart + 's"/>';
    }

    // Lagen opbouwen: stukken tussen 0 en level
    var pieces = [], acc = 0;
    c.L.forEach(function (l) {
      var a0 = acc, a1 = acc + l[1];
      acc = a1;
      var lo = Math.max(a0, 0), hi = Math.min(a1, level);
      if (hi <= lo) return;
      if (lo < from && hi > from) { pieces.push([lo, from, l[0], false]); pieces.push([from, hi, l[0], true]); }
      else pieces.push([lo, hi, l[0], lo >= from]);
    });
    var animSpan = Math.max(0.0001, level - from);
    s += '<g class="liquid">';
    pieces.forEach(function (p) {
      var y1 = g.yBot - liqH * p[1], y0 = g.yBot - liqH * p[0];
      var h = y0 - y1 + 0.6;
      var attrs = 'x="0" y="' + y1.toFixed(1) + '" width="200" height="' + h.toFixed(1) + '" fill="' + p[2] + '" fill-opacity="' + alpha.toFixed(2) + '"';
      if (p[3] && animate) {
        var d = pourStart + pourT * (p[0] - from) / animSpan;
        var dur = Math.max(0.12, pourT * (p[1] - p[0]) / animSpan);
        s += '<rect class="layer" ' + attrs + ' style="--d:' + d.toFixed(2) + 's;--dur:' + dur.toFixed(2) + 's"/>';
      } else s += '<rect ' + attrs + '/>';
    });
    // Zachte overgang tussen lagen (gelaagde drankjes blijven scherp)
    if (pieces.length > 1 && c.m !== 'layered') {
      pieces.slice(1).forEach(function (p) {
        var y = g.yBot - liqH * p[0];
        s += '<rect x="0" y="' + (y - 3).toFixed(1) + '" width="200" height="6" fill="' + p[2] + '" fill-opacity=".35" class="' + (p[3] && animate ? 'fadein' : '') + '" style="--d:' + (pourStart + pourT).toFixed(2) + 's"/>';
      });
    }
    // Schuimlaag
    if (c.foam && level >= 1) {
      var fy = g.yBot - liqH - foamH;
      var fd = pourStart + pourT;
      s += '<g class="' + (animate && from < 1 ? 'layer' : '') + '" style="--d:' + fd.toFixed(2) + 's;--dur:.45s">';
      s += '<rect x="0" y="' + fy.toFixed(1) + '" width="200" height="' + (foamH + 1).toFixed(1) + '" fill="' + c.foam + '"/>';
      for (var fb = 0; fb < 14; fb++) s += '<circle cx="' + (30 + rnd() * 140).toFixed(1) + '" cy="' + (fy + 2 + rnd() * (foamH - 3)).toFixed(1) + '" r="' + (0.8 + rnd() * 1.4).toFixed(1) + '" fill="#fff" opacity=".45"/>';
      s += '</g>';
    }
    // Volume-schaduw
    if (level > 0) s += '<rect x="0" y="' + yLevel.toFixed(1) + '" width="200" height="' + (g.yBot - yLevel).toFixed(1) + '" fill="url(#' + id + 'v)" class="' + (animate && from === 0 ? 'fadein' : '') + '" style="--d:' + pourStart + 's"/>';
    // Oppervlak (meniscus)
    if (level > 0) {
      var surfAttr = 'x="0" y="' + (yLevel - 1).toFixed(1) + '" width="200" height="3" fill="#fff" fill-opacity=".38"';
      if (animate && level > from) {
        var yFrom = g.yBot - liqH * from;
        s += '<rect class="surface" ' + surfAttr + ' style="--h:' + (yFrom - yLevel).toFixed(1) + 'px;--t:' + pourT + 's;--d:' + pourStart + 's"/>';
      } else s += '<rect ' + surfAttr + '/>';
    }
    s += '</g>';

    // Bubbels
    if (c.fizz && level > 0.2) {
      s += '<g clip-path="url(#' + id + 'l)" class="bubbles">';
      var nb = Math.round(10 + (g.yBot - yLevel) / 9);
      var bx0 = g.ice ? g.ice[0] : rx1 + rw * 0.25, bx1 = g.ice ? g.ice[1] : rx2 - rw * 0.25;
      if (c.g === 'martini' || c.g === 'margarita' || c.g === 'coupe') { bx0 = cx - 18; bx1 = cx + 18; }
      if (c.g === 'flute') { bx0 = 90; bx1 = 110; }
      for (var b = 0; b < nb; b++) {
        var bx = bx0 + rnd() * (bx1 - bx0), br = 0.9 + rnd() * 1.8;
        s += '<circle class="bubble" cx="' + bx.toFixed(1) + '" cy="' + (g.yBot - 2).toFixed(1) + '" r="' + br.toFixed(1) + '" fill="#fff" fill-opacity=".55" style="--rise:-' + (g.yBot - yLevel + 4).toFixed(0) + 'px;--bd:' + (rnd() * 3).toFixed(2) + 's;--bt:' + (1.6 + rnd() * 1.8).toFixed(2) + 's"/>';
      }
      s += '</g>';
    }

    // IJs
    if (hasIce) {
      var surfY = level > 0 ? yLevel : g.yBot - 10;
      if (c.ice === 'crushed') {
        for (var k = 0; k < 34; k++) {
          var kx = g.ice[0] + rnd() * (g.ice[1] - g.ice[0]);
          var ky = Math.max(g.yTop + 4, Math.min(yFull, surfY) - 8) + rnd() * (g.yBot - Math.min(yFull, surfY));
          var ks = 5 + rnd() * 7;
          s += '<g transform="translate(' + kx.toFixed(1) + ',' + ky.toFixed(1) + ') rotate(' + (rnd() * 90).toFixed(0) + ')"><path class="ice" style="--d:' + (rnd() * 0.3).toFixed(2) + 's" d="M0,0 L' + ks + ',' + (ks * 0.2).toFixed(1) + ' L' + (ks * 0.7).toFixed(1) + ',' + ks + ' L' + (-ks * 0.2).toFixed(1) + ',' + (ks * 0.6).toFixed(1) + ' Z" fill="#fff" fill-opacity=".34" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/></g>';
        }
      } else {
        var big = c.ice === 'big';
        var sz = big ? 46 : g.iceS;
        var n = big ? 1 : Math.max(2, Math.floor((g.ice[1] - g.ice[0]) / (sz * 0.92)));
        var rows = big ? 1 : (g.yBot - surfY > sz * 2.4 ? 2 : 1);
        var cnt = 0;
        for (var r2 = 0; r2 < rows; r2++) {
          for (var i = 0; i < n; i++) {
            var span = (g.ice[1] - g.ice[0] - sz);
            var ix = big ? cx - sz / 2 : g.ice[0] + (n > 1 ? span * i / (n - 1) : span / 2) + (rnd() - 0.5) * 4;
            var iy = (level > 0 ? surfY - sz * 0.32 : g.yBot - sz - 2) + r2 * sz * 0.9 + (rnd() - 0.5) * 6;
            if (big) iy = Math.min(g.yBot - sz - 2, (level > 0 ? surfY - 12 : g.yBot - sz - 2));
            var rot = (rnd() - 0.5) * 24;
            s += '<g transform="translate(' + (ix + sz / 2).toFixed(1) + ',' + (iy + sz / 2).toFixed(1) + ') rotate(' + rot.toFixed(0) + ')"><g class="ice" style="--d:' + (iceDelay + cnt * 0.07).toFixed(2) + 's">' +
              '<rect x="' + (-sz / 2) + '" y="' + (-sz / 2) + '" width="' + sz + '" height="' + sz + '" rx="' + (sz * 0.18).toFixed(1) + '" fill="#fff" fill-opacity=".2" stroke="#fff" stroke-opacity=".62" stroke-width="1.2"/>' +
              '<path d="M' + (-sz / 2 + 4) + ',' + (-sz / 2 + 6) + ' L' + (-sz / 2 + 4) + ',' + (sz / 2 - 8) + '" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>' +
              '<path d="M' + (-sz / 2 + 7) + ',' + (-sz / 2 + 4) + ' L' + (sz / 2 - 8) + ',' + (-sz / 2 + 4) + '" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" stroke-linecap="round"/></g></g>';
            cnt++;
          }
        }
      }
    }

    // Garnituur in het glas
    var gd = pourStart + pourT + 0.15;
    var inLiquidY = Math.max(yLevel + 18, g.yBot - (g.yBot - yLevel) * 0.45);
    if (gk.indexOf('komkommer') > -1) s += at(g.rim.x1 + rw * 0.3, inLiquidY, 0.9, cucumber(), 'gar-in', gd);
    if (gk.indexOf('limoenpartjes') > -1) s += at(cx - 14, g.yBot - 16, 0.9, wedge('limoen'), 'gar-in', gd) + at(cx + 16, g.yBot - 26, 0.8, '<g transform="rotate(160)">' + wedge('limoen') + '</g>', 'gar-in', gd);
    if (gk.indexOf('framboos') > -1) s += at(100, g.yBot - 12, 0.8, raspberry(), 'gar-in', gd);
    if (gk.indexOf('chocostrepen') > -1) s += at(cx, (g.yTop + g.yBot) / 2, 1, chocoStreaks(), 'gar-in', 0);
    if (gk.indexOf('bessen') > -1) s += at(cx + 8, yLevel + 6, 0.8, juniper(), 'gar-in', gd);
    s += '<rect x="0" y="0" width="200" height="260" fill="url(#' + id + 'd)"/>';
    s += '</g>';

    // Koperen mok (ondoorzichtig)
    if (g.opaque) {
      s += '<path d="M146,100 C178,100 180,186 144,186" stroke="url(#' + id + 'c)" stroke-width="9" fill="none" stroke-linecap="round"/>';
      s += '<path d="' + g.outer + ' Z" fill="url(#' + id + 'c)"/>';
      for (var hm = 0; hm < 18; hm++) s += '<ellipse cx="' + (60 + rnd() * 76).toFixed(0) + '" cy="' + (92 + rnd() * 128).toFixed(0) + '" rx="' + (3 + rnd() * 4).toFixed(1) + '" ry="' + (2 + rnd() * 3).toFixed(1) + '" fill="#fff" opacity="' + (0.05 + rnd() * 0.12).toFixed(2) + '"/>';
      s += '<rect x="64" y="90" width="7" height="126" rx="3.5" fill="#fff" opacity=".2"/>';
      s += '<path d="M50,96 L146,96" stroke="#5a2a10" stroke-opacity=".35" stroke-width="1.5"/><path d="M53,208 L143,208" stroke="#5a2a10" stroke-opacity=".35" stroke-width="1.5"/>';
      // Opening met drank
      if (level > 0) s += '<ellipse cx="98" cy="' + (ry + 3) + '" rx="46" ry="6" fill="' + shade(c.L[c.L.length - 1][0], -0.25) + '" class="' + (animate ? 'fadein' : '') + '" style="--d:' + (pourStart + pourT * 0.7).toFixed(2) + 's"/>';
      if (hasIce) {
        s += '<g class="ice" style="--d:.1s"><rect x="66" y="' + (ry - 14) + '" width="24" height="20" rx="4" transform="rotate(-12 78 ' + ry + ')" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-opacity=".7"/></g>';
        s += '<g class="ice" style="--d:.2s"><rect x="104" y="' + (ry - 12) + '" width="24" height="18" rx="4" transform="rotate(10 116 ' + ry + ')" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-opacity=".7"/></g>';
      }
      s += '<ellipse cx="98" cy="' + ry + '" rx="48" ry="7" fill="none" stroke="#f2b07a" stroke-width="2.5"/>';
    } else {
      // Glazen wand
      if (g.handle) s += '<path d="' + g.handle + '" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/><path d="' + g.handle + '" stroke="#fff" stroke-opacity=".12" stroke-width="10" fill="none" stroke-linecap="round"/>';
      s += '<path d="' + g.outer + '" fill="url(#' + id + 's)" stroke="#fff" stroke-opacity=".6" stroke-width="2.2" stroke-linejoin="round"/>';
      s += '<g clip-path="url(#' + id + 'i)"><rect x="' + (rx1 + 9) + '" y="' + (g.yTop + 8) + '" width="5" height="' + ((g.yBot - g.yTop) * 0.62).toFixed(0) + '" rx="2.5" fill="#fff" opacity=".22"/></g>';
      s += '<ellipse cx="' + cx + '" cy="' + ry + '" rx="' + (rw / 2) + '" ry="' + (c.g === 'shot' ? 3 : 4.5) + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>';
    }

    // Garnituur boven en op de rand
    if (gk.indexOf('zoutrand') > -1 || gk.indexOf('suikerrand') > -1) {
      var col = gk.indexOf('zoutrand') > -1 ? '#ffffff' : '#f3e2b8';
      s += '<g class="gar" style="--d:0s"><ellipse cx="' + cx + '" cy="' + ry + '" rx="' + (rw / 2) + '" ry="4.5" fill="none" stroke="' + col + '" stroke-width="4" stroke-opacity=".9" stroke-dasharray="0.4 3.2" stroke-linecap="round"/></g>';
    }
    if (gk.indexOf('slagroom') > -1 && level >= 1) s += at(cx, yFull - 4, Math.min(1.1, rw / 90), cream(Math.min(56, rw * 0.62)), 'gar', gd);
    if (gk.indexOf('cacao') > -1 && level >= 1) s += at(cx, gk.indexOf('slagroom') > -1 ? yFull - 24 : yFull - 1, 1, dust(gk.indexOf('slagroom') > -1 ? 30 : rw * 0.5, '#5a2e14'), 'gar', gd + 0.2);
    if (gk.indexOf('nootmuskaat') > -1 && level >= 1) s += at(cx, yFull - 1, 1, dust(rw * 0.45, '#8a5a2e'), 'gar', gd + 0.2);
    if (gk.indexOf('bonen') > -1 && level >= 1) s += at(cx, yFull - 2, 1, beans(), 'gar', gd + 0.1);
    if (gk.indexOf('munt-blad') > -1 && level >= 1) s += at(cx + 6, yFull - 4, 1, leaf(0, 8, 70, 0.8), 'gar', gd);
    if (gk.indexOf('olijf') > -1) s += at(cx + rw * 0.18, ry + 18, 1, '<g transform="rotate(-24)">' + olivePick() + '</g>', 'gar', gd);
    if (gk.indexOf('munt') > -1) s += at(cx - rw * 0.2, ry + 4, 1.05, sprig(), 'gar', gd);
    if (gk.indexOf('parapluutje') > -1) s += at(cx - rw * 0.28, ry - 30, 0.95, '<g transform="rotate(-22)">' + umbrella() + '</g>', 'gar', gd + 0.25);
    var wheelKind = ['limoen', 'citroen', 'sinaas', 'pompelmoes'].filter(function (k) { return gk.indexOf(k) > -1; })[0];
    if (wheelKind) s += at(rx2 - 4, ry - 2, c.g === 'shot' ? 0.75 : 1, wheel(wheelKind), 'gar', gd + 0.05);
    if (gk.indexOf('ananas') > -1) s += at(wheelKind ? rx1 + 10 : rx2 - 6, ry + 2, 0.9, pineapple(), 'gar', gd + 0.1);
    if (gk.indexOf('aardbei') > -1) s += at(rx2 - 4, ry - 6, 0.9, strawberry(), 'gar', gd + 0.1);
    if (gk.indexOf('twist') > -1 || gk.indexOf('twist-oranje') > -1) s += at(wheelKind ? rx1 + 4 : rx2 - 4, ry - 4, 0.9, twist(gk.indexOf('twist') > -1 ? '#ecc928' : '#ee8a1e'), 'gar', gd + 0.1);
    if (gk.indexOf('kers') > -1) {
      var kx2 = gk.indexOf('slagroom') > -1 ? cx : (level >= 1 && !c.g.match(/martini|coupe|margarita/) ? cx + rw * 0.12 : cx + rw * 0.08);
      var ky2 = gk.indexOf('slagroom') > -1 ? yFull - 34 : (c.g.match(/martini|coupe|margarita/) ? yFull + 14 : yFull - 4);
      s += at(kx2, ky2, 1, cherry(), 'gar drop', gd + 0.3);
    }

    var cls = 'glass-svg' + (animate ? ' pour' : '') + (o.paused ? ' paused' : '');
    var label = o.label === false ? '' : ' role="img" aria-label="' + (c.n || 'Cocktail') + ' in een ' + (c.glassName || 'glas') + '"';
    return '<svg class="' + cls + '" viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg"' + label + (o.label === false ? ' aria-hidden="true"' : '') + '>' + s + '</svg>';
  }

  // Losse garnituur-illustratie (voor de gids)
  function garnishIcon(key, bg) {
    var inner = (PRIM[key] || PRIM.limoen)();
    var scale = { rietje: 0.45, selder: 0.6, kaneel: 0.9, olijf: 0.85, twist: 1, 'twist-oranje': 1, parapluutje: 1.2, slagroom: 1, munt: 1.7, ananas: 1.2, chocostrepen: 0.9 }[key] || 2;
    var dy = { twist: -26, 'twist-oranje': -26, olijf: 0, munt: 14, ananas: 20, selder: -30, rietje: -40, parapluutje: 4, slagroom: 10, zoutrand: 6, suikerrand: 6, cacao: 0, nootmuskaat: 0 }[key] || 0;
    if (key === 'cacao' || key === 'nootmuskaat') inner = '<ellipse cx="0" cy="0" rx="26" ry="6" fill="#efe1c8"/>' + inner;
    if (key === 'zoutrand' || key === 'suikerrand') inner = '<path d="M-30,0 L-24,30 L24,30 L30,0" stroke="#fff" stroke-opacity=".5" fill="none" stroke-width="1.5"/>' + inner;
    return '<svg viewBox="-50 -50 100 100" class="garnish-icon" aria-hidden="true">' + (bg ? '<circle r="48" fill="' + bg + '"/>' : '') +
      '<g transform="translate(0,' + dy + ') scale(' + scale + ')">' + inner + '</g></svg>';
  }

  /* ---------- Bargereedschap voor de shakermodus ---------- */
  function tool(kind, liquidCol) {
    liquidCol = liquidCol || '#c98a4a';
    var s = '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" class="tool-svg tool-' + kind + '" aria-hidden="true"><defs>' +
      '<linearGradient id="steel" x1="0" x2="1"><stop offset="0" stop-color="#6d7175"/><stop offset=".25" stop-color="#e9edf0"/><stop offset=".5" stop-color="#9aa0a5"/><stop offset=".8" stop-color="#d7dbde"/><stop offset="1" stop-color="#5d6165"/></linearGradient></defs>' +
      '<ellipse cx="100" cy="240" rx="60" ry="6" fill="#000" opacity=".35"/>';
    if (kind === 'shaker') {
      s += '<g class="shaker-body">' +
        '<path d="M64,96 L74,232 L126,232 L136,96 Z" fill="url(#steel)"/>' +
        '<path d="M60,82 L140,82 L136,98 L64,98 Z" fill="url(#steel)"/>' +
        '<path d="M70,50 L130,50 L140,82 L60,82 Z" fill="url(#steel)"/>' +
        '<path d="M84,26 L116,26 L122,50 L78,50 Z" fill="url(#steel)"/>' +
        '<rect x="88" y="16" width="24" height="12" rx="4" fill="url(#steel)"/>' +
        '<rect x="80" y="110" width="6" height="110" rx="3" fill="#fff" opacity=".35"/>' +
        '<g class="frost"><circle cx="110" cy="150" r="1.6" fill="#fff" opacity=".7"/><circle cx="118" cy="176" r="1.2" fill="#fff" opacity=".6"/><circle cx="96" cy="196" r="1.4" fill="#fff" opacity=".6"/><circle cx="104" cy="130" r="1" fill="#fff" opacity=".6"/></g>' +
        '</g>';
    } else if (kind === 'mengglas') {
      s += '<path d="M54,70 L60,226 Q61,234 70,234 L130,234 Q139,234 140,226 L146,70" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".55" stroke-width="2.2"/>' +
        '<clipPath id="mgc"><path d="M58,74 L64,222 L136,222 L142,74 Z"/></clipPath>' +
        '<g clip-path="url(#mgc)"><rect x="0" y="120" width="200" height="110" fill="' + liquidCol + '" opacity=".8"/>' +
        '<rect x="66" y="104" width="26" height="26" rx="5" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-opacity=".6"/><rect x="104" y="110" width="26" height="26" rx="5" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-opacity=".6"/><rect x="84" y="140" width="26" height="26" rx="5" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-opacity=".6"/></g>' +
        '<g class="spoon"><path d="M100,10 L100,214" stroke="url(#steel)" stroke-width="4"/><path d="M100,40 C104,46 96,52 100,58 C104,64 96,70 100,76" stroke="#cfd4d8" stroke-width="5" fill="none"/><ellipse cx="100" cy="216" rx="6" ry="9" fill="url(#steel)"/></g>' +
        '<ellipse cx="100" cy="70" rx="46" ry="5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/>';
    } else if (kind === 'blender') {
      s += '<g class="blender-body"><path d="M58,40 L142,40 L132,170 L68,170 Z" fill="#fff" fill-opacity=".1" stroke="#fff" stroke-opacity=".55" stroke-width="2.2"/>' +
        '<clipPath id="blc"><path d="M62,44 L138,44 L129,168 L71,168 Z"/></clipPath>' +
        '<g clip-path="url(#blc)"><g class="vortex"><path d="M60,100 Q100,86 140,100 L140,170 L60,170 Z" fill="' + liquidCol + '" opacity=".85"/><path d="M80,120 Q100,150 120,120" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/></g></g>' +
        '<rect x="54" y="30" width="92" height="12" rx="4" fill="#3a3030"/>' +
        '<path d="M66,170 L134,170 L146,232 L54,232 Z" fill="#2a2222" stroke="#5a4a4a"/>' +
        '<circle cx="100" cy="204" r="9" fill="#d9a441"/></g>';
    }
    s += '</svg>';
    return s;
  }

  window.GlassArt = { svg: svg, garnishIcon: garnishIcon, tool: tool, GEOM: G, PRIM: PRIM, shade: shade };
})();
