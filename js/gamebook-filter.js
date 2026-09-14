(() => {
  'use strict';
  const valid=new Set(['crime','survive','thriller','mystery','horror','sci-fi','real-life']);
  const labels={it:'Tutti',en:'All',es:'Todos'};
  const norm=v=>valid.has(v)?v:'all';
  function setAllLabel(){const lang=(document.documentElement.lang||'it').slice(0,2);const el=document.querySelector('[data-filter-all]');if(el)el.textContent=labels[lang]||labels.en;}
  function apply(filter,{hash=false,track=false}={}){
    filter=norm(filter);
    document.querySelectorAll('[data-book]').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.series!==filter;});
    document.querySelectorAll('.gamebook-filter[data-filter]').forEach(btn=>{const active=btn.dataset.filter===filter;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active));});
    if(hash){const url=new URL(location.href);url.hash=filter==='all'?'catalogo':filter;history.replaceState(null,'',url.pathname+url.search+url.hash);}
    if(track&&window.gtag)window.gtag('event','filter_gamebooks',{series:filter,page_path:location.pathname});
  }
  function fromHash(){const value=location.hash.slice(1).toLowerCase();if(valid.has(value)){apply(value);requestAnimationFrame(()=>document.getElementById('catalogo')?.scrollIntoView({block:'start'}));}else apply('all');}
  document.addEventListener('click',e=>{const btn=e.target.closest('.gamebook-filter[data-filter]');if(!btn)return;apply(btn.dataset.filter,{hash:true,track:true});});
  document.addEventListener('DOMContentLoaded',()=>{setAllLabel();fromHash();new MutationObserver(setAllLabel).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});});
  window.addEventListener('hashchange',fromHash);
})();
