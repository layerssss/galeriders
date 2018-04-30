var Path = require('path');

module.exports = {
  extends: ['airbnb', 'prettier'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'no-alert': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/forbid-prop-types': 0,
    'import/extensions': 0,
    'react/require-default-props': 0,
    'no-useless-escape': 0,
    'no-underscore-dangle': 0,
    'no-restricted-syntax': 0,
    'no-continue': 0,
    'no-await-in-loop': 0,
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'import/prefer-default-export': 0,
    'guard-for-in': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'react/no-multi-comp': 0,
  },
};
