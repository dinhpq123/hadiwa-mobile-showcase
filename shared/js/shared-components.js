document.addEventListener('DOMContentLoaded', () => {
  const activeTab = document.body.dataset.activeTab || 'home';
  
  // Highlight active tab
  document.querySelectorAll('.tab-item, .tab-item-center').forEach(el => {
    if(el.id === 'tab-' + activeTab) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
});
