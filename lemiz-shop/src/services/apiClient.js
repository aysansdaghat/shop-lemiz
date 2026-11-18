// کلاینت API و استور داده محصولات.
// این فایل مسئول ارتباط با بک‌اند است و ظاهر برنامه را تغییر نمی‌دهد.
import { useEffect, useSyncExternalStore } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
const TOKEN_KEY = 'lemiz.token';

// ---------- توکن JWT ----------
export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

// ---------- درخواست پایه ----------
export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.error)) ||
      (typeof data === 'string' && data) ||
      `خطا در ارتباط با سرور (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// ---------- استور محصولات (external store) ----------
let catalog = { products: [], status: 'idle' };
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeCatalog(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCatalogSnapshot() {
  return catalog;
}

let loading = false;
export async function loadCatalog(force = false) {
  if (loading) return;
  if (catalog.status === 'ready' && !force) return;
  loading = true;
  catalog = { ...catalog, status: 'loading' };
  emit();
  try {
    const data = await request('/products/?page_size=100');
    catalog = { products: data.results ?? data ?? [], status: 'ready' };
  } catch {
    catalog = { ...catalog, status: 'error' };
  } finally {
    loading = false;
    emit();
  }
}

// هوک: صفحه را با داده‌ی API همگام نگه می‌دارد (reactive).
export function useCatalog() {
  const snapshot = useSyncExternalStore(subscribeCatalog, getCatalogSnapshot, getCatalogSnapshot);
  useEffect(() => {
    loadCatalog();
  }, []);
  return snapshot;
}

// ---------- APIهای دامنه ----------
export const api = {
  // محصولات و دسته‌ها
  fetchProducts: (params = '') => request(`/products/${params}`),
  fetchProduct: (id) => request(`/products/${id}/`),
  fetchCategories: () => request('/categories/'),

  // حساب
  register: (payload) => request('/accounts/register/', { method: 'POST', body: payload }),
  login: async (username, password) => {
    const data = await request('/accounts/login/', {
      method: 'POST',
      body: { username, password },
    });
    if (data.access) setToken(data.access);
    return data;
  },
  logout: () => setToken(null),

  // سفارش
  submitOrder: (payload) => request('/orders/', { method: 'POST', body: payload }),

  // فرم‌ها
  submitContact: (payload) => request('/contact/', { method: 'POST', body: payload }),
  subscribeNewsletter: (email) => request('/newsletter/', { method: 'POST', body: { email } }),

  // علاقه‌مندی و سبد (کاربر لاگین)
  toggleFavorite: (product) => request('/favorites/', { method: 'POST', body: { product }, auth: true }),
};

export { API_BASE };