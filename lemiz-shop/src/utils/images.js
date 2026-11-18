// تصویر جایگزین وقتی لینک تصویر محصول از کار بیفتد.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#DAD8F2"/><g fill="none" stroke="#565C78" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M200 190c0-22 30-26 30-52a30 30 0 1 0-60 0"/><path d="M200 190 90 290a18 18 0 0 0 12 31h196a18 18 0 0 0 12-31z"/></g></svg>`;

export const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export function handleImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = '1';
  img.src = PLACEHOLDER_IMAGE;
}
