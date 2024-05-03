/** @typedef {import('@trivago/prettier-plugin-sort-imports').PluginConfig} SortImportsConfig */
/** @typedef {import('prettier').Config} PrettierConfig */

/** @type {PrettierConfig | SortImportsConfig} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "<TYPES>",
    "<TYPES>^[./]",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^[./]"
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};

module.exports = config;
