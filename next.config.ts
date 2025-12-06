import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force Turbopack to treat this directory as the project root to avoid
  // accidentally picking up lockfiles from parent folders.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
