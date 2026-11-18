from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "author_name", "rating", "is_approved", "created_at")
    list_filter = ("is_approved", "rating")
    search_fields = ("product__name", "author_name", "text")
    list_editable = ("is_approved",)
    actions = ["approve", "reject"]

    @admin.action(description="تأیید دیدگاه‌های انتخاب‌شده")
    def approve(self, request, queryset):
        queryset.update(is_approved=True)

    @admin.action(description="رد دیدگاه‌های انتخاب‌شده")
    def reject(self, request, queryset):
        queryset.update(is_approved=False)