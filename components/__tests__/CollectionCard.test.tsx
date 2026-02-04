import { render, screen } from '@testing-library/react';
import CollectionCard from '../CollectionCard';
import { ShopifyCollection } from '@/types/shopify';

// Mock Next.js Image and Link components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, fill, sizes, className, ...rest } = props;
    return (
      <img
        src={src}
        alt={alt}
        data-fill={fill}
        data-sizes={sizes}
        className={className}
        {...rest}
      />
    );
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('CollectionCard', () => {
  const mockCollectionWithImage: ShopifyCollection = {
    id: 'collection-1',
    title: 'Summer Collection',
    handle: 'summer-collection',
    description: 'Hot summer styles',
    image: {
      url: 'https://example.com/collection.jpg',
      altText: 'Summer collection banner',
    },
    productsCount: 12,
    products: [],
  };

  const mockCollectionWithoutImage: ShopifyCollection = {
    id: 'collection-2',
    title: 'Winter Collection',
    handle: 'winter-collection',
    description: 'Cozy winter wear',
    productsCount: 8,
    products: [],
  };

  const mockCollectionMinimal: ShopifyCollection = {
    id: 'collection-3',
    title: 'Basic Collection',
    handle: 'basic-collection',
    products: [],
  };

  // Rendering Tests
  it('renders collection title', () => {
    render(<CollectionCard collection={mockCollectionWithImage} />);
    expect(screen.getByText('Summer Collection')).toBeInTheDocument();
  });

  it('renders collection description when provided', () => {
    render(<CollectionCard collection={mockCollectionWithImage} />);
    expect(screen.getByText('Hot summer styles')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<CollectionCard collection={mockCollectionMinimal} />);
    expect(screen.queryByText('Hot summer styles')).not.toBeInTheDocument();
  });

  it('renders product count when provided', () => {
    render(<CollectionCard collection={mockCollectionWithImage} />);
    expect(screen.getByText('12 products')).toBeInTheDocument();
  });

  it('uses singular "product" when count is 1', () => {
    const singleProductCollection: ShopifyCollection = {
      ...mockCollectionMinimal,
      productsCount: 1,
    };
    render(<CollectionCard collection={singleProductCollection} />);
    expect(screen.getByText('1 product')).toBeInTheDocument();
  });

  it('does not render product count when undefined', () => {
    render(<CollectionCard collection={mockCollectionMinimal} />);
    expect(screen.queryByText(/product/i)).not.toBeInTheDocument();
  });

  // Image Tests
  it('renders collection image when provided', () => {
    render(<CollectionCard collection={mockCollectionWithImage} />);
    const image = screen.getByAltText('Summer collection banner');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/collection.jpg');
  });

  it('uses collection title as image alt text when altText not provided', () => {
    const collectionNoAlt: ShopifyCollection = {
      ...mockCollectionWithImage,
      image: {
        url: 'https://example.com/collection.jpg',
      },
    };
    render(<CollectionCard collection={collectionNoAlt} />);
    const image = screen.getByAltText('Summer Collection');
    expect(image).toBeInTheDocument();
  });

  it('renders placeholder SVG when image not provided', () => {
    const { container } = render(<CollectionCard collection={mockCollectionWithoutImage} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // Link Tests
  it('links to correct collection page', () => {
    render(<CollectionCard collection={mockCollectionWithImage} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/collections/summer-collection');
  });

  it('wraps entire card in link', () => {
    render(<CollectionCard collection={mockCollectionWithImage} />);
    const link = screen.getByRole('link');
    expect(link).toContainElement(screen.getByText('Summer Collection'));
    expect(link).toContainElement(screen.getByText('Hot summer styles'));
  });

  // Edge Cases
  it('handles collection with zero products', () => {
    const zeroProductCollection: ShopifyCollection = {
      ...mockCollectionMinimal,
      productsCount: 0,
    };
    render(<CollectionCard collection={zeroProductCollection} />);
    expect(screen.getByText('0 products')).toBeInTheDocument();
  });

  it('handles collection with all optional fields omitted', () => {
    render(<CollectionCard collection={mockCollectionMinimal} />);
    expect(screen.getByText('Basic Collection')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/collections/basic-collection');
  });
});
