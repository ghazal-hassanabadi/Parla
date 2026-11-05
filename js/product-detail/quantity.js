export function initQuantity(root = document) {
  const input = root.querySelector('[data-qty-input]');
  const minus = root.querySelector('[data-qty-minus]');
  const plus = root.querySelector('[data-qty-plus]');
  if (!input || !minus || !plus) return;

  const min = Number(input.min) || 1;
  const max = Number(input.max) || 10;

  const clamp = (value) => Math.min(Math.max(value, min), max);
  const change = (amount) => {
    input.value = clamp(Number(input.value) + amount);
  };

  minus.addEventListener('click', () => change(-1));
  plus.addEventListener('click', () => change(1));

  input.addEventListener('change', () => {
    input.value = clamp(Number(input.value) || min);
  });
}