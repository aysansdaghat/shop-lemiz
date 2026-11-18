from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "product", "author_name", "rating", "text", "is_approved", "created_at"]
        read_only_fields = ["id", "is_approved", "created_at"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("امتیاز باید بین ۱ تا ۵ باشد.")
        return value