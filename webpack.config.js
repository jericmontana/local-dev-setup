const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  entry: {
    'kikstart-custom': './src/js/kikstart-custom.js',
    'kik-collect-lazy-assets.min': './src/js/kik-collect-lazy-assets.js',
    'kik-load-lazy-assets.min': './src/js/kik-load-lazy-assets.js'
    // Add other entry points if needed
  },
  output: {
    path: path.resolve(__dirname, './assets'),
    filename: '[name].js',
    // filename: 'kikstart-custom.js',
  },
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
            ],
          },
        },
      },
    ],
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  watch: false,
};
