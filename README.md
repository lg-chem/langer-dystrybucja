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
- [Kategorie i podkategorie](#kategorie-i-podkategorie)
- [Jak działa strona główna](#jak-działa-strona-główna)
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

**Panel → Produkty → „Nowy produkt".** Produkty siedzą w bazie (Neon), nie w kodzie — `index.html` pobiera je z `/api/products` przy każdym wejściu. Pola formularza:

| Pole | Do czego służy |
|---|---|
| SKU | Unikalny kod produktu. Po nim dopasowuje się import z pliku — nie da się go zmienić po zapisaniu. |
| Nazwa | To, co widać na karcie produktu. |
| Marka | Jedna z listy (Ustawienia → Marki). Filtr na stronie. |
| Kategoria | Jedna z listy (Ustawienia → Kategorie). Pierwszy poziom filtrów. |
| Podkategoria | Swobodny tekst z podpowiedziami — patrz [Kategorie i podkategorie](#kategorie-i-podkategorie). |
| Wariant / pojemność | Druga linia na karcie, np. „Pistoletowa · 750 ml". |
| Jednostka sprzedaży | Stopka karty, np. „12 szt. / karton". |
| Oznaczenie | Odznaka na zdjęciu: Bestseller (pomarańczowa), Marka własna (niebieska), Premium (granatowa) albo bez. |
| Tagi | Pigułki pod nazwą, oddzielane pionową kreską. |
| Zdjęcie | Wgrywasz z dysku (panel zmniejsza je i zapisuje w bazie) albo wklejasz adres URL. |

Marek i kategorii nie dopisuje się w kodzie — **Panel → Ustawienia → Marki / Kategorie**. Nowa kategoria bez własnej ikony SVG dostaje na stronie neutralną ikonę zastępczą.

Więcej naraz? Patrz niżej — import z pliku albo wklejenie kolumn z arkusza.

---

## Import i aktualizacja z CSV

**Panel → Import CSV.** Ten sam plik służy do dodawania nowych produktów i do poprawiania tych, które już są w bazie — dopasowanie idzie po `SKU`.

**Wymagane kolumny:** tylko `sku`. Nazwa jest potrzebna wyłącznie dla produktów, których jeszcze nie ma w bazie — plik `sku,image_url` podmieni same zdjęcia, a `sku,kategoria,podkategoria` przypisze kategorie zbiorczo.

**Nie musisz zapisywać pliku.** Pod polem wgrywania jest „…albo wklej kolumny prosto z arkusza": zaznaczasz w Arkuszach Google (albo w Excelu) kolumny **razem z wierszem nagłówka**, Ctrl+C, wklejasz w panelu. Kolumny rozdzielone tabulatorem rozpoznajemy tak samo jak CSV.

**Krok 2 — mapowanie:** nagłówki z pliku przypisujesz do pól produktu (część zgadujemy sami — `Kategoria` i `Podkategoria` trafiają tam, gdzie trzeba, niezależnie od kolejności kolumn). Możesz też rozpoznać markę z pierwszego słowa nazwy i przypisać własne nazwy kategorii do tych zdefiniowanych. Wartości kategorii dopasowujemy same po nazwie i identyfikatorze — „Piany" trafi do kategorii `piany`.

**Kategorii z pliku nie ma jeszcze w panelu?** Nie trzeba wychodzić do Ustawień i przepisywać nazw ręcznie. W rozwijanym polu przy każdej wartości jest pozycja **„+ dodaj … jako nową kategorię"** (pyta o nazwę, jaka pokaże się na stronie), a nad listą przycisk **„Dodaj wszystkie brakujące (N)"** — tworzy naraz wszystkie nieprzypisane i od razu je mapuje. Identyfikator powstaje z nazwy, tak samo jak w Ustawieniach. Gdyby nowa nazwa dawała identyfikator zajęty przez istniejącą kategorię, panel zapyta, zanim ją przemianuje (a przy dodawaniu hurtem po prostu podepnie się pod istniejącą). Podkategorii nie mapujemy (to swobodny tekst), za to pokazujemy listę wszystkich znalezionych z liczbą wierszy i znacznikiem **nowa** — dobre miejsce, żeby wyłapać literówkę, zanim zrobi się z niej osobny filtr.

**Krok 3 — podgląd.** Widać, ile pozycji jest nowych, ile do aktualizacji, a ile jest w bazie identycznych (te pomijamy). Do wyboru tryb:

| Tryb | Co robi |
|---|---|
| Dodaj nowe i zaktualizuj istniejące | Pełny import |
| Tylko nowe | Dorzuca brakujące SKU, istniejących nie rusza |
| Tylko aktualizacja | Nic nie dodaje, poprawia to, co już jest |

Przy aktualizacji dochodzi drugi wybór: **nadpisz wartościami z pliku** albo **uzupełnij tylko braki** (rusza wyłącznie pola, które w bazie są puste).

**Nic nie znika.** Aktualizujemy wyłącznie pola wypisane w kolumnie „Co się zmieni" — czyli te, które są w pliku i faktycznie mają inną wartość. Kolumny, której w pliku nie ma (albo komórka jest pusta), import nie tyka: wgranie samych zdjęć nie skasuje nazw, wariantów ani tagów. Tabela pokazuje każdą zmianę jako `było → będzie`, przy zdjęciach z miniaturkami.

Trzy szablony do pobrania w nagłówku karty: **pełny** (wszystkie kolumny), **aktualizacji** (`sku,image_url`) i **kategorii** (`sku,category,subcategory`).

---

## Kategorie i podkategorie

Produkt ma **kategorię** (jedna ze zdefiniowanej listy — `piany`, `silikony`, `akryle`, `kleje`, `akcesoria`, plus co dodasz w Ustawieniach) i **podkategorię** — swobodny tekst w rodzaju „Piany pistoletowe" czy „Kleje montażowe".

Podkategorie nie mają osobnej listy do pilnowania: wyliczamy je z produktów. Przypiszesz podkategorię pięciu produktom — na stronie pojawi się filtr z tą podkategorią; wyczyścisz ją wszędzie — filtr zniknie sam.

**Wymaga migracji `migrations/007_product_subcategory.sql`** (SQL Editor w Neonie). Bez niej panel i strona działają jak dotąd, a próba zapisu podkategorii kończy się czytelnym komunikatem z nazwą migracji.

### Zbiorcze przypisanie z arkusza

Najszybsza droga dla całego cennika — arkusz z trzema kolumnami:

| SKU | Kategoria | Podkategoria |
|---|---|---|
| 00242 | Piany | Piany pistoletowe |
| 210 | Kleje | Kleje - uszczelniacze |
| 00053 | Silikony | Silikony neutralne |

**Panel → Import CSV** → wklej kolumny z arkusza (albo wgraj plik) → krok 2 potwierdza mapowanie → w kroku 3 wybierz tryb **„Tylko aktualizacja"**. Import ruszy wyłącznie kategorię i podkategorię — nazwy, zdjęcia, warianty i tagi zostają nietknięte. SKU, których nie ma w bazie, wylądują w sekcji „pominięte" (bez nazwy nie da się utworzyć produktu).

> **Zera wiodące w SKU.** Arkusze potrafią zamienić `00242` na `242`. Zanim skopiujesz kolumnę, ustaw jej format na tekstowy (Format → Liczby → Zwykły tekst). Wiersze z SKU, którego nie ma w bazie, import pokaże w sekcji „pominięte" z tym właśnie powodem.

Przy aktualizacji działa też **„uzupełnij tylko braki"** — przypisze kategorię tam, gdzie jej nie ma, i nie ruszy tego, co już poprawiłeś ręcznie.

### Pojedynczo i zbiorczo w panelu

- **Formularz produktu** — pole „Podkategoria" podpowiada wartości już używane w wybranej kategorii (żeby „Piany pistoletowe" nie rozjechały się na trzy warianty zapisu).
- **Import CSV** — brakujące kategorie dodasz wprost z kroku mapowania (patrz wyżej).
- **Lista produktów** — zaznacz kilka pozycji (checkboxy) i ustaw markę, kategorię albo podkategorię naraz; „+ nowa podkategoria…" pozwala wpisać własną. Tędy też się zmienia nazwę podkategorii: wyszukaj ją w polu wyszukiwania, zaznacz wszystkie, ustaw nową nazwę.

### Co widać na stronie

Podkategoria pokazuje się na karcie produktu obok marki i buduje drugi poziom filtrów w bazie produktów — patrz [Jak działa strona główna](#jak-działa-strona-główna).

---

## Jak działa strona główna

### Hero — krótkie, konkretne

Pierwszy ekran mieści się w pół wysokości okna: nagłówek mówi wprost, czym handlujemy, obok panel z liczbami (produkty i kategorie liczone z bazy, marki z listy marek, czas realizacji i liczba punktów z panelu), a pod spodem **pasek wszystkich kategorii z licznikami** — kliknięcie wrzuca prosto w katalog z tą kategorią. Puste kategorie się nie pokazują, więc pasek zawsze mówi prawdę o ofercie.

Pasek marek pod hero też jedzie z bazy (Ustawienia → Marki) — nie da się już zostawić w kodzie marki, której nie ma w ofercie.

Kolejność sekcji: **hero → baza produktów → linia Langer → dlaczego my → proces → kontakt**. Kto wchodzi po produkt, ma go od razu; argumenty sprzedażowe są niżej, dla tych, którzy przewijają.

### Baza produktów — zawężanie schodkowe

Trzy poziomy, każdy z licznikami, każdy liczony z tego, co zostało po pozostałych filtrach:

| Poziom | Jak wygląda | Co pokazuje |
|---|---|---|
| **Kategoria** | Kafelki z ikoną i liczbą | Wszystkie kategorie. Bez produktów (np. po wyszukiwaniu) — wygaszone i nieklikalne. Drugi klik w wybraną cofa wybór. |
| **Podkategoria** | Pasek pigułek | Tylko podkategorie z wybranej kategorii, tylko niepuste. |
| **Marka** | Pasek pigułek | **Tylko marki, które faktycznie są w tym zawężeniu** — wybierasz Akryle, widzisz marki mające akryle, z liczbą sztuk. |

Poziomy są ponumerowane (**1 Wybierz kategorię**, **2 Podkategoria**, **3 Marka**), a nad nimi jest ścieżka wyboru (`Wszystkie produkty / Akryle / Kity do parkietu / Langer`) — każdy element zdejmuje się jednym kliknięciem. Jeśli zawężenie wytnie wybraną wcześniej podkategorię albo markę, filtr sam wraca do „wszystkich" — nigdy nie zostaje pusta lista z aktywnym, niemożliwym filtrem.

Wyszukiwarka działa równolegle do filtrów: przeszukuje nazwę, markę, SKU, wariant, podkategorię i tagi, a liczniki na kafelkach od razu pokazują, gdzie są trafienia.

Produkty ładują się po **24 sztuki** (przycisk „Pokaż kolejne") — 300 kart naraz potrafiło zapchać przewijanie na telefonie.

### Na telefonie — jeden krok na ekranie

Telefon dostaje inny sposób wybierania niż desktop. Zasada: **nic nie chowa się poza krawędzią ekranu** — poziomo przewijany pasek wygląda jak skończona lista i nikt go nie przesuwa.

1. **Krok 1 — kategoria.** Kafelki w dwóch kolumnach, w układzie poziomym (ikona · nazwa · licznik). Wszystkie kategorie mieszczą się na jednym ekranie.
2. **Krok 2 — podkategoria.** Po wybraniu kategorii siatka kategorii **znika i zastępuje ją siatka podkategorii** (z kafelkiem „Wszystkie w kategorii"). Nie trzeba przewijać przez całą listę kategorii, żeby dojść do produktów.
3. **Krok 3 — marka.** Pigułki zawijają się do kolejnych linii — wszystkie widoczne naraz.

Pod nagłówkiem przykleja się **pasek kroku**: po lewej przycisk wstecz (`← Kategorie` albo `← Akryle`), po prawej gdzie właśnie jesteś i ile tam produktów. Widać go przez cały czas przewijania, więc powrót o poziom wyżej to zawsze jedno tapnięcie — z podkategorii do kategorii, z kategorii do listy wszystkich.

Strona sama zjeżdża do kolejnego kroku po wyborze (na dużym ekranie nie skacze — tam wszystkie poziomy widać naraz). Karty produktów idą w dwóch kolumnach.

Pasek kategorii w hero jest na telefonie skrócony do sześciu pozycji plus `+N kategorii` — reszta jest w katalogu, jedno tapnięcie dalej.

---

## Zmiana statystyk w hero

**Panel → Ustawienia → „Liczby w hero".** Żadna z tych liczb nie jest już wpisana na sztywno w kodzie:

| Liczba | Skąd bierze wartość |
|---|---|
| Produktów w ofercie | Liczone z bazy — tyle, ile realnie masz produktów. Pole w panelu nadpisuje. |
| Kategorii | Liczone z bazy — tylko kategorie, w których coś jest. Bez pola w panelu. |
| Marek w ofercie | Liczone z listy marek (Ustawienia → Marki). Pole w panelu nadpisuje. |
| Średni czas realizacji | Tylko z panelu. Puste = liczba znika. |
| Zaopatrywanych punktów | Tylko z panelu. Puste = liczba znika. |

Zasada: **pusto zamiast zmyślonego**. Liczba, której nie da się policzyć i której nie wypełnisz, po prostu się nie pokazuje — panel w hero układa się z tego, co zostało.

Klucze w tabeli `settings`: `stat_products`, `stat_brands`, `stat_delivery`, `stat_points` (patrz `migrations/006_settings_hero_stats.sql` — migracja opcjonalna).

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
