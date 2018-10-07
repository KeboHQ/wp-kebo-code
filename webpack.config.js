const path = require('path');

//const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
//const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  entry: './src/assets/js/block.js',
  output: {
    filename: './src/assets/js/block.min.js',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [
      {
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [  
          {
              loader: 'file-loader',
              options: {
                  name: '/assets/css/[name].css',
              }
          },
          {
              loader: 'extract-loader'
          },
          {
              loader: 'css-loader',
          },
          {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  'node_modules/codemirror/theme',
                ],
                sourceMap: false
              }
          },
        ]
      }
    ]
  },
  resolve: {
	  extensions: ['*', '.js', '.jsx', '.sass']
  },
};