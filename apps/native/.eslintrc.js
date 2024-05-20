// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  extends: [
    "expo",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/method-signature-style": "error",
    "import/order": "off",
    "@typescript-eslint/no-unused-vars": "off"
  }
};
