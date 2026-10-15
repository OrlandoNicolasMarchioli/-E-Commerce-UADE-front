import '../../ui.css';

/** Displays the active filters as removable tags; renders nothing when the filters array is empty. */
const ActiveFilterTags = ({ filters = [], onRemove, onClearAll }) => {
  if (!filters.length) return null;
  return (
    <div className="ui-active-filters">
      {filters.map((f) => (
        <span key={f.id} className="ui-filter-tag">
          <span>{f.label}</span>
          <button className="ui-filter-tag-remove" onClick={() => onRemove?.(f.id)} aria-label={`Remove ${f.label}`}>×</button>
        </span>
      ))}
      {onClearAll && (
        <button className="ui-btn ui-btn--ghost ui-btn--sm" onClick={onClearAll}>Clear all</button>
      )}
    </div>
  );
};

export default ActiveFilterTags;
