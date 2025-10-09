/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.wixstatic.com',
                pathname: '/media/**',
              },
              {
                protocol: 'https',
                hostname: 'video.wixstatic.com',
                pathname: '/video/**',
              }
        ],
    },
    // Ignore build validation errors
    skipBuildValidation: true,

    // Disable ESLint checks during builds
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Disable TypeScript checks during builds
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
