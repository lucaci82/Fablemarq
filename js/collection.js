(() => {
  'use strict';

  const ASSET_ROOT = '../assets';
  const INTERNAL_SRC = new Set([
    'b1','b2','b3','hero','grid','preview','collection','site',
    'collection_hero','collection_buy'
  ]);
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const AMZ_TLD = { IT:'it', ES:'es', FR:'fr', DE:'de', GB:'co.uk', US:'com', CA:'ca', MX:'com.mx', CO:'com.co' };
  const ASIN_BY_LANG = {
    it:'B0G2MC6Z2X',
    en:'B0G2JLYKWY',
    es:'B0G2J42FDD'
  };

  const I18N = {
    it:{
      title:'Kiki Moon Collection — Fablemarq',
      description:"Continua l'avventura: acquista il primo libro della saga Kiki Moon e scopri il prossimo capitolo in lavorazione.",
      skip:'Salta al contenuto',language:'Lingua',hero1:'Kiki Moon — Libro I',hero2:'La Stella Perduta',
      hook:'Una stella si spegne. Ma la luce di Kiki è appena iniziata.',
      benefits:['Età 6–10 anni','80 pagine illustrate a colori','Ideale da leggere insieme'],
      buy:'Acquista su Amazon',trust:'Acquisto e resi gestiti da Amazon.',preview:'Scopri il Libro I',
      section:'Prossimo libro della saga',b2:'Libro II — Il Segreto di Snarfel',progress:'In lavorazione'
    },
    en:{
      title:'Kiki Moon Collection — Fablemarq',
      description:"Continue the adventure: get the first Kiki Moon book and discover the next chapter now in progress.",
      skip:'Skip to content',language:'Language',hero1:'Kiki Moon — Book I',hero2:'The Lost Star',
      hook:"A star goes dark. Kiki's light is just beginning.",
      benefits:['Ages 6–10','80 full-color illustrated pages','Perfect for family reading'],
      buy:'Buy on Amazon',trust:'Purchase and returns handled by Amazon.',preview:'Discover Book I',
      section:'Next book in the series',b2:"Book II — Snarfel's Secret",progress:'In progress'
    },
    es:{
      title:'Kiki Moon Collection — Fablemarq',
      description:'Sigue la aventura: compra el primer libro de Kiki Moon y descubre el próximo capítulo en desarrollo.',
      skip:'Saltar al contenido',language:'Idioma',hero1:'Kiki Moon — Libro I',hero2:'La Estrella Perdida',
      hook:'Una estrella se apaga. La luz de Kiki acaba de empezar.',
      benefits:['Edades 6–10','80 páginas ilustradas a color','Perfecto para leer en familia'],
      buy:'Comprar en Amazon',trust:'Compra y devoluciones gestionadas por Amazon.',preview:'Descubre el Libro I',
      section:'Próximo libro de la saga',b2:'Libro II — El Secreto de Snarfel',progress:'En desarrollo'
    }
  };

  const qs = () => new URLSearchParams(location.search);
  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };

  function initialLang(){
    const browser = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return normLang(qs().get('lang') || localStorage.getItem('lang') || browser);
  }

  function initAttribution(){
    const q = qs();
    const raw = (q.get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) localStorage.setItem('fm_src', raw);
    UTM_KEYS.forEach(key => {
      const value = q.get(key);
      if (value) sessionStorage.setItem(key, value);
    });
  }

  function guessCountry(){
    const locale = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toUpperCase();
    const match = locale.match(/-([A-Z]{2})$/);
    return match && AMZ_TLD[match[1]] ? match[1] : null;
  }

  function storeCountry(){
    const fromUrl = (qs().get('cc') || '').trim().toUpperCase();
    if (AMZ_TLD[fromUrl]) return fromUrl;
    const saved = (localStorage.getItem('amz_cc') || '').trim().toUpperCase();
    if (AMZ_TLD[saved]) return saved;
    return guessCountry() || 'US';
  }

  function trafficSource(){
    const raw = (qs().get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) return raw;
    return localStorage.getItem('fm_src') || 'site';
  }

  function withParams(href, values){
    const url = new URL(href, location.href);
    Object.entries(values).forEach(([key,value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    });
    return url.pathname + (url.search ? `?${url.searchParams.toString()}` : '');
  }

  function amazonUrl(lang, placement){
    const cc = storeCountry();
    localStorage.setItem('amz_cc', cc);
    const src = trafficSource();
    const query = new URLSearchParams({
      utm_source:src,
      utm_medium:`collection_${lang}`,
      utm_campaign:'readthrough',
      utm_content:placement,
      src
    });
    UTM_KEYS.forEach(key => {
      const value = qs().get(key) || sessionStorage.getItem(key);
      if (value && !query.has(key)) query.set(key, value);
    });
    return `https://www.amazon.${AMZ_TLD[cc] || 'com'}/dp/${ASIN_BY_LANG[lang] || ASIN_BY_LANG.en}?${query.toString()}`;
  }

  let lang = initialLang();
  let trackingBound = false;

  function setText(selector, value){
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function render(){
    const t = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    document.title = t.title;

    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t.description;

    setText('.skip-link', t.skip);
    setText('#titleLine1', t.hero1);
    setText('#titleLine2', t.hero2);
    setText('#heroHook', t.hook);
    setText('#sectionTitle', t.section);
    setText('#book2Caption', t.b2);
    setText('#book2Meta', t.progress);
    setText('#buyMetaText', t.trust);

    document.querySelectorAll('[data-i18n="buy"]').forEach(el => { el.textContent = t.buy; });
    document.querySelectorAll('.lang-switch').forEach(el => el.setAttribute('aria-label', t.language));
    document.querySelectorAll('.lang-switch button').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    const benefits = document.getElementById('benefits');
    if (benefits) {
      benefits.replaceChildren(...t.benefits.map(value => {
        const li = document.createElement('li');
        li.textContent = value;
        return li;
      }));
    }

    const heroCover = document.getElementById('heroCover');
    if (heroCover) {
      heroCover.src = `${ASSET_ROOT}/${lang}/cover1.webp`;
      heroCover.alt = `${t.hero1} — ${t.hero2}`;
    }
    const preload = document.querySelector('link[rel="preload"][as="image"]');
    if (preload) preload.href = `${ASSET_ROOT}/${lang}/cover1.webp`;

    const b2 = document.getElementById('book2Cover');
    if (b2) { b2.src = `${ASSET_ROOT}/${lang}/cover2.webp`; b2.alt = t.b2; }
    const card = document.querySelector('.collection-card');
    if (card) card.dataset.status = t.progress;

    const src = trafficSource();
    const brand = document.querySelector('a.brand');
    if (brand) brand.href = withParams('../index.html', { lang, src });

    const coverLink = document.getElementById('coverLink');
    if (coverLink) {
      coverLink.href = withParams('libro-1/index.html', { lang, src, ref:'collection_hero' }) + '#anteprima';
      coverLink.setAttribute('aria-label', t.preview);
    }

    const buyMain = document.getElementById('buyNow');
    const buySticky = document.getElementById('buyNowSticky');
    if (buyMain) buyMain.href = amazonUrl(lang, 'hero_btn');
    if (buySticky) buySticky.href = amazonUrl(lang, 'sticky_btn');
  }

  function track(name, extra){
    const ctx = {
      page_path:location.pathname,
      page_location:location.href,
      lang,
      src:trafficSource(),
      book_id:'b1'
    };
    UTM_KEYS.forEach(key => {
      const value = qs().get(key) || sessionStorage.getItem(key);
      if (value) ctx[key] = value;
    });
    try { window.gtag && window.gtag('event', name, Object.assign(ctx, extra || {})); } catch (_) {}
  }

  function bindTracking(){
    if (trackingBound) return;
    trackingBound = true;
    track('view_collection');
    [['buyNow','hero'],['buyNowSticky','sticky']].forEach(([id,placement]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => track('click_buy', { placement, destination:'amazon', href:el.href }), { passive:true });
    });
    const preview = document.getElementById('coverLink');
    if (preview) preview.addEventListener('click', () => track('click_preview', { placement:'hero_cover' }), { passive:true });
  }

  function initSticky(){
    const wrap = document.getElementById('stickyCta');
    const main = document.getElementById('buyNow');
    const mq = window.matchMedia('(max-width:520px)');
    if (!wrap || !main || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      wrap.style.display = mq.matches && !entries[0].isIntersecting ? 'block' : 'none';
    }, { threshold:.01 });
    observer.observe(main);
    const refresh = () => { if (!mq.matches) wrap.style.display = 'none'; };
    if (mq.addEventListener) mq.addEventListener('change', refresh);
    else mq.addListener(refresh);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.lang-switch button[data-lang]');
    if (!button) return;
    const next = normLang(button.dataset.lang);
    if (next === lang) return;
    lang = next;
    render();
    track('select_language', { language:lang });
  });

  document.addEventListener('DOMContentLoaded', () => {
    initAttribution();
    const current = new URL(location.href);
    if (current.searchParams.has('lang')) {
      current.searchParams.delete('lang');
      history.replaceState({}, '', current.pathname + current.search + current.hash);
    }
    render();
    bindTracking();
    initSticky();
  });
})();
