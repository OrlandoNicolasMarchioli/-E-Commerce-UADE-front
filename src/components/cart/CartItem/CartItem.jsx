import QuantityStepper from '../../primitives/QuantityStepper/QuantityStepper';
import '../../ui.css';

// Formats a numeric price using Argentine peso locale and currency symbol
const formatPrice = (p) =>
  p.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

/** Single cart line item with an editable quantity stepper and a subtotal; subtotal falls back to unitPrice × quantity. */
const CartItem = ({ item, onQtyChange, onRemove }) => {
  const { productId, productName, productCategory, quantity, unitPrice, subtotal, imageUrl } = item;

  return (
    <div className="ui-cart-item">
      <div className="ui-ci-img">
        {imageUrl ? <img src={imageUrl} alt={productName} /> : '📷'}
      </div>
      <div>
        <div className="ui-ci-cat">{productCategory}</div>
        <div className="ui-ci-name">{productName}</div>
        <div className="ui-ci-unit">{formatPrice(unitPrice)} each</div>
      </div>
      <div className="ui-ci-controls">
        <QuantityStepper
          value={quantity}
          onChange={(qty) => onQtyChange?.(productId, qty)}
          min={1}
        />
        <div className="ui-ci-subtotal">{formatPrice(subtotal ?? unitPrice * quantity)}</div>
        <button className="ui-ci-remove" onClick={() => onRemove?.(productId)}>🗑️ Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
