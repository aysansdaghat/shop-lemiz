import { Link } from 'react-router-dom';
import { Instagram, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { ORDER_CONFIG, SITE } from '../data/site';
import { faNumber } from '../utils/format';

const SHOP_LINKS = [
  { to: '/shop', label: 'همه محصولات' },
  { to: '/categories', label: 'دسته‌بندی‌ها' },
  { to: '/wishlist', label: 'علاقه‌مندی‌ها' },
  { to: '/cart', label: 'سبد خرید' },
];
const INFO_LINKS = [
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس با ما' },
];

export default function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <p className="brand brand--footer">
            <span className="brand__hole" aria-hidden="true" />
            lemiz
          </p>
          <p>لمیز مجموعه‌ای از طرح‌های خاص؛ تیشرت، جین، کت، کاپشن و ست.</p>
          <ul className="social-list">
            <li>
              <a href={`https://instagram.com/${ORDER_CONFIG.instagramUsername}`} target="_blank" rel="noopener noreferrer" aria-label="اینستاگرام لمیز">
                <Instagram size={20} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={`https://t.me/${ORDER_CONFIG.instagramUsername}`} target="_blank" rel="noopener noreferrer" aria-label="تلگرام لمیز">
                <Send size={20} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${ORDER_CONFIG.whatsappNumber}`} target="_blank" rel="noopener noreferrer" aria-label="واتساپ لمیز">
                <MessageCircle size={20} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="لینک‌های فروشگاه">
          <h2 className="site-footer__title">فروشگاه</h2>
          <ul>
            {SHOP_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="اطلاعات فروشگاه">
          <h2 className="site-footer__title">لمیز</h2>
          <ul>
            {INFO_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="site-footer__contact">
          <h2 className="site-footer__title">تماس</h2>
          <p>
            <Phone size={18} aria-hidden="true" />
            <a href={`tel:${SITE.phone}`} dir="ltr">
              {SITE.phone}
            </a>
          </p>
          <p>
            <MapPin size={18} aria-hidden="true" />
            {SITE.address}
          </p>
        </address>
      </div>

      <div className="container site-footer__bottom">
        <p>تمام حقوق این نسخه‌ی نمایشی برای لمیز محفوظ است. © {faNumber(2026)}</p>
        <p>پرداخت، ارسال و نمادهای اعتماد در این نسخه نمایشی‌اند.</p>
      </div>
    </footer>
  );
}
