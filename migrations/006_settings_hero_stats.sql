-- Liczby w hero strony głównej (panel → Ustawienia → „Liczby w hero").
-- Ta sama tabela klucz–wartość co migracje 004/005 — nic nie zmieniamy
-- w schemacie.
--
-- Uruchom JEDNORAZOWO w konsoli SQL bazy Neon (Neon → SQL Editor).
-- Idempotentne — można puścić wielokrotnie bez szkody. Migracja jest
-- opcjonalna: bez niej strona liczy produkty i marki z bazy, a pozostałe
-- kafle po prostu się nie pokazują.

CREATE TABLE IF NOT EXISTS settings (
  key   text PRIMARY KEY,
  value text
);

INSERT INTO settings (key, value) VALUES
  ('stat_products', ''),      -- puste = liczba produktów liczona z bazy
  ('stat_brands',   ''),      -- puste = liczba marek liczona z bazy
  ('stat_delivery', '48 h'),  -- średni czas realizacji; puste = ukryj kafel
  ('stat_points',   '')       -- zaopatrywanych punktów; puste = ukryj kafel
ON CONFLICT (key) DO NOTHING;
