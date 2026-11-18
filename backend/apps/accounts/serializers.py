from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Address, UserProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "full_name", "phone"]
        read_only_fields = ["id"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})
    password2 = serializers.CharField(write_only=True, label="تکرار رمز عبور",
                                      style={"input_type": "password"})

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name", "phone", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password2"):
            raise serializers.ValidationError({"password2": "رمز عبور و تکرار آن یکسان نیستند."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.get_or_create(user=user)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["avatar", "birth_date"]


class ProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "full_name", "phone", "profile"]
        read_only_fields = ["id", "username"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if profile_data:
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        return instance


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "title", "province", "city", "line1", "postal_code",
                  "receiver_name", "receiver_phone", "is_default"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        # فقط یک آدرس پیش‌فرض مجاز است
        if attrs.get("is_default"):
            Address.objects.filter(user=self.context["request"].user).update(is_default=False)
        return attrs