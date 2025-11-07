import { render, screen, act, renderHook, waitFor } from '@testing-library/react';
import { CartProvider, useCart, CartItem } from '../CartContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  const mockItem1: CartItem = {
    id: 'item-1',
    variantId: 'variant-1',
    title: 'Test Product 1',
    variant: 'Size: M',
    price: 29.99,
    quantity: 1,
    image: 'https://example.com/image1.jpg',
  };

  const mockItem2: CartItem = {
    id: 'item-2',
    variantId: 'variant-2',
    title: 'Test Product 2',
    variant: 'Size: L',
    price: 39.99,
    quantity: 2,
  };

  // useCart hook tests
  it('throws error when used outside CartProvider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');

    consoleError.mockRestore();
  });

  it('returns cart context when used inside CartProvider', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current).toHaveProperty('items');
    expect(result.current).toHaveProperty('addItem');
    expect(result.current).toHaveProperty('removeItem');
    expect(result.current).toHaveProperty('updateQuantity');
    expect(result.current).toHaveProperty('clearCart');
    expect(result.current).toHaveProperty('itemCount');
  });

  // Initial state
  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
  });

  // addItem functionality
  it('adds item to empty cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockItem1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(mockItem1);
    expect(result.current.itemCount).toBe(1);
  });

  it('adds multiple different items', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockItem1);
      result.current.addItem(mockItem2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.itemCount).toBe(3); // 1 + 2
  });

  it('updates quantity when adding same item again', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockItem1);
      result.current.addItem({ ...mockItem1, quantity: 2 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3); // 1 + 2
    expect(result.current.itemCount).toBe(3);
  });

  // removeItem functionality
  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockItem1);
      result.current.addItem(mockItem2);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.removeItem('item-1');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('item-2');
  });

  it('handles removing non-existent item gracefully', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockItem1);
    });

    act(() => {
      result.current.removeItem('non-existent-id');
    });

    expect(result.current.items).toHaveLength(1);
  });

  // updateQuantity functionality
  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockItem1);
    });

    act(() => {
      result.current.updateQuantity('item-1', 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.itemCount).toBe(5);
  });

  it('does not update quantity to less than 1', () => {
    const { result} = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem({ ...mockItem1, quantity: 3 });
    });

    const originalQuantity = result.current.items[0].quantity;

    act(() => {
      result.current.updateQuantity('item-1', 0);
    });

    expect(result.current.items[0].quantity).toBe(originalQuantity); // Unchanged

    act(() => {
      result.current.updateQuantity('item-1', -5);
    });

    expect(result.current.items[0].quantity).toBe(originalQuantity); // Still unchanged
  });

  it('handles updating non-existent item quantity', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem({ ...mockItem1, quantity: 3 });
    });

    const originalQuantity = result.current.items[0].quantity;

    act(() => {
      result.current.updateQuantity('non-existent-id', 5);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(originalQuantity); // Original unchanged
  });

  // clearCart functionality
  it('clears entire cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockItem1);
      result.current.addItem(mockItem2);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
  });

  // itemCount calculation
  it('calculates item count correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem({ ...mockItem1, quantity: 3 });
      result.current.addItem({ ...mockItem2, quantity: 5 });
    });

    expect(result.current.itemCount).toBe(8); // 3 + 5
  });

  // localStorage persistence
  it('loads cart from localStorage on mount', () => {
    const savedCart = [mockItem1, mockItem2];
    localStorageMock.setItem('cart', JSON.stringify(savedCart));

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    // Wait for useEffect to run
    expect(result.current.items).toHaveLength(2);
    expect(result.current.items).toEqual(savedCart);
  });

  it('saves cart to localStorage when items change', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockItem1);
    });

    // Wait for localStorage to update
    await waitFor(() => {
      const saved = localStorageMock.getItem('cart');
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual(mockItem1);
    });
  });

  it('handles corrupted localStorage data gracefully', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    localStorageMock.setItem('cart', 'invalid json');

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.items).toEqual([]); // Falls back to empty
    expect(consoleError).toHaveBeenCalledWith('Error loading cart:', expect.any(Error));

    consoleError.mockRestore();
  });

  it('persists cart across re-renders', () => {
    const { result, rerender } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(mockItem1);
    });

    expect(result.current.items).toHaveLength(1);

    rerender();

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(mockItem1);
  });

  // Integration test
  it('handles full cart workflow', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    // Add items - each has unique ID so both get added separately
    act(() => {
      result.current.addItem({ ...mockItem1, quantity: 1 });
      result.current.addItem({ ...mockItem2, quantity: 2 });
    });
    // item1 qty: 1, item2 qty: 2 = total 3
    expect(result.current.itemCount).toBe(3);

    // Update quantity of item1 from 1 to 5
    act(() => {
      result.current.updateQuantity('item-1', 5);
    });
    // item1 qty: 5, item2 qty: 2 = total 7
    expect(result.current.itemCount).toBe(7);

    // Remove item2
    act(() => {
      result.current.removeItem('item-2');
    });
    // item1 qty: 5 = total 5
    expect(result.current.itemCount).toBe(5);

    // Clear cart
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
  });
});
