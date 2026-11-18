import { MessageCircle, ShoppingBag, Tag, Heart } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: MessageCircle,
    title: 'سفارش در چند ثانیه',
    text: 'سبد را بسازید و سفارش را با یک پیام در واتساپ یا دایرکت اینستاگرام بفرستید.',
  },
  {
    icon: ShoppingBag,
    title: 'خرید بدون ثبت‌نام',
    text: 'برای دیدن محصولات و ساختن سبد لازم نیست حساب کاربری بسازید.',
  },
  {
    icon: Tag,
    title: 'قیمت روشن',
    text: 'قیمت هر محصول به تومان و با درصد تخفیف، همان‌جا روی کارت دیده می‌شود.',
  },
  {
    icon: Heart,
    title: 'سبد و علاقه‌مندی‌ها می‌مانند',
    text: 'اگر صفحه را ببندید یا تازه‌سازی کنید، محصولات انتخاب‌شده سر جایشان هستند.',
  },
];

export default function BrandSection() {
  return (
    <section className="section brand-section on-dark" aria-labelledby="brand-title">
      <div className="container brand-section__grid">
        <div className="brand-section__intro">
          <h2 id="brand-title">لمیز؛ لباس با طرح‌های خاص</h2>
          <p>
            لمیز از تیشرت و شلوار جین تا کت، کاپشن و ست‌های دونفره را کنار هم آورده است. هر محصول توضیح و قیمت روشن دارد و
            سفارش را همین‌جا ثبت می‌کنید.
          </p>
        </div>
        <dl className="advantages">
          {ADVANTAGES.map(({ icon: Icon, title, text }) => (
            <div className="advantage" key={title}>
              <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
              <dt>{title}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
