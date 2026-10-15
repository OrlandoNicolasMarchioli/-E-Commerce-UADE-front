import '../../ui.css';

/** Admin table toolbar with an optional search input, optional children slot (e.g. filters), and an optional Add button. */
const AdminToolbar = ({ searchPlaceholder = 'Search…', onSearch, onAdd, addLabel = 'Add', children }) => (
  <div className="ui-admin-toolbar">
    {onSearch && (
      <div className="ui-search-box" style={{ flex: 1 }}>
        <span className="ui-search-icon">🔍</span>
        <input
          className="ui-search-input"
          type="search"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    )}
    {children}
    {onAdd && (
      <button className="ui-btn ui-btn--primary ui-btn--sm" onClick={onAdd}>
        + {addLabel}
      </button>
    )}
  </div>
);

export default AdminToolbar;
