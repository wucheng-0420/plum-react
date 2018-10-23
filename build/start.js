'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { choosePort, createCompiler, prepareProxy, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const clearConsole = require('react-dev-utils/clearConsole');
const openBrowser = require('react-dev-utils/openBrowser');

const HOST = process.env.HOST || '0.0.0.0';
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

// Returns a Promise resolving to either defaultPort or next available port if the user confirms it is okay to do. 
// If the port is taken and the user has refused to use another port, or if the terminal is not interactive and can’t present user with the choice, resolves to null
// choosePort(host: string, defaultPort: number): Promise<number | null>
choosePort(HOST, DEFAULT_PORT).then(port => {
  if (port) {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const config = require('./webpack.config.dev')();
    const createDevServerConfig = require('./webpackDevServer.config');
    const { name: appName, proxy } = require(path.join(__dirname, '../package.json'));
    // Returns an object with local and remote URLs for the development server. 
    // Pass this object to createCompiler() described above.
    // prepareUrls(protocol: string, host: string, port: number): Object
    const urls = prepareUrls(protocol, HOST, port);
    const useYarn = fs.existsSync(path.join(__dirname, '../yarn.lock'));
    // Creates a Webpack compiler instance for WebpackDevServer with built-in helpful messages.
    // Takes the require('webpack') entry point as the first argument.
    // To provide the urls argument, use prepareUrls() described below.
    // createCompiler(webpack: Function, config: Object, appName: string, urls: Object, useYarn: boolean): WebpackCompiler
    const compiler = createCompiler(webpack, config, appName, urls, useYarn);
    // Creates a WebpackDevServer proxy configuration object from the proxy setting in package.json.
    // prepareProxy(proxySetting: string, appPublicFolder: string): Object
    const proxyConfig = prepareProxy(proxy, path.join(__dirname, '../public'));
    const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);
    const devServer = new WebpackDevServer(compiler, serverConfig);
    devServer.listen(port, HOST, error => {
      if (error) {
        console.log(error);
      } else {
        if (process.stdout.isTTY) {
          // Clears the console, hopefully in a cross-platform way.
          // clearConsole(): void
          clearConsole();
        }
        console.log(chalk.cyan('Starting the development server...\n'));
        // Attempts to open the browser with a given URL.
        // On Mac OS X, attempts to reuse an existing Chrome tab via AppleScript.
        // Otherwise, falls back to opn behavior.
        // openBrowser(url: string): boolean
        openBrowser(urls.localUrlForBrowser);
      }
    });

    ['SIGINT', 'SIGTERM'].forEach(sig => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  }
}).catch(error => {
  if (error && error.message) {
    console.log(error.message);
  }
  process.exit(1);
});

