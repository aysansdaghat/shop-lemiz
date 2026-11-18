from django.contrib import admin

from .models import Category, Product, ProductImage, ProductVariant


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ["image", "alt", "order", "is_primary"]


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    fields = ["name", "value", "sku", "price_delta", "stock"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent", "tone", "created_at")
    list_filter = ("tone",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "old_price", "stock", "is_new",
                    "is_bestseller", "is_active", "created_at")
    list_filter = ("is_active", "is_new", "is_bestseller", "category")
    search_fields = ("name", "description", "slug")
    list_editable = ("price", "stock", "is_active", "is_new", "is_bestseller")
    inlines = [ProductImageInline, ProductVariantInline]
    autocomplete_fields = ["category"]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "alt", "order", "is_primary")
    list_filter = ("is_primary",)
    search_fields = ("product__name",)


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ("product", "name", "value", "sku", "stock")
    search_fields = ("product__name", "sku")