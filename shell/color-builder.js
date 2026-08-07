/**
 * COLOR BUILDER ENGINE
 * Sinh đầy đủ CSS semantic tokens từ 3 màu chủ đạo:
 *   primary, secondary, accent
 * Hỗ trợ cả dark mode và light mode.
 * Không có dependency ngoài — pure vanilla JS.
 */

/* ─── Helpers ─────────────────────────────────────────────── */
function _hexToRgb(hex) {
  var h = hex.replace('#', '');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  return {
    r: parseInt(h.slice(0,2), 16),
    g: parseInt(h.slice(2,4), 16),
    b: parseInt(h.slice(4,6), 16)
  };
}

function _rgbToHex(r, g, b) {
  return '#' +
    Math.round(Math.max(0,Math.min(255,r))).toString(16).padStart(2,'0') +
    Math.round(Math.max(0,Math.min(255,g))).toString(16).padStart(2,'0') +
    Math.round(Math.max(0,Math.min(255,b))).toString(16).padStart(2,'0');
}

function _hexToHsl(hex) {
  var c = _hexToRgb(hex);
  var r = c.r/255, g = c.g/255, b = c.b/255;
  var max = Math.max(r,g,b), min = Math.min(r,g,b);
  var h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    var d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h = (g-b)/d + (g<b?6:0); break;
      case g: h = (b-r)/d + 2; break;
      default: h = (r-g)/d + 4;
    }
    h /= 6;
  }
  return { h: h*360, s: s*100, l: l*100 };
}

function _hslToHex(h, s, l) {
  h = ((h%360)+360)%360;
  s = Math.max(0,Math.min(100,s))/100;
  l = Math.max(0,Math.min(100,l))/100;
  var c = (1 - Math.abs(2*l-1)) * s;
  var x = c * (1 - Math.abs((h/60)%2 - 1));
  var m = l - c/2;
  var r, g, b;
  if (h<60)  { r=c; g=x; b=0; }
  else if (h<120) { r=x; g=c; b=0; }
  else if (h<180) { r=0; g=c; b=x; }
  else if (h<240) { r=0; g=x; b=c; }
  else if (h<300) { r=x; g=0; b=c; }
  else           { r=c; g=0; b=x; }
  return _rgbToHex((r+m)*255, (g+m)*255, (b+m)*255);
}

function _rgba(hex, alpha) {
  var c = _hexToRgb(hex);
  return 'rgba('+c.r+','+c.g+','+c.b+','+alpha+')';
}

function deriveSecondaryColor(primaryHex) {
  var hsl = _hexToHsl(primaryHex);
  // Giữ cùng tông màu (+12° hue) để các thành phần phụ chuẩn tông với màu được chọn
  return _hslToHex(hsl.h + 12, Math.min(hsl.s, 85), Math.max(30, Math.min(75, hsl.l)));
}

function deriveAccentColor(primaryHex) {
  var hsl = _hexToHsl(primaryHex);
  // Màu điểm nhấn (AI Hero, Mascot Ring) giữ đúng họ màu, độ sáng rực rỡ hơn (+5° hue, +12% lightness)
  return _hslToHex(hsl.h + 5, Math.min(100, hsl.s + 10), Math.max(45, Math.min(70, hsl.l + 12)));
}

/* ─── Core Generator ───────────────────────────────────────── */
/**
 * @param {string} primary   — hex màu chủ đạo (vd: "#30BD6F")
 * @param {string} [secondary] — hex màu phụ (nếu không truyền sẽ tự tính)
 * @param {string} [accent]    — hex màu nhấn (nếu không truyền sẽ tự tính)
 * @param {'dark'|'light'} mode
 * @returns {Object} map tên CSS var → giá trị
 */
function generateThemeFromColors(primary, secondary, accent, mode) {
  // Nếu chỉ truyền (primary, mode)
  if (typeof secondary === 'string' && (secondary === 'dark' || secondary === 'light')) {
    mode = secondary;
    secondary = null;
    accent = null;
  }

  if (!secondary) secondary = deriveSecondaryColor(primary);
  if (!accent) accent = deriveAccentColor(primary);

  var hsl = _hexToHsl(primary);
  var H = hsl.h, S = hsl.s;

  var vars = {};

  if (mode === 'dark') {
    /* --- Backgrounds --- */
    vars['--body-bg']           = _hslToHex(H, Math.min(S*0.5, 18), 3.5);
    vars['--body-glow']         = _rgba(primary, 0.24);
    vars['--bg-app']            = _hslToHex(H, Math.min(S*0.6, 28), 7);
    vars['--bg-secondary']      = _hslToHex(H, Math.min(S*0.65, 32), 11);
    /* --- Cards --- */
    vars['--card-bg']           = _hslToHex(H, Math.min(S*0.6, 28), 14);
    vars['--card-border']       = _rgba(primary, 0.25);
    vars['--header-bg']         = vars['--bg-secondary'];
    vars['--card-hero-bg']      = _rgba(primary, 0.16);
    vars['--card-hero-border']  = _rgba(primary, 0.36);
    /* --- Text --- */
    vars['--text-main']         = '#FFFFFF';
    vars['--text-sub']          = 'rgba(255,255,255,0.76)';
    vars['--text-muted']        = '#94A3B8';
    /* --- Brand colors --- */
    vars['--primary']           = primary;
    vars['--primary-soft']      = _rgba(primary, 0.18);
    vars['--secondary']         = secondary;
    vars['--secondary-soft']    = _rgba(secondary, 0.18);
    vars['--accent']            = accent;
    vars['--accent-soft']       = _rgba(accent, 0.18);
    vars['--accent-glow']       = '0 0 20px ' + _rgba(accent, 0.60);
    /* --- Status (cố định) --- */
    vars['--success']           = '#10B981';
    vars['--warning']           = '#F59E0B';
    vars['--danger']            = '#EF4444';
    vars['--info']              = secondary;
    /* --- Tabbar --- */
    vars['--tabbar-bg']         = _rgba(_hslToHex(H, Math.min(S*0.4,22), 6), 0.97);
    vars['--tabbar-border']     = _rgba(primary, 0.48);
    vars['--tab-active-bg']     = _rgba(primary, 0.20);
    vars['--tab-active-icon']   = primary;
    vars['--tab-active-text']   = primary;
    vars['--tab-inactive-icon'] = 'rgba(255,255,255,0.38)';
    vars['--tab-inactive-text'] = 'rgba(255,255,255,0.38)';
    /* --- Center mascot ring --- */
    vars['--center-ring-bg']    =
      'radial-gradient(circle,' + _rgba(accent,0.35) + ' 0%,' +
      _rgba(_hslToHex(H,Math.min(S*0.5,24),8), 0.90) + ' 100%)';
    vars['--center-ring-border'] = accent;
    vars['--center-ring-glow']  = '0 0 24px ' + _rgba(accent, 0.75);
    vars['--center-tab-label']  = _rgba(accent, 0.90);
  } else {
    /* --- Light mode --- */
    vars['--body-bg']           = _hslToHex(H, Math.min(S*0.25, 15), 88);
    vars['--body-glow']         = _rgba(primary, 0.18);
    vars['--bg-app']            = _hslToHex(H, Math.min(S*0.15, 8), 97);
    vars['--bg-secondary']      = _hslToHex(H, Math.min(S*0.22, 12), 93);
    vars['--card-bg']           = '#FFFFFF';
    vars['--card-border']       = _rgba(primary, 0.18);
    vars['--header-bg']         = '#FFFFFF';
    vars['--card-hero-bg']      = _hslToHex(H, Math.min(S*0.4, 30), 92);
    vars['--card-hero-border']  = _rgba(accent, 0.35);
    vars['--text-main']         = _hslToHex(H, Math.min(S*0.7, 40), 12);
    vars['--text-sub']          = '#475569';
    vars['--text-muted']        = '#94A3B8';
    vars['--primary']           = primary;
    vars['--primary-soft']      = _rgba(primary, 0.12);
    vars['--secondary']         = secondary;
    vars['--secondary-soft']    = _rgba(secondary, 0.14);
    vars['--accent']            = accent;
    vars['--accent-soft']       = _rgba(accent, 0.14);
    vars['--accent-glow']       = '0 0 16px ' + _rgba(accent, 0.40);
    vars['--success']           = '#10B981';
    vars['--warning']           = '#F59E0B';
    vars['--danger']            = '#EF4444';
    vars['--info']              = secondary;
    vars['--tabbar-bg']         = 'rgba(255,255,255,0.97)';
    vars['--tabbar-border']     = _rgba(primary, 0.28);
    vars['--tab-active-bg']     = _rgba(primary, 0.12);
    vars['--tab-active-icon']   = primary;
    vars['--tab-active-text']   = primary;
    vars['--tab-inactive-icon'] = '#94A3B8';
    vars['--tab-inactive-text'] = '#94A3B8';
    vars['--center-ring-bg']    =
      'radial-gradient(circle,' + _rgba(primary,0.22) + ' 0%,' +
      'rgba(245,245,250,0.95) 100%)';
    vars['--center-ring-border'] = primary;
    vars['--center-ring-glow']  = '0 0 16px ' + _rgba(primary, 0.40);
    vars['--center-tab-label']  = primary;
  }
  return vars;
}

/**
 * Áp dụng map CSS vars vào element (mặc định document.documentElement)
 */
function applyCustomVarsToElement(vars, el) {
  el = el || document.documentElement;
  Object.keys(vars).forEach(function(k) {
    el.style.setProperty(k, vars[k]);
  });
}

/**
 * Xóa custom vars khỏi element để CSS preset lại có hiệu lực
 */
function clearCustomVarsFromElement(vars, el) {
  el = el || document.documentElement;
  if (!vars) return;
  Object.keys(vars).forEach(function(k) {
    el.style.removeProperty(k);
  });
}
