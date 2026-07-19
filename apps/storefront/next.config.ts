import path from 'path';
import { config } from 'dotenv';
import type { NextConfig } from 'next';

config({ path: path.resolve(__dirname, '../.env') });

const nextConfig: NextConfig = {
  // Allow images from any domain during development
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // API URL to proxy backend requests in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
