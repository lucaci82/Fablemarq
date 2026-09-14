(() => {
  'use strict';

  const core = window.FMCore;
  const UI = {
    it:{skip:'Salta al contenuto',navKids:'Kids',navGamebooks:'Gamebooks',back:'Torna ai Gamebooks',status:'In sviluppo',projectKicker:'Il progetto',projectTitle:'Questo Gamebook è in sviluppo.',projectText:'La pagina raccoglie le informazioni editoriali confermate. Sinossi estesa, anteprima e pulsante di acquisto verranno aggiunti solo quando saranno realmente disponibili.',related:'Altri mondi Gamebooks',footer:'Fablemarq Gamebooks — A Fablemarq publishing division',language:'Lingua'},
    en:{skip:'Skip to content',navKids:'Kids',navGamebooks:'Gamebooks',back:'Back to Gamebooks',status:'In development',projectKicker:'The project',projectTitle:'This Gamebook is in development.',projectText:'This page contains only confirmed editorial information. A full synopsis, preview and purchase button will be added only when they are actually available.',related:'More Gamebook worlds',footer:'Fablemarq Gamebooks — A Fablemarq publishing division',language:'Language'},
    es:{skip:'Saltar al contenido',navKids:'Kids',navGamebooks:'Gamebooks',back:'Volver a Gamebooks',status:'En desarrollo',projectKicker:'El proyecto',projectTitle:'Este Gamebook está en desarrollo.',projectText:'Esta página reúne solo información editorial confirmada. La sinopsis ampliada, la vista previa y el botón de compra se añadirán únicamente cuando estén realmente disponibles.',related:'Otros mundos Gamebooks',footer:'Fablemarq Gamebooks — A Fablemarq publishing division',language:'Idioma'}
  };
  let lang = core ? core.selectedLanguage() : (window.PREFERRED_LANG || 'en');
  const slug = document.body.dataset.bookSlug || '';
  let catalog = [];
  let book = null;
  const track = (name,extra={}) => core?.track(name,Object.assign({division:'gamebooks',book_id:slug},extra));

  function renderRelated(){
    const rail=document.getElementById('relatedBooks');if(!rail||!book||!catalog.length)return;
    const related=catalog.filter(item=>item.slug!==book.slug).slice(0,3);
    rail.innerHTML=related.map(item=>`<a class="gamebook-related-card" href="../${item.slug}/" data-internal><img src="../../assets/gamebooks/${item.cover}" alt="" width="${item.width}" height="${item.height}" loading="lazy" decoding="async"><span>${item.seriesLabel}</span><strong>${item.title}</strong></a>`).join('');
  }

  function render(){
    const t=UI[lang]||UI.en;
    core?.setLanguage(lang);
    document.querySelectorAll('[data-ui]').forEach(el=>{const key=el.dataset.ui;if(Object.prototype.hasOwnProperty.call(t,key))el.textContent=t[key];});
    if(book){
      const hook=book.hook[lang]||book.hook.en||book.hook.it;document.title=`${book.title} — Fablemarq Gamebooks ${book.seriesLabel}`;
      const desc=document.querySelector('meta[name="description"]');if(desc)desc.content=hook;
      const ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=`${book.title} — Fablemarq Gamebooks`;
      const ogDesc=document.querySelector('meta[property="og:description"]');if(ogDesc)ogDesc.content=hook;
      const hookEl=document.querySelector('[data-book-hook]');if(hookEl)hookEl.textContent=hook;
    }
    core?.syncLanguageSwitch(lang,'.site-lang-switch',t.language);
    core?.applyInternalLinks(lang);
  }

  async function load(){
    try{const response=await fetch('../../data/gamebooks.json',{cache:'no-cache'});if(!response.ok)throw new Error('catalog');const data=await response.json();catalog=Array.isArray(data.books)?data.books:[];book=catalog.find(item=>item.slug===slug)||null;renderRelated();render();}
    catch(_){render();}
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest('.site-lang-switch button[data-lang]');
    if(button){const next=core?core.normLang(button.dataset.lang):button.dataset.lang;if(next!==lang){lang=next;render();track('select_language',{language:lang});}return;}
    const link=event.target.closest('a');if(link)track('click_nav',{href:link.getAttribute('href')||''});
  });
  document.addEventListener('DOMContentLoaded',()=>{core?.initAttribution();load();track('view_gamebook_detail');});
})();
