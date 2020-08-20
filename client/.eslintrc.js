// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [],
  settings: {
    "react": {
      "version": "detect"
    }
  },
  rules: {
    // Because let define 'let' not 'const'
    'prefer-const': 'off',

    // Here is typescript
    "react/prop-types": 'off',

    // Use CamelCase
    "camelcase": ['error', {
      'properties':'always'
    }],

    // We should use preserverd functions
    "@typescript-eslint/no-empty-function": 'off',
    "@typescript-eslint/no-unused-vars" : [
      'warn',
      {argsIgnorePattern: '^_'}
    ],
  },
  overrides:[
    {
      "files":["src/reducers/**/*"],
      "rules":{
        // To prevent unexpected implicit structured type conversions on Reducer
        "@typescript-eslint/explicit-function-return-type": ["error",{
          "allowHigherOrderFunctions" : false,
          "allowTypedFunctionExpressions":false
        }],
      }
    },
    {
      "files":["src/actions/**/*"],
      "rules":{
        // To reduce the redux boilerplate on ActionCreators
        "@typescript-eslint/explicit-module-boundary-types": 'off',
      }
    }
  ]
}
