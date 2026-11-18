import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

// جایگزین موقت صفحه‌هایی که در مرحله‌های بعدی ساخته می‌شوند.
export default function ComingSoon({ title, stage }) {
  usePageTitle(title);
  return (
    <section className="section">
      <div className="container page-message">
        <h1>{title}</h1>
        <p>این صفحه در {stage} ساخته می‌شود. فعلاً مسیر آن آماده است و فقط محتوای آن مانده.</p>
        <Link to="/" className="btn btn-primary">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </section>
  );
}
