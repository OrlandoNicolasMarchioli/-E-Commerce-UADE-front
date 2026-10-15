import { useState } from 'react';
import '../../ui.css';

const ProductImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="ui-gallery">
      <div className="ui-gallery-main">
        {active?.url
          ? <img src={active.url} alt={`Image ${activeIndex + 1}`} />
          : '📷 Main image'}
      </div>
      {images.length > 1 && (
        <div className="ui-gallery-thumbs">
          {images.map((img, i) => (
            <div
              key={i}
              className={`ui-gallery-thumb${i === activeIndex ? ' ui-gallery-thumb--active' : ''}`}
              onClick={() => setActiveIndex(i)}
              role="button"
              aria-label={`Thumbnail ${i + 1}`}
              tabIndex={0}
            >
              {img.url ? <img src={img.url} alt={`Thumbnail ${i + 1}`} /> : i + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
