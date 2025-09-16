/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "coin-images.coingecko.com",
                port: "",
                pathname: "/coins/images/**",
            },
            {
                protocol: "https",
                hostname: "flagcdn.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

module.exports = nextConfig;
