/**
 * @type {import('next').NextConfig}
 */
const nextConfig = () => ({
	experimental: {
		appDir: true,
	},
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
