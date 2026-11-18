import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { getProductById } from '../services/productService';
import { useCatalog } from '../services/apiClient';
import { faNumber } from '../utils/format';
import { usePageTitle } from '../hooks/usePageTitle';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Wishlist() {
  useCatalog();
  const { ids } = useWishlist();
  const products = ids.map((id) => getProductById(id)).filter(Boolean);

  usePageTitle(
    'علاقه‌مندی‌ها',
    'محصول‌هایی که در لمیز نشان کرده‌اید تا بعداً راحت‌تر پیدایشان کنید.',
  );

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'علاقه‌مندی‌ها' }]} />

        <header className="page-head">
          <h1>علاقه‌مندی‌ها</h1>
          {products.length > 0 && <p className="section-note">{faNumber(products.length)} محصول ذخیره‌شده</p>}
        </header>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>لیست علاقه‌مندی‌های شما خالی است</h2>
            <p>روی آیکون قلب هر محصول بزنید تا اینجا ذخیره شود.</p>
            <Link to="/shop" className="btn btn-primary">
              مشاهده فروشگاه
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}