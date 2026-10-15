import '../../ui.css';

/** Generic empty state with an icon, title, description, and an optional action button. */
const EmptyState = ({ icon = '📦', title, description, action }) => (
  <div className="ui-empty-state">
    <div className="ui-es-icon">{icon}</div>
    <div className="ui-es-title">{title}</div>
    <p className="ui-es-sub">{description}</p>
    {action && (
      <button className="ui-btn ui-btn--primary ui-btn--md" onClick={action.onClick}>
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
