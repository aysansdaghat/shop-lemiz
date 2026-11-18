from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Product

from .models import Favorite
from .serializers import FavoriteSerializer, FavoriteToggleSerializer


class FavoriteListCreateView(generics.ListCreateAPIView):
    """فهرست علاقه‌مندی‌های کاربر (POST با product برای افزودن)."""
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related("product")

    def create(self, request, *args, **kwargs):
        serializer = FavoriteToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data["product"]
        try:
            product = Product.objects.get(id=product_id, is_active=True, is_deleted=False)
        except Product.DoesNotExist:
            return Response({"detail": "محصول موردنظر پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)
        favorite, created = Favorite.objects.get_or_create(user=request.user, product=product)
        return Response(FavoriteSerializer(favorite).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class FavoriteDetailView(APIView):
    """حذف علاقه‌مندی."""
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        deleted, _ = Favorite.objects.filter(user=request.user, id=pk).delete()
        if not deleted:
            return Response({"detail": "علاقه‌مندی موردنظر پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)