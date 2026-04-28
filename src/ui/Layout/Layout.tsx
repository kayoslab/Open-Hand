import { type ReactNode } from 'react';
import { Header } from '../Header/Header';
import { Nav } from '../Nav/Nav';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Layout({ children, theme, onToggleTheme }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      <Nav />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
