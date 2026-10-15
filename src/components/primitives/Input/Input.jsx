import '../../ui.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  hint,
  error,
  disabled = false,
  required = false,
  id,
}) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="ui-form-group">
      {label && (
        <label className="ui-form-label" htmlFor={inputId}>
          {label} {required && <span className="ui-form-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`ui-form-input${error ? ' ui-form-input--error' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {hint && !error && <span className="ui-form-hint">{hint}</span>}
      {error && <span className="ui-form-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
