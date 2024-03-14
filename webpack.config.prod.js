import path from 'path';
import * as url from 'url';
import DashboardPlugin from "webpack-dashboard/plugin/index.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  entry: './src/js/index.js',
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'kompletr.min.js',
    library: {
      type: "module",
    },
  },
  plugins: [
    new DashboardPlugin()
  ],
  devtool: "source-map",
  mode: "production",
};
