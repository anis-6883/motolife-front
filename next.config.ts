import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Matches any hostname
        port: "",
        pathname: "/**", // Matches any pathname
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./i18n.ts");
export default withNextIntl(nextConfig);
