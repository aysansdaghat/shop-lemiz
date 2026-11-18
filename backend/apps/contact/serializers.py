from rest_framework import serializers

from .models import ContactMessage, Newsletter


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "message", "is_read", "created_at"]
        read_only_fields = ["id", "is_read", "created_at"]

    def validate_message(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("متن پیام بسیار کوتاه است.")
        return value


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ["id", "email", "created_at"]
        read_only_fields = ["id", "created_at"]