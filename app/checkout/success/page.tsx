'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { CheckCircle2, Home, ShoppingBag } from 'lucide-react';
import styles from './SuccessPage.module.css';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<{ orderNumber: number; orderId: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract payment intent ID from URL (Stripe redirects here)
  const paymentIntentId = searchParams.get('payment_intent');

  // Get Shopify store domain for admin link
  const shopifyStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';

  // Fetch order data from cache (webhook already created the order)
  // Uses recursive polling with retry logic (up to 10 attempts, 2-second intervals)
  useEffect(() => {
    setMounted(true);

    let timer: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 10;

    const pollOrder = async () => {
      if (attempts >= maxAttempts) {
        console.error('❌ Max polling attempts reached');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/payment/order-number?paymentIntentId=${paymentIntentId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder({
            orderNumber: data.orderNumber,
            orderId: data.orderId,
          });
          setLoading(false);
          console.log(`✅ Order #${data.orderNumber} found in cache`);
        } else if (response.status === 404) {
          // Order not yet in cache, retry after 2 seconds
          attempts++;
          timer = setTimeout(pollOrder, 2000);
        } else {
          console.error(`⚠️ Unexpected response: ${response.status}`);
          setLoading(false);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setLoading(false);
      }
    };

    if (paymentIntentId) {
      pollOrder();
    } else {
      setLoading(false);
    }

    return () => clearTimeout(timer);
  }, [paymentIntentId]);

  // Clear cart only after order is confirmed (order object populated)
  // This ensures items don't disappear if payment fails mid-checkout
  useEffect(() => {
    if (order) {
      console.log('🧹 Order confirmed - clearing cart...');
      clearCart();
      console.log('✅ Cart cleared after order confirmation');
    }
  }, [order, clearCart]);

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
          ) : order ? (
            <p className={styles.orderNumber}>
              #{order.orderNumber}
            </p>
          ) : (
            <p className={styles.orderNumberFallback}>
              Processing order...
            </p>
          )}
        </div>

        {/* Developer Demo Link: View in Shopify Admin */}
        {order && shopifyStoreDomain && (
          <div className={styles.devPortalBox}>
            <p className={styles.devPortalLabel}>🧪 Developer Demo</p>
            <a
              href={`https://admin.shopify.com/store/${shopifyStoreDomain.split('.')[0]}/orders/${order.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.devPortalLink}
            >
              Open Order in Shopify Admin ↗
            </a>
          </div>
        )}

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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <SuccessPageContent />
    </Suspense>
  );
}
