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
  },
};

export default nextConfig;
