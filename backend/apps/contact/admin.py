from django.contrib import admin

from .models import ContactMessage, Newsletter


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "is_read", "created_at")
    list_filter = ("is_read",)
    search_fields = ("name", "email", "message")
    list_editable = ("is_read",)
    readonly_fields = ("name", "email", "message", "created_at")


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ("email", "created_at")
    search_fields = ("email",)