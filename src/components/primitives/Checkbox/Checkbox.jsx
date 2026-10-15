import '../../ui.css';

const Checkbox = ({ label, checked, onChange, disabled = false, name }) => (
  <label className="ui-check-item">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      name={name}
    />
    {label}
  </label>
);

export default Checkbox;
