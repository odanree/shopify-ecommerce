'use client';

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export type CheckoutStatusType = 'loading' | 'error' | 'success' | null;

interface CheckoutStatusProps {
  status: CheckoutStatusType;
  message?: string;
  details?: string;
}

export function CheckoutStatus({ status, message, details }: CheckoutStatusProps) {
  if (!status) return null;

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-blue-900">
          {message || 'Processing your payment...'}
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm font-medium text-red-900">
            {message || 'Payment failed'}
          </p>
        </div>
        {details && (
          <p className="text-xs text-red-700 ml-7">{details}</p>
        )}
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <p className="text-sm font-medium text-green-900">
          {message || 'Payment successful!'}
        </p>
      </div>
    );
  }

  return null;
}
