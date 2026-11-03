# Langer Dystrybucja — strona firmowa

Strona internetowa hurtowej dystrybucji chemii budowlanej. Jeden plik HTML, który edytujesz bezpośrednio — Vercel przy wdrożeniu sam go kompiluje, żeby strona ładowała się szybko.

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
- [Lista produktów w panelu](#lista-produktów-w-panelu)
- [Karuzela Langer](#karuzela-langer)
- [Zdjęcia produktów — jedna wielkość](#zdjęcia-produktów--jedna-wielkość)
- [Mapa dowozu](#mapa-dowozu)
- [Jak działa strona główna](#jak-działa-strona-główna)
- [Zmiana statystyk w hero](#zmiana-statystyk-w-hero)
- [Podstrona dla punktów handlowych](#podstrona-dla-punktów-handlowych)
- [Szybkość ładowania](#szybkość-ładowania)
- [Wdrożenie na Vercel](#wdrożenie)
- [Struktura plików](#struktura-plików)

---

## Jak to działa

Cała strona to **jeden plik** — `index.html`. Wszystko jest w środku:

- Style CSS (paleta kolorów, layout, animacje)
- Logika React (komponenty, wyszukiwarka produktów, filtry, formularz)
- Ikony SVG (kategorie produktów, sygnet marki)
- Dane produktów (lista, marki, kategorie)

Kod piszesz w JSX prosto w `index.html` (`<script type="text/babel">`). Otwarty z dysku działa od razu — React i Babel dociągają się wtedy z CDN (unpkg). Na produkcji kompilację robi Vercel przy wdrożeniu (`build.mjs`), więc odwiedzający nie pobiera Babela — patrz [Szybkość ładowania](#szybkość-ładowania).

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

**Cztery sloty:**

| Slot | Gdzie się pokazuje | Jaka wersja |
|---|---|---|
| Logo na jasne tło | Nagłówek po przewinięciu strony | Kolorowa / ciemna |
| Logo na ciemne tło | Nagłówek na samej górze, stopka | Jasna (biała) |
| Sygnet (kwadrat) | Znak wodny w hero (wariant „Plakat") | Sam znak, bez napisu |
| Favicon (ikona karty) | Karta przeglądarki, zakładki, ekran telefonu — na wszystkich stronach i w panelu | Kwadrat: SVG albo PNG 512×512 |

Wgrasz tylko jedną wersję — użyjemy jej wszędzie. Nie wgrasz żadnej — strona rysuje dotychczasowy sygnet SVG, dokładnie jak dotąd.

**Favicon.** Każda strona ma w nagłówku HTML stały adres `/api/favicon` (a `/favicon.ico` prowadzi tam samo przez `vercel.json`), więc ikonę widzą też wyszukiwarki. Kolejność: favicon z panelu → sygnet z panelu → wbudowany znak Langera na granatowym kwadracie w kolorze akcentu — strona nigdy nie zostaje bez ikony. Prostokątny plik panel sam dopełnia do kwadratu przezroczystym tłem. Przeglądarki trzymają favicony w pamięci, więc po zmianie nowa ikona może pojawić się dopiero po kilku minutach (albo po Ctrl+F5). Podgląd karty przeglądarki jest w panelu pod podglądem nagłówka.

**Format:** najlepiej **SVG** (ostry na każdym ekranie, waży kilka kB). PNG/JPG/WebP też zadziała — panel sam zmniejsza plik i zachowuje przezroczystość. Limit to ~700 kB po zmniejszeniu; jeśli plik nie wejdzie, panel powie o tym wprost.

**Pozostałe ustawienia w tej karcie:**

- **Wysokość logo** (24–72 px) — dotyczy nagłówka i stopki, szerokość dopasowuje się sama.
- **Napis obok logo** — nie ma już przełącznika: wgrane logo stoi w nagłówku samo (bez dopisku „Dystrybucja"), a napis „LANGER" pojawia się tylko obok wbudowanego sygnetu, gdy nie ma wgranego logo. Na telefonie logo jest zmniejszane, żeby zmieściło się obok przycisku.
- **Kolor akcentu** — osiem gotowych wariantów albo dowolny hex z próbnika. Podmienia `--flame` na całej stronie (przyciski, odznaki, podkreślenia, wbudowany sygnet); odcienie hover i tła ikon strona wylicza sama.
- **Podgląd nagłówka** — pokazuje układ na ciemnym i jasnym tle, zanim cokolwiek zapiszesz.

---

## Edycja danych kontaktowych

**Panel → Ustawienia → „Dane kontaktowe".** Telefon, e-mail, adres i nazwa firmy w jednym miejscu — zapis podmienia je naraz w sekcji „Kontakt" i w stopce strony głównej. Link `tel:` tworzy się automatycznie.

Podstrona `/dla-punktow/` ma własny telefon, e-mail, osobę kontaktową i godziny (karta „Oferta dla punktów handlowych") — landing bywa używany w kampaniach z innym numerem. Puste pola telefonu i e-maila na podstronie biorą wartości z „Danych kontaktowych".

Wartości domyślne, gdy baza nie odpowiada, siedzą w `api/settings.js` (obiekt `DEFAULTS`) i w `index.html` (obiekt `SITE`).

---

## Dodawanie nowych produktów

**Panel → Produkty → „Nowy produkt".** Produkty siedzą w bazie (Neon), nie w kodzie — `index.html` pobiera je z `/api/products` przy każdym wejściu. Pola formularza:

| Pole | Do czego służy |
|---|---|
| SKU | Unikalny kod produktu. Po nim dopasowuje się import z pliku — nie da się go zmienić po zapisaniu. |
| Nazwa | To, co widać na karcie produktu. |
| Marka | Jedna z listy (Ustawienia → Marki) albo „+ nowa marka…" — dopisuje ją do listy i od razu wybiera. Filtr na stronie. |
| Kategoria | Jedna z listy (Ustawienia → Kategorie). Pierwszy poziom filtrów. |
| Podkategoria | Swobodny tekst z podpowiedziami — patrz [Kategorie i podkategorie](#kategorie-i-podkategorie). |
| Wariant / pojemność | Druga linia na karcie, np. „Pistoletowa · 750 ml". |
| Jednostka sprzedaży | Stopka karty, np. „12 szt. / karton". |
| Oznaczenie | Odznaka na zdjęciu: Bestseller (pomarańczowa), Marka własna (niebieska), Premium (granatowa) albo bez. |
| Tagi | Pigułki pod nazwą, oddzielane pionową kreską. |
| Zdjęcie | Wgrywasz z dysku (panel zmniejsza je i zapisuje w bazie) albo wklejasz adres URL. Wgrane zdjęcie strona pobiera spod adresu `/api/img?sku=…` — patrz [Szybkość ładowania](#szybkość-ładowania). |

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

**Eksport.** Przycisk **„Eksport CSV"** na liście produktów pobiera plik z tymi samymi kolumnami co pełny szablon (`sku`, nazwa, marka, kategoria, podkategoria, wariant, opakowanie, oznaczenie, tagi, zdjęcie). Bierze to, co widać: zaznaczone produkty, a bez zaznaczenia — wynik wyszukiwania (pusta wyszukiwarka = wszystko). Separator to średnik, więc polski Excel od razu rozkłada kolumny. Poprawiony plik wraca przez Import CSV; zdjęcia wgrane do bazy mają w pliku adres `/api/img?…` i import ich nie rusza. Uwaga na zera wiodące w SKU (patrz niżej) — przed zapisem w Excelu ustaw kolumnę `sku` jako tekst.

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
- **Lista produktów** — zaznacz kilka pozycji (checkboxy) i ustaw markę, kategorię albo podkategorię naraz; „+ nowa podkategoria…" pozwala wpisać własną. Tędy też się zmienia nazwę podkategorii: wyszukaj ją w polu wyszukiwania, zaznacz wszystkie, ustaw nową nazwę. Filtry i sortowanie — patrz [Lista produktów w panelu](#lista-produktów-w-panelu).

### Co widać na stronie

Podkategoria pokazuje się na karcie produktu obok marki i buduje drugi poziom filtrów w bazie produktów — patrz [Jak działa strona główna](#jak-działa-strona-główna).

---

## Lista produktów w panelu

**Panel → Produkty.** Żeby łatwiej ogarnąć kilkaset pozycji:

- **Sortowanie** — kliknij nagłówek kolumny (SKU, Nazwa, Marka, Kategoria, Podkategoria); drugie kliknięcie odwraca kolejność. Puste wartości zawsze lądują na końcu.
- **Filtry** — marka, kategoria, podkategoria (lista zawęża się do wybranej kategorii) i zdjęcie (bez / ze zdjęciem). Działają razem z wyszukiwarką.
- **Braki** — przyciski „Bez zdjęcia", „Bez marki", „Bez kategorii", „Bez podkategorii" (i „Kategoria spoza listy", gdy produkt ma kategorię, której nie ma w Ustawieniach) z licznikami. Kliknięcie pokazuje tylko te produkty.
- **Zbiorczo** — odfiltruj, kliknij „Zaznacz wszystkie wyniki" (albo checkbox w nagłówku tabeli) i na granatowym pasku ustaw markę, kategorię, podkategorię albo **oznaczenie** (Bestseller / Premium / …) naraz. Pasek mówi też, ile zaznaczonych jest poza bieżącym widokiem.
- **Nowa marka bez wychodzenia z listy** — w pasku zbiorczym „Marka → + nowa marka…": wpisujesz nazwę, marka trafia do listy (Ustawienia → Marki) i od razu ustawia się zaznaczonym produktom. To samo jest w formularzu produktu. Jeśli taka marka już jest (np. wpiszesz „soudal"), panel użyje istniejącej „Soudal" zamiast robić duplikat.
- Kolumna „Kategoria" pokazuje nazwę z Ustawień, a nie identyfikator z bazy („Farby w sprayu", nie „farbywsprayu").
- Eksport CSV bierze to, co widać: zaznaczone, a bez zaznaczenia — wynik wyszukiwania i filtrów.

---

## Karuzela Langer

**Panel → zakładka „Karuzela Langer".** Ta sama karuzela stoi na stronie głównej (sekcja Langer) i na `/dla-punktow/` (sekcja Produkty). Wyróżniki (wydajność, czas, odporność…) i zastosowanie stoją przy produkcie, którego dotyczą.

- **Po prawej** lista wszystkich produktów marki Langer z bazy z checkboxami — zaznaczasz, żeby dodać do karuzeli, odznaczasz, żeby usunąć.
- **Po lewej** slajdy w kolejności, w jakiej pokażą się na stronie: strzałki ↑ ↓ zmieniają kolejność, „Edytuj" otwiera formularz: nazwa, druga linia (np. „870 ml · niskoprężna"), rodzaj, plakietka na zdjęciu (Bestseller, Nowość… albo pusto), opis, **do 4 wyróżników** (nazwa + wartość), **zastosowanie** (po przecinku) i zdjęcie (puste = zdjęcie produktu z bazy).
- **„Zapisz karuzelę"** zapisuje listę w ustawieniach (klucz `langer_showcase`, JSON). **„Przywróć domyślną"** wraca do listy startowej.

Lista domyślna (dopóki nic nie zapiszesz) siedzi w `shared/langer-showcase.js`: Langer 70, XL Fast, Express 60 s, Economy Line, Langer TUR, Pianoklej do styropianu (XPS/EPS), Economy Wężykowa — ze zdjęciami z `dla-punktow/assets/`. Panel sam dopasowuje te slajdy do produktów w bazie po nazwie, więc od razu są zaznaczone na liście i mają przycisk „Zobacz w katalogu". Plik czytają strona główna, `/dla-punktow/` i panel — jedna lista zamiast trzech kopii.

Na komputerze karuzela to duży kadr ze szczegółami i miniatury z nazwami (działają też strzałki na klawiaturze); na telefonie — przesuwane karty z kropkami i strzałkami. Komponent `LangerCarousel` jest w obu plikach stron (`index.html`, `dla-punktow/index.html`) — zmieniając jeden, popraw drugi.

---

## Zdjęcia produktów — jedna wielkość

Zdjęcia mają różne marginesy (jedne puste tło dookoła, inne kadr ciasno przy produkcie), więc ten sam rozmiar puszki wyglądał na mniejszy albo większy. Teraz:

- **Zdjęcia z bazy** (katalog, karuzela) strona przycina sama: po wczytaniu sprawdza na małej kopii, gdzie jest produkt (przezroczyste albo jednolite tło jest pomijane), i pokazuje tylko ten fragment z jednakowym marginesem. Każdy produkt wypełnia kafel tak samo. Działa dla zdjęć wgranych do bazy i z adresów, które pozwalają odczytać obraz (CORS); obce zdjęcie bez CORS pokazuje się jak dotąd.
- **Pliki w `dla-punktow/assets/`** są przycięte do samej puszki (2% marginesu, wysokość 840 px). Obok leżą oryginały PNG 1080 px; nowy plik przytnij tak samo albo po prostu wgraj — przycinanie w przeglądarce i tak go wyrówna.

---

## Mapa dowozu

Sekcja **„Gdzie dowozimy"** — na stronie głównej (między „Co zyskujesz" a „Jak zacząć") i na `/dla-punktow/` (po „Bez ryzyka", w nawigacji jako „Dowóz", plus pytanie w FAQ). Mapa: baza w Płońsku (09-100), obszar dowozu poprowadzony gładką linią przez miasta na obwodzie, koło 100 km od bazy, rzeki, punkty orientacyjne (Warszawa, Płock) i mała Polska w rogu. Obok lista miast — najechanie (albo tapnięcie na telefonie) podświetla miasto na mapie; na telefonie podpisy miast pokazują się tylko po wybraniu, żeby się nie nakładały.

**Zmiana miast:** `shared/delivery-area.js` → tablica `TOWNS`. Kolejność ma znaczenie — to obwód obszaru (dookoła, zgodnie z ruchem wskazówek zegara od Łodzi), więc nowe miasto wstaw między sąsiadów. Każde ma `lat`/`lon` (np. z Map Google: prawy klik na mapie → współrzędne) i `label` — gdzie stoi podpis (`r`, `l`, `t`, `b`). Obszar, lista pod mapą i odpowiedź w FAQ biorą się z tej tablicy. Okno mapy obejmuje ok. 51,35–53,95° N i 18,35–22,95° E.

Rzeki i kontur Polski to gotowe ścieżki SVG z Natural Earth 1:10 mln (domena publiczna) — przy zmianie miast nic się w nich nie zmienia. Mapa nie pobiera kafelków z zewnątrz i nie potrzebuje żadnej biblioteki.

---

## Jak działa strona główna

### Układ — kolejność pytań klienta

Strona prowadzi od „co to jest i co z tego mam" do „jak zacząć". Każda sekcja odpowiada na jedno pytanie i kończy się jednym następnym krokiem:

| Sekcja | Na jakie pytanie odpowiada | Następny krok |
|---|---|---|
| **Hero** (jasne tło, puszki Langera) | Co tu jest? Piany i kleje Langer plus cała chemia budowlana w jednym zamówieniu. Trzy korzyści: Langer w hurtowej cenie, pozostałe marki w tym samym zamówieniu, bez pełnych kartonów. | „Zobacz produkty Langer" albo „Zapytaj o cennik" |
| **Pasek pod hero** | Jaka to skala? Liczby (produkty, kategorie, marki, czas realizacji, punkty — patrz [Zmiana statystyk w hero](#zmiana-statystyk-w-hero)) i wszystkie marki z panelu, Langer pierwszy. | — |
| **Langer** | Czemu akurat Langer? [Karuzela](#karuzela-langer): każdy produkt z opisem, wyróżnikami i zastosowaniem. | „Zapytaj o cenę", „Zobacz w katalogu" (wyszukuje produkt po SKU), „Wszystkie produkty Langer (N)" — katalog z filtrem Langer |
| **Dla sklepów i hurtowni** | Co z tego ma sklep? Zasada „bierzesz Langera — zyskujesz", trzy korzyści (pistolet, rabat na resztę, marketing — warunki z panelu, te same co na `/dla-punktow/`). | „Zobacz ofertę dla sklepów", „Zapytaj o warunki" |
| **Katalog** | Co jeszcze macie? Pełna baza, Langer zawsze na początku. | „Zapytaj o cenę" na karcie |
| **Co zyskujesz** | I co z tego? Sześć korzyści sformułowanych jako skutek dla klienta (towar na czas, jeden dostawca, brak zamrożonej gotówki, więcej za Langera, opiekun, reklamacje). | — |
| **Jak zacząć** | Co się stanie, jak się odezwę? Cztery kroki od kontaktu do dostawy. | „Zacznij od kroku 1" |
| **Kontakt** | Formularz z wyborem „Kim jesteś?" | „Wyślij zapytanie" |

Do katalogu prowadzą nawigacja i sekcja Langer — hero nie ma własnego paska kategorii, więc nie ma dwóch równoległych wejść do tego samego.

**Gdzie zmienić teksty:** produkty w karuzeli — w panelu („Karuzela Langer"); reszta w `index.html` — komponenty `Hero`, `LangerSection`, `ShopBand`, `WhyUs`, `Process`, `Contact`. Czas dostawy w tekstach („średnio 48 h") bierze się z panelu (Ustawienia → Liczby w hero → Średni czas realizacji); puste pole = zdania o czasie dostawy po prostu znikają. Warunki dla sklepów (pistolet, rabat) — z karty „Oferta dla punktów handlowych".

Zdjęcia puszek w hero to pliki z `dla-punktow/assets/` (przezroczyste WebP).

**Formularz kontaktowy** działa jak na `/dla-punktow/`: składa gotową wiadomość i otwiera ją w poczcie klienta na e-mail z „Danych kontaktowych" (z opcją skopiowania treści, gdy poczta się nie otworzy).

### Langer w katalogu

- **Zawsze na początku listy** — przy każdym sortowaniu (nazwa, marka), w każdej kategorii i w wynikach wyszukiwania. Gdy w wynikach są i Langer, i inne marki, nad grupami stoją nagłówki „Langer · N produktów" / „Pozostałe marki · N produktów".
- **Wyróżniona karta** — ciepła ramka, nazwa marki w kolorze akcentu i plakietka „Langer" (obok ewentualnego „Bestseller"). Oznaczenie „Marka własna" z panelu nie wyświetla się osobno — to właśnie Langer.
- **„Tylko Langer"** — przełącznik obok „Marka" (na komputerze). Na telefonie Langer jest pierwszy na liście w panelu marek.
- Langer jest też pierwszy na liście marek i w pasku marek pod hero.

### Baza produktów — kategoria to nawigacja, reszta to filtry

Dwa rodzaje wyboru, każdy z jednym, standardowym zachowaniem — takim samym na komputerze i telefonie (zmienia się tylko układ):

| Element | Jak wygląda | Jak działa |
|---|---|---|
| **Kategoria** | Pigułki z liczbą, zawijane do kolejnych linii | Nawigacja („gdzie jestem"). Zawsze **dokładnie jedna aktywna**, „Wszystkie" jest pierwszą zakładką. Klik w aktywną nic nie robi. Puste kategorie (bez żadnego produktu w bazie) się nie pokazują. |
| **Rodzaj** (podkategoria) | Rząd pigułek pod kategoriami (komputer i telefon) | Pojawia się dopiero w wybranej kategorii. Jeden wybór plus „Wszystkie". |
| **Marka** | Przycisk „Marka ▾": na komputerze rozwija listę pól wyboru, na telefonie otwiera panel od dołu | **Można zaznaczyć kilka** (Soudal + Den Braven). Przy każdej liczba produktów; marka bez produktów w bieżącym widoku jest nieaktywna. |
| **Wybrane marki** | Chipy z ✕ | Jedno kliknięcie zdejmuje markę. Kategorię i rodzaj widać w pigułkach, więc nie dublujemy ich chipami. |

**Liczniki zawsze mówią, ile zostanie po kliknięciu** — uwzględniają wyszukiwanie i pozostałe filtry. Wybierzesz markę Soudal → na pigułkach kategorii widać, ile produktów Soudal jest w każdej kategorii.

**Żaden wybór nie zmienia po cichu innego.** Zmiana kategorii kasuje tylko rodzaj (bo rodzaje należą do kategorii); wybrane marki zostają. Jeśli filtry się wykluczają (np. Bostik + Akryle), pusty stan mówi to wprost — „Marka Bostik nie ma produktów w kategorii Akryle" — i daje jeden przycisk naprawy („Pokaż wszystkie marki").

**Lista marek do filtrowania bierze się z produktów**, nie z listy w Ustawieniach — każda marka, która jest w bazie, da się odfiltrować. „SOUDAL" i „Soudal" to ta sama marka; nazwę pokazujemy w pisowni z Ustawień → Marki, jeśli tam jest.

Zaznaczenie = wypełnienie (granat), najechanie = tylko ramka. Nic nie podskakuje pod kursorem, więc najechanego nie da się pomylić z wybranym.

Wyszukiwarka działa równolegle do filtrów: przeszukuje nazwę, markę, SKU, wariant, podkategorię i tagi, a liczniki na pigułkach od razu pokazują, gdzie są trafienia.

Produkty ładują się po **24 sztuki** (przycisk „Pokaż kolejne") — 300 kart naraz potrafiło zapchać przewijanie na telefonie.

**Stan katalogu jest w adresie strony**, np. `/?kat=silikony&marka=soudal` albo `/?kat=kleje&pod=kleje montażowe`. Odświeżenie niczego nie gubi, a link można wysłać klientowi — po wejściu z takiego linku strona od razu pokazuje katalog. Nieistniejąca kategoria czy marka w linku jest po cichu pomijana.

### Na telefonie

Układ jak na komputerze, tylko etykiety (KATEGORIA, RODZAJ) są nad pigułkami. **Nic nie chowa się poza krawędzią ekranu** — kategorie i rodzaje zawijają się do kolejnych linii, wszystko widać naraz. Poziomo przewijany pasek wyglądał jak skończona lista i nikt go nie przesuwał.

- Pod pigułkami jest **pasek narzędzi** (marka, liczba wyników, sortowanie), który przykleja się pod nagłówkiem. Przyklejony pokazuje po lewej **bieżącą kategorię i rodzaj** — tapnięcie przewija z powrotem do wyboru kategorii, więc z głębi listy zmiana kategorii to jedno tapnięcie.
- **„Marka"** otwiera panel od dołu z listą pól wyboru. Zmiany działają od razu, a przycisk na dole na żywo mówi, ile zostanie („Pokaż 37 produktów"). Panel zamyka ✕, tapnięcie w tło, ten przycisk albo systemowe „wstecz".
- Po zmianie kategorii czy filtra, gdy jesteś przewinięty głęboko w listę, strona wraca na początek wyników (tuż pod przyklejony pasek). Gdy początek wyników jest widoczny — nic nie skacze.

**Gest wstecz telefonu cofa o jeden widok**, zamiast wyrzucać ze strony. Zmiana kategorii i rodzaju zapisuje się w historii przeglądarki; marka tylko odświeża bieżący wpis. Otwarty panel marek to osobny wpis — „wstecz" go zamyka, a marki wybrane w panelu zostają.

Karty produktów idą w dwóch kolumnach.

---

## Zmiana statystyk w hero

**Panel → Ustawienia → „Liczby w hero".** Liczby stoją w pasku pod hero. Żadna z nich nie jest wpisana na sztywno w kodzie:

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

Landing sprzedażowy dla sklepów i hurtowni. Zasada oferty w jednym zdaniu:
*bierzesz Langera — zyskujesz na całym zamówieniu.* Bez sztywnego progu
kartonów: do zamówionych kartonów Langera pistolet za 1 zł, a pozostałe
marki nawet kilka procent taniej. Po spełnieniu warunków — współpraca
marketingowa. Podstrona jest podlinkowana w nawigacji i stopce strony głównej.

### Jak prowadzi klienta

Każda sekcja odpowiada na kolejne pytanie i kończy się przyciskiem do następnego kroku:

| Sekcja | Co mówi | Dokąd prowadzi |
|---|---|---|
| Hero + 4 kafle | Bierzesz → dostajesz (pistolet) → oszczędzasz (rabat) → rośniesz (marketing) | Formularz albo „Jak to działa" |
| Jak to działa | 4 kroki od wyboru Langera do dostawy + schemat zamówienia (Langer + pozostałe marki → co z tego masz). Marki w schemacie biorą się z Ustawień → Marki. | Produkty, katalog na stronie głównej, formularz |
| Linia Langer | Produkty z parametrami | „Poproś o propozycję" zestawu na start |
| Pasek pistoletu | Pistolet do zamówionych kartonów | „Dopisz do oferty" |
| Współpraca marketingowa | Filmy wideo, Google Ads / Meta Ads, wizytówka Google, SEO/GEO, strategia, klienci lokalni i ogólnopolscy — po spełnieniu warunków | „Zapytaj o współpracę marketingową" |
| Bez ryzyka | Zwroty, opiekun z regionu, elastyczne ilości, czas dostawy (z „Liczb w hero"; puste = kafel znika) | — |
| Pytania (FAQ) | 7 najczęstszych pytań, teksty liczą się z ustawień | Telefon |
| Ostatni krok | „Poproś o ofertę z możliwymi rabatami": co się stanie dalej, formularz, telefon i e-mail | — |

Przyciski w sekcjach **zaznaczają właściwą pozycję w formularzu** (np. „Zapytaj
o współpracę marketingową" zaznacza „Współpraca marketingowa") — klient dochodzi
do formularza z gotowym wyborem. Link w nagłówku podświetla sekcję, w której
jest klient. Na telefonie na dole wisi pasek „Poproś o ofertę" + „Zadzwoń";
znika przy formularzu, żeby go nie zasłaniać.

### Co zmienisz z panelu

`/admin-langer/` → **Ustawienia** → karta **Oferta dla punktów handlowych**:

| Pole | Gdzie się pokazuje |
|---|---|
| Rabat na pozostałe marki (tekst) | Wszędzie po słowie „nawet": „kilka procent", „3%", „do 5%". Puste = „kilka procent". |
| Pistolet — cena (zł) | Hero, kafel, pasek, pytania, formularz. `0` = na stronie „gratis". |
| Telefon | Kontakt, pytania, stopka, przycisk „Zadzwoń" na telefonie. Puste = telefon z „Danych kontaktowych". |
| E-mail na zapytania | Kontakt, stopka i adres, na który formularz składa wiadomość. Puste = e-mail z „Danych kontaktowych". |
| Osoba kontaktowa | Sekcja kontakt. Puste = nie pokazujemy. |
| Godziny kontaktu | Sekcja kontakt. Puste = nie pokazujemy. |

Wartości trafiają do bazy (tabela `settings`) i podstrona pobiera je z
`/api/settings` przy każdym wejściu. Opcjonalna migracja
`migrations/008_settings_landing_flexible_offer.sql` dokłada nowe klucze —
bez niej działają wartości domyślne z `api/settings.js`, a pierwszy zapis
karty i tak utworzy wiersze. Stare klucze (`landing_cartons`,
`landing_discount_pct`, `landing_pistol_cartons`) nie są już czytane.

Logo i kolor akcentu podstrona bierze z tych samych ustawień co strona główna —
patrz [Logo i kolory z panelu](#logo-i-kolory-z-panelu).

### Co zmienisz w kodzie

Wszystko w `dla-punktow/index.html`:

- **Produkty** — już nie w kodzie: karuzelę ustawiasz w panelu („Karuzela
  Langer"), a lista domyślna leży w `shared/langer-showcase.js` — patrz
  [Karuzela Langer](#karuzela-langer).
- **Usługi marketingowe** — stała `MARKETING` (ikona, etykieta, tytuł, opis;
  kolejność w tablicy = kolejność kafli).
- **Pytania** — tablica w komponencie `Faq`.
- **Pozycje do zaznaczenia w formularzu** — stała `INTERESTS`.

### Formularz

Nie ma jeszcze własnego serwera do wysyłki, więc zamiast udawać wysyłkę
formularz **składa gotową wiadomość i otwiera ją w poczcie klienta** (link
`mailto:` na e-mail z panelu): temat „Zapytanie o ofertę dla punktu — nazwa,
miasto", w treści dane punktu, zaznaczone pozycje i marki, które klient
zamawia. Klient klika „Wyślij". Gdy poczta się nie otworzy (np. komputer bez
programu pocztowego), ekran po wysłaniu daje „Kopiuj treść" i numer telefonu.
Zapisywanie zapytań w bazie albo wysyłka bez programu pocztowego wymaga
osobnego endpointu — do dopięcia, gdy będzie potrzebne.

**Przycisk „Pobierz ulotkę PDF"** z projektu nie został przeniesiony — ulotka
nie leży w repo. Gdy wrzucisz plik, dopnie się w minutę.

---

## Szybkość ładowania

Na stronie było widać najpierw biały ekran, a zdjęcia doładowywały się długo. Przyczyny i co je teraz usuwa:

| Co spowalniało | Jak jest teraz |
|---|---|
| **Wszystkie zdjęcia jechały w jednym JSON-ie.** `/api/products` zwracał każde wgrane zdjęcie jako base64 — przy 150 zdjęciach ok. 5 MB, pobierane w całości przy każdym wejściu, zanim pojawiła się pierwsza karta. (Vercel nie wyśle odpowiedzi większej niż 4,5 MB — przy kolejnych zdjęciach lista przestałaby się ładować w ogóle.) | Lista ma same dane (~75 kB), a w miejscu zdjęcia adres `/api/img?sku=…&v=…`. Przeglądarka ładuje zdjęcie dopiero, gdy karta jest na ekranie, i trzyma je w cache. `v` to skrót zawartości — nowe zdjęcie = nowy adres, więc podmianę widać od razu. To samo dotyczy logo z panelu. |
| **Babel w przeglądarce.** Każdy odwiedzający pobierał ~3 MB kompilatora i tłumaczył cały kod strony — do tego czasu ekran był biały. | Vercel kompiluje JSX przy wdrożeniu (`npm run build` → `build.mjs` → `dist/`). React idzie z naszej domeny (`/vendor/`), z cache na rok. |
| **Czekanie po kolei.** Najpierw skrypty, potem ustawienia, dopiero po wyświetleniu strony — produkty. | Wszystkie zapytania do API startują w `<head>`, równolegle ze skryptami. Do czasu narysowania strony widać granatowe tło z paskiem ładowania zamiast białej kartki. |
| **Każde wejście budziło bazę.** Neon usypia się po kilku minutach ciszy, a odpowiedzi API miały zakaz cache. | Publiczne odczyty API idą przez cache CDN Vercela (patrz niżej). |
| **Zdjęcia na `/dla-punktow/`** — PNG 1080 px, razem 1,3 MB. | WebP 840 px, razem ok. 140 kB. |

Pomiar lokalny (300 produktów, 150 ze zdjęciami, symulowany telefon na LTE): strona pojawiała się po ~9,8 s, a pierwsze zdjęcia po ~16,5 s — teraz odpowiednio ~1,4 s i ~1,6 s.

### Cache — kiedy widać zmiany z panelu

Strona czyta produkty, marki, kategorie i ustawienia przez CDN: odpowiedź jest świeża przez **minutę**, potem CDN oddaje ostatnią wersję natychmiast i w tle pobiera nową z bazy. Zmiana zapisana w panelu pojawia się więc u odwiedzających w ciągu mniej więcej minuty (czasem trzeba odświeżyć stronę dwa razy).

**Chcesz zobaczyć zmianę od razu?** Wejdź na stronę z panelu — przyciskiem „Zobacz stronę →" albo linkami w Ustawieniach. Prowadzą na `/?fresh=1`, które omija cache. Sam panel zawsze czyta prosto z bazy.

Nagłówki ustawia `setReadCache` w `api/_images.js` — tam zmienisz czas świeżości (`s-maxage`).

### Build

`vercel.json` uruchamia `npm run build`, a Vercel publikuje katalog `dist/`. Skrypt kopiuje stronę, kompiluje każdy `<script type="text/babel">` (esbuild) i podmienia Reacta z unpkg na `/vendor/`. Pliki w repo się nie zmieniają — edytujesz je jak dotąd. Błąd w JSX zatrzyma wdrożenie z komunikatem, gdzie jest błąd, zamiast opublikować zepsutą stronę (zostaje poprzednia wersja).

Lokalnie: `npm install`, potem `npm run build` — wynik w `dist/` (nie trafia do repo). Wersja Reacta w adresach unpkg w HTML musi się zgadzać z tą w `package.json`; jeśli nie, build zatrzyma się z czytelnym komunikatem.

---

## Wdrożenie

### Vercel (zalecane, darmowe)

1. Wejdź na **[vercel.com/new](https://vercel.com/new)** → zaloguj się przez GitHub
2. Wybierz repo `langer-dystrybucja` → kliknij **Deploy**
3. Po ~30 sekundach dostaniesz URL typu `langer-dystrybucja.vercel.app`

Od tej chwili każdy commit w repo → strona aktualizuje się automatycznie. Ustawień builda nie trzeba wpisywać w panelu Vercela — są w `vercel.json` (`npm run build`, katalog `dist/`).

### Własna domena

Po wdrożeniu w panelu Vercela: **Settings → Domains → Add** i podaj swoją domenę (np. `langerdystrybucja.pl`). Vercel pokaże jakie rekordy DNS ustawić u Twojego rejestratora.

---

## Struktura plików

```
.
├── index.html              # ⭐ Strona główna
├── README.md               # Ten plik
├── build.mjs               # Build na Vercelu: kompilacja JSX -> dist/
├── vercel.json             # Komenda builda, katalog dist/, cache /vendor/
├── shared/
│   ├── langer-showcase.js  # Domyślne slajdy karuzeli Langer (strona, /dla-punktow/, panel)
│   └── delivery-area.js    # Mapa dowozu: miasta, baza w Płońsku, rzeki i kontur Polski
├── dla-punktow/            # Landing dla punktów handlowych (/dla-punktow/)
│   ├── index.html          # Cała podstrona w jednym pliku
│   └── assets/             # Zdjęcia produktów Langer: WebP przycięte do puszki + oryginały PNG
├── admin-langer/           # Panel admina (/admin-langer/)
├── api/                    # Funkcje serverless Vercela (Neon DB)
│   ├── products.js         # Lista i zapis produktów
│   ├── brands.js           # Marki
│   ├── categories.js       # Kategorie
│   ├── settings.js         # Ustawienia: logo, kolory, kontakt, oferta
│   ├── img.js              # Zdjęcia i logo z bazy jako pliki (/api/img)
│   ├── favicon.js          # Ikona karty przeglądarki (/api/favicon, /favicon.ico)
│   └── _images.js          # Wspólne: adresy /api/img, nagłówki cache
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

- **HTML** + **React 18** (UMD — na produkcji z `/vendor/`, lokalnie z CDN)
- **esbuild** — kompiluje JSX przy wdrożeniu (`build.mjs`); **Babel Standalone** tylko przy otwieraniu pliku prosto z dysku
- **Google Fonts** — Space Grotesk, Hanken Grotesk, JetBrains Mono
- **Vercel** — hosting statyczny
