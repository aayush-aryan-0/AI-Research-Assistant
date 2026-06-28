import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`

      }
    ]
  },
  experimental: {
    proxyTimeout: 120000  // 2 minutes
  }
};

export default nextConfig;
