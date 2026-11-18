"""
تنظیمات پایه پروژه لمیز — مشترک بین همه محیط‌ها.
مقادیر حساس از متغیرهای محیطی (.env) خوانده می‌شوند.
"""
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv
import os

# BASE_DIR = پوشه‌ی backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# بارگذاری .env از پوشه‌ی backend
load_dotenv(BASE_DIR / ".env")


def env_bool(key, default=False):
    return os.getenv(key, str(default)).strip().lower() in {"1", "true", "yes", "on"}


def env_list(key, default=""):
    return [item.strip() for item in os.getenv(key, default).split(",") if item.strip()]


# امنیت
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-insecure-key-change-me")
DEBUG = env_bool("DJANGO_DEBUG", False)
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")

# برنامه‌ها
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
]

LOCAL_APPS = [
    "apps.accounts",
    "apps.catalog",
    "apps.cart",
    "apps.orders",
    "apps.discounts",
    "apps.reviews",
    "apps.favorites",
    "apps.contact",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# پایگاه داده (سوییچ با DB_ENGINE)
if os.getenv("DB_ENGINE", "sqlite").lower() == "mssql":
    DATABASES = {
        "default": {
            "ENGINE": "mssql",
            "NAME": os.getenv("DB_NAME", "lemiz_shop"),
            "HOST": os.getenv("DB_HOST", "localhost"),
            "PORT": os.getenv("DB_PORT", "1433"),
            "USER": os.getenv("DB_USER", "sa"),
            "PASSWORD": os.getenv("DB_PASSWORD", ""),
            "OPTIONS": {
                "driver": os.getenv("DB_DRIVER", "ODBC Driver 17 for SQL Server"),
            },
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / os.getenv("SQLITE_NAME", "db.sqlite3"),
        }
    }

# مدل کاربر سفارشی
AUTH_USER_MODEL = "accounts.User"

# اعتبارسنجی رمز
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# فارسی / منطقه زمانی
LANGUAGE_CODE = os.getenv("DJANGO_LANGUAGE_CODE", "fa-ir")
TIME_ZONE = os.getenv("DJANGO_TIME_ZONE", "Asia/Tehran")
USE_I18N = True
USE_TZ = True

# فایل‌های استاتیک و رسانه
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_PAGINATION_CLASS": "apps.common.pagination.DefaultPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "EXCEPTION_HANDLER": "apps.common.exceptions.farsi_exception_handler",
    # خروجی عددی برای فیلدهای Decimal (سازگار با فرانت که قیمت را عدد می‌خواهد)
    "COERCE_DECIMAL_TO_STRING": False,
}

# SimpleJWT
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

# CORS
CORS_ALLOWED_ORIGINS = env_list(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
CORS_ALLOW_CREDENTIALS = True

# OpenAPI docs
SPECTACULAR_SETTINGS = {
    "TITLE": "Lemiz Shop API",
    "DESCRIPTION": "API فروشگاه لمیز — محصولات، سبد، سفارش، پرداخت و حساب کاربری.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
}

# واحد پول مستندشده پروژه: تومان، کد ارز IRT
CURRENCY_CODE = "IRT"
CURRENCY_SYMBOL = "تومان"