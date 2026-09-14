(() => {
  'use strict';

  const cfg = window.BOOK_CONFIG;
  if (!cfg) return;

  const ASSET_ROOT = '../../assets';
  const INTERNAL_SRC = new Set(['b1','b2','b3','hero','grid','preview','collection','site','book','libro','home','kids']);
  const AMZ_TLD = { IT:'it', ES:'es', FR:'fr', DE:'de', GB:'co.uk', US:'com', CA:'ca', MX:'com.mx', CO:'com.co' };
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];

  const params = () => new URLSearchParams(location.search);
  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };

  function initialLang(){
    const browser = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return normLang(params().get('lang') || localStorage.getItem('lang') || browser);
  }
  function guessCountry(){
    const locale = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toUpperCase();
    const match = locale.match(/-([A-Z]{2})$/);
    return match && AMZ_TLD[match[1]] ? match[1] : null;
  }
  function storeCountry(){
    const fromUrl = (params().get('cc') || '').trim().toUpperCase();
    if (AMZ_TLD[fromUrl]) return fromUrl;
    const saved = (localStorage.getItem('amz_cc') || '').trim().toUpperCase();
    if (AMZ_TLD[saved]) return saved;
    return guessCountry() || 'US';
  }
  function initAttribution(){
    const q = params();
    const raw = (q.get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) localStorage.setItem('fm_src', raw);
    UTM_KEYS.forEach(key => { const value = q.get(key); if (value) sessionStorage.setItem(key, value); });
  }
  function trafficSource(){
    const raw = (params().get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) return raw;
    return localStorage.getItem('fm_src') || 'site';
  }
  function withParams(href, values){
    const url = new URL(href, location.href);
    Object.entries(values).forEach(([key,value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    });
    return url.pathname + (url.search ? `?${url.searchParams.toString()}` : '') + url.hash;
  }
  function amazonUrl(lang, placement){
    const asin = cfg.asins && (cfg.asins[lang] || cfg.asins.en);
    if (!asin) return null;
    const cc = storeCountry();
    localStorage.setItem('amz_cc', cc);
    const src = trafficSource();
    const query = new URLSearchParams({utm_source:src,utm_medium:`book${cfg.number}_${lang}`,utm_campaign:'readthrough',utm_content:placement,src});
    UTM_KEYS.forEach(key => { const value = params().get(key) || sessionStorage.getItem(key); if (value && !query.has(key)) query.set(key, value); });
    return `https://www.amazon.${AMZ_TLD[cc] || 'com'}/dp/${asin}?${query.toString()}`;
  }

  let lang = initialLang();
  let trackingBound = false;

  function track(name, extra){
    const ctx={page_path:location.pathname,page_location:location.href,lang,cc:storeCountry(),src:trafficSource(),book_id:cfg.id};
    UTM_KEYS.forEach(key => { const value = params().get(key) || sessionStorage.getItem(key); if (value) ctx[key] = value; });
    try { window.gtag && window.gtag('event', name, Object.assign(ctx, extra || {})); } catch (_) {}
  }

  function render(){
    const t = cfg.i18n[lang] || cfg.i18n.en;
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    if (t.page_title) document.title = t.page_title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta && t.meta_desc) meta.content = t.meta_desc;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(t, key)) el.textContent = t[key];
    });

    const cover = document.getElementById('bookCover');
    if (cover) {
      cover.src = `${ASSET_ROOT}/${lang}/cover${cfg.number}.webp`;
      cover.alt = t.cover_alt || t.title || `Kiki Moon — Book ${cfg.number}`;
    }

    document.querySelectorAll('.lang-switch button[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    const src = trafficSource();
    const home = document.querySelector('.nav-home');
    if (home) home.href = withParams('../../index.html', {lang,src});
    document.querySelectorAll('.nav-kids').forEach(el => { el.href = withParams('../../kids/', {lang,src}); });
    document.querySelectorAll('.nav-collection').forEach(el => { el.href = withParams('../index.html', {lang,src}); });

    const mainBuy = document.getElementById('buyBtn');
    const stickyBuy = document.getElementById('buyBtnSticky');
    const mainUrl = amazonUrl(lang, 'hero_btn');
    const stickyUrl = amazonUrl(lang, 'sticky_btn');
    if (mainBuy && mainUrl) mainBuy.href = mainUrl;
    if (stickyBuy && stickyUrl) stickyBuy.href = stickyUrl;
  }

  function bindTracking(){
    if (trackingBound) return;
    trackingBound = true;
    track('view_book', {page:`book${cfg.number}`});
    [['buyBtn','hero'],['buyBtnSticky','sticky']].forEach(([id,placement]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', () => track('click_buy', {placement,destination:'amazon',href:el.href}), {passive:true});
    });
    const home = document.querySelector('.nav-home');
    if (home) home.addEventListener('click', () => track('click_nav', {item:'home'}), {passive:true});
    document.querySelectorAll('.nav-kids').forEach(el => el.addEventListener('click', () => track('click_nav',{item:'kids'}), {passive:true}));
    document.querySelectorAll('.nav-collection').forEach(el => el.addEventListener('click', () => track('click_nav',{item:'collection'}), {passive:true}));
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.lang-switch button[data-lang]');
    if (!button) return;
    const next = normLang(button.dataset.lang);
    if (next === lang) return;
    lang = next;
    render();
    track('select_language', {language:lang});
  });

  document.addEventListener('DOMContentLoaded', () => {
    initAttribution();
    const clean = new URL(location.href);
    if (clean.searchParams.has('lang')) {
      clean.searchParams.delete('lang');
      history.replaceState({}, '', clean.pathname + clean.search + clean.hash);
    }
    render();
    bindTracking();
  });
})();
