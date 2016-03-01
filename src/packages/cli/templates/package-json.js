export default (name) => {
  return `
{
  "name": "${name}",
  "version": "0.0.1",
  "description": "",
  "main": "app/index.js",
  "scripts": {
    "start": "fw serve",
    "test": "fw test"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "framework": "^0.0.1"
  }
}
  `.substr(1).trim();
};
