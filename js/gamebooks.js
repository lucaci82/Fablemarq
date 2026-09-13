(() => {
  'use strict';

  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const INTERNAL_SRC = new Set(['site','home','kids','gamebooks','collection','book','preview','hero','grid','b1','b2','b3']);
  const I18N = {
    it:{
      pageTitle:'Fablemarq Gamebooks — Le tue scelte cambiano la storia',description:'Fablemarq Gamebooks: crime, survive, mystery e real life. Libri-game per adulti basati solo sulle tue decisioni.',skip:'Salta al contenuto',
      navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Gamebooks',heroA:'Non leggi soltanto la storia.',heroB:'Decidi cosa succede.',heroLead:'Thriller interattivi per adulti. Niente dadi, niente schede personaggio: solo decisioni, conseguenze e strade che cambiano.',
      p1:'Niente dadi',p2:'Niente schede',p3:'Solo decisioni e conseguenze',catalogKicker:'Catalogo',catalogTitle:'Scegli la tensione',catalogIntro:'Ogni linea ha una propria atmosfera, ma la stessa regola: sei tu a decidere.',development:'In sviluppo',coming:'Coming soon',
      crime:'Crime',crimeTitle:'SEI ACCUSATO',crimeHook:'Hai 48 ore per dimostrare che non sei stato tu.',crimeNote:'Primo titolo della linea Crime',survive:'Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveHook:"Sette persone. Una galleria crollata. L'aria non basterà per tutti.",surviveNote:'Primo titolo della linea Survive',
      mystery:'Mystery',mysteryTitle:'MYSTERY',mysteryHook:'La verità è nascosta. Le tue scelte stabiliranno quanto vicino riuscirai ad arrivare.',mysteryNote:'Linea in preparazione',real:'Real Life',realTitle:'REAL LIFE',realHook:'Ruoli quotidiani, conseguenze imprevedibili e decisioni che sembrano semplici finché non le prendi.',realNote:'Linea in preparazione',
      howKicker:'Il formato',howTitle:'Leggi. Scegli. Affronta le conseguenze.',h1:'Leggi la situazione',h1p:'Ogni scena ti mette davanti a informazioni, persone e rischi concreti.',h2:'Prendi una decisione',h2p:'Nessun tiro di dado decide per te. La scelta è tua.',h3:'Vivi il risultato',h3p:'La storia cambia in base a ciò che fai, ciò che ignori e ciò che rischi.',
      note:'I titoli Gamebooks mostrati qui sono in sviluppo. I pulsanti di acquisto compariranno solo quando un libro sarà realmente disponibile.',footer:'Fablemarq Gamebooks — A Fablemarq publishing division',language:'Lingua'
    },
    en:{
      pageTitle:'Fablemarq Gamebooks — Your choices change the story',description:'Fablemarq Gamebooks: crime, survive, mystery and real life. Interactive books for adults driven only by your decisions.',skip:'Skip to content',
      navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Gamebooks',heroA:"You don't just read the story.",heroB:'You decide what happens.',heroLead:'Interactive thrillers for adults. No dice, no character sheets: just decisions, consequences and paths that change.',
      p1:'No dice',p2:'No character sheets',p3:'Just decisions and consequences',catalogKicker:'Catalog',catalogTitle:'Choose the tension',catalogIntro:'Each line has its own atmosphere, with the same rule: you decide.',development:'In development',coming:'Coming soon',
      crime:'Crime',crimeTitle:'SEI ACCUSATO',crimeHook:'You have 48 hours to prove you did not do it.',crimeNote:'First title in the Crime line',survive:'Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveHook:'Seven people. A collapsed tunnel. There will not be enough air for everyone.',surviveNote:'First title in the Survive line',
      mystery:'Mystery',mysteryTitle:'MYSTERY',mysteryHook:'The truth is hidden. Your choices determine how close you get.',mysteryNote:'Line in development',real:'Real Life',realTitle:'REAL LIFE',realHook:'Everyday roles, unpredictable consequences and decisions that look simple until you make them.',realNote:'Line in development',
      howKicker:'The format',howTitle:'Read. Choose. Face the consequences.',h1:'Read the situation',h1p:'Every scene gives you information, people and concrete risks to judge.',h2:'Make a decision',h2p:'No dice roll decides for you. The choice is yours.',h3:'Live with the result',h3p:'The story changes according to what you do, ignore and risk.',
      note:'The Gamebooks shown here are in development. Buy buttons will appear only when a title is actually available.',footer:'Fablemarq Gamebooks — A Fablemarq publishing division',language:'Language'
    },
    es:{
      pageTitle:'Fablemarq Gamebooks — Tus decisiones cambian la historia',description:'Fablemarq Gamebooks: crime, survive, mystery y real life. Libros interactivos para adultos guiados por tus decisiones.',skip:'Saltar al contenido',
      navKids:'Kids',navGamebooks:'Gamebooks',brand:'Fablemarq Gamebooks',heroA:'No solo lees la historia.',heroB:'Decides lo que sucede.',heroLead:'Thrillers interactivos para adultos. Sin dados ni fichas de personaje: solo decisiones, consecuencias y caminos que cambian.',
      p1:'Sin dados',p2:'Sin fichas',p3:'Solo decisiones y consecuencias',catalogKicker:'Catálogo',catalogTitle:'Elige la tensión',catalogIntro:'Cada línea tiene su propia atmósfera, con la misma regla: tú decides.',development:'En desarrollo',coming:'Próximamente',
      crime:'Crime',crimeTitle:'SEI ACCUSATO',crimeHook:'Tienes 48 horas para demostrar que no fuiste tú.',crimeNote:'Primer título de la línea Crime',survive:'Survive',surviveTitle:'72 ORE SOTTOTERRA',surviveHook:'Siete personas. Un túnel derrumbado. El aire no alcanzará para todos.',surviveNote:'Primer título de la línea Survive',
      mystery:'Mystery',mysteryTitle:'MYSTERY',mysteryHook:'La verdad está oculta. Tus decisiones determinan cuánto te acercas.',mysteryNote:'Línea en preparación',real:'Real Life',realTitle:'REAL LIFE',realHook:'Roles cotidianos, consecuencias imprevisibles y decisiones que parecen simples hasta que las tomas.',realNote:'Línea en preparación',
      howKicker:'El formato',howTitle:'Lee. Elige. Afronta las consecuencias.',h1:'Lee la situación',h1p:'Cada escena te da información, personas y riesgos concretos que valorar.',h2:'Toma una decisión',h2p:'Ningún dado decide por ti. La elección es tuya.',h3:'Vive el resultado',h3p:'La historia cambia según lo que haces, ignoras y arriesgas.',
      note:'Los Gamebooks mostrados aquí están en desarrollo. Los botones de compra aparecerán solo cuando un título esté realmente disponible.',footer:'Fablemarq Gamebooks — A Fablemarq publishing division',language:'Idioma'
    }
  };

  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };
  const params = () => new URLSearchParams(location.search);
  let lang = normLang(params().get('lang') || localStorage.getItem('lang') || navigator.language || 'en');

  function initAttribution(){
    const q = params();
    const raw = (q.get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) localStorage.setItem('fm_src',raw);
    UTM_KEYS.forEach(key => { const value = q.get(key); if (value) sessionStorage.setItem(key,value); });
  }
  function trafficSource(){
    const raw = (params().get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) return raw;
    return localStorage.getItem('fm_src') || 'site';
  }
  function track(name,extra){
    const ctx = {page_path:location.pathname,lang,division:'gamebooks',src:trafficSource()};
    UTM_KEYS.forEach(key => { const value = params().get(key) || sessionStorage.getItem(key); if (value) ctx[key] = value; });
    try { window.gtag && window.gtag('event',name,Object.assign(ctx,extra || {})); } catch (_) {}
  }

  function render(){
    const t = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    localStorage.setItem('lang',lang);
    document.title = t.pageTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t.description;
    const skip = document.querySelector('.skip-link');
    if (skip) skip.textContent = t.skip;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(t,key)) el.textContent = t[key];
    });

    const source = trafficSource();
    document.querySelectorAll('[data-internal]').forEach(el => {
      const raw = el.dataset.baseHref || el.getAttribute('href');
      if (!el.dataset.baseHref) el.dataset.baseHref = raw;
      const url = new URL(raw,location.href);
      url.searchParams.set('lang',lang);
      if (source !== 'site') url.searchParams.set('src',source);
      el.href = url.pathname + '?' + url.searchParams.toString() + url.hash;
    });

    document.querySelectorAll('.site-lang-switch button[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
    document.querySelectorAll('.site-lang-switch').forEach(el => el.setAttribute('aria-label',t.language));
  }

  document.addEventListener('click',event => {
    const button = event.target.closest('.site-lang-switch button[data-lang]');
    if (button) {
      const next = normLang(button.dataset.lang);
      if (next !== lang) { lang = next; render(); track('select_language',{language:lang}); }
      return;
    }
    const nav = event.target.closest('[data-nav]');
    if (nav) track('click_nav',{item:nav.dataset.nav});
    const series = event.target.closest('[data-series]');
    if (series) track('view_series',{series:series.dataset.series});
  });

  document.addEventListener('DOMContentLoaded',() => {
    initAttribution();
    render();
    track('view_collection',{collection:'fablemarq-gamebooks'});
  });
})();
