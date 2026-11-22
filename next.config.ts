import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/?auth=true",
        permanent: false,
      },
      {
        source: "/register",
        destination: "/?auth=true",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
