/* Tom's Cocktails — app */
(function () {
  'use strict';
  var D = window.TC_DATA, GA = window.GlassArt, LX = window.TC_LEX, AU = window.TCAudio;
  var ING = D.ING;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var main = $('#main');

  /* ---------- Opslag (altijd met try/catch) ---------- */
  var store = {
    get: function (k, fb) {
      try { var v = window.localStorage.getItem('tc.' + k); return v == null ? fb : JSON.parse(v); } catch (e) { return fb; }
    },
    set: function (k, v) {
      try { window.localStorage.setItem('tc.' + k, JSON.stringify(v)); return true; } catch (e) { return false; }
    },
    del: function (k) { try { window.localStorage.removeItem('tc.' + k); } catch (e) { /* niets */ } }
  };

  /* ---------- Toestand ---------- */
  var BAR_IDS = ['thuis', 'zomer', 'feest'];
  var DEFAULT_BARS = { active: 'thuis', list: { thuis: { name: 'Thuis', items: [] }, zomer: { name: 'Zomerbar', items: [] }, feest: { name: 'Feest', items: [] } } };
  var state = {
    fav: store.get('fav', []),
    bars: store.get('bars', null) || JSON.parse(JSON.stringify(DEFAULT_BARS)),
    list: store.get('list', []),
    presets: store.get('presets', []),
    own: store.get('own', []),
    ownIng: store.get('ownIng', []),
    prices: store.get('prices', {}),
    settings: Object.assign({ theme: 'bar', sfx: true, music: false, reduce: false }, store.get('settings', {})),
    ai: Object.assign({ enabled: false }, store.get('ai', {})),
    filters: null,
    hero: null
  };
  BAR_IDS.forEach(function (b) { if (!state.bars.list[b]) state.bars.list[b] = JSON.parse(JSON.stringify(DEFAULT_BARS.list[b])); });

  function emptyFilters() { return { q: '', cat: 'alle', fams: [], tastes: [], occ: [], strength: [], types: [], af: false, max5: false, myBar: false, sort: 'naam' }; }
  state.filters = Object.assign(emptyFilters(), store.get('filters', {}));

  /* ---------- Hulpfuncties ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(n, dec) {
    if (dec == null) dec = 1;
    var r = Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec);
    return String(r).replace('.', ',');
  }
  function euro(n) { return '€ ' + (Math.round(n * 100) / 100).toFixed(2).replace('.', ','); }
  function frac(n) {
    var w = Math.floor(n), r = n - w;
    var f = r > 0.2 && r < 0.3 ? '¼' : r >= 0.3 && r < 0.4 ? '⅓' : r >= 0.4 && r < 0.6 ? '½' : r >= 0.6 && r < 0.8 ? '¾' : '';
    if (!f) return String(Math.round(n));
    return (w ? w : '') + f;
  }
  function plural(n, a, b) { return n === 1 ? a : b; }
  function byId(id) {
    for (var i = 0; i < ALL.length; i++) if (ALL[i].id === id) return ALL[i];
    return null;
  }
  function priceOf(id) { return state.prices[id] != null ? state.prices[id] : (ING[id] ? ING[id].price : 0); }
  function saveSettings() { store.set('settings', state.settings); }

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ---------- Eigen ingrediënten en recepten ---------- */
  function loadOwnIngredients() {
    state.ownIng.forEach(function (o) {
      if (!o || !o.id) return;
      ING[o.id] = {
        id: o.id, name: String(o.name || 'eigen ingrediënt'), abv: +o.abv || 0, col: /^#[0-9a-f]{6}$/i.test(o.col) ? o.col : '#c98a4a',
        a: +o.abv > 0 ? 0.6 : 0.8, grp: o.grp && D.GRP_NAMES[o.grp] ? o.grp : 'vers', fam: o.abv > 0 ? 'likeur' : null,
        fizz: !!o.fizz, buy: { t: 'fles', s: +o.size || 70 }, cnt: null, stcl: 0, short: String(o.name || ''),
        price: +o.price || 0, note: String(o.note || ''), own: true
      };
    });
  }
  loadOwnIngredients();

  var ALL = [];
  function sanitizeRecipe(r) {
    if (!r || typeof r !== 'object' || !Array.isArray(r.i)) return null;
    var c = {
      id: String(r.id || ('eigen-' + Date.now())).replace(/[^a-z0-9\-]/gi, '').slice(0, 60) || ('eigen-' + Date.now()),
      n: String(r.n || 'Naamloos recept').slice(0, 60), cat: 'eigen', own: true,
      g: D.GLASS_NAMES[r.g] ? r.g : 'rocks', m: D.METHOD_NAMES[r.m] ? r.m : 'built',
      ice: ['cubes', 'crushed', 'none', 'big'].indexOf(r.ice) > -1 ? r.ice : 'cubes',
      i: r.i.filter(function (x) { return Array.isArray(x) && ING[x[0]] && +x[1] > 0; }).slice(0, 20).map(function (x) {
        return [x[0], Math.min(100, +x[1]), ['cl', 'dash', 'st', 'bl', 'tl'].indexOf(x[2]) > -1 ? x[2] : 'cl', x[3] === 't' || x[3] === 'f' ? x[3] : undefined].filter(function (v) { return v !== undefined; });
      }),
      gar: String(r.gar || 'Geen').slice(0, 140), gk: Array.isArray(r.gk) ? r.gk.filter(function (k) { return GA.PRIM[k]; }).slice(0, 4) : [],
      t: Array.isArray(r.t) ? r.t.filter(function (k) { return D.TASTES.indexOf(k) > -1; }) : [],
      o: Array.isArray(r.o) ? r.o.filter(function (k) { return D.OCCASIONS[k]; }) : [],
      d: Math.max(1, Math.min(3, +r.d || 1)), s: String(r.s || '').slice(0, 400), prep: String(r.prep || '').slice(0, 1500),
      hot: r.m === 'hot'
    };
    if (!c.i.length) return null;
    return c;
  }
  function rebuildAll() {
    var own = [];
    state.own.forEach(function (r) {
      var c = sanitizeRecipe(r);
      if (c) { own.push(D.enrich(c)); }
    });
    ALL = D.COCKTAILS.concat(own);
  }
  rebuildAll();

  /* ---------- Bars ---------- */
  function activeBar() { return state.bars.list[state.bars.active] || state.bars.list.thuis; }
  function inBar(id, barId) { var b = barId ? state.bars.list[barId] : activeBar(); return b.items.indexOf(id) > -1; }
  function toggleBarItem(id, barId) {
    var b = barId ? state.bars.list[barId] : activeBar();
    var i = b.items.indexOf(id);
    if (i > -1) b.items.splice(i, 1); else b.items.push(id);
    store.set('bars', state.bars);
  }
  function missing(c, barId) {
    var b = barId ? state.bars.list[barId] : activeBar();
    return c.needs.filter(function (id) { return b.items.indexOf(id) < 0; });
  }

  /* ---------- Hoeveelheden, kosten, stappen ---------- */
  function amountText(row, mult) {
    mult = mult || 1;
    var ing = ING[row[0]], a = row[1] * mult, u = row[2] || 'cl';
    if (row[0] === 'zout') return 'een snuifje zout en peper';
    if (u === 'st') { var n = a < 1 ? a : Math.round(a * 2) / 2; var cnt = ing.cnt || [ing.name, ing.name]; return frac(n) + ' ' + (n <= 1 ? cnt[0] : cnt[1]); }
    if (u === 'dash') { var dn = Math.max(1, Math.round(a)); return dn + ' ' + plural(dn, 'dash', 'dashes') + ' ' + ing.name; }
    if (u === 'bl') return frac(a) + ' ' + plural(a, 'barlepel', 'barlepels') + ' ' + ing.name;
    if (u === 'tl') return frac(a) + ' ' + plural(a, 'theelepel', 'theelepels') + ' ' + ing.name;
    return num(a) + ' cl ' + ing.name;
  }
  function amountParts(row, mult) {
    var t = amountText(row, mult), ing = ING[row[0]];
    var idx = t.lastIndexOf(ing.name);
    if (idx > 0 && row[2] !== 'st') return { amt: t.slice(0, idx).trim(), name: ing.name };
    return { amt: '', name: t };
  }
  function rowCost(row) {
    var ing = ING[row[0]]; if (!ing || !ing.buy) return 0;
    var p = priceOf(row[0]);
    if (ing.buy.st) return (row[1] / ing.buy.s) * p;
    return (D.ingVolume(row) / ing.buy.s) * p;
  }
  function costPerGlass(c) { return c.i.reduce(function (s, r) { return s + rowCost(r); }, 0); }

  var TOOL_FOR = { shaken: 'shaker', stirred: 'mengglas', blended: 'blender' };
  function buildSteps(c, mult) {
    mult = mult || 1;
    var steps = [], gname = c.glassName, total = c.vol || 1, acc = 0;
    var tops = c.i.filter(function (r) { return r[3] === 't' || r[3] === 'f'; });
    var mains = c.i.filter(function (r) { return !(r[3] === 't' || r[3] === 'f'); });
    var glassIce = c.ice !== 'none';
    var tool = TOOL_FOR[c.m];
    var addGlass = function (r, title, extra) {
      acc += D.ingVolume(r);
      steps.push({ k: 'add', tool: 'glass', title: title, big: amountText(r, mult), text: extra || '', level: Math.min(1, acc / total), ing: r[0] });
    };
    if (c.hot) steps.push({ k: 'prep', title: 'Verwarm je glas', text: 'Spoel je ' + gname + ' om met heet water en giet het weg. Zo blijft je drankje langer warm.' });
    else if (!glassIce && /martini|coupe|margarita|flute/.test(c.g)) steps.push({ k: 'prep', title: 'Koel je glas', text: 'Vul je ' + gname + ' met ijs en water, of zet het tien minuten in de diepvries.' });
    if (c.gk.indexOf('zoutrand') > -1 || c.gk.indexOf('suikerrand') > -1) {
      var zout = c.gk.indexOf('zoutrand') > -1;
      steps.push({ k: 'prep', title: zout ? 'Maak een zoutrandje' : 'Maak een suikerrandje', text: 'Wrijf een partje ' + (zout ? 'limoen' : 'citroen') + ' over de buitenrand en rol het glas door het ' + (zout ? 'zout.' : 'suiker.'), rim: true });
    }
    if (c.m === 'muddled') {
      var mud = mains.filter(function (r) { return /munt|limoen|suiker|siroop|sap/.test(r[0]) && !ING[r[0]].abv; });
      var rest = mains.filter(function (r) { return mud.indexOf(r) < 0; });
      mud.forEach(function (r) { addGlass(r, 'Doe in je glas'); });
      steps.push({ k: 'timer', act: 'muddle', sec: 8, tool: 'glass', title: 'Kneus zachtjes', text: 'Druk met een stamper een paar keer zacht op de ingrediënten. Niet wrijven.', level: acc / total });
      steps.push({ k: 'ice', tool: 'glass', title: 'Vul je glas met ' + (c.ice === 'crushed' ? 'crushed ice' : 'ijs'), text: 'Tot ongeveer drie kwart van het glas.', level: acc / total });
      rest.forEach(function (r) { addGlass(r, 'Giet erbij'); });
      steps.push({ k: 'timer', act: 'stir', sec: 6, tool: 'glass', title: 'Roer even door', text: 'Trek het ijs met een barlepel een paar keer van onder naar boven.', level: acc / total });
    } else if (tool) {
      var vname = tool === 'shaker' ? 'shaker' : tool === 'mengglas' ? 'mengglas' : 'blender';
      mains.forEach(function (r) { steps.push({ k: 'add', tool: tool, title: 'Giet in je ' + vname, big: amountText(r, mult), ing: r[0] }); });
      var hasEgg = mains.some(function (r) { return r[0] === 'eiwit'; });
      if (hasEgg) steps.push({ k: 'timer', act: 'shake', sec: 10, tool: 'shaker', title: 'Dry shake', text: 'Eerst zonder ijs shaken: zo klopt het eiwit op tot een mooi schuim.' });
      steps.push({ k: 'ice', tool: tool, title: 'Voeg ijs toe', text: tool === 'blender' ? 'Een flinke handvol crushed ice.' : 'Vul je ' + vname + ' voor twee derde met ijsblokjes.' });
      if (tool === 'shaker') steps.push({ k: 'timer', act: 'shake', sec: 12, tool: 'shaker', title: 'Shaken', text: 'Houd de shaker met twee handen vast en schud krachtig, tot hij ijskoud aanvoelt.' });
      if (tool === 'mengglas') steps.push({ k: 'timer', act: 'stir', sec: 25, tool: 'mengglas', title: 'Roeren', text: 'Roer rustig rond met een barlepel. Zo koel je de drank zonder luchtbellen.' });
      if (tool === 'blender') steps.push({ k: 'timer', act: 'blend', sec: 15, tool: 'blender', title: 'Blenden', text: 'Blend tot alles glad en romig is.' });
      if (glassIce && c.m !== 'blended') steps.push({ k: 'ice', tool: 'glass', title: 'Vul je glas met ' + (c.ice === 'crushed' ? 'crushed ice' : c.ice === 'big' ? 'een groot ijsblok' : 'ijs'), text: 'Vers ijs, niet het ijs uit de ' + vname + '.', level: 0 });
      mains.forEach(function (r) { acc += D.ingVolume(r); });
      steps.push({ k: 'pour', tool: 'glass', title: c.m === 'blended' ? 'Giet in je glas' : 'Zeef in je glas', text: c.m === 'blended' ? 'Schenk alles in je ' + gname + '.' : 'Zeef de drank in je ' + gname + (hasEgg || !glassIce ? ', eventueel dubbel door een fijne zeef.' : '.'), level: acc / total });
    } else {
      if (glassIce) steps.push({ k: 'ice', tool: 'glass', title: 'Vul je glas met ' + (c.ice === 'crushed' ? 'crushed ice' : c.ice === 'big' ? 'een groot ijsblok' : 'ijs'), text: c.m === 'layered' ? 'Het ijs helpt de lagen gescheiden te houden.' : 'Veel ijs smelt trager dan weinig ijs.', level: 0 });
      mains.forEach(function (r, i) {
        if (c.m === 'layered') addGlass(r, i === 0 ? 'Begin met de onderste laag' : 'Giet de volgende laag', i === 0 ? '' : 'Giet heel traag over de bolle kant van een lepel, net boven de vorige laag.');
        else addGlass(r, i === 0 ? 'Giet in je glas' : 'Giet erbij');
      });
      if (c.m !== 'layered' && mains.length > 1 && !c.hot) steps.push({ k: 'timer', act: 'stir', sec: 8, tool: 'glass', title: 'Roer even', text: 'Een paar keer rustig roeren met een barlepel.', level: acc / total });
    }
    tops.forEach(function (r) {
      if (r[3] === 't') addGlass(r, 'Top af met', 'Giet langs een barlepel of de wand van het glas, zo blijven de bubbels behouden.');
      else addGlass(r, 'Laat drijven', 'Giet traag over de bolle kant van een barlepel, zodat het bovenop blijft liggen.');
    });
    if (c.gar && !/^geen$/i.test(c.gar)) steps.push({ k: 'garnish', tool: 'glass', title: 'Garneer', text: c.gar + '.', level: 1 });
    steps.push({ k: 'done', tool: 'glass', title: 'Proost', text: 'Je ' + c.n + ' is klaar. Geniet ervan, met mate.', level: 1 });
    // Glazen zonder niveau krijgen het vorige niveau
    var last = 0;
    steps.forEach(function (s) { if (s.tool === 'glass') { if (s.level == null) s.level = last; last = s.level; } });
    return steps;
  }

  /* ---------- Filteren ---------- */
  var FAMS = { koffielikeur: 'Koffielikeur', vodka: 'Vodka', gin: 'Gin', rum: 'Rum', tequila: 'Tequila', whisky: 'Whisky', cognac: 'Cognac', jenever: 'Jenever', bier: 'Bier', wijn: 'Bubbels en wijn', likeur: 'Likeur' };
  var STRENGTH = { alcoholvrij: 'Alcoholvrij', licht: 'Licht', middel: 'Middel', sterk: 'Sterk' };
  var BUILTIN_PRESETS = [
    { id: 'p-bubbels', name: 'Drankjes met bubbels', f: { types: ['bubbels'] } },
    { id: 'p-max5', name: 'Maximaal 5 procent alcohol', f: { max5: true } },
    { id: 'p-mijnbar', name: 'Alleen met wat in mijn bar staat', f: { myBar: true } },
    { id: 'p-koffie', name: 'Koffie na het eten', f: { tastes: ['koffie'], occ: ['dessert'] } },
    { id: 'p-af', name: 'Alles zonder alcohol', f: { af: true } },
    { id: 'p-eigen', name: 'Eigen recepten met mijn bar', f: { cat: 'eigen', myBar: true } },
    { id: 'p-zomer', name: 'Zomerterras', f: { occ: ['zomer'], strength: ['licht', 'middel'] } }
  ];
  function activeFilterCount(f) {
    return f.fams.length + f.tastes.length + f.occ.length + f.strength.length + f.types.length + (f.af ? 1 : 0) + (f.max5 ? 1 : 0) + (f.myBar ? 1 : 0);
  }
  function applyFilters(list, f) {
    var q = f.q.trim().toLowerCase();
    var out = list.filter(function (c) {
      if (f.cat !== 'alle' && c.cat !== f.cat) return false;
      if (q) {
        var hay = (c.n + ' ' + c.i.map(function (r) { return ING[r[0]].name; }).join(' ') + ' ' + c.t.join(' ') + ' ' + (D.CATS[c.cat] || '')).toLowerCase();
        if (q.split(/\s+/).some(function (w) { return hay.indexOf(w) < 0; })) return false;
      }
      if (f.fams.length && !f.fams.some(function (x) { return c.fams.indexOf(x) > -1; })) return false;
      if (f.tastes.length && !f.tastes.every(function (x) { return c.t.indexOf(x) > -1; })) return false;
      if (f.occ.length && !f.occ.some(function (x) { return c.o.indexOf(x) > -1; })) return false;
      if (f.strength.length && f.strength.indexOf(c.strength) < 0) return false;
      if (f.types.length && f.types.indexOf(c.type) < 0) return false;
      if (f.af && !c.alcoholFree) return false;
      if (f.max5 && c.abvGlass > 5) return false;
      if (f.myBar && missing(c).length) return false;
      return true;
    });
    var sorters = {
      naam: function (a, b) { return a.n.localeCompare(b.n, 'nl'); },
      sterkte: function (a, b) { return b.units - a.units; },
      licht: function (a, b) { return a.units - b.units; },
      moeilijkheid: function (a, b) { return a.d - b.d || a.n.localeCompare(b.n, 'nl'); },
      prijs: function (a, b) { return costPerGlass(a) - costPerGlass(b); }
    };
    out.sort(sorters[f.sort] || sorters.naam);
    return out;
  }
  function saveFilters() { store.set('filters', state.filters); }

  /* ---------- Kleine bouwstenen ---------- */
  var ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.6 4.5 7.2 4.5c2 0 3.4 1.1 4.8 2.9 1.4-1.8 2.8-2.9 4.8-2.9 3.6 0 5.7 3.5 4.5 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c2 0 3.3-1.6 4.4-3.6M14 10c1-1.7 2.2-3 3.5-3H21M18 4l3 3-3 3M18 14l3 3-3 3"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.5l2.2 11h10.6L20.5 8H7"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>',
    shaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 10h7l-1 11h-5z"/><path d="M7.8 7.5h8.4l-.6 2.5H8.4z"/><path d="M9.5 3.5h5l1 4h-7z"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
    print: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M7 9l5-5 5 5M5 20h14"/></svg>',
    tv: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg>'
  };

  function dots(n, max) {
    var s = '';
    for (var i = 1; i <= max; i++) s += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return '<span class="dots" aria-hidden="true">' + s + '</span>';
  }
  function strengthLabel(c) {
    if (c.alcoholFree) return 'Alcoholvrij';
    return STRENGTH[c.strength] + ', ' + num(c.units) + ' ' + plural(Math.round(c.units * 10) / 10, 'standaardglas', 'standaardglazen');
  }
  function mainLabel(c) {
    if (c.alcoholFree) return 'Alcoholvrij';
    return FAMS[c.mainFam] || 'Cocktail';
  }

  function card(c, opts) {
    opts = opts || {};
    var fav = state.fav.indexOf(c.id) > -1;
    var miss = opts.showMissing ? missing(c) : null;
    return '<article class="card' + (opts.small ? ' card-sm' : '') + '" data-id="' + c.id + '">' +
      '<a class="card-link" href="#/cocktail/' + c.id + '" aria-label="' + esc(c.n) + ', ' + esc(mainLabel(c)) + ', ' + esc(c.alcoholFree ? 'alcoholvrij' : STRENGTH[c.strength].toLowerCase()) + '">' +
      '<div class="card-stage">' + GA.svg(c, { paused: true, pourTime: 1.1, label: false }) + '</div>' +
      '<div class="card-text"><h3>' + esc(c.n) + '</h3>' +
      '<p class="card-meta"><span class="str str-' + c.strength + '" aria-hidden="true"></span>' + esc(mainLabel(c)) + (c.own ? ' <span class="badge">Eigen</span>' : '') + (c.house ? ' <span class="badge">Huisrecept</span>' : '') + '</p>' +
      (miss && miss.length ? '<p class="card-miss">Mist: ' + miss.map(function (id) { return esc(ING[id].short); }).join(', ') + '</p>' : '') +
      '</div></a>' +
      '<button class="fav-btn' + (fav ? ' on' : '') + '" data-fav="' + c.id + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Verwijder uit je favorieten' : 'Bewaar bij je favorieten') + '">' + ICON.heart + '</button>' +
      '</article>';
  }

  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var svg = e.target.querySelector('svg');
      if (!svg) return;
      if (e.isIntersecting) svg.classList.remove('paused'); else if (svg.classList.contains('was-seen')) svg.classList.add('paused');
      if (e.isIntersecting) svg.classList.add('was-seen');
    });
  }, { rootMargin: '0px 0px -40px 0px' }) : null;
  function observeCards(root) {
    $$('.card-stage', root).forEach(function (el) {
      if (io) io.observe(el); else { var s = el.querySelector('svg'); if (s) s.classList.remove('paused'); }
    });
  }

  function toggleFav(id, btn) {
    var i = state.fav.indexOf(id), on;
    if (i > -1) { state.fav.splice(i, 1); on = false; } else { state.fav.push(id); on = true; }
    store.set('fav', state.fav);
    AU.sfx[on ? 'pop' : 'click']();
    $$('[data-fav="' + id + '"]').forEach(function (b) {
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', on ? 'Verwijder uit je favorieten' : 'Bewaar bij je favorieten');
      if (b.dataset.label) b.querySelector('span').textContent = on ? 'In je favorieten' : 'Favoriet';
      b.classList.remove('burst'); void b.offsetWidth; if (on) b.classList.add('burst');
    });
    var c = byId(id);
    toast(on ? c.n + ' staat bij je favorieten' : c.n + ' is uit je favorieten');
    updateBadges();
  }

  function updateBadges() {
    var fb = $('#nav-fav-count'); if (fb) fb.textContent = state.fav.length || '';
    var lb = $('#nav-list-count'); if (lb) lb.textContent = state.list.length || '';
  }

  /* ---------- Weergaven ---------- */
  function setView(html, title) {
    main.innerHTML = '<div class="view">' + html + '</div>';
    document.title = title ? title + ' | Tom’s Cocktails' : 'Tom’s Cocktails';
    window.scrollTo(0, 0);
    var h = $('h1', main);
    if (h && !setView.first) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    setView.first = false;
    observeCards(main);
  }
  setView.first = true;

  function daySeed() { var d = new Date(); return d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate(); }
  function pickHero() {
    if (state.hero && byId(state.hero)) return byId(state.hero);
    var pool = D.COCKTAILS;
    return pool[daySeed() % pool.length];
  }

  /* ----- Kaart (home) ----- */
  function viewHome() {
    var c = pickHero();
    var f = state.filters;
    var cats = [['alle', 'Alles']].concat(Object.keys(D.CATS).map(function (k) { return [k, D.CATS[k]]; }));
    if (ALL.some(function (x) { return x.own; })) cats.push(['eigen', 'Eigen recepten']);
    var html = '' +
      '<section class="hero" aria-labelledby="hero-title">' +
      '<div class="hero-stage" id="hero-stage">' + GA.svg(c, { stream: true, pourTime: 1.8 }) + '</div>' +
      '<div class="hero-text">' +
      '<p class="kicker">Vandaag aan de toog</p>' +
      '<h1 id="hero-title" class="display">' + esc(c.n) + '</h1>' +
      '<p class="story">' + esc(c.s) + '</p>' +
      '<p class="hero-meta">' + esc(c.glassName) + ' <span aria-hidden="true">/</span> ' + esc(c.methodName.toLowerCase()) + ' <span aria-hidden="true">/</span> ' + esc(strengthLabel(c).toLowerCase()) + '</p>' +
      '<div class="btn-row">' +
      '<a class="btn btn-primary" href="#/cocktail/' + c.id + '">Bekijk het recept</a>' +
      '<button class="btn" data-act="shake" data-id="' + c.id + '">' + ICON.shaker + '<span>Maak hem nu</span></button>' +
      '<button class="btn btn-ghost" data-act="reroll" aria-label="Toon een andere suggestie">' + ICON.shuffle + '<span>Iets anders</span></button>' +
      '</div></div></section>' +
      '<section class="library" aria-labelledby="lib-title">' +
      '<div class="lib-head"><h2 id="lib-title">De kaart</h2><p class="muted">' + ALL.length + ' recepten, van koffielikeur tot jenever</p></div>' +
      '<div class="tabs" role="tablist" aria-label="Categorie">' + cats.map(function (x) {
        return '<button role="tab" class="tab" data-cat="' + x[0] + '" aria-selected="' + (f.cat === x[0]) + '">' + esc(x[1]) + '</button>';
      }).join('') + '</div>' +
      '<div class="toolbar">' +
      '<label class="search">' + ICON.search + '<span class="sr-only">Zoek een cocktail of ingrediënt</span><input id="q" type="search" placeholder="Zoek op naam, ingrediënt of smaak" value="' + esc(f.q) + '" autocomplete="off"><kbd aria-hidden="true">/</kbd></label>' +
      '<button class="btn btn-ghost" id="toggle-filters" aria-expanded="false" aria-controls="filters">' + ICON.filter + '<span>Filters</span><b class="count" id="fcount"></b></button>' +
      '<label class="select"><span class="sr-only">Sorteer</span><select id="sort">' +
      [['naam', 'Op naam'], ['licht', 'Lichtste eerst'], ['sterkte', 'Sterkste eerst'], ['moeilijkheid', 'Makkelijkste eerst'], ['prijs', 'Goedkoopste eerst']].map(function (o) { return '<option value="' + o[0] + '"' + (f.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select></label>' +
      '<label class="select"><span class="sr-only">Bewaarde filters</span><select id="presets"><option value="">Bewaarde filters</option>' +
      BUILTIN_PRESETS.map(function (p) { return '<option value="' + p.id + '">' + esc(p.name) + '</option>'; }).join('') +
      (state.presets.length ? '<optgroup label="Jouw filters">' + state.presets.map(function (p, i) { return '<option value="own-' + i + '">' + esc(p.name) + '</option>'; }).join('') + '</optgroup>' : '') +
      '</select></label>' +
      '<button class="btn btn-ghost" data-act="party" title="Toon de kaart als diavoorstelling">' + ICON.tv + '<span>Feestmodus</span></button>' +
      '</div>' +
      '<div class="filters" id="filters" hidden>' + filterPanel() + '</div>' +
      '<p class="result-count" id="rcount" aria-live="polite"></p>' +
      '<div class="grid" id="grid"></div>' +
      '</section>';
    setView(html, null);
    renderGrid();
    bindHome();
  }

  function chipGroup(label, key, map) {
    var f = state.filters;
    return '<fieldset class="chip-group"><legend>' + label + '</legend><div class="chips">' +
      Object.keys(map).map(function (k) {
        var on = f[key].indexOf(k) > -1;
        return '<button type="button" class="chip" data-fkey="' + key + '" data-fval="' + k + '" aria-pressed="' + on + '">' + esc(map[k]) + '</button>';
      }).join('') + '</div></fieldset>';
  }
  function filterPanel() {
    var f = state.filters, tastes = {};
    D.TASTES.forEach(function (t) { tastes[t] = t.charAt(0).toUpperCase() + t.slice(1); });
    return chipGroup('Basisdrank', 'fams', FAMS) + chipGroup('Smaak', 'tastes', tastes) + chipGroup('Gelegenheid', 'occ', D.OCCASIONS) +
      chipGroup('Sterkte', 'strength', STRENGTH) + chipGroup('Soort', 'types', D.TYPES) +
      '<fieldset class="chip-group"><legend>Extra</legend><div class="chips">' +
      '<button type="button" class="chip" data-ftog="af" aria-pressed="' + f.af + '">Alleen alcoholvrij</button>' +
      '<button type="button" class="chip" data-ftog="max5" aria-pressed="' + f.max5 + '">Maximaal 5 procent</button>' +
      '<button type="button" class="chip" data-ftog="myBar" aria-pressed="' + f.myBar + '">Alleen met bar “' + esc(activeBar().name) + '”</button>' +
      '</div></fieldset>' +
      '<div class="filter-actions"><button class="btn btn-ghost" data-act="clear-filters">Wis alle filters</button><button class="btn" data-act="save-preset">Bewaar deze filter</button></div>';
  }
  function renderGrid() {
    var list = applyFilters(ALL, state.filters);
    var grid = $('#grid');
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = '<div class="empty"><p class="display-sm">Niets gevonden</p><p>Geen enkel recept past bij al je filters. Wis een paar filters of zoek op een ander ingrediënt.</p><button class="btn" data-act="clear-filters">Wis alle filters</button></div>';
    } else grid.innerHTML = list.map(function (c) { return card(c); }).join('');
    $('#rcount').textContent = list.length + ' ' + plural(list.length, 'recept', 'recepten');
    var n = activeFilterCount(state.filters);
    $('#fcount').textContent = n ? n : '';
    observeCards(grid);
  }
  function bindHome() {
    var q = $('#q'), t;
    q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.filters.q = q.value; saveFilters(); renderGrid(); }, 120); });
    $('#sort').addEventListener('change', function (e) { state.filters.sort = e.target.value; saveFilters(); renderGrid(); });
    $('#presets').addEventListener('change', function (e) {
      var v = e.target.value; if (!v) return;
      var p = v.indexOf('own-') === 0 ? state.presets[+v.slice(4)] : BUILTIN_PRESETS.filter(function (x) { return x.id === v; })[0];
      if (p) {
        state.filters = Object.assign(emptyFilters(), { q: '', sort: state.filters.sort }, JSON.parse(JSON.stringify(p.f)));
        saveFilters(); AU.sfx.click();
        $('#filters').innerHTML = filterPanel();
        $$('.tab').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.cat === state.filters.cat); });
        $('#q').value = '';
        renderGrid();
        toast('Filter “' + p.name + '” staat aan');
      }
      e.target.value = '';
    });
    $('#toggle-filters').addEventListener('click', function () {
      var p = $('#filters'), open = p.hidden;
      p.hidden = !open; this.setAttribute('aria-expanded', open);
      AU.sfx.click();
    });
    if (activeFilterCount(state.filters)) { $('#filters').hidden = false; $('#toggle-filters').setAttribute('aria-expanded', 'true'); }
  }

  /* ----- Detail ----- */
  var detailMult = 1;
  function viewDetail(id) {
    var c = byId(id);
    if (!c) { viewNotFound(); return; }
    detailMult = 1;
    var fav = state.fav.indexOf(c.id) > -1;
    var cost = costPerGlass(c);
    var similar = ALL.filter(function (x) { return x.id !== c.id; }).map(function (x) {
      var sc = 0;
      x.t.forEach(function (tt) { if (c.t.indexOf(tt) > -1) sc += 1; });
      x.fams.forEach(function (ff) { if (c.fams.indexOf(ff) > -1) sc += 2; });
      if (x.cat === c.cat) sc += 1;
      return [sc, x];
    }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, 4).map(function (p) { return p[1]; });
    var garnInGuide = LX.GARN.filter(function (g) { return c.gk.indexOf(g.k) > -1; });
    var html = '' +
      '<div class="detail">' +
      '<div class="detail-stage"><div class="spot" style="--glow:' + c.L[c.L.length - 1][0] + '"></div><div id="detail-glass">' + GA.svg(c, { stream: true, pourTime: 2 }) + '</div>' +
      '<button class="btn btn-ghost btn-sm replay" data-act="replay" data-id="' + c.id + '">' + ICON.replay + '<span>Opnieuw inschenken</span></button></div>' +
      '<div class="detail-body">' +
      '<a class="back" href="#/">' + ICON.prev + '<span>Terug naar de kaart</span></a>' +
      '<p class="kicker">' + esc(c.own ? 'Eigen recept' : D.CATS[c.cat]) + (c.house ? ', huisrecept van Tom’s Cocktails' : '') + '</p>' +
      '<h1 class="display">' + esc(c.n) + '</h1>' +
      (c.s ? '<p class="story">' + esc(c.s) + '</p>' : '') +
      '<ul class="tags" aria-label="Smaak">' + c.t.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<dl class="stats">' +
      '<div><dt>Sterkte</dt><dd>' + (c.alcoholFree ? 'Alcoholvrij' : num(c.units) + ' <small>' + plural(Math.round(c.units * 10) / 10, 'standaardglas', 'standaardglazen') + '</small>') + '</dd></div>' +
      '<div><dt>In het glas</dt><dd>' + (c.alcoholFree ? '0' : '± ' + num(c.abvGlass, 0)) + ' <small>% vol</small></dd></div>' +
      '<div><dt>Volume</dt><dd>' + num(c.finalVol, 0) + ' <small>cl</small></dd></div>' +
      '<div><dt>Moeilijkheid</dt><dd>' + dots(c.d, 3) + ' <small>' + ['', 'makkelijk', 'gemiddeld', 'voor gevorderden'][c.d] + '</small></dd></div>' +
      '<div><dt>Kostprijs</dt><dd>' + euro(cost) + ' <small>per glas</small></dd></div>' +
      '</dl>' +
      '<div class="btn-row">' +
      '<button class="btn btn-primary" data-act="shake" data-id="' + c.id + '">' + ICON.shaker + '<span>Maak hem nu</span></button>' +
      '<button class="btn fav-btn-lg' + (fav ? ' on' : '') + '" data-fav="' + c.id + '" data-label="1" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Verwijder uit je favorieten' : 'Bewaar bij je favorieten') + '">' + ICON.heart + '<span>' + (fav ? 'In je favorieten' : 'Favoriet') + '</span></button>' +
      '<button class="btn btn-ghost" data-act="to-list" data-id="' + c.id + '">' + ICON.cart + '<span>Op je boodschappenlijst</span></button>' +
      (c.own ? '<a class="btn btn-ghost" href="#/eigen/bewerk/' + c.id + '">' + ICON.edit + '<span>Bewerk</span></a>' : '') +
      '</div>' +
      '<section class="recipe" aria-labelledby="ing-title">' +
      '<div class="recipe-head"><h2 id="ing-title">Ingrediënten</h2>' +
      '<div class="stepper" role="group" aria-label="Aantal glazen"><button data-act="mult" data-d="-1" aria-label="Eén glas minder">' + ICON.minus + '</button><output id="mult" aria-live="polite">1 glas</output><button data-act="mult" data-d="1" aria-label="Eén glas meer">' + ICON.plus + '</button></div></div>' +
      '<ul class="ing-list" id="ing-list"></ul>' +
      '<p class="bar-hint muted">Een vinkje betekent: staat in je bar “' + esc(activeBar().name) + '”. IJs, suiker en water heb je altijd in huis.</p>' +
      '<div id="shopnote" class="shopnote"></div>' +
      '</section>' +
      '<section class="recipe" aria-labelledby="prep-title"><h2 id="prep-title">Bereiding</h2>' +
      '<p class="muted">' + esc(c.methodName) + ' in een ' + esc(c.glassName) + (c.ice !== 'none' ? ', met ' + ({ cubes: 'ijsblokjes', crushed: 'crushed ice', big: 'een groot ijsblok' })[c.ice] : ', zonder ijs') + '.</p>' +
      '<ol class="steps" id="steps"></ol>' +
      (c.prep ? '<p class="own-prep">' + esc(c.prep) + '</p>' : '') +
      '<p><strong>Garnituur:</strong> ' + esc(c.gar) + (garnInGuide.length ? ' <a href="#/garnituur" class="inline-link">Zo maak je ' + esc(garnInGuide[0].n.toLowerCase()) + '</a>' : '') + '</p>' +
      '</section>' +
      '<aside class="responsible" aria-label="Verantwoord drinken"><p><strong>Met mate.</strong> ' + (c.alcoholFree
        ? 'Deze is alcoholvrij: perfect voor de BOB, voor kinderen en voor wie gewoon geen zin heeft in alcohol.'
        : 'Eén glas ' + esc(c.n) + ' bevat ongeveer ' + num(c.alcMl * 0.789, 0) + ' gram alcohol, dat is ' + num(c.units) + ' ' + plural(Math.round(c.units * 10) / 10, 'standaardglas', 'standaardglazen') + ' van 10 gram. Wissel af met water, eet er iets bij en kies voor een BOB als je met de auto bent. Sterke drank schenk je pas vanaf 18 jaar.') + '</p></aside>' +
      '</div></div>' +
      '<section class="similar" aria-labelledby="sim-title"><h2 id="sim-title">Dit vind je misschien ook lekker</h2><div class="grid grid-4">' + similar.map(function (x) { return card(x, { small: true }); }).join('') + '</div></section>';
    setView(html, c.n);
    renderIngredients(c);
  }
  function renderIngredients(c) {
    var m = detailMult;
    $('#mult').textContent = m + ' ' + plural(m, 'glas', 'glazen');
    $('#ing-list').innerHTML = c.i.map(function (r) {
      var p = amountParts(r, m), ing = ING[r[0]];
      var have = ing.grp === 'basis' || inBar(r[0]);
      return '<li class="' + (have ? 'have' : '') + '"><span class="amt">' + esc(p.amt) + '</span><span class="nm">' + esc(p.name) + (r[3] === 't' ? ' <small>om af te toppen</small>' : r[3] === 'f' ? ' <small>laten drijven</small>' : '') + '</span>' +
        '<span class="have-mark" aria-label="' + (have ? 'in je bar' : 'niet in je bar') + '">' + (have ? ICON.check : '') + '</span></li>';
    }).join('');
    $('#steps').innerHTML = buildSteps(c, m).filter(function (s) { return s.k !== 'done'; }).map(function (s) {
      var t = s.big ? s.title + ' ' + s.big + '.' + (s.text ? ' ' + s.text : '') : s.title + '. ' + s.text;
      if (s.k === 'timer') t = s.title + ', ongeveer ' + s.sec + ' seconden. ' + s.text;
      return '<li>' + esc(t) + '</li>';
    }).join('');
    var miss = missing(c);
    $('#shopnote').innerHTML = miss.length ? '<p>Je mist nog: ' + miss.map(function (id) { return '<span class="pill">' + esc(ING[id].name) + '</span>'; }).join(' ') + '</p>' : '<p class="ok">' + ICON.check + 'Je hebt alles in huis voor deze.</p>';
  }

  /* ----- Wat kan ik maken? ----- */
  var BASISBAR = ['vodka', 'gin', 'rum_wit', 'koffielikeur', 'triple_sec', 'limoensap', 'citroensap', 'cola', 'tonic', 'spuitwater', 'sinaasappelsap', 'room', 'munt'];
  function viewBar() {
    var b = activeBar();
    var used = {};
    ALL.forEach(function (c) { c.needs.forEach(function (id) { used[id] = (used[id] || 0) + 1; }); });
    var groups = {};
    Object.keys(used).forEach(function (id) { var g = ING[id].grp; (groups[g] = groups[g] || []).push(id); });
    var html = '<header class="page-head"><p class="kicker">Wat kan ik maken?</p><h1 class="display">Je eigen bar</h1>' +
      '<p class="lead">Vink aan welke flessen en ingrediënten je in huis hebt. Je ziet meteen wat je nu kan maken, en welke ene fles er het meeste bijbrengt. Je kan tot drie bars bijhouden.</p></header>' +
      '<div class="bar-tabs" role="tablist" aria-label="Kies een bar">' + BAR_IDS.map(function (id) {
        var bb = state.bars.list[id];
        return '<button role="tab" class="bar-tab" data-bar="' + id + '" aria-selected="' + (state.bars.active === id) + '"><span>' + esc(bb.name) + '</span><small>' + bb.items.length + ' ' + plural(bb.items.length, 'item', 'items') + '</small></button>';
      }).join('') + '<button class="btn btn-ghost btn-sm" data-act="rename-bar">' + ICON.edit + '<span>Hernoem “' + esc(b.name) + '”</span></button></div>' +
      '<div class="bar-layout">' +
      '<section class="shelf-panel" aria-labelledby="shelf-title"><div class="panel-head"><h2 id="shelf-title">In bar “' + esc(b.name) + '”</h2>' +
      '<div class="btn-row"><button class="btn btn-sm" data-act="basisbar">Vink een basisbar aan</button><button class="btn btn-ghost btn-sm" data-act="clear-bar">Alles uitvinken</button></div></div>' +
      '<label class="search search-sm">' + ICON.search + '<span class="sr-only">Zoek een ingrediënt</span><input id="bar-q" type="search" placeholder="Zoek een fles of ingrediënt" autocomplete="off"></label>' +
      ['sterk', 'likeur', 'wijnbier', 'fris', 'vers'].filter(function (g) { return groups[g]; }).map(function (g) {
        return '<fieldset class="bottle-group"><legend>' + D.GRP_NAMES[g] + '</legend><div class="bottles">' +
          groups[g].sort(function (a, b2) { return ING[a].name.localeCompare(ING[b2].name, 'nl'); }).map(function (id) {
            var on = b.items.indexOf(id) > -1;
            return '<label class="bottle' + (on ? ' on' : '') + '" data-name="' + esc(ING[id].name.toLowerCase()) + '"><input type="checkbox" data-ing="' + id + '"' + (on ? ' checked' : '') + '><span class="swatch" style="--c:' + ING[id].col + '"></span><span>' + esc(ING[id].name) + '</span><small>' + used[id] + '</small></label>';
          }).join('') + '</div></fieldset>';
      }).join('') + '</section>' +
      '<section class="can-panel" id="can-panel" aria-live="polite"></section></div>';
    setView(html, 'Wat kan ik maken?');
    renderCan();
  }
  function renderCan() {
    var b = activeBar();
    var can = [], one = {};
    ALL.forEach(function (c) {
      var m = missing(c);
      if (!m.length) can.push(c);
      else if (m.length === 1) (one[m[0]] = one[m[0]] || []).push(c);
    });
    var unlock = Object.keys(one).map(function (id) { return [id, one[id]]; }).sort(function (a, b2) { return b2[1].length - a[1].length; }).slice(0, 8);
    var html = '<div class="can-summary"><p class="big-num">' + can.length + '</p><p>' + plural(can.length, 'cocktail kan', 'cocktails kan') + ' je nu maken met bar “' + esc(b.name) + '”.</p></div>';
    if (!b.items.length) html += '<div class="empty"><p>Je bar is nog leeg. Vink links aan wat je in huis hebt, of begin met een basisbar. Alcoholvrije recepten met enkel basisingrediënten verschijnen hier al.</p></div>';
    html += can.length ? '<h3 class="sub">Nu te maken</h3><div class="grid grid-mini">' + can.map(function (c) { return card(c, { small: true }); }).join('') + '</div>' : '';
    if (unlock.length) {
      html += '<h3 class="sub">Met één fles extra</h3><ul class="unlock">' + unlock.map(function (u) {
        return '<li><div><strong>' + esc(ING[u[0]].name) + '</strong><span class="muted"> maakt ' + u[1].length + ' ' + plural(u[1].length, 'recept', 'recepten') + ' mogelijk</span>' +
          '<p class="unlock-list">' + u[1].slice(0, 6).map(function (c) { return '<a href="#/cocktail/' + c.id + '">' + esc(c.n) + '</a>'; }).join(', ') + (u[1].length > 6 ? ' en nog ' + (u[1].length - 6) : '') + '</p></div>' +
          '<button class="btn btn-sm" data-act="add-ing" data-ing="' + u[0] + '">' + ICON.plus + '<span>Heb ik</span></button></li>';
      }).join('') + '</ul>';
    }
    $('#can-panel').innerHTML = html;
    observeCards($('#can-panel'));
  }

  /* ----- Favorieten ----- */
  function viewFav() {
    var list = state.fav.map(byId).filter(Boolean);
    var html = '<header class="page-head"><p class="kicker">Favorieten</p><h1 class="display">Jouw vaste waarden</h1>' +
      '<p class="lead">Je favorieten blijven bewaard in deze browser.</p></header>';
    if (!list.length) html += '<div class="empty"><p class="display-sm">Nog geen favorieten</p><p>Tik op het hartje bij een cocktail om hem hier te bewaren.</p><a class="btn btn-primary" href="#/">Naar de kaart</a></div>';
    else html += '<div class="btn-row"><button class="btn" data-act="party-fav">' + ICON.tv + '<span>Toon als diavoorstelling</span></button></div><div class="grid">' + list.map(function (c) { return card(c); }).join('') + '</div>';
    setView(html, 'Favorieten');
  }

  /* ----- Boodschappenlijst ----- */
  var PLUR = { fles: 'flessen', flesje: 'flesjes', blikje: 'blikjes', pak: 'pakken', brikje: 'brikjes', limoen: 'limoenen', citroen: 'citroenen', espresso: "espresso's", kop: 'koppen', 'bosje munt': 'bosjes munt', ei: 'eieren', 'doos ijs': 'dozen ijs', potje: 'potjes', blik: 'blikken', 'bakje aardbeien': 'bakjes aardbeien' };
  function aggregate() {
    var tot = {};
    state.list.forEach(function (it) {
      var c = byId(it.id); if (!c) return;
      c.i.forEach(function (r) {
        var ing = ING[r[0]]; if (!ing || ing.grp === 'basis') return;
        var t = tot[r[0]] = tot[r[0]] || { cl: 0, st: 0, dash: 0 };
        var u = r[2] || 'cl';
        if (u === 'st') t.st += r[1] * it.n; else if (u === 'dash') t.dash += r[1] * it.n; else t.cl += D.ingVolume(r) * it.n;
      });
    });
    return Object.keys(tot).map(function (id) {
      var ing = ING[id], t = tot[id], buy = ing.buy || { t: 'fles', s: 70 };
      var need = buy.st ? t.st : t.cl + t.dash * 0.08;
      var units = Math.max(1, Math.ceil(need / buy.s - 0.001));
      var amount = t.st ? frac(Math.ceil(t.st * 2) / 2) + ' ' + ((ing.cnt && (t.st <= 1 ? ing.cnt[0] : ing.cnt[1])) || 'stuks') : t.dash && !t.cl ? Math.round(t.dash) + ' dashes' : num(t.cl) + ' cl';
      var buyTxt = units + ' ' + (units === 1 ? buy.t : (PLUR[buy.t] || buy.t)) + (/fles|blik|pak|brik/.test(buy.t) ? ' (' + num(buy.s, 1) + ' cl)' : '');
      return { id: id, ing: ing, amount: amount, buy: buyTxt, cost: units * priceOf(id), used: buy.st ? need / buy.s * priceOf(id) : need / buy.s * priceOf(id) };
    }).sort(function (a, b) { return ['sterk', 'likeur', 'wijnbier', 'fris', 'vers'].indexOf(a.ing.grp) - ['sterk', 'likeur', 'wijnbier', 'fris', 'vers'].indexOf(b.ing.grp) || a.ing.name.localeCompare(b.ing.name, 'nl'); });
  }
  function viewList() {
    var items = state.list.filter(function (it) { return byId(it.id); });
    var html = '<header class="page-head"><p class="kicker">Boodschappen</p><h1 class="display">Je boodschappenlijst</h1>' +
      '<p class="lead">Kies hoeveel glazen je van elke cocktail wil maken. De lijst telt alles op en zegt hoeveel flessen je moet kopen.</p></header>';
    if (!items.length) {
      html += '<div class="empty"><p class="display-sm">Je lijst is leeg</p><p>Open een recept en kies “Op je boodschappenlijst”. Handig om een feestje voor te bereiden.</p><a class="btn btn-primary" href="#/">Naar de kaart</a></div>';
      setView(html, 'Boodschappen'); return;
    }
    html += '<div class="list-layout"><section aria-labelledby="plan-title"><h2 id="plan-title">Wat je maakt</h2><ul class="plan">' + items.map(function (it) {
      var c = byId(it.id);
      return '<li><div class="plan-glass">' + GA.svg(c, { animate: false, label: false }) + '</div><a href="#/cocktail/' + c.id + '">' + esc(c.n) + '</a>' +
        '<div class="stepper" role="group" aria-label="Aantal glazen ' + esc(c.n) + '"><button data-act="list-n" data-id="' + c.id + '" data-d="-1" aria-label="Eén glas minder">' + ICON.minus + '</button><output>' + it.n + '</output><button data-act="list-n" data-id="' + c.id + '" data-d="1" aria-label="Eén glas meer">' + ICON.plus + '</button></div>' +
        '<button class="icon-btn" data-act="list-del" data-id="' + c.id + '" aria-label="Verwijder ' + esc(c.n) + ' van je lijst">' + ICON.trash + '</button></li>';
    }).join('') + '</ul></section>' +
      '<section aria-labelledby="buy-title" class="buy-panel" id="buy-panel"></section></div>';
    setView(html, 'Boodschappen');
    renderBuy();
  }
  function renderBuy() {
    var agg = aggregate(), b = activeBar();
    var toBuy = agg.filter(function (a) { return !inBar(a.id); });
    var total = toBuy.reduce(function (s, a) { return s + a.cost; }, 0);
    var used = agg.reduce(function (s, a) { return s + a.used; }, 0);
    var glasses = state.list.reduce(function (s, it) { return s + it.n; }, 0);
    $('#buy-panel').innerHTML = '<h2 id="buy-title">Te kopen</h2>' +
      '<p class="muted">Wat al in bar “' + esc(b.name) + '” staat, is doorstreept.</p>' +
      '<table class="buy"><thead><tr><th scope="col">Ingrediënt</th><th scope="col">Nodig</th><th scope="col">Kopen</th></tr></thead><tbody>' +
      agg.map(function (a) { return '<tr class="' + (inBar(a.id) ? 'have' : '') + '"><td>' + esc(a.ing.name) + '</td><td>' + esc(a.amount) + '</td><td>' + esc(a.buy) + '</td></tr>'; }).join('') +
      '</tbody></table>' +
      '<dl class="buy-total"><div><dt>Glazen</dt><dd>' + glasses + '</dd></div><div><dt>Aankoop</dt><dd>' + euro(total) + '</dd></div><div><dt>Verbruik</dt><dd>' + euro(used) + '</dd></div></dl>' +
      '<p class="muted small">Aankoop is wat je aan de kassa betaalt voor wat je nog mist. Verbruik is wat je glazen echt kosten. Richtprijzen pas je aan bij Ingrediënten.</p>' +
      '<div class="btn-row"><button class="btn" data-act="copy-list">' + ICON.copy + '<span>Kopieer de lijst</span></button><button class="btn btn-ghost" data-act="print">' + ICON.print + '<span>Druk af</span></button><button class="btn btn-ghost" data-act="list-clear">' + ICON.trash + '<span>Maak leeg</span></button></div>';
  }

  /* ----- Barlexicon ----- */
  function viewLexicon() {
    var groups = {};
    LX.LEX.forEach(function (l) { groups[l.g] = true; });
    var html = '<header class="page-head"><p class="kicker">Leren</p><h1 class="display">Barlexicon</h1>' +
      '<p class="lead">' + LX.LEX.length + ' technieken, gereedschappen en begrippen die elke thuisbartender kent.</p></header>' +
      '<div class="toolbar"><label class="search">' + ICON.search + '<span class="sr-only">Zoek in het lexicon</span><input id="lex-q" type="search" placeholder="Zoek een term" autocomplete="off"></label></div>' +
      '<div class="chips" role="group" aria-label="Soort">' + ['Alles'].concat(Object.keys(groups)).map(function (g, i) { return '<button class="chip" data-lexg="' + g + '" aria-pressed="' + (i === 0) + '">' + g + '</button>'; }).join('') + '</div>' +
      '<div class="lexicon" id="lexicon"></div>';
    setView(html, 'Barlexicon');
    renderLex('', 'Alles');
  }
  function renderLex(q, g) {
    q = q.toLowerCase();
    var list = LX.LEX.filter(function (l) { return (g === 'Alles' || l.g === g) && (!q || (l.t + ' ' + l.d).toLowerCase().indexOf(q) > -1); })
      .sort(function (a, b) { return a.t.localeCompare(b.t, 'nl'); });
    var letter = '', html = '';
    list.forEach(function (l) {
      var L = l.t.charAt(0).toUpperCase();
      if (L !== letter) { if (letter) html += '</div>'; letter = L; html += '<h2 class="letter" aria-label="Letter ' + L + '">' + L + '</h2><div class="lex-group">'; }
      html += '<article class="lex"><div class="lex-ic">' + LX.icon(l.ic) + '</div><div><h3>' + esc(l.t) + ' <small>' + esc(l.g) + '</small></h3><p>' + esc(l.d) + '</p>' + (l.tip ? '<p class="tip"><strong>Tip:</strong> ' + esc(l.tip) + '</p>' : '') + '</div></article>';
    });
    if (letter) html += '</div>';
    $('#lexicon').innerHTML = html || '<div class="empty"><p>Geen term gevonden. Probeer een ander woord, zoals shaken of zeste.</p></div>';
  }

  /* ----- Garnituurgids ----- */
  function viewGarnish() {
    var html = '<header class="page-head"><p class="kicker">Leren</p><h1 class="display">Garnituurgids</h1>' +
      '<p class="lead">' + LX.GARN.length + ' garnituren, stap voor stap. Het oog drinkt mee, en de neus ook.</p></header>' +
      '<div class="garn-grid">' + LX.GARN.map(function (g) {
        var used = ALL.filter(function (c) { return c.gk.indexOf(g.k) > -1; });
        return '<article class="garn" id="garn-' + g.k + '"><div class="garn-ill">' + GA.garnishIcon(g.k) + '</div><div class="garn-body"><h2>' + esc(g.n) + '</h2><ol>' +
          g.s.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
          (g.tip ? '<p class="tip"><strong>Tip:</strong> ' + esc(g.tip) + '</p>' : '') +
          (used.length ? '<p class="used">Gebruikt in ' + used.slice(0, 4).map(function (c) { return '<a href="#/cocktail/' + c.id + '">' + esc(c.n) + '</a>'; }).join(', ') + (used.length > 4 ? ' en nog ' + (used.length - 4) : '') + '</p>' : '') +
          '</div></article>';
      }).join('') + '</div>';
    setView(html, 'Garnituurgids');
  }

  /* ----- Ingrediënten ----- */
  function viewIngredients() {
    var html = '<header class="page-head"><p class="kicker">Leren</p><h1 class="display">Ingrediënten</h1>' +
      '<p class="lead">Alle ingrediënten met alcoholgehalte, flesgrootte en richtprijs. Pas de prijs aan naar wat jij betaalt: de kostprijs per glas rekent mee. Met T, Z en F zet je een ingrediënt in je bars Thuis, Zomerbar of Feest.</p></header>' +
      '<div class="toolbar"><label class="search">' + ICON.search + '<span class="sr-only">Zoek een ingrediënt</span><input id="ing-q" type="search" placeholder="Zoek een ingrediënt" autocomplete="off"></label>' +
      '<button class="btn" data-act="new-ing">' + ICON.plus + '<span>Eigen ingrediënt</span></button><button class="btn btn-ghost" data-act="reset-prices">Zet prijzen terug</button></div>' +
      '<div id="ing-form"></div>' +
      '<div class="table-wrap"><table class="ing-table"><thead><tr><th scope="col">Ingrediënt</th><th scope="col">Alcohol</th><th scope="col">Verpakking</th><th scope="col">Prijs</th><th scope="col">In bars</th><th scope="col">Recepten</th></tr></thead><tbody id="ing-body"></tbody></table></div>';
    setView(html, 'Ingrediënten');
    renderIngTable('');
  }
  function renderIngTable(q) {
    q = (q || '').toLowerCase();
    var used = {};
    ALL.forEach(function (c) { c.i.forEach(function (r) { used[r[0]] = (used[r[0]] || 0) + 1; }); });
    var ids = Object.keys(ING).filter(function (id) { return ING[id].grp !== 'basis' && (!q || ING[id].name.toLowerCase().indexOf(q) > -1); });
    var order = ['sterk', 'likeur', 'wijnbier', 'fris', 'vers'];
    ids.sort(function (a, b) { return order.indexOf(ING[a].grp) - order.indexOf(ING[b].grp) || ING[a].name.localeCompare(ING[b].name, 'nl'); });
    var html = '', grp = '';
    ids.forEach(function (id) {
      var ing = ING[id], buy = ing.buy || { t: 'fles', s: 70 };
      if (ing.grp !== grp) { grp = ing.grp; html += '<tr class="grp-row"><th colspan="6" scope="rowgroup">' + D.GRP_NAMES[grp] + '</th></tr>'; }
      html += '<tr><th scope="row"><span class="swatch" style="--c:' + ing.col + '"></span>' + esc(ing.name) + (ing.own ? ' <span class="badge">Eigen</span>' : '') + (ing.note ? '<small class="note">' + esc(ing.note) + '</small>' : '') + '</th>' +
        '<td>' + (ing.abv ? num(ing.abv) + '%' : '0%') + '</td>' +
        '<td>' + esc(buy.st ? '1 ' + buy.t + (buy.s > 1 ? ' (' + buy.s + ' stuks)' : '') : '1 ' + buy.t + ' van ' + num(buy.s) + ' cl') + '</td>' +
        '<td><label class="price"><span class="sr-only">Prijs ' + esc(ing.name) + ' in euro</span>€<input type="number" min="0" step="0.05" inputmode="decimal" data-price="' + id + '" value="' + priceOf(id).toFixed(2) + '"></label></td>' +
        '<td class="bar-flags">' + BAR_IDS.map(function (b) { var on = inBar(id, b); return '<button class="flag' + (on ? ' on' : '') + '" data-flag="' + id + '" data-bar="' + b + '" aria-pressed="' + on + '" title="' + esc(state.bars.list[b].name) + '" aria-label="' + esc(ing.name) + ' in bar ' + esc(state.bars.list[b].name) + '">' + esc(state.bars.list[b].name.charAt(0)) + '</button>'; }).join('') + '</td>' +
        '<td>' + (used[id] || 0) + (ing.own ? ' <button class="icon-btn" data-act="del-ing" data-ing="' + id + '" aria-label="Verwijder ' + esc(ing.name) + '">' + ICON.trash + '</button>' : '') + '</td></tr>';
    });
    $('#ing-body').innerHTML = html || '<tr><td colspan="6">Geen ingrediënt gevonden.</td></tr>';
  }
  function ingForm() {
    return '<form class="panel form-grid" id="new-ing-form"><h2>Eigen ingrediënt toevoegen</h2>' +
      '<label>Naam<input name="name" required maxlength="40" placeholder="bijvoorbeeld rabarbersiroop"></label>' +
      '<label>Soort<select name="grp">' + ['sterk', 'likeur', 'wijnbier', 'fris', 'vers'].map(function (g) { return '<option value="' + g + '">' + D.GRP_NAMES[g] + '</option>'; }).join('') + '</select></label>' +
      '<label>Alcohol (% vol)<input name="abv" type="number" min="0" max="80" step="0.5" value="0"></label>' +
      '<label>Kleur<input name="col" type="color" value="#c98a4a"></label>' +
      '<label>Fles (cl)<input name="size" type="number" min="1" max="500" value="70"></label>' +
      '<label>Prijs (euro)<input name="price" type="number" min="0" step="0.05" value="10"></label>' +
      '<label class="wide">Opmerking<input name="note" maxlength="140" placeholder="Waar koop je het, hoe bewaar je het?"></label>' +
      '<label class="check"><input type="checkbox" name="fizz"> Bruisend</label>' +
      '<div class="btn-row wide"><button class="btn btn-primary" type="submit">Voeg toe</button><button class="btn btn-ghost" type="button" data-act="cancel-ing">Annuleer</button></div></form>';
  }

  /* ----- Eigen recepten ----- */
  function viewOwn() {
    var own = ALL.filter(function (c) { return c.own; });
    var html = '<header class="page-head"><p class="kicker">Maken</p><h1 class="display">Eigen recepten</h1>' +
      '<p class="lead">Bedenk je eigen cocktails. Ze verschijnen op de kaart, met glas, kostprijs en alcoholberekening. Je recepten blijven in deze browser; exporteer ze om ze te delen of te bewaren.</p></header>' +
      '<div class="btn-row"><a class="btn btn-primary" href="#/eigen/nieuw">' + ICON.plus + '<span>Nieuw recept</span></a>' +
      '<button class="btn" data-act="export-own"' + (own.length ? '' : ' disabled') + '>' + ICON.download + '<span>Exporteer als JSON</span></button>' +
      '<label class="btn btn-ghost file-btn">' + ICON.upload + '<span>Importeer JSON</span><input type="file" accept="application/json,.json" id="import-own"></label></div>';
    if (!own.length) html += '<div class="empty"><p class="display-sm">Nog geen eigen recepten</p><p>Maak je eerste recept. Een goed vertrekpunt: neem een klassieker en vervang één ingrediënt.</p></div>';
    else html += '<div class="grid">' + own.map(function (c) { return card(c); }).join('') + '</div>';
    setView(html, 'Eigen recepten');
  }

  var draft = null;
  function viewEditor(id) {
    var existing = id ? state.own.filter(function (r) { return r.id === id; })[0] : null;
    if (id && !existing) { viewNotFound(); return; }
    draft = existing ? JSON.parse(JSON.stringify(existing)) : {
      id: '', n: '', g: 'rocks', m: 'built', ice: 'cubes', i: [['vodka', 4], ['koffielikeur', 2]], gar: '', gk: [], t: [], o: [], d: 1, s: '', prep: ''
    };
    var ingOpts = function (sel) {
      var order = ['sterk', 'likeur', 'wijnbier', 'fris', 'vers', 'basis'];
      return order.map(function (g) {
        var ids = Object.keys(ING).filter(function (k) { return ING[k].grp === g; }).sort(function (a, b) { return ING[a].name.localeCompare(ING[b].name, 'nl'); });
        return '<optgroup label="' + D.GRP_NAMES[g] + '">' + ids.map(function (k) { return '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + esc(ING[k].name) + '</option>'; }).join('') + '</optgroup>';
      }).join('');
    };
    editorIngOpts = ingOpts;
    var tasteChips = D.TASTES.map(function (t) { return '<button type="button" class="chip" data-ed="t" data-v="' + t + '" aria-pressed="' + (draft.t.indexOf(t) > -1) + '">' + t + '</button>'; }).join('');
    var occChips = Object.keys(D.OCCASIONS).map(function (k) { return '<button type="button" class="chip" data-ed="o" data-v="' + k + '" aria-pressed="' + (draft.o.indexOf(k) > -1) + '">' + D.OCCASIONS[k] + '</button>'; }).join('');
    var gkChips = LX.GARN.map(function (g) { return '<button type="button" class="chip chip-garn" data-ed="gk" data-v="' + g.k + '" aria-pressed="' + (draft.gk.indexOf(g.k) > -1) + '">' + GA.garnishIcon(g.k) + '<span>' + esc(g.n) + '</span></button>'; }).join('');
    var html = '<header class="page-head"><a class="back" href="#/eigen">' + ICON.prev + '<span>Terug naar je recepten</span></a><h1 class="display">' + (existing ? 'Bewerk je recept' : 'Nieuw recept') + '</h1></header>' +
      '<div class="editor">' +
      '<form id="editor" class="panel form-grid" novalidate>' +
      '<label class="wide">Naam<input name="n" required maxlength="60" value="' + esc(draft.n) + '" placeholder="bijvoorbeeld Hasseltse Zonsondergang"></label>' +
      '<label>Glas<select name="g">' + Object.keys(D.GLASS_NAMES).map(function (k) { return '<option value="' + k + '"' + (draft.g === k ? ' selected' : '') + '>' + D.GLASS_NAMES[k] + '</option>'; }).join('') + '</select></label>' +
      '<label>Methode<select name="m">' + Object.keys(D.METHOD_NAMES).map(function (k) { return '<option value="' + k + '"' + (draft.m === k ? ' selected' : '') + '>' + D.METHOD_NAMES[k] + '</option>'; }).join('') + '</select></label>' +
      '<label>IJs<select name="ice">' + [['cubes', 'IJsblokjes'], ['crushed', 'Crushed ice'], ['big', 'Groot ijsblok'], ['none', 'Geen ijs']].map(function (o) { return '<option value="' + o[0] + '"' + (draft.ice === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
      '<label>Moeilijkheid<select name="d">' + [[1, 'Makkelijk'], [2, 'Gemiddeld'], [3, 'Voor gevorderden']].map(function (o) { return '<option value="' + o[0] + '"' + (+draft.d === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
      '<fieldset class="wide"><legend>Ingrediënten <small>(maximaal 20, van onder naar boven in het glas)</small></legend><div id="ed-rows"></div>' +
      '<button type="button" class="btn btn-sm" data-act="ed-add">' + ICON.plus + '<span>Ingrediënt toevoegen</span></button></fieldset>' +
      '<label class="wide">Garnituur<input name="gar" maxlength="140" value="' + esc(draft.gar) + '" placeholder="bijvoorbeeld een schijfje sinaasappel"></label>' +
      '<fieldset class="wide"><legend>Garnituur tekenen <small>(maximaal 4)</small></legend><div class="chips">' + gkChips + '</div></fieldset>' +
      '<fieldset class="wide"><legend>Smaak</legend><div class="chips">' + tasteChips + '</div></fieldset>' +
      '<fieldset class="wide"><legend>Gelegenheid</legend><div class="chips">' + occChips + '</div></fieldset>' +
      '<label class="wide">Verhaal <small>(één of twee zinnen)</small><textarea name="s" rows="2" maxlength="400">' + esc(draft.s) + '</textarea></label>' +
      '<label class="wide">Extra bereidingstekst <small>(optioneel)</small><textarea name="prep" rows="3" maxlength="1500">' + esc(draft.prep) + '</textarea></label>' +
      '<p class="form-error wide" id="ed-error" role="alert"></p>' +
      '<div class="btn-row wide"><button class="btn btn-primary" type="submit">Bewaar je recept</button>' + (existing ? '<button class="btn btn-ghost" type="button" data-act="ed-delete">' + ICON.trash + '<span>Verwijder</span></button>' : '') + '</div>' +
      '</form>' +
      '<aside class="editor-preview" aria-label="Voorbeeld"><div class="spot"></div><div id="ed-glass"></div><dl class="stats stats-sm" id="ed-stats"></dl></aside>' +
      '</div>';
    setView(html, existing ? 'Bewerk recept' : 'Nieuw recept');
    renderEdRows();
    updatePreview();
  }
  var editorIngOpts = null;
  function renderEdRows() {
    $('#ed-rows').innerHTML = draft.i.map(function (r, i) {
      return '<div class="ed-row"><label><span class="sr-only">Ingrediënt ' + (i + 1) + '</span><select data-row="' + i + '" data-f="0">' + editorIngOpts(r[0]) + '</select></label>' +
        '<label><span class="sr-only">Hoeveelheid</span><input type="number" min="0" max="100" step="0.5" data-row="' + i + '" data-f="1" value="' + r[1] + '"></label>' +
        '<label><span class="sr-only">Eenheid</span><select data-row="' + i + '" data-f="2">' + [['cl', 'cl'], ['dash', 'dash'], ['st', 'stuks'], ['bl', 'barlepel'], ['tl', 'theelepel']].map(function (u) { return '<option value="' + u[0] + '"' + ((r[2] || 'cl') === u[0] ? ' selected' : '') + '>' + u[1] + '</option>'; }).join('') + '</select></label>' +
        '<label><span class="sr-only">Hoe toevoegen</span><select data-row="' + i + '" data-f="3">' + [['', 'gewoon'], ['t', 'aftoppen'], ['f', 'laten drijven']].map(function (u) { return '<option value="' + u[0] + '"' + ((r[3] || '') === u[0] ? ' selected' : '') + '>' + u[1] + '</option>'; }).join('') + '</select></label>' +
        '<button type="button" class="icon-btn" data-act="ed-del" data-row="' + i + '" aria-label="Verwijder ingrediënt ' + (i + 1) + '">' + ICON.trash + '</button></div>';
    }).join('');
  }
  function readEditor() {
    var f = $('#editor');
    ['n', 'g', 'm', 'ice', 'gar', 's', 'prep'].forEach(function (k) { draft[k] = f.elements[k].value; });
    draft.d = +f.elements.d.value;
  }
  function updatePreview() {
    readEditor();
    var c = sanitizeRecipe(Object.assign({}, draft, { id: draft.id || 'voorbeeld', n: draft.n || 'Je cocktail' }));
    if (!c) { $('#ed-glass').innerHTML = '<p class="muted">Voeg een ingrediënt toe om je glas te zien.</p>'; $('#ed-stats').innerHTML = ''; return; }
    D.enrich(c);
    $('#ed-glass').innerHTML = GA.svg(c, { pourTime: 0.9 });
    $('#ed-stats').innerHTML = '<div><dt>Sterkte</dt><dd>' + (c.alcoholFree ? 'Alcoholvrij' : num(c.units) + ' <small>std.</small>') + '</dd></div><div><dt>In het glas</dt><dd>' + num(c.abvGlass, 0) + ' <small>%</small></dd></div><div><dt>Kostprijs</dt><dd>' + euro(costPerGlass(c)) + '</dd></div>';
  }

  /* ----- AI-barman ----- */
  function getKey() { return store.get('orKey', ''); }
  function viewAI() {
    var on = state.ai.enabled, key = getKey();
    var html = '<header class="page-head"><p class="kicker">Maken</p><h1 class="display">AI-barman</h1>' +
      '<p class="lead">Beschrijf je stemming of wat je in huis hebt, en een taalmodel stelt een cocktail voor. Dit is optioneel: de rest van de app werkt volledig zonder.</p></header>' +
      '<div class="ai-layout"><section class="panel">' +
      '<label class="switch"><input type="checkbox" id="ai-on"' + (on ? ' checked' : '') + '><span class="track" aria-hidden="true"></span><span>AI-barman inschakelen</span></label>' +
      '<div id="ai-body"' + (on ? '' : ' hidden') + '>' +
      '<label class="field">OpenRouter-sleutel<input id="ai-key" type="password" autocomplete="off" spellcheck="false" placeholder="sk-or-..." value="' + (key ? '••••••••••••' : '') + '"' + (key ? ' data-saved="1"' : '') + '></label>' +
      '<div class="btn-row"><button class="btn btn-sm" data-act="ai-save">Bewaar sleutel</button><button class="btn btn-ghost btn-sm" data-act="ai-forget"' + (key ? '' : ' disabled') + '>Wis sleutel</button></div>' +
      '<p class="muted small">Je sleutel blijft enkel in deze browser (localStorage) en gaat alleen naar openrouter.ai. Model: deepseek/deepseek-v4.1-flash. Elke vraag kan een klein bedrag kosten op je OpenRouter-account.</p>' +
      '<hr>' +
      '<label class="field">Waar heb je zin in?<textarea id="ai-mood" rows="3" placeholder="bijvoorbeeld: iets fris en bitter voor op het terras, of: ik heb gin, citroen en honing"></textarea></label>' +
      '<div class="chips"><button type="button" class="chip" id="ai-bar" aria-pressed="true">Houd rekening met bar “' + esc(activeBar().name) + '”</button><button type="button" class="chip" id="ai-af" aria-pressed="false">Alcoholvrij</button></div>' +
      '<div class="btn-row"><button class="btn btn-primary" data-act="ai-ask">' + ICON.spark + '<span>Vraag een suggestie</span></button></div>' +
      '</div>' +
      '<p class="muted"' + (on ? ' hidden' : '') + ' id="ai-off-note">De AI-barman staat uit. Zet hem aan als je een OpenRouter-sleutel hebt.</p>' +
      '</section><section class="panel ai-result" id="ai-result" aria-live="polite"><p class="muted">Hier verschijnt de suggestie van de barman.</p></section></div>';
    setView(html, 'AI-barman');
  }
  function aiAsk() {
    var key = getKey();
    var out = $('#ai-result');
    if (!key) { out.innerHTML = '<p class="error">Bewaar eerst je OpenRouter-sleutel.</p>'; return; }
    var mood = $('#ai-mood').value.trim();
    if (!mood) { out.innerHTML = '<p class="error">Beschrijf eerst waar je zin in hebt.</p>'; $('#ai-mood').focus(); return; }
    var useBar = $('#ai-bar').getAttribute('aria-pressed') === 'true', af = $('#ai-af').getAttribute('aria-pressed') === 'true';
    var menu = D.COCKTAILS.map(function (c) { return c.id + ': ' + c.n; }).join('; ');
    var sys = 'Je bent de barman van Tom’s Cocktails, een cocktailbar in Hasselt. Antwoord in het Vlaams-Nederlands, spreek de gast aan met "je", en gebruik geen uitroeptekens en geen merknamen. ' +
      'Geef precies één cocktailsuggestie als JSON-object, zonder extra tekst, met deze velden: ' +
      '{"naam": string, "bestaand_id": string of null, "waarom": string (maximaal twee zinnen), "ingredienten": [{"cl": getal of null, "naam": string}], "bereiding": [string], "alcoholvrij": boolean}. ' +
      'Kies bij voorkeur een cocktail van onze kaart en zet dan het id in bestaand_id. Kaart: ' + menu;
    var user = 'Wens van de gast: ' + mood + (af ? '\nDe gast wil iets zonder alcohol.' : '') +
      (useBar && activeBar().items.length ? '\nDe gast heeft thuis: ' + activeBar().items.map(function (id) { return ING[id].name; }).join(', ') + '.' : '');
    out.innerHTML = '<div class="thinking"><span></span><span></span><span></span></div><p class="muted">De barman denkt even na…</p>';
    var ctrl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, 45000);
    fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'X-Title': "Tom's Cocktails" }, // headers moeten Latin-1 zijn: gewone apostrof
      body: JSON.stringify({ model: 'deepseek/deepseek-v4.1-flash', temperature: 0.8, messages: [{ role: 'system', content: sys }, { role: 'user', content: user }] }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, j: j }; });
    }).then(function (res) {
      clearTimeout(to);
      if (!res.ok) {
        var msg = res.status === 401 ? 'Je sleutel werd geweigerd. Controleer of je hem volledig hebt geplakt.' : res.status === 402 ? 'Je OpenRouter-tegoed is op. Vul het aan op openrouter.ai.' : res.status === 429 ? 'Even te veel vragen na elkaar. Wacht een minuutje en probeer opnieuw.' : 'OpenRouter gaf een fout terug (code ' + res.status + '). Probeer het later opnieuw.';
        out.innerHTML = '<p class="error">' + esc(msg) + '</p>'; return;
      }
      var txt = (((res.j.choices || [])[0] || {}).message || {}).content || '';
      var m = txt.match(/\{[\s\S]*\}/), data = null;
      try { data = m ? JSON.parse(m[0]) : null; } catch (e) { data = null; }
      if (!data || !data.naam) { out.innerHTML = '<h2>Suggestie</h2><p>' + esc(txt).replace(/\n/g, '<br>') + '</p>'; return; }
      var ex = data.bestaand_id && byId(String(data.bestaand_id)) ? byId(String(data.bestaand_id)) : null;
      out.innerHTML = '<div class="ai-card">' + (ex ? '<div class="ai-glass">' + GA.svg(ex, { pourTime: 1.4 }) + '</div>' : '') +
        '<div><p class="kicker">De barman stelt voor</p><h2 class="display-sm">' + esc(data.naam) + '</h2><p class="story">' + esc(data.waarom || '') + '</p>' +
        (Array.isArray(data.ingredienten) ? '<ul class="ing-list ing-plain">' + data.ingredienten.map(function (x) { return '<li><span class="amt">' + (x && x.cl ? esc(num(+x.cl)) + ' cl' : '') + '</span><span class="nm">' + esc(x && x.naam) + '</span></li>'; }).join('') + '</ul>' : '') +
        (Array.isArray(data.bereiding) ? '<ol class="steps">' + data.bereiding.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' : '') +
        (ex ? '<a class="btn btn-primary" href="#/cocktail/' + ex.id + '">Open het recept van ' + esc(ex.n) + '</a>' : '<p class="muted small">Deze suggestie staat niet op de kaart. Je kan hem zelf bewaren via Eigen recepten.</p>') +
        '</div></div>';
      AU.sfx.chime();
    }).catch(function (e) {
      clearTimeout(to);
      out.innerHTML = '<p class="error">' + (e && e.name === 'AbortError' ? 'De barman antwoordde niet op tijd. Probeer het opnieuw.' : 'Geen verbinding met OpenRouter. Controleer je internetverbinding; de rest van de app werkt gewoon offline.') + '</p>';
    });
  }

  /* ----- Instellingen ----- */
  var THEMES = { bar: ['Bar', 'Donkere toog met koperen licht'], strand: ['Strand', 'Zonsondergang aan zee'], deco: ['Jaren twintig', 'Groen fluweel en goud'] };
  function viewSettings() {
    var s = state.settings;
    var html = '<header class="page-head"><p class="kicker">Instellingen</p><h1 class="display">Sfeer en gegevens</h1></header>' +
      '<section class="panel"><h2>Thema</h2><div class="themes" role="radiogroup" aria-label="Thema">' + Object.keys(THEMES).map(function (k) {
        return '<button class="theme-opt theme-' + k + '" role="radio" data-theme="' + k + '" aria-checked="' + (s.theme === k) + '"><span class="theme-sw" aria-hidden="true"></span><strong>' + THEMES[k][0] + '</strong><small>' + THEMES[k][1] + '</small></button>';
      }).join('') + '</div></section>' +
      '<section class="panel"><h2>Geluid en beweging</h2>' +
      '<label class="switch"><input type="checkbox" data-set="sfx"' + (s.sfx ? ' checked' : '') + '><span class="track" aria-hidden="true"></span><span>Geluidseffecten (inschenken, shaken, ijs)</span></label>' +
      '<label class="switch"><input type="checkbox" data-set="music"' + (s.music ? ' checked' : '') + '><span class="track" aria-hidden="true"></span><span>Achtergrondmuziek (rustige lounge, live gegenereerd)</span></label>' +
      '<label class="switch"><input type="checkbox" data-set="reduce"' + (s.reduce ? ' checked' : '') + '><span class="track" aria-hidden="true"></span><span>Minder animaties</span></label></section>' +
      '<section class="panel"><h2>Je gegevens</h2><p class="muted">Favorieten, bars, boodschappenlijst, filters, prijzen en eigen recepten staan enkel in deze browser. Maak een back-up om ze naar een andere computer mee te nemen. Je AI-sleutel zit nooit in de back-up.</p>' +
      '<div class="btn-row"><button class="btn" data-act="backup">' + ICON.download + '<span>Download een back-up</span></button>' +
      '<label class="btn btn-ghost file-btn">' + ICON.upload + '<span>Zet een back-up terug</span><input type="file" accept="application/json,.json" id="import-all"></label>' +
      '<button class="btn btn-ghost" data-act="wipe">' + ICON.trash + '<span>Wis alles</span></button></div></section>' +
      '<section class="panel"><h2>Over deze app</h2><p>Tom’s Cocktails is een voorbeeldproject voor de cursus generatieve AI bij Syntra PXL in Hasselt. Alle recepten zijn klassiekers uit publieke kennis, zelf herschreven, zonder merknamen. Lettertypes: Fraunces, Figtree en Yellowtail (open licenties, lokaal meegeleverd).</p></section>';
    setView(html, 'Instellingen');
  }
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    document.documentElement.classList.toggle('reduce-motion', !!state.settings.reduce);
    AU.setSfx(state.settings.sfx);
    syncSoundBtn();
  }

  function viewNotFound() {
    setView('<div class="empty"><p class="display-sm">Dit recept vinden we niet</p><p>Misschien werd het verwijderd. Kies een andere cocktail op de kaart.</p><a class="btn btn-primary" href="#/">Naar de kaart</a></div>', 'Niet gevonden');
  }

  /* ---------- Shakermodus ---------- */
  var shaker = null;
  function openShaker(id, mult) {
    var c = byId(id); if (!c) return;
    var steps = buildSteps(c, mult || 1);
    var ov = $('#overlay');
    shaker = { c: c, steps: steps, i: 0, timer: null, stopSound: null, mult: mult || 1, lastLevel: 0, prevFocus: document.activeElement };
    ov.className = 'overlay shaker-mode';
    ov.hidden = false;
    ov.setAttribute('aria-label', 'Maak ' + c.n + ', stap voor stap');
    ov.innerHTML = '<div class="sh-top"><div><p class="kicker">Maak hem nu</p><p class="sh-name">' + esc(c.n) + (shaker.mult > 1 ? ' <small>voor ' + shaker.mult + ' glazen</small>' : '') + '</p></div>' +
      '<ol class="sh-progress" aria-hidden="true">' + steps.map(function () { return '<li></li>'; }).join('') + '</ol>' +
      '<button class="icon-btn icon-btn-lg" data-act="close-overlay" aria-label="Sluit de shakermodus">' + ICON.close + '</button></div>' +
      '<div class="sh-main"><div class="sh-stage" id="sh-stage"></div><div class="sh-text" id="sh-text" aria-live="polite"></div></div>' +
      '<div class="sh-nav"><button class="btn btn-lg" data-act="sh-prev">' + ICON.prev + '<span>Vorige</span></button><p class="sh-count" id="sh-count"></p><button class="btn btn-primary btn-lg" data-act="sh-next" id="sh-next"><span>Volgende</span>' + ICON.next + '</button></div>';
    document.body.classList.add('no-scroll');
    renderShStep();
    $('#sh-next').focus();
  }
  function stopTimer() {
    if (!shaker) return;
    if (shaker.timer) { clearInterval(shaker.timer); shaker.timer = null; }
    if (shaker.stopSound) { shaker.stopSound(); shaker.stopSound = null; }
    var st = $('#sh-stage'); if (st) st.classList.remove('working');
  }
  function renderShStep(dir) {
    stopTimer();
    var s = shaker.steps[shaker.i], c = shaker.c, n = shaker.steps.length;
    $$('.sh-progress li').forEach(function (li, i) { li.className = i < shaker.i ? 'done' : i === shaker.i ? 'now' : ''; });
    $('#sh-count').textContent = 'Stap ' + (shaker.i + 1) + ' van ' + n;
    var stage = $('#sh-stage');
    var liquid = c.L[Math.floor(c.L.length / 2)][0];
    var forward = dir !== -1;
    if (s.tool && s.tool !== 'glass') {
      stage.innerHTML = '<div class="tool-wrap">' + GA.tool(s.tool, liquid) + '</div>';
    } else {
      var lvl = s.level || 0;
      var from = forward ? Math.min(shaker.lastLevel, lvl) : lvl;
      var showIce = shaker.steps.slice(0, shaker.i + 1).some(function (x) { return x.k === 'ice' && x.tool === 'glass'; }) || (c.m === 'muddled' && shaker.i > 0 && shaker.steps.slice(0, shaker.i + 1).some(function (x) { return x.k === 'ice'; }));
      var garnish = s.k === 'garnish' || s.k === 'done';
      var cc = Object.assign({}, c, { gk: garnish ? c.gk : c.gk.filter(function (k) { return /rand/.test(k) && shaker.steps.slice(0, shaker.i + 1).some(function (x) { return x.rim; }); }) });
      stage.innerHTML = '<div class="glass-wrap">' + GA.svg(cc, { level: lvl, from: from, ice: showIce || (s.k === 'ice'), garnish: true, stream: lvl > from, pourTime: 1.2 }) + '</div>';
      shaker.lastLevel = lvl;
    }
    var txt = '<p class="sh-step-title">' + esc(s.title) + '</p>' + (s.big ? '<p class="sh-big">' + esc(s.big) + '</p>' : '') + (s.text ? '<p class="sh-detail">' + esc(s.text) + '</p>' : '');
    if (s.k === 'timer') {
      txt += '<div class="timer" id="timer"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring" id="ring" style="stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><output id="tsec">' + s.sec + '</output></div>' +
        '<button class="btn btn-primary btn-lg" data-act="timer-start" id="tstart">' + ICON.play + '<span>Start ' + (s.act === 'shake' ? 'met shaken' : s.act === 'stir' ? 'met roeren' : s.act === 'blend' ? 'de blender' : 'met kneuzen') + '</span></button>';
    }
    if (s.k === 'done') txt += '<div class="btn-row"><button class="btn" data-act="sh-restart">' + ICON.replay + '<span>Nog eentje</span></button><button class="btn btn-ghost" data-act="close-overlay">Terug naar het recept</button></div>';
    var tEl = $('#sh-text');
    tEl.innerHTML = txt;
    tEl.classList.remove('in'); void tEl.offsetWidth; tEl.classList.add('in');
    $('#sh-next').disabled = s.k === 'done';
    $('[data-act="sh-prev"]').disabled = shaker.i === 0;
    // geluid
    if (forward) {
      if (s.k === 'add' || s.k === 'pour') AU.sfx.pour(1.2);
      else if (s.k === 'ice') AU.sfx.clink(4);
      else if (s.k === 'garnish') AU.sfx.pop();
      else if (s.k === 'done') { AU.sfx.cheers(); celebrate(); }
      else AU.sfx.click();
    }
  }
  function startTimer() {
    var s = shaker.steps[shaker.i];
    if (shaker.timer) { stopTimer(); $('#tstart').innerHTML = ICON.play + '<span>Verder</span>'; return; }
    var total = s.sec, left = +$('#tsec').textContent || total;
    if (left <= 0) left = total;
    var stage = $('#sh-stage');
    stage.classList.add('working', 'act-' + s.act);
    var snd = AU.sfx[s.act === 'muddle' ? 'stir' : s.act];
    if (s.act === 'muddle') AU.sfx.muddle();
    shaker.stopSound = snd ? snd(left) : null;
    $('#tstart').innerHTML = ICON.pause + '<span>Pauzeer</span>';
    var t0 = Date.now(), startLeft = left;
    shaker.timer = setInterval(function () {
      var el = (Date.now() - t0) / 1000, rem = Math.max(0, startLeft - el);
      var sec = Math.ceil(rem);
      var out = $('#tsec'); if (!out) { stopTimer(); return; }
      if (+out.textContent !== sec) { out.textContent = sec; if (sec <= 3 && sec > 0) AU.sfx.tick(false); }
      $('#ring').style.strokeDashoffset = (326.7 * (1 - rem / total)).toFixed(1);
      if (rem <= 0) {
        stopTimer();
        AU.sfx.chime();
        $('#timer').classList.add('finished');
        $('#tstart').innerHTML = ICON.check + '<span>Klaar, ga verder</span>';
        $('#tstart').dataset.act = 'sh-next';
        $('#tstart').focus();
      }
    }, 100);
  }
  function celebrate() {
    var st = $('#sh-stage'); if (!st || state.settings.reduce) return;
    var burst = document.createElement('div'); burst.className = 'burst-wrap';
    for (var i = 0; i < 24; i++) {
      var b = document.createElement('i');
      b.style.setProperty('--x', (Math.random() * 2 - 1) * 180 + 'px');
      b.style.setProperty('--y', -(80 + Math.random() * 200) + 'px');
      b.style.setProperty('--s', (0.5 + Math.random()) + '');
      b.style.animationDelay = (Math.random() * 0.3) + 's';
      burst.appendChild(b);
    }
    st.appendChild(burst);
    setTimeout(function () { burst.remove(); }, 2200);
  }

  /* ---------- Feestmodus ---------- */
  var party = null;
  function openParty(list) {
    list = (list && list.length ? list : ALL).slice();
    var ov = $('#overlay');
    party = { list: list, i: 0, playing: true, timer: null, idle: null, prevFocus: document.activeElement, dur: 9000 };
    ov.className = 'overlay party-mode';
    ov.hidden = false;
    ov.setAttribute('aria-label', 'Feestmodus, diavoorstelling van cocktails');
    ov.innerHTML = '<div class="party-bg" id="party-bg"></div><div class="party-slide" id="party-slide"></div>' +
      '<div class="party-brand" aria-hidden="true"><span class="neon neon-sm">Tom’s Cocktails</span></div>' +
      '<div class="party-bar"><div class="party-progress"><i id="party-prog"></i></div>' +
      '<div class="party-ctrl"><button class="icon-btn" data-act="party-prev" aria-label="Vorige cocktail">' + ICON.prev + '</button>' +
      '<button class="icon-btn" data-act="party-toggle" id="party-toggle" aria-label="Pauzeer">' + ICON.pause + '</button>' +
      '<button class="icon-btn" data-act="party-next" aria-label="Volgende cocktail">' + ICON.next + '</button>' +
      '<label class="select select-sm"><span class="sr-only">Welke cocktails</span><select id="party-set"><option value="all">Hele kaart</option><option value="koffie">Koffielikeur</option><option value="belgisch">Belgische twists</option><option value="mocktail">Alcoholvrij</option><option value="fav">Favorieten</option></select></label>' +
      '<button class="icon-btn" data-act="close-overlay" aria-label="Sluit de feestmodus">' + ICON.close + '</button></div></div>';
    document.body.classList.add('no-scroll');
    try { if (ov.requestFullscreen) ov.requestFullscreen().catch(function () { /* geen volledig scherm */ }); } catch (e) { /* geen volledig scherm */ }
    renderParty();
    wakeParty();
  }
  function renderParty() {
    var c = party.list[party.i];
    var top = c.L[c.L.length - 1][0];
    $('#party-bg').style.setProperty('--glow', top);
    $('#party-slide').innerHTML = '<div class="party-glass">' + GA.svg(c, { stream: true, pourTime: 2.2 }) + '</div>' +
      '<div class="party-text"><p class="kicker">' + esc(c.own ? 'Eigen recept' : D.CATS[c.cat]) + '</p><h2 class="party-name">' + esc(c.n) + '</h2>' +
      '<p class="party-story">' + esc(c.s) + '</p>' +
      '<ul class="party-ing">' + c.i.map(function (r) { var p = amountParts(r, 1); return '<li><span>' + esc(p.amt) + '</span> ' + esc(p.name) + '</li>'; }).join('') + '</ul>' +
      '<p class="party-meta">' + esc(c.glassName) + ' <span aria-hidden="true">/</span> ' + esc(strengthLabel(c).toLowerCase()) + '</p></div>';
    var prog = $('#party-prog');
    prog.style.transition = 'none'; prog.style.width = '0%'; void prog.offsetWidth;
    if (party.playing) { prog.style.transition = 'width ' + party.dur + 'ms linear'; prog.style.width = '100%'; }
    clearTimeout(party.timer);
    if (party.playing) party.timer = setTimeout(function () { stepParty(1); }, party.dur);
    AU.sfx.pour(1.6);
  }
  function stepParty(d) {
    party.i = (party.i + d + party.list.length) % party.list.length;
    var sl = $('#party-slide');
    sl.classList.remove('enter'); void sl.offsetWidth; sl.classList.add('enter');
    renderParty();
  }
  function wakeParty() {
    var ov = $('#overlay');
    ov.classList.add('awake');
    clearTimeout(party.idle);
    party.idle = setTimeout(function () { if (party) ov.classList.remove('awake'); }, 2800);
  }
  function closeOverlay() {
    var ov = $('#overlay');
    if (party) { clearTimeout(party.timer); clearTimeout(party.idle); }
    stopTimer();
    var back = (party && party.prevFocus) || (shaker && shaker.prevFocus);
    party = null; shaker = null;
    ov.hidden = true; ov.innerHTML = ''; ov.className = 'overlay';
    document.body.classList.remove('no-scroll');
    try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () { /* niets */ }); } catch (e) { /* niets */ }
    if (back && back.focus && document.body.contains(back)) back.focus();
  }

  /* ---------- Bestanden ---------- */
  function download(name, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function readJsonFile(input, cb) {
    var f = input.files && input.files[0]; if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast('Dit bestand is te groot. Maximaal 2 MB.'); return; }
    var r = new FileReader();
    r.onload = function () { var d = null; try { d = JSON.parse(r.result); } catch (e) { d = null; } input.value = ''; if (!d) { toast('Dit is geen geldig JSON-bestand.'); return; } cb(d); };
    r.readAsText(f);
  }
  function importRecipes(d) {
    var recs = Array.isArray(d) ? d : d.recepten || d.recipes || [];
    var ings = d.ingredienten || [];
    var addedIng = 0;
    ings.forEach(function (o) { if (o && o.id && /^eigen-ing-/.test(o.id) && !state.ownIng.some(function (x) { return x.id === o.id; })) { state.ownIng.push(o); addedIng++; } });
    if (addedIng) { store.set('ownIng', state.ownIng); loadOwnIngredients(); }
    var n = 0;
    recs.forEach(function (r) {
      var c = sanitizeRecipe(r); if (!c) return;
      if (byId(c.id) && !byId(c.id).own) c.id = c.id + '-eigen';
      var raw = { id: c.id, n: c.n, g: c.g, m: c.m, ice: c.ice, i: c.i, gar: c.gar, gk: c.gk, t: c.t, o: c.o, d: c.d, s: c.s, prep: c.prep };
      var idx = state.own.findIndex(function (x) { return x.id === raw.id; });
      if (idx > -1) state.own[idx] = raw; else state.own.push(raw);
      n++;
    });
    store.set('own', state.own); rebuildAll();
    toast(n ? n + ' ' + plural(n, 'recept', 'recepten') + ' geïmporteerd' : 'Geen geldige recepten gevonden in dit bestand.');
    return n;
  }

  /* ---------- Gebeurtenissen ---------- */
  document.addEventListener('click', function (e) {
    AU.unlock();
    var favBtn = e.target.closest('[data-fav]');
    if (favBtn) { e.preventDefault(); toggleFav(favBtn.dataset.fav, favBtn); return; }
    var tab = e.target.closest('[data-cat]');
    if (tab) { state.filters.cat = tab.dataset.cat; saveFilters(); $$('.tab').forEach(function (b) { b.setAttribute('aria-selected', b === tab); }); AU.sfx.click(); renderGrid(); return; }
    var chip = e.target.closest('[data-fkey]');
    if (chip) {
      var arr = state.filters[chip.dataset.fkey], v = chip.dataset.fval, i = arr.indexOf(v);
      if (i > -1) arr.splice(i, 1); else arr.push(v);
      chip.setAttribute('aria-pressed', i < 0); saveFilters(); AU.sfx.click(); renderGrid(); return;
    }
    var tog = e.target.closest('[data-ftog]');
    if (tog) { var k = tog.dataset.ftog; state.filters[k] = !state.filters[k]; tog.setAttribute('aria-pressed', state.filters[k]); saveFilters(); AU.sfx.click(); renderGrid(); return; }
    var lexg = e.target.closest('[data-lexg]');
    if (lexg) { $$('[data-lexg]').forEach(function (b) { b.setAttribute('aria-pressed', b === lexg); }); renderLex($('#lex-q').value, lexg.dataset.lexg); return; }
    var barTab = e.target.closest('[data-bar]:not([data-flag])');
    if (barTab) { state.bars.active = barTab.dataset.bar; store.set('bars', state.bars); AU.sfx.click(); viewBar(); return; }
    var flag = e.target.closest('[data-flag]');
    if (flag) { toggleBarItem(flag.dataset.flag, flag.dataset.bar); var on = inBar(flag.dataset.flag, flag.dataset.bar); flag.classList.toggle('on', on); flag.setAttribute('aria-pressed', on); AU.sfx.click(); return; }
    var ed = e.target.closest('[data-ed]');
    if (ed) {
      var list = draft[ed.dataset.ed], val = ed.dataset.v, ix = list.indexOf(val);
      if (ix > -1) list.splice(ix, 1); else { if (ed.dataset.ed === 'gk' && list.length >= 4) { toast('Maximaal vier garnituren.'); return; } list.push(val); }
      ed.setAttribute('aria-pressed', ix < 0); updatePreview(); return;
    }
    var th = e.target.closest('[data-theme]');
    if (th && th.classList.contains('theme-opt')) { state.settings.theme = th.dataset.theme; saveSettings(); applyTheme(); $$('.theme-opt').forEach(function (b) { b.setAttribute('aria-checked', b === th); }); AU.sfx.pop(); return; }

    var act = e.target.closest('[data-act]');
    if (!act) return;
    var a = act.dataset.act, id = act.dataset.id, c;
    switch (a) {
      case 'shake': openShaker(id, location.hash.indexOf('#/cocktail/') === 0 ? detailMult : 1); break;
      case 'reroll':
        var cur = pickHero(), pool = D.COCKTAILS.filter(function (x) { return x.id !== cur.id; });
        state.hero = pool[Math.floor(Math.random() * pool.length)].id; AU.sfx.whoosh();
        c = pickHero();
        $('#hero-stage').innerHTML = GA.svg(c, { stream: true, pourTime: 1.8 });
        var ht = $('.hero-text');
        ht.querySelector('h1').textContent = c.n; ht.querySelector('.story').textContent = c.s;
        ht.querySelector('.hero-meta').innerHTML = esc(c.glassName) + ' <span aria-hidden="true">/</span> ' + esc(c.methodName.toLowerCase()) + ' <span aria-hidden="true">/</span> ' + esc(strengthLabel(c).toLowerCase());
        ht.querySelector('.btn-primary').setAttribute('href', '#/cocktail/' + c.id);
        ht.querySelector('[data-act="shake"]').dataset.id = c.id;
        ht.classList.remove('swap'); void ht.offsetWidth; ht.classList.add('swap');
        setTimeout(function () { AU.sfx.pour(1.6); }, 200);
        break;
      case 'party': openParty(applyFilters(ALL, state.filters)); break;
      case 'party-fav': openParty(state.fav.map(byId).filter(Boolean)); break;
      case 'clear-filters':
        state.filters = Object.assign(emptyFilters(), { sort: state.filters.sort }); saveFilters();
        $('#filters').innerHTML = filterPanel(); $('#q').value = '';
        $$('.tab').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.cat === 'alle'); });
        renderGrid(); toast('Alle filters zijn gewist'); break;
      case 'save-preset':
        if (!activeFilterCount(state.filters) && state.filters.cat === 'alle' && !state.filters.q) { toast('Kies eerst een paar filters om te bewaren.'); break; }
        var name = window.prompt('Geef je filter een naam', 'Mijn filter');
        if (name && name.trim()) {
          var copy = JSON.parse(JSON.stringify(state.filters)); delete copy.sort;
          state.presets.push({ name: name.trim().slice(0, 40), f: copy }); store.set('presets', state.presets);
          viewHome(); toast('Filter “' + name.trim() + '” bewaard');
        }
        break;
      case 'replay':
        c = byId(id); $('#detail-glass').innerHTML = GA.svg(c, { stream: true, pourTime: 2 }); AU.sfx.pour(2); break;
      case 'mult':
        c = byId(location.hash.split('/')[2].split('?')[0]);
        detailMult = Math.max(1, Math.min(40, detailMult + (+act.dataset.d))); AU.sfx.click(); renderIngredients(c); break;
      case 'to-list':
        var ex = state.list.filter(function (x) { return x.id === id; })[0];
        if (ex) ex.n += detailMult; else state.list.push({ id: id, n: detailMult });
        store.set('list', state.list); updateBadges(); AU.sfx.pop();
        toast(byId(id).n + ' staat op je boodschappenlijst'); break;
      case 'list-n':
        var it = state.list.filter(function (x) { return x.id === id; })[0];
        if (it) { it.n = Math.max(1, Math.min(99, it.n + (+act.dataset.d))); act.parentNode.querySelector('output').textContent = it.n; store.set('list', state.list); renderBuy(); AU.sfx.click(); }
        break;
      case 'list-del': state.list = state.list.filter(function (x) { return x.id !== id; }); store.set('list', state.list); updateBadges(); viewList(); break;
      case 'list-clear': if (window.confirm('Wil je je hele boodschappenlijst leegmaken?')) { state.list = []; store.set('list', state.list); updateBadges(); viewList(); } break;
      case 'copy-list':
        var txt = 'Boodschappen voor Tom’s Cocktails\n\n' + state.list.map(function (x) { return '- ' + x.n + ' x ' + byId(x.id).n; }).join('\n') + '\n\nTe kopen:\n' +
          aggregate().filter(function (x) { return !inBar(x.id); }).map(function (x) { return '[ ] ' + x.buy + ' ' + x.ing.name; }).join('\n');
        copyText(txt); break;
      case 'print': window.print(); break;
      case 'basisbar': BASISBAR.forEach(function (x) { if (!inBar(x)) toggleBarItem(x); }); AU.sfx.clink(3); viewBar(); toast('Basisbar aangevinkt'); break;
      case 'clear-bar': if (window.confirm('Wil je alles uitvinken in bar “' + activeBar().name + '”?')) { activeBar().items = []; store.set('bars', state.bars); viewBar(); } break;
      case 'rename-bar':
        var nn = window.prompt('Nieuwe naam voor deze bar', activeBar().name);
        if (nn && nn.trim()) { activeBar().name = nn.trim().slice(0, 24); store.set('bars', state.bars); viewBar(); }
        break;
      case 'add-ing': toggleBarItem(act.dataset.ing); AU.sfx.clink(2); viewBar(); toast(ING[act.dataset.ing].name + ' staat nu in je bar'); break;
      case 'new-ing': $('#ing-form').innerHTML = ingForm(); $('#new-ing-form input').focus(); break;
      case 'cancel-ing': $('#ing-form').innerHTML = ''; break;
      case 'del-ing':
        var used = ALL.some(function (x) { return x.i.some(function (r) { return r[0] === act.dataset.ing; }); });
        if (used) { toast('Dit ingrediënt zit nog in een recept. Pas dat recept eerst aan.'); break; }
        state.ownIng = state.ownIng.filter(function (x) { return x.id !== act.dataset.ing; }); store.set('ownIng', state.ownIng);
        delete ING[act.dataset.ing]; renderIngTable($('#ing-q').value); break;
      case 'reset-prices': state.prices = {}; store.set('prices', {}); renderIngTable($('#ing-q').value); toast('Alle prijzen staan terug op de richtprijs'); break;
      case 'export-own':
        download('toms-cocktails-recepten.json', { app: 'toms-cocktails', soort: 'recepten', versie: 1, recepten: state.own, ingredienten: state.ownIng });
        toast('Je recepten zijn gedownload'); break;
      case 'ed-add':
        readEditor(); if (draft.i.length >= 20) { toast('Maximaal 20 ingrediënten per recept.'); break; }
        draft.i.push(['citroensap', 2]); renderEdRows(); updatePreview(); $$('#ed-rows select')[($$('#ed-rows .ed-row').length - 1) * 3].focus(); break;
      case 'ed-del': readEditor(); draft.i.splice(+act.dataset.row, 1); renderEdRows(); updatePreview(); break;
      case 'ed-delete':
        if (window.confirm('Wil je dit recept definitief verwijderen?')) {
          state.own = state.own.filter(function (x) { return x.id !== draft.id; }); store.set('own', state.own);
          state.fav = state.fav.filter(function (x) { return x !== draft.id; }); store.set('fav', state.fav);
          rebuildAll(); location.hash = '#/eigen'; toast('Recept verwijderd');
        }
        break;
      case 'ai-save':
        var kv = $('#ai-key').value.trim();
        if ($('#ai-key').dataset.saved && /^•+$/.test(kv)) { toast('Je sleutel is al bewaard.'); break; }
        if (!/^sk-or-/.test(kv) || kv.length < 20) { toast('Dit lijkt geen OpenRouter-sleutel. Hij begint met sk-or-.'); break; }
        store.set('orKey', kv); viewAI(); toast('Je sleutel is bewaard in deze browser'); break;
      case 'ai-forget': store.del('orKey'); viewAI(); toast('Je sleutel is gewist'); break;
      case 'ai-ask': aiAsk(); break;
      case 'backup':
        download('toms-cocktails-backup.json', { app: 'toms-cocktails', soort: 'backup', versie: 1, fav: state.fav, bars: state.bars, list: state.list, presets: state.presets, recepten: state.own, ingredienten: state.ownIng, prices: state.prices, settings: state.settings });
        toast('Back-up gedownload'); break;
      case 'wipe':
        if (window.confirm('Wil je echt al je gegevens wissen? Favorieten, bars, lijsten en eigen recepten verdwijnen.')) {
          ['fav', 'bars', 'list', 'presets', 'own', 'ownIng', 'prices', 'filters', 'settings', 'ai', 'orKey'].forEach(store.del);
          location.hash = '#/'; location.reload();
        }
        break;
      case 'close-overlay': closeOverlay(); break;
      case 'sh-next': if (shaker && shaker.i < shaker.steps.length - 1) { shaker.i++; renderShStep(1); } break;
      case 'sh-prev': if (shaker && shaker.i > 0) { shaker.i--; renderShStep(-1); } break;
      case 'sh-restart': shaker.i = 0; shaker.lastLevel = 0; renderShStep(1); break;
      case 'timer-start': startTimer(); break;
      case 'party-next': stepParty(1); break;
      case 'party-prev': stepParty(-1); break;
      case 'party-toggle':
        party.playing = !party.playing;
        act.innerHTML = party.playing ? ICON.pause : ICON.play; act.setAttribute('aria-label', party.playing ? 'Pauzeer' : 'Speel af');
        renderParty(); break;
      case 'menu': toggleMenu(); break;
      case 'sound':
        state.settings.sfx = !state.settings.sfx; saveSettings(); applyTheme(); if (state.settings.sfx) AU.sfx.pop(); break;
    }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-ing]') && t.type === 'checkbox') {
      toggleBarItem(t.dataset.ing); t.closest('.bottle').classList.toggle('on', t.checked);
      if (t.checked) AU.sfx.clink(1); else AU.sfx.click();
      renderCan();
      var tabSmall = $('.bar-tab[aria-selected="true"] small'); if (tabSmall) { var n = activeBar().items.length; tabSmall.textContent = n + ' ' + plural(n, 'item', 'items'); }
      return;
    }
    if (t.matches('[data-price]')) {
      var v = parseFloat(String(t.value).replace(',', '.'));
      if (!isNaN(v) && v >= 0) { state.prices[t.dataset.price] = Math.round(v * 100) / 100; store.set('prices', state.prices); toast('Prijs van ' + ING[t.dataset.price].name + ' aangepast'); }
      return;
    }
    if (t.id === 'party-set') {
      var set = t.value, l = set === 'all' ? ALL : set === 'fav' ? state.fav.map(byId).filter(Boolean) : ALL.filter(function (x) { return x.cat === set; });
      if (!l.length) { toast('Je hebt nog geen favorieten.'); t.value = 'all'; return; }
      party.list = l; party.i = 0; renderParty(); return;
    }
    if (t.id === 'ai-on') {
      state.ai.enabled = t.checked; store.set('ai', state.ai);
      $('#ai-body').hidden = !t.checked; $('#ai-off-note').hidden = t.checked; return;
    }
    if (t.matches('[data-set]')) {
      state.settings[t.dataset.set] = t.checked; saveSettings(); applyTheme();
      if (t.dataset.set === 'music') AU.setMusic(t.checked);
      return;
    }
    if (t.id === 'import-own') { readJsonFile(t, function (d) { if (importRecipes(d)) viewOwn(); }); return; }
    if (t.id === 'import-all') {
      readJsonFile(t, function (d) {
        if (!d || d.app !== 'toms-cocktails') { toast('Dit is geen back-up van Tom’s Cocktails.'); return; }
        if (Array.isArray(d.fav)) { state.fav = d.fav.filter(function (x) { return typeof x === 'string'; }); store.set('fav', state.fav); }
        if (d.bars && d.bars.list) { BAR_IDS.forEach(function (b) { var src = d.bars.list[b]; if (src && Array.isArray(src.items)) state.bars.list[b] = { name: String(src.name || DEFAULT_BARS.list[b].name).slice(0, 24), items: src.items.filter(function (x) { return typeof x === 'string'; }) }; }); store.set('bars', state.bars); }
        if (Array.isArray(d.list)) { state.list = d.list.filter(function (x) { return x && typeof x.id === 'string'; }).map(function (x) { return { id: x.id, n: Math.max(1, Math.min(99, +x.n || 1)) }; }); store.set('list', state.list); }
        if (Array.isArray(d.presets)) { state.presets = d.presets.filter(function (p) { return p && p.name && p.f; }).map(function (p) { return { name: String(p.name).slice(0, 40), f: Object.assign(emptyFilters(), p.f) }; }); store.set('presets', state.presets); }
        if (d.prices && typeof d.prices === 'object') { state.prices = {}; Object.keys(d.prices).forEach(function (k) { if (+d.prices[k] >= 0) state.prices[k] = +d.prices[k]; }); store.set('prices', state.prices); }
        importRecipes(d);
        updateBadges(); toast('Back-up teruggezet'); viewSettings();
      });
      return;
    }
    if (t.closest('#editor')) {
      if (t.dataset.row != null) {
        var r = draft.i[+t.dataset.row], f = +t.dataset.f;
        if (f === 0) r[0] = t.value; else if (f === 1) r[1] = Math.max(0, +t.value || 0); else if (f === 2) r[2] = t.value; else { if (t.value) r[3] = t.value; else r.length = Math.min(r.length, 3); }
      }
      updatePreview();
    }
  });

  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'bar-q') { var q = t.value.toLowerCase(); $$('.bottle').forEach(function (b) { b.hidden = q && b.dataset.name.indexOf(q) < 0; }); }
    if (t.id === 'lex-q') { var g = $('[data-lexg][aria-pressed="true"]'); renderLex(t.value, g ? g.dataset.lexg : 'Alles'); }
    if (t.id === 'ing-q') renderIngTable(t.value);
    if (t.closest && t.closest('#editor') && t.dataset.row != null && t.dataset.f === '1') { draft.i[+t.dataset.row][1] = Math.max(0, +t.value || 0); updatePreview(); }
  });

  document.addEventListener('submit', function (e) {
    var f = e.target;
    e.preventDefault();
    if (f.id === 'new-ing-form') {
      var name = f.elements.name.value.trim();
      if (!name) { f.elements.name.focus(); return; }
      var o = { id: 'eigen-ing-' + Date.now().toString(36), name: name.slice(0, 40), grp: f.elements.grp.value, abv: Math.max(0, Math.min(80, +f.elements.abv.value || 0)), col: f.elements.col.value, size: Math.max(1, +f.elements.size.value || 70), price: Math.max(0, +f.elements.price.value || 0), note: f.elements.note.value.slice(0, 140), fizz: f.elements.fizz.checked };
      state.ownIng.push(o); store.set('ownIng', state.ownIng); loadOwnIngredients();
      $('#ing-form').innerHTML = ''; renderIngTable(''); toast(o.name + ' is toegevoegd'); return;
    }
    if (f.id === 'editor') {
      readEditor();
      var err = '';
      if (!draft.n.trim()) err = 'Geef je recept een naam.';
      else if (!draft.i.some(function (r) { return +r[1] > 0; })) err = 'Voeg minstens één ingrediënt met een hoeveelheid toe.';
      if (err) { $('#ed-error').textContent = err; (draft.n.trim() ? $('#ed-rows input') : f.elements.n).focus(); return; }
      var isNew = !draft.id;
      if (isNew) {
        var base = 'eigen-' + draft.n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        var idc = base || 'eigen-recept', k = 2;
        while (byId(idc)) idc = base + '-' + (k++);
        draft.id = idc;
      }
      var clean = sanitizeRecipe(draft);
      var raw = { id: clean.id, n: clean.n, g: clean.g, m: clean.m, ice: clean.ice, i: clean.i, gar: clean.gar || 'Geen', gk: clean.gk, t: clean.t, o: clean.o, d: clean.d, s: clean.s, prep: clean.prep };
      var idx = state.own.findIndex(function (x) { return x.id === raw.id; });
      if (idx > -1) state.own[idx] = raw; else state.own.push(raw);
      store.set('own', state.own); rebuildAll(); AU.sfx.chime();
      location.hash = '#/cocktail/' + raw.id;
      toast(isNew ? 'Je recept staat op de kaart' : 'Je recept is bijgewerkt');
    }
  });

  document.addEventListener('keydown', function (e) {
    var ov = $('#overlay');
    if (!ov.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeOverlay(); return; }
      if (shaker) {
        if (e.key === 'ArrowRight') { e.preventDefault(); $('[data-act="sh-next"]').click(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); $('[data-act="sh-prev"]').click(); }
        else if (e.key === ' ' && $('#tstart') && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); $('#tstart').click(); }
      }
      if (party) {
        wakeParty();
        if (e.key === 'ArrowRight') stepParty(1);
        else if (e.key === 'ArrowLeft') stepParty(-1);
        else if (e.key === ' ' && document.activeElement.tagName !== 'BUTTON' && document.activeElement.tagName !== 'SELECT') { e.preventDefault(); $('#party-toggle').click(); }
      }
      // focus binnen de overlay houden
      if (e.key === 'Tab') {
        var f = $$('button:not([disabled]), a[href], select, input', ov).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
      return;
    }
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      var q = $('#q'); if (q) { e.preventDefault(); q.focus(); }
    }
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) toggleMenu(false);
  });
  document.addEventListener('mousemove', function () { if (party) wakeParty(); });
  document.addEventListener('touchstart', function () { if (party) wakeParty(); }, { passive: true });

  function copyText(txt) {
    var done = function () { toast('De lijst staat op je klembord'); };
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(txt).then(done, fallback); } else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Kopiëren lukte niet. Selecteer de tekst zelf.'); }
      ta.remove();
    }
  }

  /* ---------- Navigatie ---------- */
  function toggleMenu(force) {
    var open = force == null ? !document.body.classList.contains('menu-open') : force;
    document.body.classList.toggle('menu-open', open);
    $('#menu-btn').setAttribute('aria-expanded', open);
  }
  function syncSoundBtn() {
    $$('[data-act="sound"]').forEach(function (b) {
      b.setAttribute('aria-pressed', state.settings.sfx);
      b.setAttribute('aria-label', state.settings.sfx ? 'Zet geluidseffecten uit' : 'Zet geluidseffecten aan');
      b.classList.toggle('muted-snd', !state.settings.sfx);
    });
  }
  function route() {
    if (!$('#overlay').hidden) closeOverlay();
    toggleMenu(false);
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('?')[0].split('/');
    var key = parts[0] || '';
    $$('.nav a').forEach(function (a) {
      var target = a.getAttribute('href').replace(/^#\/?/, '');
      var cur = target === key || (target === '' && key === 'cocktail');
      if (cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    switch (key) {
      case '': viewHome(); break;
      case 'cocktail': viewDetail(parts[1]); break;
      case 'mijnbar': viewBar(); break;
      case 'favorieten': viewFav(); break;
      case 'boodschappen': viewList(); break;
      case 'lexicon': viewLexicon(); break;
      case 'garnituur': viewGarnish(); break;
      case 'ingredienten': viewIngredients(); break;
      case 'eigen': if (parts[1] === 'nieuw') viewEditor(null); else if (parts[1] === 'bewerk') viewEditor(parts[2]); else viewOwn(); break;
      case 'ai': viewAI(); break;
      case 'instellingen': viewSettings(); break;
      default: viewNotFound();
    }
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('fullscreenchange', function () { /* volledig scherm verlaten laat de feestmodus open */ });

  applyTheme();
  updateBadges();
  if (state.settings.music) AU.wantMusic(); // start pas na de eerste klik
  route();
  document.documentElement.classList.add('ready');

  // Voor tests en debug
  window.TC_APP = { state: state, buildSteps: buildSteps, costPerGlass: costPerGlass, all: function () { return ALL; } };
})();
