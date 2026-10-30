import '../../ui.css';

const formatPrice = (p) =>
  p.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

/** Fila de la lista de favoritos. Reutiliza los estilos de CartItem. */
const FavoriteItem = ({ item, onOpen, onRemove }) => {
  const { id, name, price, category, imageUrl } = item;

  return (
    <div className="ui-cart-item">
      <div className="ui-ci-img">
        {imageUrl ? <img src={imageUrl} alt={name} /> : '📷'}
      </div>
      <div>
        <div className="ui-ci-cat">{category}</div>
        <div className="ui-ci-name">{name}</div>
        <div className="ui-ci-unit">{formatPrice(price)}</div>
      </div>
      <div className="ui-ci-controls">
        <button className="ui-btn ui-btn--primary ui-btn--sm" onClick={() => onOpen?.(id)}>
          Ver producto
        </button>
        <button className="ui-ci-remove" onClick={() => onRemove?.(id)}>🗑️ Quitar</button>
      </div>
    </div>
  );
};

export default FavoriteItem;
