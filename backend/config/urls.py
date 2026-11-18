"""ریشه‌ی URL پروژه — مدیریت و API."""
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# عنوان‌های فارسی پنل مدیریت
admin.site.site_header = "مدیریت فروشگاه لمیز"
admin.site.site_title = "پنل مدیریت لمیز"
admin.site.index_title = "پیشخوان مدیریت"

urlpatterns = [
    path("admin/", admin.site.urls),
    # API
    path("api/", include("apps.accounts.urls")),
    path("api/", include("apps.catalog.urls")),
    path("api/", include("apps.cart.urls")),
    path("api/", include("apps.orders.urls")),
    path("api/", include("apps.discounts.urls")),
    path("api/", include("apps.reviews.urls")),
    path("api/", include("apps.favorites.urls")),
    path("api/", include("apps.contact.urls")),
    # مستندات OpenAPI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]