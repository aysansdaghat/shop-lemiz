from django.conf import settings
from django.db import models

from apps.catalog.models import Product


class Review(models.Model):
    """دیدگاه کاربر درباره محصول — نیازمند تأیید مدیر."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews",
                                verbose_name="محصول")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                             blank=True, related_name="reviews", verbose_name="کاربر")
    author_name = models.CharField("نام نویسنده", max_length=100)
    rating = models.PositiveSmallIntegerField("امتیاز", choices=[(i, str(i)) for i in range(1, 6)])
    text = models.TextField("متن دیدگاه")
    is_approved = models.BooleanField("تأییدشده", default=False)
    created_at = models.DateTimeField("تاریخ ثبت", auto_now_add=True)

    class Meta:
        verbose_name = "دیدگاه"
        verbose_name_plural = "دیدگاه‌ها"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author_name} — {self.product.name} ({self.rating})"