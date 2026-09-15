(() => {
  'use strict';

  const intro = document.querySelector('[data-fm-entry]');
  if (!intro) return;

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let seen = false;
  try { seen = sessionStorage.getItem('fm_entry_seen_v1') === '1'; } catch (_) {}

  if (reduceMotion || seen) {
    intro.hidden = true;
    return;
  }

  let closed = false;
  let hideTimer;
  let cleanupTimer;

  const close = () => {
    if (closed) return;
    closed = true;
    clearTimeout(hideTimer);
    clearTimeout(cleanupTimer);
    intro.classList.remove('is-active');
    document.body.classList.remove('fm-entry-lock');
    cleanupTimer = window.setTimeout(() => { intro.hidden = true; }, 340);
  };

  try { sessionStorage.setItem('fm_entry_seen_v1', '1'); } catch (_) {}
  document.body.classList.add('fm-entry-lock');
  intro.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-active')));

  hideTimer = window.setTimeout(close, 1450);

  intro.addEventListener('pointerdown', close, { once:true });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') close();
  }, { once:true });
})();
