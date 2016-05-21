// filter out hidden files && non .js files
export default function isJSFile(file) {
  return /^(?!\.).+\.js$/.test(file);
}
