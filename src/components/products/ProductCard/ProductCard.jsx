import '../../ui.css';

// Formats a numeric price using Argentine peso locale and currency symbol
const formatPrice = (price) =>
  price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

// Same labels as ProductInfo for the attendanceType values of the back
const ATTENDANCE = { VIRTUAL: 'Virtual', PRESENCIAL: 'Presencial' };

/** Clickable product summary card showing image, category, name, rating, price, and stock status. */
const ProductCard = ({ product, onClick }) => {
  const { name, price, type, stock, category, images = [], averageRating, reviewCount } = product;
  // Only physical products can be out of stock; services are always available
  const outOfStock = type === 'PHYSICAL' && stock === 0;
  const imgSrc     = images[0]?.url;

  const serviceText = () => {
    const { minutesDuration, attendanceType } = product;
    if (!minutesDuration) return 'Service';
    const mode = ATTENDANCE[attendanceType] ?? attendanceType;
    return mode ? `${minutesDuration} min · ${mode}` : `${minutesDuration} min`;
  };

  const stockText = () => {
    if (type === 'SERVICE') return serviceText();
    if (outOfStock) return 'Out of stock';
    return `✓ ${stock} in stock`;
  };

  return (
    <article
      className="ui-product-card"
      onClick={() => onClick?.(product.id)}
      tabIndex={0}
      role="button"
      aria-label={name}
    >
      <div className="ui-pc-img">
        {imgSrc ? <img src={imgSrc} alt={name} /> : '📷'}
        <span className={`ui-pc-type-badge ui-badge ui-badge--${type === 'SERVICE' ? 'service' : 'physical'}`}>
          {type === 'SERVICE' ? 'SERVICE' : 'PHYSICAL'}
        </span>
        {outOfStock && (
          <div className="ui-pc-out-overlay">
            <span className="ui-pc-out-label">Out of stock</span>
          </div>
        )}
      </div>
      <div className="ui-pc-body">
        <div className="ui-pc-cat">{category?.name ?? category}</div>
        <div className="ui-pc-name">{name}</div>
        {averageRating != null && (
          <div className="ui-pc-rating">
            {'⭐'.repeat(Math.round(averageRating))} {averageRating} ({reviewCount})
          </div>
        )}
        <div className="ui-pc-price">{formatPrice(price)}</div>
        <div className={`ui-pc-stock${outOfStock ? ' ui-pc-stock--out' : ' ui-pc-stock--ok'}`}>
          {stockText()}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
