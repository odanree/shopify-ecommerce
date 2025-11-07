import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './Header.module.css';

// Lazy load SearchBar - not critical for initial render
const SearchBar = dynamic(() => import('./SearchBar').then(mod => ({ default: mod.SearchBar })), {
  ssr: false,
  loading: () => <div style={{ width: '200px', height: '40px' }} />,
});

export function Header() {
  return (
    <header className={styles.header} data-cy="header">
      <div className={styles.container}>
        <nav className={styles.nav} data-cy="header-nav">
          <Link href="/" className={styles.logo} data-cy="logo-link">
            Shopify Store
          </Link>
          
          <SearchBar />
          
          <div className={styles.navLinks} data-cy="nav-links">
            <Link href="/products" className={styles.navLink} data-cy="products-link">
              Products
            </Link>
            <Link href="/collections" className={styles.navLink} data-cy="collections-link">
              Collections
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
