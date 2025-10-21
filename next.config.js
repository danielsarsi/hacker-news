/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/news/1",
        permanent: false,
      },
      {
        source: "/:topic",
        destination: "/:topic/1",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
