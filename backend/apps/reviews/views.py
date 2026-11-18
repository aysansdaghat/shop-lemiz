from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Review
from .serializers import ReviewSerializer


class ReviewListCreateView(generics.ListCreateAPIView):
    """فهرست دیدگاه‌های تأییدشده یک محصول و ثبت دیدگاه جدید."""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        product_id = self.request.query_params.get("product")
        qs = Review.objects.filter(is_approved=True).select_related("product")
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if request.user.is_authenticated and not serializer.validated_data.get("author_name"):
            serializer.validated_data["author_name"] = request.user.get_full_name() or request.user.username
            serializer.validated_data["user"] = request.user
        serializer.save()
        return Response(
            {"detail": "دیدگاه شما ثبت شد و پس از تأیید نمایش داده می‌شود."},
            status=201,
        )