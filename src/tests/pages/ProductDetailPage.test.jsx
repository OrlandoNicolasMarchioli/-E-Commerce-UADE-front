import { readFileSync } from 'node:fs';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ProductDetailPage from '../../pages/ProductDetailPage/ProductDetailPage';
import { stubDataFetch } from '../../test/mockDataFetch';

// Nombres tomados de los JSON reales, así los tests no dependen de qué usuarios haya cargados.
const readData = (name) => JSON.parse(readFileSync(`public/data/${name}.json`, 'utf-8'));
const fullName = (userId) => {
  const u = readData('users').find((x) => x.id === userId);
  return `${u.firstName} ${u.lastName}`;
};

const Where = () => <div data-testid="where">{useLocation().pathname}</div>;

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>,
  );

// Espera a que termine la carga (el título del producto es el h1)
const loaded = (name) => screen.findByRole('heading', { level: 1, name });

beforeEach(() => {
  stubDataFetch();
});

describe('ProductDetailPage · producto físico con imágenes y reseñas', () => {
  it('muestra título, categoría, precio y datos del producto', async () => {
    renderAt('/products/1');
    await loaded(/Notebook Lenovo/);
    expect(screen.getAllByText('Tecnología').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/950\.000/).length).toBeGreaterThan(0);
    expect(screen.getByRole('row', { name: new RegExp(`Publicado por ${fullName(1)}`) })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Stock disponible 10 unidades/ })).toBeInTheDocument();
  });

  it('muestra el breadcrumb con links a Inicio y a la categoría', async () => {
    const user = userEvent.setup();
    renderAt('/products/1');
    await loaded(/Notebook Lenovo/);
    await user.click(screen.getByRole('link', { name: 'Tecnología' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/category/1');
  });

  it('la galería cambia de imagen al elegir una miniatura', async () => {
    const user = userEvent.setup();
    renderAt('/products/1');
    await loaded(/Notebook Lenovo/);
    const main = document.querySelector('.ui-gallery-main img');
    const firstSrc = main.getAttribute('src');
    await user.click(screen.getByRole('button', { name: 'Thumbnail 2' }));
    expect(document.querySelector('.ui-gallery-main img').getAttribute('src')).not.toBe(firstSrc);
  });

  it('muestra el resumen de reseñas y el listado con el nombre de cada autor', async () => {
    renderAt('/products/1');
    await loaded(/Notebook Lenovo/);
    const section = screen.getByRole('region', { name: 'Reseñas del producto' });
    expect(within(section).getByText(/\d+ reviews/)).toBeInTheDocument();
    const reviews = readData('reviews').filter((r) => r.productId === 1);
    expect(section.querySelectorAll('.ui-review-card')).toHaveLength(reviews.length);
    expect(within(section).getAllByText(new RegExp(fullName(reviews[0].userId))).length).toBeGreaterThan(0);
  });

  it('muestra puntaje promedio y cantidad de reseñas en la cabecera', async () => {
    renderAt('/products/1');
    await loaded(/Notebook Lenovo/);
    const reviews = readData('reviews').filter((r) => r.productId === 1);
    const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
    expect(screen.getByLabelText(`Puntaje ${avg} de 5`)).toHaveTextContent(`${reviews.length} reseñas`);
  });

  it('Add to cart muestra una confirmación; Buy now además lleva al carrito', async () => {
    const user = userEvent.setup();
    renderAt('/products/1');
    await loaded(/Notebook Lenovo/);
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    await user.click(screen.getByRole('button', { name: 'Add to cart' }));
    expect(await screen.findByText('Agregado al carrito')).toBeInTheDocument();
    expect(screen.getByText(/2 × Notebook Lenovo/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Buy now' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/cart');
  });
});

describe('ProductDetailPage · casos particulares', () => {
  it('producto sin stock: avisa y deshabilita la compra', async () => {
    renderAt('/products/4');
    await loaded(/Mochila/);
    expect(screen.getAllByText(/Sin stock|Out of stock/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Buy now' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
  });

  it('producto sin imágenes ni reseñas: muestra placeholders y mensaje vacío', async () => {
    const fetchMock = stubDataFetch();
    const real = fetchMock.getMockImplementation();
    fetchMock.mockImplementation(async (url) =>
      String(url).endsWith('images.json') ? { ok: true, status: 200, json: async () => [] } : real(url),
    );
    renderAt('/products/4');
    await loaded(/Mochila/);
    expect(document.querySelector('.ui-gallery-main img')).toBeNull();
    expect(screen.getByText('Todavía no tiene reseñas')).toBeInTheDocument();
    expect(screen.getByText('Este producto todavía no tiene reseñas.')).toBeInTheDocument();
  });

  it('servicio: muestra duración y modalidad, sin cantidad ni stock', async () => {
    renderAt('/products/6');
    await loaded(/Clases particulares/);
    expect(screen.getByRole('row', { name: /Duración 60 minutos/ })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Modalidad Virtual/ })).toBeInTheDocument();
    expect(screen.queryByText('Quantity:')).not.toBeInTheDocument();
    expect(screen.queryByText(/null/)).not.toBeInTheDocument();
    expect(screen.getByText('✓ Available')).toBeInTheDocument();
  });

  it('pocas unidades: muestra la advertencia de stock bajo', async () => {
    renderAt('/products/8');
    await loaded(/Resaltadores/);
    expect(screen.getByText('⚠ Últimas 8 unidades')).toBeInTheDocument();
  });
});

describe('ProductDetailPage · errores', () => {
  it('producto inexistente muestra "Producto no encontrado" y permite volver al catálogo', async () => {
    const user = userEvent.setup();
    renderAt('/products/9999');
    expect(await screen.findByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ver todos los productos' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/search');
  });

  it('un id no numérico también muestra "Producto no encontrado"', async () => {
    renderAt('/products/abc');
    expect(await screen.findByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument();
  });

  it('si falla la carga muestra el error y permite reintentar', async () => {
    const fetchMock = stubDataFetch();
    fetchMock.mockImplementation(async () => ({ ok: false, status: 500, json: async () => ({}) }));
    const user = userEvent.setup();
    renderAt('/products/1');
    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar el producto');
    stubDataFetch();
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    await loaded(/Notebook Lenovo/);
  });

  it('sin users.json igual muestra la página, con autor genérico y sin vendedor', async () => {
    const fetchMock = stubDataFetch();
    const real = fetchMock.getMockImplementation();
    fetchMock.mockImplementation(async (url) =>
      String(url).endsWith('users.json') ? { ok: false, status: 404, json: async () => ({}) } : real(url),
    );
    renderAt('/products/1');
    await loaded(/Notebook Lenovo/);
    expect(screen.queryByText(/Publicado por/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Usuario/).length).toBeGreaterThan(0);
  });

  it('muestra el estado de carga inicial', () => {
    renderAt('/products/1');
    expect(screen.getByRole('status')).toHaveTextContent('Cargando producto');
    return waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });
});
