import { useState } from 'react';
import '../../ui.css';

const SearchInput = ({
  value: externalValue,
  onChange,
  onSearch,
  placeholder = 'Search products...',
}) => {
  const isControlled = externalValue !== undefined;
  const [internal, setInternal] = useState('');
  const val = isControlled ? externalValue : internal;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e.target.value);
  };

  const handleSearch = () => onSearch?.(val);

  return (
    <div className="ui-search-wrap">
      <input
        type="text"
        value={val}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder}
        aria-label="Search field"
      />
      <button className="ui-search-btn" onClick={handleSearch} aria-label="Search">🔍</button>
    </div>
  );
};

export default SearchInput;
