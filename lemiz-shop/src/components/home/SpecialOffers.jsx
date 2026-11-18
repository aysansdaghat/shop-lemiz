import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDiscounted } from '../../services/productService';
import { categoryLabel } from '../../data/categories';
import { discountPercent, faNumber, formatPrice } from '../../utils/format';
import { handleImageError } from '../../utils/images';
import AddToCart from '../AddToCart';

// اسلایدر «پیشنهاد ویژه»: همان اسلایدر نسخه‌ی اولیه، حالا برای همه‌ی محصولات تخفیف‌دار.
export default function SpecialOffers() {
  const offers = getDiscounted();
  const [index, setIndex] = useState(0);
  const [moved, setMoved] = useState(false);
  const product = offers[index];
  if (!product) return null;

  const go = (next) => {
    setMoved(true);
    setIndex((next + offers.length) % offers.length);
  };
  const percent = discountPercent(product.price, product.oldPrice);

  const onKeyDown = (e) => {
    // در صفحه‌ی راست‌به‌چپ، فلش راست یعنی قبلی
    if (e.key === 'ArrowRight') go(index - 1);
    if (e.key === 'ArrowLeft') go(index + 1);
  };

  return (
    <section id="offers" className="section offers" aria-labelledby="offers-title">
      <div className="container">
        <div className="section-head">
          <h2 id="offers-title">پیشنهاد ویژه و تخفیف‌ها</h2>
        </div>

        <div className="offers__stage" role="group" aria-roledescription="اسلایدر" aria-label="محصولات تخفیف‌دار" onKeyDown={onKeyDown}>
          <div className={`offer${moved ? ' offer--animate' : ''}`} key={product.id} aria-live="polite">
            <Link to={`/product/${product.id}`} className="offer__media" aria-label={`مشاهده ${product.name}`}>
              <img src={product.image} alt={product.name} width="400" height="500" loading="lazy" onError={handleImageError} />
            </Link>

            <div className="offer__info">
              <p className="offer__discount">{faNumber(percent)}٪ تخفیف روی {categoryLabel(product.category)}</p>
              <h3 className="offer__name">{product.name}</h3>
              <p className="offer__desc">{product.description}</p>
              <p className="price price--large">
                <span className="price__now">{formatPrice(product.price)}</span>
                <s className="price__old">
                  <span className="visually-hidden">قیمت قبلی </span>
                  {formatPrice(product.oldPrice)}
                </s>
              </p>
              <p className="offer__saving">{formatPrice(product.oldPrice - product.price)} کمتر از قیمت قبلی</p>
              <div className="offer__actions">
                <AddToCart product={product} variant="primary" />
                <Link to={`/product/${product.id}`} className="btn btn-outline">
                  جزئیات محصول
                </Link>
              </div>
            </div>
          </div>

          <div className="offers__controls">
            <button type="button" className="icon-btn icon-btn--ring" onClick={() => go(index - 1)} aria-label="پیشنهاد قبلی">
              <ChevronRight size={22} aria-hidden="true" />
            </button>
            <ol className="offers__dots">
              {offers.map((o, i) => (
                <li key={o.id}>
                  <button
                    type="button"
                    className="offers__dot"
                    onClick={() => go(i)}
                    aria-label={`پیشنهاد ${faNumber(i + 1)}: ${o.name}`}
                    aria-current={i === index ? 'true' : undefined}
                  />
                </li>
              ))}
            </ol>
            <button type="button" className="icon-btn icon-btn--ring" onClick={() => go(index + 1)} aria-label="پیشنهاد بعدی">
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
