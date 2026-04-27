import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <input
        type="search"
        className={styles.input}
        aria-label="Search cards"
        placeholder="Search cards..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
