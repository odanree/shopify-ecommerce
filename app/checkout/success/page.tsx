'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { CheckCircle2, Home, ShoppingBag } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract payment intent ID from URL (Stripe redirects here)
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    setMounted(true);

    // Immediately clear cart (defensive: clear React state + localStorage)
    console.log('🧹 Success page mounted - clearing cart...');
    clearCart();
    console.log('✅ Cart cleared on success page');

    // Fetch order number from cache
    if (paymentIntentId) {
      async function fetchOrderNumber() {
        try {
          const response = await fetch(`/api/payment/order-number?paymentIntentId=${paymentIntentId}`);
          if (response.ok) {
            const data = await response.json();
            setOrderNumber(data.orderNumber);
            console.log(`📦 Order #${data.orderNumber} found in cache`);
          }
        } catch (error) {
          console.error('Failed to fetch order number:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchOrderNumber();
    } else {
      setLoading(false);
    }
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed! 🎉
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully processed.
        </p>

        {/* Confirmation Number */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Your Order Number</p>
          {loading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          ) : orderNumber ? (
            <p className="font-mono text-3xl font-bold text-blue-600">
              #{orderNumber}
            </p>
          ) : (
            <p className="font-mono text-lg font-semibold text-gray-900 break-all">
              {paymentIntentId}
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="space-y-3 mb-6 text-left bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600">Order Status</p>
              <p className="font-medium text-gray-900">Processing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="text-xs text-gray-600">Next Step</p>
              <p className="font-medium text-gray-900">
                Check your email for confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mb-6">
          <Link
            href="/products"
            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition"
          >
            <Home className="w-5 h-5" />
            Back Home
          </Link>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-600">
          Questions?{' '}
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
