(() => {
  'use strict';

  const ASSET_ROOT = '../assets';
  const INTERNAL_SRC = new Set(['b1','b2','b3','hero','grid','preview','collection','site','kids','collection_hero','collection_buy']);
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const AMZ_TLD = { IT:'it', ES:'es', FR:'fr', DE:'de', GB:'co.uk', US:'com', CA:'ca', MX:'com.mx', CO:'com.co' };
  const ASIN_BY_LANG = {it:'B0G2MC6Z2X',en:'B0G2JLYKWY',es:'B0G2J42FDD'};

  const I18N = {
    it:{
      title:'Kiki Moon — Universo Fablemarq Kids',description:'Entra nel mondo di Kiki Moon, il primo universo narrativo di Fablemarq Kids. Scopri La Stella Perduta e i prossimi capitoli della saga.',
      skip:'Salta al contenuto',language:'Lingua',navKids:'Kids',breadcrumb:'Fablemarq Kids · Primo universo',universeLabel:'Universo narrativo',
      universeLead:'Un cielo pieno di misteri, una luce che non vuole spegnersi e avventure in cui magia, coraggio e amicizia crescono insieme.',ageMeta:'6–10 anni',formatMeta:'Libri illustrati a colori',sharedMeta:'Lettura condivisa',seeBooks:'Scopri i libri',
      worldTitle:'Benvenuti a Moon.',worldText:'Kiki Moon è una saga illustrata costruita come un mondo da ritrovare libro dopo libro: luoghi, personaggi e nuove avventure legati dalla stessa atmosfera luminosa e misteriosa.',
      booksKicker:'La saga',booksTitle:'I libri di Kiki Moon',booksIntro:'Il primo capitolo è disponibile. Il mondo continua a crescere.',book1Label:'Libro I · Disponibile',book2Label:'Libro II',book2Text:'Il prossimo capitolo della saga è in lavorazione.',details:'Scopri il libro',
      hero2:'La Stella Perduta',hook:'Una stella si spegne. Ma la luce di Kiki è appena iniziata.',benefits:['Età 6–10 anni','80 pagine illustrate a colori','Ideale da leggere insieme'],
      buy:'Acquista su Amazon',trust:'Acquisto e resi gestiti da Amazon.',preview:'Scopri il Libro I',b2:'Il Segreto di Snarfel',progress:'In lavorazione',
      backTitle:'Kiki Moon è solo il primo mondo.',backText:'Fablemarq Kids è pensato per ospitare nuove serie e nuovi universi, mantenendo una sola identità editoriale.',backCta:'Torna a Fablemarq Kids',footer:'Kiki Moon — Un universo Fablemarq Kids'
    },
    en:{
      title:'Kiki Moon — A Fablemarq Kids universe',description:'Enter Kiki Moon, the first narrative universe from Fablemarq Kids. Discover The Lost Star and the next chapters of the series.',
      skip:'Skip to content',language:'Language',navKids:'Kids',breadcrumb:'Fablemarq Kids · First universe',universeLabel:'Narrative universe',
      universeLead:'A sky full of mysteries, a light that refuses to go out and adventures where magic, courage and friendship grow together.',ageMeta:'Ages 6–10',formatMeta:'Full-color illustrated books',sharedMeta:'Shared reading',seeBooks:'Discover the books',
      worldTitle:'Welcome to Moon.',worldText:'Kiki Moon is an illustrated series built as a world to return to book after book: places, characters and new adventures connected by the same luminous, mysterious atmosphere.',
      booksKicker:'The series',booksTitle:'The Kiki Moon books',booksIntro:'The first chapter is available. The world keeps growing.',book1Label:'Book I · Available',book2Label:'Book II',book2Text:'The next chapter of the series is in development.',details:'Discover the book',
      hero2:'The Lost Star',hook:"A star goes dark. Kiki's light is just beginning.",benefits:['Ages 6–10','80 full-color illustrated pages','Perfect for family reading'],
      buy:'Buy on Amazon',trust:'Purchase and returns handled by Amazon.',preview:'Discover Book I',b2:"Snarfel's Secret",progress:'In progress',
      backTitle:'Kiki Moon is only the first world.',backText:'Fablemarq Kids is designed to welcome new series and new universes while keeping one editorial identity.',backCta:'Back to Fablemarq Kids',footer:'Kiki Moon — A Fablemarq Kids universe'
    },
    es:{
      title:'Kiki Moon — Universo Fablemarq Kids',description:'Entra en Kiki Moon, el primer universo narrativo de Fablemarq Kids. Descubre La Estrella Perdida y los próximos capítulos de la saga.',
      skip:'Saltar al contenido',language:'Idioma',navKids:'Kids',breadcrumb:'Fablemarq Kids · Primer universo',universeLabel:'Universo narrativo',
      universeLead:'Un cielo lleno de misterios, una luz que se niega a apagarse y aventuras donde la magia, el valor y la amistad crecen juntos.',ageMeta:'6–10 años',formatMeta:'Libros ilustrados a color',sharedMeta:'Lectura compartida',seeBooks:'Descubre los libros',
      worldTitle:'Bienvenidos a Moon.',worldText:'Kiki Moon es una saga ilustrada construida como un mundo al que volver libro tras libro: lugares, personajes y nuevas aventuras unidos por la misma atmósfera luminosa y misteriosa.',
      booksKicker:'La saga',booksTitle:'Los libros de Kiki Moon',booksIntro:'El primer capítulo está disponible. El mundo sigue creciendo.',book1Label:'Libro I · Disponible',book2Label:'Libro II',book2Text:'El próximo capítulo de la saga está en desarrollo.',details:'Descubre el libro',
      hero2:'La Estrella Perdida',hook:'Una estrella se apaga. La luz de Kiki acaba de empezar.',benefits:['Edades 6–10','80 páginas ilustradas a color','Perfecto para leer en familia'],
      buy:'Comprar en Amazon',trust:'Compra y devoluciones gestionadas por Amazon.',preview:'Descubre el Libro I',b2:'El Secreto de Snarfel',progress:'En desarrollo',
      backTitle:'Kiki Moon es solo el primer mundo.',backText:'Fablemarq Kids está pensado para recibir nuevas series y nuevos universos manteniendo una sola identidad editorial.',backCta:'Volver a Fablemarq Kids',footer:'Kiki Moon — Un universo Fablemarq Kids'
    }
  };

  const qs = () => new URLSearchParams(location.search);
  const normLang = value => {
    const s = String(value || '').toLowerCase();
    if (s.startsWith('it')) return 'it';
    if (s.startsWith('es')) return 'es';
    return 'en';
  };

  function initialLang(){
    const browser = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return normLang(qs().get('lang') || localStorage.getItem('lang') || browser);
  }
  function initAttribution(){
    const q = qs();
    const raw = (q.get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) localStorage.setItem('fm_src', raw);
    UTM_KEYS.forEach(key => { const value = q.get(key); if (value) sessionStorage.setItem(key, value); });
  }
  function guessCountry(){
    const locale = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toUpperCase();
    const match = locale.match(/-([A-Z]{2})$/);
    return match && AMZ_TLD[match[1]] ? match[1] : null;
  }
  function storeCountry(){
    const fromUrl = (qs().get('cc') || '').trim().toUpperCase();
    if (AMZ_TLD[fromUrl]) return fromUrl;
    const saved = (localStorage.getItem('amz_cc') || '').trim().toUpperCase();
    if (AMZ_TLD[saved]) return saved;
    return guessCountry() || 'US';
  }
  function trafficSource(){
    const raw = (qs().get('src') || '').trim().toLowerCase();
    if (raw && !INTERNAL_SRC.has(raw)) return raw;
    return localStorage.getItem('fm_src') || 'site';
  }
  function withParams(href, values){
    const url = new URL(href, location.href);
    Object.entries(values).forEach(([key,value]) => { if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value)); });
    return url.pathname + (url.search ? `?${url.searchParams.toString()}` : '') + url.hash;
  }
  function amazonUrl(lang, placement){
    const cc = storeCountry();
    localStorage.setItem('amz_cc', cc);
    const src = trafficSource();
    const query = new URLSearchParams({utm_source:src,utm_medium:`collection_${lang}`,utm_campaign:'readthrough',utm_content:placement,src});
    UTM_KEYS.forEach(key => { const value = qs().get(key) || sessionStorage.getItem(key); if (value && !query.has(key)) query.set(key, value); });
    return `https://www.amazon.${AMZ_TLD[cc] || 'com'}/dp/${ASIN_BY_LANG[lang] || ASIN_BY_LANG.en}?${query.toString()}`;
  }

  let lang = initialLang();
  let trackingBound = false;

  function render(){
    const t = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    document.title = t.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t.description;
    const skip = document.querySelector('.skip-link');
    if (skip) skip.textContent = t.skip;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(t,key)) el.textContent = t[key];
    });
    document.querySelectorAll('.lang-switch').forEach(el => el.setAttribute('aria-label', t.language));
    document.querySelectorAll('.lang-switch button').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    const benefits = document.getElementById('benefits');
    if (benefits) benefits.replaceChildren(...t.benefits.map(value => { const li=document.createElement('li'); li.textContent=value; return li; }));

    const cover1s = [document.getElementById('heroCover'),document.getElementById('book1Cover')];
    cover1s.forEach(el => { if (el) { el.src=`${ASSET_ROOT}/${lang}/cover1.webp`; el.alt=`Kiki Moon — ${t.hero2}`; } });
    const heroCover2 = document.getElementById('heroCover2');
    if (heroCover2) { heroCover2.src=`${ASSET_ROOT}/${lang}/cover2.webp`; heroCover2.alt=`Kiki Moon — ${t.b2}`; }
    const preload = document.querySelector('link[rel="preload"][as="image"]');
    if (preload) preload.href = `${ASSET_ROOT}/${lang}/cover1.webp`;
    const b2 = document.getElementById('book2Cover');
    if (b2) { b2.src=`${ASSET_ROOT}/${lang}/cover2.webp`; b2.alt=`Kiki Moon — ${t.b2}`; }

    const title = document.getElementById('titleLine2'); if (title) title.textContent=t.hero2;
    const hook = document.getElementById('heroHook'); if (hook) hook.textContent=t.hook;
    const book2Caption = document.getElementById('book2Caption'); if (book2Caption) book2Caption.textContent=t.b2;
    const book2Meta = document.getElementById('book2Meta'); if (book2Meta) book2Meta.textContent=t.progress;
    const card = document.querySelector('.collection-card'); if (card) card.dataset.status=t.progress;
    const trust = document.getElementById('buyMetaText'); if (trust) trust.textContent=t.trust;

    const src = trafficSource();
    const brand = document.querySelector('a.brand');
    if (brand) brand.href = withParams('../index.html', {lang,src});
    document.querySelectorAll('.nav-kids').forEach(el => { el.href=withParams('../kids/',{lang,src}); });
    const coverLink = document.getElementById('coverLink');
    if (coverLink) { coverLink.href=withParams('libro-1/index.html#anteprima',{lang,src,ref:'collection_hero'}); coverLink.setAttribute('aria-label',t.preview); }
    const details = document.getElementById('book1Details');
    if (details) details.href=withParams('libro-1/',{lang,src,ref:'collection'});

    const buyMain = document.getElementById('buyNow');
    const buySticky = document.getElementById('buyNowSticky');
    if (buyMain) buyMain.href=amazonUrl(lang,'hero_btn');
    if (buySticky) buySticky.href=amazonUrl(lang,'sticky_btn');
  }

  function track(name, extra){
    const ctx={page_path:location.pathname,page_location:location.href,lang,src:trafficSource(),book_id:'b1'};
    UTM_KEYS.forEach(key => { const value=qs().get(key)||sessionStorage.getItem(key); if (value) ctx[key]=value; });
    try { window.gtag && window.gtag('event',name,Object.assign(ctx,extra||{})); } catch (_) {}
  }
  function bindTracking(){
    if (trackingBound) return;
    trackingBound=true;
    track('view_collection');
    [['buyNow','hero'],['buyNowSticky','sticky']].forEach(([id,placement]) => { const el=document.getElementById(id); if(el) el.addEventListener('click',()=>track('click_buy',{placement,destination:'amazon',href:el.href}),{passive:true}); });
    const preview=document.getElementById('coverLink'); if(preview) preview.addEventListener('click',()=>track('click_preview',{placement:'book_cover'}),{passive:true});
  }
  function initSticky(){
    const wrap=document.getElementById('stickyCta');
    const main=document.getElementById('buyNow');
    const mq=window.matchMedia('(max-width:620px)');
    if(!wrap||!main||!('IntersectionObserver' in window)) return;
    const observer=new IntersectionObserver(entries=>{wrap.style.display=mq.matches&&!entries[0].isIntersecting?'block':'none';},{threshold:.01});
    observer.observe(main);
    const refresh=()=>{if(!mq.matches) wrap.style.display='none';};
    if(mq.addEventListener) mq.addEventListener('change',refresh); else mq.addListener(refresh);
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest('.lang-switch button[data-lang]');
    if(!button) return;
    const next=normLang(button.dataset.lang);
    if(next===lang) return;
    lang=next;render();track('select_language',{language:lang});
  });
  document.addEventListener('DOMContentLoaded',()=>{
    initAttribution();
    const current=new URL(location.href);
    if(current.searchParams.has('lang')){current.searchParams.delete('lang');history.replaceState({},'',current.pathname+current.search+current.hash);}
    render();bindTracking();initSticky();
  });
})();
