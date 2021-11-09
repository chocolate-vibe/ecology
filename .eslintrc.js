module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    camelcase: 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'lines-between-class-members': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    "linebreak-style": 0,
    'max-len': 'off',
    'object-curly-newline': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    radix: 'off',
    'import/no-unresolved': 'off',
    'import/no-cycle': 'off'
  },
};
