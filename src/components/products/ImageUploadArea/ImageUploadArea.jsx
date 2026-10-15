import { useRef } from 'react';
import '../../ui.css';

const ImageUploadArea = ({ images = [], onAdd, onRemove }) => {
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => onAdd?.({ file, url: e.target.result });
      reader.readAsDataURL(file);
    });
  };

  const onDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };
  const onDragOver = (e) => e.preventDefault();

  return (
    <div>
      <div
        className="ui-image-upload"
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        role="button"
        tabIndex={0}
        aria-label="Upload images"
      >
        <div className="ui-image-upload-icon">📷</div>
        <div className="ui-image-upload-text">Click or drag to upload images</div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {images.length > 0 && (
        <div className="ui-image-list">
          {images.map((img, i) => (
            <div key={i} className="ui-image-item">
              <img src={img.url} alt={`upload-${i}`} />
              <button className="ui-image-item-remove" onClick={() => onRemove?.(i)} aria-label="Remove image">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadArea;
