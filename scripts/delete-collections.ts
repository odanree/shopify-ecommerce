/**
 * Delete Collections Script
 * 
 * This script deletes specified collections from your Shopify store.
 * 
 * Usage:
 *   npx tsx scripts/delete-collections.ts
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

// Collections to delete by handle
const COLLECTIONS_TO_DELETE: string[] = [
  'frontpage',
  't-shirts'
];

interface Collection {
  id: string;
  title: string;
  handle: string;
}

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
 * Get all collections
 */
async function getAllCollections(): Promise<Collection[]> {
  console.log('📦 Fetching all collections...\n');

  const query: string = `
    query GetCollections {
      collections(first: 50) {
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

  const data: any = await shopifyAdminRequest(query);
  const collections: Collection[] = data.collections.edges.map((edge: any) => edge.node);

  console.log(`Found ${collections.length} collections:\n`);
  collections.forEach((col: Collection, index: number) => {
    console.log(`${index + 1}. ${col.title} (${col.handle})`);
  });
  console.log('');

  return collections;
}

/**
 * Delete a collection
 */
async function deleteCollection(collectionId: string): Promise<boolean> {
  const mutation: string = `
    mutation DeleteCollection($input: CollectionDeleteInput!) {
      collectionDelete(input: $input) {
        deletedCollectionId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables: Record<string, any> = {
    input: {
      id: collectionId
    }
  };

  try {
    const data: any = await shopifyAdminRequest(mutation, variables);

    if (data.collectionDelete.userErrors.length > 0) {
      console.error('   ❌ Errors:', data.collectionDelete.userErrors);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('🗑️  Delete Collections Script\n');
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
    // Get all collections
    const collections: Collection[] = await getAllCollections();

    // Filter collections to delete
    const collectionsToDelete: Collection[] = collections.filter(
      (col: Collection) => COLLECTIONS_TO_DELETE.includes(col.handle)
    );

    if (collectionsToDelete.length === 0) {
      console.log('✅ No collections to delete. All specified collections have already been removed.\n');
      return;
    }

    console.log(`🗑️  Found ${collectionsToDelete.length} collections to delete:\n`);
    collectionsToDelete.forEach((col: Collection) => {
      console.log(`   - ${col.title} (${col.handle})`);
    });
    console.log('');

    console.log('🚀 Deleting collections...\n');

    let successCount: number = 0;
    let errorCount: number = 0;

    for (const collection of collectionsToDelete) {
      console.log(`🗑️  Deleting: "${collection.title}"`);

      const success: boolean = await deleteCollection(collection.id);

      if (success) {
        console.log(`   ✅ Deleted successfully\n`);
        successCount++;
      } else {
        console.log(`   ❌ Failed to delete\n`);
        errorCount++;
      }

      // Rate limiting: wait 500ms between requests
      await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 500));
    }

    console.log('================================');
    console.log('✅ Deletion Complete!\n');
    console.log(`Summary:`);
    console.log(`  ✅ Deleted: ${successCount} collections`);
    console.log(`  ❌ Errors: ${errorCount} collections`);

    if (successCount > 0) {
      console.log('\n💡 Next Steps:');
      console.log('   1. Wait 60 seconds for cache revalidation');
      console.log('   2. Visit: https://shopify-headless-8746.vercel.app/collections');
      console.log('   3. Deleted collections should no longer appear!');
    }

  } catch (error: any) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
