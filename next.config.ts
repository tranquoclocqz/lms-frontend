import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["test.loclaptrinh.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  turbopack: {},
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Giảm tải cho watcher bằng cách bỏ qua các folder lớn
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.next/**', '**/public/large-assets/**'],
      };
    }
    return config;
  }
};

export default nextConfig;
