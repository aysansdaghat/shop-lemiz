import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categories } from '../data/categories';
import { getByCategory, getProductById } from '../services/productService';
import { useCatalog } from '../services/apiClient';
import { faNumber } from '../utils/format';
import { handleImageError } from '../utils/images';
import { usePageTitle } from '../hooks/usePageTitle';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Categories() {
  useCatalog();
  usePageTitle(
    'دسته‌بندی‌ها',
    'دسته‌بندی محصولات لمیز؛ کت و کاپشن، شلوار، تیشرت و هودی، ست‌ها و اکسسوری.',
  );

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'دسته‌بندی‌ها' }]} />

        <header className="page-head">
          <h1>دسته‌بندی‌ها</h1>
          <p className="section-note">هر دسته را باز کنید تا محصولاتش را ببینید.</p>
        </header>

        <div className="cat-grid cat-grid--page">
          {categories.map((cat, index) => {
            const product = getProductById(cat.imageProductId);
            const total = getByCategory(cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className={`cat-tile cat-tile--${cat.tone}${index === 0 ? ' cat-tile--lead' : ''}`}
              >
                {product && (
                  <img
                    className="cat-tile__img"
                    src={product.image}
                    alt=""
                    width="200"
                    height="250"
                    loading="lazy"
                    onError={handleImageError}
                  />
                )}
                <span className="cat-tile__name">{cat.label}</span>
                <span className="cat-tile__count">{faNumber(total)} محصول</span>
              </Link>
            );
          })}
        </div>

        <div className="page-cta">
          <Link to="/shop" className="btn btn-primary">
            مشاهده همه محصولات
            <ArrowLeft size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}