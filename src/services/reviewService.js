import { getJson } from './api/mockClient';

/**
 * GET /api/products/{productId}/reviews → reseñas del producto, de la más reciente a la más antigua.
 * El JSON trae todas las reseñas juntas, por eso se filtra por productId.
 */
export async function getReviewsByProduct(productId) {
  const reviews = await getJson('reviews');
  return reviews
    .filter((r) => r.productId === Number(productId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Reseñas del producto listas para mostrar en un ReviewCard.
 * ReviewResponseDTO solo trae userId, así que se agrega el nombre del autor (de /users)
 * y se expone la fecha como `reviewDate`, que es lo que espera el componente.
 * Si no se puede resolver el autor, queda "Usuario".
 */
export async function getReviewsWithAuthors(productId) {
  const [reviews, users] = await Promise.all([
    getReviewsByProduct(productId),
    getJson('users').catch(() => []),
  ]);
  return reviews.map((review) => {
    const author = users.find((u) => u.id === review.userId);
    return {
      ...review,
      reviewDate: review.date,
      firstName: author?.firstName ?? 'Usuario',
      lastName: author?.lastName ?? '',
    };
  });
}
