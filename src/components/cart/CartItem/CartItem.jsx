import QuantityStepper from '../../primitives/QuantityStepper/QuantityStepper';
import '../../ui.css';

const formatPrice = (p) =>
  p.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

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
