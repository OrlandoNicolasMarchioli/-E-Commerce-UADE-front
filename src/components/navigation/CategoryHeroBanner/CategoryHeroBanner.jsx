import '../../ui.css';

/** Hero banner for a category page showing its icon, title, description, and optional product count pill. */
const CategoryHeroBanner = ({ icon, title, description, productCount }) => (
  <div className="ui-cat-hero">
    <div className="ui-cat-hero-icon">{icon}</div>
    <div>
      <div className="ui-cat-hero-title">{title}</div>
      <div className="ui-cat-hero-sub">{description}</div>
      {productCount != null && (
        <span className="ui-cat-hero-pill">{productCount} products</span>
      )}
    </div>
  </div>
);

export default CategoryHeroBanner;
