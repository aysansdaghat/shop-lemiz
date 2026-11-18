from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify

from apps.common.models import SoftDeleteModel, TimeStamped


class Category(TimeStamped):
    """دسته‌بندی با پشتیبانی والد/فرزند."""
    TONE_CHOICES = [
        ("ink", "Ink"),
        ("lilac", "Lilac"),
        ("bone", "Bone"),
    ]

    parent = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True,
                               related_name="children", verbose_name="دسته والد")
    name = models.CharField("نام", max_length=100)
    slug = models.SlugField("نامک", max_length=120, unique=True, allow_unicode=True)
    tone = models.CharField("لحن رنگ", max_length=10, choices=TONE_CHOICES, default="bone")

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)


class Product(SoftDeleteModel, TimeStamped):
    """محصول فروشگاه. قیمت‌ها به تومان (Decimal بدون اعشار)."""
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products",
                                 verbose_name="دسته‌بندی")
    name = models.CharField("نام", max_length=200)
    slug = models.SlugField("نامک", max_length=220, unique=True, allow_unicode=True)
    description = models.TextField("توضیحات", blank=True)
    price = models.DecimalField("قیمت (تومان)", max_digits=12, decimal_places=0,
                                validators=[MinValueValidator(Decimal("0"))])
    old_price = models.DecimalField("قیمت قبلی (تومان)", max_digits=12, decimal_places=0,
                                    null=True, blank=True)
    stock = models.PositiveIntegerField("موجودی", default=0)
    is_new = models.BooleanField("جدید", default=False)
    is_bestseller = models.BooleanField("پرفروش", default=False)

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["category", "is_active"]),
            models.Index(fields=["is_bestseller"]),
            models.Index(fields=["is_new"]),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)

    @property
    def is_available(self):
        return self.is_active and not self.is_deleted and self.stock > 0


class ProductImage(TimeStamped):
    """تصویر محصول (اصلی و گالری)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images",
                                verbose_name="محصول")
    image = models.URLField("آدرس تصویر", max_length=500)
    alt = models.CharField("متن جایگزین", max_length=200, blank=True)
    order = models.PositiveIntegerField("ترتیب", default=0)
    is_primary = models.BooleanField("اصلی", default=False)

    class Meta:
        verbose_name = "تصویر محصول"
        verbose_name_plural = "تصاویر محصولات"
        ordering = ["order", "id"]

    def __str__(self):
        return f"تصویر {self.product.name}"

    @property
    def primary_image(self):
        return ProductImage.objects.filter(product=self.product, is_primary=True).first() or \
            ProductImage.objects.filter(product=self.product).first()


class ProductVariant(TimeStamped):
    """نوع/سایز/رنگ محصول (برای توسعه آینده)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants",
                                verbose_name="محصول")
    name = models.CharField("نام نوع", max_length=50)  # رنگ/سایز
    value = models.CharField("مقدار", max_length=50)
    sku = models.CharField("کد کالا", max_length=60, blank=True)
    price_delta = models.DecimalField("اختلاف قیمت", max_digits=12, decimal_places=0, default=0)
    stock = models.PositiveIntegerField("موجودی", default=0)

    class Meta:
        verbose_name = "نوع محصول"
        verbose_name_plural = "انواع محصولات"
        unique_together = ("product", "name", "value")

    def __str__(self):
        return f"{self.product.name} — {self.name}: {self.value}"