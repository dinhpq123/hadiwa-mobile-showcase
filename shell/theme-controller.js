/* ── THEME CONTROLLER ─────────────────────────────────────
   Đọc / ghi localStorage, apply data-theme / data-mode,
   sync vào iframe qua postMessage (kèm customVars nếu cần).
   ────────────────────────────────────────────────────────── */
(function () {
  var savedTheme = localStorage.getItem('hadiwa_showcase_preset') || 'hadiwa-original';
  var savedMode  = localStorage.getItem('hadiwa_showcase_mode')   || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-mode',  savedMode);

  // Nếu đang là custom preset, apply ngay vars vào shell
  if (savedTheme === 'custom') {
    _applyCustomToShell(savedMode);
  }

  window.addEventListener('DOMContentLoaded', function () {
    var selPreset = document.getElementById('presetSelect');
    if (selPreset) selPreset.value = savedTheme;

    var selMode = document.getElementById('modeSelect');
    if (selMode) selMode.value = savedMode;

    var panel = document.getElementById('colorBuilderPanel');
    if (panel) panel.style.display = (savedTheme === 'custom') ? 'flex' : 'none';

    // Set giá trị khởi tạo cho 1 color picker duy nhất
    var pIn = document.getElementById('customPrimaryInput');
    if (pIn) pIn.value = localStorage.getItem('hadiwa_custom_primary') || '#30BD6F';
  });
})();

/* ── Public: thay preset ─────────────────────────────────── */
function applyPreset(val) {
  var mode = localStorage.getItem('hadiwa_showcase_mode') || 'dark';

  // Xóa custom vars cũ (nếu có) trước khi chuyển sang preset khác
  if (val !== 'custom') {
    _clearAllCustomVars();
  }

  document.documentElement.setAttribute('data-theme', val);
  localStorage.setItem('hadiwa_showcase_preset', val);

  var sel = document.getElementById('presetSelect');
  if (sel) sel.value = val;

  // Hiển thị / ẩn color builder panel
  var panel = document.getElementById('colorBuilderPanel');
  if (panel) panel.style.display = (val === 'custom') ? 'flex' : 'none';

  if (val === 'custom') {
    _applyCustomToShell(mode);
  }

  syncThemeToFrame();
}

/* ── Public: thay mode ───────────────────────────────────── */
function applyMode(val) {
  var preset = localStorage.getItem('hadiwa_showcase_preset') || 'hadiwa-original';
  document.documentElement.setAttribute('data-mode', val);
  localStorage.setItem('hadiwa_showcase_mode', val);

  var sel = document.getElementById('modeSelect');
  if (sel) sel.value = val;

  if (preset === 'custom') {
    _applyCustomToShell(val);
  }

  syncThemeToFrame();
}

/* ── Public: đổi màu chủ đạo (1 màu duy nhất) ─────────────── */
function applyCustomColor(hex) {
  // Trực tiếp nhận màu hex chủ đạo
  localStorage.setItem('hadiwa_custom_primary', hex);
  var mode = localStorage.getItem('hadiwa_showcase_mode') || 'dark';
  _applyCustomToShell(mode);
  syncThemeToFrame();
}

/* ── Public: sync theme vào iframe ──────────────────────── */
function syncThemeToFrame() {
  var frame = document.getElementById('screenFrame');
  if (!frame) return;

  var preset = localStorage.getItem('hadiwa_showcase_preset') || 'hadiwa-original';
  var mode   = localStorage.getItem('hadiwa_showcase_mode')   || 'dark';

  var customVars = null;
  if (preset === 'custom') {
    customVars = _buildCustomVars(mode);
  }

  // 1. Tác động trực tiếp vào DOM của iframe (nếu cùng origin / file protocol local) -> 0ms latency!
  try {
    if (frame.contentDocument && frame.contentDocument.documentElement) {
      var docEl = frame.contentDocument.documentElement;
      docEl.setAttribute('data-theme', preset);
      docEl.setAttribute('data-mode',  mode);

      if (customVars) {
        Object.keys(customVars).forEach(function(k) {
          docEl.style.setProperty(k, customVars[k]);
        });
      } else {
        if (typeof _CUSTOM_VAR_KEYS !== 'undefined') {
          _CUSTOM_VAR_KEYS.forEach(function(k) {
            docEl.style.removeProperty(k);
          });
        }
      }
    }
  } catch (err) {}

  // 2. Broadcast postMessage với targetOrigin '*' (đảm bảo tương thích khi mở qua file:// hoặc http://)
  try {
    if (frame.contentWindow) {
      frame.contentWindow.postMessage({
        type: 'HADIWA_THEME_CHANGED',
        preset: preset,
        mode: mode,
        customVars: customVars
      }, '*');
    }
  } catch(e) {}
}

/* ── Private helpers ─────────────────────────────────────── */
function _buildCustomVars(mode) {
  var primary = localStorage.getItem('hadiwa_custom_primary') || '#30BD6F';
  // generateThemeFromColors tự động tính secondary + accent từ 1 màu primary
  return generateThemeFromColors(primary, mode);
}

function _applyCustomToShell(mode) {
  var vars = _buildCustomVars(mode);
  applyCustomVarsToElement(vars, document.documentElement);
  // Cache để iframe reload có thể restore
  try {
    localStorage.setItem('hadiwa_custom_vars_' + mode, JSON.stringify(vars));
  } catch(e) {}
}

var _CUSTOM_VAR_KEYS = [
  '--body-bg','--body-glow','--bg-app','--bg-secondary','--card-bg',
  '--card-border','--header-bg','--card-hero-bg','--card-hero-border',
  '--text-main','--text-sub','--text-muted','--primary','--primary-soft',
  '--secondary','--secondary-soft','--accent','--accent-soft','--accent-glow','--success','--warning','--danger','--info',
  '--tabbar-bg','--tabbar-border','--tab-active-bg','--tab-active-icon',
  '--tab-active-text','--tab-inactive-icon','--tab-inactive-text',
  '--center-ring-bg','--center-ring-border','--center-ring-glow','--center-tab-label'
];

function _clearAllCustomVars() {
  _CUSTOM_VAR_KEYS.forEach(function(k) {
    document.documentElement.style.removeProperty(k);
  });
}
