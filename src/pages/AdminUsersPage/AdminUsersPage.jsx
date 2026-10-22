import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const USERS_URL = '/data/users.json';

const formatDate = (date) => {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '—';

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
  }).format(parsed);
};

const getFullName = (user) =>
  [user.firstName, user.lastName].filter(Boolean).join(' ') ||
  user.name ||
  'Sin nombre';

const getRole = (user) => String(user.role ?? 'UNKNOWN').toUpperCase();

const getRoleLabel = (role) => {
  if (role === 'ADMIN') return 'Administrador';
  if (role === 'USER') return 'Usuario';
  return 'No informado';
};

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(USERS_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar los usuarios.');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('El archivo de usuarios tiene un formato inválido.');
        }

        setUsers(data);
      } catch (err) {
        if (err.name === 'AbortError') return;

        setError(
          err instanceof TypeError
            ? 'No se pudo acceder al archivo de usuarios.'
            : err.message
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadUsers();

    return () => controller.abort();
  }, []);

  const currentUserId = currentUser?.id;
  const currentUserEmail = String(currentUser?.email ?? '').toLowerCase();

  const isCurrentUser = (candidate) =>
    (currentUserId != null &&
      String(candidate.id) === String(currentUserId)) ||
    (currentUserEmail !== '' &&
      String(candidate.email ?? '').toLowerCase() === currentUserEmail);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es');

    const result = users.filter((candidate) => {
      const fullName = getFullName(candidate).toLocaleLowerCase('es');
      const email = String(candidate.email ?? '').toLocaleLowerCase('es');
      const regNumber = String(candidate.regNumber ?? '').toLowerCase();

      const matchesSearch =
        !term ||
        fullName.includes(term) ||
        email.includes(term) ||
        regNumber.includes(term);

      const role = getRole(candidate);
      const matchesRole = roleFilter === 'ALL' || role === roleFilter;

      const enabled = candidate.isEnabled === true;
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && enabled) ||
        (statusFilter === 'INACTIVE' && !enabled);

      return matchesSearch && matchesRole && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortOrder === 'AZ') {
        return getFullName(a).localeCompare(getFullName(b), 'es');
      }

      if (sortOrder === 'ZA') {
        return getFullName(b).localeCompare(getFullName(a), 'es');
      }

      if (sortOrder === 'OLDEST') {
        return (
          new Date(a.registrationDate ?? 0).getTime() -
          new Date(b.registrationDate ?? 0).getTime()
        );
      }

      return (
        new Date(b.registrationDate ?? 0).getTime() -
        new Date(a.registrationDate ?? 0).getTime()
      );
    });

    return result;
  }, [users, search, roleFilter, statusFilter, sortOrder]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((candidate) => candidate.isEnabled === true).length,
      inactive: users.filter((candidate) => candidate.isEnabled !== true).length,
      admins: users.filter((candidate) => getRole(candidate) === 'ADMIN').length,
    }),
    [users]
  );

  const handleDelete = () => {
    if (!userToDelete) return;

    if (isCurrentUser(userToDelete)) {
      setFeedback('No podés eliminar tu propio usuario.');
      setUserToDelete(null);
      return;
    }

    setUsers((previous) =>
      previous.filter((candidate) => candidate.id !== userToDelete.id)
    );

    setFeedback(
      `El usuario "${getFullName(userToDelete)}" se quitó de la lista local.`
    );

    setUserToDelete(null);
  };

  return (
    <section className="admin-users">
      <header className="admin-users__header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Consultá los usuarios registrados y su estado.</p>
        </div>
      </header>

      <section className="admin-users__stats" aria-label="Estadísticas de usuarios">
        <article className="admin-users__stat">
          <span className="admin-users__stat-value">{stats.total}</span>
          <span className="admin-users__stat-label">Total de usuarios</span>
        </article>
        <article className="admin-users__stat">
          <span className="admin-users__stat-value">{stats.active}</span>
          <span className="admin-users__stat-label">Activos</span>
        </article>
        <article className="admin-users__stat">
          <span className="admin-users__stat-value">{stats.inactive}</span>
          <span className="admin-users__stat-label">Inactivos</span>
        </article>
        <article className="admin-users__stat">
          <span className="admin-users__stat-value">{stats.admins}</span>
          <span className="admin-users__stat-label">Administradores identificados</span>
        </article>
      </section>

      {feedback && (
        <div className="admin-users__feedback" role="status">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback('')}>
            Cerrar
          </button>
        </div>
      )}

      <div className="admin-users__toolbar">
        <input
          className="admin-users__search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre, email o legajo..."
          aria-label="Buscar usuarios"
        />

        <select
          className="admin-users__select"
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          aria-label="Filtrar por rol"
        >
          <option value="ALL">Todos los roles</option>
          <option value="ADMIN">Administrador</option>
          <option value="USER">Usuario</option>
          <option value="UNKNOWN">No informado</option>
        </select>

        <select
          className="admin-users__select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
        </select>

        <select
          className="admin-users__select"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          aria-label="Ordenar usuarios"
        >
          <option value="NEWEST">Registro: más recientes</option>
          <option value="OLDEST">Registro: más antiguos</option>
          <option value="AZ">Nombre: A-Z</option>
          <option value="ZA">Nombre: Z-A</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-users__state" role="status">
          Cargando usuarios...
        </div>
      ) : error ? (
        <div className="admin-users__state" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      ) : (
        <div className="admin-users__table-wrap">
          <table className="admin-users__table">
            <thead>
              <tr>
                <th scope="col">Usuario</th>
                <th scope="col">Legajo</th>
                <th scope="col">Rol</th>
                <th scope="col">Registro</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((candidate) => {
                const isSelf = isCurrentUser(candidate);

                return (
                  <tr key={candidate.id}>
                    <td>
                      <div className="admin-users__user">
                        <div className="admin-users__avatar" aria-hidden="true">
                          {`${candidate.firstName?.[0] ?? ''}${candidate.lastName?.[0] ?? ''}`.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="admin-users__name">
                            {getFullName(candidate)}
                            {isSelf && (
                              <span className="admin-users__self"> (Vos)</span>
                            )}
                          </div>
                          <div className="admin-users__email">
                            {candidate.email ?? 'Sin email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{candidate.regNumber ?? '—'}</td>
                    <td>
                      <span
                        className={`admin-users__role admin-users__role--${getRole(candidate).toLowerCase()}`}
                      >
                        {getRoleLabel(getRole(candidate))}
                      </span>
                    </td>
                    <td>{formatDate(candidate.registrationDate)}</td>
                    <td>
                      <span
                        className={`admin-users__status ${
                          candidate.isEnabled === true
                            ? 'admin-users__status--active'
                            : 'admin-users__status--inactive'
                        }`}
                      >
                        {candidate.isEnabled === true ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-users__actions">
                        <button
                          type="button"
                          className="admin-users__view"
                          onClick={() => setSelectedUser(candidate)}
                        >
                          Ver detalle
                        </button>
                        <button
                          type="button"
                          className="admin-users__delete"
                          disabled={isSelf}
                          title={isSelf ? 'No podés eliminar tu propio usuario' : 'Eliminar usuario'}
                          onClick={() => setUserToDelete(candidate)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-users__empty">
                    No se encontraron usuarios con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="admin-users__footnote">
        Los datos se cargan desde un JSON estático. Los roles no están incluidos
        en ese archivo y las eliminaciones son temporales.
      </p>

      {selectedUser && (
        <div
          className="admin-users__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedUser(null);
          }}
        >
          <section
            className="admin-users__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-detail-title"
          >
            <h2 id="user-detail-title">Detalle del usuario</h2>

            <dl className="admin-users__details">
              <div><dt>ID</dt><dd>{selectedUser.id}</dd></div>
              <div><dt>Nombre</dt><dd>{getFullName(selectedUser)}</dd></div>
              <div><dt>Email</dt><dd>{selectedUser.email ?? '—'}</dd></div>
              <div><dt>Legajo</dt><dd>{selectedUser.regNumber ?? '—'}</dd></div>
              <div><dt>Rol</dt><dd>{getRoleLabel(getRole(selectedUser))}</dd></div>
              <div><dt>Fecha de registro</dt><dd>{formatDate(selectedUser.registrationDate)}</dd></div>
              <div>
                <dt>Estado</dt>
                <dd>{selectedUser.isEnabled === true ? 'Activo' : 'Inactivo'}</dd>
              </div>
            </dl>

            <div className="admin-users__modal-actions">
              <button type="button" onClick={() => setSelectedUser(null)}>
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}

      {userToDelete && (
        <div
          className="admin-users__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setUserToDelete(null);
          }}
        >
          <section
            className="admin-users__modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            aria-describedby="delete-user-description"
          >
            <h2 id="delete-user-title">¿Eliminar usuario?</h2>
            <p id="delete-user-description">
              ¿Querés quitar a "{getFullName(userToDelete)}" de la lista actual?
              El archivo original no se modificará.
            </p>
            <div className="admin-users__modal-actions">
              <button type="button" onClick={() => setUserToDelete(null)}>
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

export default AdminUsersPage;
