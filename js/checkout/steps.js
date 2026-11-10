export function initSteps() {
  const nav = document.querySelector('[data-steps]');
  if (!nav) return;

  const current = Number(nav.dataset.current);

  nav.querySelectorAll('[data-step]').forEach((step) => {
    const number = Number(step.dataset.step);

    if (number < current) {
      step.dataset.done = 'true';
      step.querySelector('i').className = 'fa-solid fa-check';
    }

    if (number === current) {
      step.setAttribute('aria-current', 'step');
    }
  });
}