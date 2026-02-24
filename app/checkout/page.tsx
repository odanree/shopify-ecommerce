'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { PaymentStep } from '@/components/checkout/PaymentStep';
import { AddressStep } from '@/components/checkout/AddressStep';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CheckoutStatus, type CheckoutStatusType } from '@/components/checkout/CheckoutStatus';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems } = useCart();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [status, setStatus] = useState<CheckoutStatusType>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isCreatingIntent, setIsCreatingIntent] = useState(true);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    city: '',
    zip: '',
    country: 'US',
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Create Payment Intent on mount
  useEffect(() => {
    async function createPaymentIntent() {
      if (cartItems.length === 0) {
        router.push('/cart');
        return;
      }

      try {
        setStatus('loading');
        setStatusMessage('Preparing checkout...');

        const response = await fetch('/api/payment/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            email: address.email || 'guest@example.com',
            cartId: Math.random().toString(36),
            lineItems: cartItems.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              title: item.title,
              price: item.price,
            })),
            shippingAddress: address,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
        setStatus(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setStatus('error');
        setStatusMessage('Failed to prepare checkout');
        console.error('Payment intent error:', errorMessage);
      } finally {
        setIsCreatingIntent(false);
      }
    }

    createPaymentIntent();
  }, []); // Only run once on mount

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Please add items before checking out.</p>
          <Link href="/cart" className="text-blue-600 hover:underline">
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/cart" className="flex items-center gap-2 text-blue-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Messages */}
            {status && (
              <CheckoutStatus status={status} message={statusMessage} />
            )}

            {/* Address Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <AddressStep
                onAddressChange={setAddress}
                isLoading={isCreatingIntent}
              />
            </div>

            {/* Payment Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>
              <PaymentStep
                clientSecret={clientSecret}
                isLoading={isCreatingIntent}
                onSuccess={(paymentIntentId) => {
                  setStatus('success');
                  setStatusMessage('Payment successful! Redirecting...');
                  // Stripe will redirect to /checkout/success via PaymentElement
                }}
                onError={(error) => {
                  setStatus('error');
                  setStatusMessage(error);
                }}
              />
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div>
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
