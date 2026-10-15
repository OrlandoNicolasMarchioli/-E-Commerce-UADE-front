import '../../ui.css';

/** Admin table row for a user account; the block/unblock button style and label flip based on user.blocked. */
const UserTableRow = ({ user, onEdit, onToggleBlock }) => (
  <tr>
    <td>
      <div className="ui-avatar ui-avatar--sm">
        {user.avatarUrl
          ? <img src={user.avatarUrl} alt={user.name} />
          : user.name?.[0]?.toUpperCase()}
      </div>
    </td>
    <td>{user.name}</td>
    <td>{user.email}</td>
    <td>{user.role}</td>
    <td>{user.joinDate}</td>
    <td>
      {/* Reusing the stock badge variants as a quick Active/Blocked visual indicator */}
      <span className={`ui-badge ui-badge--${user.blocked ? 'out-of-stock' : 'in-stock'}`}>
        {user.blocked ? 'Blocked' : 'Active'}
      </span>
    </td>
    <td>
      <div className="ui-tr-actions">
        <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={() => onEdit?.(user)}>Edit</button>
        <button
          className={`ui-btn ${user.blocked ? 'ui-btn--outline' : 'ui-btn--danger'} ui-btn--sm`}
          onClick={() => onToggleBlock?.(user)}
        >
          {user.blocked ? 'Unblock' : 'Block'}
        </button>
      </div>
    </td>
  </tr>
);

export default UserTableRow;
