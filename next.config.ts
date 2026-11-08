import type { NextConfig } from "next";

// Static export for GitHub Pages. The site is a project page served from /hashi-portfolio
// (https://itshashi7.github.io/hashi-portfolio/). Change BASE_PATH here (and SITE_URL in lib/profile.ts) to move it.
export const BASE_PATH = "/hashi-portfolio";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
};

export default nextConfig;
