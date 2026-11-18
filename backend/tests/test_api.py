"""تست‌های یکپارچه API فروشگاه لمیز (Django + DRF)."""
from decimal import Decimal

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User
from apps.catalog.models import Category, Product, ProductImage
from apps.discounts.models import Discount


class BaseAPITest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(name="تیشرت و هودی", slug="tops", tone="bone")
        cls.product = Product.objects.create(
            category=cls.category, name="تیشرت کلاسیک", slug="tishrt-klasik",
            description="تیشرت نخی با کیفیت", price=Decimal("1250000"),
            stock=10, is_bestseller=True,
        )
        ProductImage.objects.create(product=cls.product, image="https://example.com/1.jpg",
                                    is_primary=True, alt="تیشرت")
        cls.product2 = Product.objects.create(
            category=cls.category, name="هودی اسپرت", slug="hudi",
            description="هودی راحت", price=Decimal("780000"), stock=5, is_new=True,
        )

    def register_and_login(self, username="negar", password="StrongPass123"):
        self.client.post(reverse("accounts:register"), {
            "username": username, "email": f"{username}@example.com",
            "first_name": "نگار", "last_name": "ک", "phone": "09121112233",
            "password": password, "password2": password,
        }, format="json")
        resp = self.client.post(reverse("accounts:login"),
                                {"username": username, "password": password}, format="json")
        token = resp.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        return resp.data


class AccountsTests(BaseAPITest):
    def test_register_success(self):
        resp = self.client.post(reverse("accounts:register"), {
            "username": "sara", "email": "sara@example.com",
            "password": "StrongPass123", "password2": "StrongPass123",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="sara").exists())

    def test_register_password_mismatch(self):
        resp = self.client.post(reverse("accounts:register"), {
            "username": "sara2", "email": "sara2@example.com",
            "password": "StrongPass123", "password2": "Different123",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_and_profile(self):
        self.register_and_login()
        resp = self.client.get(reverse("accounts:profile"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["username"], "negar")
        self.assertEqual(resp.data["phone"], "09121112233")

    def test_profile_requires_auth(self):
        resp = self.client.get(reverse("accounts:profile"))
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class CatalogTests(BaseAPITest):
    def test_product_list(self):
        resp = self.client.get(reverse("catalog:product_list"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 2)
        first = resp.data["results"][0]
        for key in ["id", "name", "price", "oldPrice", "image", "category",
                    "categoryLabel", "stock", "isNew", "bestseller"]:
            self.assertIn(key, first)

    def test_product_filter_by_category(self):
        other = Category.objects.create(name="شلوار", slug="pants")
        Product.objects.create(category=other, name="شلوار جین", slug="shinvar",
                               description="جین", price=Decimal("890000"), stock=3)
        resp = self.client.get(reverse("catalog:product_list"), {"category": "tops"})
        self.assertEqual(resp.data["count"], 2)

    def test_product_search(self):
        resp = self.client.get(reverse("catalog:product_list"), {"q": "کلاسیک"})
        self.assertEqual(resp.data["count"], 1)

    def test_product_sort_cheap(self):
        resp = self.client.get(reverse("catalog:product_list"), {"sort": "cheap"})
        prices = [float(p["price"]) for p in resp.data["results"]]
        self.assertEqual(prices, sorted(prices))

    def test_product_detail(self):
        resp = self.client.get(reverse("catalog:product_detail", args=[self.product.id]))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["name"], "تیشرت کلاسیک")
        self.assertEqual(len(resp.data["images"]), 1)

    def test_product_detail_not_found(self):
        resp = self.client.get(reverse("catalog:product_detail", args=[9999]))
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_categories(self):
        resp = self.client.get(reverse("catalog:category_list"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data), 1)


class CartTests(BaseAPITest):
    def test_guest_cart_add_and_total(self):
        resp = self.client.post(reverse("cart:cart_add"), {"product": self.product.id, "qty": 2},
                                format="json", HTTP_X_GUEST_TOKEN="guest-abc")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["count"], 2)
        self.assertEqual(Decimal(str(resp.data["total"])), Decimal("2500000"))

    def test_cart_add_exceeds_stock(self):
        resp = self.client.post(reverse("cart:cart_add"), {"product": self.product.id, "qty": 999},
                                format="json", HTTP_X_GUEST_TOKEN="guest-xyz")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authenticated_cart(self):
        self.register_and_login()
        resp = self.client.post(reverse("cart:cart_add"), {"product": self.product2.id, "qty": 1},
                                format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["count"], 1)


class OrderTests(BaseAPITest):
    def test_order_totals_and_stock_decrement(self):
        resp = self.client.post(reverse("orders:order_list"), {
            "items": [{"product": self.product.id, "qty": 2}],
            "receiver_name": "علی", "receiver_phone": "09121112233",
            "address": "تهران، ولیعصر",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["order_number"].startswith("LMZ-"), True)
        self.assertEqual(Decimal(str(resp.data["grand_total"])), Decimal("2500000"))
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 8)

    def test_order_insufficient_stock(self):
        resp = self.client.post(reverse("orders:order_list"), {
            "items": [{"product": self.product.id, "qty": 999}],
            "receiver_name": "علی", "receiver_phone": "09121112233",
            "address": "تهران",
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_order_ignores_client_price(self):
        # کاربر نمی‌تواند قیمت بفرستد؛ قیمت از سرور محاسبه می‌شود
        resp = self.client.post(reverse("orders:order_list"), {
            "items": [{"product": self.product.id, "qty": 1, "price": 1}],
            "receiver_name": "علی", "receiver_phone": "09121112233",
            "address": "تهران",
        }, format="json")
        self.assertEqual(Decimal(str(resp.data["grand_total"])), Decimal("1250000"))

    def test_order_with_discount(self):
        Discount.objects.create(code="WELCOME10", type="percent", value=Decimal("10"),
                                is_active=True)
        resp = self.client.post(reverse("orders:order_list"), {
            "items": [{"product": self.product.id, "qty": 2}],
            "receiver_name": "علی", "receiver_phone": "09121112233",
            "address": "تهران", "discount_code": "WELCOME10",
        }, format="json")
        self.assertEqual(Decimal(str(resp.data["subtotal"])), Decimal("2500000"))
        self.assertEqual(Decimal(str(resp.data["discount_total"])), Decimal("250000"))
        self.assertEqual(Decimal(str(resp.data["grand_total"])), Decimal("2250000"))

    def test_order_history_requires_auth(self):
        resp = self.client.get(reverse("orders:order_list"))
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_order_history_authenticated(self):
        self.register_and_login()
        self.client.post(reverse("orders:order_list"), {
            "items": [{"product": self.product.id, "qty": 1}],
            "receiver_name": "علی", "receiver_phone": "09121112233", "address": "تهران",
        }, format="json")
        resp = self.client.get(reverse("orders:order_list"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 1)


class DiscountTests(BaseAPITest):
    def test_discount_valid(self):
        Discount.objects.create(code="WELCOME10", type="percent", value=Decimal("10"), is_active=True)
        resp = self.client.post(reverse("discounts:discount_validate"),
                                {"code": "WELCOME10", "subtotal": 1000000}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(str(resp.data["discountAmount"])), Decimal("100000"))
        self.assertEqual(Decimal(str(resp.data["finalTotal"])), Decimal("900000"))

    def test_discount_invalid(self):
        resp = self.client.post(reverse("discounts:discount_validate"),
                                {"code": "NOPE", "subtotal": 1000000}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(resp.data["valid"])


class FavoritesTests(BaseAPITest):
    def test_favorite_requires_auth(self):
        resp = self.client.get(reverse("favorites:favorite_list"))
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_favorite_add_and_list(self):
        self.register_and_login()
        self.client.post(reverse("favorites:favorite_list"), {"product": self.product.id}, format="json")
        resp = self.client.get(reverse("favorites:favorite_list"))
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]["product"]["id"], self.product.id)


class ContactNewsletterTests(BaseAPITest):
    def test_contact_submit(self):
        resp = self.client.post(reverse("contact:contact"),
                                {"name": "علی", "email": "ali@example.com", "message": "سلام سوالی دارم"},
                                format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_contact_short_message(self):
        resp = self.client.post(reverse("contact:contact"),
                                {"name": "علی", "email": "ali@example.com", "message": "ک"},
                                format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_newsletter_subscribe(self):
        resp = self.client.post(reverse("contact:newsletter"), {"email": "n@example.com"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)


class ReviewTests(BaseAPITest):
    def test_review_submit_and_requires_approval(self):
        self.client.post(reverse("reviews:review_list"),
                         {"product": self.product.id, "author_name": "سارا", "rating": 5,
                          "text": "عالی بود"}, format="json")
        resp = self.client.get(reverse("reviews:review_list"), {"product": self.product.id})
        self.assertEqual(len(resp.data), 0)  # تا تأیید ادمین نمایش داده نمی‌شود


class PersianIntegrityTests(BaseAPITest):
    def test_persian_roundtrip(self):
        resp = self.client.get(reverse("catalog:product_detail", args=[self.product.id]))
        self.assertEqual(resp.data["name"], "تیشرت کلاسیک")
        self.assertIn("تیشرت نخی", resp.data["description"])
        # ذخیره و بازیابی از DB
        self.assertEqual(Product.objects.get(id=self.product.id).name, "تیشرت کلاسیک")