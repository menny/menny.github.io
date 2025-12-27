document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.content');
  if (!content) return;

  const headers = content.querySelectorAll('h2, h3, h4, h5, h6');

  headers.forEach(header => {
    // Ensure header has an ID
    if (!header.id) {
      const slug = header.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      header.id = slug;
    }

    // Create anchor link
    const anchor = document.createElement('a');
    anchor.className = 'header-anchor';
    anchor.href = `#${header.id}`;
    // Using a hash symbol, but aria-label makes it accessible
    anchor.innerHTML = '#';
    anchor.ariaLabel = `Link to section: ${header.textContent}`;

    // Append to header
    header.appendChild(anchor);
  });
});
