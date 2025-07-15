import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config: WebpackConfig, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Don't attempt to resolve these server-only modules on the client
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve?.fallback || {}),
          net: false,
          tls: false,
          fs: false,
          crypto: false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
