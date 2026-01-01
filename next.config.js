/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
await import("./src/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["images.unsplash.com", "source.unsplash.com", "via.placeholder.com", "utfs.io", "2lcifuj23a.ufs.sh"],
    }
};

export default nextConfig;
