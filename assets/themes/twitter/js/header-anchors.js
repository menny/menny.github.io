document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('.content h2, .content h3, .content h4, .content h5, .content h6');

  headers.forEach(header => {
    // Ensure ID exists
    if (!header.id) {
      const slug = header.textContent
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (slug) {
        header.id = slug;
      }
    }

    if (header.id) {
      const link = document.createElement('a');
      link.className = 'header-link';
      link.href = '#' + header.id;
      // Using a hash symbol for the link
      link.innerHTML = '#';
      link.title = 'Permalink to this section';
      link.setAttribute('aria-label', 'Permalink to ' + header.textContent.trim());

      header.appendChild(link);
    }
  });
});
