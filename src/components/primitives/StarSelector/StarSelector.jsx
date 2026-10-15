import { useState } from 'react';
import '../../ui.css';

const StarSelector = ({
  value: externalValue,
  onChange,
  defaultValue = 0,
  readOnly = false,
}) => {
  const isControlled = externalValue !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const [hovered, setHovered]   = useState(0);
  const rating  = isControlled ? externalValue : internal;
  const display = hovered || rating;

  const select = (star) => {
    if (readOnly) return;
    if (!isControlled) setInternal(star);
    onChange?.(star);
  };

  return (
    <div className="ui-star-selector" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`ui-star${star <= display ? ' ui-star--on' : ''}`}
          onClick={() => select(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          role={readOnly ? undefined : 'radio'}
          aria-checked={star === rating}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarSelector;
