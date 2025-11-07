import { MetadataRoute } from 'next';
import { getProducts, getCollections } from '@/lib/shopify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopify-headless-lemon.vercel.app';

  // Static pages
  const routes = [
    '',
    '/collections',
    '/cart',
    '/family-plan',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic product pages
  try {
    const products = await getProducts();
    const productUrls = products.map((product) => ({
      url: `${siteUrl}/products/${product.handle}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    // Dynamic collection pages
    const collections = await getCollections();
    const collectionUrls = collections.map((collection) => ({
      url: `${siteUrl}/collections/${collection.handle}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...routes, ...productUrls, ...collectionUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
