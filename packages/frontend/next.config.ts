import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'export',
  outputFileTracingRoot: path.join(import.meta.dirname, '../../'),
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@nightpulse/shared'],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
};

export default nextConfig;
