import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const API_VERSION = '2024-01';

interface Product {
  node: {
    id: string;
    title: string;
    status: string;
  };
}

// GraphQL query to get all products
const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          status
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

// GraphQL mutation to publish product to sales channel
const PUBLISH_MUTATION = `
  mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable {
        ... on Product {
          id
          title
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function shopifyAdminGraphQL(query: string, variables: any = {}) {
  const response = await fetch(
    `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_API_TOKEN!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const result = await shopifyAdminGraphQL(GET_PRODUCTS_QUERY, { first: 250 });
    return result.data?.products?.edges || [];
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
}

async function publishProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await shopifyAdminGraphQL(PUBLISH_MUTATION, {
      id: productId,
      input: [
        {
          publicationId: 'gid://shopify/Publication/147005407277' // Online Store publication
        }
      ]
    });

    if (result.data?.publishablePublish?.userErrors?.length > 0) {
      const errors = result.data.publishablePublish.userErrors
        .map((e: any) => e.message)
        .join(', ');
      return { success: false, error: errors };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Publishing products to Online Store via GraphQL...\n');
  console.log(`📍 Store: ${SHOP_DOMAIN}`);
  console.log(`🔑 Token: ${ADMIN_API_TOKEN?.substring(0, 10)}...`);
  console.log('');

  // Get all products
  console.log('📦 Fetching products...');
  const products = await getAllProducts();

  if (products.length === 0) {
    console.log('❌ No products found!');
    return;
  }

  console.log(`✅ Found ${products.length} products\n`);
  console.log('📢 Publishing to Online Store...');
  console.log('============================================================\n');

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i].node;
    const progress = `[${i + 1}/${products.length}]`;

    console.log(`${progress} ${product.title}`);

    const result = await publishProduct(product.id);

    if (result.success) {
      successCount++;
      console.log(`   ✅ Published`);
    } else {
      failureCount++;
      console.log(`   ❌ Failed: ${result.error}`);
    }

    // Rate limiting
    if (i < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('');
  }

  console.log('============================================================');
  console.log('📊 SUMMARY');
  console.log('============================================================');
  console.log(`Total: ${products.length}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log('============================================================');
  console.log('\n✨ Done! Check your Vercel site now.');
}

main().catch(console.error);
