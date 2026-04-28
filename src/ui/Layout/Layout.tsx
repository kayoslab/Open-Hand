import { type ReactNode } from 'react';
import { Nav } from '../Nav/Nav';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  isHomePage?: boolean;
}

export function Layout({ children, isHomePage }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Nav />
      <main className={`${styles.main} ${isHomePage ? styles.mainFullBleed : ''}`}>
        {children}
      </main>
    </div>
  );
}
