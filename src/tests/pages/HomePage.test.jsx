import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../../pages/HomePage/HomePage';
import { stubDataFetch } from '../../test/mockDataFetch';

const Where = () => <div data-testid="where">{useLocation().pathname}</div>;

// ProductCard es un <article role="button">, por eso se busca por su clase y no por rol.
const getCards = () => document.querySelectorAll('.ui-product-card');
// Espera a que terminen las dos cargas (productos y categorías) para no dejar actualizaciones pendientes.
const waitForCards = async () => {
  await waitFor(() => expect(getCards().length).toBeGreaterThan(0));
  await screen.findByRole('tab', { name: 'Tecnología' });
  return [...getCards()];
};

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  stubDataFetch();
});

describe('HomePage', () => {
  it('muestra el estado de carga y después los productos destacados', async () => {
    renderHome();
    expect(screen.getByRole('status')).toHaveTextContent('Cargando productos');
    const cards = await waitForCards();
    expect(cards.length).toBeGreaterThan(0);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('muestra como máximo 8 productos destacados', async () => {
    renderHome();
    const cards = await waitForCards();
    expect(cards.length).toBeLessThanOrEqual(8);
  });

  it('muestra el banner principal y la barra de categorías cargada desde el JSON', async () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1, name: /Todo lo que necesitás/ })).toBeInTheDocument();
    expect(await screen.findByRole('tab', { name: 'Tecnología' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
    await waitForCards(); // deja terminar la carga de productos
  });

  it('elegir una categoría navega a /category/:id', async () => {
    const user = userEvent.setup();
    renderHome();
    await waitForCards();
    await user.click(await screen.findByRole('tab', { name: 'Tecnología' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/category/1');
  });

  it('hacer click en un producto navega a su detalle', async () => {
    const user = userEvent.setup();
    renderHome();
    const [first] = await waitForCards();
    await user.click(first);
    expect(screen.getByTestId('where').textContent).toMatch(/^\/products\/\d+$/);
  });

  it('"Ver todos" navega a /search', async () => {
    const user = userEvent.setup();
    renderHome();
    await waitForCards();
    await user.click(screen.getByRole('link', { name: /Ver todos/ }));
    expect(screen.getByTestId('where')).toHaveTextContent('/search');
  });

  it('si falla la carga muestra el error y permite reintentar', async () => {
    const fetchMock = stubDataFetch();
    fetchMock.mockImplementation(async () => ({ ok: false, status: 500, json: async () => ({}) }));
    const user = userEvent.setup();
    renderHome();
    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar los productos');

    // el servicio vuelve a responder bien
    stubDataFetch();
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect((await waitForCards()).length).toBeGreaterThan(0);
  });
});
