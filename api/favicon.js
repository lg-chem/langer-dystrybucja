import { neon } from '@neondatabase/serverless';
import { decodeDataUri, isDataUri } from './_images.js';

const sql = neon(process.env.DATABASE_URL);

/* GET /api/favicon — ikona w karcie przeglądarki, zakładkach i na ekranie
   telefonu. Jeden stały adres dla wszystkich stron (HTML ma go wpisanego na
   sztywno, więc widzą go też wyszukiwarki), a /favicon.ico prowadzi tutaj
   przez rewrite w vercel.json.

   Kolejność: favicon wgrany w panelu → sygnet wgrany w panelu → wbudowany
   sygnet Langera w kolorze akcentu z panelu. Strona nigdy nie zostaje bez
   ikony, nawet gdy baza nie odpowiada. */

const DEFAULT_ACCENT = '#F04E23';

// Ten sam znak co LangerMark na stronie, na granatowym kwadracie — czytelny
// w 16 px na jasnym i ciemnym pasku kart.
function builtInSvg(accent) {
  const fill = /^#[\da-f]{6}$/i.test(String(accent || '').trim()) ? accent.trim() : DEFAULT_ACCENT;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">`
    + `<rect width="64" height="64" rx="14" fill="#0E1533"/>`
    + `<g transform="translate(32 32) scale(.8) translate(-34 -33)">`
    + `<rect x="13" y="7" width="11" height="35" rx="5.5" fill="#fff"/>`
    + `<rect x="18.5" y="38" width="6" height="10" rx="3" fill="#fff"/>`
    + `<rect x="13" y="46" width="42" height="13" rx="6.5" fill="${fill}"/>`
    + `</g></svg>`;
}

function sendSvg(res, svg, cache) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', cache);
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; img-src data:");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(200).send(svg);
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Przeglądarka trzyma ikonę 10 minut, CDN minutę (potem oddaje ostatnią
  // wersję i w tle pyta bazę) — zmiana z panelu dochodzi w kilka minut.
  const CACHE = 'public, max-age=600, s-maxage=60, stale-while-revalidate=86400';

  let values = {};
  try {
    const rows = await sql`SELECT key, value FROM settings WHERE key IN ('favicon', 'logo_mark', 'brand_accent')`;
    values = Object.fromEntries(rows.map(r => [r.key, r.value]));
  } catch (e) {
    // brak tabeli / bazy — wbudowany znak, bez długiego cache
    return sendSvg(res, builtInSvg(DEFAULT_ACCENT), 'public, max-age=300');
  }

  const src = [values.favicon, values.logo_mark].find(v => v && String(v).trim());

  if (src && /^https?:\/\//i.test(src)) {
    res.setHeader('Cache-Control', CACHE);
    return res.redirect(302, src);
  }

  const img = isDataUri(src) ? decodeDataUri(src) : null;
  if (!img) return sendSvg(res, builtInSvg(values.brand_accent), CACHE);

  res.setHeader('Content-Type', img.type);
  res.setHeader('Content-Length', img.body.length);
  res.setHeader('Cache-Control', CACHE);
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; img-src data:");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(200).send(img.body);
}
