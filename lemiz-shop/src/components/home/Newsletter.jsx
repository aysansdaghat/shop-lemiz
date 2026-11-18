import { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { readStorage, writeStorage } from '../../hooks/useLocalStorage';
import { api } from '../../services/apiClient';

const KEY = 'lemiz.newsletter';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setStatus({ type: 'error', message: 'ایمیل را وارد کنید.' });
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setStatus({ type: 'error', message: 'ایمیل معتبر نیست؛ مثلاً name@example.com' });
      return;
    }
    const saved = readStorage(KEY, []);
    if (saved.includes(value)) {
      setStatus({ type: 'success', message: 'این ایمیل قبلاً ثبت شده است.' });
      return;
    }
    try {
      await api.subscribeNewsletter(value);
    } catch {
      /* در صورت قطع سرور، فقط نسخه‌ی نمایشی ذخیره می‌شود */
    }
    writeStorage(KEY, [...saved, value]);
    setEmail('');
    setStatus({ type: 'success', message: 'ایمیل شما ثبت شد.' });
  };

  return (
    <section className="newsletter on-cobalt" aria-labelledby="newsletter-title">
      <div className="container newsletter__grid">
        <div>
          <h2 id="newsletter-title">از طرح‌های تازه زودتر باخبر شوید</h2>
          <p>ایمیل‌تان را بگذارید تا خبر محصولات جدید و تخفیف‌ها را بفرستیم.</p>
        </div>
        <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="newsletter-email">ایمیل</label>
          <div className="newsletter__row">
            <input
              id="newsletter-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status.type !== 'idle') setStatus({ type: 'idle', message: '' });
              }}
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={status.type === 'error'}
              aria-describedby="newsletter-msg"
            />
            <button type="submit" className="btn btn-bone">
              عضویت
            </button>
          </div>
          <p id="newsletter-msg" className="newsletter__msg" role="status">
            {status.type === 'error' && <AlertCircle size={18} aria-hidden="true" />}
            {status.type === 'success' && <Check size={18} aria-hidden="true" />}
            {status.message}
          </p>
          <p className="newsletter__note">در این نسخه‌ی نمایشی، ایمیل فقط در همین مرورگر ذخیره می‌شود.</p>
        </form>
      </div>
    </section>
  );
}
