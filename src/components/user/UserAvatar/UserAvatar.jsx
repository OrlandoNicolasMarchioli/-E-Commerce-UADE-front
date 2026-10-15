import '../../ui.css';

const PALETTE = [
  '#002D62', '#0070C0', '#7C3AED', '#059669', '#D97706', '#DC2626', '#2563EB',
];

const colorFromName = (name = '') =>
  PALETTE[name.charCodeAt(0) % PALETTE.length];

const UserAvatar = ({ user, size = 'md', color }) => {
  const initials = `${user?.firstName?.[0] ?? '?'}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  const bg       = color ?? colorFromName(user?.firstName);

  return (
    <div
      className={`ui-user-avatar ui-avatar--${size}`}
      style={{ background: bg }}
      aria-label={`Avatar of ${user?.firstName} ${user?.lastName}`}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
