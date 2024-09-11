module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'public', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'react',
    '@typescript-eslint',
    'prettier'
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    "prettier/prettier": ["error"],
  },
}
