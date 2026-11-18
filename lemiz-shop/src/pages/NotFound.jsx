import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('صفحه پیدا نشد');
  return (
    <section className="section">
      <div className="container page-message">
        <h1>صفحه‌ای با این آدرس نداریم</h1>
        <p>ممکن است آدرس را اشتباه نوشته باشید یا صفحه جابه‌جا شده باشد.</p>
        <div className="page-message__actions">
          <Link to="/" className="btn btn-primary">
            صفحه اصلی
          </Link>
          <Link to="/shop" className="btn btn-outline">
            مشاهده فروشگاه
          </Link>
        </div>
      </div>
    </section>
  );
}
