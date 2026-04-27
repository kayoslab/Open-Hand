import styles from './Nav.module.css';

const navItems = [
  { label: 'Home', href: '#/' },
  { label: 'Browse', href: '#/browse' },
  { label: 'Play', href: '#/play' },
  { label: 'Draw 3', href: '#/play/draw-three' },
  { label: 'Guide', href: '#/guide' },
];

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <ul className={styles.list}>
        {navItems.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={styles.link}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
