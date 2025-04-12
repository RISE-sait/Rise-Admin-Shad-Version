import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  
};
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',             // Match any request starting with /api/
        destination: 'http://localhost:80/:path*', // Proxy to your backend
      },
    ];
  },
};

export default nextConfig;
