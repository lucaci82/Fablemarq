(() => {
  'use strict';

  const core = window.FMCore;
  const I18N = {
    it:{
      pageTitle:'Fablemarq — Mondi narrativi, libri illustrati e Gamebooks',description:'Fablemarq è un marchio editoriale indipendente che crea mondi narrativi: libri illustrati per bambini e Gamebooks interattivi per adulti.',skip:'Salta al contenuto',navHome:'Home',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq',heroTitleMain:'Storie che non restano',heroTitleAccent:'sulla pagina.',heroSub:'Mondi da immaginare. Storie da vivere. Esperienze da ricordare.',heroPrimary:'Scopri Fablemarq',heroSecondary:'Esplora i nostri mondi',sceneNote:'Un mondo. Infinite storie.',
      chooseKicker:'I mondi Fablemarq',chooseTitle:'Un marchio. Due modi di entrare nella storia.',chooseIntro:'Kids e Gamebooks hanno atmosfere diverse, ma condividono la stessa firma editoriale Fablemarq.',kidsEyebrow:'Fablemarq Kids',kidsTitle:'Storie per crescere immaginando.',kidsText:'Libri illustrati, personaggi e mondi narrativi pensati per affascinare i bambini e offrire ai genitori un’esperienza editoriale curata.',kidsSeries:'Kiki Moon · Il primo universo Fablemarq Kids',kidsExplore:'Entra in Kids',gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Non segui la storia. Decidi dove va.',gameText:'Crime, thriller, survival, horror e altri mondi interattivi nei quali decisioni e conseguenze cambiano realmente il percorso.',gameExplore:'Entra in Gamebooks',
      featuredKicker:'Dal mondo Fablemarq',featuredTitle:'Opere selezionate',featuredIntro:'Tre titoli scelti per raccontare, in modo essenziale, i diversi modi di essere Fablemarq.',kikiLabel:'Fablemarq Kids · Kiki Moon',kikiTitle:'La Stella Perduta',kikiFullTitle:'Kiki Moon — La Stella Perduta',kikiText:'Un viaggio tra amicizia, coraggio e meraviglia, dove la fantasia illumina la strada.',kiki2FullTitle:'Kiki Moon — Il Segreto di Snarfel',details:'Scopri il libro',available:'Disponibile',crimeLabel:'Fablemarq Gamebooks · Crime',crimeTitle:"L'ACCUSATO",surviveLabel:'Fablemarq Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',development:'In sviluppo',gamebooksProjectCta:'Scopri il progetto',
      brandKicker:'Il nostro manifesto',brandTitle:'Non pubblichiamo solo storie. Costruiamo mondi.',brandText:'Ogni progetto Fablemarq nasce per avere una propria voce, una propria atmosfera e un modo preciso di entrare nella memoria del lettore.',principle1Title:'Identità',principle1Text:'Storie originali con una voce unica.',principle2Title:'Esperienza',principle2Text:'Letture che lasciano il segno.',principle3Title:'Qualità editoriale',principle3Text:'Cura in ogni dettaglio.',principle4Title:'Continuità',principle4Text:'Mondi che crescono nel tempo.',
      footerBrand:'Fablemarq',about:'Chi siamo',footer:'Fablemarq — Independent publishing studio',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq — Narrative worlds, illustrated books & Gamebooks',description:'Fablemarq is an independent publishing brand creating narrative worlds: illustrated books for children and interactive Gamebooks for adults.',skip:'Skip to content',navHome:'Home',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq',heroTitleMain:'Stories that do not stay',heroTitleAccent:'on the page.',heroSub:'Worlds to imagine. Stories to experience. Experiences to remember.',heroPrimary:'Discover Fablemarq',heroSecondary:'Explore our worlds',sceneNote:'One world. Infinite stories.',
      chooseKicker:'Fablemarq worlds',chooseTitle:'One brand. Two ways into the story.',chooseIntro:'Kids and Gamebooks have different atmospheres while sharing the same Fablemarq editorial signature.',kidsEyebrow:'Fablemarq Kids',kidsTitle:'Stories for growing through imagination.',kidsText:'Illustrated books, characters and narrative worlds created to delight children and offer parents a carefully crafted publishing experience.',kidsSeries:'Kiki Moon · The first Fablemarq Kids universe',kidsExplore:'Enter Kids',gameEyebrow:'Fablemarq Gamebooks',gameTitle:'You do not follow the story. You decide where it goes.',gameText:'Crime, thriller, survival, horror and other interactive worlds where decisions and consequences genuinely change the path.',gameExplore:'Enter Gamebooks',
      featuredKicker:'From the world of Fablemarq',featuredTitle:'Selected works',featuredIntro:'Three titles chosen to show, with clarity, the different ways of being Fablemarq.',kikiLabel:'Fablemarq Kids · Kiki Moon',kikiTitle:'The Lost Star',kikiFullTitle:'Kiki Moon — The Lost Star',kikiText:'A journey through friendship, courage and wonder, where imagination lights the way.',kiki2FullTitle:"Kiki Moon — Snarfel's Secret",details:'Discover the book',available:'Available',crimeLabel:'Fablemarq Gamebooks · Crime',crimeTitle:"L'ACCUSATO",surviveLabel:'Fablemarq Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',development:'In development',gamebooksProjectCta:'Explore the project',
      brandKicker:'Our manifesto',brandTitle:'We do not just publish stories. We build worlds.',brandText:'Every Fablemarq project is designed to have its own voice, atmosphere and a precise way of staying in the reader’s memory.',principle1Title:'Identity',principle1Text:'Original stories with a distinctive voice.',principle2Title:'Experience',principle2Text:'Reading experiences that leave a mark.',principle3Title:'Editorial quality',principle3Text:'Care in every detail.',principle4Title:'Continuity',principle4Text:'Worlds designed to grow over time.',
      footerBrand:'Fablemarq',about:'About us',footer:'Fablemarq — Independent publishing studio',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq — Mundos narrativos, libros ilustrados y Gamebooks',description:'Fablemarq es una marca editorial independiente que crea mundos narrativos: libros ilustrados para niños y Gamebooks interactivos para adultos.',skip:'Saltar al contenido',navHome:'Inicio',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq',heroTitleMain:'Historias que no se quedan',heroTitleAccent:'en la página.',heroSub:'Mundos para imaginar. Historias para vivir. Experiencias para recordar.',heroPrimary:'Descubre Fablemarq',heroSecondary:'Explora nuestros mundos',sceneNote:'Un mundo. Infinitas historias.',
      chooseKicker:'Los mundos Fablemarq',chooseTitle:'Una marca. Dos formas de entrar en la historia.',chooseIntro:'Kids y Gamebooks tienen atmósferas distintas, pero comparten la misma firma editorial Fablemarq.',kidsEyebrow:'Fablemarq Kids',kidsTitle:'Historias para crecer imaginando.',kidsText:'Libros ilustrados, personajes y mundos narrativos pensados para fascinar a los niños y ofrecer a los padres una experiencia editorial cuidada.',kidsSeries:'Kiki Moon · El primer universo Fablemarq Kids',kidsExplore:'Entra en Kids',gameEyebrow:'Fablemarq Gamebooks',gameTitle:'No sigues la historia. Decides hacia dónde va.',gameText:'Crime, thriller, survival, horror y otros mundos interactivos donde las decisiones y sus consecuencias cambian realmente el recorrido.',gameExplore:'Entra en Gamebooks',
      featuredKicker:'Del mundo Fablemarq',featuredTitle:'Obras seleccionadas',featuredIntro:'Tres títulos elegidos para mostrar, de forma esencial, las distintas maneras de ser Fablemarq.',kikiLabel:'Fablemarq Kids · Kiki Moon',kikiTitle:'La Estrella Perdida',kikiFullTitle:'Kiki Moon — La Estrella Perdida',kikiText:'Un viaje entre amistad, valentía y maravilla, donde la imaginación ilumina el camino.',kiki2FullTitle:'Kiki Moon — El Secreto de Snarfel',details:'Descubre el libro',available:'Disponible',crimeLabel:'Fablemarq Gamebooks · Crime',crimeTitle:"L'ACCUSATO",surviveLabel:'Fablemarq Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',development:'En desarrollo',gamebooksProjectCta:'Descubre el proyecto',
      brandKicker:'Nuestro manifiesto',brandTitle:'No publicamos solo historias. Construimos mundos.',brandText:'Cada proyecto Fablemarq nace para tener una voz propia, una atmósfera propia y una forma precisa de permanecer en la memoria del lector.',principle1Title:'Identidad',principle1Text:'Historias originales con una voz única.',principle2Title:'Experiencia',principle2Text:'Lecturas que dejan huella.',principle3Title:'Calidad editorial',principle3Text:'Cuidado en cada detalle.',principle4Title:'Continuidad',principle4Text:'Mundos que crecen con el tiempo.',
      footerBrand:'Fablemarq',about:'Quiénes somos',footer:'Fablemarq — Independent publishing studio',language:'Idioma'
    }
  };

  let lang = core ? core.selectedLanguage() : (window.PREFERRED_LANG || 'en');
  let catalog = [];
  const track = (name,extra={}) => core?.track(name,extra);

  function setMenu(open){
    const toggle=document.querySelector('.home-menu-toggle');
    const menu=document.getElementById('homeMenu');
    if(!toggle||!menu)return;
    toggle.setAttribute('aria-expanded',String(open));
    menu.classList.toggle('is-open',open);
    menu.setAttribute('aria-hidden',String(!open));
  }

  function renderBookData(){
    if(!catalog.length)return;
    document.querySelectorAll('[data-book-slug]').forEach(card=>{
      const book=catalog.find(item=>item.slug===card.dataset.bookSlug);if(!book)return;
      const hook=card.querySelector('[data-book-hook]');if(hook)hook.textContent=book.hook[lang]||book.hook.en||book.hook.it;
    });
  }

  function render(){
    const t=I18N[lang]||I18N.en;
    core?.setLanguage(lang);
    document.title=t.pageTitle;
    const desc=document.querySelector('meta[name="description"]');if(desc)desc.content=t.description;
    const skip=document.querySelector('.skip-link');if(skip)skip.textContent=t.skip;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(Object.prototype.hasOwnProperty.call(t,key))el.textContent=t[key];});
    document.querySelectorAll('[data-kiki-cover]').forEach(img=>{const number=img.dataset.kikiCover==='2'?2:1;img.src=`assets/${lang}/cover${number}.webp`;if(img.getAttribute('alt'))img.alt=number===2?t.kiki2FullTitle:t.kikiFullTitle;});
    renderBookData();
    core?.applyInternalLinks(lang);
    core?.syncLanguageSwitch(lang,'.lang-switch-home',t.language);
  }

  async function loadCatalog(){
    try{const response=await fetch('data/gamebooks.json',{cache:'no-cache'});if(!response.ok)throw new Error('catalog');const data=await response.json();catalog=Array.isArray(data.books)?data.books:[];renderBookData();}
    catch(_){}
  }

  document.addEventListener('click',event=>{
    const menuToggle=event.target.closest('.home-menu-toggle');
    if(menuToggle){setMenu(menuToggle.getAttribute('aria-expanded')!=='true');return;}
    const langButton=event.target.closest('.lang-switch-home button[data-lang]');
    if(langButton){const next=core?core.normLang(langButton.dataset.lang):langButton.dataset.lang;if(next!==lang){lang=next;render();track('select_language',{language:lang});}return;}
    const mobileLink=event.target.closest('.home-mobile-menu a');if(mobileLink)setMenu(false);
    const world=event.target.closest('[data-world]');if(world)track('select_world',{world:world.dataset.world});
    const nav=event.target.closest('[data-nav]');if(nav)track('click_nav',{item:nav.dataset.nav});
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false);});
  window.addEventListener('resize',()=>{if(window.innerWidth>760)setMenu(false);});
  document.addEventListener('DOMContentLoaded',()=>{core?.initAttribution();render();loadCatalog();track('view_home');});
})();
