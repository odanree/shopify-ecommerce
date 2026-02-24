import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

/**
 * POST /api/payment/create-intent
 * Creates a Stripe Payment Intent with smart metadata for webhook processing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'usd', email, cartId, lineItems, shippingAddress } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create Payment Intent with metadata for webhook
    // Note: Email is optional here; we'll get it from Stripe's payment method if available
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description: email ? `Order for ${email}` : 'Order',
      ...(email && { receipt_email: email }), // Only set receipt_email if provided
      
      // KEY: Metadata passed to webhook for Shopify order creation
      metadata: {
        cartId: cartId || '',
        lineItems: JSON.stringify(lineItems || []),
        shippingAddress: JSON.stringify(shippingAddress || {}),
        // Note: email NOT stored in metadata; we'll extract from PaymentIntent in webhook
      },

      // Automatically handle Apple Pay / Google Pay
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`✅ Payment Intent created: ${paymentIntent.id}`);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
