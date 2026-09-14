(() => {
  'use strict';

  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const INTERNAL_SRC = new Set(['site','home','kids','gamebooks','collection','book','preview','hero','grid','b1','b2','b3']);
  const I18N = {
    it:{
      pageTitle:'Fablemarq Gamebooks — Le tue scelte cambiano la storia',
      description:'Fablemarq Gamebooks: Crime, Survive, Thriller, Mystery, Horror, Sci-Fi e Real Life. Libri-game per adulti basati sulle tue decisioni.',
      ogDescription:'Non leggi soltanto la storia. Decidi cosa succede.',
      skip:'Salta al contenuto',navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Gamebooks',
      heroA:'Non leggi soltanto la storia.',heroB:'Decidi cosa succede.',heroLead:'Thriller interattivi per adulti. Niente dadi, niente schede personaggio: solo decisioni, conseguenze e strade che cambiano.',
      p1:'Niente dadi',p2:'Niente schede',p3:'Solo decisioni e conseguenze',browseCta:'Esplora il catalogo',howCta:'Come funziona',
      catalogKicker:'Catalogo',catalogTitle:'Scegli la tensione',catalogIntro:'Seleziona una serie oppure cerca un titolo: il catalogo si aggiorna immediatamente.',
      searchLabel:'Cerca nel catalogo Gamebooks',searchPlaceholder:'Cerca titolo, serie o atmosfera',filtersLabel:'Filtra Gamebooks per serie',
      filterAll:'Tutti',filterCrime:'Crime',filterSurvive:'Survive',filterThriller:'Thriller',filterMystery:'Mystery',filterHorror:'Horror',filterSciFi:'Sci-Fi',filterRealLife:'Real Life',
      development:'In sviluppo',coming:'Prossimamente',details:'Scopri il progetto',
      noResultsTitle:'Nessun titolo trovato',noResultsText:"Prova un'altra parola oppure torna a Tutti.",
      howKicker:'Il formato',howTitle:'Leggi. Scegli. Affronta le conseguenze.',h1:'Leggi la situazione',h1p:'Ogni scena ti mette davanti a informazioni, persone e rischi concreti.',h2:'Prendi una decisione',h2p:'Nessun tiro di dado decide per te. La scelta è tua.',h3:'Vivi il risultato',h3p:'La storia cambia in base a ciò che fai, ciò che ignori e ciò che rischi.',
      note:'I titoli Gamebooks mostrati qui sono in sviluppo. I pulsanti di acquisto compariranno solo quando un libro sarà realmente disponibile.',footer:'Fablemarq Gamebooks — A Fablemarq publishing division',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq Gamebooks — Your choices change the story',
      description:'Fablemarq Gamebooks: Crime, Survive, Thriller, Mystery, Horror, Sci-Fi and Real Life. Interactive books for adults driven by your decisions.',
      ogDescription:"You don't just read the story. You decide what happens.",
      skip:'Skip to content',navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Gamebooks',
      heroA:"You don't just read the story.",heroB:'You decide what happens.',heroLead:'Interactive thrillers for adults. No dice, no character sheets: just decisions, consequences and paths that change.',
      p1:'No dice',p2:'No character sheets',p3:'Just decisions and consequences',browseCta:'Explore the catalog',howCta:'How it works',
      catalogKicker:'Catalog',catalogTitle:'Choose the tension',catalogIntro:'Choose a series or search for a title: the catalog updates instantly.',
      searchLabel:'Search the Gamebooks catalog',searchPlaceholder:'Search title, series or mood',filtersLabel:'Filter Gamebooks by series',
      filterAll:'All',filterCrime:'Crime',filterSurvive:'Survive',filterThriller:'Thriller',filterMystery:'Mystery',filterHorror:'Horror',filterSciFi:'Sci-Fi',filterRealLife:'Real Life',
      development:'In development',coming:'Coming soon',details:'Explore the project',
      noResultsTitle:'No titles found',noResultsText:'Try another word or return to All.',
      howKicker:'The format',howTitle:'Read. Choose. Face the consequences.',h1:'Read the situation',h1p:'Every scene gives you information, people and concrete risks to judge.',h2:'Make a decision',h2p:'No dice roll decides for you. The choice is yours.',h3:'Live with the result',h3p:'The story changes according to what you do, ignore and risk.',
      note:'The Gamebooks shown here are in development. Buy buttons will appear only when a title is actually available.',footer:'Fablemarq Gamebooks — A Fablemarq publishing division',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq Gamebooks — Tus decisiones cambian la historia',
      description:'Fablemarq Gamebooks: Crime, Survive, Thriller, Mystery, Horror, Sci-Fi y Real Life. Libros interactivos para adultos guiados por tus decisiones.',
      ogDescription:'No solo lees la historia. Decides lo que sucede.',
      skip:'Saltar al contenido',navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Gamebooks',
      heroA:'No solo lees la historia.',heroB:'Decides lo que sucede.',heroLead:'Thrillers interactivos para adultos. Sin dados ni fichas de personaje: solo decisiones, consecuencias y caminos que cambian.',
      p1:'Sin dados',p2:'Sin fichas',p3:'Solo decisiones y consecuencias',browseCta:'Explora el catálogo',howCta:'Cómo funciona',
      catalogKicker:'Catálogo',catalogTitle:'Elige la tensión',catalogIntro:'Elige una serie o busca un título: el catálogo se actualiza al instante.',
      searchLabel:'Buscar en el catálogo Gamebooks',searchPlaceholder:'Busca título, serie o atmósfera',filtersLabel:'Filtrar Gamebooks por serie',
      filterAll:'Todos',filterCrime:'Crime',filterSurvive:'Survive',filterThriller:'Thriller',filterMystery:'Mystery',filterHorror:'Horror',filterSciFi:'Sci-Fi',filterRealLife:'Real Life',
      development:'En desarrollo',coming:'Próximamente',details:'Descubre el proyecto',
      noResultsTitle:'No se encontraron títulos',noResultsText:'Prueba otra palabra o vuelve a Todos.',
      howKicker:'El formato',howTitle:'Lee. Elige. Afronta las consecuencias.',h1:'Lee la situación',h1p:'Cada escena te da información, personas y riesgos concretos que valorar.',h2:'Toma una decisión',h2p:'Ningún dado decide por ti. La elección es tuya.',h3:'Vive el resultado',h3p:'La historia cambia según lo que haces, ignoras y arriesgas.',
      note:'Los Gamebooks mostrados aquí están en desarrollo. Los botones de compra aparecerán solo cuando un título esté realmente disponible.',footer:'Fablemarq Gamebooks — A Fablemarq publishing division',language:'Idioma'
    }
  };

  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };
  const params = () => new URLSearchParams(location.search);
  let lang = normLang(window.PREFERRED_LANG || params().get('lang') || localStorage.getItem('fm_lang') || localStorage.getItem('lang') || navigator.language || 'en');
  let catalog = [];

  function initAttribution(){
    const q = params();
    const raw = (q.get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) localStorage.setItem('fm_src',raw);
    UTM_KEYS.forEach(key => { const value = q.get(key); if (value) sessionStorage.setItem(key,value); });
  }
  function trafficSource(){
    const raw = (params().get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) return raw;
    return localStorage.getItem('fm_src') || 'site';
  }
  function track(name,extra){
    const ctx = {page_path:location.pathname,lang,division:'gamebooks',src:trafficSource()};
    UTM_KEYS.forEach(key => { const value = params().get(key) || sessionStorage.getItem(key); if (value) ctx[key] = value; });
    try { window.gtag && window.gtag('event',name,Object.assign(ctx,extra || {})); } catch (_) {}
  }

  function renderBooks(){
    if (!catalog.length) return;
    document.querySelectorAll('[data-book-slug]').forEach(card => {
      const item = catalog.find(book => book.slug === card.dataset.bookSlug);
      if (!item) return;
      const hook = card.querySelector('[data-book-hook]');
      if (hook) hook.textContent = item.hook[lang] || item.hook.en || item.hook.it;
    });
  }

  function render(){
    const t = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    localStorage.setItem('lang',lang);
    document.title = t.pageTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t.description;
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = t.ogDescription;
    const skip = document.querySelector('.skip-link');
    if (skip) skip.textContent = t.skip;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(t,key)) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (Object.prototype.hasOwnProperty.call(t,key)) el.setAttribute('placeholder',t[key]);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.dataset.i18nAriaLabel;
      if (Object.prototype.hasOwnProperty.call(t,key)) el.setAttribute('aria-label',t[key]);
    });
    renderBooks();

    const source = trafficSource();
    document.querySelectorAll('[data-internal]').forEach(el => {
      const raw = el.dataset.baseHref || el.getAttribute('href');
      if (!el.dataset.baseHref) el.dataset.baseHref = raw;
      const url = new URL(raw,location.href);
      url.searchParams.set('lang',lang);
      if (source !== 'site') url.searchParams.set('src',source);
      el.href = url.pathname + '?' + url.searchParams.toString() + url.hash;
    });

    document.querySelectorAll('.site-lang-switch button[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
    document.querySelectorAll('.site-lang-switch').forEach(el => el.setAttribute('aria-label',t.language));
  }

  async function loadCatalog(){
    try {
      const response = await fetch('../data/gamebooks.json',{cache:'no-cache'});
      if (!response.ok) throw new Error('catalog');
      const data = await response.json();
      catalog = Array.isArray(data.books) ? data.books : [];
      renderBooks();
    } catch (_) {}
  }

  document.addEventListener('click',event => {
    const button = event.target.closest('.site-lang-switch button[data-lang]');
    if (button) {
      const next = normLang(button.dataset.lang);
      if (next !== lang) {
        lang = next;
        localStorage.setItem('fm_lang',lang);
        render();
        track('select_language',{language:lang});
      }
      return;
    }
    const nav = event.target.closest('[data-nav]');
    if (nav) track('click_nav',{item:nav.dataset.nav});
    const series = event.target.closest('[data-series]');
    if (series) track('view_series',{series:series.dataset.series});
  });

  document.addEventListener('DOMContentLoaded',() => {
    initAttribution();
    render();
    loadCatalog();
    track('view_collection',{collection:'fablemarq-gamebooks'});
  });
})();
