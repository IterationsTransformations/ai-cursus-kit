/* Tom's Cocktails — receptenbibliotheek
   Alle recepten zijn klassiekers uit publieke kennis, zelf herschreven.
   Hoeveelheden in cl. Geen merknamen: enkel generieke ingrediënten. */
(function () {
  'use strict';

  /* ---------- Ingrediënten ----------
     grp: sterk | likeur | wijnbier | fris | vers | basis
     basis = zit altijd in huis (ijs, suiker, water) en telt niet mee bij "Wat kan ik maken?" */
  var ING = {};
  function I(id, name, abv, col, a, grp, o) {
    o = o || {};
    ING[id] = {
      id: id, name: name, abv: abv, col: col, a: a, grp: grp,
      fam: o.fam || null, fizz: !!o.fizz, buy: o.buy || null,
      cnt: o.cnt || null, stcl: o.stcl || 0, short: o.short || name
    };
  }
  // Sterke drank
  I('vodka', 'vodka', 40, '#dfe9ee', 0.22, 'sterk', { fam: 'vodka', buy: { t: 'fles', s: 70 } });
  I('gin', 'gin', 40, '#e3eef0', 0.22, 'sterk', { fam: 'gin', buy: { t: 'fles', s: 70 } });
  I('rum_wit', 'witte rum', 37.5, '#eef0ea', 0.22, 'sterk', { fam: 'rum', buy: { t: 'fles', s: 70 } });
  I('rum_bruin', 'bruine rum', 40, '#8a4316', 0.9, 'sterk', { fam: 'rum', buy: { t: 'fles', s: 70 } });
  I('tequila', 'tequila', 38, '#f1ecd6', 0.3, 'sterk', { fam: 'tequila', buy: { t: 'fles', s: 70 } });
  I('cachaca', 'cachaça', 40, '#f0eedf', 0.25, 'sterk', { fam: 'rum', buy: { t: 'fles', s: 70 } });
  I('whisky', 'whisky', 40, '#c97b2b', 0.85, 'sterk', { fam: 'whisky', buy: { t: 'fles', s: 70 } });
  I('bourbon', 'bourbon', 40, '#b9621d', 0.88, 'sterk', { fam: 'whisky', buy: { t: 'fles', s: 70 } });
  I('cognac', 'cognac', 40, '#9c4a18', 0.9, 'sterk', { fam: 'cognac', buy: { t: 'fles', s: 70 } });
  I('jenever_jong', 'jonge jenever', 35, '#eef0e8', 0.22, 'sterk', { fam: 'jenever', buy: { t: 'fles', s: 70 } });
  I('jenever_oud', 'oude graanjenever', 35, '#d8a95a', 0.75, 'sterk', { fam: 'jenever', buy: { t: 'fles', s: 70 } });
  // Likeuren en aperitieven
  I('koffielikeur', 'koffielikeur', 20, '#2a130a', 0.97, 'likeur', { fam: 'koffielikeur', buy: { t: 'fles', s: 70 } });
  I('irish_cream', 'Ierse roomlikeur', 17, '#c9a27a', 1, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 70 } });
  I('amaretto', 'amandellikeur (amaretto)', 28, '#a3501c', 0.9, 'likeur', { fam: 'likeur', short: 'amaretto', buy: { t: 'fles', s: 70 } });
  I('triple_sec', 'sinaasappellikeur (triple sec)', 40, '#f3eedc', 0.25, 'likeur', { fam: 'likeur', short: 'triple sec', buy: { t: 'fles', s: 70 } });
  I('cacao_wit', 'witte cacaolikeur', 24, '#efe6d2', 0.3, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 70 } });
  I('menthe', 'groene muntlikeur', 24, '#2aa65a', 0.9, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 70 } });
  I('vermout_rood', 'rode vermout', 15, '#7a1d16', 0.9, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 75 } });
  I('vermout_droog', 'droge vermout', 18, '#efe7c4', 0.3, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 75 } });
  I('bitter_rood', 'rode bitterlikeur', 25, '#c11b28', 0.95, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 70 } });
  I('aperitiefbitter', 'oranje aperitiefbitter', 11, '#f4661d', 0.92, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 70 } });
  I('cassis', 'cassislikeur', 15, '#5a0f2e', 0.97, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 50 } });
  I('perziklikeur', 'perziklikeur', 20, '#f6c38c', 0.5, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 70 } });
  I('curacao_blauw', 'blauwe curaçao', 20, '#1c8fe3', 0.95, 'likeur', { fam: 'likeur', buy: { t: 'fles', s: 70 } });
  I('bitters', 'aromatische bitters', 44, '#5e1a0e', 1, 'likeur', { buy: { t: 'flesje', s: 20 } });
  // Wijn en bier
  I('bubbels', 'mousserende wijn', 11, '#f3e3a2', 0.55, 'wijnbier', { fam: 'wijn', fizz: true, buy: { t: 'fles', s: 75 } });
  I('kriek', 'kriekbier', 4, '#a8142c', 0.95, 'wijnbier', { fam: 'bier', fizz: true, buy: { t: 'flesje', s: 37.5 } });
  I('witbier', 'witbier', 5, '#f1d987', 0.85, 'wijnbier', { fam: 'bier', fizz: true, buy: { t: 'flesje', s: 33 } });
  I('tripel', 'Belgische tripel', 8.5, '#e3a32e', 0.9, 'wijnbier', { fam: 'bier', fizz: true, buy: { t: 'flesje', s: 33 } });
  I('pils', 'pils', 5.2, '#efbf3c', 0.85, 'wijnbier', { fam: 'bier', fizz: true, buy: { t: 'flesje', s: 25 } });
  // Frisdrank, mixers en siropen
  I('cola', 'cola', 0, '#3a170b', 0.96, 'fris', { fizz: true, buy: { t: 'blikje', s: 33 } });
  I('tonic', 'tonic', 0, '#edf3f1', 0.18, 'fris', { fizz: true, buy: { t: 'flesje', s: 20 } });
  I('spuitwater', 'bruisend water', 0, '#eef4f6', 0.12, 'fris', { fizz: true, buy: { t: 'fles', s: 100 } });
  I('gemberbier', 'gemberbier', 0, '#e8d6a0', 0.6, 'fris', { fizz: true, buy: { t: 'flesje', s: 20 } });
  I('ginger_ale', 'ginger ale', 0, '#e6be68', 0.7, 'fris', { fizz: true, buy: { t: 'flesje', s: 20 } });
  I('citroenfris', 'citroenlimonade', 0, '#eef3e2', 0.2, 'fris', { fizz: true, buy: { t: 'fles', s: 100 } });
  I('pompelmoesfris', 'pompelmoeslimonade', 0, '#f6c6ae', 0.6, 'fris', { fizz: true, buy: { t: 'fles', s: 100 } });
  I('grenadine', 'grenadine', 0, '#c8102e', 1, 'fris', { buy: { t: 'fles', s: 70 } });
  I('amandelsiroop', 'amandelsiroop', 0, '#efe2cc', 0.7, 'fris', { buy: { t: 'fles', s: 70 } });
  I('vlierbloesem', 'vlierbloesemsiroop', 0, '#efe6b4', 0.5, 'fris', { buy: { t: 'fles', s: 50 } });
  I('speculoossiroop', 'speculaassiroop', 0, '#a3622a', 0.95, 'fris', { buy: { t: 'fles', s: 50 } });
  I('chocoladesiroop', 'chocoladesiroop', 0, '#3a1a0c', 1, 'fris', { buy: { t: 'fles', s: 50 } });
  I('honingsiroop', 'honingsiroop', 0, '#e7ad45', 0.85, 'fris', { buy: { t: 'potje', s: 25 } });
  I('kokosroom', 'kokosroom', 0, '#f5efe4', 1, 'fris', { buy: { t: 'blik', s: 40 } });
  I('nagin', 'alcoholvrije gin', 0, '#e3eef0', 0.2, 'fris', { buy: { t: 'fles', s: 70 } });
  I('espresso', 'espresso', 0, '#2b140a', 1, 'vers', { buy: { t: 'espresso', s: 3 }, short: 'espresso' });
  I('koffie', 'hete koffie', 0, '#3a1c0d', 1, 'vers', { buy: { t: 'kop', s: 15 } });
  // Vers, sap en zuivel
  I('limoensap', 'vers limoensap', 0, '#e4edbf', 0.4, 'vers', { buy: { t: 'limoen', s: 3 }, short: 'limoensap' });
  I('citroensap', 'vers citroensap', 0, '#f4efb6', 0.4, 'vers', { buy: { t: 'citroen', s: 4 }, short: 'citroensap' });
  I('limoen', 'limoen', 0, '#9cc93a', 0.4, 'vers', { cnt: ['limoen', 'limoenen'], stcl: 2, buy: { t: 'limoen', s: 1, st: true } });
  I('munt', 'verse munt', 0, '#3e9a4c', 0, 'vers', { cnt: ['muntblaadje', 'muntblaadjes'], buy: { t: 'bosje munt', s: 20, st: true } });
  I('sinaasappelsap', 'sinaasappelsap', 0, '#f6a11c', 0.95, 'vers', { buy: { t: 'pak', s: 100 } });
  I('ananassap', 'ananassap', 0, '#f5d35a', 0.92, 'vers', { buy: { t: 'pak', s: 100 } });
  I('cranberrysap', 'cranberrysap', 0, '#b3122e', 0.95, 'vers', { buy: { t: 'pak', s: 100 } });
  I('tomatensap', 'tomatensap', 0, '#b32218', 1, 'vers', { buy: { t: 'pak', s: 100 } });
  I('aardbeienpuree', 'aardbeienpuree', 0, '#df2f45', 1, 'vers', { buy: { t: 'bakje aardbeien', s: 15 } });
  I('room', 'vloeibare room', 0, '#f2e8d4', 1, 'vers', { buy: { t: 'brikje', s: 25 } });
  I('melk', 'melk', 0, '#f6f1e7', 1, 'vers', { buy: { t: 'pak', s: 100 } });
  I('eiwit', 'eiwit', 0, '#f6f0e0', 0.6, 'vers', { cnt: ['eiwit', 'eiwitten'], stcl: 3, buy: { t: 'ei', s: 1, st: true } });
  I('vanille_ijs', 'vanille-ijs', 0, '#f3e5c4', 1, 'vers', { cnt: ['bolletje vanille-ijs', 'bolletjes vanille-ijs'], stcl: 4, buy: { t: 'doos ijs', s: 12, st: true } });
  I('kruiden', 'worcestersaus en tabasco', 0, '#5a1c10', 1, 'vers', { buy: { t: 'flesje', s: 15 } });
  // Basis: altijd in huis
  I('suikersiroop', 'suikersiroop', 0, '#f6f2e8', 0.3, 'basis');
  I('suikerklontje', 'suikerklontje', 0, '#ffffff', 0, 'basis', { cnt: ['suikerklontje', 'suikerklontjes'] });
  I('bruine_suiker', 'rietsuiker', 0, '#c58b4a', 0, 'basis');
  I('water', 'water', 0, '#eef4f6', 0.08, 'basis');
  I('zout', 'zout en peper', 0, '#ffffff', 0, 'basis');

  /* Richtprijzen in euro per aankoopeenheid (Belgische supermarkt, 2026). Pas ze aan in de app. */
  var PRICE = {
    vodka: 16, gin: 24, rum_wit: 17, rum_bruin: 20, tequila: 22, cachaca: 21, whisky: 24, bourbon: 26, cognac: 34,
    jenever_jong: 15, jenever_oud: 19, koffielikeur: 17, irish_cream: 15, amaretto: 16, triple_sec: 18, cacao_wit: 17,
    menthe: 16, vermout_rood: 11, vermout_droog: 11, bitter_rood: 18, aperitiefbitter: 14, cassis: 12, perziklikeur: 15,
    curacao_blauw: 14, bitters: 13, bubbels: 9, kriek: 2.2, witbier: 1.3, tripel: 1.9, pils: 0.9, cola: 0.9, tonic: 0.8,
    spuitwater: 0.7, gemberbier: 1.2, ginger_ale: 1, citroenfris: 1.2, pompelmoesfris: 1.6, grenadine: 4, amandelsiroop: 7,
    vlierbloesem: 6, speculoossiroop: 7, chocoladesiroop: 4, honingsiroop: 4, kokosroom: 3, nagin: 22, espresso: 0.4, koffie: 0.5,
    limoensap: 0.45, citroensap: 0.4, limoen: 0.45, munt: 1.5, sinaasappelsap: 2.5, ananassap: 2, cranberrysap: 3, tomatensap: 2,
    aardbeienpuree: 3.5, room: 1.2, melk: 1.1, eiwit: 0.35, vanille_ijs: 4.5, kruiden: 3
  };
  var NOTE = {
    vodka: 'Neutraal en zuiver. Een middenklasser volstaat voor de meeste cocktails.',
    gin: 'Jeneverbes is de basis. Een klassieke London dry is de veiligste keuze.',
    rum_wit: 'Licht en fris, ideaal voor mojito en daiquiri.',
    rum_bruin: 'Gerijpt op vat, met tonen van karamel en vanille.',
    tequila: 'Kies een tequila van 100 procent agave voor de zuiverste smaak.',
    cachaca: 'Gestookt uit vers suikerrietsap, grassiger dan rum.',
    whisky: 'Voor Irish Coffee neem je bij voorkeur een zachte Ierse whiskey.',
    bourbon: 'Amerikaanse whiskey met veel maïs: zoet, vanille en eik.',
    cognac: 'Franse brandewijn. Een VS-kwaliteit is prima om te mixen.',
    jenever_jong: 'Jonge jenever is zacht en neutraal, met weinig moutwijn.',
    jenever_oud: 'Oude jenever heeft meer moutwijn en smaakt voller. Hasselt is de jeneverstad bij uitstek.',
    koffielikeur: 'Zoete likeur op basis van koffie, rum en suiker. Het hart van de koffiecocktails.',
    irish_cream: 'Room, whiskey en cacao. Bewaar na opening in de koelkast.',
    amaretto: 'Italiaanse likeur met de smaak van bittere amandel.',
    triple_sec: 'Heldere sinaasappellikeur. Onmisbaar in margarita en cosmopolitan.',
    vermout_rood: 'Versterkte, gekruide wijn. Na opening in de koelkast bewaren, en binnen een maand opdrinken.',
    vermout_droog: 'Droog en kruidig. Ook deze hoort na opening in de koelkast.',
    bitter_rood: 'Bitterzoete Italiaanse aperitieflikeur, knalrood.',
    aperitiefbitter: 'Lichter en zoeter dan rode bitter, de basis van de spritz.',
    bitters: 'Een paar druppels geven diepte. Een flesje gaat jaren mee.',
    bubbels: 'Cava, prosecco of crémant: een droge (brut) variant werkt het best.',
    kriek: 'Belgisch bier met zure kersen, vaak op basis van lambiek.',
    witbier: 'Ongefilterd tarwebier met koriander en sinaasappelschil.',
    tripel: 'Sterk, goudblond Belgisch bier met hergisting op fles.',
    tonic: 'Hoe kouder en bruisender, hoe beter. Kleine flesjes blijven langer fris.',
    gemberbier: 'Pittiger dan ginger ale. Essentieel voor een mule.',
    limoensap: 'Altijd vers persen. Sap uit een fles smaakt vlak.',
    citroensap: 'Vers geperst, op kamertemperatuur geeft een citroen meer sap.',
    espresso: 'Vers gezet en kort afgekoeld geeft de mooiste crema.',
    room: 'Voor drijvende room: licht opkloppen tot hij net begint te binden.',
    eiwit: 'Gebruik verse eieren. Kikkererwtenvocht (aquafaba) is een plantaardig alternatief.',
    suikersiroop: 'Zelf maken: gelijke delen suiker en heet water, roeren tot helder.',
    munt: 'Kneus zachtjes, anders komt er bitterheid vrij.',
    speculoossiroop: 'Een Belgische twist: kaneel, nootmuskaat en karamel.',
    nagin: 'Alcoholvrij distillaat met botanicals zoals jeneverbes.'
  };
  Object.keys(ING).forEach(function (k) { ING[k].price = PRICE[k] != null ? PRICE[k] : 0; ING[k].note = NOTE[k] || ''; });

  var GRP_NAMES = {
    sterk: 'Sterke drank', likeur: 'Likeuren en aperitieven', wijnbier: 'Wijn en bier',
    fris: 'Frisdrank, mixers en siropen', vers: 'Vers, sap en zuivel', basis: 'Basis'
  };

  var GLASS_NAMES = {
    highball: 'longdrinkglas', rocks: 'tumbler', martini: 'martiniglas', coupe: 'coupe',
    shot: 'shotglas', hurricane: 'hurricaneglas', wijn: 'ballonglas', flute: 'champagneflûte',
    mok: 'koperen mok', irish: 'irish-coffeeglas', tulp: 'tulpglas', margarita: 'margaritaglas'
  };

  var METHOD_NAMES = {
    built: 'In het glas gebouwd', shaken: 'Geshaket', stirred: 'Geroerd', layered: 'Gelaagd',
    blended: 'Geblend', muddled: 'Gekneusd en gebouwd', hot: 'Warm geserveerd'
  };

  var CATS = {
    koffie: 'Koffielikeur', klassiek: 'Klassiekers', belgisch: 'Belgische twists', mocktail: 'Alcoholvrij'
  };

  var TYPES = { cocktail: 'Cocktail', longdrink: 'Longdrink', bubbels: 'Met bubbels', bier: 'Biercocktail', shot: 'Shot', warm: 'Warm' };

  var TASTES = ['zoet', 'zuur', 'bitter', 'romig', 'fris', 'fruitig', 'kruidig', 'koffie', 'bruisend', 'tropisch', 'chocolade', 'nootachtig', 'hartig', 'bloemig'];
  var OCCASIONS = { aperitief: 'Aperitief', dessert: 'Na het eten', feest: 'Feest', zomer: 'Zomer', winter: 'Winter', brunch: 'Brunch', nightcap: 'Slaapmutsje' };

  /* ---------- Cocktails ----------
     i: [ingrediënt, hoeveelheid, eenheid (cl|dash|st|bl|tl), vlag ('t' = aftoppen, 'f' = laten drijven)]
     g: glas, m: methode, ice: cubes|crushed|none|big, gk: garnituur om te tekenen
     L: zelf gekozen lagen [kleur, aandeel] van onder naar boven, foam: schuimlaag */
  var C = [
    // ===== Koffielikeur =====
    { id: 'white-russian', n: 'White Russian', cat: 'koffie', g: 'rocks', m: 'built', ice: 'cubes',
      i: [['vodka', 5], ['koffielikeur', 2], ['room', 3, 'cl', 'f']],
      gar: 'Geen, of een snuifje geraspte nootmuskaat', gk: ['nootmuskaat'],
      t: ['romig', 'zoet', 'koffie'], o: ['dessert', 'nightcap'], d: 1,
      s: 'Werd wereldberoemd dankzij een cultfilm uit 1998 waarin de hoofdrol bijna niets anders drinkt.',
      L: [['#2f170c', 0.6], ['#efe1c8', 0.4]] },
    { id: 'black-russian', n: 'Black Russian', cat: 'koffie', g: 'rocks', m: 'built', ice: 'cubes',
      i: [['vodka', 5], ['koffielikeur', 2]],
      gar: 'Geen', gk: [], t: ['koffie', 'zoet', 'bitter'], o: ['nightcap', 'feest'], d: 1,
      s: 'Bedacht in 1949 in een hotelbar in Brussel voor een Amerikaanse ambassadrice. Een Belgische klassieker dus.',
      L: [['#2a130a', 1]] },
    { id: 'espresso-martini', n: 'Espresso Martini', cat: 'koffie', g: 'martini', m: 'shaken', ice: 'none',
      i: [['vodka', 5], ['koffielikeur', 3], ['espresso', 3], ['suikersiroop', 1]],
      gar: 'Drie koffiebonen op het schuim', gk: ['bonen'],
      t: ['koffie', 'bitter', 'zoet'], o: ['feest', 'nightcap', 'dessert'], d: 2,
      s: 'Eind jaren tachtig in Londen bedacht voor een gast die iets wilde dat haar wakker maakte en tegelijk ontspande.',
      L: [['#24100a', 1]], foam: '#c99b64' },
    { id: 'b-52', n: 'B-52', cat: 'koffie', g: 'shot', m: 'layered', ice: 'none',
      i: [['koffielikeur', 2], ['irish_cream', 2], ['triple_sec', 2]],
      gar: 'Geen', gk: [], t: ['zoet', 'romig', 'koffie'], o: ['feest'], d: 3,
      s: 'Drie lagen die netjes op elkaar blijven liggen, dat is het hele kunstje. Giet traag over de bolle kant van een lepel.',
      L: [['#2a130a', 0.34], ['#c9a27a', 0.33], ['#f2c46b', 0.33]] },
    { id: 'mudslide', n: 'Mudslide', cat: 'koffie', g: 'hurricane', m: 'blended', ice: 'crushed',
      i: [['vodka', 3], ['koffielikeur', 3], ['irish_cream', 3], ['vanille_ijs', 2, 'st']],
      gar: 'Chocoladesiroop langs de binnenkant van het glas en een toef slagroom', gk: ['slagroom', 'cacao', 'chocostrepen'],
      t: ['romig', 'zoet', 'chocolade', 'koffie'], o: ['dessert', 'feest'], d: 2,
      s: 'Ontstaan op de Kaaimaneilanden in de jaren zeventig, toen een barman een White Russian een flinke upgrade gaf.',
      L: [['#8a5a3a', 1]] },
    { id: 'colorado-bulldog', n: 'Colorado Bulldog', cat: 'koffie', g: 'highball', m: 'built', ice: 'cubes',
      i: [['vodka', 3], ['koffielikeur', 3], ['room', 3], ['cola', 6, 'cl', 't']],
      gar: 'Een rietje', gk: ['rietje'], t: ['romig', 'bruisend', 'koffie', 'zoet'], o: ['feest'], d: 1,
      s: 'Een White Russian met een scheut cola. Het bruisende schuim bovenop is de bulldog.',
      L: [['#6b3f26', 0.75], ['#b48a66', 0.25]], fizzOn: true },
    { id: 'koffie-cola', n: 'Koffielikeur-cola', cat: 'koffie', g: 'highball', m: 'built', ice: 'cubes',
      i: [['koffielikeur', 5], ['cola', 12, 'cl', 't']],
      gar: 'Een partje limoen', gk: ['limoen'], t: ['zoet', 'bruisend', 'koffie'], o: ['feest'], d: 1,
      s: 'De eenvoudigste koffielikeurdrank die er bestaat, en waarschijnlijk de populairste op Vlaamse fuiven.' },
    { id: 'dirty-mother', n: 'Dirty Mother', cat: 'koffie', g: 'rocks', m: 'built', ice: 'big',
      i: [['cognac', 4], ['koffielikeur', 2]],
      gar: 'Geen', gk: [], t: ['koffie', 'zoet', 'kruidig'], o: ['nightcap'], d: 1,
      s: 'Het Franse broertje van de Black Russian: cognac in plaats van vodka maakt hem warmer en ronder.' },
    { id: 'brave-bull', n: 'Brave Bull', cat: 'koffie', g: 'rocks', m: 'built', ice: 'cubes',
      i: [['tequila', 4], ['koffielikeur', 2]],
      gar: 'Een zestje citroen', gk: ['twist'], t: ['koffie', 'kruidig'], o: ['nightcap', 'feest'], d: 1,
      s: 'Koffielikeur en tequila, allebei met Mexicaanse roots. Kort, krachtig en zonder fratsen.' },
    { id: 'toasted-almond', n: 'Toasted Almond', cat: 'koffie', g: 'rocks', m: 'shaken', ice: 'cubes',
      i: [['koffielikeur', 3], ['amaretto', 3], ['room', 3]],
      gar: 'Geschaafde amandelen of nootmuskaat', gk: ['nootmuskaat'],
      t: ['romig', 'zoet', 'nootachtig', 'koffie'], o: ['dessert'], d: 1,
      s: 'Smaakt naar geroosterde amandelen met koffie, al zit er geen enkele amandel in het glas.',
      L: [['#a4724c', 1]] },
    { id: 'mind-eraser', n: 'Mind Eraser', cat: 'koffie', g: 'rocks', m: 'layered', ice: 'cubes',
      i: [['koffielikeur', 3], ['vodka', 3], ['spuitwater', 4]],
      gar: 'Een rietje', gk: ['rietje'], t: ['koffie', 'bruisend', 'zoet'], o: ['feest'], d: 2,
      s: 'Drie lagen die van donker naar helder gaan. Zolang je niet roert, blijven ze mooi gescheiden.',
      L: [['#2a130a', 0.32], ['#6d4a36', 0.28], ['#cfd9dc', 0.4]] },
    { id: 'mini-stout', n: 'Mini Stout', cat: 'koffie', g: 'shot', m: 'layered', ice: 'none',
      i: [['koffielikeur', 2.5], ['irish_cream', 0.7, 'cl', 'f']],
      gar: 'Geen', gk: [], t: ['koffie', 'romig', 'zoet'], o: ['feest'], d: 2,
      s: 'Een shotje dat eruitziet als een piepklein glas donker Iers bier, met de roomlikeur als schuimkraag.',
      L: [['#1f0d06', 0.78], ['#e6cfa8', 0.22]] },
    { id: 'mexicaanse-koffie', n: 'Mexicaanse koffie', cat: 'koffie', g: 'irish', m: 'hot', ice: 'none',
      i: [['tequila', 2], ['koffielikeur', 2], ['koffie', 12]],
      gar: 'Een toef slagroom en wat cacao', gk: ['slagroom', 'cacao'],
      t: ['koffie', 'zoet', 'romig'], o: ['winter', 'dessert'], d: 1,
      s: 'Een winterse koffie met een zuiderse knipoog. Ideaal na een koude wandeling door de Limburgse bossen.',
      L: [['#3a1c0d', 1]], hot: true },
    { id: 'koffietonic', n: 'Koffielikeur-tonic', cat: 'koffie', g: 'highball', m: 'built', ice: 'cubes',
      i: [['tonic', 12], ['koffielikeur', 4, 'cl', 'f']],
      gar: 'Een schijfje sinaasappel', gk: ['sinaas'], t: ['bitter', 'bruisend', 'koffie', 'fris'], o: ['aperitief', 'zomer'], d: 1,
      s: 'Bitter en zoet in één glas. Giet de likeur als laatste en kijk hoe hij langzaam naar beneden zakt.',
      L: [['#2a130a', 0.22], ['#6b4630', 0.13], ['#dfe7e6', 0.65]] },
    { id: 'irish-coffee', n: 'Irish Coffee', cat: 'koffie', g: 'irish', m: 'hot', ice: 'none',
      i: [['whisky', 4], ['koffie', 9], ['bruine_suiker', 2, 'tl'], ['room', 3, 'cl', 'f']],
      gar: 'Licht opgeklopte room die op de koffie drijft', gk: [],
      t: ['koffie', 'romig', 'zoet'], o: ['winter', 'dessert'], d: 2,
      s: 'In 1943 bedacht op een Ierse luchthaven om verkleumde reizigers op te warmen. Drink hem door de koude room heen.',
      L: [['#2b140a', 0.74], ['#f1e6cf', 0.26]], hot: true },
    { id: 'revolver', n: 'Revolver', cat: 'koffie', g: 'coupe', m: 'stirred', ice: 'none',
      i: [['bourbon', 5], ['koffielikeur', 1.5], ['bitters', 2, 'dash']],
      gar: 'Een zestje sinaasappel', gk: ['twist-oranje'], t: ['koffie', 'kruidig', 'bitter'], o: ['nightcap'], d: 2,
      s: 'Een moderne klassieker uit San Francisco, begin jaren 2000: een Manhattan met koffie in de hoofdrol.' },
    { id: 'tiramisu-martini', n: 'Tiramisu Martini', cat: 'koffie', g: 'coupe', m: 'shaken', ice: 'none',
      i: [['koffielikeur', 3], ['amaretto', 2], ['vodka', 2], ['room', 3]],
      gar: 'Cacaopoeder', gk: ['cacao'], t: ['romig', 'zoet', 'koffie', 'chocolade'], o: ['dessert'], d: 2,
      s: 'Het Italiaanse dessert, maar dan om te drinken. Een lepel heb je niet nodig.',
      L: [['#9a6a46', 1]], foam: '#e9dcc5' },
    { id: 'koffiesour', n: 'Koffiesour', cat: 'koffie', g: 'rocks', m: 'shaken', ice: 'cubes',
      i: [['koffielikeur', 5], ['citroensap', 2.5], ['suikersiroop', 1], ['eiwit', 1, 'st']],
      gar: 'Drie koffiebonen op het schuim', gk: ['bonen'], t: ['zuur', 'koffie', 'zoet'], o: ['aperitief', 'feest'], d: 3,
      s: 'Zuur en koffie lijken geen vrienden, tot je ze samen shaket met eiwit. Het schuim maakt het af.',
      L: [['#4a2414', 1]], foam: '#f2e7d2' },
    { id: 'paralyzer', n: 'Paralyzer', cat: 'koffie', g: 'highball', m: 'built', ice: 'cubes',
      i: [['vodka', 3], ['koffielikeur', 3], ['cola', 6], ['melk', 6, 'cl', 't']],
      gar: 'Een rietje', gk: ['rietje'], t: ['romig', 'zoet', 'koffie', 'bruisend'], o: ['feest'], d: 1,
      s: 'Een Canadese studentenklassieker uit de jaren zeventig, ergens tussen een Colorado Bulldog en ijskoffie.',
      L: [['#4b2817', 0.55], ['#a77d5c', 0.45]] },

    // ===== Klassiekers =====
    { id: 'mojito', n: 'Mojito', cat: 'klassiek', g: 'highball', m: 'muddled', ice: 'crushed',
      i: [['munt', 8, 'st'], ['limoensap', 2], ['suikersiroop', 2], ['rum_wit', 4.5], ['spuitwater', 8, 'cl', 't']],
      gar: 'Een takje munt en een partje limoen', gk: ['munt', 'limoen', 'rietje'],
      t: ['fris', 'zuur', 'zoet'], o: ['zomer', 'feest'], d: 2,
      s: 'Cubaanse zomer in een glas. Kneus de munt zachtjes: je wilt de geur eruit, niet de bitterheid.' },
    { id: 'margarita', n: 'Margarita', cat: 'klassiek', g: 'margarita', m: 'shaken', ice: 'none',
      i: [['tequila', 5], ['triple_sec', 2], ['limoensap', 1.5]],
      gar: 'Zoutrandje en een schijfje limoen', gk: ['zoutrand', 'limoen'],
      t: ['zuur', 'fris', 'fruitig'], o: ['zomer', 'feest', 'aperitief'], d: 2,
      s: 'Over wie hem bedacht, bestaan minstens vijf verhalen. Over het zoutrandje is iedereen het eens.',
      L: [['#e8ecc4', 1]] },
    { id: 'daiquiri', n: 'Daiquiri', cat: 'klassiek', g: 'coupe', m: 'shaken', ice: 'none',
      i: [['rum_wit', 6], ['limoensap', 2], ['suikersiroop', 1.5]],
      gar: 'Een schijfje limoen', gk: ['limoen'], t: ['zuur', 'fris', 'zoet'], o: ['aperitief', 'zomer'], d: 1,
      s: 'Genoemd naar een strand op Cuba, rond 1900. Drie ingrediënten in perfect evenwicht.',
      L: [['#eef0d6', 1]] },
    { id: 'caipirinha', n: 'Caipirinha', cat: 'klassiek', g: 'rocks', m: 'muddled', ice: 'crushed',
      i: [['limoen', 0.5, 'st'], ['bruine_suiker', 2, 'tl'], ['cachaca', 6]],
      gar: 'De gekneusde limoenpartjes blijven in het glas', gk: ['limoenpartjes'],
      t: ['zuur', 'fris', 'zoet'], o: ['zomer', 'feest'], d: 2,
      s: 'Het nationale drankje van Brazilië. Cachaça wordt gestookt uit vers suikerrietsap.',
      L: [['#e9efc9', 1]] },
    { id: 'cosmopolitan', n: 'Cosmopolitan', cat: 'klassiek', g: 'martini', m: 'shaken', ice: 'none',
      i: [['vodka', 4], ['triple_sec', 1.5], ['limoensap', 1.5], ['cranberrysap', 3]],
      gar: 'Een zestje sinaasappel', gk: ['twist-oranje'], t: ['fruitig', 'zuur', 'fris'], o: ['feest', 'aperitief'], d: 2,
      s: 'Roze, scherp en elegant. Werd een icoon dankzij een tv-serie over vier vriendinnen in New York.',
      L: [['#e2546f', 1]] },
    { id: 'negroni', n: 'Negroni', cat: 'klassiek', g: 'rocks', m: 'stirred', ice: 'big',
      i: [['gin', 3], ['vermout_rood', 3], ['bitter_rood', 3]],
      gar: 'Een schijfje sinaasappel', gk: ['sinaas'], t: ['bitter', 'kruidig'], o: ['aperitief'], d: 1,
      s: 'In 1919 vroeg graaf Negroni in Florence om zijn aperitief wat steviger te maken. Gin in plaats van spuitwater.',
      L: [['#a8131d', 1]] },
    { id: 'old-fashioned', n: 'Old Fashioned', cat: 'klassiek', g: 'rocks', m: 'stirred', ice: 'big',
      i: [['suikerklontje', 1, 'st'], ['bitters', 2, 'dash'], ['water', 0.5], ['bourbon', 4.5]],
      gar: 'Een zestje sinaasappel en eventueel een kers', gk: ['twist-oranje', 'kers'],
      t: ['kruidig', 'zoet', 'bitter'], o: ['nightcap'], d: 2,
      s: 'Waarschijnlijk de oudste cocktail die we kennen: sterke drank, suiker, water en bitters. Meer heb je niet nodig.' },
    { id: 'manhattan', n: 'Manhattan', cat: 'klassiek', g: 'coupe', m: 'stirred', ice: 'none',
      i: [['bourbon', 5], ['vermout_rood', 2], ['bitters', 1, 'dash']],
      gar: 'Een cocktailkers', gk: ['kers'], t: ['kruidig', 'zoet', 'bitter'], o: ['nightcap', 'aperitief'], d: 2,
      s: 'Geboren in New York, eind negentiende eeuw. Rijk, kruidig en altijd geroerd, nooit geshaket.',
      L: [['#8e3a16', 1]] },
    { id: 'dry-martini', n: 'Dry Martini', cat: 'klassiek', g: 'martini', m: 'stirred', ice: 'none',
      i: [['gin', 6], ['vermout_droog', 1]],
      gar: 'Een groene olijf of een zestje citroen', gk: ['olijf'], t: ['kruidig', 'bitter'], o: ['aperitief'], d: 2,
      s: 'De koning van de cocktails. Hoe droog je hem wilt, bepaal je met dat ene scheutje vermout.' },
    { id: 'gin-tonic', n: 'Gin-tonic', cat: 'klassiek', g: 'wijn', m: 'built', ice: 'cubes',
      i: [['gin', 5], ['tonic', 15, 'cl', 't']],
      gar: 'Een zestje citroen of een schijfje komkommer', gk: ['komkommer', 'twist'],
      t: ['fris', 'bitter', 'bruisend'], o: ['aperitief', 'zomer'], d: 1,
      s: 'Begonnen als medicijn tegen malaria in Brits-Indië. Vandaag drink je hem in een groot ballonglas, zoals in elke Vlaamse bar.' },
    { id: 'moscow-mule', n: 'Moscow Mule', cat: 'klassiek', g: 'mok', m: 'built', ice: 'cubes',
      i: [['vodka', 4.5], ['limoensap', 1], ['gemberbier', 12, 'cl', 't']],
      gar: 'Een partje limoen en een takje munt', gk: ['limoen', 'munt'],
      t: ['kruidig', 'fris', 'bruisend'], o: ['zomer', 'feest'], d: 1,
      s: 'Bedacht in 1941 om drie dingen tegelijk te verkopen: vodka, gemberbier en koperen bekers. Het werkte.' },
    { id: 'mai-tai', n: 'Mai Tai', cat: 'klassiek', g: 'rocks', m: 'shaken', ice: 'crushed',
      i: [['rum_wit', 3], ['triple_sec', 1.5], ['amandelsiroop', 1.5], ['limoensap', 3], ['rum_bruin', 3, 'cl', 'f']],
      gar: 'Een takje munt en een schijfje limoen', gk: ['munt', 'limoen', 'parapluutje'],
      t: ['tropisch', 'fruitig', 'zuur', 'nootachtig'], o: ['zomer', 'feest'], d: 3,
      s: 'Tahitiaans voor "het allerbeste". Ontstaan in Californië in de jaren veertig, het hart van de tikicultuur.',
      L: [['#e0a04a', 0.72], ['#7a3412', 0.28]] },
    { id: 'pina-colada', n: 'Piña Colada', cat: 'klassiek', g: 'hurricane', m: 'blended', ice: 'crushed',
      i: [['rum_wit', 5], ['kokosroom', 3], ['ananassap', 9]],
      gar: 'Een partje ananas en een cocktailkers', gk: ['ananas', 'kers', 'parapluutje'],
      t: ['tropisch', 'romig', 'zoet', 'fruitig'], o: ['zomer', 'feest'], d: 1,
      s: 'Sinds 1978 de officiële drank van Puerto Rico. Vakantie, zonder vliegtuig.',
      L: [['#f6e7b0', 1]] },
    { id: 'whisky-sour', n: 'Whisky Sour', cat: 'klassiek', g: 'rocks', m: 'shaken', ice: 'cubes',
      i: [['bourbon', 4.5], ['citroensap', 2.5], ['suikersiroop', 2], ['eiwit', 1, 'st']],
      gar: 'Een schijfje sinaasappel en een kers', gk: ['sinaas', 'kers'],
      t: ['zuur', 'zoet', 'kruidig'], o: ['aperitief', 'nightcap'], d: 3,
      s: 'Een sour volgt een eenvoudige formule: sterk, zuur en zoet. Het eiwit zorgt voor een zijdezachte schuimkraag.',
      L: [['#d9a24e', 1]], foam: '#f4ecda' },
    { id: 'spritz', n: 'Spritz', cat: 'klassiek', g: 'wijn', m: 'built', ice: 'cubes',
      i: [['bubbels', 9], ['aperitiefbitter', 6], ['spuitwater', 3, 'cl', 't']],
      gar: 'Een schijfje sinaasappel', gk: ['sinaas'], t: ['bitter', 'bruisend', 'fruitig'], o: ['aperitief', 'zomer'], d: 1,
      s: 'Venetiaans aperitief volgens de formule 3-2-1. Op een Hasseltse zomerterras is het de onbetwiste nummer één.',
      L: [['#f26a1f', 1]] },
    { id: 'tom-collins', n: 'Tom Collins', cat: 'klassiek', g: 'highball', m: 'built', ice: 'cubes',
      i: [['gin', 4.5], ['citroensap', 3], ['suikersiroop', 1.5], ['spuitwater', 6, 'cl', 't']],
      gar: 'Een schijfje citroen en een kers', gk: ['citroen', 'kers'], t: ['fris', 'zuur', 'bruisend'], o: ['zomer', 'aperitief'], d: 1,
      s: 'Begon in 1874 als grap in New York: "Heb je Tom Collins al gezien? Hij praat over je." De drank bleef.' },
    { id: 'bloody-mary', n: 'Bloody Mary', cat: 'klassiek', g: 'highball', m: 'built', ice: 'cubes',
      i: [['vodka', 4.5], ['tomatensap', 9], ['citroensap', 1.5], ['kruiden', 4, 'dash'], ['zout', 1, 'dash']],
      gar: 'Een stengel selder en een partje citroen', gk: ['selder', 'citroen'],
      t: ['hartig', 'kruidig'], o: ['brunch'], d: 2,
      s: 'De brunchcocktail bij uitstek. Of hij nu in Parijs of New York ontstond, hij hoort bij een late zondagochtend.' },
    { id: 'long-island', n: 'Long Island Iced Tea', cat: 'klassiek', g: 'highball', m: 'built', ice: 'cubes',
      i: [['vodka', 1.5], ['gin', 1.5], ['rum_wit', 1.5], ['tequila', 1.5], ['triple_sec', 1.5], ['citroensap', 2.5], ['suikersiroop', 2], ['cola', 4, 'cl', 't']],
      gar: 'Een schijfje citroen', gk: ['citroen', 'rietje'], t: ['zoet', 'zuur', 'bruisend'], o: ['feest'], d: 2,
      s: 'Bevat geen druppel ijsthee, al lijkt het er wel op. Met vijf sterke dranken in één glas: rustig aan.',
      L: [['#9a5a2a', 1]] },
    { id: 'sex-on-the-beach', n: 'Sex on the Beach', cat: 'klassiek', g: 'highball', m: 'built', ice: 'cubes',
      i: [['vodka', 4], ['perziklikeur', 2], ['sinaasappelsap', 4], ['cranberrysap', 4, 'cl', 'f']],
      gar: 'Een schijfje sinaasappel', gk: ['sinaas', 'rietje'], t: ['fruitig', 'zoet'], o: ['zomer', 'feest'], d: 1,
      s: 'Een fruitige klassieker uit de jaren tachtig, toen cocktails vooral kleurrijk en zoet moesten zijn.',
      L: [['#c22a3a', 0.3], ['#ea7a3a', 0.25], ['#f4a64a', 0.45]] },
    { id: 'tequila-sunrise', n: 'Tequila Sunrise', cat: 'klassiek', g: 'highball', m: 'built', ice: 'cubes',
      i: [['tequila', 4.5], ['sinaasappelsap', 9], ['grenadine', 1.5, 'cl', 'f']],
      gar: 'Een schijfje sinaasappel en een kers', gk: ['sinaas', 'kers'], t: ['fruitig', 'zoet'], o: ['zomer', 'brunch'], d: 1,
      s: 'De grenadine zakt naar de bodem en tovert een zonsopgang in je glas. Niet roeren.',
      L: [['#c8102e', 0.18], ['#e8501f', 0.17], ['#f6a11c', 0.65]] },
    { id: 'cuba-libre', n: 'Cuba Libre', cat: 'klassiek', g: 'highball', m: 'built', ice: 'cubes',
      i: [['rum_wit', 5], ['limoensap', 1], ['cola', 12, 'cl', 't']],
      gar: 'Een partje limoen', gk: ['limoen'], t: ['zoet', 'bruisend', 'fris'], o: ['feest'], d: 1,
      s: 'Leve het vrije Cuba. Ontstaan rond 1900, toen cola nieuw was en rum overal.' },
    { id: 'kir-royal', n: 'Kir Royal', cat: 'klassiek', g: 'flute', m: 'built', ice: 'none',
      i: [['cassis', 1], ['bubbels', 9, 'cl', 't']],
      gar: 'Een framboos of braam', gk: ['framboos'], t: ['fruitig', 'bruisend'], o: ['aperitief', 'feest'], d: 1,
      s: 'Genoemd naar kanunnik Kir, burgemeester van Dijon. De royale versie gebruikt bubbels in plaats van witte wijn.',
      L: [['#8a2a4a', 0.25], ['#b6536a', 0.75]] },
    { id: 'french-75', n: 'French 75', cat: 'klassiek', g: 'flute', m: 'shaken', ice: 'none',
      i: [['gin', 3], ['citroensap', 1.5], ['suikersiroop', 1.5], ['bubbels', 6, 'cl', 't']],
      gar: 'Een zestje citroen', gk: ['twist'], t: ['fris', 'bruisend', 'zuur'], o: ['aperitief', 'feest', 'brunch'], d: 2,
      s: 'Genoemd naar een Frans kanon uit de Eerste Wereldoorlog, omdat hij net zo hard aankomt.' },
    { id: 'paloma', n: 'Paloma', cat: 'klassiek', g: 'highball', m: 'built', ice: 'cubes',
      i: [['tequila', 5], ['limoensap', 1.5], ['zout', 1, 'dash'], ['pompelmoesfris', 10, 'cl', 't']],
      gar: 'Zoutrandje en een partje pompelmoes', gk: ['zoutrand', 'pompelmoes'], t: ['fris', 'bitter', 'bruisend', 'fruitig'], o: ['zomer'], d: 1,
      s: 'In Mexico populairder dan de margarita. Pompelmoes, limoen en een snuifje zout.' },
    { id: 'grasshopper', n: 'Grasshopper', cat: 'klassiek', g: 'coupe', m: 'shaken', ice: 'none',
      i: [['menthe', 3], ['cacao_wit', 3], ['room', 3]],
      gar: 'Een muntblaadje of geraspte chocolade', gk: ['munt-blad'], t: ['romig', 'zoet', 'chocolade', 'fris'], o: ['dessert'], d: 1,
      s: 'Groen, romig en naar muntchocolade. Een dessertcocktail uit New Orleans, van rond 1918.',
      L: [['#8fd3a2', 1]] },
    { id: 'amaretto-sour', n: 'Amaretto Sour', cat: 'klassiek', g: 'rocks', m: 'shaken', ice: 'cubes',
      i: [['amaretto', 4.5], ['citroensap', 3], ['suikersiroop', 1], ['eiwit', 1, 'st']],
      gar: 'Een kers en een schijfje sinaasappel', gk: ['kers', 'sinaas'], t: ['zuur', 'zoet', 'nootachtig'], o: ['aperitief', 'dessert'], d: 3,
      s: 'Zoete amandel met fris citroensap. Een sour die zelfs mensen bekeert die niet van cocktails houden.',
      L: [['#d18a3a', 1]], foam: '#f4ead6' },
    { id: 'blue-lagoon', n: 'Blue Lagoon', cat: 'klassiek', g: 'highball', m: 'built', ice: 'cubes',
      i: [['vodka', 4], ['curacao_blauw', 2], ['citroenfris', 12, 'cl', 't']],
      gar: 'Een schijfje citroen en een kers', gk: ['citroen', 'kers'], t: ['fruitig', 'zoet', 'bruisend'], o: ['feest', 'zomer'], d: 1,
      s: 'Zo blauw als een lagune uit een reisfolder. De smaak: citrus en sinaasappel.',
      L: [['#2a9be6', 1]] },
    { id: 'hugo', n: 'Hugo', cat: 'klassiek', g: 'wijn', m: 'built', ice: 'cubes',
      i: [['munt', 5, 'st'], ['vlierbloesem', 2], ['bubbels', 10], ['spuitwater', 4, 'cl', 't']],
      gar: 'Muntblaadjes en een schijfje limoen', gk: ['munt', 'limoen'], t: ['bloemig', 'fris', 'bruisend'], o: ['aperitief', 'zomer'], d: 1,
      s: 'Een frisse, bloemige spritz uit Zuid-Tirol. Licht genoeg voor een lange zomeravond.' },
    { id: 'sidecar', n: 'Sidecar', cat: 'klassiek', g: 'coupe', m: 'shaken', ice: 'none',
      i: [['cognac', 5], ['triple_sec', 2], ['citroensap', 2]],
      gar: 'Suikerrandje en een zestje sinaasappel', gk: ['suikerrand', 'twist-oranje'], t: ['zuur', 'fruitig', 'kruidig'], o: ['aperitief', 'nightcap'], d: 2,
      s: 'Volgens de legende genoemd naar een kapitein die met zijn motor en zijspan naar een bar in Parijs reed.',
      L: [['#dca04e', 1]] },
    { id: 'mimosa', n: 'Mimosa', cat: 'klassiek', g: 'flute', m: 'built', ice: 'none',
      i: [['sinaasappelsap', 7.5], ['bubbels', 7.5, 'cl', 't']],
      gar: 'Geen', gk: [], t: ['fruitig', 'bruisend', 'fris'], o: ['brunch'], d: 1,
      s: 'Bubbels en sinaasappelsap, half om half. Het perfecte excuus om al voor de middag te klinken.' },
    { id: 'boulevardier', n: 'Boulevardier', cat: 'klassiek', g: 'rocks', m: 'stirred', ice: 'big',
      i: [['bourbon', 4.5], ['vermout_rood', 3], ['bitter_rood', 3]],
      gar: 'Een zestje sinaasappel', gk: ['twist-oranje'], t: ['bitter', 'kruidig', 'zoet'], o: ['aperitief', 'nightcap'], d: 1,
      s: 'De whiskyneef van de negroni, bedacht door een Amerikaanse schrijver in het Parijs van de jaren twintig.',
      L: [['#8f1f14', 1]] },
    { id: 'gimlet', n: 'Gimlet', cat: 'klassiek', g: 'coupe', m: 'shaken', ice: 'none',
      i: [['gin', 6], ['limoensap', 1.5], ['suikersiroop', 1.5]],
      gar: 'Een schijfje limoen', gk: ['limoen'], t: ['zuur', 'fris'], o: ['aperitief'], d: 1,
      s: 'Britse zeelui dronken limoensap tegen scheurbuik. Met gin erbij werd het meteen een stuk aangenamer.' },

    // ===== Belgische twists =====
    { id: 'hasseltse-nachtuil', n: 'Hasseltse Nachtuil', cat: 'belgisch', g: 'martini', m: 'shaken', ice: 'none',
      i: [['jenever_oud', 4], ['koffielikeur', 2], ['espresso', 3], ['suikersiroop', 0.5]],
      gar: 'Drie koffiebonen op het schuim', gk: ['bonen'], t: ['koffie', 'kruidig', 'bitter'], o: ['nightcap', 'feest'], d: 2,
      s: 'Het huisrecept van Tom’s Cocktails: oude graanjenever uit de jeneverstad in plaats van vodka. Zo wordt de espresso martini een echte Hasselaar.',
      L: [['#2a1409', 1]], foam: '#c9995e', house: true },
    { id: 'jonge-hasselaar', n: 'Jonge Hasselaar', cat: 'belgisch', g: 'wijn', m: 'built', ice: 'cubes',
      i: [['jenever_jong', 5], ['tonic', 15, 'cl', 't']],
      gar: 'Een zestje citroen en een paar jeneverbessen', gk: ['twist', 'bessen'], t: ['fris', 'kruidig', 'bruisend'], o: ['aperitief', 'zomer'], d: 1,
      s: 'Hasselt is de jeneverstad van België. Jonge jenever met tonic is fris, zacht en verrassend licht kruidig.' },
    { id: 'limburgse-mule', n: 'Limburgse Mule', cat: 'belgisch', g: 'mok', m: 'built', ice: 'cubes',
      i: [['jenever_oud', 5], ['limoensap', 1], ['gemberbier', 12, 'cl', 't']],
      gar: 'Een partje limoen', gk: ['limoen'], t: ['kruidig', 'bruisend', 'fris'], o: ['zomer', 'feest'], d: 1,
      s: 'Een Moscow Mule met oude graanjenever. De moutige toets past wonderwel bij de pittige gember.' },
    { id: 'kriekspritz', n: 'Kriekspritz', cat: 'belgisch', g: 'wijn', m: 'built', ice: 'cubes',
      i: [['kriek', 12], ['bubbels', 6, 'cl', 't']],
      gar: 'Een paar verse kersen', gk: ['kers'], t: ['fruitig', 'bruisend', 'zuur'], o: ['aperitief', 'zomer'], d: 1,
      s: 'Belgisch kriekbier en bubbels: rood, bruisend en zuurfris. Een spritz die je enkel hier zo vindt.' },
    { id: 'witbier-mimosa', n: 'Witbiermimosa', cat: 'belgisch', g: 'tulp', m: 'built', ice: 'none',
      i: [['sinaasappelsap', 5], ['triple_sec', 1], ['witbier', 15, 'cl', 't']],
      gar: 'Een schijfje sinaasappel', gk: ['sinaas'], t: ['fris', 'fruitig', 'bruisend'], o: ['brunch', 'zomer'], d: 1,
      s: 'Witbier heeft al een vleugje sinaasappelschil en koriander. Met vers sap erbij wordt het een Vlaamse brunchklassieker.',
      L: [['#f4c766', 1]], foam: '#fbf3dc' },
    { id: 'tripel-goud', n: 'Tripelgoud', cat: 'belgisch', g: 'tulp', m: 'built', ice: 'none',
      i: [['jenever_oud', 2], ['honingsiroop', 1.5], ['citroensap', 1.5], ['tripel', 15, 'cl', 't']],
      gar: 'Een zestje citroen', gk: ['twist'], t: ['zoet', 'kruidig', 'bruisend'], o: ['feest', 'winter'], d: 1,
      s: 'Een Belgische tripel met honing, citroen en een scheut oude jenever. Goudgeel en verraderlijk zacht.',
      L: [['#e3a32e', 1]], foam: '#fbf1d6' },
    { id: 'speculaas-russian', n: 'Speculaas Russian', cat: 'belgisch', g: 'rocks', m: 'built', ice: 'cubes',
      i: [['vodka', 4], ['koffielikeur', 2], ['speculoossiroop', 1], ['room', 3, 'cl', 'f']],
      gar: 'Een kaneelstokje of een verkruimeld koekje', gk: ['kaneel'], t: ['romig', 'zoet', 'koffie', 'kruidig'], o: ['winter', 'dessert'], d: 1,
      s: 'Een White Russian met de smaak van Belgische speculaas. Ideaal rond Sinterklaas.',
      L: [['#4a2412', 0.6], ['#ead8b8', 0.4]] },
    { id: 'jenever-old-fashioned', n: 'Jenever Old Fashioned', cat: 'belgisch', g: 'rocks', m: 'stirred', ice: 'big',
      i: [['suikersiroop', 0.5], ['bitters', 2, 'dash'], ['jenever_oud', 5]],
      gar: 'Een zestje sinaasappel', gk: ['twist-oranje'], t: ['kruidig', 'zoet'], o: ['nightcap', 'winter'], d: 2,
      s: 'Lang voor het woord cocktail bestond, dronk men jenever al met suiker en bitters. Deze versie eert die traditie.' },
    { id: 'panache', n: 'Panaché', cat: 'belgisch', g: 'highball', m: 'built', ice: 'none',
      i: [['pils', 12.5], ['citroenfris', 12.5, 'cl', 't']],
      gar: 'Geen', gk: [], t: ['fris', 'bruisend'], o: ['zomer'], d: 1,
      s: 'Half pils, half citroenlimonade. Op een warme dag het lichtste glas van de kaart.',
      L: [['#f2d26a', 1]], foam: '#fbf5e2' },

    // ===== Alcoholvrij =====
    { id: 'nojito', n: 'Nojito', cat: 'mocktail', g: 'highball', m: 'muddled', ice: 'crushed',
      i: [['munt', 8, 'st'], ['limoensap', 2], ['suikersiroop', 2], ['spuitwater', 15, 'cl', 't']],
      gar: 'Een takje munt en een partje limoen', gk: ['munt', 'limoen', 'rietje'], t: ['fris', 'zuur', 'zoet'], o: ['zomer'], d: 1,
      s: 'Alle frisheid van een mojito, zonder rum. Even feestelijk, en je kan erna nog met de auto naar huis.' },
    { id: 'shirley-temple', n: 'Shirley Temple', cat: 'mocktail', g: 'highball', m: 'built', ice: 'cubes',
      i: [['ginger_ale', 15], ['grenadine', 1.5, 'cl', 'f']],
      gar: 'Een cocktailkers', gk: ['kers', 'rietje'], t: ['zoet', 'bruisend', 'fruitig'], o: ['feest'], d: 1,
      s: 'De oudste mocktail die nog steeds besteld wordt, genoemd naar een Amerikaanse kindster uit de jaren dertig.',
      L: [['#d03a3a', 0.25], ['#e88a4a', 0.75]] },
    { id: 'virgin-colada', n: 'Virgin Colada', cat: 'mocktail', g: 'hurricane', m: 'blended', ice: 'crushed',
      i: [['kokosroom', 4], ['ananassap', 12]],
      gar: 'Een partje ananas en een kers', gk: ['ananas', 'kers', 'parapluutje'], t: ['tropisch', 'romig', 'zoet'], o: ['zomer'], d: 1,
      s: 'Kokos en ananas, romig geblend. Het vakantiegevoel zit in de smaak, niet in de rum.',
      L: [['#f6e4a6', 1]] },
    { id: 'virgin-sunrise', n: 'Virgin Sunrise', cat: 'mocktail', g: 'highball', m: 'built', ice: 'cubes',
      i: [['sinaasappelsap', 15], ['grenadine', 1.5, 'cl', 'f']],
      gar: 'Een schijfje sinaasappel', gk: ['sinaas', 'rietje'], t: ['fruitig', 'zoet'], o: ['brunch'], d: 1,
      s: 'Dezelfde zonsopgang als het origineel. Ideaal voor de kinderen aan tafel, en voor de BOB.',
      L: [['#c8102e', 0.16], ['#e8501f', 0.16], ['#f6a11c', 0.68]] },
    { id: 'espresso-tonic', n: 'Espresso-tonic', cat: 'mocktail', g: 'highball', m: 'built', ice: 'cubes',
      i: [['tonic', 12], ['espresso', 3, 'cl', 'f']],
      gar: 'Een schijfje sinaasappel', gk: ['sinaas'], t: ['koffie', 'bitter', 'bruisend', 'fris'], o: ['brunch', 'zomer'], d: 1,
      s: 'De koffiedrank van hippe Scandinavische koffiebars. Giet de espresso traag op de tonic voor een mooie laag.',
      L: [['#e2e9e8', 0.72], ['#7a4a2c', 0.08], ['#2b140a', 0.2]] },
    { id: 'cinderella', n: 'Cinderella', cat: 'mocktail', g: 'hurricane', m: 'shaken', ice: 'cubes',
      i: [['sinaasappelsap', 6], ['ananassap', 6], ['citroensap', 2], ['grenadine', 1], ['spuitwater', 4, 'cl', 't']],
      gar: 'Een schijfje sinaasappel en een kers', gk: ['sinaas', 'kers', 'rietje'], t: ['fruitig', 'fris', 'bruisend'], o: ['feest', 'zomer'], d: 1,
      s: 'Een fruitcocktail die om middernacht nog even lekker is. Geen pompoen nodig.',
      L: [['#f28a3a', 1]] },
    { id: 'vlierbloesem-fizz', n: 'Vlierbloesem Fizz', cat: 'mocktail', g: 'wijn', m: 'built', ice: 'cubes',
      i: [['vlierbloesem', 3], ['limoensap', 1.5], ['spuitwater', 15, 'cl', 't']],
      gar: 'Muntblaadjes en een schijfje limoen', gk: ['munt', 'limoen'], t: ['bloemig', 'fris', 'bruisend'], o: ['aperitief', 'zomer'], d: 1,
      s: 'Bloemig, licht en bruisend. Een aperitief dat zich niet hoeft te verontschuldigen voor het ontbreken van alcohol.' },
    { id: 'virgin-mary', n: 'Virgin Mary', cat: 'mocktail', g: 'highball', m: 'built', ice: 'cubes',
      i: [['tomatensap', 15], ['citroensap', 1.5], ['kruiden', 4, 'dash'], ['zout', 1, 'dash']],
      gar: 'Een stengel selder', gk: ['selder', 'citroen'], t: ['hartig', 'kruidig'], o: ['brunch'], d: 1,
      s: 'Alle pit van een Bloody Mary, zonder de vodka. Kruid hem gerust wat pittiger.' },
    { id: 'alcoholvrije-gt', n: 'Alcoholvrije gin-tonic', cat: 'mocktail', g: 'wijn', m: 'built', ice: 'cubes',
      i: [['nagin', 5], ['tonic', 15, 'cl', 't']],
      gar: 'Een schijfje komkommer en een zestje citroen', gk: ['komkommer', 'twist'], t: ['fris', 'bitter', 'bruisend'], o: ['aperitief'], d: 1,
      s: 'Alcoholvrije distillaten met jeneverbes en kruiden maken het ritueel compleet. Groot glas, veel ijs.' },
    { id: 'koude-mokka', n: 'Koude mokka', cat: 'mocktail', g: 'hurricane', m: 'blended', ice: 'crushed',
      i: [['espresso', 6], ['melk', 10], ['chocoladesiroop', 2], ['vanille_ijs', 1, 'st']],
      gar: 'Slagroom en cacao', gk: ['slagroom', 'cacao', 'rietje'], t: ['koffie', 'romig', 'chocolade', 'zoet'], o: ['zomer', 'dessert'], d: 1,
      s: 'IJskoffie, chocolade en vanille in de blender. Een dessert en een oppepper tegelijk.',
      L: [['#8a5a3c', 1]] },
    { id: 'aardbeienlimonade', n: 'Aardbeienlimonade', cat: 'mocktail', g: 'highball', m: 'built', ice: 'cubes',
      i: [['aardbeienpuree', 4], ['citroensap', 2], ['suikersiroop', 1.5], ['spuitwater', 12, 'cl', 't']],
      gar: 'Een halve aardbei en een takje munt', gk: ['aardbei', 'munt'], t: ['fruitig', 'fris', 'zoet', 'bruisend'], o: ['zomer', 'feest'], d: 1,
      s: 'Haspengouwse aardbeien in juni: meer heb je niet nodig voor de lekkerste limonade van Limburg.',
      L: [['#e2475a', 1]] }
  ];

  /* ---------- Berekeningen ---------- */
  var UNIT_CL = { cl: 1, dash: 0.08, bl: 0.5, tl: 0, st: null };

  function ingVolume(row) {
    var ing = ING[row[0]], amt = row[1], u = row[2] || 'cl';
    if (u === 'st') return amt * (ing.stcl || 0);
    return amt * (UNIT_CL[u] || 0);
  }

  function hexToRgb(h) {
    h = h.replace('#', '');
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
  }
  function rgbToHex(r) {
    return '#' + r.map(function (v) { var s = Math.round(Math.max(0, Math.min(255, v))).toString(16); return s.length < 2 ? '0' + s : s; }).join('');
  }

  // Mengkleur: gewogen op volume én dekking, zodat donkere likeur een heldere mixer domineert
  function mixColor(rows) {
    var r = 0, g = 0, b = 0, w = 0, alpha = 0, vol = 0;
    rows.forEach(function (row) {
      var ing = ING[row[0]], v = ingVolume(row);
      if (!v || ing.a === 0) return;
      var weight = v * (0.15 + ing.a * 1.6);
      var c = hexToRgb(ing.col);
      r += c[0] * weight; g += c[1] * weight; b += c[2] * weight; w += weight;
      alpha += ing.a * v; vol += v;
    });
    if (!w) return { col: '#e8eef0', a: 0.3 };
    return { col: rgbToHex([r / w, g / w, b / w]), a: Math.min(1, Math.max(0.5, alpha / vol * 1.25)) };
  }

  function enrich(c) {
    var vol = 0, alc = 0, fizzy = false;
    c.i.forEach(function (row) {
      var ing = ING[row[0]], v = ingVolume(row);
      vol += v;
      alc += v * 10 * ing.abv / 100; // ml zuivere alcohol
      if (ing.fizz) fizzy = true;
    });
    // Verdunning door ijs bij het shaken, roeren of blenden
    var dil = { shaken: 0.25, stirred: 0.2, blended: 0.3, muddled: 0.12, built: c.ice !== 'none' ? 0.08 : 0, layered: 0, hot: 0 }[c.m] || 0;
    var finalVol = vol * (1 + dil);
    c.vol = vol; c.finalVol = finalVol;
    c.alcMl = alc;
    c.units = alc * 0.789 / 10; // 1 standaardglas = 10 g alcohol
    c.abvGlass = finalVol ? (alc / (finalVol * 10)) * 100 : 0;
    c.alcoholFree = alc === 0;
    c.strength = c.alcoholFree ? 'alcoholvrij' : c.units < 0.9 ? 'licht' : c.units < 1.6 ? 'middel' : 'sterk';
    c.fizz = fizzy || !!c.fizzOn;
    if (c.fizz && c.t.indexOf('bruisend') < 0 && !c.hot) c.t.push('bruisend');
    if (c.alcoholFree && c.o.indexOf('alcoholvrij') < 0) { /* filter via flag */ }
    // Families (basisdrank)
    var fams = {}, mainFam = null, mainVol = 0;
    c.i.forEach(function (row) {
      var ing = ING[row[0]];
      if (!ing.fam) return;
      fams[ing.fam] = true;
      var v = ingVolume(row) * (ing.abv > 0 ? 1 : 0);
      if (v > mainVol) { mainVol = v; mainFam = ing.fam; }
    });
    c.fams = Object.keys(fams);
    c.mainFam = mainFam || 'alcoholvrij';
    // Visuele lagen
    if (!c.L) {
      if (c.m === 'layered') {
        c.L = c.i.map(function (row) { return [ING[row[0]].col, ingVolume(row) / vol]; });
      } else {
        var mc = mixColor(c.i);
        c.L = [[mc.col, 1]];
        c.alpha = mc.a;
      }
    }
    if (c.alpha == null) {
      var mc2 = mixColor(c.i);
      c.alpha = Math.max(mc2.a, 0.55);
    }
    c.needs = c.i.map(function (r) { return r[0]; }).filter(function (id, idx, arr) {
      return ING[id].grp !== 'basis' && arr.indexOf(id) === idx;
    });
    // Soort drankje (zoals de categorieën op een bar-kaart)
    var hasBubbels = c.i.some(function (r) { return r[0] === 'bubbels'; });
    var hasBier = c.i.some(function (r) { return ING[r[0]].fam === 'bier'; });
    c.type = c.type || (c.g === 'shot' ? 'shot' : c.hot ? 'warm' : hasBier ? 'bier' : hasBubbels ? 'bubbels'
      : (finalVol >= 14 && /highball|wijn|mok|hurricane/.test(c.g)) ? 'longdrink' : 'cocktail');
    c.glassName = GLASS_NAMES[c.g];
    c.methodName = METHOD_NAMES[c.m];
    return c;
  }

  C.forEach(enrich);

  window.TC_DATA = {
    ING: ING, COCKTAILS: C, GRP_NAMES: GRP_NAMES, GLASS_NAMES: GLASS_NAMES,
    METHOD_NAMES: METHOD_NAMES, CATS: CATS, TYPES: TYPES, enrich: enrich, PRICE: PRICE, TASTES: TASTES, OCCASIONS: OCCASIONS,
    ingVolume: ingVolume, hexToRgb: hexToRgb, rgbToHex: rgbToHex
  };
})();
