"""کلاس‌های پایه مدل‌ها: زمان‌دار و حذف منطقی."""
from django.db import models


class TimeStamped(models.Model):
    """افزودن فیلدهای created_at و updated_at به مدل."""
    created_at = models.DateTimeField("تاریخ ایجاد", auto_now_add=True)
    updated_at = models.DateTimeField("تاریخ به‌روزرسانی", auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteQuerySet(models.QuerySet):
    def alive(self):
        return self.filter(is_deleted=False)

    def delete(self):
        return self.update(is_deleted=True, is_active=False)


class SoftDeleteModel(models.Model):
    """حذف منطقی با is_deleted/is_active برای محصولات و موجودیت‌ها."""
    is_active = models.BooleanField("فعال", default=True)
    is_deleted = models.BooleanField("حذف‌شده", default=False)

    objects = SoftDeleteQuerySet.as_manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.is_active = False
        self.save(update_fields=["is_deleted", "is_active"])