import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Fallback, gdy tabela `settings` jeszcze nie istnieje (przed migracją 004).
// Te same wartości są zaszyte w /dla-punktow/index.html — strona działa
// poprawnie także wtedy, gdy API jest niedostępne.
const DEFAULTS = {
  landing_cartons:        '10',
  landing_discount_pct:   '15',
  landing_pistol_cartons: '5',
  landing_pistol_price:   '1',
  landing_phone:          '+48 000 000 000',
};

// Klucze, które wolno zapisywać — chroni przed zaśmieceniem tabeli
// przypadkowym polem z formularza.
const ALLOWED = Object.keys(DEFAULTS);

function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  return process.env.ADMIN_SECRET && auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

async function list() {
  const rows = await sql`SELECT key, value FROM settings`;
  // Brakujące klucze uzupełniamy domyślnymi — strona zawsze dostaje komplet
  return rows.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), { ...DEFAULTS });
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

      const body = req.body || {};
      const entries = Object.entries(body).filter(([k]) => ALLOWED.includes(k));
      if (!entries.length) {
        return res.status(400).json({ error: 'Brak znanych ustawień do zapisania' });
      }

      for (const [key, value] of entries) {
        await sql`
          INSERT INTO settings (key, value)
          VALUES (${key}, ${String(value ?? '')})
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        `;
      }
      return res.status(200).json(await list());
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('API /settings error:', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
