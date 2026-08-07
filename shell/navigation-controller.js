const navigationStack = [];
let currentRouteKey = 'home';

function navigateTo(routeName, params = {}) {
  const route = window.HADIWA_ROUTES[routeName];
  if (!route) return;

  navigationStack.push({ routeName: currentRouteKey, params });
  currentRouteKey = routeName;

  const baseUrl = window.location.href.split('?')[0].split('#')[0];
  const url = new URL(route.path, baseUrl);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const frame = document.getElementById('screenFrame');
  if(frame) {
    frame.src = url.toString();
    // After the new page loads, push the current theme into the iframe
    frame.onload = function() { syncThemeToFrame(); };
  }

  setActiveTab(route.tab);
}

function goBack() {
  if (navigationStack.length > 0) {
    const prev = navigationStack.pop();
    currentRouteKey = prev.routeName;
    const route = window.HADIWA_ROUTES[prev.routeName];
    if (route) {
      const baseUrl = window.location.href.split('?')[0].split('#')[0];
      const url = new URL(route.path, baseUrl);
      Object.entries(prev.params || {}).forEach(([k, v]) => url.searchParams.set(k, String(v)));
      const frame = document.getElementById('screenFrame');
      if(frame) {
        frame.src = url.toString();
        frame.onload = function() { syncThemeToFrame(); };
      }
      setActiveTab(route.tab);
    }
  } else {
    navigateTo('home');
  }
}

function setActiveTab(tabKey) {
  document.querySelectorAll('.tab-item, .tab-item-center').forEach(el => {
    if(el.id === 'tab-' + tabKey) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}
