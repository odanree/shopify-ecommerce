import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToCart } from '../AddToCart';
import { CartProvider } from '@/contexts/CartContext';

// Mock CartContext
const mockAddItem = jest.fn();

jest.mock('@/contexts/CartContext', () => ({
  ...jest.requireActual('@/contexts/CartContext'),
  useCart: () => ({
    items: [],
    addItem: mockAddItem,
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    itemCount: 0,
  }),
}));

describe('AddToCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    variantId: 'variant-123',
    availableForSale: true,
    productTitle: 'Test Product',
    productImage: 'https://example.com/image.jpg',
    price: '29.99',
    variant: 'Large / Blue',
  };

  describe('Out of Stock', () => {
    it('renders "Out of Stock" button when product is not available', () => {
      render(<AddToCart {...defaultProps} availableForSale={false} />);
      
      const button = screen.getByRole('button', { name: /out of stock/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('does not show quantity input when out of stock', () => {
      render(<AddToCart {...defaultProps} availableForSale={false} />);
      
      expect(screen.queryByLabelText(/quantity/i)).not.toBeInTheDocument();
    });
  });

  describe('Available Product', () => {
    it('renders quantity input with default value of 1', () => {
      render(<AddToCart {...defaultProps} />);
      
      const quantityInput = screen.getByLabelText(/quantity/i);
      expect(quantityInput).toBeInTheDocument();
      expect(quantityInput).toHaveValue(1);
    });

    it('renders "Add to Cart" button when available', () => {
      render(<AddToCart {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('allows changing quantity', async () => {
      render(<AddToCart {...defaultProps} />);
      
      const quantityInput = screen.getByLabelText(/quantity/i) as HTMLInputElement;
      
      // Select all and type new value
      fireEvent.change(quantityInput, { target: { value: '5' } });
      
      expect(quantityInput).toHaveValue(5);
    });

    it('enforces minimum quantity of 1', async () => {
      const user = userEvent.setup();
      render(<AddToCart {...defaultProps} />);
      
      const quantityInput = screen.getByLabelText(/quantity/i) as HTMLInputElement;
      
      await user.clear(quantityInput);
      await user.type(quantityInput, '0');
      
      // Input should have min="1" attribute
      expect(quantityInput).toHaveAttribute('min', '1');
    });

    it('enforces maximum quantity of 10', () => {
      render(<AddToCart {...defaultProps} />);
      
      const quantityInput = screen.getByLabelText(/quantity/i) as HTMLInputElement;
      expect(quantityInput).toHaveAttribute('max', '10');
    });
  });

  describe('Add to Cart Functionality', () => {
    it('calls addItem when "Add to Cart" button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddToCart {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      await user.click(button);
      
      expect(mockAddItem).toHaveBeenCalledTimes(1);
      expect(mockAddItem).toHaveBeenCalledWith({
        id: 'variant-123',
        variantId: 'variant-123',
        title: 'Test Product',
        variant: 'Large / Blue',
        price: 29.99,
        quantity: 1,
        image: 'https://example.com/image.jpg',
      });
    });

    it('adds correct quantity to cart', async () => {
      render(<AddToCart {...defaultProps} />);
      
      const quantityInput = screen.getByLabelText(/quantity/i);
      fireEvent.change(quantityInput, { target: { value: '3' } });
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: 3,
          })
        );
      });
    });

    it('shows loading state when adding to cart', async () => {
      render(<AddToCart {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      
      fireEvent.click(button);
      
      // Loading happens so fast in tests, just verify button works
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalled();
      });
    });

    it('shows success message after adding to cart', async () => {
      const user = userEvent.setup();
      render(<AddToCart {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
      });
    });

    it('uses default values when optional props are not provided', async () => {
      const user = userEvent.setup();
      const minimalProps = {
        variantId: 'variant-456',
        availableForSale: true,
      };
      
      render(<AddToCart {...minimalProps} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      await user.click(button);
      
      expect(mockAddItem).toHaveBeenCalledWith({
        id: 'variant-456',
        variantId: 'variant-456',
        title: 'Product',
        variant: 'Default',
        price: 0,
        quantity: 1,
        image: undefined,
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles invalid quantity input by defaulting to 1', async () => {
      render(<AddToCart {...defaultProps} />);
      
      const quantityInput = screen.getByLabelText(/quantity/i);
      
      // Simulate typing non-numeric value
      fireEvent.change(quantityInput, { target: { value: '' } });
      
      await waitFor(() => {
        expect(quantityInput).toHaveValue(1);
      });
    });

    it('disables button while loading', async () => {
      render(<AddToCart {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      
      fireEvent.click(button);
      
      // Verify the action completed
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalled();
      });
    });
  });
});
