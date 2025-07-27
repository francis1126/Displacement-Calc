
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

window.onload = function () {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('page-transition JS loaded');
  document.documentElement.style.opacity = 2;
  document.querySelectorAll('a[href]:not([target])').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.documentElement.style.opacity = 0;
      setTimeout(() => (window.location.href = link.href), 500);
    });
  });
});



