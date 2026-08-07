window.addEventListener('message', function(event) {
  if (event.origin !== window.location.origin) return;

  if (event.data?.type === 'HADIWA_NAVIGATE') {
    navigateTo(event.data.route, event.data.params || {});
  }

  if (event.data?.type === 'HADIWA_BACK') {
    goBack();
  }

  if (event.data?.type === 'HADIWA_SCREEN_READY') {
    syncThemeToFrame();
  }
});
