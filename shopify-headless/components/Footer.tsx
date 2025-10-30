export function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <p className="text-gray-600">
              Your premium ecommerce destination powered by Shopify.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/products" className="hover:text-primary-600">Products</a></li>
              <li><a href="/cart" className="hover:text-primary-600">Cart</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-gray-600">
              Email: support@example.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Shopify Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
