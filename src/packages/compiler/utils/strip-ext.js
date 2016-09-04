// @flow
const EXT_PATTERN = /\.js$/;

/**
 * @private
 */
export default function stripExt(source: string): string {
  return source.replace(EXT_PATTERN, '');
}
