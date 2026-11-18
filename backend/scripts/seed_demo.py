"""اسکریپت seed داده نمونه (اجرا: manage.py shell < scripts/seed_demo.py)"""
from decimal import Decimal

from apps.catalog.models import Category, Product, ProductImage
from apps.accounts.models import User

# کاربر ادمین
User.objects.filter(username="admin").exists() or User.objects.create_superuser(
    username="admin", email="admin@example.com", password="admin12345"
)

cats = {
    "outerwear": ("کت و کاپشن", "ink", 3),
    "pants": ("شلوار", "lilac", 2),
    "tops": ("تیشرت و هودی", "bone", 8),
    "sets": ("ست‌ها", "bone", 10),
    "accessories": ("اکسسوری", "lilac", 14),
}
for slug, (name, tone, _pid) in cats.items():
    Category.objects.get_or_create(slug=slug, defaults={"name": name, "tone": tone})

products = [
    (1, "تیشرت کلاسیک", 1250000, None, "tops", 24, False, True,
     "تیشرت نخی با کیفیت بالا، مناسب استفاده روزمره. دارای طرح ساده و رنگ‌های متنوع."),
    (2, "شلوار جین", 890000, None, "pants", 18, False, True,
     "شلوار جین با کیفیت، برش راحت و مناسب همه فصول."),
    (3, "کاپشن زمستانی", 1680000, None, "outerwear", 9, False, True,
     "کاپشن گرم و ضدآب، مناسب فصل سرما. دارای کلاه جدا شدنی و آستر پشمی."),
    (4, "کراپ کت مجلسی", 1450000, 1750000, "outerwear", 6, False, False,
     "کت کراپ با دوخت شیک، مناسب مهمانی و مراسم رسمی. طراحی مینیمال و برش مدرن."),
    (5, "ست کاپلی جذاب", 2100000, 2400000, "sets", 5, False, False,
     "ست دو نفره با طرح هماهنگ، مناسب مناسبت‌های خاص. جنس نخی و راحت."),
    (6, "شلوار جین اورجینال", 980000, 1150000, "pants", 12, False, False,
     "شلوار جین اورجینال با جنس مقاوم و دوخت باکیفیت، مناسب استفاده روزمره."),
    (7, "کت فوتر کوتاه", 1150000, None, "outerwear", 14, True, False,
     "کت فوتر گرم و نرم، مناسب استفاده روزمره در هوای سرد. طراحی راحت و اسپرت."),
    (8, "هودی اسپرت", 780000, None, "tops", 30, True, False,
     "هودی نخی با کلاه، مناسب پوشیدن در فصل‌های خنک. طرح ساده و راحت."),
    (9, "ترنج کت کوتاه", 1320000, None, "outerwear", 7, True, False,
     "کت کوتاه با برش مدرن، مناسب استایل روزمره و نیمه‌رسمی."),
    (10, "وست و شلوار ست", 1890000, 2150000, "sets", 4, False, False,
     "ست وست و شلوار با طراحی هماهنگ، مناسب مناسبت‌های رسمی."),
    (11, "بارانی بلند", 1560000, None, "outerwear", 0, False, False,
     "بارانی بلند ضدآب، مناسب روزهای بارانی. طراحی شیک و کاربردی."),
    (12, "شلوار جاگر", 690000, None, "pants", 40, True, False,
     "شلوار جاگر راحت با کش مچ‌پا، مناسب ورزش و استفاده روزمره."),
    (13, "کت فوتر بلند", 1420000, None, "outerwear", 11, False, True,
     "کت فوتر بلند و گرم، مناسب پاییز و زمستان. جنس نرم و باکیفیت."),
    (14, "کلاه باکت پشمی", 320000, 400000, "accessories", 25, True, False,
     "کلاه باکت گرم با جنس پشمی، مکمل مناسب برای استایل زمستانی."),
    (15, "کت جین زنانه", 1190000, None, "outerwear", 8, False, False,
     "کت جین زنانه با برش کلاسیک، مناسب ست کردن با انواع لباس."),
]

image_urls = {
    1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfwUFGve_WTpTUEBZ4anu1FA407HVwD5G-3pekRrFOBA&s=10",
    2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-DcAcJoS61fv5wqm0cPwsDlUJUM0O7EOjzAOxOr4lAQ&s=10",
    3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLmiNJzR4z6NjD720iVROqrTiwKj_XJd06kH2EQQ1INQ&s=10",
    4: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4NNiwuRCvmD0rd3ljLeLtWvI5K3-Ne6GliAx4-QxVRQ&s=10",
    5: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzaJ3WYf1FPPhD2e_8jmsqrQJyBMpmZshY3Ju-_83_-A&s=10",
    6: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9sRmmEr5Fgo6JCrV2UCGLEBlBYoSDiNVGTJywOPVMdg&s=10",
    7: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0WdzThaOLuztaku3Fw4hG2IXbX5_sW_AIatwAH1jzrw&s=10",
    8: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4mKtht7Ye_s9DaXaMpj6LjNA6cFNC2Jc0KUCxeIgy8g&s=10",
    9: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3WZBqq_-jwo7y9eQuGuB5BPU5xoSHgpKt5oeirqJYWw&s=10",
    10: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0-QnmynbTZySlI15AGCNw4esYaK0xXr4knKWLE64bEw&s=10",
    11: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBEInddpxYOwXDT0TTB2k-chJCkick7qc722ruzJ1zLw&s=10",
    12: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcK9-QkDo7PQd8BAP2wXskIxsBJFOA4L5XohOrL9E_gQ&s=10",
    13: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEKxu-vUlSZaBpgMXY40PiQ0c0zoDqRO2wBvy28MtH-A&s=10",
    14: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuBjdKq4TV0G4RV_wOx9vrrg4sAvinnvildnYICbvmwQ&s=10",
    15: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCVWW4pmTcgthVYui5gEsatCwYhxXn44OzIzbjdX04zg&s=10",
}

for (pid, name, price, old, cat, stock, is_new, best, desc) in products:
    category = Category.objects.get(slug=cat)
    slug = name.replace(" ", "-")
    obj, created = Product.objects.update_or_create(
        id=pid,
        defaults=dict(
            category=category, name=name, slug=slug, description=desc,
            price=Decimal(price), old_price=Decimal(old) if old else None,
            stock=stock, is_new=is_new, is_bestseller=best, is_active=True, is_deleted=False,
        ),
    )
    if pid in image_urls:
        ProductImage.objects.get_or_create(
            product=obj, is_primary=True, defaults={"image": image_urls[pid], "order": 0, "alt": name}
        )

print("Seed complete: users=", User.objects.count(), "products=", Product.objects.count(), "categories=", Category.objects.count())