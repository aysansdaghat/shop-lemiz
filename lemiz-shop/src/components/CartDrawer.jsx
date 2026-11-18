import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { sendOrder } from '../services/orderService';
import { formatPrice } from '../utils/format';
import { handleImageError } from '../utils/images';
import QuantityStepper from './QuantityStepper';

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export default function CartDrawer() {
  const { lines, count, total, isOpen, closeCart, increment, decrement, removeItem } = useCart();
  const { push } = useToast();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    closeRef.current?.focus();
    document.body.classList.add('no-scroll');

    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeCart();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      if (previous && typeof previous.focus === 'function') previous.focus();
    };
  }, [isOpen, closeCart]);

  const handleOrder = async () => {
    const result = await sendOrder(lines, total);
    if (result.status === 'copied') {
      push({ message: 'متن سفارش کپی شد. در دایرکت پیست کنید.' });
    } else if (result.status === 'manual') {
      window.prompt('متن سفارش را کپی کنید و در دایرکت بفرستید:', result.text);
    }
  };

  return (
    <>
      <div className="drawer-backdrop" data-open={isOpen} onClick={closeCart} aria-hidden="true" />
      <aside
        className="drawer"
        data-open={isOpen}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-hidden={!isOpen}
      >
        <div className="drawer__head">
          <h2 id="drawer-title">سبد خرید</h2>
          <button type="button" className="icon-btn" ref={closeRef} onClick={closeCart} aria-label="بستن سبد خرید">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>سبد خرید شما خالی است.</p>
            <Link to="/shop" className="btn btn-primary" onClick={closeCart}>
              مشاهده فروشگاه
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="drawer-line">
                  <img src={product.image} alt="" width="72" height="90" loading="lazy" onError={handleImageError} />
                  <div className="drawer-line__info">
                    <Link to={`/product/${product.id}`} onClick={closeCart} className="drawer-line__name">
                      {product.name}
                    </Link>
                    <span className="drawer-line__price">{formatPrice(product.price * qty)}</span>
                    <div className="drawer-line__controls">
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
                </li>
              ))}
            </ul>

            <div className="drawer__foot">
              <p className="drawer__total">
                <span>جمع کل ({count.toLocaleString('fa-IR')} محصول)</span>
                <strong>{formatPrice(total)}</strong>
              </p>
              <Link to="/checkout" className="btn btn-primary btn-block" onClick={closeCart}>
                ادامه و پرداخت
              </Link>
              <button type="button" className="btn btn-outline btn-block" onClick={handleOrder}>
                ثبت سفارش در پیام‌رسان
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
