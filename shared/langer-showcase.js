/* KARUZELA PRODUKTÓW LANGER — dane wspólne dla strony głównej, /dla-punktow/
   i panelu admina. Zwykły skrypt (bez JSX): build kopiuje go bez zmian.

   Panel → zakładka „Karuzela Langer" zapisuje własną listę slajdów w
   ustawieniach (klucz `langer_showcase`, JSON). Dopóki nic tam nie zapiszesz,
   strony pokazują listę DEFAULT poniżej.

   Pola slajdu:
     sku    — produkt z bazy (opcjonalnie): zdjęcie z bazy, link „w katalogu"
     match  — tylko w domyślnych: wzorce z nazwy produktu, po których panel
              i strona same znajdą SKU w bazie (wszystkie muszą pasować)
     name   — nazwa na slajdzie
     sub    — druga linia, np. „870 ml · niskoprężna"
     cat    — rodzaj, np. „Piana pistoletowa"
     badge  — plakietka na zdjęciu („Bestseller", „Nowość"…), puste = brak
     desc   — opis
     specs  — wyróżniki: [{ k: 'Wydajność', v: '70 L' }, …] (najlepiej 4)
     uses   — zastosowanie: ['Okna i drzwi', …]
     img    — adres zdjęcia; puste = zdjęcie produktu z bazy (po SKU) */
(function () {
  var A = '/dla-punktow/assets/';
  var DEFAULT = [
    {
      name: 'Langer 70', sub: '870 ml · niskoprężna', cat: 'Piana pistoletowa', badge: 'Bestseller',
      match: ['langer 70'], exclude: ['zimow'], img: A + 'langer-70.webp',
      desc: 'Profesjonalna piana niskoprężna do precyzyjnego montażu. Stabilna struktura i pełna izolacja termiczno-akustyczna. Dostępna też w wersji zimowej od −10 °C.',
      specs: [{ k: 'Wydajność', v: '70 L' }, { k: 'Czas cięcia', v: '15–30′' }, { k: 'Odporność', v: '−40/+90 °C' }, { k: 'Gęstość', v: '25 kg/m³' }],
      uses: ['Okna i drzwi', 'Izolacja akustyczna', 'Szczeliny i bruzdy'],
    },
    {
      name: 'Langer XL Fast', sub: '870 ml · szybkowiążąca', cat: 'Piana pistoletowa', badge: 'Nowość',
      match: ['xl', 'fast'], img: A + 'xl-fast.webp',
      desc: 'Szybkowiążąca piana do montażu stolarki. Niska rozszerzalność wtórna oznacza brak naprężeń na ościeżnicach i montaż bez korekt.',
      specs: [{ k: 'Wydajność', v: '65 L' }, { k: 'Czas obróbki', v: '20′' }, { k: 'Odporność', v: '−60/+100 °C' }, { k: 'Rozsz. wtórna', v: 'Niska' }],
      uses: ['Okna i drzwi', 'Złącza G-K', 'Przepusty'],
    },
    {
      name: 'Express 60 s', sub: '750 ml · pianoklej', cat: 'Pianoklej', badge: '',
      match: ['express'], img: A + 'express-60.webp',
      desc: 'Pianoklej poliuretanowy o błyskawicznym utwardzaniu. Chwyt w 60 sekund, bez podpierania elementów. Jedna puszka zastępuje worki kleju cementowego.',
      specs: [{ k: 'Pocz. utwardz.', v: '60 s' }, { k: 'Czas korekty', v: '2 min' }, { k: 'Odporność', v: '−20/+85 °C' }, { k: 'Gęstość', v: '20–30 kg/m³' }],
      uses: ['Płyty EPS / XPS', 'Płyty G-K', 'OSB i drewno'],
    },
    {
      name: 'Economy Line', sub: '750 ml · pistoletowa', cat: 'Piana pistoletowa', badge: '',
      match: ['economy', 'pistolet'], img: A + 'economy-line.webp',
      desc: 'Jednoskładnikowa piana o kontrolowanym wzroście objętości. Sprawdzona, powtarzalna formuła w codziennym montażu.',
      specs: [{ k: 'Wydajność', v: '45 L' }, { k: 'Wzrost obj.', v: '30 %' }, { k: 'Czas cięcia', v: '30–40′' }, { k: 'Odporność', v: '−50/+90 °C' }],
      uses: ['Ościeżnice', 'Okablowanie', 'Szczeliny'],
    },
    {
      name: 'Langer TUR', sub: '290 ml · MS Polimer', cat: 'Klej montażowy', badge: '',
      match: ['\\btur\\b'], img: A + 'tur.webp',
      desc: 'Klej na bazie MS Polimeru o natychmiastowym mocowaniu i bardzo wysokiej przyczepności początkowej. Bez rozpuszczalników i izocyjanianów.',
      specs: [{ k: 'Przyczep. pocz.', v: '500 kg/m²' }, { k: 'Wytrzym. końc.', v: '22 kg/cm²' }, { k: 'Odporność', v: '−40/+95 °C' }, { k: 'Elastyczność', v: '±25 %' }],
      uses: ['Parapety', 'Listwy i panele', 'Lustra'],
    },
    {
      name: 'Pianoklej do styropianu', sub: '750 ml · XPS / EPS', cat: 'Pianoklej', badge: '',
      match: ['styropian'], img: A + 'styropian.webp',
      desc: 'Pianka o niskiej ekspansji do mocowania płyt styropianowych na fasadach i fundamentach. Niska wodochłonność i doskonałe parametry cieplne.',
      specs: [{ k: 'Wydajność', v: '10 m²' }, { k: 'Przewodność', v: 'λ 0,034' }, { k: 'Odporność', v: '−50/+90 °C' }, { k: 'Izol. akust.', v: '60 dB' }],
      uses: ['Fasady', 'Fundamenty', 'Parapety i dachówki'],
    },
    {
      name: 'Economy Wężykowa', sub: '700 ml · bez pistoletu', cat: 'Piana wężykowa', badge: '',
      match: ['economy', 'wezyk'], img: A + 'economy-wezykowa.webp',
      desc: 'Ta sama niskoprężna formuła w wersji aplikowanej przez rurkę. Gotowa do pracy od razu — do drobnych prac i szybkich napraw.',
      specs: [{ k: 'Aplikacja', v: 'Rurka' }, { k: 'Wzrost obj.', v: '30 %' }, { k: 'Odporność', v: '−50/+90 °C' }, { k: 'Opakowanie', v: '700 ml' }],
      uses: ['Drobne naprawy', 'Okablowanie', 'Małe szczeliny'],
    },
  ];

  // „Wężykowa" -> „wezykowa": porównujemy bez wielkości liter i polskich znaków
  function norm(s) {
    return String(s || '').toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function test(pattern, text) {
    try { return new RegExp(pattern).test(text); } catch (e) { return text.indexOf(pattern) !== -1; }
  }

  /* Produkt z bazy dla slajdu: po SKU, a w domyślnych — po wzorcach z nazwy
     (tylko wśród produktów marki Langer). */
  function findProduct(item, products) {
    if (!item || !Array.isArray(products)) return null;
    if (item.sku) {
      for (var i = 0; i < products.length; i++) if (String(products[i].sku) === String(item.sku)) return products[i];
    }
    if (!item.match || !item.match.length) return null;
    for (var j = 0; j < products.length; j++) {
      var p = products[j];
      if (norm(p.brand).trim() !== 'langer') continue;
      var n = norm(p.name);
      var ok = item.match.every(function (m) { return test(m, n); }) &&
               !(item.exclude || []).some(function (m) { return test(m, n); });
      if (ok) return p;
    }
    return null;
  }

  /* Lista slajdów z wartości ustawienia `langer_showcase`. Pusta albo
     zepsuta wartość = lista domyślna — strona nigdy nie zostaje bez karuzeli. */
  function items(value) {
    try {
      var v = typeof value === 'string' && value.trim() ? JSON.parse(value) : value;
      if (Array.isArray(v)) {
        var list = v.filter(function (it) { return it && (it.name || it.sku); });
        if (list.length) return list;
      }
    } catch (e) { /* zła wartość — zostaje domyślna */ }
    return DEFAULT;
  }

  window.LangerShowcase = { DEFAULT: DEFAULT, items: items, findProduct: findProduct, norm: norm };
})();
