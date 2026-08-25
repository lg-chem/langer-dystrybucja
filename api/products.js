import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  const expected = `Bearer ${process.env.ADMIN_SECRET}`;
  return process.env.ADMIN_SECRET && auth === expected;
}

/* Kolumna `subcategory` dochodzi migracją 007 — a migracje uruchamiamy ręcznie
   w Neonie. Dopóki jej nie ma, API ma działać jak dotąd (bez podkategorii),
   zamiast wywalać się na każdym zapytaniu. Wynik zapamiętujemy w instancji
   funkcji, żeby nie odpytywać information_schema przy każdym żądaniu. */
let subcatSupported = null;
export async function hasSubcategory() {
  if (subcatSupported !== null) return subcatSupported;
  try {
    const rows = await sql`
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'subcategory'
        AND table_schema = current_schema()
    `;
    subcatSupported = rows.length > 0;
  } catch {
    subcatSupported = false;
  }
  return subcatSupported;
}

export const MIGRATION_HINT =
  'Podkategorie wymagają migracji 007_product_subcategory.sql — uruchom ją w konsoli SQL bazy Neon.';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    const withSub = await hasSubcategory();

    if (req.method === 'GET') {
      const products = withSub
        ? await sql`
            SELECT sku, name, brand, category, subcategory, variant, pack, role, tags, image_url
            FROM products
            ORDER BY brand, name
          `
        : await sql`
            SELECT sku, name, brand, category, variant, pack, role, tags, image_url
            FROM products
            ORDER BY brand, name
          `;
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

      const body = req.body || {};
      const { sku, name, brand, category, subcategory, variant, pack, role, tags, image_url } = body;
      if (!sku || !name) {
        return res.status(400).json({ error: 'Brak wymaganych pól: sku, name' });
      }
      if (subcategory && !withSub) {
        return res.status(400).json({ error: MIGRATION_HINT });
      }

      const result = withSub
        ? await sql`
            INSERT INTO products (sku, name, brand, category, subcategory, variant, pack, role, tags, image_url)
            VALUES (${sku}, ${name}, ${brand || null}, ${category || null}, ${subcategory || null},
                    ${variant || null}, ${pack || null},
                    ${role || 'neutral'}, ${tags || []}, ${image_url || null})
            ON CONFLICT (sku) DO UPDATE SET
              name = EXCLUDED.name,
              brand = EXCLUDED.brand,
              category = EXCLUDED.category,
              subcategory = EXCLUDED.subcategory,
              variant = EXCLUDED.variant,
              pack = EXCLUDED.pack,
              role = EXCLUDED.role,
              tags = EXCLUDED.tags,
              image_url = EXCLUDED.image_url
            RETURNING *
          `
        : await sql`
            INSERT INTO products (sku, name, brand, category, variant, pack, role, tags, image_url)
            VALUES (${sku}, ${name}, ${brand || null}, ${category || null}, ${variant || null}, ${pack || null},
                    ${role || 'neutral'}, ${tags || []}, ${image_url || null})
            ON CONFLICT (sku) DO UPDATE SET
              name = EXCLUDED.name,
              brand = EXCLUDED.brand,
              category = EXCLUDED.category,
              variant = EXCLUDED.variant,
              pack = EXCLUDED.pack,
              role = EXCLUDED.role,
              tags = EXCLUDED.tags,
              image_url = EXCLUDED.image_url
            RETURNING *
          `;
      return res.status(200).json(result[0]);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('API /products error:', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
