import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix: Allow mobile devices on local network to access the dev server.
  // Next.js 16 blocks cross-origin requests by default. Without this,
  // mobile browsers accessing via LAN IP get 404/Server Errors on navigation
  // because RSC flight requests are blocked as cross-origin.
  allowedDevOrigins: [
    '192.168.100.19',
    '192.168.100.19:3000',
    '192.168.100.19:3001',
    '192.168.*.*',
    '10.*.*.*',
    '172.16.*.*',
    '172.20.*.*',
    '*.local',
    'localhost:3000',
    'localhost:3001',
  ],
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
