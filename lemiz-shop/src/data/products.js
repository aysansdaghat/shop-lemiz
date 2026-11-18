// داده‌ی محصولات.
// نام، قیمت، توضیح و تصویر از نسخه‌ی اولیه‌ی پروژه آمده‌اند و تغییری نکرده‌اند.
// فیلدهای category، stock، oldPrice، isNew و bestseller داده‌ی نمایشی (دمو) هستند و برای نمایش امکانات فروشگاه اضافه شده‌اند.
// قیمت‌ها عدد (تومان) هستند؛ نمایش با formatPrice انجام می‌شود.

export const products = [
  {
    id: 1,
    name: "تیشرت کلاسیک",
    price: 1250000,
    description: "تیشرت نخی با کیفیت بالا، مناسب استفاده روزمره. دارای طرح ساده و رنگ‌های متنوع.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfwUFGve_WTpTUEBZ4anu1FA407HVwD5G-3pekRrFOBA&s=10",
    category: 'tops', // demo
    stock: 24, // demo
    bestseller: true, // demo
  },
  {
    id: 2,
    name: "شلوار جین",
    price: 890000,
    description: "شلوار جین با کیفیت، برش راحت و مناسب همه فصول.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-DcAcJoS61fv5wqm0cPwsDlUJUM0O7EOjzAOxOr4lAQ&s=10",
    category: 'pants', // demo
    stock: 18, // demo
    bestseller: true, // demo
  },
  {
    id: 3,
    name: "کاپشن زمستانی",
    price: 1680000,
    description: "کاپشن گرم و ضدآب، مناسب فصل سرما. دارای کلاه جدا شدنی و آستر پشمی.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLmiNJzR4z6NjD720iVROqrTiwKj_XJd06kH2EQQ1INQ&s=10",
    category: 'outerwear', // demo
    stock: 9, // demo
    bestseller: true, // demo
  },
  {
    id: 4,
    name: "کراپ کت مجلسی",
    price: 1450000,
    oldPrice: 1750000, // demo
    description: "کت کراپ با دوخت شیک، مناسب مهمانی و مراسم رسمی. طراحی مینیمال و برش مدرن.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4NNiwuRCvmD0rd3ljLeLtWvI5K3-Ne6GliAx4-QxVRQ&s=10",
    category: 'outerwear', // demo
    stock: 6, // demo
  },
  {
    id: 5,
    name: "ست کاپلی جذاب",
    price: 2100000,
    oldPrice: 2400000, // demo
    description: "ست دو نفره با طرح هماهنگ، مناسب مناسبت‌های خاص. جنس نخی و راحت.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzaJ3WYf1FPPhD2e_8jmsqrQJyBMpmZshY3Ju-_83_-A&s=10",
    category: 'sets', // demo
    stock: 5, // demo
  },
  {
    id: 6,
    name: "شلوار جین اورجینال",
    price: 980000,
    oldPrice: 1150000, // demo
    description: "شلوار جین اورجینال با جنس مقاوم و دوخت باکیفیت، مناسب استفاده روزمره.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9sRmmEr5Fgo6JCrV2UCGLEBlBYoSDiNVGTJywOPVMdg&s=10",
    category: 'pants', // demo
    stock: 12, // demo
  },
  {
    id: 7,
    name: "کت فوتر کوتاه",
    price: 1150000,
    description: "کت فوتر گرم و نرم، مناسب استفاده روزمره در هوای سرد. طراحی راحت و اسپرت.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0WdzThaOLuztaku3Fw4hG2IXbX5_sW_AIatwAH1jzrw&s=10",
    category: 'outerwear', // demo
    stock: 14, // demo
    isNew: true, // demo
  },
  {
    id: 8,
    name: "هودی اسپرت",
    price: 780000,
    description: "هودی نخی با کلاه، مناسب پوشیدن در فصل‌های خنک. طرح ساده و راحت.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4mKtht7Ye_s9DaXaMpj6LjNA6cFNC2Jc0KUCxeIgy8g&s=10",
    category: 'tops', // demo
    stock: 30, // demo
    isNew: true, // demo
  },
  {
    id: 9,
    name: "ترنج کت کوتاه",
    price: 1320000,
    description: "کت کوتاه با برش مدرن، مناسب استایل روزمره و نیمه‌رسمی.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3WZBqq_-jwo7y9eQuGuB5BPU5xoSHgpKt5oeirqJYWw&s=10",
    category: 'outerwear', // demo
    stock: 7, // demo
    isNew: true, // demo
  },
  {
    id: 10,
    name: "وست و شلوار ست",
    price: 1890000,
    oldPrice: 2150000, // demo
    description: "ست وست و شلوار با طراحی هماهنگ، مناسب مناسبت‌های رسمی.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0-QnmynbTZySlI15AGCNw4esYaK0xXr4knKWLE64bEw&s=10",
    category: 'sets', // demo
    stock: 4, // demo
  },
  {
    id: 11,
    name: "بارانی بلند",
    price: 1560000,
    description: "بارانی بلند ضدآب، مناسب روزهای بارانی. طراحی شیک و کاربردی.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBEInddpxYOwXDT0TTB2k-chJCkick7qc722ruzJ1zLw&s=10",
    category: 'outerwear', // demo
    stock: 0, // demo
  },
  {
    id: 12,
    name: "شلوار جاگر",
    price: 690000,
    description: "شلوار جاگر راحت با کش مچ‌پا، مناسب ورزش و استفاده روزمره.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcK9-QkDo7PQd8BAP2wXskIxsBJFOA4L5XohOrL9E_gQ&s=10",
    category: 'pants', // demo
    stock: 40, // demo
    isNew: true, // demo
  },
  {
    id: 13,
    name: "کت فوتر بلند",
    price: 1420000,
    description: "کت فوتر بلند و گرم، مناسب پاییز و زمستان. جنس نرم و باکیفیت.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEKxu-vUlSZaBpgMXY40PiQ0c0zoDqRO2wBvy28MtH-A&s=10",
    category: 'outerwear', // demo
    stock: 11, // demo
    bestseller: true, // demo
  },
  {
    id: 14,
    name: "کلاه باکت پشمی",
    price: 320000,
    oldPrice: 400000, // demo
    description: "کلاه باکت گرم با جنس پشمی، مکمل مناسب برای استایل زمستانی.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuBjdKq4TV0G4RV_wOx9vrrg4sAvinnvildnYICbvmwQ&s=10",
    category: 'accessories', // demo
    stock: 25, // demo
    isNew: true, // demo
  },
  {
    id: 15,
    name: "کت جین زنانه",
    price: 1190000,
    description: "کت جین زنانه با برش کلاسیک، مناسب ست کردن با انواع لباس.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCVWW4pmTcgthVYui5gEsatCwYhxXn44OzIzbjdX04zg&s=10",
    category: 'outerwear', // demo
    stock: 8, // demo
  },
];
