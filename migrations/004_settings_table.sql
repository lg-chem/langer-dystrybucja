-- Ustawienia treści edytowane z panelu (zakładka „Ustawienia" → karta
-- „Oferta dla punktów handlowych"). Prosta tabela klucz–wartość: dzięki niej
-- liczby na podstronie /dla-punktow/ (ile kartonów, ile procent rabatu,
-- warunki pistoletu, telefon) zmienia się klikając, bez ruszania kodu.
--
-- Uruchom JEDNORAZOWO w konsoli SQL bazy Neon (Neon → SQL Editor).
-- Polecenia są idempotentne — można je puścić wielokrotnie bez szkody.

CREATE TABLE IF NOT EXISTS settings (
  key   text PRIMARY KEY,
  value text
);

-- Seed: wartości startowe z projektu landingu.
-- ON CONFLICT DO NOTHING — ponowne uruchomienie nie nadpisze tego,
-- co już ustawiłeś w panelu.
INSERT INTO settings (key, value) VALUES
  ('landing_cartons',        '10'),
  ('landing_discount_pct',   '15'),
  ('landing_pistol_cartons', '5'),
  ('landing_pistol_price',   '1'),
  ('landing_phone',          '+48 000 000 000')
ON CONFLICT (key) DO NOTHING;
