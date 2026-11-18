import { ORDER_CONFIG } from '../data/site';
import { formatPrice } from '../utils/format';

export function buildOrderMessage(lines, total) {
  const rows = lines.map(({ product, qty }) => `- ${product.name} × ${qty}`);
  return ['سلام، می‌خوام این محصولات رو سفارش بدم:', ...rows, `جمع کل: ${formatPrice(total)}`].join('\n');
}

// وضعیت برگشتی: 'whatsapp' | 'copied' | 'manual'
export async function sendOrder(lines, total) {
  const text = buildOrderMessage(lines, total);

  if (ORDER_CONFIG.method === 'whatsapp') {
    const url = `https://wa.me/${ORDER_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
    return { status: 'whatsapp', text };
  }

  // دایرکت اینستاگرام متن آماده قبول نمی‌کند؛ متن را کپی می‌کنیم.
  // کپی و باز کردن پنجره هر دو در همان لحظه‌ی کلیک شروع می‌شوند تا مرورگر مسدودشان نکند.
  let copyPromise = Promise.reject(new Error('clipboard unavailable'));
  if (navigator.clipboard?.writeText) copyPromise = navigator.clipboard.writeText(text);
  window.open(`https://ig.me/m/${ORDER_CONFIG.instagramUsername}`, '_blank', 'noopener');

  try {
    await copyPromise;
    return { status: 'copied', text };
  } catch {
    return { status: 'manual', text };
  }
}
