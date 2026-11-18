import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export default function WishlistButton({ product }) {
  const { has, toggle } = useWishlist();
  const { push } = useToast();
  const active = has(product.id);

  const handleClick = () => {
    toggle(product.id);
    push({ message: active ? `${product.name} از علاقه‌مندی‌ها برداشته شد` : `${product.name} به علاقه‌مندی‌ها اضافه شد` });
  };

  return (
    <button
      type="button"
      className="wish-btn"
      aria-pressed={active}
      aria-label={active ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`}
      onClick={handleClick}
    >
      <Heart size={20} aria-hidden="true" />
    </button>
  );
}
