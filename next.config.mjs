// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//       domains: ['picsum.photos','peach-urban-macaw-192.mypinata.cloud'], // Allow images from picsum.photos
//     },
//   };
  
//   export default nextConfig;
  
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
        // Match images from your Pinata domain
        hostname: 'peach-urban-macaw-192.mypinata.cloud',
        port: '',
      },
    ],
  },
};

export default nextConfig;