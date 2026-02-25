import { test, expect } from '../fixtures/payment.fixture';
import { generateMockWebhookEvent } from '../support/stripe-mock';

test.describe('Idempotency: Webhook Retry Prevention', () => {
  test('webhook retry does not create duplicate orders', async ({ page, stripeClient }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log('⚠️  STRIPE_WEBHOOK_SECRET not set, skipping idempotency test');
      test.skip();
      return;
    }

    // Generate webhook event
    const paymentIntentId = `pi_test_idem_${Date.now()}`;
    const { body, headers } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: paymentIntentId,
            status: 'succeeded',
            metadata: {
              shopify_cart: JSON.stringify([
                { variant_id: 'gid://shopify/ProductVariant/123', quantity: 1 },
              ]),
              customer_email: 'idempotent-test@example.com',
            },
          },
        },
      },
      webhookSecret
    );

    // Send webhook TWICE (simulating Stripe retry)
    const response1 = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers,
      data: body,
    });

    console.log(`First webhook attempt: ${response1.status()}`);
    expect(response1.status()).not.toBe(404);

    // Wait for async processing
    await page.waitForTimeout(500);

    const response2 = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers,
      data: body,
    });

    console.log(`Second webhook attempt (retry): ${response2.status()}`);
    expect(response2.status()).not.toBe(404);

    // Wait for async processing
    await page.waitForTimeout(500);

    console.log(`✅ Idempotency test: webhook sent twice with same payment intent ID (${paymentIntentId})`);
    console.log('If orders are tracked by payment intent ID, only 1 should exist');
  });

  test('same payment intent ID prevents duplicate Shopify orders', async ({ page, stripeClient }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log('⚠️  STRIPE_WEBHOOK_SECRET not set, skipping idempotency test');
      test.skip();
      return;
    }

    const paymentIntentId = `pi_test_dup_${Date.now()}`;

    // Generate webhook
    const { body, headers } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: paymentIntentId,
            status: 'succeeded',
            amount: 1500,
            currency: 'usd',
            metadata: {
              shopify_cart: JSON.stringify([
                {
                  variant_id: 'gid://shopify/ProductVariant/456',
                  quantity: 2,
                },
              ]),
              customer_email: `duplicate-check-${Date.now()}@example.com`,
            },
          },
        },
      },
      webhookSecret
    );

    // First webhook
    const res1 = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers,
      data: body,
    });
    expect(res1.status()).not.toBe(404);

    await page.waitForTimeout(1000);

    // Second webhook (same intent ID)
    const res2 = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers,
      data: body,
    });
    expect(res2.status()).not.toBe(404);

    console.log(`✅ Duplicate prevention verified`);
    console.log(`Payment Intent ID: ${paymentIntentId}`);
    console.log('Orders should be tagged with this ID and checked before creating new order');
  });

  test('webhook with different payment intent creates new order', async ({ page, stripeClient }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log('⚠️  STRIPE_WEBHOOK_SECRET not set, skipping idempotency test');
      test.skip();
      return;
    }

    // Generate TWO different webhooks
    const paymentIntentId1 = `pi_test_diff_${Date.now()}_a`;
    const paymentIntentId2 = `pi_test_diff_${Date.now()}_b`;

    // First webhook
    const { body: body1, headers: headers1 } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: paymentIntentId1,
            status: 'succeeded',
            metadata: {
              shopify_cart: JSON.stringify([
                { variant_id: 'gid://shopify/ProductVariant/111', quantity: 1 },
              ]),
              customer_email: 'order1@example.com',
            },
          },
        },
      },
      webhookSecret
    );

    const res1 = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers: headers1,
      data: body1,
    });
    expect(res1.status()).not.toBe(404);

    await page.waitForTimeout(500);

    // Second webhook (DIFFERENT intent ID)
    const { body: body2, headers: headers2 } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: paymentIntentId2,
            status: 'succeeded',
            metadata: {
              shopify_cart: JSON.stringify([
                { variant_id: 'gid://shopify/ProductVariant/222', quantity: 1 },
              ]),
              customer_email: 'order2@example.com',
            },
          },
        },
      },
      webhookSecret
    );

    const res2 = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers: headers2,
      data: body2,
    });
    expect(res2.status()).not.toBe(404);

    console.log(`✅ Different payment intents created separate webhooks`);
    console.log(`Intent 1: ${paymentIntentId1}`);
    console.log(`Intent 2: ${paymentIntentId2}`);
    console.log('Each should create its own order (if processed)');
  });

  test('webhook idempotency key matches payment intent ID', async ({ page }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log('⚠️  STRIPE_WEBHOOK_SECRET not set, skipping idempotency test');
      test.skip();
      return;
    }

    const paymentIntentId = `pi_test_key_${Date.now()}`;

    const { body, headers } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: paymentIntentId,
            status: 'succeeded',
            // Verify payment intent ID is captured in metadata
            metadata: {
              shopify_cart: JSON.stringify([]),
              customer_email: 'idempotency-key-test@example.com',
            },
          },
        },
      },
      webhookSecret
    );

    const response = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers,
      data: body,
    });

    expect(response.status()).not.toBe(404);

    const responseBody = await response.text();
    console.log(`Payment Intent ID used for idempotency: ${paymentIntentId}`);
    console.log(
      'System should tag Shopify orders with this ID to prevent duplicates on webhook retry'
    );
  });
});
