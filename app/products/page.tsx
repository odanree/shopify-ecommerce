import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/ProductCard';
import styles from './ProductsPage.module.css';

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Products</h1>
      
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
