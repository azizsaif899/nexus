/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    allowedDevOrigins: ["https://9003-firebase-studio-1757948690169.cluster-6frnii43o5blcu522sivebzpii.cloudworkstations.dev"],
  },
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig