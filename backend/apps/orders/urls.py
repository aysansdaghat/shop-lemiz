from django.urls import path

from .views import OrderDetailView, OrderListCreateView

app_name = "orders"

urlpatterns = [
    path("orders/", OrderListCreateView.as_view(), name="order_list"),
    path("orders/<int:id>/", OrderDetailView.as_view(), name="order_detail"),
]