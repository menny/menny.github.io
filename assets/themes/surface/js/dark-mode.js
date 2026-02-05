// Dark mode toggle
(function() {
  var toggle = document.getElementById('dark-mode-toggle');
  var body = document.body;

  function applyTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  // Check for saved preference in local storage
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Check for system preference
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // Toggle theme on click
  if (toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      var currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
})();
