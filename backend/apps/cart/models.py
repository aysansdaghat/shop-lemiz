from django.conf import settings
from django.db import models

from apps.catalog.models import Product
from apps.accounts.models import User


class Cart(models.Model):
    """سبد خرید کاربر یا مهمان (با guest_token)."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart",
                                null=True, blank=True, verbose_name="کاربر")
    guest_token = models.CharField("شناسه مهمان", max_length=64, unique=True, null=True, blank=True)
    created_at = models.DateTimeField("تاریخ ایجاد", auto_now_add=True)
    updated_at = models.DateTimeField("تاریخ به‌روزرسانی", auto_now=True)

    class Meta:
        verbose_name = "سبد خرید"
        verbose_name_plural = "سبد خریدها"

    def __str__(self):
        return f"سبد {self.user or self.guest_token}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items",
                             verbose_name="سبد خرید")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="محصول")
    qty = models.PositiveIntegerField("تعداد", default=1)

    class Meta:
        verbose_name = "قلم سبد"
        verbose_name_plural = "اقلام سبد"
        unique_together = ("cart", "product")

    def __str__(self):
        return f"{self.product.name} × {self.qty}"

    @property
    def line_total(self):
        return self.product.price * self.qty