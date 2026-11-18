from rest_framework import serializers

from apps.catalog.serializers import ProductListSerializer

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    line_total = serializers.DecimalField(max_digits=12, decimal_places=0, read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "qty", "line_total"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    count = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "count", "total"]

    def get_count(self, obj):
        return sum(i.qty for i in obj.items.all())

    def get_total(self, obj):
        return sum((i.line_total for i in obj.items.all()), 0)


class CartItemCreateSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    qty = serializers.IntegerField(default=1, min_value=1)


class CartItemUpdateSerializer(serializers.Serializer):
    qty = serializers.IntegerField(min_value=0)