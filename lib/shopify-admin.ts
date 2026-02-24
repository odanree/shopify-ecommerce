/**
 * Shopify Admin API Client
 * Handles order creation, tagging, and idempotency checks
 */

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Log configuration at startup
if (!SHOPIFY_DOMAIN) {
  console.error('❌ ERROR: SHOPIFY_STORE_DOMAIN not set in .env.local');
}
if (!ADMIN_TOKEN) {
  console.error('❌ ERROR: SHOPIFY_ADMIN_ACCESS_TOKEN not set in .env.local');
}
if (SHOPIFY_DOMAIN && ADMIN_TOKEN) {
  console.log(`✅ Shopify Admin configured for: ${SHOPIFY_DOMAIN}`);
}

export interface LineItem {
  variantId: string;
  quantity: number;
  title?: string;
  price?: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface OrderData {
  email: string;
  firstName: string;
  lastName: string;
  lineItems: LineItem[];
  shippingAddress: ShippingAddress;
  paymentIntentId: string;
  cartId?: string;
}

/**
 * Check if an order already exists for this payment intent (idempotency)
 */
async function checkOrderByPaymentIntentId(
  paymentIntentId: string
): Promise<any | null> {
  try {
    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/orders.json?status=any&fields=id,tags,financial_status`,
      {
        headers: {
          'X-Shopify-Access-Token': ADMIN_TOKEN || '',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const { orders } = await response.json();

    // Find order with payment_intent tag
    const existingOrder = orders.find((order: any) =>
      order.tags.includes(`payment_intent:${paymentIntentId}`)
    );

    return existingOrder || null;
  } catch (error) {
    console.error('Error checking order by payment intent:', error);
    throw error;
  }
}

/**
 * Create order in Shopify Admin
 * - Idempotency check: Prevents duplicate orders from webhook retries
 * - Inventory: Uses 'decrement_ignoring_policy' to track stock in real-time
 */
export async function createShopifyOrder(
  orderData: OrderData
): Promise<{ id: string; order_number: number }> {
  try {
    console.log('Creating Shopify order for payment intent:', orderData.paymentIntentId);

    // STEP 1: Check if order already exists (idempotency guard)
    const existingOrder = await checkOrderByPaymentIntentId(
      orderData.paymentIntentId
    );

    if (existingOrder) {
      console.log(
        `✅ Order already exists (idempotency): #${existingOrder.order_number}`
      );
      return {
        id: existingOrder.id,
        order_number: existingOrder.order_number || 0,
      };
    }

    // STEP 2: Create new order with inventory tracking
    const lineItemsPayload = orderData.lineItems.map((item) => {
      return {
        variant_id: item.variantId,
        quantity: item.quantity,
        title: item.title,
        price: item.price,
      };
    });

    // Use provided names or fallback to defaults
    const firstName = orderData.firstName || 'Guest';
    const lastName = orderData.lastName || 'Customer';

    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/orders.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': ADMIN_TOKEN || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: {
            email: orderData.email,
            financial_status: 'paid',
            fulfillment_status: 'unfulfilled',
            
            // Tag with payment intent ID during creation (single API call)
            tags: `Stripe-Payment, ${orderData.paymentIntentId}`,

            // Customer data with name and address
            customer: {
              first_name: firstName,
              last_name: lastName,
              email: orderData.email,
            },

            // Line items
            line_items: lineItemsPayload,

            // Shipping address
            shipping_address: {
              first_name: firstName,
              last_name: lastName,
              address1: orderData.shippingAddress.address1,
              address2: orderData.shippingAddress.address2 || '',
              city: orderData.shippingAddress.city,
              province: orderData.shippingAddress.province || '',
              zip: orderData.shippingAddress.zip,
              country: orderData.shippingAddress.country,
            },

            // Decrement inventory in real-time for demo visibility
            inventory_behavior: 'decrement_ignoring_policy',
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Shopify order creation error:', error);
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const { order } = await response.json();

    console.log(`✅ Order created: #${order.order_number} (ID: ${order.id}) with tags: ${order.tags}`);

    return {
      id: order.id,
      order_number: order.order_number,
    };
  } catch (error) {
    console.error('Error creating Shopify order:', error);
    throw error;
  }
}

/**
 * Get order details from Shopify (for verification)
 */
export async function getShopifyOrder(orderId: string): Promise<any> {
  try {
    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/orders/${orderId}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ADMIN_TOKEN || '',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const { order } = await response.json();
    return order;
  } catch (error) {
    console.error('Error fetching Shopify order:', error);
    throw error;
  }
}
