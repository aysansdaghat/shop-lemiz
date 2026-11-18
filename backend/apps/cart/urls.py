from django.urls import path

from .views import CartItemAddView, CartItemUpdateView, CartView

app_name = "cart"

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", CartItemAddView.as_view(), name="cart_add"),
    path("cart/items/<int:item_id>/", CartItemUpdateView.as_view(), name="cart_item_update"),
]