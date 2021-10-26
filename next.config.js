/**
 * @type {import('next').NextConfig}
 */
const nextConfig = () => ({
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
});

module.exports = nextConfig;
