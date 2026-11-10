import { getCount } from './storage.js';

export function updateCartBadge() {
  const count = getCount();

  document.querySelectorAll('[data-cart-count]').forEach((badge) => {
    badge.textContent = count.toLocaleString('fa-IR');
    badge.hidden = count === 0;
  });
}