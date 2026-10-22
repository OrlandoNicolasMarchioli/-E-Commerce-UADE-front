import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { getOrderById } from '../../services/orderService';
import OrderTimeline from '../../components/orders/OrderTimeline/OrderTimeline';
import OrderNumberPill from '../../components/orders/OrderNumberPill/OrderNumberPill';
import OrderStatusBadge from '../../components/primitives/Badge/OrderStatusBadge';

const money = (value) => Number(value).toLocaleString('es-AR', {
  style: 'currency', currency: 'ARS',
});

const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const load = useCallback(() => getOrderById(user.id, id), [user.id, id]);
  const { data: order, loading, error, reload } = useAsync(load);

  return (
    <div className="p2-wrap">
      <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={() => navigate('/my-orders')}>
        ← Mis compras
      </button>
      {loading && <p role="status">Cargando pedido…</p>}
      {error && <p role="alert">{error.status === 404 ? 'Pedido no encontrado' : error.message}
        <button onClick={reload}>Reintentar</button>
      </p>}
      {order && !loading && !error && (
        <>
          <h1>Detalle de compra <OrderNumberPill orderId={order.id} /></h1>
          <p>Fecha: {new Date(order.orderDate).toLocaleString('es-AR')}</p>
          <OrderStatusBadge status={order.status} />
          <OrderTimeline status={order.status} />
          <h2>Productos</h2>
          <ul className="p2-order-items">
            {order.items.map((item) => <li key={item.productId}>
              {item.productName} — {item.quantity} × {money(item.unitPrice)} = {money(item.subtotal)}
            </li>)}
          </ul>
          <h2>Total: {money(order.total)}</h2>
          {/* El PUT /orders/{id}/status exige ADMIN: no habilitar cancelación simulada. */}
          {['PENDING', 'PAID'].includes(order.status) &&
            <p>La cancelación todavía no está disponible para usuarios comunes.</p>}
        </>
      )}
    </div>
  );
};

export default OrderDetailPage;