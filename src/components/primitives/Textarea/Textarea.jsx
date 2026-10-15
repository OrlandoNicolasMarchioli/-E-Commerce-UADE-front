import '../../ui.css';

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  required = false,
  rows = 4,
  id,
}) => {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="ui-form-group">
      {label && (
        <label className="ui-form-label" htmlFor={textareaId}>
          {label} {required && <span className="ui-form-required">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className="ui-form-textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
      {hint && !error && <span className="ui-form-hint">{hint}</span>}
      {error && <span className="ui-form-error-msg">{error}</span>}
    </div>
  );
};

export default Textarea;
