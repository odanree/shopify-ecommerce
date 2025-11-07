'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';
import { useCart } from '@/contexts/CartContext';

export default function FamilyPlanPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [cartDetails, setCartDetails] = useState({ lines: 0, subtotal: 0, savings: 0 });

  const handleAddToCart = async (lines: any[]) => {
    console.log('🛒 Add to Cart clicked!');
    console.log('📦 Lines to add:', lines);
    
    try {
      // Prepare cart items with Shopify variant IDs
      const cartItems = lines.map((line) => ({
        merchandiseId: `gid://shopify/ProductVariant/${line.variantId}`,
        quantity: 1,
      }));
      
      console.log('🔑 Cart items with variant IDs:', cartItems);
      
      // Add each line to cart
      lines.forEach((line, index) => {
        addItem({
          id: `line-${line.id}-${line.variantId}`,
          variantId: line.variantId || '',
          title: line.isPrimary ? 'Unlimited Plan - Primary Line' : 'Unlimited Plan - Add-on Line',
          variant: line.variant === 'sim' ? 'Physical SIM Card' : 'eSIM (Digital)',
          price: line.isPrimary ? 49 : 24,
          quantity: 1,
        });
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate totals
      const subtotal = 49 + (lines.length - 1) * 24;
      const savings = (lines.length - 1) * 25;
      
      setCartDetails({ lines: lines.length, subtotal, savings });
      setShowSuccess(true);
      
      console.log('✅ Successfully added to cart');
      console.log('📊 Variant IDs used:', lines.map(l => l.variantId));
      
      // Redirect to cart after showing success message
      setTimeout(() => {
        router.push('/cart');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('❌ Failed to add to cart. Please try again.');
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-success-500 text-white px-6 py-4 rounded-lg shadow-2xl max-w-md">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">✅ Added to Cart!</h3>
                <p className="text-sm opacity-90">
                  {cartDetails.lines} lines • ${cartDetails.subtotal} total
                </p>
                <p className="text-sm font-semibold mt-1">
                  You saved ${cartDetails.savings}! 🎉
                </p>
              </div>
              <button 
                onClick={() => setShowSuccess(false)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <FamilyPlanBuilder
        config={{
          primaryLinePrice: 49,
          addonLinePrice: 24,
          addonSavings: 25,
          maxLines: 5,
          minLines: 2,
          primaryPlanName: 'Unlimited Plan - Primary Line',
          addonPlanName: 'Unlimited Plan - Add-on Line',
          // Add your actual Shopify variant IDs here
          primarySimVariantId: '44300835815469',
          primaryEsimVariantId: '44300835815469', // Update if you have a separate eSIM variant
          addonSimVariantId: '44300835815469', // Update with add-on line variant ID
          addonEsimVariantId: '44300835815469', // Update if different
        }}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
