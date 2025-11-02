import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.heading}>About Us</h3>
            <p className={styles.text}>
              Your premium ecommerce destination powered by Shopify.
            </p>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.heading}>Quick Links</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <a href="/products" className={styles.link}>Products</a>
              </li>
              <li className={styles.listItem}>
                <a href="/cart" className={styles.link}>Cart</a>
              </li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.heading}>Contact</h3>
            <p className={styles.text}>
              Email: support@example.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Shopify Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
