import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';

import './styles/tokens.css';
import './styles/base.css';
import './styles/header.css';
import './styles/home.css';
import './styles/product.css';
import './styles/drawer.css';
import './styles/shop.css';
import './styles/detail.css';
import './styles/pages.css';
import './styles/footer.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
);
