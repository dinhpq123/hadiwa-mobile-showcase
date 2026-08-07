document.addEventListener('DOMContentLoaded', () => {
  const pSel = document.getElementById('presetSelect');
  const mSel = document.getElementById('modeSelect');
  if(pSel) pSel.value = localStorage.getItem('hadiwa_showcase_preset') || 'hadiwa-original';
  if(mSel) mSel.value = localStorage.getItem('hadiwa_showcase_mode') || 'dark';

  // Attach initial onload handler BEFORE navigateTo sets src
  const frame = document.getElementById('screenFrame');
  if(frame) {
    frame.addEventListener('load', function() {
      // Always push current theme into the iframe each time it loads
      syncThemeToFrame();
    });
  }

  // Check URL params for deep-link
  const urlParams = new URLSearchParams(window.location.search);
  const initialScreen = urlParams.get('screen') || 'home';
  navigateTo(initialScreen);
});
