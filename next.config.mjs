/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
