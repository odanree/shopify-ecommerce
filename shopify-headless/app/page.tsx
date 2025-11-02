import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/ProductCard';
import { FamilyPlanPromo } from '@/components/FamilyPlanPromo';
import styles from './page.module.css';

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Welcome to Our Store
        </h1>
        <p className={styles.heroSubtitle}>
          Discover amazing products powered by Shopify
        </p>
        <div className={styles.heroButtons}>
          <Link 
            href="/products"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            Shop Now
          </Link>
          <Link 
            href="/family-plan"
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            Build Family Plan
          </Link>
        </div>
      </section>

      {/* Family Plan Promo Section */}
      <FamilyPlanPromo />

      {/* Featured Products */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.productsGrid}>
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
