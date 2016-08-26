// @flow
import getParentKey from './get-parent-key';

/**
 * @private
 */
export default function stripNamespaces(source: string): string {
  return source.replace(`${getParentKey(source)}/`, '');
}
