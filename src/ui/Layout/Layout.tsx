import { type ReactNode } from 'react';
import { Header } from '../Header/Header';
import { Nav } from '../Nav/Nav';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <Nav />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
