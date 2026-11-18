import { Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { handleImageError } from '../../utils/images';

const BANNERS = [
  {
    to: '/shop?category=sets',
    tone: 'cobalt',
    title: 'ست‌های دونفره و مجلسی',
    text: 'ست کاپلی، وست و شلوار؛ طرح‌های هماهنگ برای مناسبت‌های خاص.',
    productId: 5,
  },
  {
    to: '/shop?category=outerwear',
    tone: 'ink',
    title: 'کت و کاپشن برای روزهای سرد',
    text: 'از کاپشن زمستانی تا بارانی بلند و کت‌های فوتر.',
    productId: 3,
  },
];

export default function PromoBanners() {
  return (
    <section className="section section--tight" aria-label="پیشنهادهای دسته‌بندی">
      <div className="container banners">
        {BANNERS.map((b) => {
          const product = getProductById(b.productId);
          return (
            <Link key={b.to} to={b.to} className={`banner banner--${b.tone}`}>
              <div className="banner__copy">
                <h2 className="banner__title">{b.title}</h2>
                <p>{b.text}</p>
              </div>
              <span className="banner__cta">مشاهده محصولات</span>
              {product && (
                <img className="banner__img" src={product.image} alt="" width="200" height="250" loading="lazy" onError={handleImageError} />
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
