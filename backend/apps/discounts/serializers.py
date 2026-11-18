from rest_framework import serializers

from .models import Discount


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ["id", "code", "type", "value", "start_at", "end_at",
                  "max_uses", "used_count", "is_active"]
        read_only_fields = ["id", "used_count"]


class DiscountValidateSerializer(serializers.Serializer):
    code = serializers.CharField()
    subtotal = serializers.DecimalField(max_digits=14, decimal_places=0)