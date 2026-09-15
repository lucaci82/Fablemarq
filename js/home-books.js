(() => {
  'use strict';

  const chunks = [
    'assets/home/collections-final-01.b64',
    'assets/home/collections-final-02.b64',
    'assets/home/collections-final-03.b64',
    'assets/home/collections-final-04.b64',
    'assets/home/collections-final-05.b64',
    'assets/home/collections-final-06.b64',
    'assets/home/collections-final-07.b64',
    'assets/home/collections-final-08.b64'
  ];

  const labels = {
    it: { kids: 'Scopri Kids', gamebooks: 'Scopri Gamebooks' },
    en: { kids: 'Discover Kids', gamebooks: 'Discover Gamebooks' },
    es: { kids: 'Descubre Kids', gamebooks: 'Descubre Gamebooks' }
  };

  const normalizeLang = value => {
    const lang = String(value || '').toLowerCase().slice(0, 2);
    return ['it', 'en', 'es'].includes(lang) ? lang : 'it';
  };

  function currentLang() {
    const active = document.querySelector('.lang-switch-home button[data-lang][aria-pressed="true"]');
    if (active?.dataset.lang) return normalizeLang(active.dataset.lang);
    return normalizeLang(document.documentElement.lang || window.PREFERRED_LANG || 'it');
  }

  function applyArtworkLanguage(lang = currentLang()) {
    const stage = document.querySelector('.home-books-stage');
    if (!stage) return;

    const next = normalizeLang(lang);
    stage.classList.remove('lang-it', 'lang-en', 'lang-es');
    stage.classList.add(`lang-${next}`);
    stage.dataset.artworkLang = next;

    const kids = stage.querySelector('.home-book-hotspot--kids');
    const gamebooks = stage.querySelector('.home-book-hotspot--gamebooks');
    if (kids) kids.setAttribute('aria-label', labels[next].kids);
    if (gamebooks) gamebooks.setAttribute('aria-label', labels[next].gamebooks);
  }

  async function loadBooks() {
    const img = document.getElementById('homeBooksImage');
    if (!img) return;

    applyArtworkLanguage();

    try {
      const parts = await Promise.all(chunks.map(url =>
        fetch(url, { cache: 'force-cache' }).then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.text();
        })
      ));

      img.onload = () => img.classList.add('is-ready');
      img.src = `data:image/webp;base64,${parts.join('')}`;
    } catch (error) {
      console.error('Fablemarq collection artwork failed to load', error);
    }
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.lang-switch-home button[data-lang]');
    if (!button) return;
    requestAnimationFrame(() => applyArtworkLanguage(button.dataset.lang));
  });

  const langObserver = new MutationObserver(() => applyArtworkLanguage());
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBooks, { once: true });
  } else {
    loadBooks();
  }
})();
