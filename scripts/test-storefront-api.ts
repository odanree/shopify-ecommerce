import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Test different Storefront API queries
async function testStorefrontAPI() {
  console.log('🔍 Testing Storefront API access...\n');
  console.log(`📍 Store: ${SHOP_DOMAIN}`);
  console.log(`🔑 Storefront Token: ${STOREFRONT_TOKEN?.substring(0, 10)}...\n`);

  // Test 1: Basic shop query
  console.log('============================================================');
  console.log('TEST 1: Basic Shop Query');
  console.log('============================================================\n');
  
  try {
    const shopQuery = `
      query {
        shop {
          name
          description
        }
      }
    `;

    const response1 = await fetch(
      `https://${SHOP_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION || '2024-01'}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN!,
        },
        body: JSON.stringify({ query: shopQuery }),
      }
    );

    const result1 = await response1.json();
    
    if (result1.errors) {
      console.log('❌ Errors:', JSON.stringify(result1.errors, null, 2));
    } else {
      console.log('✅ Success!');
      console.log('Shop Name:', result1.data?.shop?.name);
      console.log('Shop Description:', result1.data?.shop?.description || 'N/A');
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }

  // Test 2: Product collections query
  console.log('\n============================================================');
  console.log('TEST 2: Collections Query');
  console.log('============================================================\n');
  
  try {
    const collectionsQuery = `
      query {
        collections(first: 10) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `;

    const response2 = await fetch(
      `https://${SHOP_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION || '2024-01'}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN!,
        },
        body: JSON.stringify({ query: collectionsQuery }),
      }
    );

    const result2 = await response2.json();
    
    if (result2.errors) {
      console.log('❌ Errors:', JSON.stringify(result2.errors, null, 2));
    } else {
      const collections = result2.data?.collections?.edges || [];
      console.log(`✅ Found ${collections.length} collections`);
      collections.forEach((col: any) => {
        console.log(`   - ${col.node.title} (${col.node.handle})`);
      });
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }

  // Test 3: Products with detailed fields
  console.log('\n============================================================');
  console.log('TEST 3: Products Query (Detailed)');
  console.log('============================================================\n');
  
  try {
    const productsQuery = `
      query {
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              publishedAt
              productType
              tags
            }
          }
        }
      }
    `;

    const response3 = await fetch(
      `https://${SHOP_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION || '2024-01'}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN!,
        },
        body: JSON.stringify({ query: productsQuery }),
      }
    );

    const result3 = await response3.json();
    
    if (result3.errors) {
      console.log('❌ Errors:', JSON.stringify(result3.errors, null, 2));
    } else {
      const products = result3.data?.products?.edges || [];
      console.log(`✅ Found ${products.length} products\n`);
      
      if (products.length === 0) {
        console.log('⚠️  No products found!');
        console.log('\nPossible reasons:');
        console.log('1. Products not published to the Storefront API sales channel');
        console.log('2. Storefront token not associated with the right sales channel');
        console.log('3. Products need time to propagate to Storefront API');
      } else {
        products.forEach((product: any, index: number) => {
          console.log(`${index + 1}. ${product.node.title}`);
          console.log(`   Handle: ${product.node.handle}`);
          console.log(`   Available: ${product.node.availableForSale}`);
          console.log(`   Published: ${product.node.publishedAt || 'Not published'}`);
          console.log(`   Type: ${product.node.productType}`);
          console.log(`   Tags: ${product.node.tags.join(', ') || 'None'}`);
          console.log('');
        });
      }
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }

  console.log('============================================================');
  console.log('💡 DIAGNOSTICS COMPLETE');
  console.log('============================================================');
}

testStorefrontAPI().catch(console.error);
