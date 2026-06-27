import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
        return [
            {
                source: "/api/backend/:path*",
                destination: "https://ai-research-assistant-backend-fnc7.onrender.com/:path*"
            }
        ]
    }
};
module.exports = { output: 'standalone' }
export default nextConfig;
