import { Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { formatPrice } from '../../utils/format';
import { handleImageError } from '../../utils/images';
import { scrollToId } from '../../utils/scroll';

// چهار محصول که مثل برچسب (هنگ‌تگ) از یک ریل آویزان‌اند. «drop» طول نخ هر برچسب است.
const HERO_TAGS = [
  { id: 13, drop: 1 },
  { id: 2, drop: 3 },
  { id: 8, drop: 0 },
  { id: 3, drop: 2 },
];

export default function Hero() {
  return (
    <section className="hero on-cobalt" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title">سبک خودتو پیدا کن</h1>
          <p className="hero__lead">لمیز مجموعه‌ای از طرح‌های خاص است؛ تیشرت، شلوار جین، کت، کاپشن و ست‌های دونفره.</p>
          <div className="hero__actions">
            <Link to="/shop" className="btn btn-bone">
              مشاهده فروشگاه
            </Link>
            <button type="button" className="btn btn-outline-bone" onClick={() => scrollToId('offers')}>
              پیشنهادهای ویژه
            </button>
          </div>
        </div>

        <ul className="rail" aria-label="چند محصول از مجموعه">
          {HERO_TAGS.map(({ id, drop }, index) => {
            const product = getProductById(id);
            if (!product) return null;
            return (
              <li key={id} className="tag-wrap" style={{ '--i': index, '--d': drop }}>
                <Link to={`/product/${id}`} className="tag">
                  <img
                    src={product.image}
                    alt=""
                    width="400"
                    height="500"
                    loading="eager"
                    decoding="async"
                    onError={handleImageError}
                  />
                  <span className="tag__name">{product.name}</span>
                  <span className="tag__price">{formatPrice(product.price)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
