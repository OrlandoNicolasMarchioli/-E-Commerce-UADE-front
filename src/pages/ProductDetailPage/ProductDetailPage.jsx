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
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './ProductDetailPage.css';

const average = (reviews) => reviews.length
  ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toasts, show, dismiss } = useToast();
  const load = useCallback(() => getProductDetail(id), [id]);
  const { data, error, loading, reload } = useAsync(load);

  if (loading) return <p role="status" className="app-state">Cargando producto…</p>;
  if (error?.status === 404) {
    return <div className="app-container pd-page">
      <ProductNotFound onBack={() => navigate('/search')} />
    </div>;
  }
  if (error) return <div role="alert" className="app-state">
    <p>No pudimos cargar el producto.</p>
    <Button variant="secondary" size="sm" onClick={reload}>Reintentar</Button>
  </div>;

  const { product, images, reviews, seller } = data;
  const handleAddToCart = async (quantity) => {
    if (!isAuthenticated) {
      // El usuario vuelve al detalle después del login; aún no compró nada.
      navigate('/login', { state: { from: `/products/${product.id}` } });
      return false;
    }
    try {
      await addItem(product.id, quantity);
      // Anunciamos éxito únicamente tras actualizar el carrito simulado.
      show({ variant: 'success', title: 'Agregado al carrito',
        description: `${quantity} × ${product.name}` });
      return true;
    } catch (e) {
      show({ variant: 'error', title: 'No se pudo agregar al carrito', description: e.message });
      return false;
    }
  };
  const handleBuy = async (quantity) => {
    if (await handleAddToCart(quantity)) navigate('/cart');
  };

  return (
    <div className="app-container pd-page">
      <Breadcrumb onNavigate={navigate} items={[
        { label: 'Inicio', href: '/' },
        { label: product.category.name, href: `/category/${product.category.id}` },
        { label: product.name },
      ]} />
      <div className="pd-layout">
        <ProductImageGallery key={product.id} images={images} />
        <ProductInfo product={product} seller={seller}
          averageRating={average(reviews)} reviewCount={reviews.length} />
        <aside className="pd-buy">
          <BuyPanel key={product.id} product={{ ...product, seller }}
            onBuy={handleBuy} onAddToCart={handleAddToCart} />
        </aside>
      </div>
      <ProductReviews reviews={reviews} />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default ProductDetailPage;