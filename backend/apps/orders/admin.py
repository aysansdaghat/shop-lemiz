from django.contrib import admin

from .models import Order, OrderItem, Payment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "name_snapshot", "unit_price", "qty", "line_total")


class PaymentInline(admin.StackedInline):
    model = Payment
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "user", "status", "grand_total", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("order_number", "user__username", "receiver_name", "receiver_phone")
    readonly_fields = ("order_number", "subtotal", "discount_total", "shipping", "grand_total")
    inlines = [OrderItemInline, PaymentInline]
    date_hierarchy = "created_at"
    actions = ["mark_shipped", "mark_delivered", "mark_canceled"]

    @admin.action(description="ثبت به‌عنوان ارسال‌شده")
    def mark_shipped(self, request, queryset):
        queryset.update(status="shipped")
    @admin.action(description="ثبت به‌عنوان تحویل‌شده")
    def mark_delivered(self, request, queryset):
        queryset.update(status="delivered")
    @admin.action(description="لغو سفارش")
    def mark_canceled(self, request, queryset):
        queryset.update(status="canceled")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("order", "provider", "amount", "status", "tracking_id", "created_at")
    list_filter = ("status", "provider")
    search_fields = ("order__order_number", "tracking_id")