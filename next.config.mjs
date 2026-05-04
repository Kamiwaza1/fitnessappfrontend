/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< Updated upstream
  /* config options here */
  reactCompiler: true,
=======
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
>>>>>>> Stashed changes
};

export default nextConfig;
