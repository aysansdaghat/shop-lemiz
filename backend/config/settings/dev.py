"""تنظیمات توسعه (Development) — SQLite و دیباگ روشن."""
from .base import *  # noqa: F401,F403
from .base import env_bool

DEBUG = env_bool("DJANGO_DEBUG", True)

# در توسعه محدودیت میزبان برداشته می‌شود
ALLOWED_HOSTS = ["*"]