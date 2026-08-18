# Langer Dystrybucja — strona firmowa

Strona internetowa hurtowej dystrybucji chemii budowlanej. Jeden plik HTML — bez build'a, bez konfiguracji, gotowy do wgrania gdziekolwiek.

**Live:** wdrażane przez Vercel (zobacz sekcję [Wdrożenie](#wdrożenie))

---

## Spis treści

- [Jak to działa](#jak-to-działa)
- [Paleta kolorów](#paleta-kolorów)
- [Logo i kolory z panelu](#logo-i-kolory-z-panelu)
- [Edycja danych kontaktowych](#edycja-danych-kontaktowych)
- [Dodawanie nowych produktów](#dodawanie-nowych-produktów)
- [Import i aktualizacja z CSV](#import-i-aktualizacja-z-csv)
- [Zmiana statystyk w hero](#zmiana-statystyk-w-hero)
- [Podstrona dla punktów handlowych](#podstrona-dla-punktów-handlowych)
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

**Najszybsza zmiana akcentu:** nie ruszaj kodu — ustaw kolor w panelu (Ustawienia → „Logo i kolory marki"). Wartość z panelu nadpisuje `--flame` wraz z odcieniami hover. W kodzie zmienisz go, podmieniając `#F04E23` w linii `--flame: #F04E23;` — to wartość startowa, zanim odpowie API.

---

## Logo i kolory z panelu

**Panel → Ustawienia → „Logo i kolory marki".** Nie trzeba ruszać kodu — wgrane pliki lądują w bazie (tabela `settings`, jako data URI) i podmieniają się na stronie głównej, na `/dla-punktow/` i w samym panelu.

**Trzy sloty:**

| Slot | Gdzie się pokazuje | Jaka wersja |
|---|---|---|
| Logo na jasne tło | Nagłówek po przewinięciu strony | Kolorowa / ciemna |
| Logo na ciemne tło | Nagłówek na samej górze, stopka | Jasna (biała) |
| Sygnet (kwadrat) | Znak wodny w hero (wariant „Plakat") | Sam znak, bez napisu |

Wgrasz tylko jedną wersję — użyjemy jej wszędzie. Nie wgrasz żadnej — strona rysuje dotychczasowy sygnet SVG, dokładnie jak dotąd.

**Format:** najlepiej **SVG** (ostry na każdym ekranie, waży kilka kB). PNG/JPG/WebP też zadziała — panel sam zmniejsza plik i zachowuje przezroczystość. Limit to ~700 kB po zmniejszeniu; jeśli plik nie wejdzie, panel powie o tym wprost.

**Pozostałe ustawienia w tej karcie:**

- **Wysokość logo** (24–72 px) — dotyczy nagłówka i stopki, szerokość dopasowuje się sama.
- **Napis obok logo** — wyłącz, jeśli wgrane logo ma już nazwę firmy w środku.
- **Kolor akcentu** — osiem gotowych wariantów albo dowolny hex z próbnika. Podmienia `--flame` na całej stronie (przyciski, odznaki, podkreślenia, wbudowany sygnet); odcienie hover i tła ikon strona wylicza sama.
- **Podgląd nagłówka** — pokazuje układ na ciemnym i jasnym tle, zanim cokolwiek zapiszesz.

---

## Edycja danych kontaktowych

**Panel → Ustawienia → „Dane kontaktowe".** Telefon, e-mail, adres i nazwa firmy w jednym miejscu — zapis podmienia je naraz w sekcji „Kontakt" i w stopce strony głównej. Link `tel:` tworzy się automatycznie.

Telefon na podstronie `/dla-punktow/` jest osobny (karta „Oferta dla punktów handlowych") — landing bywa używany w kampaniach z innym numerem.

Wartości domyślne, gdy baza nie odpowiada, siedzą w `api/settings.js` (obiekt `DEFAULTS`) i w `index.html` (obiekt `SITE`).

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

## Import i aktualizacja z CSV

**Panel → Import CSV.** Ten sam plik służy do dodawania nowych produktów i do poprawiania tych, które już są w bazie — dopasowanie idzie po `SKU`.

**Wymagane kolumny:** tylko `sku`. Nazwa jest potrzebna wyłącznie dla produktów, których jeszcze nie ma w bazie — plik `sku,image_url` podmieni same zdjęcia.

**Krok 2 — mapowanie:** nagłówki z pliku przypisujesz do pól produktu (część zgadujemy sami). Możesz też rozpoznać markę z pierwszego słowa nazwy i przypisać własne nazwy kategorii do tych zdefiniowanych.

**Krok 3 — podgląd.** Widać, ile pozycji jest nowych, ile do aktualizacji, a ile jest w bazie identycznych (te pomijamy). Do wyboru tryb:

| Tryb | Co robi |
|---|---|
| Dodaj nowe i zaktualizuj istniejące | Pełny import |
| Tylko nowe | Dorzuca brakujące SKU, istniejących nie rusza |
| Tylko aktualizacja | Nic nie dodaje, poprawia to, co już jest |

Przy aktualizacji dochodzi drugi wybór: **nadpisz wartościami z pliku** albo **uzupełnij tylko braki** (rusza wyłącznie pola, które w bazie są puste).

**Nic nie znika.** Aktualizujemy wyłącznie pola wypisane w kolumnie „Co się zmieni" — czyli te, które są w pliku i faktycznie mają inną wartość. Kolumny, której w pliku nie ma (albo komórka jest pusta), import nie tyka: wgranie samych zdjęć nie skasuje nazw, wariantów ani tagów. Tabela pokazuje każdą zmianę jako `było → będzie`, przy zdjęciach z miniaturkami.

Dwa szablony do pobrania w nagłówku karty: **pełny** (wszystkie kolumny) i **aktualizacji** (`sku,image_url`).

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

## Podstrona dla punktów handlowych

**Adres:** `/dla-punktow/` · **Plik:** `dla-punktow/index.html`

Osobny landing sprzedażowy skierowany do sklepów i hurtowni. Sedno oferty:
*postaw Langera na półce, a pozostałe marki kupisz taniej.* Podstrona jest
podlinkowana w nawigacji i stopce strony głównej.

Powstała z projektu z Claude Design (wariant „1b" na desktopie, „1c" na
telefonie), przepisanego na ten sam stack co reszta serwisu — React 18 z CDN,
bez build'a — i na tokeny kolorów z `index.html`.

### Co zmienisz z panelu

Liczby w ofercie **nie są zaszyte w kodzie**. Wchodzisz na `/admin-langer/` →
zakładka **Ustawienia** → karta **Oferta dla punktów handlowych** i zmieniasz:

| Pole | Gdzie się pokazuje |
|---|---|
| Kartonów Langera | Nagłówek, kafel „Warunek", sekcja „Dlaczego warto" |
| Rabat na inne marki (%) | Nagłówek, kafel „Twoja korzyść", sekcja „Dlaczego warto" |
| Pistolet — próg (kartonów) | Kafel „Gratis", niebieski pasek, pasek na telefonie |
| Pistolet — cena (zł) | Kafel „Gratis", niebieski pasek, pasek na telefonie |
| Telefon na podstronie | Sekcja kontakt i przycisk „Zadzwoń" |

Zapisane wartości trafiają do bazy (tabela `settings`) i podstrona pobiera je
z `/api/settings` przy każdym wejściu. **Wymaga uruchomienia migracji
`migrations/004_settings_table.sql`** — do tego czasu (albo gdy API nie
odpowie) strona pokazuje wartości domyślne: 10 kartonów, 15%, pistolet za 1 zł
do 5 kartonów.

Logo i kolor akcentu podstrona bierze z tych samych ustawień co strona główna —
patrz [Logo i kolory z panelu](#logo-i-kolory-z-panelu). Nowe klucze (logo,
kolory, dane kontaktowe) dokłada `migrations/005_settings_brand_and_contact.sql`;
migracja jest opcjonalna — pierwszy zapis z panelu i tak utworzy brakujące
wiersze, a bez niej wszystko działa na wartościach domyślnych.

### Co zmienisz w kodzie

Opisy produktów, parametry techniczne i zastosowania siedzą w stałej
`PRODUCTS` w `dla-punktow/index.html` — to osobny zestaw od bazy produktów na
stronie głównej, bo tutaj liczą się parametry techniczne, a nie SKU i jednostka
sprzedaży. Zdjęcia leżą w `dla-punktow/assets/`.

### Czego jeszcze nie ma

- **Formularz nie wysyła danych** — tak jak na stronie głównej jest to wersja
  demonstracyjna. Podpięcie wysyłki wymaga osobnego endpointu.
- **Przycisk „Pobierz ulotkę PDF"** z projektu nie został przeniesiony — ulotka
  nie leży w repo. Gdy wrzucisz plik, dopnie się w minutę.

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
├── index.html              # ⭐ Strona główna
├── README.md               # Ten plik
├── dla-punktow/            # Landing dla punktów handlowych (/dla-punktow/)
│   ├── index.html          # Cała podstrona w jednym pliku
│   └── assets/             # Zdjęcia produktów linii Langer (7 szt.)
├── admin-langer/           # Panel admina (/admin-langer/)
├── api/                    # Funkcje serverless Vercela (Neon DB)
│   ├── products.js         # Lista i zapis produktów
│   ├── brands.js           # Marki
│   ├── categories.js       # Kategorie
│   └── settings.js         # Ustawienia: logo, kolory, kontakt, oferta
├── migrations/             # Migracje SQL — uruchamiane ręcznie w Neon
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
