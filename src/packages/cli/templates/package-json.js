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
    "lux-framework": "0.0.1-beta.7",
    "babel-core": "6.7.7",
    "babel-eslint": "6.0.3",
    "babel-plugin-transform-decorators-legacy": "1.3.4",
    "babel-plugin-transform-runtime": "6.7.5",
    "babel-preset-es2015": "6.6.0",
    "babel-preset-stage-1": "6.5.0",
    "babel-runtime": "6.6.1",
    "knex": "0.11.1"
  }
}
  `.substr(1).trim();
};
