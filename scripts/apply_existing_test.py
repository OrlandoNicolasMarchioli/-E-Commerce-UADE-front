"""Adecua las pruebas existentes a los providers y al carrito mock.

Ejecutar desde la raíz del repositorio DESPUÉS de copiar los archivos de Parte 2:
    python scripts/apply_existing_tests.py
No toca los tests que no requieren cambios y se puede ejecutar una sola vez.
"""
from pathlib import Path


def change(file, substitutions):
    path = Path(file)
    text = path.read_text(encoding="utf-8")
    for before, after in substitutions:
        if after and after in text:
            continue  # Ya aplicado; evita duplicar providers.
        if before not in text:
            raise SystemExit(f"No encontré un bloque esperado en {file}: {before[:65]!r}")
        text = text.replace(before, after, 1)
    path.write_text(text, encoding="utf-8")
    print(f"Actualizado: {file}")


change("src/tests/app/App.test.jsx", [
    (
        "import App from '../../App';\n",
        "import App from '../../App';\n"
        "import { AuthProvider } from '../../context/AuthContext';\n"
        "import { CartProvider } from '../../context/CartContext';\n",
    ),
    (
        "beforeEach(() => {\n  stubDataFetch();\n});",
        "beforeEach(() => {\n  localStorage.clear(); // Aísla sesiones entre pruebas.\n  stubDataFetch();\n});",
    ),
    (
        "<MemoryRouter initialEntries={[path]}>\n      <App />\n    </MemoryRouter>",
        "<MemoryRouter initialEntries={[path]}>\n"
        "      <AuthProvider><CartProvider><App /></CartProvider></AuthProvider>\n"
        "    </MemoryRouter>",
    ),
    ("    ['/cart', 'Carrito'],\n", ""),
    ("    ['/my-orders', 'Mis compras'],\n", ""),
    ("    ['/my-orders/7', 'Detalle de compra'],\n", ""),
    (
        "it('el botón del carrito va a /cart'",
        "it('el carrito sin sesión redirige a login'",
    ),
    (
        "expect(screen.getByRole('heading', { level: 1, name: 'Carrito' })).toBeInTheDocument();",
        "expect(screen.getByRole('heading', { level: 1, name: 'Iniciar sesión' })).toBeInTheDocument();",
    ),
])

change("src/tests/pages/ProductDetailPage.test.jsx", [
    (
        "import ProductDetailPage from '../../pages/ProductDetailPage/ProductDetailPage';\n",
        "import ProductDetailPage from '../../pages/ProductDetailPage/ProductDetailPage';\n"
        "import { AuthProvider } from '../../context/AuthContext';\n"
        "import { CartProvider } from '../../context/CartContext';\n",
    ),
    (
        "<MemoryRouter initialEntries={[path]}>\n      <Routes>\n"
        "        <Route path=\"/products/:id\" element={<ProductDetailPage />} />\n"
        "        <Route path=\"*\" element={<Where />} />\n"
        "      </Routes>\n    </MemoryRouter>",
        "<MemoryRouter initialEntries={[path]}>\n"
        "      <AuthProvider><CartProvider>\n"
        "        <Routes>\n"
        "          <Route path=\"/products/:id\" element={<ProductDetailPage />} />\n"
        "          <Route path=\"*\" element={<Where />} />\n"
        "        </Routes>\n"
        "      </CartProvider></AuthProvider>\n"
        "    </MemoryRouter>",
    ),
    (
        "beforeEach(() => {\n  stubDataFetch();\n});",
        "beforeEach(() => {\n  localStorage.clear();\n  stubDataFetch();\n});",
    ),
    (
        "  it('Add to cart muestra una confirmación; Buy now además lleva al carrito', async () => {\n"
        "    const user = userEvent.setup();\n"
        "    renderAt('/products/1');\n"
        "    await loaded(/Notebook Lenovo/);\n"
        "    await user.click(screen.getByRole('button', { name: 'Increase' }));\n"
        "    await user.click(screen.getByRole('button', { name: 'Add to cart' }));\n"
        "    expect(await screen.findByText('Agregado al carrito')).toBeInTheDocument();\n"
        "    expect(screen.getByText(/2 × Notebook Lenovo/)).toBeInTheDocument();\n"
        "    await user.click(screen.getByRole('button', { name: 'Buy now' }));\n"
        "    expect(screen.getByTestId('where')).toHaveTextContent('/cart');\n"
        "  });",
        "  it('sin sesión el carrito redirige a login y no confirma una compra falsa', async () => {\n"
        "    const user = userEvent.setup();\n"
        "    renderAt('/products/1');\n"
        "    await loaded(/Notebook Lenovo/);\n"
        "    await user.click(screen.getByRole('button', { name: 'Add to cart' }));\n"
        "    expect(screen.getByTestId('where')).toHaveTextContent('/login');\n"
        "    expect(screen.queryByText('Agregado al carrito')).not.toBeInTheDocument();\n"
        "  });",
    ),
])