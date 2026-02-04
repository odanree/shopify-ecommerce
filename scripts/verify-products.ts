/**
 * Verify Products via Storefront API
 * Checks if products created via Admin API are visible in Storefront API
 * This is what your Next.js app uses to display products
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
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function verifyProducts() {
  console.log('🔍 Verifying products via Storefront API...\n');

  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN');
    console.error('   - SHOPIFY_STOREFRONT_ACCESS_TOKEN');
    process.exit(1);
  }

  console.log(`📍 Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`🔑 Token: ${STOREFRONT_ACCESS_TOKEN.substring(0, 10)}...\n`);

  const query = `
    query GetProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            productType
            publishedAt
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  quantityAvailable
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('❌ GraphQL Errors:', json.errors);
      process.exit(1);
    }

    const products = json.data.products.edges;

    console.log('='.repeat(60));
    console.log('📊 STOREFRONT API RESULTS');
    console.log('='.repeat(60));
    console.log(`Total products found: ${products.length}\n`);

    if (products.length === 0) {
      console.log('⚠️  No products found in Storefront API!');
      console.log('\nPossible reasons:');
      console.log('1. Products not published to "Online Store" sales channel');
      console.log('2. Products are in draft status');
      console.log('3. Wrong Storefront Access Token');
      console.log('\n💡 Fix: Go to Shopify Admin → Products → Select all → Bulk Actions → "Make available"');
    } else {
      products.forEach(({ node }: any, index: number) => {
        console.log(`${index + 1}. ${node.title}`);
        console.log(`   Handle: ${node.handle}`);
        console.log(`   Available: ${node.availableForSale ? '✅ Yes' : '❌ No'}`);
        console.log(`   Published: ${node.publishedAt ? '✅ Yes' : '❌ No'}`);
        console.log(`   Price: $${node.priceRange.minVariantPrice.amount}`);
        console.log(`   Type: ${node.productType || 'None'}`);
        console.log(`   Variants: ${node.variants.edges.length} (showing first 5)`);
        
        // Show variant availability
        const firstVariant = node.variants.edges[0]?.node;
        if (firstVariant) {
          console.log(`   First variant available: ${firstVariant.availableForSale ? '✅ Yes' : '❌ No'}`);
          console.log(`   Quantity available: ${firstVariant.quantityAvailable ?? 'Unknown'}`);
        }
        console.log('');
      });
    }

    console.log('='.repeat(60));
    console.log('✨ Verification complete!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error verifying products:', error);
    process.exit(1);
  }
}

verifyProducts();
