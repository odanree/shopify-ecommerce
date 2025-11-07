import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { ChatWidget } from "@/components/ChatWidget";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
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
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
