/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "static.wixstatic.com",
                protocol: "https",
            },
        ],
    },
    // Ignore build validation errors
    skipBuildValidation: true,

    // Disable ESLint checks during builds
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
