const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, options) => ({
  optimization: {
    minimizer: [
      new TerserPlugin({ cache: true, parallel: true, sourceMap: false }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  entry: {
    "./js/app.js": "./js/app.jsx",
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "../priv/static/js"),
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "../css/app.css" }),
    new CopyWebpackPlugin([{ from: "static/", to: "../" }]),
  ],
});
