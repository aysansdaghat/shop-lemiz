// سرویس محصولات: از API بک‌اند می‌خواند و اگر در دسترس نبود،
// به داده‌ی نمایشی (src/data/products.js) برمی‌گردد.
import { products as demoProducts } from '../data/products';
import { categoryLabel } from '../data/categories';
import { normalizeText } from '../utils/format';
import { getCatalogSnapshot, request } from './apiClient';

// تبدیل محصول API به ساختار موردنیاز فرانت
function mapProduct(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice ?? p.old_price ?? null,
    description: p.description ?? '',
    image: p.image ?? '',
    category: typeof p.category === 'string' ? p.category : p.category?.slug ?? p.category,
    stock: p.stock ?? 0,
    isNew: p.isNew ?? p.is_new ?? false,
    bestseller: p.bestseller ?? p.is_bestseller ?? false,
  };
}

// محصولات از استور (API-first، fallback به داده‌ی نمایشی)
export function getAllProducts() {
  const snapshot = getCatalogSnapshot();
  if (snapshot.products.length > 0) return snapshot.products.map(mapProduct);
  return demoProducts;
}

export function getProductById(id) {
  const numId = Number(id);
  const snapshot = getCatalogSnapshot();
  if (snapshot.products.length > 0) {
    const found = snapshot.products.map(mapProduct).find((p) => p.id === numId);
    if (found) return found;
  }
  return demoProducts.find((p) => p.id === numId);
}

export const getProductByName = (name) => getAllProducts().find((p) => p.name === name);
export const getBestsellers = () => getAllProducts().filter((p) => p.bestseller);
export const getNewArrivals = () => getAllProducts().filter((p) => p.isNew);
export const getDiscounted = () =>
  getAllProducts().filter((p) => p.oldPrice && p.oldPrice > p.price);
export const getByCategory = (categoryId) =>
  getAllProducts().filter((p) => p.category === categoryId);

// جستجو بر اساس نام و دسته؛ همه‌ی کلمه‌ها باید در متن باشند.
export function searchProducts(query) {
  const tokens = normalizeText(query).split(' ').filter(Boolean);
  if (tokens.length === 0) return [];
  return getAllProducts().filter((p) => {
    const haystack = normalizeText(`${p.name} ${categoryLabel(p.category)}`);
    return tokens.every((t) => haystack.includes(t));
  });
}

// بارگذاری یک‌باره از API (برای صفحاتی که مستقیم fetch می‌کنند)
export async function fetchProducts(params = '') {
  const data = await request(`/products/${params}`);
  return (data.results ?? data ?? []).map(mapProduct);
}