/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["delmare.storage.iran.liara.space", "trustseal.enamad.ir"],
  },
  experimental: {
    largePageDataBytes: 200 * 100000,
  },
};

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});

module.exports = nextConfig;
