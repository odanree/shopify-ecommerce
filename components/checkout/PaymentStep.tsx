'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertCircle, Loader2 } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white p-6 border rounded-lg">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Payment Details
        </label>
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
          <div className="h-20 bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <span className="text-gray-500 text-sm">Loading payment form...</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || !stripe || !elements || !clientSecret || isLoading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Securely processing payment...
          </>
        ) : (
          'Complete Purchase'
        )}
      </button>

      <p className="text-xs text-gray-600 text-center">
        💳 Test card: 4242 4242 4242 4242 (any future date, any 3-digit CVC)
      </p>
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
      <div className="h-80 bg-gray-100 rounded animate-pulse" />
    );
  }

  if (!props.clientSecret) {
    return (
      <div className="h-80 bg-gray-100 rounded animate-pulse flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
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
