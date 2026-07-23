-- Zdjęcia wgrywane ręcznie z dysku są zapisywane w bazie jako data URI
-- (base64) w kolumnie image_url — a taki ciąg bywa długi (dziesiątki kB).
-- Upewniamy się, że kolumna to TEXT (bez limitu długości), a nie VARCHAR(n).
--
-- Uruchom JEDNORAZOWO w konsoli SQL bazy Neon (Neon → SQL Editor).
-- Idempotentne — można puścić wielokrotnie bez szkody.

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE products ALTER COLUMN image_url TYPE text;
