import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  entry: './src/js/kompletr.js',
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
  devtool: "source-map",
  mode: "production",
};
