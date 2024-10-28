const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');

// Function to check if a file exists
const fileExists = (filePath) => fs.existsSync(path.resolve(__dirname, filePath));

// Define entry points, including checks to ensure the files exist
const entryPoints = {
  'kikstart-custom': './src/js/kikstart-custom.js',
  'kik-collect-lazy-assets.min': './src/js/kik-collect-lazy-assets.js',
  'kik-load-lazy-assets.min': './src/js/kik-load-lazy-assets.js'
  // Add other entry points if needed
};

// Filter out non-existing entry points
const validEntries = Object.fromEntries(
  Object.entries(entryPoints).filter(([key, filePath]) => fileExists(filePath))
);

module.exports = {
  entry: validEntries,
  output: {
    path: path.resolve(__dirname, './assets'),
    filename: '[name].js',
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
