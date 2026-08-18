-- Logo, kolory marki i dane kontaktowe edytowane z panelu (zakładka
-- „Ustawienia" → karty „Logo i kolory marki" oraz „Dane kontaktowe"). Korzysta z tej samej
-- tabeli klucz–wartość co migracja 004 — nie trzeba nic dokładać do schematu, bo `value` to `text`,
-- a logo zapisujemy jako data URI (base64), tak jak zdjęcia produktów.
--
-- Uruchom JEDNORAZOWO w konsoli SQL bazy Neon (Neon → SQL Editor).
-- Polecenia są idempotentne — można je puścić wielokrotnie bez szkody.
--
-- UWAGA: migracja jest opcjonalna. Bez niej panel i strona działają na
-- wartościach domyślnych z api/settings.js (wbudowany sygnet SVG), a pierwszy
-- zapis logo z panelu i tak utworzy brakujące wiersze.

CREATE TABLE IF NOT EXISTS settings (
  key   text PRIMARY KEY,
  value text
);

-- Seed: dane kontaktowe (sekcja „Kontakt" i stopka strony głównej).
INSERT INTO settings (key, value) VALUES
  ('contact_phone',   '+48 000 000 000'),
  ('contact_email',   'biuro@langerdystrybucja.pl'),
  ('contact_street',  'ul. Przykładowa 00'),
  ('contact_city',    '00-000 Miasto'),
  ('contact_company', 'Langer Dystrybucja')
ON CONFLICT (key) DO NOTHING;

-- Seed: puste logo = strona rysuje wbudowany sygnet (stan sprzed zmiany).
INSERT INTO settings (key, value) VALUES
  ('logo_light',     ''),          -- wersja na ciemne tło (header u góry, stopka)
  ('logo_dark',      ''),          -- wersja na jasne tło (header po przewinięciu)
  ('logo_mark',      ''),          -- sam sygnet (kwadrat) — znak wodny w hero
  ('logo_height',    '38'),        -- wysokość logo w headerze, px
  ('logo_show_text', '1'),         -- '1' = napis LANGER / DYSTRYBUCJA obok znaku
  ('brand_accent',   '#F04E23')    -- kolor akcentu (--flame)
ON CONFLICT (key) DO NOTHING;
