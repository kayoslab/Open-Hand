import { useState } from 'react';
import styles from './Nav.module.css';

interface NavProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const navItems = [
  { label: 'The Deck', href: '#/browse' },
  { label: 'How It Works', href: '#/guide' },
  { label: 'For Teams', href: '#/for-teams' },
  { label: 'Resources', href: '#/resources' },
  { label: 'About', href: '#/about' },
];

export function Nav({ theme, onToggleTheme }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.topBar}>
      <a href="#/" className={styles.logo} aria-label="Open Hand home">
        <img src="/images/logo.png" alt="" className={styles.logoImg} />
      </a>

      <nav
        className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
        aria-label="Main navigation"
      >
        <ul className={styles.list}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.actions}>
        <a href="#/browse" className={styles.cta}>
          Get Your Deck
        </a>
        <button
          className={styles.themeToggle}
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          type="button"
        >
          {theme === 'light' ? '\u263E' : '\u2600'}
        </button>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          type="button"
        >
          <span className={`${styles.hamburgerIcon} ${menuOpen ? styles.hamburgerOpen : ''}`} />
        </button>
      </div>
    </header>
  );
}
