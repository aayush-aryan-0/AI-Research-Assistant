import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://ai-research-assistant-backend-fnc7.onrender.com/:path*"
      }
    ]
  }
};

export default nextConfig;