/** @type {import('next').NextConfig} */
import path from "path"

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
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
      "@/*": path.join(process.cwd(), "src/app/*"),
      "@components/*": path.join(process.cwd(), "src/components/*"),
      "@features/*": path.join(process.cwd(), "src/features/*"),
      "@lib/*": path.join(process.cwd(), "src/lib/*"),
      "@services/*": path.join(process.cwd(), "src/services/*"),
      "@hooks/*": path.join(process.cwd(), "src/hooks/*"),
      "@stores/*": path.join(process.cwd(), "src/stores/*"),
      "@types/*": path.join(process.cwd(), "src/types/*"),
      "@utils/*": path.join(process.cwd(), "src/utils/*"),
      "@constants/*": path.join(process.cwd(), "src/constants/*"),
    }
    return config
  },
}

export default nextConfig