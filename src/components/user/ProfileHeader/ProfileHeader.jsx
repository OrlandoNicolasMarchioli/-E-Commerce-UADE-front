import '../../ui.css';

/** Displays the user's avatar, full name, email, optional registration number, and active/inactive status. */
const ProfileHeader = ({ user }) => {
  const { firstName, lastName, email, regNumber, isEnabled } = user;
  return (
    <div className="ui-profile-header">
      <div className="ui-ph-avatar">👤</div>
      <div>
        <div className="ui-ph-name">{firstName} {lastName}</div>
        <div className="ui-ph-meta">
          {email}{regNumber ? ` · ID: ${regNumber}` : ''}
        </div>
        <span className="ui-ph-badge">
          {isEnabled ? 'Active user' : 'Inactive account'}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
