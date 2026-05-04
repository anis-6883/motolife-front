/** @type {import("prettier").Config} */
const config = {
  printWidth: 140,
  singleQuote: false,
  semi: true,
  trailingComma: "es5",
  tabWidth: 2,
  useTabs: false,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
