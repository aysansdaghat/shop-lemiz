import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { sendOrder } from '../services/orderService';
import { formatPrice } from '../utils/format';
import { handleImageError } from '../utils/images';
import { usePageTitle } from '../hooks/usePageTitle';
import QuantityStepper from '../components/QuantityStepper';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Cart() {
  const { lines, count, total, increment, decrement, removeItem } = useCart();
  const { push } = useToast();

  usePageTitle(
    'سبد خرید',
    'محصول‌های انتخاب‌شده در سبد خرید لمیز و ثبت سفارش با یک پیام.',
  );

  const handleOrder = async () => {
    const result = await sendOrder(lines, total);
    if (result.status === 'copied') {
      push({ message: 'متن سفارش کپی شد. در دایرکت پیست کنید.' });
    } else if (result.status === 'manual') {
      window.prompt('متن سفارش را کپی کنید و در دایرکت بفرستید:', result.text);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'سبد خرید' }]} />

        <header className="page-head">
          <h1>سبد خرید</h1>
          {count > 0 && <p className="section-note">{count.toLocaleString('fa-IR')} محصول در سبد</p>}
        </header>

        {lines.length === 0 ? (
          <div className="empty-state">
            <h2>سبد خرید شما خالی است</h2>
            <p>محصول دلخواهتان را اضافه کنید تا سفارش‌دادن ساده باشد.</p>
            <Link to="/shop" className="btn btn-primary">
              مشاهده فروشگاه
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <ul className="cart-lines">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="cart-line">
                  <Link to={`/product/${product.id}`} className="cart-line__media">
                    <img
                      src={product.image}
                      alt={product.name}
                      width="120"
                      height="150"
                      loading="lazy"
                      onError={handleImageError}
                    />
                  </Link>

                  <div className="cart-line__info">
                    <Link to={`/product/${product.id}`} className="cart-line__name">
                      {product.name}
                    </Link>
                    <span className="cart-line__price">{formatPrice(product.price)}</span>
                    <div className="cart-line__controls">
                      <QuantityStepper
                        name={product.name}
                        qty={qty}
                        max={product.stock}
                        onIncrement={() => increment(product.id)}
                        onDecrement={() => decrement(product.id)}
                      />
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => removeItem(product.id)}
                        aria-label={`حذف ${product.name} از سبد`}
                      >
                        <Trash2 size={20} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <p className="cart-line__total">{formatPrice(product.price * qty)}</p>
                </li>
              ))}
            </ul>

            <aside className="cart-summary">
              <p className="cart-summary__total">
                <span>جمع کل</span>
                <strong>{formatPrice(total)}</strong>
              </p>
              <p className="cart-summary__note">
                هزینه‌ی ارسال و زمان تحویل در گفتگوی سفارش هماهنگ می‌شود.
              </p>
              <Link to="/checkout" className="btn btn-primary btn-block">
                ادامه و پرداخت
              </Link>
              <button type="button" className="btn btn-outline btn-block" onClick={handleOrder}>
                ثبت سفارش در پیام‌رسان
              </button>
              <Link to="/shop" className="btn btn-ghost btn-block">
                ادامه خرید
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}