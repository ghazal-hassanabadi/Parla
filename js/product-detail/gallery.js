export function initGallery(root = document) {
  const mainImage = root.querySelector('[data-main-image]');
  const thumbs = root.querySelectorAll('[data-thumb]');
  if (!mainImage || !thumbs.length) return;

  const select = (thumb) => {
    mainImage.src = thumb.dataset.src;
    mainImage.alt = thumb.querySelector('img').alt;
    thumbs.forEach((t) => t.removeAttribute('aria-current'));
    thumb.setAttribute('aria-current', 'true');
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => select(thumb));
  });
}