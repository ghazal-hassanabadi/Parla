(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.classList.toggle('dark', dark);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'تغییر تم');
    btn.className = 'fixed bottom-4 left-4 z-50 flex items-center justify-center size-10 rounded-full bg-olive text-white shadow-lg cursor-pointer hover:opacity-80';

    function paint() {
      btn.innerHTML = root.classList.contains('dark')
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    }

    btn.addEventListener('click', function () {
      var isDark = root.classList.toggle('dark');
      try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
      paint();
    });

    paint();
    document.body.appendChild(btn);
  });
})();