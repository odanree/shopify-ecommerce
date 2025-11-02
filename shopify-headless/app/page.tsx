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
    <div className={styles.container} data-cy="homepage-container">
      {/* Hero Section */}
      <section className={styles.hero} data-cy="hero-section">
        <h1 className={styles.heroTitle} data-cy="hero-title">
          Welcome to Our Store
        </h1>
        <p className={styles.heroSubtitle} data-cy="hero-subtitle">
          Discover amazing products powered by Shopify
        </p>
        <div className={styles.heroButtons} data-cy="hero-buttons">
          <Link 
            href="/products"
            className={`${styles.button} ${styles.buttonPrimary}`}
            data-cy="shop-now-button"
          >
            Shop Now
          </Link>
          <Link 
            href="/family-plan"
            className={`${styles.button} ${styles.buttonSecondary}`}
            data-cy="build-family-plan-button"
          >
            Build Family Plan
          </Link>
        </div>
      </section>

      {/* Family Plan Promo Section */}
      <FamilyPlanPromo />

      {/* Featured Products */}
      <section className={styles.productsSection} data-cy="featured-products-section">
        <h2 className={styles.sectionTitle} data-cy="featured-products-title">Featured Products</h2>
        <div className={styles.productsGrid} data-cy="featured-products-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
