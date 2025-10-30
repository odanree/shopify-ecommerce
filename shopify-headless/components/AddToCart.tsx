'use client';

import { useState } from 'react';

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
        className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        <label htmlFor="quantity" className="font-semibold">
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="border rounded px-3 py-2 w-20"
        />
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>

      {message && (
        <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
