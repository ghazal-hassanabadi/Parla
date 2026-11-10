import { getCart, saveCart } from '../cart/storage.js';
import { formatPrice } from '../cart/price.js';
import { getAddress, getShipping, saveOrder, clearShipping } from './checkout-storage.js';
import { METHODS, getShippingCost } from './shipping-methods.js';

const PAYMENT_LABELS = {
  online: 'پرداخت آنلاین',
  cod: 'پرداخت هنگام تحویل',
};

const createOrderCode = () => `PL-${Math.floor(10000 + Math.random() * 90000)}`;

export function initPayment() {
  const form = document.querySelector('[data-payment-form]');
  if (!form) return;

  const items = getCart();
  const address = getAddress();
  const shippingId = getShipping();

  // مرحله‌های قبل کامل نشده؟ برگرد
  if (items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  if (!address) {
    window.location.href = 'checkout-address.html';
    return;
  }
  if (!METHODS[shippingId]) {
    window.location.href = 'checkout-shipping.html';
    return;
  }

  const method = METHODS[shippingId];
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost = getShippingCost(shippingId, subtotal);
  const total = subtotal + shippingCost;

  const list = document.querySelector('[data-pay-list]');
  const template = document.querySelector('[data-pay-item-template]');
  const submitButton = form.querySelector('[type="submit"]');
  const errorBox = document.querySelector('[data-pay-error]');
  const gateway = document.querySelector('[data-gateway]');

  // ---------- نمایش اطلاعات ----------
  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const row = template.content.cloneNode(true);
    const image = row.querySelector('[data-item-image]');

    image.src = item.image;
    image.alt = item.name;
    row.querySelector('[data-item-name]').textContent = item.name;
    row.querySelector('[data-item-qty]').textContent = item.qty.toLocaleString('fa-IR');
    row.querySelector('[data-item-price]').textContent = formatPrice(item.price * item.qty);
    fragment.appendChild(row);
  });
  list.replaceChildren(fragment);

  document.querySelector('[data-pay-receiver]').textContent = `${address.fullName} - ${address.mobile}`;
  document.querySelector('[data-pay-address]').textContent =
    `${address.province}، ${address.city}، ${address.address}، پلاک ${address.plaque}، کد پستی ${address.postalCode}`;
  document.querySelector('[data-pay-shipping]').textContent = `${method.name} (${method.days})`;

  document.querySelector('[data-sum-count]').textContent = count.toLocaleString('fa-IR');
  document.querySelector('[data-sum-subtotal]').textContent = formatPrice(subtotal);
  document.querySelector('[data-sum-shipping]').textContent =
    shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost);
  document.querySelector('[data-sum-total]').textContent = formatPrice(total);
  document.querySelector('[data-gateway-amount]').textContent = formatPrice(total);

  // ---------- ثبت سفارش ----------
  const placeOrder = (paymentId) => {
    submitButton.disabled = true;

    const order = {
      code: createOrderCode(),
      date: new Date().toLocaleDateString('fa-IR'),
      items,
      address,
      shipping: { id: shippingId, name: method.name, days: method.days, cost: shippingCost },
      subtotal,
      total,
      payment: { id: paymentId, label: PAYMENT_LABELS[paymentId] },
      status: paymentId === 'online' ? 'پرداخت شده' : 'در انتظار تأیید',
    };

    saveOrder(order);
    saveCart([]);
    clearShipping();
    window.location.href = 'order-success.html';
  };

  // ---------- درگاه آزمایشی ----------
  gateway.querySelector('[data-gateway-success]').addEventListener('click', () => {
    gateway.close();
    placeOrder('online');
  });

  gateway.querySelector('[data-gateway-fail]').addEventListener('click', () => {
    gateway.close();
    errorBox.hidden = false;
    errorBox.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorBox.hidden = true;

    const paymentId = form.elements.payment.value;

    if (paymentId === 'online') {
      gateway.showModal();
    } else {
      placeOrder('cod');
    }
  });
}