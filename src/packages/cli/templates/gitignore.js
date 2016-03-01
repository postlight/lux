export default () => {
  return `
# See http://help.github.com/ignore-files/ for more about ignoring files.

# dependencies
/node_modules

# logs
/log
npm-debug.log

# misc
*.DS_Store
  `.substr(1).trim();
};
