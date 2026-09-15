(() => {
  'use strict';

  const chunks = [
    'assets/home/collections-final-01.b64',
    'assets/home/collections-final-02.b64',
    'assets/home/collections-final-03.b64',
    'assets/home/collections-final-04.b64',
    'assets/home/collections-final-05.b64',
    'assets/home/collections-final-06.b64',
    'assets/home/collections-final-07.b64',
    'assets/home/collections-final-08.b64'
  ];

  async function loadBooks() {
    const img = document.getElementById('homeBooksImage');
    if (!img) return;

    try {
      const parts = await Promise.all(chunks.map(url =>
        fetch(url, { cache: 'force-cache' }).then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.text();
        })
      ));

      img.onload = () => img.classList.add('is-ready');
      img.src = `data:image/webp;base64,${parts.join('')}`;
    } catch (error) {
      console.error('Fablemarq collection artwork failed to load', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBooks, { once: true });
  } else {
    loadBooks();
  }
})();
