import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import QuantityStepper from './QuantityStepper';

// دکمه‌ی «افزودن به سبد» که بعد از افزودن به کنترل تعداد تبدیل می‌شود (رفتار نسخه‌ی اولیه).
export default function AddToCart({ product, variant = 'outline' }) {
  const { getQty, addItem, increment, decrement, openCart } = useCart();
  const { push } = useToast();
  const qty = getQty(product.id);

  if (product.stock <= 0) {
    return (
      <button type="button" className="btn btn-outline btn-block" disabled>
        ناموجود
      </button>
    );
  }

  if (qty > 0) {
    return (
      <QuantityStepper
        name={product.name}
        qty={qty}
        max={product.stock}
        onIncrement={() => increment(product.id)}
        onDecrement={() => decrement(product.id)}
      />
    );
  }

  const handleAdd = () => {
    addItem(product.id);
    push({ message: `${product.name} به سبد اضافه شد`, actionLabel: 'مشاهده سبد', onAction: openCart });
  };

  return (
    <button
      type="button"
      className={`btn btn-block ${variant === 'primary' ? 'btn-primary' : 'btn-outline'}`}
      onClick={handleAdd}
    >
      <ShoppingBag size={18} aria-hidden="true" />
      افزودن به سبد
    </button>
  );
}
