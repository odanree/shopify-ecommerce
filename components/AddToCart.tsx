'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from './AddToCart.module.css';

interface AddToCartProps {
  variantId: string;
  availableForSale: boolean;
  productTitle?: string;
  productImage?: string;
  price?: string;
  variant?: string;
}

export function AddToCart({ 
  variantId, 
  availableForSale,
  productTitle = 'Product',
  productImage,
  price = '0.00',
  variant = 'Default'
}: AddToCartProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { addItem } = useCart();

const handleAddToCart = async () => {
    if (!availableForSale) return;

    setIsLoading(true);
    setMessage('');

    try {
      // 1. Trigger the add in React state
      addItem({
        id: variantId,
        variantId: variantId,
        title: productTitle,
        variant: variant,
        price: parseFloat(price),
        quantity: quantity,
        image: productImage
      });
      
      setMessage('Added to cart!');
      
      // 2. Ensure cart persists to localStorage before redirect
      //    The useEffect will eventually sync, but we force it here to be safe
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          try {
            // Get existing cart from localStorage (from previous hydration or previous adds)
            const existingItems = JSON.parse(localStorage.getItem('cart') || '[]');
            
            // Check if this item already exists
            const itemIndex = existingItems.findIndex((item: any) => item.id === variantId);
            if (itemIndex > -1) {
              // Update quantity
              existingItems[itemIndex].quantity += quantity;
            } else {
              // Add new item
              existingItems.push({
                id: variantId,
                variantId: variantId,
                title: productTitle,
                variant: variant,
                price: parseFloat(price),
                quantity: quantity,
                image: productImage
              });
            }
            
            // Write back to localStorage
            localStorage.setItem('cart', JSON.stringify(existingItems));
            console.log('✅ Cart persisted to localStorage before redirect');
          } catch (e) {
            console.warn('Warning: Could not persist cart to localStorage:', e);
            // Still resolve - let the redirect happen even if localStorage fails
          }
          resolve();
        }, 150);
      });
      
      router.push('/cart');
    } catch (error) {
      setMessage('Error adding to cart');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!availableForSale) {
    return (
      <button 
        disabled
        className={`${styles.button} ${styles.outOfStockButton}`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.quantityContainer}>
        <label htmlFor="quantity" className={styles.quantityLabel}>
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className={styles.quantityInput}
        />
      </div>

      <button
        data-testid="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`${styles.button} ${styles.primaryButton}`}
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>

      <p className={`${styles.message} ${message.includes('Error') ? styles.errorMessage : styles.successMessage}`}>
        {message || '\u00A0'}
      </p>
    </div>
  );
}
