-- Podkategoria produktu (np. „Piany pistoletowe" w kategorii „Piany").
-- Kategoria zostaje jak była — podkategoria to swobodny tekst zapisany przy
-- produkcie. Listę podkategorii wyliczamy z produktów: nie ma osobnej tabeli
-- do pilnowania, a import z arkusza (SKU + kategoria + podkategoria) od razu
-- zasila filtry na stronie.
--
-- Uruchom JEDNORAZOWO w konsoli SQL bazy Neon (Neon → SQL Editor).
-- Idempotentne — można puścić wielokrotnie bez szkody.
--
-- Bez tej migracji panel i strona działają jak dotąd (pole podkategorii jest
-- ukryte, a import kategorii poprosi o uruchomienie migracji).

ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory text;

-- Filtrowanie i grupowanie po parze kategoria + podkategoria.
CREATE INDEX IF NOT EXISTS products_category_subcategory_idx
  ON products (category, subcategory);
