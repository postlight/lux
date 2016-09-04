// @flow
import { BACKSLASH } from '../../../constants';

/**
 * @private
 */
export default function normalizePath(source: string): string {
  return source.replace(BACKSLASH, '/');
}
