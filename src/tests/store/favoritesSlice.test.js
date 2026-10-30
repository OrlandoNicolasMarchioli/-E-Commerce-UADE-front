import reducer, {
  clearFavorites, removeFavorite, selectFavorites, selectFavoritesCount, selectIsFavorite,
  toggleFavorite,
} from '../../store/favoritesSlice';
import { FAVORITES_KEY, makeStore } from '../../store';

const notebook = { id: 1, name: 'Notebook', price: 950000, category: 'Tecnología', imageUrl: 'a.png' };
const mouse = { id: 2, name: 'Mouse', price: 15000, category: 'Tecnología', imageUrl: 'b.png' };
const empty = { items: [] };

beforeEach(() => localStorage.clear());

describe('favoritesSlice · reducers', () => {
  it('arranca sin favoritos', () => {
    expect(reducer(undefined, { type: '@@init' })).toEqual(empty);
  });

  it('toggleFavorite agrega un producto que no estaba', () => {
    expect(reducer(empty, toggleFavorite(notebook)).items).toEqual([notebook]);
  });

  it('toggleFavorite quita un producto que ya estaba', () => {
    const state = { items: [notebook, mouse] };
    expect(reducer(state, toggleFavorite(notebook)).items).toEqual([mouse]);
  });

  it('removeFavorite quita por id', () => {
    const state = { items: [notebook, mouse] };
    expect(reducer(state, removeFavorite(2)).items).toEqual([notebook]);
  });

  it('clearFavorites vacía la lista', () => {
    expect(reducer({ items: [notebook, mouse] }, clearFavorites())).toEqual(empty);
  });
});

describe('favoritesSlice · selectores', () => {
  const state = { favorites: { items: [notebook] } };

  it('devuelven la lista, la cantidad y si un producto es favorito', () => {
    expect(selectFavorites(state)).toEqual([notebook]);
    expect(selectFavoritesCount(state)).toBe(1);
    expect(selectIsFavorite(1)(state)).toBe(true);
    expect(selectIsFavorite(2)(state)).toBe(false);
  });
});

describe('store · persistencia en localStorage', () => {
  it('guarda los cambios y los recupera al crear un store nuevo', () => {
    makeStore().dispatch(toggleFavorite(notebook));
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY))).toEqual([notebook]);
    expect(selectFavorites(makeStore().getState())).toEqual([notebook]);
  });

  it('ignora datos guardados con formato inválido', () => {
    localStorage.setItem(FAVORITES_KEY, '{"no":"es una lista"}');
    expect(selectFavorites(makeStore().getState())).toEqual([]);
  });
});
