import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

// Bundle analyzer setup
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Bundle optimization
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

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
    // Image optimization settings
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  webpack: (config: WebpackConfig, { isServer, dev }: { isServer: boolean; dev: boolean }) => {
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

    // Bundle optimization
    if (!dev && !isServer) {
      const splitChunks = config.optimization?.splitChunks;
      if (splitChunks && typeof splitChunks === 'object') {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            ...splitChunks,
            cacheGroups: {
              ...(splitChunks.cacheGroups || {}),
              firebase: {
                name: 'firebase',
                test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
                chunks: 'all',
                priority: 20,
              },
              vendor: {
                name: 'vendor',
                test: /[\\/]node_modules[\\/]/,
                chunks: 'all',
                priority: 10,
              },
            },
          },
        };
      }
    }

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
