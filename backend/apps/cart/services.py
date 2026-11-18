"""منطق سبد خرید — یافتن/ساخت سبد مهمان یا کاربر، افزودن و کنترل موجودی."""
import uuid

from django.db import transaction

from apps.accounts.models import User

from .models import Cart, CartItem


def get_or_create_cart(user=None, guest_token=None):
    """سبد را بر اساس کاربر (اگر لاگین) یا guest_token پیدا/ساخت می‌کند."""
    if user and user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    token = (guest_token or "").strip()
    if not token:
        token = uuid.uuid4().hex
    cart, created = Cart.objects.get_or_create(guest_token=token)
    return cart


def add_item(cart, product, qty=1):
    """افزودن محصول به سبد با کنترل موجودی. خروجی: (CartItem, created_bool)."""
    qty = int(qty)
    if qty <= 0:
        raise ValueError("تعداد باید بزرگ‌تر از صفر باشد.")
    if not product.is_available:
        raise ValueError("این محصول در دسترس نیست.")

    with transaction.atomic():
        item = CartItem.objects.select_for_update().filter(cart=cart, product=product).first()
        current = item.qty if item else 0
        new_qty = current + qty
        if new_qty > product.stock:
            raise ValueError(f"موجودی کافی نیست. حداکثر {product.stock} عدد موجود است.")
        if item:
            item.qty = new_qty
            item.save(update_fields=["qty"])
            return item, False
        item = CartItem.objects.create(cart=cart, product=product, qty=qty)
        return item, True


def update_item_qty(cart, item_id, qty):
    """تغییر تعداد یک قلم سبد با کنترل موجودی."""
    qty = int(qty)
    with transaction.atomic():
        item = CartItem.objects.select_for_update().get(cart=cart, id=item_id)
        product = item.product
        if qty <= 0:
            item.delete()
            return None
        if qty > product.stock:
            raise ValueError(f"موجودی کافی نیست. حداکثر {product.stock} عدد موجود است.")
        item.qty = qty
        item.save(update_fields=["qty"])
        return item


def cart_totals(cart):
    """جمع سبد به تومان (Decimal)."""
    items = list(cart.items.select_related("product"))
    count = sum(i.qty for i in items)
    subtotal = sum((i.line_total for i in items), 0)
    return items, count, subtotal