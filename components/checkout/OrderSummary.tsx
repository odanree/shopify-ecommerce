'use client';

import { CartItem } from '@/contexts/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export function OrderSummary({
  items,
  subtotal,
  tax,
  shipping,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-3 mb-4 pb-4 border-b">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div>
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax (Estimated)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
        <span className="font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Security badges */}
      <div className="mt-6 space-y-2 pt-6 border-t">
        <div className="flex items-center gap-2 text-xs text-green-700">
          <span>✓</span>
          <span>Secure checkout with Stripe</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-700">
          <span>✓</span>
          <span>30-day money-back guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-700">
          <span>✓</span>
          <span>Free shipping on all orders</span>
        </div>
      </div>
    </div>
  );
}
