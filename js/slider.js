(() => {
  const slider = document.querySelector('[data-slider]');
  const dotsBox = document.querySelector('[data-slider-dots]');
  if (!slider) return;

  const delay = 3000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let positions = 1;
  let step = 0;
  let maxScroll = 0;
  let timer = null;
  let scrollTimer = null;

  const direction = () => (getComputedStyle(slider).direction === 'rtl' ? -1 : 1);

  const measure = () => {
    const items = slider.children;
    step = items.length > 1 ? Math.abs(items[1].offsetLeft - items[0].offsetLeft) : 0;
    maxScroll = slider.scrollWidth - slider.clientWidth;
    positions = step && maxScroll > 2 ? Math.ceil((maxScroll - 1) / step) + 1 : 1;
    if (current > positions - 1) current = 0;
  };

  const paint = () => {
    if (!dotsBox) return;
    [...dotsBox.children].forEach((dot, i) => {
      dot.setAttribute('aria-current', i === current);
    });
  };

  const goTo = (i) => {
    current = i;
    const offset = Math.min(i * step, maxScroll);
    slider.scrollTo({ left: direction() * offset, behavior: 'smooth' });
    paint();
  };

  const next = () => goTo((current + 1) % positions);

  const start = () => {
    if (reduceMotion || positions < 2 || timer) return;
    timer = setInterval(next, delay);
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const restart = () => {
    stop();
    start();
  };

  const buildDots = () => {
    if (!dotsBox) return;
    dotsBox.innerHTML = '';
    if (positions < 2) return;

    for (let i = 0; i < positions; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `اسلاید ${i + 1}`);
      dot.className = 'size-2 cursor-pointer rounded-full bg-white/40 transition aria-[current=true]:bg-gold aria-[current=true]:scale-125';
      dot.addEventListener('click', () => {
        goTo(i);
        restart();
      });
      dotsBox.appendChild(dot);
    }
    paint();
  };

  slider.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (!step) return;
      const pos = Math.round(Math.abs(slider.scrollLeft) / step);
      current = Math.min(pos, positions - 1);
      paint();
    }, 80);
  });

  slider.addEventListener('pointerdown', stop);
  slider.addEventListener('pointerup', restart);
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  window.addEventListener('resize', () => {
    stop();
    measure();
    buildDots();
    start();
  });

  window.addEventListener('load', () => {
    measure();
    buildDots();
    start();
  });
})();