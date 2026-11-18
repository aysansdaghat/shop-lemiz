# Backend فروشگاه لمیز (Lemiz Shop API)

بک‌اند فروشگاه لباس لمیز با **Django + Django REST Framework** طراحی و پیاده‌سازی شده است. این سند راهنمای نصب، اجرا، ساخت ادمین، اتصال فرانت و مرجع API است.

---

## ۱. معماری و تکنولوژی

| لایه | انتخاب |
|------|--------|
| زبان | Python 3.13 |
| فریم‌ورک | Django 5.0.14 |
| API | Django REST Framework |
| احراز هویت | JWT (SimpleJWT) |
| پایگاه داده | SQLite (توسعه/تست) · SQL Server (تولید) |
| مستندات | drf-spectacular (OpenAPI/Swagger) |
| فیلتر | django-filter |

**واحد پول:** تومان، کد ارز ثابت `IRT`. قیمتها با `Decimal(…, decimal_places=0)` ذخیره می‌شوند و محاسبات مالی بدون خطای گردکردن انجام می‌شوند.

---

## ۲. ساختار پوشه‌ها

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── config/            # تنظیمات (base/dev/prod), urls, wsgi/asgi
├── apps/
│   ├── common/        # مدل‌های پایه، صفحه‌بندی، هندلر خطای فارسی
│   ├── accounts/      # User, UserProfile, Address
│   ├── catalog/       # Category, Product, ProductImage, ProductVariant
│   ├── cart/          # Cart, CartItem
│   ├── orders/        # Order, OrderItem, Payment
│   ├── discounts/     # Discount
│   ├── reviews/       # Review
│   ├── favorites/     # Favorite
│   └── contact/       # ContactMessage, Newsletter
├── tests/             # تست‌های یکپارچه API
└── scripts/           # seed داده نمونه
```

هر اپ: `models, serializers, views, urls, admin, services` (منطق)، مطابق اصول Separation of Concerns.

---

## ۳. نصب و اجرا (ویندوز / PowerShell)

```powershell
# ۱) ورود به پوشه
cd backend

# ۲) ساخت محیط مجازی
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# ۳) نصب وابستگی‌ها
pip install -r requirements.txt

# ۴) تنظیم متغیرهای محیطی
copy .env.example .env
# سپس مقادیر .env را (مخصوصاً DJANGO_SECRET_KEY و DB) تنظیم کنید

# ۵) ساخت و اعمال مهاجرت‌ها
python manage.py makemigrations accounts catalog cart orders discounts reviews favorites contact
python manage.py migrate

# ۶) ساخت کاربر ادمین
python manage.py createsuperuser

# ۷) (اختیاری) داده نمونه
python manage.py shell -c "exec(open('scripts/seed_demo.py', encoding='utf-8').read())"

# ۸) اجرای سرور
python manage.py runserver
```

- Swagger:  http://127.0.0.1:8000/api/docs/
- پنل مدیریت:  http://127.0.0.1:8000/admin/

> **توجه:** `mssql-django` مستلزم `Django<5.1` است؛ به همین دلیل Django روی 5.0.14 قفل شده است.

---

## ۴. اتصال به SQL Server

در `.env`:

```
DB_ENGINE=mssql
DB_HOST=localhost
DB_PORT=1433
DB_NAME=lemiz_shop
DB_USER=sa
DB_PASSWORD=your-strong-password
DB_DRIVER=ODBC Driver 17 for SQL Server
```

پیش‌نیاز: نصب **ODBC Driver 17/18 for SQL Server** روی ویندوز. برای تست/توسعه، `DB_ENGINE=sqlite` کافی است و رفتار کد مستقل از نوع دیتابیس است.

---

## ۵. اتصال Frontend به Backend

فرانت (React) از طریق `VITE_API_BASE` به بک‌اند وصل می‌شود:

1. در `lemiz-shop/.env`:
   ```
   VITE_API_BASE=http://127.0.0.1:8000/api
   ```
2. اجرای هم‌زمان هر دو:
   - بک‌اند: `python manage.py runserver` (پورت 8000)
   - فرانت: `npm run dev` (پورت 5173)

**نکات اتصال:**
- `src/services/apiClient.js` مسئول fetch و توکن JWT است.
- `src/services/productService.js` ابتدا از API می‌خواند و در صورت قطع سرور به داده‌ی نمایشی (`src/data/`) برمی‌گردد.
- فرم‌های تماس/خبرنامه/پرداخت به ترتیب به `/api/contact/`، `/api/newsletter/`، `/api/orders/` متصل‌اند (با fallback).
- CORS برای مبدأ `http://localhost:5173` تنظیم شده است.

---

## ۶. مرجع API

پیشوندهای `/api/`. احراز هویت با هدر `Authorization: Bearer <access>`.

### محصولات و دسته‌ها
| متد | Endpoint | توضیح |
|-----|----------|-------|
| GET | `/products/` | لیست (فیلتر: `category`=slug، `q`، `sort`∈`featured,newest,cheap,expensive,discount`، `page`) |
| GET | `/products/{id}/` | جزئیات + گالری |
| GET | `/products/bestsellers/` · `/products/new/` · `/products/discounted/` | لیست‌های ویژه |
| GET | `/categories/` | دسته‌ها |

**ساختار محصول (سازگار با فرانت):**
```json
{ "id":1, "name":"تیشرت کلاسیک", "price":1250000, "oldPrice":null,
  "description":"...", "image":"https://.../1.jpg",
  "category":"tops", "categoryLabel":"تیشرت و هودی",
  "stock":24, "isNew":false, "bestseller":true }
```

### حساب کاربری
| متد | Endpoint | توضیح |
|-----|----------|-------|
| POST | `/accounts/register/` | ثبت‌نام |
| POST | `/accounts/login/` | ورود (username/password) → `{access, refresh}` |
| POST | `/accounts/token/refresh/` | تازه‌سازی توکن |
| GET/PUT | `/accounts/profile/` | پروفایل (نیازمند احراز) |
| GET/POST | `/accounts/addresses/` | فهرست/افزودن آدرس |
| GET/PUT/DELETE | `/accounts/addresses/{id}/` | جزئیات/ویرایش/حذف آدرس |

### سبد خرید
| متد | Endpoint | توضیح |
|-----|----------|-------|
| GET | `/cart/` | مشاهده سبد (کاربر یا مهمان با هدر `X-Guest-Token`) |
| POST | `/cart/items/` | افزودن `{product, qty}` |
| PATCH/DELETE | `/cart/items/{id}/` | تغییر تعداد `{qty}` یا حذف |

### سفارش و پرداخت
| متد | Endpoint | توضیح |
|-----|----------|-------|
| POST | `/orders/` | ثبت سفارش (قیمت از سرور؛ کنترل موجودی؛ کاهش موجودی) |
| GET | `/orders/` | تاریخچه (نیازمند احراز) |
| GET | `/orders/{id}/` | جزئیات |

**ورودی سفارش:**
```json
{ "items":[{"product":1,"qty":2}],
  "receiver_name":"علی", "receiver_phone":"09121112233",
  "address":"تهران، ولیعصر", "postal_code":"", "note":"", "discount_code":"WELCOME10" }
```
**خروجی:** `{ order_number, status, subtotal, discount_total, shipping, grand_total, currency, items[] }`

### تخفیف
| POST | `/discounts/validate/` | اعتبارسنجی `{code, subtotal}` → `{valid, discountAmount, finalTotal}` |

### نظرات، علاقه‌مندی، فرم‌ها
| متد | Endpoint | توضیح |
|-----|----------|-------|
| GET | `/reviews/?product={id}` | دیدگاه‌های تأییدشده |
| POST | `/reviews/` | ثبت دیدگاه (نیازمند تأیید ادمین) |
| GET/POST | `/favorites/` | علاقه‌مندی‌ها (نیازمند احراز) |
| DELETE | `/favorites/{id}/` | حذف علاقه‌مندی |
| POST | `/contact/` | فرم تماس `{name,email,message}` |
| POST | `/newsletter/` | عضویت `{email}` |

---

## ۷. پنل مدیریت

- آدرس: `/admin/`
- superuser: با `createsuperuser` بسازید (یا `scripts/seed_demo.py` کاربر `admin/admin12345`).
- امکانات: مدیریت محصولات/تصاویر/انواع، دسته‌ها، کاربران، سفارش‌ها (تغییر وضعیت گروهی)، پرداخت‌ها، تخفیف‌ها، نظرات (تأیید/رد)، پیام‌ها، خبرنامه.

---

## ۸. تست

```powershell
python manage.py test tests -v 2
```

۲۹ تست در این دسته‌ها: accounts، catalog، cart، orders (شامل کنترل موجودی و نادیده‌گرفتن قیمت کاربر)، discounts، favorites، contact/newsletter، reviews، و سلامت فارسی.

---

## ۹. امنیت

- JWT با access/refresh و چرخش توکن
- اعتبارسنجی ورودی در Serializerها
- ORM پارامتریک (ضد SQL Injection)
- CORS محدود به دامنه‌های مجاز
- `SECRET_KEY` و اطلاعات DB از `.env`
- جلوگیری از تغییر قیمت توسط کاربر (محاسبه سمت سرور)
- کنترل موجودی داخل تراکنش با `select_for_update`
- پیام‌های خطای فارسی بدون افشای اطلاعات حساس
- تنظیمات سخت‌گیرانه prod (`config/settings/prod.py`)

---

## ۱۰. ساختار تحویل

- [x] سورس کامل Backend
- [x] ساختار ماژولار استاندارد
- [x] `requirements.txt`
- [x] `.env.example`
- [x] مدل‌ها و Migrationها
- [x] APIهای کامل + Swagger (`/api/docs/`)
- [x] پنل مدیریت Django
- [x] تست‌های اجرایی (۲۹ تست)
- [x] راهنمای نصب/اجرا/superuser/اتصال فرانت (همین سند)