/* @flow */

const PATTERN = /^application\/vnd.api\+json;charset=.+$/;

/**
 * @private
 */
export default function hasMediaType(value: string): boolean {
  return PATTERN.test(value);
}
