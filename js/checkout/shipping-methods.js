export const FREE_SHIPPING_FROM = 1500000;

export const METHODS = {
  post: { name: 'پست پیشتاز', days: '۲ تا ۳ روز کاری', cost: 70000, freeOver: true },
  tipax: { name: 'تیپاکس', days: '۱ تا ۲ روز کاری', cost: 120000, freeOver: false },
};

export function getShippingCost(id, subtotal) {
  const method = METHODS[id];
  if (!method) return 0;
  if (method.freeOver && subtotal >= FREE_SHIPPING_FROM) return 0;
  return method.cost;
}