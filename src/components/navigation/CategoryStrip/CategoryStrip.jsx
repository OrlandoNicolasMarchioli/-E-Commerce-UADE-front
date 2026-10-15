import '../../ui.css';

/** Horizontal scrollable tab strip for selecting a category; null activeId means "All". */
const CategoryStrip = ({ categories = [], activeId = null, onSelect }) => (
  <div className="ui-cat-strip" role="tablist" aria-label="Categories">
    <div
      className={`ui-cat-chip${activeId === null ? ' ui-cat-chip--active' : ''}`}
      onClick={() => onSelect(null)}
      role="tab"
      aria-selected={activeId === null}
      tabIndex={0}
    >
      All
    </div>
    {categories.map((cat) => (
      <div
        key={cat.id}
        className={`ui-cat-chip${activeId === cat.id ? ' ui-cat-chip--active' : ''}`}
        onClick={() => onSelect(cat.id)}
        role="tab"
        aria-selected={activeId === cat.id}
        tabIndex={0}
      >
        {cat.name}
      </div>
    ))}
  </div>
);

export default CategoryStrip;
