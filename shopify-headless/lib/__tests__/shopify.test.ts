import {
  getProducts,
  getProduct,
  searchProducts,
  getCollections,
  getCollection,
  createCart,
  addToCart,
} from '../shopify';

// Mock the global fetch function
global.fetch = jest.fn();

describe('Shopify API Functions', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
    // Set environment variables
    process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com';
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'test-token';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('fetches and returns products successfully', async () => {
      const mockProducts = {
        products: {
          edges: [
            {
              node: {
                id: 'product-1',
                title: 'Test Product',
                handle: 'test-product',
                description: 'A test product',
                availableForSale: true,
                vendor: 'Test Vendor',
                productType: 'T-Shirt',
                featuredImage: {
                  url: 'https://example.com/image.jpg',
                  altText: 'Test image',
                },
                priceRange: {
                  minVariantPrice: {
                    amount: '29.99',
                    currencyCode: 'USD',
                  },
                },
                variants: {
                  edges: [
                    {
                      node: {
                        id: 'variant-1',
                        title: 'Default',
                        availableForSale: true,
                        price: {
                          amount: '29.99',
                          currencyCode: 'USD',
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProducts }),
      } as Response);

      const result = await getProducts();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Product');
      expect(result[0].variants).toHaveLength(1);
    });

    it('throws error when environment variables are missing', async () => {
      delete process.env.SHOPIFY_STORE_DOMAIN;

      await expect(getProducts()).rejects.toThrow(
        'Missing required environment variables'
      );
    });

    it('handles API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          errors: [{ message: 'GraphQL Error' }],
        }),
      } as Response);

      await expect(getProducts()).rejects.toThrow('GraphQL Error');
    });

    it('handles HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getProducts()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('getProduct', () => {
    it('fetches and returns single product by handle', async () => {
      const mockProduct = {
        product: {
          id: 'product-1',
          title: 'Test Product',
          handle: 'test-product',
          description: 'A test product',
          availableForSale: true,
          vendor: 'Test Vendor',
          productType: 'T-Shirt',
          featuredImage: {
            url: 'https://example.com/image.jpg',
            altText: 'Test image',
          },
          priceRange: {
            minVariantPrice: {
              amount: '29.99',
              currencyCode: 'USD',
            },
          },
          variants: {
            edges: [
              {
                node: {
                  id: 'variant-1',
                  title: 'Default',
                  availableForSale: true,
                  price: {
                    amount: '29.99',
                    currencyCode: 'USD',
                  },
                },
              },
            ],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProduct }),
      } as Response);

      const result = await getProduct('test-product');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Test Product');
      expect(result?.handle).toBe('test-product');
    });

    it('returns null when product not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { product: null } }),
      } as Response);

      const result = await getProduct('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('searchProducts', () => {
    it('searches and returns matching products', async () => {
      const mockSearchResults = {
        products: {
          edges: [
            {
              node: {
                id: 'product-1',
                title: 'Blue Shirt',
                handle: 'blue-shirt',
                description: 'A blue shirt',
                availableForSale: true,
                vendor: 'Test Vendor',
                productType: 'T-Shirt',
                featuredImage: {
                  url: 'https://example.com/image.jpg',
                  altText: 'Blue shirt',
                },
                priceRange: {
                  minVariantPrice: {
                    amount: '25.99',
                    currencyCode: 'USD',
                  },
                },
                variants: {
                  edges: [
                    {
                      node: {
                        id: 'variant-1',
                        title: 'Medium',
                        availableForSale: true,
                        price: {
                          amount: '25.99',
                          currencyCode: 'USD',
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockSearchResults }),
      } as Response);

      const result = await searchProducts('blue');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Blue Shirt');
    });

    it('returns empty array when no results found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { products: { edges: [] } } }),
      } as Response);

      const result = await searchProducts('xyz123');

      expect(result).toEqual([]);
    });
  });

  describe('getCollections', () => {
    it('fetches and returns collections successfully', async () => {
      const mockCollections = {
        collections: {
          edges: [
            {
              node: {
                id: 'collection-1',
                title: 'Summer Collection',
                handle: 'summer',
                description: 'Summer styles',
                image: {
                  url: 'https://example.com/collection.jpg',
                  altText: 'Summer',
                },
                products: {
                  edges: [],
                },
              },
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCollections }),
      } as Response);

      const result = await getCollections();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Summer Collection');
    });
  });

  describe('getCollection', () => {
    it('fetches and returns single collection by handle', async () => {
      const mockCollection = {
        collection: {
          id: 'collection-1',
          title: 'Summer Collection',
          handle: 'summer',
          description: 'Summer styles',
          image: {
            url: 'https://example.com/collection.jpg',
            altText: 'Summer',
          },
          products: {
            edges: [
              {
                node: {
                  id: 'product-1',
                  title: 'Summer Shirt',
                  handle: 'summer-shirt',
                  description: 'A summer shirt',
                  availableForSale: true,
                  vendor: 'Test Vendor',
                  productType: 'T-Shirt',
                  featuredImage: {
                    url: 'https://example.com/image.jpg',
                    altText: 'Summer shirt',
                  },
                  priceRange: {
                    minVariantPrice: {
                      amount: '29.99',
                      currencyCode: 'USD',
                    },
                  },
                  variants: {
                    edges: [
                      {
                        node: {
                          id: 'variant-1',
                          title: 'Medium',
                          availableForSale: true,
                          price: {
                            amount: '29.99',
                            currencyCode: 'USD',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCollection }),
      } as Response);

      const result = await getCollection('summer');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Summer Collection');
      expect(result?.products).toHaveLength(1);
    });

    it('returns null when collection not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { collection: null } }),
      } as Response);

      const result = await getCollection('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getProducts()).rejects.toThrow('Network error');
    });

    it('logs errors to console', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockFetch.mockRejectedValueOnce(new Error('Test error'));

      await expect(getProducts()).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Shopify API Error:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Cart Functions', () => {
    it('creates a new cart', async () => {
      const mockCart = {
        id: 'gid://shopify/Cart/123',
        checkoutUrl: 'https://example.com/checkout',
        lines: { edges: [] },
        cost: {
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { cartCreate: { cart: mockCart } } }),
      } as Response);

      const cart = await createCart();
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(cart).toBeDefined();
    });

    it('adds item to cart', async () => {
      const mockCart = {
        id: 'gid://shopify/Cart/123',
        checkoutUrl: 'https://example.com/checkout',
        lines: {
          edges: [{
            node: {
              id: 'line-1',
              quantity: 1,
              merchandise: {
                id: 'variant-1',
                title: 'Test Variant',
                product: {
                  title: 'Test Product',
                  handle: 'test-product',
                  featuredImage: null,
                },
                price: { amount: '29.99', currencyCode: 'USD' },
              },
            },
          }],
        },
        cost: {
          totalAmount: { amount: '29.99', currencyCode: 'USD' },
          subtotalAmount: { amount: '29.99', currencyCode: 'USD' },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { cartLinesAdd: { cart: mockCart } } }),
      } as Response);

      const cart = await addToCart('cart-id', 'variant-id', 1);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(cart).toBeDefined();
    });
  });
});
