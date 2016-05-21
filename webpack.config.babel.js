import path from 'path';
import webpack from 'webpack';
import { readdirSync } from 'fs';

const externals = readdirSync('node_modules')
  .filter(pkg => !/\.bin/g.test(pkg))
  .reduce((hash, pkg) => {
    return {
      ...hash,
      [pkg]: `commonjs ${pkg}`
    };
  }, {});

export default {
  externals,
  entry: './src/index.js',
  target: 'node',
  devtool: 'sourcemap',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  plugins: [
    new webpack.BannerPlugin('var external = require;', {
      raw: true,
      entryOnly: true
    }),

    new webpack.BannerPlugin('require(\'source-map-support\').install();', {
       raw: true,
       entryOnly: true
    }),

    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        exclude: path.join(__dirname, 'lib')
      },

      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};
