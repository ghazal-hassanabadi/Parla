import { formatPrice } from '../cart/price.js';
import { getOrder } from './checkout-storage.js';

export function initSuccess() {
  const root = document.querySelector('[data-order-success]');
  if (!root) return;

  const order = getOrder();

  // سفارشی وجود ندارد؟ برگرد به فروشگاه
  if (!order) {
    window.location.href = 'product.html';
    return;
  }

  const set = (name, text) => {
    document.querySelector(`[data-order="${name}"]`).textContent = text;
  };

  const { address, shipping, items } = order;
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  set('code', order.code);
  set('date', order.date);
  set('status', order.status);
  set('payment', order.payment.label);
  set('receiver', `${address.fullName} - ${address.mobile}`);
  set(
    'address',
    `${address.province}، ${address.city}، ${address.address}، پلاک ${address.plaque}، کد پستی ${address.postalCode}`,
  );
  set('shipping', `${shipping.name} (${shipping.days})`);

  set('count', count.toLocaleString('fa-IR'));
  set('subtotal', formatPrice(order.subtotal));
  set('shipping-cost', shipping.cost === 0 ? 'رایگان' : formatPrice(shipping.cost));
  set('total', formatPrice(order.total));

  // لیست کالاها
  const list = document.querySelector('[data-order-list]');
  const template = document.querySelector('[data-order-item-template]');
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
}