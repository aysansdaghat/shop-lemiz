from django.conf import settings
from django.db import models

from apps.accounts.models import User
from apps.catalog.models import Product

from apps.common.models import TimeStamped


class Order(TimeStamped):
    """سفارش کاربر یا مهمان با شماره اختصاصی و قیمت لحظه ثبت."""
    STATUS_CHOICES = [
        ("initiated", "ایجادشده"),
        ("awaiting_payment", "در انتظار پرداخت"),
        ("paid", "پرداخت‌شده"),
        ("shipped", "ارسال‌شده"),
        ("delivered", "تحویل‌شده"),
        ("canceled", "لغوشده"),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                             related_name="orders", verbose_name="کاربر")
    order_number = models.CharField("شماره سفارش", max_length=30, unique=True)
    status = models.CharField("وضعیت", max_length=20, choices=STATUS_CHOICES,
                              default="initiated")

    subtotal = models.DecimalField("جمع کالاها", max_digits=14, decimal_places=0, default=0)
    discount_total = models.DecimalField("تخفیف", max_digits=14, decimal_places=0, default=0)
    shipping = models.DecimalField("هزینه ارسال", max_digits=14, decimal_places=0, default=0)
    grand_total = models.DecimalField("مبلغ نهایی", max_digits=14, decimal_places=0, default=0)
    currency = models.CharField("واحد پول", max_length=3, default=settings.CURRENCY_CODE)

    # اطلاعات گیرنده (اسنپ‌شات در لحظه ثبت)
    receiver_name = models.CharField("نام گیرنده", max_length=100)
    receiver_phone = models.CharField("تلفن گیرنده", max_length=20)
    address = models.TextField("نشانی")
    postal_code = models.CharField("کد پستی", max_length=20, blank=True)
    note = models.TextField("توضیح سفارش", blank=True)

    class Meta:
        verbose_name = "سفارش"
        verbose_name_plural = "سفارش‌ها"
        ordering = ["-created_at"]

    def __str__(self):
        return f"سفارش {self.order_number}"


class OrderItem(models.Model):
    """قلم سفارش با قیمت و نام لحظه ثبت (مستقل از تغییرات بعدی محصول)."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items",
                              verbose_name="سفارش")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True,
                                verbose_name="محصول")
    name_snapshot = models.CharField("نام محصول", max_length=200)
    unit_price = models.DecimalField("قیمت واحد", max_digits=12, decimal_places=0)
    qty = models.PositiveIntegerField("تعداد", default=1)
    line_total = models.DecimalField("جمع قلم", max_digits=14, decimal_places=0)

    class Meta:
        verbose_name = "قلم سفارش"
        verbose_name_plural = "اقلام سفارش"

    def __str__(self):
        return f"{self.name_snapshot} × {self.qty}"


class Payment(TimeStamped):
    """تراکنش پرداخت سفارش."""
    STATUS_CHOICES = [
        ("pending", "در انتظار"),
        ("ok", "موفق"),
        ("failed", "ناموفق"),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment",
                                 verbose_name="سفارش")
    provider = models.CharField("درگاه", max_length=50, default="demo")
    amount = models.DecimalField("مبلغ", max_digits=14, decimal_places=0)
    status = models.CharField("وضعیت", max_length=10, choices=STATUS_CHOICES, default="pending")
    tracking_id = models.CharField("شناسه پیگیری", max_length=100, blank=True)

    class Meta:
        verbose_name = "پرداخت"
        verbose_name_plural = "پرداخت‌ها"

    def __str__(self):
        return f"پرداخت {self.order.order_number} — {self.status}"