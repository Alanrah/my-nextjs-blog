/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [],
    },
    experimental: {
        allowMiddlewareResponseBody: true,
    },
};
const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
