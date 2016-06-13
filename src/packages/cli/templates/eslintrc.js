// @flow
import template from '../../template';

/**
 * @private
 */
export default (): string => template`
  {
    "env": {
      "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
      "after": true,
      "before": true,
      "describe": true,
      "it": true,
      "Map": true,
      "Promise": true,
      "Proxy": true,
      "Set": true,
      "Symbol": true,
      "WeakMap": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module"
    },
    "rules": {
      "no-unused-vars": 1
    }
  }
`;
