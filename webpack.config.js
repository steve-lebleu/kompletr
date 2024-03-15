import path from 'path';
import * as url from 'url';
import DashboardPlugin from "webpack-dashboard/plugin/index.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  mode: "development",
  devtool: "source-map",
  entry: './src/js/index.js',
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
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
      directory: path.join(__dirname, './build'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
    liveReload: true,
    watchFiles: path.join(__dirname, './build'),
  },
};
