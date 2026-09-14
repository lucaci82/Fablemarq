(() => {
  'use strict';

  const core = window.FMCore;
  const I18N = {
    it:{
      pageTitle:'Fablemarq — Mondi narrativi, libri illustrati e Gamebooks',description:'Fablemarq è un marchio editoriale indipendente che crea mondi narrativi: libri illustrati per bambini e Gamebooks interattivi per adulti.',skip:'Salta al contenuto',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq · Editore indipendente',tagline:'Storie che non restano sulla pagina.',heroSub:'Fablemarq crea mondi narrativi da leggere, esplorare e vivere. Formati diversi, una sola firma editoriale.',heroPrimary:'Scopri Fablemarq',heroSecondary:'Esplora i nostri mondi',heroSignature:'Mondi distinti. Identità comune. Esperienze da ricordare.',
      brandKicker:'La nostra idea editoriale',brandTitle:'Non pubblichiamo soltanto storie. Costruiamo mondi.',brandText:'Ogni progetto Fablemarq nasce con una propria identità narrativa e visiva. Cambiano il pubblico, il tono e il modo di leggere; resta la stessa attenzione per esperienza, coerenza e riconoscibilità.',principle1Title:'Identità',principle1Text:'Ogni collana deve essere riconoscibile prima ancora di aprire il libro.',principle2Title:'Esperienza',principle2Text:'Il formato non è decorazione: deve cambiare il modo in cui il lettore vive la storia.',principle3Title:'Continuità',principle3Text:'Costruiamo universi e linee pensati per crescere senza perdere la propria firma.',
      chooseKicker:'I mondi Fablemarq',chooseTitle:'Un marchio. Esperienze diverse.',chooseIntro:'Ogni divisione ha un linguaggio proprio, ma appartiene allo stesso sistema editoriale Fablemarq.',kidsEyebrow:'Fablemarq Kids',kidsTitle:'Storie per crescere immaginando.',kidsText:'La divisione dedicata ai più giovani: libri illustrati, mondi narrativi e personaggi da ritrovare. Kiki Moon è il primo universo Fablemarq Kids.',kidsExplore:'Esplora Fablemarq Kids',gameEyebrow:'Fablemarq Gamebooks',gameTitle:'Non segui la storia. Decidi dove va.',gameText:'La divisione interattiva per adulti: thriller, crime, survival e altri mondi in cui decisioni e conseguenze cambiano il percorso.',gameExplore:'Esplora Fablemarq Gamebooks',
      featuredKicker:'Dal mondo Fablemarq',featuredTitle:'Storie che mostrano chi siamo.',featuredIntro:'Una selezione di titoli e progetti dalle nostre divisioni editoriali.',kikiLabel:'Fablemarq Kids · Kiki Moon',kikiTitle:'La Stella Perduta',kikiFullTitle:'Kiki Moon — La Stella Perduta',kikiText:'Una storia illustrata per lettori dai 6 ai 10 anni.',kiki2FullTitle:'Kiki Moon — Il Segreto di Snarfel',details:'Scopri il libro',available:'Disponibile',crimeLabel:'Fablemarq Gamebooks · Crime',crimeTitle:"L'ACCUSATO",surviveLabel:'Fablemarq Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',development:'In sviluppo',gamebooksProjectCta:'Scopri il progetto',
      signoffKicker:'La firma Fablemarq',signoffTitle:'Ogni mondo cambia. La firma resta.',signoffText:'Dai libri illustrati alle storie interattive, Fablemarq mantiene un principio semplice: ogni progetto deve avere una ragione per essere ricordato.',signoffKids:'Esplora Kids',signoffGamebooks:'Esplora Gamebooks',footerBrand:'Fablemarq',footer:'Fablemarq — Independent publishing studio',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq — Narrative worlds, illustrated books & Gamebooks',description:'Fablemarq is an independent publishing brand creating narrative worlds: illustrated books for children and interactive Gamebooks for adults.',skip:'Skip to content',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq · Independent publisher',tagline:'Stories that do not stay on the page.',heroSub:'Fablemarq creates narrative worlds to read, explore and experience. Different formats, one editorial signature.',heroPrimary:'Discover Fablemarq',heroSecondary:'Explore our worlds',heroSignature:'Distinct worlds. One identity. Experiences made to stay with you.',
      brandKicker:'Our publishing idea',brandTitle:'We do not simply publish stories. We build worlds.',brandText:'Every Fablemarq project starts with its own narrative and visual identity. Audience, tone and reading experience may change; the same focus on experience, coherence and recognition remains.',principle1Title:'Identity',principle1Text:'Every line should be recognizable before the book is even opened.',principle2Title:'Experience',principle2Text:'Format is not decoration: it should change the way the reader experiences the story.',principle3Title:'Continuity',principle3Text:'We build worlds and lines designed to grow without losing their signature.',
      chooseKicker:'Fablemarq worlds',chooseTitle:'One brand. Different experiences.',chooseIntro:'Each division has its own language while belonging to the same Fablemarq publishing system.',kidsEyebrow:'Fablemarq Kids',kidsTitle:'Stories for growing through imagination.',kidsText:'Our division for younger readers: illustrated books, narrative worlds and characters to return to. Kiki Moon is the first Fablemarq Kids universe.',kidsExplore:'Explore Fablemarq Kids',gameEyebrow:'Fablemarq Gamebooks',gameTitle:'You do not follow the story. You decide where it goes.',gameText:'Our interactive division for adults: thriller, crime, survival and other worlds where decisions and consequences change the path.',gameExplore:'Explore Fablemarq Gamebooks',
      featuredKicker:'From the Fablemarq world',featuredTitle:'Stories that show who we are.',featuredIntro:'A selection of titles and projects from our publishing divisions.',kikiLabel:'Fablemarq Kids · Kiki Moon',kikiTitle:'The Lost Star',kikiFullTitle:'Kiki Moon — The Lost Star',kikiText:'A full-color illustrated story for readers ages 6–10.',kiki2FullTitle:"Kiki Moon — Snarfel's Secret",details:'Discover the book',available:'Available',crimeLabel:'Fablemarq Gamebooks · Crime',crimeTitle:"L'ACCUSATO",surviveLabel:'Fablemarq Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',development:'In development',gamebooksProjectCta:'Explore the project',
      signoffKicker:'The Fablemarq signature',signoffTitle:'Every world changes. The signature remains.',signoffText:'From illustrated books to interactive stories, Fablemarq keeps one simple principle: every project should have a reason to be remembered.',signoffKids:'Explore Kids',signoffGamebooks:'Explore Gamebooks',footerBrand:'Fablemarq',footer:'Fablemarq — Independent publishing studio',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq — Mundos narrativos, libros ilustrados y Gamebooks',description:'Fablemarq es una marca editorial independiente que crea mundos narrativos: libros ilustrados para niños y Gamebooks interactivos para adultos.',skip:'Saltar al contenido',navKids:'Kids',navGamebooks:'Gamebooks',
      heroKicker:'Fablemarq · Editorial independiente',tagline:'Historias que no se quedan en la página.',heroSub:'Fablemarq crea mundos narrativos para leer, explorar y vivir. Formatos distintos, una sola firma editorial.',heroPrimary:'Descubre Fablemarq',heroSecondary:'Explora nuestros mundos',heroSignature:'Mundos distintos. Una identidad común. Experiencias para recordar.',
      brandKicker:'Nuestra idea editorial',brandTitle:'No publicamos solo historias. Construimos mundos.',brandText:'Cada proyecto Fablemarq nace con una identidad narrativa y visual propia. Cambian el público, el tono y la forma de leer; permanece la misma atención por la experiencia, la coherencia y el reconocimiento.',principle1Title:'Identidad',principle1Text:'Cada colección debe ser reconocible antes incluso de abrir el libro.',principle2Title:'Experiencia',principle2Text:'El formato no es decoración: debe cambiar la forma en que el lector vive la historia.',principle3Title:'Continuidad',principle3Text:'Construimos universos y líneas pensados para crecer sin perder su firma.',
      chooseKicker:'Los mundos Fablemarq',chooseTitle:'Una marca. Experiencias distintas.',chooseIntro:'Cada división tiene un lenguaje propio, pero pertenece al mismo sistema editorial Fablemarq.',kidsEyebrow:'Fablemarq Kids',kidsTitle:'Historias para crecer imaginando.',kidsText:'Nuestra división para los lectores más jóvenes: libros ilustrados, mundos narrativos y personajes a los que volver. Kiki Moon es el primer universo Fablemarq Kids.',kidsExplore:'Explora Fablemarq Kids',gameEyebrow:'Fablemarq Gamebooks',gameTitle:'No sigues la historia. Decides hacia dónde va.',gameText:'Nuestra división interactiva para adultos: thriller, crime, survival y otros mundos donde las decisiones y sus consecuencias cambian el camino.',gameExplore:'Explora Fablemarq Gamebooks',
      featuredKicker:'Desde el mundo Fablemarq',featuredTitle:'Historias que muestran quiénes somos.',featuredIntro:'Una selección de títulos y proyectos de nuestras divisiones editoriales.',kikiLabel:'Fablemarq Kids · Kiki Moon',kikiTitle:'La Estrella Perdida',kikiFullTitle:'Kiki Moon — La Estrella Perdida',kikiText:'Una historia ilustrada a todo color para lectores de 6 a 10 años.',kiki2FullTitle:'Kiki Moon — El Secreto de Snarfel',details:'Descubre el libro',available:'Disponible',crimeLabel:'Fablemarq Gamebooks · Crime',crimeTitle:"L'ACCUSATO",surviveLabel:'Fablemarq Gamebooks · Survive',surviveTitle:'72 ORE SOTTOTERRA',development:'En desarrollo',gamebooksProjectCta:'Descubre el proyecto',
      signoffKicker:'La firma Fablemarq',signoffTitle:'Cada mundo cambia. La firma permanece.',signoffText:'Desde los libros ilustrados hasta las historias interactivas, Fablemarq mantiene un principio sencillo: cada proyecto debe tener una razón para ser recordado.',signoffKids:'Explora Kids',signoffGamebooks:'Explora Gamebooks',footerBrand:'Fablemarq',footer:'Fablemarq — Independent publishing studio',language:'Idioma'
    }
  };

  let lang = core ? core.selectedLanguage() : (window.PREFERRED_LANG || 'en');
  let catalog = [];
  const track = (name,extra={}) => core?.track(name,extra);

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
    const langButton=event.target.closest('.lang-switch-home button[data-lang]');
    if(langButton){const next=core?core.normLang(langButton.dataset.lang):langButton.dataset.lang;if(next!==lang){lang=next;render();track('select_language',{language:lang});}return;}
    const world=event.target.closest('[data-world]');if(world)track('select_world',{world:world.dataset.world});
    const nav=event.target.closest('[data-nav]');if(nav)track('click_nav',{item:nav.dataset.nav});
  });
  document.addEventListener('DOMContentLoaded',()=>{core?.initAttribution();render();loadCatalog();track('view_home');});
})();
