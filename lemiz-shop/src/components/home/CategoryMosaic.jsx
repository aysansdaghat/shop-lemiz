import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { getByCategory, getProductById } from '../../services/productService';
import { faNumber } from '../../utils/format';
import { handleImageError } from '../../utils/images';

export default function CategoryMosaic() {
  return (
    <section className="section" aria-labelledby="categories-title">
      <div className="container">
        <div className="section-head">
          <h2 id="categories-title">دسته‌بندی‌ها</h2>
        </div>
        <div className="cat-grid">
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
      </div>
    </section>
  );
}
