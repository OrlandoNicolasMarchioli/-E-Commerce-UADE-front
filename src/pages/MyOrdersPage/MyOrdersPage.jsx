import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../components/orders/OrderCard/OrderCard';
import EmptyState from '../../components/cart/EmptyState/EmptyState';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../context/AuthContext';
import { getOrders } from '../../services/orderService';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const load = useCallback(() => getOrders(user.id), [user.id]);
  const { data, error, loading, reload } = useAsync(load);

  return (
    <div className="p2-wrap">
      <h1>Mis compras</h1>
      <p className="p2-demo-note">Pedidos de demostración leídos inicialmente de /public/data/orders.json.</p>
      {loading && <p role="status">Cargando pedidos…</p>}
      {error && <p role="alert">{error.message} <button onClick={reload}>Reintentar</button></p>}
      {!loading && !error && !data?.length && (
        <EmptyState title="Todavía no tenés compras" description="Tus compras van a aparecer acá"
          action={{ label: 'Ir al catálogo', onClick: () => navigate('/') }} />
      )}
      <div className="p2-order-list">
        {!loading && !error && data?.map((order) =>
          <OrderCard key={order.id} order={order} onClick={(id) => navigate(`/my-orders/${id}`)} />)}
      </div>
    </div>
  );
};

export default MyOrdersPage;