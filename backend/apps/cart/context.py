"""یافتن سبد از روی درخواست: کاربر لاگین یا guest_token از هدر/پارامتر."""
from .models import Cart


def get_cart_for_request(request):
    user = request.user if request.user and request.user.is_authenticated else None
    if user:
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart, None

    token = request.headers.get("X-Guest-Token") or request.query_params.get("guest_token")
    if token:
        cart, _ = Cart.objects.get_or_create(guest_token=token)
        return cart, None

    return None, "برای دسترسی به سبد خرید، شناسه مهمان (X-Guest-Token) را ارسال کنید یا وارد شوید."