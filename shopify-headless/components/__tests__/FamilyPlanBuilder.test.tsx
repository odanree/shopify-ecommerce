import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FamilyPlanBuilder from '../FamilyPlanBuilder';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid="shopping-cart-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  X: () => <div data-testid="x-icon" />,
  Smartphone: () => <div data-testid="smartphone-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
}));

describe('FamilyPlanBuilder', () => {
  const getAddLineButton = () => screen.getByRole('button', { name: /Add-a-Line for/i });

  describe('Initial Rendering', () => {
    it('renders with one primary line initially', () => {
      const { container } = render(<FamilyPlanBuilder />);
      expect(container.textContent).toContain('Build Your Family Plan');
      expect(container.textContent).toContain('Primary');
    });

    it('displays correct initial price ($49)', () => {
      render(<FamilyPlanBuilder />);
      const subtotal = screen.getByText((content, element) => {
        return element?.getAttribute('data-cy') === 'subtotal-amount' && content.includes('49');
      });
      expect(subtotal).toBeDefined();
    });

    it('renders SIM and eSIM variant options', () => {
      render(<FamilyPlanBuilder />);
      expect(screen.getByText(/SIM Card/i)).toBeDefined();
      expect(screen.getByText(/eSIM/i)).toBeDefined();
    });
  });

  describe('Adding Lines', () => {
    it('adds a line when button is clicked', () => {
      render(<FamilyPlanBuilder />);
      const addButton = getAddLineButton();
      
      fireEvent.click(addButton);
      
      const lines = screen.getAllByText(/Line \d+/);
      expect(lines.length).toBeGreaterThan(1);
    });

    it('updates price when adding lines', () => {
      render(<FamilyPlanBuilder />);
      const addButton = getAddLineButton();
      
      fireEvent.click(addButton);
      
      const subtotal = screen.getByText((content, element) => {
        return element?.getAttribute('data-cy') === 'subtotal-amount' && content.includes('73');
      });
      expect(subtotal).toBeDefined();
    });

    it('shows savings when adding lines', () => {
      render(<FamilyPlanBuilder />);
      const addButton = getAddLineButton();
      
      fireEvent.click(addButton);
      
      const savings = screen.getByText((content, element) => {
        return element?.getAttribute('data-cy') === 'savings-amount' && content.includes('25');
      });
      expect(savings).toBeDefined();
    });
  });

  describe('Removing Lines', () => {
    it('can remove add-on lines', () => {
      render(<FamilyPlanBuilder />);
      
      // Add a line first
      fireEvent.click(getAddLineButton());
      
      // Find and click remove button
      const removeButton = screen.getByLabelText(/Remove line/i);
      fireEvent.click(removeButton);
      
      // Should be back to $49
      const subtotal = screen.getByText((content, element) => {
        return element?.getAttribute('data-cy') === 'subtotal-amount' && content.includes('49');
      });
      expect(subtotal).toBeDefined();
    });

    it('cannot remove primary line', () => {
      render(<FamilyPlanBuilder />);
      
      // Should not have remove button for primary line
      const removeButtons = screen.queryAllByLabelText(/Remove line/i);
      expect(removeButtons.length).toBe(0);
    });
  });

  describe('Variant Selection', () => {
    it('can switch between SIM and eSIM', () => {
      render(<FamilyPlanBuilder />);
      
      const esimRadio = screen.getByLabelText(/eSIM/i);
      fireEvent.click(esimRadio);
      
      expect(esimRadio).toBeChecked();
    });

    it('each line has independent variant selection', () => {
      render(<FamilyPlanBuilder />);
      
      // Add a second line
      fireEvent.click(getAddLineButton());
      
      const esimRadios = screen.getAllByLabelText(/eSIM/i);
      expect(esimRadios.length).toBe(2); // One for each line
    });
  });

  describe('Add to Cart', () => {
    it('button is disabled with less than minimum lines', () => {
      render(<FamilyPlanBuilder />);
      
      const button = screen.getByRole('button', { name: /Add at least 2 lines/i });
      expect(button).toBeDisabled();
    });

    it('button is enabled with minimum lines', () => {
      render(<FamilyPlanBuilder />);
      
      // Add one line to reach minimum of 2
      fireEvent.click(getAddLineButton());
      
      const button = screen.getByRole('button', { name: /Add to Cart/i });
      expect(button).not.toBeDisabled();
    });

    it('calls onAddToCart callback when clicked', () => {
      const mockOnAddToCart = jest.fn();
      render(<FamilyPlanBuilder onAddToCart={mockOnAddToCart} />);
      
      // Add one line to reach minimum
      fireEvent.click(getAddLineButton());
      
      // Click add to cart
      const button = screen.getByRole('button', { name: /Add to Cart/i });
      fireEvent.click(button);
      
      expect(mockOnAddToCart).toHaveBeenCalled();
    });
  });

  describe('Custom Configuration', () => {
    it('respects custom pricing', () => {
      const customConfig = {
        primaryLinePrice: 39,
        addonLinePrice: 19,
      };
      
      render(<FamilyPlanBuilder config={customConfig} />);
      
      const subtotal = screen.getByText((content, element) => {
        return element?.getAttribute('data-cy') === 'subtotal-amount' && content.includes('39');
      });
      expect(subtotal).toBeDefined();
    });
  });
});
