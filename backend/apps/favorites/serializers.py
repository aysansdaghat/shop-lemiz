from rest_framework import serializers

from apps.catalog.serializers import ProductListSerializer

from .models import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "product", "created_at"]
        read_only_fields = ["id", "created_at"]


class FavoriteToggleSerializer(serializers.Serializer):
    product = serializers.IntegerField()