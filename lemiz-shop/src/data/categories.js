// دسته‌بندی‌ها. image یکی از محصولات موجود است (id محصول) تا تصویر همان دسته را نشان دهد.
export const categories = [
  { id: 'outerwear', label: 'کت و کاپشن', imageProductId: 3, tone: 'ink' },
  { id: 'pants', label: 'شلوار', imageProductId: 2, tone: 'lilac' },
  { id: 'tops', label: 'تیشرت و هودی', imageProductId: 8, tone: 'bone' },
  { id: 'sets', label: 'ست‌ها', imageProductId: 10, tone: 'bone' },
  { id: 'accessories', label: 'اکسسوری', imageProductId: 14, tone: 'lilac' },
];

export const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? '';
