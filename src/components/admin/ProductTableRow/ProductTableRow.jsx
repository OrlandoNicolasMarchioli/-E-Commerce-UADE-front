import OrderStatusBadge from '../../primitives/Badge/OrderStatusBadge';
import '../../ui.css';

const ProductTableRow = ({ product, onEdit, onDelete }) => (
  <tr>
    <td>
      <div className="ui-tr-thumb">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} />
          : <span style={{ fontSize: '1.2rem' }}>📦</span>}
      </div>
    </td>
    <td>{product.name}</td>
    <td>{product.category}</td>
    <td>${Number(product.price).toFixed(2)}</td>
    <td>{product.stock}</td>
    <td>
      <span className={`ui-badge ui-badge--${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
      </span>
    </td>
    <td>
      <div className="ui-tr-actions">
        <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={() => onEdit?.(product)}>Edit</button>
        <button className="ui-btn ui-btn--danger ui-btn--sm" onClick={() => onDelete?.(product)}>Delete</button>
      </div>
    </td>
  </tr>
);

export default ProductTableRow;
