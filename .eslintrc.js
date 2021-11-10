module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'airbnb-base',
    '@vue/typescript',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    camelcase: 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'lines-between-class-members': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'linebreak-style': 0,
    'max-len': 'off',
    'object-curly-newline': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    radix: 'off',
    'import/no-unresolved': 'off',
    'import/no-cycle': 'off',
    'import/extensions': 'off',

    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-spacing': ['error', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always',
    }],
  },
};
