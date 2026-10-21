import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './app/Layout';
import AdminLayout from './app/AdminLayout';
import HomePage from './pages/HomePage/HomePage';
import SearchPage from './pages/SearchPage/SearchPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import CartPage from './pages/CartPage/CartPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage/OrderDetailPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminProductsPage from './pages/AdminProductsPage/AdminProductsPage';
import ProductFormPage from './pages/ProductFormPage/ProductFormPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage/AdminCategoriesPage';
import AdminUsersPage from './pages/AdminUsersPage/AdminUsersPage';
import AdminOrdersPage from './pages/AdminOrdersPage/AdminOrdersPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

/** Mapa de rutas de la app (coincide con docs/02-matriz-cobertura.md). */
function App() {
  return (
    <Routes>
      {/* Zona pública y de usuario */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="category/:id" element={<CategoryPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="my-orders" element={<MyOrdersPage />} />
        <Route path="my-orders/:id" element={<OrderDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Panel de administración */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
