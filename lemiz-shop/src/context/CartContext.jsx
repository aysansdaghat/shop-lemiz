import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { getProductById, getProductByName } from '../services/productService';
import { readStorage, writeStorage } from '../hooks/useLocalStorage';

const CART_KEY = 'lemiz.cart.v2';
const LEGACY_CART_KEY = 'cart'; // کلید نسخه‌ی اولیه: [{ name, quantity }]

const CartContext = createContext(null);

function sanitize(items) {
  return items
    .map((item) => {
      const product = getProductById(item?.id);
      if (!product || product.stock <= 0) return null;
      const qty = Math.min(Math.floor(Number(item.qty)) || 0, product.stock);
      return qty > 0 ? { id: product.id, qty } : null;
    })
    .filter(Boolean);
}

function loadCart() {
  const saved = readStorage(CART_KEY, null);
  if (Array.isArray(saved)) return sanitize(saved);

  // یک‌بار سبد قدیمی (بر اساس نام محصول) را به ساختار جدید (بر اساس id) منتقل می‌کنیم.
  const legacy = readStorage(LEGACY_CART_KEY, null);
  if (Array.isArray(legacy)) {
    return sanitize(
      legacy.map((entry) => ({ id: getProductByName(entry?.name)?.id, qty: entry?.quantity })),
    );
  }
  return [];
}

function cartReducer(items, action) {
  switch (action.type) {
    case 'add':
    case 'increment': {
      const product = getProductById(action.id);
      if (!product || product.stock <= 0) return items;
      const found = items.find((i) => i.id === product.id);
      if (!found) return [...items, { id: product.id, qty: 1 }];
      return items.map((i) => (i.id === product.id ? { ...i, qty: Math.min(i.qty + 1, product.stock) } : i));
    }
    case 'decrement':
      return items
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
    case 'remove':
      return items.filter((i) => i.id !== action.id);
    case 'clear':
      return [];
    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, null, loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    writeStorage(CART_KEY, items);
  }, [items]);

  const lines = useMemo(
    () => items.map((i) => ({ product: getProductById(i.id), qty: i.qty })).filter((l) => l.product),
    [items],
  );
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const total = useMemo(() => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0), [lines]);

  const addItem = useCallback((id) => dispatch({ type: 'add', id }), []);
  const increment = useCallback((id) => dispatch({ type: 'increment', id }), []);
  const decrement = useCallback((id) => dispatch({ type: 'decrement', id }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), []);
  const getQty = useCallback((id) => items.find((i) => i.id === id)?.qty ?? 0, [items]);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ lines, count, total, isOpen, addItem, increment, decrement, removeItem, clearCart, getQty, openCart, closeCart }),
    [lines, count, total, isOpen, addItem, increment, decrement, removeItem, clearCart, getQty, openCart, closeCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart باید داخل CartProvider استفاده شود');
  return ctx;
}
