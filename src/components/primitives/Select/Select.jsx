import '../../ui.css';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  required = false,
  disabled = false,
  id,
}) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="ui-form-group">
      {label && (
        <label className="ui-form-label" htmlFor={selectId}>
          {label} {required && <span className="ui-form-required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`ui-form-select${error ? ' ui-form-select--error' : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="ui-form-error-msg">{error}</span>}
    </div>
  );
};

export default Select;
