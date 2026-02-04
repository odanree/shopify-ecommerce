# 🤖 AI Chatbot Integration

## Overview

The Shopify Headless storefront features a GPT-4 powered AI chatbot that integrates directly with your product catalog. The chatbot enables natural language product search, personalized recommendations, and ecommerce assistance.

**Key Stats:**
- ✅ Searches across full Shopify product catalog
- ✅ Real-time product recommendations
- ✅ GPT-4 turbo model for fast, accurate responses
- ✅ Seamless React integration with Context API
- ✅ Production-ready and deployed live

**🎯 [View Live Demo](https://shopify-headless-lemon.vercel.app/)** — Open the site and look for the chatbot widget

---

## Architecture

### System Overview

```
User Input (Natural Language)
         ↓
    Chatbot Widget (React)
         ↓
    GPT-4 API Call
         ↓
    Shopify Product Search
         ↓
    Context Enrichment
         ↓
    AI Response + Recommendations
         ↓
    Cart Integration (Optional)
```

### Components

#### 1. **Chat Widget Component** (`components/ChatWidget.tsx`)
- Floating chat interface
- Message history management
- Real-time typing indicators
- Seamless UI integration

#### 2. **Chat Context** (`contexts/ChatContext.tsx`)
- Global chat state management
- Message persistence
- Error handling

#### 3. **API Route** (`app/api/chat/route.ts`)
- Handles GPT-4 API calls
- Product catalog retrieval
- Response formatting

#### 4. **Product Integration** (`lib/shopify.ts`)
- Fetches products from Shopify Storefront API
- Provides context to LLM for recommendations
- Manages product metadata

---

## How It Works

### 1. User Sends Message

```typescript
// User types: "Show me running shoes under $100"
```

### 2. Chatbot Processes Request

```typescript
// ChatWidget captures input and sends to API
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: conversationHistory,
    userMessage: 'Show me running shoes under $100'
  })
});
```

### 3. Backend Fetches Product Context

```typescript
// API route retrieves products from Shopify
const products = await getProducts();

// Formats product data for GPT-4
const productContext = products.map(p => ({
  name: p.title,
  price: p.priceRange.minVariantPrice.amount,
  description: p.description,
  image: p.featuredImage.url
}));
```

### 4. GPT-4 Processes Request

```typescript
// System prompt tells GPT-4 to act as ecommerce assistant
const systemPrompt = `You are an ecommerce product assistant for a Shopify store.
Help customers find products using natural language queries.
Provide recommendations based on available inventory.`;

// User message + product context
const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'assistant', content: productContext },
  { role: 'user', content: 'Show me running shoes under $100' }
];

// Call GPT-4 Turbo
const chatCompletion = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: messages,
  temperature: 0.7
});
```

### 5. Response Displayed to User

```
Chatbot: "I found 3 great running shoes under $100:

1. **Nike Runner Pro** - $89.99
   Performance-focused with responsive cushioning

2. **Adidas Speed Trainer** - $79.99
   Lightweight and breathable, perfect for everyday running

3. **Brooks Ghost** - $94.99
   Maximum comfort for long-distance runs

Would you like to add any of these to your cart?"
```

---

## Integration Points

### Current Implementation

**Where the chatbot lives:**
- Main layout wrapper (`app/layout.tsx`)
- Positioned as floating widget (bottom-right)
- Always accessible to customers

**Data Flow:**
1. Product catalog → Shopify Storefront API
2. Catalog → GPT-4 context
3. User query → GPT-4 processing
4. AI response → Chat widget display
5. Recommendations → Add to cart (optional)

### Ecommerce Strategy

The chatbot uses these tactics to drive conversions:

- **Product Bundles** - "Customers who buy X also like Y"
- **Price Awareness** - Searches filtered by budget
- **Trend Insights** - "Our most popular items this week..."
- **Cross-Sells** - Suggests complementary products
- **Stock Updates** - Real-time availability

---

## Configuration

### Environment Variables

Required for production:

```env
# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
```

### Customization

#### 1. **Change System Prompt**

In `app/api/chat/route.ts`, modify the system message:

```typescript
const systemPrompt = `You are a luxury fashion consultant for ${brandName}.
Provide expert styling advice based on customer preferences.
Emphasize quality, craftsmanship, and exclusivity.`;
```

#### 2. **Adjust Model**

Use different GPT models based on needs:

```typescript
// Cost-optimized
model: 'gpt-4-turbo'  // $0.01/1K input tokens

// Speed-optimized
model: 'gpt-3.5-turbo'  // $0.0005/1K input tokens

// Quality-optimized (newer)
model: 'gpt-4o'  // Larger context window
```

#### 3. **Filter Product Context**

Add filters to reduce context and improve speed:

```typescript
// Only include in-stock products
const inStockProducts = products.filter(p => 
  p.totalInventory > 0
);

// Only include products above minimum price
const premiumProducts = products.filter(p => 
  parseFloat(p.priceRange.minVariantPrice.amount) > 50
);

// Limit to categories
const categoryFilter = products.filter(p =>
  p.productType === 'Running Shoes'
);
```

#### 4. **UI Customization**

Modify chat widget appearance in `components/ChatWidget.tsx`:

```typescript
// Change colors
const widgetStyle = {
  backgroundColor: '#ff6b35',  // Your brand color
  textColor: '#ffffff'
};

// Change position
const chatPosition = 'bottom-right'; // or 'top-left', 'bottom-left', etc.

// Change size
const chatDimensions = {
  width: '400px',
  height: '500px'
};
```

---

## Performance

### Optimization Techniques

1. **Product Context Caching**
   ```typescript
   // Cache product list for 5 minutes
   const cachedProducts = cache(getProducts, 5 * 60 * 1000);
   ```

2. **Streaming Responses**
   ```typescript
   // Stream GPT-4 responses for faster perceived performance
   const stream = openai.chat.completions.stream({...});
   ```

3. **Limited Context Window**
   ```typescript
   // Only send top 50 products, not entire catalog
   const relevantProducts = products.slice(0, 50);
   ```

### Response Times

- **Typical latency:** 1-3 seconds (GPT-4 Turbo)
- **Message processing:** <100ms
- **Shopify API call:** 200-500ms
- **GPT-4 inference:** 800-2000ms

---

## Testing

### Example Queries to Test

```
1. "What running shoes do you have?"
2. "Show me items under $50"
3. "What's your most popular product?"
4. "Do you have anything in red?"
5. "What do you recommend for beginners?"
6. "Add the Nike Runner to my cart"
7. "What's the difference between product X and Y?"
8. "Can you suggest a gift for someone who likes outdoor activities?"
```

### E2E Tests

Existing Cypress tests cover:
- Chat widget opens/closes
- Messages send successfully
- Responses display correctly
- Cart integration works

Run tests:
```bash
npm run test:e2e
```

---

## Cost Analysis

### OpenAI API Pricing (as of Feb 2024)

```
GPT-4 Turbo:
- Input:  $0.01 / 1K tokens
- Output: $0.03 / 1K tokens

Typical chat exchange:
- Input tokens:  ~500 (product context + user message)
- Output tokens: ~300 (AI response)
- Cost per message: ~$0.015
```

**Monthly Cost Estimates:**
- 1,000 chats/month: ~$15
- 10,000 chats/month: ~$150
- 100,000 chats/month: ~$1,500

---

## Future Enhancements

- [ ] **Vector Search** - Semantic product search with embeddings
- [ ] **Multi-language** - Support for Spanish, French, Chinese
- [ ] **Conversation Memory** - Remember customer preferences
- [ ] **Analytics Dashboard** - Track popular queries, conversion rates
- [ ] **Inventory Integration** - Real-time stock updates
- [ ] **Reviews Integration** - Include customer reviews in recommendations
- [ ] **Voice Input** - Voice-activated product search
- [ ] **Personalization** - Customer history-based recommendations

---

## Troubleshooting

### Chatbot Not Responding

1. Check OpenAI API key is valid
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

2. Verify environment variables loaded
```typescript
console.log('API Key set:', !!process.env.OPENAI_API_KEY);
```

3. Check Shopify API connection
```bash
npm run verify-products
```

### Slow Responses

1. Reduce product context size
2. Use `gpt-3.5-turbo` instead of `gpt-4-turbo`
3. Implement response streaming

### Inaccurate Recommendations

1. Improve system prompt specificity
2. Add more product metadata (tags, categories)
3. Implement product embedding search

---

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [Next.js AI/ML Guide](https://nextjs.org/docs/app/building-your-application/using-ai-and-ml)
- [LangChain.js Documentation](https://js.langchain.com)

---

## Support

For issues or questions:
- Review [GitHub Issues](https://github.com/odanree/shopify-ecommerce/issues)
- Check [OpenAI Status](https://status.openai.com)
- See [Shopify Dev Community](https://community.shopify.com)

---

**Happy building! 🚀**
