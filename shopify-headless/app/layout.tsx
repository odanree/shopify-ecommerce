import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { ChatWidget } from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopify Headless Store",
  description: "Modern headless ecommerce powered by Shopify",
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
