import { useEffect, useMemo, useState } from 'react';

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8080'
).replace(/\/$/, '');

const ORDERS_URL = `${API_URL}/api/orders`;

const normalize = (value) =>
  String(value ?? '').trim().toLocaleLowerCase('es');

const getOrderId = (order) =>
  order.id ?? order.orderId ?? order.number ?? '—';

const getOrderDate = (order) =>
  order.createdAt ?? order.orderDate ?? order.date ?? null;

const getOrderStatus = (order) =>
  String(order.status ?? order.state ?? 'UNKNOWN').toUpperCase();

const getCustomerName = (order) => {
  const customer = order.user ?? order.customer ?? {};

  if (typeof customer === 'string') return customer;

  const fullName = [
    customer.firstName ?? customer.name,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    fullName ||
    customer.email ||
    order.customerName ||
    order.customerEmail ||
    'No informado'
  );
};

const formatDate = (date) => {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '—';

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed);
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return '—';
  }

  const value = Number(amount);

  if (!Number.isFinite(value)) return '—';

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
};

const getTotal = (order) =>
  order.totalAmount ?? order.total ?? order.amount ?? null;

const getStatusLabel = (status) => {
  const labels = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    PROCESSING: 'En preparación',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    CANCELED: 'Cancelado',
    PAID: 'Pagado',
    FAILED: 'Fallido',
    UNKNOWN: 'Sin estado',
  };

  return labels[status] ?? status;
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(ORDERS_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error(
              'No tenés permiso para consultar los pedidos.'
            );
          }

          if (response.status === 404) {
            throw new Error(
              'El endpoint de pedidos no existe en el backend.'
            );
          }

          throw new Error('No se pudieron cargar los pedidos.');
        }

        const data = await response.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
            ? data.orders
            : null;

        if (!list) {
          throw new Error(
            'La respuesta del backend no contiene una lista de pedidos válida.'
          );
        }

        setOrders(list);
      } catch (err) {
        if (err.name === 'AbortError') return;

        setError(
          err instanceof TypeError
            ? 'No se pudo conectar con el backend. Verificá la URL y la configuración de CORS.'
            : err.message
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => controller.abort();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = normalize(search);

    const result = orders.filter((order) => {
      const id = normalize(getOrderId(order));
      const customer = normalize(getCustomerName(order));
      const status = normalize(getStatusLabel(getOrderStatus(order)));
      const email = normalize(
        order.user?.email ??
          order.customer?.email ??
          order.customerEmail ??
          ''
      );

      const matchesSearch =
        !term ||
        id.includes(term) ||
        customer.includes(term) ||
        email.includes(term);

      const matchesStatus =
        statusFilter === 'ALL' ||
        getOrderStatus(order) === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      const dateA = new Date(getOrderDate(a) ?? 0).getTime();
      const dateB = new Date(getOrderDate(b) ?? 0).getTime();

      if (sortOrder === 'OLDEST') return dateA - dateB;

      if (sortOrder === 'AMOUNT_HIGH') {
        return Number(getTotal(b) ?? 0) - Number(getTotal(a) ?? 0);
      }

      if (sortOrder === 'AMOUNT_LOW') {
        return Number(getTotal(a) ?? 0) - Number(getTotal(b) ?? 0);
      }

      return dateB - dateA;
    });

    return result;
  }, [orders, search, statusFilter, sortOrder]);

  const statusOptions = useMemo(
    () =>
      [...new Set(orders.map((order) => getOrderStatus(order)))].sort(),
    [orders]
  );

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) =>
        ['PENDING'].includes(getOrderStatus(order))
      ).length,
      processing: orders.filter((order) =>
        ['PROCESSING', 'CONFIRMED', 'PAID'].includes(
          getOrderStatus(order)
        )
      ).length,
      completed: orders.filter((order) =>
        ['DELIVERED', 'COMPLETED'].includes(getOrderStatus(order))
      ).length,
    }),
    [orders]
  );

  return (
    <section className="admin-orders">
      <header className="admin-orders__header">
        <div>
          <h1>Gestión de Pedidos</h1>
          <p>Consultá los pedidos y revisá su estado.</p>
        </div>
      </header>

      <section
        className="admin-orders__stats"
        aria-label="Estadísticas de pedidos"
      >
        <article className="admin-orders__stat">
          <span className="admin-orders__stat-value">{stats.total}</span>
          <span className="admin-orders__stat-label">Total de pedidos</span>
        </article>

        <article className="admin-orders__stat">
          <span className="admin-orders__stat-value">{stats.pending}</span>
          <span className="admin-orders__stat-label">Pendientes</span>
        </article>

        <article className="admin-orders__stat">
          <span className="admin-orders__stat-value">{stats.processing}</span>
          <span className="admin-orders__stat-label">En proceso</span>
        </article>

        <article className="admin-orders__stat">
          <span className="admin-orders__stat-value">{stats.completed}</span>
          <span className="admin-orders__stat-label">Completados</span>
        </article>
      </section>

      <div className="admin-orders__toolbar">
        <input
          className="admin-orders__search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por pedido, cliente o email..."
          aria-label="Buscar pedidos"
        />

        <select
          className="admin-orders__select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="ALL">Todos los estados</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>

        <select
          className="admin-orders__select"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          aria-label="Ordenar pedidos"
        >
          <option value="NEWEST">Más recientes</option>
          <option value="OLDEST">Más antiguos</option>
          <option value="AMOUNT_HIGH">Mayor importe</option>
          <option value="AMOUNT_LOW">Menor importe</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-orders__state" role="status">
          Cargando pedidos...
        </div>
      ) : error ? (
        <div className="admin-orders__state admin-orders__state--error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="admin-orders__table-wrap">
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th scope="col">Pedido</th>
                <th scope="col">Cliente</th>
                <th scope="col">Fecha</th>
                <th scope="col">Total</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order, index) => {
                const status = getOrderStatus(order);

                return (
                  <tr key={order.id ?? order.orderId ?? index}>
                    <td>#{getOrderId(order)}</td>
                    <td>{getCustomerName(order)}</td>
                    <td>{formatDate(getOrderDate(order))}</td>
                    <td>{formatCurrency(getTotal(order))}</td>
                    <td>
                      <span
                        className={`admin-orders__status admin-orders__status--${status.toLowerCase()}`}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-orders__view"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-orders__empty">
                    No se encontraron pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="admin-orders__footnote">
        Los pedidos se consultan desde el backend. Los filtros y el
        ordenamiento se aplican en el frontend.
      </p>

      {selectedOrder && (
        <div
          className="admin-orders__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section
            className="admin-orders__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-order-detail-title"
          >
            <h2 id="admin-order-detail-title">
              Detalle del pedido #{getOrderId(selectedOrder)}
            </h2>

            <dl className="admin-orders__details">
              <div>
                <dt>Cliente</dt>
                <dd>{getCustomerName(selectedOrder)}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  {selectedOrder.user?.email ??
                    selectedOrder.customer?.email ??
                    selectedOrder.customerEmail ??
                    '—'}
                </dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{formatDate(getOrderDate(selectedOrder))}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>
                  {getStatusLabel(getOrderStatus(selectedOrder))}
                </dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatCurrency(getTotal(selectedOrder))}</dd>
              </div>
            </dl>

            <div className="admin-orders__modal-actions">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
              >
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default AdminOrdersPage;
