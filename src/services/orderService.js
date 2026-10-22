import { getJson } from './api/mockClient';
import { ApiError } from './api/client';
import { getCart, clearCart } from './cartService';
import { readMockState, writeMockState } from './mockStorage';

const keyFor = (userId) => `uade_mock_orders_${userId}`;

export async function getOrders(userId) {
  // /api/orders devuelve List<OrderResponseDTO>; orders.json replica esa lista.
  const seed = await getJson('orders');
  return readMockState(keyFor(userId), seed.filter((order) => order.userId === Number(userId)));
}

export async function getOrderById(userId, orderId) {
  const orders = await getOrders(userId);
  const order = orders.find((item) => item.id === Number(orderId));
  if (!order) throw new ApiError(404, 'Pedido no encontrado');
  return order;
}

export async function createOrder(userId) {
  const cart = await getCart(userId);
  if (!cart.items.length) throw new ApiError(400, 'El carrito está vacío');

  const products = await getJson('products');
  for (const item of cart.items) {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) throw new ApiError(404, 'Uno de los productos no existe');
    if (product.type === 'PHYSICAL' && item.quantity > Number(product.stock ?? 0)) {
      throw new ApiError(409, `Stock insuficiente para ${product.name}`);
    }
  }

  const orders = await getOrders(userId);
  const order = {
    id: Math.max(0, ...orders.map((item) => item.id)) + 1,
    userId: Number(userId),
    orderDate: new Date().toISOString().slice(0, 19),
    status: 'PENDING',
    // OrdenItemResponseDTO: mismos cinco campos que los ítems del carrito.
    items: cart.items.map((item) => ({ ...item })),
    total: cart.total,
  };
  writeMockState(keyFor(userId), [...orders, order]);
  await clearCart(userId); // La simulación imita el vaciado tras checkout.
  return order;
}