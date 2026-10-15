import '../../ui.css';

// A fixed set of brand-appropriate background colors for avatar initials
const PALETTE = [
  '#002D62', '#0070C0', '#7C3AED', '#059669', '#D97706', '#DC2626', '#2563EB',
];

// Deterministically picks a palette color based on the first character of the name
const colorFromName = (name = '') =>
  PALETTE[name.charCodeAt(0) % PALETTE.length];

/** Circular avatar showing the user's initials; background color is derived from the name unless overridden by color prop. */
const UserAvatar = ({ user, size = 'md', color }) => {
  const initials = `${user?.firstName?.[0] ?? '?'}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  // Use the explicit color override when provided; otherwise pick deterministically from the palette
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
