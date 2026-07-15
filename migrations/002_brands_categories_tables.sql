-- Marki i kategorie zarządzane z panelu (zakładka „Ustawienia").
-- Do tej pory były zakodowane na sztywno w plikach — teraz trzymamy je w bazie,
-- żeby dodawać/usuwać je klikając, bez ruszania kodu.
--
-- Uruchom JEDNORAZOWO w konsoli SQL bazy Neon (Neon → SQL Editor).
-- Polecenia są idempotentne — można je puścić wielokrotnie bez szkody.

CREATE TABLE IF NOT EXISTS brands (
  name text PRIMARY KEY,
  sort integer DEFAULT 100
);

CREATE TABLE IF NOT EXISTS categories (
  id    text PRIMARY KEY,
  label text NOT NULL,
  blurb text,
  icon  text,
  sort  integer DEFAULT 100
);

-- Seed: aktualne marki
INSERT INTO brands (name, sort) VALUES
  ('Soudal', 10), ('Tytan', 20), ('Penosil', 30), ('Langer', 40),
  ('Den Braven', 50), ('Ofo', 60), ('Champion', 70)
ON CONFLICT (name) DO NOTHING;

-- Seed: aktualne kategorie (z opisami i ikonami jak na stronie)
INSERT INTO categories (id, label, blurb, icon, sort) VALUES
  ('piany',     'Piany montażowe', 'Niskoprężne, pistoletowe, wężykowe, zimowe i ogniochronne.', 'piany',     10),
  ('silikony',  'Silikony',        'Sanitarne, uniwersalne, budowlane i wysokotemperaturowe.',   'silikony',  20),
  ('akryle',    'Akryle',          'Malarskie, elastyczne i dekarskie — gotowe pod malowanie.',  'akryle',    30),
  ('kleje',     'Kleje',           'Montażowe, hybrydowe i poliuretanowe — mocne łączenie.',     'kleje',     40),
  ('akcesoria', 'Akcesoria',       'Pistolety, czyściki, taśmy i wszystko wokół chemii.',        'akcesoria', 50)
ON CONFLICT (id) DO NOTHING;
