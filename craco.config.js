const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve?.fallback || {}),
        fs: false,
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        url: require.resolve('url/'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        zlib: require.resolve('browserify-zlib'),
      };

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        // Force pdf-parse to use the browser-friendly entry (no fs)
        'pdf-parse$': require.resolve('pdf-parse/lib/pdf-parse.js'),
        'pdf-parse': require.resolve('pdf-parse/lib/pdf-parse.js'),
        'pdf-parse/index.js': require.resolve('pdf-parse/lib/pdf-parse.js'),
      };

      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return config;
    },
  },
};