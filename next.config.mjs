/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.14.241'],
  images: {
    unoptimized: false,
    formats: ['image/webp'],
  },
};

export default nextConfig;
