import type {NextConfig} from 'next';
import fs from 'fs';
import path from 'path';

// Auto-copy uploaded school photos to public/ directory for serving
try {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // List files in current directory & check for input files
  const rootFiles = fs.readdirSync(process.cwd());
  rootFiles.forEach(file => {
    if (file.startsWith('input_file_') && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))) {
      const src = path.join(process.cwd(), file);
      const dest = path.join(publicDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied image assets file [${file}] to public directory.`);
    }
  });
} catch (e) {
  console.error('Startup asset synchronization failed:', e);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
