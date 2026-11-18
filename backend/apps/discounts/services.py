"""منطق اعتبارسنجی و اعمال کد تخفیف."""
from .models import Discount


def apply_discount(code, subtotal):
    """
    اعتبارسنجی کد و محاسبه مبلغ تخفیف.
    خروجی: (Discount | None, Decimal مبلغ تخفیف)
    خطا: ValueError با پیام فارسی
    """
    code = (code or "").strip()
    if not code:
        return None, 0
    try:
        discount = Discount.objects.get(code__iexact=code)
    except Discount.DoesNotExist:
        raise ValueError("کد تخفیف نامعتبر است.")

    ok, message = discount.is_valid()
    if not ok:
        raise ValueError(message)

    return discount, discount.calculate(subtotal)