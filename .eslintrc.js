const prettierRules = require('./.prettierrc.js');

const plugins = ['react', 'import', 'jsx-a11y', 'prettier'];

const rules = {
  'prettier/prettier': ['error', prettierRules],
  'no-var': 2,
  'one-var': 0,
  'no-console': 1,
  'babel/semi': 0,
  'prefer-const': 2,
  'react/prop-types': 0,
  'babel/no-invalid-this': 0,
  'jsx-a11y/label-has-for': 0,
  'jsx-a11y/no-autofocus': 'off',
  'jsx-a11y/iframe-has-title': 'off',
  'class-methods-use-this': 0,
  'newline-per-chained-call': 0,
  'arrow-body-style': ['error', 'as-needed'],
  'no-unused-vars': ['error', { ignoreRestSiblings: true }],
  'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
  'react/jsx-indent': 0,
  eqeqeq: 2,
  'guard-for-in': 1,
  'no-eval': 2,
  'no-implied-eval': 2,
  'no-loop-func': 2,
  'no-empty': 0,
  'no-control-regex': 0,
  'no-useless-return': 2,
  'max-lines': [2, { max: 300 }],
  'padding-line-between-statements': [
    2,
    // Always require blank lines after directive (like 'use-strict'), except between directives
    {
      blankLine: 'always',
      prev: 'directive',
      next: '*',
    },
    {
      blankLine: 'any',
      prev: 'directive',
      next: 'directive',
    },
    // Always require blank lines after import, except between imports
    {
      blankLine: 'always',
      prev: 'import',
      next: '*',
    },
    {
      blankLine: 'any',
      prev: 'import',
      next: 'import',
    },
    // Always require blank lines before and after every sequence of variable declarations and export
    {
      blankLine: 'always',
      prev: '*',
      next: ['const', 'let', 'var', 'export'],
    },
    {
      blankLine: 'always',
      prev: ['const', 'let', 'var', 'export'],
      next: '*',
    },
    {
      blankLine: 'any',
      prev: ['const', 'let', 'var', 'export'],
      next: ['const', 'let', 'var', 'export'],
    },
    // Always require blank lines before and after class declaration, if, do/while, switch, try
    {
      blankLine: 'always',
      prev: '*',
      next: ['if', 'class', 'for', 'do', 'while', 'switch', 'try'],
    },
    {
      blankLine: 'always',
      prev: ['if', 'class', 'for', 'do', 'while', 'switch', 'try'],
      next: '*',
    },
    // Always require blank lines before return statements
    {
      blankLine: 'always',
      prev: '*',
      next: 'return',
    },
  ],

  // airbnb
  'no-use-before-define': 1,
  'object-shorthand': 2,
  'quote-props': 0,
  'no-bitwise': 1,
  'prefer-template': 2,
  'spaced-comment': 2,
  'no-param-reassign': 1,
  'dot-notation': 2,
  'consistent-return': 1,
  curly: 2,
  'no-underscore-dangle': [
    1,
    {
      allowAfterThis: true,
      allowAfterSuper: true,
    },
  ],
  'no-restricted-globals': 1,
  'no-plusplus': 2,
  'default-case': 2,
  'prefer-destructuring': 2,
  'no-redeclare': 2,
  'vars-on-top': 2,
  'no-shadow': 1,
  radix: 2,
  'no-undef-init': 1,
  'no-unused-expressions': 1,
  'no-prototype-builtins': 1,
  'operator-assignment': 2,
  'no-useless-escape': 2,
  'prefer-spread': 2,
  'no-nested-ternary': 2,
  'no-restricted-syntax': 1,
  'no-multi-assign': 1,
  'no-unneeded-ternary': 1,
  'no-useless-constructor': 1,
  'no-empty-function': 1,
  'prefer-rest-params': 1,
  camelcase: 1,
  'no-restricted-properties': 1,
  'no-return-assign': 1,
  'new-cap': 1,
  'import/no-extraneous-dependencies': 1,
  'no-extend-native': 1,
  'prefer-promise-reject-errors': 1,
  'block-scoped-var': 1,
  'no-lonely-if': 1,
  'no-new': 1,
  'no-continue': 1,
  'no-void': 1,
  'array-callback-return': 2,
  'import/newline-after-import': 1,
  'import/extensions': [
    1,
    {
      '.js': 'never',
      '.jsx': 'never',
      '.json': 'always',
      '.ts': 'never',
      '.tsx': 'never',
    },
  ],
  'lines-around-directive': 1,
  strict: 1,
  'no-return-await': 1,
  'import/first': 1,
  'no-await-in-loop': 1,
  'no-path-concat': 1,
  'import/prefer-default-export': 0,
  'import/no-default-export': 1,

  // debated rules
  'operator-linebreak': 0,
  'implicit-arrow-linebreak': 0,
  'lines-between-class-members': 1,
  'no-else-return': 1,
  'import/no-useless-path-segments': 1,
  'import/no-cycle': 1,
};

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: true,
    },
    ecmaVersion: 6,
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    console: true,
  },
  extends: [
    'plugin:import/errors',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'prettier/react',
  ],
  plugins,
  rules,
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
