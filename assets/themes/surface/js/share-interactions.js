document.addEventListener('DOMContentLoaded', () => {
  const copyLinks = document.querySelectorAll('.js-copy-link');

  copyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const url = window.location.href;

      navigator.clipboard.writeText(url).then(() => {
        // success feedback
        link.classList.add('copied');
        const originalText = link.innerText;
        const originalLabel = link.getAttribute('aria-label');

        // Change text and label
        link.innerText = 'Copied!';
        link.setAttribute('aria-label', 'Link copied to clipboard');

        setTimeout(() => {
          link.classList.remove('copied');
          link.innerText = originalText;
          if (originalLabel) {
            link.setAttribute('aria-label', originalLabel);
          } else {
            link.removeAttribute('aria-label');
          }
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });
});
