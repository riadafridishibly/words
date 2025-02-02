import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/words",
  output: "export",
  trailingSlash: true, // emit multiple pages
};

export default nextConfig;
