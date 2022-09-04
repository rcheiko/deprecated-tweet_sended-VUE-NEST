module.exports = {
    client: {
      service: {
        name: 'tweet_sended',
        url: 'http://localhost:3000/graphql',
      },
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }