(() => {
  'use strict';

  const core = window.FMCore;
  const I18N = {
    it:{
      pageTitle:'Fablemarq — Libri, mondi narrativi e Gamebooks',description:'Fablemarq crea libri illustrati per bambini e Gamebooks interattivi per adulti: due mondi editoriali, una sola identità.',skip:'Salta al contenuto',navHome:'Home',navKids:'Kids',navGamebooks:'Gamebooks',about:'Chi siamo',
      heroTitleMain:'Storie più grandi',heroTitleAccent:'di te.',heroSub:'Storie che esplorano mondi, mettono al centro le tue scelte e trasformano la lettura in un’esperienza unica.',heroPrimary:'Scopri Fablemarq',
      chooseTitle:'Scegli la tua collana',kidsTitle:'Kids',kidsText:'Storie per sognare un futuro più grande.',kidsExplore:'Scopri Kids',gameTitle:'Gamebooks',gameText:'Storie che ti mettono al centro.',gameExplore:'Scopri Gamebooks',
      brandTitleMain:'Più di un editore.',brandTitleAccent:'Un mondo narrativo.',principle1Title:'Narrativa interattiva',principle2Title:'Per lettori curiosi',principle3Title:'Un universo in evoluzione',principle4Title:'Storie che ispirano',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq — Books, narrative worlds & Gamebooks',description:'Fablemarq creates illustrated books for children and interactive Gamebooks for adults: two editorial worlds, one identity.',skip:'Skip to content',navHome:'Home',navKids:'Kids',navGamebooks:'Gamebooks',about:'About us',
      heroTitleMain:'Stories bigger',heroTitleAccent:'than you.',heroSub:'Stories that explore worlds, put your choices at the centre and turn reading into a unique experience.',heroPrimary:'Discover Fablemarq',
      chooseTitle:'Choose your collection',kidsTitle:'Kids',kidsText:'Stories to dream of a bigger future.',kidsExplore:'Discover Kids',gameTitle:'Gamebooks',gameText:'Stories that put you at the centre.',gameExplore:'Discover Gamebooks',
      brandTitleMain:'More than a publisher.',brandTitleAccent:'A narrative world.',principle1Title:'Interactive storytelling',principle2Title:'For curious readers',principle3Title:'An evolving universe',principle4Title:'Stories that inspire',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq — Libros, mundos narrativos y Gamebooks',description:'Fablemarq crea libros ilustrados para niños y Gamebooks interactivos para adultos: dos mundos editoriales, una sola identidad.',skip:'Saltar al contenido',navHome:'Inicio',navKids:'Kids',navGamebooks:'Gamebooks',about:'Quiénes somos',
      heroTitleMain:'Historias más grandes',heroTitleAccent:'que tú.',heroSub:'Historias que exploran mundos, ponen tus decisiones en el centro y transforman la lectura en una experiencia única.',heroPrimary:'Descubre Fablemarq',
      chooseTitle:'Elige tu colección',kidsTitle:'Kids',kidsText:'Historias para soñar un futuro más grande.',kidsExplore:'Descubre Kids',gameTitle:'Gamebooks',gameText:'Historias que te ponen en el centro.',gameExplore:'Descubre Gamebooks',
      brandTitleMain:'Más que una editorial.',brandTitleAccent:'Un mundo narrativo.',principle1Title:'Narrativa interactiva',principle2Title:'Para lectores curiosos',principle3Title:'Un universo en evolución',principle4Title:'Historias que inspiran',language:'Idioma'
    }
  };

  let lang = core ? core.selectedLanguage() : (window.PREFERRED_LANG || 'en');
  const track = (name,extra={}) => core?.track(name,extra);

  function setMenu(open){
    const toggle=document.querySelector('.home-menu-toggle');
    const menu=document.getElementById('homeMenu');
    if(!toggle||!menu)return;
    toggle.setAttribute('aria-expanded',String(open));
    menu.classList.toggle('is-open',open);
    menu.setAttribute('aria-hidden',String(!open));
  }

  function render(){
    const t=I18N[lang]||I18N.en;
    core?.setLanguage(lang);
    document.title=t.pageTitle;
    const desc=document.querySelector('meta[name="description"]');if(desc)desc.content=t.description;
    const skip=document.querySelector('.skip-link');if(skip)skip.textContent=t.skip;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(Object.prototype.hasOwnProperty.call(t,key))el.textContent=t[key];});
    core?.applyInternalLinks(lang);
    core?.syncLanguageSwitch(lang,'.lang-switch-home',t.language);
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
  document.addEventListener('DOMContentLoaded',()=>{core?.initAttribution();render();track('view_home');});
})();