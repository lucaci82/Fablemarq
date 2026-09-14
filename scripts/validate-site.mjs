import { readdir, readFile, stat, access } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const ignore = new Set(['.git','node_modules']);
const files = [];
async function walk(dir){
  for (const name of await readdir(dir)){
    if (ignore.has(name)) continue;
    const full = path.join(dir,name);
    const info = await stat(full);
    if (info.isDirectory()) await walk(full); else files.push(full);
  }
}
await walk(root);

const errors = [];
const rel = file => path.relative(root,file).replaceAll('\\','/');
const htmlFiles = files.filter(file => file.endsWith('.html'));
const jsFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.mjs'));

for (const file of jsFiles){
  const result = spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if (result.status !== 0) errors.push(`${rel(file)}: JavaScript syntax error\n${result.stderr.trim()}`);
}

for (const file of htmlFiles){
  const html = await readFile(file,'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const duplicates = ids.filter((id,index) => ids.indexOf(id) !== index);
  if (duplicates.length) errors.push(`${rel(file)}: duplicate id(s): ${[...new Set(duplicates)].join(', ')}`);
  if (!/<main\b/i.test(html)) errors.push(`${rel(file)}: missing <main>`);
  if (!/<h1\b/i.test(html)) errors.push(`${rel(file)}: missing <h1>`);
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)){
    if (!/rel="[^"]*noopener/i.test(match[0])) errors.push(`${rel(file)}: target=_blank without noopener`);
  }
  if (/role="toolbar"[^>]*gamebook/i.test(html) || /class="gamebook-filters"[^>]*role="toolbar"/i.test(html)) errors.push(`${rel(file)}: Gamebook filters must not use toolbar semantics`);
  if (/award-readers|award-storytelling|award-illustrated/i.test(html)) errors.push(`${rel(file)}: obsolete unverified award asset referenced`);
}

const data = JSON.parse(await readFile(path.join(root,'data/gamebooks.json'),'utf8'));
const seenSlugs = new Set();
for (const book of data.books || []){
  for (const key of ['slug','title','series','seriesLabel','cover','width','height','accent','hook']){
    if (book[key] === undefined || book[key] === null || book[key] === '') errors.push(`data/gamebooks.json: ${book.slug || book.title || 'book'} missing ${key}`);
  }
  if (seenSlugs.has(book.slug)) errors.push(`data/gamebooks.json: duplicate slug ${book.slug}`);
  seenSlugs.add(book.slug);
  for (const lang of ['it','en','es']) if (!book.hook?.[lang]) errors.push(`data/gamebooks.json: ${book.slug} missing ${lang} hook`);
  try { await access(path.join(root,'assets/gamebooks',book.cover)); } catch { errors.push(`data/gamebooks.json: missing cover ${book.cover}`); }
  try { await access(path.join(root,'gamebooks',book.slug,'index.html')); } catch { errors.push(`data/gamebooks.json: missing detail page ${book.slug}`); }
}

if (errors.length){
  console.error(`Site validation failed with ${errors.length} issue(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Site validation passed: ${htmlFiles.length} HTML files, ${jsFiles.length} JS files, ${data.books.length} Gamebooks.`);
