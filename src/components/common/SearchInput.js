import Icon from './Icon';
import '../../styles/forms.css';

export default function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="search-input">
      <Icon name="search" size={16} />
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
