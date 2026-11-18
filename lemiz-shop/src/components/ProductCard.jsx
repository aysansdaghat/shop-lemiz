import { Link } from 'react-router-dom';
import { categoryLabel } from '../data/categories';
import { discountPercent, faNumber, formatPrice } from '../utils/format';
import { handleImageError } from '../utils/images';
import AddToCart from './AddToCart';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product, priority = false }) {
  const percent = discountPercent(product.price, product.oldPrice);
  const outOfStock = product.stock <= 0;

  return (
    <article className={`product-card${outOfStock ? ' is-out' : ''}`}>
      <div className="product-card__media">
        <Link to={`/product/${product.id}`} className="product-card__image-link" tabIndex={-1} aria-hidden="true">
          <img
            src={product.image}
            alt=""
            width="400"
            height="500"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={handleImageError}
          />
        </Link>
        <div className="product-card__badges">
          {outOfStock && <span className="chip chip--out">ناموجود</span>}
          {percent > 0 && <span className="chip chip--sale">{faNumber(percent)}٪ تخفیف</span>}
          {product.isNew && <span className="chip">جدید</span>}
          {product.bestseller && <span className="chip">پرفروش</span>}
        </div>
        <div className="product-card__wish">
          <WishlistButton product={product} />
        </div>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__category">{categoryLabel(product.category)}</p>
        <p className="price">
          <span className="price__now">{formatPrice(product.price)}</span>
          {product.oldPrice > product.price && (
            <s className="price__old">
              <span className="visually-hidden">قیمت قبلی </span>
              {formatPrice(product.oldPrice)}
            </s>
          )}
        </p>
      </div>

      <AddToCart product={product} />
    </article>
  );
}
