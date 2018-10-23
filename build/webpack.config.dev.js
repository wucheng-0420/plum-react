"use strict";

process.env.NODE_ENV = 'development';

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.config.common");
const config = require("./webpack.config");
const legacyConfig = config();
const esmodulesConfig = config({ bundle: "esmodules" });
const { name: title } = require(path.join(__dirname, "../package.json"));
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  title,
  template: "public/index.html"
});

legacyConfig.plugins.unshift(htmlWebpackPlugin);
esmodulesConfig.plugins.unshift(htmlWebpackPlugin);

//module.exports = () => common(legacyConfig, esmodulesConfig);
module.exports = () => {
  return esmodulesConfig;
};
