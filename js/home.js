(() => {
  'use strict';

  const AMZ_TLD = { IT:'it', ES:'es', FR:'fr', DE:'de', GB:'co.uk', US:'com', CA:'ca', MX:'com.mx', CO:'com.co' };
  const ASIN = { it:'B0G2MC6Z2X', en:'B0G2JLYKWY', es:'B0G2J42FDD' };
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const INTERNAL_SRC = new Set(['site','home','kids','gamebooks','collection','book','preview','hero','grid','b1','b2','b3']);
  const I18N = {
    it:{
      pageTitle:'Fablemarq — Kids & Gamebooks',description:'Fablemarq è un publisher indipendente: storie illustrate per bambini e gamebook interattivi per adulti.',skip:'Salta al contenuto',
      navKids:'Kids',navGamebooks:'Gamebooks',tagline:'Stories you enter.',heroSub:'Due universi editoriali. Un solo marchio. Scegli dove entrare.',
      chooseKicker:'Fablemarq',chooseTitle:'Scegli il tuo mondo',chooseIntro:'Libri costruiti per essere trovati, capiti e desiderati in pochi secondi.',
      kidsEyebrow:'Fablemarq Kids',kidsTitle:'Meraviglia da leggere insieme',kidsText:'Storie illustrate, mondi luminosi e personaggi da ricordare. Oggi: Kiki Moon.',kidsExplore:'Scopri Kids',kidsBuy:'Acquista Kiki Moon',
      gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Le tue scelte cambiano la storia',gameText:'Crime, survival, mystery e situazioni impossibili. Niente dadi: solo decisioni e conseguenze.',gameExplore:'Scopri Gamebooks',
      featuredKicker:'In evidenza',featuredTitle:'Libri da scoprire ora',kikiLabel:'Fablemarq Kids',kikiTitle:'Kiki Moon — La Stella Perduta',kikiText:'Una storia illustrata per lettori dai 6 ai 10 anni.',details:'Dettagli',buy:'Amazon',available:'Disponibile',
      crimeLabel:'Gamebooks · Crime',crimeTitle:'SEI ACCUSATO',crimeText:'Hai 48 ore per dimostrare che non sei stato tu.',surviveLabel:'Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveText:"Sette persone. Una galleria crollata. L'aria non basterà per tutti.",
      development:'In sviluppo',soon:'Prossimamente',gamebooksCta:'Vai ai Gamebooks',footer:'Fablemarq — Independent publishing studio',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq — Kids & Gamebooks',description:'Fablemarq is an independent publisher for illustrated children’s stories and interactive gamebooks for adults.',skip:'Skip to content',
      navKids:'Kids',navGamebooks:'Gamebooks',tagline:'Stories you enter.',heroSub:'Two publishing worlds. One brand. Choose where to enter.',
      chooseKicker:'Fablemarq',chooseTitle:'Choose your world',chooseIntro:'Books designed to be found, understood and wanted in seconds.',
      kidsEyebrow:'Fablemarq Kids',kidsTitle:'Wonder made to read together',kidsText:'Illustrated stories, luminous worlds and memorable characters. Now: Kiki Moon.',kidsExplore:'Explore Kids',kidsBuy:'Buy Kiki Moon',
      gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Your choices change the story',gameText:'Crime, survival, mystery and impossible situations. No dice: just decisions and consequences.',gameExplore:'Explore Gamebooks',
      featuredKicker:'Featured',featuredTitle:'Books to discover now',kikiLabel:'Fablemarq Kids',kikiTitle:'Kiki Moon — The Lost Star',kikiText:'A full-color illustrated story for readers ages 6–10.',details:'Details',buy:'Amazon',available:'Available',
      crimeLabel:'Gamebooks · Crime',crimeTitle:'SEI ACCUSATO',crimeText:'You have 48 hours to prove you did not do it.',surviveLabel:'Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveText:'Seven people. A collapsed tunnel. There will not be enough air for everyone.',
      development:'In development',soon:'Coming soon',gamebooksCta:'Explore Gamebooks',footer:'Fablemarq — Independent publishing studio',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq — Kids & Gamebooks',description:'Fablemarq es una editorial independiente de historias ilustradas infantiles y gamebooks interactivos para adultos.',skip:'Saltar al contenido',
      navKids:'Kids',navGamebooks:'Gamebooks',tagline:'Stories you enter.',heroSub:'Dos universos editoriales. Una sola marca. Elige dónde entrar.',
      chooseKicker:'Fablemarq',chooseTitle:'Elige tu mundo',chooseIntro:'Libros diseñados para encontrarse, entenderse y desearse en segundos.',
      kidsEyebrow:'Fablemarq Kids',kidsTitle:'Maravilla para leer juntos',kidsText:'Historias ilustradas, mundos luminosos y personajes para recordar. Ahora: Kiki Moon.',kidsExplore:'Descubre Kids',kidsBuy:'Comprar Kiki Moon',
      gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Tus decisiones cambian la historia',gameText:'Crime, supervivencia, misterio y situaciones imposibles. Sin dados: solo decisiones y consecuencias.',gameExplore:'Descubre Gamebooks',
      featuredKicker:'Destacados',featuredTitle:'Libros para descubrir ahora',kikiLabel:'Fablemarq Kids',kikiTitle:'Kiki Moon — La Estrella Perdida',kikiText:'Una historia ilustrada a todo color para lectores de 6 a 10 años.',details:'Detalles',buy:'Amazon',available:'Disponible',
      crimeLabel:'Gamebooks · Crime',crimeTitle:'SEI ACCUSATO',crimeText:'Tienes 48 horas para demostrar que no fuiste tú.',surviveLabel:'Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveText:'Siete personas. Un túnel derrumbado. El aire no alcanzará para todos.',
      development:'En desarrollo',soon:'Próximamente',gamebooksCta:'Ver Gamebooks',footer:'Fablemarq — Independent publishing studio',language:'Idioma'
    }
  };

  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };
  const params = () => new URLSearchParams(location.search);
  let lang = normLang(window.PREFERRED_LANG || params().get('lang') || localStorage.getItem('lang') || navigator.language || 'en');

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
    const q = new URLSearchParams({utm_source:source,utm_medium:`home_${lang}`,utm_campaign:'kiki_readthrough',utm_content:placement || 'home_buy',src:source});
    UTM_KEYS.forEach(key => { const value = params().get(key) || sessionStorage.getItem(key); if (value && !q.has(key)) q.set(key,value); });
    return `https://www.amazon.${AMZ_TLD[cc] || 'com'}/dp/${ASIN[lang] || ASIN.en}?${q.toString()}`;
  }
  function track(name,extra){
    const ctx = {page_path:location.pathname,lang,src:trafficSource()};
    UTM_KEYS.forEach(key => { const value = params().get(key) || sessionStorage.getItem(key); if (value) ctx[key] = value; });
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

    const available = document.querySelector('.book-tile:first-child .book-tile__status');
    if (available) available.textContent = t.available;
    document.querySelectorAll('.world-card--kids .world-art img, .featured-row .book-tile:first-child .book-tile__visual img').forEach(img => {
      img.src = `assets/${lang}/cover1.webp`;
      img.alt = t.kikiTitle;
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

    document.querySelectorAll('[data-buy-kiki]').forEach(el => { el.href = amazonUrl(el.dataset.placement); });
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
      if (next !== lang) { lang = next; render(); track('select_language',{language:lang}); }
      return;
    }
    const world = event.target.closest('[data-world]');
    if (world) track('select_world',{world:world.dataset.world});
    const buy = event.target.closest('[data-buy-kiki]');
    if (buy) track('click_buy',{book_id:'kiki-moon-1',placement:buy.dataset.placement || 'home',destination:'amazon',href:buy.href});
    const nav = event.target.closest('[data-nav]');
    if (nav) track('click_nav',{item:nav.dataset.nav});
  });

  document.addEventListener('DOMContentLoaded',() => {
    initAttribution();
    render();
    track('view_home');
  });
})();
