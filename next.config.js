

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Optimize package imports for better tree-shaking
    experimental: {
        optimizePackageImports: [
            'framer-motion',
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
        ],
    },
    
    images: {
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 31536000, // 1 year
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'source.unsplash.com' },
            { protocol: 'https', hostname: 'via.placeholder.com' },
            { protocol: 'https', hostname: 'utfs.io' },
            { protocol: 'https', hostname: '2lcifuj23a.ufs.sh' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
        ],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
};

export default nextConfig;
