// Simple JS for footer year and current link highlight
document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('.nav a').forEach(a => {
  if (a.getAttribute('href') === location.pathname.split('/').pop()) {
    a.setAttribute('aria-current', 'page');
  }
});
