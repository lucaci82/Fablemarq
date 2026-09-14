import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const data = JSON.parse(await readFile(path.join(root,'data/gamebooks.json'),'utf8'));
const books = data.books || [];
const seriesI18n = {crime:'filterCrime',survive:'filterSurvive',thriller:'filterThriller',mystery:'filterMystery',horror:'filterHorror','sci-fi':'filterSciFi','real-life':'filterRealLife'};

const escapeHtml = value => String(value).replace(/[&<>"']/g,ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

function card(book,index){
  const loading = index === 0 ? '' : ' loading="lazy"';
  const i18n = seriesI18n[book.series] || '';
  return `<article class="gamebook-card gamebook-card--${book.series}" data-book data-book-slug="${book.slug}" data-series="${book.series}" id="${book.series}"><a class="gamebook-card__cover" href="${book.slug}/" data-internal aria-label="${escapeHtml(book.title)}"><img src="../assets/gamebooks/${book.cover}" alt="Copertina ${escapeHtml(book.title)} — Fablemarq Gamebooks ${escapeHtml(book.seriesLabel)}" width="${book.width}" height="${book.height}"${loading} decoding="async"></a><div class="gamebook-card__body"><span class="gamebook-card__series" data-i18n="${i18n}">${escapeHtml(book.seriesLabel)}</span><h3>${escapeHtml(book.title)}</h3><p data-book-hook>${escapeHtml(book.hook.it)}</p><span class="gamebook-card__status" data-i18n="development">In sviluppo</span><a class="gamebook-card__detail" href="${book.slug}/" data-internal data-i18n="details">Scopri il progetto</a></div></article>`;
}

function detail(book){
  const title = escapeHtml(book.title);
  const hook = escapeHtml(book.hook.it);
  const series = escapeHtml(book.seriesLabel);
  const genre = book.series === 'survive' ? 'Survival interactive thriller' : book.series === 'sci-fi' ? 'Interactive science fiction' : `Interactive ${book.series}`;
  return `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${title} — Fablemarq Gamebooks ${series}</title><meta name="description" content="${hook}"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#07090e"><link rel="canonical" href="https://fablemarq.com/gamebooks/${book.slug}/"><link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml"><link rel="preload" as="image" href="../../assets/gamebooks/${book.cover}" fetchpriority="high"><link rel="stylesheet" href="../../css/styles.css"><link rel="stylesheet" href="../../css/divisions.css"><link rel="stylesheet" href="../../css/gamebook-detail.css?v=1"><meta property="og:title" content="${title} — Fablemarq Gamebooks"><meta property="og:description" content="${hook}"><meta property="og:type" content="book"><meta property="og:url" content="https://fablemarq.com/gamebooks/${book.slug}/"><meta property="og:image" content="https://fablemarq.com/assets/gamebooks/${book.cover}"><meta property="og:site_name" content="Fablemarq"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Book',name:book.title,url:`https://fablemarq.com/gamebooks/${book.slug}/`,description:book.hook.it,genre,isPartOf:{'@type':'CollectionPage',name:'Fablemarq Gamebooks',url:'https://fablemarq.com/gamebooks/'},publisher:{'@type':'Organization',name:'Fablemarq',url:'https://fablemarq.com/'}})}</script><script src="../../js/language.js"></script><script async src="https://www.googletagmanager.com/gtag/js?id=G-5N15LT4Y34"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5N15LT4Y34',{send_page_view:true});</script></head><body class="gamebook-detail-page" data-book-slug="${book.slug}" style="--book-accent:${book.accent};--fm-signature-accent:${book.accent}"><a href="#main" class="skip-link" data-ui="skip">Salta al contenuto</a><header><div class="container nav"><a class="brand brand--reuse-title" href="../../" aria-label="Fablemarq home" data-internal><img src="../../assets/title-card.png" alt="" aria-hidden="true" width="1183" height="513" decoding="async"></a><nav aria-label="Main navigation"><a href="../../kids/" data-internal data-ui="navKids">Kids</a><a href="../" data-internal data-ui="navGamebooks">Gamebooks</a></nav><div class="site-lang-switch header-lang" aria-label="Lingua"><button type="button" data-lang="it" aria-pressed="true">IT</button><button type="button" data-lang="en" aria-pressed="false">EN</button><button type="button" data-lang="es" aria-pressed="false">ES</button></div></div></header><main id="main" class="gamebook-detail-main"><section class="gamebook-detail-hero"><div class="container gamebook-detail-grid"><div class="gamebook-detail-copy"><span class="fm-index">FM / GAMEBOOKS / ${series.toUpperCase()}</span><span class="gamebook-detail-series">Fablemarq Gamebooks · ${series}</span><h1 class="gamebook-detail-title">${title}</h1><p class="fm-hook" data-book-hook>${hook}</p><div class="gamebook-detail-meta"><span class="gamebook-detail-chip" data-ui="status">In sviluppo</span><span class="gamebook-detail-chip">${series}</span></div><div class="gamebook-detail-actions"><a class="gamebook-detail-link gamebook-detail-link--ghost" href="../#${book.series}" data-internal data-ui="back">Torna ai Gamebooks</a></div></div><div class="fm-cover-stage"><img src="../../assets/gamebooks/${book.cover}" alt="Copertina ${title} — Fablemarq Gamebooks ${series}" width="${book.width}" height="${book.height}" decoding="async" fetchpriority="high"></div></div></section><section class="gamebook-detail-body"><div class="container"><div class="gamebook-detail-panel"><div class="gamebook-detail-panel__label" data-ui="projectKicker">Il progetto</div><div><h2 data-ui="projectTitle">Questo Gamebook è in sviluppo.</h2><p data-ui="projectText">La pagina raccoglie le informazioni editoriali confermate. Sinossi estesa, anteprima e pulsante di acquisto verranno aggiunti solo quando saranno realmente disponibili.</p></div></div></div></section><section class="gamebook-related"><div class="container"><div class="gamebook-related__head"><h2 data-ui="related">Altri mondi Gamebooks</h2></div><div class="gamebook-related__rail" id="relatedBooks"></div></div></section></main><footer class="site-footer"><div class="container site-footer__row"><span class="site-footer__brand">FABLEMARQ GAMEBOOKS</span><span data-ui="footer">Fablemarq Gamebooks — A Fablemarq publishing division</span><div class="site-lang-switch" aria-label="Lingua"><button type="button" data-lang="it" aria-pressed="true">IT</button><button type="button" data-lang="en" aria-pressed="false">EN</button><button type="button" data-lang="es" aria-pressed="false">ES</button></div></div></footer><script defer src="../../js/gamebook-detail.js?v=1"></script></body></html>`;
}

function sitemap(){
  const fixed = ['', 'kids/', 'gamebooks/', 'kikimooncollection/', 'kikimooncollection/libro-1/'];
  const urls = fixed.concat(books.map(book => `gamebooks/${book.slug}/`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url>\n    <loc>https://fablemarq.com/${url}</loc>\n    <lastmod>${data.updated}</lastmod>\n  </url>`).join('\n')}\n</urlset>\n`;
}

async function verify(){
  const index = await readFile(path.join(root,'gamebooks/index.html'),'utf8');
  const map = await readFile(path.join(root,'sitemap.xml'),'utf8');
  const problems = [];
  for (const book of books){
    if (!index.includes(`data-book-slug="${book.slug}"`)) problems.push(`missing catalog card: ${book.slug}`);
    if (!index.includes(book.cover)) problems.push(`missing catalog cover: ${book.cover}`);
    if (!map.includes(`/gamebooks/${book.slug}/`)) problems.push(`missing sitemap URL: ${book.slug}`);
    try {
      const page = await readFile(path.join(root,'gamebooks',book.slug,'index.html'),'utf8');
      if (!page.includes(book.title) || !page.includes(book.cover)) problems.push(`stale detail page: ${book.slug}`);
    } catch { problems.push(`missing detail page: ${book.slug}`); }
  }
  if (problems.length){ console.error(problems.join('\n')); process.exit(1); }
  console.log(`Gamebooks source of truth validated: ${books.length} titles.`);
}

if (checkOnly){
  await verify();
} else {
  const indexPath = path.join(root,'gamebooks/index.html');
  const current = await readFile(indexPath,'utf8');
  const start = '<!-- GAMEBOOKS:START -->';
  const end = '<!-- GAMEBOOKS:END -->';
  const replacement = `${start}\n        ${books.map(card).join('\n        ')}\n        ${end}`;
  const next = current.replace(new RegExp(`${start}[\\s\\S]*?${end}`),replacement);
  await writeFile(indexPath,next);
  for (const book of books){
    const dir = path.join(root,'gamebooks',book.slug);
    await mkdir(dir,{recursive:true});
    await writeFile(path.join(dir,'index.html'),detail(book));
  }
  await writeFile(path.join(root,'sitemap.xml'),sitemap());
  console.log(`Generated ${books.length} Gamebook pages and catalog entries.`);
}
