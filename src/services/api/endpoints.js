// All API path constants in one place — no magic strings in service files.
// Functions are used for paths that require dynamic segments.

export const AUTH = {
  LOGIN:    '/auth/login',
  REGISTER: '/auth/register',
};

export const USERS = {
  BASE:  '/users',
  BY_ID: (id) => `/users/${id}`,
};

export const PRODUCTS = {
  BASE:        '/products',
  BY_ID:       (id)                    => `/products/${id}`,
  BY_CATEGORY: (categoryId)            => `/products/category/${categoryId}`,
  IMAGES:      (productId)             => `/products/${productId}/images`,
  IMAGE:       (productId, imageId)    => `/products/${productId}/images/${imageId}`,
};

export const CATEGORIES = {
  BASE:  '/category',
  BY_ID: (id) => `/category/${id}`,
};

export const CART = {
  BASE:    '/cart',
  ITEMS:   '/cart/items',
  ITEM:    (productId) => `/cart/items/${productId}`,
};

export const ORDERS = {
  BASE:   '/orders',
  BY_ID:  (id) => `/orders/${id}`,
  STATUS: (id) => `/orders/${id}/status`,
};

export const REVIEWS = {
  FOR_PRODUCT: (productId)             => `/products/${productId}/reviews`,
  BY_ID:       (productId, reviewId)   => `/products/${productId}/reviews/${reviewId}`,
};
