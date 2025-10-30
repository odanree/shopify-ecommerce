import Link from 'next/link';
import Image from 'next/image';
import { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.priceRange.minVariantPrice;

  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {product.featuredImage && (
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        )}
        
        <div className="p-4">
          {product.vendor && (
            <p className="text-sm text-gray-500 mb-1">{product.vendor}</p>
          )}
          <h3 className="font-semibold mb-2 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-lg font-bold">
            ${price.amount} {price.currencyCode}
          </p>
          {!product.availableForSale && (
            <p className="text-red-500 text-sm mt-2">Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}
