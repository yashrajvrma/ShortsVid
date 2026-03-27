import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com",
      },
    ],
    qualities: [100],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
