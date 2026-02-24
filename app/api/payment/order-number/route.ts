import { NextResponse } from 'next/server';

/**
 * GET: Retrieve order number by payment intent ID
 * 
 * Instead of relying on cached data, we query Shopify directly for orders
 * tagged with the payment intent ID. This is more resilient and doesn't
 * require synchronization between webhook and cache.
 * 
 * Called by success page polling to fetch the order confirmation number.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentIntentId = searchParams.get('paymentIntentId');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing paymentIntentId' },
        { status: 400 }
      );
    }

    // Query Shopify for an order tagged with this payment intent ID
    // The webhook already tagged it during order creation
    const shopifyResponse = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/orders.json?status=any&tag=${paymentIntentId}`,
      {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
          'Content-Type': 'application/json',
        },
        // Critical: Don't cache the response
        // If we cache a 404, the frontend's polling loop will keep seeing 404
        // even after the order is created
        cache: 'no-store',
      }
    );

    if (!shopifyResponse.ok) {
      console.error(`Shopify API error: ${shopifyResponse.status}`);
      return NextResponse.json(
        { error: 'Failed to query Shopify' },
        { status: 500 }
      );
    }

    const data = await shopifyResponse.json();
    const order = data.orders?.[0];

    if (!order) {
      // Order not found yet (webhook still processing)
      // Frontend will retry in 2 seconds
      return NextResponse.json(
        { error: 'Order not found yet' },
        { status: 404 }
      );
    }

    // Success! Return the order number for the frontend
    // Example response: { orderNumber: 1017 }
    console.log(`✅ Found order #${order.order_number} for payment intent ${paymentIntentId}`);

    return NextResponse.json(
      {
        orderNumber: order.order_number,
        shopifyOrderId: order.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Order retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
