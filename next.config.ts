import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // allow localhost
    remotePatterns: [
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '3000',        // your Next.js dev port
      //   pathname: '/api/photo-proxy', // path to your proxy
      //   search: "*"
      // },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // your Nextcloud server port
        pathname: "/remote.php/dav/files/rudedude/**",
      },
    ],
    localPatterns: [
      {
        pathname: '/api/photo-proxy/**', // your API route prefix
        search: '*', // or '*' if you want to allow query strings
      },
      {
        pathname: '/**',
        search: '',
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": ["@svgr/webpack"],
    },
  },
};

export default nextConfig;
