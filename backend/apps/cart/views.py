from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Product

from .context import get_cart_for_request
from .serializers import (
    CartItemCreateSerializer,
    CartItemUpdateSerializer,
    CartSerializer,
)
from .services import add_item, update_item_qty


class CartView(APIView):
    """مشاهده سبد خرید (کاربر یا مهمان)."""
    permission_classes = [AllowAny]

    def get(self, request):
        cart, error = get_cart_for_request(request)
        if error:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)
        cart.items.select_related("product")
        return Response(CartSerializer(cart).data)


class CartItemAddView(APIView):
    """افزودن محصول به سبد."""
    permission_classes = [AllowAny]

    def post(self, request):
        cart, error = get_cart_for_request(request)
        if error:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CartItemCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            product = Product.objects.get(id=serializer.validated_data["product"], is_active=True, is_deleted=False)
        except Product.DoesNotExist:
            return Response({"detail": "محصول موردنظر پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)

        try:
            add_item(cart, product, serializer.validated_data["qty"])
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartItemUpdateView(APIView):
    """تغییر تعداد یا حذف یک قلم سبد."""
    permission_classes = [AllowAny]

    def patch(self, request, item_id):
        cart, error = get_cart_for_request(request)
        if error:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CartItemUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            update_item_qty(cart, item_id, serializer.validated_data["qty"])
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart, error = get_cart_for_request(request)
        if error:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CartItemUpdateSerializer(data={"qty": 0})
        serializer.is_valid(raise_exception=True)
        try:
            update_item_qty(cart, item_id, 0)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)