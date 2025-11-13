import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/ProductCard';
import styles from './page.module.css';

// Lazy load components - below the fold content
const HeroCarousel = dynamicImport(() => import('@/components/HeroCarousel').then(mod => ({ default: mod.HeroCarousel })), {
  ssr: true,  // ✅ SSR enabled - LazyMotion prevents Framer Motion useInsertionEffect errors
  loading: () => <div style={{ minHeight: '500px', background: '#f5f5f5' }} />,
});

const FamilyPlanPromo = dynamicImport(() => import('@/components/FamilyPlanPromo').then(mod => ({ default: mod.FamilyPlanPromo })), {
  ssr: true,
  loading: () => <div style={{ minHeight: '200px' }} />,
});

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

// Mock hero carousel images - replace with real product images
const heroImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop',
    alt: 'Premium Tech Apparel',
    title: 'Premium Tech Collection',
    description: 'High-quality t-shirts designed for tech enthusiasts',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
    alt: 'Latest Innovation',
    title: 'Latest Innovation',
    description: 'Discover our newest designs and exclusive releases',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1515909335684-cf51ea0f3155?w=1200&h=600&fit=crop',
    alt: 'Signature Style',
    title: 'Signature Style',
    description: 'Express yourself with our timeless collection',
  },
];

export default async function Home() {
  const products = await getProducts();

  return (
    <div className={styles.container} data-cy="homepage-container">
      {/* Hero Section - Above the Fold */}
      <section className={styles.heroSection} data-cy="hero-section">
        <div className={styles.heroContent}>
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
        </div>
      </section>

      {/* Hero Carousel - Image Section with Lazy Loading */}
      <HeroCarousel images={heroImages} />

      {/* Featured Products Section - After Carousel */}
      <section className={styles.productsSection} data-cy="featured-products-section">
        <h2 className={styles.sectionTitle} data-cy="featured-products-title">Featured Products</h2>
        <div className={styles.productsGrid} data-cy="featured-products-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Family Plan Promo Section */}
      <FamilyPlanPromo />
    </div>
  );
}
