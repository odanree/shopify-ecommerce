/**
 * Publish Collections to Sales Channel
 * 
 * This script publishes collections to the "headless storefront" sales channel
 * so they appear in the Storefront API.
 * 
 * Usage:
 *   npx tsx scripts/publish-collections.ts
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
 * Get publication ID for "headless storefront"
 */
async function getHeadlessPublicationId(): Promise<string | null> {
  const query: string = `
    query GetPublications {
      publications(first: 20) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  try {
    const data: any = await shopifyAdminRequest(query);
    const publications: any[] = data.publications.edges;

    console.log('📢 Available Sales Channels:');
    publications.forEach((pub: any, index: number) => {
      console.log(`${index + 1}. ${pub.node.name} (${pub.node.id})`);
    });
    console.log('');

    const headlessPublication: any = publications.find(
      (edge: any) => edge.node.name.toLowerCase().includes('headless')
    );

    if (headlessPublication) {
      console.log(`✅ Found "headless storefront" channel: ${headlessPublication.node.id}\n`);
      return headlessPublication.node.id;
    } else {
      console.log('⚠️  Could not find "headless storefront" channel\n');
      return null;
    }
  } catch (error: any) {
    console.error('❌ Error fetching publications:', error.message);
    return null;
  }
}

/**
 * Publish collection to sales channel
 */
async function publishCollection(collectionId: string, publicationId: string): Promise<boolean> {
  const mutation: string = `
    mutation PublishCollection($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables: Record<string, any> = {
    id: collectionId,
    input: [{
      publicationId: publicationId
    }]
  };

  try {
    const data: any = await shopifyAdminRequest(mutation, variables);

    if (data.publishablePublish.userErrors.length > 0) {
      console.error('   ❌ Errors:', data.publishablePublish.userErrors);
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
  console.log('📚 Publish Collections to Sales Channel\n');
  console.log('==========================================\n');

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

    // Get headless storefront publication ID
    const publicationId: string | null = await getHeadlessPublicationId();

    if (!publicationId) {
      console.error('❌ Cannot proceed without publication ID');
      process.exit(1);
    }

    console.log('🚀 Publishing collections...\n');

    let successCount: number = 0;
    let errorCount: number = 0;

    for (const collection of collections) {
      console.log(`📁 Publishing: "${collection.title}"`);

      const success: boolean = await publishCollection(collection.id, publicationId);

      if (success) {
        console.log(`   ✅ Published successfully\n`);
        successCount++;
      } else {
        console.log(`   ❌ Failed to publish\n`);
        errorCount++;
      }

      // Rate limiting: wait 500ms between requests
      await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 500));
    }

    console.log('==========================================');
    console.log('✅ Publishing Complete!\n');
    console.log(`Summary:`);
    console.log(`  ✅ Success: ${successCount} collections`);
    console.log(`  ❌ Errors: ${errorCount} collections`);

    if (successCount > 0) {
      console.log('\n💡 Next Steps:');
      console.log('   1. Wait 60 seconds for cache revalidation');
      console.log('   2. Visit: https://shopify-headless-8746.vercel.app/collections');
      console.log('   3. All collections should now be visible!');
    }

  } catch (error: any) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
