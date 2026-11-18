"""منطق جستجو و مرتب‌سازی محصولات — جدا از ویو."""
from django.db.models import F, Q

from apps.utils.text import normalize_text

from .models import Product


def _sort_products(queryset, sort):
    """مرتب‌سازی بر اساس کلیدهای فرانت: featured, newest, cheap, expensive, discount."""
    if sort == "cheap":
        return queryset.order_by("price", "id")
    if sort == "expensive":
        return queryset.order_by("-price", "id")
    if sort == "discount":
        # بیشترین درصد تخفیف: old_price موجود و اختلاف بزرگ‌تر
        return queryset.annotate(
            saving=F("old_price") - F("price"),
        ).filter(old_price__isnull=False).order_by("-saving", "id")
    if sort == "newest":
        return queryset.order_by("-is_new", "-id")
    # featured: پرفروش‌ها اول، سپس بقیه
    return queryset.order_by("-is_bestseller", "id")


def filter_products(queryset, category=None, q=None, sort=None):
    """اعمال فیلتر دسته، جستجو و مرتب‌سازی روی کوئری‌ست محصولات."""
    qs = queryset

    if category:
        qs = qs.filter(category__slug=category)

    if q and q.strip():
        tokens = normalize_text(q).split()
        for token in tokens:
            qs = qs.filter(
                Q(name__icontains=token)
                | Q(description__icontains=token)
                | Q(category__name__icontains=token)
            )

    if sort:
        qs = _sort_products(qs, sort)

    return qs.distinct()