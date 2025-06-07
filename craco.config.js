const { ProvidePlugin } = require('webpack');

module.exports = {
  webpack: {
    configure: {
      target: 'electron-renderer',
      resolve: {
        fallback: {
          fs: false,
          path: require.resolve('path-browserify'),
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          buffer: require.resolve('buffer/'),
          util: require.resolve('util/')
        }
      }
    },
    plugins: [
      new ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    ]
  }
};
