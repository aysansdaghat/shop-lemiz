"""هندلر سفارشی خطا با پیام‌های فارسی و بدون افشای اطلاعات حساس."""
from rest_framework.views import exception_handler


def farsi_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None

    detail = response.data
    # پیام‌های عمومی فارسی برای خطاهای رایج
    status = response.status_code
    if status == 401:
        custom = "برای انجام این کار باید وارد حساب کاربری شوید."
    elif status == 403:
        custom = "دسترسی به این بخش مجاز نیست."
    elif status == 404:
        custom = "منبع موردنظر پیدا نشد."
    elif status == 405:
        custom = "این متد درخواست مجاز نیست."
    elif status == 429:
        custom = "تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید."
    elif 500 <= status < 600:
        custom = "خطای داخلی سرور رخ داد. لطفاً بعداً تلاش کنید."
    else:
        custom = None

    if custom is not None and isinstance(detail, dict) and "detail" in detail:
        response.data = {"detail": custom}
    elif custom is not None and not isinstance(detail, dict):
        response.data = {"detail": custom}

    return response