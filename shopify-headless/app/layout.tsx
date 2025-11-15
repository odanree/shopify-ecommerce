import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "./layout-client";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://shopify-headless-lemon.vercel.app'),
  title: {
    default: 'Modern Ecommerce Store | Premium Tech T-Shirts',
    template: '%s | Modern Ecommerce Store',
  },
  description: 'Shop premium tech-themed t-shirts with our modern headless ecommerce platform. Browse collections, family plans, and enjoy AI-powered shopping assistance.',
  keywords: ['ecommerce', 'tech t-shirts', 'shopify', 'family plans', 'premium apparel', 'online shopping'],
  authors: [{ name: 'Modern Ecommerce Store' }],
  creator: 'Modern Ecommerce Store',
  publisher: 'Modern Ecommerce Store',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Modern Ecommerce Store | Premium Tech T-Shirts',
    description: 'Shop premium tech-themed t-shirts with our modern headless ecommerce platform.',
    siteName: 'Modern Ecommerce Store',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Modern Ecommerce Store',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Ecommerce Store | Premium Tech T-Shirts',
    description: 'Shop premium tech-themed t-shirts with our modern headless ecommerce platform.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add when you have these
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical origins - Shopify CDN */}
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        
        {/* Preconnect to Unsplash for hero images */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Google Fonts automatically preloaded via next/font/google */}
        
        {/* Inline critical CSS to eliminate render-blocking requests */}
        <style dangerouslySetInnerHTML={{__html: `
          .heroSection { max-width: 1200px; margin: 0 auto; padding: 4rem 1rem; width: 100%; }
          .heroContent { text-align: center; }
          .heroTitle { font-size: 3rem; font-weight: 700; margin-bottom: 1rem; color: #1a1a1a; line-height: 1.2; letter-spacing: -0.02em; }
          .heroSubtitle { font-size: 1.25rem; color: #666; margin-bottom: 2rem; font-weight: 400; line-height: 1.6; }
          .heroButtons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem; }
          .button { display: inline-flex; align-items: center; justify-content: center; padding: 0.875rem 2.5rem; border-radius: 0.375rem; font-weight: 600; text-decoration: none; transition: all 0.2s; border: 2px solid transparent; cursor: pointer; font-size: 1rem; }
          .buttonPrimary { background-color: #2563eb; color: white; }
          .buttonPrimary:hover { background-color: #1d4ed8; transform: translateY(-2px); }
          .buttonSecondary { background-color: transparent; color: #2563eb; border-color: #2563eb; }
          .buttonSecondary:hover { background-color: #f0f9ff; }
          .container { width: 100%; margin: 0 auto; padding: 0; }
          @media (max-width: 768px) {
            .heroTitle { font-size: 2rem; }
            .heroSubtitle { font-size: 1rem; }
            .button { padding: 0.75rem 1.5rem; font-size: 0.875rem; }
          }
        `}} />
      </head>
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
