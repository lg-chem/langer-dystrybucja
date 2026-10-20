/* Build dla Vercela: kopiuje stronę do dist/ i przy okazji usuwa z niej to,
   co najbardziej spowalniało start.

   • JSX kompilujemy tutaj, a nie w przeglądarce. Babel Standalone to ~3 MB
     skryptu, który każdy odwiedzający musiał pobrać i uruchomić, a potem
     jeszcze przetłumaczyć cały kod strony — do tego czasu ekran był biały.
   • React podajemy z własnej domeny (/vendor/), zamiast z unpkg.com — bez
     dodatkowego połączenia z obcym serwerem, z cache na rok.

   Pliki źródłowe w repo się nie zmieniają: dalej mają <script type="text/babel">
   i działają otwarte prosto z dysku. Edytujesz je jak dotąd.

   Uruchomienie lokalne: `npm run build` -> gotowa strona w dist/. */

import { transform } from 'esbuild';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'dist');

// Czego nie publikujemy: narzędzia, konfiguracja, migracje SQL, funkcje API
// (te Vercel i tak bierze z katalogu api/, niezależnie od dist/).
const SKIP = new Set([
  '.git', '.github', 'node_modules', 'dist', 'api', 'migrations',
  'package.json', 'package-lock.json', 'build.mjs', 'vercel.json',
  '.gitignore', '.pages.yml', '.vercelignore', 'README.md',
]);

// React z node_modules, w wersji przypiętej w package.json. Adres w HTML musi
// wskazywać tę samą wersję — inaczej build się zatrzyma, zamiast po cichu
// podmienić Reacta na inny.
const REACT_VERSION = require('react/package.json').version;
const pkgFile = (pkg, file) => path.join(path.dirname(require.resolve(`${pkg}/package.json`)), file);
const VENDOR = {
  [`https://unpkg.com/react@${REACT_VERSION}/umd/react.production.min.js`]:
    { file: pkgFile('react', 'umd/react.production.min.js'), name: `react-${REACT_VERSION}.min.js` },
  [`https://unpkg.com/react-dom@${REACT_VERSION}/umd/react-dom.production.min.js`]:
    { file: pkgFile('react-dom', 'umd/react-dom.production.min.js'), name: `react-dom-${REACT_VERSION}.min.js` },
};

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await htmlFiles(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

async function compileJsx(code, where) {
  try {
    const r = await transform(code, {
      loader: 'jsx',
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      minify: true,
      target: 'es2018',
      charset: 'utf8',
    });
    // Skrypt ląduje w HTML-u: „</script" w napisie zamknąłby znacznik.
    return r.code.replace(/<\/script/gi, '<\\/script');
  } catch (e) {
    throw new Error(`Błąd kompilacji JSX w ${where}:\n${e.message}`);
  }
}

async function buildHtml(file) {
  const rel = path.relative(OUT, file);
  let html = await readFile(file, 'utf8');
  const usedVendor = new Set();

  // 1. <script type="text/babel"> -> zwykły <script> ze skompilowanym kodem
  const blocks = [...html.matchAll(/<script type="text\/babel">([\s\S]*?)<\/script>/g)];
  for (const [whole, code] of blocks) {
    const js = await compileJsx(code, rel);
    html = html.replace(whole, () => `<script>${js}</script>`);
  }

  // 2. Babel w przeglądarce nie jest już potrzebny
  html = html.replace(/[ \t]*<script[^>]*src="https:\/\/unpkg\.com\/@babel\/standalone@[^"]*"[^>]*><\/script>\n?/g, '');

  // 3. React z unpkg -> /vendor/
  html = html.replace(/<script([^>]*)src="(https:\/\/unpkg\.com\/react(?:-dom)?@[^"]+)"([^>]*)><\/script>/g, (tag, a, src, b) => {
    const v = VENDOR[src];
    if (!v) throw new Error(`${rel}: ${src} — w node_modules jest React ${REACT_VERSION}. Ujednolić wersję w HTML i package.json.`);
    usedVendor.add(v);
    return `<script${a}src="/vendor/${v.name}"${b}></script>`;
  });

  if (/type="text\/babel"/.test(html) || /@babel\/standalone/.test(html)) {
    throw new Error(`${rel}: został nieskompilowany JSX albo odwołanie do Babela.`);
  }
  await writeFile(file, html);
  return { rel, blocks: blocks.length, usedVendor };
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT);
for (const e of await readdir(ROOT)) {
  if (SKIP.has(e)) continue;
  await cp(path.join(ROOT, e), path.join(OUT, e), { recursive: true });
}

const vendor = new Set();
for (const file of await htmlFiles(OUT)) {
  const { rel, blocks, usedVendor } = await buildHtml(file);
  usedVendor.forEach(v => vendor.add(v));
  if (blocks) console.log(`✓ ${rel}: skompilowano JSX (${blocks})`);
}

await mkdir(path.join(OUT, 'vendor'), { recursive: true });
for (const v of vendor) {
  await cp(v.file, path.join(OUT, 'vendor', v.name));
  console.log(`✓ vendor/${v.name}`);
}
