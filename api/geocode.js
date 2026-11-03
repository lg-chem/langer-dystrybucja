/* GET /api/geocode?q=Ciechanów    -> { results: [{ name, area, postcode, lat, lon, kind }] }
   GET /api/geocode?q=06-400       -> to samo; kod pocztowy szukamy osobnym zapytaniem
   GET /api/geocode?lat=..&lon=..  -> { result: { name, area, postcode, lat, lon } }
                                      (panel: klik na mapie dowozu -> nazwa miejscowości)

   Dane: OpenStreetMap przez publiczny serwer Nominatim. Jego zasady: aplikacja
   przedstawia się w User-Agent, robi najwyżej ok. 1 zapytanie na sekundę
   i trzyma wyniki w cache. Dlatego odpowiedzi idą przez CDN Vercela na 30 dni
   — to samo zapytanie od kolejnych klientów nie trafia już do Nominatim.
   Wyszukiwarka na stronie pyta dopiero po kliknięciu „Sprawdź" (nie przy
   każdej literze). Dane © współtwórcy OpenStreetMap (ODbL). */

const BASE = 'https://nominatim.openstreetmap.org';
const UA = 'LangerDystrybucja/1.0 (mapa dowozu na stronie firmowej)';
const CACHE = 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800';

const clean = (v) => String(v ?? '').trim();

/* Wynik Nominatim -> to, czego potrzebuje strona */
function pick(x) {
  const a = x.address || {};
  const name = clean(a.city || a.town || a.village || a.hamlet || a.suburb || a.municipality || x.name || '').trim()
    || clean(x.display_name).split(',')[0];
  const area = [a.county, a.state].map(clean).filter(Boolean).join(', ');
  return {
    name,
    area,
    postcode: clean(a.postcode),
    lat: +(+x.lat).toFixed(5),
    lon: +(+x.lon).toFixed(5),
    kind: clean(x.addresstype || x.type),
  };
}

async function nominatim(path, params, req) {
  const url = `${BASE}/${path}?${new URLSearchParams({ format: 'jsonv2', addressdetails: '1', 'accept-language': 'pl', ...params })}`;
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const r = await fetch(url, { headers: { 'User-Agent': UA, ...(host ? { Referer: `https://${host}/` } : {}) } });
  if (!r.ok) throw new Error(`Nominatim ${r.status}`);
  return r.json();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { q, lat, lon } = req.query;

    // Odwrotnie: punkt na mapie -> miejscowość
    if (lat !== undefined && lon !== undefined) {
      const la = Number(lat), lo = Number(lon);
      if (!Number.isFinite(la) || !Number.isFinite(lo) || la < 48 || la > 56 || lo < 13 || lo > 25) {
        return res.status(400).json({ error: 'Współrzędne poza Polską' });
      }
      const d = await nominatim('reverse', { lat: la.toFixed(4), lon: lo.toFixed(4), zoom: '12' }, req);
      res.setHeader('Cache-Control', CACHE);
      return res.status(200).json({ result: d && d.lat ? pick(d) : null });
    }

    const term = clean(q).replace(/\s+/g, ' ').slice(0, 80);
    if (term.length < 2) return res.status(400).json({ error: 'Wpisz miejscowość albo kod pocztowy' });

    let list;
    const pc = /^(\d{2})-?(\d{3})$/.exec(term);
    if (pc) {
      list = await nominatim('search', { postalcode: `${pc[1]}-${pc[2]}`, countrycodes: 'pl', limit: '5' }, req);
    } else {
      // Najpierw same miejscowości (bez ulic i obiektów o tej nazwie), potem bez filtra
      list = await nominatim('search', { q: term, countrycodes: 'pl', limit: '8', featureType: 'settlement' }, req);
      if (!Array.isArray(list) || !list.length) list = await nominatim('search', { q: term, countrycodes: 'pl', limit: '8' }, req);
    }

    const seen = new Set();
    const results = (Array.isArray(list) ? list : []).map(pick).filter(r => {
      const key = (r.name + '|' + r.area).toLowerCase();
      if (!r.name || !Number.isFinite(r.lat) || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 6);

    res.setHeader('Cache-Control', CACHE);
    return res.status(200).json({ results });
  } catch (e) {
    console.error('API /geocode error:', e);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: 'Wyszukiwarka miejscowości chwilowo nie odpowiada' });
  }
}
