'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { CheckCircle2, Home, ShoppingBag } from 'lucide-react';
import styles from './SuccessPage.module.css';

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
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        {/* Success Icon */}
        <div className={styles.successIconContainer}>
          <div className={styles.successIconCircle}>
            <CheckCircle2 className={styles.successIcon} />
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.successTitle}>
          Order Confirmed! 🎉
        </h1>

        {/* Subtitle */}
        <p className={styles.successSubtitle}>
          Thank you for your purchase. Your order has been successfully processed.
        </p>

        {/* Confirmation Number */}
        <div className={styles.confirmationBox}>
          <p className={styles.confirmationLabel}>Your Order Number</p>
          {loading ? (
            <div className={styles.orderNumberLoading} />
          ) : orderNumber ? (
            <p className={styles.orderNumber}>
              #{orderNumber}
            </p>
          ) : (
            <p className={styles.orderNumberFallback}>
              {paymentIntentId}
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className={styles.orderDetailsBox}>
          <div className={styles.detailRow}>
            <ShoppingBag className={styles.detailIcon} />
            <div className={styles.detailContent}>
              <p className={styles.detailLabel}>Order Status</p>
              <p className={styles.detailValue}>Processing</p>
            </div>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailEmoji}>📧</span>
            <div className={styles.detailContent}>
              <p className={styles.detailLabel}>Next Step</p>
              <p className={styles.detailValue}>
                Check your email for confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsContainer}>
          <Link
            href="/products"
            className={styles.primaryAction}
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className={styles.secondaryAction}
          >
            <Home className={styles.homeIcon} />
            Back Home
          </Link>
        </div>

        {/* Support */}
        <p className={styles.supportText}>
          Questions?{' '}
          <a href="mailto:support@example.com" className={styles.supportLink}>
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
