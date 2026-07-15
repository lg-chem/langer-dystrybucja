import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Fallback, gdy tabela `categories` jeszcze nie istnieje (przed migracją 002)
const DEFAULTS = [
  { id: 'piany',     label: 'Piany montażowe', blurb: 'Niskoprężne, pistoletowe, wężykowe, zimowe i ogniochronne.', icon: 'piany' },
  { id: 'silikony',  label: 'Silikony',        blurb: 'Sanitarne, uniwersalne, budowlane i wysokotemperaturowe.',   icon: 'silikony' },
  { id: 'akryle',    label: 'Akryle',          blurb: 'Malarskie, elastyczne i dekarskie — gotowe pod malowanie.',  icon: 'akryle' },
  { id: 'kleje',     label: 'Kleje',           blurb: 'Montażowe, hybrydowe i poliuretanowe — mocne łączenie.',     icon: 'kleje' },
  { id: 'akcesoria', label: 'Akcesoria',       blurb: 'Pistolety, czyściki, taśmy i wszystko wokół chemii.',        icon: 'akcesoria' },
];

function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  return process.env.ADMIN_SECRET && auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

async function list() {
  return await sql`SELECT id, label, blurb, icon FROM categories ORDER BY sort, label`;
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
      const b = req.body || {};
      const id = String(b.id || '').trim().toLowerCase();
      const label = String(b.label || '').trim();
      if (!id || !label) return res.status(400).json({ error: 'Wymagane: id oraz nazwa (label)' });
      await sql`
        INSERT INTO categories (id, label, blurb, icon)
        VALUES (${id}, ${label}, ${b.blurb || null}, ${b.icon || null})
        ON CONFLICT (id) DO UPDATE SET
          label = EXCLUDED.label,
          blurb = COALESCE(EXCLUDED.blurb, categories.blurb),
          icon  = COALESCE(EXCLUDED.icon, categories.icon)
      `;
      return res.status(200).json(await list());
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const id = String(req.query.id || '').trim().toLowerCase();
      if (!id) return res.status(400).json({ error: 'Brak id kategorii' });
      await sql`DELETE FROM categories WHERE id = ${id}`;
      return res.status(200).json(await list());
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('API /categories error:', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
