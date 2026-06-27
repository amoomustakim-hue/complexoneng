const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /\/api\/cbt\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "cbt-cache",
        expiration: { maxEntries: 200, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/api\/(community|notifications)\/.*/,
      handler: "NetworkFirst",
      options: { cacheName: "dynamic-cache" },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|woff2)$/,
      handler: "CacheFirst",
      options: { cacheName: "static-assets" },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA(nextConfig);
