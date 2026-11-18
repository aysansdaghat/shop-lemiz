"""منطق ثبت سفارش: قفل موجودی، محاسبه Decimal، کاهش موجودی، شماره اختصاصی."""
from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from apps.catalog.models import Product

from .models import Order, OrderItem, Payment


def generate_order_number():
    """شماره سفارش خوانا و یکتا: LMZ-YYYYMMDD-XXXX."""
    from .models import Order as _Order
    today = timezone.now().strftime("%Y%m%d")
    prefix = f"LMZ-{today}-"
    last = (
        _Order.objects.filter(order_number__startswith=prefix)
        .order_by("-id")
        .first()
    )
    seq = 1
    if last:
        try:
            seq = int(last.order_number.replace(prefix, "")) + 1
        except ValueError:
            seq = _Order.objects.filter(order_number__startswith=prefix).count() + 1
    return f"{prefix}{seq:04d}"


def create_order(*, items, user=None, receiver_name, receiver_phone, address,
                 postal_code="", note="", discount_code=None):
    """
    ثبت سفارش از اقلام {product_id, qty}.
    خروجی: Order
    خطا: ValueError با پیام فارسی (موجودی/تخفیف).
    """
    # نرمال‌سازی اقلام و جلوگیری از تکرار
    normalized = {}
    for raw in items:
        pid = int(raw.get("product") or raw.get("product_id"))
        qty = int(raw.get("qty", 1))
        if qty <= 0:
            raise ValueError("تعداد هر قلم باید بزرگ‌تر از صفر باشد.")
        normalized[pid] = normalized.get(pid, 0) + qty

    if not normalized:
        raise ValueError("سبد خرید خالی است.")

    with transaction.atomic():
        # قفل روی محصولات برای کنترل موجودی
        product_ids = list(normalized.keys())
        products = {
            p.id: p
            for p in Product.objects.select_for_update().filter(
                id__in=product_ids, is_active=True, is_deleted=False
            )
        }

        order_items = []
        subtotal = Decimal("0")
        for pid, qty in normalized.items():
            product = products.get(pid)
            if not product:
                raise ValueError("یکی از محصولات در دسترس نیست.")
            if product.stock < qty:
                raise ValueError(
                    f"موجودی «{product.name}» کافی نیست (موجودی: {product.stock})."
                )
            unit_price = product.price
            line_total = unit_price * qty
            subtotal += line_total
            order_items.append({
                "product": product,
                "name_snapshot": product.name,
                "unit_price": unit_price,
                "qty": qty,
                "line_total": line_total,
            })

        # تخفیف (اختیاری)
        discount_total = Decimal("0")
        discount_obj = None
        if discount_code:
            from apps.discounts.services import apply_discount
            discount_obj, discount_total = apply_discount(discount_code, subtotal)

        shipping = Decimal("0")
        grand_total = subtotal - discount_total + shipping

        order = Order.objects.create(
            user=user,
            order_number=generate_order_number(),
            status="initiated",
            subtotal=subtotal,
            discount_total=discount_total,
            shipping=shipping,
            grand_total=grand_total,
            receiver_name=receiver_name,
            receiver_phone=receiver_phone,
            address=address,
            postal_code=postal_code,
            note=note,
        )

        for data in order_items:
            OrderItem.objects.create(order=order, **data)

        # کاهش موجودی
        for data in order_items:
            product = data["product"]
            product.stock -= data["qty"]
            product.save(update_fields=["stock"])

        # ثبت تراکنش پرداخت (نمایشی)
        Payment.objects.create(order=order, amount=grand_total, status="pending")

        # افزایش شمارنده استفاده تخفیف
        if discount_obj:
            discount_obj.used_count += 1
            discount_obj.save(update_fields=["used_count"])

        return order