'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertCircle, Loader2 } from 'lucide-react';
import styles from './CheckoutComponents.module.css';

interface PaymentStepProps {
  clientSecret: string | null;
  isLoading?: boolean;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

function PaymentForm({
  clientSecret,
  isLoading,
  onSuccess,
  onError,
}: PaymentStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Payment form not ready. Please refresh and try again.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Step 1: MUST CALL THIS FIRST
      // This triggers form validation and prepares the data
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Form validation failed');
        onError?.(submitError.message || 'Form validation failed');
        setSubmitting(false);
        return;
      }

      // Step 2: Now safely confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success`,
          },
        });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onError?.(stripeError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        // Don't clear cart here - success page will handle it
        // This prevents race condition with Stripe redirect
        onSuccess?.(paymentIntent.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.paymentForm}>
      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle className={styles.errorIcon} />
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      <div className={styles.paymentDetailsBox}>
        <label className={styles.paymentDetailsLabel}>
          Payment Details
        </label>
        <div className={styles.paymentElementContainer}>
          {clientSecret ? (
            <PaymentElement
              options={{
                layout: 'tabs',
                wallets: {
                  applePay: 'auto',
                  googlePay: 'auto',
                },
              }}
            />
          ) : (
            <div className={styles.paymentLoadingPlaceholder}>
              <span className={styles.paymentLoadingText}>Loading payment form...</span>
            </div>
          )}
        </div>
        <p className={styles.testCardInfo}>
          💳 Test: 4242 4242 4242 4242
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting || !stripe || !elements || !clientSecret || isLoading}
        className={styles.completeButton}
      >
        {submitting ? (
          <>
            <Loader2 className={styles.spinnerIcon} />
            Securely processing payment...
          </>
        ) : (
          'Complete Purchase'
        )}
      </button>
    </form>
  );
}

export function PaymentStep(props: PaymentStepProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.paymentLoadingPlaceholder} style={{ height: '20rem' }} />
    );
  }

  if (!props.clientSecret) {
    return (
      <div className={styles.paymentLoadingPlaceholder} style={{ height: '20rem' }}>
        <Loader2 className={styles.spinnerIcon} />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
          },
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
}
