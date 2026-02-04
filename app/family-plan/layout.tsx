import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Family Plan Builder | Save Up to $125/Month on Unlimited Plans',
  description: 'Build your perfect family plan with unlimited 5G data, talk, and text. Add up to 5 lines and save $25 per line. Get started from just $24/month per additional line.',
  keywords: [
    'family plan',
    'unlimited data',
    'mobile plans',
    'family mobile plans',
    'multi-line discount',
    '5G plans',
    'affordable cell phone plans',
  ],
  openGraph: {
    title: 'Family Plan Builder - Save Big on Unlimited Plans',
    description: 'Build a custom family plan with up to 5 lines. Unlimited 5G data from $24/mo per line.',
    type: 'website',
    images: [
      {
        url: '/og-family-plan.jpg', // You can add this image later
        width: 1200,
        height: 630,
        alt: 'Family Plan Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Family Plan Builder | Save Up to $125/Month',
    description: 'Unlimited 5G plans for the whole family. Add up to 5 lines from $24/mo.',
    images: ['/og-family-plan.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/family-plan',
  },
};

export default function FamilyPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Family Plan - Unlimited Mobile Service',
            description: 'Unlimited 5G data, talk, and text for the whole family. Add up to 5 lines with significant savings.',
            brand: {
              '@type': 'Brand',
              name: 'Your Store Name',
            },
            offers: {
              '@type': 'AggregateOffer',
              lowPrice: '24',
              highPrice: '49',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              priceValidUntil: '2026-12-31',
              offerCount: '5',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '127',
            },
          }),
        }}
      />
      {children}
    </>
  );
}
