from django.urls import path

from .views import DiscountValidateView

app_name = "discounts"

urlpatterns = [
    path("discounts/validate/", DiscountValidateView.as_view(), name="discount_validate"),
]