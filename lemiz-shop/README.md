# لمیز (Shop Lemiz)

فروشگاه لباس با React + Vite. این نسخه نتیجه‌ی **مرحله‌ی سوم** است: هدر، ناوبری و صفحه‌ی اصلی.

## اجرا

```bash
npm install
npm run dev       # اجرای توسعه
npm run build     # ساخت نسخه‌ی نهایی در پوشه‌ی dist
npm run preview   # دیدن نسخه‌ی ساخته‌شده
```

نیاز به Node 18 یا بالاتر دارد. مسیرها با `HashRouter` کار می‌کنند، پس خروجی `dist` روی هر هاست استاتیک (مثل GitHub Pages) بدون تنظیم اضافه اجرا می‌شود.

## ساختار

```
legacy/        نسخه‌ی اولیه‌ی پروژه (HTML/CSS/JS)، دست‌نخورده
src/data/      products.js, categories.js, reviews.js, site.js
src/services/  productService (جستجو و انتخاب محصول), orderService (سفارش واتساپ/اینستاگرام)
src/context/   CartContext, WishlistContext, ToastContext
src/components/ Header, SearchPanel, CartDrawer, ProductCard, AddToCart, Footer ...
src/components/home/  بخش‌های صفحه‌ی اصلی
src/pages/     Home, ComingSoon (جایگزین موقت), NotFound
src/styles/    tokens.css (پالت و مقیاس تایپوگرافی) و استایل هر بخش
```

## داده‌ی نمایشی

نام، قیمت، توضیح و تصویر محصولات از نسخه‌ی اولیه آمده‌اند. فیلدهای `category`، `stock`، `oldPrice`، `isNew` و `bestseller` در `src/data/products.js` داده‌ی نمایشی‌اند (با کامنت `demo` مشخص شده‌اند). محصول شماره‌ی ۱۱ عمداً ناموجود است تا وضعیت «ناموجود» دیده شود. نظرهای مشتریان و نمادهای فوتر هم نمونه‌اند و در صفحه برچسب نمایشی دارند.

## نکته درباره‌ی تصاویر

تصاویر هنوز همان لینک‌های `gstatic.com` نسخه‌ی اولیه‌اند. این لینک‌ها موقت‌اند و ممکن است از کار بیفتند. اگر لینکی خراب شود، تصویر جایگزین نمایش داده می‌شود. برای نسخه‌ی نهایی پورتفولیو، عکس‌های مجاز را در `public/images` بگذارید و فقط فیلد `image` را در `products.js` عوض کنید.

## سبد قدیمی

اگر مرورگر شما سبد خرید نسخه‌ی اولیه را در LocalStorage دارد، در اولین اجرا به ساختار جدید منتقل می‌شود.
