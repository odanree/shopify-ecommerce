import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
import { ShopifyProduct } from '@/types/shopify';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCardComponent = memo(function ProductCard({ product }: ProductCardProps) {
  const price = product.priceRange.minVariantPrice;

  return (
    <Link href={`/products/${product.handle}`} className={styles.card}>
      <div className={styles.cardInner}>
        {product.featuredImage && (
          <div className={styles.imageWrapper}>
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        )}
        
        <div className={styles.content}>
          {product.vendor && (
            <p className={styles.vendor}>{product.vendor}</p>
          )}
          <h3 className={styles.title}>
            {product.title}
          </h3>
          <p className={styles.price}>
            ${price.amount} {price.currencyCode}
          </p>
          {!product.availableForSale && (
            <p className={styles.outOfStock}>Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
});

export { ProductCardComponent as ProductCard };
