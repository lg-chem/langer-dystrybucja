import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Fallback, gdy tabela `brands` jeszcze nie istnieje (przed migracją 002)
const DEFAULTS = ['Soudal', 'Tytan', 'Penosil', 'Langer', 'Den Braven', 'Ofo', 'Champion'];

function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  return process.env.ADMIN_SECRET && auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

async function list() {
  const rows = await sql`SELECT name FROM brands ORDER BY sort, name`;
  return rows.map(r => r.name);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      try {
        return res.status(200).json(await list());
      } catch (e) {
        // tabela nie istnieje / brak migracji — oddaj wartości domyślne
        return res.status(200).json(DEFAULTS);
      }
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const name = String((req.body && req.body.name) || '').trim();
      if (!name) return res.status(400).json({ error: 'Brak nazwy marki' });
      await sql`INSERT INTO brands (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING`;
      return res.status(200).json(await list());
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const name = String(req.query.name || '').trim();
      if (!name) return res.status(400).json({ error: 'Brak nazwy marki' });
      await sql`DELETE FROM brands WHERE name = ${name}`;
      return res.status(200).json(await list());
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('API /brands error:', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
