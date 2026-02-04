import { Metadata } from 'next';
import { getCollections } from '@/lib/shopify';
import { ShopifyCollection } from '@/types/shopify';
import CollectionCard from '@/components/CollectionCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Collections | Shopify Headless',
  description: 'Browse our product collections',
};

export default async function CollectionsPage() {
  let collections: ShopifyCollection[] = [];
  
  // Handle cases where API credentials are not available (e.g., during preview builds)
  try {
    collections = await getCollections();
  } catch (error) {
    console.warn('Failed to fetch collections during build:', error);
    // During build time without API credentials, return empty state
    // This allows the build to complete; live data loads on client access
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Collections</h1>
        <p className={styles.subtitle}>
          Explore our curated product collections
        </p>
      </div>

      {collections.length === 0 ? (
        <div className={styles.empty}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.emptyIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          <h2 className={styles.emptyTitle}>No collections found</h2>
          <p className={styles.emptyText}>
            Collections will appear here once they are created.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}
