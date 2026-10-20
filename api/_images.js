import { createHash } from 'node:crypto';

/* Zdjęcia produktów i logo leżą w bazie jako data URI (base64). Na stronę NIE
   wysyłamy ich w JSON-ie — 300 zdjęć po ~80 kB to kilkadziesiąt MB przy każdym
   wejściu, zanim pokaże się cokolwiek. Lista dostaje zamiast tego adres
   /api/img?…&v=<skrót>: przeglądarka ładuje zdjęcie dopiero, gdy karta jest
   na ekranie, a CDN i przeglądarka trzymają je w cache. Skrót `v` zmienia się
   razem ze zdjęciem, więc nowe zdjęcie to nowy adres — bez czekania na cache.

   Plik zaczyna się od „_", więc Vercel nie robi z niego osobnego endpointu. */

export const isDataUri = (v) => typeof v === 'string' && v.startsWith('data:');

export const imgVersion = (v) => createHash('md5').update(String(v)).digest('hex').slice(0, 12);

export const productImgUrl = (sku, v) => `/api/img?sku=${encodeURIComponent(sku)}&v=${v}`;
export const logoImgUrl = (key, v) => `/api/img?logo=${encodeURIComponent(key)}&v=${v}`;

/* Panel dostaje listę z adresami /api/img i potrafi odesłać taki adres przy
   zapisie formularza. Zapisany do bazy wskazywałby sam na siebie i zdjęcie by
   zniknęło — dlatego przy zapisie rozpoznajemy go i podstawiamy to, na co
   wskazuje. Zwraca { sku } albo { logo }, a dla innych wartości null. */
export function parseImgUrl(v) {
  if (typeof v !== 'string' || !v.startsWith('/api/img?')) return null;
  const q = new URLSearchParams(v.slice('/api/img?'.length));
  if (q.get('sku')) return { sku: q.get('sku') };
  if (q.get('logo')) return { logo: q.get('logo') };
  return null;
}

/* Wartość image_url z żądania zapisu -> to, co naprawdę trafi do bazy:
   adres /api/img?sku=… zamieniamy na zdjęcie produktu, na które wskazuje
   (zwykle ten sam produkt — wtedy zdjęcie po prostu zostaje). */
export async function resolveImageUrl(sql, value) {
  const ref = parseImgUrl(value);
  if (!ref || !ref.sku) return value;
  const rows = await sql`SELECT image_url FROM products WHERE sku = ${ref.sku}`;
  return rows.length ? rows[0].image_url : null;
}

/* data URI -> { type, body }. Tylko obrazki — nic innego nie wyjdzie z bazy
   pod tym adresem. */
export function decodeDataUri(v) {
  const m = /^data:([^;,]+)((?:;[^;,]*)*),(.*)$/s.exec(String(v || ''));
  if (!m) return null;
  const type = m[1].toLowerCase();
  if (!/^image\/(png|jpeg|jpg|gif|webp|avif|svg\+xml)$/.test(type)) return null;
  const base64 = /;base64/i.test(m[2]);
  try {
    const body = base64 ? Buffer.from(m[3], 'base64') : Buffer.from(decodeURIComponent(m[3]), 'utf8');
    return { type: type === 'image/jpg' ? 'image/jpeg' : type, body };
  } catch {
    return null;
  }
}

/* Publiczne odczyty (lista produktów, marki, kategorie, ustawienia) idą przez
   CDN Vercela: odpowiedź jest świeża przez minutę, potem przez dobę CDN oddaje
   ostatnią wersję od razu i w tle pyta bazę o nową. Dzięki temu odwiedzający
   nie czeka na wybudzenie bazy (Neon usypia się po kilku minutach ciszy).
   Panel dokleja ?fresh=1 i zawsze dostaje dane prosto z bazy. */
export function setReadCache(req, res) {
  const fresh = req.query && req.query.fresh;
  res.setHeader('Cache-Control', fresh ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=86400');
}
