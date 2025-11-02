import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/ProductCard';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Our Store Test
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing products powered by Shopify
        </p>
        <Link 
          href="/products"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
