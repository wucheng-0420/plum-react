"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BabelMinifyPlugin = require("babel-minify-webpack-plugin");
const common = require("./webpack.config.common");
const config = require("./webpack.config");
const legacyConfig = config();
const esmodulesConfig = config({ bundle: "esmodules" });
const { name: title } = require(path.join(__dirname, "../package.json"));
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    title,
    template: "public/index.html",
    minify: process.env.NODE_ENV === "development" ? false : {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
    }
});
const babelMinifyPlugin = new BabelMinifyPlugin({
    removeConsole: true,
    removeDebugger: true
}, {
        test: /\.(m)?js$/,
        comments: false
    });

legacyConfig.plugins.unshift(htmlWebpackPlugin);
esmodulesConfig.plugins.unshift(htmlWebpackPlugin);

legacyConfig.mode = "production";
esmodulesConfig.mode = "production";

legacyConfig.devtool = false;
esmodulesConfig.devtool = false;

legacyConfig.optimization = { minimizer: [babelMinifyPlugin] };
esmodulesConfig.optimization = { minimizer: [babelMinifyPlugin] };

module.exports = () => common(legacyConfig, esmodulesConfig);
