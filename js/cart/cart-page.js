import { getCart, saveCart } from './storage.js';
import { updateCartBadge } from './badge.js';
import { formatPrice } from './price.js';

const SHIPPING_COST = 70000;
const FREE_SHIPPING_FROM = 1500000;
const MAX_QTY = 10;

export function initCartPage() {
  const list = document.querySelector('[data-cart-list]');
  const template = document.querySelector('[data-cart-template]');
  const content = document.querySelector('[data-cart-content]');
  const empty = document.querySelector('[data-cart-empty]');
  if (!list || !template) return;

  const countEl = document.querySelector('[data-summary-count]');
  const subtotalEl = document.querySelector('[data-summary-subtotal]');
  const shippingEl = document.querySelector('[data-summary-shipping]');
  const totalEl = document.querySelector('[data-summary-total]');
  const clearButton = document.querySelector('[data-cart-clear]');

  let items = getCart();

  const renderList = () => {
    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const row = template.content.cloneNode(true);
      const image = row.querySelector('[data-item-image]');

      row.querySelector('li').dataset.index = index;
      image.src = item.image;
      image.alt = item.name;
      row.querySelector('[data-item-name]').textContent = item.name;
      row.querySelector('[data-item-qty]').textContent = item.qty.toLocaleString('fa-IR');
      row.querySelector('[data-item-price]').textContent = formatPrice(item.price * item.qty);

      fragment.appendChild(row);
    });

    list.replaceChildren(fragment);
  };

  const renderTotals = () => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;

    countEl.textContent = count.toLocaleString('fa-IR');
    subtotalEl.textContent = formatPrice(subtotal);
    shippingEl.textContent = shipping === 0 ? 'رایگان' : formatPrice(shipping);
    totalEl.textContent = formatPrice(subtotal + shipping);
  };

  const render = () => {
    const isEmpty = items.length === 0;
    content.hidden = isEmpty;
    empty.hidden = !isEmpty;
    renderList();
    renderTotals();
  };

  const update = () => {
    saveCart(items);
    render();
    updateCartBadge();
  };

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const index = Number(button.closest('li').dataset.index);
    const item = items[index];
    const action = button.dataset.action;

    if (action === 'plus') item.qty = Math.min(item.qty + 1, MAX_QTY);
    if (action === 'minus') item.qty = Math.max(item.qty - 1, 1);
    if (action === 'remove') items.splice(index, 1);

    update();
  });

  clearButton.addEventListener('click', () => {
    items = [];
    update();
  });

  render();
}