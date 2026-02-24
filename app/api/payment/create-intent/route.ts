import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
});

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

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create Payment Intent with metadata for webhook
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description: `Order for ${email}`,
      receipt_email: email,
      
      // KEY: Metadata passed to webhook for Shopify order creation
      metadata: {
        email,
        cartId: cartId || '',
        lineItems: JSON.stringify(lineItems || []),
        shippingAddress: JSON.stringify(shippingAddress || {}),
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
