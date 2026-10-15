import { useState } from 'react';
import '../../ui.css';

const QuantityStepper = ({
  value: externalValue,
  onChange,
  min = 1,
  max = 99,
  defaultValue = 1,
}) => {
  const isControlled = externalValue !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const qty = isControlled ? externalValue : internal;

  const update = (next) => {
    if (next < min || next > max) return;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="ui-qty-ctrl">
      <button className="ui-qty-btn" onClick={() => update(qty - 1)} aria-label="Decrease">−</button>
      <span className="ui-qty-val">{qty}</span>
      <button className="ui-qty-btn" onClick={() => update(qty + 1)} aria-label="Increase">+</button>
    </div>
  );
};

export default QuantityStepper;
