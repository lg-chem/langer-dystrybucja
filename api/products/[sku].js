import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  const expected = `Bearer ${process.env.ADMIN_SECRET}`;
  return process.env.ADMIN_SECRET && auth === expected;
}

/* Kolumna `subcategory` dochodzi migracją 007 (uruchamianą ręcznie w Neonie).
   Zanim to nastąpi, endpoint działa jak dotąd — bez podkategorii. */
let subcatSupported = null;
async function hasSubcategory() {
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

const MIGRATION_HINT =
  'Podkategorie wymagają migracji 007_product_subcategory.sql — uruchom ją w konsoli SQL bazy Neon.';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const { sku } = req.query;
  if (!sku) return res.status(400).json({ error: 'Brak SKU w URL' });

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM products WHERE sku = ${sku}`;
      if (!rows.length) return res.status(404).json({ error: 'Nie znaleziono' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

      // Aktualizacja częściowa (PATCH-owa): zmieniamy WYŁĄCZNIE pola przysłane
      // w żądaniu. Klucza nie ma w body -> kolumna zostaje nietknięta; klucz
      // jest, ale pusty -> świadome czyszczenie pola. Dzięki temu import CSV
      // z samym `sku,image_url` podmienia zdjęcie i nie kasuje reszty danych.
      const body = req.body || {};
      const has = (k) => Object.prototype.hasOwnProperty.call(body, k);
      const withSub = await hasSubcategory();

      const current = await sql`SELECT * FROM products WHERE sku = ${sku}`;
      if (!current.length) return res.status(404).json({ error: 'Nie znaleziono' });
      const cur = current[0];

      if (has('name') && !String(body.name ?? '').trim()) {
        return res.status(400).json({ error: 'Nazwa nie może być pusta' });
      }
      if (has('subcategory') && body.subcategory && !withSub) {
        return res.status(400).json({ error: MIGRATION_HINT });
      }

      // '' i null znaczą to samo: wyczyść kolumnę (poza tagami — tam pusta lista)
      const val = (k) => {
        if (!has(k)) return cur[k];
        const v = body[k];
        return (v === '' || v === undefined) ? null : v;
      };
      const tags = has('tags')
        ? (Array.isArray(body.tags) ? body.tags : String(body.tags || '').split(/[|;]/).map(t => t.trim()).filter(Boolean))
        : (cur.tags ?? []);

      const rows = withSub
        ? await sql`
            UPDATE products SET
              name        = ${val('name')},
              brand       = ${val('brand')},
              category    = ${val('category')},
              subcategory = ${val('subcategory')},
              variant     = ${val('variant')},
              pack        = ${val('pack')},
              role        = ${val('role')},
              tags        = ${tags},
              image_url   = ${val('image_url')}
            WHERE sku = ${sku}
            RETURNING *
          `
        : await sql`
            UPDATE products SET
              name      = ${val('name')},
              brand     = ${val('brand')},
              category  = ${val('category')},
              variant   = ${val('variant')},
              pack      = ${val('pack')},
              role      = ${val('role')},
              tags      = ${tags},
              image_url = ${val('image_url')}
            WHERE sku = ${sku}
            RETURNING *
          `;
      if (!rows.length) return res.status(404).json({ error: 'Nie znaleziono' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

      const rows = await sql`DELETE FROM products WHERE sku = ${sku} RETURNING sku`;
      if (!rows.length) return res.status(404).json({ error: 'Nie znaleziono' });
      return res.status(200).json({ deleted: rows[0].sku });
    }

    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('API /products/[sku] error:', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
