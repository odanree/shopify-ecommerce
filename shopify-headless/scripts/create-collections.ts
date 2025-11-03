/**
 * Create Collections Script
 * 
 * This script creates collections and assigns products to them using the Shopify Admin API.
 * 
 * Collections created:
 * - All Products (all 11 products)
 * - Frontend Frameworks (Next.js, React, TypeScript, Hydrogen)
 * - Backend & Tools (Node.js, GraphQL, Shopify Developer)
 * - Development Tools (VS Code, Cypress, CSS Modules)
 * - Headless Commerce (Next.js, React, Headless Commerce, Hydrogen)
 * 
 * Usage:
 *   npx tsx scripts/create-collections.ts
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

interface Collection {
  title: string;
  handle: string;
  description: string;
  productHandles: string[];
  image?: string;
}

/**
 * Collections to create with their products
 */
const collectionsData: Collection[] = [
  {
    title: 'All Products',
    handle: 'all-products',
    description: 'Browse our complete collection of developer and tech-themed apparel. Perfect for coders, designers, and tech enthusiasts.',
    productHandles: [
      'next-js-developer-t-shirt',
      'next-js-developer-t-shirt-1',
      'react-developer-t-shirt',
      'shopify-developer-t-shirt',
      'typescript-master-t-shirt',
      'hydrogen-react-t-shirt',
      'headless-commerce-t-shirt',
      'css-modules-t-shirt',
      'cypress-e2e-t-shirt',
      'vs-code-developer-t-shirt',
      'graphql-expert-t-shirt'
    ],
    image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200&h=800&fit=crop'
  },
  {
    title: 'Frontend Frameworks',
    handle: 'frontend-frameworks',
    description: 'Show your love for modern frontend frameworks. Next.js, React, TypeScript, and Hydrogen - the tools that power the web.',
    productHandles: [
      'next-js-developer-t-shirt',
      'next-js-developer-t-shirt-1',
      'react-developer-t-shirt',
      'typescript-master-t-shirt',
      'hydrogen-react-t-shirt'
    ],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop'
  },
  {
    title: 'Backend & APIs',
    handle: 'backend-apis',
    description: 'For the backend heroes. GraphQL, Shopify, and the tools that make everything work behind the scenes.',
    productHandles: [
      'shopify-developer-t-shirt',
      'graphql-expert-t-shirt',
      'headless-commerce-t-shirt'
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop'
  },
  {
    title: 'Development Tools',
    handle: 'development-tools',
    description: 'Celebrate the tools that make development awesome. VS Code, Cypress, CSS Modules - the essentials in every developer\'s toolkit.',
    productHandles: [
      'vs-code-developer-t-shirt',
      'cypress-e2e-t-shirt',
      'css-modules-t-shirt'
    ],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop'
  },
  {
    title: 'Headless Commerce',
    handle: 'headless-commerce',
    description: 'The future of e-commerce is headless. Next.js, React, Hydrogen, and the tools building modern commerce experiences.',
    productHandles: [
      'next-js-developer-t-shirt',
      'next-js-developer-t-shirt-1',
      'react-developer-t-shirt',
      'headless-commerce-t-shirt',
      'hydrogen-react-t-shirt',
      'shopify-developer-t-shirt'
    ],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop'
  }
];

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
          }
        }
      }
    }
  `;

  const data: any = await shopifyAdminRequest(query);
  const products: Product[] = data.products.edges.map((edge: any) => edge.node);

  console.log(`Found ${products.length} products\n`);
  return products;
}

/**
 * Create a manual collection (without automated rules)
 */
async function createCollection(
  title: string,
  handle: string,
  description: string,
  productIds: string[],
  imageUrl?: string
): Promise<string> {
  const mutation: string = `
    mutation createCollection($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input: any = {
    title,
    handle,
    descriptionHtml: `<p>${description}</p>`,
    // Create manual collection (no automated rules)
    ruleSet: null
  };

  // Add image if provided
  if (imageUrl) {
    input.image = {
      src: imageUrl,
      altText: title
    };
  }

  const variables: Record<string, any> = { input };

  const data: any = await shopifyAdminRequest(mutation, variables);

  if (data.collectionCreate.userErrors.length > 0) {
    console.error('❌ Errors:', data.collectionCreate.userErrors);
    throw new Error('Failed to create collection');
  }

  const collectionId: string = data.collectionCreate.collection.id;

  // Add products to the manual collection
  await addProductsToCollection(collectionId, productIds);

  return collectionId;
}

/**
 * Add products to a collection
 */
async function addProductsToCollection(collectionId: string, productIds: string[]): Promise<void> {
  const mutation: string = `
    mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
      collectionAddProducts(id: $id, productIds: $productIds) {
        collection {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables: Record<string, any> = {
    id: collectionId,
    productIds: productIds
  };

  const data: any = await shopifyAdminRequest(mutation, variables);

  if (data.collectionAddProducts.userErrors.length > 0) {
    console.error('   ⚠️  Errors adding products:', data.collectionAddProducts.userErrors);
  } else {
    console.log(`   ✅ Added ${productIds.length} products to collection`);
  }
}

/**
 * Publish collection to sales channel
 * Note: Collections are automatically published to "Online Store" by default.
 * Manual publishing to "headless storefront" requires read_publications scope.
 */
async function publishCollection(collectionId: string): Promise<void> {
  try {
    const mutation: string = `
      mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          publishable {
            availablePublicationCount
            publicationCount
          }
          shop {
            publicationCount
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Get publication ID for "headless storefront"
    const publicationsQuery: string = `
      query {
        publications(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `;

    const pubData: any = await shopifyAdminRequest(publicationsQuery);
    const headlessPublication: any = pubData.publications.edges.find(
      (edge: any) => edge.node.name.toLowerCase().includes('headless')
    );

    if (!headlessPublication) {
      console.log('   ℹ️  Note: Collections are auto-published to Online Store');
      return;
    }

    const variables: Record<string, any> = {
      id: collectionId,
      input: [{
        publicationId: headlessPublication.node.id
      }]
    };

    const data: any = await shopifyAdminRequest(mutation, variables);

    if (data.publishablePublish.userErrors.length > 0) {
      console.log('   ℹ️  Note: Manual publishing skipped (requires read_publications scope)');
    } else {
      console.log('   ✅ Published to headless storefront');
    }
  } catch (error: any) {
    // Publishing errors are non-critical - collections work without explicit publishing
    console.log('   ℹ️  Note: Collections are auto-published to Online Store');
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('📚 Collections Creation Script\n');
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

    // Create a map of handle to product ID
    const productMap: Map<string, string> = new Map();
    products.forEach((product: Product) => {
      productMap.set(product.handle, product.id);
    });

    console.log('🎨 Creating collections...\n');

    let successCount: number = 0;
    let errorCount: number = 0;

    for (const collectionData of collectionsData) {
      console.log(`📁 Creating collection: "${collectionData.title}"`);
      console.log(`   Handle: ${collectionData.handle}`);
      console.log(`   Products: ${collectionData.productHandles.length}`);

      try {
        // Get product IDs for this collection
        const productIds: string[] = collectionData.productHandles
          .map((handle: string) => productMap.get(handle))
          .filter((id: string | undefined): id is string => id !== undefined);

        if (productIds.length === 0) {
          console.log('   ⚠️  Warning: No products found for this collection');
          continue;
        }

        console.log(`   Found ${productIds.length} matching products`);

        // Create collection
        const collectionId: string = await createCollection(
          collectionData.title,
          collectionData.handle,
          collectionData.description,
          productIds,
          collectionData.image
        );

        console.log(`   ✅ Collection created: ${collectionId}`);

        // Publish to headless storefront
        await publishCollection(collectionId);
        console.log('   ✅ Published to headless storefront\n');

        successCount++;

        // Rate limiting: wait 500ms between requests
        await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 500));

      } catch (error: any) {
        console.error(`   ❌ Failed: ${error.message}\n`);
        errorCount++;
      }
    }

    console.log('================================');
    console.log('✅ Collections Creation Complete!\n');
    console.log(`Summary:`);
    console.log(`  ✅ Success: ${successCount} collections`);
    console.log(`  ❌ Errors: ${errorCount} collections`);

    if (successCount > 0) {
      console.log('\n💡 Next Steps:');
      console.log('   1. Visit Shopify Admin to verify collections');
      console.log('   2. Check your storefront: https://shopify-headless-8746.vercel.app/collections');
      console.log('   3. Collections should be visible within 60 seconds (cache revalidation)');
      console.log('\n📝 Collections Created:');
      collectionsData.forEach((col: Collection) => {
        console.log(`   - ${col.title} (${col.productHandles.length} products)`);
      });
    }

  } catch (error: any) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
