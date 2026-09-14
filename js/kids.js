(() => {
  'use strict';

  const AMZ_TLD = { IT:'it', ES:'es', FR:'fr', DE:'de', GB:'co.uk', US:'com', CA:'ca', MX:'com.mx', CO:'com.co' };
  const ASIN = { it:'B0G2MC6Z2X', en:'B0G2JLYKWY', es:'B0G2J42FDD' };
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const INTERNAL_SRC = new Set(['site','home','kids','gamebooks','collection','book','preview','hero','grid','b1','b2','b3']);
  const I18N = {
    it:{
      pageTitle:'Fablemarq Kids — Mondi illustrati per bambini',description:'Fablemarq Kids è la divisione editoriale dedicata ai più giovani: mondi illustrati, personaggi da ricordare e storie da leggere insieme. Scopri Kiki Moon.',skip:'Salta al contenuto',
      navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Kids',title:'Storie per crescere immaginando.',lead:'Libri illustrati, mondi narrativi e personaggi da ricordare. Storie pensate per i più giovani e curate per chi legge insieme a loro.',
      exploreWorlds:'Esplora i mondi Kids',explore:'Scopri Kiki Moon',parentNote:'Per lettori 6–10 anni · lettura autonoma o condivisa',buy:'Amazon',
      worldsKicker:'I mondi di Fablemarq Kids',worldsTitle:'Ogni serie apre un universo.',worldsIntro:'Fablemarq Kids è la casa editoriale. Kiki Moon è il primo mondo narrativo che vive al suo interno.',
      kikiEyebrow:'Primo universo Fablemarq Kids',kikiWorldText:'Un cielo pieno di misteri, una luce che non vuole spegnersi e avventure in cui magia, coraggio e amicizia crescono insieme.',trait1:'Avventura e magia',trait2:'Personaggi ricorrenti',trait3:'6–10 anni',enterKiki:'Entra nel mondo di Kiki',
      sectionKicker:'Kiki Moon · I libri',sectionTitle:'La saga comincia qui.',sectionIntro:'Copertine, titoli e stato della serie: poche informazioni, facili da leggere per bambini e genitori.',
      b1Label:'Libro I · Disponibile',b1Title:'La Stella Perduta',b1Text:'Una stella si spegne. Ma la luce di Kiki è appena iniziata.',details:'Scopri il libro',
      b2Label:'Libro II',b2Title:'Il Segreto di Snarfel',b2Text:'Il prossimo capitolo della saga è in lavorazione.',development:'In lavorazione',
      forWhoKicker:'Per bambini e genitori',forWhoTitle:'Magia per loro. Chiarezza per chi sceglie.',forWho1Title:'6–10 anni',forWho1Text:'Una fascia d’età chiara, senza doverla cercare.',forWho2Title:'A colori',forWho2Text:'Illustrazioni e atmosfera fanno parte dell’esperienza.',forWho3Title:'Da leggere insieme',forWho3Text:'Pensato anche per creare un momento condiviso.',
      footer:'Fablemarq Kids — A Fablemarq publishing division',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq Kids — Illustrated worlds for children',description:'Fablemarq Kids is the publishing division for younger readers: illustrated worlds, memorable characters and stories made to share. Discover Kiki Moon.',skip:'Skip to content',
      navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Kids',title:'Stories for growing through imagination.',lead:'Illustrated books, narrative worlds and memorable characters. Stories made for younger readers and carefully designed for the people who read with them.',
      exploreWorlds:'Explore Kids worlds',explore:'Discover Kiki Moon',parentNote:'For readers ages 6–10 · independent or shared reading',buy:'Amazon',
      worldsKicker:'The worlds of Fablemarq Kids',worldsTitle:'Every series opens a universe.',worldsIntro:'Fablemarq Kids is the publishing home. Kiki Moon is the first narrative world living inside it.',
      kikiEyebrow:'First Fablemarq Kids universe',kikiWorldText:'A sky full of mysteries, a light that refuses to go out and adventures where magic, courage and friendship grow together.',trait1:'Adventure and magic',trait2:'Recurring characters',trait3:'Ages 6–10',enterKiki:'Enter Kiki’s world',
      sectionKicker:'Kiki Moon · The books',sectionTitle:'The saga starts here.',sectionIntro:'Covers, titles and series status: only the information children and parents need.',
      b1Label:'Book I · Available',b1Title:'The Lost Star',b1Text:'A star goes dark. Kiki’s light is just beginning.',details:'Discover the book',
      b2Label:'Book II',b2Title:"Snarfel's Secret",b2Text:'The next chapter of the saga is in development.',development:'In development',
      forWhoKicker:'For children and parents',forWhoTitle:'Magic for them. Clarity for the people choosing.',forWho1Title:'Ages 6–10',forWho1Text:'A clear age range without having to search for it.',forWho2Title:'Full color',forWho2Text:'Illustration and atmosphere are part of the experience.',forWho3Title:'Made to share',forWho3Text:'Designed to create a reading moment together, too.',
      footer:'Fablemarq Kids — A Fablemarq publishing division',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq Kids — Mundos ilustrados para niños',description:'Fablemarq Kids es la división editorial para los lectores más jóvenes: mundos ilustrados, personajes para recordar e historias para compartir. Descubre Kiki Moon.',skip:'Saltar al contenido',
      navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Kids',title:'Historias para crecer imaginando.',lead:'Libros ilustrados, mundos narrativos y personajes para recordar. Historias pensadas para los más jóvenes y cuidadas para quienes leen con ellos.',
      exploreWorlds:'Explora los mundos Kids',explore:'Descubre Kiki Moon',parentNote:'Para lectores de 6–10 años · lectura autónoma o compartida',buy:'Amazon',
      worldsKicker:'Los mundos de Fablemarq Kids',worldsTitle:'Cada serie abre un universo.',worldsIntro:'Fablemarq Kids es la casa editorial. Kiki Moon es el primer mundo narrativo que vive dentro de ella.',
      kikiEyebrow:'Primer universo Fablemarq Kids',kikiWorldText:'Un cielo lleno de misterios, una luz que se niega a apagarse y aventuras donde la magia, el valor y la amistad crecen juntos.',trait1:'Aventura y magia',trait2:'Personajes recurrentes',trait3:'6–10 años',enterKiki:'Entra en el mundo de Kiki',
      sectionKicker:'Kiki Moon · Los libros',sectionTitle:'La saga empieza aquí.',sectionIntro:'Portadas, títulos y estado de la serie: solo la información necesaria para niños y padres.',
      b1Label:'Libro I · Disponible',b1Title:'La Estrella Perdida',b1Text:'Una estrella se apaga. La luz de Kiki acaba de empezar.',details:'Descubre el libro',
      b2Label:'Libro II',b2Title:'El Secreto de Snarfel',b2Text:'El próximo capítulo de la saga está en desarrollo.',development:'En desarrollo',
      forWhoKicker:'Para niños y padres',forWhoTitle:'Magia para ellos. Claridad para quien elige.',forWho1Title:'6–10 años',forWho1Text:'Una franja de edad clara, sin tener que buscarla.',forWho2Title:'A color',forWho2Text:'Las ilustraciones y la atmósfera forman parte de la experiencia.',forWho3Title:'Para leer juntos',forWho3Text:'Pensado también para crear un momento de lectura compartida.',
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
    const q = new URLSearchParams({utm_source:source,utm_medium:`kids_${lang}`,utm_campaign:'kiki_readthrough',utm_content:placement || 'kids_buy',src:source});
    UTM_KEYS.forEach(key => { const value = params().get(key) || sessionStorage.getItem(key); if (value && !q.has(key)) q.set(key,value); });
    return `https://www.amazon.${AMZ_TLD[cc] || 'com'}/dp/${ASIN[lang] || ASIN.en}?${q.toString()}`;
  }
  function track(name,extra){
    const ctx = {page_path:location.pathname,lang,division:'kids',src:trafficSource()};
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

    const covers = [
      ['kidsCover1',1,'b1Title'],
      ['kidsCover2Hero',2,'b2Title'],
      ['kidsWorldCover1',1,'b1Title'],
      ['kidsCardCover1',1,'b1Title'],
      ['kidsCardCover2',2,'b2Title']
    ];
    covers.forEach(([id,number,titleKey]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.src = `../assets/${lang}/cover${number}.webp`;
      if (el.getAttribute('alt')) el.alt = `Kiki Moon — ${t[titleKey]}`;
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
    document.querySelectorAll('.site-lang-switch button[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
    document.querySelectorAll('.site-lang-switch').forEach(el => el.setAttribute('aria-label',t.language));
  }

  document.addEventListener('click',event => {
    const button = event.target.closest('.site-lang-switch button[data-lang]');
    if (button) {
      const next = normLang(button.dataset.lang);
      if (next !== lang) { lang = next; render(); track('select_language',{language:lang}); }
      return;
    }
    const buy = event.target.closest('[data-buy-kiki]');
    if (buy) track('click_buy',{book_id:'kiki-moon-1',placement:buy.dataset.placement || 'kids',destination:'amazon',href:buy.href});
    const nav = event.target.closest('[data-nav]');
    if (nav) track('click_nav',{item:nav.dataset.nav});
  });

  document.addEventListener('DOMContentLoaded',() => {
    initAttribution();
    render();
    track('view_collection',{collection:'fablemarq-kids'});
  });
})();
