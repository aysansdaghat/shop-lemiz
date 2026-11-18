import { useState } from 'react';
import { AlertCircle, Check, Instagram, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { ORDER_CONFIG, SITE } from '../data/site';
import { readStorage, writeStorage } from '../hooks/useLocalStorage';
import { usePageTitle } from '../hooks/usePageTitle';
import Breadcrumbs from '../components/Breadcrumbs';
import { api } from '../services/apiClient';

const KEY = 'lemiz.messages';
const EMPTY_FORM = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  usePageTitle('تماس با ما', 'راه‌های تماس با لمیز؛ تلفن، نشانی، اینستاگرام و فرم پیام.');

  const setField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'نام خود را وارد کنید.';
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'ایمیل معتبر نیست؛ مثلاً name@example.com';
    if (form.message.trim().length < 5) next.message = 'متن پیام را بنویسید.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.querySelector('.contact [aria-invalid="true"]')?.focus();
      return;
    }
    try {
      await api.submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
    } catch (error) {
      // در صورت قطع سرور، همان ذخیره‌ی محلی نمایشی انجام می‌شود.
      if (error.status) {
        document.querySelector('.contact__status')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const saved = readStorage(KEY, []);
      writeStorage(KEY, [...saved, { ...form, at: Date.now() }]);
      setForm(EMPTY_FORM);
      setSent(true);
      return;
    }
    const saved = readStorage(KEY, []);
    writeStorage(KEY, [...saved, { ...form, at: Date.now() }]);
    setForm(EMPTY_FORM);
    setSent(true);
  };

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'تماس با ما' }]} />

        <header className="page-head">
          <h1>تماس با ما</h1>
          <p className="section-note">سوالی درباره‌ی محصول یا سفارش دارید؟ با ما در تماس باشید.</p>
        </header>

        <div className="contact">
          <div className="contact__info">
            <ul className="contact-list">
              <li>
                <Phone size={22} aria-hidden="true" />
                <div>
                  <span className="contact-list__label">تلفن</span>
                  <a href={`tel:${SITE.phone}`} dir="ltr">
                    {SITE.phone}
                  </a>
                </div>
              </li>
              <li>
                <MapPin size={22} aria-hidden="true" />
                <div>
                  <span className="contact-list__label">نشانی</span>
                  <span>{SITE.address}</span>
                </div>
              </li>
              <li>
                <Instagram size={22} aria-hidden="true" />
                <div>
                  <span className="contact-list__label">اینستاگرام</span>
                  <a
                    href={`https://instagram.com/${ORDER_CONFIG.instagramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                  >
                    @{ORDER_CONFIG.instagramUsername}
                  </a>
                </div>
              </li>
            </ul>

            <div className="contact__socials">
              <a
                className="btn btn-outline"
                href={`https://wa.me/${ORDER_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} aria-hidden="true" />
                واتساپ
              </a>
              <a
                className="btn btn-outline"
                href={`https://t.me/${ORDER_CONFIG.instagramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send size={18} aria-hidden="true" />
                تلگرام
              </a>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="ct-name">نام</label>
              <input
                id="ct-name"
                type="text"
                value={form.name}
                onChange={setField('name')}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'ct-name-err' : undefined}
              />
              {errors.name && (
                <p className="field__error" id="ct-name-err">
                  <AlertCircle size={16} aria-hidden="true" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="ct-email">ایمیل</label>
              <input
                id="ct-email"
                type="email"
                dir="ltr"
                value={form.email}
                onChange={setField('email')}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'ct-email-err' : undefined}
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="field__error" id="ct-email-err">
                  <AlertCircle size={16} aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="ct-message">پیام</label>
              <textarea
                id="ct-message"
                rows="5"
                value={form.message}
                onChange={setField('message')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'ct-message-err' : undefined}
                placeholder="پیام خود را بنویسید..."
              />
              {errors.message && (
                <p className="field__error" id="ct-message-err">
                  <AlertCircle size={16} aria-hidden="true" />
                  {errors.message}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              ارسال پیام
            </button>

            <p className="contact__status" role="status">
              {sent && (
                <>
                  <Check size={18} aria-hidden="true" />
                  پیام شما ثبت شد. در نسخه‌ی نمایشی فقط روی همین مرورگر ذخیره می‌شود.
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}