from django.db import models


class ContactMessage(models.Model):
    """پیام فرم تماس با ما."""
    name = models.CharField("نام", max_length=100)
    email = models.EmailField("ایمیل")
    message = models.TextField("پیام")
    is_read = models.BooleanField("خوانده‌شده", default=False)
    created_at = models.DateTimeField("تاریخ ثبت", auto_now_add=True)

    class Meta:
        verbose_name = "پیام تماس"
        verbose_name_plural = "پیام‌های تماس"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.email}"


class Newsletter(models.Model):
    """ایمیل‌های خبرنامه."""
    email = models.EmailField("ایمیل", unique=True)
    created_at = models.DateTimeField("تاریخ ثبت", auto_now_add=True)

    class Meta:
        verbose_name = "خبرنامه"
        verbose_name_plural = "خبرنامه"
        ordering = ["-created_at"]

    def __str__(self):
        return self.email