import { ShopifyProduct, ShopifyCart, ShopifyCollection } from '@/types/shopify';

async function shopifyFetch<T>({ query, variables }: { query: string; variables?: any }): Promise<T> {
  // Load environment variables dynamically
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !storefrontAccessToken) {
    throw new Error('Missing required environment variables: SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN');
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    const json = await result.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return json.data;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}

// Get all products
export async function getProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query GetProducts {
      products(first: 24) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            vendor
            productType
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ products: { edges: { node: any }[] } }>({ query });
  
  return response.products.edges.map(({ node }) => ({
    ...node,
    variants: node.variants.edges.map(({ node: variant }: any) => variant),
  }));
}

// Get single product by handle
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        availableForSale
        vendor
        productType
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ product: any }>({ 
    query, 
    variables: { handle } 
  });

  if (!response.product) {
    return null;
  }

  return {
    ...response.product,
    variants: response.product.variants.edges.map(({ node }: any) => node),
  };
}

// Create cart
export async function createCart(): Promise<ShopifyCart> {
  const query = `
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                      featuredImage {
                        url
                        altText
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartCreate: { cart: any } }>({ query });
  
  return {
    ...response.cartCreate.cart,
    lines: response.cartCreate.cart.lines.edges.map(({ node }: any) => node),
  };
}

// Add to cart
export async function addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart> {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                      featuredImage {
                        url
                        altText
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartLinesAdd: { cart: any } }>({
    query,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  return {
    ...response.cartLinesAdd.cart,
    lines: response.cartLinesAdd.cart.lines.edges.map(({ node }: any) => node),
  };
}

// Update cart line
export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const query = `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                      featuredImage {
                        url
                        altText
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartLinesUpdate: { cart: any } }>({
    query,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });

  return {
    ...response.cartLinesUpdate.cart,
    lines: response.cartLinesUpdate.cart.lines.edges.map(({ node }: any) => node),
  };
}

// Remove from cart
export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                      featuredImage {
                        url
                        altText
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartLinesRemove: { cart: any } }>({
    query,
    variables: {
      cartId,
      lineIds: [lineId],
    },
  });

  return {
    ...response.cartLinesRemove.cart,
    lines: response.cartLinesRemove.cart.lines.edges.map(({ node }: any) => node),
  };
}

// Get all collections
export async function getCollections(): Promise<ShopifyCollection[]> {
  const query = `
    query GetCollections {
      collections(first: 24) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
            products(first: 100) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ collections: { edges: { node: any }[] } }>({ query });

  return response.collections.edges.map(({ node }) => ({
    ...node,
    productsCount: node.products.edges.length,
  }));
}

// Get single collection by handle with products
export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const query = `
    query GetCollection($handle: String!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        image {
          url
          altText
        }
        products(first: 24) {
          edges {
            node {
              id
              title
              handle
              description
              availableForSale
              vendor
              productType
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ collection: any }>({ 
    query, 
    variables: { handle } 
  });

  if (!response.collection) {
    return null;
  }

  return {
    ...response.collection,
    products: response.collection.products.edges.map(({ node }: any) => ({
      ...node,
      variants: node.variants.edges.map(({ node: variant }: any) => variant),
    })),
    productsCount: response.collection.products.edges.length,
  };
}
