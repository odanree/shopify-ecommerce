import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createShopifyOrder } from '@/lib/shopify-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * POST /api/payment/webhook
 * 
 * Stripe sends payment events here. On success:
 * 1. Verify Stripe signature (prevent spoofing)
 * 2. Extract metadata (cart items, shipping address)
 * 3. Create order in Shopify (with idempotency check)
 * 4. Store order in local DB for order history
 * 
 * Why this is secure:
 * - Signature verification ensures Stripe didn't spoof
 * - Webhook-driven ensures order creation even if user closes tab
 * - Idempotency check prevents duplicate orders on retry
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    const body = await request.text();

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // STEP 1: Verify Stripe signature (prevents spoofing)
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`📨 Webhook event received: ${event.type}`);

    // STEP 2: Handle payment success
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any;
      const { email, lineItems, shippingAddress, cartId } = paymentIntent.metadata;

      console.log(`💳 Payment succeeded: ${paymentIntent.id}`);

      try {
        // Parse metadata
        const parsedLineItems = lineItems ? JSON.parse(lineItems) : [];
        const parsedShippingAddress = shippingAddress ? JSON.parse(shippingAddress) : {};

        // STEP 3: Create order in Shopify
        // This function includes idempotency check to prevent duplicates
        const shopifyOrder = await createShopifyOrder({
          email,
          lineItems: parsedLineItems,
          shippingAddress: parsedShippingAddress,
          paymentIntentId: paymentIntent.id,
          cartId,
        });

        console.log(
          `✅ Shopify order created: #${shopifyOrder.order_number} (ID: ${shopifyOrder.id})`
        );

        // STEP 4: Store in local database for order history
        // TODO: Implement with your database (Supabase, MongoDB, etc.)
        // For now, we'll just log it
        const orderRecord = {
          paymentIntentId: paymentIntent.id,
          shopifyOrderId: shopifyOrder.id,
          shopifyOrderNumber: shopifyOrder.order_number,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          customerEmail: email,
          status: 'completed',
          createdAt: new Date().toISOString(),
        };

        console.log('📦 Order record:', orderRecord);

        // Return 200 OK to acknowledge receipt
        // Stripe will stop retrying this webhook
        return NextResponse.json(
          { received: true, orderId: shopifyOrder.id },
          { status: 200 }
        );
      } catch (orderError) {
        console.error('❌ Order creation failed:', orderError);
        // Return 500 so Stripe retries this webhook
        // The idempotency check will handle the retry
        return NextResponse.json(
          { error: 'Order creation failed', details: String(orderError) },
          { status: 500 }
        );
      }
    }

    // Handle other event types if needed
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as any;
      console.log(`⚠️  Payment failed: ${paymentIntent.id}`);
      // Don't create order, just log
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('🔴 Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
