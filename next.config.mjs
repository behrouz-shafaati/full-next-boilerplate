/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // نیازی به دامنه نیست برای تصاویر محلی
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/images/**',
      },
      {
        protocol: 'http',
        hostname: 'ali1354.ir',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ali1354.ir',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // 👈 افزایش به ۱۰ مگابایت
    },
  },
  compiler: {
    // 👇 کد جاوااسکریپت مدرن‌تر و کوچیک‌تر
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
