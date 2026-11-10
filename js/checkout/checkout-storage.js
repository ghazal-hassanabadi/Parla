const ADDRESS_KEY = 'parla-address';

export function getAddress() {
  try {
    return JSON.parse(localStorage.getItem(ADDRESS_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function saveAddress(data) {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(data));
}

const SHIPPING_KEY = 'parla-shipping';

export function getShipping() {
  return localStorage.getItem(SHIPPING_KEY);
}

export function saveShipping(methodId) {
  localStorage.setItem(SHIPPING_KEY, methodId);
}

const ORDER_KEY = 'parla-order';

export function saveOrder(order) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function getOrder() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function clearShipping() {
  localStorage.removeItem(SHIPPING_KEY);
}