import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default [
  {
    mode: 'production',
    entry: './src/js/index.js',
    experiments: {
      outputModule: true,
    },
    output: {
      path: path.resolve(__dirname, 'dist/js'),
      filename: 'kompletr.min.js',
      library: {
        type: 'module',
      },
    },
  },
  {
    mode: 'production',
    entry: './src/js/index.js',
    experiments: {
      outputModule: true,
    },
    output: {
      path: path.resolve(__dirname, 'demo/js'),
      filename: 'kompletr.min.js',
      library: {
        type: 'module',
      },
    },
  }
];
