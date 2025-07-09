import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/patrick-family-feud",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
