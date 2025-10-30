# Issue #7: Implement Newsletter Signup

**Type:** `feat(theme)` `feat(headless)`
**Label:** `enhancement`, `both-projects`
**Project:** Both Custom Theme & Headless Next.js

## Description
Add newsletter signup functionality to capture customer emails for marketing campaigns.

## Requirements

### Newsletter Features
- [ ] Email input form
- [ ] Validation (email format)
- [ ] Success/error messages
- [ ] Loading states
- [ ] GDPR compliance checkbox (if needed)
- [ ] Integration with Shopify customer API
- [ ] Optional: Mailchimp/Klaviyo integration

### Placement
- [ ] Footer newsletter signup
- [ ] Homepage section (optional)
- [ ] Popup modal (optional)

## Acceptance Criteria
- [ ] Form validates email addresses
- [ ] Success message displays on signup
- [ ] Error handling works
- [ ] Emails saved to Shopify customers
- [ ] Mobile-friendly form
- [ ] Accessible form elements

## Technical Implementation

**Theme:**
- [ ] Create newsletter section
- [ ] Add form submission handler
- [ ] Style form components
- [ ] Add to footer

**Headless:**
- [ ] Create newsletter component
- [ ] Add API route for form submission
- [ ] Integrate with Shopify API
- [ ] Add to footer component

## Files to Create

**Theme:**
- `sections/newsletter.liquid`
- `snippets/newsletter-form.liquid`
- Update `sections/footer.liquid`

**Headless:**
- `components/Newsletter.tsx`
- `app/api/newsletter/route.ts`
- Update `components/Footer.tsx`

## API Integration
```typescript
// app/api/newsletter/route.ts
POST /api/newsletter
Body: { email: string }
Response: { success: boolean, message: string }
```

## References
- Shopify Customer API: https://shopify.dev/api/admin-rest/latest/resources/customer
- Form validation: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
