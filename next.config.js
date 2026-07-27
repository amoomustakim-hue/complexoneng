const { withSentryConfig } = require("@sentry/nextjs");

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

module.exports = withSentryConfig(withPWA(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
