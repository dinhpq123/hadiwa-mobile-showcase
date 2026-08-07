/**
 * THEME RECEIVER — Shared by ALL screen iframes
 *
 * Mechanism:
 *  1. On load: read preset/mode from localStorage and apply to THIS document's <html>
 *     + if preset is 'custom', also read saved custom vars from localStorage and apply inline
 *  2. Listen for postMessage({ type: 'HADIWA_THEME_CHANGED', preset, mode, customVars? })
 *  3. Apply data-theme + data-mode. If customVars present, inject as inline CSS properties.
 *
 * CSS variables on the parent shell document are NOT inherited by iframe documents.
 * This is the ONLY correct propagation mechanism.
 */
(function () {
  /* ── Custom var keys list (must match theme-controller.js) ── */
  var CUSTOM_VAR_KEYS = [
    '--body-bg','--body-glow','--bg-app','--bg-secondary','--card-bg',
    '--card-border','--header-bg','--card-hero-bg','--card-hero-border',
    '--text-main','--text-sub','--text-muted','--primary','--primary-soft',
    '--secondary','--secondary-soft','--accent','--accent-soft','--accent-glow','--success','--warning','--danger','--info',
    '--tabbar-bg','--tabbar-border','--tab-active-bg','--tab-active-icon',
    '--tab-active-text','--tab-inactive-icon','--tab-inactive-text',
    '--center-ring-bg','--center-ring-border','--center-ring-glow','--center-tab-label'
  ];

  function applyTheme(preset, mode) {
    document.documentElement.setAttribute('data-theme', preset);
    document.documentElement.setAttribute('data-mode',  mode);
  }

  function applyCustomVars(vars) {
    if (!vars) return;
    Object.keys(vars).forEach(function(k) {
      document.documentElement.style.setProperty(k, vars[k]);
    });
  }

  function clearCustomVars() {
    CUSTOM_VAR_KEYS.forEach(function(k) {
      document.documentElement.style.removeProperty(k);
    });
  }

  /* ── Try to restore custom vars from localStorage if preset=custom ── */
  function tryRestoreCustomVars(preset, mode) {
    if (preset !== 'custom') { clearCustomVars(); return; }
    // Nếu parent đã lưu customVars vào localStorage
    try {
      var raw = localStorage.getItem('hadiwa_custom_vars_' + mode);
      if (raw) {
        var vars = JSON.parse(raw);
        applyCustomVars(vars);
      }
    } catch(e) {}
  }

  // ── 1. Apply saved theme immediately (trước khi render) ──
  var savedPreset = localStorage.getItem('hadiwa_showcase_preset') || 'hadiwa-original';
  var savedMode   = localStorage.getItem('hadiwa_showcase_mode')   || 'dark';
  applyTheme(savedPreset, savedMode);
  tryRestoreCustomVars(savedPreset, savedMode);

  // ── 2. Listen for postMessage from parent shell ──
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'HADIWA_THEME_CHANGED') return;
    var preset = event.data.preset || 'hadiwa-original';
    var mode   = event.data.mode   || 'dark';

    applyTheme(preset, mode);
    localStorage.setItem('hadiwa_showcase_preset', preset);
    localStorage.setItem('hadiwa_showcase_mode',   mode);

    if (event.data.customVars) {
      // Custom preset: inject inline CSS vars
      clearCustomVars();
      applyCustomVars(event.data.customVars);
      // Cache vào localStorage để reload page vẫn giữ được
      try {
        localStorage.setItem('hadiwa_custom_vars_' + mode, JSON.stringify(event.data.customVars));
      } catch(e) {}
    } else {
      // Preset thường: xóa custom vars để CSS file lại có hiệu lực
      clearCustomVars();
    }
  });

  // ── 3. navigateParent helper ──
  window.navigateParent = function (routeName, params) {
    window.parent.postMessage({
      type: 'HADIWA_NAVIGATE',
      route: routeName,
      params: params || {}
    }, '*');
  };
})();
