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

  // Dane kontaktowe strony głównej — panel → Ustawienia → „Dane kontaktowe".
  // Podmieniają się globalnie: sekcja „Kontakt" i stopka.
  contact_phone:  '+48 000 000 000',
  contact_email:  'biuro@langerdystrybucja.pl',
  contact_street: 'ul. Przykładowa 00',
  contact_city:   '00-000 Miasto',
  contact_company:'Langer Dystrybucja',

  // Liczby w hero strony głównej. Produkty i marki puste = liczymy je z bazy
  // (zawsze zgodne z realną ofertą). Pozostałe puste = kafel się nie pokazuje —
  // lepiej nie pokazać liczby, niż pokazać wymyśloną.
  stat_products: '',
  stat_brands:   '',
  stat_delivery: '48 h',
  stat_points:   '',

  // Identyfikacja wizualna — panel → Ustawienia → „Logo i kolory marki".
  // Puste logo = strona rysuje wbudowany sygnet SVG (jak dotąd).
  logo_light:     '',   // wersja na CIEMNE tło (header na górze, stopka)
  logo_dark:      '',   // wersja na JASNE tło (header po przewinięciu)
  logo_mark:      '',   // sam sygnet (kwadrat) — znak wodny w hero
  logo_height:    '38', // wysokość logo w headerze, px
  logo_show_text: '1',  // '1' = pokaż napis LANGER / DYSTRYBUCJA obok znaku
  brand_accent:   '#F04E23', // kolor akcentu (--flame) — przyciski, odznaki
};

// Klucze, które wolno zapisywać — chroni przed zaśmieceniem tabeli
// przypadkowym polem z formularza.
const ALLOWED = Object.keys(DEFAULTS);

// Logo trafia do bazy jako data URI (base64) — tak samo jak zdjęcia produktów.
// Limit chroni bazę i czas ładowania strony: panel i tak zmniejsza plik przed
// wysyłką, więc realne logo mieści się w kilkudziesięciu kB.
const MAX_VALUE_LEN = 800_000;

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

      const tooBig = entries.find(([, v]) => String(v ?? '').length > MAX_VALUE_LEN);
      if (tooBig) {
        return res.status(413).json({
          error: `Plik „${tooBig[0]}" jest za duży (limit ${Math.round(MAX_VALUE_LEN / 1000)} kB). Wgraj mniejszy albo w formacie SVG.`,
        });
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
