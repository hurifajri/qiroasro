/** @type {import('prettier').Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/global.css',
  tailwindFunctions: ['clsx', 'cva', 'cn', 'tw'],
};

export default config;
