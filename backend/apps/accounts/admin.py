from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import Address, User, UserProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("اطلاعات لمیز", {"fields": ("phone",)}),
    )
    list_display = ("username", "email", "first_name", "last_name", "phone", "is_staff")
    search_fields = ("username", "email", "first_name", "last_name", "phone")


class AddressInline(admin.TabularInline):
    model = Address
    extra = 0


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "birth_date", "created_at")
    search_fields = ("user__username", "user__email")


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "province", "city", "is_default")
    list_filter = ("province", "is_default")
    search_fields = ("user__username", "city", "line1", "postal_code")