(() => {
  'use strict';

  const AMZ_TLD = { IT:'it', ES:'es', FR:'fr', DE:'de', GB:'co.uk', US:'com', CA:'ca', MX:'com.mx', CO:'com.co' };
  const ASIN = { it:'B0G2MC6Z2X', en:'B0G2JLYKWY', es:'B0G2J42FDD' };
  const I18N = {
    it:{
      pageTitle:'Fablemarq Kids — Kiki Moon',
      description:'Fablemarq Kids: storie illustrate per bambini. Scopri Kiki Moon e La Stella Perduta.',
      navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Kids',
      title:'Storie che crescono con l’immaginazione',
      lead:'Mondi illustrati, personaggi da ricordare e avventure da leggere insieme. Kiki Moon è il primo universo di Fablemarq Kids.',
      age:'6–10 anni',color:'80 pagine a colori',family:'Lettura condivisa',
      explore:'Scopri Kiki Moon',buy:'Acquista su Amazon',
      sectionKicker:'Kiki Moon Collection',sectionTitle:'La saga di Kiki Moon',sectionIntro:'Una serie illustrata costruita per essere semplice da scegliere e bella da regalare.',
      b1Label:'Libro I · Disponibile',b1Title:'La Stella Perduta',b1Text:'Una stella si spegne. Ma la luce di Kiki è appena iniziata.',details:'Dettagli',
      b2Label:'Libro II',b2Title:'Il Segreto di Snarfel',b2Text:'Il prossimo capitolo della saga è in lavorazione.',development:'In lavorazione',
      footer:'Fablemarq Kids — A Fablemarq publishing division',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq Kids — Kiki Moon',
      description:'Fablemarq Kids: illustrated stories for children. Discover Kiki Moon and The Lost Star.',
      navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Kids',
      title:'Stories that grow with imagination',
      lead:'Illustrated worlds, memorable characters and adventures made to read together. Kiki Moon is the first universe of Fablemarq Kids.',
      age:'Ages 6–10',color:'80 full-color pages',family:'Made for shared reading',
      explore:'Discover Kiki Moon',buy:'Buy on Amazon',
      sectionKicker:'Kiki Moon Collection',sectionTitle:'The Kiki Moon saga',sectionIntro:'An illustrated series designed to be easy to choose and beautiful to gift.',
      b1Label:'Book I · Available',b1Title:'The Lost Star',b1Text:'A star goes dark. Kiki’s light is just beginning.',details:'Details',
      b2Label:'Book II',b2Title:"Snarfel's Secret",b2Text:'The next chapter of the saga is in development.',development:'In development',
      footer:'Fablemarq Kids — A Fablemarq publishing division',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq Kids — Kiki Moon',
      description:'Fablemarq Kids: historias ilustradas para niños. Descubre Kiki Moon y La Estrella Perdida.',
      navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Kids',
      title:'Historias que crecen con la imaginación',
      lead:'Mundos ilustrados, personajes inolvidables y aventuras para leer juntos. Kiki Moon es el primer universo de Fablemarq Kids.',
      age:'6–10 años',color:'80 páginas a color',family:'Lectura compartida',
      explore:'Descubre Kiki Moon',buy:'Comprar en Amazon',
      sectionKicker:'Kiki Moon Collection',sectionTitle:'La saga de Kiki Moon',sectionIntro:'Una serie ilustrada diseñada para ser fácil de elegir y bonita para regalar.',
      b1Label:'Libro I · Disponible',b1Title:'La Estrella Perdida',b1Text:'Una estrella se apaga. La luz de Kiki acaba de empezar.',details:'Detalles',
      b2Label:'Libro II',b2Title:'El Secreto de Snarfel',b2Text:'El próximo capítulo de la saga está en desarrollo.',development:'En desarrollo',
      footer:'Fablemarq Kids — A Fablemarq publishing division',language:'Idioma'
    }
  };

  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };
  const params = () => new URLSearchParams(location.search);
  let lang = normLang(params().get('lang') || localStorage.getItem('lang') || navigator.language || 'en');

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
    localStorage.setItem('amz_cc', cc);
    const q = new URLSearchParams({utm_source:'site',utm_medium:`kids_${lang}`,utm_campaign:'kiki_readthrough',utm_content:placement || 'kids_buy',src:'site'});
    return `https://www.amazon.${AMZ_TLD[cc] || 'com'}/dp/${ASIN[lang] || ASIN.en}?${q.toString()}`;
  }

  function track(name, extra){
    try { window.gtag && window.gtag('event', name, Object.assign({page_path:location.pathname,lang,division:'kids'},extra || {})); } catch (_) {}
  }

  function render(){
    const t = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    localStorage.setItem('lang',lang);
    document.title = t.pageTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t.description;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(t,key)) el.textContent = t[key];
    });

    const cover1 = document.getElementById('kidsCover1');
    const cardCover1 = document.getElementById('kidsCardCover1');
    const cover2 = document.getElementById('kidsCardCover2');
    if (cover1) { cover1.src = `../assets/${lang}/cover1.webp`; cover1.alt = `Kiki Moon — ${t.b1Title}`; }
    if (cardCover1) { cardCover1.src = `../assets/${lang}/cover1.webp`; cardCover1.alt = `Kiki Moon — ${t.b1Title}`; }
    if (cover2) { cover2.src = `../assets/${lang}/cover2.webp`; cover2.alt = `Kiki Moon — ${t.b2Title}`; }

    document.querySelectorAll('[data-internal]').forEach(el => {
      const raw = el.dataset.baseHref || el.getAttribute('href');
      if (!el.dataset.baseHref) el.dataset.baseHref = raw;
      const url = new URL(raw, location.href);
      url.searchParams.set('lang',lang);
      el.href = url.pathname + '?' + url.searchParams.toString() + url.hash;
    });

    document.querySelectorAll('[data-buy-kiki]').forEach(el => { el.href = amazonUrl(el.dataset.placement); });
    document.querySelectorAll('.site-lang-switch button[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
    document.querySelectorAll('.site-lang-switch').forEach(el => el.setAttribute('aria-label',t.language));
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.site-lang-switch button[data-lang]');
    if (button) {
      const next = normLang(button.dataset.lang);
      if (next !== lang) {
        lang = next;
        render();
        track('select_language',{language:lang});
      }
      return;
    }
    const buy = event.target.closest('[data-buy-kiki]');
    if (buy) track('click_buy',{book_id:'kiki-moon-1',placement:buy.dataset.placement || 'kids'});
    const nav = event.target.closest('[data-nav]');
    if (nav) track('click_nav',{item:nav.dataset.nav});
  });

  document.addEventListener('DOMContentLoaded',() => {
    render();
    track('view_collection',{collection:'fablemarq-kids'});
  });
})();
