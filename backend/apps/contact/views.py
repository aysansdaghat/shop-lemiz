from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Newsletter
from .serializers import ContactMessageSerializer, NewsletterSerializer


class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    queryset = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "پیام شما ثبت شد. سپاس‌گزاریم!"}, status=status.HTTP_201_CREATED)


class NewsletterCreateView(generics.CreateAPIView):
    serializer_class = NewsletterSerializer
    permission_classes = [AllowAny]
    queryset = Newsletter.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        obj, created = Newsletter.objects.get_or_create(email=email)
        if created:
            return Response({"detail": "ایمیل شما در خبرنامه ثبت شد."}, status=status.HTTP_201_CREATED)
        return Response({"detail": "این ایمیل قبلاً در خبرنامه ثبت شده است."}, status=status.HTTP_200_OK)