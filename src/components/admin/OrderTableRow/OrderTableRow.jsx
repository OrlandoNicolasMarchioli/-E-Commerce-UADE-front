import OrderStatusBadge from '../../primitives/Badge/OrderStatusBadge';
import '../../ui.css';

const OrderTableRow = ({ order, onView, onUpdateStatus }) => (
  <tr>
    <td>#{order.id}</td>
    <td>{order.customer}</td>
    <td>{order.date}</td>
    <td>{order.items} item{order.items !== 1 ? 's' : ''}</td>
    <td>${Number(order.total).toFixed(2)}</td>
    <td><OrderStatusBadge status={order.status} /></td>
    <td>
      <div className="ui-tr-actions">
        <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={() => onView?.(order)}>View</button>
        {onUpdateStatus && (
          <button className="ui-btn ui-btn--outline ui-btn--sm" onClick={() => onUpdateStatus?.(order)}>Update</button>
        )}
      </div>
    </td>
  </tr>
);

export default OrderTableRow;
