import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Shopify Store
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/products" className="hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/cart" className="hover:text-primary-600 transition-colors">
              Cart
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
