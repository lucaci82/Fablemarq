<!-- /js/lang-core.js -->
<script>
(function(){
  // --- Normalizza codice lingua
  function normLang(l){
    const s=(l||'').toLowerCase();
    if(s.startsWith('it')) return 'it';
    if(s.startsWith('es')) return 'es';
    return 'en';
  }

  // --- Bootstrap lingua: ?lang > localStorage > navigator
  const qs = new URLSearchParams(location.search);
  const urlL = qs.get('lang');
  const saved = localStorage.getItem('lang');
  const nav   = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  const L0    = normLang(urlL || saved || nav);

  document.documentElement.lang = L0;
  localStorage.setItem('lang', L0);
  window.PREFERRED_LANG = L0;

  // Pulisci la query una volta letta
  if (urlL){
    const u = new URL(location.href);
    u.searchParams.delete('lang');
    history.replaceState({}, '', u);
  }

  // --- Propaga ?lang e conserva eventuale ?src ai link interni
  function propagateLangSrc(selector='a[href^="/"]'){
    const lang = window.PREFERRED_LANG || 'en';
    const q = new URLSearchParams(location.search);
    document.querySelectorAll(selector).forEach(a=>{
      try{
        const u = new URL(a.getAttribute('href'), location.origin);
        if (!u.searchParams.get('lang')) u.searchParams.set('lang', lang);
        if (q.get('src') && !u.searchParams.get('src')) u.searchParams.set('src', q.get('src'));
        a.href = u.pathname + '?' + u.searchParams.toString();
      }catch(_){}
    });
  }

  // --- Evidenzia pillola lingua attiva
  function highlightActive(){
    const L = window.PREFERRED_LANG || 'en';
    document.querySelectorAll('.lang-switch button')
      .forEach(b => b.classList.toggle('active', b.dataset.lang === L));
  }

  // --- Cambia lingua globalmente e richiama la traduzione della pagina
  function setLang(newLang){
    const L = normLang(newLang);
    document.documentElement.lang = L;
    localStorage.setItem('lang', L);
    window.PREFERRED_LANG = L;
    highlightActive();
    if (typeof window.applyI18n === 'function') window.applyI18n(L);
    propagateLangSrc(); // aggiorna tutti i link interni con la lingua scelta
    // evento opzionale per chi deve reagire (es. ricostruire link Amazon)
    document.dispatchEvent(new CustomEvent('lang:changed', { detail:{ lang:L } }));
  }

  // --- Dominio Amazon dal paese (dalla lingua di sistema)
  function amazonDomainFromRegion(){
    const part = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').split('-')[1];
    const cc = (part || '').toUpperCase();
    if (cc === 'IT') return 'amazon.it';
    if (cc === 'ES') return 'amazon.es';
    if (cc === 'MX') return 'amazon.com.mx';
    if (cc === 'CA') return 'amazon.ca';
    if (cc === 'AU') return 'amazon.com.au';
    if (cc === 'FR') return 'amazon.fr';
    if (cc === 'DE') return 'amazon.de';
    if (cc === 'GB' || cc === 'UK') return 'amazon.co.uk';
    return 'amazon.com';
  }

  // --- Costruisci URL Amazon con UTM fissi e medium = b{N}_{lang}
  function buildAmazonUrl({asin, bookN, lang, extraParams}){
    const domain = amazonDomainFromRegion();
    const L = normLang(lang || (window.PREFERRED_LANG || 'en'));
    const utm = `utm_source=qr&utm_medium=b${bookN}_${L}&utm_campaign=readthrough`;
    let url = `https://${domain}/dp/${asin}?${utm}`;
    if (extraParams){
      const q = new URLSearchParams(extraParams);
      url += `&${q.toString()}`;
    }
    // conserva eventuale ?src=...
    const src = new URLSearchParams(location.search).get('src');
    if (src) url += `&src=${encodeURIComponent(src)}`;
    return url;
  }

  // --- Click delegato sul selettore lingua
  document.addEventListener('click', e=>{
    const btn = e.target.closest('.lang-switch button[data-lang]');
    if (!btn) return;
    e.preventDefault();
    setLang(btn.dataset.lang);
  });

  // --- All’avvio: sincronizza UI e traduci la pagina corrente
  document.addEventListener('DOMContentLoaded', ()=>{
    highlightActive();
    if (typeof window.applyI18n === 'function') window.applyI18n(window.PREFERRED_LANG || 'en');
    propagateLangSrc();
  });

  // --- Esponi API globali
  window.__setLang = setLang;
  window.propagateLangSrc = propagateLangSrc;
  window.buildAmazonUrl = buildAmazonUrl;
})();
</script>
