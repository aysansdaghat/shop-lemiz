"""تنظیمات جنگو بر اساس متغیر محیطی DJANGO_SETTINGS_MODULE.
پیش‌فرض dev است؛ در تولید: DJANGO_SETTINGS_MODULE=config.settings.prod
"""
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")