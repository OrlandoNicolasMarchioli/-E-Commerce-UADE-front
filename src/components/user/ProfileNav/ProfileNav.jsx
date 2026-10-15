import '../../ui.css';

const DEFAULT_ITEMS = [
  { id: 'edit',     label: '✏️ Edit profile' },
  { id: 'password', label: '🔒 Change password' },
  { id: 'orders',   label: '📦 My orders' },
  { id: 'products', label: '🏷️ My listings' },
  { id: 'logout',   label: '🚪 Sign out', danger: true },
];

const ProfileNav = ({ items = DEFAULT_ITEMS, activeId, onChange }) => (
  <nav className="ui-profile-nav">
    {items.map((item) => (
      <div
        key={item.id}
        className={[
          'ui-pn-item',
          activeId === item.id ? 'ui-pn-item--active' : '',
          item.danger ? 'ui-pn-item--danger' : '',
        ].filter(Boolean).join(' ')}
        onClick={() => onChange?.(item.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onChange?.(item.id)}
      >
        {item.label}
      </div>
    ))}
  </nav>
);

export default ProfileNav;
