import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io",
        port: "",
        pathname: "/v1/storage/buckets/**",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        port: "",
        pathname: "/v1/storage/buckets/**",
      },
      {
        protocol: "https",
        hostname: "www.paypalobjects.com",
        port: "",
        pathname: "/webstatic/mktg/logo/**",
      },
    ],
  },
};

export default nextConfig;
