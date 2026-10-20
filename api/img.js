import { neon } from '@neondatabase/serverless';
import { decodeDataUri, isDataUri } from './_images.js';

const sql = neon(process.env.DATABASE_URL);

// Logo, które wolno wydać pod tym adresem — reszta ustawień to nie obrazki.
const LOGO_KEYS = ['logo_light', 'logo_dark', 'logo_mark'];

/* GET /api/img?sku=…&v=…   zdjęcie produktu z bazy
   GET /api/img?logo=…&v=…  logo z ustawień
   Adresy buduje lista produktów / ustawień (patrz _images.js). `v` to skrót
   zawartości: przy nowym zdjęciu zmienia się adres, więc dany adres można
   trzymać w cache bezterminowo. */
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sku, logo, v } = req.query;
  try {
    let value = null;
    if (sku) {
      const rows = await sql`SELECT image_url FROM products WHERE sku = ${String(sku)}`;
      value = rows.length ? rows[0].image_url : null;
    } else if (logo && LOGO_KEYS.includes(String(logo))) {
      const rows = await sql`SELECT value FROM settings WHERE key = ${String(logo)}`;
      value = rows.length ? rows[0].value : null;
    }

    // Zdjęcie podane w panelu jako zwykły adres — odsyłamy tam.
    if (value && /^https?:\/\//i.test(value)) {
      res.setHeader('Cache-Control', 'public, s-maxage=300');
      return res.redirect(302, value);
    }

    const img = isDataUri(value) ? decodeDataUri(value) : null;
    if (!img) {
      res.setHeader('Cache-Control', 'public, s-maxage=60');
      return res.status(404).json({ error: 'Brak zdjęcia' });
    }

    res.setHeader('Content-Type', img.type);
    res.setHeader('Content-Length', img.body.length);
    res.setHeader('Cache-Control', v
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=300, s-maxage=300');
    // SVG potrafi zawierać skrypty — otwarty bezpośrednio nie może ich uruchomić.
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; img-src data:");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(img.body);
  } catch (e) {
    console.error('API /img error:', e);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
