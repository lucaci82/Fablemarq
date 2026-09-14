(() => {
  'use strict';

  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const INTERNAL_SRC = new Set(['site','home','kids','gamebooks','collection','book','preview','hero','grid','b1','b2','b3']);
  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };
  const params = () => new URLSearchParams(location.search);
  const selectedLanguage = () => normLang(params().get('lang') || localStorage.getItem('fm_lang') || localStorage.getItem('lang') || ((navigator.languages && navigator.languages[0]) || navigator.language) || 'en');
  const setLanguage = value => {
    const lang = normLang(value);
    localStorage.setItem('fm_lang',lang);
    localStorage.setItem('lang',lang);
    window.PREFERRED_LANG = lang;
    document.documentElement.lang = lang;
    return lang;
  };
  const initAttribution = () => {
    const q = params();
    const raw = (q.get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) localStorage.setItem('fm_src',raw);
    UTM_KEYS.forEach(key => { const value = q.get(key); if (value) sessionStorage.setItem(key,value); });
  };
  const trafficSource = () => {
    const raw = (params().get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) return raw;
    return localStorage.getItem('fm_src') || 'site';
  };
  const applyInternalLinks = (lang,selector='[data-internal]') => {
    const source = trafficSource();
    document.querySelectorAll(selector).forEach(el => {
      const raw = el.dataset.baseHref || el.getAttribute('href');
      if (!raw) return;
      if (!el.dataset.baseHref) el.dataset.baseHref = raw;
      const url = new URL(raw,location.href);
      url.searchParams.set('lang',normLang(lang));
      if (source !== 'site') url.searchParams.set('src',source);
      el.href = url.pathname + '?' + url.searchParams.toString() + url.hash;
    });
  };
  const syncLanguageSwitch = (lang,selector,label) => {
    document.querySelectorAll(`${selector} button[data-lang]`).forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
    if (label) document.querySelectorAll(selector).forEach(el => el.setAttribute('aria-label',label));
  };
  const track = (name,extra={}) => {
    const ctx = {page_path:location.pathname,lang:document.documentElement.lang || selectedLanguage(),src:trafficSource()};
    UTM_KEYS.forEach(key => { const value = params().get(key) || sessionStorage.getItem(key); if (value) ctx[key] = value; });
    try { window.gtag && window.gtag('event',name,Object.assign(ctx,extra)); } catch (_) {}
  };

  const initial = setLanguage(selectedLanguage());
  window.FMCore = Object.freeze({normLang,params,selectedLanguage,setLanguage,initAttribution,trafficSource,applyInternalLinks,syncLanguageSwitch,track,UTM_KEYS});

  document.addEventListener('click',event => {
    const button = event.target.closest('button[data-lang]');
    if (!button) return;
    setLanguage(button.dataset.lang);
  },true);
})();
