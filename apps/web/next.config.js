/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Alias imports starting with @/
  imports: {
    "^@/(.*)$": "/src/$1",
  },
}

module.exports = nextConfig
