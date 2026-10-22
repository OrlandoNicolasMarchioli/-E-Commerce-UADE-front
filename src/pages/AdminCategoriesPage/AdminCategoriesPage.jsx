import { useEffect, useMemo, useState } from 'react';

const CATEGORIES_URL = '/data/category.json';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('AZ');
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(CATEGORIES_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar las categorías.');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('El archivo de categorías tiene un formato inválido.');
        }

        setCategories(data);
      } catch (err) {
        if (err.name === 'AbortError') return;

        setError(
          err instanceof TypeError
            ? 'No se pudo acceder al archivo de categorías.'
            : err.message
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => controller.abort();
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('es');

    const result = categories.filter((category) =>
      String(category.name ?? '')
        .toLocaleLowerCase('es')
        .includes(normalizedSearch)
    );

    result.sort((a, b) => {
      if (sortOrder === 'ZA') {
        return String(b.name ?? '').localeCompare(
          String(a.name ?? ''),
          'es'
        );
      }

      if (sortOrder === 'NEWEST') {
        return Number(b.id) - Number(a.id);
      }

      if (sortOrder === 'OLDEST') {
        return Number(a.id) - Number(b.id);
      }

      return String(a.name ?? '').localeCompare(
        String(b.name ?? ''),
        'es'
      );
    });

    return result;
  }, [categories, search, sortOrder]);

  const handleDelete = () => {
    if (!categoryToDelete) return;

    setCategories((previous) =>
      previous.filter((category) => category.id !== categoryToDelete.id)
    );

    setFeedback(
      `La categoría "${categoryToDelete.name}" se quitó de la lista local.`
    );

    setCategoryToDelete(null);
  };

  return (
    <section className="admin-categories">
      <header className="admin-categories__header">
        <div>
          <h1>Gestión de Categorías</h1>
          <p>Consultá y administrá las categorías del catálogo.</p>
        </div>
      </header>

      <section
        className="admin-categories__stats"
        aria-label="Estadísticas de categorías"
      >
        <article className="admin-categories__stat">
          <span className="admin-categories__stat-value">
            {categories.length}
          </span>
          <span className="admin-categories__stat-label">
            Total de categorías
          </span>
        </article>

        <article className="admin-categories__stat">
          <span className="admin-categories__stat-value">
            {filteredCategories.length}
          </span>
          <span className="admin-categories__stat-label">
            Resultados encontrados
          </span>
        </article>
      </section>

      {feedback && (
        <div className="admin-categories__feedback" role="status">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback('')}>
            Cerrar
          </button>
        </div>
      )}

      <div className="admin-categories__toolbar">
        <input
          className="admin-categories__search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar categoría..."
          aria-label="Buscar categoría"
        />

        <select
          className="admin-categories__select"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          aria-label="Ordenar categorías"
        >
          <option value="AZ">Nombre: A-Z</option>
          <option value="ZA">Nombre: Z-A</option>
          <option value="OLDEST">ID: menor a mayor</option>
          <option value="NEWEST">ID: mayor a menor</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-categories__state" role="status">
          Cargando categorías...
        </div>
      ) : error ? (
        <div className="admin-categories__state" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="admin-categories__table-wrap">
          <table className="admin-categories__table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre de la categoría</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    <div className="admin-categories__actions">
                      <button
                        type="button"
                        className="admin-categories__delete"
                        onClick={() => setCategoryToDelete(category)}
                        aria-label={`Eliminar categoría ${category.name}`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="admin-categories__empty">
                    No se encontraron categorías.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="admin-categories__footnote">
        Los cambios de esta pantalla son temporales porque las categorías
        se cargan desde un archivo JSON estático.
      </p>

      {categoryToDelete && (
        <div
          className="admin-categories__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setCategoryToDelete(null);
            }
          }}
        >
          <section
            className="admin-categories__modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            aria-describedby="delete-category-description"
          >
            <h2 id="delete-category-title">¿Eliminar categoría?</h2>

            <p id="delete-category-description">
              ¿Querés quitar la categoría "{categoryToDelete.name}" de la
              lista actual? El archivo original no se modificará.
            </p>

            <div className="admin-categories__modal-actions">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
              >
                Cancelar
              </button>

              <button type="button" onClick={handleDelete}>
                Confirmar eliminación
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default AdminCategoriesPage;
