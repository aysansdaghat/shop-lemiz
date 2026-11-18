from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AddressDetailView,
    AddressListCreateView,
    LoginView,
    ProfileView,
    RegisterView,
)

app_name = "accounts"

urlpatterns = [
    path("accounts/register/", RegisterView.as_view(), name="register"),
    path("accounts/login/", LoginView.as_view(), name="login"),
    path("accounts/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("accounts/profile/", ProfileView.as_view(), name="profile"),
    path("accounts/addresses/", AddressListCreateView.as_view(), name="address_list"),
    path("accounts/addresses/<int:pk>/", AddressDetailView.as_view(), name="address_detail"),
]