'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { PaymentStep } from '@/components/checkout/PaymentStep';
import { AddressStep } from '@/components/checkout/AddressStep';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CheckoutStatus, type CheckoutStatusType } from '@/components/checkout/CheckoutStatus';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { items: cartItems, isHydrated } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [status, setStatus] = useState<CheckoutStatusType>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    province: '',
    zip: '',
    country: 'US',
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Validate address form
  const isAddressValid = address.firstName && address.lastName && address.address1 && address.city && address.province && address.zip;

  // Create Payment Intent when user submits address form
  // This ensures firstName, lastName are populated in metadata
  const handleContinueToPayment = async () => {
    if (!isAddressValid) {
      setStatus('error');
      setStatusMessage('Please fill in all address fields');
      return;
    }

    try {
      setStatus('loading');
      setStatusMessage('Preparing checkout...');
      setIsCreatingIntent(true);

      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          // Email will be extracted from Stripe payment method, not form
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
  };

  // Keep DOM stable during hydration and empty cart state
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCheckoutScreen}>
        <div className={styles.emptyCheckoutContent}>
          <h1 className={styles.emptyCheckoutTitle}>Your Cart is Empty</h1>
          <p className={styles.emptyCheckoutMessage}>Please add items before checking out.</p>
          <Link href="/cart" className={styles.emptyCheckoutLink}>
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutScreen}>
      {/* Header */}
      <div className={styles.checkoutHeader}>
        <div className={styles.checkoutHeaderContainer}>
          <Link href="/cart" className={styles.backLink}>
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className={styles.checkoutTitle}>Checkout</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.checkoutContent}>
        <div className={styles.checkoutGrid}>
          {/* Left Column: Checkout Form */}
          <div className={styles.formColumn}>
            {/* Status Messages */}
            {status && (
              <div className={styles.statusContainer}>
                <CheckoutStatus status={status} message={statusMessage} />
              </div>
            )}

            {/* Address Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                Shipping Address
              </h2>
              <AddressStep
                address={address}
                onAddressChange={setAddress}
                isLoading={isCreatingIntent}
              />
              
              {/* Continue to Payment Button - Only show before payment intent is created */}
              {!clientSecret && (
                <button
                  onClick={handleContinueToPayment}
                  disabled={isCreatingIntent || !isAddressValid}
                  className={styles.continueButton}
                >
                  {isCreatingIntent ? 'Preparing checkout...' : 'Continue to Payment'}
                </button>
              )}
            </div>

            {/* Payment Section - Only show after payment intent is created */}
            {clientSecret && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
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
            )}
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className={styles.summaryColumn}>
            <div className={styles.orderSummaryBox}>
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
    </div>
  );
}
