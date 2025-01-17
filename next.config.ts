import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false }; // Ejemplo de personalización
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite cualquier dominio
      },
    ],
  },
};

export default nextConfig;
