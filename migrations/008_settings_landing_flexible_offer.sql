-- Podstrona /dla-punktow/ bez sztywnego progu kartonów („bierzesz Langera —
-- zyskujesz") i z pełnym kontaktem edytowanym z panelu (Ustawienia →
-- „Oferta dla punktów handlowych"). Ta sama tabela klucz–wartość co
-- migracje 004–006 — schemat się nie zmienia.
--
-- Uruchom JEDNORAZOWO w konsoli SQL bazy Neon (Neon → SQL Editor).
-- Idempotentne — można puścić wielokrotnie bez szkody. Migracja jest
-- opcjonalna: bez niej strona działa na wartościach domyślnych z
-- api/settings.js, a pierwszy zapis karty w panelu i tak utworzy wiersze.

CREATE TABLE IF NOT EXISTS settings (
  key   text PRIMARY KEY,
  value text
);

INSERT INTO settings (key, value) VALUES
  ('landing_discount_text', 'kilka procent'), -- „nawet … taniej" na pozostałe marki
  ('landing_email',         ''),              -- puste = contact_email
  ('landing_person',        ''),              -- puste = nie pokazujemy
  ('landing_hours',         '')               -- puste = nie pokazujemy
ON CONFLICT (key) DO NOTHING;

-- Klucze starej wersji oferty (próg kartonów, rabat w %, próg pistoletu)
-- nie są już nigdzie czytane. Zostawienie ich niczego nie psuje; jeśli
-- chcesz posprzątać, odkomentuj:
-- DELETE FROM settings WHERE key IN ('landing_cartons', 'landing_discount_pct', 'landing_pistol_cartons');
