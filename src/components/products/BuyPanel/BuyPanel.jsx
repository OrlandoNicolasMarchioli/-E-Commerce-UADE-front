import { useState } from 'react';
import QuantityStepper from '../../primitives/QuantityStepper/QuantityStepper';
import '../../ui.css';

// Formats a numeric price using Argentine peso locale and currency symbol
const formatPrice = (price) =>
  price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

/** Purchase panel showing price, stock status, quantity selector (physical products only), and buy/cart actions. */
const BuyPanel = ({ product, onBuy, onAddToCart }) => {
  const [qty, setQty]          = useState(1);
  const { price, stock, type, seller } = product;
  // Services are never out of stock; only physical products check stock count
  const outOfStock             = type === 'PHYSICAL' && stock === 0;

  return (
    <div className="ui-buy-panel">
      <div className="ui-bp-price">{formatPrice(price)}</div>

      <div className={`ui-bp-stock${outOfStock ? ' ui-bp-stock--out' : ''}`}>
        {outOfStock ? '✗ Out of stock' : `✓ Available (${stock} u.)`}
      </div>

      {!outOfStock && type === 'PHYSICAL' && (
        <div className="ui-bp-qty-row">
          <span className="ui-bp-qty-label">Quantity:</span>
          <QuantityStepper value={qty} onChange={setQty} min={1} max={stock} />
        </div>
      )}

      <div className="ui-bp-actions">
        <button
          className="ui-btn ui-btn--primary ui-btn--md ui-btn--full"
          disabled={outOfStock}
          onClick={() => onBuy?.(qty)}
        >
          Buy now
        </button>
        <button
          className="ui-btn ui-btn--outline ui-btn--md ui-btn--full"
          disabled={outOfStock}
          onClick={() => onAddToCart?.(qty)}
        >
          Add to cart
        </button>
      </div>

      {seller && (
        <div className="ui-bp-seller">
          <div className="ui-bp-seller-label">Sold by</div>
          <div className="ui-bp-seller-name">{seller.firstName} {seller.lastName}</div>
        </div>
      )}
    </div>
  );
};

export default BuyPanel;
