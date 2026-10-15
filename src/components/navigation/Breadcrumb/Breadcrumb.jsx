import '../../ui.css';

/** Renders a breadcrumb trail; items without href are treated as the current (non-linked) page. */
const Breadcrumb = ({ items = [] }) => (
  <nav className="ui-bc" aria-label="Breadcrumb">
    {items.map((item, i) => (
      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {i > 0 && <span className="ui-bc-sep" aria-hidden="true">›</span>}
        {item.href ? (
          <a href={item.href}>{item.label}</a>
        ) : (
          <span aria-current="page">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
