import { Suspense } from 'react';
import { searchProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/ProductCard';
import { ShopifyProduct } from '@/types/shopify';
import styles from './search.module.css';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query: string = searchParams.q || '';
  
  let products: ShopifyProduct[] = [];
  let error: string | null = null;

  if (query) {
    try {
      products = await searchProducts(query);
    } catch (e) {
      error = 'Failed to fetch search results';
      console.error(e);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Search Results</h1>
        {query && <p className={styles.query}>Showing results for &quot;{query}&quot;</p>}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {!query && !error && (
        <p className={styles.emptyState}>Enter a search term to find products</p>
      )}

      {query && !error && products.length === 0 && (
        <p className={styles.emptyState}>No products found for &quot;{query}&quot;</p>
      )}

      {products.length > 0 && (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
