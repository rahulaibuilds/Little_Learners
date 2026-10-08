/** @type {import('next').NextConfig} */
const path = require("path")

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["localhost", "*.learnnest.in"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components/ui": path.join(process.cwd(), "src/components/ui"),
      "@components": path.join(process.cwd(), "src/components"),
      "@lib": path.join(process.cwd(), "src/lib"),
      "@services": path.join(process.cwd(), "src/services"),
      "@hooks": path.join(process.cwd(), "src/hooks"),
      "@stores": path.join(process.cwd(), "src/stores"),
      "@types": path.join(process.cwd(), "src/types"),
      "@utils": path.join(process.cwd(), "src/utils"),
      "@constants": path.join(process.cwd(), "src/constants"),
      "@features": path.join(process.cwd(), "src/features"),
    }
    return config
  },
}

export default nextConfig