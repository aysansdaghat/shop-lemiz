from django.contrib import admin

from .models import Discount


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ("code", "type", "value", "start_at", "end_at",
                    "max_uses", "used_count", "is_active")
    list_filter = ("type", "is_active")
    search_fields = ("code",)
    list_editable = ("is_active",)