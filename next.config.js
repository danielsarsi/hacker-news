/**
 * @type {import('next').NextConfig}
 */
const nextConfig = () => ({
  swcMinify: true,
  redirects() {
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
});

module.exports = nextConfig;
