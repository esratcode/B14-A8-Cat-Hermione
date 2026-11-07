/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://b14-a8-cat-hermione.vercel.app/api/auth/:path*",
      },
    ];
  },

  experimental: {
    cpus: 1,
    workerThreads: false,
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;