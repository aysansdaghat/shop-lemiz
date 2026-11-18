import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, categoryLabel } from '../data/categories';
import { getAllProducts, searchProducts } from '../services/productService';
import { useCatalog } from '../services/apiClient';
import { discountPercent, faNumber, normalizeText } from '../utils/format';
import { usePageTitle } from '../hooks/usePageTitle';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

const SORTS = [
  { id: 'featured', label: 'پیشنهاد لمیز' },
  { id: 'newest', label: 'جدیدترین' },
  { id: 'cheap', label: 'ارزان‌ترین' },
  { id: 'expensive', label: 'گران‌ترین' },
  { id: 'discount', label: 'بیشترین تخفیف' },
];

function sortProducts(list, sort) {
  const copy = [...list];
  switch (sort) {
    case 'cheap':
      return copy.sort((a, b) => a.price - b.price);
    case 'expensive':
      return copy.sort((a, b) => b.price - a.price);
    case 'discount':
      return copy.sort(
        (a, b) => discountPercent(b.price, b.oldPrice) - discountPercent(a.price, a.oldPrice),
      );
    case 'newest':
      return copy.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.id - a.id);
    default:
      return copy.sort(
        (a, b) => Number(!!b.bestseller) - Number(!!a.bestseller) || a.id - b.id,
      );
  }
}

export default function Shop() {
  useCatalog();
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'all';
  const query = params.get('q') ?? '';
  const sort = params.get('sort') ?? 'featured';

  const activeCategory = categories.some((c) => c.id === category) ? category : 'all';

  usePageTitle(
    activeCategory === 'all' ? 'فروشگاه' : categoryLabel(activeCategory),
    'همه‌ی محصولات لمیز؛ تیشرت، شلوار جین، کت، کاپشن، ست و اکسسوری با قیمت روشن و ثبت سفارش ساده.',
  );

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || (key === 'sort' && value === 'featured')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    let list;
    if (query.trim()) {
      list = searchProducts(query);
      if (activeCategory !== 'all') {
        list = list.filter((p) => p.category === activeCategory);
      }
    } else if (activeCategory !== 'all') {
      list = getAllProducts().filter((p) => p.category === activeCategory);
    } else {
      list = getAllProducts();
    }
    return sortProducts(list, sort);
  }, [query, activeCategory, sort]);

  const normalizedQuery = normalizeText(query);

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'فروشگاه' }]} />

        <header className="page-head">
          <h1>{activeCategory === 'all' ? 'فروشگاه' : categoryLabel(activeCategory)}</h1>
          <p className="section-note">
            {faNumber(results.length)} محصول
            {normalizedQuery ? ` برای «${query.trim()}»` : ''}
          </p>
        </header>

        <div className="shop-toolbar">
          <div className="chip-row" role="group" aria-label="فیلتر دسته‌بندی">
            <button
              type="button"
              className="filter-chip"
              aria-pressed={activeCategory === 'all'}
              onClick={() => update('category', 'all')}
            >
              همه
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="filter-chip"
                aria-pressed={activeCategory === cat.id}
                onClick={() => update('category', cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <label className="sort-field">
            <span className="visually-hidden">مرتب‌سازی</span>
            <select value={sort} onChange={(e) => update('sort', e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {query.trim() && (
          <p className="shop-query">
            جستجو برای «{query.trim()}»
            <button type="button" className="link-btn" onClick={() => update('q', '')}>
              پاک کردن
            </button>
          </p>
        )}

        {results.length > 0 ? (
          <div className="product-grid">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>محصولی پیدا نشد</h2>
            <p>فیلتر یا عبارت جستجو را عوض کنید تا محصولات بیشتری ببینید.</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              نمایش همه محصولات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}