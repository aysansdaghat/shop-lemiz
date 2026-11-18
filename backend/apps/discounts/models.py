from decimal import Decimal, ROUND_HALF_UP

from django.db import models
from django.utils import timezone

from apps.common.models import TimeStamped


class Discount(TimeStamped):
    """کد تخفیف درصدی یا مبلغ ثابت."""
    TYPE_CHOICES = [
        ("percent", "درصدی"),
        ("fixed", "مبلغ ثابت"),
    ]

    code = models.CharField("کد", max_length=40, unique=True)
    type = models.CharField("نوع", max_length=10, choices=TYPE_CHOICES, default="percent")
    value = models.DecimalField("مقدار", max_digits=12, decimal_places=2)
    start_at = models.DateTimeField("تاریخ شروع", null=True, blank=True)
    end_at = models.DateTimeField("تاریخ پایان", null=True, blank=True)
    max_uses = models.PositiveIntegerField("حداکثر دفعات", null=True, blank=True)
    used_count = models.PositiveIntegerField("دفعات استفاده", default=0)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        verbose_name = "کد تخفیف"
        verbose_name_plural = "کدهای تخفیف"
        ordering = ["-created_at"]

    def __str__(self):
        return self.code

    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False, "این کد تخفیف فعال نیست."
        if self.start_at and now < self.start_at:
            return False, "این کد تخفیف هنوز فعال نشده است."
        if self.end_at and now > self.end_at:
            return False, "مهلت این کد تخفیف به پایان رسیده است."
        if self.max_uses is not None and self.used_count >= self.max_uses:
            return False, "ظرفیت استفاده از این کد تخفیف تکمیل شده است."
        return True, None

    def calculate(self, subtotal):
        """مبلغ تخفیف را با گرد کردن اعشار محاسبه می‌کند (تومان، بدون اعشار)."""
        if subtotal <= 0:
            return Decimal("0")
        if self.type == "percent":
            raw = (subtotal * self.value) / Decimal("100")
        else:
            raw = self.value
        amount = raw.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        # تخفیف نباید از مبلغ کل بیشتر شود
        if amount > subtotal:
            amount = subtotal
        return amount