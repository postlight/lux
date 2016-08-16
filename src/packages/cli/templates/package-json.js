// @flow
import { version, devDependencies } from '../../../../package.json';
import template from '../../template';

const LUX_VERSION: string = version;
const BABEL_PRESET_VERSION: string = devDependencies['babel-preset-lux'];

/**
 * @private
 */
export default (name: string): string => template`
  {
    "name": "${name}",
    "version": "0.0.1",
    "description": "",
    "scripts": {
      "start": "lux serve",
      "test": "lux test"
    },
    "author": "",
    "license": "MIT",
    "dependencies": {
      "babel-core": "6.9.1",
      "babel-preset-lux": "${BABEL_PRESET_VERSION}",
      "knex": "0.11.5",
      "lux-framework": "${LUX_VERSION}"
    },
    "engines": {
      "node": ">= 6.0"
    }
  }
`;
