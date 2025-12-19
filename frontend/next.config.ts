import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // @ts-expect-error - allowedDevOrigins is valid in this version but missing from types
    allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000'],
  },
};

export default nextConfig;
