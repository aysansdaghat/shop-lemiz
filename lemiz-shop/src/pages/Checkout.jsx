import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { sendOrder } from '../services/orderService';
import { SITE } from '../data/site';
import { formatPrice } from '../utils/format';
import { handleImageError } from '../utils/images';
import { usePageTitle } from '../hooks/usePageTitle';
import Breadcrumbs from '../components/Breadcrumbs';
import { api } from '../services/apiClient';

const EMPTY_FORM = { name: '', phone: '', address: '', note: '' };
const PHONE_PATTERN = /^0?9\d{9}$/;

export default function Checkout() {
  const { lines, count, total, clearCart } = useCart();
  const { push } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  usePageTitle('پرداخت', 'تکمیل سفارش لمیز و ثبت نهایی در نسخه‌ی نمایشی.');

  const setField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'نام و نام خانوادگی را کامل وارد کنید.';
    const phone = form.phone.replace(/\s|-/g, '');
    if (!PHONE_PATTERN.test(phone)) next.phone = 'شماره موبایل معتبر نیست؛ مثلاً ۰۹۱۲۳۴۵۶۷۸۹';
    if (form.address.trim().length < 8) next.address = 'نشانی را کامل‌تر بنویسید تا سفارش به‌دستتان برسد.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (lines.length === 0) return;
    if (!validate()) {
      const first = document.querySelector('.checkout [aria-invalid="true"]');
      first?.focus();
      return;
    }

    const items = lines.map(({ product, qty }) => ({ product: product.id, qty }));
    const payload = {
      items,
      receiver_name: form.name.trim(),
      receiver_phone: form.phone.replace(/\s|-/g, ''),
      address: form.address.trim(),
      note: form.note.trim(),
    };

    try {
      await api.submitOrder(payload);
    } catch (error) {
      // اگر سرور در دسترس نبود، حالت نمایشی قدیمی حفظ می‌شود.
      if (error.status) {
        push({ message: error.message || 'ثبت سفارش ناموفق بود.' });
        return;
      }
      push({ message: 'ثبت سفارش در حالت نمایشی انجام شد (سرور در دسترس نبود).' });
    }

    setDone(true);
    clearCart();
    push({ message: 'سفارش شما با موفقیت ثبت شد.' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderMessage = async () => {
    const result = await sendOrder(lines, total);
    if (result.status === 'copied') {
      push({ message: 'متن سفارش کپی شد. در دایرکت پیست کنید.' });
    } else if (result.status === 'manual') {
      window.prompt('متن سفارش را کپی کنید و در دایرکت بفرستید:', result.text);
    }
  };

  if (done) {
    return (
      <div className="page">
        <div className="container">
          <div className="order-success" role="status">
            <CheckCircle2 size={56} strokeWidth={1.5} aria-hidden="true" />
            <h1>سفارش شما ثبت شد</h1>
            <p className="order-success__lead">
              این یک ثبت نمایشی بود؛ در نسخه‌ی واقعی، سفارش به درگاه پرداخت و سپس به فروشنده می‌رسید.
            </p>
            <p className="order-success__contact">
              برای هماهنگی می‌توانید با شماره {SITE.phone} تماس بگیرید.
            </p>
            <div className="page-message__actions">
              <Link to="/shop" className="btn btn-primary">
                ادامه خرید
              </Link>
              <Link to="/" className="btn btn-outline">
                صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'سبد خرید', to: '/cart' }, { label: 'پرداخت' }]} />
          <div className="empty-state">
            <h1>سبد خرید شما خالی است</h1>
            <p>پیش از پرداخت، محصولی به سبد اضافه کنید.</p>
            <Link to="/shop" className="btn btn-primary">
              مشاهده فروشگاه
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs
          items={[{ label: 'خانه', to: '/' }, { label: 'سبد خرید', to: '/cart' }, { label: 'پرداخت' }]}
        />

        <header className="page-head">
          <h1>پرداخت</h1>
          <p className="section-note">اطلاعات سفارش را وارد کنید.</p>
        </header>

        <div className="checkout">
          <form className="checkout__form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="co-name">نام و نام خانوادگی</label>
              <input
                id="co-name"
                type="text"
                value={form.name}
                onChange={setField('name')}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'co-name-err' : undefined}
              />
              {errors.name && (
                <p className="field__error" id="co-name-err">
                  <AlertCircle size={16} aria-hidden="true" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="co-phone">شماره موبایل</label>
              <input
                id="co-phone"
                type="tel"
                inputMode="numeric"
                dir="ltr"
                value={form.phone}
                onChange={setField('phone')}
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'co-phone-err' : undefined}
                placeholder="09123456789"
              />
              {errors.phone && (
                <p className="field__error" id="co-phone-err">
                  <AlertCircle size={16} aria-hidden="true" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="co-address">نشانی</label>
              <textarea
                id="co-address"
                rows="3"
                value={form.address}
                onChange={setField('address')}
                autoComplete="street-address"
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? 'co-address-err' : undefined}
                placeholder="استان، شهر، خیابان و پلاک"
              />
              {errors.address && (
                <p className="field__error" id="co-address-err">
                  <AlertCircle size={16} aria-hidden="true" />
                  {errors.address}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="co-note">توضیح سفارش (اختیاری)</label>
              <textarea
                id="co-note"
                rows="2"
                value={form.note}
                onChange={setField('note')}
                placeholder="رنگ، سایز یا نکته‌ی خاصی که باید بدانیم"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <CreditCard size={20} aria-hidden="true" />
              ثبت سفارش نمایشی
            </button>

            <button type="button" className="btn btn-outline btn-block" onClick={handleOrderMessage}>
              ثبت سفارش در پیام‌رسان
            </button>

            <p className="checkout__secure">
              <ShieldCheck size={18} aria-hidden="true" />
              این نسخه نمایشی است و هیچ پرداخت واقعی انجام نمی‌شود.
            </p>
          </form>

          <aside className="cart-summary checkout__summary">
            <h2 className="cart-summary__title">خلاصه سفارش ({count.toLocaleString('fa-IR')} محصول)</h2>
            <ul className="checkout__items">
              {lines.map(({ product, qty }) => (
                <li key={product.id}>
                  <img src={product.image} alt="" width="56" height="70" loading="lazy" onError={handleImageError} />
                  <span className="checkout__item-name">
                    {product.name}
                    <small>× {qty.toLocaleString('fa-IR')}</small>
                  </span>
                  <span className="checkout__item-price">{formatPrice(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <p className="cart-summary__total">
              <span>جمع کل</span>
              <strong>{formatPrice(total)}</strong>
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}