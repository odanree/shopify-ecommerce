import Link from 'next/link';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            Shopify Store
          </Link>
          
          <div className={styles.navLinks}>
            <Link href="/products" className={styles.navLink}>
              Products
            </Link>
            <Link href="/cart" className={styles.navLink}>
              Cart
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
