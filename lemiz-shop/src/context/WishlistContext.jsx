import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../services/productService';
import { readStorage, writeStorage } from '../hooks/useLocalStorage';

const WISHLIST_KEY = 'lemiz.wishlist.v1';
const WishlistContext = createContext(null);

function loadWishlist() {
  const saved = readStorage(WISHLIST_KEY, []);
  return Array.isArray(saved) ? saved.filter((id) => getProductById(id)) : [];
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(loadWishlist);

  useEffect(() => {
    writeStorage(WISHLIST_KEY, ids);
  }, [ids]);

  const has = useCallback((id) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id) => setIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id])),
    [],
  );
  const remove = useCallback((id) => setIds((current) => current.filter((x) => x !== id)), []);

  const value = useMemo(() => ({ ids, count: ids.length, has, toggle, remove }), [ids, has, toggle, remove]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist باید داخل WishlistProvider استفاده شود');
  return ctx;
}
