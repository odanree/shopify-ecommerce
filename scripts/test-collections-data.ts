/**
 * Test Collections Data Script
 *
 * This script tests the collections data returned by getCollections()
 * to debug product count issues.
 *
 * Usage:
 *   npx tsx scripts/test-collections-data.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST before importing anything else
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { getCollections } from '../lib/shopify.js';

async function testCollectionsData(): Promise<void> {
  console.log('🧪 Testing Collections Data\n');
  console.log('================================\n');

  try {
    const collections: any[] = await getCollections();

    console.log(`Found ${collections.length} collections:\n`);

    collections.forEach((collection: any, index: number) => {
      console.log(`${index + 1}. ${collection.title}`);
      console.log(`   Handle: ${collection.handle}`);
      console.log(`   Products Count: ${collection.productsCount}`);
      console.log(`   Products Array: ${collection.products ? collection.products.length : 'undefined'}`);
      console.log(`   ID: ${collection.id}`);
      console.log('');
    });

    console.log('================================');
    console.log('✅ Test Complete');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the test
testCollectionsData();