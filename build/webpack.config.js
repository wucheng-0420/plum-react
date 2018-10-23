"use strict";

const path = require("path");
// webpack插件，用于清除目录文件
const CleanPlugin = require('clean-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const outputDirectory = path.join(__dirname, "../dist");
const { name: title, version } = require(path.join(__dirname, "../package.json"));

module.exports = (env, argv) => {
  env = env || {};
  let jsExtension = ".js";
  const envOptions = {
    useBuiltIns: "usage"
  };
  if (env.bundle === "esmodules") {
    envOptions.targets = { esmodules: true };
    jsExtension = ".mjs";
  }

  return {
    // If you debug under IE, please use cheap-module-source-map
    devtool: "eval",
    mode: "development",
    entry: "./src/index.js",
    output: {
      filename: `js/main.v${version}-[hash:8]${jsExtension}`,
      chunkFilename: `js/[name].v${version}-[hash:8]${jsExtension}`,
      path: outputDirectory,
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["react-app", envOptions]
              ],
              plugins: [
                "@babel/plugin-proposal-export-default-from",
                "@babel/plugin-proposal-export-namespace-from",
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                "@babel/plugin-proposal-optional-chaining",
                "transform-modern-regexp"
              ]
            }
          }
        }
      ]
    },
    plugins: [
      //每次打包清理上次的打包文件
      new CleanPlugin(['dist']),
      new ScriptExtHtmlWebpackPlugin({
        custom: [
          {
            test: /.*[^\.es]\.js/,
            attribute: 'nomodule',
            value: true
          }
        ],
        module: /main.*\.mjs/
      })
    ],
    watchOptions: {
      ignored: ["node_modules", "dist"]
    },
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.mjs', '.json']
    }
  };
};
