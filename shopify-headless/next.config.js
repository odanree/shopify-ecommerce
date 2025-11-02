/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  env: {
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
  // Enable Fast Refresh for better development experience
  reactStrictMode: true,
  // Optimize dev server
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Enable Fast Refresh
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before reloading
      }
    }
    return config
  },
}

export default nextConfig
