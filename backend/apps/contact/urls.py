from django.urls import path

from .views import ContactMessageCreateView, NewsletterCreateView

app_name = "contact"

urlpatterns = [
    path("contact/", ContactMessageCreateView.as_view(), name="contact"),
    path("newsletter/", NewsletterCreateView.as_view(), name="newsletter"),
]