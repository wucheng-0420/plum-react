"use strict";

const webpack = require("webpack");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");

module.exports = (legacyConfig, esmodulesConfig) =>
  new Promise((resolve, reject) => {
    webpack(legacyConfig).run((error, stats) => {
      if (error) {
        reject(error);
        return;
      }

      const assets = [];
      for (const script in stats.compilation.assets) {
        if (script.match(/main.*\.js$/)) {
          assets.push({
            path: script,
            attributes: { nomodule: "nomodule" }
          });
        }
      }

      esmodulesConfig.plugins.push(
        new HtmlWebpackIncludeAssetsPlugin({
          assets,
          append: false
        })
      );

      resolve(esmodulesConfig);
    });
  });
