import { Link } from 'react-router-dom';
import { Heart, MessageCircle, ShieldCheck, ShoppingBag, Tag } from 'lucide-react';
import { SITE } from '../data/site';
import { usePageTitle } from '../hooks/usePageTitle';
import Breadcrumbs from '../components/Breadcrumbs';

const VALUES = [
  {
    icon: Tag,
    title: 'قیمت روشن',
    text: 'قیمت هر محصول به تومان و با درصد تخفیف، همان‌جا روی کارت دیده می‌شود.',
  },
  {
    icon: ShoppingBag,
    title: 'خرید بدون ثبت‌نام',
    text: 'برای دیدن محصولات و ساختن سبد لازم نیست حساب کاربری بسازید.',
  },
  {
    icon: MessageCircle,
    title: 'سفارش در چند ثانیه',
    text: 'سبد را بسازید و سفارش را با یک پیام در واتساپ یا دایرکت اینستاگرام بفرستید.',
  },
  {
    icon: Heart,
    title: 'سبد و علاقه‌مندی‌ها می‌مانند',
    text: 'اگر صفحه را ببندید یا تازه‌سازی کنید، انتخاب‌های شما سر جایشان هستند.',
  },
];

export default function About() {
  usePageTitle(
    'درباره ما',
    'داستان لمیز؛ فروشگاه لباس با طرح‌های خاص و خرید ساده و بی‌دردسر.',
  );

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'خانه', to: '/' }, { label: 'درباره ما' }]} />

        <header className="about-hero">
          <h1>لمیز؛ لباس با طرح‌های خاص</h1>
          <p className="about-hero__lead">
            لمیز مجموعه‌ای از طرح‌های خاص است؛ از تیشرت و شلوار جین تا کت، کاپشن و ست‌های دونفره. اینجا هر محصول توضیح
            و قیمت روشن دارد و سفارش را بدون پیچیدگی ثبت می‌کنید.
          </p>
        </header>

        <section className="prose" aria-label="داستان لمیز">
          <p>
            ایده‌ی لمیز ساده بود: جایی که بشود طرح‌های درست را با قیمت روشن پیدا کرد و بی‌آنکه وارد مراحل طولانی شد،
            سفارش داد. به همین دلیل خرید در لمیز بدون ثبت‌نام انجام می‌شود و سبد خرید و علاقه‌مندی‌ها روی همان
            مرورگر شما می‌مانند.
          </p>
          <p>
            تمرکز ما روی چند دسته‌ی مشخص است تا انتخاب راحت باشد: کت و کاپشن برای روزهای سرد، شلوار برای استایل
            روزمره، تیشرت و هودی، ست‌های هماهنگ و اکسسوری. اگر محصولی را دوست داشتید، کافی است علامت قلب را بزنید
            تا بعداً راحت‌تر پیدایش کنید.
          </p>
        </section>

        <section className="section section--tight" aria-labelledby="about-values-title">
          <div className="section-head">
            <h2 id="about-values-title">چرا لمیز؟</h2>
          </div>
          <dl className="advantages">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div className="advantage" key={title}>
                <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
                <dt>{title}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="about-cta">
          <p className="about-cta__text">
            <ShieldCheck size={22} aria-hidden="true" />
            برای هماهنگی می‌توانید با شماره {SITE.phone} تماس بگیرید.
          </p>
          <Link to="/shop" className="btn btn-primary">
            دیدن محصولات
          </Link>
        </section>
      </div>
    </div>
  );
}