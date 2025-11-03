/**
 * Mass Product Creator for Shopify
 * Creates 200 tech-themed t-shirt products using Shopify Admin API
 * 
 * Setup:
 * 1. Add SHOPIFY_ADMIN_API_TOKEN to .env.local
 * 2. Run: npx tsx scripts/create-products.ts
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
const SHOPIFY_LOCATION_ID = process.env.SHOPIFY_LOCATION_ID;
const API_VERSION = '2024-01';

// Tech stack from this repo
const techDesigns = [
  // Core Stack
  "Next.js Developer",
  "React Developer",
  "TypeScript Master",
  
  // Shopify
  "Shopify Developer",
  "Headless Commerce",
  "Hydrogen React",
  
  // Testing
  "Cypress E2E",
  
  // Styling
  "CSS Modules",
  
  // APIs & GraphQL
  "GraphQL Expert",
  
  // Dev Tools
  "VS Code Developer",
];

// Generate additional variations to reach 10
function generateAllDesigns(): string[] {
  // Just use the first 10 from our curated list
  return techDesigns.slice(0, 10);
}

// T-shirt sizes and colors
const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
];

// Price ranges based on design complexity
function getPrice(index: number): string {
  const basePrice = 24.99;
  const variation = (index % 5) * 2;
  return (basePrice + variation).toFixed(2);
}

// Generate product description
function generateDescription(design: string): string {
  return `<p>Show your resilience with our "${design}" T-Shirt. Made from premium cotton, this comfortable tee is perfect for your job search journey or just relaxing at home.</p>

<p><strong>Features:</strong><br>
• 100% premium cotton<br>
• Comfortable fit<br>
• Bold "${design}" text design<br>
• Available in multiple sizes<br>
• Machine washable</p>`;
}

// Create product via Shopify Admin API
async function createProduct(design: string, index: number) {
  const title = `${design} T-Shirt`;
  const price = getPrice(index);
  
  // Create variants for all size/color combinations
  const variants = [];
  for (const color of colors) {
    for (const size of sizes) {
      variants.push({
        price,
        option1: color.name,
        option2: size,
        inventory_management: 'shopify',
        inventory_policy: 'deny', // Don't allow purchases when out of stock
      });
    }
  }

  const productData = {
    product: {
      title,
      body_html: generateDescription(design),
      vendor: 'Tech Apparel Co',
      product_type: 'T-Shirts',
      tags: ['tech', 'developer', 'programmer', 'geek', 'coding', 'apparel'],
      options: [
        { name: 'Color', values: colors.map(c => c.name) },
        { name: 'Size', values: sizes },
      ],
      variants,
      status: 'active',
    },
  };

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/products.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_API_TOKEN!,
        },
        body: JSON.stringify(productData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create product: ${error}`);
    }

    const result = await response.json();
    return result.product;
  } catch (error) {
    console.error(`Error creating product "${title}":`, error);
    throw error;
  }
}

// Rate limiting helper
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Set inventory level for a variant
async function setInventoryLevel(inventoryItemId: number, quantity: number) {
  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/inventory_levels/set.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_API_TOKEN!,
        },
        body: JSON.stringify({
          location_id: SHOPIFY_LOCATION_ID,
          inventory_item_id: inventoryItemId,
          available: quantity,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to set inventory: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`   ⚠️  Inventory warning for item ${inventoryItemId}:`, error);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting mass product creation...\n');

  if (!SHOPIFY_STORE_DOMAIN || !ADMIN_API_TOKEN) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN');
    console.error('   - SHOPIFY_ADMIN_API_TOKEN');
    console.error('\nPlease add these to your .env.local file');
    process.exit(1);
  }

  const designs = generateAllDesigns();
  console.log(`📝 Generated ${designs.length} unique tech-themed designs\n`);

  let successCount = 0;
  let failureCount = 0;

  // Step 1: Create all products
  const createdProducts = [];
  const batchSize = 2; // Shopify allows 2 requests/second for Admin API
  
  console.log('Step 1: Creating products...');
  for (let i = 0; i < designs.length; i += batchSize) {
    const batch = designs.slice(i, i + batchSize);
    
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(designs.length / batchSize)}`);
    
    const promises = batch.map((design, batchIndex) => 
      createProduct(design, i + batchIndex)
        .then((product) => {
          successCount++;
          console.log(`   ✅ Created: ${product.title} (ID: ${product.id})`);
          return product;
        })
        .catch(error => {
          failureCount++;
          console.error(`   ❌ Failed: ${design} - ${error.message}`);
          return null;
        })
    );

    const results = await Promise.all(promises);
    createdProducts.push(...results.filter(p => p !== null));
    
    // Wait 1 second between batches to respect rate limits
    if (i + batchSize < designs.length) {
      await delay(1000);
    }
  }
  
  // Step 2: Set inventory for all variants (sequential to avoid rate limiting)
  console.log('\n\nStep 2: Setting inventory levels...');
  console.log(`Total variants to update: ${createdProducts.length * 42}\n`);
  
  let inventorySuccessCount = 0;
  let inventoryFailCount = 0;
  
  for (let i = 0; i < createdProducts.length; i++) {
    const product = createdProducts[i];
    console.log(`\n📦 Setting inventory for: ${product.title}`);
    
    for (let j = 0; j < product.variants.length; j++) {
      const variant = product.variants[j];
      const result = await setInventoryLevel(variant.inventory_item_id, 100);
      
      if (result) {
        inventorySuccessCount++;
        // Show progress every 10 variants
        if ((inventorySuccessCount % 10) === 0) {
          console.log(`   ✅ ${inventorySuccessCount} variants updated...`);
        }
      } else {
        inventoryFailCount++;
      }
      
      // Rate limiting: 2 calls/second = 500ms between calls, add 100ms buffer
      await delay(600);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Products created: ${successCount}`);
  console.log(`❌ Product failures: ${failureCount}`);
  console.log(`✅ Inventory items updated: ${inventorySuccessCount}`);
  console.log(`❌ Inventory failures: ${inventoryFailCount}`);
  console.log('='.repeat(60));
  console.log('\n✨ Done! Check your Shopify admin to see the new products.');
}

// Run the script
main().catch(console.error);
