const KEY = 'parla-cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}