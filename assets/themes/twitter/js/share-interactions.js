document.addEventListener('DOMContentLoaded', () => {
  const shareButtons = document.querySelectorAll('.js-copy-link');

  shareButtons.forEach((button) => {
    // Store original text and label to prevent race conditions
    const originalText = button.innerText;
    const originalLabel = button.getAttribute('aria-label');

    button.addEventListener('click', async (event) => {
      event.preventDefault();

      const textToCopy = button.getAttribute('data-clipboard-text') || window.location.href;

      try {
        await navigator.clipboard.writeText(textToCopy);

        button.classList.add('copied');
        button.innerText = 'Copied!';
        button.setAttribute('aria-label', 'Link copied to clipboard');

        // Clear any existing timeout to ensure the reset happens 2s after the *last* click
        if (button._resetTimeout) {
          clearTimeout(button._resetTimeout);
        }

        button._resetTimeout = setTimeout(() => {
          button.classList.remove('copied');
          button.innerText = originalText;

          if (originalLabel) {
            button.setAttribute('aria-label', originalLabel);
          } else {
            button.removeAttribute('aria-label');
          }
          button._resetTimeout = null;
        }, 2000);

      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    });
  });
});
