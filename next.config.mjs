/** @type {import('next').NextConfig} */
const backendBaseUrl = process.env.BACKEND_URL || 'http://localhost:8080';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
