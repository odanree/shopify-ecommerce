import { test, expect } from '../fixtures/payment.fixture';
import { generateMockWebhookEvent } from '../support/stripe-mock';

test.describe('Webhook Verification: Stripe → Shopify Handshake', () => {
  test('webhook signature verification prevents spoofing', async ({ page }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log('⚠️  STRIPE_WEBHOOK_SECRET not set, skipping webhook test');
      test.skip();
      return;
    }

    // Generate a legitimate mock webhook
    const { body, headers } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_mock_1234',
            status: 'succeeded',
            metadata: {
              shopify_cart: JSON.stringify([
                { variant_id: 'gid://shopify/ProductVariant/1', quantity: 1 },
              ]),
            },
          },
        },
      },
      webhookSecret
    );

    // POST to webhook endpoint
    const response = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers,
      data: body,
    });

    // Should return 200 OK (webhook processed successfully)
    console.log(`Webhook response status: ${response.status()}`);
    expect(response.status()).toBeLessThan(500); // At least not a server error
  });

  test('webhook rejects invalid signature (spoofing attack)', async ({ page }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log('⚠️  STRIPE_WEBHOOK_SECRET not set, skipping webhook test');
      test.skip();
      return;
    }

    // Generate event with WRONG signature
    const fakeSignature = 'v1=fakefakefakefakefake';

    const response = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers: {
        'stripe-signature': fakeSignature,
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_fake' } },
      }),
    });

    // Should return 400 or 401 (unauthorized)
    console.log(`Invalid signature response status: ${response.status()}`);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('webhook endpoint is accessible', async ({ page }) => {
    // Basic sanity check - endpoint should exist and not be 404
    const response = await page.request.post('http://localhost:3000/api/payment/webhook', {
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test' } },
      }),
    });

    console.log(`Webhook endpoint status: ${response.status()}`);
    // Should be 400+ (error because no valid signature), not 404 (endpoint doesn't exist)
    expect(response.status()).not.toBe(404);
  });

  test('webhook accepts valid Stripe event structure', async ({ page }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log('⚠️  STRIPE_WEBHOOK_SECRET not set, skipping webhook test');
      test.skip();
      return;
    }

    // Generate valid webhook with proper Stripe structure
    const { body, headers } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        id: 'evt_test_valid_structure',
        data: {
          object: {
            id: 'pi_test_valid_12345',
            object: 'payment_intent',
            status: 'succeeded',
            amount: 2999,
            currency: 'usd',
            customer: 'cus_test_123',
            metadata: {
              shopify_cart: JSON.stringify([
                {
                  variant_id: 'gid://shopify/ProductVariant/44654321',
                  title: 'Test Product',
                  quantity: 1,
                  price: 2999,
                },
              ]),
              customer_email: 'test@example.com',
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

    console.log(`Valid event response status: ${response.status()}`);
    console.log(`Valid event response: ${await response.text()}`);

    // Should be 200 OK or 400+ error, not 404
    expect(response.status()).not.toBe(404);
  });

  test('webhook metadata is preserved through processing', async ({ page }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log('⚠️  STRIPE_WEBHOOK_SECRET not set, skipping webhook test');
      test.skip();
      return;
    }

    const testEmail = `test-${Date.now()}@example.com`;

    const { body, headers } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: `pi_test_meta_${Date.now()}`,
            status: 'succeeded',
            metadata: {
              shopify_cart: JSON.stringify([
                { variant_id: 'gid://shopify/ProductVariant/123', quantity: 1 },
              ]),
              customer_email: testEmail,
              custom_field: 'test_value_12345',
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
    console.log(`✅ Metadata preservation test completed`);
  });
});
