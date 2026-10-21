import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../../components/layout/HeroBanner/HeroBanner';
import CategoryStrip from '../../components/navigation/CategoryStrip/CategoryStrip';
import ProductCard from '../../components/products/ProductCard/ProductCard';
import Button from '../../components/primitives/Button/Button';
import { useAsync } from '../../hooks/useAsync';
import { getCategories, getFeaturedProducts } from '../../services';

// Definidas fuera del componente para que useAsync reciba siempre la misma referencia.
const loadCategories = () => getCategories();
const loadFeatured = () => getFeaturedProducts(8);

/** Home: barra de categorías, banner principal y productos destacados. */
const HomePage = () => {
  const navigate = useNavigate();
  const featuredRef = useRef(null);
  const categories = useAsync(loadCategories);
  const featured = useAsync(loadFeatured);

  const renderFeatured = () => {
    if (featured.loading) {
      return <p role="status" className="app-state">Cargando productos…</p>;
    }
    if (featured.error) {
      return (
        <div role="alert" className="app-state">
          <p>No pudimos cargar los productos.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              featured.reload();
              categories.reload();
            }}
          >
            Reintentar
          </Button>
        </div>
      );
    }
    if (featured.data.length === 0) {
      return <p className="app-state">Todavía no hay productos publicados.</p>;
    }
    return (
      <div className="app-product-grid">
        {featured.data.map((product) => (
          <ProductCard key={product.id} product={product} onClick={(id) => navigate(`/products/${id}`)} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="app-container app-categories">
        {/* Elegir una categoría lleva a su página; en el Home no hay ninguna activa */}
        <CategoryStrip
          categories={categories.data ?? []}
          activeId={null}
          onSelect={(id) => navigate(id === null ? '/search' : `/category/${id}`)}
        />
      </div>

      <HeroBanner
        title="Todo lo que necesitás en un solo lugar"
        subtitle="Comprá y vendé productos y servicios dentro de la comunidad UADE."
        ctaLabel="Ver productos destacados →"
        onCta={() => featuredRef.current?.scrollIntoView?.({ behavior: 'smooth' })}
        imagePlaceholder="🎓 📚 ✏️"
      />

      <section ref={featuredRef} className="app-section" aria-labelledby="featured-title">
        <div className="app-container">
          <div className="app-section-header">
            <h2 id="featured-title" className="app-section-title">Destacados</h2>
            <a
              className="app-section-link"
              href="/search"
              onClick={(e) => {
                e.preventDefault();
                navigate('/search');
              }}
            >
              Ver todos →
            </a>
          </div>
          {renderFeatured()}
        </div>
      </section>
    </>
  );
};

export default HomePage;
