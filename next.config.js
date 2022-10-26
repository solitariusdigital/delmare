/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MONGO_URI:
      "mongodb://root:a9qtXAqgTkKI4QvIphVzHu8N@gina.iran.liara.ir:34251/delmare?authSource=admin&replicaSet=rs0&directConnection=true",
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
