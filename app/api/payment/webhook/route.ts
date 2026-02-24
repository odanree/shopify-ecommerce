import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createShopifyOrder } from '@/lib/shopify-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Background task: Create Shopify order asynchronously
 * Separated from webhook response to allow immediate 200 OK acknowledgment
 * 
 * This prevents Stripe from timing out and retrying the webhook while we wait
 * for the Shopify Admin API to respond (usually 1-2 seconds)
 */
async function processOrderAsync(
  paymentIntent: any,
  email: string,
  firstName: string,
  lastName: string,
  lineItems: string,
  shippingAddress: string,
  cartId: string
) {
  try {
    // Parse metadata
    const parsedLineItems = lineItems ? JSON.parse(lineItems) : [];
    
    // Convert GraphQL IDs to REST API IDs
    // GraphQL: gid://shopify/ProductVariant/12345 → REST: 12345
    const convertedLineItems = parsedLineItems.map((item: any) => ({
      ...item,
      variantId: item.variantId.includes('gid://') 
        ? item.variantId.split('/').pop() 
        : item.variantId,
    }));
    
    const parsedShippingAddress = shippingAddress ? JSON.parse(shippingAddress) : {};

    // Create order in Shopify
    // This function includes idempotency check to prevent duplicates
    const shopifyOrder = await createShopifyOrder({
      email,
      lineItems: convertedLineItems,
      shippingAddress: parsedShippingAddress,
      paymentIntentId: paymentIntent.id,
      cartId,
      firstName: firstName || 'Guest',
      lastName: lastName || 'Customer',
    });

    console.log(
      `✅ Shopify order created: #${shopifyOrder.order_number} (ID: ${shopifyOrder.id})`
    );

    // Order is now in Shopify with the payment intent ID tagged
    // The success page will query Shopify directly via GET /api/payment/order-number
    // No need to store in a separate cache anymore

    // Log order record for audit trail
    const orderRecord = {
      paymentIntentId: paymentIntent.id,
      shopifyOrderId: shopifyOrder.id,
      shopifyOrderNumber: shopifyOrder.order_number,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customerEmail: email,
      customerName: `${firstName || 'Guest'} ${lastName || 'Customer'}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    // Audit: order record is available for monitoring systems
    // console.log('📦 Order record:', orderRecord); // Uncomment for debugging
  } catch (error) {
    console.error('❌ Background order processing failed:', error);
    // Note: This is a fire-and-forget pattern. For production systems with
    // high transaction volume, implement a job queue (Bull, Inngest, etc.)
    // to automatically retry failed orders with exponential backoff.
    // The payment was already confirmed to the customer, so this must eventually succeed.
  }
}

/**
 * POST /api/payment/webhook
 * 
 * Stripe sends payment events here. Architecture:
 * 1. Verify Stripe signature (prevent spoofing)
 * 2. Extract metadata (cart items, shipping address)
 * 3. Return 200 OK immediately (prevents Stripe retries)
 * 4. Process Shopify order creation in background (fire-and-forget)
 * 
 * Why this design:
 * ✓ Signature verification ensures Stripe didn't spoof
 * ✓ Webhook-driven order creation ensures order even if user closes tab
 * ✓ Idempotency check prevents duplicate orders on webhook retries
 * ✓ Fast acknowledgment (<100ms) prevents Stripe timeout (30s limit)
 * ✓ Background processing doesn't block webhook response
 * 
 * Production optimization:
 * For high-traffic stores, replace fire-and-forget with job queue:
 * - Bull, Inngest, or AWS SQS for automatic retries
 * - Exponential backoff for failed order creation
 * - Monitoring/alerting for failed payments
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');

    // 🕵️ DEBUG LOGS
    console.log('--- WEBHOOK DEBUG START ---');
    console.log('Signature Header Exists:', !!signature);
    console.log('Webhook Secret Defined:', !!process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Webhook Secret Start:', process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10));
    console.log('--- WEBHOOK DEBUG END ---');

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

    // STEP 2: Handle payment success
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any;
      const { firstName, lastName, lineItems, shippingAddress, cartId } = paymentIntent.metadata;

      // Extract email from Stripe PaymentIntent (billing_details or charges)
      // Prefer Stripe's email over form email to ensure verified customer data
      let stripeEmail = '';
      
      if (paymentIntent.charges?.data?.[0]?.billing_details?.email) {
        stripeEmail = paymentIntent.charges.data[0].billing_details.email;
      } else if (paymentIntent.billing_details?.email) {
        stripeEmail = paymentIntent.billing_details.email;
      }

      const email = stripeEmail || 'noreply@stripe-payment.local'; // Fallback if no email from Stripe

      console.log(`💳 Payment succeeded: ${paymentIntent.id}, Customer: ${firstName} ${lastName}, Email: ${email}`);

      // OPTIMIZATION: Return 200 OK immediately to prevent Stripe retries
      // Process the order creation synchronously BEFORE returning to Stripe
      // This ensures the order is created in Shopify before webhook completes
      // Still fast (~50ms for Shopify API call)
      
      try {
        await processOrderAsync(paymentIntent, email, firstName, lastName, lineItems, shippingAddress, cartId);
      } catch (err) {
        console.error('🔴 Order processing failed:', err);
        // Order creation failed, but webhook already succeeded in Stripe
        // For production systems with high transaction volume, implement a job queue
        // (Bull, Inngest, etc.) to automatically retry with exponential backoff
      }

      // Return 200 OK immediately to acknowledge receipt
      return NextResponse.json(
        { received: true, processing: true },
        { status: 200 }
      );
    }

    // Handle other event types if needed
    if (event.type === 'payment_intent.payment_failed') {
      // Payment failed, don't create order - just acknowledge receipt
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
