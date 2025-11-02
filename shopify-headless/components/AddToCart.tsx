'use client';

import { useState } from 'react';
import styles from './AddToCart.module.css';

interface AddToCartProps {
  variantId: string;
  availableForSale: boolean;
}

export function AddToCart({ variantId, availableForSale }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    if (!availableForSale) return;

    setIsLoading(true);
    setMessage('');

    try {
      // You'll implement the actual cart logic later
      // For now, this is a placeholder
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage('Added to cart!');
      
      setTimeout(() => setMessage(''), 3000);
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
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`${styles.button} ${styles.primaryButton}`}
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>

      {message && (
        <p className={`${styles.message} ${message.includes('Error') ? styles.errorMessage : styles.successMessage}`}>
          {message}
        </p>
      )}
    </div>
  );
}
