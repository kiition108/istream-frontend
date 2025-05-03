/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add environment variables if necessary
    images: {
      remotePatterns: [
        
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
      ],
    },
  
  // Add rewrites to proxy API requests to the backend
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`, // Forward API calls to the backend
      },
    ];
  },
};

export default nextConfig;
