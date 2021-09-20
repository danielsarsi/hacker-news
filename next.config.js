const { PHASE_PRODUCTION_BUILD } = require("next/constants");

const securityHeaders = [
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self' 'unsafe-inline'; connect-src 'self' api.hnpwa.com vitals.vercel-insights.com",
  },
];

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = (phase) => ({
  redirects() {
    return [
      {
        source: "/",
        destination: "/news/1",
        permanent: false,
      },
      {
        source: "/:topic(news|newest|ask|show|jobs)",
        destination: "/:topic/1",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      phase === PHASE_PRODUCTION_BUILD && {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ].filter(Boolean);
  },
});

module.exports = nextConfig;
