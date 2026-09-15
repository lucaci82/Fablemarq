(() => {
  'use strict';

  const core = window.FMCore;
  const I18N = {
    it:{
      pageTitle:'Fablemarq — Mondi narrativi, libri illustrati e Gamebooks',description:'Fablemarq è un marchio editoriale indipendente che crea mondi narrativi: libri illustrati per bambini e Gamebooks interattivi per adulti.',skip:'Salta al contenuto',navHome:'Home',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq · Editore indipendente',heroTitleMain:'Storie che non restano',heroTitleAccent:'sulla pagina.',heroSub:'Mondi da immaginare. Storie da scegliere. Esperienze da ricordare.',heroPrimary:'Scopri i mondi',heroSecondary:'Scopri Fablemarq',sceneNote:'Storie. Mondi. Scelte.',
      chooseKicker:'I mondi Fablemarq',chooseTitle:'Un marchio. Due modi di entrare nella storia.',chooseIntro:'Kids e Gamebooks hanno atmosfere diverse, ma condividono la stessa firma editoriale Fablemarq.',kidsEyebrow:'Fablemarq Kids',kidsTitle:'Storie per crescere immaginando.',kidsText:'Libri illustrati, personaggi memorabili e mondi narrativi pensati per affascinare i bambini e rassicurare i genitori. Kiki Moon è il primo universo Fablemarq Kids.',kidsExplore:'Entra in Kids',gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Non segui la storia. Decidi dove va.',gameText:'Thriller, crime, horror, survival e altri mondi interattivi in cui decisioni e conseguenze cambiano il percorso.',gameExplore:'Entra in Gamebooks',
      featuredKicker:'Opere selezionate',featuredTitle:'Tre storie. Tre modi di essere Fablemarq.',featuredIntro:'Una selezione essenziale dalle nostre divisioni editoriali: non un catalogo, ma tre esempi della nostra idea di esperienza narrativa.',kikiLabel:'Fablemarq Kids · Kiki Moon',kikiTitle:'La Stella Perduta',kikiFullTitle:'Kiki Moon — La Stella Perduta',kikiText:'Una storia illustrata per lettori dai 6 ai 10 anni.',kiki2FullTitle:'Kiki Moon — Il Segreto di Snarfel',details:'Scopri il libro',available:'Disponibile',crimeLabel:'Fablemarq Gamebooks · Crime',crimeTitle:"L'ACCUSATO",surviveLabel:'Fablemarq Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',development:'In sviluppo',gamebooksProjectCta:'Scopri il progetto',
      brandKicker:'La nostra idea editoriale',brandTitle:'Non pubblichiamo solo storie. Costruiamo mondi.',brandText:'Ogni progetto Fablemarq nasce per avere una propria voce, una propria atmosfera e un modo preciso di entrare nella memoria del lettore.',principle1Title:'Identità',principle1Text:'Ogni collana deve essere riconoscibile prima ancora di aprire il libro.',principle2Title:'Esperienza',principle2Text:'Il formato deve cambiare il modo in cui il lettore vive la storia, non soltanto decorarla.',principle3Title:'Qualità editoriale',principle3Text:'Testo, immagini, impaginazione e interfaccia devono sostenere lo stesso livello di cura.',principle4Title:'Continuità',principle4Text:'Costruiamo universi e linee pensati per crescere senza perdere la propria firma.',
      footerBrand:'Fablemarq',about:'Chi siamo',footer:'Fablemarq — Independent publishing studio',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq — Narrative worlds, illustrated books & Gamebooks',description:'Fablemarq is an independent publishing brand creating narrative worlds: illustrated books for children and interactive Gamebooks for adults.',skip:'Skip to content',navHome:'Home',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq · Independent publisher',heroTitleMain:'Stories that do not stay',heroTitleAccent:'on the page.',heroSub:'Worlds to imagine. Stories to choose. Experiences to remember.',heroPrimary:'Explore the worlds',heroSecondary:'Discover Fablemarq',sceneNote:'Stories. Worlds. Choices.',
      chooseKicker:'Fablemarq worlds',chooseTitle:'One brand. Two ways into the story.',chooseIntro:'Kids and Gamebooks have different atmospheres while sharing the same Fablemarq editorial signature.',kidsEyebrow:'Fablemarq Kids',kidsTitle:'Stories for growing through imagination.',kidsText:'Illustrated books, memorable characters and narrative worlds created to delight children and earn parents’ trust. Kiki Moon is the first Fablemarq Kids universe.',kidsExplore:'Enter Kids',gameEyebrow:'Fablemarq Gamebooks',gameTitle:'You do not follow the story. You decide where it goes.',gameText:'Thriller, crime, horror, survival and other interactive worlds where decisions and consequences change the path.',gameExplore:'Enter Gamebooks',
      featuredKicker:'Selected works',featuredTitle:'Three stories. Three ways to be Fablemarq.',featuredIntro:'A focused selection from our publishing divisions: not a catalog, but three examples of our approach to narrative experience.',kikiLabel:'Fablemarq Kids · Kiki Moon',kikiTitle:'The Lost Star',kikiFullTitle:'Kiki Moon — The Lost Star',kikiText:'A full-color illustrated story for readers ages 6–10.',kiki2FullTitle:"Kiki Moon — Snarfel's Secret",details:'Discover the book',available:'Available',crimeLabel:'Fablemarq Gamebooks · Crime',crimeTitle:"L'ACCUSATO",surviveLabel:'Fablemarq Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',development:'In development',gamebooksProjectCta:'Explore the project',
      brandKicker:'Our publishing idea',brandTitle:'We do not just publish stories. We build worlds.',brandText:'Every Fablemarq project is designed to have its own voice, atmosphere and a precise way of staying in the reader’s memory.',principle1Title:'Identity',principle1Text:'Every line should be recognizable before the book is even opened.',principle2Title:'Experience',principle2Text:'Format should change the way a reader experiences the story, not merely decorate it.',principle3Title:'Editorial quality',principle3Text:'Text, imagery, layout and interface should sustain the same level of care.',principle4Title:'Continuity',principle4Text:'We build worlds and lines designed to grow without losing their signature.',
      footerBrand:'Fablemarq',about:'About us',footer:'Fablemarq — Independent publishing studio',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq — Mundos narrativos, libros ilustrados y Gamebooks',description:'Fablemarq es una marca editorial independiente que crea mundos narrativos: libros ilustrados para niños y Gamebooks interactivos para adultos.',skip:'Saltar al contenido',navHome:'Inicio',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq · Editorial independiente',heroTitleMain:'Historias que no se quedan',heroTitleAccent:'en la página.',heroSub:'Mundos para imaginar. Historias para elegir. Experiencias para recordar.',heroPrimary:'Explora los mundos',heroSecondary:'Descubre Fablemarq',sceneNote:'Historias. Mundos. Elecciones.',
      chooseKicker:'Los mundos Fablemarq',chooseTitle:'Una marca. Dos formas de entrar en la historia.',chooseIntro:'Kids y Gamebooks tienen atmósferas distintas, pero comparten la misma firma editorial Fablemarq.',kidsEyebrow:'Fablemarq Kids',kidsTitle:'Historias para crecer imaginando.',kidsText:'Libros ilustrados, personajes memorables y mundos narrativos pensados para fascinar a los niños y transmitir confianza a los padres. Kiki Moon es el primer universo Fablemarq Kids.',kidsExplore:'Entra en Kids',gameEyebrow:'Fablemarq Gamebooks',gameTitle:'No sigues la historia. Decides hacia dónde va.',gameText:'Thriller, crime, horror, survival y otros mundos interactivos donde las decisiones y sus consecuencias cambian el camino.',gameExplore:'Entra en Gamebooks',
      featuredKicker:'Obras seleccionadas',featuredTitle:'Tres historias. Tres formas de ser Fablemarq.',featuredIntro:'Una selección esencial de nuestras divisiones editoriales: no un catálogo, sino tres ejemplos de nuestra idea de experiencia narrativa.',kikiLabel:'Fablemarq Kids · Kiki Moon',kikiTitle:'La Estrella Perdida',kikiFullTitle:'Kiki Moon — La Estrella Perdida',kikiText:'Una historia ilustrada a todo color para lectores de 6 a 10 años.',kiki2FullTitle:'Kiki Moon — El Secreto de Snarfel',details:'Descubre el libro',available:'Disponible',crimeLabel:'Fablemarq Gamebooks · Crime',crimeTitle:"L'ACCUSATO",surviveLabel:'Fablemarq Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',development:'En desarrollo',gamebooksProjectCta:'Descubre el proyecto',
      brandKicker:'Nuestra idea editorial',brandTitle:'No publicamos solo historias. Construimos mundos.',brandText:'Cada proyecto Fablemarq nace para tener una voz propia, una atmósfera propia y una forma precisa de permanecer en la memoria del lector.',principle1Title:'Identidad',principle1Text:'Cada colección debe ser reconocible antes incluso de abrir el libro.',principle2Title:'Experiencia',principle2Text:'El formato debe cambiar la forma en que el lector vive la historia, no limitarse a decorarla.',principle3Title:'Calidad editorial',principle3Text:'Texto, imágenes, maquetación e interfaz deben sostener el mismo nivel de cuidado.',principle4Title:'Continuidad',principle4Text:'Construimos universos y líneas pensados para crecer sin perder su firma.',
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