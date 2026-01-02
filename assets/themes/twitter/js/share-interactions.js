document.addEventListener('DOMContentLoaded', () => {
  const copyLinks = document.querySelectorAll('.js-copy-link');

  copyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const url = window.location.href;

      const successCallback = () => {
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
      };

      const failureCallback = (err) => {
        console.error('Failed to copy: ', err);
        // Fallback or user feedback could go here
        // For now, we might want to alert if it fails entirely?
        // Or just fail silently. But user said "doesn't copy anything".

        // Try fallback method (execCommand)
        try {
            const textArea = document.createElement("textarea");
            textArea.value = url;

            // Ensure it's not visible but part of DOM
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                successCallback();
            } else {
                 console.error('Fallback copy failed.');
            }
        } catch (fallbackErr) {
            console.error('Fallback error:', fallbackErr);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(successCallback).catch(failureCallback);
      } else {
          failureCallback('Clipboard API not available');
      }
    });
  });
});
