(function () {
  const key = 'site-theme';
  const root = document.documentElement;
  const button = document.querySelector('[data-theme-toggle]');
  const stored = (() => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  })();
  let theme = stored === 'dark' || stored === 'light'
    ? stored
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme() {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (button) {
      button.textContent = theme === 'dark' ? '☀️ Tema chiaro' : '🌙 Tema scuro';
      button.setAttribute('aria-label', theme === 'dark' ? 'Attiva il tema chiaro' : 'Attiva il tema scuro');
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  applyTheme();
  if (button) button.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(key, theme); } catch (_) { /* Browsing without storage still works. */ }
    applyTheme();
  });
})();
