(() => {
  'use strict';

  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };

  const params = new URLSearchParams(location.search);
  const urlLang = params.get('lang');
  const manualLang = localStorage.getItem('fm_lang');
  const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  const lang = normLang(urlLang || manualLang || browserLang);

  // Keep the legacy key in sync because existing page scripts read it.
  localStorage.setItem('lang', lang);
  window.PREFERRED_LANG = lang;
  document.documentElement.lang = lang;

  // Any explicit click on IT / EN / ES becomes a persistent user preference.
  document.addEventListener('click', event => {
    const button = event.target.closest('button[data-lang]');
    if (!button) return;
    const selected = normLang(button.dataset.lang);
    localStorage.setItem('fm_lang', selected);
    localStorage.setItem('lang', selected);
    window.PREFERRED_LANG = selected;
  }, true);
})();
