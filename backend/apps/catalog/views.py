from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics
from rest_framework.pagination import PageNumberPagination

from .models import Category, Product
from .serializers import CategorySerializer, ProductDetailSerializer, ProductListSerializer
from .services import filter_products


class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100


class ProductListAPIView(generics.ListAPIView):
    """لیست محصولات با فیلتر category/q/sort و صفحه‌بندی."""
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "category__name"]
    ordering_fields = ["price", "id", "created_at"]

    def get_queryset(self):
        params = self.request.query_params
        base = Product.objects.filter(is_active=True, is_deleted=False).select_related("category").prefetch_related("images")
        return filter_products(
            base,
            category=params.get("category"),
            q=params.get("q"),
            sort=params.get("sort"),
        )

    pagination_class = ProductPagination


class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "id"
    queryset = Product.objects.filter(is_active=True, is_deleted=False).select_related("category").prefetch_related("images")


class CategoryListAPIView(generics.ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.prefetch_related("products")
    pagination_class = None


class ProductBestsellersAPIView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = None
    queryset = Product.objects.filter(is_active=True, is_deleted=False, is_bestseller=True).select_related("category").prefetch_related("images")


class ProductNewAPIView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = None
    queryset = Product.objects.filter(is_active=True, is_deleted=False, is_new=True).select_related("category").prefetch_related("images")


class ProductDiscountedAPIView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = None
    queryset = Product.objects.filter(is_active=True, is_deleted=False, old_price__isnull=False).exclude(old_price=0).select_related("category").prefetch_related("images")