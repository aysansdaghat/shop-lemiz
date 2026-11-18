from django.contrib import admin

from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    fields = ["product", "qty"]


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "guest_token", "created_at")
    inlines = [CartItemInline]
    search_fields = ("user__username", "guest_token")


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("cart", "product", "qty", "line_total")
    search_fields = ("product__name",)