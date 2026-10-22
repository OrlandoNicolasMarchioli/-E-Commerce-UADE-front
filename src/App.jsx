import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './app/Layout';
import AdminLayout from './app/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
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

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="category/:id" element={<CategoryPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Parte 2: carrito e historial solamente para sesiones autenticadas. */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="my-orders/:id" element={<OrderDetailPage />} />
        </Route>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Protección por rol ADMIN pendiente para la Parte 3, como acordamos. */}
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