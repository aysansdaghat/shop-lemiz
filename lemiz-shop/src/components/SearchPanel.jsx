import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchProducts } from '../services/productService';
import { faNumber, formatPrice } from '../utils/format';
import { handleImageError } from '../utils/images';

export default function SearchPanel({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
    setQuery('');
    return undefined;
  }, [open]);

  const results = searchProducts(query);
  const shown = results.slice(0, 6);
  const hasQuery = query.trim().length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (shown[0]) {
      navigate(`/product/${shown[0].id}`);
      onClose();
    }
  };

  return (
    <div className="search-panel" data-open={open} id="search-panel">
      <div className="container">
        <form className="search-field" role="search" onSubmit={handleSubmit}>
          <Search size={22} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی محصول، مثلاً جین یا کاپشن"
            aria-label="جستجوی محصول"
            autoComplete="off"
            tabIndex={open ? 0 : -1}
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="بستن جستجو" tabIndex={open ? 0 : -1}>
            <X size={22} aria-hidden="true" />
          </button>
        </form>

        <div className="search-status" role="status" aria-live="polite">
          {hasQuery && (results.length > 0 ? `${faNumber(results.length)} نتیجه` : 'محصولی با این نام پیدا نشد. نام دیگری را امتحان کنید.')}
        </div>

        {shown.length > 0 && (
          <ul className="search-results">
            {shown.map((p) => (
              <li key={p.id}>
                <Link to={`/product/${p.id}`} onClick={onClose}>
                  <img src={p.image} alt="" width="56" height="70" loading="lazy" onError={handleImageError} />
                  <span className="search-results__name">{p.name}</span>
                  <span className="search-results__price">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
