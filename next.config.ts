import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcrypt']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: '*.roblox.com',
      }
    ]
  }
};

export default nextConfig;
