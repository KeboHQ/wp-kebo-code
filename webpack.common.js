const path = require('path');

module.exports = {
  entry: './src/assets/js/block.js',
  output: {
    filename: './src/assets/js/block.build.js',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [
      {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [ 'babel-loader' ]
      },
      {
        test: /\.scss$/,
        use: [  
          {
              loader: 'file-loader',
              options: {
                  name: '/src/assets/css/[name].css',
              }
          },
          {
              loader: 'extract-loader',
          },
          {
              loader: 'css-loader',
          },
          {
              loader: 'sass-loader',
          },
        ]
      }
    ]
  },
  resolve: {
	  extensions: ['*', '.js', '.jsx', '.sass']
  },
};