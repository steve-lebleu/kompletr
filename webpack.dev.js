import path from 'path';
import * as url from 'url';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// eslint-disable-next-line compat/compat
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  mode: 'development',
  entry: {
    kompletr: './src/js/index.js',
    styles: './src/sass/kompletr.scss',
    demo: './src/sass/kompletr.demo.scss',
  },
  output: {
    filename: (pathData) => {
      return pathData.chunk.name === 'kompletr' ? 'kompletr.js' : null;
    }, 
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  stats: {
    warnings: false,
    errors: false,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: false
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './test/fixtures/data.json', to: 'data.json' }, 
      ],
    }),
  ],
  devServer: {
    open: true,
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 4200,
    watchFiles: ['src/**/*'],
    liveReload: true,
  }
};
