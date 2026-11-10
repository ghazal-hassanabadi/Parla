import { getCart } from '../cart/storage.js';
import { formatPrice } from '../cart/price.js';
import { getAddress, getShipping, saveShipping } from './checkout-storage.js';
import { METHODS, getShippingCost } from './shipping-methods.js';

export function initShipping() {
  const form = document.querySelector('[data-shipping-form]');
  if (!form) return;

  const items = getCart();
  const address = getAddress();

  // مرحله‌های قبل کامل نشده؟ برگرد
  if (items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  if (!address) {
    window.location.href = 'checkout-address.html';
    return;
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  // نوشتن هزینه کنار هر روش
  Object.keys(METHODS).forEach((id) => {
    const cost = getShippingCost(id, subtotal);
    const output = form.querySelector(`[data-cost-for="${id}"]`);
    output.textContent = cost === 0 ? 'رایگان' : formatPrice(cost);
  });

  // آدرس انتخاب‌شده
  document.querySelector('[data-ship-to]').textContent =
    `${address.fullName} - ${address.province}، ${address.city}، ${address.address}`;

  // برگرداندن انتخاب قبلی
  const saved = getShipping();
  if (saved) {
    const radio = form.querySelector(`input[name="shipping"][value="${saved}"]`);
    if (radio) radio.checked = true;
  }

  const countEl = document.querySelector('[data-sum-count]');
  const subtotalEl = document.querySelector('[data-sum-subtotal]');
  const shippingEl = document.querySelector('[data-sum-shipping]');
  const totalEl = document.querySelector('[data-sum-total]');

  const renderSummary = () => {
    const id = form.elements.shipping.value;
    const cost = getShippingCost(id, subtotal);

    countEl.textContent = count.toLocaleString('fa-IR');
    subtotalEl.textContent = formatPrice(subtotal);
    shippingEl.textContent = cost === 0 ? 'رایگان' : formatPrice(cost);
    totalEl.textContent = formatPrice(subtotal + cost);
  };

  form.addEventListener('change', renderSummary);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveShipping(form.elements.shipping.value);
    window.location.href = 'checkout-payment.html';
  });

  renderSummary();
}