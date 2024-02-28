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
            './src/js/jquery/jquery.kompleter.js',
          ],
          dest: './dist/js/jquery.kompleter.min.js',
          transforms: {
            after: async (code) => {
              const minifiedCode = await terser.minify(code);
              return minifiedCode.code;
            },
          },
        },
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
