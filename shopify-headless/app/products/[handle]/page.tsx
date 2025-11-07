import { getProduct } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { AddToCart } from '@/components/AddToCart';
import type { Metadata } from 'next';
import { generateProductSchema } from '@/lib/structured-data';

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const defaultVariant = product.variants[0];
  const price = defaultVariant?.price?.amount || '0';
  const currency = defaultVariant?.price?.currencyCode || 'USD';
  const imageUrl = product.featuredImage?.url || '/placeholder.jpg';

  return {
    title: product.title,
    description: product.description || `Shop ${product.title} - Premium quality products at great prices.`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      type: 'website',
      images: [{
        url: imageUrl,
        width: 800,
        height: 800,
        alt: product.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      images: [imageUrl],
    },
    other: {
      'product:price:amount': price,
      'product:price:currency': currency,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  const defaultVariant = product.variants[0];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopify-headless-lemon.vercel.app';
  const productSchema = generateProductSchema(product, siteUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
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
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            
            {product.vendor && (
              <p className="text-gray-700 mb-2">by {product.vendor}</p>
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
              <ul className="space-y-2 text-gray-700">
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
    </>
  );
}
