'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import dynamic from 'next/dynamic';
import { CartProvider } from '@/contexts/CartContext';

// Lazy load ChatWidget - not critical for initial render
const ChatWidget = dynamic(() => import('@/components/ChatWidget').then(mod => ({ default: mod.ChatWidget })), {
  ssr: false,
});

export function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </CartProvider>
  );
}
