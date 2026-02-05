// Update history toggle
(function() {
  var toggle = document.querySelector('.update-toggle');
  var list = document.getElementById('update-list');

  if (toggle && list) {
    toggle.addEventListener('click', function() {
      var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      list.hidden = isExpanded;
    });
  }
})();
