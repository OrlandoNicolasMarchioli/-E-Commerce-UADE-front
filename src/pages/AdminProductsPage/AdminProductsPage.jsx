import { useEffect, useMemo, useState } from 'react';

const PRODUCTS_URL = '/data/products.json';
const CATEGORIES_URL = '/data/category.json';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatType = (type) => {
  if (type === 'PHYSICAL') return 'Producto físico';
  if (type === 'SERVICE') return 'Servicio';
  return type || 'No informado';
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(PRODUCTS_URL, { signal: controller.signal }),
          fetch(CATEGORIES_URL, { signal: controller.signal }),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('No se pudieron cargar los productos y las categorías.');
        }

        const [productsData, categoriesData] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json(),
        ]);

        if (!Array.isArray(productsData) || !Array.isArray(categoriesData)) {
          throw new Error('Los archivos de datos tienen un formato inválido.');
        }

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        if (err.name === 'AbortError') return;

        setError(
          err instanceof TypeError
            ? 'No se pudo acceder a los archivos de datos.'
            : err.message
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es');

    const result = products.filter((product) => {
      const matchesSearch =
        !term ||
        String(product.name ?? '').toLocaleLowerCase('es').includes(term) ||
        String(product.description ?? '').toLocaleLowerCase('es').includes(term) ||
        String(product.id ?? '').includes(term) ||
        String(product.category?.name ?? '').toLocaleLowerCase('es').includes(term);

      const matchesCategory =
        categoryFilter === 'ALL' ||
        String(product.category?.id) === categoryFilter;

      const matchesType =
        typeFilter === 'ALL' || product.type === typeFilter;

      const matchesStock =
        stockFilter === 'ALL' ||
        (stockFilter === 'OUT' &&
          product.type === 'PHYSICAL' &&
          Number(product.stock) === 0) ||
        (stockFilter === 'LOW' &&
          product.type === 'PHYSICAL' &&
          Number(product.stock) > 0 &&
          Number(product.stock) <= 10) ||
        (stockFilter === 'AVAILABLE' &&
          product.type === 'PHYSICAL' &&
          Number(product.stock) > 10) ||
        (stockFilter === 'SERVICE' && product.type === 'SERVICE');

      return matchesSearch && matchesCategory && matchesType && matchesStock;
    });

    result.sort((a, b) => {
      if (sortOrder === 'AZ') {
        return String(a.name ?? '').localeCompare(String(b.name ?? ''), 'es');
      }

      if (sortOrder === 'ZA') {
        return String(b.name ?? '').localeCompare(String(a.name ?? ''), 'es');
      }

      if (sortOrder === 'PRICE_LOW') {
        return Number(a.price) - Number(b.price);
      }

      if (sortOrder === 'PRICE_HIGH') {
        return Number(b.price) - Number(a.price);
      }

      if (sortOrder === 'STOCK_LOW') {
        return Number(a.stock ?? Infinity) - Number(b.stock ?? Infinity);
      }

      return Number(b.id) - Number(a.id);
    });

    return result;
  }, [products, search, categoryFilter, typeFilter, stockFilter, sortOrder]);

  const stats = useMemo(
    () => ({
      total: products.length,
      physical: products.filter((product) => product.type === 'PHYSICAL').length,
      services: products.filter((product) => product.type === 'SERVICE').length,
      outOfStock: products.filter(
        (product) => product.type === 'PHYSICAL' && Number(product.stock) === 0
      ).length,
    }),
    [products]
  );

  const handleDelete = () => {
    if (!productToDelete) return;

    setProducts((current) =>
      current.filter((product) => product.id !== productToDelete.id)
    );

    setFeedback(
      `El producto "${productToDelete.name}" se quitó de la lista local.`
    );
    setProductToDelete(null);
  };

  return (
    <section className="admin-products">
      <header className="admin-products__header">
        <div>
          <h1>Gestión de Productos</h1>
          <p>Consultá y administrá los productos y servicios del catálogo.</p>
        </div>
      </header>

      <section className="admin-products__stats" aria-label="Estadísticas de productos">
        <article className="admin-products__stat">
          <span className="admin-products__stat-value">{stats.total}</span>
          <span className="admin-products__stat-label">Total de publicaciones</span>
        </article>
        <article className="admin-products__stat">
          <span className="admin-products__stat-value">{stats.physical}</span>
          <span className="admin-products__stat-label">Productos físicos</span>
        </article>
        <article className="admin-products__stat">
          <span className="admin-products__stat-value">{stats.services}</span>
          <span className="admin-products__stat-label">Servicios</span>
        </article>
        <article className="admin-products__stat">
          <span className="admin-products__stat-value">{stats.outOfStock}</span>
          <span className="admin-products__stat-label">Sin stock</span>
        </article>
      </section>

      {feedback && (
        <div className="admin-products__feedback" role="status">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback('')}>
            Cerrar
          </button>
        </div>
      )}

      <div className="admin-products__toolbar">
        <input
          className="admin-products__search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre, descripción o categoría..."
          aria-label="Buscar productos"
        />

        <select
          className="admin-products__select"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filtrar por categoría"
        >
          <option value="ALL">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className="admin-products__select"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          aria-label="Filtrar por tipo"
        >
          <option value="ALL">Todos los tipos</option>
          <option value="PHYSICAL">Productos físicos</option>
          <option value="SERVICE">Servicios</option>
        </select>

        <select
          className="admin-products__select"
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value)}
          aria-label="Filtrar por stock"
        >
          <option value="ALL">Todos los stocks</option>
          <option value="OUT">Sin stock</option>
          <option value="LOW">Stock bajo (1–10)</option>
          <option value="AVAILABLE">Stock mayor a 10</option>
          <option value="SERVICE">Servicios sin stock físico</option>
        </select>

        <select
          className="admin-products__select"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          aria-label="Ordenar productos"
        >
          <option value="NEWEST">ID: más reciente</option>
          <option value="AZ">Nombre: A-Z</option>
          <option value="ZA">Nombre: Z-A</option>
          <option value="PRICE_LOW">Precio: menor a mayor</option>
          <option value="PRICE_HIGH">Precio: mayor a menor</option>
          <option value="STOCK_LOW">Stock: menor a mayor</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-products__state" role="status">
          Cargando productos...
        </div>
      ) : error ? (
        <div className="admin-products__state" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      ) : (
        <div className="admin-products__table-wrap">
          <table className="admin-products__table">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Tipo</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock / Duración</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-products__product-name">
                      {product.name}
                    </div>
                    <div className="admin-products__product-description">
                      {product.description}
                    </div>
                    <small>ID: {product.id}</small>
                  </td>
                  <td>{product.category?.name ?? 'Sin categoría'}</td>
                  <td>{formatType(product.type)}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    {product.type === 'PHYSICAL'
                      ? Number(product.stock) === 0
                        ? 'Sin stock'
                        : product.stock
                      : product.minutesDuration != null
                        ? `${product.minutesDuration} min`
                        : '—'}
                    {product.type === 'SERVICE' && product.attendanceType && (
                      <div>{product.attendanceType === 'VIRTUAL' ? 'Virtual' : 'Presencial'}</div>
                    )}
                  </td>
                  <td>
                    <div className="admin-products__actions">
                      <button
                        type="button"
                        className="admin-products__view"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        className="admin-products__delete"
                        onClick={() => setProductToDelete(product)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-products__empty">
                    No se encontraron productos con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="admin-products__footnote">
        Los cambios son temporales: los productos se cargan desde un archivo JSON estático.
      </p>

      {selectedProduct && (
        <div
          className="admin-products__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProduct(null);
          }}
        >
          <section
            className="admin-products__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
          >
            <h2 id="product-detail-title">{selectedProduct.name}</h2>
            <dl className="admin-products__details">
              <div><dt>ID</dt><dd>{selectedProduct.id}</dd></div>
              <div><dt>Descripción</dt><dd>{selectedProduct.description || '—'}</dd></div>
              <div><dt>Categoría</dt><dd>{selectedProduct.category?.name ?? 'Sin categoría'}</dd></div>
              <div><dt>Tipo</dt><dd>{formatType(selectedProduct.type)}</dd></div>
              <div><dt>Precio</dt><dd>{formatCurrency(selectedProduct.price)}</dd></div>
              <div>
                <dt>Stock</dt>
                <dd>{selectedProduct.type === 'PHYSICAL' ? selectedProduct.stock ?? '—' : 'No aplica'}</dd>
              </div>
              <div>
                <dt>Duración</dt>
                <dd>{selectedProduct.minutesDuration != null ? `${selectedProduct.minutesDuration} minutos` : '—'}</dd>
              </div>
              <div><dt>Modalidad</dt><dd>{selectedProduct.attendanceType ?? '—'}</dd></div>
              <div><dt>Publicado por (ID)</dt><dd>{selectedProduct.publisherId ?? '—'}</dd></div>
            </dl>
            <div className="admin-products__modal-actions">
              <button type="button" onClick={() => setSelectedProduct(null)}>
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}

      {productToDelete && (
        <div
          className="admin-products__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setProductToDelete(null);
          }}
        >
          <section
            className="admin-products__modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            aria-describedby="delete-product-description"
          >
            <h2 id="delete-product-title">¿Eliminar publicación?</h2>
            <p id="delete-product-description">
              ¿Querés quitar "{productToDelete.name}" de la lista actual?
              El archivo original no se modificará.
            </p>
            <div className="admin-products__modal-actions">
              <button type="button" onClick={() => setProductToDelete(null)}>
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

export default AdminProductsPage;
