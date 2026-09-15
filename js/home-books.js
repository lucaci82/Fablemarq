(() => {
  'use strict';

  const chunks = [
    'assets/home/books-pair-med-01.b64',
    'assets/home/books-pair-med-02.b64',
    'assets/home/books-pair-med-03.b64'
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
      console.error('Fablemarq book showcase failed to load', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBooks, { once: true });
  } else {
    loadBooks();
  }
})();
