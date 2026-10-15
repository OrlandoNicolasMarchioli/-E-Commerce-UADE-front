import OrderStatusBadge from '../../primitives/Badge/OrderStatusBadge';
import '../../ui.css';

// Formats a numeric price using Argentine peso locale and currency symbol
const formatPrice = (p) =>
  p.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

const formatDate = (d) =>
  new Date(d).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

/** Summary card for an order showing its ID, date, status badge, item thumbnails (up to 5), and total. */
const OrderCard = ({ order, onClick }) => {
  const { id, status, orderDate, items = [], total } = order;

  return (
    <article className="ui-order-card">
      <div className="ui-oc-head">
        <div>
          <div className="ui-oc-id">Order #{id}</div>
          <div className="ui-oc-date">{formatDate(orderDate)}</div>
        </div>
        <OrderStatusBadge status={status} />
      </div>
      <div className="ui-oc-items">
        {/* Show at most 5 thumbnails to keep the card compact */}
        {items.slice(0, 5).map((item, i) => (
          <div key={i} className="ui-oc-thumb">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} /> : '📷'}
          </div>
        ))}
      </div>
      <div className="ui-oc-foot">
        <div className="ui-oc-total">{formatPrice(total)}</div>
        <button className="ui-btn ui-btn--outline ui-btn--sm" onClick={() => onClick?.(id)}>
          View details →
        </button>
      </div>
    </article>
  );
};

export default OrderCard;
