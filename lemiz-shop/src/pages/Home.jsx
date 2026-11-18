import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getBestsellers, getNewArrivals } from '../services/productService';
import { useCatalog } from '../services/apiClient';
import { usePageTitle } from '../hooks/usePageTitle';
import ProductCard from '../components/ProductCard';
import Hero from '../components/home/Hero';
import CategoryMosaic from '../components/home/CategoryMosaic';
import SpecialOffers from '../components/home/SpecialOffers';
import PromoBanners from '../components/home/PromoBanners';
import BrandSection from '../components/home/BrandSection';
import Reviews from '../components/home/Reviews';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  useCatalog();
  usePageTitle(
    '',
    'لمیز؛ فروشگاه لباس با طرح‌های خاص. تیشرت، شلوار جین، کت، کاپشن و ست‌های دونفره با قیمت روشن و ثبت سفارش ساده.',
  );
  const bestsellers = getBestsellers().slice(0, 4);
  const newArrivals = getNewArrivals();

  return (
    <>
      <Hero />
      <CategoryMosaic />

      <section className="section section--flush-top" aria-labelledby="bestsellers-title">
        <div className="container">
          <div className="section-head">
            <h2 id="bestsellers-title">پرفروش‌ترین‌ها</h2>
            <Link to="/shop" className="text-link">
              همه محصولات
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="product-grid">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <SpecialOffers />

      <section className="section" aria-labelledby="new-title">
        <div className="container">
          <div className="section-head">
            <h2 id="new-title">تازه‌های لمیز</h2>
            <Link to="/shop" className="text-link">
              مشاهده همه
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="shelf" role="region" aria-label="محصولات جدید؛ برای دیدن بقیه بکشید" tabIndex={0}>
          {newArrivals.map((product) => (
            <div className="shelf__item" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <PromoBanners />
      <BrandSection />
      <Reviews />
      <Newsletter />
    </>
  );
}
