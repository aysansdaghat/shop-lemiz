from rest_framework import serializers

from .models import Order, OrderItem, Payment


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product", "name_snapshot", "unit_price", "qty", "line_total"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "status", "status_label", "items",
            "subtotal", "discount_total", "shipping", "grand_total", "currency",
            "receiver_name", "receiver_phone", "address", "postal_code", "note",
            "created_at",
        ]
        read_only_fields = fields


class OrderCreateItemSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    qty = serializers.IntegerField(default=1, min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    """ورودی ثبت سفارش. قیمت از سرور محاسبه می‌شود؛ کاربر نمی‌تواند قیمت بفرستد."""
    items = OrderCreateItemSerializer(many=True)
    receiver_name = serializers.CharField(max_length=100)
    receiver_phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    note = serializers.CharField(required=False, allow_blank=True, default="")
    discount_code = serializers.CharField(required=False, allow_blank=True, allow_null=True, default="")


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "order", "provider", "amount", "status", "tracking_id", "created_at"]
        read_only_fields = fields