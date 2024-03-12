import path from 'path';
import * as url from 'url';
import DashboardPlugin from "webpack-dashboard/plugin/index.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  entry: './src/js/index.js',
  devtool: "source-map",
  mode: "development",
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
  plugins: [
    new DashboardPlugin()
  ],
  devServer: {
    client: {
      logging: 'log',
      overlay: true,
    },
    static: {
      directory: path.join(__dirname, './dist'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
    liveReload: true,
    watchFiles: path.join(__dirname, './dist'),
  },
};
