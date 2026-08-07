(function() {
  const params = new URLSearchParams(window.location.search);
  const isEmbedded = params.get('embed') === '1';
  document.documentElement.dataset.embed = isEmbedded ? 'true' : 'false';

  // Inform parent when ready
  if (isEmbedded && window.parent && window.parent !== window) {
    window.addEventListener('load', () => {
      window.parent.postMessage({ type: 'HADIWA_SCREEN_READY' }, window.location.origin);
    });

    // Listen to theme sync message from parent shell
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'HADIWA_THEME_CHANGED') {
        document.documentElement.setAttribute('data-theme', event.data.preset);
        document.documentElement.setAttribute('data-mode', event.data.mode);
      }
    });
  }
})();

function navigateParent(routeName, params = {}) {
  const paramsQuery = new URLSearchParams(window.location.search);
  if (paramsQuery.get('embed') === '1' && window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'HADIWA_NAVIGATE', route: routeName, params }, window.location.origin);
  } else {
    window.location.href = `../${routeName}/index.html`;
  }
}

function goBackParent() {
  const paramsQuery = new URLSearchParams(window.location.search);
  if (paramsQuery.get('embed') === '1' && window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'HADIWA_BACK' }, window.location.origin);
  } else {
    history.back();
  }
}
