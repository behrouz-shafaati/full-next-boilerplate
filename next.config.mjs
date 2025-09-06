/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // نیازی به دامنه نیست برای تصاویر محلی
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
}

export default nextConfig
