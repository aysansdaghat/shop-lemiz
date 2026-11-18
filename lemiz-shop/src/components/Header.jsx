import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { faNumber } from '../utils/format';
import SearchPanel from './SearchPanel';

const NAV_LINKS = [
  { to: '/', label: 'خانه', end: true },
  { to: '/shop', label: 'فروشگاه' },
  { to: '/categories', label: 'دسته‌بندی‌ها' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس با ما' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const { count: cartCount, openCart } = useCart();
  const { count: wishCount } = useWishlist();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);

  const toggleMenu = () => {
    setSearchOpen(false);
    setMenuOpen((v) => !v);
  };
  const toggleSearch = () => {
    setMenuOpen(false);
    setSearchOpen((v) => !v);
  };

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link to="/" className="brand" aria-label="لمیز، صفحه اصلی">
          <span className="brand__hole" aria-hidden="true" />
          lemiz
        </Link>

        <nav className="nav-desktop" aria-label="منوی اصلی">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleSearch}
            aria-label="جستجو"
            aria-expanded={searchOpen}
            aria-controls="search-panel"
          >
            <Search size={22} aria-hidden="true" />
          </button>
          <Link to="/wishlist" className="icon-btn" aria-label={`علاقه‌مندی‌ها، ${faNumber(wishCount)} محصول`}>
            <Heart size={22} aria-hidden="true" />
            {wishCount > 0 && <span className="count-badge">{faNumber(wishCount)}</span>}
          </Link>
          <button type="button" className="icon-btn" onClick={openCart} aria-label={`سبد خرید، ${faNumber(cartCount)} محصول`}>
            <ShoppingBag size={22} aria-hidden="true" />
            {cartCount > 0 && <span className="count-badge">{faNumber(cartCount)}</span>}
          </button>
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav className="mobile-menu" id="mobile-menu" data-open={menuOpen} aria-label="منوی موبایل">
        <div className="container">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="mobile-menu__link" tabIndex={menuOpen ? 0 : -1}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
