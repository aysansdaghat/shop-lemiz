const SUPABASE_URL = "https://nziclpjevnninrxtgpkm.supabase.co";
const SUPABASE_KEY = "sb_publishable_S3bt6M2D5zgYz5Ic_1qxyQ__x1E7Kh8";
const db = (typeof supabase !== "undefined")
    ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;


const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentSlide = 0;

function showSlide(index) {
    slides.forEach(function(slide) {
        slide.classList.remove('active');
    });
    slides[index].classList.add('active');
}

if (prevButton && nextButton) {
    nextButton.addEventListener('click', function() {
        currentSlide = currentSlide + 1;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    });

    prevButton.addEventListener('click', function() {
        currentSlide = currentSlide - 1;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    });
}

const searchInput = document.querySelector('#search-input');
const productCards = document.querySelectorAll('.product-card');

function filterProducts() {
    const searchTerm = searchInput.value;

    productCards.forEach(function(card) {
        const productName = card.querySelector('.product-name').textContent;

        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
}

const searchButton = document.querySelector('#search-button');
if (searchButton) {
    searchButton.addEventListener('click', filterProducts);
}

const searchToggle = document.querySelector('#search-toggle');
if (searchToggle) {
    searchToggle.addEventListener('click', function() {
        searchInput.classList.toggle('open');
    });
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsList = document.querySelector('#cart-items');
const cartEmptyMessage = document.querySelector('#cart-empty-message');

addToCartButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const card = button.closest('.product-card, .slide, .product-detail');
        const productName = card.querySelector('.product-name').textContent;

        const existingItem = cart.find(function(item) {
            return item.name === productName;
        });

        if (existingItem) {
            existingItem.quantity = existingItem.quantity + 1;
        } else {
            cart.push({ name: productName, quantity: 1 });
        }

        updateCartDisplay();
        updateAllCardQuantities();
    });
});

function updateCartDisplay() {
    localStorage.setItem('cart', JSON.stringify(cart));

    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
    } else {
        cartEmptyMessage.style.display = 'none';
    }

    cart.forEach(function(item, index) {
        const li = document.createElement('li');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.addEventListener('click', function() {
            item.quantity = item.quantity - 1;
            if (item.quantity <= 0) {
                cart.splice(index, 1);
            }
            updateCartDisplay();
            updateAllCardQuantities();
        });

        const quantitySpan = document.createElement('span');
        quantitySpan.textContent = item.quantity;

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.addEventListener('click', function() {
            item.quantity = item.quantity + 1;
            updateCartDisplay();
            updateAllCardQuantities();
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'حذف';
        removeButton.addEventListener('click', function() {
            cart.splice(index, 1);
            updateCartDisplay();
            updateAllCardQuantities();
        });

        li.appendChild(nameSpan);
        li.appendChild(decreaseButton);
        li.appendChild(quantitySpan);
        li.appendChild(increaseButton);
        li.appendChild(removeButton);
        cartItemsList.appendChild(li);
    });
}

function updateAllCardQuantities() {
    const allCards = document.querySelectorAll('.product-card, .slide, .product-detail');

    allCards.forEach(function(card) {
        const nameElement = card.querySelector('.product-name');
        if (!nameElement) return;

        const productName = nameElement.textContent;
        const addButton = card.querySelector('.add-to-cart');
        const quantityControl = card.querySelector('.quantity-control');

        if (!addButton || !quantityControl) return;

        const item = cart.find(function(item) {
            return item.name === productName;
        });

        if (item) {
            addButton.style.display = 'none';
            quantityControl.style.display = 'flex';
            quantityControl.querySelector('.qty-display').textContent = item.quantity;
        } else {
            addButton.style.display = 'block';
            quantityControl.style.display = 'none';
        }
    });
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('increase-qty')) {
        const card = event.target.closest('.product-card, .slide, .product-detail');
        const productName = card.querySelector('.product-name').textContent;
        const item = cart.find(function(item) {
            return item.name === productName;
        });
        if (item) {
            item.quantity = item.quantity + 1;
            updateCartDisplay();
            updateAllCardQuantities();
        }
    }

    if (event.target.classList.contains('decrease-qty')) {
        const card = event.target.closest('.product-card, .slide, .product-detail');
        const productName = card.querySelector('.product-name').textContent;
        const item = cart.find(function(item) {
            return item.name === productName;
        });
        if (item) {
            item.quantity = item.quantity - 1;
            if (item.quantity <= 0) {
                cart = cart.filter(function(i) {
                    return i.name !== productName;
                });
            }
            updateCartDisplay();
            updateAllCardQuantities();
        }
    }
});

const cartToggle = document.querySelector('#cart-toggle');
const cartPanel = document.querySelector('.cart-panel');

if (cartToggle && cartPanel) {
    cartToggle.addEventListener('click', function() {
        cartPanel.classList.toggle('open');
    });
}

const cartClose = document.querySelector('#cart-close');
if (cartClose && cartPanel) {
    cartClose.addEventListener('click', function() {
        cartPanel.classList.remove('open');
    });
}

const ORDER_CONFIG = {
    method: "instagram",              
    whatsappNumber: "989123456789",
    instagramUsername: "shop_username" 
};

function buildOrderMessage() {
    const lines = cart.map(item => `- ${item.name} × ${item.quantity}`);
    return "سلام، می‌خوام این محصولات رو سفارش بدم:\n" + lines.join("\n");
}

async function sendOrder(button) {
    if (cart.length === 0) {
        alert("سبد خرید خالیه");
        return;
    }

    const text = buildOrderMessage();

    if (ORDER_CONFIG.method === "whatsapp") {
        const url = `https://wa.me/${ORDER_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
        return;
    }

    // دایرکت اینستاگرام: متن رو کپی می‌کنیم، چون لینک دایرکت متن آماده قبول نمی‌کنه
    try {
        await navigator.clipboard.writeText(text);
        const oldLabel = button.textContent;
        button.textContent = "✓ سفارش کپی شد، توی دایرکت بچسبونید";
        setTimeout(() => { button.textContent = oldLabel; }, 4000);
    } catch (error) {
        prompt("متن سفارش رو کپی کنید و توی دایرکت بفرستید:", text);
    }

    window.open(`https://ig.me/m/${ORDER_CONFIG.instagramUsername}`, "_blank");
}

document.addEventListener("click", function (e) {
    const button = e.target.closest(".whatsapp-order");
    if (button) {
        sendOrder(button);
    }
});


updateCartDisplay();
updateAllCardQuantities();

const products = {
    1: {
        name: "تیشرت کلاسیک",
        price: "1.250.000 تومان",
        description: "تیشرت نخی با کیفیت بالا، مناسب استفاده روزمره. دارای طرح ساده و رنگ‌های متنوع.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfwUFGve_WTpTUEBZ4anu1FA407HVwD5G-3pekRrFOBA&s=10"
    },
    2: {
        name: "شلوار جین",
        price: "890.000 تومان",
        description: "شلوار جین با کیفیت، برش راحت و مناسب همه فصول.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-DcAcJoS61fv5wqm0cPwsDlUJUM0O7EOjzAOxOr4lAQ&s=10"
    },
    3: {
        name: "کاپشن زمستانی",
        price: "1.680.000 تومان",
        description: "کاپشن گرم و ضدآب، مناسب فصل سرما. دارای کلاه جدا شدنی و آستر پشمی.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLmiNJzR4z6NjD720iVROqrTiwKj_XJd06kH2EQQ1INQ&s=10"
    },
    4: {
        name: "کراپ کت مجلسی",
        price: "1.450.000 تومان",
        description: "کت کراپ با دوخت شیک، مناسب مهمانی و مراسم رسمی. طراحی مینیمال و برش مدرن.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4NNiwuRCvmD0rd3ljLeLtWvI5K3-Ne6GliAx4-QxVRQ&s=10"
    },
    5: {
        name: "ست کاپلی جذاب",
        price: "2.100.000 تومان",
        description: "ست دو نفره با طرح هماهنگ، مناسب مناسبت‌های خاص. جنس نخی و راحت.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzaJ3WYf1FPPhD2e_8jmsqrQJyBMpmZshY3Ju-_83_-A&s=10"
    },
    6: {
        name: "شلوار جین اورجینال",
        price: "980.000 تومان",
        description: "شلوار جین اورجینال با جنس مقاوم و دوخت باکیفیت، مناسب استفاده روزمره.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9sRmmEr5Fgo6JCrV2UCGLEBlBYoSDiNVGTJywOPVMdg&s=10"
    },
    7: {
        name: "کت فوتر کوتاه",
        price: "1.150.000 تومان",
        description: "کت فوتر گرم و نرم، مناسب استفاده روزمره در هوای سرد. طراحی راحت و اسپرت.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0WdzThaOLuztaku3Fw4hG2IXbX5_sW_AIatwAH1jzrw&s=10"
    },
    8: {
        name: "هودی اسپرت",
        price: "780.000 تومان",
        description: "هودی نخی با کلاه، مناسب پوشیدن در فصل‌های خنک. طرح ساده و راحت.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4mKtht7Ye_s9DaXaMpj6LjNA6cFNC2Jc0KUCxeIgy8g&s=10"
    },
    9: {
        name: "ترنج کت کوتاه",
        price: "1.320.000 تومان",
        description: "کت کوتاه با برش مدرن، مناسب استایل روزمره و نیمه‌رسمی.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3WZBqq_-jwo7y9eQuGuB5BPU5xoSHgpKt5oeirqJYWw&s=10"
    },
    10: {
        name: "وست و شلوار ست",
        price: "1.890.000 تومان",
        description: "ست وست و شلوار با طراحی هماهنگ، مناسب مناسبت‌های رسمی.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0-QnmynbTZySlI15AGCNw4esYaK0xXr4knKWLE64bEw&s=10"
    },
    11: {
        name: "بارانی بلند",
        price: "1.560.000 تومان",
        description: "بارانی بلند ضدآب، مناسب روزهای بارانی. طراحی شیک و کاربردی.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBEInddpxYOwXDT0TTB2k-chJCkick7qc722ruzJ1zLw&s=10"
    },
    12: {
        name: "شلوار جاگر",
        price: "690.000 تومان",
        description: "شلوار جاگر راحت با کش مچ‌پا، مناسب ورزش و استفاده روزمره.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcK9-QkDo7PQd8BAP2wXskIxsBJFOA4L5XohOrL9E_gQ&s=10"
    },
    13: {
        name: "کت فوتر بلند",
        price: "1.420.000 تومان",
        description: "کت فوتر بلند و گرم، مناسب پاییز و زمستان. جنس نرم و باکیفیت.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEKxu-vUlSZaBpgMXY40PiQ0c0zoDqRO2wBvy28MtH-A&s=10"
    },
    14: {
        name: "کلاه باکت پشمی",
        price: "320.000 تومان",
        description: "کلاه باکت گرم با جنس پشمی، مکمل مناسب برای استایل زمستانی.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuBjdKq4TV0G4RV_wOx9vrrg4sAvinnvildnYICbvmwQ&s=10"
    },
    15: {
        name: "کت جین زنانه",
        price: "1.190.000 تومان",
        description: "کت جین زنانه با برش کلاسیک، مناسب ست کردن با انواع لباس.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCVWW4pmTcgthVYui5gEsatCwYhxXn44OzIzbjdX04zg&s=10"
    }
};

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

function formatPrice(price) {
    return Number(price).toLocaleString("de-DE") + " تومان";
}

function showProductDetail(product) {
    document.querySelector('#detail-image').src = product.image;
    document.querySelector('#detail-name').textContent = product.name;
    document.querySelector('#detail-price').textContent = "قیمت: " + product.price;
    document.querySelector('#detail-description').textContent = product.description;
}

async function loadProductDetail() {
    if (!productId || !document.querySelector('#detail-name')) return;

    if (db) {
        const { data, error } = await db
            .from("products")
            .select("*")
            .eq("id", productId)
            .single();

        if (data && !error) {
            showProductDetail({
                name: data.name,
                price: formatPrice(data.price),
                description: data.description,
                image: data.image_url
            });
            return;
        }
    }

    // اگه Supabase جواب نداد، از آبجکت قدیمی استفاده می‌کنیم
    if (products[productId]) {
        showProductDetail(products[productId]);
    }
}

loadProductDetail();

function getPriceByName(productName) {
    for (const id in products) {
        if (products[id].name === productName) {
            return products[id].price;
        }
    }
    return null;
}

function getIdFromLink(link) {
    return Number(new URL(link.href, window.location.href).searchParams.get('id'));
}

async function updateSlidesFromSupabase() {
    if (!db) return;

    const slideLinks = document.querySelectorAll('.slide .product-link');
    if (slideLinks.length === 0) return;

    const ids = [];
    slideLinks.forEach(function(link) {
        const id = getIdFromLink(link);
        if (id) ids.push(id);
    });

    const { data, error } = await db
        .from("products")
        .select("id, name, image_url")
        .in("id", ids);

    if (error || !data) return;

    slideLinks.forEach(function(link) {
        const product = data.find(function(p) {
            return p.id === getIdFromLink(link);
        });
        if (!product) return;

        link.querySelector('img').src = product.image_url;
        link.querySelector('.product-name').textContent = product.name;
    });

    updateAllCardQuantities();
}

updateSlidesFromSupabase();






/* =========================================================
   افزونه‌های ظاهری (فقط اضافه شده؛ منطق بالا دست‌نخورده است)
   ========================================================= */

// ۱) نمایش قیمت زیر نام محصول در کارت‌ها و اسلایدر (از آبجکت products)
function parsePrice(priceText) {
    const digits = String(priceText).replace(/[^\d]/g, '');
    return digits ? Number(digits) : 0;
}

document.querySelectorAll('.product-card .product-link, .slide .product-link').forEach(function(link) {
    const nameElement = link.querySelector('.product-name');
    if (!nameElement) return;
    const price = getPriceByName(nameElement.textContent);
    if (!price) return;
    const priceElement = document.createElement('p');
    priceElement.className = 'product-price';
    priceElement.textContent = price;
    link.appendChild(priceElement);
});

// ۲) تعداد کالا روی دکمه سبد خرید + جمع کل داخل پنل
const cartToggleButton = document.querySelector('#cart-toggle');
let cartCountBadge = null;
if (cartToggleButton) {
    cartCountBadge = document.createElement('span');
    cartCountBadge.className = 'cart-count';
    cartCountBadge.hidden = true;
    cartToggleButton.appendChild(cartCountBadge);
}

let cartTotalBox = null;
const orderButton = document.querySelector('.cart-panel .whatsapp-order');
if (orderButton) {
    cartTotalBox = document.createElement('div');
    cartTotalBox.className = 'cart-total';
    cartTotalBox.hidden = true;
    cartTotalBox.innerHTML = '<span>جمع کل</span><strong></strong>';
    orderButton.parentNode.insertBefore(cartTotalBox, orderButton);
}

function refreshCartExtras() {
    if (cartCountBadge) {
        const count = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
        cartCountBadge.textContent = count;
        cartCountBadge.hidden = count === 0;
    }
    if (cartTotalBox) {
        const total = cart.reduce(function(sum, item) {
            return sum + parsePrice(getPriceByName(item.name)) * item.quantity;
        }, 0);
        cartTotalBox.hidden = cart.length === 0 || total === 0;
        cartTotalBox.querySelector('strong').textContent = formatPrice(total);
    }
}

const originalUpdateCartDisplay = updateCartDisplay;
updateCartDisplay = function() {
    originalUpdateCartDisplay();
    refreshCartExtras();
};
refreshCartExtras();

// ۳) بازخورد افزودن به سبد در صفحه جزئیات محصول
const detailAddButton = document.querySelector('.product-detail .add-to-cart');
if (detailAddButton) {
    detailAddButton.addEventListener('click', function() {
        const oldLabel = 'افزودن به سبد';
        detailAddButton.textContent = '✓ به سبد اضافه شد';
        setTimeout(function() { detailAddButton.textContent = oldLabel; }, 1500);
    });
}

// ۴) بستن پنل سبد و جستجو با کلید Escape
document.addEventListener('keydown', function(event) {
    if (event.key !== 'Escape') return;
    if (cartPanel) cartPanel.classList.remove('open');
    if (searchInput) searchInput.classList.remove('open');
});
