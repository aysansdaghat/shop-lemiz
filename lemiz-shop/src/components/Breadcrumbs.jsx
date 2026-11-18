import { Link } from 'react-router-dom';

// مسیر صفحه: خانه / فروشگاه / محصول ...
export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="مسیر صفحه">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.to && !last ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}