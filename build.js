// build.js — uruchamiane przez Vercela podczas każdego deploy'a.
// Czyta wszystkie pliki w data/products/ i skleja je w jeden data/products.json,
// który strona ładuje fetch'em. Pages CMS edytuje tylko pliki w data/products/.

const fs = require('fs');
const path = require('path');

const SRC_DIR = 'data/products';
const OUT_FILE = 'data/products.json';

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.json'));

const products = files
  .map(f => JSON.parse(fs.readFileSync(path.join(SRC_DIR, f), 'utf-8')))
  .sort((a, b) => (a.sku || '').localeCompare(b.sku || '', 'pl'));

fs.writeFileSync(OUT_FILE, JSON.stringify(products, null, 2) + '\n');
console.log(`Combined ${products.length} products → ${OUT_FILE}`);
