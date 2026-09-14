(() => {
  'use strict';

  const AMZ_TLD = { IT:'it', ES:'es', FR:'fr', DE:'de', GB:'co.uk', US:'com', CA:'ca', MX:'com.mx', CO:'com.co' };
  const ASIN = { it:'B0G2MC6Z2X', en:'B0G2JLYKWY', es:'B0G2J42FDD' };
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const INTERNAL_SRC = new Set(['site','home','kids','gamebooks','collection','book','preview','hero','grid','b1','b2','b3']);

  const I18N = {
    it:{
      pageTitle:'Fablemarq — Libri illustrati e Gamebooks interattivi',
      description:'Fablemarq crea libri illustrati per bambini e gamebook interattivi per adulti: mondi editoriali distinti, storie da vivere e decisioni che cambiano il racconto.',
      skip:'Salta al contenuto',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq · Editoria indipendente',tagline:'Storie che non restano sulla pagina.',
      heroSub:'Libri illustrati per immaginare. Gamebooks per decidere. Due universi editoriali, un solo marchio.',
      heroSignature:'Mondi distinti. Identità comune. Esperienze da ricordare.',
      chooseKicker:'I mondi Fablemarq',chooseTitle:'Scegli dove entrare.',chooseIntro:'Due divisioni con un linguaggio proprio, unite dalla stessa cura editoriale.',
      kidsEyebrow:'Fablemarq Kids',kidsTitle:'Storie per crescere immaginando.',kidsText:'Libri illustrati, mondi luminosi e personaggi da ricordare. Kiki Moon apre il primo universo Fablemarq dedicato ai più giovani.',kidsExplore:'Scopri Kids',kidsBuy:'Acquista Kiki Moon',
      gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Non segui la storia. Decidi dove va.',gameText:'Thriller interattivi per adulti: niente dadi e niente schede personaggio. Solo decisioni, conseguenze e percorsi che cambiano.',gameExplore:'Entra nei Gamebooks',
      featuredKicker:'In evidenza',featuredTitle:'Tre porte d’ingresso a Fablemarq.',featuredIntro:'Una selezione essenziale: un mondo illustrato e due esperienze interattive.',
      kikiLabel:'Kiki Moon · Libro I',kikiTitle:'La Stella Perduta',kikiFullTitle:'Kiki Moon — La Stella Perduta',kikiText:'Una storia illustrata per lettori dai 6 ai 10 anni.',
      kiki2FullTitle:'Kiki Moon — Il Segreto di Snarfel',details:'Scopri il libro',buy:'Amazon',available:'Disponibile',
      crimeLabel:'Gamebooks · Crime',crimeTitle:"L'ACCUSATO",crimeText:'Hai 48 ore per dimostrare che non sei stato tu.',
      surviveLabel:'Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveText:"Sette persone. Una galleria crollata. L'aria non basterà per tutti.",
      development:'In sviluppo',gamebooksCta:'Scopri la linea',
      choiceKicker:'Fablemarq Gamebooks',choiceTitle:'Tu cosa faresti?',choiceScenario:'Sei accusato di un omicidio. Hai 48 ore. Tutte le prove portano a te.',choiceA:'Fuggire prima che sia troppo tardi.',choiceB:'Restare e provare a dimostrare la tua innocenza.',choiceText:'Nei Fablemarq Gamebooks non scegli una risposta giusta: scegli una strada. E la storia reagisce.',choiceCta:'Scopri come funzionano',
      genresKicker:'Gamebooks',genresTitle:'Scegli la tua tensione.',genresIntro:'Vai direttamente alla linea che vuoi esplorare.',
      aboutTitle:'Libri concepiti come esperienze, non come semplici pagine.',aboutText:"Da una parte mondi illustrati per i più giovani. Dall'altra storie interattive per adulti in cui ogni decisione può cambiare ciò che accade. Fablemarq costruisce collane diverse con un'identità editoriale comune.",
      footerCatalog:'Catalogo',footer:'Fablemarq — Independent publishing studio',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq — Illustrated Books & Interactive Gamebooks',
      description:'Fablemarq creates illustrated books for children and interactive gamebooks for adults: distinct publishing worlds, stories to experience and decisions that change the narrative.',
      skip:'Skip to content',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq · Independent publishing',tagline:'Stories that do not stay on the page.',
      heroSub:'Illustrated books to imagine. Gamebooks to decide. Two publishing worlds, one identity.',
      heroSignature:'Distinct worlds. One identity. Experiences made to stay with you.',
      chooseKicker:'Fablemarq worlds',chooseTitle:'Choose where to enter.',chooseIntro:'Two divisions with their own language, united by the same editorial care.',
      kidsEyebrow:'Fablemarq Kids',kidsTitle:'Stories for growing through imagination.',kidsText:'Illustrated books, luminous worlds and memorable characters. Kiki Moon opens Fablemarq’s first universe for younger readers.',kidsExplore:'Explore Kids',kidsBuy:'Buy Kiki Moon',
      gameEyebrow:'Fablemarq Gamebooks',gameTitle:'You do not follow the story. You decide where it goes.',gameText:'Interactive thrillers for adults: no dice and no character sheets. Just decisions, consequences and paths that change.',gameExplore:'Enter Gamebooks',
      featuredKicker:'Featured',featuredTitle:'Three ways into Fablemarq.',featuredIntro:'A focused selection: one illustrated world and two interactive experiences.',
      kikiLabel:'Kiki Moon · Book I',kikiTitle:'The Lost Star',kikiFullTitle:'Kiki Moon — The Lost Star',kikiText:'A full-color illustrated story for readers ages 6–10.',
      kiki2FullTitle:"Kiki Moon — Snarfel's Secret",details:'Discover the book',buy:'Amazon',available:'Available',
      crimeLabel:'Gamebooks · Crime',crimeTitle:"L'ACCUSATO",crimeText:'You have 48 hours to prove you did not do it.',
      surviveLabel:'Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveText:'Seven people. A collapsed tunnel. There will not be enough air for everyone.',
      development:'In development',gamebooksCta:'Explore the line',
      choiceKicker:'Fablemarq Gamebooks',choiceTitle:'What would you do?',choiceScenario:'You are accused of murder. You have 48 hours. Every piece of evidence points to you.',choiceA:'Run before it is too late.',choiceB:'Stay and try to prove your innocence.',choiceText:'In Fablemarq Gamebooks you do not choose the right answer: you choose a path. And the story reacts.',choiceCta:'See how it works',
      genresKicker:'Gamebooks',genresTitle:'Choose your tension.',genresIntro:'Go straight to the line you want to explore.',
      aboutTitle:'Books conceived as experiences, not simply pages.',aboutText:'On one side, illustrated worlds for younger readers. On the other, interactive stories for adults where every decision can change what happens. Fablemarq builds distinct collections under one editorial identity.',
      footerCatalog:'Catalog',footer:'Fablemarq — Independent publishing studio',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq — Libros ilustrados y Gamebooks interactivos',
      description:'Fablemarq crea libros ilustrados para niños y gamebooks interactivos para adultos: mundos editoriales distintos, historias para vivir y decisiones que cambian la narración.',
      skip:'Saltar al contenido',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq · Editorial independiente',tagline:'Historias que no se quedan en la página.',
      heroSub:'Libros ilustrados para imaginar. Gamebooks para decidir. Dos universos editoriales, una sola identidad.',
      heroSignature:'Mundos distintos. Una identidad común. Experiencias para recordar.',
      chooseKicker:'Los mundos Fablemarq',chooseTitle:'Elige dónde entrar.',chooseIntro:'Dos divisiones con lenguaje propio, unidas por el mismo cuidado editorial.',
      kidsEyebrow:'Fablemarq Kids',kidsTitle:'Historias para crecer imaginando.',kidsText:'Libros ilustrados, mundos luminosos y personajes para recordar. Kiki Moon abre el primer universo Fablemarq para los lectores más jóvenes.',kidsExplore:'Descubre Kids',kidsBuy:'Comprar Kiki Moon',
      gameEyebrow:'Fablemarq Gamebooks',gameTitle:'No sigues la historia. Decides hacia dónde va.',gameText:'Thrillers interactivos para adultos: sin dados ni fichas de personaje. Solo decisiones, consecuencias y caminos que cambian.',gameExplore:'Entra en Gamebooks',
      featuredKicker:'Destacados',featuredTitle:'Tres puertas de entrada a Fablemarq.',featuredIntro:'Una selección esencial: un mundo ilustrado y dos experiencias interactivas.',
      kikiLabel:'Kiki Moon · Libro I',kikiTitle:'La Estrella Perdida',kikiFullTitle:'Kiki Moon — La Estrella Perdida',kikiText:'Una historia ilustrada a todo color para lectores de 6 a 10 años.',
      kiki2FullTitle:'Kiki Moon — El Secreto de Snarfel',details:'Descubre el libro',buy:'Amazon',available:'Disponible',
      crimeLabel:'Gamebooks · Crime',crimeTitle:"L'ACCUSATO",crimeText:'Tienes 48 horas para demostrar que no fuiste tú.',
      surviveLabel:'Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveText:'Siete personas. Un túnel derrumbado. El aire no alcanzará para todos.',
      development:'En desarrollo',gamebooksCta:'Descubre la línea',
      choiceKicker:'Fablemarq Gamebooks',choiceTitle:'¿Tú qué harías?',choiceScenario:'Te acusan de un asesinato. Tienes 48 horas. Todas las pruebas apuntan hacia ti.',choiceA:'Huir antes de que sea demasiado tarde.',choiceB:'Quedarte e intentar demostrar tu inocencia.',choiceText:'En Fablemarq Gamebooks no eliges la respuesta correcta: eliges un camino. Y la historia reacciona.',choiceCta:'Descubre cómo funciona',
      genresKicker:'Gamebooks',genresTitle:'Elige tu tensión.',genresIntro:'Ve directamente a la línea que quieres explorar.',
      aboutTitle:'Libros concebidos como experiencias, no como simples páginas.',aboutText:'Por un lado, mundos ilustrados para los más jóvenes. Por otro, historias interactivas para adultos donde cada decisión puede cambiar lo que ocurre. Fablemarq construye colecciones distintas bajo una identidad editorial común.',
      footerCatalog:'Catálogo',footer:'Fablemarq — Independent publishing studio',language:'Idioma'
    }
  };

  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };

  const params = () => new URLSearchParams(location.search);
  let lang = normLang(
    window.PREFERRED_LANG ||
    params().get('lang') ||
    localStorage.getItem('fm_lang') ||
    localStorage.getItem('lang') ||
    navigator.language ||
    'en'
  );

  function initAttribution(){
    const q = params();
    const raw = (q.get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) localStorage.setItem('fm_src',raw);
    UTM_KEYS.forEach(key => {
      const value = q.get(key);
      if (value) sessionStorage.setItem(key,value);
    });
  }

  function trafficSource(){
    const raw = (params().get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) return raw;
    return localStorage.getItem('fm_src') || 'site';
  }

  function country(){
    const urlCc = (params().get('cc') || '').toUpperCase();
    if (AMZ_TLD[urlCc]) return urlCc;
    const saved = (localStorage.getItem('amz_cc') || '').toUpperCase();
    if (AMZ_TLD[saved]) return saved;
    const locale = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toUpperCase();
    const match = locale.match(/-([A-Z]{2})$/);
    return match && AMZ_TLD[match[1]] ? match[1] : 'US';
  }

  function amazonUrl(placement){
    const cc = country();
    localStorage.setItem('amz_cc',cc);
    const source = trafficSource();
    const q = new URLSearchParams({
      utm_source:source,
      utm_medium:`home_${lang}`,
      utm_campaign:'kiki_readthrough',
      utm_content:placement || 'home_buy',
      src:source
    });
    UTM_KEYS.forEach(key => {
      const value = params().get(key) || sessionStorage.getItem(key);
      if (value && !q.has(key)) q.set(key,value);
    });
    return `https://www.amazon.${AMZ_TLD[cc] || 'com'}/dp/${ASIN[lang] || ASIN.en}?${q.toString()}`;
  }

  function track(name,extra){
    const ctx = {page_path:location.pathname,lang,src:trafficSource()};
    UTM_KEYS.forEach(key => {
      const value = params().get(key) || sessionStorage.getItem(key);
      if (value) ctx[key] = value;
    });
    try { window.gtag && window.gtag('event',name,Object.assign(ctx,extra || {})); } catch (_) {}
  }

  function render(){
    const t = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    localStorage.setItem('lang',lang);
    document.title = t.pageTitle;

    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t.description;
    const skip = document.querySelector('.skip-link');
    if (skip) skip.textContent = t.skip;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(t,key)) el.textContent = t[key];
    });

    document.querySelectorAll('[data-kiki-cover]').forEach(img => {
      const number = img.dataset.kikiCover === '2' ? 2 : 1;
      img.src = `assets/${lang}/cover${number}.webp`;
      if (img.getAttribute('alt')) img.alt = number === 2 ? t.kiki2FullTitle : t.kikiFullTitle;
    });

    const source = trafficSource();
    document.querySelectorAll('[data-internal]').forEach(el => {
      const raw = el.dataset.baseHref || el.getAttribute('href');
      if (!el.dataset.baseHref) el.dataset.baseHref = raw;
      const url = new URL(raw,location.href);
      url.searchParams.set('lang',lang);
      if (source !== 'site') url.searchParams.set('src',source);
      el.href = url.pathname + '?' + url.searchParams.toString() + url.hash;
    });

    document.querySelectorAll('[data-buy-kiki]').forEach(el => {
      el.href = amazonUrl(el.dataset.placement);
    });

    document.querySelectorAll('.lang-switch-home button[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
    document.querySelectorAll('.lang-switch-home').forEach(el => el.setAttribute('aria-label',t.language));
  }

  document.addEventListener('click',event => {
    const langButton = event.target.closest('.lang-switch-home button[data-lang]');
    if (langButton) {
      const next = normLang(langButton.dataset.lang);
      if (next !== lang) {
        lang = next;
        render();
        track('select_language',{language:lang});
      }
      return;
    }

    const world = event.target.closest('[data-world]');
    if (world) track('select_world',{world:world.dataset.world});

    const buy = event.target.closest('[data-buy-kiki]');
    if (buy) track('click_buy',{
      book_id:'kiki-moon-1',
      placement:buy.dataset.placement || 'home',
      destination:'amazon',
      href:buy.href
    });

    const nav = event.target.closest('[data-nav]');
    if (nav) track('click_nav',{item:nav.dataset.nav});
  });

  document.addEventListener('DOMContentLoaded',() => {
    initAttribution();
    render();
    track('view_home');
  });
})();
