from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer
from .services import create_order


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(user=user).prefetch_related("items") if user.is_authenticated else Order.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user if request.user.is_authenticated else None
        try:
            order = create_order(
                items=data["items"],
                user=user,
                receiver_name=data["receiver_name"],
                receiver_phone=data["receiver_phone"],
                address=data["address"],
                postal_code=data.get("postal_code", ""),
                note=data.get("note", ""),
                discount_code=data.get("discount_code") or None,
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Order.objects.filter(user=user).prefetch_related("items")
        return Order.objects.all()