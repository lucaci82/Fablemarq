(() => {
  'use strict';

  const AMZ_TLD = { IT:'it', ES:'es', FR:'fr', DE:'de', GB:'co.uk', US:'com', CA:'ca', MX:'com.mx', CO:'com.co' };
  const ASIN = { it:'B0G2MC6Z2X', en:'B0G2JLYKWY', es:'B0G2J42FDD' };
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const INTERNAL_SRC = new Set(['site','home','kids','gamebooks','collection','book','preview','hero','grid','b1','b2','b3']);

  const I18N = {
    it:{
      pageTitle:'Fablemarq — Libri illustrati e Gamebooks',
      description:'Fablemarq è un publisher indipendente: libri illustrati per bambini e gamebook interattivi per adulti.',
      skip:'Salta al contenuto',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Libri illustrati. Gamebooks interattivi.',tagline:'Storie da vivere.',
      heroSub:'Fablemarq crea mondi editoriali distinti: meraviglia per i più giovani, tensione e decisioni per gli adulti.',
      chooseKicker:'Fablemarq',chooseTitle:'Scegli il tuo mondo',chooseIntro:'Due divisioni con identità diverse, senza confonderle tra loro.',
      kidsEyebrow:'Fablemarq Kids',kidsTitle:'Meraviglia da leggere insieme',kidsText:'Storie illustrate, mondi luminosi e personaggi da ricordare. Il primo universo è Kiki Moon.',kidsExplore:'Scopri Kids',kidsBuy:'Acquista Kiki Moon',
      gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Le tue scelte cambiano la storia',gameText:'Crime, survival e nuove linee narrative per adulti. Niente dadi: solo decisioni e conseguenze.',gameExplore:'Scopri Gamebooks',
      catalogKicker:'Catalogo',catalogTitle:'Titoli Fablemarq',catalogIntro:'Ogni mondo mantiene la propria atmosfera, anche nella presentazione dei libri.',
      kidsShelfTitle:'Storie illustrate',gameShelfTitle:'Thriller interattivi per adulti',viewAllKids:'Vedi Kids',viewAllGamebooks:'Vedi Gamebooks',
      kikiLabel:'Kiki Moon · Libro I',kikiTitle:'La Stella Perduta',kikiFullTitle:'Kiki Moon — La Stella Perduta',kikiText:'Una storia illustrata per lettori dai 6 ai 10 anni.',
      kiki2Label:'Kiki Moon · Libro II',kiki2Title:'Il Segreto di Snarfel',kiki2FullTitle:'Kiki Moon — Il Segreto di Snarfel',kiki2Text:'Il prossimo capitolo della saga di Kiki Moon.',
      details:'Dettagli',buy:'Amazon',available:'Disponibile',
      crimeLabel:'Gamebooks · Crime',crimeTitle:"L'ACCUSATO",crimeText:'Hai 48 ore per dimostrare che non sei stato tu.',
      surviveLabel:'Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveText:"Sette persone. Una galleria crollata. L'aria non basterà per tutti.",
      development:'In sviluppo',soon:'Prossimamente',gamebooksCta:'Vai ai Gamebooks',
      collectionsKicker:'Collane',collectionsTitle:'Esplora Fablemarq',footer:'Fablemarq — Independent publishing studio',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq — Illustrated Books & Gamebooks',
      description:'Fablemarq is an independent publisher of illustrated children’s books and interactive gamebooks for adults.',
      skip:'Skip to content',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Illustrated books. Interactive gamebooks.',tagline:'Stories to live.',
      heroSub:'Fablemarq builds distinct publishing worlds: wonder for younger readers, tension and decisions for adults.',
      chooseKicker:'Fablemarq',chooseTitle:'Choose your world',chooseIntro:'Two divisions with distinct identities, without mixing them together.',
      kidsEyebrow:'Fablemarq Kids',kidsTitle:'Wonder made to read together',kidsText:'Illustrated stories, luminous worlds and memorable characters. Kiki Moon is the first universe.',kidsExplore:'Explore Kids',kidsBuy:'Buy Kiki Moon',
      gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Your choices change the story',gameText:'Crime, survival and new narrative lines for adults. No dice: just decisions and consequences.',gameExplore:'Explore Gamebooks',
      catalogKicker:'Catalog',catalogTitle:'Fablemarq titles',catalogIntro:'Each world keeps its own atmosphere, including the way its books are presented.',
      kidsShelfTitle:'Illustrated stories',gameShelfTitle:'Interactive thrillers for adults',viewAllKids:'View Kids',viewAllGamebooks:'View Gamebooks',
      kikiLabel:'Kiki Moon · Book I',kikiTitle:'The Lost Star',kikiFullTitle:'Kiki Moon — The Lost Star',kikiText:'A full-color illustrated story for readers ages 6–10.',
      kiki2Label:'Kiki Moon · Book II',kiki2Title:"Snarfel's Secret",kiki2FullTitle:"Kiki Moon — Snarfel's Secret",kiki2Text:'The next chapter in the Kiki Moon saga.',
      details:'Details',buy:'Amazon',available:'Available',
      crimeLabel:'Gamebooks · Crime',crimeTitle:"L'ACCUSATO",crimeText:'You have 48 hours to prove you did not do it.',
      surviveLabel:'Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveText:'Seven people. A collapsed tunnel. There will not be enough air for everyone.',
      development:'In development',soon:'Coming soon',gamebooksCta:'Explore Gamebooks',
      collectionsKicker:'Collections',collectionsTitle:'Explore Fablemarq',footer:'Fablemarq — Independent publishing studio',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq — Libros ilustrados y Gamebooks',
      description:'Fablemarq es una editorial independiente de libros ilustrados infantiles y gamebooks interactivos para adultos.',
      skip:'Saltar al contenido',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Libros ilustrados. Gamebooks interactivos.',tagline:'Historias para vivir.',
      heroSub:'Fablemarq crea mundos editoriales distintos: magia para los más jóvenes, tensión y decisiones para adultos.',
      chooseKicker:'Fablemarq',chooseTitle:'Elige tu mundo',chooseIntro:'Dos divisiones con identidades distintas, sin mezclarlas entre sí.',
      kidsEyebrow:'Fablemarq Kids',kidsTitle:'Maravilla para leer juntos',kidsText:'Historias ilustradas, mundos luminosos y personajes para recordar. Kiki Moon es el primer universo.',kidsExplore:'Descubre Kids',kidsBuy:'Comprar Kiki Moon',
      gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Tus decisiones cambian la historia',gameText:'Crime, supervivencia y nuevas líneas narrativas para adultos. Sin dados: solo decisiones y consecuencias.',gameExplore:'Descubre Gamebooks',
      catalogKicker:'Catálogo',catalogTitle:'Títulos Fablemarq',catalogIntro:'Cada mundo mantiene su propia atmósfera, también al presentar sus libros.',
      kidsShelfTitle:'Historias ilustradas',gameShelfTitle:'Thrillers interactivos para adultos',viewAllKids:'Ver Kids',viewAllGamebooks:'Ver Gamebooks',
      kikiLabel:'Kiki Moon · Libro I',kikiTitle:'La Estrella Perdida',kikiFullTitle:'Kiki Moon — La Estrella Perdida',kikiText:'Una historia ilustrada a todo color para lectores de 6 a 10 años.',
      kiki2Label:'Kiki Moon · Libro II',kiki2Title:'El Secreto de Snarfel',kiki2FullTitle:'Kiki Moon — El Secreto de Snarfel',kiki2Text:'El próximo capítulo de la saga Kiki Moon.',
      details:'Detalles',buy:'Amazon',available:'Disponible',
      crimeLabel:'Gamebooks · Crime',crimeTitle:"L'ACCUSATO",crimeText:'Tienes 48 horas para demostrar que no fuiste tú.',
      surviveLabel:'Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveText:'Siete personas. Un túnel derrumbado. El aire no alcanzará para todos.',
      development:'En desarrollo',soon:'Próximamente',gamebooksCta:'Ver Gamebooks',
      collectionsKicker:'Colecciones',collectionsTitle:'Explora Fablemarq',footer:'Fablemarq — Independent publishing studio',language:'Idioma'
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
