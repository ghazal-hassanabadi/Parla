export function initSelect() {
  document.querySelectorAll('[data-select]').forEach((root) => {
    const button = root.querySelector('[data-select-button]');
    const text = root.querySelector('[data-select-text]');
    const list = root.querySelector('[data-select-list]');
    const hidden = root.querySelector('input[type="hidden"]');
    const options = [...list.querySelectorAll('[role="option"]')];

    const open = () => {
      list.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      const selected = options.find((o) => o.getAttribute('aria-selected') === 'true');
      (selected ?? options[0]).focus();
    };

    const close = () => {
      list.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    };

    const choose = (option) => {
      options.forEach((o) => o.setAttribute('aria-selected', String(o === option)));
      hidden.value = option.textContent.trim();
      text.textContent = hidden.value;
      text.classList.remove('text-ink/50');
      close();
      button.focus();
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
    };

    // برای اینکه فرم بتواند مقدار ذخیره‌شده را برگرداند
    const restore = () => {
      const match = options.find((o) => o.textContent.trim() === hidden.value);
      if (match) {
        options.forEach((o) => o.setAttribute('aria-selected', String(o === match)));
        text.textContent = hidden.value;
        text.classList.remove('text-ink/50');
      }
    };
    root.restore = restore;

    button.addEventListener('click', () => (list.hidden ? open() : close()));

    options.forEach((option) => {
      option.addEventListener('click', () => choose(option));
    });

    list.addEventListener('keydown', (event) => {
      const index = options.indexOf(document.activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        options[Math.min(index + 1, options.length - 1)].focus();
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        options[Math.max(index - 1, 0)].focus();
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (index >= 0) choose(options[index]);
      }
      if (event.key === 'Escape') {
        close();
        button.focus();
      }
    });

    // بستن با کلیک بیرون
    document.addEventListener('click', (event) => {
      if (!root.contains(event.target)) close();
    });
  });
}