// filter out hidden files && non .js files
export default function isJsFile(file) {
  return /^(?!\.).+\.js$/.test(file);
}
