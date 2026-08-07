(function() {
  const savedTheme = localStorage.getItem('hadiwa_showcase_preset') || 'hadiwa-original';
  const savedMode = localStorage.getItem('hadiwa_showcase_mode') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-mode', savedMode);
})();

function applyPreset(val) {
  document.documentElement.setAttribute('data-theme', val);
  localStorage.setItem('hadiwa_showcase_preset', val);
  const sel = document.getElementById('presetSelect');
  if(sel) sel.value = val;
}

function applyMode(val) {
  document.documentElement.setAttribute('data-mode', val);
  localStorage.setItem('hadiwa_showcase_mode', val);
  const sel = document.getElementById('modeSelect');
  if(sel) sel.value = val;
}

document.addEventListener('DOMContentLoaded', () => {
  const pSel = document.getElementById('presetSelect');
  const mSel = document.getElementById('modeSelect');
  if(pSel) pSel.value = localStorage.getItem('hadiwa_showcase_preset') || 'hadiwa-original';
  if(mSel) mSel.value = localStorage.getItem('hadiwa_showcase_mode') || 'dark';
});
