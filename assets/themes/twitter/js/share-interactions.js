document.addEventListener('DOMContentLoaded', () => {
  // Share interactions
  const shareLinks = document.querySelectorAll('.sharing-buttons .copy-clipboard-icon');

  shareLinks.forEach(link => {
    // Capture original text once, when the script loads
    const originalText = link.innerText;

    // Accessibility: make sure changes are announced
    // Since it's a button/link, screen readers usually announce content changes if focus is on it,
    // but aria-live ensures it. However, adding aria-live to a focused element can be verbose.
    // A common pattern is to just change the text.
    // Let's ensure the link has role="button" if it's href="#"
    if (link.getAttribute('href') === '#') {
      link.setAttribute('role', 'button');
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Prevent multiple clicks if already copying/copied
      if (link.classList.contains('copied')) return;

      // Use current URL
      const url = window.location.href;

      navigator.clipboard.writeText(url).then(() => {
        // Visual feedback
        link.innerText = 'Copied!';
        link.classList.add('copied');

        setTimeout(() => {
          link.innerText = originalText;
          link.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });
});
