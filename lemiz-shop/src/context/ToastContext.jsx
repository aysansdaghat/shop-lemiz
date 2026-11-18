import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);
const TOAST_LIFETIME = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  // push({ message, actionLabel?, onAction? })
  const push = useCallback(
    (toast) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { id, ...toast }]);
      window.setTimeout(() => dismiss(id), TOAST_LIFETIME);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <span>{t.message}</span>
            {t.actionLabel && (
              <button
                type="button"
                className="toast__action"
                onClick={() => {
                  t.onAction?.();
                  dismiss(t.id);
                }}
              >
                {t.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast باید داخل ToastProvider استفاده شود');
  return ctx;
}
