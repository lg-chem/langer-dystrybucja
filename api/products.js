import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  const expected = `Bearer ${process.env.ADMIN_SECRET}`;
  return process.env.ADMIN_SECRET && auth === expected;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const products = await sql`
        SELECT sku, name, brand, category, variant, pack, role, tags, image_url
        FROM products
        ORDER BY brand, name
      `;
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

      const body = req.body || {};
      const { sku, name, brand, category, variant, pack, role, tags, image_url } = body;
      if (!sku || !name || !brand || !category) {
        return res.status(400).json({ error: 'Brak wymaganych pól: sku, name, brand, category' });
      }

      const result = await sql`
        INSERT INTO products (sku, name, brand, category, variant, pack, role, tags, image_url)
        VALUES (${sku}, ${name}, ${brand}, ${category}, ${variant || null}, ${pack || null},
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
