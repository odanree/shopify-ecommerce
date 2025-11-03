import Link from 'next/link';
import Image from 'next/image';
import { ShopifyCollection } from '@/types/shopify';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
  collection: ShopifyCollection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const { title, handle, description, image, productsCount } = collection;

  return (
    <Link href={`/collections/${handle}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.placeholderIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
              />
            </svg>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        {productsCount !== undefined && (
          <p className={styles.productCount}>
            {productsCount} {productsCount === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>
    </Link>
  );
}
