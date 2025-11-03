/**
 * Delete All Products Script
 * Deletes all products from your Shopify store using Admin API
 * 
 * Use with caution! This will permanently delete all products.
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const API_VERSION = '2024-01';

interface Product {
  id: number;
  title: string;
}

// Fetch all products
async function fetchAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];
  let hasNextPage = true;
  let pageInfo: string | null = null;

  console.log('📥 Fetching all products...\n');

  while (hasNextPage) {
    const url = pageInfo
      ? `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/products.json?limit=250&page_info=${pageInfo}`
      : `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/products.json?limit=250`;

    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_TOKEN!,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    allProducts.push(...data.products);

    // Check for pagination
    const linkHeader = response.headers.get('Link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/<[^>]*page_info=([^>&]+)[^>]*>;\s*rel="next"/);
      pageInfo = match ? match[1] : null;
      hasNextPage = !!pageInfo;
    } else {
      hasNextPage = false;
    }

    console.log(`   Fetched ${allProducts.length} products so far...`);
  }

  return allProducts;
}

// Delete a single product
async function deleteProduct(productId: number): Promise<void> {
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/products/${productId}.json`,
    {
      method: 'DELETE',
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_TOKEN!,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete product ${productId}: ${response.statusText}`);
  }
}

// Rate limiting helper
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
async function main() {
  console.log('🗑️  Starting product deletion...\n');

  if (!SHOPIFY_STORE_DOMAIN || !ADMIN_API_TOKEN) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  // Fetch all products
  const products = await fetchAllProducts();
  
  if (products.length === 0) {
    console.log('✅ No products to delete!');
    return;
  }

  console.log(`\n📦 Found ${products.length} products to delete\n`);
  console.log('⚠️  WARNING: This will permanently delete all products!');
  console.log('⏱️  Starting deletion in 3 seconds...\n');
  
  await delay(3000);

  let successCount = 0;
  let failureCount = 0;

  // Delete products in batches to respect API rate limits
  const batchSize = 2; // Shopify allows 2 requests/second

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    
    console.log(`🗑️  Deleting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
    
    const promises = batch.map(product =>
      deleteProduct(product.id)
        .then(() => {
          successCount++;
          console.log(`   ✅ Deleted: ${product.title} (ID: ${product.id})`);
        })
        .catch(error => {
          failureCount++;
          console.error(`   ❌ Failed to delete ${product.title}: ${error.message}`);
        })
    );

    await Promise.all(promises);
    
    // Wait 1 second between batches
    if (i + batchSize < products.length) {
      await delay(1000);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully deleted: ${successCount} products`);
  console.log(`❌ Failed: ${failureCount} products`);
  console.log(`📈 Total processed: ${successCount + failureCount} products`);
  console.log('='.repeat(60));
  console.log('\n✨ Done!');
}

// Run the script
main().catch(console.error);
