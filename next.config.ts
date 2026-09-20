import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'i.imgur.com' }
    ]
  },
  async redirects() {
    return [
      { source: '/products', destination: '/clothes', permanent: true },
      { source: '/products/:slug', destination: '/product/:slug', permanent: true },
      { source: '/collection', destination: '/clothes', permanent: true },
      { source: '/collections', destination: '/clothes', permanent: true },
      { source: '/collection/:slug', destination: '/clothes', permanent: true },
      { source: '/categories', destination: '/clothes', permanent: true },
      { source: '/shop', destination: '/clothes', permanent: true },
      { source: '/pages', destination: '/', permanent: true },
    ];
  }
};

export default nextConfig;
