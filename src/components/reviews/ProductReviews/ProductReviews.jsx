import ReviewSummary from '../ReviewSummary/ReviewSummary';
import ReviewCard from '../ReviewCard/ReviewCard';
import '../../ui.css';

/** Sección de reseñas de un producto: resumen con distribución por estrellas y listado (o estado vacío). */
const ProductReviews = ({ reviews = [] }) => (
  <section className="pd-reviews" aria-labelledby="reviews-title">
    <h2 id="reviews-title" className="pd-section-title">Reseñas del producto</h2>
    {reviews.length === 0 ? (
      <p className="pd-muted">Este producto todavía no tiene reseñas.</p>
    ) : (
      <>
        <ReviewSummary reviews={reviews} />
        <div className="pd-review-list">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </>
    )}
  </section>
);

export default ProductReviews;
