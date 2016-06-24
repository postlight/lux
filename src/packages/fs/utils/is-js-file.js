// @flow
const REGEXP = /^(?!\.).+\.js$/;

/**
 * @private
 */
export default function isJSFile(target: string): boolean {
  return REGEXP.test(target);
}
