'use client';

import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, isHydrated } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping: number = 0; // Free shipping
  const tax = subtotal * 0.08; // Example 8% tax
  const total = subtotal + shipping + tax;

  if (!isHydrated) {
    // Wait for cart to hydrate from localStorage
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCartScreen} data-testid="empty-cart-page" data-cy="empty-cart-page">
        <div className={styles.emptyCartContainer}>
          <div className={styles.emptyCardBox}>
            <div className={styles.emptyIconBox}>
              <ShoppingCart className={styles.emptyIcon} />
            </div>
            <h1 className={styles.emptyTitle} data-cy="empty-cart-title">Your Cart is Empty</h1>
            <p className={styles.emptyMessage} data-cy="empty-cart-message">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <div className={styles.emptyActions} data-cy="empty-cart-actions">
              <Link
                href="/family-plan"
                className={`${styles.actionButton} ${styles.primaryButton}`}
                data-cy="build-family-plan-link"
              >
                <ShoppingCart className="w-5 h-5" />
                Build Your Family Plan
              </Link>
              <Link
                href="/products"
                className={`${styles.actionButton} ${styles.secondaryButton}`}
                data-cy="browse-products-link"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartScreen} data-cy="cart-page">
      <div className={styles.cartContainer}>
        {/* Header */}
        <div className={styles.cartHeader}>
          <Link
            href="/products"
            className={styles.backLink}
            data-cy="continue-shopping-link"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
          <h1 className={styles.cartTitle} data-cy="cart-title">Shopping Cart</h1>
          <p className={styles.cartSubtitle} data-cy="cart-item-count">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className={styles.cartGrid}>
          {/* Cart Items */}
          <div className={styles.cartItemsList} data-cy="cart-items-list">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={styles.cartItem}
                data-testid="cart-item"
                data-cy="cart-item"
              >
                {/* Product Image */}
                <div className={styles.itemImageBox}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={96}
                      height={96}
                      className={styles.itemImage}
                    />
                  ) : (
                    <ShoppingCart className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                {/* Product Details */}
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemTitle}>
                    {item.title}
                  </h3>
                  <p className={styles.itemVariant}>{item.variant}</p>
                  <p className={styles.itemPrice}>
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className={styles.itemControls}>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityButton}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={styles.quantityDisplay}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityButton}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className={styles.removeButton}
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span className={`${styles.summaryValue} ${styles.shippingFree}`}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Estimated Tax</span>
                <span className={styles.summaryValue}>
                  ${tax.toFixed(2)}
                </span>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalAmount}>
                ${total.toFixed(2)}
              </span>
            </div>

            <Link
              href="/checkout"
              className={styles.checkoutButton}
              data-testid="checkout-btn"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/family-plan"
              className={styles.addMoreLink}
            >
              Add More Lines
            </Link>

            {/* Trust Badges */}
            <div className={styles.badges}>
              <div className={styles.badge}>
                <svg className={styles.badgeIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free shipping on all orders</span>
              </div>
              <div className={styles.badge}>
                <svg className={styles.badgeIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>30-day money-back guarantee</span>
              </div>
              <div className={styles.badge}>
                <svg className={styles.badgeIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
