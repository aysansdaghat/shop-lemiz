import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getProductById, getByCategory } from '../services/productService';
import { useCatalog } from '../services/apiClient';
import { categoryLabel } from '../data/categories';
import { reviews } from '../data/reviews';
import { discountPercent, faNumber, formatPrice } from '../utils/format';
import { handleImageError } from '../utils/images';
import { usePageTitle } from '../hooks/usePageTitle';
import AddToCart from '../components/AddToCart';
import WishlistButton from '../components/WishlistButton';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ProductDetail() {
  useCatalog();
  const { id } = useParams();
  const product = getProductById(id);

  usePageTitle(product ? product.name : 'محصول پیدا نشد');

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">
          <h1>محصول موردنظر پیدا نشد</h1>
          <p>ممکن است آدرس را اشتباه وارد کرده باشید یا محصول برداشته شده باشد.</p>
          <Link to="/shop" className="btn btn-primary">
            مشاهده فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  const percent = discountPercent(product.price, product.oldPrice);
  const outOfStock = product.stock <= 0;
  const related = getByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'خانه', to: '/' },
            { label: 'فروشگاه', to: '/shop' },
            { label: categoryLabel(product.category), to: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />

        <div className="pdp">
          <div className="pdp__media">
            <img
              src={product.image}
              alt={product.name}
              width="400"
              height="500"
              loading="eager"
              decoding="async"
              onError={handleImageError}
            />
            <div className="product-card__badges">
              {outOfStock && <span className="chip chip--out">ناموجود</span>}
              {percent > 0 && <span className="chip chip--sale">{faNumber(percent)}٪ تخفیف</span>}
              {product.isNew && <span className="chip">جدید</span>}
              {product.bestseller && <span className="chip">پرفروش</span>}
            </div>
          </div>

          <div className="pdp__info">
            <p className="pdp__category">{categoryLabel(product.category)}</p>
            <h1 className="pdp__name">{product.name}</h1>

            <p className="price price--large pdp__price">
              <span className="price__now">{formatPrice(product.price)}</span>
              {product.oldPrice > product.price && (
                <s className="price__old">
                  <span className="visually-hidden">قیمت قبلی </span>
                  {formatPrice(product.oldPrice)}
                </s>
              )}
            </p>
            {percent > 0 && (
              <p className="pdp__saving">{formatPrice(product.oldPrice - product.price)} کمتر از قیمت قبلی</p>
            )}

            <p className="pdp__desc">{product.description}</p>

            <div className="pdp__status" role="status">
              {outOfStock ? (
                <span className="pdp__stock is-out">این محصول فعلاً ناموجود است.</span>
              ) : product.stock <= 9 ? (
                <span className="pdp__stock is-low">فقط {faNumber(product.stock)} عدد در انبار باقی مانده.</span>
              ) : (
                <span className="pdp__stock">موجود در انبار</span>
              )}
            </div>

            <div className="pdp__actions">
              <AddToCart product={product} variant="primary" />
              <WishlistButton product={product} />
            </div>

            <ul className="pdp__assurances">
              <li>ثبت سفارش با یک پیام در واتساپ یا دایرکت اینستاگرام</li>
              <li>نیازی به ساخت حساب کاربری نیست</li>
              <li>سبد خرید شما روی همین مرورگر ذخیره می‌ماند</li>
            </ul>
          </div>
        </div>

        {productReviews.length > 0 && (
          <section className="section section--tight" aria-labelledby="pdp-reviews-title">
            <div className="section-head">
              <h2 id="pdp-reviews-title">نظر درباره‌ی {product.name}</h2>
              <p className="section-note">نمایشی</p>
            </div>
            <div className="reviews">
              {productReviews.map((review) => (
                <figure className="review" key={review.id}>
                  <blockquote>
                    <p>{review.text}</p>
                  </blockquote>
                  <figcaption>
                    <strong>{review.name}</strong>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="section section--flush-top" aria-labelledby="related-title">
            <div className="section-head">
              <h2 id="related-title">محصولات مشابه</h2>
              <Link to={`/shop?category=${product.category}`} className="text-link">
                همه {categoryLabel(product.category)}
                <ArrowLeft size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}