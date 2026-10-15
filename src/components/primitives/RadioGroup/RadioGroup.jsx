import '../../ui.css';

const RadioGroup = ({ name, options = [], value, onChange }) => (
  <div className="ui-check-group">
    {options.map((opt) => (
      <label key={opt.value} className="ui-check-item">
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
        />
        {opt.label}
      </label>
    ))}
  </div>
);

export default RadioGroup;
