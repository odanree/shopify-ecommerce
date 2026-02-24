'use client';

import { CartItem } from '@/contexts/CartContext';
import styles from './CheckoutComponents.module.css';

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
    <div className={styles.orderSummaryBox}>
      <h2 className={styles.orderSummaryTitle}>Order Summary</h2>

      {/* Items List */}
      <div className={styles.itemsList}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemRow}>
            <div className={styles.itemLeftCol}>
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
            </div>
            <p className={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className={styles.totalsSection}>
        <div className={styles.totalRow}>
          <span className={styles.totalRowLabel}>Subtotal</span>
          <span className={styles.totalRowValue}>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.totalRow}>
          <span className={styles.totalRowLabel}>Shipping</span>
          <span className={`${styles.totalRowValue} ${shipping === 0 ? styles.shippingFree : ''}`}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className={styles.totalRow}>
          <span className={styles.totalRowLabel}>Tax (Estimated)</span>
          <span className={styles.totalRowValue}>${tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalAmount}>
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Security badges */}
      <div className={styles.badges}>
        <div className={styles.badge}>
          <span className={styles.badgeCheck}>✓</span>
          <span>Secure checkout with Stripe</span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeCheck}>✓</span>
          <span>30-day money-back guarantee</span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeCheck}>✓</span>
          <span>Free shipping on all orders</span>
        </div>
      </div>
    </div>
  );
}
