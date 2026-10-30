import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/cart/EmptyState/EmptyState';
import FavoriteItem from '../../components/favorites/FavoriteItem/FavoriteItem';
import { clearFavorites, removeFavorite, selectFavorites } from '../../store/favoritesSlice';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

  return (
    <div className="p2-wrap">
      <h1>Mis favoritos</h1>
      {!favorites.length ? (
        <EmptyState icon="♡" title="Todavía no tenés favoritos"
          description="Tocá “Agregar a favoritos” en un producto para guardarlo acá"
          action={{ label: 'Ver catálogo', onClick: () => navigate('/') }} />
      ) : (
        <div className="p2-cart-list">
          {favorites.map((item) => (
            <FavoriteItem key={item.id} item={item}
              onOpen={(id) => navigate(`/products/${id}`)}
              onRemove={(id) => dispatch(removeFavorite(id))} />
          ))}
          <button className="ui-btn ui-btn--outline ui-btn--md" onClick={() => dispatch(clearFavorites())}>
            Vaciar favoritos
          </button>
        </div>
      )}
      <p className="p2-demo-note">Los favoritos se guardan solo en este navegador.</p>
    </div>
  );
};

export default FavoritesPage;
