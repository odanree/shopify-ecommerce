import crypto from 'crypto';

interface MockWebhookPayload {
  type?: 'payment_intent.succeeded' | 'payment_intent.payment_failed';
  id?: string;
  object?: string;
  data?: any;
  [key: string]: any;
}

/**
 * Generate a mock Stripe webhook with valid signature
 * Mimics what Stripe sends to /api/payment/webhook
 */
export function generateMockWebhookEvent(
  payload: Partial<MockWebhookPayload>,
  webhookSecret: string
): { body: string; headers: Record<string, string> } {
  const now = Math.floor(Date.now() / 1000);
  const baseEvent: MockWebhookPayload = {
    type: 'payment_intent.succeeded',
    id: `evt_test_${crypto.randomBytes(12).toString('hex')}`,
    object: 'event',
    created: now,
    data: {
      object: {
        id: `pi_test_${crypto.randomBytes(12).toString('hex')}`,
        object: 'payment_intent',
        status: 'succeeded',
        metadata: { shopify_cart: JSON.stringify([]) },
      },
    },
    ...payload,
  };

  const body = JSON.stringify(baseEvent);
  const timestamp = now.toString();

  // Sign using Stripe's algorithm
  const signedContent = `${timestamp}.${body}`;
  const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedContent)
    .digest('base64');

  return {
    body,
    headers: {
      'stripe-signature': `t=${timestamp},v1=${signature}`,
      'content-type': 'application/json',
    },
  };
}
