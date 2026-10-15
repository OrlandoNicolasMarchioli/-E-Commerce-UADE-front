import '../../ui.css';

/** Compact strip showing a product thumbnail, name, and category — used as context above review or order forms. */
const ProductContextStrip = ({ imageUrl, name, category }) => (
  <div className="ui-product-strip">
    <div className="ui-product-strip-img">
      {imageUrl ? <img src={imageUrl} alt={name} /> : '🛍'}
    </div>
    <div>
      <div className="ui-product-strip-name">{name}</div>
      <div className="ui-product-strip-cat">{category}</div>
    </div>
  </div>
);

export default ProductContextStrip;
