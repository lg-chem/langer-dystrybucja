# Langer Dystrybucja — strona firmowa

Strona internetowa hurtowej dystrybucji chemii budowlanej. Jeden plik HTML — bez build'a, bez konfiguracji, gotowy do wgrania gdziekolwiek.

**Live:** wdrażane przez Vercel (zobacz sekcję [Wdrożenie](#wdrożenie))

---

## Spis treści

- [Jak to działa](#jak-to-działa)
- [Paleta kolorów](#paleta-kolorów)
- [Edycja danych kontaktowych](#edycja-danych-kontaktowych)
- [Dodawanie nowych produktów](#dodawanie-nowych-produktów)
- [Zmiana statystyk w hero](#zmiana-statystyk-w-hero)
- [Wdrożenie na Vercel](#wdrożenie)
- [Struktura plików](#struktura-plików)

---

## Jak to działa

Cała strona to **jeden plik** — `index.html`. Wszystko jest w środku:

- Style CSS (paleta kolorów, layout, animacje)
- Logika React (komponenty, wyszukiwarka produktów, filtry, formularz)
- Ikony SVG (kategorie produktów, sygnet marki)
- Dane produktów (lista, marki, kategorie)

React i Babel ładują się z CDN (unpkg) — nie trzeba nic kompilować.

**Folder `project/`** zawiera oryginalne pliki źródłowe rozbite na osobne pliki — jako referencja i archiwum. Strona ich nie używa; działa wyłącznie na `index.html`.

---

## Paleta kolorów

Z brand booka Langer. Żeby zmienić jakikolwiek kolor — edytuj sekcję `:root` w `index.html` (na początku znacznika `<style>`).

| Zmienna CSS | Hex | Co to jest |
|---|---|---|
| `--flame` | `#F04E23` | **Pomarańcz Langer** — główny akcent, przyciski CTA, podkreślenia |
| `--flame-600` | `#D63F18` | Pomarańcz, hover na przyciskach |
| `--flame-700` | `#B63411` | Pomarańcz, stan wciśnięcia |
| `--flame-tint` | `#FBE7DF` | Pomarańcz, jasne tło ikon |
| `--cobalt` | `#1E3FB5` | **Kobalt** — odznaka „Marka własna" |
| `--navy` | `#0E1533` | **Granat** — tło sekcji „Proces dystrybucji", tekst nagłówków |
| `--navy-900` | `#080C22` | Granat głęboki — pasek marek, stopka |
| `--ash-700` | `#565D67` | Szary — tekst drugorzędny, opisy |
| `--light` | `#EEF0F3` | Jasnoszary — tło bazy produktów |

**Najszybsza zmiana akcentu:** podmień `#F04E23` na inny kolor w linii `--flame: #F04E23;` — automatycznie zmieni się na wszystkich przyciskach, odznakach i podkreśleniach.

---

## Edycja danych kontaktowych

Wszystkie miejsca z danymi kontaktowymi w `index.html` — wyszukaj poniższe (Ctrl+F):

| Co | Co zmienić |
|---|---|
| `+48 000 000 000` | Numer telefonu (3 miejsca: header, stopka, sekcja kontakt) |
| `biuro@langerdystrybucja.pl` | E-mail (2 miejsca: kontakt, stopka) |
| `ul. Przykładowa 00, 00-000 Miasto` | Adres magazynu (sekcja kontakt) |
| `ul. Przykładowa 00<br/>00-000 Miasto` | Adres w stopce |

---

## Dodawanie nowych produktów

Znajdź w `index.html` linię `const PRODUCTS = [` i dopisuj kolejne wiersze według tego wzoru:

```js
{
  sku:      'PU-LNG-100',                 // unikalny kod produktu
  name:     'Langer 100 PRO 750 ml',      // nazwa wyświetlana
  brand:    'Langer',                     // jedna z marek z listy BRANDS
  category: 'piany',                      // jedna z: piany | silikony | akryle | kleje | akcesoria
  variant:  'Pistoletowa · 750 ml',       // wariant / pojemność
  pack:     '12 szt. / karton',           // jednostka sprzedaży
  role:     'magnet',                     // magnet (Bestseller) | margin (Marka własna) | premium | neutral
  tags:     ['Pistoletowa', 'Całoroczna'] // tagi — wyświetlane jako pigułki
},
```

**Pole `role`** kontroluje jakie pojawi się oznaczenie na karcie:
- `magnet` → pomarańczowa odznaka **Bestseller**
- `margin` → niebieska odznaka **Marka własna**
- `premium` → granatowa odznaka **Premium**
- `neutral` → bez odznaki

**Dodanie nowej marki:** znajdź `const BRANDS = [` i dopisz nazwę. Pojawi się automatycznie jako filtr.

**Dodanie nowej kategorii:** wymaga dodania też ikony SVG do komponentu `CatIcon` — daj znać jak potrzebujesz, pomogę.

---

## Zmiana statystyk w hero

Znajdź w `index.html` linię `const stats = [` (wewnątrz `HeroStats`):

```js
const stats = [
  ['120+',   'produktów w ofercie'],
  ['6',      'marek, w tym Langer'],
  ['48 h',   'średni czas realizacji'],
  ['1 200+', 'zaopatrywanych punktów'],
];
```

Zmień liczby i opisy zgodnie ze swoją rzeczywistością.

---

## Wdrożenie

### Vercel (zalecane, darmowe)

1. Wejdź na **[vercel.com/new](https://vercel.com/new)** → zaloguj się przez GitHub
2. Wybierz repo `langer-dystrybucja` → kliknij **Deploy**
3. Po ~30 sekundach dostaniesz URL typu `langer-dystrybucja.vercel.app`

Od tej chwili każdy commit w repo → strona aktualizuje się automatycznie.

### Własna domena

Po wdrożeniu w panelu Vercela: **Settings → Domains → Add** i podaj swoją domenę (np. `langerdystrybucja.pl`). Vercel pokaże jakie rekordy DNS ustawić u Twojego rejestratora.

---

## Struktura plików

```
.
├── index.html              # ⭐ JEDYNY plik potrzebny do działania strony
├── README.md               # Ten plik
└── project/                # Archiwum — oryginalne pliki źródłowe (rozbite)
    ├── brand.css           # Tokeny kolorów, fonty, spacing
    ├── site.css            # Style sekcji i komponentów
    ├── data.jsx            # Lista produktów, kategorii, marek
    ├── sections.jsx        # Header, logo, ikony
    ├── hero.jsx            # Hero (3 warianty), sekcje marketingowe
    ├── catalog.jsx         # Baza produktów z filtrami
    ├── app.jsx             # Główny komponent
    ├── tweaks-panel.jsx    # Panel do podglądu wariantów
    └── assets/icons/       # Ikony SVG kategorii
```

---

## Stack technologiczny

- **HTML** + **React 18** (UMD z CDN, bez build'a)
- **Babel Standalone** — kompiluje JSX w przeglądarce
- **Google Fonts** — Space Grotesk, Hanken Grotesk, JetBrains Mono
- **Vercel** — hosting statyczny
