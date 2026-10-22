import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addCartItem, removeCartItem, clearCart,
  setMockCartItemQuantity } from '../services/cartService';

const CartContext = createContext(null);
const EMPTY_CART = { id: null, userId: null, items: [], total: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const owner = user?.id;
  const ownerRef = useRef(owner);
  ownerRef.current = owner;
  const busyRef = useRef(false);
  const sequenceRef = useRef(0);
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!owner) {
      setCart(EMPTY_CART);
      return EMPTY_CART;
    }
    const sequence = ++sequenceRef.current;
    setLoading(true);
    try {
      const data = await getCart(owner); // Primero el JSON; luego cambios del navegador.
      if (sequence === sequenceRef.current && ownerRef.current === owner) {
        setCart(data);
        setError('');
      }
      return data;
    } catch (e) {
      if (ownerRef.current === owner) setError(e.message);
      throw e;
    } finally {
      if (sequence === sequenceRef.current && ownerRef.current === owner) setLoading(false);
    }
  }, [owner]);

  useEffect(() => {
    // Separa carritos de usuarios de prueba distintos y limpia al salir.
    sequenceRef.current += 1;
    if (!owner) {
      setCart(EMPTY_CART);
      setError('');
      setLoading(false);
    } else {
      refresh().catch(() => { /* Error visible en CartPage. */ });
    }
  }, [owner, refresh]);

  const mutate = useCallback(async (callback) => {
    if (!owner) throw new Error('Ingresá con un usuario de demostración');
    if (busyRef.current) throw new Error('Ya se está modificando el carrito');
    busyRef.current = true;
    sequenceRef.current += 1; // Impide que una lectura anterior sobrescriba el cambio.
    setBusy(true);
    try {
      const updated = await callback(owner);
      if (ownerRef.current === owner) {
        if (updated) setCart(updated);
        setError('');
      }
      return updated;
    } catch (e) {
      if (ownerRef.current === owner) setError(e.message);
      throw e;
    } finally {
      busyRef.current = false;
      if (ownerRef.current === owner) setBusy(false);
    }
  }, [owner]);

  const addItem = useCallback((productId, quantity) =>
    mutate((userId) => addCartItem(userId, productId, quantity)), [mutate]);
  const removeItem = useCallback((productId) => mutate(async (userId) => {
    await removeCartItem(userId, productId);
    return getCart(userId);
  }), [mutate]);
  const changeQuantity = useCallback((productId, quantity) => mutate((userId) =>
    setMockCartItemQuantity(userId, productId, quantity)), [mutate]);
  const empty = useCallback(() => mutate(async (userId) => {
    await clearCart(userId);
    return getCart(userId);
  }), [mutate]);

  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <CartContext.Provider value={{ cart, count, loading, busy, error,
      refresh, addItem, removeItem, changeQuantity, empty }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart requiere CartProvider');
  return context;
}