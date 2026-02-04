import { render, screen } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { ShopifyProduct } from '@/types/shopify';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('ProductCard', () => {
  const mockProduct: ShopifyProduct = {
    id: 'gid://shopify/Product/1',
    title: 'Test Product',
    handle: 'test-product',
    description: 'This is a test product description',
    descriptionHtml: '<p>This is a test product description</p>',
    vendor: 'Test Vendor',
    productType: 'T-Shirt',
    availableForSale: true,
    priceRange: {
      minVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      url: 'https://example.com/image.jpg',
      altText: 'Test product image',
    },
    variants: [],
  };

  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$29.99 USD')).toBeInTheDocument();
  });

  it('renders product vendor', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
  });

  it('renders product image with correct src and alt', () => {
    render(<ProductCard product={mockProduct} />);
    const image = screen.getByAltText('Test product image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('links to correct product page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/test-product');
  });

  it('shows "Out of Stock" when product is not available', () => {
    const unavailableProduct = {
      ...mockProduct,
      availableForSale: false,
    };
    render(<ProductCard product={unavailableProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('does not show "Out of Stock" when product is available', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument();
  });

  it('does not render vendor if not provided', () => {
    const productWithoutVendor = {
      ...mockProduct,
      vendor: '',
    };
    render(<ProductCard product={productWithoutVendor} />);
    expect(screen.queryByText('Test Vendor')).not.toBeInTheDocument();
  });

  it('uses product title as alt text when featuredImage altText is not provided', () => {
    const productWithoutImageAlt = {
      ...mockProduct,
      featuredImage: {
        url: 'https://example.com/image.jpg',
        altText: null,
      },
    };
    render(<ProductCard product={productWithoutImageAlt as any} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
  });
});
