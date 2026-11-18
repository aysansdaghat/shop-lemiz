from django.conf import settings
from django.db import models

from apps.catalog.models import Product


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                             related_name="favorites", verbose_name="کاربر")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="favorited_by",
                                verbose_name="محصول")
    created_at = models.DateTimeField("تاریخ ثبت", auto_now_add=True)

    class Meta:
        verbose_name = "علاقه‌مندی"
        verbose_name_plural = "علاقه‌مندی‌ها"
        unique_together = ("user", "product")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} → {self.product.name}"