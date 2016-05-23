import { version as VERSION } from '../../../../package.json';

export default (name) => {
  return `
{
  "name": "${name}",
  "version": "0.0.1",
  "description": "",
  "main": "bin/app.js",
  "scripts": {
    "start": "lux serve",
    "test": "lux test"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "babel-core": "6.9.0",
    "babel-eslint": "6.0.4",
    "babel-plugin-transform-decorators-legacy": "1.3.4",
    "babel-plugin-transform-runtime": "6.9.0",
    "babel-preset-es2015": "6.9.0",
    "babel-preset-stage-1": "6.5.0",
    "babel-runtime": "6.9.0",
    "knex": "0.11.4",
    "lux-framework": "${VERSION}"
  }
}
  `.substr(1).trim();
};
