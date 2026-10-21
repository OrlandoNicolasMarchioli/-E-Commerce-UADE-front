import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/navigation/Breadcrumb/Breadcrumb';
import ProductImageGallery from '../../components/products/ProductImageGallery/ProductImageGallery';
import ProductInfo from '../../components/products/ProductInfo/ProductInfo';
import ProductNotFound from '../../components/products/ProductNotFound/ProductNotFound';
import BuyPanel from '../../components/products/BuyPanel/BuyPanel';
import ProductReviews from '../../components/reviews/ProductReviews/ProductReviews';
import ToastContainer, { useToast } from '../../components/overlays/Toast/ToastContainer';
import Button from '../../components/primitives/Button/Button';
import { useAsync } from '../../hooks/useAsync';
import { getProductDetail } from '../../services';
import './ProductDetailPage.css';

const average = (reviews) =>
  reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

/** Detalle de producto: galería, información, panel de compra y reseñas. */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, show, dismiss } = useToast();

  // Cambia solo cuando cambia el id de la URL, así useAsync vuelve a cargar al navegar entre productos.
  const load = useCallback(() => getProductDetail(id), [id]);
  const { data, error, loading, reload } = useAsync(load);

  if (loading) return <p role="status" className="app-state">Cargando producto…</p>;

  if (error?.status === 404) {
    return (
      <div className="app-container pd-page">
        <ProductNotFound onBack={() => navigate('/search')} />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="app-state">
        <p>No pudimos cargar el producto.</p>
        <Button variant="secondary" size="sm" onClick={reload}>Reintentar</Button>
      </div>
    );
  }

  const { product, images, reviews, seller } = data;

  // TODO (Parte 2): usar el CartContext para agregar realmente el producto y exigir sesión.
  const handleAddToCart = (qty) =>
    show({ variant: 'success', title: 'Agregado al carrito', description: `${qty} × ${product.name}` });
  const handleBuy = (qty) => {
    handleAddToCart(qty);
    navigate('/cart');
  };

  return (
    <div className="app-container pd-page">
      <Breadcrumb
        onNavigate={navigate}
        items={[
          { label: 'Inicio', href: '/' },
          { label: product.category.name, href: `/category/${product.category.id}` },
          { label: product.name },
        ]}
      />

      <div className="pd-layout">
        {/* key: al cambiar de producto la galería vuelve a la primera imagen */}
        <ProductImageGallery key={product.id} images={images} />
        <ProductInfo product={product} seller={seller} averageRating={average(reviews)} reviewCount={reviews.length} />
        <aside className="pd-buy">
          <BuyPanel key={product.id} product={{ ...product, seller }} onBuy={handleBuy} onAddToCart={handleAddToCart} />
        </aside>
      </div>

      <ProductReviews reviews={reviews} />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default ProductDetailPage;
