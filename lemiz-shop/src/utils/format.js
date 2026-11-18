const faFormatter = new Intl.NumberFormat('fa-IR');

export const faNumber = (n) => faFormatter.format(n);
export const formatPrice = (n) => `${faNumber(n)} تومان`;

export function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

// نرمال‌سازی متن برای جستجو: ی/ک عربی، نیم‌فاصله، اعراب و فاصله‌های اضافه
export function normalizeText(value) {
  return String(value ?? '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200c\u200e\u200f]/g, ' ')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
