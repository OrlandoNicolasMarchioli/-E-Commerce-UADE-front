import '../../ui.css';

const formatPrice = (price) =>
  price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

const ProductCard = ({ product, onClick }) => {
  const { name, price, type, stock, category, images = [], averageRating, reviewCount } = product;
  const outOfStock = type === 'PHYSICAL' && stock === 0;
  const imgSrc     = images[0]?.url;

  const stockText = () => {
    if (type === 'SERVICE') return product.minutesDuration ? `${product.minutesDuration} min · Virtual` : 'Service';
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
