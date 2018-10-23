'use strict';

const path = require('path');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');

module.exports = (proxy, allowedHost) => {
  // webpack-dev-server options
  return {
    // Can also be an array, or: contentBase: "http://localhost/",
    contentBase: path.join(__dirname, '../public'),
    watchContentBase: true,
    disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does. 
    hot: true,
    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      disableDotRule: true,
    },
    // Set this if you want to enable gzip compression for assets
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'none',
    https: process.env.HTTPS === 'true',
    host: process.env.HOST || '0.0.0.0',
    overlay: false,
    stats:{
      colors: true
    },// 用颜色标识
    public: allowedHost,
    // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
    // Use "**" to proxy all paths to the specified server.
    // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
    // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
    proxy,
    // webpack-dev-middleware options
    quiet: true,
    watchOptions: {
      ignored: ignoredFiles(path.join(__dirname, '../src')),
    },
    // It's a required option.
    publicPath: '/',
    before(app) {
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());
      // Returns Express middleware that serves a /service-worker.js that resets any previously set service worker configuration. Useful for development.
      app.use(noopServiceWorkerMiddleware());
    }
  };
};