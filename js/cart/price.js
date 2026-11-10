const persianDigits = '۰۱۲۳۴۵۶۷۸۹';

export const toNumber = (text) => {
  const english = text.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d));
  return Number(english.replace(/\D/g, ''));
};

export const formatPrice = (value) => `${value.toLocaleString('fa-IR')} تومان`;