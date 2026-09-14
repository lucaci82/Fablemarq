(() => {
  'use strict';

  const valid = new Set(['crime','survive','thriller','mystery','horror','sci-fi','real-life']);
  const counts = {
    it: n => `${n} ${n === 1 ? 'titolo' : 'titoli'}`,
    en: n => `${n} ${n === 1 ? 'title' : 'titles'}`,
    es: n => `${n} ${n === 1 ? 'título' : 'títulos'}`
  };
  let currentFilter = 'all';
  let currentQuery = '';

  const normFilter = value => valid.has(value) ? value : 'all';
  const normText = value => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .trim();
  const currentLang = () => {
    const lang = (document.documentElement.lang || 'it').slice(0,2);
    return counts[lang] ? lang : 'en';
  };

  function searchableText(card){
    const title = card.querySelector('h3')?.textContent || '';
    const hook = card.querySelector('p')?.textContent || '';
    const series = card.querySelector('.gamebook-card__series')?.textContent || card.dataset.series || '';
    return normText(`${title} ${hook} ${series} ${card.dataset.series || ''}`);
  }

  function updateSummary(visible){
    const count = document.getElementById('gamebookResultCount');
    if (count) count.textContent = counts[currentLang()](visible);
    const empty = document.getElementById('gamebookEmpty');
    if (empty) empty.hidden = visible !== 0;
  }

  function apply(filter,{hash=false,track=false}={}){
    currentFilter = normFilter(filter);
    const query = normText(currentQuery);
    let visible = 0;

    document.querySelectorAll('[data-book]').forEach(card => {
      const matchesSeries = currentFilter === 'all' || card.dataset.series === currentFilter;
      const matchesSearch = !query || searchableText(card).includes(query);
      const show = matchesSeries && matchesSearch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    document.querySelectorAll('.gamebook-filter[data-filter]').forEach(btn => {
      const active = btn.dataset.filter === currentFilter;
      btn.classList.toggle('is-active',active);
      btn.setAttribute('aria-pressed',String(active));
    });

    updateSummary(visible);

    if (hash){
      const url = new URL(location.href);
      url.hash = currentFilter === 'all' ? 'catalogo' : currentFilter;
      history.replaceState(null,'',url.pathname + url.search + url.hash);
    }
    if (track && window.gtag){
      window.gtag('event','filter_gamebooks',{series:currentFilter,page_path:location.pathname});
    }
  }

  function fromHash({scroll=false}={}){
    const value = location.hash.slice(1).toLowerCase();
    currentFilter = valid.has(value) ? value : 'all';
    apply(currentFilter);
    if (scroll && valid.has(value)){
      requestAnimationFrame(() => document.getElementById('catalogo')?.scrollIntoView({block:'start'}));
    }
  }

  document.addEventListener('click',event => {
    const btn = event.target.closest('.gamebook-filter[data-filter]');
    if (!btn) return;
    apply(btn.dataset.filter,{hash:true,track:true});
  });

  document.addEventListener('input',event => {
    if (event.target.id !== 'gamebookSearch') return;
    currentQuery = event.target.value;
    apply(currentFilter);
  });

  document.addEventListener('search',event => {
    if (event.target.id !== 'gamebookSearch') return;
    currentQuery = event.target.value;
    apply(currentFilter);
  });

  document.addEventListener('DOMContentLoaded',() => {
    const search = document.getElementById('gamebookSearch');
    if (search) currentQuery = search.value;
    fromHash({scroll:true});
    new MutationObserver(() => apply(currentFilter)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  });

  window.addEventListener('hashchange',() => fromHash({scroll:true}));
})();