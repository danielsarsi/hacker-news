module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/news/1',
        permanent: false,
      },
      {
        source: '/:topico(news|newest|ask|show|jobs)',
        destination: '/:topico/1', // Matched parameters can be used in the destination
        permanent: false,
      },
    ]
  },
}