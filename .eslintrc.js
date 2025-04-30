module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'eslint-config-prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['prettier', 'react-hooks'],
  rules: {
    'no-console': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'brace-style': ['error', '1tbs'],
    'curly': 'error',
    'object-curly-spacing': ['error', 'always'],
    'prefer-const': 'error',
    'quote-props': ['error', 'consistent'],
    'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
