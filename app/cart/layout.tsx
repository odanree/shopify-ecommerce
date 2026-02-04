import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | Your Store',
  description: 'Review and manage items in your shopping cart. Secure checkout with free shipping and 30-day money-back guarantee.',
  openGraph: {
    title: 'Shopping Cart',
    description: 'Review your cart and proceed to checkout',
    type: 'website',
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
