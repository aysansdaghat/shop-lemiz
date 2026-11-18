from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DiscountValidateSerializer
from .services import apply_discount


class DiscountValidateView(APIView):
    """اعتبارسنجی کد تخفیف و محاسبه مبلغ تخفیف."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DiscountValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data["code"]
        subtotal = serializer.validated_data["subtotal"]
        try:
            discount, amount = apply_discount(code, subtotal)
        except ValueError as exc:
            return Response({"detail": str(exc), "valid": False}, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            "valid": True,
            "code": discount.code,
            "type": discount.type,
            "discountAmount": amount,
            "finalTotal": subtotal - amount,
        })