/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // Match images from picsum.photos
        hostname: 'picsum.photos',
        port: '',
      },
      {
        // Match images from Pinata domain
        hostname: 'orange-odd-quail-691.mypinata.cloud',
        port: '',
      },
    ],
  },
};

export default nextConfig;