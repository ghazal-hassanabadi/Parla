import { getCart } from '../cart/storage.js';
import { getAddress, saveAddress } from './checkout-storage.js';

const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
const arabicDigits = '٠١٢٣٤٥٦٧٨٩';

const toEnglishDigits = (text) =>
  text
    .replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d))
    .replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d));

const rules = {
  fullName: {
    test: (v) => v.trim().split(/\s+/).length >= 2 && v.trim().length >= 5,
    message: 'نام و نام خانوادگی را کامل وارد کنید.',
  },
  mobile: {
    test: (v) => /^09\d{9}$/.test(toEnglishDigits(v).trim()),
    message: 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.',
  },
  province: {
    test: (v) => v !== '',
    message: 'استان را انتخاب کنید.',
  },
  city: {
    test: (v) => v.trim().length >= 2,
    message: 'شهر را وارد کنید.',
  },
  address: {
    test: (v) => v.trim().length >= 10,
    message: 'آدرس دقیق را وارد کنید.',
  },
  plaque: {
    test: (v) => v.trim().length >= 1,
    message: 'پلاک را وارد کنید.',
  },
  postalCode: {
    test: (v) => /^\d{10}$/.test(toEnglishDigits(v).trim()),
    message: 'کد پستی باید ۱۰ رقم باشد.',
  },
};

export function initAddress() {
  const form = document.querySelector('[data-address-form]');
  if (!form) return;

  // سبد خالی است؟ برگرد به سبد خرید
  if (getCart().length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  // پر کردن فرم با اطلاعات ذخیره‌شده قبلی
  const saved = getAddress();
  if (saved) {
    Object.entries(saved).forEach(([name, value]) => {
      if (form.elements[name]) form.elements[name].value = value;
    });
    document.querySelector('[data-select]')?.restore?.();
  }

  const validateField = (name) => {
    const field = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    const valid = rules[name].test(field.value);

    error.textContent = valid ? '' : rules[name].message;
    error.hidden = valid;
    field.setAttribute('aria-invalid', String(!valid));
    return valid;
  };

  // بعد از ترک هر فیلد، همان فیلد بررسی شود
  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener('blur', () => validateField(name));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    const data = {};
    Object.keys(rules).forEach((name) => {
      data[name] = form.elements[name].value.trim();
    });
    data.mobile = toEnglishDigits(data.mobile);
    data.postalCode = toEnglishDigits(data.postalCode);

    saveAddress(data);
    window.location.href = 'checkout-shipping.html';
  });
}