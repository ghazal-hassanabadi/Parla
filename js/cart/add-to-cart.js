import { getCart, saveCart } from './storage.js';
import { toNumber } from './price.js';

const MAX_QTY = 10;

export function initAddToCart() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;

    const card = button.closest('article');
    if (!card) return;

    const name = card.querySelector('h1, h2, h3').textContent.replace(/\s+/g, ' ').trim();
    const priceEl = card.querySelector('ins') ?? card.querySelector('p');
    const price = toNumber(priceEl.textContent);
    const image = card.querySelector('img').getAttribute('src');
    const qty = Number(card.querySelector('[data-qty-input]')?.value) || 1;

    const items = getCart();
    const existing = items.find((item) => item.name === name);

    if (existing) {
      existing.qty = Math.min(existing.qty + qty, MAX_QTY);
    } else {
      items.push({ name, price, image, qty });
    }

    saveCart(items);
    window.location.href = 'cart.html';
  });
}