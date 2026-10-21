import { getJson } from './api/mockClient';
import { ApiError } from './api/client';
import { readMockState, writeMockState } from './mockStorage';

const keyFor = (userId) => `uade_mock_cart_${userId}`;
const money = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// La respuesta conserva exactamente {id,userId,items,total} de CartResponseDTO.
const totals = (cart) => ({
  ...cart,
  total: money(cart.items.reduce((sum, item) => sum + item.subtotal, 0)),
});

export async function getCart(userId) {
  const seed = await getJson('cart'); // JSON local con estructura CartResponseDTO.
  const base = Number(seed.userId) === Number(userId)
    ? seed : { id: Number(userId), userId: Number(userId), items: [], total: 0 };
  return totals(readMockState(keyFor(userId), base));
}

export async function addCartItem(userId, productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(400, 'La cantidad debe ser mayor que cero');
  }
  const products = await getJson('products');
  const product = products.find((entry) => entry.id === Number(productId));
  if (!product) throw new ApiError(404, 'Producto no encontrado');

  const cart = await getCart(userId);
  const old = cart.items.find((item) => item.productId === product.id);
  const nextQuantity = (old?.quantity ?? 0) + quantity;
  if (product.type === 'PHYSICAL' && nextQuantity > Number(product.stock ?? 0)) {
    throw new ApiError(409, 'Stock insuficiente');
  }

  // Los ítems replican CartItemResponseDTO: no agregamos campos de presentación.
  const item = {
    productId: product.id,
    productName: product.name,
    quantity: nextQuantity,
    unitPrice: product.price,
    subtotal: money(product.price * nextQuantity),
  };
  const items = old
    ? cart.items.map((entry) => entry.productId === item.productId ? item : entry)
    : [...cart.items, item];
  return writeMockState(keyFor(userId), totals({ ...cart, items }));
}

export async function removeCartItem(userId, productId) {
  const cart = await getCart(userId);
  writeMockState(keyFor(userId), totals({
    ...cart, items: cart.items.filter((item) => item.productId !== Number(productId)),
  }));
  // Replica el DELETE 204 del backend: sin cuerpo de respuesta.
  return null;
}

export async function clearCart(userId) {
  const cart = await getCart(userId);
  writeMockState(keyFor(userId), { ...cart, items: [], total: 0 });
  return null;
}

// Solo para el estado mock: permite cambiar cantidades sin simular un PUT que no existe.
export async function setMockCartItemQuantity(userId, productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) throw new ApiError(400, 'Cantidad inválida');
  const products = await getJson('products');
  const product = products.find((item) => item.id === Number(productId));
  const cart = await getCart(userId);
  const existing = cart.items.find((item) => item.productId === Number(productId));
  if (!product || !existing) throw new ApiError(404, 'Producto fuera del carrito');
  if (product.type === 'PHYSICAL' && quantity > Number(product.stock ?? 0)) {
    throw new ApiError(409, 'Stock insuficiente');
  }
  const items = cart.items.map((item) => item.productId === Number(productId)
    ? { ...item, quantity, subtotal: money(item.unitPrice * quantity) }
    : item);
  return writeMockState(keyFor(userId), totals({ ...cart, items }));
}