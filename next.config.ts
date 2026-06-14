import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|brand|templates|favicon.ico|icon.png).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate"
          }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com"
      }
    ]
  }
};

export default nextConfig;
