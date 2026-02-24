import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for payment_intent_id -> order_number mapping
// In production, store this in your database (Supabase, MongoDB, etc.)
const orderCache = new Map<string, { orderNumber: number; shopifyOrderId: string; createdAt: number }>();

/**
 * POST: Store order number for payment intent
 * Called by the webhook after order creation
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, orderNumber, shopifyOrderId } = await request.json();

    if (!paymentIntentId || !orderNumber) {
      return NextResponse.json(
        { error: 'Missing paymentIntentId or orderNumber' },
        { status: 400 }
      );
    }

    // Store the mapping (with timestamp for potential cleanup)
    orderCache.set(paymentIntentId, {
      orderNumber,
      shopifyOrderId,
      createdAt: Date.now(),
    });

    console.log(`📦 Cached order #${orderNumber} for payment intent ${paymentIntentId}`);

    return NextResponse.json({ cached: true }, { status: 200 });
  } catch (error) {
    console.error('Error caching order number:', error);
    return NextResponse.json(
      { error: 'Failed to cache order number' },
      { status: 500 }
    );
  }
}

/**
 * GET: Retrieve order number by payment intent
 * Called by success page to display confirmation number
 */
export async function GET(request: NextRequest) {
  try {
    const paymentIntentId = request.nextUrl.searchParams.get('paymentIntentId');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing paymentIntentId' },
        { status: 400 }
      );
    }

    const orderData = orderCache.get(paymentIntentId);

    if (!orderData) {
      console.warn(`⚠️  Order not found in cache for payment intent ${paymentIntentId}`);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(orderData, { status: 200 });
  } catch (error) {
    console.error('Error retrieving order number:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order number' },
      { status: 500 }
    );
  }
}
