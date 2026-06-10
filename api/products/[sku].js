import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  const expected = `Bearer ${process.env.ADMIN_SECRET}`;
  return process.env.ADMIN_SECRET && auth === expected;
}

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

      const body = req.body || {};
      const { name, brand, category, variant, pack, role, tags, image_url } = body;
      const rows = await sql`
        UPDATE products SET
          name = COALESCE(${name}, name),
          brand = COALESCE(${brand}, brand),
          category = COALESCE(${category}, category),
          variant = ${variant ?? null},
          pack = ${pack ?? null},
          role = COALESCE(${role}, role),
          tags = ${tags ?? null},
          image_url = ${image_url ?? null}
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
