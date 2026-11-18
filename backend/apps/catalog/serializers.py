from rest_framework import serializers

from .models import Category, Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt", "order", "is_primary"]


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "tone", "parent", "product_count"]

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True, is_deleted=False).count()


class ProductListSerializer(serializers.ModelSerializer):
    """خروجی سازگار با کارت محصول فرانت (price عدد، category اسلاگ، categoryLabel)."""
    category = serializers.CharField(source="category.slug", read_only=True)
    categoryLabel = serializers.CharField(source="category.name", read_only=True)
    image = serializers.SerializerMethodField()
    oldPrice = serializers.DecimalField(source="old_price", max_digits=12, decimal_places=0,
                                        read_only=True)
    isNew = serializers.BooleanField(source="is_new", read_only=True)
    bestseller = serializers.BooleanField(source="is_bestseller", read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "price", "oldPrice", "description", "image",
                  "category", "categoryLabel", "stock", "isNew", "bestseller"]

    def get_image(self, obj):
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        return primary.image if primary else ""


class ProductDetailSerializer(ProductListSerializer):
    """جزئیات محصول + گالری تصاویر."""
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ["images", "created_at"]