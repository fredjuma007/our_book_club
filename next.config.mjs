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
};

export default nextConfig;
