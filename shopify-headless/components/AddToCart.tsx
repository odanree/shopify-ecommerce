'use client';

import { useState } from 'react';
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
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    if (!availableForSale) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Add to cart using CartContext
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

      <p className={`${styles.message} ${message.includes('Error') ? styles.errorMessage : styles.successMessage}`}>
        {message || '\u00A0'}
      </p>
    </div>
  );
}
