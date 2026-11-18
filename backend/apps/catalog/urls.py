from django.urls import path

from .views import (
    CategoryListAPIView,
    ProductBestsellersAPIView,
    ProductDetailAPIView,
    ProductDiscountedAPIView,
    ProductListAPIView,
    ProductNewAPIView,
)

app_name = "catalog"

urlpatterns = [
    path("products/", ProductListAPIView.as_view(), name="product_list"),
    path("products/bestsellers/", ProductBestsellersAPIView.as_view(), name="product_bestsellers"),
    path("products/new/", ProductNewAPIView.as_view(), name="product_new"),
    path("products/discounted/", ProductDiscountedAPIView.as_view(), name="product_discounted"),
    path("products/<int:id>/", ProductDetailAPIView.as_view(), name="product_detail"),
    path("categories/", CategoryListAPIView.as_view(), name="category_list"),
]