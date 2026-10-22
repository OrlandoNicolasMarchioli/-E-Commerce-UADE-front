import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem/CartItem';
import EmptyState from '../../components/cart/EmptyState/EmptyState';
import OrderSummary from '../../components/cart/OrderSummary/OrderSummary';
import CheckoutModal from '../../components/overlays/Modal/CheckoutModal';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/orderService';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, busy, error, refresh, removeItem, changeQuantity, empty } = useCart();
  const [confirm, setConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState('');
  const items = cart.items ?? [];

  const handle = async (operation) => {
    setActionError('');
    try { await operation(); } catch (e) { setActionError(e.message); }
  };

  const checkout = async () => {
    if (processing || busy || !items.length) return;
    setProcessing(true);
    setActionError('');
    try {
      const order = await createOrder(user.id);
      // Navegamos solo después de crear la orden simulada con formato OrderResponseDTO.
      setConfirm(false);
      await refresh().catch(() => { /* La compra ya se concretó. */ });
      navigate(`/my-orders/${order.id}`);
    } catch (e) {
      setConfirm(false);
      setActionError(e.message);
      await refresh().catch(() => {});
    } finally {
      setProcessing(false);
    }
  };

  if (loading && !items.length) return <p className="app-state" role="status">Cargando carrito…</p>;

  return (
    <div className="p2-wrap">
      <h1>Carrito</h1>
      {(actionError || error) && <p role="alert" className="ui-auth-error">
        {actionError || error} <button onClick={() => refresh().catch(() => {})}>Reintentar</button>
      </p>}
      {!items.length ? (
        <EmptyState title="Tu carrito está vacío" description="Explorá los productos disponibles"
          action={{ label: 'Ver catálogo', onClick: () => navigate('/') }} />
      ) : (
        <>
          <fieldset disabled={busy || processing} style={{ border: 0, padding: 0, margin: 0 }}>
            <div className="p2-cart">
              <div className="p2-cart-list">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item}
                    onRemove={(id) => handle(() => removeItem(id))}
                    onQtyChange={(id, qty) => handle(() => changeQuantity(id, qty))} />
                ))}
                <button className="ui-btn ui-btn--outline ui-btn--md" onClick={() => handle(empty)}>
                  Vaciar carrito
                </button>
              </div>
              <OrderSummary items={items} onCheckout={() => setConfirm(true)}
                onContinue={() => navigate('/')} />
            </div>
          </fieldset>
        </>
      )}
      <p className="p2-demo-note">Carrito y compra simulados. Los cambios se guardan solo en este navegador.</p>
      {confirm && <fieldset disabled={processing} style={{ border: 0, padding: 0, margin: 0 }}>
        <CheckoutModal items={items} onConfirm={checkout} onCancel={() => setConfirm(false)} />
      </fieldset>}
    </div>
  );
};

export default CartPage;