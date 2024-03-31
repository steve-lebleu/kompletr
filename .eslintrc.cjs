module.exports = {
  'env': {
    'es6': true,
    'node': true,
    'browser': true
  },
  'extends': ['eslint:recommended', 'plugin:compat/recommended'],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};