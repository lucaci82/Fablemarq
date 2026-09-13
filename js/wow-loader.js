(() => {
  const container = document.getElementById('wow-canvas');
  if (!container) return;

  const staticBackground = () => {
    container.style.background = 'radial-gradient(1000px 600px at 70% 25%, #141e3d, #0b1222)';
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const mobile = window.matchMedia('(max-width: 820px)').matches;
  const memory = Number(navigator.deviceMemory || 8);
  const cores = Number(navigator.hardwareConcurrency || 8);
  const lowPowerMobile = mobile && (memory <= 4 || cores <= 4);

  if (reduceMotion || saveData || lowPowerMobile) {
    staticBackground();
    return;
  }

  const loadAnimation = () => {
    const three = document.createElement('script');
    three.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
    three.async = true;
    three.crossOrigin = 'anonymous';
    three.onload = () => {
      const wow = document.createElement('script');
      wow.src = 'js/wow.js';
      wow.async = true;
      wow.onerror = staticBackground;
      document.body.appendChild(wow);
    };
    three.onerror = staticBackground;
    document.head.appendChild(three);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnimation, { timeout: 1400 });
  } else {
    window.setTimeout(loadAnimation, 350);
  }
})();
