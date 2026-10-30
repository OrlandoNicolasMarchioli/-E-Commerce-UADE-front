import { useDispatch, useSelector } from 'react-redux';
import { selectIsFavorite, toggleFavorite } from '../../../store/favoritesSlice';
import '../../ui.css';

/** Botón ♡ / ♥ que agrega o quita un producto de favoritos. Está suscripto al store de Redux. */
const FavoriteButton = ({ product, imageUrl }) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(product.id));

  const handleClick = () => dispatch(toggleFavorite({
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category?.name ?? '',
    imageUrl,
  }));

  return (
    <button
      type="button"
      className={`ui-btn ui-btn--md ui-btn--full ${isFavorite ? 'ui-btn--secondary' : 'ui-btn--outline'}`}
      aria-pressed={isFavorite}
      onClick={handleClick}
    >
      {isFavorite ? '♥ En favoritos' : '♡ Agregar a favoritos'}
    </button>
  );
};

export default FavoriteButton;
