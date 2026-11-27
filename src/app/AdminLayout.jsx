import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar/Navbar';
import { useAuth } from '../context/AuthContext.jsx';
import { selectTheme, toggleTheme } from '../store/preferencesSlice';

/** Layout del panel de administración: Navbar admin + contenido de la ruta. */
const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  // No permitir el acceso si no hay sesión.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // No permitir el acceso a usuarios que no sean ADMIN.
  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-shell">
      <Navbar isAdmin user={user} onNavigate={navigate}
        theme={theme} onToggleTheme={() => dispatch(toggleTheme())} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
