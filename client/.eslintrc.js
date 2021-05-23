module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {
    "sort-imports": [
      "error",
      {
        "allowSeparatedGroups": true,
        "ignoreCase": true
      }
    ],
    "@typescript-eslint/no-empty-function": "off",
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
};
