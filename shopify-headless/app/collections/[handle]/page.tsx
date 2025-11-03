import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCollection } from '@/lib/shopify';
import { ProductCard } from '@/components/ProductCard';
import styles from './page.module.css';

type Props = {
  params: { handle: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollection(params.handle);

  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }

  return {
    title: `${collection.title} | Shopify Headless`,
    description: collection.description || `Shop our ${collection.title} collection`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const collection = await getCollection(params.handle);

  if (!collection) {
    notFound();
  }

  const { title, description, descriptionHtml, image, products } = collection;

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/collections" className={styles.breadcrumbLink}>
          Collections
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{title}</span>
      </nav>

      {/* Collection Header */}
      <div className={styles.header}>
        {image && (
          <div className={styles.imageContainer}>
            <Image
              src={image.url}
              alt={image.altText || title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority
            />
          </div>
        )}
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{title}</h1>
          {descriptionHtml ? (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
          {products && products.length > 0 && (
            <p className={styles.productCount}>
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {!products || products.length === 0 ? (
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
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          <h2 className={styles.emptyTitle}>No products in this collection</h2>
          <p className={styles.emptyText}>
            Check back soon for new products!
          </p>
          <Link href="/collections" className={styles.backButton}>
            Browse Other Collections
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
