(function() {
  function init() {
    var copyLinks = document.querySelectorAll('.js-copy-link');

    copyLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        var url = window.location.href;

        navigator.clipboard.writeText(url).then(function() {
          // success feedback
          link.classList.add('copied');
          var originalText = link.innerText;
          var originalLabel = link.getAttribute('aria-label');

          // Change text and label
          link.innerText = 'Copied!';
          link.setAttribute('aria-label', 'Link copied to clipboard');

          setTimeout(function() {
            link.classList.remove('copied');
            link.innerText = originalText;
            if (originalLabel) {
              link.setAttribute('aria-label', originalLabel);
            } else {
              link.removeAttribute('aria-label');
            }
          }, 2000);
        }).catch(function(err) {
          console.error('Failed to copy: ', err);
        });
      });
    });
  }

  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
