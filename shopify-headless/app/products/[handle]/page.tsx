import { getProduct } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { AddToCart } from '@/components/AddToCart';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  const defaultVariant = product.variants[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square">
          {product.featuredImage && (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          
          {product.vendor && (
            <p className="text-gray-600 mb-2">by {product.vendor}</p>
          )}

          <div className="text-3xl font-bold mb-6">
            ${defaultVariant.price.amount}
          </div>

          <div 
            className="prose mb-6"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          <AddToCart 
            variantId={defaultVariant.id}
            availableForSale={product.availableForSale}
            productTitle={product.title}
            productImage={product.featuredImage?.url}
            price={defaultVariant.price.amount}
            variant={defaultVariant.title}
          />

          {/* Product Details */}
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="space-y-2 text-gray-600">
              {product.availableForSale ? (
                <li>✓ In Stock</li>
              ) : (
                <li>✗ Out of Stock</li>
              )}
              {product.vendor && <li>Vendor: {product.vendor}</li>}
              {product.productType && <li>Type: {product.productType}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
