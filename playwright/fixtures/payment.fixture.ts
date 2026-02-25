import { test as base, expect } from '@playwright/test';
import Stripe from 'stripe';

// Type-safe fixtures for payment tests
export const test = base.extend<{
  stripeClient: Stripe;
  mockPaymentIntentId: string;
}>({
  stripeClient: async ({}, use) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    await use(stripe);
  },

  mockPaymentIntentId: async ({ stripeClient }, use) => {
    // Create real Payment Intent for testing
    const intent = await stripeClient.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { test: true },
    });
    await use(intent.id);
    // Cleanup: cancel intent after test
    try {
      await stripeClient.paymentIntents.cancel(intent.id);
    } catch (e) {
      // Intent may already be in terminal state, that's fine
    }
  },
});

export { expect };
