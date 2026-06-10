// data.jsx — Langer Dystrybucja katalog (beta).
// Dodawaj produkty do tablicy PRODUCTS. Pola: sku, name, brand, category,
// variant (pojemność/typ), pack (jednostka sprzedaży), tags[], note (opcjonalnie).
// Kategorie i marki budują się automatycznie z listy filtrów poniżej.

const CATEGORIES = [
  { id: 'piany',     label: 'Piany montażowe', icon: 'piany',     blurb: 'Niskoprężne, pistoletowe, wężykowe, zimowe i ogniochronne.' },
  { id: 'silikony',  label: 'Silikony',        icon: 'silikony',  blurb: 'Sanitarne, uniwersalne, budowlane i wysokotemperaturowe.' },
  { id: 'akryle',    label: 'Akryle',          icon: 'akryle',    blurb: 'Malarskie, elastyczne i dekarskie — gotowe pod malowanie.' },
  { id: 'kleje',     label: 'Kleje',           icon: 'kleje',     blurb: 'Montażowe, hybrydowe i poliuretanowe — mocne łączenie.' },
  { id: 'akcesoria', label: 'Akcesoria',       icon: 'akcesoria', blurb: 'Pistolety, czyściki, taśmy i wszystko wokół chemii.' },
];

const BRANDS = ['Soudal', 'Tytan', 'Penosil', 'Langer', 'Den Braven'];

// role: magnet (przyciąga), margin (marża), neutral, premium — używane do oznaczeń
const PRODUCTS = [
  { sku:'PU-SDL-CL750', name:'Soudal Classic 750 ml', brand:'Soudal', category:'piany', variant:'Pistoletowa · 750 ml', pack:'12 szt. / karton', role:'magnet', tags:['Pistoletowa','Całoroczna'], note:'Bestseller — niskoprężna piana montażowa.' },
  { sku:'PU-SDL-GUN870', name:'Soudal Gun Foam 870 ml', brand:'Soudal', category:'piany', variant:'Pistoletowa · 870 ml', pack:'12 szt. / karton', role:'neutral', tags:['Pistoletowa','Wysoka wydajność'] },
  { sku:'PU-TYT-O2750', name:'Tytan O2 Professional 750 ml', brand:'Tytan', category:'piany', variant:'Pistoletowa · 750 ml', pack:'12 szt. / karton', role:'neutral', tags:['Pistoletowa'] },
  { sku:'PU-TYT-WIN750', name:'Tytan Zima 750 ml', brand:'Tytan', category:'piany', variant:'Pistoletowa · 750 ml', pack:'12 szt. / karton', role:'neutral', tags:['Zimowa','do −10°C'] },
  { sku:'PU-PEN-GLD750', name:'Penosil Gold Gun 750 ml', brand:'Penosil', category:'piany', variant:'Pistoletowa · 750 ml', pack:'12 szt. / karton', role:'neutral', tags:['Pistoletowa'] },
  { sku:'PU-LNG-70-870', name:'Piana montażowa Langer 70 870 ml', brand:'Langer', category:'piany', variant:'Pistoletowa · 870 ml', pack:'12 szt. / karton', role:'margin', tags:['Wydajność do 70 l','Sezon letni','Doskonała przyczepność'], image:'https://zapianowany.pl/environment/cache/images/productGfx_503_0_0/736a6deaa04386a82083b423c697f189.webp', showcase:true },
  { sku:'PU-LNG-70W-870', name:'Piana montażowa Langer 70 zimowa -10°C 870 ml', brand:'Langer', category:'piany', variant:'Pistoletowa · zimowa · 870 ml', pack:'12 szt. / karton', role:'margin', tags:['Do -10°C','Wydajność do 70 l','Praca zimowa'], image:'https://zapianowany.pl/userdata/public/gfx/699/Pianka-zimowa-Langer-70--10.webp', showcase:true },
  { sku:'PU-LNG-ECO-760', name:'Piana montażowa Langer Economy Line 760 ml', brand:'Langer', category:'piany', variant:'Pistoletowa · 760 ml', pack:'12 szt. / karton', role:'margin', tags:['Ekonomiczna','Uniwersalna','Łatwa aplikacja'], image:'https://zapianowany.pl/userdata/public/gfx/673/Piana-montazowa-Langer-Economy-Line.webp', showcase:true },

  { sku:'SI-SDL-SAN300', name:'Soudal Sanitary 300 ml', brand:'Soudal', category:'silikony', variant:'Sanitarny · 300 ml', pack:'24 szt. / karton', role:'magnet', tags:['Sanitarny','Grzybobójczy'] },
  { sku:'SI-SDL-UNI300', name:'Soudal Uniwersalny 300 ml', brand:'Soudal', category:'silikony', variant:'Octowy · 300 ml', pack:'24 szt. / karton', role:'neutral', tags:['Uniwersalny'] },
  { sku:'SI-DB-HT300', name:'Den Braven High-Temp 300 ml', brand:'Den Braven', category:'silikony', variant:'Wysokotemperaturowy · 300 ml', pack:'12 szt. / karton', role:'premium', tags:['do 300°C','Kominkowy'] },
  { sku:'SI-TYT-CON310', name:'Tytan Budowlany 310 ml', brand:'Tytan', category:'silikony', variant:'Octowy · 310 ml', pack:'24 szt. / karton', role:'neutral', tags:['Budowlany'] },

  { sku:'AK-SDL-PAINT300', name:'Soudal Akryl malarski 300 ml', brand:'Soudal', category:'akryle', variant:'Malarski · 300 ml', pack:'24 szt. / karton', role:'magnet', tags:['Malarski','Do przemalowania'] },
  { sku:'AK-DB-ROOF310', name:'Den Braven Akryl dekarski 310 ml', brand:'Den Braven', category:'akryle', variant:'Dekarski · 310 ml', pack:'24 szt. / karton', role:'neutral', tags:['Dekarski','Zewnętrzny'] },

  { sku:'KL-SDL-MAX290', name:'Soudal Fix All High Tack 290 ml', brand:'Soudal', category:'kleje', variant:'Hybrydowy · 290 ml', pack:'12 szt. / karton', role:'premium', tags:['Hybrydowy','Mocne chwyty'] },
  { sku:'KL-TYT-MS290', name:'Tytan MS Polymer 290 ml', brand:'Tytan', category:'kleje', variant:'Hybrydowy · 290 ml', pack:'12 szt. / karton', role:'neutral', tags:['MS Polymer'] },
  { sku:'KL-PEN-PU300', name:'Penosil Klej PU 300 ml', brand:'Penosil', category:'kleje', variant:'Poliuretanowy · 300 ml', pack:'12 szt. / karton', role:'neutral', tags:['Poliuretanowy'] },
  { sku:'PU-LNG-EXP-760', name:'Pianoklej Langer Express 60 sekund 760 ml', brand:'Langer', category:'kleje', variant:'Pianoklej · pistoletowy · 760 ml', pack:'12 szt. / karton', role:'margin', tags:['Wiązanie 60 s','Szybki montaż','Wysoka przyczepność'], image:'https://zapianowany.pl/userdata/public/gfx/510/Pianoklej-Langer-Express-60-sekund.webp', showcase:true },
  { sku:'PU-LNG-STP-760', name:'Pianoklej Langer do styropianu 760 ml', brand:'Langer', category:'kleje', variant:'Pianoklej do styropianu · 760 ml', pack:'12 szt. / karton', role:'margin', tags:['Do styropianu','Mocne klejenie','Termoizolacja'], image:'https://zapianowany.pl/userdata/public/gfx/672/Langer-Pianoklej-do-styropianu.webp', showcase:true },
  { sku:'KL-LNG-TUR-280', name:'Klej montażowy Langer Tur 280 ml', brand:'Langer', category:'kleje', variant:'Klej montażowy · 280 ml', pack:'25 szt. / karton', role:'margin', tags:['Silne wiązanie','Uniwersalny','Trwałe połączenie'], image:'https://zapianowany.pl/environment/cache/images/productGfx_504_0_0/Klej-montazowy-Langer-Tur.webp', showcase:true },

  { sku:'AC-SDL-GUN', name:'Pistolet do pian Soudal Pro', brand:'Soudal', category:'akcesoria', variant:'Metalowy · teflonowany', pack:'1 szt.', role:'neutral', tags:['Pistolet'] },
  { sku:'AC-SDL-CLN500', name:'Czyścik do pian 500 ml', brand:'Soudal', category:'akcesoria', variant:'Aerozol · 500 ml', pack:'12 szt. / karton', role:'neutral', tags:['Czyścik'] },
];

const ROLE_LABEL = {
  magnet:  { t:'Bestseller',     cls:'role-magnet' },
  margin:  { t:'Marka własna',   cls:'role-margin' },
  premium: { t:'Premium',        cls:'role-premium' },
  neutral: null,
};

Object.assign(window, { CATEGORIES, BRANDS, PRODUCTS, ROLE_LABEL });
