/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // experimental: {
  //   images: {
  //     unoptimized: true,
  //   },
  // },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
