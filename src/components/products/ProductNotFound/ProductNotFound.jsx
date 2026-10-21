import Button from '../../primitives/Button/Button';
import '../../ui.css';

/** Estado "producto no encontrado" con salida hacia el catálogo. */
const ProductNotFound = ({ onBack }) => (
  <div className="ui-empty-state" role="alert">
    <div style={{ fontSize: '3rem' }} aria-hidden="true">🔍</div>
    <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: '12px 0 8px' }}>Producto no encontrado</h1>
    <p style={{ color: 'var(--color-neutral-600)', marginBottom: 20 }}>
      El producto que buscás no existe o ya no está disponible.
    </p>
    <Button onClick={onBack}>Ver todos los productos</Button>
  </div>
);

export default ProductNotFound;
