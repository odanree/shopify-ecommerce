import Link from 'next/link';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header} data-cy="header">
      <div className={styles.container}>
        <nav className={styles.nav} data-cy="header-nav">
          <Link href="/" className={styles.logo} data-cy="logo-link">
            Shopify Store
          </Link>
          
          <div className={styles.navLinks} data-cy="nav-links">
            <Link href="/products" className={styles.navLink} data-cy="products-link">
              Products
            </Link>
            <Link href="/cart" className={styles.navLink} data-cy="cart-link">
              Cart
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
