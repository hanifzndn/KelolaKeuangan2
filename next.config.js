const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  // Fix for PWA issues
  webpack: (config) => {
    config.resolve.fallback = { fs: false }
    return config
  }
}

module.exports = withPWA(nextConfig)