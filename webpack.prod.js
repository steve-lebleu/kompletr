import path from 'path';
import * as url from 'url';

// eslint-disable-next-line compat/compat
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default [
  {
    mode: 'production',
    entry: './src/js/index.js',
    experiments: {
      outputModule: true,
    },
    optimization: {
      minimize: true
    },
    output: {
      path: path.resolve(__dirname, 'dist/js'),
      filename: 'kompletr.min.js',
      library: {
        type: 'module',
      },
    },
  }
];