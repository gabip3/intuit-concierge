import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export: GitHub Pages serves plain files, no Node server.
  output: "export",
  // Emit /wheel/index.html instead of /wheel.html so Pages resolves the
  // route without a trailing-slash redirect.
  trailingSlash: true,
  images: {
    // next/image optimization needs a server; serve the originals as-is.
    unoptimized: true,
  },
};

export default nextConfig;
