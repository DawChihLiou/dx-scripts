/**
 * See more about @typescript-eslint plugin: 
 * - https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin#usage
 *
 * See more about prettier configuration: 
 * - https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // allow require
    '@typescript-eslint/no-var-requires': 0,
  },
};
