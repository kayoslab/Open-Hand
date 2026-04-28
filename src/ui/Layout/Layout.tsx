import { type ReactNode } from 'react';
import { Nav } from '../Nav/Nav';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isHomePage?: boolean;
}

export function Layout({ children, theme, onToggleTheme, isHomePage }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Nav theme={theme} onToggleTheme={onToggleTheme} />
      <main className={`${styles.main} ${isHomePage ? styles.mainFullBleed : ''}`}>
        {children}
      </main>
    </div>
  );
}
