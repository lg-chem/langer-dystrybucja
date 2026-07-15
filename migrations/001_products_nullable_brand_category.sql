-- Marka i kategoria stają się opcjonalne — można je uzupełnić później,
-- np. po zaimportowaniu produktów z eksportu sprzedaży (tylko SKU + nazwa).
--
-- Uruchom jednorazowo w konsoli SQL bazy Neon (Neon → SQL Editor),
-- albo przez psql połączony pod DATABASE_URL.
--
-- Jeśli kolumny już dopuszczają NULL, te polecenia nic nie zepsują.

ALTER TABLE products ALTER COLUMN brand    DROP NOT NULL;
ALTER TABLE products ALTER COLUMN category DROP NOT NULL;
