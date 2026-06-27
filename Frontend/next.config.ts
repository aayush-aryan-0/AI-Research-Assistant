import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${process.env.BACKEND_URL||"https://ai-research-assistant-backend-fnc7.onrender.com"}/:path*`

      }
    ]
  },
  experimental: {
    proxyTimeout: 120000  // 2 minutes
  }
};

export default nextConfig;