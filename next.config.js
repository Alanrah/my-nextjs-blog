/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
      domains: [
          'p4.a.yximgs.com' // todo
      ]
  }
}
const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
