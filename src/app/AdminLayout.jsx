import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar/Navbar';

/** Layout del panel de administración: Navbar admin + contenido de la ruta. */
const AdminLayout = () => {
  const navigate = useNavigate();

  // TODO (Parte 3): tomar el usuario del AuthContext y proteger estas rutas para el rol ADMIN.
  const user = { firstName: 'Admin' };

  return (
    <div className="app-shell">
      <Navbar isAdmin user={user} onNavigate={navigate} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
