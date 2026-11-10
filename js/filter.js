const persianDigits = '۰۱۲۳۴۵۶۷۸۹';

const toNumber = (text) => {
  const english = text.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d));
  return Number(english.replace(/\D/g, ''));
};

const formatPrice = (value) => `${value.toLocaleString('fa-IR')} تومان`;

export function initFilter(root = document) {
  const form = root.querySelector('[data-filter-form]');
  const items = root.querySelectorAll('[data-category]');
  if (!form || !items.length) return;

  const categoryBoxes = [...form.querySelectorAll('input[name="category"]')];
  const allBox = categoryBoxes.find((box) => box.value === 'all');
  const otherBoxes = categoryBoxes.filter((box) => box !== allBox);

  const minInput = form.elements['price-min'];
  const maxInput = form.elements['price-max'];
  const minLabel = form.querySelector('[data-price-min-label]');
  const maxLabel = form.querySelector('[data-price-max-label]');

  const prices = new Map();
  items.forEach((item) => {
    const priceEl = item.querySelector('ins') || item.querySelector('p');
    prices.set(item, toNumber(priceEl.textContent));
  });

  const syncCategories = (changed) => {
    if (changed === allBox) {
      otherBoxes.forEach((box) => (box.checked = false));
    } else if (changed.checked) {
      allBox.checked = false;
    }
    if (!categoryBoxes.some((box) => box.checked)) {
      allBox.checked = true;
    }
  };

  const syncPrice = (changed) => {
    const min = Number(minInput.value);
    const max = Number(maxInput.value);

    if (min > max) {
      if (changed === minInput) minInput.value = max;
      else maxInput.value = min;
    }

    minLabel.textContent = formatPrice(Number(minInput.value));
    maxLabel.textContent = formatPrice(Number(maxInput.value));
  };

  const apply = () => {
    const selected = otherBoxes.filter((box) => box.checked).map((box) => box.value);
    const min = Number(minInput.value);
    const max = Number(maxInput.value);

    items.forEach((item) => {
      const inCategory = allBox.checked || selected.includes(item.dataset.category);
      const price = prices.get(item);
      const inPrice = price >= min && price <= max;
      item.hidden = !(inCategory && inPrice);
    });
  };

  categoryBoxes.forEach((box) => {
    box.addEventListener('change', () => syncCategories(box));
  });

  [minInput, maxInput].forEach((input) => {
    input.addEventListener('input', () => syncPrice(input));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    apply();
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      syncPrice();
      apply();
    });
  });
}