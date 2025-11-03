/**
 * Add Product Images Script
 * 
 * This script adds placeholder images to products using the Shopify Admin API.
 * For production, replace placeholder URLs with actual product images.
 * 
 * Usage:
 *   npx tsx scripts/add-product-images.ts
 * 
 * Requirements:
 *   - SHOPIFY_ADMIN_API_TOKEN in .env.local
 *   - SHOPIFY_STORE_DOMAIN in .env.local
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SHOPIFY_STORE_DOMAIN: string = process.env.SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_ADMIN_API_TOKEN: string = process.env.SHOPIFY_ADMIN_API_TOKEN || '';
const API_VERSION: string = '2024-10';

interface Product {
  id: string;
  title: string;
  handle: string;
}

interface ImageData {
  url: string;
  alt: string;
}

/**
 * Product images mapping
 * Using direct Unsplash URLs - these are stable, permanent JPG images that Shopify can process
 * 
 * Note: For best results with Shopify's media API:
 * - Use direct image URLs (not redirects)
 * - Use .jpg or .png extensions
 * - Ensure URLs are publicly accessible
 * - Images should be at least 800x800px
 * 
 * For production: Replace with actual product photos
 * Recommended approach: Upload via Shopify Admin UI (fastest and most reliable)
 */
const productImages: Record<string, ImageData[]> = {
  'next-js-developer-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1200&fit=crop',
      alt: 'Next.js Developer T-Shirt - Front View'
    }
  ],
  'next-js-developer-t-shirt-1': [
    {
      url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&h=1200&fit=crop',
      alt: 'Next.js Developer T-Shirt - Front View'
    }
  ],
  'react-developer-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=1200&fit=crop',
      alt: 'React Developer T-Shirt - Front View'
    }
  ],
  'shopify-developer-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&h=1200&fit=crop',
      alt: 'Shopify Developer T-Shirt - Front View'
    }
  ],
  'typescript-master-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=1200&fit=crop',
      alt: 'TypeScript Master T-Shirt - Front View'
    }
  ],
  'hydrogen-react-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=1200&h=1200&fit=crop',
      alt: 'Hydrogen React T-Shirt - Front View'
    }
  ],
  'headless-commerce-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&h=1200&fit=crop',
      alt: 'Headless Commerce T-Shirt - Front View'
    }
  ],
  'css-modules-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&h=1200&fit=crop',
      alt: 'CSS Modules T-Shirt - Front View'
    }
  ],
  'cypress-e2e-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&h=1200&fit=crop',
      alt: 'Cypress E2E T-Shirt - Front View'
    }
  ],
  'vs-code-developer-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=1200&fit=crop',
      alt: 'VS Code Developer T-Shirt - Front View'
    }
  ],
  'graphql-expert-t-shirt': [
    {
      url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=1200&fit=crop',
      alt: 'GraphQL Expert T-Shirt - Front View'
    }
  ]
};

/**
 * Make GraphQL request to Shopify Admin API
 */
async function shopifyAdminRequest(query: string, variables: Record<string, any> = {}): Promise<any> {
  const response: Response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const result: any = await response.json();

  if (result.errors) {
    console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
    throw new Error('GraphQL request failed');
  }

  return result.data;
}

/**
 * Fetch all products
 */
async function fetchAllProducts(): Promise<Product[]> {
  console.log('📦 Fetching all products...\n');

  const query: string = `
    query GetProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const data: any = await shopifyAdminRequest(query);
  const products: Product[] = data.products.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
    existingImages: edge.node.images.edges.length
  }));

  console.log(`Found ${products.length} products\n`);
  return products;
}

/**
 * Add images to a product
 */
async function addProductImages(productId: string, images: ImageData[]): Promise<void> {
  const mutation: string = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          ... on MediaImage {
            id
            image {
              url
              altText
            }
          }
        }
        mediaUserErrors {
          field
          message
        }
        product {
          id
          title
        }
      }
    }
  `;

  const media: any[] = images.map((img: ImageData) => ({
    originalSource: img.url,
    alt: img.alt,
    mediaContentType: 'IMAGE'
  }));

  const variables: Record<string, any> = {
    productId,
    media
  };

  const data: any = await shopifyAdminRequest(mutation, variables);

  if (data.productCreateMedia.mediaUserErrors.length > 0) {
    console.error('❌ Errors:', data.productCreateMedia.mediaUserErrors);
    throw new Error('Failed to add images');
  }

  console.log(`   ✅ Added ${images.length} images`);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('🎨 Product Image Addition Script\n');
  console.log('================================\n');

  // Validate environment variables
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_API_TOKEN) {
    console.error('❌ Missing required environment variables:');
    console.error('   - SHOPIFY_STORE_DOMAIN');
    console.error('   - SHOPIFY_ADMIN_API_TOKEN');
    console.error('\nPlease check your .env.local file.');
    process.exit(1);
  }

  try {
    // Fetch all products
    const products: Product[] = await fetchAllProducts();

    console.log('📸 Adding images to products...\n');

    let successCount: number = 0;
    let skipCount: number = 0;
    let errorCount: number = 0;

    for (const product of products) {
      const images: ImageData[] | undefined = productImages[product.handle];

      if (!images) {
        console.log(`⏭️  Skipping "${product.title}" - No images defined`);
        skipCount++;
        continue;
      }

      console.log(`📦 Processing "${product.title}"...`);

      try {
        await addProductImages(product.id, images);
        successCount++;
      } catch (error: any) {
        console.error(`   ❌ Failed: ${error.message}`);
        errorCount++;
      }

      // Rate limiting: wait 500ms between requests
      await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 500));
    }

    console.log('\n================================');
    console.log('✅ Image Addition Complete!\n');
    console.log(`Summary:`);
    console.log(`  ✅ Success: ${successCount} products`);
    console.log(`  ⏭️  Skipped: ${skipCount} products`);
    console.log(`  ❌ Errors: ${errorCount} products`);

    if (successCount > 0) {
      console.log('\n💡 Next Steps:');
      console.log('   1. Visit Shopify Admin to verify images');
      console.log('   2. Check your storefront: https://shopify-headless-8746.vercel.app/products');
      console.log('   3. Replace placeholder images with actual product photos');
      console.log('\n📝 Note: Using placeholder.com images for now.');
      console.log('   For production, upload actual product images to Shopify');
      console.log('   or use a CDN like Cloudinary/Imgix.');
    }

  } catch (error: any) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
