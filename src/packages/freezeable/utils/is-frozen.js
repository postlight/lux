// @flow
import { FREEZER } from '../constants';

/**
 * @private
 */
export default function isFrozen(value: Object): boolean {
  return FREEZER.has(value);
}
