'use client';

import { useEffect, useState } from 'react';
import { loadStripe, Stripe as StripeType } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { AlertCircle, Loader, CheckCircle } from 'lucide-react';
import styles from './CheckoutForm.module.css';

interface CheckoutFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

function CheckoutFormInner({
  amount,
  currency = 'usd',
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create Payment Intent on backend
      const intentResponse = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          description: `Order for ${email}`,
          metadata: { email },
        }),
      });

      if (!intentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await intentResponse.json();

      // Step 2: Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: { email },
          },
        });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onError?.(stripeError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        onSuccess?.(paymentIntentId);
        // Optionally redirect after success
        setTimeout(() => {
          window.location.href = '/checkout/success';
        }, 2000);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successMessage}>
        <CheckCircle className={styles.successIcon} />
        <h2>Payment Successful!</h2>
        <p>Your order has been confirmed. Redirecting...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.error}>
          <AlertCircle className={styles.errorIcon} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={styles.input}
          required
          disabled={loading}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Card Details</label>
        <div className={styles.cardElement}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                },
              },
            }}
          />
        </div>
      </div>

      <div className={styles.amountDisplay}>
        <span>Total Amount</span>
        <strong>
          {currency.toUpperCase()} ${(amount / 100).toFixed(2)}
        </strong>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className={styles.submitButton}
      >
        {loading ? (
          <>
            <Loader className={styles.spinner} />
            Processing...
          </>
        ) : (
          `Pay $${(amount / 100).toFixed(2)}`
        )}
      </button>

      <p className={styles.disclaimer}>
        💳 Test card: 4242 4242 4242 4242 (any future date, any CVC)
      </p>
    </form>
  );
}

export function CheckoutForm({
  amount,
  currency,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<StripeType | null>>(
    Promise.resolve(null)
  );

  useEffect(() => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
      return;
    }
    setStripePromise(loadStripe(publishableKey));
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
