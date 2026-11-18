import { Link } from 'react-router-dom';
import { reviews } from '../../data/reviews';
import { getProductById } from '../../services/productService';

export default function Reviews() {
  const [lead, ...rest] = reviews;
  const renderReview = (review, large) => {
    const product = getProductById(review.productId);
    return (
      <figure className={`review${large ? ' review--lead' : ''}`} key={review.id}>
        <blockquote>
          <p>{review.text}</p>
        </blockquote>
        <figcaption>
          <strong>{review.name}</strong>
          {product && (
            <>
              ، درباره‌ی <Link to={`/product/${product.id}`}>{product.name}</Link>
            </>
          )}
        </figcaption>
      </figure>
    );
  };

  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-head">
          <h2 id="reviews-title">نظر مشتریان</h2>
          <p className="section-note">نظرهای این بخش نمونه و نمایشی‌اند.</p>
        </div>
        <div className="reviews">
          {renderReview(lead, true)}
          <div className="reviews__side">{rest.map((r) => renderReview(r, false))}</div>
        </div>
      </div>
    </section>
  );
}
