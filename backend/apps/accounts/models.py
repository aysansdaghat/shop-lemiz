from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.common.models import TimeStamped


class User(AbstractUser):
    """کاربر سفارشی لمیز — شماره موبایل اختیاری و یکتا."""
    phone = models.CharField("شماره موبایل", max_length=20, unique=True, null=True, blank=True)

    class Meta:
        verbose_name = "کاربر"
        verbose_name_plural = "کاربران"

    def __str__(self):
        return self.get_full_name() or self.username


class UserProfile(TimeStamped):
    """پروفایل تکمیلی کاربر."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile",
                                verbose_name="کاربر")
    avatar = models.URLField("تصویر پروفایل", blank=True)
    birth_date = models.DateField("تاریخ تولد", null=True, blank=True)

    class Meta:
        verbose_name = "پروفایل"
        verbose_name_plural = "پروفایل‌ها"

    def __str__(self):
        return f"پروفایل {self.user}"


class Address(TimeStamped):
    """آدرس‌های کاربر."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses",
                             verbose_name="کاربر")
    title = models.CharField("عنوان", max_length=50)
    province = models.CharField("استان", max_length=50)
    city = models.CharField("شهر", max_length=50)
    line1 = models.CharField("نشانی", max_length=255)
    postal_code = models.CharField("کد پستی", max_length=20, blank=True)
    receiver_name = models.CharField("نام گیرنده", max_length=100, blank=True)
    receiver_phone = models.CharField("تلفن گیرنده", max_length=20, blank=True)
    is_default = models.BooleanField("پیش‌فرض", default=False)

    class Meta:
        verbose_name = "آدرس"
        verbose_name_plural = "آدرس‌ها"
        ordering = ["-is_default", "-updated_at"]

    def __str__(self):
        return f"{self.title} — {self.city}"