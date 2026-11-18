"""ابزارهای کمکی متنی — نرمال‌سازی فارسی برای جستجو."""
import re

# حذف اعراب و یکسان‌سازی ی/ک عربی و نیم‌فاصله
_DIACRITICS = re.compile(r"[\u064B-\u065F]")
_ZWNJ = re.compile(r"[\u200c\u200e\u200f]")
_SPACES = re.compile(r"\s+")


def normalize_text(value):
    if value is None:
        return ""
    text = str(value)
    text = text.replace("ي", "ی").replace("ك", "ک")
    text = _ZWNJ.sub(" ", text)
    text = _DIACRITICS.sub("", text)
    text = _SPACES.sub(" ", text)
    return text.strip().lower()