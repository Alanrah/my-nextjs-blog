/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        // If you use remark-gfm, you'll need to use next.config.mjs
        // as the package is ESM only
        // https://github.com/remarkjs/remark-gfm#install
        remarkPlugins: [],
        rehypePlugins: [],
        // If you use `MDXProvider`, uncomment the following line.
        // providerImportSource: "@mdx-js/react",
    },
});


const nextConfig = withMDX({ // 开发环境下react18 在严格模式下，useEffect 会执行两次
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: [],
    },
    experimental: {
        allowMiddlewareResponseBody: true,
        webVitalsAttribution: ['CLS', 'LCP'],
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
});
const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
