import styles from './Header.module.css';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Open Hand</h1>
      <button
        className={styles.themeToggle}
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        type="button"
      >
        {theme === 'light' ? '\u263E' : '\u2600'}
      </button>
    </header>
  );
}
