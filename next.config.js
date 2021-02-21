const path = require('path');

module.exports = {
  images: {
    domains: ['localhost'],
  },
  trailingSlash: true,
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};
