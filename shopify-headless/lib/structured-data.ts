import { ShopifyProduct } from '@/types/shopify';

export interface Organization {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export interface Product {
  '@context': string;
  '@type': string;
  name: string;
  image: string[];
  description?: string;
  offers: {
    '@type': string;
    url: string;
    priceCurrency: string;
    price: string;
    availability: string;
    seller: {
      '@type': string;
      name: string;
    };
  };
}

export interface BreadcrumbList {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

export function generateOrganizationSchema(siteUrl: string): Organization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Modern Ecommerce Store',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Premium tech-themed t-shirts and family plans',
    sameAs: [
      // Add your social media URLs here
      // 'https://facebook.com/yourpage',
      // 'https://twitter.com/yourhandle',
      // 'https://instagram.com/yourhandle',
    ],
  };
}

export function generateProductSchema(
  product: ShopifyProduct,
  siteUrl: string
): Product {
  const variant = product.variants[0];
  const price = variant?.price?.amount || '0';
  const currency = variant?.price?.currencyCode || 'USD';
  const availability = variant?.availableForSale
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.featuredImage?.url ? [product.featuredImage.url] : [],
    description: product.description || undefined,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.handle}`,
      priceCurrency: currency,
      price,
      availability,
      seller: {
        '@type': 'Organization',
        name: 'Modern Ecommerce Store',
      },
    },
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
