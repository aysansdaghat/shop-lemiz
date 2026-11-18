from django.urls import path

from .views import FavoriteDetailView, FavoriteListCreateView

app_name = "favorites"

urlpatterns = [
    path("favorites/", FavoriteListCreateView.as_view(), name="favorite_list"),
    path("favorites/<int:pk>/", FavoriteDetailView.as_view(), name="favorite_detail"),
]