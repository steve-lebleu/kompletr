const path = require('path');
const terser = require('terser');

const WebpackConcatPlugin = require('webpack-concat-files-plugin');

module.exports = {
  entry: './src/js/index.js',
  mode: 'development',
  plugins: [
    new WebpackConcatPlugin({
      bundles: [
        {
          src: [
            './src/js/vanilla/kompleter.js',
          ],
          dest: './dist/js/kompleter.min.js',
          transforms: {
            after: async (code) => {
              const minifiedCode = await terser.minify(code);
              return minifiedCode.code;
            },
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.js$/i,
        loader: "esbuild-loader",
      },
    ],
  },
  devServer: {
    client: {
      logging: 'info',
      overlay: true,
    },
    static: {
      directory: path.join(__dirname, './dist'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
    liveReload: true,
    watchFiles: path.join(__dirname, './dist')
  },
};
